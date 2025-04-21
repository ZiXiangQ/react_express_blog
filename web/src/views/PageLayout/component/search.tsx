/*
 * @Author: qiuzx
 * @Date: 2025-01-08 10:50:55
 * @LastEditors: qiuzx
 * @Description: 搜索模块
 */
import React, { useState, useRef } from 'react';
import { Typography, Input, Empty, Spin, List, Space, Dropdown } from 'antd';
import type { InputRef } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import Searchservice from '@/services/api/search';
import { searchResult } from '@/types/search';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedKeys } from '@/store/slices/menuSlice';
import './search.less';

const { Text } = Typography;
const { Search } = Input;

interface SearchResult {
  filename: string;
  project: string;
  route: string;
  full_path: string;
}

const SearchComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false)
  const searchRef = useRef<InputRef>(null);

  
  const handleSearch = async (keyword: string) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      setOpen(false); // 🔥 清空的时候关闭下拉
      return;
    }
    setLoading(true);
    setOpen(true);
    try {
      const response:searchResult = await Searchservice.search_files(keyword);
      if (response.code == 0) {
        setSearchResults(response.data);
      }
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    const menuPath = `/${result.project}`;
    const fullPath = `${menuPath}/file?path=${encodeURIComponent(result.full_path)}`;
    dispatch(setSelectedKeys({
      selectedKeys: [menuPath],
      openKeys: [result.project],
      currentPath: fullPath
    }));
    navigate(fullPath);
    if (searchRef.current) {
      searchRef.current.blur();
    }
  };

  const dropdownContent = (
    <div className="search-results">
      <Spin spinning={loading}>
        {searchResults.length > 0 ? (
          <List
            className="result-list"
            itemLayout="horizontal"
            dataSource={searchResults}
            renderItem={(item) => (
              <List.Item 
                className="result-item"
                onClick={() => handleResultClick(item)}
              >
                <Space align="start">
                  <FileTextOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
                  <div>
                    <Text strong>{item.filename}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      项目: {item.project}
                    </Text>
                  </div>
                </Space>
              </List.Item>
            )}
          />
        ) : (
          <Empty 
            description="未找到相关文档" 
            style={{ padding: '20px 0' }}
          />
        )}
      </Spin>
    </div>
  );

  return (
    <div className="search-wrapper">
      <Dropdown 
        overlay={dropdownContent} 
        trigger={['click']}
        open={open}
        overlayClassName="search-dropdown"
      >
        <Search
          ref={searchRef}
          placeholder="搜索文档..."
          allowClear
          size="middle"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </Dropdown>
    </div>
  );
};

export default SearchComponent;
