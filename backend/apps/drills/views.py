from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import transaction # Needed for safe updates
from .models import Drill, DrillAttempt, DrillQuestion, DrillChoice
from .serializers import DrillSerializer, AdminDrillStatsSerializer, DrillDetailSerializer
from .services import DrillMasterService
from django.utils import timezone

# --- STUDENT VIEWS ---

class StudentDrillListView(generics.ListAPIView):
    """
    GET /api/student/drills/
    Returns all available drills with the user's status attached.
    """
    serializer_class = DrillSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Drill.objects.all().order_by('-is_mandatory', 'title')
    
    def get_serializer_context(self):
        return {'request': self.request}
    

class GenerateDrillView(APIView):
    """
    POST /api/student/drills/generate/
    Input: { "topic": "Phishing", "difficulty": "Hard" }
    Output: { drill_id: 123, ... }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        topic = request.data.get('topic', 'General Security')
        difficulty = request.data.get('difficulty', 'Medium')
        
        # Use the student's department for personalization
        dept = request.user.department or "General"
        
        # Call the Service
        drill = DrillMasterService.generate_drill(topic, difficulty, dept)
        
        # Return the ID so frontend can redirect to /student/drills/:id
        return Response({"drill_id": drill.id, "message": "Drill generated successfully."})
    

class DrillDetailView(generics.RetrieveAPIView):
    queryset = Drill.objects.all()
    serializer_class = DrillDetailSerializer
    permission_classes = [IsAuthenticated]


class SubmitDrillView(APIView):
    """
    POST /api/student/drills/<id>/complete/
    Input: { "score": 80 }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            drill = Drill.objects.get(pk=pk)
        except Drill.DoesNotExist:
            return Response({"error": "Drill not found"}, status=404)
            
        score = request.data.get('score', 0)
        
        # Calculate Max Score (Sum of all questions)
        max_score = sum(q.points for q in drill.questions.all())
        if max_score == 0: max_score = 1 # Avoid div by zero
        
        # Determine Pass/Fail (70% threshold)
        percentage = (score / max_score) * 100
        is_passed = percentage >= 70

        # 1. Save the Attempt
        attempt = DrillAttempt.objects.create(
            user=request.user,
            drill=drill,
            score=score,
            max_score=max_score,
            is_passed=is_passed
        )

        # 2. Update Student Stats (Gamification)
        if is_passed:
            # Check if this is the first time passing
            previous_passes = DrillAttempt.objects.filter(
                user=request.user, 
                drill=drill, 
                is_passed=True
            ).exclude(id=attempt.id).exists()
            
            if not previous_passes:
                request.user.risk_score = min(request.user.risk_score + 5, 100)

                request.user.xp += drill.xp_reward 
                request.user.streak_count += 1 
                
                request.user.save()
        return Response({
            "message": "Drill recorded",
            "is_passed": is_passed,
            "new_risk_score": request.user.risk_score
        })


# --- ADMIN VIEWS ---

class AdminDrillListView(generics.ListAPIView):
    """
    GET /api/admin/campaigns/
    Uses the 'AdminDrillStatsSerializer' to show smart stats (Target/Passed/Failed).
    """
    serializer_class = AdminDrillStatsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Admins see all drills
        return Drill.objects.all().order_by('-created_at')

class AdminDrillCreateView(APIView):
    """
    POST /api/admin/campaigns/create/
    Triggers the AI to generate a new Phishing Simulation Campaign.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role not in ['INSTITUTION_ADMIN', 'SUPER_ADMIN']:
            return Response({"error": "Unauthorized"}, status=403)

        topic = request.data.get('topic')
        difficulty = request.data.get('difficulty', 'Medium')
        
        if not topic:
            return Response({"error": "Topic is required"}, status=400)

        # Generate drill targeting "All Departments"
        drill = DrillMasterService.generate_drill(topic, difficulty, "All Departments")
        
        drill.status = 'RUNNING' 
        drill.save()
        
        return Response({
            "message": "Campaign created and launched successfully.",
            "drill_id": drill.id
        })

class AdminDrillDeleteView(generics.DestroyAPIView):
    """
    DELETE /api/admin/campaigns/<id>/delete/
    Allows admins to remove a campaign.
    """
    queryset = Drill.objects.all()
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, *args, **kwargs):
        if request.user.role not in ['INSTITUTION_ADMIN', 'SUPER_ADMIN']:
             return Response({"error": "Unauthorized"}, status=403)
        return super().destroy(request, *args, **kwargs)

class AdminDrillUpdateQuestionsView(APIView):
    """
    PUT /api/admin/campaigns/<id>/update_questions/
    Updates the questions and choices for a drill (from the Edit Modal).
    """
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        if request.user.role not in ['INSTITUTION_ADMIN', 'SUPER_ADMIN']:
             return Response({"error": "Unauthorized"}, status=403)

        try:
            drill = Drill.objects.get(pk=pk)
        except Drill.DoesNotExist:
             return Response({"error": "Drill not found"}, status=404)

        questions_data = request.data.get('questions', [])
        
        # Use atomic transaction to ensure data integrity
        with transaction.atomic():
            # 1. Clear existing questions (Simplest way to handle re-ordering/deletion)
            # Alternatively, you could update in place, but wiping is safer for this prototype
            drill.questions.all().delete()
            
            # 2. Re-create questions and choices
            for i, q_data in enumerate(questions_data):
                question = DrillQuestion.objects.create(
                    drill=drill,
                    text=q_data.get('text'),
                    points=q_data.get('points', 10),
                    order=i + 1
                )
                
                for c_data in q_data.get('choices', []):
                    DrillChoice.objects.create(
                        question=question,
                        text=c_data.get('text'),
                        is_correct=c_data.get('is_correct', False),
                        explanation=c_data.get('explanation', '')
                    )
        
        return Response({"message": "Drill updated successfully"})