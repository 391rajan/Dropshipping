// src/components/ProductCard.jsx
import React, { useState } from "react"
import { Link } from "react-router-dom";
import { ShoppingCart, Heart, LayoutGrid } from "lucide-react";
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInCompareList } = useCompare();
  const [loading, setLoading] = useState(false);

  // Function to format price (e.g., $20.00)
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

// ecommerce-frontend/src/components/ProductCard.jsx

const getProductImage = () => {
  if (product.images && product.images.length > 0) {
    const imageUrl = `http://localhost:5000/${product.images[0]}`;
    return imageUrl;
  }
  return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop';
};
  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-accent transform hover:-translate-y-1 w-full">
      <Link to={`/product/${product._id}`} className="block relative overflow-hidden aspect-[4/3]">
        <img
          src={getProductImage()}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        {product.outOfStock && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className={`p-2 m-1 bg-white rounded-full text-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary ${
              isInWishlist(product._id) ? 'text-red-500 hover:text-red-600' : 'hover:bg-accent/20'
            }`}
            aria-label={isInWishlist(product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
            onClick={async (e) => { 
              e.preventDefault();
              setLoading(true);
              try {
                await addToWishlist(product._id);
              } catch (error) {
                console.error('Error updating wishlist:', error);
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
          >
            <Heart size={20} fill={isInWishlist(product._id) ? 'currentColor' : 'none'} />
          </button>
          <button
            className={`p-2 m-1 bg-white rounded-full text-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary ${
              isInCompareList(product._id) ? 'text-blue-500 hover:text-blue-600' : 'hover:bg-accent/20'
            }`}
            aria-label={isInCompareList(product._id) ? 'Remove from Compare' : 'Add to Compare'}
            onClick={async (e) => {
              e.preventDefault();
              setLoading(true);
              try {
                await addToCompare(product._id);
              } catch (error) {
                console.error('Error updating compare list:', error);
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
          >
            <LayoutGrid size={20} fill={isInCompareList(product._id) ? 'currentColor' : 'none'} />
          </button>
          <button
            className="p-2 m-1 bg-white rounded-full text-accent hover:bg-accent/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Add to Cart"
            onClick={async (e) => {
              e.preventDefault();
              setLoading(true);
              try {
                await addToCart(product, 1);
              } catch (error) {
                console.error('Error adding to cart:', error);
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading || product.outOfStock}
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-4 flex flex-col items-start">
        <h3 className="text-lg font-semibold text-accent mb-1 truncate w-full">
          <Link to={`/product/${product._id}`} className="hover:text-blue-600 transition-colors duration-200">
            {product.name}
          </Link>
        </h3>
        <p className="text-primary text-xl font-bold">{formatPrice(product.price)}</p>
      </div>
    </div>
  );
}

export default ProductCard;