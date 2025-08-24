import React, { useEffect, useState } from "react";
import { Filter, X } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { productAPI, categoryAPI } from "../services/api";

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
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [showFilters, setShowFilters] = useState(false);

  const fetchProducts = async (filterValues) => {
    setLoading(true);
    try {
      // Create a clean filter object without empty values
      const cleanFilters = Object.entries(filterValues).reduce((acc, [key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {});

      const [productsData, categoriesData] = await Promise.all([
        productAPI.getAll(cleanFilters),
        categoryAPI.getAll()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProducts(appliedFilters);
  }, [appliedFilters]);

  const handleFilterChange = (key, value) => {
    // Validate price inputs
    if ((key === 'minPrice' || key === 'maxPrice') && value !== '') {
      const numValue = Number(value);
      if (numValue < 0) return; // Don't allow negative prices
      if (key === 'minPrice' && filters.maxPrice && numValue > Number(filters.maxPrice)) return;
      if (key === 'maxPrice' && filters.minPrice && numValue < Number(filters.minPrice)) return;
    }
    
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    // Validate price range
    const min = Number(filters.minPrice);
    const max = Number(filters.maxPrice);
    
    if ((min && max) && min > max) {
      setError('Minimum price cannot be greater than maximum price');
      return;
    }
    
    setError(null);
    setAppliedFilters(filters);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
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

              {/* Apply Filters Button */}
              <button
                onClick={handleApplyFilters}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition-colors mb-3"
              >
                Apply Filters
              </button>

              {/* Active Filters Summary */}
              {Object.entries(appliedFilters).some(([key, value]) => 
                value !== initialFilters[key]
              ) && (
                <div className="text-sm text-gray-500">
                  {appliedFilters.category && categories.find(c => c._id === appliedFilters.category) && (
                    <div className="mb-1">Category: {categories.find(c => c._id === appliedFilters.category).name}</div>
                  )}
                  {(appliedFilters.minPrice || appliedFilters.maxPrice) && (
                    <div className="mb-1">
                      Price: {appliedFilters.minPrice ? `$${appliedFilters.minPrice}` : '$0'} - 
                      {appliedFilters.maxPrice ? ` $${appliedFilters.maxPrice}` : ' Any'}
                    </div>
                  )}
                  {appliedFilters.inStock && (
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
