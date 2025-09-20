// src/components/OrderManagement.jsx
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import OrderDetails from './OrderDetails';
import { orderAPI } from '../services/api';

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const orderStatusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderAPI.getAll();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewDetailsClick = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      await orderAPI.updateStatus(selectedOrder._id, { status: newStatus });

      fetchOrders(); // Refresh the list
      handleCloseModal();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Manage Orders</h2>

      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase">Order ID</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase">Total</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium">#{order._id.substring(0, 7)}...</td>
                  <td className="py-3 px-4">{order.user?.name || 'Guest'}</td>
                  <td className="py-3 px-4">{formatDate(order.createdAt)}</td>
                  <td className="py-3 px-4">{formatPrice(order.totalPrice)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${ 
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
                      'bg-yellow-100 text-yellow-800' 
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button onClick={() => handleViewDetailsClick(order)} className="text-blue-500 hover:text-blue-700 font-medium">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={`Order Details: #${selectedOrder?._id.substring(0, 7)}...`}>
        {selectedOrder && (
          <div>
            <OrderDetails order={selectedOrder} />
            <div className="mt-6 pt-4 border-t">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Update Status</h4>
              <div className="flex items-center space-x-4">
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="flex-grow mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  {orderStatusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <button onClick={handleUpdateStatus} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                  Save Status
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default OrderManagement;
