// In frontend/src/services/auction.service.js

import axios from 'axios';

// Our proxy in vite.config.js will handle the base URL
const API_URL = '/api/auctions/';

// Get all active auctions (for homepage)
const getActiveAuctions = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get a single auction by ID
const getAuctionById = async (id) => {
  const response = await axios.get(API_URL + id);
  return response.data;
};

// --- We will add more functions here later ---
// createAuction
// placeBid
// getPendingAuctions
// approveAuction

const placeBid = async (auctionId, amount) => {
  // We need to be logged in, but the AuthContext/axios header handles sending the token
  const response = await axios.post(API_URL + `${auctionId}/bids`, { amount });
  return response.data;
};

const createAuction = async (auctionData) => {
  // auctionData = { title, description, startPrice, startTime, endTime }
  // Token is sent automatically from AuthContext
  const response = await axios.post(API_URL, auctionData);
  return response.data;
};

// Get all pending auctions (Admin only)
const getPendingAuctions = async () => {
  const response = await axios.get(API_URL + 'admin/pending');
  return response.data;
};

// Approve an auction (Admin only)
const approveAuction = async (id) => {
  const response = await axios.put(API_URL + `admin/approve/${id}`);
  return response.data;
};

// --- UPDATE YOUR EXPORTS AT THE BOTTOM ---
const auctionService = {
  getActiveAuctions,
  getAuctionById,
  placeBid,
  createAuction,      // <-- ADD THIS
  getPendingAuctions, // <-- ADD THIS
  approveAuction,     // <-- ADD THIS
};

export default auctionService;

