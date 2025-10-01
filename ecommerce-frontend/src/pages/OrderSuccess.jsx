import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import OrderDetails from '../components/OrderDetails';
import { FaCheckCircle, FaSpinner, FaExclamationCircle } from 'react-icons/fa';

function OrderSuccess() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await orderAPI.getById(orderId);
        setOrder(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch order details. Please contact support.');
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-lg border border-accent/20">
        {loading ? (
          <div className="text-center py-12">
            <FaSpinner className="animate-spin text-4xl text-primary mx-auto" />
            <p className="mt-4 text-lg text-accent">Loading your order details...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <FaExclamationCircle className="text-4xl text-red-500 mx-auto" />
            <p className="text-2xl font-semibold text-red-600 mt-4">Oops! Something went wrong.</p>
            <p className="text-accent/90 mt-2">{error}</p>
            <Link to="/" className="inline-block mt-6 bg-primary hover:bg-accent text-white font-semibold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
              Go to Homepage
            </Link>
          </div>
        ) : order ? (
          <div>
            <div className="text-center mb-8">
              <FaCheckCircle className="w-16 h-16 mx-auto text-green-500" />
              <h1 className="text-3xl font-bold text-primary mt-4">Thank You For Your Order!</h1>
              <p className="text-accent/90 mt-2">Your order has been placed successfully and is being processed.</p>
            </div>
            <OrderDetails order={order} />
            <div className="text-center mt-8">
              <Link to="/shop" className="inline-block bg-primary hover:bg-accent text-white font-semibold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default OrderSuccess;