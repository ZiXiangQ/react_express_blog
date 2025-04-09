'''
Author: qiuzx
Date: 2024-12-23 19:22:47
LastEditors: qiuzx
Description: description
'''
from rest_framework import serializers
from .models import User

class UserHandleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'  
