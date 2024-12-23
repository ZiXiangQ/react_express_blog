'''
Author: qiuzx
Date: 2024-12-21 11:38:07
LastEditors: qiuzx
Description: description
'''

# Create your views here.
##视图层
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from user.service.user_service import login_user

class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_data = login_user(username, password)
            return Response({"message": "Login successful", "user": user_data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)
