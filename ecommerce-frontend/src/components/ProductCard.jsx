// src/components/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";

function ProductCard({ product }) {
  // Function to format price (e.g., $20.00)
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2, // Ensure cents are always shown for consistency
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    // The card itself should be w-full to take up the entire grid column
    <div className="
  group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden
  border border-accent transform hover:-translate-y-1
      w-full {/* THIS IS CRUCIAL: Ensures the card takes the full width of its grid column */}
    ">
     
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-w-4 aspect-h-3"> {/* Common aspect ratio for product images */}
        <img
          src={product.image}
          alt={product.name}
          // The image now fills its aspect-ratio constrained parent
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        {/* Quick actions on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className="p-2 m-1 bg-white rounded-full text-accent hover:bg-accent/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Add to Wishlist"
            onClick={(e) => { e.preventDefault(); console.log('Added to wishlist:', product.name); }}
          >
            <Heart size={20} />
          </button>
          <button
            className="p-2 m-1 bg-white rounded-full text-accent hover:bg-accent/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Add to Cart"
            onClick={(e) => { e.preventDefault(); console.log('Added to cart:', product.name); }}
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-4 flex flex-col items-start"> {/* Added flex-col and items-start for consistent alignment */}
  <h3 className="text-lg font-semibold text-accent mb-1 truncate w-full"> {/* w-full for truncate to work consistently */}
          <Link to={`/product/${product.id}`} className="hover:text-blue-600 transition-colors duration-200">
            {product.name}
          </Link>
        </h3>
  <p className="text-primary text-xl font-bold">{formatPrice(product.price)}</p>
      </div>
    </div>
  );
}

export default ProductCard;