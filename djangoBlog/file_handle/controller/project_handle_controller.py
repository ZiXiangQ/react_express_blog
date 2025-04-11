'''
Author: qiuzx
Date: 2025-04-09 22:28:21
LastEditors: qiuzx
Description: description
'''
# file_handle/controllers.py

import os
from rest_framework.decorators import api_view
from common.apiResponse import ApiResponse
from file_handle.services.project_handle_service import ProjectService

@api_view(['POST'])
def add_project(request):
    success, result = ProjectService.add_project(request.data)
    if success:
        return ApiResponse.success("项目添加成功", result)
    return ApiResponse.error("添加失败", result)

@api_view(['PUT', 'POST'])
def update_project(request):
    project_id = request.data.get('id')
    if not project_id:
        return ApiResponse.error("缺少项目ID")
    update_data = request.data.copy()
    update_data.pop('id', None)
    success, result = ProjectService.update_project(project_id, update_data)
    if success:
        return ApiResponse.success("项目更新成功", result)
    return ApiResponse.error("更新失败", result)

@api_view(['DELETE', 'POST'])
def delete_project(request):
    project_id = request.data.get('id')
    if not project_id:
        return ApiResponse.error("缺少项目ID")
    success, message = ProjectService.delete_project(project_id)
    if success:
        return ApiResponse.success(message)
    return ApiResponse.error(message)

@api_view(['GET','POST'])
def get_all_projects(request):
    project_data = ProjectService.get_all_projects()
    return ApiResponse.success("success", project_data)

@api_view(['GET'])
def get_system_path(request):
    sys_path = ProjectService.get_system_path()
    return ApiResponse.success("success", sys_path)

@api_view(['POST'])
def modify_system_path(request):
    sys_id = request.data.get('id')
    if not sys_id:
        return ApiResponse.error("缺少系统ID")
    sys_path = ProjectService.modify_system_path(request.data)
    if sys_path:
        return ApiResponse.error("更新失败", sys_path)

@api_view(['POST'])
def get_children_tree(request):
    project_key = request.data.get('project_key')
    file_data = ProjectService.get_children_tree(project_key)
    return ApiResponse.success(file_data)
