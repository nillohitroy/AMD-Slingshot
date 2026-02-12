from django.db import models
from django.conf import settings

class ThreatEvent(models.Model):
    # Link to the user who was targeted
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='threat_events')
    
    # URL that was blocked/flagged
    url = models.URLField(max_length=500)
    
    # The specific threat signature (e.g., "Phishing", "Malware", "Dark Web")
    threat_signature = models.CharField(max_length=255)

    ai_explanation = models.TextField(null=True, blank=True, help_text="Reasoning for the block")
    
    # --- THIS IS THE MISSING FIELD CAUSING THE 500 ERROR ---
    TYPE_CHOICES = (
        ('BLOCK', 'Blocked Request'),     # Standard extension block
        ('BREACH', 'Dark Web Breach'),    # Identity leak
        ('PHISHING', 'Phishing Attempt'), # Email simulation
    )
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='BLOCK')
    # -------------------------------------------------------

    # When it happened
    timestamp = models.DateTimeField(auto_now_add=True)
    
    # Status of the event
    status = models.CharField(max_length=50, default='BLOCKED') 

    def __str__(self):
        return f"{self.user.email} - {self.threat_signature} ({self.type})"

class PolicyConfig(models.Model):
    """
    Stores the Agent Configuration for an Institution Admin.
    """
    # Link to the Admin User (Assuming 1 Admin per Institution for now)
    user = models.OneToOneField('authentication.User', on_delete=models.CASCADE, related_name='policy_config')
    
    # Sentry (Network)
    sentry_paranoia_level = models.IntegerField(default=75, help_text="1-100 sensitivity")
    block_new_domains = models.BooleanField(default=True)
    detect_homoglyphs = models.BooleanField(default=True)
    allow_bypass = models.BooleanField(default=False)
    
    # Analyst (Education)
    simple_explanations = models.BooleanField(default=True)
    gamified_quizzes = models.BooleanField(default=True)
    
    # Guardian (Identity)
    credential_reuse_monitor = models.BooleanField(default=True)
    dark_web_scan = models.BooleanField(default=True)

    def __str__(self):
        return f"Policy for {self.user.email}"


class AuditLog(models.Model):
    """
    Immutable record of Super Admin actions for compliance.
    """
    actor = models.ForeignKey('authentication.User', on_delete=models.CASCADE, related_name='audit_actions')
    action = models.CharField(max_length=100)  # e.g., "INSTITUTION_APPROVED", "USER_LOCKED"
    target = models.CharField(max_length=255)  # e.g., "State University", "alex@student.edu"
    details = models.TextField(blank=True, null=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.actor.email} -> {self.action}"