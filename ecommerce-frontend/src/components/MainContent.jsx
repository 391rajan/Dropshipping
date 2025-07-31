// src/pages/Home.jsx
import { Link } from "react-router-dom";
import React from "react";
import HeroSection from "../components/HeroSection";
import ProductCard from "../components/ProductCard";

// Your product data (mock data for now)
const productList = [
    {
        id: "prod-001", // Use unique IDs, not just numbers
        name: "Wireless Bluetooth Earbuds Pro",
        price: 49.99,
        image: "/images/products/earbuds.webp",
        category: "Electronics",
    },
    {
        id: "prod-002",
        name: "Smartwatch with Heart Rate Monitor",
        price: 79.99,
        image: "/images/products/smartwatch.webp",
        category: "Electronics",
    },
    {
        id: "prod-003",
        name: "Ergonomic Office Chair",
        price: 199.99,
        image: "/images/products/office-chair.webp",
        category: "Home & Office",
    },
    {
        id: "prod-004",
        name: "Portable Mini Projector",
        price: 129.50,
        image: "/images/products/projector.webp",
        category: "Electronics",
    },
    {
        id: "prod-005",
        name: "Stainless Steel Water Bottle (500ml)",
        price: 15.00,
        image: "/images/products/water-bottle.webp",
        category: "Kitchen & Dining",
    },
    {
        id: "prod-006",
        name: "LED Desk Lamp with Wireless Charger",
        price: 34.99,
        image: "/images/products/desk-lamp.webp",
        category: "Home & Office",
    },
    {
        id: "prod-007",
        name: "Resistance Band Set for Fitness",
        price: 22.00,
        image: "/images/products/resistance-bands.webp",
        category: "Sports & Outdoors",
    },
    {
        id: "prod-008",
        name: "USB-C to HDMI Adapter",
        price: 18.75,
        image: "/images/products/usb-c-adapter.webp",
        category: "Electronics",
    },
    {
        id: "prod-009",
        name: "Travel Pillow & Eye Mask Set",
        price: 25.00,
        image: "/images/products/travel-set.webp",
        category: "Travel",
    },
    {
        id: "prod-010",
        name: "Wireless Charging Pad",
        price: 29.99,
        image: "/images/products/wireless-charger.webp",
        category: "Electronics",
    },
    {
        id: "prod-011",
        name: "Foldable Laptop Stand",
        price: 45.00,
        image: "/images/products/laptop-stand.webp",
        category: "Home & Office",
    },
    {
        id: "prod-012",
        name: "Bluetooth Speaker with RGB Light",
        price: 55.00,
        image: "/images/products/bluetooth-speaker.webp",
        category: "Electronics",
    },
];


function Home() { // Renamed from MainContent
  return (
    <main className="bg-gray-50 min-h-screen"> {/* Lighter background for main content */}
      <HeroSection />

      {/* Section Title for Products */}
      <section className="container mx-auto px-4 md:px-8 py-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-12">
          Featured Products
        </h2>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 xl:gap-10 justify-items-center">
          {productList.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {/* Optional: View All Products button */}
        <div className="text-center mt-16">
          <Link 
            to="/shop" 
            className="inline-block bg-gray-800 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            View All Products
          </Link>
        </div>

      </section>

      {/* Optional: Add more sections here like "Categories," "Testimonials," "Why Choose Us" */}
      {/* Example: */}
      {/* <section className="bg-blue-600 text-white py-16 text-center">
        <h3 className="text-3xl font-bold mb-4">Why Shop With Us?</h3>
        <p className="text-xl">Fast Shipping, Quality Products, Excellent Support!</p>
      </section> */}

    </main>
  );
}

export default Home;