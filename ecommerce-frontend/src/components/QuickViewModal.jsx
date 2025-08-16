import React from 'react';
import { X } from 'lucide-react';

function QuickViewModal({ product, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="grid grid-cols-2 gap-4 p-6">
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto rounded-lg"
            />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">{product.name}</h2>
            <p className="text-xl text-accent">${product.price.toFixed(2)}</p>
            
            <div className="space-y-2">
              <p className="text-sm text-accent/80">{product.description}</p>
              
              <div className="flex items-center space-x-2">
                <span className={`inline-flex px-2 py-1 text-sm rounded ${
                  product.stockCount > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.stockCount > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
                {product.stockCount > 0 && (
                  <span className="text-sm text-accent/60">
                    {product.stockCount} units available
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                // Handle add to cart
                onClose();
              }}
              disabled={product.stockCount === 0}
              className="w-full bg-primary hover:bg-accent disabled:bg-gray-300 
                text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickViewModal;
