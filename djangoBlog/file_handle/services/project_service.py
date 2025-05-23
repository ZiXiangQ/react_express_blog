'''
Author: qiuzx
Date: 2025-04-09 22:29:18
LastEditors: qiuzx
Description: file_handle/services.py
'''

import os
from file_handle.models import Project, SystemSetting
from file_handle.serializers import ProjectSerializer, SystemSettingSerializer
from rest_framework.exceptions import APIException
from pathlib import Path

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
        return serializer.data["system_config_path"]
    
    @staticmethod
    def modify_system_path(data):
        try:
            sysSetting = SystemSetting.objects.all().first()
            if not sysSetting:
                # 如果系统配置不存在，创建新的配置
                sysSetting = SystemSetting(
                    system_config_path=data.get('system_config_path', '')
                )
                sysSetting.save()
                return 0, "success", "系统配置初始化成功"
            # 更新系统配置路径
            sysSetting.system_config_path = data.get('system_config_path', sysSetting.system_config_path)
            sysSetting.save()
            return 0, "success", "系统配置路径更新成功"
        except Exception as e:
            return -1, "error", str(e)

    @staticmethod
    def get_children_tree(path):
        """
        遍历给定路径下的文件夹和文件，返回一个层级递进的字典结构。
        :param path: 需要遍历的根目录路径
        :return: 返回一个递进的字典，包含文件和文件夹的树形结构
        """        
        sysSetting = SystemSetting.objects.first()
        if not sysSetting:
            raise APIException('系统配置不存在，请先配置系统路径')

        root_path = sysSetting.system_config_path
        if not root_path:
            raise APIException('系统配置路径为空，请先配置系统路径')
        
        # 获取环境变量中的路径配置
        host_path = os.environ.get('HOST_DATA_PATH', '')
        container_path = os.environ.get('CONTAINER_DATA_PATH', '/app/data')
        
        # 如果路径是主机路径，转换为容器路径
        if host_path and root_path.startswith(host_path):
            root_path = root_path.replace(host_path, container_path)
        
        # 确保path是相对路径
        if path.startswith('/'):
            path = path[1:]
            
        project_path = os.path.join(root_path, path)
        if not os.path.exists(project_path):
            raise APIException('路径不存在')
        
        def traverse_directory(current_path):
            folders = []
            files = []
            for entry in os.scandir(current_path):
                entry_path = Path(entry.path).resolve()  # 获取绝对路径
                if entry.is_dir() and entry.name != 'resource':  # 如果是子文件夹，递归遍历 ##不遍历resource文件夹
                    folder_data = {
                        'name': entry.name,
                        'path': str(entry_path),
                        'type': 'folder',
                        'children': traverse_directory(entry.path)  # 递归处理子文件夹
                    }
                    folders.append(folder_data)
                elif entry.is_file() and entry.name != '.DS_Store':  # 如果是文件，添加文件名和相对路径
                    files.append({
                        'name': entry.name,
                        'path': str(entry_path),
                        'type': entry.name.split('.')[-1].lower(),
                    })
            folders.sort(key=lambda x: x['name'].lower())
            files.sort(key=lambda x: x['name'].lower())
            return folders + files
        file_data = traverse_directory(project_path)
        return file_data
