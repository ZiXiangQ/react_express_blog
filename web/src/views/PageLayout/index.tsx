import React, { useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Layout, Menu, Tooltip } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom'; // 导入 Outlet
import './index.less'; // 导入 Less 样式

const { Header, Content, Footer } = Layout;

const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
  key,
  label: `nav ${key}`,
}));

// const items2: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
//   (icon, index) => {
//     const key = String(index + 1);

//     return {
//       key: `sub${key}`,
//       icon: React.createElement(icon),
//       label: `subnav ${key}`,

//       children: new Array(4).fill(null).map((_, j) => {
//         const subKey = index * 4 + j + 1;
//         return {
//           key: subKey,
//           label: `option${subKey}`,
//         };
//       }),
//     };
//   },
// );

const PageLayout: React.FC = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const storeUsername = localStorage.getItem('username');
    if (storeUsername) {
      setUsername(storeUsername);
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('username'); // 清除 username
    navigate('/login'); // 跳转到登录页
  };

  const handleUserManagement = () => {
    navigate('/userHandle'); // 跳转到用户管理页面
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleUserManagement}>
        用户管理
      </Menu.Item>
      <Menu.Item key="2" onClick={handleLogout}>
        登出
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className="layout"> {/* 添加 layout 类 */}
      <Header className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="demo-logo" />
        <span className="title">Ant Design Pro</span>
        <Menu
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items1}
          style={{ flexGrow: 1, justifyContent: 'center' }} // 新增样式
        />
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        <Dropdown overlay={menu} trigger={['click']}>
          <Tooltip title="Click to logout and userhandle" placement="bottom"> {/* 添加 Tooltip 组件 */}
            <div className="hoverable" style={{ cursor: 'pointer', padding: '10px 0 0 10px' }}>
              <UserOutlined style={{ fontSize: '20px', margin: '0 10px', color: '#000' }} />
              <span style={{ margin: '0 10px 0 0' }}>{username || "游客"}</span> {/* 如果 username 为空，则显示 "游客" */}
            </div>
          </Tooltip>
        </Dropdown>
        </div>
      </Header>
      <Content className="content" style={{ marginTop: '10' }}>
        <Outlet /> {/* 渲染子路由的内容 */}
      </Content>
      <Footer className="footer">
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default PageLayout;
