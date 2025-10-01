import React, { useEffect, useState, useCallback } from "react";
import { FaFilter, FaTimes } from "react-icons/fa";
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
  }, [JSON.stringify(debouncedFilters), fetchProducts]);

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
    <main className="bg-background min-h-screen py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary">All Products</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors shadow-md"
          >
            <FaFilter size={20} />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Filters Sidebar */}
          <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-accent/20 h-fit sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-accent">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1 transition-colors"
                >
                  <FaTimes size={16} />
                  Clear all
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-accent/80 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-accent/80 mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-1/2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                    />
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
                    <option value="newest">Newest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="name_asc">Name: A to Z</option>
                    <option value="name_desc">Name: Z to A</option>
                    <option value="rating_desc">Rating: High to Low</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                      className="h-5 w-5 rounded text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-accent">In Stock Only</span>
                  </label>
                </div>
              </div>

              {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-10 bg-red-100 p-8 rounded-xl shadow-lg border border-red-200">{error}</div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-md border border-accent/20">
                <p className="text-xl text-accent/90 mb-4">No products found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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