from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import ThreatEvent, PolicyConfig, AuditLog
from .serializers import StudentDashboardSerializer, ThreatEventSerializer, AdminDashboardSerializer, PolicyConfigSerializer, AuditLogSerializer
from django.db.models import Avg, Q
from apps.authentication.models import User, Institution
from apps.drills.models import Drill, UserDrillProgress
from django.core.mail import send_mail

class StudentDashboardStatsView(APIView):
    """
    GET /api/student/dashboard/
    Returns the user's risk score, streak, extension status,
    and a preview of their recent logs.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # We pass request.user to the serializer
        serializer = StudentDashboardSerializer(request.user)
        return Response(serializer.data)

class StudentHistoryView(generics.ListAPIView):
    """
    GET /api/student/history/
    Returns the COMPLETE list of threat events for the logged-in user.
    """
    serializer_class = ThreatEventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filter so students only see their OWN logs
        return ThreatEvent.objects.filter(
            user=self.request.user
        ).order_by('-timestamp')
    

class AdminDashboardStatsView(APIView):
    """
    GET /api/admin/dashboard/
    Returns aggregated stats for the Admin's Institution.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # 1. Security: Only allow Admins
        if request.user.role not in ['INSTITUTION_ADMIN', 'SUPER_ADMIN']:
            return Response({"error": "Unauthorized"}, status=403)

        # 2. Scope: Get students belonging to this admin's institution
        # (For Super Admin, we could show all, but let's stick to institution logic)
        institution = request.user.institution
        
        if institution:
            students = User.objects.filter(institution=institution, role='STUDENT')
            events = ThreatEvent.objects.filter(user__institution=institution)
        else:
            # Fallback for Super Admin without specific institution
            students = User.objects.filter(role='STUDENT')
            events = ThreatEvent.objects.all()

        # 3. Calculate Stats
        data = {
            'campus_avg_score': students.aggregate(Avg('risk_score'))['risk_score__avg'] or 0,
            'total_students': students.count(),
            'active_threats': events.filter(is_resolved=False).count(),
            'resolved_threats': events.filter(is_resolved=True).count(),
            # Get top 5 lowest scoring students
            'at_risk_students': students.order_by('risk_score')[:5],
            # Get last 10 events
            'recent_logs': events.order_by('-timestamp')[:10]
        }

        serializer = AdminDashboardSerializer(data)
        return Response(serializer.data)

class AdminLiveSentinelView(generics.ListAPIView):
    """
    GET /api/admin/sentinel/
    Returns the 50 most recent events for the 'Live Feed'.
    """
    serializer_class = ThreatEventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role not in ['INSTITUTION_ADMIN', 'SUPER_ADMIN']:
            return ThreatEvent.objects.none()
            
        if user.institution:
            return ThreatEvent.objects.filter(user__institution=user.institution).order_by('-timestamp')[:50]
        return ThreatEvent.objects.all().order_by('-timestamp')[:50]
    

class AdminIdentityDrillView(APIView):
    # ... permissions ...

    def get(self, request):
        user = request.user
        if user.role not in ['INSTITUTION_ADMIN', 'SUPER_ADMIN']:
            return Response({"error": "Unauthorized"}, status=403)

        institution = user.institution
        students = User.objects.filter(institution=institution, role='STUDENT')
        
        # 1. Identity Score & Events (Existing Logic)
        avg_score = students.aggregate(Avg('risk_score'))['risk_score__avg'] or 100
        guardian_events = ThreatEvent.objects.filter(
            user__institution=institution, 
            agent='GUARDIAN'
        ).order_by('-timestamp')[:5]

        # 2. Simulation Stats (Existing Logic)
        latest_drill = Drill.objects.filter(category='PHISHING').order_by('-created_at').first()
        
        sim_stats = {
            "name": "No Active Campaign",
            "emails_sent": 0,
            "click_rate": 0,
            "report_rate": 0,
            "days_left": 0
        }
        
        # 3. NEW: Department Aggregation Logic
        dept_stats = []

        if latest_drill:
            total_students = students.count()
            completed_count = UserDrillProgress.objects.filter(drill=latest_drill, is_completed=True).count()
            
            # Global Stats
            report_rate = (completed_count / total_students * 100) if total_students > 0 else 0
            sim_stats = {
                "name": latest_drill.title,
                "emails_sent": total_students,
                "click_rate": round(100 - report_rate, 1),
                "report_rate": round(report_rate, 1),
                "days_left": 2
            }

            # --- CALCULATE DEPARTMENT STATS ---
            # Get distinct departments that are not null
            departments = students.values_list('department', flat=True).distinct()
            
            for dept in departments:
                if not dept: continue # Skip users with no department
                
                # Filter students in this specific department
                dept_students = students.filter(department=dept)
                dept_total = dept_students.count()
                
                # Count how many passed
                dept_completed = UserDrillProgress.objects.filter(
                    drill=latest_drill, 
                    user__in=dept_students, 
                    is_completed=True
                ).count()
                
                if dept_total > 0:
                    # Failure Rate = Percentage of students who did NOT complete the drill
                    fail_rate = ((dept_total - dept_completed) / dept_total) * 100
                    dept_stats.append({
                        "dept": dept,
                        "rate": round(fail_rate, 1)
                    })
            
            # Sort by highest failure rate (Most vulnerable first)
            dept_stats.sort(key=lambda x: x['rate'], reverse=True)
            # Take top 5
            dept_stats = dept_stats[:5]

        return Response({
            "identity_score": round(avg_score),
            "institution_domain": institution.domain if institution else "aegis.edu",
            "guardian_events": ThreatEventSerializer(guardian_events, many=True).data,
            "simulation": sim_stats,
            "department_stats": dept_stats # <--- Sent to Frontend
        })
    

class AdminPolicyView(generics.RetrieveUpdateAPIView):
    """
    GET /api/admin/policy/ -> Get Config
    PATCH /api/admin/policy/ -> Update Config
    """
    serializer_class = PolicyConfigSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Ensure only Admins can access
        if self.request.user.role not in ['INSTITUTION_ADMIN', 'SUPER_ADMIN']:
            self.permission_denied(self.request)
        
        # Get or Create the policy for this user
        obj, created = PolicyConfig.objects.get_or_create(user=self.request.user)
        return obj
    

class SuperAdminDashboardView(APIView):
    """
    GET /api/super/dashboard/
    Global stats for the Super Admin.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'SUPER_ADMIN':
            return Response({"error": "Unauthorized"}, status=403)

        # Global Counts
        stats = {
            "total_institutions": Institution.objects.filter(status='ACTIVE').count(),
            "pending_requests": Institution.objects.filter(status='PENDING').count(),
            "total_students": User.objects.filter(role='STUDENT').count(),
            "global_threats": ThreatEvent.objects.filter(is_resolved=False).count(),
            # Pending List
            "requests": Institution.objects.filter(status='PENDING').values(
                'id', 'name', 'domain', 'admin_email', 'created_at'
            )
        }
        return Response(stats)

class InstitutionActionView(APIView):
    """
    POST /api/super/institution/<id>/action/
    Approve or Reject an institution.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        if request.user.role != 'SUPER_ADMIN':
            return Response({"error": "Unauthorized"}, status=403)

        action = request.data.get('action') # 'APPROVE' or 'REJECT'
        try:
            institution = Institution.objects.get(pk=pk)
        except Institution.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

        if action == 'APPROVE':
            # 1. Activate Institution
            institution.status = 'ACTIVE'
            institution.save()

            # 2. Create/Activate the Admin User
            # We assume the admin_email was collected during registration
            if institution.admin_email:
                admin_user, created = User.objects.get_or_create(
                    email=institution.admin_email,
                    defaults={
                        'role': 'INSTITUTION_ADMIN',
                        'institution': institution,
                        'is_active': True
                    }
                )
                
                # 3. "Send Email" Logic
                # In production, use send_mail(). Here we simulate it.
                setup_link = f"https://aegis.com/setup-password?token=mock_token_for_{admin_user.id}"
                print(f"--- [EMAIL SIMULATION] ---")
                print(f"To: {institution.admin_email}")
                print(f"Subject: Welcome to Aegis - Request Approved")
                print(f"Body: Your institution {institution.name} is approved. Click here to set password: {setup_link}")
                print(f"--------------------------")

            return Response({"message": "Institution approved & email sent."})

        elif action == 'REJECT':
            institution.status = 'REJECTED'
            institution.save()
            return Response({"message": "Institution rejected."})

        return Response({"error": "Invalid action"}, status=400)
    

class SuperUserRegistryView(APIView):
    """
    GET /api/super/users/?search=alex
    Search any user in the database.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'SUPER_ADMIN': return Response(status=403)
        
        query = request.query_params.get('search', '')
        users = User.objects.all().select_related('institution').order_by('-date_joined')
        
        if query:
            users = users.filter(
                Q(email__icontains=query) | 
                Q(first_name__icontains=query) | 
                Q(last_name__icontains=query)
            )
            
        # Pagination (Simple slice for now)
        users = users[:50] 
        
        data = [{
            "id": u.id,
            "email": u.email,
            "name": f"{u.first_name} {u.last_name}",
            "role": u.role,
            "institution": u.institution.name if u.institution else "N/A",
            "is_active": u.is_active,
            "risk_score": u.risk_score,
            "joined": u.date_joined.strftime("%Y-%m-%d")
        } for u in users]
        
        return Response(data)

class SuperUserActionView(APIView):
    """
    POST /api/super/users/<id>/toggle/
    Lock or Unlock a user account.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        if request.user.role != 'SUPER_ADMIN': return Response(status=403)
        
        try:
            target_user = User.objects.get(pk=pk)
            # Prevent Super Admin from locking themselves!
            if target_user.role == 'SUPER_ADMIN':
                return Response({"error": "Cannot lock a Super Admin"}, status=400)
                
            target_user.is_active = not target_user.is_active
            target_user.save()
            return Response({"status": "updated", "is_active": target_user.is_active})
        except User.DoesNotExist:
            return Response(status=404)
        

class SuperAuditLogView(generics.ListAPIView):
    """
    GET /api/super/audit/
    Returns global audit logs.
    """
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role != 'SUPER_ADMIN':
            return AuditLog.objects.none()
        return AuditLog.objects.all().order_by('-timestamp')