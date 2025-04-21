import React from 'react';
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
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

const ListingCard = ({ listing }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Navigate to ProductDetails for product categories, ListingDetail for service categories
    if (listing.category === 'Electronics' || listing.category === 'Fashion' ||
        listing.category === 'Home & Garden' || listing.category === 'Vehicles') {
      navigate(`/products/${listing._id}`);
    } else {
      navigate(`/listings/${listing._id}`);
    }
  };

  return (
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
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            },
          }}
          onClick={(e) => {
            e.stopPropagation();
            // Handle favorite
          }}
        >
          <FavoriteIcon color="error" />
        </IconButton>
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Rating value={listing.seller?.rating || 0} size="small" readOnly />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
              ({listing.seller?.ratingCount || 0})
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ListingCard;