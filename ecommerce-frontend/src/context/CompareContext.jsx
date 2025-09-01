import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareItems, setCompareItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchCompareList();
  }, [token]);

  const fetchCompareList = async () => {
    if (!token) {
      setCompareItems([]);
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get('http://localhost:5000/api/compare', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Ensure response.data is an array before setting the compareItems
      setCompareItems(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching compare list:', error);
      setCompareItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCompare = async (productId) => {
    if (!token) return false;
    try {
      const response = await axios.post(`http://localhost:5000/api/compare/add/${productId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompareItems(Array.isArray(response.data) ? response.data : []);
      return true;
    } catch (error) {
      console.error('Error adding to compare:', error);
      return false;
    }
  };

  const removeFromCompare = async (productId) => {
    if (!token) return false;
    try {
      const response = await axios.delete(`http://localhost:5000/api/compare/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompareItems(Array.isArray(response.data) ? response.data : []);
      return true;
    } catch (error) {
      console.error('Error removing from compare:', error);
      return false;
    }
  };

  const clearCompareList = async () => {
    if (!token) return false;
    try {
      await axios.delete('http://localhost:5000/api/compare/clear', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompareItems(Array.isArray(response.data) ? response.data : []);
      return true;
    } catch (error) {
      console.error('Error clearing compare list:', error);
      return false;
    }
  };

  const isInCompareList = (productId) => {
    return compareItems.some(item => item._id === productId);
  };

  return (
    <CompareContext.Provider value={{
      compareItems,
      loading,
      addToCompare,
      removeFromCompare,
      clearCompareList,
      isInCompareList
    }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};