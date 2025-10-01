import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { FaEnvelope, FaPaperPlane } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await authAPI.forgotPassword({ email });
      setMessage(res.message);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-accent/20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary">Forgot Your Password?</h2>
          <p className="text-accent/80 mt-2">No problem. Enter your email below and we'll send you a reset link.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-accent/80 mb-2">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="email" 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full pl-12 pr-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                placeholder="you@example.com"
                required 
              />
            </div>
          </div>

          {message && <p className="text-green-600 bg-green-100 p-3 rounded-lg text-center">{message}</p>}
          {error && <p className="text-red-600 bg-red-100 p-3 rounded-lg text-center">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-full shadow-md transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent hover:scale-105'}`}
          >
            {loading ? 'Sending...' : <><FaPaperPlane /> Send Reset Link</>}
          </button>
        </form>
        
        <div className="text-center mt-6">
          <Link to="/login" className="text-sm text-primary hover:text-accent font-medium transition-colors">
            Remembered your password? Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;