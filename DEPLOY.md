# 博客项目 Docker 部署指南

## 1. 本地构建

### 准备工作
- 确保已安装 Docker 和 Docker Compose
- 确保项目文件结构完整
- 检查 `.env` 文件，确保数据库配置正确

### 构建镜像

#### 1. 前端构建
首先在本地构建前端项目并打包 Docker 镜像：

```bash
# 给构建脚本添加执行权限
chmod +x build-frontend.sh

# 运行构建脚本
./build-frontend.sh
```

这个脚本会：
- 在本地使用 Node.js 构建前端项目
- 将构建好的 dist 目录打包到 Docker 镜像中

#### 2. 后端构建
构建后端和其他服务的 Docker 镜像：

```bash
# 构建后端镜像
docker-compose build backend
```

如果构建成功，会生成以下镜像：
- `blog-frontend:latest`
- `blog-backend:latest`

### 保存镜像

```bash
# 保存前端镜像到文件
docker save -o blog-frontend.tar blog-frontend:latest

# 保存后端镜像到文件
docker save -o blog-backend.tar blog-backend:latest

# 保存 Redis 镜像（可选，也可以在 NAS 上直接拉取）
docker save -o redis.tar redis:6-alpine

# 保存 MySQL 镜像（可选，也可以在 NAS 上直接拉取）
docker save -o mysql.tar mysql:8.0
```

## 2. 威联通 NAS 部署

### 准备工作
- 确保威联通 NAS 已安装 Docker 和 Docker Compose
- 创建部署目录

### 部署步骤

1. 将镜像文件、`.env` 文件和 docker-compose.prod.yml 文件上传到 NAS

2. 编辑 `.env` 文件，设置正确的环境变量：
```
# 注意修改 DB_HOST 为 mysql，使用容器名称而不是 localhost
DB_HOST=mysql
# 如果需要修改 NAS 的 IP 地址，请在 DJANGO_ALLOWED_HOSTS 中添加
DJANGO_ALLOWED_HOSTS=nas的IP地址 localhost 127.0.0.1 [::1]
```

3. SSH 连接到 NAS，执行以下命令：

```bash
# 进入部署目录
cd /share/Container/blog

# 加载镜像
docker load -i blog-frontend.tar
docker load -i blog-backend.tar
docker load -i redis.tar
docker load -i mysql.tar

# 创建数据目录
mkdir -p blog_temp_data
mkdir -p redis_data
mkdir -p mysql_data

# 启动服务
docker-compose -f docker-compose.prod.yml up -d
```

4. 访问应用
- 前端：http://nas的IP:80
- 后端：http://nas的IP:8000

## 3. 维护命令

```bash
# 查看日志
docker-compose -f docker-compose.prod.yml logs -f

# 查看特定服务的日志
docker-compose -f docker-compose.prod.yml logs -f backend

# 重启服务
docker-compose -f docker-compose.prod.yml restart

# 停止服务
docker-compose -f docker-compose.prod.yml down

# 更新镜像后重新部署
docker-compose -f docker-compose.prod.yml up -d
```

## 4. 数据库管理

### 初始化数据库
如果你需要初始化数据库或运行迁移：

```bash
# 进入后端容器
docker-compose -f docker-compose.prod.yml exec backend bash

# 运行迁移
python manage.py migrate

# 创建超级用户（如果需要）
python manage.py createsuperuser
```

### 数据备份与恢复
MySQL 数据库的备份与恢复：

```bash
# 备份
docker-compose -f docker-compose.prod.yml exec mysql mysqldump -u root -pWANGyan9059. express_user_db > backup.sql

# 恢复
docker-compose -f docker-compose.prod.yml exec -T mysql mysql -u root -pWANGyan9059. express_user_db < backup.sql
```

## 5. 故障排查

### 镜像拉取失败
如果在 NAS 上遇到网络问题无法拉取镜像，请使用上述"保存镜像"和"加载镜像"的方法。

### 容器启动失败
- 检查日志：`docker-compose -f docker-compose.prod.yml logs [服务名]`
- 确认端口没有冲突
- 检查 NAS 的防火墙设置

### 数据库连接问题
- 检查后端日志：`docker-compose -f docker-compose.prod.yml logs backend`
- 确保 MySQL 容器已经启动：`docker-compose -f docker-compose.prod.yml ps mysql`
- 检查 `.env` 文件中的数据库配置是否正确
- 检查 MySQL 数据是否正确初始化
- 如果 MySQL 初始化失败，可能需要删除 mysql_data 目录并重新创建

### 前端构建问题
- 如果前端构建失败，检查 Node.js 版本是否兼容
- 尝试手动构建：`cd web && npm install && npm run build`
- 确保 dist 目录已经生成并且包含所有必要的文件

### 前后端连接问题
- 确保在前端代码中的 API 请求使用了正确的后端地址
- 检查 `.env` 文件中的 DJANGO_ALLOWED_HOSTS 环境变量是否包含了正确的主机名
