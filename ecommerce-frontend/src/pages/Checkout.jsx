import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI, paymentAPI, addressAPI } from '../services/api';
import { FaPlusCircle } from 'react-icons/fa';

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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

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
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">Checkout</h1>
      
      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow" role="alert"><p className="font-bold">Error</p><p>{error}</p></div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left side: Address and Payment */}
        <div className="lg:col-span-2 space-y-8">
          {/* Delivery Address Section */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-accent/20">
            <h2 className="text-2xl font-semibold text-accent mb-6">1. Select Delivery Address</h2>
            {addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map(address => (
                  <div 
                    key={address._id}
                    className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedAddress === address._id 
                        ? 'border-primary bg-primary/5 shadow-inner ring-2 ring-primary' 
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedAddress(address._id)}
                  >
                    <p className="font-bold text-lg text-accent">{address.name}</p>
                    <p className="text-accent/80">{address.street}</p>
                    <p className="text-accent/80">{address.city}, {address.state} {address.zipCode}</p>
                    <p className="text-accent/80 mt-2 font-medium">{address.phone}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <p className="text-accent/80 mb-4">No addresses found. Please add an address to proceed.</p>
                <Link 
                  to="/profile/addresses"
                  className="inline-flex items-center gap-2 bg-primary text-white font-semibold py-2 px-5 rounded-full hover:bg-accent transition-colors shadow-md"
                >
                  <FaPlusCircle size={20} />
                  Add New Address
                </Link>
              </div>
            )}
          </div>

          {/* Payment Method Section - Simplified */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-accent/20">
            <h2 className="text-2xl font-semibold text-accent mb-6">2. Payment Method</h2>
            <div className="border-2 border-primary bg-primary/5 rounded-lg p-4">
              <p className="font-semibold text-accent">Dummy Payment Gateway</p>
              <p className="text-sm text-accent/80">This is a simulated payment for demonstration purposes.</p>
            </div>
          </div>
        </div>

        {/* Right side: Order Summary */}
        <div className="lg:col-span-1 h-fit sticky top-24">
          <div className="bg-primary/5 p-8 rounded-xl shadow-lg border border-accent/20">
            <h2 className="text-2xl font-semibold text-primary mb-6 border-b border-accent/20 pb-4">Order Summary</h2>
            <div className="space-y-4">
              {cart.items.map(item => (
                <div key={item.product._id} className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-accent">{item.product.name}</p>
                    <p className="text-sm text-accent/80">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-accent">{formatPrice(item.product.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-accent/20 mt-6 pt-6 space-y-3">
              <div className="flex justify-between text-lg text-accent/90">
                <span>Subtotal</span>
                <span>{formatPrice(cart.subtotal)}</span>
              </div>
              {cart.discount > 0 && (
                <div className="flex justify-between text-lg text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(cart.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-2xl font-bold text-primary">
                <span>Total</span>
                <span>{formatPrice(cart.total)}</span>
              </div>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={loading || !selectedAddress || cart.total === 0}
              className={`w-full mt-8 py-3 rounded-full text-white font-semibold text-lg transition-all duration-300 shadow-lg transform hover:scale-105 ${
                loading || !selectedAddress || cart.total === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-accent'
              }`}
            >
              {loading ? 'Processing Order...' : `Place Order & Pay ${formatPrice(cart.total)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;