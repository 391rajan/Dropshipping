import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { FaLock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const { message } = await authAPI.resetPassword(token, { password });
      setMessage(message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. The token may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-accent/20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary">Reset Your Password</h2>
          <p className="text-accent/80 mt-2">Create a new, strong password for your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-accent/80 mb-2">New Password</label>
            <div className="relative">
              <FaLock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="password" 
                id="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full pl-12 pr-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                placeholder="••••••••"
                required 
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-accent/80 mb-2">Confirm New Password</label>
            <div className="relative">
              <FaLock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="password" 
                id="confirmPassword" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                className="w-full pl-12 pr-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                placeholder="••••••••"
                required 
              />
            </div>
          </div>

          {message && (
            <div className="flex items-center gap-2 text-green-600 bg-green-100 p-3 rounded-lg">
              <FaCheckCircle /> {message}
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-100 p-3 rounded-lg">
              <FaTimesCircle /> {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-full shadow-md transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent hover:scale-105'}`}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-sm text-accent/80">Redirecting to login...</p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;