'''
Author: qiuzx
Date: 2024-12-31 15:29:50
LastEditors: qiuzx
Description: description
'''
# file_handle/urls.py
from django.urls import path
from file_handle.controller.file_controller import FileContent
from file_handle.controller.project_handle_controller import (
    add_project, 
    update_project, 
    delete_project, 
    get_all_projects, 
    get_system_path,
    modify_system_path,
    get_children_tree
)

urlpatterns = [
    # 文件相关的 URL
    path('file/read/', FileContent.as_view(), name='file-content'),  # 文件读取接口

    # 项目相关的 URL
    path('project/get_all_projects', get_all_projects, name='project-list'),  # 获取所有项目
    path('project/add_project', add_project, name='project-add'),  # 添加项目
    path('project/update_project', update_project, name='project-update'),  # 更新项目
    path('project/delete_project', delete_project, name='project-delete'),  # 删除项目
    path('project/get_children_tree', get_children_tree, name='get_children_tree'),  # 获取子目录
    path('project/get_system_path', get_system_path, name='get_system_path'),  # 获取系统路径
    path('project/modify_system_path', modify_system_path, name='modify_system_path'),  # 修改系统路径
]
