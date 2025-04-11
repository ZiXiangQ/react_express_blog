'''
Author: qiuzx
Date: 2025-01-07 16:34:58
LastEditors: qiuzx
Description: description
'''
from rest_framework import serializers
from .models import Project ,SystemSetting

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project  # 关联到 Project 模型
        fields = ['id', 'project_name', 'project_key', 'visible_users']  # 指定需要序列化的字段

class SystemSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSetting  # 关联到 System 模型
        fields = ['id', 'system_config_path']  # 指定需要序列化的字段
