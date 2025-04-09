/*
 * @Author: qiuzx
 * @Date: 2025-01-08 10:50:55
 * @LastEditors: qiuzx
 * @Description: description
 */
import React, { useEffect } from 'react';
import { Typography, Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import './index.less';
// import FlowDiagram from './systemNetMap';

const { Title, Paragraph } = Typography;

const Home = () => {

  useEffect(() => {
    calcuFunc();
    return () => {
    };
  }, []);

  const calcuFunc = () => {
    const elements = [[1, 3], [2, 6], [8, 10], [15, 18]];
    elements.sort((p, q) => p[0] - q[0]); // 按照左端点从小到大排序
    const ans = [];
    for (const p of elements) {
      const m = ans.length;
      if (m && p[0] <= ans[m - 1][1]) { // 可以合并
        ans[m - 1][1] = Math.max(ans[m - 1][1], p[1]); // 更新右端点最大值
      } else { // 不相交，无法合并
        ans.push(p); // 新的合并区间
      }
    }
    console.log(ans);
  };
  

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <Title level={2}>欢迎访问知识文档</Title>
      <Paragraph style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
        这里是我们的知识文档中心。您可以在这里找到各种技术文档、使用指南和常见问题解答，帮助您更好地理解和使用我们的产品。
      </Paragraph>
      <Button type="primary" size="large" style={{ marginTop: '20px' }}>
        开始浏览 <RightOutlined />
      </Button>
      {/* <FlowDiagram></FlowDiagram> */}
    </div>
  );
};

export default Home;
