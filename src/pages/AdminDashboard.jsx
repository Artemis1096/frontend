// In frontend/src/pages/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import auctionService from '../services/auction.service';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { format } from 'date-fns';

// TabPanel helper component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminDashboard = () => {
  const [tab, setTab] = useState(0);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const fetchPending = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await auctionService.getPendingAuctions();
      setPending(data);
    } catch (err) {
      setError('Failed to fetch pending auctions.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when the component mounts or the tab is changed to 0
  useEffect(() => {
    if (tab === 0) {
      fetchPending();
    }
  }, [tab]);

  const handleApprove = async (id) => {
    try {
      await auctionService.approveAuction(id);
      // Remove the approved item from the list instantly
      setPending((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      setError('Failed to approve auction.');
    }
  };

  return (
    <Container maxWidth="lg" className="page-transition">
      <Box sx={{ my: 4 }}>
        <Typography
          variant="h4"
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
          Admin Dashboard
        </Typography>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tab}
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                },
              }}
            >
              <Tab label="Pending Approvals" />
              <Tab label="Dispute Reports" />
              <Tab label="Manage Payments" />
            </Tabs>
          </Box>

        {/* Tab 1: Pending Approvals */}
        <TabPanel value={tab} index={0}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Pending Auction Listings
          </Typography>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
          {!loading && !error && (
            <List sx={{ p: 0 }}>
              {pending.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary="No pending auctions."
                    primaryTypographyProps={{
                      color: 'text.secondary',
                      fontStyle: 'italic',
                    }}
                  />
                </ListItem>
              )}
              {pending.map((item) => (
                <React.Fragment key={item._id}>
                  <ListItem
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      backgroundColor: 'background.default',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                      transition: 'all 0.2s ease',
                    }}
                    secondaryAction={
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleApprove(item._id)}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                          px: 3,
                        }}
                      >
                        Approve
                      </Button>
                    }
                  >
                    <ListItemText
                      primary={
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {item.title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Seller: {item.seller.email} • Starting Price: ${item.startPrice} • Created: {format(new Date(item.createdAt), 'PP')}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider sx={{ my: 1 }} />
                </React.Fragment>
              ))}
            </List>
          )}
        </TabPanel>

        {/* Tab 2: Reports (Placeholder) */}
        <TabPanel value={tab} index={1}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Reported Items
          </Typography>
          <Box
            sx={{
              textAlign: 'center',
              py: 6,
              color: 'text.secondary',
            }}
          >
            <Typography variant="body1">
              No reported items found. (This feature is pending.)
            </Typography>
          </Box>
        </TabPanel>

        {/* Tab 3: Payments (Placeholder) */}
        <TabPanel value={tab} index={2}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Transaction Management (Simulation)
          </Typography>
          <Box
            sx={{
              textAlign: 'center',
              py: 6,
              color: 'text.secondary',
            }}
          >
            <Typography variant="body1">
              A list of all transactions and their status ("Paid", "Pending Payment")
              would appear here.
            </Typography>
          </Box>
        </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminDashboard;