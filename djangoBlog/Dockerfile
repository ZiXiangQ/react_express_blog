# 使用 Python 官方镜像
FROM python:3.10-slim

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 复制依赖文件
COPY requirements.txt .

# 安装 Python 依赖
RUN pip install --no-cache-dir -i https://mirrors.aliyun.com/pypi/simple/ --trusted-host mirrors.aliyun.com -r requirements.txt || \
    pip install --no-cache-dir --ignore-installed --no-deps -r requirements.txt

# 复制项目文件
COPY manage.py .
COPY djangoBlog/ djangoBlog/
COPY file_handle/ file_handle/
COPY search_engine/ search_engine/
COPY user_handle/ user_handle/
COPY common/ common/

# 创建必要的目录
RUN mkdir -p blog_temp_data

# 暴露端口
EXPOSE 8000

# 启动命令
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"] 
