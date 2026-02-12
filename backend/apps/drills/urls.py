from django.urls import path
from .views import StudentDrillListView, GenerateDrillView, DrillDetailView, SubmitDrillView

urlpatterns = [
    path('', StudentDrillListView.as_view(), name='student_drills'),
    path('generate/', GenerateDrillView.as_view(), name='generate_drill'),
    path('<int:pk>/', DrillDetailView.as_view(), name='drill_detail'),
    path('<int:pk>/complete/', SubmitDrillView.as_view(), name='submit_drill'),
]