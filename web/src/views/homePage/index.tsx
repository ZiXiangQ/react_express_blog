import React from 'react';
import { Typography, Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Home = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <Title level={2}>欢迎访问知识文档</Title>
      <Paragraph style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
        这里是我们的知识文档中心。您可以在这里找到各种技术文档、使用指南和常见问题解答，帮助您更好地理解和使用我们的产品。
      </Paragraph>
      <Button type="primary" size="large" style={{ marginTop: '20px' }}>
        开始浏览 <RightOutlined />
      </Button>
    </div>
  );
};

export default Home;
