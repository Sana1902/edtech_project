const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// ML Model Prediction Route
router.post('/predict-career', protect, [
  body('answers').isArray().withMessage('Answers must be an array'),
  body('answers.*').isInt({ min: 1, max: 5 }).withMessage('Each answer must be between 1-5')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { answers } = req.body;
    
    // Load course suggestions data
    const courseDataPath = path.join(__dirname, '../ml_model/course_suggestions_with_colleges.json');
    let courseData = [];
    
    try {
      const courseDataContent = fs.readFileSync(courseDataPath, 'utf8');
      courseData = JSON.parse(courseDataContent);
    } catch (error) {
      console.error('Error reading course data:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to load course data'
      });
    }

    // For now, we'll simulate ML prediction since we can't run Python directly in Node.js
    // In production, you would either:
    // 1. Use a Python microservice
    // 2. Use TensorFlow.js
    // 3. Use a cloud ML service
    
    // Simulate prediction based on quiz answers
    const prediction = simulateMLPrediction(answers, courseData);
    
    // Store prediction in user's profile (optional)
    // You can add this to the user model if needed
    
    res.json({
      success: true,
      prediction: prediction,
      message: 'Career prediction completed successfully'
    });

  } catch (error) {
    console.error('ML Prediction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process career prediction',
      error: error.message
    });
  }
});

// Simulate ML prediction based on quiz answers
function simulateMLPrediction(answers, courseData) {
  // This is a simplified simulation - replace with actual ML model
  const categories = {
    'Creative & Artistic': ['Drawing', 'Dancing', 'Singing', 'Photography', 'Makeup', 'Designing'],
    'Logical & Scientific': ['Solving Puzzles', 'Coding', 'Electricity Components', 'Science, Chemistry, Physics'],
    'Technical & Mechanical': ['Mechanic Parts', 'Computer Parts', 'Engineering'],
    'Medical & Biological': ['Doctor', 'Gardening', 'Biology', 'Chemistry'],
    'Business & Management': ['Business', 'Management', 'Leadership', 'Communication'],
    'Social & Helping': ['Helping Others', 'Teaching', 'Counseling', 'Social Work'],
    'Technology & Innovation': ['Technology', 'Innovation', 'Problem Solving', 'Analytical Thinking']
  };

  // Calculate category scores
  const categoryScores = {};
  Object.keys(categories).forEach(category => {
    categoryScores[category] = 0;
  });

  // Map answers to features and calculate scores
  const features = [
    'Drawing', 'Dancing', 'Singing', 'Photography', 'Makeup', 'Designing',
    'Solving Puzzles', 'Coding', 'Electricity Components', 'Science, Chemistry, Physics',
    'Mechanic Parts', 'Computer Parts', 'Engineering', 'Doctor', 'Gardening',
    'Biology', 'Chemistry', 'Business', 'Management', 'Leadership',
    'Communication', 'Helping Others', 'Teaching', 'Counseling', 'Social Work'
  ];

  // Calculate feature scores
  const featureScores = {};
  features.forEach((feature, index) => {
    featureScores[feature] = answers[index] || 0;
  });

  // Determine top interests
  const topFeatures = Object.entries(featureScores)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Select courses based on top interests
  const recommendedCourses = selectCoursesByInterests(topFeatures, courseData);

  return {
    topFeatures: topFeatures,
    recommendedCourses: recommendedCourses,
    featureScores: featureScores,
    message: 'Based on your interests, here are some career paths to consider'
  };
}

// Select courses based on user interests
function selectCoursesByInterests(topFeatures, courseData) {
  const recommendations = [];
  
  // Simple matching logic - in production, use more sophisticated ML
  topFeatures.forEach(([feature, score]) => {
    if (score >= 4) { // High interest
      const matchingCourses = courseData.filter(course => {
        const courseLower = course.course.toLowerCase();
        const featureLower = feature.toLowerCase();
        
        // Simple keyword matching
        return courseLower.includes(featureLower) || 
               course.overview.toLowerCase().includes(featureLower) ||
               course.skills_required.some(skill => 
                 skill.toLowerCase().includes(featureLower)
               );
      });
      
      if (matchingCourses.length > 0) {
        recommendations.push({
          feature: feature,
          score: score,
          courses: matchingCourses.slice(0, 3) // Top 3 matching courses
        });
      }
    }
  });

  // If no specific matches, suggest popular courses
  if (recommendations.length === 0) {
    recommendations.push({
      feature: 'General Interest',
      score: 3,
      courses: courseData.slice(0, 5) // Top 5 general courses
    });
  }

  return recommendations;
}

module.exports = router;
