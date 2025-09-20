
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import OrderDetails from '../components/OrderDetails';

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
        console.log('Fetched order data:', data);
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-lg">Loading your order details...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            <p className="text-2xl font-semibold">Oops! Something went wrong.</p>
            <p>{error}</p>
          </div>
        ) : order ? (
          <div>
            <div className="text-center mb-8">
              <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h1 className="text-3xl font-bold text-gray-800 mt-4">Thank you for your order!</h1>
              <p className="text-gray-600 mt-2">Your order has been placed successfully.</p>
            </div>
            <OrderDetails order={order} />
            <div className="text-center mt-8">
              <Link to="/" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
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
