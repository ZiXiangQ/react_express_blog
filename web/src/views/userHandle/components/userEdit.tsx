/*
 * @Author: qiuzx
 * @Date: 2024-12-30 22:39:46
 * @LastEditors: qiuzx
 * @Description: description
 */
import { Modal, Button, Input, Select } from 'antd'
import React from 'react'
import { Form } from 'react-router-dom'

export default function userEdit(props:Props) {

  const { isModalVisible, handleCancel, handleInputChange, addUser, newUser } = props

  return (
    <div>      {/* 用户新增 */}
      
    {/* 新增用户模态框 */}
    <Modal
      title="添加新用户"
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={addUser}>
          确定
        </Button>,
      ]}
    >
      <Form >
        <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入姓名!' }]}>
          <Input
            placeholder="姓名"
            value={newUser.name}
            onChange={e => handleInputChange(e, 'name')}
          />
        </Form.Item>
        <Form.Item label="邮箱" name="email" rules={[{ required: true, message: '请输入邮箱!' }]}>
          <Input
            type="email"
            placeholder="邮箱"
            value={newUser.email}
            onChange={e => handleInputChange(e, 'email')}
          />
        </Form.Item>
      </Form>
      <Form>
        <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码!' }]}>
          <Input
            placeholder="请输入密码"
            value={newUser.password}
            onChange={e => handleInputChange(e, 'password')}
          />
        </Form.Item>
        <Form.Item label="状态" name="email" rules={[{ required: true, message: '请输入邮箱!' }]}>
          <Select placeholder="状态">
            <Select.Option value="1">活跃</Select.Option>
            <Select.Option value="0">冻结</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
    </div>
  )
}
