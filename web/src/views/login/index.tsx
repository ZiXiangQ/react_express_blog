/*
 * @Author: qiuzx
 * @Date: 2024-12-19 15:04:29
 * @LastEditors: qiuzx
 * @Description: description
 */
import React from 'react';
import { Form, Input, Button, message } from 'antd';
import './index.less'; // 引入样式文件
import BasicService from '@/services/api/base';
import { LoginValues } from '@/types/base';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import ProjectService from '@/services/api/project';
import { projectList } from '@/types/project';
import { useProjects } from '@/hooks/useProject';

const Login = () => {
    const navigate = useNavigate()
    const { updateProjects } = useProjects();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const onFinish = (values: LoginValues) => {
        BasicService.login(values).then((res) => {
            if (res.code == 0) {
                message.success('登录成功');
                navigate("/home")
                localStorage.setItem('username', values.username)
                getProjectList();
            }
        });
    };

    const getProjectList = () => {
        ProjectService.get_all_projects().then((rsp: projectList) => {
            if (rsp.code == 0) {
                updateProjects(rsp.data);
            }
        });
    }


        return (
            <div className="login-container">
                <div className={`form-container ${isDark ? 'dark' : ''}`}>
                    <Form
                        name="login"
                        onFinish={onFinish}
                        layout="vertical"
                    >
                        <Form.Item
                            name="username"
                            label="用户名"
                            rules={[{ required: true, message: '请输入用户名' }]}
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
                            <Button type="primary" block htmlType="submit">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        );
    };

    export default Login;
