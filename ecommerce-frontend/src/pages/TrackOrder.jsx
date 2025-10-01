import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { orderAPI } from '../services/api';
import OrderDetails from '../components/OrderDetails'; // Assuming this component can display a single order

function TrackOrder() {
  const { orderId: urlOrderId } = useParams();
  const [orderId, setOrderId] = useState(urlOrderId || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleTrackOrder = useCallback(async (e) => {
    if (e) e.preventDefault();
    if (!orderId.trim()) {
      setError('Please enter a valid Order ID.');
      return;
    }

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const data = await orderAPI.getById(orderId);
      setOrder(data);
    } catch (err) {
      const message = err.response?.data?.message || 'Order not found or an error occurred.';
      setError(message);
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  }, [orderId]); // Dependencies for useCallback

  useEffect(() => {
    if (urlOrderId) {
      handleTrackOrder();
    }
  }, [urlOrderId, handleTrackOrder]);

  return (
    <main className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Track Your Order</h1>
          <p className="text-accent/90 text-lg mb-8">Enter your order ID to see the status of your shipment.</p>
        </div>

        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter your Order ID (e.g., 60c72b2f9b1d8c001f8e4b1a)"
              className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Tracking...' : 'Track Order'}
            </button>
          </form>
        </div>

        {error && (
          <div className="max-w-md mx-auto mt-6 p-4 bg-red-100 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        {order && (
          <div className="max-w-4xl mx-auto mt-10 bg-white p-6 sm:p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Status</h2>
            <OrderDetails order={order} />
          </div>
        )}
      </div>
    </main>
  );
}

export default TrackOrder;