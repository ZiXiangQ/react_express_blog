#!/bin/bash
###
 # @Author: qiuzx
 # @Date: 2025-04-26 16:50:41
 # @LastEditors: qiuzx
 # @Description: description
### 
set -e

echo "==== 开始构建前端项目 ===="

# 进入前端目录
cd web

# 安装依赖并构建
echo "安装依赖..."
npm install

echo "构建前端..."
npm run build

# 打包 Docker 镜像
echo "==== 构建 Docker 镜像 ===="
docker build -t blog-frontend:latest .

echo "==== 前端构建完成 ===="
echo "你可以使用 docker-compose up -d 启动所有服务" 
