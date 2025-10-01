import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaFilter, FaTimes } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import { productAPI, categoryAPI } from '../services/api';

const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        // Fetch category details and tree structure
        const categoryData = await categoryAPI.getBySlug(slug);
        const [treeData, productsData] = await Promise.all([
          categoryAPI.getTree(),
          productAPI.getByCategory(categoryData._id, {
            sortBy,
            minPrice: priceRange.min,
            maxPrice: priceRange.max
          })
        ]);

        setCategory(categoryData);
        const currentCategory = treeData.find(cat => cat._id === categoryData._id);
        setSubCategories(currentCategory?.children || []);
        console.log('Products data received:', productsData);
        setProducts(productsData.products || []);
      } catch (error) {
        setError('Failed to fetch category data');
        console.error('Error fetching category data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [slug, sortBy, priceRange.min, priceRange.max]);

  const handleSortChange = (value) => {
    setSortBy(value);
    let sortedProducts = [...products];
    
    switch (value) {
      case 'price_asc':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Default sorting (newest first or featured)
        sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    setProducts(sortedProducts);
  };

  const handlePriceFilter = () => {
    // Validate price range inputs
    const min = Number(priceRange.min);
    const max = Number(priceRange.max);
    
    if (min < 0 || max < 0) {
      setError('Price cannot be negative');
      return;
    }
    
    if (max && min > max) {
      setError('Minimum price cannot be greater than maximum price');
      return;
    }

    setError(null);
    // The useEffect will automatically trigger with the updated price range
    setPriceRange(prev => ({ ...prev })); // Force a re-render
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
        <p className="mt-4 text-lg text-accent">Loading products...</p>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-red-500 bg-red-100 p-8 rounded-xl shadow-lg border border-red-200">
          <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong.</h2>
          <p>{error || 'Category not found'}</p>
          <Link to="/shop" className="inline-block mt-6 bg-primary hover:bg-accent text-white font-semibold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Category Header */}
      <div className="bg-primary/10 rounded-xl p-8 mb-12 text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-accent/90 max-w-2xl mx-auto">{category.description}</p>
        )}
        
        {/* Breadcrumb Navigation */}
        <nav className="text-sm mt-4">
          <ol className="flex justify-center space-x-2 text-accent/80">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link to="/shop" className="hover:text-primary">Shop</Link></li>
            <li>/</li>
            <li className="font-semibold text-accent">{category.name}</li>
          </ol>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-8 h-fit sticky top-24">
          {/* Sub-categories */}
          {subCategories.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-accent/20">
              <h2 className="text-xl font-semibold text-accent mb-4">Sub-Categories</h2>
              <ul className="space-y-2">
                {subCategories.map(subCat => (
                  <li key={subCat._id}>
                    <Link
                      to={`/category/${subCat.slug}`}
                      className="block text-accent/90 hover:text-primary hover:bg-primary/10 px-3 py-2 rounded-md transition-colors"
                    >
                      {subCat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Price Filter */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-accent/20">
            <h2 className="text-xl font-semibold text-accent mb-4">Price Range</h2>
            <div className="space-y-4">
              <input
                type="number"
                placeholder="Min Price"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                className="w-full border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                min="0"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                className="w-full border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                min="0"
              />
              <div className="flex gap-2">
                <button
                  onClick={handlePriceFilter}
                  className="flex-1 bg-primary text-white font-semibold py-2 px-4 rounded-full hover:bg-accent transition-all duration-300 shadow-md transform hover:scale-105"
                >
                  Apply
                </button>
                <button
                  onClick={() => { setPriceRange({ min: '', max: '' }); setError(null); }}
                  className="px-4 bg-gray-200 text-accent font-semibold py-2 rounded-full hover:bg-gray-300 transition-colors"
                >
                  Clear
                </button>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
          </div>
        </aside>

        {/* Products Section */}
        <main className="lg:col-span-3">
          {/* Sort Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-md border border-accent/20">
            <div>
              <p className="font-semibold text-accent">
                {products.length} Product{products.length !== 1 ? 's' : ''} Found
              </p>
              {(priceRange.min || priceRange.max) && (
                <div className="flex items-center gap-2 text-sm mt-1">
                  <span className="text-accent/80">Price:</span>
                  <span className="bg-primary/10 text-primary font-medium px-2 py-1 rounded-full">
                    {priceRange.min ? `${priceRange.min}` : '$0'} - {priceRange.max ? `${priceRange.max}` : 'Any'}
                  </span>
                  <button
                    onClick={() => setPriceRange({ min: '', max: '' })}
                    className="text-gray-500 hover:text-red-500 p-1 rounded-full hover:bg-red-100 transition-colors"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
              )}
            </div>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary/50 focus:border-primary transition min-w-[220px]"
            >
              <option value="default">Sort by: Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
            </select>
          </div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-md border border-accent/20">
              <p className="text-xl text-accent/90 mb-4">No products found matching your criteria.</p>
              <Link to="/shop" className="text-primary font-semibold hover:text-accent transition-colors">
                Browse all products
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

export default CategoryPage;