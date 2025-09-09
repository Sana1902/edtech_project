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
      {/* Header */}
      <header className={`header ${isVisible ? 'fade-in' : ''}`}>
        <div className="header-content">
          <div className="logo-container">
            <h1 className="logo">
              <span className="logo-icon">
                <svg viewBox="0 0 40 40" fill="currentColor">
                  <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <path d="M20 8L24 16L32 16L26 22L28 30L20 26L12 30L14 22L8 16L16 16Z" fill="currentColor"/>
                  <circle cx="20" cy="20" r="3" fill="white"/>
                  <path d="M20 6L22 12L28 12L23 16L25 24L20 20L15 24L17 16L12 12L18 12Z" fill="currentColor" opacity="0.3"/>
                </svg>
              </span>
              Skill-Map Maharashtra
            </h1>
          </div>
          <nav className="navigation">
            <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a>
            <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}>How It Works</a>
            <button className="nav-link" onClick={() => navigate('/about')}>About</button>
            <button className="nav-cta" onClick={() => navigate('/explore')}>
              Explore
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
              <button className="cta-button secondary" onClick={() => navigate('/explore')}>
                Explore Careers
              </button>
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
            <button className="download-btn" onClick={() => window.open('/CareerHandbook.pdf', '_blank', 'noopener,noreferrer')}>Download PDF</button>
          </div>
          <div className="resource-card">
            <div className="resource-icon">📝</div>
            <h3>Scholarship List</h3>
            <p>List of scholarships available for Maharashtra students</p>
            <button className="download-btn" onClick={() => window.open('/maharashtra_scholarships_class11_12.pdf', '_blank', 'noopener,noreferrer')}>Download PDF</button>
          </div>
          <div className="resource-card">
            <div className="resource-icon">🏆</div>
            <h3>Skill Development Programs</h3>
            <p>
            Free & Paid Courses · Maharashtra-focused · Quick application tips
            </p>
            <button className="download-btn" onClick={() => window.open('/Skill_Development_Programs_8to12_SkillMapMaharashtra.pdf', '_blank', 'noopener,noreferrer')}>Download PDF</button>
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
              <span className="logo-icon">
                <svg viewBox="0 0 40 40" fill="currentColor">
                  <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <path d="M20 8L24 16L32 16L26 22L28 30L20 26L12 30L14 22L8 16L16 16Z" fill="currentColor"/>
                  <circle cx="20" cy="20" r="3" fill="white"/>
                  <path d="M20 6L22 12L28 12L23 16L25 24L20 20L15 24L17 16L12 12L18 12Z" fill="currentColor" opacity="0.3"/>
                </svg>
              </span>
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
                <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Instagram"
              >
                <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Twitter"
              >
                <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="LinkedIn"
              >
                <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
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