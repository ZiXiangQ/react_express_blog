/*
 * @Author: qiuzx
 * @Date: 2025-01-08 10:16:12
 * @LastEditors: qiuzx
 * @Description: 左侧菜单
 */
import React, { useState, useEffect } from 'react';
import { Layout, Tooltip, Input, Space } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { FixedSizeList as List } from 'react-window';
import { fileKey, FlattenedItem, LeftMenuProps } from '@/types/project';
import './leftMenu.less';
import FileIcon from '@/component/fileIcon';
const { Sider } = Layout;
const { Search } = Input;

const LeftMenu: React.FC<LeftMenuProps> = ({ data, projectKey }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filteredData, setFilteredData] = useState<fileKey[]>(data);
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  const [flattenedItems, setFlattenedItems] = useState<FlattenedItem[]>([]);


  const getSelectedKey = () => { // 获取选中项
    const params = new URLSearchParams(location.search);
    return params.get('path') || '';
  };

  const getParentPaths = (items: fileKey[], targetPath: string): string[] => { // 获取父级路径
    let parents: string[] = [];
    const dfs = (nodes: fileKey[], currentPath: string[] = []) => {
      for (const node of nodes) {
        const newPath = [...currentPath, node.path];
        if (node.path === targetPath) {
          parents = currentPath;
          return true;
        }
        if (node.children?.length) {
          if (dfs(node.children, newPath)) return true;
        }
      }
      return false;
    };
    dfs(items);
    return parents;
  };

  const flattenTree = (items: fileKey[], level: number = 0, parentKey?: string): FlattenedItem[] => { // 扁平化树, 将树形结构转换为扁平化结构
    let result: FlattenedItem[] = [];
    items.forEach(item => {
      const isFolder = item.children && item.children?.length > 0;
      const type = isFolder ? 'folder' : (item.type || item.path.split('.').pop()?.toLowerCase());
      result.push({
        key: item.path,
        label: item.name,
        level,
        isFolder: isFolder || false,
        type: type || '',
        parentKey
      });
      if (isFolder && (openKeys.includes(item.path) || isAllExpanded)) {
        result = result.concat(flattenTree(item.children || [], level + 1, item.path));
      }
    });
    return result;
  };

  useEffect(() => {  //更新搜索
    if (searchValue) {
      handleSearch(searchValue);
    } else {
      setFilteredData(data);
    }
  }, [data]);

  useEffect(() => {  //url跳转，选中后，触发打开父级目录
    const selected = getSelectedKey();
    if (!selected) return;
    const parents = getParentPaths(data, selected);
    if (parents.length) {
      setOpenKeys(prev => Array.from(new Set([...prev, ...parents])));
    }
  }, [location.search, data]);

  useEffect(() => {  //更新扁平化树
    const flattened = flattenTree(filteredData);
    setFlattenedItems(flattened);
  }, [filteredData, openKeys, isAllExpanded, location.search]);

  const handleFileClick = (path: string) => { //点击文件，跳转
    navigate(`/${projectKey}/file?path=${encodeURIComponent(path)}`);
  };

  const getAllFolderKeys = (items: fileKey[]): string[] => { //获取所有文件夹
    let keys: string[] = [];
    items.forEach(item => {
      if (item.children?.length) {
        keys.push(item.path);
        keys = keys.concat(getAllFolderKeys(item.children));
      }
    });
    return keys;
  };

  const toggleExpandAll = () => { //展开所有文件夹
    if (isAllExpanded) {
      setOpenKeys([]);
    } else {
      const allKeys = getAllFolderKeys(data);
      setOpenKeys(allKeys);
    }
    setIsAllExpanded(!isAllExpanded);
  };

  const toggleSider = () => {
    setCollapsed(!collapsed);
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (!value) {
      setFilteredData(data);
      return;
    }
    const searchInItems = (items: fileKey[]): fileKey[] => {
      return items.reduce((acc: fileKey[], item) => {
        const matchesSearch = item.name.toLowerCase().includes(value.toLowerCase());
        if (item.children?.length) {
          const matchingChildren = searchInItems(item.children);
          if (matchingChildren.length > 0 || matchesSearch) {
            acc.push({ ...item, children: matchingChildren });
          }
        } else if (matchesSearch) {
          acc.push(item);
        }
        return acc;
      }, []);
    };
    const filtered = searchInItems(data);
    setFilteredData(filtered);
  };

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => { //行渲染
    const item = flattenedItems[index];
    if (!item) return null;
    const isSelected = item.key === getSelectedKey();
    if (item.isFolder) {
      return (
        <div style={style} className={`virtual-row ${isSelected ? 'selected' : ''}`}>
          <div
            className="folder-item"
            style={{ paddingLeft: `${item.level * 24 + 12}px`, cursor: 'pointer' }}
            onClick={() => {
              const isCurrentlyOpen = openKeys.includes(item.key);
              const newOpenKeys = isCurrentlyOpen
                ? openKeys.filter(k => k !== item.key)
                : [...openKeys, item.key];
              setOpenKeys(newOpenKeys);
              setIsAllExpanded(false);
            }}

          >
            <FileIcon type="folder" />
            <span className="item-label">{item.label}</span>
            <span className="folder-arrow">{openKeys.includes(item.key) ? '▼' : '▶'}</span>
          </div>
        </div>
      );
    }

    return (
      <div
        style={style}
        className={`virtual-row ${isSelected ? 'selected' : ''}`}
        onClick={() => handleFileClick(item.key)}
      >
        <div className="file-item" style={{ paddingLeft: `${item.level * 24 + 12}px` }}>
          <FileIcon type={item.type || ''} />
          <span className="item-label">{item.label}</span>
        </div>
      </div>
    );
  };

  return (
    <Sider
      width={300}
      className="site-layout-background file-explorer-menu"
      collapsed={collapsed}
      collapsedWidth={48}
    >
      {!collapsed ? (
        <div className="menu-search">
          <Space.Compact style={{ width: '100%' }}>
            <Search
              placeholder="搜索文件..."
              allowClear
              onChange={(e) => handleSearch(e.target.value)}
              value={searchValue}
              style={{ flex: 1 }}
            />
            <Tooltip title={isAllExpanded ? "收起所有" : "展开所有"}>
              <div className="expand-button" onClick={toggleExpandAll}>
                {isAllExpanded ? "收起" : "展开"}
              </div>
            </Tooltip>
            <Tooltip title="收起侧边栏" placement="bottom">
              <div className="collapse-button" onClick={toggleSider}>
                <MenuFoldOutlined />
              </div>
            </Tooltip>
          </Space.Compact>
        </div>
      ) : (
        <div className="menu-header-collapsed">
          <Tooltip title="展开侧边栏" placement="right">
            <MenuUnfoldOutlined onClick={toggleSider} />
          </Tooltip>
        </div>
      )}
      <div className="virtual-list-container">
        <List
          height={window.innerHeight - 64}
          itemCount={flattenedItems.length}
          itemSize={40}
          width="100%"
        >
          {Row}
        </List>
      </div>
    </Sider>
  );
};

export default LeftMenu;
