import json
import logging
import google.generativeai as genai
from django.conf import settings
from django.db import transaction
from .models import Drill, DrillQuestion, DrillChoice
from apps.sentry.models import ThreatEvent
from django.utils import timezone

# Configure Logger
logger = logging.getLogger(__name__)

# Configure Gemini
# Ensure GEMINI_API_KEY is in your settings.py
genai.configure(api_key=settings.GEMINI_API_KEY)

class DrillMasterService:
    @staticmethod
    def generate_drill(topic, difficulty, student_department="General"):
        """
        Generates a fresh drill using Gemini AI.
        """
        
        # 1. CACHE CHECK (Disabled for now so you can test AI generation)
        # Uncomment this only if you want to save money/tokens later.
        # existing_drill = Drill.objects.filter(title__iexact=topic).first()
        # if existing_drill:
        #     return existing_drill

        print(f"🤖 [AI] Generating new drill for: {topic} ({difficulty})")

        # 2. Construct Strict JSON Prompt
        # We explicitly ask for a list of 3 questions to prevent single-question outputs.
        prompt = f"""
        Act as a Cybersecurity Expert. Create a "Social Engineering Simulation" for a {student_department} student.
        
        Topic: {topic}
        Difficulty: {difficulty}
        
        Goal: Test the student's ability to detect this specific threat.
        
        Output strictly valid JSON (no markdown, no code blocks) following this exact schema:
        {{
            "title": "A short, specific title based on the topic",
            "description": "A 1-sentence scenario description.",
            "questions": [
                {{
                    "text": "Question 1 text...",
                    "points": 10,
                    "choices": [
                        {{ "text": "Wrong Option", "is_correct": false, "explanation": "Why it's wrong" }},
                        {{ "text": "Correct Option", "is_correct": true, "explanation": "Why it's right" }},
                        {{ "text": "Another Wrong Option", "is_correct": false, "explanation": "Why it's wrong" }}
                    ]
                }},
                {{
                    "text": "Question 2 text...",
                    "points": 10,
                    "choices": [ ... ]
                }},
                {{
                    "text": "Question 3 text...",
                    "points": 10,
                    "choices": [ ... ]
                }}
            ]
        }}
        
        Ensure you generate exactly 3 DISTINCT questions.
        """

        try:
            # Use 'gemini-1.5-flash' for better speed and JSON adherence
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content(prompt)
            
            # 3. Clean & Parse JSON
            raw_text = response.text
            # Remove markdown code blocks if present
            if "```json" in raw_text:
                raw_text = raw_text.split("```json")[1].split("```")[0]
            elif "```" in raw_text:
                raw_text = raw_text.split("```")[1].split("```")[0]
                
            data = json.loads(raw_text.strip())

            # 4. Save to Database (Atomic: All or Nothing)
            with transaction.atomic():
                drill = Drill.objects.create(
                    title=data.get('title', f"{topic} Simulation"),
                    description=data.get('description', f"A drill about {topic}"),
                    category='PHISHING',
                    difficulty=difficulty,
                    xp_reward=100 if difficulty == 'Hard' else 50,
                    is_mandatory=True,
                    status='RUNNING'
                )

                # Loop through the questions array
                questions_data = data.get('questions', [])
                
                # Fallback if AI returns a single dict instead of a list (rare edge case)
                if isinstance(questions_data, dict):
                    questions_data = [questions_data]

                for idx, q_data in enumerate(questions_data):
                    question = DrillQuestion.objects.create(
                        drill=drill,
                        text=q_data.get('text', 'Question text missing'),
                        order=idx + 1,
                        points=q_data.get('points', 10)
                    )
                    
                    for c_data in q_data.get('choices', []):
                        DrillChoice.objects.create(
                            question=question,
                            text=c_data.get('text', 'Option'),
                            is_correct=c_data.get('is_correct', False),
                            explanation=c_data.get('explanation', '')
                        )

            print(f"[AI] Successfully created drill: {drill.title}")
            return drill

        except json.JSONDecodeError as e:
            logger.error(f"JSON Parse Error: {e}")
            logger.error(f"Raw Output: {raw_text}")
            return DrillMasterService.create_fallback_drill(topic, "AI Output Invalid")
            
        except Exception as e:
            logger.error(f"General AI Error: {e}")
            return DrillMasterService.create_fallback_drill(topic, str(e))

    @staticmethod
    def create_fallback_drill(topic, error_reason="Unknown"):
        """
        Emergency fallback if AI fails.
        """
        print(f"Creating Fallback Drill for {topic}. Reason: {error_reason}")
        drill = Drill.objects.create(
            title=f"Manual: {topic}",
            description="Standard security protocol review (AI Unavailable).",
            category='GENERAL',
            xp_reward=25,
            status='RUNNING'
        )
        
        # Q1
        q1 = DrillQuestion.objects.create(drill=drill, text="What is the first thing you check in a suspicious email?", order=1, points=10)
        DrillChoice.objects.create(question=q1, text="The Sender Address", is_correct=True, explanation="Always verify the domain matches the official organization.")
        DrillChoice.objects.create(question=q1, text="The Subject Line", is_correct=False, explanation="Subject lines can be easily faked.")
        
        # Q2
        q2 = DrillQuestion.objects.create(drill=drill, text="Is it safe to click 'Unsubscribe' on a spam email?", order=2, points=10)
        DrillChoice.objects.create(question=q2, text="No, never.", is_correct=True, explanation="It confirms your email is active to the spammer.")
        DrillChoice.objects.create(question=q2, text="Yes, always.", is_correct=False, explanation="This effectively validates your email address.")

        return drill
    

class BreachCheckerService:
    HIBP_URL = "https://haveibeenpwned.com/api/v3/breachedaccount/"

    @staticmethod
    def check_email(user):
        """
        Checks the HIBP API for breaches. 
        If no API Key is set, it runs in simulation mode for demo purposes.
        """
        api_key = getattr(settings, 'HIBP_API_KEY', None)
        
        # --- SIMULATION MODE (Default) ---
        if not api_key:
            logger.info(f"🕵️ [Mock Dark Web] Scanning for {user.email}...")
            return BreachCheckerService._run_simulation(user)

        # --- REAL MODE (With API Key) ---
        headers = {
            "hibp-api-key": api_key,
            "user-agent": "Aegis-Security-Monitor"
        }
        
        try:
            # The API returns 200 (Found), 404 (Not Found), or 429 (Rate Limit)
            response = requests.get(
                f"{BreachCheckerService.HIBP_URL}{user.email}?truncateResponse=false", 
                headers=headers,
                timeout=5
            )

            if response.status_code == 200:
                breaches = response.json()
                return BreachCheckerService._process_breaches(user, breaches)
            elif response.status_code == 404:
                return 0 # Clean
            else:
                logger.error(f"HIBP Error: {response.status_code}")
                return 0

        except Exception as e:
            logger.error(f"Breach Check Failed: {e}")
            return 0

    @staticmethod
    def _process_breaches(user, breaches_data):
        """
        Saves new breaches to the ThreatEvent table.
        """
        count = 0
        for breach in breaches_data:
            # Use the breach name as the signature
            signature = f"Breach: {breach.get('Name', 'Unknown Source')}"
            
            # Avoid duplicates (Check if we already logged this specific breach for this user)
            exists = ThreatEvent.objects.filter(
                user=user, 
                type='BREACH', 
                threat_signature=signature
            ).exists()
            
            if not exists:
                ThreatEvent.objects.create(
                    user=user,
                    type='BREACH',
                    threat_signature=signature,
                    status='RESOLVED', # Just a notification, not an active attack
                    url=breach.get('Domain', 'darkweb.onion')
                )
                count += 1
        
        return count

    @staticmethod
    def _run_simulation(user):
        """
        Mock Logic:
        - If email contains 'test', 'victim', or 'admin', simulate a breach.
        - Otherwise, return clean.
        """
        if any(keyword in user.email.lower() for keyword in ['test', 'victim', 'admin', 'hacked']):
            
            # Simulate a "LinkedIn 2021" Breach
            fake_breach_name = "LinkedIn Scrape (2021)"
            if not ThreatEvent.objects.filter(user=user, threat_signature=f"Breach: {fake_breach_name}").exists():
                ThreatEvent.objects.create(
                    user=user,
                    type='BREACH',
                    threat_signature=f"Breach: {fake_breach_name}",
                    status='RESOLVED',
                    url="linkedin.com"
                )
                return 1 # Found 1 new breach
        
        return 0