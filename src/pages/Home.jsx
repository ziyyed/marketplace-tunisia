import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  useTheme,
  Paper,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Phone,
  Computer,
  Home as HomeIcon,
  DirectionsCar,
  Work,
  Build,
  ShoppingBag,
  SportsEsports,
  AddCircle,
  PersonAdd,
  Search,
  Chat,
  Sell,
  Favorite,
  Category,
  Star,
} from '@mui/icons-material';
import { listings } from '../services/api';
import ListingCard from '../components/Listing/ListingCard';
import { useAuth } from '../contexts/AuthContext';

const categories = [
  { name: 'Electronics', icon: <Phone fontSize="medium" />, color: '#2196f3' },
  { name: 'Home & Garden', icon: <HomeIcon fontSize="medium" />, color: '#ff9800' },
  { name: 'Vehicles', icon: <DirectionsCar fontSize="medium" />, color: '#f44336' },
  { name: 'Jobs', icon: <Work fontSize="medium" />, color: '#9c27b0' },
  { name: 'Services', icon: <Build fontSize="medium" />, color: '#607d8b' },
  { name: 'Fashion', icon: <ShoppingBag fontSize="medium" />, color: '#e91e63' },
];

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isAuthenticated } = useAuth();

  const { data: featuredListings, isLoading } = useQuery({
    queryKey: ['topRatedListings'],
    queryFn: async () => {
      const allListings = await listings.getAll();

      const sortedListings = [...allListings].sort((a, b) => {
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        return ratingB - ratingA;
      });

      return sortedListings.slice(0, 8);
    },
  });

  return (
    <Container maxWidth="lg">
      <Paper
        elevation={3}
        sx={{
          bgcolor: theme.palette.primary.main,
          color: 'white',
          py: 8,
          px: 4,
          borderRadius: 2,
          textAlign: 'center',
          mb: 4,
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome to Marketplace Tunisia
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
          Buy and sell anything, anywhere in Tunisia
        </Typography>
        {isAuthenticated ? (
          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<AddCircle />}
            onClick={() => navigate('/listings/create')}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              boxShadow: 3,
            }}
          >
            Start Selling
          </Button>
        ) : (
          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<PersonAdd />}
            onClick={() => navigate('/register')}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              boxShadow: 3,
            }}
          >
            Sign Up to Sell
          </Button>
        )}
      </Paper>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Category sx={{ mr: 1, color: 'primary.main', fontSize: 24 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Popular Categories
          </Typography>
        </Box>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          overflowX: 'auto',
          pb: 1,
          '&::-webkit-scrollbar': {
            height: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '6px',
          }
        }}>
          {categories.map((category) => (
            <Card
              key={category.name}
              sx={{
                minWidth: '110px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 1.5,
                mx: 0.5,
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                },
              }}
              onClick={() => navigate(`/search?category=${category.name}`)}
            >
              <Box sx={{
                color: category.color,
                mb: 1,
                '& svg': { fontSize: 28 }
              }}>
                {category.icon}
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 'medium', textAlign: 'center' }}>
                {category.name}
              </Typography>
            </Card>
          ))}
        </Box>
      </Box>

      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Star sx={{ mr: 1, color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Most Wanted Products
          </Typography>
          <Chip
            label="Top Rated"
            color="primary"
            size="small"
            sx={{ ml: 1, borderRadius: 2 }}
          />
        </Box>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {featuredListings?.slice(0, 8).map((listing) => (
              <Grid item xs={12} sm={6} md={3} key={listing._id}>
                <ListingCard listing={listing} showRating={true} />
              </Grid>
            ))}
            {(!featuredListings || featuredListings.length === 0) && (
              <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">
                  No top-rated products available yet
                </Typography>
              </Box>
            )}
          </Grid>
        )}
      </Box>

      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Sell sx={{ mr: 1, color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            How It Works
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <PersonAdd sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  1. Create an Account
                </Typography>
                <Typography color="text.secondary">
                  Sign up for free and create your profile to start buying and selling.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <AddCircle sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  2. List Your Items
                </Typography>
                <Typography color="text.secondary">
                  Post your items with photos and descriptions. It's quick and easy!
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Chat sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  3. Connect & Sell
                </Typography>
                <Typography color="text.secondary">
                  Chat with potential buyers and arrange the sale securely.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;