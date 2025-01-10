'''
Author: qiuzx
Date: 2024-12-31 15:29:50
LastEditors: qiuzx
Description: description
'''

# file_handle/urls.py
from django.urls import path
from .views.file_read import FileContent
from .views.project_handle import get_all_files, get_children_tree

urlpatterns = [
    path('file_read', FileContent.as_view(), name='file-content'),

    path('project', get_all_files, name='project-list'),
    path('project/get_children_tree', get_children_tree, name='get_children_tree')
]
