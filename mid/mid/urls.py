'''
Author: qiuzx
Date: 2024-12-21 16:06:52
LastEditors: qiuzx
Description: description
'''
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/', include('user.urls')),  # 包含 user_service 的 URLs
]
