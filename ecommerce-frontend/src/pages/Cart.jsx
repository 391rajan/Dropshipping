import React from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from '../context/CartContext'; // To link back to shop

function Cart() {
  const navigate = useNavigate();
  const { 
    cart, 
    updateQuantity, 
    removeFromCart,
    getCartTotal 
  } = useCart();

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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 bg-gray-50 min-h-[calc(100vh-16rem)]">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-8 text-center">Your Shopping Cart</h1>

      {cart.items.length === 0 ? (
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
          <p className="text-xl text-gray-600 mb-6">Your cart is currently empty. Start shopping now!</p>
          <Link
            to="/shop"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Go to Shop
          </Link>
        </div>
      ) : (
        <div className="lg:grid lg:grid-cols-3 lg:gap-8"> {/* Layout for larger screens */}
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6"> {/* More space between items */}
            {cart.items.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 sm:gap-6 border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm bg-white hover:shadow-md transition-shadow duration-200"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border border-gray-200" // Larger image, rounded corners
                />
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-2 sm:gap-y-0 items-center">
                  <div className="sm:col-span-1">
                    <Link to={`/product/${item._id}`} className="font-semibold text-lg text-gray-800 hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                      {item.name}
                    </Link>
                    <p className="text-gray-700 text-lg font-bold mt-1">{formatPrice(item.price)}</p>
                  </div>

                  <div className="flex items-center justify-start sm:justify-center gap-3 sm:col-span-1"> {/* Quantity controls */}
                    <button
                      className="p-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => decrementQty(item._id, item.quantity)}
                      disabled={item.quantity <= 1} // Disable if quantity is 1
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} /> {/* Minus icon */}
                    </button>
                    <span className="font-medium text-lg w-8 text-center">{item.quantity}</span>
                    <button
                      className="p-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={() => incrementQty(item._id, item.quantity)}
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} /> {/* Plus icon */}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between h-full py-1">
                  <p className="font-bold text-xl text-gray-900 mb-2">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  <button
                    onClick={() => removeItem(item._id, item.name)} // Pass product name for confirmation
                    className="text-red-500 hover:text-red-700 transition-colors duration-200 p-2 rounded-full hover:bg-red-50"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 size={20} /> {/* Larger trash icon */}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary / Subtotal */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-lg border border-gray-200 mt-8 lg:mt-0 h-fit sticky top-24"> {/* Sticky for larger screens */}
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">Order Summary</h3>
            <div className="flex justify-between items-center text-xl font-medium text-gray-800 mb-4">
              <span>Subtotal:</span>
              <span>{formatPrice(getCartTotal())}</span>
            </div>
            <p className="text-gray-600 text-sm mb-6">Shipping calculated at checkout.</p>
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 text-lg shadow-md"
            >
              Proceed to Checkout
            </button>
            <Link to="/shop" className="block text-center text-blue-600 hover:text-blue-800 mt-4 text-sm transition-colors duration-200">
                Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;