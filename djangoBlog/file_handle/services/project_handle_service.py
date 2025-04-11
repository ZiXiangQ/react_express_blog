'''
Author: qiuzx
Date: 2025-04-09 22:29:18
LastEditors: qiuzx
Description: description
'''
# file_handle/services.py

import os
from file_handle.models import Project, SystemSetting
from file_handle.serializers import ProjectSerializer, SystemSettingSerializer
from rest_framework.exceptions import APIException

class ProjectService:
    @staticmethod
    def add_project(data):
        serializer = ProjectSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return True, serializer.data
        return False, serializer.errors

    @staticmethod
    def update_project(pk, data):
        try:
            project = Project.objects.get(pk=pk)
        except Project.DoesNotExist:
            return False, "项目不存在"

        serializer = ProjectSerializer(project, data=data)
        if serializer.is_valid():
            serializer.save()
            return True, serializer.data
        return False, serializer.errors

    @staticmethod
    def delete_project(pk):
        try:
            project = Project.objects.get(pk=pk)
            project.delete()
            return True, "项目删除成功"
        except Project.DoesNotExist:
            return False, "项目不存在"

    @staticmethod
    def get_all_projects():
        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        return serializer.data
    
    @staticmethod
    def get_system_path():
        sysSetting = SystemSetting.objects.first()
        serializer = SystemSettingSerializer(sysSetting)
        return serializer.data
    
    @staticmethod
    def modify_system_path(data):
        try:
            # 假设每个项目只有一个系统配置路径
            sysSetting = SystemSetting.objects.all().first()
            if not sysSetting:
                return False, "系统配置不存在"
            # 更新系统配置路径
            sysSetting.system_config_path = data.get('system_config_path', sysSetting.system_config_path)
            sysSetting.save()
            return True, "系统配置路径更新成功"
        except Exception as e:
            return False, str(e)

    @staticmethod
    def get_children_tree(project_key):
        # 定义根目录
        data_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../data', project_key)
        file_data = {}
        if not os.path.exists(data_path):
            raise APIException('项目不存在')
        
        for subdir, dirs, files in os.walk(data_path):
            folder_name = os.path.basename(subdir)
            # 如果文件夹名不在数据中，初始化该键
            if folder_name not in file_data:
                file_data[folder_name] = []
            for file in files:
                file_path = os.path.relpath(os.path.join(subdir, file), start=data_path)
                file_data[folder_name].append({
                    'name': file.split('.')[0].strip(),
                    'path': file_path,
                })
        return file_data
