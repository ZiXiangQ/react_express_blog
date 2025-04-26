/*
 * @Author: qiuzx
 * @Date: 2025-01-08 10:50:55
 * @LastEditors: qiuzx
 * @Description: description
 */
import React from "react";
import { Card, Input, Typography, Row, Col, Button, Space } from "antd";
import {
  SearchOutlined,
  BookOutlined,
  ClockCircleOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import "./index.less";

const { Title, Text } = Typography;

export default function KnowledgeBaseHome() {
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
            <Input
              size="large"
              placeholder="搜索文档..."
              prefix={<SearchOutlined />}
              className="kb-search-input"
            />
          </div>
        </Card>

        {/* 内容区域 */}
        <Row gutter={[24, 24]}>
          {/* 推荐文档 */}
          <Col xs={24} md={12}>
            <Card className="kb-section-card kb-border-blue">
              <Title level={4} className="kb-section-title kb-text-blue">
                <BookOutlined className="kb-icon" /> 推荐文档
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

          {/* 最近更新 */}
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

          {/* 快速上手 */}
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
