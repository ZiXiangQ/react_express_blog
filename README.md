# React Django 知识库网站

一个基于 React + Django 构建的现代化知识库网站，提供文章管理、用户认证、评论互动等功能。

## 功能特性

- 📝 文章管理：支持 Markdown 格式、PDF、word、excel、格式展示
- 🔍 搜索功能：全文搜索、标签筛选
- 👥 用户系统：个人中心
- 🌙 主题切换：支持明暗主题切换
- 🔐 权限控制：基于角色的访问控制

## 技术栈

### 前端
- React 18
- TypeScript
- Tailwind CSS
- Ant Design
- Redux Toolkit
- React Router
- Axios

### 后端
- Django 4.x
- Django REST framework
- PostgreSQL
- Redis
- Celery

## 开发环境搭建

### 前端开发环境

1. 进入前端目录：
```bash
cd web
```

2. 安装依赖：
```bash
npm install
```

3. 创建环境变量文件：
```bash
cp .env.example .env
```

4. 启动开发服务器：
```bash
npm run dev
```

### 后端开发环境

1. 创建并激活虚拟环境：
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或
.\venv\Scripts\activate  # Windows
```

2. 安装依赖：
```bash
pip install -r requirements.txt
```

3. 配置数据库：
```bash
python manage.py migrate
```

4. 创建超级用户：
```bash
python manage.py createsuperuser
```

5. 启动开发服务器：
```bash
python manage.py runserver
```

## 部署说明

### 前端部署

1. 构建生产版本：
```bash
cd web
npm run build
```

2. 将 `dist` 目录下的文件部署到 Nginx 或其他 Web 服务器

### 后端部署

1. 配置生产环境变量：
```bash
cp .env.example .env.prod
```

2. 收集静态文件：
```bash
python manage.py collectstatic
```

3. 使用 Gunicorn 运行 Django 应用：
```bash
gunicorn config.wsgi:application
```

4. 配置 Nginx 反向代理

### Docker 部署

1. 构建镜像：
```bash
docker-compose build
```

2. 启动服务：
```bash
docker-compose up -d
```

## 项目结构

```
.
├── web/                # 前端项目
│   ├── src/           # 源代码
│   ├── public/        # 静态资源
│   └── package.json   # 依赖配置
│
├── backend/           # 后端项目
│   ├── apps/         # Django 应用
│   ├── config/       # 项目配置
│   └── requirements.txt
│
└── docker-compose.yml # Docker 配置
```

## 贡献指南

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -m 'Add some feature'`
4. 推送到分支：`git push origin feature/your-feature`
5. 提交 Pull Request

## 许可证

MIT License
