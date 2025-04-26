import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import type { GetProp, MenuProps } from 'antd';
import { Divider, Dropdown, Layout, Menu, message } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import ProjectService from '@/services/api/project';
import { childProjectItem, folderKey, projectItem, projectList, FileTree, fileKey } from '@/types/project';
import { useTheme } from '@/contexts/ThemeContext';
import './index.less';
import logo from '@/assets/logopika.svg';
import { useAppSelector } from '@/store/hooks';
import { useDispatch } from 'react-redux';
import { setSelectedKeys } from '@/store/slices/menuSlice';
import LeftMenu from './component/leftMenu';
import SearchComponent from './component/search';

const PageLayout: React.FC = () => {
  const { Header, Content } = Layout;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const [projectsList, setProjectsList] = useState<projectItem[]>([]);
  const [leftMenuData, setLeftMenuData] = useState<FileTree>([]);
  type MenuItem = GetProp<MenuProps, 'items'>[number];
  const { selectedKeys: reduxSelectedKeys, openKeys: reduxOpenKeys, triggeredBySearch: reduxTriggeredBySearch } = useAppSelector(state => state.menu);

  const getCurrentProjectKey = () => {
    const pathSegments = decodeURIComponent(location.pathname).split('/');
    return pathSegments[1] === 'home' ? 'home' : pathSegments[1];
  };
  const [currentKey, setCurrentKey] = useState<string>(getCurrentProjectKey()); // 从 URL 获取初始值
  const projectKey = useRef<string>("");

  // 从项目列表生成 MenuItems
  const projectMenuItems = useMemo(() => {
    const items = projectsList.map(project => ({
      key: project.project_key,
      label: project.project_name,
      type: 'item',
    }));
    items.unshift({ key: 'home', label: '首页', type: 'item' });
    return items;
  }, [projectsList]);

  useEffect(() => { //初始化用户信息
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

  useEffect(() => { //初始化项目列表
    ProjectService.get_all_projects().then((rsp: projectList) => {
      if (rsp.code == 0) {
        setProjectsList(rsp.data);
        setLoading(false);  // 数据加载完成，设置加载状态为 false
      }
    });
  }, []);

  useEffect(() => {
    const currentProjectKey = getCurrentProjectKey();  // 先不删除，重复请求问题，防止隐藏bug
    if (!loading && projectsList.some(p => p.project_key === currentProjectKey)) {
      setCurrentKey(currentProjectKey);
      projectKey.current = currentProjectKey;
      if (currentProjectKey !== 'home') get_children_tree(currentProjectKey);
    }
  }, [loading, projectsList, location.pathname]);


  const get_children_tree = (currentKey: string) => {
    ProjectService.get_children_tree({ "project_key": currentKey }).then((rsp: childProjectItem) => {
      if (rsp.code == 0) {
        setLeftMenuData(transformData(rsp.data));
      } else {
        message.error(rsp.message);
      }
    })
  }

  useEffect(() => {
    if (leftMenuData && leftMenuData.length > 0) {
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

  const transformData = (data: folderKey | FileTree): FileTree => {  // 转换数据格式
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

  const getFirstFile = (item: fileKey): string | null => { // 获取第一个文件
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
    const selectedRoute = projectMenuItems.find(route => route?.key === key);
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

  const handleThemeChange = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // 用户操作菜单
  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => navigate('/userHandle')}>用户管理</Menu.Item>
      <Menu.Item key="2" onClick={() => navigate('/setting')}>系统设置</Menu.Item>
      <Menu.Item key="3" onClick={() => {
        localStorage.removeItem('username');
        navigate('/login');
        message.success('登出成功');
        //关闭侧边栏
        dispatch(setSelectedKeys({
          selectedKeys: [],
          openKeys: [],
          currentPath: '',
          triggeredBySearch: false,
        }));
      }}>登出</Menu.Item>
    </Menu>
  );

  return (
    <Layout className={`layout ${theme}`}>
      <Header className="header">
        <div className="header-left">
          <div className="logo-container">
            <img src={logo} alt="logo" className="logo" />
          </div>
          <span className="title">文渊阁</span>
          <SearchComponent />
        </div>
        <div className="header-center">
          <Menu
            theme={theme}
            mode="horizontal"
            selectedKeys={[currentKey]}
            items={projectMenuItems as MenuItem[]}
            onClick={handleMenuClick}
            style={{ height: '49px', width: "50%" }}
          />
        </div>
        <div className="header-right">
          <div className="theme-switch">
            <div className="theme-switch" onClick={handleThemeChange} style={{ cursor: 'pointer' }}>
              <img
                src={theme === 'dark' ? '/moon.svg' : '/sun.svg'}
                alt="theme-icon"
                className="theme-icon"
              />
            </div>
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
        {projectMenuItems.some(item => item?.key === currentKey) && currentKey !== 'home' && leftMenuData && (
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
