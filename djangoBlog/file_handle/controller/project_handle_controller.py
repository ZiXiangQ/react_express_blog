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
from file_handle.services.project_handle_service import ProjectService  # 导入服务层

@api_view(['POST'])
def add_project(request):
    success, result = ProjectService.add_project(request.data)
    if success:
        return ApiResponse.success("项目添加成功", result)
    return ApiResponse.error("添加失败", result)

@api_view(['POST'])
def update_project(request, pk):
    success, result = ProjectService.update_project(pk, request.data)
    if success:
        return ApiResponse.success("项目更新成功", result)
    return ApiResponse.error("更新失败", result)

@api_view(['DELETE'])
def delete_project(request, pk):
    success, message = ProjectService.delete_project(pk)
    if success:
        return ApiResponse.success(message)
    return ApiResponse.error(message)

@api_view(['GET'])
def get_all_files(request):
    project_data = ProjectService.get_all_projects()
    return ApiResponse.success("success", project_data)

@api_view(['POST'])
def get_children_tree(request):
    project_key = request.data.get('project_key')
    file_data = ProjectService.get_children_tree(project_key)
    return ApiResponse.success(file_data)
