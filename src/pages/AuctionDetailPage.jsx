// In frontend/src/pages/AuctionDetailPage.jsx

import React, { useState, useEffect, useCallback, Fragment } from 'react';
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
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import { format } from 'date-fns';
import Badge from '../components/Badge';

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
    <Container maxWidth="lg" className="page-transition">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
          }}
        >
          {auction.title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {isAuctionEnded && <Badge label="Auction Ended" type="ended" />}
          {isAuctionActive && !isAuctionEnded && (
            <Badge label="Active" type="new" />
          )}
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Left Side: Image & Description */}
        <Grid item xs={12} md={7}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              mb: 3,
            }}
          >
            <Box
              component="img"
              src={auction.imageUrl}
              alt={auction.title}
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                display: 'block',
                maxHeight: '600px',
                objectFit: 'contain',
              }}
            />
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}
            >
              Description
            </Typography>
            <Typography
              variant="body1"
              sx={{ lineHeight: 1.8, color: 'text.secondary' }}
            >
              {auction.description}
            </Typography>
          </Paper>
        </Grid>

        {/* Right Side: Bidding Box & Info */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              position: 'sticky',
              top: 100,
            }}
          >
            
            {/* --- 1. Auction Ended View --- */}
            {isAuctionEnded && (
              <Box>
                <Box
                  sx={{
                    textAlign: 'center',
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'error.light',
                    color: 'white',
                  }}
                >
                  <Typography variant="h5" fontWeight={700} gutterBottom>
                    Auction Ended
                  </Typography>
                </Box>
                {winner ? (
                  <>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Winner
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: 'primary.light',
                          color: 'white',
                        }}
                      >
                        <PersonIcon />
                        <Typography variant="h6" fontWeight={600}>
                          {winner.bidder.email}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Winning Bid
                      </Typography>
                      <Typography
                        variant="h3"
                        color="primary"
                        sx={{
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <GavelIcon sx={{ fontSize: 32 }} />
                        ${auction.currentPrice.toFixed(2)}
                      </Typography>
                    </Box>
                    {user && winner && user._id === winner.bidder._id && (
                      <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        size="large"
                        sx={{
                          mt: 2,
                          py: 1.5,
                          borderRadius: 2,
                          fontWeight: 600,
                        }}
                      >
                        Proceed to Pay (Simulation)
                      </Button>
                    )}
                  </>
                ) : (
                  <Typography variant="h6" color="text.secondary" align="center">
                    This auction ended with no bids.
                  </Typography>
                )}
              </Box>
            )}

            {/* --- 2. Auction Pending/Inactive View --- */}
            {!isAuctionActive && !isAuctionEnded && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  This auction is not yet active.
                </Typography>
              </Box>
            )}

            {/* --- 3. Auction Active View --- */}
            {isAuctionActive && (
              <Box>
                {/* Current Bid Display */}
                <Box
                  sx={{
                    textAlign: 'center',
                    mb: 3,
                    p: 3,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    color: 'white',
                  }}
                >
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Current Bid
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                    }}
                  >
                    <GavelIcon sx={{ fontSize: 32 }} />
                    ${auction.currentPrice.toFixed(2)}
                  </Typography>
                </Box>

                {/* Time Left */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'background.default',
                  }}
                >
                  <AccessTimeIcon color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Ends on
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {format(new Date(auction.endTime), "PPpp")}
                    </Typography>
                  </Box>
                </Box>

                {/* Bidding Form */}
                <Box component="form" onSubmit={handleBidSubmit}>
                  <TextField
                    label={`Minimum Bid: $${(auction.currentPrice + getMinBidIncrement(auction.currentPrice)).toFixed(2)}`}
                    variant="outlined"
                    fullWidth
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    disabled={isSeller}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        fontSize: '1.1rem',
                        fontWeight: 600,
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <Typography sx={{ mr: 1, color: 'text.secondary' }}>$</Typography>
                      ),
                    }}
                  />

                  {isSeller && (
                    <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
                      You cannot bid on your own auction.
                    </Alert>
                  )}

                  {bidError && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                      {bidError}
                    </Alert>
                  )}

                  {!user && (
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      component={RouterLink}
                      to={`/login?redirect=/auction/${id}`}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                        },
                      }}
                    >
                      Login to Place Bid
                    </Button>
                  )}

                  {user && !isSeller && (
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="large"
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
                        },
                      }}
                    >
                      Place Bid
                    </Button>
                  )}
                </Box>
              </Box>
            )}

          </Paper>

          {/* Bid History */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mt: 3,
              borderRadius: 3,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Bid History
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List sx={{ p: 0 }}>
              {auction.bids.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary="No bids yet. Be the first!"
                    primaryTypographyProps={{
                      color: 'text.secondary',
                      fontStyle: 'italic',
                    }}
                  />
                </ListItem>
              )}
              {/* Show bids in reverse order (newest first) */}
              {[...auction.bids].reverse().map((bid, index) => (
                <Fragment key={bid._id}>
                  <ListItem
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      backgroundColor: index === 0 ? 'primary.light' : 'transparent',
                      color: index === 0 ? 'white' : 'inherit',
                      '&:hover': {
                        backgroundColor: index === 0 ? 'primary.main' : 'action.hover',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <ListItemIcon sx={{ color: index === 0 ? 'white' : 'primary.main' }}>
                      <GavelIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: index === 0 ? 'white' : 'primary.main',
                          }}
                        >
                          ${bid.amount.toFixed(2)}
                          {index === 0 && (
                            <Box component="span" sx={{ ml: 1, display: 'inline-block' }}>
                              <Badge
                                label="Highest"
                                type="highest-bidder"
                                className="pulse-badge"
                              />
                            </Box>
                          )}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{ color: index === 0 ? 'rgba(255,255,255,0.8)' : 'text.secondary' }}
                        >
                          by {bid.bidder.email} • {format(new Date(bid.bidTime), 'MMM d, h:mm a')}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < auction.bids.length - 1 && <Divider />}
                </Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AuctionDetailPage;