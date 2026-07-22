"""
搜索引擎路由 - 对应 search_engine/views.py + search_engine/urls.py
"""
from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.search_engine.indexing import get_base_dir_from_db, build_file_index
from app.search_engine.schemas import SearchRequest

router = APIRouter(prefix="/search_engine", tags=["搜索引擎"])

# 全局文件索引缓存
FILE_INDEX = None


def ensure_index_loaded(db: Session):
    global FILE_INDEX
    if FILE_INDEX is None:
        print("[indexing] Loading file index...")
        base_dir = get_base_dir_from_db(db)
        if base_dir:
            FILE_INDEX = build_file_index(base_dir)
            print(f"[indexing] Indexed {len(FILE_INDEX)} files.")
        else:
            FILE_INDEX = []
            print("[indexing] Failed to load file index.")
    else:
        print("[indexing] Index already loaded.")


@router.post("/search_files")
def search_files(request: SearchRequest, db: Session = Depends(get_db)):
    """搜索文件"""
    ensure_index_loaded(db)
    keyword = request.keyword.lower()
    results = []

    for item in FILE_INDEX:
        if keyword in item["filename"].lower():
            results.append({
                "filename": item["filename"],
                "project": item["project"],
                "route": item["route"],
                "full_path": item["full_path"],
                "type": item["type"],
                "update_time": datetime.fromtimestamp(item["update_time"]).strftime("%Y-%m-%d %H:%M:%S")
            })
            if len(results) >= 20:
                break

    print(f"[search] Found {len(results)} results")
    return {"code": 0, "data": results}

