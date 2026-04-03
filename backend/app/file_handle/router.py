"""
文件处理路由 - 对应 file_handle/controller/ + file_handle/urls.py
"""
import os
from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse as FastAPIFileResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.common.api_response import success_response, error_response, custom_response
from app.file_handle.services.project_service import ProjectService
from app.file_handle.services.file_service import FileService
from app.file_handle.schemas import (
    ProjectCreate, ProjectUpdate, ProjectDeleteRequest,
    SystemSettingModify, FileReadRequest, ChildrenTreeRequest
)

router = APIRouter(prefix="/file_handle", tags=["文件处理"])


# ============== 文件相关 ==============

@router.post("/file/read/")
def read_file(request: FileReadRequest, db: Session = Depends(get_db)):
    """文件读取接口"""
    file_path = request.file_path
    if not os.path.exists(file_path):
        return error_response("文件地址不存在")

    file_type = file_path.split('.')[-1].lower()

    # 获取系统路径用于 md 图片修复
    doc_root = ProjectService.get_system_path(db)

    content = FileService.read_file_content(file_path, file_type, doc_root)

    # 如果返回的是 FileResponse（PDF、图片等），直接返回
    if isinstance(content, FastAPIFileResponse):
        return content

    return success_response("success", content)


# ============== 项目相关 ==============

@router.post("/project/get_all_projects")
def get_all_projects(db: Session = Depends(get_db)):
    """获取所有项目"""
    project_data = ProjectService.get_all_projects(db)
    return success_response("success", project_data)


@router.post("/project/add_project")
def add_project(request: ProjectCreate, db: Session = Depends(get_db)):
    """添加项目"""
    data = request.model_dump()
    ok, result = ProjectService.add_project(data, db)
    if ok:
        return success_response("项目添加成功", result)
    return error_response("添加失败", result)


@router.post("/project/update_project")
def update_project(request: ProjectUpdate, db: Session = Depends(get_db)):
    """更新项目"""
    project_id = request.id
    update_data = request.model_dump(exclude={'id'}, exclude_unset=True)
    ok, result = ProjectService.update_project(project_id, update_data, db)
    if ok:
        return success_response("项目更新成功", result)
    return error_response("更新失败", result)


@router.post("/project/delete_project")
def delete_project(request: ProjectDeleteRequest, db: Session = Depends(get_db)):
    """删除项目"""
    ok, message = ProjectService.delete_project(request.id, db)
    if ok:
        return success_response(message)
    return error_response(message)


@router.post("/project/get_children_tree")
def get_children_tree(request: ChildrenTreeRequest, db: Session = Depends(get_db)):
    """获取子目录树"""
    file_data = ProjectService.get_children_tree(request.project_key, db)
    return success_response("success", file_data)


@router.post("/project/get_system_path")
def get_system_path(db: Session = Depends(get_db)):
    """获取系统路径"""
    sys_path = ProjectService.get_system_path(db)
    return success_response("success", sys_path)


@router.post("/project/modify_system_path")
def modify_system_path(request: SystemSettingModify, db: Session = Depends(get_db)):
    """修改系统路径"""
    code, message, sys_path = ProjectService.modify_system_path(request.model_dump(), db)
    return custom_response(code, message, sys_path)
