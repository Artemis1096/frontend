// frontend/src/services/auth.service.js

import axios from 'axios';

// Use environment variable in production; fallback to proxy during development
const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/users/`
  : `/api/users/`;

// Register user
const register = async (email, password) => {
  const response = await axios.post(API_BASE + 'register', {
    email,
    password,
  });

  return response.data;
};

// Login user
const login = async (email, password) => {
  const response = await axios.post(API_BASE + 'login', {
    email,
    password,
  });

  return response.data;
};

// Export services
const authService = {
  register,
  login,
};

export default authService;
