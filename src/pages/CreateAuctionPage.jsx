// In frontend/src/pages/CreateAuctionPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import auctionService from '../services/auction.service';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';

const CreateAuctionPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startPrice: '',
    startTime: '',
    endTime: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Basic validation
      if (new Date(formData.endTime) <= new Date(formData.startTime)) {
        throw new Error('End time must be after start time.');
      }
      
      await auctionService.createAuction(formData);
      setSuccess('Auction created! It is now pending admin approval.');
      // Clear form
      setFormData({ title: '', description: '', startPrice: '', startTime: '', endTime: '' });
      // Optionally, redirect
      // navigate('/'); 
    } catch (err) {
      setError(err.message || err.response?.data?.message || 'Failed to create auction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Create New Auction
        </Typography>
        <Typography variant="body1" gutterBottom>
          Fill out the details for your item. All listings must be approved by an
          admin before they go live.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Auction Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Description"
            name="description"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Starting Price ($)"
            name="startPrice"
            type="number"
            value={formData.startPrice}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Auction Start Time"
            name="startTime"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={formData.startTime}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Auction End Time"
            name="endTime"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={formData.endTime}
            onChange={handleChange}
          />

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit for Approval'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateAuctionPage;