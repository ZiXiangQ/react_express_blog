import React, { useEffect, useRef, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import type { GetProp, MenuProps } from 'antd';
import { Dropdown, Layout, Menu, message } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import ProjectService from '@/services/api/project';
import { childProjectItem, folderKey, projectItem, projectList, FileTree } from '@/types/project';
import LeftMenu from './component/leftMenu';
import { useTheme } from '@/contexts/ThemeContext';
import './index.less';
import logo from '@/assets/logo.svg';
import { useAppSelector } from '@/store/hooks';

const PageLayout: React.FC = () => {
  const getCurrentProjectKey = () => {
    const pathSegments = decodeURIComponent(location.pathname).split('/');
    return pathSegments[1] === 'home' ? 'home' : pathSegments[1];
  };
  const { Header, Content } = Layout;
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const [loading, setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const [projectsList, setProjectsList] = useState<projectItem[]>([]);
  const [projectItems, setProjcetsItems] = useState<MenuItem[]>([]);
  const [leftMenuData, setLeftMenuData] = useState<FileTree | folderKey>();
  const [currentKey, setCurrentKey] = useState<string>(getCurrentProjectKey()); // 从 URL 获取初始值
  const projectKey = useRef<string>("");
  type MenuItem = GetProp<MenuProps, 'items'>[number];

  const { selectedKeys: reduxSelectedKeys, openKeys: reduxOpenKeys } = useAppSelector(state => state.menu);

  // 获取用户信息
  useEffect(() => {
    const storeUsername = localStorage.getItem('username');
    if (storeUsername) {
      setUsername(storeUsername);
    }
  }, []);

  useEffect(() => {
    if (reduxSelectedKeys) {
      setCurrentKey(reduxOpenKeys[0]);
    }
  }, [reduxSelectedKeys, reduxOpenKeys])

  // 获取项目列表
  useEffect(() => {
    ProjectService.get_all_projects().then((rsp: projectList) => {
      if (rsp.code == 0) {
        setProjectsList(rsp.data);
        setLoading(false);  // 数据加载完成，设置加载状态为 false
      }
    });
  }, []);

  // 转换数据格式
  const transformData = (data: folderKey | FileTree): FileTree => {
    if (Array.isArray(data)) {
      return data as FileTree;
    }
    // 如果是对象形式的数据，转换为数组形式
    return Object.keys(data).map(key => {
      return {
        name: key,
        path: `folder_${key}`,
        type: 'folder',
        children: data[key]
      };
    });
  };

  const get_children_tree = (currentKey: string) => {
    ProjectService.get_children_tree({ "project_key": currentKey }).then((rsp: childProjectItem) => {
      if (rsp.code == 0) {
        const responseData = rsp.data;
        const transformedData = transformData(responseData);
        setLeftMenuData(transformedData);
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
    const currentProjectKey = getCurrentProjectKey();
    if (currentProjectKey !== 'home') {
      projectKey.current = currentProjectKey;
      get_children_tree(currentProjectKey);
    }
  }, [loading, projectsList, location.pathname]);

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
    <Layout className={`layout ${theme}`}>
      <Header className="header">
        <div className="header-left">
          <div className="logo-container">
            <img src={logo} alt="logo" className="logo" />
          </div>
          <span className="title">知识库</span>
        </div>
        <Menu
          theme={theme}
          mode="horizontal"
          selectedKeys={[currentKey]}
          items={projectItems}
          onClick={handleMenuClick}
          style={{ width: '80%' }}
        />
        <div className="header-right">
          <Dropdown overlay={menu} placement="bottomRight">
            <div className="user-info-trigger hoverable">
              <UserOutlined className="user-icon" />
              <span className="user-name">{username || "游客"}</span>
            </div>
          </Dropdown>
        </div>
      </Header>
      <Layout className="main-layout">
        {currentKey !== 'home' && leftMenuData && (
          <LeftMenu data={Array.isArray(leftMenuData) ? leftMenuData : transformData(leftMenuData)} projectKey={projectKey.current} />
        )}
        <Layout>
          <Content className="content">
            <Outlet key={location.pathname} />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default PageLayout;
