from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending Review'
        APPROVED = 'APPROVED', 'Approved'
        REJECTED = 'REJECTED', 'Rejected'

class Institution(models.Model):
    name = models.CharField(max_length=255)
    domain = models.CharField(max_length=255, unique=True, help_text="e.g. university.edu")
    status = models.CharField(
        max_length=20, 
        choices=Status.choices, 
        default=Status.PENDING
    )
    admin_email = models.EmailField(blank=True, null=True)
    api_key = models.CharField(max_length=100, unique=True, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class InstitutionApplication(models.Model):
    institution_name = models.CharField(max_length=255)
    domain = models.CharField(max_length=255)
    admin_name = models.CharField(max_length=255)
    admin_email = models.EmailField()
    contact_number = models.CharField(max_length=50)
    student_count = models.CharField(max_length=50)
    
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.institution_name} ({self.status})"

class User(AbstractUser):
    """
    Custom User model supporting Students, Admins, and Institution Reps.
    """
    class Role(models.TextChoices):
        STUDENT = 'STUDENT', _('Student')
        INSTITUTION_ADMIN = 'INSTITUTION_ADMIN', _('Institution Admin')
        SUPER_ADMIN = 'SUPER_ADMIN', _('Aegis Super Admin')

    role = models.CharField(max_length=50, choices=Role.choices, default=Role.STUDENT)
    
    institution = models.ForeignKey(
        Institution, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='users'
    )

    student_id = models.CharField(max_length=50, blank=True, null=True)
    risk_score = models.IntegerField(default=100)

    streak_count = models.IntegerField(default=0, help_text="Consecutive days without incidents")
    extension_installed = models.BooleanField(default=False)
    last_extension_heartbeat = models.DateTimeField(null=True, blank=True)

    xp = models.IntegerField(default=0, help_text="Experience Points from drills")

    department = models.CharField(max_length=100, blank=True, null=True, help_text="e.g. Computer Science")
    
    def __str__(self):
        return f"{self.email} ({self.role})"