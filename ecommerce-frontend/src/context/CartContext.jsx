import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], subtotal: 0, discount: 0, total: 0, appliedCoupon: null });
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  // Fetch cart on initial load
  useEffect(() => {
    fetchCart();
  }, [token]);

  const fetchCart = async () => {
    if (!token) {
      setCart({ items: [], subtotal: 0, discount: 0, total: 0, appliedCoupon: null });
      setLoading(false);
      return; // No token, no cart to fetch
    }
    try {
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart({ items: [], subtotal: 0, discount: 0, total: 0, appliedCoupon: null }); // Reset cart on error
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (!token) {
      alert('Please log in to add items to your cart.');
      return false;
    }
    try {
      const response = await axios.post(`http://localhost:5000/api/cart`,
        { productId: product._id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(response.data);
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error.response?.data?.message || 'Failed to add item to cart.');
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    if (!token) return false;
    try {
      const response = await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(response.data);
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert(error.response?.data?.message || 'Failed to remove item from cart.');
      return false;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!token) return false;
    try {
      const response = await axios.put(`http://localhost:5000/api/cart/${productId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(response.data);
      return true;
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert(error.response?.data?.message || 'Failed to update item quantity.');
      return false;
    }
  };

  const clearCart = async () => {
    if (!token) return false;
    try {
      const response = await axios.delete('http://localhost:5000/api/cart/clear', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(response.data);
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert(error.response?.data?.message || 'Failed to clear cart.');
      return false;
    }
  };

  const applyCoupon = async (couponCode) => {
    if (!token) {
      alert('Please log in to apply coupons.');
      return false;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/cart/apply-coupon', 
        { couponCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(response.data.cart);
      alert(response.data.message);
      return true;
    } catch (error) {
      console.error('Error applying coupon:', error);
      alert(error.response?.data?.message || 'Failed to apply coupon.');
      return false;
    }
  };

  const removeCoupon = async () => {
    if (!token) return false;
    try {
      const response = await axios.delete('http://localhost:5000/api/cart/remove-coupon', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(response.data.cart);
      alert(response.data.message);
      return true;
    } catch (error) {
      console.error('Error removing coupon:', error);
      alert(error.response?.data?.message || 'Failed to remove coupon.');
      return false;
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      fetchCart, // Expose fetchCart for manual refresh if needed
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      applyCoupon,
      removeCoupon,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
