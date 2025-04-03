import { Card, CardMedia, CardContent, Typography, Box, Chip, Rating } from '@mui/material';
import { Link } from 'react-router-dom';

interface Seller {
  name: string;
  rating: number;
  reviews: number;
}

interface Listing {
  id: string;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  condition: string;
  location: string;
  seller: Seller;
}

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <Card
      component={Link}
      to={`/listing/${listing.id}`}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={listing.images[0]}
        alt={listing.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6" component="h2" noWrap>
            {listing.title}
          </Typography>
          <Typography variant="h6" color="primary">
            ${listing.price}
          </Typography>
        </Box>
        
        <Box sx={{ mb: 1 }}>
          <Chip
            label={listing.category}
            size="small"
            color="primary"
            sx={{ mr: 1 }}
          />
          <Chip
            label={listing.condition}
            size="small"
            variant="outlined"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" paragraph>
          {listing.description.length > 100
            ? `${listing.description.substring(0, 100)}...`
            : listing.description}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {listing.location}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Rating value={listing.seller.rating} readOnly size="small" />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
              ({listing.seller.reviews})
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
} 