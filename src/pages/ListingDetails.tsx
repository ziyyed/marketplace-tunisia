import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Button,
  Chip,
  Divider,
  TextField,
  CircularProgress,
  Rating,
  Alert,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { listings, messages } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

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
    id: string;
    name: string;
    rating: number;
    reviews: number;
  };
}

export default function ListingDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [listing, setListing] = useState<Listing | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        if (!id) return;
        const data = await listings.getById(id);
        setListing(data);
      } catch (err) {
        setError('Failed to load listing details');
        console.error('Error fetching listing:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleContactSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing || !message.trim()) return;

    try {
      await messages.send(listing.id, message);
      setMessageSent(true);
      setMessage('');
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
    }
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

  if (error || !listing) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Alert severity="error">{error || 'Listing not found'}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Grid container spacing={4}>
          {/* Images Section */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, mb: 2 }}>
              {listing.images.length > 0 ? (
                <Box
                  component="img"
                  src={listing.images[0]}
                  alt={listing.title}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: 500,
                    objectFit: 'contain',
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: 400,
                    bgcolor: 'grey.200',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography color="text.secondary">No image available</Typography>
                </Box>
              )}
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h4" gutterBottom>
                {listing.title}
              </Typography>
              <Typography variant="h5" color="primary" gutterBottom>
                ${listing.price.toLocaleString()}
              </Typography>

              <Box sx={{ my: 2 }}>
                <Chip label={listing.category} sx={{ mr: 1 }} />
                <Chip label={listing.condition} />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationIcon color="action" sx={{ mr: 1 }} />
                <Typography color="text.secondary">{listing.location}</Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography paragraph>{listing.description}</Typography>
            </Paper>
          </Grid>

          {/* Seller Section */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Seller Information
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon sx={{ mr: 1 }} />
                <Typography>{listing.seller.name}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Rating
                  value={listing.seller.rating}
                  readOnly
                  precision={0.5}
                  size="small"
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  ({listing.seller.reviews} reviews)
                </Typography>
              </Box>

              {user && user.id !== listing.seller.id ? (
                <Box component="form" onSubmit={handleContactSeller}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Message to seller"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    sx={{ mb: 2 }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Contact Seller
                  </Button>
                  {messageSent && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                      Message sent successfully!
                    </Alert>
                  )}
                </Box>
              ) : !user ? (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => navigate('/login')}
                >
                  Login to Contact Seller
                </Button>
              ) : null}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
} 