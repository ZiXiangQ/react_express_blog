"""
文件处理 Pydantic 模式 - 对应 file_handle/serializers.py
"""
from pydantic import BaseModel
from typing import Optional


class ProjectCreate(BaseModel):
    project_name: str
    project_key: str
    visible_users: str


class ProjectUpdate(BaseModel):
    id: int
    project_name: Optional[str] = None
    project_key: Optional[str] = None
    visible_users: Optional[str] = None


class ProjectOut(BaseModel):
    id: int
    project_name: str
    project_key: str
    visible_users: str

    class Config:
        from_attributes = True


class SystemSettingOut(BaseModel):
    id: int
    system_config_path: str

    class Config:
        from_attributes = True


class SystemSettingModify(BaseModel):
    system_config_path: str


class FileReadRequest(BaseModel):
    file_path: str


class ProjectDeleteRequest(BaseModel):
    id: int


class ChildrenTreeRequest(BaseModel):
    project_key: str
