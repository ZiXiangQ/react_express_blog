'''
Author: qiuzx
Date: 2025-04-14 14:13:42
LastEditors: qiuzx
Description: description
'''
from django.urls import path
from .views import search_files

urlpatterns = [
    path("search_files", search_files, name="search_files"),
]
