/*
 * @Description: 系统设置页 - 简化为"配置根路径 + 自动扫描文档库"
 * 说明：项目（文档库）不再需要手动增删改，只需配置 config 指定的根路径，
 * 系统会自动扫描该路径下的一级目录作为文档库，并持久化同步到项目列表。
 */
import React, { useEffect, useState } from 'react';
import {
  Input,
  Button,
  message,
  Table,
  Divider,
  Space,
  Tag,
  Empty,
} from 'antd';
import { ReloadOutlined, FolderOpenOutlined } from '@ant-design/icons';
import ProjectService from '@/services/api/project';
import { projectItem, projectList, sysPath } from '@/types/project';
import '@/styles/theme.css';
import { useProjects } from '@/hooks/useProject';

function SettingsPage() {
  const [filePath, setFilePath] = useState('');
  const [isEditingPath, setIsEditingPath] = useState(false);
  const [scanning, setScanning] = useState(false);
  const { projects, updateProjects } = useProjects();

  useEffect(() => {
    getProjectPath();
    getProjectList();
  }, []);

  // 获取当前已持久化的项目列表（后端自动扫描结果）
  const getProjectList = () => {
    ProjectService.get_all_projects().then((res: projectList) => {
      if (res.code === 0) {
        updateProjects(Array.isArray(res.data) ? res.data : []);
      } else {
        updateProjects([]);
      }
    }).catch((err) => {
      console.error('获取项目列表失败:', err);
      updateProjects([]);
    });
  };

  const getProjectPath = () => {
    ProjectService.get_system_path().then((res: sysPath) => {
      if (res.code === 0) {
        setFilePath(typeof res.data === 'string' ? res.data : '');
      } else {
        setFilePath('');
      }
    }).catch((err) => {
      console.error('获取系统路径失败:', err);
      setFilePath('');
    });
  };

  // 保存根路径：后端会在保存时自动扫描并同步项目列表
  const handleSavePath = () => {
    setIsEditingPath(false);
    ProjectService.modify_system_path({ id: 1, system_config_path: filePath }).then((res) => {
      if (res.code === 0) {
        message.success(res.message || '保存成功，已自动扫描文档库');
        getProjectList();
      } else {
        message.error(res.message || '保存失败');
      }
    }).catch((err) => {
      console.error(err);
      message.error('保存失败');
    });
  };

  const handleEditPath = () => {
    setIsEditingPath(true);
  };

  // 手动触发重新扫描（例如新增/删除了子目录后，无需重新保存路径也能刷新）
  const handleRescan = () => {
    setScanning(true);
    ProjectService.scan_root().then((res: projectList) => {
      if (res.code === 0) {
        message.success('扫描成功，文档库已更新');
        updateProjects(Array.isArray(res.data) ? res.data : []);
      } else {
        message.error(res.message || '扫描失败');
      }
    }).catch((err) => {
      console.error(err);
      message.error('扫描失败，请检查路径是否正确');
    }).finally(() => {
      setScanning(false);
    });
  };

  const columns = [
    {
      title: '文档库名称',
      dataIndex: 'project_name',
      render: (text: string) => (
        <Space>
          <FolderOpenOutlined style={{ color: '#1677ff' }} />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '目录标识',
      dataIndex: 'project_key',
      render: (text: string) => <Tag>{text}</Tag>,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Divider />
      {/* 文件路径配置 */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ margin: 0 }}>文档根路径</h3>
        <p style={{ margin: '5px 0 12px 0', color: 'var(--text-color)' }}>
          配置文档库的根路径，系统会自动扫描该路径下的一级目录作为文档库，无需手动维护项目列表
        </p>
        {isEditingPath ? (
          <>
            <Input
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
              placeholder="请输入文件路径，例如 /Users/xxx/workspace/blog_doc"
              style={{ width: 420, marginRight: 8 }}
            />
            <Button type="primary" onClick={handleSavePath}>
              保存并扫描
            </Button>
          </>
        ) : (
          <>
            <span
              style={{
                display: 'inline-block',
                width: 420,
                marginRight: 8,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {filePath || '（未设置路径）'}
            </span>
            <Button onClick={handleEditPath}>编辑</Button>
          </>
        )}
      </div>

      <Divider />

      {/* 项目列表（只读，来自自动扫描结果） */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ margin: 0 }}>文档库列表</h3>
            <p style={{ margin: '5px 0 0 0', color: 'var(--text-color)' }}>
              以下列表由系统根据根路径自动扫描生成，新增/删除文件夹后点击"重新扫描"即可同步
            </p>
          </div>
          <Button icon={<ReloadOutlined />} loading={scanning} onClick={handleRescan}>
            重新扫描
          </Button>
        </div>
        {Array.isArray(projects) && projects.length > 0 ? (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={projects as projectItem[]}
            pagination={false}
            bordered
            size="middle"
          />
        ) : (
          <Empty description="暂无文档库，请先配置根路径" />
        )}
      </div>
    </div>
  );
}

export default SettingsPage;

