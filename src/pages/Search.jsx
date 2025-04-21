import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Grid,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Box,
  Typography,
  CircularProgress,
  Divider,
  Chip,
  Paper
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { listings } from '../services/api';
import ListingCard from '../components/Listing/ListingCard';
import { Search as SearchIcon, FilterList } from '@mui/icons-material';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    query: searchParams.get('q') || searchParams.get('query') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    condition: searchParams.get('condition') || '',
    city: searchParams.get('city') || ''
  });

  // Update filters whenever the URL params change
  useEffect(() => {
    setFilters({
      query: searchParams.get('q') || searchParams.get('query') || '',
      category: searchParams.get('category') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      condition: searchParams.get('condition') || '',
      city: searchParams.get('city') || ''
    });
  }, [searchParams]);

  // Fetch listings based on filters
  const { data: searchResults, isLoading, error, refetch } = useQuery({
    queryKey: ['searchListings', filters],
    queryFn: () => listings.search(filters),
    enabled: true,
    retry: 1,
    refetchOnWindowFocus: false,
    onError: (err) => {
      console.error("Error fetching listings:", err);
    }
  });

  const handleSearch = () => {
    // Update the URL with the filter parameters
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    setSearchParams(params);
    refetch();
  };

  const handleFilterChange = (name, value) => {
    if (name === 'category' && (value === 'Services' || value === 'Jobs')) {
      // Clear condition filter when category is Services or Jobs
      setFilters(prev => ({
        ...prev,
        [name]: value,
        condition: ''
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const categories = [
    'Electronics',
    'Home & Garden',
    'Vehicles',
    'Jobs',
    'Services',
    'Fashion'
  ];

  const conditions = [
    'New',
    'Used - Like New',
    'Used - Good',
    'Used - Fair',
    'Used - Poor',
    'For Parts'
  ];

  const cities = [
    'Tunis', 'Sfax', 'Sousse', 'Kairouan', 'Bizerte', 'Gabès', 'Ariana',
    'Gafsa', 'Monastir', 'Ben Arous', 'La Marsa', 'Kasserine', 'Médenine',
    'Nabeul', 'Hammamet'
  ];

  // Prepare data for display
  const listingsData = searchResults || [];
  const totalListings = listingsData.length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Search Listings
      </Typography>

      {/* Search filters */}
      <Paper elevation={2} sx={{ mb: 4, p: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search keywords"
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
              }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                label="Category"
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} md={2}>
            <TextField
              fullWidth
              label="Min Price (TND)"
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            />
          </Grid>

          <Grid item xs={6} md={2}>
            <TextField
              fullWidth
              label="Max Price (TND)"
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={1}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSearch}
              sx={{ height: '56px' }}
              startIcon={<SearchIcon />}
            >
              Search
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Divider sx={{ mb: 2 }}>
            <Chip label="Additional Filters" icon={<FilterList />} />
          </Divider>
          <Grid container spacing={2}>
            {filters.category !== 'Services' && filters.category !== 'Jobs' && (
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Condition</InputLabel>
                  <Select
                    value={filters.condition}
                    label="Condition"
                    onChange={(e) => handleFilterChange('condition', e.target.value)}
                  >
                    <MenuItem value="">Any Condition</MenuItem>
                    {conditions.map(condition => (
                      <MenuItem key={condition} value={condition}>{condition}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            {(filters.category === 'Services' || filters.category === 'Jobs') && (
              <Grid item xs={12} md={6}>
                {/* Placeholder to maintain grid layout */}
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>City</InputLabel>
                <Select
                  value={filters.city}
                  label="City"
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                >
                  <MenuItem value="">Any Location</MenuItem>
                  {cities.map(city => (
                    <MenuItem key={city} value={city}>{city}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Applied filters display */}
      {Object.entries(filters).some(([key, value]) => value && key !== 'query') && (
        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="body2" sx={{ mr: 1 }}>Applied filters:</Typography>
          {filters.category && (
            <Chip
              size="small"
              label={`Category: ${filters.category}`}
              onDelete={() => handleFilterChange('category', '')}
            />
          )}
          {filters.condition && (
            <Chip
              size="small"
              label={`Condition: ${filters.condition}`}
              onDelete={() => handleFilterChange('condition', '')}
            />
          )}
          {filters.city && (
            <Chip
              size="small"
              label={`Location: ${filters.city}`}
              onDelete={() => handleFilterChange('city', '')}
            />
          )}
          {filters.minPrice && (
            <Chip
              size="small"
              label={`Min Price: ${filters.minPrice} TND`}
              onDelete={() => handleFilterChange('minPrice', '')}
            />
          )}
          {filters.maxPrice && (
            <Chip
              size="small"
              label={`Max Price: ${filters.maxPrice} TND`}
              onDelete={() => handleFilterChange('maxPrice', '')}
            />
          )}
        </Box>
      )}

      {/* Search results */}
      <Box sx={{ mt: 4 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">
            Error loading listings. Please try again.
          </Typography>
        ) : listingsData.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary">
              No listings found matching your criteria
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your search filters or browse all categories
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">
                {totalListings} {totalListings === 1 ? 'result' : 'results'} found
              </Typography>
              <FormControl sx={{ minWidth: 150 }} size="small">
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={filters.sort || 'newest'}
                  label="Sort by"
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                >
                  <MenuItem value="newest">Newest first</MenuItem>
                  <MenuItem value="price_asc">Price: Low to High</MenuItem>
                  <MenuItem value="price_desc">Price: High to Low</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Grid container spacing={3}>
              {listingsData.map(listing => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={listing._id || listing.id}>
                  <ListingCard listing={listing} />
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>
    </Container>
  );
};

export default Search;