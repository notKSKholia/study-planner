from flask import Blueprint, jsonify, request
from .ai_service import AIService

api_bp = Blueprint('api', __name__)
ai_service = AIService()

@api_bp.route('/generate-plan', methods=['POST'])
def generate_plan():
    data = request.json
    syllabus = data.get('syllabus')
    hours = data.get('hours')
    weak_subjects = data.get('weak_subjects')
    
    plan = ai_service.generate_study_plan(syllabus, hours, weak_subjects)
    return jsonify(plan)

@api_bp.route('/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message')
    
    response = ai_service.get_chat_response(message)
    return jsonify({"response": response})
