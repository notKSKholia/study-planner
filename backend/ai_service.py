import os
import json
from google import genai
from google.genai import types

class AIService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if self.api_key:
            self.client = genai.Client(api_key=self.api_key)
            self.model_name = "gemini-1.5-flash"
        else:
            print("Warning: GEMINI_API_KEY not found. Running in Mock Mode.")
            self.client = None

    def generate_study_plan(self, syllabus, hours, weak_subjects):
        """
        Generates a study plan using Gemini or returns mock data.
        """
        if not self.client:
            return self._get_mock_plan()

        prompt = f"""
        Act as an expert study planner. Create a structured study plan based on the following:
        - Syllabus: {syllabus}
        - Available Daily Hours: {hours}
        - Weak Subjects: {weak_subjects} (Prioritize these)

        Output ONLY a valid JSON object with the following structure:
        {{
            "plan": [
                {{"day": "Day 1", "subject": "Subject Name", "topic": "Topic Name", "duration": "Duration", "tips": "Brief tip"}}
            ]
        }}
        Do not include markdown formatting like ```json.
        """
        
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
            # With response_mime_type='application/json', the text should be pure JSON
            return json.loads(response.text)
        except Exception as e:
            print(f"Error generating plan: {e}")
            return self._get_mock_plan()

    def get_chat_response(self, message):
        """
        Generates a chat response using Gemini or returns mock data.
        """
        if not self.client:
            return "I am your Exam Buddy! (Mock Mode). You said: " + message

        try:
            prompt = f"You are a helpful exam preparation assistant. Answer the student's doubt: {message}"
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )
            return response.text
        except Exception as e:
            print(f"Error in chat: {e}")
            return "Sorry, I encountered an error processing your request."

    def _get_mock_plan(self):
        return {
            "plan": [
                {"day": "Monday", "subject": "Math", "topic": "Calculus (Mock)", "duration": "2 hours", "tips": "Focus on derivatives"},
                {"day": "Monday", "subject": "Physics", "topic": "Optics (Mock)", "duration": "1 hour", "tips": "Draw ray diagrams"}
            ]
        }
