from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Drill
from .serializers import DrillSerializer, AdminDrillStatsSerializer

class StudentDrillListView(generics.ListAPIView):
    """
    GET /api/student/drills/
    Returns all available drills with the user's status attached.
    """
    serializer_class = DrillSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Drill.objects.all().order_by('-is_mandatory', 'title')
    

class AdminDrillListView(generics.ListAPIView):
    """
    GET /api/admin/drills/
    """
    serializer_class = AdminDrillStatsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Admins see all drills (or filtered by their institution if drills were institution-specific)
        return Drill.objects.all().order_by('-created_at')