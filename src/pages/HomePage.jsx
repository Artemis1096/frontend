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
    <Container>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Active Auctions
      </Typography>

      {loading && (
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && auctions.length === 0 && (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          No active auctions found. Check back later!
        </Typography>
      )}

      {!loading && !error && auctions.length > 0 && (
        <Grid container spacing={4}>
          {auctions.map((auction) => (
            <Grid item key={auction._id} xs={12} sm={6} md={4}>
              <AuctionCard auction={auction} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default HomePage;