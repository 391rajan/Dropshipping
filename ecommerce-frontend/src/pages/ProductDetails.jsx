import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FaShoppingCart, FaHeart, FaShareAlt, FaChevronRight, FaChevronLeft, 
  FaTruck, FaSyncAlt, FaShieldAlt, FaStar, FaStarHalfAlt, FaRegStar 
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { productAPI, stockNotificationAPI } from '../services/api';
import ProductReviews from '../components/ProductReviews';
import ProductQuestions from '../components/ProductQuestions';
import RecentlyViewed from '../components/RecentlyViewed';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [notificationEmail, setNotificationEmail] = useState('');
  const [activeTab, setActiveTab] = useState('reviews');

  const handleRequestStockNotification = async (e) => {
    e.preventDefault();
    try {
      await stockNotificationAPI.create({ productId: id, email: notificationEmail });
      alert('You will be notified when the product is back in stock.');
    } catch (error) {
      console.error('Error requesting stock notification:', error);
      alert(error.response.data.message);
    }
  };
  
  const getImageUrl = (imagePath) => {
    if (imagePath) {
      if (imagePath.startsWith('http')) {
        return imagePath;
      } else if (imagePath.startsWith('uploads/')) {
        return `http://localhost:5000/${imagePath}`;
      } else if (imagePath.startsWith('custom-images/')) {
        return `http://localhost:5000/${imagePath}`;
      } else {
        return `http://localhost:5000/uploads/${imagePath}`;
      }
    }
    return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop';
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await productAPI.getById(id);
        
        if (productData.images) {
          productData.images = productData.images.map(img => getImageUrl(img));
        }
        
        setProduct(productData);
        setError(null);

        try {
          await productAPI.addToRecentlyViewed(id);
        } catch (recentError) {
          console.log('Could not add to recently viewed:', recentError.message);
        }

      } catch (error) {
        setError('Failed to fetch product details');
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product, quantity);
      navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await addToWishlist(id);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const renderRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
        <p className="mt-4 text-lg text-accent">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 p-8 rounded-xl shadow-lg border border-red-200">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h2>
          <p className="text-red-700">{error || 'The product you are looking for does not exist.'}</p>
          <Link to="/shop" className="inline-block mt-6 bg-primary hover:bg-accent text-white font-semibold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full bg-white rounded-xl shadow-lg border border-accent/20 overflow-hidden">
              <img
                src={product.images?.[selectedImage] || getImageUrl(product.image)}
                alt={product.name}
                className="w-full h-full object-contain"
              />
              {product.images?.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev > 0 ? prev - 1 : product.images.length - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-3 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors"
                    aria-label="Previous image"
                  >
                    <FaChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev < product.images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors"
                    aria-label="Next image"
                  >
                    <FaChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {product.images?.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index ? 'border-primary ring-2 ring-primary/50' : 'border-transparent hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Link to={`/category/${product.category?.slug}`} className="text-sm font-medium text-primary hover:text-accent transition-colors">
                {product.category?.name}
              </Link>
              <h1 className="text-4xl font-bold text-accent mt-1">{product.name}</h1>
              {product.brand && <p className="text-md text-accent/70">Brand: {product.brand}</p>}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">{renderRating(product.averageRating)}</div>
              <span className="text-accent/80">({product.reviewCount || 0} reviews)</span>
            </div>

            <div className="flex items-end gap-3">
              <p className="text-4xl font-bold text-primary">${product.price?.toFixed(2)}</p>
              {product.originalPrice && (
                <p className="text-xl text-gray-400 line-through mb-1">
                  ${product.originalPrice.toFixed(2)}
                </p>
              )}
            </div>

            <div className={`text-md font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </div>

            <div className="prose max-w-none text-accent/80">
              <p>{product.description}</p>
            </div>

            <div className="space-y-6 pt-6 border-t border-accent/20">
              {product.stock > 0 && (
                <div className="flex items-center gap-4">
                  <label className="font-medium text-accent">Quantity:</label>
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="px-4 py-2 hover:bg-gray-100 rounded-l-lg transition-colors"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (val >= 1 && val <= product.stock) setQuantity(val);
                      }}
                      className="w-16 text-center border-x focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                      className="px-4 py-2 hover:bg-gray-100 rounded-r-lg transition-colors"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full flex items-center justify-center gap-3 bg-primary text-white font-semibold py-3 px-6 rounded-full hover:bg-accent disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg transform hover:scale-105"
                >
                  <FaShoppingCart size={20} />
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
                
                {product.stock === 0 && (
                  <form onSubmit={handleRequestStockNotification} className="flex gap-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={notificationEmail}
                      onChange={(e) => setNotificationEmail(e.target.value)}
                      required
                      className="flex-grow px-4 py-3 border-gray-300 rounded-full focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                    />
                    <button
                      type="submit"
                      className="flex items-center justify-center gap-2 bg-accent text-white font-semibold py-3 px-6 rounded-full hover:bg-primary transition-colors shadow-md"
                    >
                      Notify Me
                    </button>
                  </form>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToWishlist}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <FaHeart size={20} />
                    Add to Wishlist
                  </button>
                  <button
                    onClick={() => {
                      navigator.share({ title: product.name, text: product.description, url: window.location.href })
                        .catch(() => { navigator.clipboard.writeText(window.location.href); alert('Link copied!'); });
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <FaShareAlt size={20} />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 col-span-full">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('reviews')}
                className={`${activeTab === 'reviews' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg`}
              >
                Reviews
              </button>
              <button
                onClick={() => setActiveTab('questions')}
                className={`${activeTab === 'questions' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg`}
              >
                Questions
              </button>
            </nav>
          </div>
          <div className="py-8">
            {activeTab === 'reviews' && <ProductReviews productId={id} />}
            {activeTab === 'questions' && <ProductQuestions productId={id} />}
          </div>
        </div>

        <div className="mt-12 col-span-full">
          <RecentlyViewed />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;