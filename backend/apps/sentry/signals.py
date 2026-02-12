from django.db.models import Sum, Case, When, IntegerField
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import ThreatEvent

@receiver(post_save, sender=ThreatEvent)
def recalculate_user_score(sender, instance, **kwargs):
    """
    Recalculates the User's Risk Score whenever a ThreatEvent is created or updated.
    Score = 100 - (Sum of penalties for all UNRESOLVED threats)
    """
    user = instance.user
    
    # 1. Calculate Total Penalty of UNRESOLVED threats only
    # We use 'type' to determine severity since the 'severity' field is gone.
    # BREACH = 15 pts, PHISHING = 10 pts, BLOCK = 5 pts
    
    total_penalty = user.threat_events.exclude(status='RESOLVED').aggregate(
        penalty=Sum(
            Case(
                When(type='BREACH', then=15),
                When(type='PHISHING', then=10),
                When(type='BLOCK', then=5),
                default=2,
                output_field=IntegerField(),
            )
        )
    )['penalty'] or 0

    # 2. Calculate Score (Floor at 0, Cap at 100)
    new_score = max(0, 100 - total_penalty)
    
    # 3. Only save if changed to avoid infinite loops
    if user.risk_score != new_score:
        user.risk_score = new_score
        user.save(update_fields=['risk_score'])