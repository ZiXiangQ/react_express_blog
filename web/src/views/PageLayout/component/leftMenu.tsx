/*
 * @Author: qiuzx
 * @Date: 2025-01-08 10:16:12
 * @LastEditors: qiuzx
 * @Description: description
 */
import React from 'react';
import { Layout, Menu, Tooltip } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { FolderOutlined } from '@ant-design/icons';
import { fileKey } from '@/types/project';
import './leftMenu.less';
import FileIcon from '@/component/fileIcon';

const { Sider } = Layout;

interface LeftMenuProps {
  data: fileKey[];
  projectKey: string;
}

const LeftMenu: React.FC<LeftMenuProps> = ({ data, projectKey }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const getSelectedKey = () => {
    const params = new URLSearchParams(location.search);
    return params.get('path') || '';
  };

  const handleFileClick = (path: string) => {
    navigate(`/${projectKey}/file?path=${encodeURIComponent(path)}`);
  };

  const getAllFolderKeys = (items: fileKey[]): string[] => {
    let keys: string[] = [];
    items.forEach(item => {
      if (item.children && item.children.length > 0) {
        keys.push(item.path);
        keys = keys.concat(getAllFolderKeys(item.children));
      }
    });
    return keys;
  };

  const renderMenuItems = (items: fileKey[]) => {
    return items.map((item) => {
      const isFolder = item.children && item.children.length > 0
      const fileType = isFolder ? 'folder' : (item.type || item.path.split('.').pop()?.toLowerCase())
      return isFolder ? (
        <Menu.SubMenu
          key={item.path}
          title={
            <Tooltip title={item.name} placement="right">
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <FileIcon type="folder" />
                <span>{item.name}</span>
              </span>
            </Tooltip>
          }
        >
          {item.children && renderMenuItems(item.children)}
        </Menu.SubMenu>
      ) : (
        <Menu.Item key={item.path} onClick={() => handleFileClick(item.path)}>
          <Tooltip title={item.name} placement="right">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FileIcon type={fileType || ''} />
              <span
                style={{
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {item.name}
              </span>
            </div>
          </Tooltip>
        </Menu.Item>
      )
    })
  }

  return (
    <Sider width={260} className="site-layout-background file-explorer-menu">
      <div className="menu-title">
        <FolderOutlined className="folder-icon" style={{ color: '#ffb74d' }} />
        <span style={{ fontWeight: 'bold' }}>项目文档</span>
      </div>
      <Menu
        mode="inline"
        className="file-menu"
        style={{ padding: '8px 0' }}
        defaultOpenKeys={getAllFolderKeys(data)}
        selectedKeys={[getSelectedKey()]}
      >
        {data && data.length > 0 ? (
          renderMenuItems(data)
        ) : (
          <Menu.Item key="no-data" disabled>
            <span>暂无文件</span>
          </Menu.Item>
        )}
      </Menu>
    </Sider>
  );
};

export default LeftMenu;
