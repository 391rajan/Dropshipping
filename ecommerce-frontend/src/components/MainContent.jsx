// src/pages/Home.jsx
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import ProductCard from "../components/ProductCard";
import { productAPI } from "../services/api";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productAPI.getAll();
        setProducts(data);
      } catch (err) {
        setError("Failed to fetch products.");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Example categories
  const categories = [
    { name: "Electronics", icon: "💻" },
    { name: "Clothing", icon: "👕" },
    { name: "Accessories", icon: "🎒" },
    { name: "Fitness", icon: "🏋️" },
    { name: "Home", icon: "🏠" },
    { name: "Travel", icon: "✈️" },
  ];

  // Example testimonials
  const testimonials = [
    { name: "Amit S.", text: "Great quality and fast shipping! Highly recommend this store.", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Priya K.", text: "Customer support was super helpful. Love my new products!", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: "Rahul D.", text: "Easy returns and amazing deals. Will shop again!", avatar: "https://randomuser.me/api/portraits/men/65.jpg" },
  ];

  // Example brands
  const brands = [
    "/images/brand1.png",
    "/images/brand2.png",
    "/images/brand3.png",
    "/images/brand4.png",
  ];

  // Example limited-time offers (pick 2 random products if available)
  const offers = products.slice(0, 2);

  return (
    <main className="bg-background min-h-screen">
      <HeroSection />

      {/* Categories Section */}
      <section className="container mx-auto px-4 md:px-8 py-8">
        <h2 className="text-2xl font-bold text-accent text-center mb-6">Shop by Category</h2>
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {categories.map((cat) => (
            <Link key={cat.name} to={`/shop?category=${cat.name.toLowerCase()}`}
              className="flex flex-col items-center bg-white rounded-xl shadow p-4 w-28 hover:bg-primary/10 transition-colors border border-accent/20">
              <span className="text-3xl mb-2">{cat.icon}</span>
              <span className="text-accent font-medium">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Limited-Time Offers */}
      {offers.length > 0 && (
        <section className="container mx-auto px-4 md:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary">Limited-Time Offers</h2>
            <span className="text-accent text-sm bg-accent/10 rounded-full px-4 py-1 mt-2 md:mt-0">Hurry! While stocks last</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {offers.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          }
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="container mx-auto px-4 md:px-8 py-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary text-center mb-12">
          Featured Products
        </h2>
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
        <div className="text-center mt-16">
          <Link
            to="/shop"
            className="inline-block bg-primary hover:bg-accent text-white font-semibold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* Why Shop With Us */}
      <section className="bg-primary/10 py-12">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h3 className="text-2xl font-bold text-primary mb-6">Why Shop With Us?</h3>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex flex-col items-center w-40">
              <span className="text-4xl mb-2">🚚</span>
              <span className="font-semibold text-accent">Fast Shipping</span>
              <span className="text-accent/80 text-sm">Get your products quickly, wherever you are.</span>
            </div>
            <div className="flex flex-col items-center w-40">
              <span className="text-4xl mb-2">🔒</span>
              <span className="font-semibold text-accent">Secure Payments</span>
              <span className="text-accent/80 text-sm">Your transactions are safe with us.</span>
            </div>
            <div className="flex flex-col items-center w-40">
              <span className="text-4xl mb-2">↩️</span>
              <span className="font-semibold text-accent">Easy Returns</span>
              <span className="text-accent/80 text-sm">Hassle-free returns within 7 days.</span>
            </div>
            <div className="flex flex-col items-center w-40">
              <span className="text-4xl mb-2">💬</span>
              <span className="font-semibold text-accent">24/7 Support</span>
              <span className="text-accent/80 text-sm">We’re here to help anytime.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 md:px-8 py-12">
        <h3 className="text-2xl font-bold text-accent text-center mb-8">What Our Customers Say</h3>
        <div className="flex flex-wrap justify-center gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-xl shadow p-6 w-80 flex flex-col items-center border border-accent/20">
              <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full mb-3 object-cover" />
              <p className="text-accent/90 italic mb-2">“{t.text}”</p>
              <span className="font-semibold text-primary">{t.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-accent/10 py-12">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h3 className="text-2xl font-bold text-accent mb-4">Get Exclusive Deals & Updates</h3>
          <form className="flex flex-col sm:flex-row justify-center gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full border border-accent focus:ring-2 focus:ring-primary outline-none"
              required
            />
            <button
              type="submit"
              className="bg-primary hover:bg-accent text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Brands/Partners */}
      <section className="container mx-auto px-4 md:px-8 py-10">
        <h3 className="text-xl font-bold text-accent text-center mb-6">Our Trusted Brands & Partners</h3>
        <div className="flex flex-wrap justify-center items-center gap-8">
          {brands.map((src, i) => (
            <img key={i} src={src} alt="Brand logo" className="h-12 object-contain grayscale opacity-80 hover:opacity-100 transition" />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;