import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);

    // Auto-rotate features
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 5000);

    // Scroll progress tracker
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleStartQuiz = () => {
    navigate('/quiz');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home-container">
      {/* Scroll Progress Bar */}
      <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }}></div>

      {/* Floating Action Button */}
      <div className="floating-action-btn" onClick={handleStartQuiz}>
        <span>Start Quiz</span>
        <div className="fab-icon">🎯</div>
      </div>

      {/* Header */}
      <header className={`header ${isVisible ? 'fade-in' : ''}`}>
        <div className="header-content">
          <div className="logo-container">
            <h1 className="logo">
              <span className="logo-icon">🎯</span>
              Skill-Map Maharashtra
            </h1>
          </div>
          <nav className="navigation">
            <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a>
            <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}>How It Works</a>
            <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a>
            <button className="nav-cta" onClick={handleStartQuiz}>
              Get Started
            </button>
            <Link to="/profile" className="profile-icon-link" aria-label="Profile">
              <div className="profile-icon">
                👤
              </div>
            </Link>
          </nav>
          <div className="mobile-menu-btn">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section" ref={heroRef}>
        <div className="particles-container" id="particles-js"></div>
        <div className="hero-content">
          <div className={`hero-text ${isVisible ? 'slide-left' : ''}`}>
            <div className="badge">
              <span className="badge-text">For Maharashtra Students</span>
            </div>
            <h1>
              Discover Your Future{' '}
              <span className="gradient-text">Career Path</span>
            </h1>
            <p>
              Specially designed for students of Classes 8-12 in Maharashtra to
              explore career options based on your interests, find local
              colleges, and discover scholarships.
            </p>
            <div className="hero-actions">
              <button className="cta-button primary" onClick={handleStartQuiz}>
                Start Your Career Journey
                <span className="btn-arrow">→</span>
              </button>
              <a href="#about" className="cta-button secondary" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>
                Learn More
              </a>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Career Paths</span>
              </div>
              <div className="stat">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Colleges</span>
              </div>
              <div className="stat">
                <span className="stat-number">200+</span>
                <span className="stat-label">Scholarships</span>
              </div>
            </div>
          </div>
          <div className={`hero-image ${isVisible ? 'slide-right' : ''}`}>
            <div className="hero-visual">
              <div className="main-icon">🎓</div>
              <div className="orbiting-icons">
                <div className="orbit-icon">🔬</div>
                <div className="orbit-icon">💻</div>
                <div className="orbit-icon">📊</div>
                <div className="orbit-icon">🎨</div>
              </div>
              <div className="floating-element el-1">⚡</div>
              <div className="floating-element el-2">🌟</div>
              <div className="floating-element el-3">🚀</div>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
        <div className="hero-wave">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="shape-fill"
            ></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section" ref={featuresRef}>
        <div className="section-header">
          <h2>
            How We Help You <span className="gradient-text">Succeed</span>
          </h2>
          <p>
            Our comprehensive platform provides everything you need to make
            informed career decisions
          </p>
        </div>
        <div className="features-grid">
          <div
            className={`feature-card ${isVisible ? 'fade-in' : ''} ${activeFeature === 0 ? 'active' : ''
              }`}
          >
            <div className="feature-icon">🎯</div>
            <h3>Career Matching</h3>
            <p>
              Discover careers that match your interests and skills through our
              intelligent assessment.
            </p>
            <div className="feature-hover-effect"></div>
          </div>
          <div
            className={`feature-card ${isVisible ? 'fade-in' : ''} ${activeFeature === 1 ? 'active' : ''
              }`}
            style={{ animationDelay: '0.2s' }}
          >
            <div className="feature-icon">🏫</div>
            <h3>College Finder</h3>
            <p>
              Find colleges in Maharashtra that offer programs aligned with your
              career goals.
            </p>
            <div className="feature-hover-effect"></div>
          </div>
          <div
            className={`feature-card ${isVisible ? 'fade-in' : ''} ${activeFeature === 2 ? 'active' : ''
              }`}
            style={{ animationDelay: '0.4s' }}
          >
            <div className="feature-icon">💰</div>
            <h3>Scholarship Info</h3>
            <p>
              Access information about scholarships available for Maharashtra
              students.
            </p>
            <div className="feature-hover-effect"></div>
          </div>
        </div>
      </section>

      {/* Career Explorer Section */}
      <section className="career-explorer-section">
        <div className="section-header">
          <h2>
            Explore <span className="gradient-text">Career Fields</span>
          </h2>
          <p>Discover different career paths available in various industries</p>
        </div>
        <div className="career-fields-grid">
          <div className="career-field">
            <div className="field-icon">💻</div>
            <h3>Technology</h3>
            <p>Software Development, Data Science, Cybersecurity</p>
            <button
              className="field-explore-btn"
              onClick={() => navigate('/career-explorer', { state: { field: 'Technology' } })}
            >
              Explore
            </button>
          </div>

          <div className="career-field">
            <div className="field-icon">🔬</div>
            <h3>Science</h3>
            <p>Research, Biotechnology, Environmental Science</p>
            <button
              className="field-explore-btn"
              onClick={() => navigate('/career-explorer', { state: { field: 'Science' } })}
            >
              Explore
            </button>
          </div>

          <div className="career-field">
            <div className="field-icon">📊</div>
            <h3>Business</h3>
            <p>Management, Finance, Marketing, Entrepreneurship</p>
            <button
              className="field-explore-btn"
              onClick={() => navigate('/career-explorer', { state: { field: 'Business' } })}
            >
              Explore
            </button>
          </div>

          <div className="career-field">
            <div className="field-icon">🎨</div>
            <h3>Arts & Design</h3>
            <p>Graphic Design, Architecture, Fashion, Media</p>
            <button
              className="field-explore-btn"
              onClick={() => navigate('/career-explorer', { state: { field: 'Arts & Design' } })}
            >
              Explore
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="process-section">
        <div className="section-header">
          <h2>
            How It <span className="gradient-text">Works</span>
          </h2>
          <p>Simple steps to discover your ideal career path</p>
        </div>
        <div className="process-steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Take Assessment</h3>
              <p>Complete our quick interest and skills questionnaire</p>
            </div>
          </div>
          <div className="step-connector">
            <div className="connector-dot"></div>
            <div className="connector-dot"></div>
            <div className="connector-dot"></div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Get Matched</h3>
              <p>Receive personalized career recommendations</p>
            </div>
          </div>
          <div className="step-connector">
            <div className="connector-dot"></div>
            <div className="connector-dot"></div>
            <div className="connector-dot"></div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Explore Options</h3>
              <p>Discover colleges and courses for your path</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2>
            Success <span className="gradient-text">Stories</span>
          </h2>
          <p>Hear from students who found their path with Skill-Map</p>
        </div>
        <div className="testimonials-container">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <div className="quote-icon">❝</div>
              <p>"Skill-Map helped me discover my passion for data science and find the perfect college in Pune for my studies."</p>
              <div className="testimonial-author">
                <div className="author-avatar">R</div>
                <div className="author-details">
                  <h4>Rahul Sharma</h4>
                  <p>Student, Mumbai</p>
                </div>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <div className="quote-icon">❝</div>
              <p>"The scholarship information provided by Skill-Map made it possible for me to afford my dream college education."</p>
              <div className="testimonial-author">
                <div className="author-avatar">P</div>
                <div className="author-details">
                  <h4>Priya Deshmukh</h4>
                  <p>Student, Nagpur</p>
                </div>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <div className="quote-icon">❝</div>
              <p>"I was confused about my career options after 12th, but the assessment gave me clear direction and confidence."</p>
              <div className="testimonial-author">
                <div className="author-avatar">A</div>
                <div className="author-details">
                  <h4>Amit Patil</h4>
                  <p>Student, Kolhapur</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="resources-section">
        <div className="section-header">
          <h2>
            Free <span className="gradient-text">Resources</span>
          </h2>
          <p>Download helpful guides and materials for your career planning</p>
        </div>
        <div className="resources-grid">
          <div className="resource-card">
            <div className="resource-icon">📘</div>
            <h3>Career Guide</h3>
            <p>
              Comprehensive guide to career options after 10th and 12th
            </p>
            <button className="download-btn">Download PDF</button>
          </div>
          <div className="resource-card">
            <div className="resource-icon">📝</div>
            <h3>Scholarship List</h3>
            <p>List of scholarships available for Maharashtra students</p>
            <button className="download-btn">Download PDF</button>
          </div>
          <div className="resource-card">
            <div className="resource-icon">🏆</div>
            <h3>Exam Calendar</h3>
            <p>
              Important dates for entrance exams and applications
            </p>
            <button className="download-btn">Download PDF</button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-container">
          <div className="newsletter-content">
            <h2>Stay Updated on Career Opportunities</h2>
            <p>
              Get the latest information about colleges, scholarships, and
              career guidance
            </p>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email address"
                required
              />
              <button type="submit">Subscribe</button>
            </form>
          </div>
          <div className="newsletter-visual">
            <div className="newsletter-icon">📧</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-icon">🎯</span>
              <span className="logo-text">Skill-Map Maharashtra</span>
            </div>
            <p className="footer-description">
              Empowering the next generation of Maharashtra with career guidance
              and opportunities.
            </p>
            <div className="footer-social">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Facebook"
              >
                <span className="social-icon">📘</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Instagram"
              >
                <span className="social-icon">📸</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Twitter"
              >
                <span className="social-icon">🐦</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="LinkedIn"
              >
                <span className="social-icon">💼</span>
              </a>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Platform</h4>
              <ul>
                <li>
                  <Link to="/quiz">Career Assessment</Link>
                </li>
                <li>
                  <Link to="/colleges">College Finder</Link>
                </li>
                <li>
                  <Link to="/scholarships">Scholarships</Link>
                </li>
                <li>
                  <Link to="/resources">Resources</Link>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                <li>
                  <Link to="/about">About Us</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
                <li>
                  <Link to="/privacy">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/terms">Terms of Service</Link>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Support</h4>
              <ul>
                <li>
                  <Link to="/help">Help Center</Link>
                </li>
                <li>
                  <Link to="/faq">FAQ</Link>
                </li>
                <li>
                  <Link to="/feedback">Feedback</Link>
                </li>
                <li>
                  <Link to="/partners">Partners</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>
              &copy; {new Date().getFullYear()} Skill-Map Maharashtra. All
              rights reserved.
            </p>
            <div className="footer-legal">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/cookies">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;