import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const EmailVerification = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('Verifying your email, please wait...');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing.');
        return;
      }
      try {
        const res = await authAPI.verifyEmail(token);
        setStatus('success');
        setMessage(res.message);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Email verification failed. The link may be invalid or expired.');
      }
    };

    verify();
  }, [token]);

  const statusInfo = {
    verifying: {
      icon: <FaSpinner className="animate-spin text-4xl text-primary" />,
      title: 'Verifying Email',
      color: 'text-primary',
    },
    success: {
      icon: <FaCheckCircle className="text-4xl text-green-500" />,
      title: 'Verification Successful',
      color: 'text-green-500',
    },
    error: {
      icon: <FaTimesCircle className="text-4xl text-red-500" />,
      title: 'Verification Failed',
      color: 'text-red-500',
    },
  };

  const currentStatus = statusInfo[status];

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-accent/20 text-center">
        <div className="mb-6 flex justify-center">{currentStatus.icon}</div>
        <h2 className={`text-2xl font-bold mb-3 ${currentStatus.color}`}>{currentStatus.title}</h2>
        <p className="text-accent/90 mb-8">{message}</p>
        {(status === 'success' || status === 'error') && (
          <Link 
            to="/login" 
            className="inline-block bg-primary hover:bg-accent text-white font-semibold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Proceed to Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;