from rest_framework import serializers
from .models import Drill, UserDrillProgress
from apps.authentication.models import User

class DrillSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()

    class Meta:
        model = Drill
        fields = ('id', 'title', 'description', 'category', 'xp_reward', 'is_mandatory', 'status')

    def get_status(self, obj):
        # Check context for the current user (passed from view)
        user = self.context.get('request').user
        try:
            progress = UserDrillProgress.objects.get(user=user, drill=obj)
            return "COMPLETED" if progress.is_completed else "PENDING"
        except UserDrillProgress.DoesNotExist:
            return "NOT_STARTED"


class AdminDrillStatsSerializer(serializers.ModelSerializer):
    """
    Returns Drill details + Aggregate Stats for the Admin Dashboard.
    """
    sent = serializers.SerializerMethodField()
    reported = serializers.SerializerMethodField()
    clicked = serializers.SerializerMethodField()

    class Meta:
        model = Drill
        fields = ('id', 'title', 'status', 'category', 'sent', 'reported', 'clicked', 'created_at')

    def get_sent(self, obj):
        # Total Students in the institution (Approximation)
        # In a real app, you'd filter by the specific assignment group
        user = self.context['request'].user
        if user.institution:
            return User.objects.filter(institution=user.institution, role='STUDENT').count()
        return User.objects.filter(role='STUDENT').count()

    def get_reported(self, obj):
        # "Reported" = Successfully Completed the drill
        return UserDrillProgress.objects.filter(drill=obj, is_completed=True).count()

    def get_clicked(self, obj):
        # "Clicked/Failed" = Total - Completed
        # This is a simplification. In Phase 5, you'd have a specific "Failed" state.
        total = self.get_sent(obj)
        completed = self.get_reported(obj)
        return max(0, total - completed)