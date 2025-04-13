import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { api } from '../services/api';
import ListingCard from '../components/Listing/ListingCard';

const Favorites = () => {
  const { data: favorites, isLoading, error } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => api.listings.getFavorites(),
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          My Favorites
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {favorites?.length || 0} saved listings
        </Typography>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">
          Error loading favorites. Please try again later.
        </Alert>
      ) : favorites?.length === 0 ? (
        <Alert severity="info">
          You haven't saved any listings yet. Start browsing to find items you like!
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {favorites?.map((listing) => (
            <Grid item xs={12} sm={6} md={4} key={listing._id}>
              <ListingCard listing={listing} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Favorites; 