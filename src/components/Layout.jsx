// In frontend/src/components/Layout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // We'll create this next
import { Container } from '@mui/material';

const Layout = () => {
  return (
    <>
      <Navbar />
      <Container
        component="main"
        maxWidth={false}
        sx={{
          mt: 2,
          mb: 4,
          minHeight: 'calc(100vh - 100px)',
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;