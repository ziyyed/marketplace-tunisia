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
import { useCart } from '../contexts/CartContext';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import { getApiBaseUrl } from '../utils/networkUtils';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [ratingHover, setRatingHover] = useState(-1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const apiBaseUrl = getApiBaseUrl();
        const response = await axios.get(`${apiBaseUrl}/listings/${id}`);
        console.log('Product data:', response.data);

        const productData = {
          id: response.data._id,
          title: response.data.title,
          price: response.data.price,
          description: response.data.description,
          category: response.data.category,
          condition: response.data.condition,
          location: response.data.location,
          rating: response.data.rating || 0,
          ratingCount: response.data.ratingCount || 0,
          ratings: response.data.ratings || [],
          images: response.data.images.map(img => {
            if (img.startsWith('http')) return img;
            const hostname = window.location.hostname;
            return `http://${hostname}:5002${img}`;
          }),
          createdAt: new Date(response.data.createdAt),
          seller: {
            id: response.data.user._id,
            name: response.data.user.name,
            avatar: (() => {
              const avatar = response.data.user.avatar;
              if (!avatar) return 'https://placehold.co/150?text=U';
              if (avatar.startsWith('http')) return avatar;
              const hostname = window.location.hostname;
              return `http://${hostname}:5002${avatar}`;
            })(),
            rating: response.data.user.rating || 4.5,
            reviewCount: response.data.user.reviews?.length || 0,
            memberSince: new Date(response.data.user.createdAt || response.data.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            responseRate: '95%',
            responseTime: 'Within a day',
            phone: response.data.phone || 'Not provided'
          },
        };

        setProduct(productData);
        setIsFavorite(false);

        if (user && response.data.ratings) {
          const userRating = response.data.ratings.find(r => r.user === user._id);
          if (userRating) {
            setUserRating(userRating.value);
            setRatingSubmitted(true);
          }
        }
      } catch (err) {
        setError('Failed to load product details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, user]);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = () => {
    // Add the product to cart without requiring login
    addToCart(product);
    // Toast notification is already shown in the CartContext
  };

  const handleContactSeller = () => {
    if (!user) {
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }
    navigate(`/messages?seller=${product.seller.id}`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard');
  };

  const handleRatingChange = async (event, newValue) => {
    if (!user) {
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }

    if (product.seller.id === user._id) {
      alert('You cannot rate your own product!');
      return;
    }

    setUserRating(newValue);

    try {
      console.log(`Submitting rating ${newValue} for product ${id}`);

      setLoading(true);

      const { listings } = await import('../services/api');

      const response = await listings.rateListing(id, newValue);
      console.log('Rating response:', response);

      setProduct(prev => ({
        ...prev,
        rating: response.rating,
        ratingCount: response.ratingCount
      }));

      setRatingSubmitted(true);
      setLoading(false);

      alert('Thank you for your rating!');
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating. Please try again.');
      setLoading(false);
    }
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

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                {product.title}
              </Typography>

              <Typography variant="h4" color="primary" fontWeight="bold" sx={{ my: 2 }}>
                {product.price} TND
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating
                  value={product.rating || 0}
                  precision={0.5}
                  size="medium"
                  readOnly
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {product.rating ? `${product.rating.toFixed(1)} / 5` : 'No ratings yet'}
                </Typography>
                {product.ratingCount > 0 && (
                  <Chip
                    label={`${product.ratingCount} ${product.ratingCount === 1 ? 'review' : 'reviews'}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ ml: 1, borderRadius: 1 }}
                  />
                )}
              </Box>

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

              <Box sx={{ display: 'flex', gap: 1, mt: 2, mb: 2 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  startIcon={<ShoppingCart />}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
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

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccessTime fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Response time: {product.seller.responseTime}
                </Typography>
              </Box>

              {product.seller.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Phone fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Phone: {product.seller.phone}
                  </Typography>
                </Box>
              )}

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

            {user && product.seller.id !== user._id ? (
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Rate This Product
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 1 }}>
                  <Rating
                    name="product-rating"
                    value={userRating}
                    precision={0.5}
                    size="large"
                    onChange={handleRatingChange}
                    disabled={ratingSubmitted || loading}
                    onChangeActive={(event, newHover) => {
                      setRatingHover(newHover);
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {ratingSubmitted
                      ? 'Thank you for your rating!'
                      : userRating > 0
                        ? `You're rating this product ${ratingHover !== -1 ? ratingHover : userRating} out of 5 stars`
                        : 'Click to rate this product'}
                  </Typography>
                </Box>
              </Paper>
            ) : user && product.seller.id === user._id ? (
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 2, bgcolor: 'info.lightest' }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Product Ratings
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating
                    value={product.rating || 0}
                    precision={0.5}
                    size="large"
                    readOnly
                  />
                  <Typography variant="body1" fontWeight="medium">
                    {product.rating ? product.rating.toFixed(1) : '0'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ({product.ratingCount || 0} {product.ratingCount === 1 ? 'rating' : 'ratings'})
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  As the owner, you cannot rate your own product. This is how your product is currently rated by others.
                </Typography>
              </Paper>
            ) : (
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Rate This Product
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please <Button variant="text" onClick={() => navigate('/login', { state: { from: `/products/${id}` } })}>log in</Button> to rate this product.
                </Typography>
              </Paper>
            )}

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