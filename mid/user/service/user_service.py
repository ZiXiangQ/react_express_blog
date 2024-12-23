'''
Author: qiuzx
Date: 2024-12-21 11:58:56
LastEditors: qiuzx
Description: description
'''
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed

def login_user(username, password):
    user = authenticate(username=username, password=password)
    if not user:
        raise AuthenticationFailed('Invalid username or password')
    return {
        "username": user.username,
        "email": user.email,
    }
