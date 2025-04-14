'''
Author: qiuzx
Date: 2025-04-14 14:12:21
LastEditors: qiuzx
Description: 索引文件
'''
import os
import requests
from django.conf import settings


def get_base_dir_from_api():
    try:
        base_url = f"{settings.FILE_HANDLE_API_BASE}/file_handle/project/get_system_path"
        response = requests.post(base_url, timeout=10)
        response.raise_for_status()
        data = response.json()
        if data.get("code") == 0:  # 检查API返回的状态码
            print(data.get("data"),'data')
            return data.get("data", "")
        return None
    except Exception as e:
        print(f"[indexing] Error fetching base_dir from API: {e}")
        return None

def build_file_index(base_dir):
    index = []
    for root, _, files in os.walk(base_dir):
        for file in files:
            if not file.endswith(".md"):
                continue
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
                "full_path": full_path
            })
    return index

