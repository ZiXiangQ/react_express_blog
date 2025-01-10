'''
Author: qiuzx
Date: 2024-12-31 15:21:50
LastEditors: qiuzx
Description: description
'''
import os
from django.http import HttpResponse, FileResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import APIException
from docx import Document
import pandas as pd
import fitz  # PyMuPDF
import markdown
# import win32com.client  # 用于处理 .doc 文件（仅适用于 Windows）
from .base import ApiResponse
from pptx import Presentation  # 用于读取 ppt 文件

# 文件内容读取处理函数

def read_file_content(file_path, file_type):
    """
    读取不同类型的文件并返回文件内容。
    支持 .doc, .docx, .xlsx, .ppt, .pdf, .md 文件。
    """
    content = ""
    try:
        if file_type == 'docx' or file_type == 'doc':
            # 处理 .docx 和 .doc 文件
            if file_type == 'docx':
                doc = Document(file_path)
                content = '\n'.join([para.text for para in doc.paragraphs])
            # else:
            #     # 处理 .doc 文件（Windows 环境）
            #     word = win32com.client.Dispatch('Word.Application')
            #     doc = word.Documents.Open(file_path)
            #     content = doc.Content.Text
            #     doc.Close()
            #     word.Quit()

        elif file_type == 'xlsx':
            # 使用 pandas 读取 Excel 文件并转为 HTML 格式
            content = pd.read_excel(file_path).to_html()

        elif file_type == 'pptx':
            # 使用 python-pptx 读取 PPT 文件
            presentation = Presentation(file_path)
            content = ''
            for slide in presentation.slides:
                for shape in slide.shapes:
                    if hasattr(shape, 'text'):
                        content += shape.text + '\n'

        elif file_type == 'pdf':
            # 使用 PyMuPDF 读取 PDF 文件
            doc = fitz.open(file_path)
            content = ''
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                content += page.get_text()

        elif file_type == 'md':
            # 使用 markdown 读取 Markdown 文件
            with open(file_path, 'r', encoding='utf-8') as file:
                md_content = file.read()
            content = markdown.markdown(md_content)  # 渲染为 HTML 格式

        else:
            raise APIException(f"Unsupported file type: {file_type}")

    except Exception as e:
        raise APIException(f"Error reading file: {str(e)}")

    return content

# 文件内容API
class FileContent(APIView):
    def post(self, request):
        file_path = request.data.get('file_path')
        base_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../data')
        file_path = os.path.join(base_path, file_path)
        # 验证文件是否存在
        if not os.path.exists(file_path):
            raise APIException('File not found')

        # 获取文件扩展名并读取文件内容
        file_type = file_path.split('.')[-1].lower()  # 获取文件类型（小写）
        content = read_file_content(file_path, file_type)

        return ApiResponse.success("", {'content': content})


