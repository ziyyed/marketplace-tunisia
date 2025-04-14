import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Slider,
  Button,
  Paper,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { listings } from '../services/api';
import ListingCard from '../components/Listing/ListingCard';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    query: searchParams.get('query') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
  });

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['searchResults', filters],
    queryFn: () => listings.search(filters),
  });

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    setSearchParams(newFilters);
  };

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Vehicles',
    'Property',
    'Jobs',
    'Services',
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Filters Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>

            <TextField
              fullWidth
              label="Search"
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                label="Category"
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography gutterBottom>Price Range</Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Min Price"
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Max Price"
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </Grid>
            </Grid>

            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={filters.sortBy}
                label="Sort By"
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
                <MenuItem value="price_asc">Price: Low to High</MenuItem>
                <MenuItem value="price_desc">Price: High to Low</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => {
                setFilters({
                  query: '',
                  category: '',
                  minPrice: '',
                  maxPrice: '',
                  sortBy: 'newest',
                });
                setSearchParams({});
              }}
            >
              Clear Filters
            </Button>
          </Paper>
        </Grid>

        {/* Results Grid */}
        <Grid item xs={12} md={9}>
          <Typography variant="h5" gutterBottom>
            {searchResults?.length || 0} Results Found
          </Typography>

          {isLoading ? (
            <Typography>Loading...</Typography>
          ) : searchResults?.length === 0 ? (
            <Typography>No listings found matching your criteria.</Typography>
          ) : (
            <Grid container spacing={3}>
              {searchResults?.map((listing) => (
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