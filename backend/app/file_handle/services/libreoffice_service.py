"""
LibreOffice 服务层 - 对应 file_handle/services/libreOffice_service.py
"""
import os
import subprocess
import shutil
import hashlib
import time
from fastapi.responses import FileResponse
from fastapi import HTTPException


class LibreOfficeService:
    CACHE_DIR = 'blog_temp_data/pdf_cache'

    @staticmethod
    def ensure_cache_dir():
        if not os.path.exists(LibreOfficeService.CACHE_DIR):
            os.makedirs(LibreOfficeService.CACHE_DIR)

    @staticmethod
    def get_cache_path(file_path: str) -> str:
        file_stat = os.stat(file_path)
        cache_key = f"{file_path}_{file_stat.st_mtime}"
        cache_name = hashlib.md5(cache_key.encode()).hexdigest() + '.pdf'
        return os.path.join(LibreOfficeService.CACHE_DIR, cache_name)

    @staticmethod
    def create_pdf_response(pdf_path: str, original_file_path: str) -> FileResponse:
        return FileResponse(
            path=pdf_path,
            media_type='application/pdf',
            filename=f"{os.path.basename(original_file_path)}.pdf",
            headers={
                'Content-Disposition': (
                    f'inline; filename="{os.path.basename(original_file_path)}.pdf"'
                )
            }
        )

    @staticmethod
    def get_libreoffice_path() -> str:
        libreoffice_paths = [
            '/Applications/LibreOffice.app/Contents/MacOS/soffice',  # macOS
            '/usr/bin/soffice',  # Linux
            '/usr/local/bin/soffice',
            'soffice'
        ]
        soffice = None
        for path in libreoffice_paths:
            if os.path.exists(path) or shutil.which(path):
                soffice = path
                break

        if not soffice:
            raise HTTPException(status_code=500, detail="未找到 LibreOffice，请先安装 LibreOffice")
        return soffice

    @staticmethod
    def convert_to_pdf(file_path: str) -> FileResponse:
        """将 DOC/DOCX/PPT/PPTX 转换为 PDF，如果有缓存则直接返回缓存"""
        try:
            LibreOfficeService.ensure_cache_dir()
            cache_path = LibreOfficeService.get_cache_path(file_path)

            if os.path.exists(cache_path):
                return LibreOfficeService.create_pdf_response(cache_path, file_path)

            soffice = LibreOfficeService.get_libreoffice_path()

            cmd = [
                soffice,
                '--headless',
                '--convert-to', 'pdf',
                '--outdir', LibreOfficeService.CACHE_DIR,
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
            temp_pdf_path = os.path.join(LibreOfficeService.CACHE_DIR, pdf_name)

            if os.path.exists(temp_pdf_path):
                os.rename(temp_pdf_path, cache_path)
            else:
                raise Exception("PDF文件未生成")

            return LibreOfficeService.create_pdf_response(cache_path, file_path)
        except HTTPException:
            raise
        except Exception as e:
            print(f"文件转换错误: {str(e)}")
            raise HTTPException(status_code=500, detail=f"文件转换失败: {str(e)}")

    @staticmethod
    def clear_old_cache(max_age_days: int = 7):
        try:
            now = time.time()
            if not os.path.exists(LibreOfficeService.CACHE_DIR):
                return
            for cache_file in os.listdir(LibreOfficeService.CACHE_DIR):
                cache_path = os.path.join(LibreOfficeService.CACHE_DIR, cache_file)
                if os.path.isfile(cache_path):
                    if now - os.path.getatime(cache_path) > max_age_days * 86400:
                        os.remove(cache_path)
        except Exception as e:
            print(f"清理缓存出错: {str(e)}")
