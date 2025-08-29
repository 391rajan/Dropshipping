// src/components/CouponForm.jsx
import React, { useState, useEffect } from 'react';

function CouponForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    value: 0,
    minCartValue: 0,
    maxDiscountValue: '',
    endDate: '',
    usageLimit: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code || '',
        discountType: initialData.discountType || 'percentage',
        value: initialData.value || 0,
        minCartValue: initialData.minCartValue || 0,
        maxDiscountValue: initialData.maxDiscountValue || '',
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '', // Format date for input
        usageLimit: initialData.usageLimit || '',
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Convert empty strings to null/undefined for optional number fields
    const dataToSubmit = {
      ...formData,
      maxDiscountValue: formData.maxDiscountValue === '' ? undefined : Number(formData.maxDiscountValue),
      usageLimit: formData.usageLimit === '' ? undefined : Number(formData.usageLimit),
      value: Number(formData.value),
      minCartValue: Number(formData.minCartValue),
    };
    await onSubmit(dataToSubmit);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-700">Coupon Code</label>
        <input type="text" name="code" id="code" value={formData.code} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div>
        <label htmlFor="discountType" className="block text-sm font-medium text-gray-700">Discount Type</label>
        <select name="discountType" id="discountType" value={formData.discountType} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          <option value="percentage">Percentage</option>
          <option value="fixed_amount">Fixed Amount</option>
        </select>
      </div>
      <div>
        <label htmlFor="value" className="block text-sm font-medium text-gray-700">Value</label>
        <input type="number" name="value" id="value" value={formData.value} onChange={handleChange} required min="0" step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div>
        <label htmlFor="minCartValue" className="block text-sm font-medium text-gray-700">Minimum Cart Value</label>
        <input type="number" name="minCartValue" id="minCartValue" value={formData.minCartValue} onChange={handleChange} min="0" step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
      </div>
      {formData.discountType === 'percentage' && (
        <div>
          <label htmlFor="maxDiscountValue" className="block text-sm font-medium text-gray-700">Max Discount Value (for %)</label>
          <input type="number" name="maxDiscountValue" id="maxDiscountValue" value={formData.maxDiscountValue} onChange={handleChange} min="0" step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
      )}
      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
        <input type="date" name="endDate" id="endDate" value={formData.endDate} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div>
        <label htmlFor="usageLimit" className="block text-sm font-medium text-gray-700">Usage Limit (total)</label>
        <input type="number" name="usageLimit" id="usageLimit" value={formData.usageLimit} onChange={handleChange} min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div className="flex items-center">
        <input type="checkbox" name="isActive" id="isActive" checked={formData.isActive} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Is Active</label>
      </div>
      <div className="flex justify-end space-x-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300">
          {loading ? 'Saving...' : 'Save Coupon'}
        </button>
      </div>
    </form>
  );
}

export default CouponForm;
