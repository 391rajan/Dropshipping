import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import { FaSearch } from 'react-icons/fa';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'relevance'
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getAll();
        setCategories(response);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await productAPI.searchProducts(query, filters);
        setProducts(response);
      } catch (error) {
        setError('Failed to fetch search results');
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, filters]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
        <p className="mt-4 text-lg text-accent">Searching for products...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 bg-primary/10 p-8 rounded-xl text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">
          Search Results
        </h1>
        <p className="text-accent/90 text-lg">Showing results for: <span className="font-semibold">"{query}"</span></p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <aside className="lg:col-span-1 space-y-8 h-fit sticky top-24">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-accent/20">
            <h2 className="text-xl font-semibold text-accent mb-4">Filters</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-accent/80 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-accent/80 mb-2">Price Range</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-1/2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-1/2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-accent/80 mb-2">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
              >
                <option value="relevance">Relevance</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </aside>

        <main className="lg:col-span-3">
          <div className="mb-6 bg-white p-4 rounded-xl shadow-md border border-accent/20">
            <p className="font-semibold text-accent">{products.length} Product{products.length !== 1 ? 's' : ''} Found</p>
          </div>

          {error ? (
            <div className="text-center text-red-500 bg-red-100 p-8 rounded-xl shadow-lg border border-red-200">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-md border border-accent/20">
              <FaSearch className="text-6xl text-accent/30 mx-auto mb-6" />
              <p className="text-xl text-accent/90 mb-4">No products found for "{query}".</p>
              <p className="text-accent/80 mb-6">Try a different search term or browse our categories.</p>
              <Link to="/shop" className="inline-block bg-primary hover:bg-accent text-white font-semibold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
                Browse All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchResults;