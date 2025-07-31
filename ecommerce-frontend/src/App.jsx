// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MainContent from "./components/MainContent";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Component to conditionally render layout
function AppRoutes() {
  const location = useLocation();

  // Hide layout on login and signup routes
  const hideLayout = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="maincontainer bg-orange-200 min-h-screen flex flex-col">
      {!hideLayout && <Navbar />}

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>

      {!hideLayout && <Footer />}
    </div>
  );
}

// Wrap everything in BrowserRouter
function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
