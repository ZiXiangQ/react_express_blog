/*
 * @Author: qiuzx
 * @Date: 2025-01-08 10:16:12
 * @LastEditors: qiuzx
 * @Description: description
 */
import React, { useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { folderKey } from '@/types/project';

const { Sider } = Layout;

interface LeftMenuProps {
  data: folderKey;
  projectKey: string;
}

interface File {
  name: string;
  path: string;
}

const LeftMenu: React.FC<LeftMenuProps> = ({ data, projectKey }) => {
  // const navigate = useNavigate();

  const renderMenuItems = (data: { [key: string]: File[] }) => {
    console.log(window.location.href)
    return Object.keys(data).map((key) => {
      const files = data[key];
      return (
        <Menu.SubMenu key={key} title={key} >
          {
            files.map((file) => (
              <Menu.Item key={file.path} >
                <Link to={`/${projectKey}/${encodeURIComponent(file.path)}`} > {file.name} </Link>
              </Menu.Item>
            ))
          }
        </Menu.SubMenu>
      );
    });
  };

  // const get_data = (path: string) => {
  //   console.log(path);
  //   console.log(window.location.href)
  //   console.log(`/${projectKey}/${encodeURIComponent(path)}`)
  //   navigate(`/${projectKey}/${encodeURIComponent(path)}`);
  // };

  return (
    <Sider width={200} className="site-layout-background" >
      <Menu mode="inline" style={{ height: '100%', borderRight: 0 }}>
        {renderMenuItems(data)}
      </Menu>
    </Sider>
  );
};

export default LeftMenu;
