// In frontend/src/services/auth.service.js

import axios from 'axios';

// Our proxy in vite.config.js will handle the base URL
const API_URL = '/api/users/';

// Register user
const register = async (email, password) => {
  const response = await axios.post(API_URL + 'register', {
    email,
    password,
  });
  
  // Our backend sends back the user data on success
  return response.data;
};

// Login user
const login = async (email, password) => {
  const response = await axios.post(API_URL + 'login', {
    email,
    password,
  });

  return response.data;
};

const authService = {
  register,
  login,
};

export default authService;