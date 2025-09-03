import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import { Tag, ArrowRight } from 'lucide-react';

function Deals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to handle image paths, adapted from ProductDetails
  const getImageUrl = (imagePath) => {
    if (imagePath) {
      if (imagePath.startsWith('http')) {
        return imagePath;
      } else if (imagePath.startsWith('uploads/')) {
        return `http://localhost:5000/${imagePath}`;
      } else if (imagePath.startsWith('custom-images/')) {
        return `http://localhost:5000/${imagePath}`;
      } else {
        return `http://localhost:5000/uploads/${imagePath}`;
      }
    }
    // Fallback image if none is provided
    return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop';
  };

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        // In a real app, you'd have a dedicated API endpoint for deals.
        // Here, we'll fetch all products and simulate deals.
        const allProducts = await productAPI.getAll({ limit: 8 }); // Fetch a limited number of products
        
        // Simulate discounted prices for demonstration
        const dealsWithDiscounts = allProducts.map(product => ({
          ...product,
          originalPrice: product.price * 1.25, // Simulate a 20% discount
          discount: 20,
        }));

        setDeals(dealsWithDiscounts);
        setError(null);
      } catch (err) {
        setError('Failed to load deals. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (error) {
      return <div className="text-center text-red-500 py-20">{error}</div>;
    }

    if (deals.length === 0) {
      return <div className="text-center text-gray-600 py-20">No special offers available at the moment. Check back soon!</div>;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {deals.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden group transform hover:-translate-y-1 transition-all duration-300">
            <Link to={`/product/${product._id}`} className="block">
              <div className="relative">
                <img
                  src={getImageUrl(product.images?.[0])}
                  alt={product.name}
                  className="w-full h-56 object-cover"
                />
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {product.discount}% OFF
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-accent truncate group-hover:text-primary">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2 truncate">{product.category?.name || 'Uncategorized'}</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</p>
                </div>
              </div>
            </Link>
            <div className="px-4 pb-4">
              <Link
                to={`/product/${product._id}`}
                className="w-full flex items-center justify-center bg-primary/10 text-primary font-semibold py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors duration-300"
              >
                View Deal <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Deals & Offers</h1>
          <p className="text-accent/90 text-lg max-w-2xl mx-auto">
            Check out our latest discounts and special offers! Unbeatable prices on your favorite products for a limited time.
          </p>
        </div>

        {/* Promotional Banner */}
        <div className="bg-primary text-white rounded-lg p-8 mb-12 flex flex-col md:flex-row items-center justify-between shadow-lg">
          <div>
            <h2 className="text-3xl font-bold mb-2">Flash Sale Friday!</h2>
            <p className="text-lg opacity-90">Get up to 40% off on select electronics. This weekend only!</p>
          </div>
          <Link
            to="/shop/electronics"
            className="mt-4 md:mt-0 bg-white text-primary font-bold py-2 px-6 rounded-full hover:bg-gray-200 transition-colors"
          >
            Shop Now
          </Link>
        </div>

        {renderContent()}
      </div>
    </main>
  );
}

export default Deals;