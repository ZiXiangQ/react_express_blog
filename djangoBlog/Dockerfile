FROM python:3.10-slim

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 添加清华 apt 源（注意是先创建 sources.list）
RUN echo "deb https://mirrors.tuna.tsinghua.edu.cn/debian bookworm main contrib non-free\n\
deb https://mirrors.tuna.tsinghua.edu.cn/debian bookworm-updates main contrib non-free\n\
deb https://mirrors.tuna.tsinghua.edu.cn/debian-security bookworm-security main contrib non-free\n\
deb https://mirrors.tuna.tsinghua.edu.cn/debian bookworm-backports main contrib non-free" > /etc/apt/sources.list \
    && apt-get update \
    && apt-get install -y \
        gcc \
        python3-dev \
        libpq-dev \
        libreoffice \
        libreoffice-writer \
        libreoffice-calc \
        libreoffice-impress \
    && rm -rf /var/lib/apt/lists/*

# 创建数据目录
RUN mkdir -p /app/data

# 复制项目文件
COPY . .

# 安装 Python 依赖
RUN pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple \
    && pip install -r requirements.txt

# 设置环境变量
ENV HOST_DATA_PATH=/Users/qiuzx/workspace/blog_doc
ENV CONTAINER_DATA_PATH=/app/data

# 暴露端口
EXPOSE 8000

# 启动命令
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
