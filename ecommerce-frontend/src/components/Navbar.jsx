// src/components/Navbar.jsx
import { useState } from "react";
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Example: Replace with actual cart item count from your state management
  const cartItemCount = 3;
  // Example: Replace with actual user login status
  const isLoggedIn = true; // For demonstration

  return (
    <nav className="bg-white w-full border-b border-gray-100 shadow-md z-50 relative"> {/* Stronger shadow */}
      {/* Top Navigation */}
      <div className="flex justify-between items-center h-16 px-4 md:px-8 lg:px-12">

        {/* Brand Logo */}
        <Link to="/" className="flex items-center text-xl font-bold text-gray-800">
          <img src="/logo.png" alt="Dropshipping Store" className="h-7 md:h-8 mr-2" />
          {/* You could add a brand name here with an accent color if desired */}
          {/* <span className="text-blue-600">YourBrand</span> */}
        </Link>

        {/* Desktop Navigation - Top Right */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {/* Search */}
          <div className="relative flex items-center border border-gray-300 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 hover:border-blue-400 transition-all duration-200">
            <Search className="w-4 h-4 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search products..."
              className="outline-none text-sm flex-grow bg-transparent placeholder-gray-400"
            />
          </div>

          {/* Categories Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setShowCategories(true)}
            onMouseLeave={() => setShowCategories(false)}
          >
            <button
              className="hover:text-blue-600 font-medium flex items-center transition-colors duration-200 text-gray-700" // Added base text color
              onClick={() => setShowCategories(!showCategories)}
              aria-haspopup="true"
              aria-expanded={showCategories}
            >
              Categories
              <ChevronDown className={`w-4 h-4 ml-1 text-gray-500 transition-transform duration-200 ${showCategories ? 'rotate-180' : 'rotate-0'}`} />
            </button>
            {showCategories && (
              <div className="absolute top-full mt-2 left-0 bg-white shadow-lg border border-gray-200 rounded-lg p-2 min-w-[160px] z-20">
                <Link to="/electronics" className="block hover:bg-blue-50 hover:text-blue-700 p-2 rounded text-gray-700 transition-colors duration-150">Electronics</Link>
                <Link to="/clothing" className="block hover:bg-blue-50 hover:text-blue-700 p-2 rounded text-gray-700 transition-colors duration-150">Clothing</Link>
                <Link to="/accessories" className="block hover:bg-blue-50 hover:text-blue-700 p-2 rounded text-gray-700 transition-colors duration-150">Accessories</Link>
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative p-1 rounded-full hover:bg-blue-50 transition-colors duration-200"> {/* Blue hover background */}
            <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-blue-600" /> {/* Blue hover text */}
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full font-bold leading-none animate-bounce-once">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* Profile Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setShowProfile(true)}
            onMouseLeave={() => setShowProfile(false)}
          >
            <button
              className="p-1 rounded-full hover:bg-blue-50 transition-colors duration-200" // Blue hover background
              onClick={() => setShowProfile(!showProfile)}
              aria-haspopup="true"
              aria-expanded={showProfile}
            >
              <User className="w-6 h-6 text-gray-700 hover:text-blue-600" /> {/* Blue hover text */}
            </button>
            {showProfile && (
              <div className="absolute top-full mt-2 right-0 bg-white shadow-lg border border-gray-200 rounded-lg p-2 w-36 z-20">
                {!isLoggedIn ? (
                  <Link to="/login" className="block hover:bg-blue-50 hover:text-blue-700 p-2 rounded text-gray-700 transition-colors duration-150">Login</Link>
                ) : (
                  <>
                    <Link to="/profile" className="block hover:bg-blue-50 hover:text-blue-700 p-2 rounded text-gray-700 transition-colors duration-150">My Profile</Link>
                    <Link to="/orders" className="block hover:bg-blue-50 hover:text-blue-700 p-2 rounded text-gray-700 transition-colors duration-150">My Orders</Link>
                    <button className="w-full text-left hover:bg-blue-50 hover:text-blue-700 p-2 rounded text-gray-700 transition-colors duration-150">Logout</button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Hamburger Icon for Mobile */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-600 hover:bg-blue-50 rounded-md transition-colors duration-200" // Blue hover background
          aria-controls="mobile-menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-6 h-6 text-blue-600" /> : <Menu className="w-6 h-6 hover:text-blue-600" />} {/* Blue active/hover icon */}
        </button>
      </div>

      {/* Lower Nav Links (Desktop) */}
      <div className="hidden md:flex justify-center items-center h-12 px-4 md:px-8 border-t border-gray-100">
        <div className="flex gap-6 lg:gap-8 flex-wrap justify-center font-medium text-gray-700"> {/* Base text color */}
          <Link to="/shop" className="hover:text-blue-600 transition-colors duration-200">Shop All</Link>
          <Link to="/offers" className="hover:text-blue-600 transition-colors duration-200">Deals</Link>
          <Link to="/track" className="hover:text-blue-600 transition-colors duration-200">Track Order</Link>
          <Link to="/wishlist" className="hover:text-blue-600 transition-colors duration-200">Wishlist</Link>
          <Link to="/about" className="hover:text-blue-600 transition-colors duration-200">About Us</Link>
          <Link to="/contact" className="hover:text-blue-600 transition-colors duration-200">Contact</Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden px-6 py-4 space-y-3 font-medium border-t border-gray-200 bg-white"
        >
          <Link to="/shop" className="block py-2 px-2 hover:bg-blue-50 rounded text-gray-700 hover:text-blue-700" onClick={() => setMobileMenuOpen(false)}>Shop All</Link>
          <Link to="/offers" className="block py-2 px-2 hover:bg-blue-50 rounded text-gray-700 hover:text-blue-700" onClick={() => setMobileMenuOpen(false)}>Deals</Link>
          <Link to="/track" className="block py-2 px-2 hover:bg-blue-50 rounded text-gray-700 hover:text-blue-700" onClick={() => setMobileMenuOpen(false)}>Track Order</Link>
          <Link to="/wishlist" className="block py-2 px-2 hover:bg-blue-50 rounded text-gray-700 hover:text-blue-700" onClick={() => setMobileMenuOpen(false)}>Wishlist</Link>
          <Link to="/about" className="block py-2 px-2 hover:bg-blue-50 rounded text-gray-700 hover:text-blue-700" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
          <Link to="/contact" className="block py-2 px-2 hover:bg-blue-50 rounded text-gray-700 hover:text-blue-700" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          <div className="border-t border-gray-100 my-2"></div> {/* Separator */}
          <Link to="/categories" className="block py-2 px-2 hover:bg-blue-50 rounded text-gray-700 hover:text-blue-700" onClick={() => setMobileMenuOpen(false)}>All Categories</Link>
          <Link to="/cart" className="block py-2 px-2 hover:bg-blue-50 rounded text-gray-700 hover:text-blue-700" onClick={() => setMobileMenuOpen(false)}>Cart ({cartItemCount})</Link>
          {!isLoggedIn ? (
            <Link to="/login" className="block py-2 px-2 hover:bg-blue-50 rounded text-gray-700 hover:text-blue-700" onClick={() => setMobileMenuOpen(false)}>Login / Register</Link>
          ) : (
            <>
              <Link to="/profile" className="block py-2 px-2 hover:bg-blue-50 rounded text-gray-700 hover:text-blue-700" onClick={() => setMobileMenuOpen(false)}>My Account</Link>
              <button className="w-full text-left py-2 px-2 hover:bg-blue-50 rounded text-gray-700 hover:text-blue-700" onClick={() => { /* handle logout */ setMobileMenuOpen(false); }}>Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;