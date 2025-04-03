import { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, Paper, CircularProgress } from '@mui/material';
import SearchBar from '../components/Search/SearchBar';
import ListingCard from '../components/Listings/ListingCard';
import { listings } from '../services/api';

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

const categories = [
  { name: 'Electronics', icon: '🔌' },
  { name: 'Fashion', icon: '👕' },
  { name: 'Home & Garden', icon: '🏠' },
  { name: 'Vehicles', icon: '🚗' },
  { name: 'Sports', icon: '⚽' },
  { name: 'Books', icon: '📚' },
];

export default function Home() {
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await listings.getAll({ sort: 'newest' });
        setFeaturedListings(data.slice(0, 3)); // Get only the 3 most recent listings
      } catch (err) {
        setError('Failed to load listings');
        console.error('Error fetching listings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Welcome to Marketplace Tunisia
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" paragraph>
          Your trusted platform for buying and selling in Tunisia
        </Typography>

        <Box sx={{ my: 4 }}>
          <SearchBar />
        </Box>

        <Typography variant="h4" gutterBottom sx={{ mt: 6 }}>
          Featured Listings
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">
            {error}
          </Typography>
        ) : (
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {featuredListings.map((listing) => (
              <Grid item key={listing.id} xs={12} sm={6} md={4}>
                <ListingCard listing={listing} />
              </Grid>
            ))}
          </Grid>
        )}

        <Typography variant="h4" gutterBottom sx={{ mt: 6 }}>
          Popular Categories
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {categories.map((category) => (
            <Grid item key={category.name} xs={6} sm={4} md={2}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <Typography variant="h2" sx={{ mb: 1 }}>
                  {category.icon}
                </Typography>
                <Typography variant="subtitle1">{category.name}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
} 