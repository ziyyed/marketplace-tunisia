import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Container, Typography, Box, CircularProgress, Alert, Grid, Paper, Button } from '@mui/material';
import { listings } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Listing = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const { data: listing, isLoading, error } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => listings.getById(id),
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error.message}
      </Alert>
    );
  }

  if (!listing) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        Listing not found
      </Alert>
    );
  }

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              {listing.title}
            </Typography>
            <Box sx={{ mb: 3 }}>
              <img
                src={listing.images[0] || '/placeholder.jpg'}
                alt={listing.title}
                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
              />
            </Box>
            <Typography variant="h5" color="primary" gutterBottom>
              {listing.price} TND
            </Typography>
            <Typography variant="body1" paragraph>
              {listing.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Category: {listing.category}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Location: {listing.location}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Posted on: {new Date(listing.createdAt).toLocaleDateString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Seller Information
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <img
                src={listing.seller.avatar || '/default-avatar.jpg'}
                alt={listing.seller.name}
                style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }}
              />
              <Typography variant="body1">{listing.seller.name}</Typography>
            </Box>
            {user && user._id !== listing.seller._id && (
              <Button variant="contained" color="primary" fullWidth>
                Contact Seller
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Listing; 