
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import { ChevronDown, ListFilter } from 'lucide-react';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const [filters, setFilters] = useState({
    category: queryParams.get('category') || 'all',
    price: queryParams.get('price') || 'all',
    sort: queryParams.get('sort') || 'newest',
    search: queryParams.get('search') || '',
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          productAPI.getAll(),
          categoryAPI.getAll(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
        setError(null);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    let tempProducts = [...products];

    // Filter by search term
    if (filters.search) {
      tempProducts = tempProducts.filter(p =>
        p.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filter by category
    if (filters.category !== 'all') {
      tempProducts = tempProducts.filter(p => p.category?._id === filters.category);
    }

    // Filter by price
    if (filters.price !== 'all') {
      const [min, max] = filters.price.split('-').map(Number);
      tempProducts = tempProducts.filter(p => p.price >= min && (max ? p.price <= max : true));
    }

    // Sort products
    switch (filters.sort) {
      case 'price-asc':
        tempProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        tempProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        tempProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        tempProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
      default:
        tempProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredProducts(tempProducts);

    // Update URL
    const params = new URLSearchParams();
    if (filters.category !== 'all') params.set('category', filters.category);
    if (filters.price !== 'all') params.set('price', filters.price);
    if (filters.sort !== 'newest') params.set('sort', filters.sort);
    if (filters.search) params.set('search', filters.search);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });

  }, [filters, products, navigate, location.pathname]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      price: 'all',
      sort: 'newest',
      search: '',
    });
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return 'https://via.placeholder.com/300'; // Default placeholder
    }
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `http://localhost:5000/${imagePath.replace(/\\/g, '/')}`;
  };

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-50', label: '$0 - $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100-200', label: '$100 - $200' },
    { value: '200', label: 'Over $200' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
  ];

  const FilterSidebar = () => (
    <aside className="w-full md:w-64 lg:w-72 space-y-6">
      {/* Search Filter */}
      <div>
        <h3 className="font-semibold mb-2 text-lg">Search Products</h3>
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          placeholder="Search by name..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="font-semibold mb-2 text-lg">Categories</h3>
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Price Filter */}
      <div>
        <h3 className="font-semibold mb-2 text-lg">Price Range</h3>
        <select
          name="price"
          value={filters.price}
          onChange={handleFilterChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {priceRanges.map(range => (
            <option key={range.value} value={range.value}>{range.label}</option>
          ))}
        </select>
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={clearFilters}
        className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
      >
        Clear All Filters
      </button>
    </aside>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Shop All Products</h1>
        <p className="mt-2 text-lg text-gray-600">Find the perfect item from our collection.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Mobile Filter Button */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <ListFilter size={20} />
            <span>{sidebarOpen ? 'Hide' : 'Show'} Filters</span>
            <ChevronDown size={20} className={`transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Sidebar */}
        <div className={`md:block ${sidebarOpen ? 'block' : 'hidden'}`}>
          <FilterSidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1">
          {/* Sorting and Results Count */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b">
            <p className="text-gray-600 mb-2 sm:mb-0">
              Showing <span className="font-semibold">{filteredProducts.length}</span> of <span className="font-semibold">{products.length}</span> products
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-gray-600">Sort by:</label>
              <select
                id="sort"
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  imageUrl={getImageUrl(product.image)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
