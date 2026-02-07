from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView, 
    RegisterStudentView,
    InstitutionApplyView
)

urlpatterns = [
    # Auth
    path('login/', CustomTokenObtainPairView.as_view(), name='auth_login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Registration
    path('register/student/', RegisterStudentView.as_view(), name='register_student'),
    path('register/institution/', InstitutionApplyView.as_view(), name='apply_institution'),
]