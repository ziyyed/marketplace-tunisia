import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Chip,
  IconButton,
  Divider,
  Avatar,
  Rating,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  LocationOn,
  AccessTime,
  Favorite,
  Share,
  Message,
  Phone,
  Email,
  Close,
} from '@mui/icons-material';
import { format } from 'date-fns';

const ListingDetails = ({ listing, onContact }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showContactDialog, setShowContactDialog] = useState(false);

  const handleContact = () => {
    setShowContactDialog(true);
  };

  const handleCloseContact = () => {
    setShowContactDialog(false);
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {/* Main Image */}
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                paddingTop: '56.25%', // 16:9 aspect ratio
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              <img
                src={listing.image}
                alt={listing.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          </Grid>

          {/* Details */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="h4" gutterBottom>
                  {listing.title}
                </Typography>
                <Typography variant="h5" color="primary" gutterBottom>
                  {listing.price} TND
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip
                    label={listing.category}
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={listing.status}
                    color={listing.status === 'active' ? 'success' : 'error'}
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleContact}
                >
                  Contact Seller
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  startIcon={<Favorite />}
                >
                  Save
                </Button>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton color="primary">
                  <Share />
                </IconButton>
                <IconButton color="primary">
                  <Message />
                </IconButton>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Seller Information
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar src={listing.seller.avatar} />
                  <Box>
                    <Typography variant="body1">
                      {listing.seller.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Member since {format(new Date(listing.seller.joined), 'MMM yyyy')}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" paragraph>
                {listing.description}
              </Typography>
            </Box>
          </Grid>

          {/* Details */}
          <Grid item xs={12}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn color="action" />
                    <Typography variant="body1">
                      {listing.location}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime color="action" />
                    <Typography variant="body1">
                      Posted {format(new Date(listing.createdAt), 'MMM d, yyyy')}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Contact Dialog */}
      <Dialog
        open={showContactDialog}
        onClose={handleCloseContact}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Contact Seller</Typography>
            <IconButton onClick={handleCloseContact}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar src={listing.seller.avatar} />
              <Box>
                <Typography variant="subtitle1">{listing.seller.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {listing.seller.email}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Phone />}
                fullWidth
              >
                Call Seller
              </Button>
              <Button
                variant="outlined"
                startIcon={<Email />}
                fullWidth
              >
                Send Email
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseContact}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ListingDetails; 