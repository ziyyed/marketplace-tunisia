import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Home = () => {
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Marketplace Tunisia
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Buy and sell items in Tunisia
        </Typography>
      </Box>
    </Container>
  );
};

export default Home; 