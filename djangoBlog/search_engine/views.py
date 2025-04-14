'''
Author: qiuzx
Date: 2025-04-14 14:11:06
LastEditors: qiuzx
Description: description
'''

# Create your views here.
from django.http import JsonResponse
from rest_framework.decorators import api_view
from .indexing import get_base_dir_from_api, build_file_index

FILE_INDEX = None

def ensure_index_loaded():
    global FILE_INDEX
    if FILE_INDEX is None:
        print("[indexing] Loading file index...")
        base_dir = get_base_dir_from_api()
        if base_dir:
            FILE_INDEX = build_file_index(base_dir)
            print(f"[indexing] Indexed {len(FILE_INDEX)} files.")
        else:
            FILE_INDEX = []
            print("[indexing] Failed to load file index.")
    else:
        print("[indexing] Index already loaded.")


@api_view(['POST'])
def search_files(request):
    ensure_index_loaded()  # 确保索引已加载
    keyword = request.data.get('keyword', '').lower()
    results = []
    print(f"[search] Searching for keyword: {keyword}")
    print(f"[search] Current index size: {FILE_INDEX}")
    
    for item in FILE_INDEX:
        print(f"[search] Checking file: {item['filename']}")
        if keyword in item["filename"].lower():
            results.append({
                "filename": item["filename"],
                "project": item["project"],
                "route": item["route"],
                "full_path": item["full_path"]
            })
            if len(results) >= 20:
                break
    
    print(f"[search] Found {len(results)} results")
    return JsonResponse({"code": 0, "data": results}, safe=False)
