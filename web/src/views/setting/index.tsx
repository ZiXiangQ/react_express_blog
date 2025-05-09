import React, { useEffect, useState } from 'react';
import {
  Input,
  Button,
  message,
  Table,
  Popconfirm,
  Space,
  Divider,
} from 'antd';
import ProjectService from '@/services/api/project';
import { projectItem } from '@/types/project';
import '@/styles/theme.css';
import { useProjects } from '@/hooks/useProject';

function SettingsPage() {
  const [filePath, setFilePath] = useState('');
  const [isEditingPath, setIsEditingPath] = useState(false);
  const [originalProjects, setOriginalProjects] = useState<projectItem[]>([]);
  const { projects, updateProjects, cancelEdit } = useProjects();

  useEffect(() => {
    getProjectList();
    getProjectPath();
  }, []);

  const getProjectList = () => {
    ProjectService.get_all_projects().then((res) => {
      if (res.code == 0) {
        const withEditState: projectItem[] = Array.isArray(res.data) ? res.data.map((item: projectItem) => ({ ...item, isEditing: false })) : [];
        updateProjects(withEditState);
        setOriginalProjects(withEditState);
      } else {
        updateProjects([]);
      }
    }).catch(err => {
      console.error('获取项目列表失败:', err);
      updateProjects([]);
    });
  }

  const getProjectPath = () => {
    ProjectService.get_system_path().then((res) => {
      if (res.code == 0) {
        const path = typeof res.data === 'string' ? res.data : '';
        setFilePath(path);
      } else {
        setFilePath('');
      }
    }).catch(err => {
      console.error('获取系统路径失败:', err);
      setFilePath('');
    });
  };

  const handleSavePath = () => {
    setIsEditingPath(false);
    ProjectService.modify_system_path({id:1,system_config_path:filePath}).then((res) => {
      if (res.code == 0) {
        message.success(res.message);
      } else {
        message.error(res.message);
      }
    })
  };

  const handleEditPath = () => {
    setIsEditingPath(true);
  };

  const handleAddProject = () => {
    const newProject = {
      id: Date.now(),
      project_name: '',
      project_key: '',
      visible_users: '',
      isEditing: true,
    };
    updateProjects([...projects, newProject]);
  };

  const handleChange = (value: string, key: string, id: number) => {
    const updatedProjects = projects.map((project) => {
      if (project.id === id) {
        return { ...project, [key]: value };
      }
      return project;
    });
    updateProjects(updatedProjects);
  };

  const handleSave = (id: number) => {
    const projectToSave = projects.find(project => project.id === id);
    if (projectToSave) {
      const isNewProject = !projects.some(p => p.id === id && !p.isEditing);
      if (isNewProject) {
        ProjectService.add_project(projectToSave).then((res) => {
          if (res.code === 0) {
            message.success(res.message || '添加成功');
            toggleEdit(id, false);
            getProjectList();
          } else {
            message.error(res.message || '添加失败');
          }
        }).catch(err => {
          console.error(err);
          message.error('添加失败');
        });
      } else {
        ProjectService.update_project(projectToSave).then((res) => {
          if (res.code === 0) {
            message.success(res.message || '更新成功');
            toggleEdit(id, false);
            getProjectList();
          } else {
            message.error(res.message || '更新失败');
          }
        }).catch(err => {
          console.error(err);
          message.error('更新失败');
        });
      }
    }
  };

  const handleDelete = (id: number) => {
    ProjectService.delete_project(id).then((res) => {
      if (res.code === 0) {
        message.success(res.message);
        getProjectList();
      }
    });
  };

  const toggleEdit = (id: number, edit: boolean) => {
    const updated = projects.map((project) =>
      project.id === id ? { ...project, isEditing: edit } : project
    );
    updateProjects(updated);
  };

  const handleCancelEdit = (id: number) => {
    const isNewProject = !originalProjects.some(p => p.id === id);
    if (isNewProject) {
      // 如果是新项目，直接移除
      const updatedProjects = projects.filter(project => project.id !== id);
      updateProjects(updatedProjects);
    } else {
      // 如果是编辑现有项目，恢复到原始状态
      cancelEdit(id, originalProjects);
    }
  };

  const columns = [
    {
      title: '项目名称',
      dataIndex: 'project_name',
      width: 200,
      render: (text: string, record: projectItem) =>
        record.isEditing ? (
          <Input
            value={text || ''}
            style={{ width: '100%' }}
            onChange={(e) =>
              handleChange(e.target.value, 'project_name', record.id)
            }
          />
        ) : (
          <span>{text || ''}</span>
        ),
    },
    {
      title: '项目标识',
      dataIndex: 'project_key',
      width: 200,
      render: (text: string, record: projectItem) =>
        record.isEditing ? (
          <Input
            value={text || ''}
            style={{ width: '100%' }}
            onChange={(e) =>
              handleChange(e.target.value, 'project_key', record.id)
            }
          />
        ) : (
          <span>{text || ''}</span>
        ),
    },
    {
      title: '可见用户',
      dataIndex: 'visible_users',
      width: 300,
      render: (text: string, record: projectItem) =>
        record.isEditing ? (
          <Input
            value={text || ''}
            style={{ width: '100%' }}
            onChange={(e) =>
              handleChange(e.target.value, 'visible_users', record.id)
            }
          />
        ) : (
          <span>{text || ''}</span>
        ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 200,
      render: (_: string, record: projectItem) => (
        <Space size="small">
          {record.isEditing ? (
            <>
              <Button
                type="primary"
                size="small"
                onClick={() => handleSave(record.id)}
              >
                保存
              </Button>
              <Button
                size="small"
                onClick={() => handleCancelEdit(record.id)}
              >
                取消
              </Button>
            </>
          ) : (
            <Button
              size="small"
              onClick={() => toggleEdit(record.id, true)}
            >
              编辑
            </Button>
          )}
          <Popconfirm
            title="确认删除该项目？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger size="small">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{padding: 24}}>
      <Divider />
      {/* 文件路径配置 */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ margin: 0 }}>文件路径</h3>
        <p style={{ margin: '5px 0 12px 0', color: 'var(--text-color)' }}>配置系统文件路径</p>
        {isEditingPath ? (
          <>
            <Input
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
              placeholder="请输入文件路径"
              style={{ width: 400, marginRight: 8 }}
            />
            <Button type="primary" onClick={handleSavePath}>
              保存
            </Button>
          </>
        ) : (
          <>
            <span
              style={{
                display: 'inline-block',
                width: 400,
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

      {/* 项目列表 */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>项目列表</h3>
          <Button type="primary" onClick={handleAddProject}>
            添加项目
          </Button>
        </div>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={projects}
          pagination={false}
          bordered
          size="middle"
        />
      </div>
    </div>
  )
}

export default SettingsPage;
