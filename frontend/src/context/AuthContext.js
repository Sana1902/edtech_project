import { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is authenticated on app load - only run once
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: {
                user: data.data.user,
                token
              }
            });
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('token');
            dispatch({ type: 'LOGOUT' });
          }
        } catch (error) {
          console.error('Auth check error:', error);
          localStorage.removeItem('token');
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    };

    checkAuthStatus();
  }, []); // Empty dependency array - only run once on mount

  // No additional useEffect hooks to prevent infinite loops

  // Login function
  const login = async (email, password) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.data.token);
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: data.data.user,
            token: data.data.token
          }
        });
        return { success: true };
      } else {
        dispatch({
          type: 'AUTH_FAILURE',
          payload: data.message || 'Login failed'
        });
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      dispatch({
        type: 'AUTH_FAILURE',
        payload: 'Network error. Please try again.'
      });
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // Register function
  const register = async (name, email, password, role = 'student') => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.data.token);
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: data.data.user,
            token: data.data.token
          }
        });
        return { success: true };
      } else {
        dispatch({
          type: 'AUTH_FAILURE',
          payload: data.message || 'Registration failed'
        });
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      dispatch({
        type: 'AUTH_FAILURE',
        payload: 'Network error. Please try again.'
      });
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch('http://localhost:5000/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();

      if (response.ok) {
        dispatch({
          type: 'UPDATE_USER',
          payload: data.data.user
        });
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = useMemo(() => ({
    ...state,
    login,
    register,
    logout,
    updateProfile,
    clearError
  }), [state, login, register, logout, updateProfile, clearError]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
