import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productAPI, categoryAPI } from '../services/api';

const CategoryPage = () => {
  const { id } = useParams();
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
        const [categoryData, treeData, productsData] = await Promise.all([
          categoryAPI.getById(id),
          categoryAPI.getTree(),
          productAPI.getByCategory(id, {
            sortBy,
            minPrice: priceRange.min,
            maxPrice: priceRange.max
          })
        ]);

        setCategory(categoryData);
        const currentCategory = treeData.find(cat => cat._id === id);
        setSubCategories(currentCategory?.children || []);
        setProducts(productsData);
      } catch (error) {
        setError('Failed to fetch category data');
        console.error('Error fetching category data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [id, sortBy, priceRange.min, priceRange.max]);

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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-red-500">{error || 'Category not found'}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-gray-600 mb-4">{category.description}</p>
        )}
        
        {/* Breadcrumb Navigation */}
        <nav className="text-sm mb-6">
          <ol className="flex space-x-2">
            <li>
              <Link to="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li>
              <Link to="/shop" className="text-gray-500 hover:text-gray-700">
                Shop
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li className="text-gray-900">{category.name}</li>
          </ol>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          {/* Sub-categories */}
          {subCategories.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Sub Categories</h2>
              <ul className="space-y-2">
                {subCategories.map(subCat => (
                  <li key={subCat._id}>
                    <Link
                      to={`/category/${subCat._id}`}
                      className="text-gray-600 hover:text-blue-500"
                    >
                      {subCat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Price Filter */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Price Range</h2>
            <div className="space-y-3">
              <input
                type="number"
                placeholder="Min Price"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange(prev => ({ ...prev, min: e.target.value }))
                }
                className="w-full border rounded-md p-2"
                min="0"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange(prev => ({ ...prev, max: e.target.value }))
                }
                className="w-full border rounded-md p-2"
                min="0"
              />
              <div className="flex gap-2">
                <button
                  onClick={handlePriceFilter}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
                >
                  Apply Filter
                </button>
                <button
                  onClick={() => {
                    setPriceRange({ min: '', max: '' });
                    setError(null);
                  }}
                  className="px-4 bg-gray-100 hover:bg-gray-200 py-2 rounded-md"
                >
                  Clear
                </button>
              </div>
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="lg:col-span-3">
          {/* Sort Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <p className="text-gray-600 mb-2">
                {products.length} Products
              </p>
              {(priceRange.min || priceRange.max) && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Filtered by price:</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {priceRange.min ? `$${priceRange.min}` : '$0'} - {priceRange.max ? `$${priceRange.max}` : 'Any'}
                  </span>
                  <button
                    onClick={() => setPriceRange({ min: '', max: '' })}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="border rounded-md p-2 min-w-[200px]"
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
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No products found in this category</p>
              <Link to="/shop" className="text-blue-500 hover:text-blue-600">
                Browse all products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
