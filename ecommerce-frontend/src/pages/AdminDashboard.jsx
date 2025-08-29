// src/pages/AdminDashboard.jsx
import React from 'react';
import ProductManagement from '../components/ProductManagement';
import OrderManagement from '../components/OrderManagement';
import UserManagement from '../components/UserManagement';
import CategoryManagement from '../components/CategoryManagement';
import CouponManagement from '../components/CouponManagement';

function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      {/* Main content area for admin features */}
      <div className="space-y-8">
        <ProductManagement />
        <div className="border-t border-gray-200 pt-8">
          <OrderManagement />
        </div>
        <div className="border-t border-gray-200 pt-8">
          <UserManagement />
        </div>
        <div className="border-t border-gray-200 pt-8">
          <CategoryManagement />
        </div>
        <div className="border-t border-gray-200 pt-8">
          <CouponManagement />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
