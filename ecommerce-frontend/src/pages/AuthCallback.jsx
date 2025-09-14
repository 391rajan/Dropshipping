import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      login(token); // Store token and update auth state
      navigate('/'); // Redirect to homepage
    } else {
      // Handle error or no token case
      navigate('/login', { state: { error: 'Google authentication failed.' } });
    }
  }, [searchParams, login, navigate]);

  return <div>Loading...</div>; // Or a spinner component
};

export default AuthCallback;