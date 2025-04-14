'''
Author: qiuzx
Date: 2025-04-09 22:29:00
LastEditors: qiuzx
Description: description
'''
# file_handle/services.py

import os
import shutil
from django.conf import settings
import pandas as pd
from django.http import FileResponse
from rest_framework.exceptions import APIException
from urllib.parse import quote
from docx import Document as DocxDocument
from openpyxl import load_workbook
from pptx import Presentation
import tempfile
import subprocess
import markdown
from markdown.extensions.toc import TocExtension
from markdown.extensions.codehilite import CodeHiliteExtension
import frontmatter  # 处理YAML front matter
from datetime import datetime
import xlrd  # 处理旧版 Excel 文件
import openpyxl  # 处理新版 Excel 文件
import json  # 处理 JSON 文件



class FileService:
    @staticmethod
    def convert_word_to_pdf(word_path, pdf_path):
        """
        使用 LibreOffice 将 Word 文档转换为 PDF
        """
        try:
            # 获取 LibreOffice 可执行文件路径
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
                raise Exception("LibreOffice not found. Please install LibreOffice first.")

            # 确保输入文件存在
            if not os.path.exists(word_path):
                raise Exception(f"Input file not found: {word_path}")

            # 确保输出目录存在
            output_dir = os.path.dirname(pdf_path)
            os.makedirs(output_dir, exist_ok=True)

            # 获取绝对路径
            word_path_abs = os.path.abspath(word_path)
            pdf_path_abs = os.path.abspath(pdf_path)

            print(f"Converting {word_path_abs} to {pdf_path_abs}")
            print(f"Using LibreOffice at: {soffice}")

            # 准备命令
            cmd = [
                soffice,
                '--headless',
                '--convert-to', 'pdf',
                '--outdir', output_dir,
                word_path_abs
            ]

            print(f"Running command: {' '.join(cmd)}")

            # 执行转换
            process = subprocess.run(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                timeout=60  # 增加超时时间到60秒
            )

            # 打印输出信息
            print(f"Command output: {process.stdout.decode()}")
            if process.stderr:
                print(f"Command error: {process.stderr.decode()}")

            # 检查是否成功
            if process.returncode != 0:
                raise Exception(f"LibreOffice conversion failed with return code {process.returncode}: {process.stderr.decode()}")

            # LibreOffice 会自动添加 .pdf 扩展名
            expected_output = os.path.join(output_dir, os.path.splitext(os.path.basename(word_path))[0] + '.pdf')
            
            print(f"Looking for output file at: {expected_output}")
            
            if not os.path.exists(expected_output):
                raise Exception(f"Output PDF file not found at expected location: {expected_output}")

            # 移动到目标位置
            if expected_output != pdf_path_abs:
                shutil.move(expected_output, pdf_path_abs)
                print(f"Moved PDF from {expected_output} to {pdf_path_abs}")

            # 最终检查
            if not os.path.exists(pdf_path_abs):
                raise Exception(f"Final PDF file not found at: {pdf_path_abs}")

            if os.path.getsize(pdf_path_abs) == 0:
                raise Exception("Generated PDF file is empty")

            print(f"Successfully converted to PDF: {pdf_path_abs}")

        except subprocess.TimeoutExpired:
            raise APIException("PDF conversion timed out after 60 seconds")
        except Exception as e:
            print(f"Error during conversion: {str(e)}")
            raise APIException(f"Error converting Word to PDF: {str(e)}")

    @staticmethod
    def read_file_content(file_path, file_type):
        """
        读取文件内容，Word文档转为PDF返回
        """
        try:
            if file_type in ['doc', 'docx']:
                # 创建临时PDF文件
                temp_dir = tempfile.mkdtemp()  # 创建临时目录
                pdf_path = os.path.join(temp_dir, 'output.pdf')

                try:
                    # 将Word转为PDF
                    FileService.convert_word_to_pdf(file_path, pdf_path)
                    
                    # 检查文件是否存在且大小大于0
                    if not os.path.exists(pdf_path) or os.path.getsize(pdf_path) == 0:
                        raise APIException("PDF conversion failed: Output file is empty or does not exist")
                    
                    # 返回PDF文件流
                    response = FileResponse(
                        open(pdf_path, 'rb'),
                        content_type='application/pdf'
                    )
                    response['Content-Disposition'] = (
                        f'inline; filename="{os.path.basename(file_path)}.pdf"; '
                        f'filename*=UTF-8\'\'{quote(os.path.basename(file_path))}.pdf'
                    )
                    return response
                except Exception as e:
                    print(f"Error in read_file_content: {str(e)}")
                    raise APIException(f"Error converting Word to PDF: {str(e)}")
                finally:
                    # 清理临时文件和目录
                    try:
                        if os.path.exists(pdf_path):
                            os.unlink(pdf_path)
                        if os.path.exists(temp_dir):
                            shutil.rmtree(temp_dir)
                    except Exception as e:
                        print(f"Error cleaning up temporary files: {str(e)}")
                    
            elif file_type == 'xlsx':
                # 处理新版 Excel 文件 (.xlsx)
                sheets_data = []
                wb = load_workbook(file_path)
                for sheet_name in wb.sheetnames:
                    sheet = wb[sheet_name]
                    sheet_data = {
                        'name': sheet_name,
                        'headers': [],
                        'rows': []
                    }
                    
                    # 获取所有列的最大宽度
                    max_lengths = {}
                    for col in sheet.columns:
                        max_length = 0
                        col_letter = col[0].column_letter
                        for cell in col:
                            try:
                                max_length = max(max_length, len(str(cell.value or '')))
                            except:
                                pass
                        max_lengths[col_letter] = max_length
                    
                    # 获取表头
                    headers = []
                    first_row = next(sheet.rows)
                    for cell in first_row:
                        headers.append({
                            'value': str(cell.value) if cell.value is not None else '',
                            'width': max_lengths[cell.column_letter]
                        })
                    sheet_data['headers'] = headers
                    
                    # 获取数据行
                    for row in list(sheet.rows)[1:]:
                        row_data = []
                        for cell in row:
                            value = cell.value
                            if isinstance(value, datetime):
                                value = value.strftime('%Y-%m-%d %H:%M:%S')
                            elif value is None:
                                value = ''
                            row_data.append(str(value))
                        sheet_data['rows'].append(row_data)
                    
                    sheets_data.append(sheet_data)
                return {
                    'content': sheets_data,
                    'type': 'excel',
                    'meta': {
                        'sheets_count': len(sheets_data),
                        'filename': os.path.basename(file_path)
                    }
                }
            elif file_type == 'xls':
                # 处理旧版 Excel 文件 (.xls)
                sheets_data = []
                wb = xlrd.open_workbook(file_path)
                for sheet_name in wb.sheet_names():
                    sheet = wb.sheet_by_name(sheet_name)
                    sheet_data = {
                        'name': sheet_name,
                        'headers': [],
                        'rows': []
                    }
                    
                    # 获取所有列的最大宽度
                    max_lengths = [0] * sheet.ncols
                    for row_idx in range(sheet.nrows):
                        for col_idx in range(sheet.ncols):
                            try:
                                cell_value = str(sheet.cell_value(row_idx, col_idx))
                                max_lengths[col_idx] = max(max_lengths[col_idx], len(cell_value))
                            except:
                                pass
                    
                    # 获取表头
                    headers = []
                    for col_idx in range(sheet.ncols):
                        cell_value = sheet.cell_value(0, col_idx)
                        headers.append({
                            'value': str(cell_value) if cell_value else '',
                            'width': max_lengths[col_idx]
                        })
                    sheet_data['headers'] = headers
                    
                    # 获取数据行
                    for row_idx in range(1, sheet.nrows):
                        row_data = []
                        for col_idx in range(sheet.ncols):
                            cell = sheet.cell(row_idx, col_idx)
                            value = cell.value
                            
                            # 处理日期类型
                            if cell.ctype == xlrd.XL_CELL_DATE:
                                try:
                                    # Excel 中的日期是从 1900-01-01 开始的天数
                                    value = datetime(*xlrd.xldate_as_tuple(value, wb.datemode))
                                    value = value.strftime('%Y-%m-%d %H:%M:%S')
                                except:
                                    value = str(value)
                            elif cell.ctype == xlrd.XL_CELL_NUMBER:
                                # 处理数字，避免显示科学计数法
                                if value.is_integer():
                                    value = int(value)
                                value = str(value)
                            else:
                                value = str(value) if value else ''
                                
                            row_data.append(value)
                        sheet_data['rows'].append(row_data)
                    
                    sheets_data.append(sheet_data)
            
                return {
                    'content': sheets_data,
                    'type': 'excel',
                    'meta': {
                        'sheets_count': len(sheets_data),
                        'filename': os.path.basename(file_path)
                    }
                }

            elif file_type == 'pdf':
                # 返回 PDF 文件流
                response = FileResponse(open(file_path, 'rb'), content_type='application/pdf')
                response['Content-Disposition'] = f'inline; filename="{os.path.basename(file_path)}"; filename*=UTF-8\'\'{quote(os.path.basename(file_path))}'
                return response
            
            elif file_type in ['ppt', 'pptx']:
                # 处理 PPT 文件
                prs = Presentation(file_path)
                content = '\n'.join([shape.text for slide in prs.slides for shape in slide.shapes if hasattr(shape, "text")])
                return {'content': content, 'type': 'text'}
            
            elif file_type == 'md':
                # 处理 Markdown 文件
                # 处理 Markdown 文件
                with open(file_path, 'r', encoding='utf-8') as f:
                    try:
                        # 使用 frontmatter 加载内容
                        post = frontmatter.load(f)
                        
                        # 直接返回原始Markdown内容（不转换HTML）
                        return {
                            'content': post.content,  # 原始Markdown文本
                            'meta': post.metadata,    # Front Matter元数据
                            'type': 'md'              # 标记为Markdown类型
                        }
                    except Exception as e:
                        raise APIException(f"Error parsing Markdown file: {str(e)}")
            else:
                raise APIException((f"Unsupported file type: {file_type}"))
        except Exception as e:
            raise APIException(f"Error reading file: {str(e)}")
