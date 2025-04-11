'''
Author: qiuzx
Date: 2024-12-31 15:21:50
LastEditors: qiuzx
Description: description
'''
from django.db import models

class Project(models.Model):
    id = models.AutoField(primary_key=True)  # 自增主键
    project_name = models.CharField(max_length=255)  # 项目名称
    project_key = models.CharField(max_length=255)  # 项目标识
    visible_users = models.TextField()  # 可见人员（逗号分隔的用户名）

    class Meta:
        db_table = 'projects'

    def __str__(self):
        return self.project_name


# 新增表 SystemSetting
class SystemSetting(models.Model):
    id = models.AutoField(primary_key=True)  # 自增主键
    system_config_path = models.CharField(max_length=1024)  # 系统配置路径

    class Meta:
        db_table = 'system_settings'

    def __str__(self):
        return self.system_config_path
