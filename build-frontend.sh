#!/bin/bash
###
 # @Author: qiuzx
 # @Date: 2025-04-26 16:50:41
 # @LastEditors: qiuzx
 # @Description: 构建前后端Docker镜像
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

# 打包前端 Docker 镜像
echo "==== 构建前端 Docker 镜像 ===="
docker build -t blog-frontend:latest .

echo "==== 前端构建完成 ===="

# 构建后端 Docker 镜像
echo "==== 开始构建后端项目 ===="
cd ../djangoBlog

# 构建后端 Docker 镜像
echo "==== 构建后端 Docker 镜像 ===="
docker build -t blog-backend:latest .

echo "==== 后端构建完成 ===="

echo "==== 所有服务构建完成 ===="
echo "你可以使用 docker-compose up -d 启动所有服务" 
