'''
Author: qiuzx
Date: 2024-12-31 15:21:50
LastEditors: qiuzx
Description: description
'''
from django.contrib import admin

# Register your models here.
from . import models

admin.site.register(models.Project)
