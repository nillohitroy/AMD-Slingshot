from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import ThreatEvent, PolicyConfig, AuditLog
from .serializers import StudentDashboardSerializer, ThreatEventSerializer, AdminDashboardSerializer, PolicyConfigSerializer, AuditLogSerializer
from django.db.models import Avg, Q, Count
from apps.authentication.models import User, Institution
from apps.drills.models import Drill, UserDrillProgress, DrillAttempt
from django.core.mail import send_mail
from apps.drills.services import BreachCheckerService

class StudentDashboardView(APIView):
    """
    GET /api/student/dashboard/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        threats = ThreatEvent.objects.filter(user=user).order_by('-timestamp')[:5]
        drills = DrillAttempt.objects.filter(user=user, is_passed=True).select_related('drill').order_by('-completed_at')[:5]
        
        activity_log = []
        for t in threats:
            activity_log.append({
                "id": f"threat-{t.id}",
                "type": "THREAT",
                "title": "Threat Blocked",
                "subtitle": t.url,
                "status": "BLOCKED",
                "timestamp": t.timestamp,
                "xp_change": 0
            })
            
        for d in drills:
            activity_log.append({
                "id": f"drill-{d.id}",
                "type": "DRILL",
                "title": f"Drill Complete: {d.drill.title}",
                "subtitle": "+ XP Reward",
                "status": "PASSED",
                "timestamp": d.completed_at,
                "xp_change": d.drill.xp_reward
            })
            
        activity_log.sort(key=lambda x: x['timestamp'], reverse=True)
        
        return Response({
            "first_name": user.first_name or user.email.split('@')[0],
            "risk_score": user.risk_score,
            "streak_count": user.streak_count,
            "xp": user.xp,
            "extension_installed": user.extension_installed,
            "pending_actions": [],
            "recent_activity": activity_log[:10]
        })

class StudentHistoryView(generics.ListAPIView):
    serializer_class = ThreatEventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ThreatEvent.objects.filter(user=self.request.user).order_by('-timestamp')
    

class AdminDashboardStatsView(APIView):
    """
    GET /api/admin/dashboard/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role not in ['INSTITUTION_ADMIN', 'SUPER_ADMIN']:
            return Response({"error": "Unauthorized"}, status=403)

        institution = request.user.institution
        
        if institution:
            students = User.objects.filter(institution=institution, role='STUDENT')
            events = ThreatEvent.objects.filter(user__institution=institution)
        else:
            students = User.objects.filter(role='STUDENT')
            events = ThreatEvent.objects.all()

        # FIXED: Use 'status' instead of 'is_resolved'
        active_threats = events.exclude(status='RESOLVED').count()
        resolved_threats = events.filter(status='RESOLVED').count()

        threats_by_type = events.values('type').annotate(count=Count('id'))
        chart_data = [{"name": item['type'], "value": item['count']} for item in threats_by_type]

        data = {
            'campus_avg_score': students.aggregate(Avg('risk_score'))['risk_score__avg'] or 0,
            'total_students': students.count(),
            'active_threats': active_threats,
            'resolved_threats': resolved_threats,
            'chart_data': chart_data,
            'at_risk_students': students.order_by('risk_score')[:5].values('first_name', 'last_name', 'risk_score', 'department'),
            'recent_logs': events.order_by('-timestamp')[:10].values('id', 'user__email', 'threat_signature', 'type', 'status', 'timestamp')
        }
        return Response(data)

class AdminLiveSentinelView(generics.ListAPIView):
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
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role not in ['INSTITUTION_ADMIN', 'SUPER_ADMIN']:
            return Response({"error": "Unauthorized"}, status=403)

        domain = user.email.split('@')[1] if '@' in user.email else ''
        students = User.objects.filter(email__icontains=domain, role='STUDENT')
        
        dark_web_hits = ThreatEvent.objects.filter(type='BREACH', user__email__icontains=domain).count()

        avg_risk = students.aggregate(Avg('risk_score'))['risk_score__avg'] or 70
        identity_score = max(0, min(100, int(100 - (dark_web_hits * 5) - (100 - avg_risk) * 0.2)))

        dept_data = students.values('department').annotate(
            avg_score=Avg('risk_score'),
            student_count=Count('id')
        ).order_by('avg_score')

        chart_stats = [{"name": d['department'] or "Unassigned", "score": round(d['avg_score'] or 0), "students": d['student_count']} for d in dept_data]
        recent_breaches = ThreatEvent.objects.filter(type='BREACH', user__email__icontains=domain).order_by('-timestamp')[:5].values('id', 'user__email', 'timestamp')

        return Response({
            "identity_score": identity_score,
            "dark_web_hits": dark_web_hits,
            "monitored_users": students.count(),
            "department_stats": chart_stats,
            "recent_breaches": recent_breaches
        })

class AdminPolicyView(generics.RetrieveUpdateAPIView):
    serializer_class = PolicyConfigSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        if self.request.user.role not in ['INSTITUTION_ADMIN', 'SUPER_ADMIN']:
            self.permission_denied(self.request)
        obj, created = PolicyConfig.objects.get_or_create(user=self.request.user)
        return obj
    

class SuperAdminDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'SUPER_ADMIN':
            return Response({"error": "Unauthorized"}, status=403)

        stats = {
            "total_institutions": Institution.objects.filter(status='ACTIVE').count(),
            "pending_requests": Institution.objects.filter(status='PENDING').count(),
            "total_students": User.objects.filter(role='STUDENT').count(),
            # FIXED: Use 'status' here too
            "global_threats": ThreatEvent.objects.exclude(status='RESOLVED').count(),
            "requests": Institution.objects.filter(status='PENDING').values('id', 'name', 'domain', 'admin_email', 'created_at')
        }
        return Response(stats)

class InstitutionActionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        if request.user.role != 'SUPER_ADMIN':
            return Response({"error": "Unauthorized"}, status=403)

        action = request.data.get('action') 
        try:
            institution = Institution.objects.get(pk=pk)
        except Institution.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

        if action == 'APPROVE':
            institution.status = 'ACTIVE'
            institution.save()
            if institution.admin_email:
                User.objects.get_or_create(
                    email=institution.admin_email,
                    defaults={'role': 'INSTITUTION_ADMIN', 'institution': institution, 'is_active': True}
                )
            return Response({"message": "Institution approved & email sent."})

        elif action == 'REJECT':
            institution.status = 'REJECTED'
            institution.save()
            return Response({"message": "Institution rejected."})

        return Response({"error": "Invalid action"}, status=400)
    

class SuperUserRegistryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'SUPER_ADMIN': return Response(status=403)
        query = request.query_params.get('search', '')
        users = User.objects.all().select_related('institution').order_by('-date_joined')
        if query:
            users = users.filter(Q(email__icontains=query) | Q(first_name__icontains=query) | Q(last_name__icontains=query))
        
        data = [{
            "id": u.id,
            "email": u.email,
            "name": f"{u.first_name} {u.last_name}",
            "role": u.role,
            "institution": u.institution.name if u.institution else "N/A",
            "is_active": u.is_active,
            "risk_score": u.risk_score,
            "joined": u.date_joined.strftime("%Y-%m-%d")
        } for u in users[:50]]
        return Response(data)

class SuperUserActionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        if request.user.role != 'SUPER_ADMIN': return Response(status=403)
        try:
            target_user = User.objects.get(pk=pk)
            if target_user.role == 'SUPER_ADMIN': return Response({"error": "Cannot lock a Super Admin"}, status=400)
            target_user.is_active = not target_user.is_active
            target_user.save()
            return Response({"status": "updated", "is_active": target_user.is_active})
        except User.DoesNotExist:
            return Response(status=404)
        

class SuperAuditLogView(generics.ListAPIView):
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role != 'SUPER_ADMIN': return AuditLog.objects.none()
        return AuditLog.objects.all().order_by('-timestamp')
    

class TriggerDarkWebScanView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role not in ['INSTITUTION_ADMIN', 'SUPER_ADMIN']:
             return Response({"error": "Unauthorized"}, status=403)

        domain = request.user.email.split('@')[1] if '@' in request.user.email else ''
        students = User.objects.filter(email__icontains=domain, role='STUDENT')
        
        total_new_breaches = 0
        for student in students:
            total_new_breaches += BreachCheckerService.check_email(student)

        return Response({
            "message": "Scan Complete",
            "students_scanned": students.count(),
            "new_breaches_found": total_new_breaches
        })


class SentryCheckView(APIView):
    """
    POST /api/sentry/check/
    Input: { "url": "http://example.com", "email": "student@college.edu" }
    Output: { "status": "SAFE" | "BLOCKED" }
    """
    permission_classes = [AllowAny]

    def post(self, request):
        url = request.data.get('url', '').lower()
        email = request.data.get('email', 'unknown_user')
        
        # 1. The "Blacklist" Logic
        blocked_keywords = ['phishing', 'malware', 'gambling', 'illegal', 'betting']
        is_malicious = any(keyword in url for keyword in blocked_keywords)

        user = None
        if email != 'anonymous':
            try:
                user = User.objects.get(email=email)
                
                # --- NEW LOGIC: Mark extension as installed ---
                if not user.extension_installed:
                    user.extension_installed = True
                    user.save(update_fields=['extension_installed'])
                # ----------------------------------------------
                
            except User.DoesNotExist:
                pass

        if is_malicious:
            # 2. Log the Threat
            user = None
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                pass
            
            if user:
                # 3. Create Event (Triggering the Signal)
                ThreatEvent.objects.create(
                    user=user,
                    type='BLOCK',
                    threat_signature="Content Filter Violation",
                    url=url,
                    status='BLOCKED'  # <--- Correct field for Signal
                )

            return Response({"status": "BLOCKED", "reason": "Content Filter"})

        return Response({"status": "SAFE"})
    

class ResolveThreatView(APIView):
    """
    POST /api/sentry/resolve/<id>/
    Marks a threat as RESOLVED and restores the user's score.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        if request.user.role not in ['INSTITUTION_ADMIN', 'SUPER_ADMIN']:
            return Response({"error": "Unauthorized"}, status=403)

        try:
            event = ThreatEvent.objects.get(pk=pk)
            event.status = 'RESOLVED'
            event.save() # This triggers the signal to fix the score
            return Response({"message": "Threat resolved", "new_score": event.user.risk_score})
        except ThreatEvent.DoesNotExist:
            return Response({"error": "Event not found"}, status=404)