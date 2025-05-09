/*
 * @Author: qiuzx
 * @Date: 2025-01-08 10:50:55
 * @LastEditors: qiuzx
 * @Description: description
 */
import React, { useState, useRef } from "react";
import { Card, Input, Typography, Row, Col, Button, Space, Dropdown, List, Spin, Empty, Divider } from "antd";
import {
  SearchOutlined,
  BookOutlined,
  ClockCircleOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedKeys } from '@/store/slices/menuSlice';
import Searchservice from '@/services/api/search';
import { searchResult, searchResultItem } from '@/types/search';
import FileIcon from '@/component/fileIcon';
import { useTheme } from '@/contexts/ThemeContext';
import "./index.less";

const { Title, Text } = Typography;
const { Search } = Input;

export default function KnowledgeBaseHome() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchResults, setSearchResults] = useState<searchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const searchRef = useRef<any>(null);

  const handleSearch = async (keyword: string) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    setOpen(true);
    try {
      const response: searchResult = await Searchservice.search_files(keyword);
      if (response.code == 0) {
        setSearchResults(response.data);
      }
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result: searchResultItem) => {
    const menuPath = `/${result.project}`;
    const fullPath = `${menuPath}/file?path=${encodeURIComponent(result.full_path)}`;
    dispatch(setSelectedKeys({
      selectedKeys: [menuPath],
      openKeys: [result.project],
      currentPath: fullPath,
      triggeredBySearch: true,// 是否由搜索触发
    }));
    navigate(fullPath);
    if (searchRef.current) {
      searchRef.current.blur();
    }
  };

  const dropdownContent = (
    <div className={`search-results ${isDark ? 'dark' : ''}`}>
      <Spin spinning={loading}>
        {searchResults.length > 0 ? (
          <List
            className="result-list"
            itemLayout="horizontal"
            dataSource={searchResults}
            renderItem={(item) => (
              <List.Item 
                className={`result-item ${isDark ? 'dark' : ''}`}
                onClick={() => handleResultClick(item)}
              >
                <Space align="start">
                  <FileIcon type={item.type || ''} />
                  <div>
                    <Text style={{fontSize:'12px'}} strong>{item.filename}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      项目: {item.project}
                    </Text>
                    <Divider type="vertical" />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      更新时间: {item.update_time}
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
    <div className="kb-home-wrapper">
      <div className="kb-container">
        {/* 欢迎信息与搜索栏 */}
        <Card className="kb-welcome-card">
          <Title level={2} className="kb-welcome-title">
            🎓 欢迎访问知识文档
          </Title>
          <Text className="kb-welcome-description">
            这里是我们的知识文档中心。您可以在这里找到各种技术文档、使用指南和常见问题解答，帮助您更好地理解和使用我们的产品。
          </Text>
          <div className="kb-search-wrapper">
            <Dropdown 
              overlay={dropdownContent} 
              trigger={['click']}
              open={open}
              overlayClassName="search-dropdown"
            >
              <Search
                ref={searchRef}
                size="large"
                placeholder="搜索文档..."
                prefix={<SearchOutlined />}
                className="kb-search-input"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Dropdown>
          </div>
        </Card>

        {/* 内容区域 */}
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card className="kb-section-card kb-border-blue">
              <Title level={4} className="kb-section-title kb-text-blue">
                <BookOutlined className="kb-icon" />推荐文档
              </Title>
              <Space direction="vertical" className="kb-button-group">
                <Button type="link" className="kb-link-button">
                  🚀 如何快速上手本系统
                </Button>
                <Button type="link" className="kb-link-button">
                  📚 产品使用指南合集
                </Button>
                <Button type="link" className="kb-link-button">
                  🔧 常见问题汇总
                </Button>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card className="kb-section-card kb-border-green">
              <Title level={4} className="kb-section-title kb-text-green">
                <ClockCircleOutlined className="kb-icon" /> 最近更新
              </Title>
              <ul className="kb-update-list">
                <li>📅 2025-04-25 - 新增 XMind 导入功能文档</li>
                <li>📅 2025-04-20 - 更新 数据同步机制说明</li>
                <li>📅 2025-04-15 - 修复 FAQ 文档中的错误</li>
              </ul>
            </Card>
          </Col>
          
          <Col span={24}>
            <Card className="kb-section-card kb-border-purple">
              <Title level={4} className="kb-section-title kb-text-purple">
                <RocketOutlined className="kb-icon" /> 快速上手
              </Title>
              <Text className="kb-quickstart-description">
                如果您是第一次使用，建议您从以下文档开始：
              </Text>
              <Space direction="horizontal" size="middle">
                <Button type="primary" shape="round" size="large">
                  使用流程概览
                </Button>
                <Button type="default" shape="round" size="large">
                  新手指南
                </Button>
                <Button type="default" shape="round" size="large">
                  常见问题
                </Button>
              </Space>
            </Card>
          </Col> 
        </Row>
      </div>
    </div>
  );
}
