// src/components/Navbar.jsx
import { useState, useRef, useEffect } from "react";
import { Search, ShoppingCart, User, Menu, X, ChevronDown, LayoutGrid } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { productAPI, categoryAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { token, user, logout, loading: authLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [categories, setCategories] = useState([]);

  const categoriesTimeoutRef = useRef(null);
  const profileTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await categoryAPI.getAll();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      const data = await productAPI.getSearchSuggestions(query);
      setSuggestions(data);
    } else {
      setSuggestions([]);
    }
  };

  // Example: Replace with actual cart item count from your state management
  const cartItemCount = 3;

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const handleCategoriesMouseEnter = () => {
    clearTimeout(categoriesTimeoutRef.current);
    setShowCategories(true);
  };

  const handleCategoriesMouseLeave = () => {
    categoriesTimeoutRef.current = setTimeout(() => {
      setShowCategories(false);
    }, 200); // 200ms delay
  };

  const handleProfileMouseEnter = () => {
    clearTimeout(profileTimeoutRef.current);
    setShowProfile(true);
  };

  const handleProfileMouseLeave = () => {
    profileTimeoutRef.current = setTimeout(() => {
      setShowProfile(false);
    }, 200); // 200ms delay
  };

  return (
  <nav className="bg-background w-full border-b border-accent/20 shadow-md z-50 relative"> {/* Stronger shadow */}
      {/* Top Navigation */}
      <div className="flex justify-between items-center h-16 px-4 md:px-8 lg:px-12">

        {/* Brand Logo */}
  <Link to="/" className="flex items-center text-xl font-bold text-primary">
          <img src="/vite.svg" alt="Logo" className="h-7 md:h-8 mr-2" />
          {/* You could add a brand name here with an accent color if desired */}
          {/* <span className="text-blue-600">YourBrand</span> */}
        </Link>

        {/* Desktop Navigation - Top Right */}
  <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {/* Search */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                setSearchQuery("");
                setSuggestions([]);
              }
            }}
            className="relative flex items-center border border-accent rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-primary hover:border-primary transition-all duration-200"
          >
            <Search className="w-4 h-4 text-accent mr-2" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="outline-none text-sm flex-grow bg-transparent placeholder-accent/60"
            />
            {suggestions.length > 0 && (
              <div className="absolute top-full mt-2 left-0 w-full bg-white shadow-lg border border-accent rounded-lg p-2 z-20">
                {
                  suggestions.map((suggestion, index) => (
                    <Link
                      key={index}
                      to={`/search?q=${encodeURIComponent(suggestion)}`}
                      className="block hover:bg-primary/10 hover:text-primary p-2 rounded text-accent transition-colors duration-150"
                      onClick={() => setSuggestions([])}
                    >
                      {suggestion}
                    </Link>
                  ))
                }
              </div>
            )}
          </form>

          {/* Compare */}
          <Link to="/compare" className="relative p-1 rounded-full hover:bg-primary/10 transition-colors duration-200">
            <LayoutGrid className="w-6 h-6 text-accent hover:text-primary" />
          </Link>

          {/* Categories Dropdown */}
          <div
            className="relative"
            onMouseEnter={handleCategoriesMouseEnter}
            onMouseLeave={handleCategoriesMouseLeave}
          >
            <button
              className="hover:text-primary font-medium flex items-center transition-colors duration-200 text-accent" // Added base text color
              onClick={() => setShowCategories(!showCategories)}
              aria-haspopup="true"
              aria-expanded={showCategories}
            >
              Categories
              <ChevronDown className={`w-4 h-4 ml-1 text-accent transition-transform duration-200 ${showCategories ? 'rotate-180' : 'rotate-0'}`} />
            </button>
            {showCategories && (
              <div className="absolute top-full mt-2 left-0 bg-white shadow-lg border border-accent rounded-lg p-2 min-w-[160px] z-20">
                {categories.map((category) => (
                  <Link
                    key={category._id}
                    to={`/category/${category.slug}`}
                    className="block hover:bg-primary/10 hover:text-primary p-2 rounded text-accent transition-colors duration-150"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative p-1 rounded-full hover:bg-primary/10 transition-colors duration-200"> {/* Emerald hover background */}
            <ShoppingCart className="w-6 h-6 text-accent hover:text-primary" /> {/* Emerald hover text */}
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full font-bold leading-none animate-bounce-once">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* Profile Dropdown */}
          <div
            className="relative"
            onMouseEnter={handleProfileMouseEnter}
            onMouseLeave={handleProfileMouseLeave}
          >
            <button
              className="p-1 rounded-full hover:bg-primary/10 transition-colors duration-200" // Emerald hover background
              onClick={() => setShowProfile(!showProfile)}
              aria-haspopup="true"
              aria-expanded={showProfile}
            >
              <User className="w-6 h-6 text-accent hover:text-primary" /> {/* Emerald hover text */}
            </button>
            {showProfile && (
              <div className="absolute top-full mt-2 right-0 bg-white shadow-lg border border-accent rounded-lg p-2 w-36 z-20">
                {authLoading ? (
                  <div className="p-2 text-accent">Loading...</div>
                ) : !token ? (
                  <Link to="/login" className="block hover:bg-primary/10 hover:text-primary p-2 rounded text-accent transition-colors duration-150">Login</Link>
                ) : (
                  <>
                    {user && user.isAdmin && (
                      <Link to="/admin-dashboard" className="block hover:bg-primary/10 hover:text-primary p-2 rounded text-accent transition-colors duration-150">Admin</Link>
                    )}
                    <Link to="/profile" className="block hover:bg-primary/10 hover:text-primary p-2 rounded text-accent transition-colors duration-150">My Profile</Link>
                    <Link to="/order-history" className="block hover:bg-primary/10 hover:text-primary p-2 rounded text-accent transition-colors duration-150">My Orders</Link>
                    <button onClick={handleLogout} className="w-full text-left hover:bg-primary/10 hover:text-primary p-2 rounded text-accent transition-colors duration-150">Logout</button>
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
  <div className="hidden md:flex justify-center items-center h-12 px-4 md:px-8 border-t border-accent/20">
  <div className="flex gap-6 lg:gap-8 flex-wrap justify-center font-medium text-accent"> {/* Base text color */}
          <Link to="/shop" className="hover:text-primary transition-colors duration-200">Shop All</Link>
          <Link to="/offers" className="hover:text-primary transition-colors duration-200">Deals</Link>
          <Link to="/track-order" className="hover:text-primary transition-colors duration-200">Track Order</Link>
          <Link to="/wishlist" className="hover:text-primary transition-colors duration-200">Wishlist</Link>
          <Link to="/about" className="hover:text-primary transition-colors duration-200">About Us</Link>
          <Link to="/contact" className="hover:text-primary transition-colors duration-200">Contact</Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden px-6 py-4 space-y-3 font-medium border-t border-accent/20 bg-white"
        >
          <Link to="/shop" className="block py-2 px-2 hover:bg-primary/10 rounded text-accent hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Shop All</Link>
          <Link to="/offers" className="block py-2 px-2 hover:bg-primary/10 rounded text-accent hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Deals</Link>
          <Link to="/track-order" className="block py-2 px-2 hover:bg-primary/10 rounded text-accent hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Track Order</Link>
          <Link to="/wishlist" className="block py-2 px-2 hover:bg-primary/10 rounded text-accent hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Wishlist</Link>
          <Link to="/about" className="block py-2 px-2 hover:bg-primary/10 rounded text-accent hover:text-primary" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
          <Link to="/contact" className="block py-2 px-2 hover:bg-primary/10 rounded text-accent hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          <div className="border-t border-accent/20 my-2"></div> {/* Separator */}
          <Link to="/shop" className="block py-2 px-2 hover:bg-primary/10 rounded text-accent hover:text-primary" onClick={() => setMobileMenuOpen(false)}>All Categories</Link>
          <Link to="/cart" className="block py-2 px-2 hover:bg-primary/10 rounded text-accent hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Cart ({cartItemCount})</Link>
          {authLoading ? (
            <div className="p-2 text-accent">Loading...</div>
          ) : !token ? (
            <Link to="/login" className="block py-2 px-2 hover:bg-primary/10 rounded text-accent hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Login / Register</Link>
          ) : (
            <>
              {user && user.isAdmin && (
                <Link to="/admin-dashboard" className="block py-2 px-2 hover:bg-primary/10 rounded text-accent hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
              )}
              <Link to="/profile" className="block py-2 px-2 hover:bg-primary/10 rounded text-accent hover:text-primary" onClick={() => setMobileMenuOpen(false)}>My Account</Link>
              <button onClick={handleLogout} className="w-full text-left py-2 px-2 hover:bg-primary/10 rounded text-accent hover:text-primary">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;