import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const handleMoveToCart = async (product) => {
    try {
      await addToCart(product);
      await removeFromWishlist(product._id);
      // Could add toast notification here
    } catch (error) {
      console.error('Error moving item to cart:', error);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    if (window.confirm('Are you sure you want to remove this item from your wishlist?')) {
      try {
        await removeFromWishlist(productId);
        // Could add toast notification here
      } catch (error) {
        console.error('Error removing from wishlist:', error);
      }
    }
  };

  return (
    <main className="bg-background min-h-screen py-10">
      <div className="container mx-auto px-4 md:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-8 text-center">Your Wishlist</h1>
        
        {wishlist.length === 0 ? (
          <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
            <p className="text-xl text-gray-600 mb-6">Your wishlist is empty!</p>
            <Link
              to="/shop"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <Link to={`/product/${product._id}`} className="block">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                </Link>
                <div className="p-4">
                  <Link to={`/product/${product._id}`} className="block">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-gray-600 mb-2">{product.description}</p>
                  <p className="text-xl font-bold text-gray-900 mb-4">
                    {formatPrice(product.price)}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMoveToCart(product)}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Move to Cart
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(product._id)}
                      className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Wishlist;
