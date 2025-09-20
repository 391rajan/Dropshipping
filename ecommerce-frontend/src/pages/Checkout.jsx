import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI, paymentAPI, addressAPI } from '../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('dummy'); // Default to dummy
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const data = await addressAPI.getAll();
        setAddresses(data);
        if (data.length > 0) {
          setSelectedAddress(data[0]._id);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };
    fetchAddresses();
  }, []);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError('Please select a delivery address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Create the order
      const orderData = {
        shippingAddress: selectedAddress,
        paymentMethod,
        items: cart.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        totalPrice: cart.total,
      };

      const order = await orderAPI.createOrder(orderData);

      // 2. Process the dummy payment
      try {
        const paymentResponse = await paymentAPI.processDummyPayment({
          orderId: order._id,
          amount: order.totalPrice,
        });

        if (paymentResponse.success) {
          clearCart();
          navigate(`/order-success/${order._id}`);
        } else {
          // The backend will have already marked the order as Cancelled
          setError(paymentResponse.message || 'Payment failed. Please try again.');
        }
      } catch (paymentError) {
        console.error('Error processing dummy payment:', paymentError);
        setError('An error occurred during payment. Please try again.');
        // The order exists but payment failed. The backend should handle this.
      }

    } catch (orderError) {
      console.error('Error placing order:', orderError);
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

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
              onClick={() => navigate('/profile/addresses')}
              className="mt-2 text-blue-500 hover:text-blue-600"
            >
              Add Address
            </button>
          </div>
        )}
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

      <button
        onClick={handlePlaceOrder}
        disabled={loading || !selectedAddress || cart.total === 0}
        className={`w-full py-3 rounded-lg text-white font-medium ${
          loading || !selectedAddress || cart.total === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Processing Order...' : 'Place Order'}
      </button>

    </div>
  );
};

export default Checkout;
