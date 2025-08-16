import React, { useState, useEffect } from 'react';
import { ChevronDown, Grid, List } from 'lucide-react';
import ProductCard from './ProductCard';
import ProductFilter from './ProductFilter';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [stockFilter, setStockFilter] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/categories');
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products with filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = 'http://localhost:5000/api/products?';
        
        // Add filters to URL
        if (selectedCategory) url += `category=${selectedCategory}&`;
        if (priceRange.min) url += `minPrice=${priceRange.min}&`;
        if (priceRange.max) url += `maxPrice=${priceRange.max}&`;
        if (selectedBrands.length) url += `brands=${selectedBrands.join(',')}&`;
        if (stockFilter) url += `inStock=${stockFilter === 'in-stock'}&`;
        
        // Add sorting
        switch (sortBy) {
          case 'price-low':
            url += 'sort=price';
            break;
          case 'price-high':
            url += 'sort=-price';
            break;
          case 'popular':
            url += 'sort=-rating';
            break;
          default:
            url += 'sort=-createdAt';
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, priceRange, selectedBrands, stockFilter, sortBy]);

  const clearFilters = () => {
    setSelectedCategory(null);
    setPriceRange({ min: '', max: '' });
    setSelectedBrands([]);
    setStockFilter('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters */}
        <div className="lg:w-64">
          <ProductFilter
            categories={categories}
            selectedCategory={selectedCategory}
            priceRange={priceRange}
            selectedBrands={selectedBrands}
            stockFilter={stockFilter}
            onCategoryChange={setSelectedCategory}
            onPriceRangeChange={setPriceRange}
            onBrandChange={setSelectedBrands}
            onStockFilterChange={setStockFilter}
            onClearFilters={clearFilters}
            isOpen={filterOpen}
            onToggle={() => setFilterOpen(!filterOpen)}
          />
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid'
                    ? 'bg-primary text-white'
                    : 'text-accent hover:bg-accent/10'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list'
                    ? 'bg-primary text-white'
                    : 'text-accent hover:bg-accent/10'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-accent/20 text-accent py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          {/* Error State */}
          {error && (
            <div className="text-red-500 text-center py-8">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : (
            <>
              {/* Empty State */}
              {products.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-accent">No products found matching your criteria.</p>
                </div>
              ) : (
                /* Products Grid/List */
                <div className={`${
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-6'
                }`}>
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductList;
