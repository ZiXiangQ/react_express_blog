"""
FastAPI 主入口 - 对应 Django manage.py + djangoBlog/urls.py
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.user_handle.router import router as user_router
from app.file_handle.router import router as file_router
from app.search_engine.router import router as search_router
from app.file_handle.models import SystemSetting

# 创建所有表（对应 Django migrate）
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Django Blog - FastAPI Version",
    description="博客后端 API，使用 FastAPI 重写",
    version="3.0.0",
    debug=settings.DEBUG
)

# CORS 中间件 - 对应 django-cors-headers
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["authorization", "content-type", "x-csrftoken", "x-requested-with"],
    expose_headers=["sid"],  # 暴露自定义header，前端才能读取 response.headers.sid
)


def get_doc_root():
    """获取文档库根路径 - 对应 Django urls.py 中的 get_doc_root"""
    try:
        db = SessionLocal()
        sys_setting = db.query(SystemSetting).first()
        db.close()
        if sys_setting:
            return sys_setting.system_config_path
        return None
    except Exception:
        return None


def get_doc_url_prefix():
    """获取文档 URL 前缀 - 对应 Django urls.py 中的 get_doc_url_prefix"""
    try:
        doc_path = get_doc_root()
        if doc_path:
            return os.path.basename(doc_path)
        return 'blog_doc'
    except Exception:
        return 'blog_doc'


@app.on_event("startup")
def startup_event():
    """启动时挂载静态文件目录 - 对应 Django re_path serve"""
    doc_root = get_doc_root()
    if doc_root and os.path.exists(doc_root):
        url_prefix = get_doc_url_prefix()
        app.mount(
            f"/{url_prefix}",
            StaticFiles(directory=doc_root),
            name="doc_files"
        )
        print(f"[startup] Mounted static files: /{url_prefix} -> {doc_root}")
    else:
        print("[startup] No doc root found, skipping static files mount.")


# 注册路由 - 对应 Django include urls
app.include_router(user_router)
app.include_router(file_router)
app.include_router(search_router)


@app.get("/")
def root():
    return {"message": "FastAPI Blog Backend is running!"}
