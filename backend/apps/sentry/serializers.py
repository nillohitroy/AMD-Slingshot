from rest_framework import serializers
from django.utils.timesince import timesince
from django.utils import timezone
from apps.authentication.models import User
from .models import ThreatEvent, PolicyConfig, AuditLog

class ThreatEventSerializer(serializers.ModelSerializer):
    """
    Used for History lists and Recent Activity cards.
    Formats the timestamp into a human-readable 'time_ago'.
    """
    time_ago = serializers.SerializerMethodField()
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = ThreatEvent
        fields = (
            'id', 
            'type',               # Replaces agent
            'threat_signature', 
            'url',                # Replaces target_url
            'status',             # Replaces is_resolved
            'timestamp', 
            'time_ago',
            'user_email',
            'ai_explanation'
        )

    def get_time_ago(self, obj):
        # Returns strings like "2 minutes ago", "1 day ago"
        return f"{timesince(obj.timestamp, timezone.now())} ago"

class StudentDashboardSerializer(serializers.ModelSerializer):
    """
    Aggregates Profile, Stats, and Logs into one JSON object
    for the Student Dashboard /student page.
    """
    pending_actions = serializers.SerializerMethodField()
    recent_activity = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'first_name', 
            'risk_score', 
            'streak_count', 
            'extension_installed',
            'pending_actions',
            'recent_activity'
        )

    def get_pending_actions(self, user):
        # Fetch unresolved threats (Priority items)
        # We check if status is NOT 'RESOLVED'
        qs = ThreatEvent.objects.filter(
            user=user
        ).exclude(status='RESOLVED').order_by('-timestamp')[:3]
        
        return ThreatEventSerializer(qs, many=True).data

    def get_recent_activity(self, user):
        # Fetch the last 5 logs of ANY kind
        qs = ThreatEvent.objects.filter(user=user).order_by('-timestamp')[:5]
        return ThreatEventSerializer(qs, many=True).data
    
class StudentBasicSerializer(serializers.ModelSerializer):
    """
    Minimal student info for the 'At Risk' table.
    """
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email', 'risk_score', 'streak_count')

class AdminDashboardSerializer(serializers.Serializer):
    """
    Aggregates high-level stats for the Institution Dashboard.
    """
    campus_avg_score = serializers.FloatField()
    total_students = serializers.IntegerField()
    active_threats = serializers.IntegerField()
    resolved_threats = serializers.IntegerField()
    # Nested data
    at_risk_students = StudentBasicSerializer(many=True)
    recent_logs = ThreatEventSerializer(many=True)


class PolicyConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = PolicyConfig
        fields = [
            'sentry_paranoia_level', 'block_new_domains', 'detect_homoglyphs', 'allow_bypass',
            'simple_explanations', 'gamified_quizzes',
            'credential_reuse_monitor', 'dark_web_scan'
        ]


class AuditLogSerializer(serializers.ModelSerializer):
    actor_email = serializers.EmailField(source='actor.email', read_only=True)
    
    class Meta:
        model = AuditLog
        fields = ['id', 'actor_email', 'action', 'target', 'details', 'ip_address', 'timestamp']