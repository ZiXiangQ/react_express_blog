import React, { useEffect, useState } from 'react';
import {
  Layout,
  Radio,
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
import HttpClient from '@/services/httpClient';
import { RspModel } from '@/services/httpClient';

const { Content } = Layout;


function SettingsPage() {
  const [theme, setTheme] = useState('light'); // 主题
  const [filePath, setFilePath] = useState(''); // 文件路径
  const [tempPath, setTempPath] = useState(''); // 临时文件路径
  const [isEditingPath, setIsEditingPath] = useState(false); // 是否编辑文件路径
  const [projects, setProjects] = useState<projectItem[]>([]); // 项目列表

  useEffect(() => {
    getProjectList();
  }, []);

  const getProjectList = () => {
    ProjectService.get_all_projects().then((res) => {
      console.log(res)
      if (res.code == 0) {
        const withEditState: projectItem[] = res.data.map((item: projectItem) => ({ ...item, isEditing: false }));
        console.log(withEditState)
        setProjects(withEditState);
      }
    })
  }

  const handleSavePath = () => {
    setFilePath(tempPath);
    setIsEditingPath(false);
    message.success('文件路径已保存');
  };

  const handleEditPath = () => {
    setTempPath(filePath);
    setIsEditingPath(true);
  };

  const handleAddProject = () => {
    const newProject = {
      id: Date.now(), // 临时ID，保存后会替换为服务器返回的ID
      project_name: '',
      project_key: '',
      visible_users: '',
      isEditing: true,
    };
    setProjects([...projects, newProject]);
  };

  const handleChange = (value: string, key: string, id: number) => {
    console.log(value, key, id);
    
    // 使用map更新projects数组，找到id匹配的项目并更新其属性
    const updatedProjects = projects.map((project) => {
      if (project.id === id) {
        return { ...project, [key]: value };
      }
      return project;
    });
    
    setProjects(updatedProjects);
  };

  const handleSave = (id: number) => {
    // 找到当前编辑的项目
    const projectToSave = projects.find(project => project.id === id);
    
    if (projectToSave) {
      // 调用编辑接口 - 使用POST方法发送项目数据
      const api = '/file_handle/project/update';
      HttpClient.post<RspModel, projectItem>(api, projectToSave)
        .then((res: RspModel) => {
          if (res.code === 0) {
            message.success('保存成功');
            // 更新编辑状态
            toggleEdit(id, false);
          } else {
            message.error('保存失败');
          }
        })
        .catch((err: Error) => {
          message.error('保存失败');
          console.error(err);
        });
    }
  };

  const handleDelete = (id: number) => {
    // 调用删除接口 - 使用POST方法发送项目ID
    const api = '/file_handle/project/delete';
    HttpClient.post<RspModel, { id: number }>(api, { id })
      .then((res: RspModel) => {
        if (res.code === 0) {
          message.success('删除成功');
          // 更新本地状态
          setProjects(projects.filter((project) => project.id !== id));
        } else {
          message.error('删除失败');
        }
      })
      .catch((err: Error) => {
        message.error('删除失败');
        console.error(err);
      });
  };

  const toggleEdit = (id: number, edit: boolean) => {
    const updated = projects.map((project) =>
      project.id === id ? { ...project, isEditing: edit } : project
    );
    
    setProjects(updated);
  };

  const columns = [
    {
      title: '项目名称',
      dataIndex: 'project_name',
      width: 200,
      render: (text: string, record: projectItem) =>
        record.isEditing ? (
          <Input
            value={text}
            style={{ width: '100%' }}
            onChange={(e) =>
              handleChange(e.target.value, 'project_name', record.id)
            }
          />
        ) : (
          <span>{text}</span>
        ),
    },
    {
      title: '项目标识',
      dataIndex: 'project_key',
      width: 200,
      render: (text: string, record: projectItem) =>
        record.isEditing ? (
          <Input
            value={text}
            style={{ width: '100%' }}
            onChange={(e) =>
              handleChange(e.target.value, 'project_key', record.id)
            }
          />
        ) : (
          <span>{text}</span>
        ),
    },
    {
      title: '可见用户',
      dataIndex: 'visible_users',
      width: 300,
      render: (text: string, record: projectItem) =>
        record.isEditing ? (
          <Input
            value={text}
            style={{ width: '100%' }}
            onChange={(e) =>
              handleChange(e.target.value, 'visible_users', record.id)
            }
          />
        ) : (
          <span>{text}</span>
        ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 160,
      render: (_: string, record: projectItem) => (
        <Space>
          {record.isEditing ? (
            <Button
              type="primary"
              size="small"
              onClick={() => handleSave(record.id)}
            >
              保存
            </Button>
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
    <Content style={{ margin:"0 10", minHeight: 280 }}>
      {/* 主题配置 */}
      <section>
        <h2>主题配置</h2>
        <Radio.Group
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          <Radio value="light">浅色模式</Radio>
          <Radio value="dark">深色模式</Radio>
        </Radio.Group>
      </section>
      <Divider></Divider>
      {/* 文件路径配置 */}
      <section style={{ marginTop: 24 }}>
        <h2>文件路径配置</h2>
        {isEditingPath ? (
          <>
            <Input
              value={tempPath}
              onChange={(e) => setTempPath(e.target.value)}
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
      </section>
      <Divider></Divider>
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>项目配置</h2>
          <Button type="primary" onClick={handleAddProject}>
            添加项目
          </Button>
        </div>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={projects}
          pagination={false}
        />
      </section>
    </Content>
  );
}

export default SettingsPage;
