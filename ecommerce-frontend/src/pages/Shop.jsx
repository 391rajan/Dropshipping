import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import { FaChevronDown, FaFilter } from 'react-icons/fa';

const Shop = () => {
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
    const fetchCategories = async () => {
      try {
        const categoriesData = await categoryAPI.getAll();
        setCategories(categoriesData);
      } catch (err) {
        setError('Failed to load categories.');
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const apiFilters = {
          search: filters.search || undefined,
          category: filters.category === 'all' ? undefined : filters.category,
          sortBy: filters.sort === 'newest' ? undefined : filters.sort,
        };

        if (filters.price !== 'all') {
          const [min, max] = filters.price.split('-').map(Number);
          apiFilters.minPrice = min;
          if (max) {
            apiFilters.maxPrice = max;
          }
        }

        const productsData = await productAPI.getAll(apiFilters);
        setFilteredProducts(productsData);
        setError(null);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    const params = new URLSearchParams();
    if (filters.category !== 'all') params.set('category', filters.category);
    if (filters.price !== 'all') params.set('price', filters.price);
    if (filters.sort !== 'newest') params.set('sort', filters.sort);
    if (filters.search) params.set('search', filters.search);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });

  }, [filters, navigate, location.pathname]);

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
    <aside className="w-full md:w-64 lg:w-72 space-y-8 bg-white p-6 rounded-xl shadow-lg border border-accent/20 h-fit sticky top-24">
      <div>
        <h3 className="font-semibold mb-3 text-xl text-accent">Search Products</h3>
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          placeholder="Search by name..."
          className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
        />
      </div>

      <div>
        <h3 className="font-semibold mb-3 text-xl text-accent">Categories</h3>
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="font-semibold mb-3 text-xl text-accent">Price Range</h3>
        <select
          name="price"
          value={filters.price}
          onChange={handleFilterChange}
          className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
        >
          {priceRanges.map(range => (
            <option key={range.value} value={range.value}>{range.label}</option>
          ))}
        </select>
      </div>

      <button
        onClick={clearFilters}
        className="w-full py-3 px-4 bg-gray-200 text-accent font-semibold rounded-lg hover:bg-gray-300 transition-colors"
      >
        Clear All Filters
      </button>
    </aside>
  );

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
        <p className="mt-4 text-lg text-accent">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-10 bg-red-100 p-8 rounded-xl shadow-lg border border-red-200">{error}</div>;
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-primary">Shop All Products</h1>
        <p className="mt-3 text-lg text-accent/90">Find the perfect item from our extensive collection.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        <div className="md:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-white rounded-lg hover:bg-accent shadow-md"
          >
            <FaFilter size={20} />
            <span>{sidebarOpen ? 'Hide' : 'Show'} Filters</span>
            <FaChevronDown size={20} className={`transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className={`md:block ${sidebarOpen ? 'block' : 'hidden'}`}>
          <FilterSidebar />
        </div>

        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-accent/20">
            <p className="text-accent/90 mb-2 sm:mb-0">Showing <span className="font-semibold text-primary">{filteredProducts.length}</span> products</p>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-accent/90">Sort by:</label>
              <select
                id="sort"
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                className="px-3 py-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-md border border-accent/20">
              <p className="text-xl text-accent/90 mb-4">No products found matching your criteria.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;