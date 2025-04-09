import React, { useEffect, useRef, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import type { GetProp, MenuProps } from 'antd';
import { Dropdown, Layout, Menu, message } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom'; // 导入 Outlet
import ProjectService from '@/services/api/project';
import { childProjectItem, folderKey, projectItem, projectList } from '@/types/project';
import LeftMenu from './component/leftMenu';
import './index.less';

const PageLayout: React.FC = () => {
  const { Header, Content, Footer } = Layout;
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const [projectsList, setProjectsList] = useState<projectItem[]>([]);
  const [projectItems, setProjcetsItems] = useState<MenuItem[]>([]);
  const [leftMenuData, setLeftMenuData] = useState<folderKey>();
  const [currentKey, setCurrentKey] = useState<string>('home'); // 当前选中的导航项
  const projectKey = useRef<string>("");
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
      if (rsp.code == 0) {
        setProjectsList(rsp.data);
        setLoading(false);  // 数据加载完成，设置加载状态为 false
      }
    });
  }, []);

  const get_children_tree = (currentKey: string) => {
    ProjectService.get_children_tree({ "project_key": currentKey }).then((rsp: childProjectItem) => {
      if (rsp.code == 0) {
        setLeftMenuData(rsp.data);
      } else {
        message.error(rsp.message);
      }
    })
  }

  // 顶部导航菜单点击事件
  const handleMenuClick = ({ key }: { key: string }) => {
    const selectedRoute = projectItems.find(route => route?.key === key);
    setCurrentKey(key);
    if (selectedRoute) {
      projectKey.current = key;
      if (key == 'home') {
        navigate('/home'); // 跳转到首页
      } else {
        get_children_tree(key)
        navigate(`/${selectedRoute.key}`); // 跳转到对应的项目页面
      }
    }
  };

  // 退出登录处理
  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/login');
  };

  // 用户管理页面
  const handleUserManagement = () => {
    navigate('/userHandle');
  };

  // 系统设置页面
  const handleSetting = () => {
    navigate('/setting');
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
      projectItems.unshift({ key: 'home', label: '首页', type: 'item' });
      setProjcetsItems(projectItems);
    }
  }, [loading, projectsList]);

  // 用户操作菜单
  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleUserManagement}>
        用户管理
      </Menu.Item>
      <Menu.Item key="2" onClick={handleSetting}>
        系统设置
      </Menu.Item>
      <Menu.Item key="3" onClick={handleLogout}>
        登出
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className="layout">

      <Header className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="demo-logo" />
        <span className="title">知识库</span>
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
      <Layout className="main-layout">
        {currentKey !== 'home' && leftMenuData && (
          <LeftMenu data={leftMenuData} projectKey={projectKey.current} />
        )}
        <Layout>
          <Content className="content" style={{ padding: '12px', marginTop: '10px' }}>
            <Outlet key={location.pathname} /> {/* 渲染子路由的内容 key用来解决刷新页面后，子路由内容不更新的问题 */}
          </Content>
        </Layout>
      </Layout>
      <Footer className="footer">
        Ant Design ©{new Date().getFullYear()} Created by PkaQ
      </Footer>
    </Layout>
  );
};

export default PageLayout;
