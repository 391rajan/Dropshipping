// src/components/OrderDetails.jsx
import React from 'react';

function OrderDetails({ order }) {
  if (!order) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Customer and Shipping Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Customer Details</h4>
          <p className="text-gray-600">{order.user?.name}</p>
          <p className="text-gray-600">{order.user?.email}</p>
        </div>

      </div>

      {/* Order Items */}
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-2">Order Items</h4>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-2 px-4 font-medium text-sm text-gray-600">Product</th>
                <th className="text-center py-2 px-4 font-medium text-sm text-gray-600">Quantity</th>
                <th className="text-right py-2 px-4 font-medium text-sm text-gray-600">Price</th>
                <th className="text-right py-2 px-4 font-medium text-sm text-gray-600">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {order.orderItems.map(item => (
                <tr key={item._id}>
                  <td className="py-3 px-4">{item.product?.name || 'Product not found'}</td>
                  <td className="py-3 px-4 text-center">{item.quantity}</td>
                  <td className="py-3 px-4 text-right">{formatPrice(item.price)}</td>
                  <td className="py-3 px-4 text-right">{formatPrice(item.quantity * item.price)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan="3" className="text-right py-2 px-4 font-semibold">Total</td>
                <td className="text-right py-2 px-4 font-semibold">{formatPrice(order.totalPrice)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Order Summary */}
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-2">Summary</h4>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Order Date:</strong> {formatDate(order.createdAt)}</p>
          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
          <p><strong>Current Status:</strong> <span className="font-semibold">{order.status}</span></p>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
