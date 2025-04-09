'''
Author: qiuzx
Date: 2024-12-23 14:56:54
LastEditors: qiuzx
Description: api 路由
'''
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user_handle/', include('user_handle.urls')),  # 引用 user 应用的 URL 路由
    path('file_handle/', include('file_handle.urls'))
]
