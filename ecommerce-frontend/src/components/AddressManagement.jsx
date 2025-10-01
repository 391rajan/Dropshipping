import React, { useState, useEffect } from 'react';
import { addressAPI } from '../services/api';
import { FaPencilAlt, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await addressAPI.delete(id);
        fetchAddresses();
      } catch (err) {
        console.error('Error deleting address:', err);
        setError('Failed to delete address. Please try again.');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', street: '', city: '', state: '', zipCode: '', phone: '' });
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-8">
      <h1 className="text-3xl font-bold text-primary mb-8">Manage Addresses</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white p-8 rounded-xl shadow-lg border border-accent/20 mb-12">
        <h2 className="text-2xl font-semibold text-accent mb-6">{editingId ? 'Edit Address' : 'Add a New Address'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className="w-full border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none" required />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit Phone Number" className="w-full border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none" required />
          <input name="street" value={form.street} onChange={handleChange} placeholder="Street Address" className="md:col-span-2 w-full border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none" required />
          <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="w-full border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none" required />
          <input name="state" value={form.state} onChange={handleChange} placeholder="State / Province" className="w-full border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none" required />
          <input name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="ZIP / Postal Code" className="w-full border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none" required />
          
          <div className="md:col-span-2 flex items-center gap-4 mt-4">
            <button 
              type="submit" 
              disabled={submitting}
              className={`inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-full shadow-md transition-all duration-300 ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent hover:scale-105'}`}
            >
              {submitting ? 'Saving...' : (editingId ? <><FaPencilAlt /> Update Address</> : <><FaPlus /> Add Address</>)}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="inline-flex items-center gap-2 text-gray-600 hover:text-red-500 font-semibold transition-colors">
                <FaTimes /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <h2 className="text-2xl font-semibold text-primary mb-6">Your Addresses</h2>
      {loading ? (
        <div className="text-center text-gray-500 py-10">Loading addresses...</div>
      ) : addresses.length === 0 ? (
        <div className="text-center bg-white p-8 rounded-xl shadow-md border border-accent/20">
          <p className="text-gray-500">You haven't added any addresses yet.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map(addr => (
            <li key={addr._id} className="bg-white rounded-xl shadow-lg border border-accent/20 p-6 flex flex-col justify-between">
              <div>
                <p className="font-bold text-lg text-accent">{addr.name}</p>
                <p className="text-accent/80">{addr.street}</p>
                <p className="text-accent/80">{addr.city}, {addr.state} {addr.zipCode}</p>
                <p className="text-accent/80 mt-2">Phone: {addr.phone}</p>
              </div>
              <div className="flex gap-4 mt-6 pt-4 border-t border-accent/10">
                <button onClick={() => handleEdit(addr)} className="flex items-center gap-2 text-primary hover:text-accent font-semibold transition-colors">
                  <FaPencilAlt /> Edit
                </button>
                <button onClick={() => handleDelete(addr._id)} className="flex items-center gap-2 text-red-500 hover:text-red-700 font-semibold transition-colors">
                  <FaTrash /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressManagement;
