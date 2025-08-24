import React, { useState, useEffect } from 'react';
import { addressAPI } from '../services/api';

const AddressManagement = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await addressAPI.getAll();
      setAddresses(data);
    } catch (err) {
      console.error('Error fetching addresses:', err);
      setError('Failed to load addresses. Please try again.');
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.phone.match(/^\d{10}$/)) {
      return 'Phone number must be 10 digits';
    }
    if (!form.zipCode.match(/^\d{5,6}$/)) {
      return 'ZIP code must be 5-6 digits';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      if (editingId) {
        await addressAPI.update(editingId, form);
      } else {
        await addressAPI.create(form);
      }
      setForm({ name: '', street: '', city: '', state: '', zipCode: '', phone: '' });
      setEditingId(null);
      fetchAddresses();
    } catch (err) {
      console.error('Error saving address:', err);
      setError(err.response?.data?.message || 'Failed to save address. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (address) => {
    setForm(address);
    setEditingId(address._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this address?')) {
      try {
        await addressAPI.delete(id);
        fetchAddresses();
      } catch (err) {
        console.error('Error deleting address:', err);
        setError('Failed to delete address. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Manage Addresses</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full border p-2 rounded" required />
        <input name="street" value={form.street} onChange={handleChange} placeholder="Street" className="w-full border p-2 rounded" required />
        <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="w-full border p-2 rounded" required />
        <input name="state" value={form.state} onChange={handleChange} placeholder="State" className="w-full border p-2 rounded" required />
        <input name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="Zip Code" className="w-full border p-2 rounded" required />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full border p-2 rounded" required />
        <button 
          type="submit" 
          disabled={submitting}
          className={`bg-blue-600 text-white px-4 py-2 rounded ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
        >
          {submitting ? 'Saving...' : editingId ? 'Update Address' : 'Add Address'}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', street: '', city: '', state: '', zipCode: '', phone: '' }); }} className="ml-2 text-gray-600">Cancel</button>
        )}
      </form>
      <h2 className="text-xl font-semibold mb-4">Your Addresses</h2>
      {loading ? <div>Loading...</div> : (
        <ul className="space-y-4">
          {addresses.map(addr => (
            <li key={addr._id} className="border p-4 rounded flex justify-between items-center">
              <div>
                <div className="font-medium">{addr.name}</div>
                <div>{addr.street}, {addr.city}, {addr.state} {addr.zipCode}</div>
                <div>{addr.phone}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(addr)} className="text-blue-600">Edit</button>
                <button onClick={() => handleDelete(addr._id)} className="text-red-600">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressManagement;
