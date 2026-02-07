from django.urls import path
from .views import StudentDashboardStatsView, StudentHistoryView

urlpatterns = [
    # The main dashboard stats (Score, Streak, etc.)
    path('dashboard/', StudentDashboardStatsView.as_view(), name='student_dashboard_stats'),
    
    # The full history page
    path('history/', StudentHistoryView.as_view(), name='student_history'),
]