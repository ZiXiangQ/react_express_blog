"""
项目服务层 - 对应 file_handle/services/project_service.py
"""
import os
from pathlib import Path
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.file_handle.models import Project, SystemSetting
from app.file_handle.schemas import ProjectOut, SystemSettingOut
from app.config import settings


class ProjectService:

    @staticmethod
    def add_project(data: dict, db: Session):
        project = Project(**data)
        db.add(project)
        db.commit()
        db.refresh(project)
        return True, ProjectOut.model_validate(project).model_dump()

    @staticmethod
    def update_project(pk: int, data: dict, db: Session):
        project = db.query(Project).filter(Project.id == pk).first()
        if not project:
            return False, "项目不存在"

        for key, value in data.items():
            if value is not None:
                setattr(project, key, value)

        db.commit()
        db.refresh(project)
        return True, ProjectOut.model_validate(project).model_dump()

    @staticmethod
    def delete_project(pk: int, db: Session):
        project = db.query(Project).filter(Project.id == pk).first()
        if not project:
            return False, "项目不存在"
        db.delete(project)
        db.commit()
        return True, "项目删除成功"

    @staticmethod
    def get_all_projects(db: Session):
        projects = db.query(Project).all()
        return [ProjectOut.model_validate(p).model_dump() for p in projects]

    @staticmethod
    def get_system_path(db: Session) -> str:
        sys_setting = db.query(SystemSetting).first()
        if not sys_setting:
            return ""
        return sys_setting.system_config_path

    @staticmethod
    def modify_system_path(data: dict, db: Session):
        try:
            sys_setting = db.query(SystemSetting).first()
            if not sys_setting:
                sys_setting = SystemSetting(
                    system_config_path=data.get('system_config_path', '')
                )
                db.add(sys_setting)
                db.commit()
                return 0, "success", "系统配置初始化成功"

            sys_setting.system_config_path = data.get(
                'system_config_path', sys_setting.system_config_path
            )
            db.commit()
            return 0, "success", "系统配置路径更新成功"
        except Exception as e:
            db.rollback()
            return -1, "error", str(e)

    @staticmethod
    def get_children_tree(path: str, db: Session):
        """
        遍历给定路径下的文件夹和文件，返回一个层级递进的字典结构。
        """
        sys_setting = db.query(SystemSetting).first()
        if not sys_setting:
            raise HTTPException(status_code=400, detail="系统配置不存在，请先配置系统路径")

        root_path = sys_setting.system_config_path
        if not root_path:
            raise HTTPException(status_code=400, detail="系统配置路径为空，请先配置系统路径")

        # 获取环境变量中的路径配置
        host_path = settings.HOST_DATA_PATH
        container_path = settings.CONTAINER_DATA_PATH

        # 如果路径是主机路径，转换为容器路径
        if host_path and root_path.startswith(host_path):
            root_path = root_path.replace(host_path, container_path)

        # 确保path是相对路径
        if path.startswith('/'):
            path = path[1:]

        project_path = os.path.join(root_path, path)
        if not os.path.exists(project_path):
            raise HTTPException(status_code=400, detail="路径不存在")

        def traverse_directory(current_path):
            folders = []
            files = []
            for entry in os.scandir(current_path):
                entry_path = Path(entry.path).resolve()
                if entry.is_dir() and entry.name != 'resource':
                    folder_data = {
                        'name': entry.name,
                        'path': str(entry_path),
                        'type': 'folder',
                        'children': traverse_directory(entry.path)
                    }
                    folders.append(folder_data)
                elif entry.is_file() and entry.name != '.DS_Store':
                    files.append({
                        'name': entry.name,
                        'path': str(entry_path),
                        'type': entry.name.split('.')[-1].lower(),
                    })
            folders.sort(key=lambda x: x['name'].lower())
            files.sort(key=lambda x: x['name'].lower())
            return folders + files

        return traverse_directory(project_path)
