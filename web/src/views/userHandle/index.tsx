import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import UserService from '@/services/api/user';
import { userParam } from '@/types/user';
import UserEdit from './components/userEdit';
import { useTheme } from '@/contexts/ThemeContext';
import './index.less';

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  is_active: boolean;
}

const UserManagement: React.FC = () => {
  const { theme } = useTheme();
  const [users, setUsers] = useState<userParam[]>([]);
  const [newUser, setNewUser] = useState<userParam>({ id: 0, username: '', email: '', password: '', is_active: true });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('添加用户');
  
  useEffect(() => {
    getUserInfo();
    return () => {
    };
  }, []);

  const getUserInfo = () => {
    UserService.get_user_list().then(res => {
      setUsers(res.data)
    })
  };

  const deleteUser = (id: number) => {
    console.log(id)
    UserService.delete_user({ id }).then((res) => {
      console.log(res)
      getUserInfo();
    })
  };

  const showModal = (type: 'add' | 'edit' | 'password', user?: User) => {
    if (type === 'add') {
      setModalTitle('添加用户');
      setIsModalVisible(true);
      setNewUser({ id: 0, username: '', email: '', password: '', is_active: true });
    } else if (type === 'edit' && user) {
      setModalTitle('编辑用户');
      setNewUser(user);
      setIsModalVisible(true);
    } else if (type === 'password' && user) {
      setModalTitle('修改密码');
      setNewUser({ ...user, password: '' });
      setIsModalVisible(true);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    getUserInfo();
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '姓名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '状态',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (is_active: boolean) => <Tag color={is_active === true ? 'green' : 'volcano'}>{is_active === true ? '活跃' : '冻结'}</Tag>
    },
    {
      title: '操作',
      key: 'action',
      render: (user: User) => (
        <Space size="middle">
          <Button type="link" onClick={() => showModal('edit', user)}>
            <EditOutlined />编辑用户
          </Button>
          <Button type='link' onClick={() => showModal('password',user)}>修改密码</Button>
          <Popconfirm
            okText="确认"
            cancelText="取消"
            title="确认删除？"
            onConfirm={() => deleteUser(user.id)}>
            <Button type="link" danger>
              <DeleteOutlined />删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={`user-management ${theme}`}>
      <div className="header">
        <h2>用户管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal('add')}>
          添加用户
        </Button>
      </div>
      <Table columns={columns} dataSource={users} rowKey="id" />
      <UserEdit
        isModalVisible={isModalVisible}
        user={newUser}
        modalTitle={modalTitle}
        handlecancel={handleCancel}
      />
    </div>
  );
};

export default UserManagement;

