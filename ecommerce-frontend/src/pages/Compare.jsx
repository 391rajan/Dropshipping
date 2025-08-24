import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCompare } from '../context/CompareContext';

const Compare = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { compareItems, loading, removeFromCompare, clearCompareList } = useCompare();

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product);
      // Optionally remove from compare after adding to cart
      await removeFromCompare(product._id);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }



  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Compare Products</h1>
        {compareItems.length > 0 && (
          <button
            onClick={clearCompareList}
            className="text-red-500 hover:text-red-600"
          >
            Clear All
          </button>
        )}
      </div>

      {compareItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No products to compare</p>
          <button
            onClick={() => navigate('/shop')}
            className="text-blue-500 hover:text-blue-600"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 text-left">Features</th>
                {compareItems.map(item => (
                  <th key={item._id} className="p-4 text-left min-w-[250px]">
                    <div className="relative">
                      <button
                        onClick={() => removeFromCompare(item._id)}
                        className="absolute top-0 right-0 text-gray-500 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Image Row */}
              <tr>
                <td className="border p-4">Image</td>
                {compareItems.map(item => (
                  <td key={item._id} className="border p-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded"
                    />
                  </td>
                ))}
              </tr>

              {/* Name Row */}
              <tr>
                <td className="border p-4">Name</td>
                {compareItems.map(item => (
                  <td key={item._id} className="border p-4 font-medium">
                    {item.name}
                  </td>
                ))}
              </tr>

              {/* Price Row */}
              <tr>
                <td className="border p-4">Price</td>
                {compareItems.map(item => (
                  <td key={item._id} className="border p-4">
                    ${item.price.toFixed(2)}
                  </td>
                ))}
              </tr>

              {/* Category Row */}
              <tr>
                <td className="border p-4">Category</td>
                {compareItems.map(item => (
                  <td key={item._id} className="border p-4">
                    {item.category}
                  </td>
                ))}
              </tr>

              {/* Stock Row */}
              <tr>
                <td className="border p-4">Stock</td>
                {compareItems.map(item => (
                  <td key={item._id} className="border p-4">
                    {item.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                  </td>
                ))}
              </tr>

              {/* Description Row */}
              <tr>
                <td className="border p-4">Description</td>
                {compareItems.map(item => (
                  <td key={item._id} className="border p-4">
                    {item.description}
                  </td>
                ))}
              </tr>

              {/* Action Row */}
              <tr>
                <td className="border p-4">Action</td>
                {compareItems.map(item => (
                  <td key={item._id} className="border p-4">
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={item.countInStock === 0}
                      className={`w-full py-2 rounded ${
                        item.countInStock === 0
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {item.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Compare;
