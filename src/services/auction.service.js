// frontend/src/services/auction.service.js

import axios from 'axios';

// Use environment variable in production; fall back to Vite proxy in dev
const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/auctions/`
  : `/api/auctions/`;

// Get all active auctions (for homepage)
const getActiveAuctions = async () => {
  const response = await axios.get(API_BASE);
  return response.data;
};

// Get a single auction by ID
const getAuctionById = async (id) => {
  const response = await axios.get(API_BASE + id);
  return response.data;
};

// Place a bid on an auction
const placeBid = async (auctionId, amount) => {
  const response = await axios.post(API_BASE + `${auctionId}/bids`, { amount });
  return response.data;
};

// Create a new auction
const createAuction = async (auctionData) => {
  const response = await axios.post(API_BASE, auctionData);
  return response.data;
};

// Get all pending auctions (Admin only)
const getPendingAuctions = async () => {
  const response = await axios.get(API_BASE + 'admin/pending');
  return response.data;
};

// Approve an auction (Admin only)
const approveAuction = async (id) => {
  const response = await axios.put(API_BASE + `admin/approve/${id}`);
  return response.data;
};

const auctionService = {
  getActiveAuctions,
  getAuctionById,
  placeBid,
  createAuction,
  getPendingAuctions,
  approveAuction,
};

export default auctionService;
