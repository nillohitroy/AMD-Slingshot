from rest_framework import serializers
from .models import Drill, DrillQuestion, DrillChoice, DrillAttempt
from apps.authentication.models import User

# --- 1. Base Serializers for Questions & Choices ---
class DrillChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DrillChoice
        fields = ['id', 'text', 'is_correct', 'explanation']

class DrillQuestionSerializer(serializers.ModelSerializer):
    choices = DrillChoiceSerializer(many=True, read_only=True)
    
    class Meta:
        model = DrillQuestion
        fields = ['id', 'text', 'points', 'order', 'choices']


# --- 2. Student-Facing Serializers ---
class DrillDetailSerializer(serializers.ModelSerializer):
    """
    Used when a student plays a drill. Includes full questions and choices.
    """
    questions = DrillQuestionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Drill
        fields = ['id', 'title', 'description', 'xp_reward', 'questions']

class DrillSerializer(serializers.ModelSerializer):
    """
    Used for the Student Dashboard List. 
    Checks if the specific user has completed the drill.
    """
    status = serializers.SerializerMethodField()

    class Meta:
        model = Drill
        fields = ['id', 'title', 'description', 'category', 'xp_reward', 'is_mandatory', 'status']

    def get_status(self, obj):
        user = self.context.get('request').user
        # Check if user has passed this drill
        if DrillAttempt.objects.filter(user=user, drill=obj, is_passed=True).exists():
            return "COMPLETED"
        return "NOT_STARTED"


# --- 3. Admin-Facing Serializers (The Stats Engine) ---
class AdminDrillStatsSerializer(serializers.ModelSerializer):
    """
    Returns Drill details + Aggregate Stats for the Admin Dashboard.
    Calculates stats based on the Admin's email domain.
    """
    sent = serializers.SerializerMethodField()     # Target Population
    reported = serializers.SerializerMethodField() # Passed
    clicked = serializers.SerializerMethodField()  # Failed/Pending
    questions = DrillQuestionSerializer(many=True, read_only=True) # Included for the Edit Modal

    class Meta:
        model = Drill
        fields = ['id', 'title', 'status', 'category', 'sent', 'reported', 'clicked', 'questions', 'created_at']

    def get_domain(self):
        """Helper to extract the domain from the current Admin's email."""
        request = self.context.get('request')
        if request and request.user.email:
            try:
                return request.user.email.split('@')[1]
            except IndexError:
                return None
        return None

    def get_sent(self, obj):
        """
        Target: Count of all students with the same email domain as the admin.
        """
        domain = self.get_domain()
        if not domain:
            return 0
        # Filter for Students belonging to this institution's domain
        return User.objects.filter(email__icontains=domain, role='STUDENT').count()

    def get_reported(self, obj):
        """
        Passed: Count of distinct students in this domain who passed the drill.
        """
        domain = self.get_domain()
        if not domain:
            return 0
        
        return DrillAttempt.objects.filter(
            drill=obj, 
            is_passed=True, 
            user__email__icontains=domain
        ).values('user').distinct().count()

    def get_clicked(self, obj):
        """
        Failed/Pending: Total Target - Passed.
        This represents the 'Risk Gap'.
        """
        total_targets = self.get_sent(obj)
        total_passed = self.get_reported(obj)
        return max(0, total_targets - total_passed)