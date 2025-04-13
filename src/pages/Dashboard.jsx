import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Alert,
  Container,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Favorite as FavoriteIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { listings } from '../services/api';
import ListingCard from '../components/Listing/ListingCard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const { data: userStats, isLoading: statsLoading } = useQuery(
    'userStats',
    async () => {
      const response = await axios.get('/api/users/stats');
      return response.data;
    }
  );

  const { data: userListings, isLoading: listingsLoading } = useQuery({
    queryKey: ['userListings'],
    queryFn: () => listings.getByUser(),
  });

  const { data: listings, isLoading: listingsLoadingFromAPI, error } = useQuery({
    queryKey: ['listings'],
    queryFn: getListings,
  });

  const handleDeleteListing = async (listingId) => {
    try {
      await axios.delete(`/api/listings/${listingId}`);
      toast.success('Listing deleted successfully');
    } catch (error) {
      toast.error('Error deleting listing');
    }
  };

  const handleEditListing = (listingId) => {
    navigate(`/edit-listing/${listingId}`);
  };

  const handleViewListing = (listingId) => {
    navigate(`/listing/${listingId}`);
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Views',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Messages',
        data: [5, 8, 2, 4, 1, 2],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  if (statsLoading || listingsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error.message}
      </Alert>
    );
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        My Listings
      </Typography>
      {userListings?.length === 0 ? (
        <Typography>You haven't created any listings yet.</Typography>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
          {userListings?.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </Box>
      )}
    </Container>
  );
};

export default Dashboard; 