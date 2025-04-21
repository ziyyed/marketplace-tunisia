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
} from '@mui/icons-material';
import { listings } from '../services/api';
import ListingCard from '../components/Listing/ListingCard';
import { useAuth } from '../contexts/AuthContext';

const categories = [
  { name: 'Electronics', icon: <Phone fontSize="large" />, color: '#2196f3' },
  { name: 'Home & Garden', icon: <HomeIcon fontSize="large" />, color: '#ff9800' },
  { name: 'Vehicles', icon: <DirectionsCar fontSize="large" />, color: '#f44336' },
  { name: 'Jobs', icon: <Work fontSize="large" />, color: '#9c27b0' },
  { name: 'Services', icon: <Build fontSize="large" />, color: '#607d8b' },
  { name: 'Fashion', icon: <ShoppingBag fontSize="large" />, color: '#e91e63' },
];

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isAuthenticated } = useAuth();

  const { data: featuredListings, isLoading } = useQuery({
    queryKey: ['featuredListings'],
    queryFn: () => listings.getAll(),
  });

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
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

      {/* Categories */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Category sx={{ mr: 1, color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Popular Categories
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {categories.map((category) => (
            <Grid item xs={6} sm={4} md={3} key={category.name}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 3,
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
                onClick={() => navigate(`/search?category=${category.name}`)}
              >
                <Box sx={{
                  color: category.color,
                  mb: 2,
                  '& svg': { fontSize: 40 }
                }}>
                  {category.icon}
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                  {category.name}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Featured Listings */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Favorite sx={{ mr: 1, color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Featured Listings
          </Typography>
        </Box>
        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : (
          <Grid container spacing={3}>
            {featuredListings?.data?.slice(0, 8).map((listing) => (
              <Grid item xs={12} sm={6} md={3} key={listing._id}>
                <ListingCard listing={listing} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* How It Works */}
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