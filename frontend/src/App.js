import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import HomePage from './components/HomePage';
import QCForm from './components/Quiz'; // ✅ Import your quiz component
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {/* Landing Page: Login/Register */}
        <Route
          path="/"
          element={
            !isAuthenticated ? (
              <AuthLandingPage onLoginSuccess={handleLoginSuccess} />
            ) : (
              <Navigate to="/home" />
            )
          }
        />

        {/* Login Page */}
        <Route
          path="/login"
          element={<LoginForm onBack={() => {}} onLoginSuccess={handleLoginSuccess} />}
        />

        {/* Registration Page */}
        <Route
          path="/register"
          element={<RegistrationForm onBack={() => {}} />}
        />

        {/* Home Page */}
        <Route
          path="/home"
          element={
            isAuthenticated ? (
              <HomePage onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* ✅ Quiz Page */}
        <Route
          path="/quiz"
          element={
            isAuthenticated ? (
              <QCForm />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

// Landing page with Login/Register buttons
const AuthLandingPage = ({ onLoginSuccess }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="app">
      <div className="background">
        <div className="gradient-circle top-left"></div>
        <div className="gradient-circle bottom-right"></div>
      </div>

      {!showLogin && !showRegister ? (
        <div className="content">
          <h1 className="welcome-text">
            Welcome to <span className="skillmap-text">Skill Map</span>
            <div className="underline"></div>
          </h1>

          <p className="tagline">
            Chart your learning journey • Track your progress • Unlock your potential
          </p>

          <div className="button-container">
            <button className="auth-button login" onClick={() => setShowLogin(true)}>
              Login
            </button>
            <button className="auth-button register" onClick={() => setShowRegister(true)}>
              Register
            </button>
          </div>
        </div>
      ) : showLogin ? (
        <LoginForm onBack={() => setShowLogin(false)} onLoginSuccess={onLoginSuccess} />
      ) : (
        <RegistrationForm onBack={() => setShowRegister(false)} />
      )}
    </div>
  );
};

export default App;
