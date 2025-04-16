/*
 * @Author: qiuzx
 * @Date: 2025-01-08 10:16:12
 * @LastEditors: qiuzx
 * @Description: description
 */
import React, { useState, useEffect } from 'react';
import { Layout, Tooltip, Input, Space } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { FixedSizeList as List } from 'react-window';
import { fileKey } from '@/types/project';
import './leftMenu.less';
import FileIcon from '@/component/fileIcon';

const { Sider } = Layout;
const { Search } = Input;

interface LeftMenuProps {
  data: fileKey[];
  projectKey: string;
}

interface FlattenedItem {
  key: string;
  label: string;
  level: number;
  isFolder: boolean;
  type: string;
  parentKey?: string;
}

const LeftMenu: React.FC<LeftMenuProps> = ({ data, projectKey }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filteredData, setFilteredData] = useState<fileKey[]>(data);
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  const [flattenedItems, setFlattenedItems] = useState<FlattenedItem[]>([]);

  // 监听 data 变化，更新 filteredData
  useEffect(() => {
    if (searchValue) {
      handleSearch(searchValue);
    } else {
      setFilteredData(data);
    }
  }, [data]);

  // 扁平化树形结构
  const flattenTree = (items: fileKey[], level: number = 0, parentKey?: string): FlattenedItem[] => {
    let result: FlattenedItem[] = [];
    items.forEach(item => {
      const isFolder = item.children && item.children.length > 0;
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
    console.log(result, 'result')
    return result;
  };

  const getSelectedKey = () => {
    const params = new URLSearchParams(location.search);
    return params.get('path') || '';
  };

  // 当数据、展开状态或搜索值变化时，更新扁平化列表
  useEffect(() => {
    const flattened = flattenTree(filteredData);
    setFlattenedItems(flattened);
  }, [filteredData, openKeys, isAllExpanded]);

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

  // 切换展开/收起所有文件夹
  const toggleExpandAll = () => {
    if (isAllExpanded) {
      setOpenKeys([]);
    } else {
      const allKeys = getAllFolderKeys(data);
      setOpenKeys(allKeys);
    }
    setIsAllExpanded(!isAllExpanded);
  };

  // 切换侧边栏
  const toggleSider = () => {
    setCollapsed(!collapsed);
  };

  // 搜索功能
  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (!value) {
      setFilteredData(data);
      return;
    }

    const searchInItems = (items: fileKey[]): fileKey[] => {
      return items.reduce((acc: fileKey[], item) => {
        const matchesSearch = item.name.toLowerCase().includes(value.toLowerCase());
        if (item.children && item.children.length > 0) {
          const matchingChildren = searchInItems(item.children);
          if (matchingChildren.length > 0) {
            acc.push({
              ...item,
              children: matchingChildren
            });
          } else if (matchesSearch) {
            acc.push(item);
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

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = flattenedItems[index];
    if (!item) return null;
    const isSelected = item.key === getSelectedKey();

    if (item.isFolder) {
      return (
        <div style={style} className={`virtual-row ${isSelected ? 'selected' : ''}`}>
          <div
            className="folder-item"
            style={{ 
              paddingLeft: `${item.level * 24 + 12}px`,
              cursor: 'pointer'
            }}
            onClick={() => {
              const newOpenKeys = openKeys.includes(item.key)
                ? openKeys.filter(k => k !== item.key)
                : [...openKeys, item.key];
              setOpenKeys(newOpenKeys);
            }}
          >
            <FileIcon type="folder" />
            <span className="item-label">{item.label}</span>
            <span className="folder-arrow">
              {openKeys.includes(item.key) ? '▼' : '▶'}
            </span>
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
        <div
          className="file-item"
          style={{ paddingLeft: `${item.level * 24 + 12}px` }}
        >
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
