import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
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
import { LocationOn, Email, Phone, CalendarToday, Edit, ArrowBack } from '@mui/icons-material';
import { format } from 'date-fns';
import { api } from '../services/api';
import ListingCard from '../components/Listing/ListingCard';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  // If no ID is provided, use the authenticated user's ID
  const userId = id || (authUser ? authUser._id : null);

  // If we're viewing our own profile and we're authenticated, use the auth user data directly
  const isOwnProfileWithoutId = !id && authUser;

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => {
      console.log('Fetching user profile for ID:', userId);
      // If it's our own profile without an ID in the URL, use the auth user data
      if (isOwnProfileWithoutId) {
        console.log('Using authenticated user data for own profile');
        return authUser;
      }
      // Otherwise fetch from API
      return userId ? api.users.getById(userId) : null;
    },
    enabled: !!userId,
    retry: 1,
    onError: (err) => {
      console.error('Error fetching user profile:', err);
    }
  });

  // Check if the profile belongs to the logged-in user
  const isOwnProfile = authUser && authUser._id === userId;

  const { data: listings } = useQuery({
    queryKey: ['userListings', userId],
    queryFn: () => userId ? api.listings.getByUser(userId) : null,
    enabled: !!userId
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
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="60vh" gap={2}>
          <Alert severity="error" sx={{ width: '100%', maxWidth: 500 }}>
            Error loading profile: {error.message || 'Could not fetch user data'}
          </Alert>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            startIcon={<ArrowBack />}
          >
            Back to Home
          </Button>
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="60vh" gap={2}>
          <Alert severity="info" sx={{ width: '100%', maxWidth: 500 }}>
            User not found. The user may have been deleted or you may not have permission to view this profile.
          </Alert>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            startIcon={<ArrowBack />}
          >
            Back to Home
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
              <Avatar
                src={user.avatar?.startsWith('http') ? user.avatar :
                     `http://${window.location.hostname}:5002${user.avatar}` || '/default-avatar.png'}
                sx={{ width: 180, height: 180, mb: 3, boxShadow: 2 }}
              />
              <Typography variant="h4" gutterBottom fontWeight="bold">
                {user.name}
              </Typography>
              <Box display="flex" gap={1} mb={3} flexWrap="wrap" justifyContent="center">
                {user.location && (
                  <Chip
                    icon={<LocationOn />}
                    label={user.location}
                    variant="outlined"
                    color="primary"
                    sx={{ borderRadius: 2 }}
                  />
                )}
                <Chip
                  icon={<CalendarToday />}
                  label={`Member since ${format(new Date(user.createdAt), 'MMMM yyyy')}`}
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                />
              </Box>
              {isOwnProfile ? (
                <Button
                  variant="contained"
                  onClick={() => navigate('/profile/edit')}
                  startIcon={<Edit />}
                  sx={{ mb: 1, borderRadius: 2, px: 3, py: 1 }}
                  size="large"
                  color="primary"
                >
                  Edit Profile
                </Button>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                  <Button
                    variant="contained"
                    onClick={() => window.location.href = `mailto:${user.email}`}
                    startIcon={<Email />}
                    sx={{ borderRadius: 2 }}
                    fullWidth
                  >
                    Contact via Email
                  </Button>
                  {user.phone && (
                    <Button
                      variant="outlined"
                      onClick={() => window.location.href = `tel:${user.phone}`}
                      startIcon={<Phone />}
                      sx={{ borderRadius: 2 }}
                      fullWidth
                    >
                      Call {user.phone}
                    </Button>
                  )}
                </Box>
              )}
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom color="primary">
                About
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                {user.bio || 'No bio available'}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Typography variant="h6" color="primary" fontWeight="bold">
                Listings
              </Typography>
              <Chip
                label={listings?.length || 0}
                color="primary"
                size="small"
                sx={{ ml: 1, borderRadius: 2 }}
              />
              <Box flexGrow={1} />
              {isOwnProfile && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/listings/create')}
                  sx={{ borderRadius: 2 }}
                >
                  Add New Listing
                </Button>
              )}
            </Box>
            <Divider sx={{ mb: 3 }} />
            {listings?.length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {isOwnProfile ? 'You haven\'t posted any listings yet.' : 'This user hasn\'t posted any listings yet.'}
                </Typography>
                {isOwnProfile && (
                  <Button
                    variant="contained"
                    onClick={() => navigate('/listings/create')}
                    sx={{ mt: 2, borderRadius: 2 }}
                  >
                    Create Your First Listing
                  </Button>
                )}
              </Box>
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