from django.urls import path
from .views import AdminDashboardStatsView, AdminLiveSentinelView, AdminIdentityDrillView, AdminPolicyView, SuperAdminDashboardView, InstitutionActionView, SuperUserRegistryView, SuperUserActionView, SuperAuditLogView, TriggerDarkWebScanView

from apps.drills.views import AdminDrillListView, AdminDrillCreateView, AdminDrillDeleteView, AdminDrillUpdateQuestionsView

urlpatterns = [
    path('dashboard/', AdminDashboardStatsView.as_view(), name='admin_dashboard'),
    path('sentinel/', AdminLiveSentinelView.as_view(), name='admin_sentinel'),
    path('identity/', AdminIdentityDrillView.as_view(), name='admin_identity'),
    path('identity/scan/', TriggerDarkWebScanView.as_view(), name='admin_identity_scan'),
    path('policy/', AdminPolicyView.as_view(), name='admin_policy'),
    path('super/dashboard/', SuperAdminDashboardView.as_view()),
    path('super/institution/<int:pk>/action/', InstitutionActionView.as_view()),
    path('super/users/', SuperUserRegistryView.as_view()),
    path('super/users/<int:pk>/toggle/', SuperUserActionView.as_view()),
    path('super/audit/', SuperAuditLogView.as_view()),

    # From Drills App
    path('campaigns/', AdminDrillListView.as_view(), name='admin_campaigns'),
    path('campaigns/create/', AdminDrillCreateView.as_view(), name='admin_campaign_create'),
    path('campaigns/<int:pk>/delete/', AdminDrillDeleteView.as_view()),
    path('campaigns/<int:pk>/update_questions/', AdminDrillUpdateQuestionsView.as_view()),
    
]