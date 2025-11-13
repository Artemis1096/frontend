// In frontend/src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  // Check localStorage for an existing user
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      // Set the auth token for all future axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
      return userData;
    }
    return null;
  });

  // 3. Login Function
  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    setUser(userData);
  };

  // 4. Logout Function
  const logout = () => {
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // 5. Value to be passed to consumers
  const value = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 6. Create a custom hook for easy access
export const useAuth = () => {
  return useContext(AuthContext);
};