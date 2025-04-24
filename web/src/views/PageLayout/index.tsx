import React, { useEffect, useRef, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import type { GetProp, MenuProps } from 'antd';
import { Divider, Dropdown, Layout, Menu, message, Switch } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import ProjectService from '@/services/api/project';
import { childProjectItem, folderKey, projectItem, projectList, FileTree, fileKey } from '@/types/project';
import { useTheme } from '@/contexts/ThemeContext';
import './index.less';
import logo from '@/assets/logo.svg';
import { useAppSelector } from '@/store/hooks';
import { useDispatch } from 'react-redux';
import { setSelectedKeys } from '@/store/slices/menuSlice';
import LeftMenu from './component/leftMenu';
import SearchComponent from './component/search';

const PageLayout: React.FC = () => {
  const getCurrentProjectKey = () => {
    const pathSegments = decodeURIComponent(location.pathname).split('/');
    return pathSegments[1] === 'home' ? 'home' : pathSegments[1];
  };
  const { Header, Content } = Layout;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const [projectsList, setProjectsList] = useState<projectItem[]>([]);
  const [projectItems, setProjcetsItems] = useState<MenuItem[]>([]);
  const [leftMenuData, setLeftMenuData] = useState<FileTree>([]);
  const [currentKey, setCurrentKey] = useState<string>(getCurrentProjectKey()); // 从 URL 获取初始值
  const projectKey = useRef<string>("");
  type MenuItem = GetProp<MenuProps, 'items'>[number];
  const { selectedKeys: reduxSelectedKeys, openKeys: reduxOpenKeys, triggeredBySearch: reduxTriggeredBySearch } = useAppSelector(state => state.menu);

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
    const currentProjectKey = getCurrentProjectKey();  // 先不删除，重复请求问题，防止隐藏bug
    if (currentProjectKey !== 'home' && projectItems.some(item => item?.key === currentProjectKey)) {
      get_children_tree(currentProjectKey);
    }
    projectKey.current = currentProjectKey;
    setCurrentKey(currentProjectKey);// 设置当前项目key
  }, [loading, projectsList, location.pathname]);

  useEffect(() => {
    if (leftMenuData && leftMenuData.length > 0) {
      console.log(reduxTriggeredBySearch);
      if (reduxTriggeredBySearch) {
        return;
      }

      const firstFile = getFirstFile(leftMenuData[0]);
      if (firstFile) {
        const fullPath = `${projectKey.current}/file?path=${encodeURIComponent(firstFile)}`;
        dispatch(setSelectedKeys({
          selectedKeys: [`/${projectKey.current}`],
          openKeys: [projectKey.current],
          currentPath: fullPath,
          triggeredBySearch: false,
        }));
        navigate(fullPath);
      }
    }
  }, [leftMenuData]);

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

  const getFirstFile = (item: fileKey): string | null => {
    if (item.type !== 'folder') {
      return item.path;
    } else {
      for (const child of item.children || []) {
        const result = getFirstFile(child);
        if (result) {
          return result;
        }
      }
      return null;
    }
  }

  const handleMenuClick = ({ key }: { key: string }) => {
    const selectedRoute = projectItems.find(route => route?.key === key);
    setCurrentKey(key);
    if (selectedRoute) {
      projectKey.current = key;
      if (key == 'home') {
        navigate('/home'); // 跳转到首页
      } else {
        get_children_tree(key); // 更新左侧菜单的文件树
      }
    }
  };

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

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

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
          <SearchComponent />
        </div>
        <div className="header-center">
          <Menu
            theme={theme}
            mode="horizontal"
            selectedKeys={[currentKey]}
            items={projectItems}
            onClick={handleMenuClick}
            style={{ height: '49px' }}
          />
        </div>
        <div className="header-right">
          <div className="theme-switch">
          <Switch
            checked={theme === 'dark'}
            onChange={handleThemeChange}
            checkedChildren="深色"
            unCheckedChildren="浅色"
          />
          </div>
          <Divider type="vertical" />
          <Dropdown overlay={menu} placement="bottomRight" >
            <div className="user-info-trigger hoverable">
              <UserOutlined className="user-icon" />
              <span className="user-name">{username || "游客"}</span>
            </div>
          </Dropdown>
        </div>
      </Header>
      <Layout className="main-layout">
        { projectItems.some(item => item?.key === currentKey) && currentKey !== 'home' && leftMenuData && (
          <LeftMenu
            data={Array.isArray(leftMenuData) ? leftMenuData : transformData(leftMenuData)}
            projectKey={projectKey.current} />
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
