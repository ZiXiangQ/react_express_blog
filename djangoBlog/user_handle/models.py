'''
Author: qiuzx
Date: 2024-12-23 14:57:22
LastEditors: qiuzx
Description: description
'''
# Create your models here.
from django.db import models

class User(models.Model):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.username
