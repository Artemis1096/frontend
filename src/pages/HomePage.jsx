// In frontend/src/pages/HomePage.jsx

import React, { useState, useEffect } from 'react';
import auctionService from '../services/auction.service';
import AuctionCard from '../components/AuctionCard';
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';

const HomePage = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);
        const data = await auctionService.getActiveAuctions();
        setAuctions(data);
        setError('');
      } catch (err) {
        setError('Failed to fetch auctions. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <Container maxWidth="xl" className="page-transition">
      {/* Header Section */}
      <Box
        sx={{
          textAlign: 'center',
          mb: 6,
          py: 4,
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          Active Auctions
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Discover unique items and place your bids. Find something special today!
        </Typography>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
          }}
        >
          <CircularProgress size={60} thickness={4} />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert
          severity="error"
          sx={{
            mt: 2,
            borderRadius: 2,
            '& .MuiAlert-message': {
              width: '100%',
            },
          }}
        >
          {error}
        </Alert>
      )}

      {/* Empty State */}
      {!loading && !error && auctions.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 2,
          }}
        >
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No active auctions found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Check back later for new listings!
          </Typography>
        </Box>
      )}

      {/* Auctions Grid */}
      {!loading && !error && auctions.length > 0 && (
        <Grid container spacing={3}>
          {auctions.map((auction) => (
            <Grid item key={auction._id} xs={12} sm={6} md={4} lg={3}>
              <AuctionCard auction={auction} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default HomePage;