"""
统一 API 响应格式 - 对应 common/apiResponse.py
"""
from typing import Any, Optional


def success_response(message: str, data: Any = None) -> dict:
    return {
        "code": 0,
        "message": message,
        "data": data if data is not None else {}
    }


def error_response(message: str, data: Any = None) -> dict:
    return {
        "code": -1,
        "message": message,
        "data": data if data is not None else {}
    }


def custom_response(code: int, message: str, data: Any = None) -> dict:
    return {
        "code": code,
        "message": message,
        "data": data if data is not None else {}
    }
