'''
Author: qiuzx
Date: 2024-12-23 14:56:54
LastEditors: qiuzx
Description: description
'''
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user_handle/', include('user_handle.urls')),  # 引用 user 应用的 URL 路由
]
