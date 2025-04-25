import React from "react";
import { Card, Input, Typography, Row, Col, Button, Space } from "antd";
import { SearchOutlined, BookOutlined, ClockCircleOutlined, RocketOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function KnowledgeBaseHome() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* 欢迎信息与搜索栏 */}
        <Card className="mb-6 shadow-lg rounded-2xl p-8 bg-white text-center">
          <Title level={2}>欢迎访问知识文档</Title>
          <Text className="text-gray-500">
            这里是我们的知识文档中心。您可以在这里找到各种技术文档、使用指南和常见问题解答，帮助您更好地理解和使用我们的产品。
          </Text>
          <div className="mt-6 max-w-xl mx-auto">
            <Input size="large" placeholder="搜索文档..." prefix={<SearchOutlined />} className="rounded-full" />
          </div>
        </Card>

        {/* 内容区域 */}
        <Row gutter={[24, 24]}>
          {/* 推荐文档 */}
          <Col xs={24} md={12}>
            <Card className="shadow-md rounded-2xl p-6 hover:shadow-xl transition duration-300">
              <Title level={4}><BookOutlined className="mr-2" />推荐文档</Title>
              <Space direction="vertical" className="mt-4 w-full">
                <Button type="link" className="text-left">🚀 如何快速上手本系统</Button>
                <Button type="link" className="text-left">📚 产品使用指南合集</Button>
                <Button type="link" className="text-left">🔧 常见问题汇总</Button>
              </Space>
            </Card>
          </Col>

          {/* 最近更新 */}
          <Col xs={24} md={12}>
            <Card className="shadow-md rounded-2xl p-6 hover:shadow-xl transition duration-300">
              <Title level={4}><ClockCircleOutlined className="mr-2" />最近更新</Title>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li>2025-04-25 - 新增 XMind 导入功能文档</li>
                <li>2025-04-20 - 更新 数据同步机制说明</li>
                <li>2025-04-15 - 修复 FAQ 文档中的错误</li>
              </ul>
            </Card>
          </Col>

          {/* 快速上手 */}
          <Col span={24}>
            <Card className="shadow-md rounded-2xl p-6 mt-4 hover:shadow-xl transition duration-300">
              <Title level={4}><RocketOutlined className="mr-2" />快速上手</Title>
              <Text className="block mb-2 text-gray-500">
                如果您是第一次使用，建议您从以下文档开始：
              </Text>
              <Space direction="horizontal" size="large">
                <Button type="primary" shape="round">使用流程概览</Button>
                <Button type="default" shape="round">新手指南</Button>
                <Button type="default" shape="round">常见问题</Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
