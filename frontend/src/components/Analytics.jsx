import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Quiz.css';

const Analytics = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const answers = location.state?.answers;
    if (!answers) {
      setError('No quiz answers provided. Please complete the quiz first.');
      setLoading(false);
      return;
    }

    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://localhost:5000/api/ml/predict-career', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ answers })
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to fetch analytics');
        }

        setResult(data.prediction);
      } catch (e) {
        setError(e.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [location.state, token]);

  const goBack = () => navigate('/quiz');
  const goHome = () => navigate('/home');

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
          <h1>Detailed Analytics</h1>
          <p>Personalized insights powered by the ML model</p>
        </div>

        {loading && (
          <div className="career-card" style={{ padding: '16px' }}>Loading analytics...</div>
        )}

        {error && (
          <div className="career-card" style={{ padding: '16px', color: '#ff6b6b' }}>{error}</div>
        )}

        {!loading && !error && result && (
          <div className="category-results">
            <div className="category-card">
              <h3>Predicted Course</h3>
              <div className="score-container">
                <span className="score-value">{result.predicted_course}</span>
              </div>
              <div className="score-container">
                <div>Confidence</div>
                <div className="score-bar">
                  <div className="score-fill" style={{ width: `${Math.min(100, Math.round((result.confidence || 0) * 100))}%` }}></div>
                </div>
                <span className="score-value">{Math.round((result.confidence || 0) * 100)}%</span>
              </div>
            </div>

            <div className="category-card">
              <h3>Top Features</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {(result.topFeatures || []).map(([feature, score], idx) => (
                  <li key={idx} style={{ padding: '6px 0', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{feature}</span>
                    <span>{score}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="category-card">
              <h3>Recommended Courses</h3>
              {(result.recommendedCourses || []).length === 0 && (
                <div>No specific course matches found. Explore general pathways.</div>
              )}
              {(result.recommendedCourses || []).map((rec, idx) => (
                <div key={idx} style={{ marginBottom: '16px' }}>
                  <div style={{ fontWeight: 600, marginBottom: '6px' }}>{rec.feature} (score: {rec.score})</div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {rec.courses.map((course, j) => (
                      <li key={j} style={{ padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ color: '#00b4db' }}>{course.course}</div>
                        {course.colleges && course.colleges.length > 0 && (
                          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                            Colleges: {course.colleges.slice(0, 3).join(', ')}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="action-buttons">
          <button onClick={goBack} className="btn btn-secondary">
            ← Back to Results
          </button>
          <button onClick={goHome} className="btn btn-primary">
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;


