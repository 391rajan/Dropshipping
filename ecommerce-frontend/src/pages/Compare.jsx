import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCompare } from '../context/CompareContext';
import { FaTimes, FaShoppingCart, FaTrash, FaBalanceScale } from 'react-icons/fa';

const Compare = () => {
  const { addToCart } = useCart();
  const { compareItems, loading, removeFromCompare, clearCompareList } = useCompare();

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product);
      await removeFromCompare(product._id);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
        <p className="mt-4 text-lg text-accent">Loading comparison...</p>
      </div>
    );
  }

  const features = [
    { key: 'name', label: 'Name' },
    { key: 'price', label: 'Price', format: (p) => `$${p.toFixed(2)}` },
    { key: 'category', label: 'Category' },
    { key: 'countInStock', label: 'Stock', format: (s) => s > 0 ? 'In Stock' : 'Out of Stock' },
    { key: 'description', label: 'Description' },
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">Compare Products</h1>
        <p className="text-accent/90 text-lg max-w-2xl mx-auto">Side-by-side comparison to help you choose the best product.</p>
      </div>
      <div className="flex justify-end items-center mb-8">
        {compareItems.length > 0 && (
          <button
            onClick={clearCompareList}
            className="flex items-center gap-2 bg-red-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-red-600 transition-colors shadow-md"
          >
            <FaTrash size={18} />
            Clear All
          </button>
        )}
      </div>

      {compareItems.length === 0 ? (
        <div className="text-center bg-white p-12 rounded-xl shadow-lg border border-accent/20 max-w-lg mx-auto">
          <FaBalanceScale className="text-6xl text-primary mx-auto mb-6" />
          <p className="text-xl text-accent/90 mb-6">You have no products to compare.</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-primary hover:bg-accent text-white font-semibold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-accent/20 p-6">
          <div className="grid gap-6" style={{ gridTemplateColumns: `auto repeat(${compareItems.length}, minmax(250px, 1fr))` }}>
            {/* Feature Headers Column */}
            <div className="font-semibold text-accent space-y-4 pt-64"> {/* Spacer for image height */}
              {features.map(f => <div key={f.key} className="h-20 flex items-center font-bold text-lg">{f.label}</div>)}
              <div className="h-20 flex items-center font-bold text-lg">Action</div>
            </div>

            {/* Product Columns */}
            {compareItems.map(item => (
              <div key={item._id} className="relative text-center border-l border-accent/10 px-4">
                <button
                  onClick={() => removeFromCompare(item._id)}
                  className="absolute top-0 right-2 text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-100 transition-colors"
                >
                  <FaTimes size={20} />
                </button>
                <Link to={`/product/${item._id}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-56 object-cover rounded-lg mb-4 border border-accent/20"
                  />
                </Link>
                <div className="space-y-4">
                  {features.map(f => (
                    <div key={f.key} className="h-20 flex items-center justify-center text-accent/90 px-2">
                      {f.format ? f.format(item[f.key]) : item[f.key]}
                    </div>
                  ))}
                  <div className="h-20 flex items-center justify-center">
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={item.countInStock === 0}
                      className={`w-full py-3 rounded-full font-semibold text-white transition-all duration-300 shadow-md transform hover:scale-105 ${
                        item.countInStock === 0
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-primary hover:bg-accent'
                      }`}
                    >
                      {item.countInStock === 0 ? 'Out of Stock' : <><FaShoppingCart className="inline-block mr-2" /> Add to Cart</>}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Compare;