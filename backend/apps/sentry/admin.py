from django.contrib import admin
from .models import ThreatEvent

@admin.register(ThreatEvent)
class ThreatEventAdmin(admin.ModelAdmin):
    list_display = ('agent', 'user', 'threat_signature', 'severity', 'timestamp')
    list_filter = ('agent', 'severity', 'timestamp')
    search_fields = ('user__email', 'target_url', 'threat_signature')
    readonly_fields = ('timestamp',) # Prevent tampering with logs