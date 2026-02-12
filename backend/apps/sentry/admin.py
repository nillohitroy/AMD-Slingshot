from django.contrib import admin
from .models import ThreatEvent

@admin.register(ThreatEvent)
class ThreatEventAdmin(admin.ModelAdmin):
    list_display = ('type', 'user', 'threat_signature', 'status', 'timestamp')

    list_filter = ('type', 'status', 'timestamp')

    search_fields = ('user__email', 'url', 'threat_signature')
    
    readonly_fields = ('timestamp',)