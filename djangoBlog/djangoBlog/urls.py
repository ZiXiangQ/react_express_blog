
import os
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.static import serve
from file_handle.services.file_service import ProjectService

def get_doc_root():
    try:
        return ProjectService.get_system_path()
    except:
        return None
    
def get_doc_url_prefix():
    try:
        doc_path = ProjectService.get_system_path()
        return os.path.basename(doc_path)
    except:
        return 'blog_doc'

urlpatterns = [
    # 使用配置的文档库路径
    re_path(rf'^{get_doc_url_prefix()}/(?P<path>.*)$', serve, {'document_root': get_doc_root}),
    path('admin/', admin.site.urls),
    path('user_handle/', include('user_handle.urls')),  # 引用 user 应用的 URL 路由
    path('file_handle/', include('file_handle.urls')),
    path('search_engine/', include('search_engine.urls')),
]
