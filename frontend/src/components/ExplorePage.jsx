import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./ExplorePage.css";

const ExplorePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedField, setSelectedField] = useState(
    location.state?.field || "All"
  );
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Career fields data
  const careerFields = {
    Technology: {
      icon: "💻",
      description: "Explore the world of technology and innovation",
      careers: [
        {
          name: "Software Developer",
          description: "Create applications and software solutions",
          salary: "₹4-15 LPA",
          demand: "High",
        },
        {
          name: "Data Scientist",
          description: "Analyze data to drive business decisions",
          salary: "₹6-20 LPA",
          demand: "Very High",
        },
        {
          name: "Cybersecurity Analyst",
          description: "Protect systems from cyber threats",
          salary: "₹5-18 LPA",
          demand: "High",
        },
        {
          name: "AI/ML Engineer",
          description: "Build intelligent systems and algorithms",
          salary: "₹8-25 LPA",
          demand: "Very High",
        },
        {
          name: "DevOps Engineer",
          description: "Manage development and operations",
          salary: "₹6-18 LPA",
          demand: "High",
        },
      ],
      colleges: [
        "Pune University",
        "Mumbai University",
        "VIT Pune",
        "Symbiosis",
        "SPIT Mumbai",
      ],
      skills: [
        "Programming",
        "Problem Solving",
        "Analytical Thinking",
        "Teamwork",
        "Continuous Learning",
      ],
    },
    Science: {
      icon: "🔬",
      description: "Discover the wonders of scientific research and discovery",
      careers: [
        {
          name: "Research Scientist",
          description: "Conduct research in various scientific fields",
          salary: "₹5-20 LPA",
          demand: "High",
        },
        {
          name: "Biotechnologist",
          description: "Work with biological systems and processes",
          salary: "₹4-15 LPA",
          demand: "Medium",
        },
        {
          name: "Environmental Scientist",
          description: "Study environmental issues and solutions",
          salary: "₹4-12 LPA",
          demand: "Growing",
        },
        {
          name: "Chemist",
          description: "Analyze chemical compounds and reactions",
          salary: "₹3-10 LPA",
          demand: "Medium",
        },
        {
          name: "Physicist",
          description: "Study matter, energy, and their interactions",
          salary: "₹5-18 LPA",
          demand: "Medium",
        },
      ],
      colleges: [
        "IISER Pune",
        "TIFR Mumbai",
        "BARC Mumbai",
        "NCL Pune",
        "IIT Bombay",
      ],
      skills: [
        "Research Skills",
        "Analytical Thinking",
        "Laboratory Skills",
        "Critical Thinking",
        "Data Analysis",
      ],
    },
    Business: {
      icon: "📊",
      description: "Navigate the world of business and entrepreneurship",
      careers: [
        {
          name: "Business Analyst",
          description: "Analyze business processes and recommend improvements",
          salary: "₹4-12 LPA",
          demand: "High",
        },
        {
          name: "Financial Analyst",
          description: "Analyze financial data and market trends",
          salary: "₹4-15 LPA",
          demand: "High",
        },
        {
          name: "Marketing Manager",
          description: "Develop and execute marketing strategies",
          salary: "₹5-18 LPA",
          demand: "High",
        },
        {
          name: "Entrepreneur",
          description: "Start and run your own business",
          salary: "Variable",
          demand: "Growing",
        },
        {
          name: "HR Manager",
          description: "Manage human resources and employee relations",
          salary: "₹4-12 LPA",
          demand: "Medium",
        },
      ],
      colleges: [
        "NMIMS Mumbai",
        "SPJIMR Mumbai",
        "SIBM Pune",
        "XIMB Bhubaneswar",
        "IIM Nagpur",
      ],
      skills: [
        "Leadership",
        "Communication",
        "Strategic Thinking",
        "Financial Literacy",
        "Problem Solving",
      ],
    },
    "Arts & Design": {
      icon: "🎨",
      description: "Express creativity through various artistic mediums",
      careers: [
        {
          name: "Graphic Designer",
          description: "Create visual content for various media",
          salary: "₹3-12 LPA",
          demand: "High",
        },
        {
          name: "Architect",
          description: "Design buildings and structures",
          salary: "₹4-15 LPA",
          demand: "Medium",
        },
        {
          name: "Fashion Designer",
          description: "Create clothing and fashion accessories",
          salary: "₹3-10 LPA",
          demand: "Medium",
        },
        {
          name: "UI/UX Designer",
          description: "Design user interfaces and experiences",
          salary: "₹4-15 LPA",
          demand: "Very High",
        },
        {
          name: "Content Creator",
          description: "Create engaging digital content",
          salary: "₹2-8 LPA",
          demand: "Growing",
        },
      ],
      colleges: [
        "NID Ahmedabad",
        "NIFT Mumbai",
        "CEPT Ahmedabad",
        "JJ School of Arts",
        "MIT Pune",
      ],
      skills: [
        "Creativity",
        "Visual Design",
        "Communication",
        "Technical Skills",
        "Trend Awareness",
      ],
    },
  };

  const handleFieldSelect = (field) => setSelectedField(field);
  const handleStartQuiz = () => navigate("/quiz");
  const handleBackToHome = () => navigate("/home");

  return (
    <div className="explore-container">
      {/* Header */}
      <header className="explore-header">
        <button
          className="back-btn"
          onClick={handleBackToHome}
          aria-label="Back to home"
        >
          ← Back to Home
        </button>
        <h1 className="explore-title">
          <span className="title-icon">🔍</span>
          Explore Career Fields
        </h1>
      </header>

      {/* Field Tabs */}
      <section className="field-selection">
        <div className="field-tabs">
          <button
            className={`field-tab ${selectedField === "All" ? "active" : ""}`}
            onClick={() => handleFieldSelect("All")}
          >
            🌟 All Fields
          </button>
          {Object.keys(careerFields).map((field) => (
            <button
              key={field}
              className={`field-tab ${
                selectedField === field ? "active" : ""
              }`}
              onClick={() => handleFieldSelect(field)}
            >
              {careerFields[field].icon} {field}
            </button>
          ))}
        </div>
      </section>

      {/* Field Content */}
      <section className="field-content">
        {selectedField === "All" ? (
          <div className="all-fields-overview">
            <h2>Discover Your Perfect Career Path</h2>
            <p>
              Explore different career fields to find what matches your
              interests and skills
            </p>
            <div className="fields-grid">
              {Object.entries(careerFields).map(([fieldName, fieldData]) => (
                <div
                  key={fieldName}
                  className="field-card"
                  onClick={() => handleFieldSelect(fieldName)}
                >
                  <div className="field-card-icon">{fieldData.icon}</div>
                  <h3>{fieldName}</h3>
                  <p>{fieldData.description}</p>
                  <div className="field-card-arrow">→</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={`field-details ${isVisible ? "fade-in" : ""}`}>
            <div className="field-header">
              <div className="field-icon-large">
                {careerFields[selectedField].icon}
              </div>
              <div className="field-info">
                <h2>{selectedField}</h2>
                <p>{careerFields[selectedField].description}</p>
              </div>
            </div>

            {/* Careers */}
            <div className="careers-section">
              <h3>Career Opportunities</h3>
              <div className="careers-grid">
                {careerFields[selectedField].careers.map((career, index) => (
                  <div key={index} className="career-card">
                    <div className="career-header">
                      <h4>{career.name}</h4>
                      <span
                        className={`demand-badge ${career.demand
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {career.demand}
                      </span>
                    </div>
                    <p className="career-description">{career.description}</p>
                    <div className="career-details">
                      <span className="salary">💰 {career.salary}</span>
                      <span className="demand">📈 {career.demand} Demand</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Colleges */}
            <div className="colleges-section">
              <h3>Top Colleges in Maharashtra</h3>
              <div className="colleges-list">
                {careerFields[selectedField].colleges.map((college, index) => (
                  <div key={index} className="college-item">
                    <span className="college-icon">🏫</span>
                    <span className="college-name">{college}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="skills-section">
              <h3>Required Skills</h3>
              <div className="skills-grid">
                {careerFields[selectedField].skills.map((skill, index) => (
                  <div key={index} className="skill-tag">
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                className="action-btn primary"
                onClick={handleStartQuiz}
                aria-label="Take career assessment"
              >
                Take Career Assessment
              </button>
              <button
                className="action-btn secondary"
                onClick={handleBackToHome}
                aria-label="Explore other fields"
              >
                Explore Other Fields
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="explore-footer">
        <p>
          Ready to discover your career path? Take our comprehensive assessment
          to get personalized recommendations!
        </p>
        <button className="cta-button" onClick={handleStartQuiz}>
          Start Your Career Journey →
        </button>
      </footer>
    </div>
  );
};

export default ExplorePage;
