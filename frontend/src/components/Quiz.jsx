import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Quiz.css';

const CareerInterestQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(25).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [timePerQuestion, setTimePerQuestion] = useState([]);
  const [startTime, setStartTime] = useState(Date.now());
  
  const questions = [
    // 🎨 Creative & Artistic
    { 
      id: 1, 
      text: "Do you enjoy drawing or sketching in your free time?", 
      category: "Creative & Artistic",
      feature: "Drawing",
      icon: "🎨"
    },
    { 
      id: 2, 
      text: "Do you love dancing as a form of expression?", 
      category: "Creative & Artistic",
      feature: "Dancing",
      icon: "💃"
    },
    { 
      id: 3, 
      text: "Do you participate in singing or enjoy vocal music?", 
      category: "Creative & Artistic",
      feature: "Singing",
      icon: "🎤"
    },
    { 
      id: 4, 
      text: "Are you passionate about photography and capturing moments?", 
      category: "Creative & Artistic",
      feature: "Photography",
      icon: "📸"
    },
    { 
      id: 5, 
      text: "Do you enjoy makeup and fashion styling?", 
      category: "Creative & Artistic",
      feature: "Makeup",
      icon: "💄"
    },
    { 
      id: 6, 
      text: "Do you like designing clothes, graphics, or posters?", 
      category: "Creative & Artistic",
      feature: "Designing",
      icon: "👗"
    },
    
    // 🧠 Logical & Scientific
    { 
      id: 7, 
      text: "Are you interested in solving puzzles or brain games?", 
      category: "Logical & Scientific",
      feature: "Solving Puzzles",
      icon: "🧩"
    },
    { 
      id: 8, 
      text: "Do you enjoy coding or programming challenges?", 
      category: "Logical & Scientific",
      feature: "Coding",
      icon: "💻"
    },
    { 
      id: 9, 
      text: "Are you curious about how electrical components work?", 
      category: "Logical & Scientific",
      feature: "Electricity Components",
      icon: "🔌"
    },
    { 
      id: 10, 
      text: "Do you enjoy learning about scientific concepts?", 
      category: "Logical & Scientific",
      feature: "Science, Chemistry, Physics",
      icon: "🔬"
    },
    
    // 🛠 Technical & Mechanical
    { 
      id: 11, 
      text: "Do you love understanding or repairing mechanical parts?", 
      category: "Technical & Mechanical",
      feature: "Mechanic Parts",
      icon: "🔧"
    },
    { 
      id: 12, 
      text: "Are you curious about how computers are built?", 
      category: "Technical & Mechanical",
      feature: "Computer Parts",
      icon: "🖥️"
    },
    { 
      id: 13, 
      text: "Are you interested in engineering concepts and tools?", 
      category: "Technical & Mechanical",
      feature: "Engineering",
      icon: "⚙️"
    },
    
    // 🧬 Medical & Biological
    { 
      id: 14, 
      text: "Do you want to help people as a doctor in the future?", 
      category: "Medical & Biological",
      feature: "Doctor",
      icon: "👨‍⚕️"
    },
    { 
      id: 15, 
      text: "Are you interested in medicines or pharmacy?", 
      category: "Medical & Biological",
      feature: "Pharmisist",
      icon: "💊"
    },
    { 
      id: 16, 
      text: "Do you like learning about biology, animals, or plants?", 
      category: "Medical & Biological",
      feature: "Biology, Zoology, Botany",
      icon: "🌿"
    },
    
    // 🌍 Social Sciences & Humanities
    { 
      id: 17, 
      text: "Are you fascinated by history or historical events?", 
      category: "Social Sciences & Humanities",
      feature: "History",
      icon: "📜"
    },
    { 
      id: 18, 
      text: "Do you enjoy learning about how people behave or think?", 
      category: "Social Sciences & Humanities",
      feature: "Psychology",
      icon: "🧠"
    },
    { 
      id: 19, 
      text: "Are you interested in social studies or society?", 
      category: "Social Sciences & Humanities",
      feature: "Sociology",
      icon: "👥"
    },
    
    // 💬 Languages & Literature
    { 
      id: 20, 
      text: "Do you love reading books or literature?", 
      category: "Languages & Literature",
      feature: "Literature, Reading",
      icon: "📚"
    },
    { 
      id: 21, 
      text: "Are you fluent or interested in learning new languages?", 
      category: "Languages & Literature",
      feature: "Hindi, French, English, Urdu, Other Language",
      icon: "🗣️"
    },
    
    // 💼 Business & Communication
    { 
      id: 22, 
      text: "Do you see yourself starting or managing a business?", 
      category: "Business & Communication",
      feature: "Business, Business Education",
      icon: "💼"
    },
    { 
      id: 23, 
      text: "Do you enjoy public speaking or debating?", 
      category: "Business & Communication",
      feature: "Debating",
      icon: "🎤"
    },
    { 
      id: 24, 
      text: "Are you curious about how news and media work?", 
      category: "Business & Communication",
      feature: "Journalism",
      icon: "📰"
    },
    
    // 🧘 Hobbies & Well-being
    { 
      id: 25, 
      text: "Do you practice yoga, gymnastics, or regular exercise?", 
      category: "Hobbies & Well-being",
      feature: "Yoga, Gymnastics, Exercise",
      icon: "🧘"
    }
  ];

  useEffect(() => {
    // Reset timer when question changes
    setStartTime(Date.now());
  }, [currentQuestion]);

  const handleAnswer = (score) => {
    setIsTransitioning(true);
    
    // Calculate time spent on this question
    const timeSpent = (Date.now() - startTime) / 1000;
    setTimePerQuestion([...timePerQuestion, timeSpent]);
    
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = score;
    setAnswers(newAnswers);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setIsTransitioning(false);
      } else {
        setShowResults(true);
      }
    }, 500);
  };

  const calculateResults = () => {
    // Group answers by category
    const categoryScores = {};
    const featureScores = {};
    
    questions.forEach((question, index) => {
      const score = answers[index] || 0;
      
      // Calculate category scores
      if (!categoryScores[question.category]) {
        categoryScores[question.category] = { total: 0, count: 0, icon: question.icon };
      }
      categoryScores[question.category].total += score;
      categoryScores[question.category].count += 1;
      
      // Calculate feature scores
      featureScores[question.feature] = score;
    });
    
    // Calculate average scores per category
    const averagedCategories = Object.entries(categoryScores).map(([category, data]) => ({
      category,
      score: data.total / data.count,
      icon: data.icon
    })).sort((a, b) => b.score - a.score);
    
    return {
      categories: averagedCategories,
      features: featureScores,
      totalTime: timePerQuestion.reduce((acc, time) => acc + time, 0)
    };
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers(Array(25).fill(null));
    setShowResults(false);
    setTimePerQuestion([]);
  };

  const goToHome = () => {
    navigate('/');
  };

  if (showResults) {
    const results = calculateResults();
    const topCategories = results.categories.slice(0, 3);
    const featureVector = results.features;
    const avgTimePerQuestion = results.totalTime / questions.length;
    
    return (
      <div className="quiz-results-container">
        <div className="results-background">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
          </div>
        </div>
        
        <div className="results-content">
          <div className="results-header">
            <h1>Your Career Interest Assessment</h1>
            <p>Based on your answers, we've identified your top interest areas</p>
          </div>
          
          <div className="results-stats">
            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <h3>{Math.round(results.totalTime)}s</h3>
              <p>Total Time</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">❓</div>
              <h3>{questions.length}</h3>
              <p>Questions Answered</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <h3>{Math.round(avgTimePerQuestion)}s</h3>
              <p>Avg. per Question</p>
            </div>
          </div>
          
          <div className="results-section">
            <h2>Your Top Interest Categories</h2>
            <div className="category-results">
              {topCategories.map((item, index) => (
                <div key={item.category} className="category-card" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="category-rank">
                    <span className="rank-badge">#{index + 1}</span>
                    <span className="category-icon">{item.icon}</span>
                  </div>
                  <h3>{item.category}</h3>
                  <div className="score-container">
                    <div className="score-bar">
                      <div 
                        className="score-fill" 
                        style={{ width: `${(item.score / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="score-value">{item.score.toFixed(1)}/5.0</span>
                  </div>
                  <div className="category-description">
                    {getCategoryDescription(item.category)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="results-section">
            <h2>Career Recommendations</h2>
            <div className="career-recommendations">
              {topCategories.map((category, index) => (
                <div key={category.category} className="career-card" style={{ animationDelay: `${0.6 + index * 0.2}s` }}>
                  <h3>{category.category}</h3>
                  <ul>
                    {getCareerSuggestions(category.category).map((career, i) => (
                      <li key={i}>{career}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          
          <div className="results-section">
            <h2>Next Steps</h2>
            <div className="next-steps">
              <div className="step-card">
                <div className="step-number">1</div>
                <h3>Explore Careers</h3>
                <p>Learn more about the careers that match your interests</p>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <h3>Find Colleges</h3>
                <p>Discover colleges in Maharashtra that offer relevant programs</p>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <h3>Apply for Scholarships</h3>
                <p>Find financial aid options to support your education</p>
              </div>
            </div>
          </div>
          
          <div className="action-buttons">
            <button onClick={resetQuiz} className="btn btn-secondary">
              <span className="btn-icon">🔄</span>
              Retake Quiz
            </button>
            <button onClick={goToHome} className="btn btn-primary">
              <span className="btn-icon">🏠</span>
              Return to Home
            </button>
            <button className="btn btn-accent">
              <span className="btn-icon">📊</span>
              View Detailed Analysis
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  
  return (
    <div className="quiz-container">
      <div className="quiz-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>
      
      <div className="quiz-header">
        <button onClick={goToHome} className="back-button">
          <span className="back-icon">←</span>
          Back to Home
        </button>
        <h1>Career Interest Quiz</h1>
        <p>Discover your perfect career path based on your interests</p>
      </div>
      
      <div className="quiz-progress">
        <div className="progress-info">
          <span className="progress-text">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="progress-percent">
            {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
          </span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className={`question-container ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
        <div className="question-card">
          <div className="category-badge">
            <span className="category-icon">{currentQ.icon}</span>
            {currentQ.category}
          </div>
          
          <h2 className="question-text">{currentQ.text}</h2>
          
          <div className="likert-scale">
            <div className="scale-labels">
              <span>Strongly Disagree</span>
              <span>Strongly Agree</span>
            </div>
            
            <div className="scale-options">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  className={`scale-option ${answers[currentQuestion] === score ? 'selected' : ''}`}
                  onClick={() => handleAnswer(score)}
                >
                  <span className="option-emoji">{getEmojiForScore(score)}</span>
                  <span className="option-number">{score}</span>
                </button>
              ))}
            </div>
            
            <div className="scale-help">
              Select the number that best represents your agreement with the statement
            </div>
          </div>
        </div>
        
        <div className="navigation-buttons">
          {currentQuestion > 0 && (
            <button 
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentQuestion(currentQuestion - 1);
                  setIsTransitioning(false);
                }, 300);
              }} 
              className="nav-button prev-button"
            >
              Previous Question
            </button>
          )}
          
          <div className="question-count">
            {currentQuestion + 1} / {questions.length}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
function getEmojiForScore(score) {
  const emojis = ['😞', '😐', '🙂', '😊', '😍'];
  return emojis[score - 1];
}

function getCategoryDescription(category) {
  const descriptions = {
    "Creative & Artistic": "You have a strong inclination towards creative expression and artistic endeavors.",
    "Logical & Scientific": "You excel in analytical thinking and have a curiosity for scientific inquiry.",
    "Technical & Mechanical": "You enjoy working with tools, machines, and understanding how things work.",
    "Medical & Biological": "You have an interest in healthcare, biology, and helping others through medicine.",
    "Social Sciences & Humanities": "You're fascinated by human behavior, societies, and historical contexts.",
    "Languages & Literature": "You have an affinity for language, communication, and literary works.",
    "Business & Communication": "You're drawn to entrepreneurship, management, and effective communication.",
    "Hobbies & Well-being": "You value physical activity, wellness, and recreational pursuits."
  };
  
  return descriptions[category] || "This area aligns with your interests and strengths.";
}

function getCareerSuggestions(category) {
  const suggestions = {
    "Creative & Artistic": ["Graphic Designer", "Art Director", "Animator", "Fashion Designer", "Photographer"],
    "Logical & Scientific": ["Data Scientist", "Software Developer", "Research Scientist", "Mathematician", "Physicist"],
    "Technical & Mechanical": ["Mechanical Engineer", "Automotive Technician", "Aerospace Engineer", "Robotics Engineer", "Civil Engineer"],
    "Medical & Biological": ["Doctor", "Surgeon", "Pharmacist", "Dentist", "Veterinarian"],
    "Social Sciences & Humanities": ["Psychologist", "Historian", "Sociologist", "Social Worker", "Archaeologist"],
    "Languages & Literature": ["Writer", "Translator", "Editor", "Linguist", "Journalist"],
    "Business & Communication": ["Business Manager", "Marketing Director", "HR Specialist", "Entrepreneur", "Public Relations Manager"],
    "Hobbies & Well-being": ["Fitness Trainer", "Yoga Instructor", "Nutritionist", "Physical Therapist", "Sports Coach"]
  };
  
  return suggestions[category] || ["Career Counselor", "Life Coach", "Education Consultant"];
}

export default CareerInterestQuiz;