'''
Author: qiuzx
Date: 2024-04-16
LastEditors: qiuzx
Description: PPT文件处理服务
'''
import os
import subprocess
import shutil
from django.http import FileResponse
from urllib.parse import quote
from rest_framework.exceptions import APIException
import hashlib

class libreOfficeService:
    CACHE_DIR = 'blog_temp_data/pdf_cache'  # PDF缓存目录

    @staticmethod
    def ensure_cache_dir():
        if not os.path.exists(libreOfficeService.CACHE_DIR):
            os.makedirs(libreOfficeService.CACHE_DIR)

    @staticmethod
    def get_cache_path(file_path):
        # 使用文件路径和最后修改时间生成唯一的缓存文件名
        file_stat = os.stat(file_path)
        cache_key = f"{file_path}_{file_stat.st_mtime}"
        cache_name = hashlib.md5(cache_key.encode()).hexdigest() + '.pdf'
        return os.path.join(libreOfficeService.CACHE_DIR, cache_name)
    
    @staticmethod
    def create_pdf_response(pdf_path, original_file_path):
        response = FileResponse(
            open(pdf_path, 'rb'),
            content_type='application/pdf'
        )
        response['Content-Disposition'] = (
            f'inline; filename="{os.path.basename(original_file_path)}.pdf"; '
            f'filename*=UTF-8\'\'{quote(os.path.basename(original_file_path))}.pdf'
        )
        return response
    
    @staticmethod
    def get_libreoffice_path():
        libreoffice_paths = [
            '/Applications/LibreOffice.app/Contents/MacOS/soffice',  # macOS
            '/usr/bin/soffice',  # Linux
            '/usr/local/bin/soffice',  # 其他可能的路径
            'soffice'  # PATH中的soffice
        ]
        soffice = None
        for path in libreoffice_paths:
            if os.path.exists(path) or shutil.which(path):
                soffice = path
                break
                
        if not soffice:
            raise Exception("未找到 LibreOffice，请先安装 LibreOffice")
        return soffice


    @staticmethod
    def convert_to_pdf(file_path):
        """将PPT转换为PDF，如果有缓存则直接返回缓存"""
        try:
            libreOfficeService.ensure_cache_dir()
            cache_path = libreOfficeService.get_cache_path(file_path)
            if os.path.exists(cache_path):
                return libreOfficeService.create_pdf_response(cache_path, file_path)
            soffice = libreOfficeService.get_libreoffice_path()
            # 使用LibreOffice将PPT转换为PDF
            cmd = [
                soffice,
                '--headless',
                '--convert-to', 'pdf',
                '--outdir', libreOfficeService.CACHE_DIR,
                file_path
            ]
            process = subprocess.run(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                timeout=60
            )
            if process.returncode != 0:
                raise Exception(f"转换失败: {process.stderr.decode()}")
            pdf_name = os.path.splitext(os.path.basename(file_path))[0] + '.pdf'
            temp_pdf_path = os.path.join(libreOfficeService.CACHE_DIR, pdf_name)
            # 重命名为缓存文件名
            if os.path.exists(temp_pdf_path):
                os.rename(temp_pdf_path, cache_path)
            else:
                raise Exception("PDF文件未生成")
            return libreOfficeService.create_pdf_response(cache_path, file_path)
        except Exception as e:
            print(f"PPT转换错误: {str(e)}")
            raise APIException(f"PPT转换失败: {str(e)}")

    @staticmethod
    def clear_old_cache(max_age_days=7):
        try:
            import time
            now = time.time()
            for cache_file in os.listdir(libreOfficeService.CACHE_DIR):
                cache_path = os.path.join(libreOfficeService.CACHE_DIR, cache_file)
                if os.path.isfile(cache_path):
                    # 如果文件超过max_age_days天没有被访问，则删除
                    if now - os.path.getatime(cache_path) > max_age_days * 86400:
                        os.remove(cache_path)
        except Exception as e:
            print(f"清理缓存出错: {str(e)}")
