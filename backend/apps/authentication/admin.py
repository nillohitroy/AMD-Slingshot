from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Institution, InstitutionApplication

# 1. Register Institution
@admin.register(Institution)
class InstitutionAdmin(admin.ModelAdmin):
    list_display = ('name', 'domain', 'is_active', 'created_at')
    search_fields = ('name', 'domain')

# 2. Register Custom User
@admin.register(User)
class CustomUserAdmin(UserAdmin):
    # Add our custom fields to the list view
    list_display = ('username', 'email', 'role', 'institution', 'risk_score', 'is_staff')
    list_filter = ('role', 'institution', 'is_staff')
    
    # Add our custom fields to the "Edit User" form
    fieldsets = UserAdmin.fieldsets + (
        ('Aegis Profile', {'fields': ('role', 'institution', 'student_id', 'risk_score')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Aegis Profile', {'fields': ('role', 'institution', 'student_id')}),
    )

@admin.register(InstitutionApplication)
class InstitutionApplicationAdmin(admin.ModelAdmin):
    list_display = ('institution_name', 'domain', 'admin_email', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('institution_name', 'admin_email')
    
    # Add a visual indicator for status
    def get_row_css(self, obj, index):
        if obj.status == 'PENDING':
            return 'font-weight: bold;'
        return ''