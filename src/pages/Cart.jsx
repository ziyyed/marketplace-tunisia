import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  IconButton,
  Divider,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';
import {
  Delete,
  ShoppingCart,
  ArrowBack,
  ShoppingBag,
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, clearCart, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    // For now, just show a success message
    alert('Checkout functionality will be implemented in the future.');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ mr: 2 }}
          aria-label="back"
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Shopping Cart
        </Typography>
      </Box>

      {cartItems.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <ShoppingCart sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Looks like you haven't added any products to your cart yet.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
            startIcon={<ShoppingBag />}
          >
            Continue Shopping
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: { xs: 3, md: 0 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  Cart Items ({cartItems.length})
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<Delete />}
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />

              {cartItems.map((item) => (
                <Card key={item.cartItemId} sx={{ mb: 2, display: 'flex', position: 'relative' }}>
                  <CardMedia
                    component="img"
                    sx={{ width: 120, height: 120, objectFit: 'cover' }}
                    image={item.images?.[0]?.startsWith('http') ? item.images[0] :
                          `http://${window.location.hostname}:5002${item.images?.[0]}` || 'https://via.placeholder.com/120'}
                    alt={item.title}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                      <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {item.category}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {item.price.toLocaleString()} TND
                      </Typography>
                      {item.seller && (
                        <Typography variant="body2" color="text.secondary">
                          Seller: {item.seller.name}
                        </Typography>
                      )}
                    </CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', pl: 2, pb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Quantity: 1
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    aria-label="remove from cart"
                    onClick={() => removeFromCart(item.cartItemId)}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                  >
                    <Delete color="error" />
                  </IconButton>
                </Card>
              ))}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Subtotal</Typography>
                  <Typography variant="body1">{getCartTotal().toLocaleString()} TND</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Shipping</Typography>
                  <Typography variant="body1">Free</Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary">{getCartTotal().toLocaleString()} TND</Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>

              <Button
                variant="outlined"
                color="primary"
                size="large"
                fullWidth
                onClick={() => navigate('/')}
                sx={{ mt: 2 }}
              >
                Continue Shopping
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Cart;
