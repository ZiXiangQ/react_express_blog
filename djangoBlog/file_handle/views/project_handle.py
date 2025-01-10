'''
Author: qiuzx
Date: 2025-01-07 16:19:23
LastEditors: qiuzx
Description: description
'''
# file_handle/views.py
import os
from django.http import HttpResponse, FileResponse, JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from file_handle.models import Project
from file_handle.serializers import ProjectSerializer
from .base import ApiResponse

@api_view(['GET'])
def get_all_files(request): ##获取当前顶部项目列表
  project_data = Project.objects.all()
  serializer = ProjectSerializer(project_data, many=True)
  return ApiResponse.success('success', serializer.data)

@api_view(['POST'])
def get_children_tree(request): ##获取当前项目下的文件列表
    # 定义根目录
    project_key = request.data.get('project_key')
    data_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../data', project_key)
    print(data_path)
    print(os.path.exists(data_path))
    file_data = {}
    if not os.path.exists(data_path):
        return JsonResponse({'error': '项目不存在'})
    for subdir, dirs, files in os.walk(data_path):
        folder_name = os.path.basename(subdir)
        # 如果文件夹名不在数据中，初始化该键
        print(folder_name, project_key,'1111')
        if folder_name not in file_data:
            file_data[folder_name] = []
        for file in files:
            file_path = os.path.relpath(os.path.join(subdir, file), start=data_path)
            file_data[folder_name].append({
                'name': file.split('.')[0].strip(),
                'path': file_path,
            })
    return ApiResponse.success('success', file_data)

