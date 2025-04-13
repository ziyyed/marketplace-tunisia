import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
import FilterBar from '../components/Filter/FilterBar';
import ListingCard from '../components/Listing/ListingCard';

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    location: searchParams.get('location') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
  });

  const query = searchParams.get('q') || '';

  const { data: listings, isLoading, error } = useQuery({
    queryKey: ['search', query, filters],
    queryFn: () => api.listings.search(query, filters),
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    const params = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          {query ? `Search results for "${query}"` : 'Browse Listings'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {listings?.length || 0} listings found
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </Grid>

        <Grid item xs={12} md={9}>
          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">
              Error loading listings. Please try again later.
            </Alert>
          ) : listings?.length === 0 ? (
            <Alert severity="info">
              No listings found matching your criteria.
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {listings?.map((listing) => (
                <Grid item xs={12} sm={6} md={4} key={listing._id}>
                  <ListingCard listing={listing} />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Search; 