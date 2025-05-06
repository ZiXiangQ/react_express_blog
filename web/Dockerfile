# frontend/Dockerfile
FROM nginx:alpine

# 复制本地构建的 dist/ (或者 build/) 到 nginx html 目录
COPY dist/ /usr/share/nginx/html/

# 创建自定义nginx配置文件来支持前端路由
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
