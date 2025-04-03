import { Box, Container, Grid, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Marketplace Tunisia
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your trusted platform for buying and selling in Tunisia.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/')}
                sx={{ textAlign: 'left' }}
              >
                Home
              </Link>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/search')}
                sx={{ textAlign: 'left' }}
              >
                Browse Listings
              </Link>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/dashboard')}
                sx={{ textAlign: 'left' }}
              >
                Dashboard
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: support@marketplace-tunisia.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: +216 71 234 567
            </Typography>
          </Grid>
        </Grid>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 4 }}
        >
          © {new Date().getFullYear()} Marketplace Tunisia. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
} 