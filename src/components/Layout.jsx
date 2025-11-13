// In frontend/src/components/Layout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // We'll create this next
import { Container } from '@mui/material';

const Layout = () => {
  return (
    <>
      <Navbar />
      <Container component="main" sx={{ mt: 4, mb: 4 }}>
        <Outlet /> 
      </Container>
    </>
  );
};

export default Layout;