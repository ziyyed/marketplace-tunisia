import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  Divider,
  Box,
  Avatar,
  Chip,
  Rating,
  IconButton,
  Skeleton,
  Stack,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Share,
  ShoppingCart,
  Person,
  LocationOn,
  AccessTime,
  Report,
  Chat,
  Phone,
  ArrowBack,
  Close,
} from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useAuth } from '../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Mock data for now - would be replaced with actual API call
        const response = await axios.get(`/api/listings/${id}`);
        setProduct(response.data);
        setIsFavorite(response.data.isFavorite || false);
      } catch (err) {
        setError('Failed to load product details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Mocking the API call with dummy data for now
    setTimeout(() => {
      setProduct({
        id,
        title: 'iPhone 13 Pro Max - 256GB - Excellent Condition',
        price: 2000,
        description: 'Selling my iPhone 13 Pro Max in excellent condition. Only used for 8 months. No scratches or dents. Comes with original charger and box. Battery health is at 95%. Color: Sierra Blue.',
        category: 'Electronics',
        condition: 'Used - Like New',
        location: 'Tunis, Tunisia',
        images: [
          'https://placehold.co/600x400?text=iPhone+13+Pro+Max',
          'https://placehold.co/600x400?text=iPhone+13+Pro+Max+2',
          'https://placehold.co/600x400?text=iPhone+13+Pro+Max+3',
        ],
        createdAt: new Date(2023, 5, 15),
        seller: {
          id: '123',
          name: 'Ahmed Ben Ali',
          avatar: 'https://placehold.co/150?text=A',
          rating: 4.7,
          reviewCount: 23,
          memberSince: 'Jan 2022',
          responseRate: '98%',
          responseTime: 'Within 1 hour',
        },
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Would send API request to toggle favorite status
  };

  const handleContactSeller = () => {
    if (!user) {
      navigate('/login', { state: { from: `/listings/${id}` } });
      return;
    }
    // Navigate to messages with this seller
    navigate(`/messages?seller=${product.seller.id}`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    // Show toast notification
    alert('Link copied to clipboard');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="text" height={60} />
            <Skeleton variant="text" height={30} />
            <Skeleton variant="text" height={30} />
            <Skeleton variant="rectangular" height={100} sx={{ my: 2 }} />
            <Skeleton variant="rectangular" height={120} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            {error}
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!product) return null;

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back to listings
      </Button>
      
      <Grid container spacing={3}>
        {/* Product Images */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={0}
              slidesPerView={1}
              style={{ height: '400px' }}
            >
              {product.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <Box
                    sx={{
                      height: '400px',
                      width: '100%',
                      backgroundImage: `url(${image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </Paper>
          
          {/* Product Description */}
          <Paper elevation={2} sx={{ p: 3, mt: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Condition
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {product.condition}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Category
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {product.category}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Posted
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formatDistanceToNow(new Date(product.createdAt), { addSuffix: true })}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Product Details and Actions */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* Main Product Info */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                {product.title}
              </Typography>
              
              <Typography variant="h4" color="primary" fontWeight="bold" sx={{ my: 2 }}>
                {product.price} TND
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn color="action" fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">{product.location}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTime color="action" fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {formatDistanceToNow(new Date(product.createdAt), { addSuffix: true })}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Chat />}
                  onClick={handleContactSeller}
                  sx={{ mr: 1 }}
                >
                  Contact Seller
                </Button>
                <IconButton 
                  color={isFavorite ? 'primary' : 'default'}
                  onClick={handleToggleFavorite}
                  sx={{ border: 1, borderColor: 'divider' }}
                >
                  {isFavorite ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
                <IconButton 
                  onClick={handleShare}
                  sx={{ border: 1, borderColor: 'divider' }}
                >
                  <Share />
                </IconButton>
              </Box>
            </Paper>
            
            {/* Seller Info */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Seller Information
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={product.seller.avatar}
                  alt={product.seller.name}
                  sx={{ width: 50, height: 50, mr: 2 }}
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {product.seller.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Rating
                      value={product.seller.rating}
                      precision={0.1}
                      size="small"
                      readOnly
                    />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      ({product.seller.reviewCount})
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Person fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Member since {product.seller.memberSince}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Chat fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Response rate: {product.seller.responseRate}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTime fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Response time: {product.seller.responseTime}
                </Typography>
              </Box>
              
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Chat />}
                onClick={handleContactSeller}
                sx={{ mt: 2 }}
              >
                Message Seller
              </Button>
            </Paper>
            
            {/* Safety Tips */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, bgcolor: 'info.lightest' }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Safety Tips
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Meet in a safe, public place
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Check the item before paying
              </Typography>
              <Typography variant="body2">
                • Pay only after inspecting the item
              </Typography>
              <Button
                variant="text"
                size="small"
                color="info"
                sx={{ mt: 1, p: 0 }}
              >
                Learn more
              </Button>
            </Paper>
            
            <Button
              variant="text"
              color="error"
              startIcon={<Report />}
              size="small"
            >
              Report this listing
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetails; 