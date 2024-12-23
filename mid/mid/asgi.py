'''
Author: qiuzx
Date: 2024-12-21 12:13:41
LastEditors: qiuzx
Description: description
'''
import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'my_project.settings')

application = get_asgi_application()
