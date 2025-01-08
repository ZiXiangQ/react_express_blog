'''
Author: qiuzx
Date: 2025-01-07 16:34:58
LastEditors: qiuzx
Description: description
'''
from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project  # 关联到 Project 模型
        fields = ['id', 'project_name', 'project_key', 'visible_users']  # 指定需要序列化的字段
