import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';

function RelatedProducts({ products, currentProductId }) {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = React.useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleWishlist = (productId) => {
    const newWishlist = wishlist.includes(productId)
      ? wishlist.filter(id => id !== productId)
      : [...wishlist, productId];
    
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-primary mb-8">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products
          .filter(product => product._id !== currentProductId)
          .slice(0, 4)
          .map(product => (
            <div key={product._id} className="group relative">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
                  onClick={() => navigate(`/product/${product._id}`)}
                />
                <button
                  onClick={() => toggleWishlist(product._id)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      wishlist.includes(product._id)
                        ? 'text-red-500 fill-current'
                        : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-primary">
                  {product.name}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-4 h-4 ${
                          idx < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-accent/60">
                    ({product.numReviews})
                  </span>
                </div>
                <p className="text-accent mt-1">${product.price.toFixed(2)}</p>
                <div className="mt-2">
                  <span className={`inline-flex px-2 py-1 text-xs rounded ${
                    product.stockCount > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stockCount > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default RelatedProducts;
