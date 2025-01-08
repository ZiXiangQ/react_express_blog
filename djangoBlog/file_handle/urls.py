'''
Author: qiuzx
Date: 2024-12-31 15:29:50
LastEditors: qiuzx
Description: description
'''

# file_handle/urls.py
from django.urls import path
from .views.views import FileList, FileContent
from .views.project_handle import get_all_files

urlpatterns = [
    path('files/', FileList.as_view(), name='file-list'),
    path('files/<path:file_path>/', FileContent.as_view(), name='file-content'),

    path('project', get_all_files, name='project-list'),
]
