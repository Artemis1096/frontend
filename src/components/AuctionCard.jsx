// In frontend/src/components/AuctionCard.jsx

import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { format } from 'date-fns'; // We'll install this next

const AuctionCard = ({ auction }) => {
  // Format the end time to be readable
  const formattedEndTime = format(new Date(auction.endTime), "PPpp"); // e.g., "Nov 11, 2025, 5:12 PM"

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={auction.imageUrl} // Using the placeholder URL from our backend
        alt={auction.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {auction.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {/* Truncate long descriptions */}
          {auction.description.substring(0, 100)}...
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          Current Bid: ${auction.currentPrice.toFixed(2)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Ends: {formattedEndTime}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          component={RouterLink}
          to={`/auction/${auction._id}`}
          variant="contained"
          fullWidth
        >
          View & Bid
        </Button>
      </Box>
    </Card>
  );
};

export default AuctionCard;