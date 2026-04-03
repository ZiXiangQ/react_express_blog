'''
Author: qiuzx
Date: 2026-03-13 21:43:27
LastEditors: qiuzx
Description: description
'''
"""
应用配置 - 对应 Django settings.py
"""
import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # 基础配置
    DEBUG: bool = os.environ.get('DEBUG', 'True') == 'True'
    SECRET_KEY: str = 'fastapi-insecure-7_1ridg6d7#@r#azd-a8=^aud%if)q^=vj!hcofjna%g1-7oa-'

    # 数据库配置
    DB_HOST: str = os.environ.get('DB_HOST', '127.0.0.1')
    DB_PORT: int = 3306
    DB_USER: str = 'root'
    DB_PASSWORD: str = 'WANGyan9059.'
    DB_NAME: str = 'express_user_db'

    @property
    def DATABASE_URL(self) -> str:
        return f"mysql+pymysql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    @property
    def ASYNC_DATABASE_URL(self) -> str:
        return f"mysql+aiomysql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    # Redis配置
    REDIS_HOST: str = os.environ.get('REDIS_HOST', '127.0.0.1')
    REDIS_PORT: int = int(os.environ.get('REDIS_PORT', '6379'))

    @property
    def REDIS_URL(self) -> str:
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/1"

    # CORS 配置
    CORS_ALLOWED_ORIGINS: list = [
        "http://localhost:3000",
        "http://127.0.0.1:8081",
        "http://localhost:8081",
        "http://localhost:80",
        "http://localhost",
        "http://192.168.43.99:3000",
        "http://192.168.43.99:8081",
        "http://172.20.10.2:8081",
    ]

    # 文件处理 API 基础 URL
    FILE_HANDLE_API_BASE: str = "http://127.0.0.1:8000"

    # 路径配置
    HOST_DATA_PATH: str = os.environ.get('HOST_DATA_PATH', '/Users/qiuzx/workspace/blog_doc')
    CONTAINER_DATA_PATH: str = os.environ.get('CONTAINER_DATA_PATH', '/app/data')

    class Config:
        env_file = ".env"


settings = Settings()
