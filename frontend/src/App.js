import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import HomePage from './components/HomePage';
import QCForm from './components/Quiz';
import ExplorePage from './components/ExplorePage';
import AboutPage from './components/AboutPage';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/" />;
};

// Main App Component
const AppContent = () => {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Router>
      <Routes>
        {/* Landing Page: Login/Register */}
        <Route
          path="/"
          element={
            !isAuthenticated ? (
              <AuthLandingPage />
            ) : (
              <Navigate to="/home" />
            )
          }
        />

        {/* Login Page */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginForm />
            ) : (
              <Navigate to="/home" />
            )
          }
        />

        {/* Registration Page */}
        <Route
          path="/register"
          element={
            !isAuthenticated ? (
              <RegistrationForm />
            ) : (
              <Navigate to="/home" />
            )
          }
        />

        {/* Home Page */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Quiz Page */}
        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <QCForm />
            </ProtectedRoute>
          }
        />

        {/* Profile Page */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Explore Page */}
        <Route
          path="/career-explorer"
          element={
            isAuthenticated ? (
              <ExplorePage />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* General Explore Page */}
        <Route
          path="/explore"
          element={
            isAuthenticated ? (
              <ExplorePage />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* About Page */}
        <Route
          path="/about"
          element={
            isAuthenticated ? (
              <AboutPage />
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
const AuthLandingPage = () => {
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
        <LoginForm onBack={() => setShowLogin(false)} />
      ) : (
        <RegistrationForm onBack={() => setShowRegister(false)} />
      )}
    </div>
  );
};

// Wrapper App Component with AuthProvider
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
