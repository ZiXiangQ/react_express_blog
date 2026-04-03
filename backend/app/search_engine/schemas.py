"""
搜索引擎 Pydantic 模式
"""
from pydantic import BaseModel


class SearchRequest(BaseModel):
    keyword: str = ""
