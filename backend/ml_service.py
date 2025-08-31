#!/usr/bin/env python3
"""
ML Service for Career Prediction
This is a Python Flask microservice that runs the actual ML model
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import json
import os
from pathlib import Path

app = Flask(__name__)
CORS(app)

# Load the ML model
MODEL_PATH = Path(__file__).parent / "ml_model" / "career_predictor_model.pkl"
COURSE_DATA_PATH = Path(__file__).parent / "ml_model" / "course_suggestions_with_colleges.json"

try:
    model = joblib.load(MODEL_PATH)
    print(f"✅ ML Model loaded successfully from {MODEL_PATH}")
except Exception as e:
    print(f"❌ Failed to load ML model: {e}")
    model = None

# Load course data
try:
    with open(COURSE_DATA_PATH, 'r', encoding='utf-8') as f:
        course_data = json.load(f)
    print(f"✅ Course data loaded successfully from {COURSE_DATA_PATH}")
except Exception as e:
    print(f"❌ Failed to load course data: {e}")
    course_data = []

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'OK',
        'model_loaded': model is not None,
        'course_data_loaded': len(course_data) > 0,
        'message': 'ML Service is running'
    })

@app.route('/predict', methods=['POST'])
def predict_career():
    """Predict career based on quiz answers"""
    try:
        data = request.get_json()
        answers = data.get('answers', [])
        
        if not answers or len(answers) != 25:
            return jsonify({
                'success': False,
                'message': 'Invalid answers format. Expected 25 answers.'
            }), 400
        
        if model is None:
            return jsonify({
                'success': False,
                'message': 'ML model not loaded'
            }), 500
        
        # Convert answers to feature vector
        # This should match the exact feature order used during training
        features = [
            'Drawing', 'Dancing', 'Singing', 'Photography', 'Makeup', 'Designing',
            'Solving Puzzles', 'Coding', 'Electricity Components', 'Science, Chemistry, Physics',
            'Mechanic Parts', 'Computer Parts', 'Engineering', 'Doctor', 'Gardening',
            'Biology', 'Chemistry', 'Business', 'Management', 'Leadership',
            'Communication', 'Helping Others', 'Teaching', 'Counseling', 'Social Work'
        ]
        
        # Create feature vector
        feature_vector = {}
        for i, feature in enumerate(features):
            feature_vector[feature] = answers[i] if i < len(answers) else 0
        
        # Convert to DataFrame (adjust column names to match training data)
        # You may need to adjust this based on your actual training data structure
        df = pd.DataFrame([feature_vector])
        
        # Make prediction
        try:
            prediction = model.predict(df)[0]
            prediction_proba = model.predict_proba(df)[0] if hasattr(model, 'predict_proba') else None
            
            # Get top features based on scores
            top_features = sorted(feature_vector.items(), key=lambda x: x[1], reverse=True)[:5]
            
            # Find matching courses
            recommended_courses = find_matching_courses(top_features, course_data)
            
            result = {
                'success': True,
                'prediction': {
                    'predicted_course': prediction,
                    'confidence': float(max(prediction_proba)) if prediction_proba is not None else 0.8,
                    'topFeatures': top_features,
                    'recommendedCourses': recommended_courses,
                    'featureScores': feature_vector,
                    'message': f'Based on your interests, we recommend: {prediction}'
                }
            }
            
            return jsonify(result)
            
        except Exception as e:
            print(f"Prediction error: {e}")
            # Fallback to rule-based prediction
            return jsonify({
                'success': True,
                'prediction': fallback_prediction(answers, course_data)
            })
            
    except Exception as e:
        print(f"Error in predict_career: {e}")
        return jsonify({
            'success': False,
            'message': f'Prediction failed: {str(e)}'
        }), 500

def find_matching_courses(top_features, course_data):
    """Find courses that match the top features"""
    recommendations = []
    
    for feature, score in top_features:
        if score >= 4:  # High interest
            matching_courses = []
            
            for course in course_data:
                course_lower = course['course'].lower()
                feature_lower = feature.lower()
                
                # Simple keyword matching
                if (feature_lower in course_lower or 
                    feature_lower in course.get('overview', '').lower() or
                    any(feature_lower in skill.lower() for skill in course.get('skills_required', []))):
                    matching_courses.append(course)
            
            if matching_courses:
                recommendations.append({
                    'feature': feature,
                    'score': score,
                    'courses': matching_courses[:3]  # Top 3 matching courses
                })
    
    # If no specific matches, suggest popular courses
    if not recommendations:
        recommendations.append({
            'feature': 'General Interest',
            'score': 3,
            'courses': course_data[:5]  # Top 5 general courses
        })
    
    return recommendations

def fallback_prediction(answers, course_data):
    """Fallback prediction when ML model fails"""
    # Simple rule-based prediction
    features = [
        'Drawing', 'Dancing', 'Singing', 'Photography', 'Makeup', 'Designing',
        'Solving Puzzles', 'Coding', 'Electricity Components', 'Science, Chemistry, Physics',
        'Mechanic Parts', 'Computer Parts', 'Engineering', 'Doctor', 'Gardening',
        'Biology', 'Chemistry', 'Business', 'Management', 'Leadership',
        'Communication', 'Helping Others', 'Teaching', 'Counseling', 'Social Work'
    ]
    
    feature_scores = {}
    for i, feature in enumerate(features):
        feature_scores[feature] = answers[i] if i < len(answers) else 0
    
    top_features = sorted(feature_scores.items(), key=lambda x: x[1], reverse=True)[:5]
    recommended_courses = find_matching_courses(top_features, course_data)
    
    return {
        'predicted_course': 'General Studies',
        'confidence': 0.6,
        'topFeatures': top_features,
        'recommendedCourses': recommended_courses,
        'featureScores': feature_scores,
        'message': 'Based on your interests, here are some career paths to consider'
    }

if __name__ == '__main__':
    print("🚀 Starting ML Service...")
    print(f"📁 Model path: {MODEL_PATH}")
    print(f"📁 Course data path: {COURSE_DATA_PATH}")
    
    # Run the Flask app
    app.run(host='0.0.0.0', port=5001, debug=True)
