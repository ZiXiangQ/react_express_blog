import React, { useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import type { GetProp, MenuProps } from 'antd';
import { Dropdown, Layout, Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom'; // 导入 Outlet
import './index.less'; // 导入 Less 样式
import ProjectService from '@/services/api/project';
import { projectItem, projectList } from '@/types/project';

const PageLayout: React.FC = () => {
  const { Header, Content, Footer } = Layout;
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const [projectsList, setProjectsList] = useState<projectItem[]>([]);
  const [projectItems, setProjcetsItems] = useState<MenuItem[]>([]);
  type MenuItem = GetProp<MenuProps, 'items'>[number];

  // 获取用户信息
  useEffect(() => {
    const storeUsername = localStorage.getItem('username');
    if (storeUsername) {
      setUsername(storeUsername);
    }
  }, []);

  // 获取项目列表
  useEffect(() => {
    ProjectService.get_all_projects().then((rsp: projectList) => {
      console.log('rsp', rsp);
      if (rsp.code == 0) {
        setProjectsList(rsp.data);
        setLoading(false);  // 数据加载完成，设置加载状态为 false
      }
    });
  }, []);


  // 退出登录处理
  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/login');
  };

  // 用户管理页面
  const handleUserManagement = () => {
    navigate('/userHandle');
  };

  useEffect(() => {
    if (!loading && projectsList.length > 0) {
      const projectItems: MenuItem[] = !loading && projectsList.length > 0
        ? projectsList.map(route => ({
          key: route.project_key || '',
          label: route.project_name,
          type: 'item',
        }))
        : [{ key: 'loading', label: '加载中...', type: 'item' }];
      setProjcetsItems(projectItems);
    }
  }, [loading, projectsList]);

  // 顶部导航菜单点击事件
  const handleMenuClick = ({ key }: { key: string }) => {
    const selectedRoute = projectsList.find(route => route.project_key === key);
    if (selectedRoute) {
      navigate(`/project/${selectedRoute.project_key}`); // 跳转到对应的项目页面
    }
  };

  // 用户操作菜单
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
    <Layout className="layout">
      <Header className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="demo-logo" />
        <span className="title">Ant Design Pro</span>
        {/* 动态生成顶部导航栏 */}
        <Menu
          mode="horizontal"
          onClick={handleMenuClick}
          items={projectItems}
        />
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <Dropdown overlay={menu}>
            <div className="hoverable" style={{ cursor: 'pointer', padding: '10px 0 0 10px' }}>
              <UserOutlined style={{ fontSize: '20px', margin: '0 10px', color: '#000' }} />
              <span style={{ margin: '0 10px 0 0' }}>{username || "游客"}</span>
            </div>
          </Dropdown>
        </div>
      </Header>

      <Content className="content" style={{ marginTop: '10px' }}>
        <Outlet /> {/* 渲染子路由的内容 */}
      </Content>

      <Footer className="footer">
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default PageLayout;
