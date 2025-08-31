import React, { useState } from 'react';

const CareerInterestQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(25).fill(null));
  const [showResults, setShowResults] = useState(false);
  
  const questions = [
    // 🎨 Creative & Artistic
    { 
      id: 1, 
      text: "Do you enjoy drawing or sketching in your free time?", 
      category: "Creative & Artistic",
      feature: "Drawing"
    },
    { 
      id: 2, 
      text: "Do you love dancing as a form of expression?", 
      category: "Creative & Artistic",
      feature: "Dancing"
    },
    { 
      id: 3, 
      text: "Do you participate in singing or enjoy vocal music?", 
      category: "Creative & Artistic",
      feature: "Singing"
    },
    { 
      id: 4, 
      text: "Are you passionate about photography and capturing moments?", 
      category: "Creative & Artistic",
      feature: "Photography"
    },
    { 
      id: 5, 
      text: "Do you enjoy makeup and fashion styling?", 
      category: "Creative & Artistic",
      feature: "Makeup"
    },
    { 
      id: 6, 
      text: "Do you like designing clothes, graphics, or posters?", 
      category: "Creative & Artistic",
      feature: "Designing"
    },
    
    // 🧠 Logical & Scientific
    { 
      id: 7, 
      text: "Are you interested in solving puzzles or brain games?", 
      category: "Logical & Scientific",
      feature: "Solving Puzzles"
    },
    { 
      id: 8, 
      text: "Do you enjoy coding or programming challenges?", 
      category: "Logical & Scientific",
      feature: "Coding"
    },
    { 
      id: 9, 
      text: "Are you curious about how electrical components work?", 
      category: "Logical & Scientific",
      feature: "Electricity Components"
    },
    { 
      id: 10, 
      text: "Do you enjoy learning about scientific concepts?", 
      category: "Logical & Scientific",
      feature: "Science, Chemistry, Physics"
    },
    
    // 🛠 Technical & Mechanical
    { 
      id: 11, 
      text: "Do you love understanding or repairing mechanical parts?", 
      category: "Technical & Mechanical",
      feature: "Mechanic Parts"
    },
    { 
      id: 12, 
      text: "Are you curious about how computers are built?", 
      category: "Technical & Mechanical",
      feature: "Computer Parts"
    },
    { 
      id: 13, 
      text: "Are you interested in engineering concepts and tools?", 
      category: "Technical & Mechanical",
      feature: "Engineering"
    },
    
    // 🧬 Medical & Biological
    { 
      id: 14, 
      text: "Do you want to help people as a doctor in the future?", 
      category: "Medical & Biological",
      feature: "Doctor"
    },
    { 
      id: 15, 
      text: "Are you interested in medicines or pharmacy?", 
      category: "Medical & Biological",
      feature: "Pharmisist"
    },
    { 
      id: 16, 
      text: "Do you like learning about biology, animals, or plants?", 
      category: "Medical & Biological",
      feature: "Biology, Zoology, Botany"
    },
    
    // 🌍 Social Sciences & Humanities
    { 
      id: 17, 
      text: "Are you fascinated by history or historical events?", 
      category: "Social Sciences & Humanities",
      feature: "History"
    },
    { 
      id: 18, 
      text: "Do you enjoy learning about how people behave or think?", 
      category: "Social Sciences & Humanities",
      feature: "Psychology"
    },
    { 
      id: 19, 
      text: "Are you interested in social studies or society?", 
      category: "Social Sciences & Humanities",
      feature: "Sociology"
    },
    
    // 💬 Languages & Literature
    { 
      id: 20, 
      text: "Do you love reading books or literature?", 
      category: "Languages & Literature",
      feature: "Literature, Reading"
    },
    { 
      id: 21, 
      text: "Are you fluent or interested in learning new languages?", 
      category: "Languages & Literature",
      feature: "Hindi, French, English, Urdu, Other Language"
    },
    
    // 💼 Business & Communication
    { 
      id: 22, 
      text: "Do you see yourself starting or managing a business?", 
      category: "Business & Communication",
      feature: "Business, Business Education"
    },
    { 
      id: 23, 
      text: "Do you enjoy public speaking or debating?", 
      category: "Business & Communication",
      feature: "Debating"
    },
    { 
      id: 24, 
      text: "Are you curious about how news and media work?", 
      category: "Business & Communication",
      feature: "Journalism"
    },
    
    // 🧘 Hobbies & Well-being
    { 
      id: 25, 
      text: "Do you practice yoga, gymnastics, or regular exercise?", 
      category: "Hobbies & Well-being",
      feature: "Yoga, Gymnastics, Exercise"
    }
  ];

  const handleAnswer = (score) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = score;
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateResults = () => {
    // Group answers by category
    const categoryScores = {};
    const featureScores = {};
    
    questions.forEach((question, index) => {
      const score = answers[index] || 0;
      
      // Calculate category scores
      if (!categoryScores[question.category]) {
        categoryScores[question.category] = { total: 0, count: 0 };
      }
      categoryScores[question.category].total += score;
      categoryScores[question.category].count += 1;
      
      // Calculate feature scores
      featureScores[question.feature] = score;
    });
    
    // Calculate average scores per category
    const averagedCategories = Object.entries(categoryScores).map(([category, data]) => ({
      category,
      score: data.total / data.count
    })).sort((a, b) => b.score - a.score);
    
    return {
      categories: averagedCategories,
      features: featureScores
    };
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers(Array(25).fill(null));
    setShowResults(false);
  };

  if (showResults) {
    const results = calculateResults();
    const topCategories = results.categories.slice(0, 3);
    const featureVector = results.features;
    
    return (
      <div className="quiz-container results">
        <h2>Your Career Interest Assessment</h2>
        
        <div className="results-section">
          <h3>Top Interest Categories</h3>
          <div className="category-results">
            {topCategories.map((item, index) => (
              <div key={item.category} className="category-card">
                <div className="rank-badge">#{index + 1}</div>
                <h4>{item.category}</h4>
                <div className="score-bar">
                  <div 
                    className="score-fill" 
                    style={{ width: `${(item.score / 5) * 100}%` }}
                  ></div>
                  <span className="score-value">{item.score.toFixed(1)}/5.0</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="results-section">
          <h3>Your Feature Vector (For ML Model)</h3>
          <div className="feature-grid">
            {Object.entries(featureVector).map(([feature, score]) => (
              <div key={feature} className="feature-item">
                <span className="feature-name">{feature}</span>
                <span className="feature-score">{score !== null ? score : 'N/A'}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="action-buttons">
          <button onClick={resetQuiz} className="retake-btn">Retake Quiz</button>
          <button 
            onClick={() => alert("This would connect to your ML model in a real implementation")}
            className="predict-btn"
          >
            Predict Suitable Careers
          </button>
        </div>
        
        <style jsx>{`
          .results {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          
          .results-section {
            margin-bottom: 30px;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
          }
          
          .category-results {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-top: 20px;
          }
          
          .category-card {
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            position: relative;
          }
          
          .rank-badge {
            position: absolute;
            top: -10px;
            left: -10px;
            background: #4CAF50;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
          }
          
          .score-bar {
            height: 20px;
            background: #e0e0e0;
            border-radius: 10px;
            margin-top: 10px;
            position: relative;
            overflow: hidden;
          }
          
          .score-fill {
            height: 100%;
            background: #4CAF50;
            border-radius: 10px;
          }
          
          .score-value {
            position: absolute;
            right: 10px;
            top: 0;
            line-height: 20px;
            color: white;
            font-size: 12px;
            text-shadow: 0 0 2px rgba(0,0,0,0.5);
          }
          
          .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 10px;
            margin-top: 15px;
          }
          
          .feature-item {
            display: flex;
            justify-content: space-between;
            padding: 8px;
            background: white;
            border-radius: 4px;
          }
          
          .feature-name {
            font-weight: 500;
          }
          
          .feature-score {
            font-weight: bold;
            color: #4CAF50;
          }
          
          .action-buttons {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 30px;
          }
          
          .retake-btn, .predict-btn {
            padding: 12px 25px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
          }
          
          .retake-btn {
            background-color: #f44336;
            color: white;
          }
          
          .retake-btn:hover {
            background-color: #d32f2f;
          }
          
          .predict-btn {
            background-color: #2196F3;
            color: white;
          }
          
          .predict-btn:hover {
            background-color: #0b7dda;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h2>Career Interest Quiz</h2>
      
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress" 
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        <span className="progress-text">
          Question {currentQuestion + 1} of {questions.length}
        </span>
      </div>
      
      <div className="question-card">
        <div className="category-tag">
          {questions[currentQuestion].category}
        </div>
        <h3>{questions[currentQuestion].text}</h3>
        
        <div className="likert-scale">
          <div className="scale-labels">
            <span>Strongly Disagree</span>
            <span>Disagree</span>
            <span>Neutral</span>
            <span>Agree</span>
            <span>Strongly Agree</span>
          </div>
          <div className="scale-options">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                className={`scale-option ${answers[currentQuestion] === score ? 'selected' : ''}`}
                onClick={() => handleAnswer(score)}
              >
                {score}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .quiz-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        
        .progress-container {
          margin: 25px 0;
        }
        
        .progress-bar {
          width: 100%;
          background-color: #f1f1f1;
          border-radius: 4px;
          height: 10px;
          margin-bottom: 5px;
        }
        
        .progress {
          height: 100%;
          background-color: #4CAF50;
          border-radius: 4px;
          transition: width 0.3s ease;
        }
        
        .progress-text {
          font-size: 14px;
          color: #666;
        }
        
        .question-card {
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 25px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          position: relative;
        }
        
        .category-tag {
          position: absolute;
          top: -10px;
          left: 15px;
          background: #2196F3;
          color: white;
          padding: 3px 10px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: bold;
        }
        
        .question-card h3 {
          margin-top: 10px;
          margin-bottom: 30px;
        }
        
        .likert-scale {
          margin-top: 20px;
        }
        
        .scale-labels {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 12px;
          color: #666;
        }
        
        .scale-options {
          display: flex;
          justify-content: space-between;
        }
        
        .scale-option {
          width: 40px;
          height: 40px;
          border: 2px solid #ddd;
          border-radius: 50%;
          background: white;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .scale-option:hover {
          background: #f0f0f0;
        }
        
        .scale-option.selected {
          background: #4CAF50;
          color: white;
          border-color: #4CAF50;
        }
      `}</style>
    </div>
  );
};

export default CareerInterestQuiz;