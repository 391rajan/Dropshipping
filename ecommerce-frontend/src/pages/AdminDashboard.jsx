// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import ProductManagement from '../components/ProductManagement';
import OrderManagement from '../components/OrderManagement';
import UserManagement from '../components/UserManagement';
import CategoryManagement from '../components/CategoryManagement';
import CouponManagement from '../components/CouponManagement';
import { userAPI, productAPI, orderAPI } from '../services/api';

function AdminDashboard() {
  const [stats, setStats] = useState({
    userCount: 0,
    productCount: 0,
    orderCount: 0,
    totalRevenue: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const [usersRes, productsRes, ordersRes, revenueRes] = await Promise.all([
          userAPI.getUserCount(),
          productAPI.getProductCount(),
          orderAPI.getOrderCount(),
          orderAPI.getTotalRevenue(),
        ]);

        setStats({
          userCount: usersRes.count,
          productCount: productsRes.count,
          orderCount: ordersRes.count,
          totalRevenue: revenueRes.totalRevenue,
        });
        setStatsError(null);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        setStatsError('Failed to load dashboard statistics.');
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-600">Total Users</h2>
          {loadingStats ? (
            <p>Loading...</p>
          ) : statsError ? (
            <p className="text-red-500">Error</p>
          ) : (
            <p className="text-3xl font-bold text-blue-600">{stats.userCount}</p>
          )}
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-600">Total Products</h2>
          {loadingStats ? (
            <p>Loading...</p>
          ) : statsError ? (
            <p className="text-red-500">Error</p>
          ) : (
            <p className="text-3xl font-bold text-green-600">{stats.productCount}</p>
          )}
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-600">Total Orders</h2>
          {loadingStats ? (
            <p>Loading...</p>
          ) : statsError ? (
            <p className="text-red-500">Error</p>
          ) : (
            <p className="text-3xl font-bold text-purple-600">{stats.orderCount}</p>
          )}
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-600">Total Revenue</h2>
          {loadingStats ? (
            <p>Loading...</p>
          ) : statsError ? (
            <p className="text-red-500">Error</p>
          ) : (
            <p className="text-3xl font-bold text-yellow-600">${stats.totalRevenue.toFixed(2)}</p>
          )}
        </div>
      </div>
      
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
