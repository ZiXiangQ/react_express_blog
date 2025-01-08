'''
Author: qiuzx
Date: 2024-12-31 15:21:50
LastEditors: qiuzx
Description: description
'''
# file_handle/views.py
import os
from django.http import HttpResponse, FileResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import APIException

def read_file_content(file_path, file_type):
    if file_type == 'docx':
        from docx import Document
        doc = Document(file_path)
        content = '\n'.join([para.text for para in doc.paragraphs])
    elif file_type == 'xlsx':
        import pandas as pd
        content = pd.read_excel(file_path).to_html()
    elif file_type == 'pdf':
        import fitz  # PyMuPDF
        doc = fitz.open(file_path)
        content = ''
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            content += page.get_text()
    elif file_type == 'md':
        import markdown
        with open(file_path, 'r', encoding='utf-8') as file:
            md_content = file.read()
        content = markdown.markdown(md_content)
    else:
        raise APIException('Unsupported file type')
    return content



class FileList(APIView):
    def get(self, request):
        BASE_DIR = 'data'
        base_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../data')
        result = []
        def build_tree(root):
            folder_name = os.path.basename(root)
            print(folder_name,'112')
            folder_path = root.replace(base_path, "").strip('/')
            folder = {
                "name": folder_name,
                "path": folder_path,
                "children": [],
            }
            for dir in dirs:
                if not dir.startswith('.'):
                    folder["children"].append(build_tree(os.path.join(root, dir)))
            for file in files:
                if not file.startswith('.'):
                    file_path = os.path.join(folder_path, file)
                    folder["children"].append({"name": file, "path": file_path})
            return folder
        for root, dirs, files in os.walk(base_path):
            files = [f for f in files if not f.startswith('.')]
            dirs = [d for d in dirs if not d.startswith('.')]
        result.append(build_tree(base_path))
        return Response(result)


class FileContent(APIView):
    def get(self, request, file_path):
        base_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../data')
        file_path = os.path.join(base_path, file_path)
        if not os.path.exists(file_path):
            raise APIException('File not found')
        file_type = file_path.split('.')[-1]
        content = read_file_content(file_path, file_type)
        return Response({'content': content})
    
