import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { verifyEmail } from '../services/api';

const EmailVerification = () => {
  const { token } = useParams();
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await verifyEmail(token);
        setMessage(res.data.message);
      } catch (err) {
        setMessage(err.response.data.message);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
      <p className="mb-4">{message}</p>
      <Link to="/login" className="text-blue-500 hover:underline">Go to Login</Link>
    </div>
  );
};

export default EmailVerification;
