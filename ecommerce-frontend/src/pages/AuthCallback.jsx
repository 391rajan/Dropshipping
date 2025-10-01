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

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
      <p className="mt-4 text-lg text-accent">Authenticating, please wait...</p>
    </div>
  );
};

export default AuthCallback;