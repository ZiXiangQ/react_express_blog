'''
Author: qiuzx
Date: 2024-12-23 15:15:26
LastEditors: qiuzx
Description: description
'''
from django.urls import path
from user_handle.views import create_user, login, update_user, delete_user, get_user, modify_password

urlpatterns = [
    path('login', login, name='login'),
    path('create', create_user, name='create_user'),
    path('<int:user_id>/update', update_user, name='update_user'),
    path('<int:user_id>/delete', delete_user, name='delete_user'),
    path('<int:user_id>', get_user, name='get_user'),
    path('get_all_user', get_user, name='get_all_user'),
    path('<int:user_id>/modify_password', modify_password, name='modify_password')
]
