// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import ProductManagement from '../components/ProductManagement';
import OrderManagement from '../components/OrderManagement';
import UserManagement from '../components/UserManagement';
import CategoryManagement from '../components/CategoryManagement';
import CouponManagement from '../components/CouponManagement';
import { userAPI, productAPI, orderAPI } from '../services/api';
import { FaUsers, FaBoxOpen, FaShoppingCart, FaDollarSign } from 'react-icons/fa';

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

  const StatCard = ({ icon, title, value, loading, error, colorClass }) => (
    <div className={`bg-white p-6 rounded-xl shadow-lg border border-accent/20 flex items-center space-x-4 transition-transform transform hover:scale-105`}>
      <div className={`text-4xl ${colorClass}`}>{icon}</div>
      <div>
        <h2 className="text-lg font-semibold text-accent">{title}</h2>
        {loading ? (
          <p className="text-2xl font-bold text-gray-400">Loading...</p>
        ) : error ? (
          <p className="text-2xl font-bold text-red-500">Error</p>
        ) : (
          <p className={`text-3xl font-bold ${colorClass}`}>{value}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-primary mb-8">Admin Dashboard</h1>
      
      {statsError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow">
          <p className="font-bold">Error</p>
          <p>{statsError}</p>
        </div>
      )}

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          icon={<FaUsers />} 
          title="Total Users" 
          value={stats.userCount} 
          loading={loadingStats} 
          error={statsError}
          colorClass="text-primary"
        />
        <StatCard 
          icon={<FaBoxOpen />} 
          title="Total Products" 
          value={stats.productCount} 
          loading={loadingStats} 
          error={statsError}
          colorClass="text-green-600"
        />
        <StatCard 
          icon={<FaShoppingCart />} 
          title="Total Orders" 
          value={stats.orderCount} 
          loading={loadingStats} 
          error={statsError}
          colorClass="text-purple-600"
        />
        <StatCard 
          icon={<FaDollarSign />} 
          title="Total Revenue" 
          value={`$${stats.totalRevenue.toFixed(2)}`} 
          loading={loadingStats} 
          error={statsError}
          colorClass="text-accent"
        />
      </div>
      
      {/* Main content area for admin features */}
      <div className="space-y-12">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-accent/20">
          <h2 className="text-2xl font-bold text-primary mb-6">Product Management</h2>
          <ProductManagement />
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg border border-accent/20">
          <h2 className="text-2xl font-bold text-primary mb-6">Order Management</h2>
          <OrderManagement />
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg border border-accent/20">
          <h2 className="text-2xl font-bold text-primary mb-6">User Management</h2>
          <UserManagement />
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg border border-accent/20">
          <h2 className="text-2xl font-bold text-primary mb-6">Category Management</h2>
          <CategoryManagement />
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg border border-accent/20">
          <h2 className="text-2xl font-bold text-primary mb-6">Coupon Management</h2>
          <CouponManagement />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;