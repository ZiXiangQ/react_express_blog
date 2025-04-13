'''
Author: qiuzx
Date: 2024-12-31 15:21:50
LastEditors: qiuzx
Description: file_handle/controllers.py

'''

import os
from django.http import FileResponse
from rest_framework.exceptions import APIException
from rest_framework.views import APIView
from common.apiResponse import ApiResponse
from file_handle.services.file_service import FileService  # 导入服务层

class FileContent(APIView):
    def post(self, request):
        file_path = os.path.join( request.data.get('file_path'))
        if not os.path.exists(file_path):
            raise ValueError("文件地址不存在")
        file_type = file_path.split('.')[-1].lower()
        content = FileService.read_file_content(file_path, file_type)
        if isinstance(content, FileResponse):
            return content
        return ApiResponse.success('success',content)
