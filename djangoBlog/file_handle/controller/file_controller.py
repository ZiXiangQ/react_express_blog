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
        file_path = request.data.get('file_path')
        base_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../data')
        sanitized_file_path = os.path.normpath(file_path).lstrip(os.sep)
        file_abs_path = os.path.join(base_path, sanitized_file_path)
        
        if not file_abs_path.startswith(base_path):
            raise ValueError("文件地址不存在")
        if not os.path.exists(file_abs_path):
            raise ValueError("文件不存在")
        
        file_type = file_path.split('.')[-1].lower()
        
        # 调用服务层方法处理文件内容
        content = FileService.read_file_content(file_abs_path, file_type)
        
        if isinstance(content, FileResponse):
            return content
        
        return ApiResponse.success(content)
