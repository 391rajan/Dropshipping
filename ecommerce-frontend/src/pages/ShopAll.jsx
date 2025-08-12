import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

function ShopAll() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <main className="bg-background min-h-screen py-10">
      <div className="container mx-auto px-4 md:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary text-center mb-12">All Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 xl:gap-10 justify-items-center">
          {loading ? (
            <div className="col-span-full text-center text-gray-500 py-10">Loading products...</div>
          ) : error ? (
            <div className="col-span-full text-center text-red-500 py-10">{error}</div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-10">No products found.</div>
          ) : (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export default ShopAll;
