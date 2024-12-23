'''
Author: qiuzx
Date: 2024-12-21 16:05:56
LastEditors: qiuzx
Description: description
'''
from django.urls import path
from .views import login_view

urlpatterns = [
    path('login/', login_view, name='login'),
]
