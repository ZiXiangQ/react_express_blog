/*
 * @Author: qiuzx
 * @Date: 2025-01-08 10:50:55
 * @LastEditors: qiuzx
 * @Description: description
 */
import React, { useState } from 'react';
import { Typography, Input, Empty, Spin, List, Space } from 'antd';
import { SearchOutlined, FileTextOutlined } from '@ant-design/icons';
import { useTheme } from '@/contexts/ThemeContext';
import './index.less';
import Searchservice from '@/services/api/search';
import { searchResult } from '@/types/search';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedKeys } from '@/store/slices/menuSlice';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;

interface SearchResult {
  filename: string;
  project: string;
  route: string;
  full_path: string;
}

const Home = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);

  const handleSearch = async (keyword: string) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    try {
      const response:searchResult = await Searchservice.search_files(keyword);
      if (response.code == 0) {
        setSearchResults(response.data);
        setSearchVisible(true);
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
  };

  return (
    <div className={`home-container ${theme}`}>
      <div className="search-section">
        <Title level={2}>欢迎访问知识文档</Title>
        <Paragraph style={{ fontSize: '18px', maxWidth: '600px', margin: '20px auto' }}>
          这里是我们的知识文档中心。您可以在这里找到各种技术文档、使用指南和常见问题解答，帮助您更好地理解和使用我们的产品。
        </Paragraph>
        
        <div className="search-box">
          <Search
            placeholder="搜索文档..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            style={{ maxWidth: '600px', width: '100%' }}
          />
        </div>

        {searchVisible && (
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
                        <FileTextOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
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
                  style={{ padding: '40px 0' }}
                />
              )}
            </Spin>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
