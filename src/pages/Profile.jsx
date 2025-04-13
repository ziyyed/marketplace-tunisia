import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Grid,
  Typography,
  Box,
  Avatar,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Chip,
} from '@mui/material';
import { LocationOn, Email, Phone, CalendarToday } from '@mui/icons-material';
import { format } from 'date-fns';
import { api } from '../services/api';
import ListingCard from '../components/Listing/ListingCard';

const Profile = () => {
  const { id } = useParams();
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', id],
    queryFn: () => api.users.getById(id),
  });

  const { data: listings } = useQuery({
    queryKey: ['userListings', id],
    queryFn: () => api.listings.getByUser(id),
  });

  if (isLoading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Alert severity="error">Error loading profile</Alert>
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Alert severity="info">User not found</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
              <Avatar
                src={user.avatar}
                sx={{ width: 150, height: 150, mb: 2 }}
              />
              <Typography variant="h5" gutterBottom>
                {user.name}
              </Typography>
              <Box display="flex" gap={1} mb={2}>
                <Chip
                  icon={<LocationOn />}
                  label={user.location || 'No location set'}
                  variant="outlined"
                />
                <Chip
                  icon={<CalendarToday />}
                  label={`Member since ${format(new Date(user.createdAt), 'MMMM yyyy')}`}
                  variant="outlined"
                />
              </Box>
              <Button
                variant="contained"
                onClick={() => window.location.href = `mailto:${user.email}`}
                startIcon={<Email />}
                sx={{ mb: 1 }}
              >
                Contact
              </Button>
              {user.phone && (
                <Button
                  variant="outlined"
                  onClick={() => window.location.href = `tel:${user.phone}`}
                  startIcon={<Phone />}
                >
                  {user.phone}
                </Button>
              )}
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1" color="text.secondary">
              {user.bio || 'No bio available'}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Listings ({listings?.length || 0})
            </Typography>
            <Divider sx={{ mb: 3 }} />
            {listings?.length === 0 ? (
              <Alert severity="info">
                No listings found for this user.
              </Alert>
            ) : (
              <Grid container spacing={3}>
                {listings?.map((listing) => (
                  <Grid item xs={12} sm={6} key={listing._id}>
                    <ListingCard listing={listing} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile; 