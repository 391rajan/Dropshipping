// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CompareProvider } from './context/CompareContext';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MainContent from "./components/MainContent";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ShopAll from "./pages/ShopAll";
import Deals from "./pages/Deals";
import TrackOrder from "./pages/TrackOrder";
import Wishlist from "./pages/Wishlist";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import Compare from "./pages/Compare";
import ProductDetails from "./pages/ProductDetails";
import SearchResults from "./pages/SearchResults";
import CategoryPage from "./pages/CategoryPage";

// Component to conditionally render layout
function AppRoutes() {
  const location = useLocation();

  // Hide layout on login and signup routes
  const hideLayout = location.pathname === "/login" || location.pathname === "/signup";

  return (
  <div className="maincontainer bg-background min-h-screen flex flex-col">
      {!hideLayout && <Navbar />}

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/shop" element={<ShopAll />} />
          <Route path="/offers" element={<Deals />} />
          <Route path="/track" element={<TrackOrder />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/category/:id" element={<CategoryPage />} />
        </Routes>
      </div>

      {!hideLayout && <Footer />}
    </div>
  );
}

// Wrap everything in BrowserRouter and Providers
function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          <CompareProvider>
            <AppRoutes />
          </CompareProvider>
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
