// In frontend/src/components/Navbar.jsx

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import GavelIcon from '@mui/icons-material/Gavel';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <GavelIcon sx={{ mr: 1 }} />
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          MERN Auction
        </Typography>

        <Box>
          {user ? (
            <>
              <Typography variant="subtitle1" component="span" sx={{ mr: 2 }}>
                Welcome, {user.email}
              </Typography>

              {/* --- Admin Link --- */}
              {user.role === 'admin' && (
                <Button color="inherit" component={RouterLink} to="/admin">
                  Admin Panel
                </Button>
              )}
              {/* -------------------- */}
              
              <Button color="inherit" component={RouterLink} to="/auctions/new">
                Create Auction
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Login
              </Button>
              <Button color="inherit" component={RouterLink} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;