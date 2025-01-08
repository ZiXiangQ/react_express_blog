/*
 * @Author: qiuzx
 * @Date: 2024-12-30 22:39:46
 * @LastEditors: qiuzx
 * @Description: UserEdit
 */
import { Modal, Button, Input, Radio, RadioChangeEvent, message } from 'antd'
import { useEffect, useState } from 'react'
import { Form } from 'antd'
import { userParam } from '@/types/user'
import UserService from '@/services/api/user'

interface IProps {
  isModalVisible: boolean
  user: userParam
  modalTitle: string
  handlecancel: () => void
}

const UserEdit = (props: IProps) => {
  const [form] = Form.useForm()
  const { isModalVisible, user, handlecancel, modalTitle } = props
  const [value, setValue] = useState(1);

  useEffect(() => {
    console.log(user) 
    if(user){
      user.password1 = user.password
    }
    form.setFieldsValue(user)
    return () => {
      form.resetFields()
    };
  }, [user]);

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  }

  const usermodify = () => {
    form.validateFields().then((values) => {
      if(modalTitle === '添加用户'){
        UserService.create(values).then((res) => {
          message.success(res.message)
          handlecancel()
        })
      }else if(modalTitle == '编辑用户'){
        const updatedValues = { ...values };
        delete updatedValues.password1;
        delete updatedValues.password;
        updatedValues.id = user.id;
        UserService.modify_user(updatedValues).then((res) => {
          message.success(res.message)
          handlecancel()
        })
      }else if(modalTitle == '修改密码'){
        const updatedValues = { ...values };
        delete updatedValues.username;
        delete updatedValues.email;
        delete updatedValues.is_active;
        updatedValues.id = user.id;
        UserService.modify_password(updatedValues).then((res) => {
          message.success(res.message)
          handlecancel()
        })
      }
    })
  }

  const onCancel = () => {
    form.resetFields()
    handlecancel()
  }

  const onChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };

  return (
    <div>
      <Modal
        title={modalTitle}
        okText="确定"
        cancelText="取消"
        open={isModalVisible}
        footer={[
          <Button key="back" onClick={onCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={usermodify}>
            确定
          </Button>,
        ]}
        style={{ padding: 20 }}
      >
        <Form {...layout} form={form} name="userEdit">
          <Form.Item hidden={modalTitle === '修改密码'? true : false} label="姓名" name="username" rules={[{ required: true, message: '请输入姓名!' }]}>
            <Input
              placeholder="姓名"
            />
          </Form.Item>
          <Form.Item hidden={modalTitle === '修改密码'? true : false} label="邮箱" name="email" rules={[{ required: true, message: '请输入邮箱!' }]}>
            <Input
              type="email"
              placeholder="邮箱"
            />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            hidden = {modalTitle === '编辑用户'? true : false}
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item
            label="确认密码"
            name="password1"
            hidden = {modalTitle === '编辑用户'? true : false}
            dependencies={['password']}
            rules={[
              { required: true, message: '请输入密码!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次确认密码" />
          </Form.Item>
          <Form.Item hidden={modalTitle === '修改密码'? true : false} label="状态" name="is_active" rules={[{ required: true, message: '请输入邮箱!' }]}>
            <Radio.Group onChange={onChange} value={value}>
              <Radio value={true}>活跃</Radio>
              <Radio value={false}>冻结</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default UserEdit
