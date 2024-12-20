/*
 * @Author: qiuzx
 * @Date: 2024-12-19 10:11:43
 * @LastEditors: qiuzx
 * @Description: description
 */
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 11055; // 你可以选择其他端口

// 中间件
app.use(bodyParser.json());

// 创建数据库连接
const connection = mysql.createConnection({
    host: '127.0.0.1', // 数据库主机
    user: 'root', // 数据库用户名
    password: 'WANGyan9059.', // 数据库密码
    database: 'express_user_db', // 数据库名称
    port: 3306, // 数据库端口
});

// 测试数据库连接
connection.connect((err) => {
    if (err) {
        console.error('连接数据库失败:', err);
        return;
    }
    console.log('成功连接到数据库');
});

// 登录接口
app.post('/account/login', (req, res) => {
    const { username, password } = req.body;

    // 使用预处理语句防止 SQL 注入
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    connection.execute(query, [username, password], (err, results) => {
        if (err) {
            return res.status(500).json({ message: '数据库错误', error: err });
        }
        if (results.length > 0) {
            // 登录成功
            res.status(200).json({ message: '登录成功', user: results[0] });
        } else {
            // 登录失败
            res.status(401).json({ message: '用户名或密码错误' });
        }
    });
});

// 启动服务器
const ip = '192.168.43.99'; // 或者使用具体的本机 IP 地址，例如 '192.168.1.100'

// 启动服务器，监听所有IP地址
app.listen(port, ip, () => {
    console.log(`服务器正在运行，访问 http://${ip}:${port}`);
});

