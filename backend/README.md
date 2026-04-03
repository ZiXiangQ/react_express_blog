# FastAPI Blog Backend

Django 博客后端的 FastAPI 重写版本，功能完全一致。

## 项目结构

```
fastapiBlog/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI 主入口（对应 manage.py + urls.py）
│   ├── config.py             # 配置文件（对应 settings.py）
│   ├── database.py           # 数据库连接（对应 Django ORM 连接）
│   ├── common/
│   │   ├── __init__.py
│   │   └── api_response.py   # 统一响应格式（对应 common/apiResponse.py）
│   ├── user_handle/
│   │   ├── __init__.py
│   │   ├── models.py         # 用户模型（SQLAlchemy）
│   │   ├── schemas.py        # 请求/响应模式（对应 serializers.py）
│   │   └── router.py         # 路由（对应 views.py + urls.py）
│   ├── file_handle/
│   │   ├── __init__.py
│   │   ├── models.py         # 文件相关模型
│   │   ├── schemas.py        # 请求/响应模式
│   │   ├── router.py         # 路由（对应 controller/ + urls.py）
│   │   └── services/
│   │       ├── __init__.py
│   │       ├── file_service.py        # 文件服务
│   │       ├── project_service.py     # 项目服务
│   │       └── libreoffice_service.py # LibreOffice转换服务
│   └── search_engine/
│       ├── __init__.py
│       ├── indexing.py        # 文件索引构建
│       ├── schemas.py         # 请求模式
│       └── router.py          # 搜索路由
├── requirements.txt
├── Dockerfile
├── start.sh
└── README.md
```

## 快速启动

### 1. 创建虚拟环境

```bash
cd fastapiBlog
python3 -m venv venv
source venv/bin/activate
```

### 2. 安装依赖

```bash
pip install -r requirements.txt
```

### 3. 运行（开发模式）

```bash
# 方式一：直接运行
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

# 方式二：使用启动脚本
bash start.sh
```

### 4. Docker 部署

```bash
docker build -t blog-fastapi-backend:latest .
docker run -p 8000:8000 blog-fastapi-backend:latest
```

## API 文档

FastAPI 自动生成交互式 API 文档：

- Swagger UI: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc

## API 对照表

| Django 原接口 | FastAPI 新接口 | 说明 |
|---|---|---|
| `POST /user_handle/login` | `POST /user_handle/login` | 登录 |
| `POST /user_handle/create` | `POST /user_handle/create` | 创建用户 |
| `POST /user_handle/get_all_user` | `POST /user_handle/get_all_user` | 获取所有用户 |
| `POST /user_handle/<id>` | `POST /user_handle/{user_id}` | 获取用户信息 |
| `POST /user_handle/<id>/update` | `POST /user_handle/{user_id}/update` | 更新用户 |
| `POST /user_handle/<id>/delete` | `POST /user_handle/{user_id}/delete` | 删除用户 |
| `POST /user_handle/<id>/modify_password` | `POST /user_handle/{user_id}/modify_password` | 修改密码 |
| `POST /file_handle/file/read/` | `POST /file_handle/file/read/` | 读取文件 |
| `POST /file_handle/project/get_all_projects` | `POST /file_handle/project/get_all_projects` | 获取所有项目 |
| `POST /file_handle/project/add_project` | `POST /file_handle/project/add_project` | 添加项目 |
| `POST /file_handle/project/update_project` | `POST /file_handle/project/update_project` | 更新项目 |
| `POST /file_handle/project/delete_project` | `POST /file_handle/project/delete_project` | 删除项目 |
| `POST /file_handle/project/get_children_tree` | `POST /file_handle/project/get_children_tree` | 获取目录树 |
| `POST /file_handle/project/get_system_path` | `POST /file_handle/project/get_system_path` | 获取系统路径 |
| `POST /file_handle/project/modify_system_path` | `POST /file_handle/project/modify_system_path` | 修改系统路径 |
| `POST /search_engine/search_files` | `POST /search_engine/search_files` | 搜索文件 |

## 与 Django 版本的对应关系

| Django 概念 | FastAPI 对应 |
|---|---|
| `settings.py` | `app/config.py` (Pydantic Settings) |
| `models.py` (Django ORM) | `models.py` (SQLAlchemy) |
| `serializers.py` (DRF) | `schemas.py` (Pydantic) |
| `views.py` / `controller/` | `router.py` (APIRouter) |
| `urls.py` | `router.py` (前缀 + include_router) |
| `services/` | `services/` (保持一致) |
| `common/apiResponse.py` | `common/api_response.py` |
| Django Middleware | FastAPI Middleware |
| `manage.py runserver` | `uvicorn app.main:app` |
