from django.urls import path
from .views import StudentDashboardView, StudentHistoryView, SentryCheckView, ResolveThreatView

urlpatterns = [
    # The main dashboard stats (Score, Streak, etc.)
    path('dashboard/', StudentDashboardView.as_view(), name='student_dashboard_stats'),
    
    # The full history page
    path('history/', StudentHistoryView.as_view(), name='student_history'),
    path('check/', SentryCheckView.as_view()),

    path('resolve/<int:pk>/', ResolveThreatView.as_view()),
]