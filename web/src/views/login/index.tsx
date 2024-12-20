// src/components/Login.jsx
import React from 'react';
import { Form, Input, Button } from 'antd';
import './index.less'; // 引入样式文件
import BasicService from '@/services/api/base/base';

interface LoginValues {
    username: string; // 用户名
    password: string; // 密码
}


const Login = () => {
    const onFinish = (values: LoginValues) => {
        BasicService.login(values).then((res) => {
            console.log(res);
        });
    };

    return (
        <div className="login-container">
            <div className="form-container">
                <h2>登录</h2>
                <Form
                    name="login"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="username"
                        label="用户名"
                        rules={[{ required: true, message: '请输入用户名!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="密码"
                        rules={[{ required: true, message: '请输入密码!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;
