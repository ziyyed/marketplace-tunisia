import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import { listings } from '../services/api';
import ListingCard from '../components/Listings/ListingCard';

interface Listing {
  id: string;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  condition: string;
  location: string;
  seller: {
    name: string;
    rating: number;
    reviews: number;
  };
}

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
];

const categories = [
  'All Categories',
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Vehicles',
  'Sports',
  'Books',
  'Other',
];

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'All Categories';
  const sort = searchParams.get('sort') || 'newest';

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const params: any = {
          search: query,
          sort,
        };

        if (category !== 'All Categories') {
          params.category = category;
        }

        const data = await listings.getAll(params);
        setResults(data);
        setTotalPages(Math.ceil(data.length / 12)); // 12 items per page
      } catch (err) {
        setError('Failed to fetch search results');
        console.error('Error fetching search results:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, category, sort]);

  const handleSortChange = (event: any) => {
    searchParams.set('sort', event.target.value);
    setSearchParams(searchParams);
  };

  const handleCategoryChange = (event: any) => {
    searchParams.set('category', event.target.value);
    setSearchParams(searchParams);
  };

  const handlePageChange = (event: any, value: number) => {
    setPage(value);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const startIndex = (page - 1) * 12;
  const endIndex = startIndex + 12;
  const currentResults = results.slice(startIndex, endIndex);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Search Results
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          {results.length} items found for "{query}"
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={handleCategoryChange}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select value={sort} label="Sort By" onChange={handleSortChange}>
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {error ? (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        ) : results.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No results found
            </Typography>
            <Typography color="text.secondary">
              Try adjusting your search criteria
            </Typography>
          </Paper>
        ) : (
          <>
            <Grid container spacing={3}>
              {currentResults.map((listing) => (
                <Grid item key={listing.id} xs={12} sm={6} md={4} lg={3}>
                  <ListingCard listing={listing} />
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
} 