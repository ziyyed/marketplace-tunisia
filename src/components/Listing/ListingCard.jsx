import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Box,
} from '@mui/material';
import { format } from 'date-fns';

const ListingCard = ({ listing }) => {
  const navigate = useNavigate();

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
        },
      }}
      onClick={() => navigate(`/listing/${listing._id}`)}
    >
      <CardMedia
        component="img"
        height="200"
        image={listing.images?.[0] || 'https://via.placeholder.com/300x200'}
        alt={listing.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2">
          {listing.title}
        </Typography>
        <Typography variant="h6" color="primary" gutterBottom>
          {listing.price} TND
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Chip
            label={listing.category}
            size="small"
            sx={{ mr: 1 }}
          />
          <Chip
            label={listing.status}
            size="small"
            color={listing.status === 'active' ? 'success' : 'default'}
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {listing.location}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Posted {format(new Date(listing.createdAt), 'MMM d, yyyy')}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ListingCard; 