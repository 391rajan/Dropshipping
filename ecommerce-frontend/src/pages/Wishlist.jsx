import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { FaHeartBroken, FaShoppingCart } from 'react-icons/fa';

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
    <main className="bg-background min-h-screen py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">Your Wishlist</h1>
          <p className="text-accent/90 text-lg max-w-2xl mx-auto">
            Your favorite items, all in one place.
          </p>
        </div>
        
        {wishlist.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-xl shadow-lg border border-accent/20 max-w-lg mx-auto">
            <FaHeartBroken className="text-6xl text-primary mx-auto mb-6" />
            <p className="text-xl text-accent/90 mb-6">Your wishlist is empty!</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-primary hover:bg-accent text-white font-semibold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <FaShoppingCart />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlist.map((product) => (
              <div key={product._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-accent/20 transform hover:-translate-y-1">
                <Link to={`/product/${product._id}`} className="block">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-accent mb-2 hover:text-primary transition-colors line-clamp-2">
                    <Link to={`/product/${product._id}`}>{product.name}</Link>
                  </h3>
                  <p className="text-xl font-bold text-primary mb-4 mt-auto">
                    {formatPrice(product.price)}
                  </p>
                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => handleMoveToCart(product)}
                      className="flex-1 bg-primary text-white font-semibold py-2 px-4 rounded-full hover:bg-accent transition-colors shadow-md"
                    >
                      Move to Cart
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(product._id)}
                      className="px-4 py-2 text-red-500 border border-red-500 rounded-full hover:bg-red-50 font-semibold transition-colors"
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
