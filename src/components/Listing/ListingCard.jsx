import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Rating,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  LocationOn as LocationIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { listings as listingsApi } from '../../services/api';
import { format } from 'date-fns';

const ListingCard = ({ listing, showRating = false, onDelete }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = user && listing.user && (user._id === listing.user._id || user._id === listing.user);

  const handleCardClick = () => {
    if (listing.category === 'Electronics' || listing.category === 'Fashion' ||
        listing.category === 'Home & Garden' || listing.category === 'Vehicles') {
      navigate(`/products/${listing._id}`);
    } else {
      navigate(`/listings/${listing._id}`);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      await listingsApi.deleteListing(listing._id);
      setDeleteDialogOpen(false);

      if (onDelete) {
        onDelete(listing._id);
      }
    } catch (error) {
      console.error('Failed to delete listing:', error);
      alert('Failed to delete listing. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-4px)',
            transition: 'transform 0.2s ease-in-out',
            boxShadow: 3,
          },
        }}
        onClick={handleCardClick}
      >
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="200"
            image={listing.images?.[0]?.startsWith('http') ? listing.images[0] :
                  `http://${window.location.hostname}:5002${listing.images?.[0]}` || 'https://via.placeholder.com/300x200'}
            alt={listing.title}
          />
          <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
            {isOwner && (
              <IconButton
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  },
                }}
                onClick={handleDeleteClick}
              >
                <DeleteIcon color="error" />
              </IconButton>
            )}
            <IconButton
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
              onClick={(e) => {
                e.stopPropagation();

              }}
            >
              <FavoriteIcon color="error" />
            </IconButton>
          </Box>
        </Box>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="h2" noWrap>
            {listing.title}
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            {listing.price.toLocaleString()} TND
          </Typography>
          <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={listing.category}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip
              label={listing.status}
              size="small"
              color={listing.status === 'active' ? 'success' : 'default'}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
              {listing.location}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary">
              Posted {format(new Date(listing.createdAt), 'MMM d, yyyy')}
            </Typography>

            {showRating ? (
              <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f5f5f5', px: 1, py: 0.5, borderRadius: 1 }}>
                <Rating value={listing.rating || 0} precision={0.5} size="small" readOnly />
                <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5, fontWeight: 'bold' }}>
                  {listing.rating ? listing.rating.toFixed(1) : 'New'}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating value={listing.seller?.rating || 0} size="small" readOnly />
                <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                  ({listing.seller?.ratingCount || 0})
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Supprimer cette annonce
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={isDeleting}>
            Annuler
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeleting}
            autoFocus
          >
            {isDeleting ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ListingCard;