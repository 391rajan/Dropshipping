import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareItems, setCompareItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompareList();
  }, []);

  const fetchCompareList = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/compare', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCompareItems(response.data);
    } catch (error) {
      console.error('Error fetching compare list:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCompare = async (productId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/compare/add/${productId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCompareItems(response.data);
      return true;
    } catch (error) {
      console.error('Error adding to compare:', error);
      return false;
    }
  };

  const removeFromCompare = async (productId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/compare/remove/${productId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCompareItems(response.data);
      return true;
    } catch (error) {
      console.error('Error removing from compare:', error);
      return false;
    }
  };

  const clearCompareList = async () => {
    try {
      await axios.delete('http://localhost:5000/api/compare/clear', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCompareItems([]);
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
