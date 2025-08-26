import React, { useEffect, useState, useCallback } from "react";
import { Filter, X } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { productAPI, categoryAPI } from "../services/api";

// A simple debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function ShopAll() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const initialFilters = {
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest',
    inStock: false
  };

  const [filters, setFilters] = useState(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const debouncedFilters = useDebounce(filters, 500); // 500ms debounce delay

  const fetchProducts = useCallback(async (filterValues) => {
    setLoading(true);
    try {
      // Create a clean filter object without empty values
      const cleanFilters = Object.entries(filterValues).reduce((acc, [key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {});

      const productsData = await productAPI.getAll(cleanFilters);
      setProducts(productsData);
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
        const categoriesData = await categoryAPI.getAll();
        setCategories(categoriesData);
    } catch (err) {
        setError(err.message || 'Failed to fetch categories');
    }
  }, []);


  // Initial fetch and on filter change
  useEffect(() => {
    fetchProducts(debouncedFilters);
  }, [debouncedFilters, fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleFilterChange = (key, value) => {
    // Validate price inputs
    if ((key === 'minPrice' || key === 'maxPrice') && value !== '') {
      const numValue = Number(value);
      if (numValue < 0) return; // Don't allow negative prices
    }
    
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setError(null);
  };

  return (
    <main className="bg-background min-h-screen py-10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary">All Products</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter size={20} />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <X size={16} />
                  Clear all
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full border rounded-md p-2"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-1/2 border rounded-md p-2"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-1/2 border rounded-md p-2"
                  />
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full border rounded-md p-2"
                >
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="name_desc">Name: Z to A</option>
                </select>
              </div>

              {/* In Stock Only */}
              <div className="mb-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">In Stock Only</span>
                </label>
              </div>

              {/* Error message */}
              {error && (
                <div className="mb-4 text-red-500 text-sm">
                  {error}
                </div>
              )}

              {/* Active Filters Summary */}
              {Object.entries(filters).some(([key, value]) => 
                value !== initialFilters[key]
              ) && (
                <div className="text-sm text-gray-500">
                  {filters.category && categories.find(c => c._id === filters.category) && (
                    <div className="mb-1">Category: {categories.find(c => c._id === filters.category).name}</div>
                  )}
                  {(filters.minPrice || filters.maxPrice) && (
                    <div className="mb-1">
                      Price: {filters.minPrice ? `${filters.minPrice}` : '$0'} - 
                      {filters.maxPrice ? ` ${filters.maxPrice}` : ' Any'}
                    </div>
                  )}
                  {filters.inStock && (
                    <div className="mb-1">In Stock Only</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-10">{error}</div>
            ) : products.length === 0 ? (
              <div className="text-center text-gray-500 py-10">No products found matching your criteria.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default ShopAll;
