// In frontend/src/pages/AuctionDetailPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import auctionService from '../services/auction.service';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Grid,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import { format } from 'date-fns';

const AuctionDetailPage = () => {
  const { id } = useParams(); // Get auction ID from URL
  const { user } = useAuth(); // Get current user
  
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [bidError, setBidError] = useState('');

  // Per our project spec: Simple "live" updates by polling
  const POLLING_INTERVAL = 10000; // 10 seconds

  // Put fetch logic in useCallback to use in useEffect & interval
  const fetchAuction = useCallback(async () => {
    try {
      const data = await auctionService.getAuctionById(id);
      setAuction(data);
      
      // Set default bid amount based on new data
      if (!bidAmount) {
        const minIncrement = getMinBidIncrement(data.currentPrice);
        setBidAmount((data.currentPrice + minIncrement).toFixed(2));
      }
      
      setError('');
    } catch (err) {
      setError('Failed to fetch auction details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id, bidAmount]); // Include bidAmount in dep to avoid overwriting

  // Initial fetch and set up polling
  useEffect(() => {
    fetchAuction(); // Fetch immediately on mount

    const intervalId = setInterval(fetchAuction, POLLING_INTERVAL);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchAuction]); // useEffect depends on the memoized fetchAuction

  
  // --- Bid Increment Logic (from backend) ---
  const getMinBidIncrement = (currentPrice) => {
    if (currentPrice >= 0 && currentPrice <= 49.99) return 0.50;
    if (currentPrice >= 50 && currentPrice <= 499.99) return 2.00;
    return 5.00;
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setBidError('');
    
    if (!user) {
      setBidError('You must be logged in to place a bid.');
      return;
    }
    
    const amountNum = parseFloat(bidAmount);
    if (isNaN(amountNum)) {
      setBidError('Please enter a valid number.');
      return;
    }

    try {
      const updatedAuction = await auctionService.placeBid(id, amountNum);
      setAuction(updatedAuction); // Immediately update UI with new auction state
      
      // Set new min bid in the input
      const minIncrement = getMinBidIncrement(updatedAuction.currentPrice);
      setBidAmount((updatedAuction.currentPrice + minIncrement).toFixed(2));

    } catch (err) {
      setBidError(err.response?.data?.message || 'Bid failed.');
    }
  };

  if (loading) {
    return (
      <Grid container justifyContent="center" sx={{ mt: 5 }}>
        <CircularProgress />
      </Grid>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  }

  if (!auction) {
    return <Alert severity="warning" sx={{ mt: 2 }}>Auction not found.</Alert>;
  }

  // --- Check auction status ---
  const isAuctionEnded = new Date() > new Date(auction.endTime);
  const isAuctionActive = auction.status === 'Active' && !isAuctionEnded;
  const isSeller = user && user._id === auction.seller._id;
  const winner = auction.bids.length > 0 ? auction.bids[auction.bids.length - 1] : null;

  return (
    <Container>
      <Typography variant="h3" component="h1" gutterBottom>
        {auction.title}
      </Typography>

      <Grid container spacing={4}>
        {/* Left Side: Image & Description */}
        <Grid item xs={12} md={7}>
          <Box
            component="img"
            src={auction.imageUrl}
            alt={auction.title}
            sx={{ width: '100%', height: 'auto', borderRadius: 2 }}
          />
          <Typography variant="h6" sx={{ mt: 2 }}>Description</Typography>
          <Typography variant="body1">{auction.description}</Typography>
        </Grid>

        {/* Right Side: Bidding Box & Info */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3 }}>
            
            {/* --- 1. Auction Ended View --- */}
            {isAuctionEnded && (
              <Box>
                <Typography variant="h4" color="error" gutterBottom>Auction Ended</Typography>
                {winner ? (
                  <>
                    <Typography variant="h6">Winner:</Typography>
                    <Typography variant="h5" color="primary">{winner.bidder.email}</Typography>
                    <Typography variant="h6" sx={{ mt: 2 }}>Winning Bid:</Typography>
                    <Typography variant="h5" color="primary">${auction.currentPrice.toFixed(2)}</Typography>
                  </>
                ) : (
                  <Typography variant="h6">This auction ended with no bids.</Typography>
                )}
                
                {/* Simulated Payment Button */}
                {user && winner && user._id === winner.bidder._id && (
                  <Button variant="contained" color="success" sx={{ mt: 3 }} fullWidth>
                    Proceed to Pay (Simulation)
                  </Button>
                )}
              </Box>
            )}

            {/* --- 2. Auction Pending/Inactive View --- */}
            {!isAuctionActive && !isAuctionEnded && (
               <Typography variant="h5" color="text.secondary">
                 This auction is not yet active.
               </Typography>
            )}

            {/* --- 3. Auction Active View --- */}
            {isAuctionActive && (
              <Box>
                <Typography variant="h4" gutterBottom>
                  Current Bid: ${auction.currentPrice.toFixed(2)}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  Ends: {format(new Date(auction.endTime), "PPpp")}
                </Typography>
                
                <Box component="form" onSubmit={handleBidSubmit} sx={{ mt: 3 }}>
                  <TextField
                    label={`Min Bid: $${(auction.currentPrice + getMinBidIncrement(auction.currentPrice)).toFixed(2)}`}
                    variant="outlined"
                    fullWidth
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    disabled={isSeller}
                  />
                  
                  {isSeller && (
                    <Alert severity="info" sx={{ mt: 1 }}>You cannot bid on your own auction.</Alert>
                  )}
                  
                  {bidError && (
                    <Alert severity="error" sx={{ mt: 2 }}>{bidError}</Alert>
                  )}
                  
                  {!user && (
                    <Button 
                      variant="contained" 
                      fullWidth 
                      sx={{ mt: 2 }}
                      component={RouterLink}
                      to={`/login?redirect=/auction/${id}`}
                    >
                      Login to Place Bid
                    </Button>
                  )}

                  {user && !isSeller && (
                    <Button 
                      type="submit" 
                      variant="contained" 
                      fullWidth 
                      sx={{ mt: 2 }}
                      size="large"
                    >
                      Place Bid
                    </Button>
                  )}
                </Box>
              </Box>
            )}

          </Paper>

          {/* Bid History */}
          <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6">Bid History</Typography>
            <Divider sx={{ my: 1 }} />
            <List>
              {auction.bids.length === 0 && (
                <ListItem>
                  <ListItemText primary="No bids yet. Be the first!" />
                </ListItem>
              )}
              {/* Show bids in reverse order (newest first) */}
              {[...auction.bids].reverse().map((bid) => (
                <ListItem key={bid._id}>
                  <ListItemIcon><GavelIcon /></ListItemIcon>
                  <ListItemText 
                    primary={`$${bid.amount.toFixed(2)}`}
                    secondary={`by ${bid.bidder.email} at ${format(new Date(bid.bidTime), 'p, MMM d')}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AuctionDetailPage;