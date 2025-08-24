import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/address', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setAddresses(response.data);
        if (response.data.length > 0) {
          setSelectedAddress(response.data[0]._id);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };
    fetchAddresses();
  }, []);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        addressId: selectedAddress,
        paymentMethod,
        items: cart.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        totalAmount: cart.total
      };

      const response = await axios.post('http://localhost:5000/api/orders', orderData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.data) {
        clearCart();
        navigate(`/order-success/${response.data._id}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      {/* Delivery Address Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
        {addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map(address => (
              <div 
                key={address._id}
                className={`p-4 border rounded-lg cursor-pointer ${
                  selectedAddress === address._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedAddress(address._id)}
              >
                <p className="font-medium">{address.name}</p>
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.zipCode}</p>
                <p>{address.phone}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p>No addresses found. Please add an address.</p>
            <button 
              onClick={() => navigate('/profile')}
              className="mt-2 text-blue-500 hover:text-blue-600"
            >
              Add Address
            </button>
          </div>
        )}
      </div>

      {/* Payment Method Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="radio"
              id="card"
              name="payment"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-2"
            />
            <label htmlFor="card">Credit/Debit Card</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="cod"
              name="payment"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-2"
            />
            <label htmlFor="cod">Cash on Delivery</label>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="border rounded-lg p-4">
          {cart.items.map(item => (
            <div key={item.product._id} className="flex justify-between mb-2">
              <span>{item.product.name} x {item.quantity}</span>
              <span>${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Place Order Button */}
      <button
        onClick={handlePlaceOrder}
        disabled={loading || !selectedAddress}
        className={`w-full py-3 rounded-lg text-white font-medium ${
          loading || !selectedAddress
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Processing...' : 'Place Order'}
      </button>
    </div>
  );
};

export default Checkout;
