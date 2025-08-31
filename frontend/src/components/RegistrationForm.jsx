import { useForm } from 'react-hook-form';
import { useState } from 'react';
import './RegistrationForm.css';

const RegistrationForm = ({ onBack }) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors }
  } = useForm();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("Form data:", data);
    setRegistrationSuccess(true);
    setIsSubmitting(false);
  };

  if (registrationSuccess) {
    return (
      <div className="registration-success-container">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h2>Registration Successful!</h2>
          <p>You are successfully registered.</p>
          <button 
            className="success-button"
            onClick={onBack}
          >
            Back to Welcome
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="registration-form-container">
      <button className="back-button" onClick={onBack}>&larr; Back to Welcome</button>
      
      <div className="registration-form-card">
        <h2>Student Registration</h2>
        <p className="subtitle">Join our platform to track your educational journey</p>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              {...register('name', { 
                required: 'Name is required',
                minLength: {
                  value: 3,
                  message: 'Name must be at least 3 characters'
                }
              })}
              className={errors.name ? 'error' : ''}
              placeholder="Enter your full name"
            />
            {errors.name && <span className="error-text">{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="grade">Grade/Class</label>
            <input
              id="grade"
              type="text"
              {...register('grade', { 
                required: 'Grade is required',
                pattern: {
                  value: /^[0-9]{1,2}(th|TH|st|ST|nd|ND|rd|RD)?$/,
                  message: 'Please enter a valid grade (e.g., 10, 12th)'
                }
              })}
              className={errors.grade ? 'error' : ''}
              placeholder="Enter your grade/class"
            />
            {errors.grade && <span className="error-text">{errors.grade.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="school">School Name</label>
            <input
              id="school"
              type="text"
              {...register('school', { 
                required: 'School name is required',
                minLength: {
                  value: 3,
                  message: 'School name must be at least 3 characters'
                }
              })}
              className={errors.school ? 'error' : ''}
              placeholder="Enter your school name"
            />
            {errors.school && <span className="error-text">{errors.school.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="location">Location (District/Taluka)</label>
            <input
              id="location"
              type="text"
              {...register('location', { 
                required: 'Location is required',
                minLength: {
                  value: 3,
                  message: 'Location must be at least 3 characters'
                }
              })}
              className={errors.location ? 'error' : ''}
              placeholder="Enter your district/taluka"
            />
            {errors.location && <span className="error-text">{errors.location.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-text">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              {...register('phone', { 
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Please enter a valid 10-digit phone number'
                }
              })}
              className={errors.phone ? 'error' : ''}
              placeholder="Enter 10-digit phone number"
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