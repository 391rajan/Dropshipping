import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaShoppingBag, FaBoxOpen } from 'react-icons/fa';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderAPI.getMyOrders();
        setOrders(data);
      } catch (error) {
        setError('Failed to fetch orders. Please try again later.');
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusChip = (status) => {
    const baseClasses = 'px-3 py-1 text-sm font-medium rounded-full';
    switch (status.toLowerCase()) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'processing':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'shipped':
        return `${baseClasses} bg-indigo-100 text-indigo-800`;
      case 'delivered':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
        <p className="mt-4 text-lg text-accent">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 p-8 rounded-xl shadow-lg border border-red-200">
          <h2 className="text-2xl font-bold text-red-600 mb-4">An Error Occurred</h2>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-primary mb-8">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center bg-white p-10 rounded-xl shadow-lg border border-accent/20 max-w-lg mx-auto">
          <FaBoxOpen className="text-6xl text-primary mx-auto mb-6" />
          <p className="text-xl text-accent/90 mb-6">You haven't placed any orders yet.</p>
          <Link to="/shop" className="inline-block bg-primary hover:bg-accent text-white font-semibold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
            <FaShoppingBag className="inline-block mr-2" />
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-lg border border-accent/20 overflow-hidden">
              <div className="bg-primary/5 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-accent/20">
                <div>
                  <p className="font-semibold text-accent">Order ID: <span className="font-mono text-sm">{order._id}</span></p>
                  <p className="text-sm text-accent/80">Placed on: {formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right mt-2 sm:mt-0">
                  <p className="font-bold text-xl text-primary">${order.totalPrice.toFixed(2)}</p>
                  <p className={getStatusChip(order.status)}>{order.status}</p>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-accent mb-4">Order Items ({order.orderItems.length})</h3>
                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div key={item._id} className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        {item.product && item.product.image && (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded-lg border border-accent/20"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-accent hover:text-primary">
                            {item.product ? (
                              <Link to={`/product/${item.product._id}`}>{item.product.name}</Link>
                            ) : (
                              'Product not available'
                            )}
                          </p>
                          <p className="text-sm text-accent/80">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-accent">
                        ${item.product ? (item.product.price * item.quantity).toFixed(2) : 'N/A'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 text-right border-t border-accent/20">
                <Link
                  to={`/track-order/${order._id}`}
                  className="inline-block bg-primary hover:bg-accent text-white font-semibold py-2 px-5 rounded-full shadow-md transform hover:scale-105 transition-all duration-300"
                >
                  Track Order
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;