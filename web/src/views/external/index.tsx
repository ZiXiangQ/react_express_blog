/*
 * @Author: qiuzx
 * @Date: 2025-04-30 10:09:48
 * @LastEditors: qiuzx
 * @Description: description
 */
//展示一些嵌入的网页
import React, { useState } from 'react';
import { Card, Input, Button, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import './index.less';

interface ExternalLink {
  id: string;
  title: string;
  url: string;
  description: string;
}

const ExternalPage: React.FC = () => {
  const [links, setLinks] = useState<ExternalLink[]>([
    {
      id: '1',
      title: 'Tailwind CSS',
      url: 'https://tailwindcss.com',
      description: '一个功能类优先的 CSS 框架，它集成了诸如 flex, pt-4, text-center 和 rotate-90 这样的的类，它们能直接在脚本标记语言中组合起来，构建出任何设计。'
    }
  ]);

  const [newLink, setNewLink] = useState<Partial<ExternalLink>>({
    title: '',
    url: '',
    description: ''
  });

  const handleAddLink = () => {
    if (!newLink.title || !newLink.url) {
      message.error('请填写标题和URL');
      return;
    }

    const link: ExternalLink = {
      id: Date.now().toString(),
      title: newLink.title,
      url: newLink.url,
      description: newLink.description || ''
    };

    setLinks([...links, link]);
    setNewLink({ title: '', url: '', description: '' });
    message.success('添加成功');
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
    message.success('删除成功');
  };

  return (
    <div className="external-page">
      <div className="external-header">
        <h1>外部资源</h1>
        <p>收集和展示有用的外部网站和资源</p>
      </div>
      <div className="addForm">
        <Input
          placeholder="标题"
          value={newLink.title}
          onChange={e => setNewLink({ ...newLink, title: e.target.value })}
          className="input"
        />
        <Input
          placeholder="URL"
          value={newLink.url}
          onChange={e => setNewLink({ ...newLink, url: e.target.value })}
          className="input"
        />
        <Input.TextArea
          placeholder="描述"
          value={newLink.description}
          onChange={e => setNewLink({ ...newLink, description: e.target.value })}
          className="input"
        />
        <Button type="primary" onClick={handleAddLink} icon={<PlusOutlined />}>
          添加
        </Button>
      </div>

      <div className="cardGrid">
        {links.map(link => (
          <Card
            key={link.id}
            className="card"
            title={link.title}
            extra={
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteLink(link.id)}
              />
            }
          >
            <p className="description">{link.description}</p>
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="link">
              访问网站
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExternalPage;
