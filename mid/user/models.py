'''
Author: qiuzx
Date: 2024-12-21 11:38:07
LastEditors: qiuzx
'''
##模型层
# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    phone = models.CharField(max_length=15, unique=True, null=True, blank=True)

    def __str__(self):
        return self.username
