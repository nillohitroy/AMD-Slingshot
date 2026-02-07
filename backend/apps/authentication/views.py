from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User, InstitutionApplication
from .serializers import (
    RegisterStudentSerializer, 
    CustomTokenObtainPairSerializer,
    InstitutionApplicationSerializer
)

# 1. Login View
class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Login endpoint. Returns JWT + User Role.
    """
    serializer_class = CustomTokenObtainPairSerializer

# 2. Student Registration View
class RegisterStudentView(generics.CreateAPIView):
    """
    Public endpoint for Students to sign up.
    """
    queryset = User.objects.all()
    permission_classes = (AllowAny,) # Public access
    serializer_class = RegisterStudentSerializer

# 3. Institution Application View (Lead Gen)
from rest_framework.views import APIView
class InstitutionApplyView(APIView):
    """
    Public endpoint: Saves the application to the DB.
    """
    queryset = InstitutionApplication.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = InstitutionApplicationSerializer