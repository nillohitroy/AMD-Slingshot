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
    
    # 1. Define Penalty Values
    # Critical (4) = 15 pts, High (3) = 10 pts, Medium (2) = 5 pts, Low (1) = 2 pts
    
    # 2. Calculate Total Penalty of UNRESOLVED threats only
    total_penalty = user.threat_events.filter(is_resolved=False).aggregate(
        penalty=Sum(
            Case(
                When(severity=4, then=15),
                When(severity=3, then=10),
                When(severity=2, then=5),
                When(severity=1, then=2),
                default=0,
                output_field=IntegerField(),
            )
        )
    )['penalty'] or 0

    # 3. Calculate Score (Floor at 0, Cap at 100)
    new_score = max(0, 100 - total_penalty)
    
    # 4. Only save if changed to avoid infinite loops
    if user.risk_score != new_score:
        user.risk_score = new_score
        user.save(update_fields=['risk_score'])