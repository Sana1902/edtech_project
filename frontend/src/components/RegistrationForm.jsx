import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './RegistrationForm.css';

const RegistrationForm = () => {
  const { 
    register: registerForm, 
    handleSubmit, 
    formState: { errors },
    watch
  } = useForm();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const { register, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  // Clear auth errors when component mounts
  useEffect(() => {
    clearError();
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const result = await register(data.name, data.email, data.password, 'student');
      
      if (result.success) {
        setRegistrationSuccess(true);
      } else {
        // Error will be displayed by the auth context
        console.error('Registration failed:', result.error);
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="registration-success-container">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h2>Registration Successful!</h2>
          <p>You are successfully registered. You can now login with your credentials.</p>
          <button 
            className="success-button"
            onClick={() => navigate('/')}
          >
            Back to Welcome
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="registration-form-container">
      <button className="back-button" onClick={() => navigate('/')}>&larr; Back to Welcome</button>
      
      <div className="registration-form-card">
        <h2>Student Registration</h2>
        <p className="subtitle">Join our platform to track your educational journey</p>
        
        {/* Display authentication errors */}
        {authError && (
          <div className="error-message">
            {authError}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              {...registerForm('name', { 
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                },
                maxLength: {
                  value: 50,
                  message: 'Name cannot exceed 50 characters'
                }
              })}
              className={errors.name ? 'error' : ''}
              placeholder="Enter your full name"
              disabled={isSubmitting}
            />
            {errors.name && <span className="error-text">{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              {...registerForm('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,3}$/i,
                  message: 'Invalid email address'
                }
              })}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
              disabled={isSubmitting}
            />
            {errors.email && <span className="error-text">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              {...registerForm('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
              disabled={isSubmitting}
            />
            {errors.password && <span className="error-text">{errors.password.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              {...registerForm('confirmPassword', { 
                required: 'Please confirm your password',
                validate: (val) => {
                  if (watch('password') !==val) {
                    return "Passwords do not match";
                  }
                }
              })}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="Confirm your password"
              disabled={isSubmitting}
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="grade">Grade/Class</label>
            <input
              id="grade"
              type="text"
              {...registerForm('grade', { 
                required: 'Grade is required',
                pattern: {
                  value: /^[0-9]{1,2}(th|TH|st|ST|nd|ND|rd|RD)?$/,
                  message: 'Please enter a valid grade (e.g., 10, 12th)'
                }
              })}
              className={errors.grade ? 'error' : ''}
              placeholder="Enter your grade/class"
              disabled={isSubmitting}
            />
            {errors.grade && <span className="error-text">{errors.grade.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="school">School Name</label>
            <input
              id="school"
              type="text"
              {...registerForm('school', { 
                required: 'School name is required',
                minLength: {
                  value: 3,
                  message: 'School name must be at least 3 characters'
                }
              })}
              className={errors.school ? 'error' : ''}
              placeholder="Enter your school name"
              disabled={isSubmitting}
            />
            {errors.school && <span className="error-text">{errors.school.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="location">Location (District/Taluka)</label>
            <input
              id="location"
              type="text"
              {...registerForm('location', { 
                required: 'Location is required',
                minLength: {
                  value: 3,
                  message: 'Location must be at least 3 characters'
                }
              })}
              className={errors.location ? 'error' : ''}
              placeholder="Enter your district/taluka"
              disabled={isSubmitting}
            />
            {errors.location && <span className="error-text">{errors.location.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              {...registerForm('phone', { 
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Please enter a valid 10-digit phone number'
                }
              })}
              className={errors.phone ? 'error' : ''}
              placeholder="Enter 10-digit phone number"
              disabled={isSubmitting}
            />
            {errors.phone && <span className="error-text">{errors.phone.message}</span>}
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;