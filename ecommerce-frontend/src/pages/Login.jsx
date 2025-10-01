import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/api";
import AuthLayout from "../components/AuthLayout";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { token } = await authAPI.login(formData);
      login(token);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      setError(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Login to Your Account">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-accent/80 mb-2"
          >
            Email address
          </label>
          <div className="relative">
            <FaEnvelope className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-accent/80 mb-2"
          >
            Password
          </label>
          <div className="relative">
            <FaLock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-12 pr-12 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
              placeholder="••••••••"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-500 hover:text-primary"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <div className="text-sm">
            <Link
              to="/forgot-password"
              className="font-medium text-primary hover:text-accent transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        {error && <p className="text-red-600 bg-red-100 p-3 rounded-lg text-center">{error}</p>}

        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full inline-flex justify-center items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-full shadow-md transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent hover:scale-105'}`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6">
          <a
            href={`${
              import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000"
            }/api/auth/google`}
            className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-full shadow-sm bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                fill="#4285F4"
                d="M24 9.5c3.9 0 6.9 1.6 9.1 3.7l6.9-6.9C35.2 2.5 30.1 0 24 0 14.9 0 7.3 5.4 4.1 12.9l8.2 6.3C14.2 13.4 18.6 9.5 24 9.5z"
              ></path>
              <path
                fill="#34A853"
                d="M46.2 25.4c0-1.7-.2-3.4-.5-5H24v9.5h12.5c-.5 3.1-2.1 5.7-4.6 7.5l7.8 6C43.4 39.6 46.2 33.1 46.2 25.4z"
              ></path>
              <path
                fill="#FBBC05"
                d="M12.3 19.2c-.4-1.2-.6-2.5-.6-3.8s.2-2.6.6-3.8l-8.2-6.3C1.5 8.9 0 13.2 0 18s1.5 9.1 4.1 12.9l8.2-6.3z"
              ></path>
              <path
                fill="#EA4335"
                d="M24 48c6.1 0 11.2-2 14.9-5.4l-7.8-6c-2.5 1.7-5.6 2.7-9.1 2.7-5.4 0-9.8-3.9-11.7-9.2l-8.2 6.3C7.3 42.6 14.9 48 24 48z"
              ></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
            Sign in with Google
          </a>
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-gray-600">
        Don’t have an account?{" "}
        <Link
          to="/signup"
          className="font-medium text-primary hover:text-accent transition-colors"
        >
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Login;