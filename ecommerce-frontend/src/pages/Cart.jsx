import React, { useState } from "react";
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from '../context/CartContext';

function Cart() {
  const navigate = useNavigate();
  const { 
    cart, 
    updateQuantity, 
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');

  const decrementQty = (productId, currentQty) => {
    if (currentQty > 1) {
      updateQuantity(productId, currentQty - 1);
    }
  };

  const incrementQty = (productId, currentQty) => {
    updateQuantity(productId, currentQty + 1);
  };

  const removeItem = (productId) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      removeFromCart(productId);
    }
  };

  const handleApplyCoupon = async () => {
    if (couponCode.trim() === '') {
      alert('Please enter a coupon code.');
      return;
    }
    await applyCoupon(couponCode);
    setCouponCode(''); // Clear input after attempt
  };

  const handleRemoveCoupon = async () => {
    await removeCoupon();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">Your Shopping Cart</h1>

      {cart.items.length === 0 ? (
        <div className="text-center bg-white p-10 rounded-xl shadow-lg border border-accent/20 max-w-lg mx-auto">
          <FaShoppingCart className="text-6xl text-primary mx-auto mb-6" />
          <p className="text-xl text-accent/90 mb-6">Your cart is currently empty. Start shopping now!</p>
          <Link
            to="/shop"
            className="inline-block bg-primary hover:bg-accent text-white font-semibold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Go to Shop
          </Link>
        </div>
      ) : (
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-start"> 
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            {cart.items.map((item) => (
              <div
                key={item.product._id}
                className="flex items-center gap-6 bg-white rounded-xl shadow-lg border border-accent/20 p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-28 h-28 object-cover rounded-lg border border-accent/20"
                />
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="md:col-span-1">
                    <Link to={`/product/${item.product._id}`} className="font-semibold text-lg text-accent hover:text-primary transition-colors duration-200 line-clamp-2">
                      {item.product.name}
                    </Link>
                    <p className="text-primary text-lg font-bold mt-1">{formatPrice(item.price)}</p>
                  </div>

                  <div className="flex items-center justify-start md:justify-center gap-3">
                    <button
                      className="p-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => decrementQty(item.product._id, item.quantity)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <FaMinus size={16} />
                    </button>
                    <span className="font-medium text-lg w-8 text-center text-accent">{item.quantity}</span>
                    <button
                      className="p-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
                      onClick={() => incrementQty(item.product._id, item.quantity)}
                      aria-label="Increase quantity"
                    >
                      <FaPlus size={16} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end gap-4">
                    <p className="font-bold text-xl text-primary">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    <button
                      onClick={() => removeItem(item.product._id)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200 p-2 rounded-full hover:bg-red-100"
                      aria-label={`Remove ${item.product.name}`}
                    >
                      <FaTrash size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 bg-primary/5 p-8 rounded-xl shadow-lg border border-accent/20 mt-8 lg:mt-0 h-fit sticky top-24">
            <h3 className="text-2xl font-semibold text-primary mb-6 border-b border-accent/20 pb-4">Order Summary</h3>
            
            <div className="space-y-3 text-lg text-accent/90">
              <div className="flex justify-between items-center">
                <span>Subtotal:</span>
                <span className="font-medium">{formatPrice(cart.subtotal)}</span>
              </div>

              {cart.discount > 0 && (
                <div className="flex justify-between items-center text-green-600">
                  <span>Discount ({cart.appliedCoupon?.code}):</span>
                  <span className="font-medium">-{formatPrice(cart.discount)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-xl font-bold text-primary border-t border-accent/20 pt-4 mt-4">
              <span>Total:</span>
              <span>{formatPrice(cart.total)}</span>
            </div>

            {/* Coupon Input */}
            <div className="mt-6 border-t border-accent/20 pt-6">
              <h4 className="text-lg font-semibold text-accent mb-3">Apply Coupon</h4>
              {cart.appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-100 border border-green-200 text-green-800 p-3 rounded-lg">
                  <span>Coupon Applied: <strong>{cart.appliedCoupon.code}</strong></span>
                  <button onClick={handleRemoveCoupon} className="text-sm text-green-700 hover:text-green-900 font-medium">Remove</button>
                </div>
              ) : (
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-primary text-white font-semibold px-6 py-2 rounded-r-full hover:bg-accent transition-colors duration-300"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            <p className="text-accent/80 text-sm text-center my-6">Shipping calculated at checkout.</p>
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-accent transition-all duration-300 text-lg shadow-lg transform hover:scale-105"
            >
              Proceed to Checkout
            </button>
            <Link to="/shop" className="block text-center text-primary hover:text-accent mt-4 font-medium transition-colors duration-200">
                Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;