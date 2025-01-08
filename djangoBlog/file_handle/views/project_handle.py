'''
Author: qiuzx
Date: 2025-01-07 16:19:23
LastEditors: qiuzx
Description: description
'''
# file_handle/views.py
import os
from django.http import HttpResponse, FileResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.exceptions import APIException
from file_handle.models import Project
from file_handle.serializers import ProjectSerializer
from .base import ApiResponse

@api_view(['GET'])
def get_all_files(request):
  project_data = Project.objects.all()
  serializer = ProjectSerializer(project_data, many=True)
  return ApiResponse.success('success', serializer.data)
  