import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axiosInstance from '../services/api';
import CheckoutForm from '../components/CheckoutForm'; // Import the new component

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card'); // Default to card
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(''); // State for Stripe client secret
  const [paymentError, setPaymentError] = useState(null); // State for payment errors

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axiosInstance.get('/address');
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

  // Fetch client secret when cart or selected address changes
  useEffect(() => {
    const getClientSecret = async () => {
      if (cart.total > 0 && selectedAddress && paymentMethod === 'card') {
        setLoading(true);
        try {
          const response = await axiosInstance.post('/payments/create-payment-intent', {
            amount: Math.round(cart.total * 100), // Amount in cents
          });
          setClientSecret(response.data.clientSecret);
          setPaymentError(null); // Clear previous errors
        } catch (error) {
          console.error('Error creating payment intent:', error);
          setPaymentError('Failed to initialize payment. Please try again.');
        } finally {
          setLoading(false);
        }
      } else {
        setClientSecret(''); // Clear client secret if not using card or no total
      }
    };
    getClientSecret();
  }, [cart.total, selectedAddress, paymentMethod]);


  const handlePlaceOrder = async (paymentIntentId = null) => { // paymentIntentId is optional for COD
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        shippingAddress: selectedAddress, // Changed from addressId
        paymentMethod,
        items: cart.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price // Include price for order item
        })),
        totalPrice: cart.total,
        paymentResult: paymentIntentId ? { id: paymentIntentId, status: 'succeeded' } : undefined,
      };

      const response = await axiosInstance.post('/orders', orderData);

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

  const onPaymentSuccess = (paymentIntentId) => {
    handlePlaceOrder(paymentIntentId);
  };

  const onPaymentFailure = (message) => {
    setPaymentError(message);
    setLoading(false);
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

      {/* Stripe Payment Form or COD button */}
      {paymentMethod === 'card' && cart.total > 0 && selectedAddress && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Enter Card Details</h2>
          {loading && <p>Loading payment form...</p>}
          {paymentError && <p className="text-red-500">{paymentError}</p>}
          {clientSecret && !loading && (
            <CheckoutForm
              clientSecret={clientSecret}
              onPaymentSuccess={onPaymentSuccess}
              onPaymentFailure={onPaymentFailure}
            />
          )}
        </div>
      )}

      {paymentMethod === 'cod' && (
        <button
          onClick={() => handlePlaceOrder()} // No paymentIntentId for COD
          disabled={loading || !selectedAddress || cart.total === 0}
          className={`w-full py-3 rounded-lg text-white font-medium ${
            loading || !selectedAddress || cart.total === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Processing...' : 'Place Order (Cash on Delivery)'}
        </button>
      )}

      {/* Order Summary */}
      <div className="mb-8 mt-8"> {/* Added mt-8 for spacing */}
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
    </div>
  );
};

export default Checkout;
