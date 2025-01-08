'''
Author: qiuzx
Date: 2024-12-23 14:57:22
LastEditors: qiuzx
Description: description
'''
import hashlib
import os
from termios import OPOST
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from file_handle.views.base import ApiResponse
from .models import User
from .serializers import UserHandleSerializer
from rest_framework.permissions import IsAuthenticated
def md5_hash(password):
    return hashlib.md5(password.encode('utf-8')).hexdigest()

def generate_token():
    return hashlib.sha256(os.urandom(32)).hexdigest()  

@api_view(['POST'])
def login(request):##登录
    username = request.data.get('username')
    password = request.data.get('password')
    try:
        user = User.objects.get(username=username)
        if user.password == md5_hash(password):
            token = generate_token()
            response = Response({'code': '0', 'message': '登录成功'})
            response['sid'] = f'{token}'  # 在 header 中添加 token
            return response
        else:
            return ApiResponse.error('用户名或密码错误')
    except User.DoesNotExist:
        return ApiResponse.error('用户不存在')

@api_view(['POST'])
def create_user(request):##创建用户
    serializer = UserHandleSerializer(data=request.data)
    if serializer.is_valid():
        serializer.validated_data['password'] = md5_hash(serializer.validated_data['password'])
        serializer.save()
        return ApiResponse.success('用户创建成功', serializer.data)
    return ApiResponse.error('用户创建失败', serializer.errors)

@api_view(['POST'])
def get_user(request, user_id=None):##获取用户信息
    if user_id is None:
        users = User.objects.all()
        serializer = UserHandleSerializer(users, many=True)
        return ApiResponse.success('获取用户信息成功', serializer.data)
    try:
        user = User.objects.get(pk=user_id)
        serializer = UserHandleSerializer(user)
        return ApiResponse.success('获取用户信息成功', serializer.data)
    except User.DoesNotExist:
        return ApiResponse.error('用户未找到')

@api_view(['PUT','POST'])
def update_user(request, user_id):##更新用户信息
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return ApiResponse.error('用户未找到')
    serializer = UserHandleSerializer(user, data=request.data, partial=True)##部分更新
    if serializer.is_valid():
        serializer.save()
        return ApiResponse.success('更新成功', serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE','POST'])
def delete_user(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
        user.delete()
        return ApiResponse.success('删除成功')
    except User.DoesNotExist:
        return ApiResponse.error('用户未找到')

@api_view(['POST'])
def modify_password(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
        password = request.data.get('password')
        user.password = md5_hash(password)
        user.save()
        return ApiResponse.success('密码修改成功')
    except User.DoesNotExist:
        return ApiResponse.error('用户未找到')

