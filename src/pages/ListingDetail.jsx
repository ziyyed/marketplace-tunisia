import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Delete,
  LocationOn,
  Category,
  AttachMoney,
  CalendarToday,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: listing, isLoading, error } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => api.listings.getById(id),
  });

  const handleDelete = async () => {
    try {
      await api.listings.delete(id);
      navigate('/');
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography color="error">Error loading listing</Typography>
        </Box>
      </Container>
    );
  }

  if (!listing) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography>Listing not found</Typography>
        </Box>
      </Container>
    );
  }

  const isOwner = user && user._id === listing.user._id;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>

        {isOwner && (
          <Box display="flex" gap={1} mb={2}>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => navigate(`/listings/${id}/edit`)}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<Delete />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete
            </Button>
          </Box>
        )}
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={listing.images[0]?.startsWith('http') ? listing.images[0] :
                    `http://${window.location.hostname}:5002${listing.images[0]}` || '/placeholder.jpg'}
              alt={listing.title}
            />
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {listing.title}
              </Typography>
              <Box display="flex" gap={1} mb={2}>
                <Chip
                  icon={<Category />}
                  label={listing.category}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  icon={<LocationOn />}
                  label={listing.location}
                  variant="outlined"
                />
                <Chip
                  icon={<AttachMoney />}
                  label={`${listing.price} TND`}
                  color="success"
                  variant="outlined"
                />
              </Box>
              <Typography variant="body1" paragraph>
                {listing.description}
              </Typography>
              <Box display="flex" alignItems="center" color="text.secondary">
                <CalendarToday fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Posted on {format(new Date(listing.createdAt), 'MMMM d, yyyy')}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Seller Information
              </Typography>
              <Box display="flex" alignItems="center" mb={2}>
                <Box
                  component="img"
                  src={listing.user.avatar?.startsWith('http') ? listing.user.avatar :
                       `http://${window.location.hostname}:5002${listing.user.avatar}` || '/default-avatar.png'}
                  alt={listing.user.name}
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    mr: 2,
                  }}
                />
                <Box>
                  <Typography variant="subtitle1">{listing.user.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Member since {format(new Date(listing.user.createdAt || listing.createdAt), 'MMMM yyyy')}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate(`/messages/new?listing=${id}`)}
              >
                Contact Seller
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Listing</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this listing? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ListingDetail;