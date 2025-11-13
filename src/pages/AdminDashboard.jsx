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
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Admin Dashboard
      </Typography>
      <Paper>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={handleTabChange}>
            <Tab label="Pending Approvals" />
            <Tab label="Dispute Reports" />
            <Tab label="Manage Payments" />
          </Tabs>
        </Box>

        {/* Tab 1: Pending Approvals */}
        <TabPanel value={tab} index={0}>
          <Typography variant="h6" gutterBottom>Pending Auction Listings</Typography>
          {loading && <CircularProgress />}
          {error && <Alert severity="error">{error}</Alert>}
          {!loading && !error && (
            <List>
              {pending.length === 0 && (
                <ListItem><ListItemText primary="No pending auctions." /></ListItem>
              )}
              {pending.map((item) => (
                <React.Fragment key={item._id}>
                  <ListItem
                    secondaryAction={
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleApprove(item._id)}
                      >
                        Approve
                      </Button>
                    }
                  >
                    <ListItemText
                      primary={item.title}
                      secondary={
                        `Seller: ${item.seller.email} | Price: $${item.startPrice} | 
                         Created: ${format(new Date(item.createdAt), 'PP')}`
                      }
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </TabPanel>

        {/* Tab 2: Reports (Placeholder) */}
        <TabPanel value={tab} index={1}>
          <Typography variant="h6">Reported Items</Typography>
          <Typography>
            No reported items found. (This feature is pending.)
          </Typography>
        </TabPanel>

        {/* Tab 3: Payments (Placeholder) */}
        <TabPanel value={tab} index={2}>
          <Typography variant="h6">Transaction Management (Simulation)</Typography>
          <Typography>
            A list of all transactions and their status ("Paid", "Pending Payment")
            would appear here.
          </Typography>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;