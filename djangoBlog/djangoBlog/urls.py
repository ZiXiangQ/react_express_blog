'''
Author: qiuzx
Date: 2024-12-23 14:56:54
LastEditors: qiuzx
Description: api 路由
'''
from django.contrib import admin
from django.urls import path, include
from django.urls import re_path
from django.views.static import serve

urlpatterns = [
    re_path(r'^mockdata/(?P<path>.*)$', serve, {'document_root': '/Users/qiuzx/workspace/react_diango_blog/mockdata'}),
    path('admin/', admin.site.urls),
    path('user_handle/', include('user_handle.urls')),  # 引用 user 应用的 URL 路由
    path('file_handle/', include('file_handle.urls')),
    path('search_engine/', include('search_engine.urls')),

]
