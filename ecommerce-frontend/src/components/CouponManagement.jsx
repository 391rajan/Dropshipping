// src/components/CouponManagement.jsx
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import CouponForm from './CouponForm'; // Import CouponForm

function CouponManagement() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/coupons'); // Assumes admin token is sent
      if (!response.ok) {
        throw new Error('Failed to fetch coupons. Are you an admin?');
      }
      const data = await response.json();
      setCoupons(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleFormSubmit = async (formData) => {
    const method = editingCoupon ? 'PUT' : 'POST';
    const url = editingCoupon
      ? `http://localhost:5000/api/coupons/${editingCoupon._id}`
      : 'http://localhost:5000/api/coupons';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save coupon.');
      }

      handleCloseModal();
      fetchCoupons(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (couponId) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/coupons/${couponId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete coupon.');
        }

        fetchCoupons(); // Refresh list
      } catch (err) {
        alert(`Error: ${err.message}`);
      }
    }
  };

  const handleAddNewClick = () => {
    setEditingCoupon(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (coupon) => {
    setEditingCoupon(coupon);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCoupon(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Manage Coupons</h2>
        <button onClick={handleAddNewClick} className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-300">
          + Add New Coupon
        </button>
      </div>

      {loading && <p>Loading coupons...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase">Code</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase">Value</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase">Min Cart</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase">Expires</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase">Used</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase">Active</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {coupons.map((coupon) => (
                <tr key={coupon._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">{coupon.code}</td>
                  <td className="py-3 px-4">{coupon.discountType}</td>
                  <td className="py-3 px-4">{coupon.value}{coupon.discountType === 'percentage' ? '%' : '$'}</td>
                  <td className="py-3 px-4">{coupon.minCartValue || 'N/A'}</td>
                  <td className="py-3 px-4">{formatDate(coupon.endDate)}</td>
                  <td className="py-3 px-4">{coupon.usedCount || 0}</td>
                  <td className="py-3 px-4">{coupon.isActive ? 'Yes' : 'No'}</td>
                  <td className="py-3 px-4">
                    <button onClick={() => handleEditClick(coupon)} className="text-blue-500 hover:text-blue-700 font-medium mr-4">Edit</button>
                    <button onClick={() => handleDelete(coupon._id)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}>
        <CouponForm 
          initialData={editingCoupon}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}

export default CouponManagement;