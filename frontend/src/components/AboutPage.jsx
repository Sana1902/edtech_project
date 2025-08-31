import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './AboutPage.css';

const AboutPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleBackToHome = () => {
    navigate('/home');
  };

  const handleStartQuiz = () => {
    navigate('/quiz');
  };

  const handleExplore = () => {
    navigate('/explore');
  };

  const teamMembers = [
    {
      name: 'Dr. Priya Sharma',
      role: 'Founder & CEO',
      description: 'Education expert with 15+ years in career counseling',
      avatar: '👩‍🏫',
      expertise: ['Career Guidance', 'Education Policy', 'Student Development']
    },
    {
      name: 'Rajesh Kumar',
      role: 'Head of Technology',
      description: 'Tech leader passionate about educational innovation',
      avatar: '👨‍💻',
      expertise: ['AI/ML', 'EdTech', 'Platform Development']
    },
    {
      name: 'Meera Patel',
      role: 'Career Counselor',
      description: 'Specialized in Maharashtra education system',
      avatar: '👩‍🎓',
      expertise: ['Student Counseling', 'College Admissions', 'Scholarship Guidance']
    },
    {
      name: 'Amit Deshmukh',
      role: 'Partnership Manager',
      description: 'Building connections with colleges and institutions',
      avatar: '🤝',
      expertise: ['Institutional Relations', 'Partnerships', 'Network Building']
    }
  ];

  const milestones = [
    {
      year: '2024',
      title: 'Platform Launch',
      description: 'Skill-Map Maharashtra officially launched to serve students across Maharashtra'
    },
    {
      year: '2023',
      title: 'Pilot Program',
      description: 'Successfully tested with 500+ students in Pune and Mumbai'
    },
    {
      year: '2022',
      title: 'Research & Development',
      description: 'Extensive research on Maharashtra education landscape and student needs'
    },
    {
      year: '2021',
      title: 'Concept Development',
      description: 'Initial idea and vision for democratizing career guidance'
    }
  ];

  const values = [
    {
      icon: '🎯',
      title: 'Student-Centric',
      description: 'Every decision we make is focused on student success and growth'
    },
    {
      icon: '🤝',
      title: 'Accessibility',
      description: 'Making quality career guidance available to every student in Maharashtra'
    },
    {
      icon: '💡',
      title: 'Innovation',
      description: 'Continuously improving our platform with cutting-edge technology'
    },
    {
      icon: '🌟',
      title: 'Excellence',
      description: 'Committed to delivering the highest quality career guidance services'
    }
  ];

  return (
    <div className="about-container">
      {/* Header */}
      <header className="about-header">
        <button className="back-btn" onClick={handleBackToHome}>
          ← Back to Home
        </button>
        <h1 className="about-title">
          <span className="title-icon">ℹ️</span>
          About Skill-Map Maharashtra
        </h1>
        <div className="header-actions">
          <button className="action-btn" onClick={handleExplore}>
            Explore Careers
          </button>
          <button className="action-btn primary" onClick={handleStartQuiz}>
            Take Quiz
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className={`hero-text ${isVisible ? 'fade-in' : ''}`}>
            <h2>Empowering Maharashtra's Future</h2>
            <p>
              Skill-Map Maharashtra is a revolutionary platform dedicated to transforming 
              career guidance for students across Maharashtra. We believe every student 
              deserves access to personalized career insights, regardless of their background 
              or location.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">50,000+</span>
                <span className="stat-label">Students Helped</span>
              </div>
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Career Paths</span>
              </div>
              <div className="stat">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Colleges Listed</span>
              </div>
            </div>
          </div>
          <div className={`hero-visual ${isVisible ? 'slide-in' : ''}`}>
            <div className="visual-container">
              <div className="main-icon">🎯</div>
              <div className="floating-elements">
                <div className="floating-element">💻</div>
                <div className="floating-element">🔬</div>
                <div className="floating-element">📊</div>
                <div className="floating-element">🎨</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="section-container">
          <div className={`section-content ${isVisible ? 'fade-in' : ''}`}>
            <h2>Our Mission</h2>
            <p className="mission-text">
              To democratize career guidance by providing every student in Maharashtra 
              with access to personalized career insights, comprehensive college information, 
              and scholarship opportunities, empowering them to make informed decisions 
              about their future.
            </p>
            <div className="mission-pillars">
              <div className="pillar">
                <div className="pillar-icon">🎓</div>
                <h3>Education</h3>
                <p>Making quality education accessible to all</p>
              </div>
              <div className="pillar">
                <div className="pillar-icon">🚀</div>
                <h3>Innovation</h3>
                <p>Leveraging technology for better guidance</p>
              </div>
              <div className="pillar">
                <div className="pillar-icon">🤝</div>
                <h3>Community</h3>
                <p>Building a supportive learning ecosystem</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="vision-section">
        <div className="section-container">
          <div className={`section-content ${isVisible ? 'fade-in' : ''}`}>
            <h2>Our Vision</h2>
            <p className="vision-text">
              We envision a Maharashtra where every student, regardless of their economic 
              background or geographical location, has the tools and knowledge to pursue 
              their dreams. A future where career guidance is not a privilege but a right, 
              and where every student can confidently chart their path to success.
            </p>
            <div className="vision-highlights">
              <div className="highlight">
                <span className="highlight-icon">🌟</span>
                <span>Universal Access</span>
              </div>
              <div className="highlight">
                <span className="highlight-icon">🎯</span>
                <span>Personalized Guidance</span>
              </div>
              <div className="highlight">
                <span className="highlight-icon">🏆</span>
                <span>Excellence in Education</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="section-container">
          <div className={`section-content ${isVisible ? 'fade-in' : ''}`}>
            <h2>Meet Our Team</h2>
            <p className="section-description">
              Our diverse team of education experts, technologists, and career counselors 
              work together to make career guidance accessible and effective for every student.
            </p>
            <div className="team-grid">
              {teamMembers.map((member, index) => (
                <div key={index} className="team-card">
                  <div className="member-avatar">{member.avatar}</div>
                  <h3 className="member-name">{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                  <p className="member-description">{member.description}</p>
                  <div className="member-expertise">
                    {member.expertise.map((skill, skillIndex) => (
                      <span key={skillIndex} className="expertise-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="journey-section">
        <div className="section-container">
          <div className={`section-content ${isVisible ? 'fade-in' : ''}`}>
            <h2>Our Journey</h2>
            <p className="section-description">
              From a simple idea to a comprehensive platform, here's how Skill-Map 
              Maharashtra evolved to serve students across the state.
            </p>
            <div className="timeline">
              {milestones.map((milestone, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-year">{milestone.year}</div>
                    <h3 className="timeline-title">{milestone.title}</h3>
                    <p className="timeline-description">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="section-container">
          <div className={`section-content ${isVisible ? 'fade-in' : ''}`}>
            <h2>Our Core Values</h2>
            <p className="section-description">
              These fundamental principles guide everything we do and shape our 
              approach to serving students and the community.
            </p>
            <div className="values-grid">
              {values.map((value, index) => (
                <div key={index} className="value-card">
                  <div className="value-icon">{value.icon}</div>
                  <h3 className="value-title">{value.title}</h3>
                  <p className="value-description">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="impact-section">
        <div className="section-container">
          <div className={`section-content ${isVisible ? 'fade-in' : ''}`}>
            <h2>Our Impact</h2>
            <p className="section-description">
              The real measure of our success is the positive change we've brought 
              to students' lives across Maharashtra.
            </p>
            <div className="impact-metrics">
              <div className="metric">
                <div className="metric-number">95%</div>
                <div className="metric-label">Student Satisfaction</div>
                <div className="metric-description">Students report improved career clarity</div>
              </div>
              <div className="metric">
                <div className="metric-number">80%</div>
                <div className="metric-label">College Success</div>
                <div className="metric-description">Students admitted to preferred colleges</div>
              </div>
              <div className="metric">
                <div className="metric-number">60%</div>
                <div className="metric-label">Scholarship Success</div>
                <div className="metric-description">Students secured financial aid</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <div className={`cta-content ${isVisible ? 'fade-in' : ''}`}>
            <h2>Ready to Start Your Career Journey?</h2>
            <p>
              Join thousands of students who have already discovered their perfect career path 
              with Skill-Map Maharashtra.
            </p>
            <div className="cta-buttons">
              <button className="cta-btn primary" onClick={handleStartQuiz}>
                Take Career Assessment
              </button>
              <button className="cta-btn secondary" onClick={handleExplore}>
                Explore Career Fields
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <div className="footer-content">
          <p>
            Have questions or want to learn more? 
            <button className="contact-link" onClick={handleBackToHome}>
              Get in touch with us
            </button>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
