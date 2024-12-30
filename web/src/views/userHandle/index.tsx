import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import UserService from '@/services/api/base/user';
import { userParam } from '@/types/user';
import UserEdit from './components/userEdit';

interface User {
  id: number;
  name: string;
  email: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<userParam[]>([]);
  const [newUser, setNewUser] = useState<userParam>({ id: 0, username: '', email: '' , password: '' , is_active: 1 });
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    getUserInfo();
    return () => {
    };
  }, []);

  const getUserInfo = () => {
    UserService.get_user_list().then(res => { 
      setUsers(res.data)
    }) // TO: 获取用户信息
  };


  const deleteUser = (id: number) => {
    UserService.delete_user({id}).then(() => {
      getUserInfo();
    }) // TO: 删除用户信息
  };

  const showModal = (type: 'add' | 'edit', user?: User) => {
    if (type === 'add') {
      setIsModalVisible(true);
      setNewUser({ id: 0, username: '', email: '', password: '', is_active: 1 });
    } else if (type === 'edit' && user) {
      setNewUser(user);
      setIsModalVisible(true);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
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
      render: (is_active: number) => <Tag color={is_active === 1 ? 'green' : 'volcano'}>{is_active === 1 ? '活跃' : '冻结'}</Tag>
    },
    {
      title: '操作',
      key: 'action',
      render: (user: User) => (
        <Space size="middle">
          <Button type="link" onClick={() => showModal('edit', user)}>
            <EditOutlined />
          </Button>
          <Button type="link" onClick={() => deleteUser(user.id)}>
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: "space-between",alignContent: "center",alignItems: "center" }}>
      <h2>用户信息</h2>
      <Button type="primary" onClick={() => showModal('add')} icon={<PlusOutlined />}>
        添加新用户
      </Button>
      </div>
      <Table dataSource={users} columns={columns} rowKey="id" />
      <UserEdit 
        visible={isModalVisible}
        onCancel={handleCancel}
        user={newUser}
      />
    </div>
  );
};

export default UserManagement;

