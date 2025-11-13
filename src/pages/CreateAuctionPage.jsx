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
  Paper,
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
    <Container maxWidth="md" className="page-transition">
      <Box sx={{ my: 4 }}>
        <Typography
          component="h1"
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          Create New Auction
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
          Fill out the details for your item. All listings must be approved by an
          admin before they go live.
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Auction Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              sx={{ mb: 2 }}
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
              sx={{ mb: 2 }}
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
              InputProps={{
                startAdornment: (
                  <Typography sx={{ mr: 1, color: 'text.secondary' }}>$</Typography>
                ),
              }}
              sx={{ mb: 2 }}
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
              sx={{ mb: 2 }}
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
              sx={{ mb: 2 }}
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2, mb: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mt: 2, mb: 2, borderRadius: 2 }}>
                {success}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
                },
                '&:disabled': {
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit for Approval'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateAuctionPage;