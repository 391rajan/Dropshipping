import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Share2, ChevronRight, ChevronLeft, Truck, RefreshCw, Shield } from 'lucide-react';
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
        const [productData] = await Promise.all([
          productAPI.getById(id),
          productAPI.addToRecentlyViewed(id)
        ]);
        
        // Process images
        if (productData.images) {
          productData.images = productData.images.map(img => getImageUrl(img));
        }
        
        setProduct(productData);
        setError(null);
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
      // Could add toast notification here
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-red-500">{error || 'Product not found'}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image with Navigation Arrows */}
          <div className="relative aspect-w-1 aspect-h-1 w-full bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.images?.[selectedImage] || getImageUrl(product.image)}
              alt={product.name}
              className="w-full h-full object-contain"
            />
            {product.images?.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage((prev) => (prev > 0 ? prev - 1 : product.images.length - 1))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setSelectedImage((prev) => (prev < product.images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images?.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden border-2 
                    ${selectedImage === index ? 'border-blue-500' : 'border-transparent'}`}
                >
                  <img
                    src={image}
                    alt={`${product.name} - ${index + 1}`}
                    className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title and Category */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <Link to={`/category/${product.category?._id}`} className="hover:text-blue-600">
                {product.category?.name}
              </Link>
              {product.brand && (
                <>
                  <span>•</span>
                  <span>{product.brand}</span>
                </>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-blue-600">${product.price?.toFixed(2)}</p>
            {product.oldPrice && (
              <p className="text-lg text-gray-500 line-through mb-1">
                ${product.oldPrice.toFixed(2)}
              </p>
            )}
          </div>

          {/* Stock Status */}
          <div className={`text-sm font-medium ${!product.outOfStock ? 'text-green-600' : 'text-red-600'}`}>
            {!product.outOfStock ? (
              <>
                <span className="inline-block w-2 h-2 rounded-full bg-green-600 mr-2"></span>
                In Stock ({product.stock} available)
              </>
            ) : (
              <>
                <span className="inline-block w-2 h-2 rounded-full bg-red-600 mr-2"></span>
                Out of Stock
              </>
            )}
          </div>

          {/* Description */}
          <div className="prose max-w-none">
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4 pt-4 border-t">
            {!product.outOfStock && (
              <div className="flex items-center gap-4">
                <label className="font-medium">Quantity:</label>
                <div className="flex items-center border rounded-md">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="px-3 py-2 hover:bg-gray-100"
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
                      if (val >= 1 && val <= product.stock) {
                        setQuantity(val);
                      }
                    }}
                    className="w-16 text-center border-x"
                  />
                  <button
                    onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.outOfStock}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <ShoppingCart size={20} />
                {!product.outOfStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              
              {product.outOfStock && (
                <form onSubmit={handleRequestStockNotification} className="flex flex-col gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={notificationEmail}
                    onChange={(e) => setNotificationEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Notify Me When Available
                  </button>
                </form>
              )}
                <button
                  onClick={handleAddToWishlist}
                  className="flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Heart size={20} />
                  Add to Wishlist
                </button>
                <button
                  onClick={() => {
                    navigator.share({
                      title: product.name,
                      text: product.description,
                      url: window.location.href
                    }).catch(() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    });
                  }}
                  className="flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Share2 size={20} />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      

      <div>
          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex items-center gap-3">
              <Truck className="text-blue-600" size={24} />
              <div>
                <p className="font-medium">Free Shipping</p>
                <p className="text-sm text-gray-600">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCw className="text-blue-600" size={24} />
              <div>
                <p className="font-medium">Easy Returns</p>
                <p className="text-sm text-gray-600">30 day return policy</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="text-blue-600" size={24} />
              <div>
                <p className="font-medium">Secure Payment</p>
                <p className="text-sm text-gray-600">100% secure checkout</p>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Specifications</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">SKU</span>
                <span className="font-medium">{product.sku || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Category</span>
                <span className="font-medium">{product.category?.name || 'N/A'}</span>
              </div>
              {product.brand && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Brand</span>
                  <span className="font-medium">{product.brand}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Stock</span>
                <span className={`font-medium ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>
          </div>

      {/* Product Reviews */}
      <div className="mt-12">
        <ProductReviews productId={id} />
      </div>

      {/* Customer Questions & Answers */}
      <div className="mt-12">
        <ProductQuestions productId={id} />
      </div>
      
      <div className="mt-12">
        <RecentlyViewed />
      </div>
    </div>
    </div>
  );
};

export default ProductDetails;