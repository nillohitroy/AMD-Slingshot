from django.urls import path
from .views import StudentDrillListView

urlpatterns = [
    path('', StudentDrillListView.as_view(), name='student_drills'),
]