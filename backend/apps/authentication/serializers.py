from rest_framework import serializers
from .models import User, Institution, InstitutionApplication
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class InstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = ('id', 'name', 'domain')

# 1. Custom Login Serializer (Adds 'role' to the JWT response)
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Inject custom data into the response
        data['role'] = self.user.role
        data['name'] = f"{self.user.first_name} {self.user.last_name}"
        data['email'] = self.user.email
        data['institution'] = self.user.institution.name if self.user.institution else None
        
        return data

# 2. Student Registration Serializer (UPDATED)
class RegisterStudentSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    # We ask for the domain (e.g., 'university.edu') to link them
    institution_domain = serializers.CharField(write_only=True) 

    class Meta:
        model = User
        # Added 'department' to fields list
        fields = ('first_name', 'last_name', 'email', 'password', 'student_id', 'institution_domain', 'department')

    def validate_institution_domain(self, value):
        try:
            return Institution.objects.get(domain=value)
        except Institution.DoesNotExist:
            raise serializers.ValidationError("Institution not registered with Aegis. Contact your IT administrator.")

    def create(self, validated_data):
        institution = validated_data.pop('institution_domain')
        
        # Extract department from validated data (default to 'General' if missing)
        department = validated_data.get('department', 'General')
        
        user = User.objects.create_user(
            username=validated_data['email'], # Use email as username
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            student_id=validated_data.get('student_id'),
            institution=institution,
            role=User.Role.STUDENT,
            risk_score=100, # Default starting score
            department=department # <--- Saving the department
        )
        return user
    
class InstitutionApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstitutionApplication
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'risk_score', 'streak_count', 'xp', 'department']