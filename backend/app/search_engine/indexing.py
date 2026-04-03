"""
索引构建 - 对应 search_engine/indexing.py
"""
import os
from sqlalchemy.orm import Session
from app.file_handle.models import SystemSetting


def get_base_dir_from_db(db: Session) -> str:
    """直接从数据库获取系统路径，而非通过 API 调用"""
    try:
        sys_setting = db.query(SystemSetting).first()
        if sys_setting:
            return sys_setting.system_config_path
        return ""
    except Exception as e:
        print(f"[indexing] Error fetching base_dir from DB: {e}")
        return ""


def build_file_index(base_dir: str) -> list:
    """构建文件索引"""
    index = []
    if not base_dir or not os.path.exists(base_dir):
        return index

    for root, _, files in os.walk(base_dir):
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, base_dir)
            parts = rel_path.split(os.sep)
            if len(parts) < 2:
                continue
            project = parts[0]
            filename_no_ext = os.path.splitext(file)[0]
            route = f"/{project}/{filename_no_ext}"
            index.append({
                "filename": file,
                "project": project,
                "route": route,
                "full_path": full_path,
                "type": file.split('.')[-1].lower(),
                "update_time": os.path.getmtime(full_path)
            })
    return index
