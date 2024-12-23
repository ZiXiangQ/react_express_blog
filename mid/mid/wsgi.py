'''
Author: qiuzx
Date: 2024-12-21 12:13:21
LastEditors: qiuzx
Description: description
'''
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'my_project.settings')

application = get_wsgi_application()
