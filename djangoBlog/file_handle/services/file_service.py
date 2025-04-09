# file_handle/services.py

import os
import pandas as pd
from xml.dom.minidom import Document
import markdown
from django.http import FileResponse
from rest_framework.exceptions import APIException
from urllib.parse import quote

class FileService:
    @staticmethod
    def read_file_content(file_path, file_type):
        """
        读取不同类型的文件并返回文件内容。
        """
        try:
            if file_type in ['doc', 'docx']:
                # 处理 Word 文件
                doc = Document(file_path)
                content = '\n'.join([para.text for para in doc.paragraphs])
                return {'content': content, 'type': 'text'}

            elif file_type == 'xlsx':
                # 处理 Excel 文件
                content = pd.read_excel(file_path).to_html()
                return {'content': content, 'type': 'html'}

            elif file_type == 'pdf':
                # 返回 PDF 文件流
                response = FileResponse(open(file_path, 'rb'), content_type='application/pdf')
                response['Content-Disposition'] = f'inline; filename="{os.path.basename(file_path)}"; filename*=UTF-8\'\'{quote(os.path.basename(file_path))}'
                return response
            
            elif file_type == 'md':
                # 处理 Markdown 文件
                with open(file_path, 'r', encoding='utf-8') as file:
                    md_content = file.read()
                html_content = markdown.markdown(md_content)
                return {'content': html_content, 'type': 'html'}

            else:
                raise APIException(f"Unsupported file type: {file_type}")

        except Exception as e:
            raise APIException(f"Error reading file: {str(e)}")
