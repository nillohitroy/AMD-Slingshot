from django.db import models
from django.conf import settings

class Drill(models.Model):
    """
    Educational modules or simulations.
    """
    class Category(models.TextChoices):
        PHISHING = 'PHISHING', 'Phishing Simulation'
        PASSWORD = 'PASSWORD', 'Password Security'
        GENERAL = 'GENERAL', 'General Hygiene'

    class Status(models.TextChoices):
        RUNNING = 'RUNNING', 'Running'
        PAUSED = 'PAUSED', 'Paused'
        COMPLETED = 'COMPLETED', 'Completed'

    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=Category.choices)
    xp_reward = models.IntegerField(default=50)
    is_mandatory = models.BooleanField(default=False)

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.RUNNING)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class UserDrillProgress(models.Model):
    """
    Tracks a student's progress on specific drills.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='drill_progress')
    drill = models.ForeignKey(Drill, on_delete=models.CASCADE)
    
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.user.email} - {self.drill.title}"