import React, { useEffect, useState } from 'react';
import { recentlyViewedAPI } from '../services/api';
import ProductCard from './ProductCard';

const RecentlyViewed = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      if (!localStorage.getItem('token')) {
        setLoading(false);
        return;
      }
      try {
        const data = await recentlyViewedAPI.get();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching recently viewed products:', err);
        setError('Failed to load recently viewed products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentlyViewed();
  }, []);

  if (loading) return (
    <div className="my-8">
      <h2 className="text-xl font-bold mb-4">Recently Viewed Products</h2>
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="my-8">
      <h2 className="text-xl font-bold mb-4">Recently Viewed Products</h2>
      <div className="text-red-500 text-center">{error}</div>
    </div>
  );

  if (!products.length) return null;

  return (
    <div className="my-8">
      <h2 className="text-xl font-bold mb-4">Recently Viewed Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
