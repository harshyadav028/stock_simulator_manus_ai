import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get token from URL query params
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // Store token in localStorage
      localStorage.setItem('token', token);

      // Fetch user data
      const fetchUserData = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/user`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const userData = await response.json();
            localStorage.setItem('user', JSON.stringify(userData));
          }

          // Redirect to dashboard
          navigate('/dashboard');
        } catch (error) {
          console.error('Error fetching user data:', error);
          navigate('/login');
        }
      };

      fetchUserData();
    } else {
      // No token found, redirect to login
      navigate('/login');
    }
  }, [navigate, location]);

  return (
    <div className="auth-success-container">
      <div className="text-center">
        <h2>Authentication Successful</h2>
        <p>Redirecting to dashboard...</p>
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default AuthSuccess;
