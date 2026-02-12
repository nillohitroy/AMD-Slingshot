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
    # 1. Columns to show in the user list
    list_display = (
        'email', 
        'first_name', 
        'last_name', 
        'role', 
        'department',      # <--- Shows Department in the list
        'institution', 
        'risk_score'
    )
    
    # 2. Filters sidebar (Filter by Dept or Role)
    list_filter = ('role', 'department', 'institution', 'is_active')
    
    # 3. Search bar configuration
    search_fields = ('email', 'first_name', 'last_name', 'department')
    
    # 4. Form Layout (When you click a user to edit them)
    fieldsets = UserAdmin.fieldsets + (
        ('Aegis Profile Info', {
            'fields': (
                'role', 
                'department', 
                'institution', 
                'student_id',
                'risk_score',
                'streak_count',
                'xp'
            ),
        }),
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