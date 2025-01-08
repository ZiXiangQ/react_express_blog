'''
Author: qiuzx
Date: 2025-01-07 18:23:52
LastEditors: qiuzx
Description: description
'''
from rest_framework.response import Response

class ApiResponse:
    @staticmethod
    def success(message, data=None):
        return Response({
            'code': '0',
            'message': message,
            'data': data or {}
        })

    @staticmethod
    def error(message, data=None):
        return Response({
            'code': 'error',
            'message': message,
            'data': data or {}
        })

    @staticmethod
    def custom(code, message, data=None):
        return Response({
            'code': code,
            'message': message,
            'data': data or {}
        })
