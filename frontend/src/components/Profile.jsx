import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: ''
  });
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setIsVisible(true);
    if (user) {
      setEditForm({
        name: user.name || '',
        email: user.email || ''
      });
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
      email: user?.email || ''
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

  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="profile-container">
      {/* Background Elements */}
      <div className="profile-background">
        <div className="gradient-circle top-left"></div>
        <div className="gradient-circle bottom-right"></div>
        <div className="floating-shapes">
          <div className="shape shape-1">⭐</div>
          <div className="shape shape-2">🎯</div>
          <div className="shape shape-3">🚀</div>
        </div>
      </div>

      {/* Header */}
      <header className="profile-header">
        <div className="header-content">
          <button className="back-button" onClick={() => navigate('/home')}>
            <span className="back-arrow">←</span>
            Back to Home
          </button>
          <h1 className="profile-title">
            <span className="profile-icon">👤</span>
            My Profile
          </h1>
          <button className="logout-button" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="profile-content">
        {/* Profile Card */}
        <div className={`profile-card ${isVisible ? 'fade-in' : ''}`}>
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              <span className="avatar-text">{user.name?.charAt(0).toUpperCase() || 'U'}</span>
            </div>
            <div className="profile-status">
              <div className="status-indicator active"></div>
              <span className="status-text">Active</span>
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
                  placeholder="Enter your name"
                />
              ) : (
                <h2 className="profile-name">{user.name}</h2>
              )}
              <div className="profile-role">
                <span className="role-badge">{user.role}</span>
              </div>
            </div>

            <div className="profile-email-section">
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
                <p className="profile-email">{user.email}</p>
              )}
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
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">🎯</div>
                    <div className="stat-content">
                      <h3 className="stat-number">0</h3>
                      <p className="stat-label">Quizzes Taken</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🏆</div>
                    <div className="stat-content">
                      <h3 className="stat-number">0</h3>
                      <p className="stat-label">Achievements</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">📚</div>
                    <div className="stat-content">
                      <h3 className="stat-number">0</h3>
                      <p className="stat-label">Courses Saved</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-content">
                      <h3 className="stat-number">0</h3>
                      <p className="stat-label">Points Earned</p>
                    </div>
                  </div>
                </div>

                <div className="recent-activity">
                  <h3 className="section-title">Recent Activity</h3>
                  <div className="activity-list">
                    <div className="activity-item">
                      <div className="activity-icon">🎉</div>
                      <div className="activity-content">
                        <p className="activity-text">Welcome to Skill-Map Maharashtra!</p>
                        <span className="activity-time">Just now</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="activity-tab">
                <div className="activity-timeline">
                  <div className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <h4>Account Created</h4>
                      <p>Welcome to Skill-Map Maharashtra!</p>
                      <span className="timeline-date">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <h4>Last Login</h4>
                      <p>Successfully logged into your account</p>
                      <span className="timeline-date">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                      </span>
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
                      <p>Get personalized career suggestions</p>
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
                      <p>Make your profile visible to other students</p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" />
                      <span className="toggle-slider"></span>
                    </label>
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
            <button className="action-button secondary" onClick={() => navigate('/home')}>
              <span className="action-icon">🏠</span>
              Explore Home
            </button>
            <button className="action-button secondary">
              <span className="action-icon">📚</span>
              View Resources
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
