import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    interests: []
  });
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    quizzesTaken: 0,
    achievements: 0,
    coursesSaved: 0,
    pointsEarned: 0
  });
  const [newInterest, setNewInterest] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    if (user) {
      setEditForm({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || 'Passionate about exploring career opportunities and skills development.',
        location: user.location || 'Maharashtra, India',
        interests: user.interests || ['Technology', 'Career Development', 'Education']
      });

      // Simulate loading stats (would come from API in real app)
      setTimeout(() => {
        setStats({
          quizzesTaken: 3,
          achievements: 5,
          coursesSaved: 8,
          pointsEarned: 1250
        });
      }, 1000);
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const result = await updateProfile(editForm);
      if (result.success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      location: user?.location || '',
      interests: user?.interests || []
    });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !editForm.interests.includes(newInterest.trim())) {
      setEditForm(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest) => {
    setEditForm(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulate avatar upload (would call API in real app)
      const reader = new FileReader();
      reader.onload = (e) => {
        // In a real app, you would send this to your backend
        console.log('Avatar uploaded:', e.target.result);
        // For demo purposes, we'll just show a success message
        alert('Avatar updated successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading your professional profile...</p>
      </div>
    );
  }

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="profile-container">
      {/* Animated Background */}
      <div className="profile-background">
        <div className="gradient-circle top-left"></div>
        <div className="gradient-circle bottom-right"></div>
        <div className="floating-shapes">
          <div className="shape shape-1">💼</div>
          <div className="shape shape-2">🎓</div>
          <div className="shape shape-3">🚀</div>
          <div className="shape shape-4">⭐</div>
        </div>
      </div>

      {/* Header */}
      <header className="profile-header">
        <div className="header-content">
          <button className="back-button" onClick={() => navigate('/home')}>
            <span className="back-arrow">←</span>
            Back to Dashboard
          </button>
          <h1 className="profile-title">
            <span className="profile-icon">👤</span>
            My Profile
          </h1>
          <button className="logout-button-minimal" onClick={handleLogout}>
            <span className="logout-icon">→</span>
            <span className="logout-text">Log Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="profile-content">
        {/* Profile Card */}
        <div className={`profile-card ${isVisible ? 'fade-in' : ''}`}>
          <div className="profile-avatar-section">
            <div className="profile-avatar" onClick={triggerAvatarUpload}>
              <span className="avatar-text">{user.name?.charAt(0).toUpperCase() || 'U'}</span>
              <div className="avatar-overlay">
                <span className="camera-icon">📷</span>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <div className="profile-status">
              <div className="status-indicator active"></div>
              <span className="status-text">Professional</span>
            </div>
            <div className="completion-score">
              <div className="score-circle">
                <span className="score-value">85%</span>
              </div>
              <span className="score-label">Profile Complete</span>
            </div>
          </div>

          <div className="profile-info">
            <div className="profile-name-section">
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                  className="edit-input name-input"
                  placeholder="Enter your full name"
                />
              ) : (
                <h2 className="profile-name">{user.name}</h2>
              )}
              <div className="profile-role">
                <span className="role-badge">{user.role}</span>
                <span className="member-since">
                  Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-item">
                <span className="detail-icon">📧</span>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    className="edit-input email-input"
                    placeholder="Enter your email"
                  />
                ) : (
                  <span className="detail-value">{user.email}</span>
                )}
              </div>

              <div className="detail-item">
                <span className="detail-icon">📍</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={editForm.location}
                    onChange={handleInputChange}
                    className="edit-input"
                    placeholder="Enter your location"
                  />
                ) : (
                  <span className="detail-value">{editForm.location}</span>
                )}
              </div>

              <div className="detail-item bio-item">
                <span className="detail-icon">📝</span>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={editForm.bio}
                    onChange={handleInputChange}
                    className="edit-textarea"
                    placeholder="Tell us about yourself..."
                    rows="3"
                  />
                ) : (
                  <span className="detail-value">{editForm.bio}</span>
                )}
              </div>

              <div className="detail-item interests-item">
                <span className="detail-icon">🔍</span>
                <div className="interests-container">
                  {isEditing ? (
                    <>
                      <div className="interests-input">
                        <input
                          type="text"
                          value={newInterest}
                          onChange={(e) => setNewInterest(e.target.value)}
                          className="edit-input"
                          placeholder="Add an interest..."
                          onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                        />
                        <button className="add-interest-btn" onClick={handleAddInterest}>+</button>
                      </div>
                      <div className="interests-tags">
                        {editForm.interests.map((interest, index) => (
                          <span key={index} className="interest-tag editable">
                            {interest}
                            <button onClick={() => handleRemoveInterest(interest)} className="remove-interest">×</button>
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="interests-tags">
                      {editForm.interests.map((interest, index) => (
                        <span key={index} className="interest-tag">{interest}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="profile-actions">
              {isEditing ? (
                <div className="edit-actions">
                  <button className="save-button" onClick={handleSave}>
                    <span className="save-icon">💾</span>
                    Save Changes
                  </button>
                  <button className="cancel-button" onClick={handleCancel}>
                    <span className="cancel-icon">❌</span>
                    Cancel
                  </button>
                </div>
              ) : (
                <button className="edit-button" onClick={handleEdit}>
                  <span className="edit-icon">✏️</span>
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="stats-overview">
          <div className="stat-item">
            <div className="stat-icon">🎯</div>
            <div className="stat-data">
              <span className="stat-number">{stats.quizzesTaken}</span>
              <span className="stat-label">Quizzes Taken</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">🏆</div>
            <div className="stat-data">
              <span className="stat-number">{stats.achievements}</span>
              <span className="stat-label">Achievements</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">📚</div>
            <div className="stat-data">
              <span className="stat-number">{stats.coursesSaved}</span>
              <span className="stat-label">Courses Saved</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">⭐</div>
            <div className="stat-data">
              <span className="stat-number">{stats.pointsEarned}</span>
              <span className="stat-label">Points Earned</span>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="profile-tabs">
          <div className="tab-buttons">
            <button
              className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <span className="tab-icon">📊</span>
              Overview
            </button>
            <button
              className={`tab-button ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              <span className="tab-icon">📈</span>
              Activity
            </button>
            <button
              className={`tab-button ${activeTab === 'skills' ? 'active' : ''}`}
              onClick={() => setActiveTab('skills')}
            >
              <span className="tab-icon">🛠️</span>
              Skills
            </button>
            <button
              className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <span className="tab-icon">⚙️</span>
              Settings
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="overview-tab">
                <div className="progress-charts">
                  <div className="chart-container">
                    <h3 className="chart-title">Career Interests</h3>
                    <div className="chart">
                      <div className="chart-bar" style={{ '--width': '85%' }}>
                        <span>Technology</span>
                        <div className="bar-fill"></div>
                        <span>85%</span>
                      </div>
                      <div className="chart-bar" style={{ '--width': '70%' }}>
                        <span>Business</span>
                        <div className="bar-fill"></div>
                        <span>70%</span>
                      </div>
                      <div className="chart-bar" style={{ '--width': '60%' }}>
                        <span>Science</span>
                        <div className="bar-fill"></div>
                        <span>60%</span>
                      </div>
                    </div>
                  </div>

                  <div className="chart-container">
                    <h3 className="chart-title">Skill Development</h3>
                    <div className="radial-charts">
                      <div className="radial-chart">
                        <div className="radial-progress" style={{ '--progress': '75' }}>
                          <span>75%</span>
                        </div>
                        <span className="radial-label">Technical</span>
                      </div>
                      <div className="radial-chart">
                        <div className="radial-progress" style={{ '--progress': '65' }}>
                          <span>65%</span>
                        </div>
                        <span className="radial-label">Soft Skills</span>
                      </div>
                      <div className="radial-chart">
                        <div className="radial-progress" style={{ '--progress': '80' }}>
                          <span>80%</span>
                        </div>
                        <span className="radial-label">Career Prep</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="recent-activity">
                  <h3 className="section-title">Recent Activity</h3>
                  <div className="activity-list">
                    <div className="activity-item">
                      <div className="activity-icon">🎯</div>
                      <div className="activity-content">
                        <p className="activity-text">Completed <strong>Career Aptitude Test</strong></p>
                        <span className="activity-time">2 hours ago</span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon">📚</div>
                      <div className="activity-content">
                        <p className="activity-text">Saved <strong>Data Science Career Path</strong> to favorites</p>
                        <span className="activity-time">1 day ago</span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon">🏆</div>
                      <div className="activity-content">
                        <p className="activity-text">Earned <strong>Career Explorer</strong> badge</p>
                        <span className="activity-time">3 days ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="activity-tab">
                <div className="activity-filters">
                  <button className="filter-btn active">All</button>
                  <button className="filter-btn">Quizzes</button>
                  <button className="filter-btn">Achievements</button>
                  <button className="filter-btn">Courses</button>
                </div>

                <div className="activity-timeline">
                  <div className="timeline-item">
                    <div className="timeline-date">Today</div>
                    <div className="timeline-content">
                      <div className="timeline-icon">🎯</div>
                      <div className="timeline-details">
                        <h4>Completed Career Assessment</h4>
                        <p>You scored 85% on the Technology career path assessment</p>
                        <span className="timeline-time">2:30 PM</span>
                      </div>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-date">Yesterday</div>
                    <div className="timeline-content">
                      <div className="timeline-icon">📚</div>
                      <div className="timeline-details">
                        <h4>Saved Learning Path</h4>
                        <p>Added "Full Stack Development" to your saved courses</p>
                        <span className="timeline-time">4:15 PM</span>
                      </div>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-date">Oct 15, 2023</div>
                    <div className="timeline-content">
                      <div className="timeline-icon">🏆</div>
                      <div className="timeline-details">
                        <h4>Earned Achievement</h4>
                        <p>Unlocked the "Career Explorer" badge for completing 3 career assessments</p>
                        <span className="timeline-time">11:20 AM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="skills-tab">
                <div className="skills-header">
                  <h3>Your Skills Assessment</h3>
                  <button className="take-assessment-btn">Take Skills Test</button>
                </div>

                <div className="skills-categories">
                  <div className="skills-category">
                    <h4>Technical Skills</h4>
                    <div className="skills-list">
                      <div className="skill-item">
                        <span className="skill-name">Programming</span>
                        <div className="skill-level">
                          <div className="skill-bar">
                            <div className="skill-progress" style={{ width: '75%' }}></div>
                          </div>
                          <span className="skill-percentage">75%</span>
                        </div>
                      </div>
                      <div className="skill-item">
                        <span className="skill-name">Data Analysis</span>
                        <div className="skill-level">
                          <div className="skill-bar">
                            <div className="skill-progress" style={{ width: '60%' }}></div>
                          </div>
                          <span className="skill-percentage">60%</span>
                        </div>
                      </div>
                      <div className="skill-item">
                        <span className="skill-name">Web Development</span>
                        <div className="skill-level">
                          <div className="skill-bar">
                            <div className="skill-progress" style={{ width: '80%' }}></div>
                          </div>
                          <span className="skill-percentage">80%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="skills-category">
                    <h4>Soft Skills</h4>
                    <div className="skills-list">
                      <div className="skill-item">
                        <span className="skill-name">Communication</span>
                        <div className="skill-level">
                          <div className="skill-bar">
                            <div className="skill-progress" style={{ width: '85%' }}></div>
                          </div>
                          <span className="skill-percentage">85%</span>
                        </div>
                      </div>
                      <div className="skill-item">
                        <span className="skill-name">Problem Solving</span>
                        <div className="skill-level">
                          <div className="skill-bar">
                            <div className="skill-progress" style={{ width: '90%' }}></div>
                          </div>
                          <span className="skill-percentage">90%</span>
                        </div>
                      </div>
                      <div className="skill-item">
                        <span className="skill-name">Teamwork</span>
                        <div className="skill-level">
                          <div className="skill-bar">
                            <div className="skill-progress" style={{ width: '70%' }}></div>
                          </div>
                          <span className="skill-percentage">70%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="settings-tab">
                <div className="settings-section">
                  <h3 className="section-title">Account Settings</h3>
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Email Notifications</h4>
                      <p>Receive updates about new features and opportunities</p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Career Recommendations</h4>
                      <p>Get personalized career suggestions based on your profile</p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="settings-section">
                  <h3 className="section-title">Privacy</h3>
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Profile Visibility</h4>
                      <p>Make your profile visible to other students and recruiters</p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="settings-section">
                  <h3 className="section-title">Data & Privacy</h3>
                  <div className="setting-actions">
                    <button className="settings-btn">
                      <span>Export My Data</span>
                      <span>Download all your information</span>
                    </button>
                    <button className="settings-btn danger">
                      <span>Delete Account</span>
                      <span>Permanently remove your account</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3 className="section-title">Quick Actions</h3>
          <div className="action-buttons">
            <button className="action-button primary" onClick={() => navigate('/quiz')}>
              <span className="action-icon">🎯</span>
              Take Career Quiz
            </button>
            <button className="action-button secondary" onClick={() => navigate('/explore')}>
              <span className="action-icon">🔍</span>
              Explore Careers
            </button>
            <button className="action-button secondary">
              <span className="action-icon">📊</span>
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;