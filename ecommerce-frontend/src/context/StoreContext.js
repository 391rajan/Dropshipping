import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { wishlistAPI, cartAPI } from '../services/api';

const StoreContext = createContext();

const initialState = {
  cart: {
    items: [],
    loading: false,
    error: null,
  },
  wishlist: {
    items: [],
    loading: false,
    error: null,
  },
  recentlyViewed: [],
  compareList: [],
  categories: [],
  filters: {
    category: null,
    priceRange: { min: '', max: '' },
    brands: [],
    stockFilter: '',
  },
};

function storeReducer(state, action) {
  switch (action.type) {
    // Cart actions
    case 'SET_CART_LOADING':
      return { ...state, cart: { ...state.cart, loading: action.payload } };
    case 'SET_CART_ERROR':
      return { ...state, cart: { ...state.cart, error: action.payload } };
    case 'SET_CART_ITEMS':
      return { ...state, cart: { ...state.cart, items: action.payload } };
    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.map(item =>
            item._id === action.payload._id ? action.payload : item
          ),
        },
      };
    case 'REMOVE_CART_ITEM':
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.filter(item => item._id !== action.payload),
        },
      };

    // Wishlist actions
    case 'SET_WISHLIST_LOADING':
      return { ...state, wishlist: { ...state.wishlist, loading: action.payload } };
    case 'SET_WISHLIST_ERROR':
      return { ...state, wishlist: { ...state.wishlist, error: action.payload } };
    case 'SET_WISHLIST_ITEMS':
      return { ...state, wishlist: { ...state.wishlist, items: action.payload } };
    case 'ADD_TO_WISHLIST':
      return {
        ...state,
        wishlist: {
          ...state.wishlist,
          items: [...state.wishlist.items, action.payload],
        },
      };
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: {
          ...state.wishlist,
          items: state.wishlist.items.filter(item => item._id !== action.payload),
        },
      };

    // Recently viewed actions
    case 'ADD_TO_RECENTLY_VIEWED':
      return {
        ...state,
        recentlyViewed: [
          action.payload,
          ...state.recentlyViewed.filter(item => item._id !== action.payload._id),
        ].slice(0, 10),
      };

    // Compare list actions
    case 'SET_COMPARE_LIST':
      return { ...state, compareList: action.payload };
    case 'ADD_TO_COMPARE':
      return {
        ...state,
        compareList: [...state.compareList, action.payload].slice(0, 4),
      };
    case 'REMOVE_FROM_COMPARE':
      return {
        ...state,
        compareList: state.compareList.filter(item => item._id !== action.payload),
      };

    // Filter actions
    case 'SET_FILTER':
      return {
        ...state,
        filters: { ...state.filters, [action.payload.key]: action.payload.value },
      };
    case 'CLEAR_FILTERS':
      return { ...state, filters: initialState.filters };

    // Categories actions
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };

    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  // Load initial data
  useEffect(() => {
    loadCart();
    loadWishlist();
  }, []);

  // Cart functions
  const loadCart = async () => {
    try {
      dispatch({ type: 'SET_CART_LOADING', payload: true });
      const data = await cartAPI.get();
      dispatch({ type: 'SET_CART_ITEMS', payload: data.items });
    } catch (error) {
      dispatch({ type: 'SET_CART_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_CART_LOADING', payload: false });
    }
  };

  const addToCart = async (productId, quantity = 1, variantId = null) => {
    try {
      dispatch({ type: 'SET_CART_LOADING', payload: true });
      const data = await cartAPI.addItem(productId, quantity, variantId);
      dispatch({ type: 'SET_CART_ITEMS', payload: data.items });
      return data;
    } catch (error) {
      dispatch({ type: 'SET_CART_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_CART_LOADING', payload: false });
    }
  };

  // Wishlist functions
  const loadWishlist = async () => {
    try {
      dispatch({ type: 'SET_WISHLIST_LOADING', payload: true });
      const data = await wishlistAPI.get();
      dispatch({ type: 'SET_WISHLIST_ITEMS', payload: data.products });
    } catch (error) {
      dispatch({ type: 'SET_WISHLIST_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_WISHLIST_LOADING', payload: false });
    }
  };

  const toggleWishlist = async (productId) => {
    try {
      dispatch({ type: 'SET_WISHLIST_LOADING', payload: true });
      if (state.wishlist.items.some(item => item._id === productId)) {
        await wishlistAPI.remove(productId);
        dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
      } else {
        const data = await wishlistAPI.add(productId);
        dispatch({ type: 'ADD_TO_WISHLIST', payload: data.product });
      }
    } catch (error) {
      dispatch({ type: 'SET_WISHLIST_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_WISHLIST_LOADING', payload: false });
    }
  };

  // Filter functions
  const setFilter = (key, value) => {
    dispatch({ type: 'SET_FILTER', payload: { key, value } });
  };

  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  const value = {
    ...state,
    dispatch,
    addToCart,
    toggleWishlist,
    setFilter,
    clearFilters,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

export default StoreContext;
