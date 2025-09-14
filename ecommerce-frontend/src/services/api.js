import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  signup: async (userInfo) => {
    const response = await api.post('/auth/signup', userInfo);
    return response.data;
  },
};

// Product APIs
export const productAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getRelated: async (id) => {
    const response = await api.get(`/products/${id}/related`);
    return response.data;
  },

  getByCategory: async (categoryId, filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    const response = await api.get(`/categories/${categoryId}/products?${params.toString()}`);
    return response.data;
  },

  searchProducts: async (query, filters = {}) => {
    const params = new URLSearchParams({ query, ...filters });
    const response = await api.get(`/products/search?${params.toString()}`);
    return response.data;
  },

  getSearchSuggestions: async (query) => {
    const response = await api.get(`/products/search/suggestions?query=${query}`);
    return response.data;
  },

  getProductCount: async () => {
    const response = await api.get('/products/count');
    return response.data;
  },

  addToRecentlyViewed: async (productId) => {
    const response = await api.post(`/recently-viewed/${productId}`);
    return response.data;
  },
};

export const categoryAPI = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  getTree: async () => {
    const response = await api.get('/categories/tree');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  getProducts: async (id, page = 1, limit = 10) => {
    const response = await api.get(`/categories/${id}/products`, {
      params: { page, limit },
    });
    return response.data;
  },
};

// Review APIs
export const reviewAPI = {
  getProductReviews: async (productId) => {
    const response = await api.get(`/reviews/${productId}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  update: async (reviewId, data) => {
    const response = await api.put(`/reviews/${reviewId}`, data);
    return response.data;
  },

  delete: async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  },

  markHelpful: async (reviewId) => {
    const response = await api.post(`/reviews/${reviewId}/helpful`);
    return response.data;
  },
};

// Wishlist APIs
export const wishlistAPI = {
  get: async () => {
    const response = await api.get('/wishlist');
    return response.data;
  },

  add: async (productId) => {
    const response = await api.post(`/wishlist/add/${productId}`);
    return response.data;
  },

  remove: async (productId) => {
    const response = await api.delete(`/wishlist/remove/${productId}`);
    return response.data;
  },

  clear: async () => {
    const response = await api.delete('/wishlist/clear');
    return response.data;
  },
};

// Recently Viewed APIs
export const recentlyViewedAPI = {
  get: async () => {
    const response = await api.get('/recently-viewed');
    return response.data;
  },

  add: async (productId) => {
    const response = await api.post(`/recently-viewed/${productId}`);
    return response.data;
  },

  clear: async () => {
    const response = await api.delete('/recently-viewed/clear');
    return response.data;
  },
};

// Compare APIs
export const compareAPI = {
  get: async () => {
    const response = await api.get('/compare');
    return response.data;
  },

  add: async (productId) => {
    const response = await api.post(`/compare/add/${productId}`);
    return response.data;
  },

  remove: async (productId) => {
    const response = await api.delete(`/compare/remove/${productId}`);
    return response.data;
  },

  clear: async () => {
    const response = await api.delete('/compare/clear');
    return response.data;
  },

  getDetails: async (productIds) => {
    const response = await api.post('/compare/details', { productIds });
    return response.data;
  },
};

// Cart APIs
export const cartAPI = {
  get: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  addItem: async (productId, quantity, variantId = null) => {
    const response = await api.post('/cart/add', {
      productId,
      quantity,
      variantId,
    });
    return response.data;
  },

  updateItem: async (itemId, quantity) => {
    const response = await api.put(`/cart/items/${itemId}`, { quantity });
    return response.data;
  },

  removeItem: async (itemId) => {
    const response = await api.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  clear: async () => {
    const response = await api.delete('/cart/clear');
    return response.data;
  },
};

// Order APIs
export const orderAPI = {
  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  getOrderCount: async () => {
    const response = await api.get('/orders/count');
    return response.data;
  },

  getTotalRevenue: async () => {
    const response = await api.get('/orders/revenue');
    return response.data;
  },
};

// Address APIs
export const addressAPI = {
  getAll: async () => {
    const response = await api.get('/addresses');
    return response.data;
  },
  
  create: async (address) => {
    const response = await api.post('/addresses', address);
    return response.data;
  },

  update: async (id, address) => {
    const response = await api.put(`/addresses/${id}`, address);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/addresses/${id}`);
    return response.data;
  }
};

// Payment APIs
export const paymentAPI = {
  createOrder: async (data) => {
    // data should contain { amount, currency, receipt }
    const response = await api.post('/payments/create-order', data);
    return response.data;
  },

  verifySignature: async (data) => {
    // data should contain { razorpay_order_id, razorpay_payment_id, razorpay_signature }
    const response = await api.post('/payments/verify-signature', data);
    return response.data;
  },
};

export const forgotPassword = (email) => {
  return api.post("/auth/forgot-password", email);
};

export const resetPassword = (token, password) => {
  return api.post(`/auth/reset-password/${token}`, password);
};

export const verifyEmail = (token) => {
  return api.get(`/auth/verify-email/${token}`);
};

export const stockNotificationAPI = {
  create: async (data) => {
    const response = await api.post('/stock-notifications', data);
    return response.data;
  },
};

export const createQuestion = async (data) => {
  const response = await api.post('/questions', data);
  return response.data;
};

export const getQuestionsForProduct = async (productId) => {
  const response = await api.get(`/questions/product/${productId}`);
  return response.data;
};

export const subscribeToNewsletter = async (data) => {
  const response = await api.post('/newsletter/subscribe', data);
  return response.data;
};

export const userAPI = {
  getUserCount: async () => {
    const response = await api.get('/auth/users/count');
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

export default api;
