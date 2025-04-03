import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Paper,
  Tab,
  Tabs,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { listings, users } from '../services/api';
import ListingCard from '../components/Listings/ListingCard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
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
  seller: {
    name: string;
    rating: number;
    reviews: number;
  };
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Dashboard() {
  const [tab, setTab] = useState(0);
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        const data = await users.getListings();
        setUserListings(data);
      } catch (err) {
        setError('Failed to fetch your listings');
        console.error('Error fetching user listings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserListings();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
          <Grid item xs>
            <Typography variant="h4" component="h1">
              Welcome back, {user?.name}!
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              component={Link}
              to="/create-listing"
            >
              Create New Listing
            </Button>
          </Grid>
        </Grid>

        <Paper sx={{ width: '100%', mb: 2 }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            aria-label="dashboard tabs"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Active Listings" />
            <Tab label="Sold Items" />
            <Tab label="Saved Items" />
          </Tabs>

          <TabPanel value={tab} index={0}>
            {error ? (
              <Typography color="error" align="center">
                {error}
              </Typography>
            ) : userListings.length === 0 ? (
              <Typography align="center" color="text.secondary">
                You don't have any active listings.
                <br />
                <Button
                  component={Link}
                  to="/create-listing"
                  variant="text"
                  sx={{ mt: 1 }}
                >
                  Create your first listing
                </Button>
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {userListings.map((listing) => (
                  <Grid item key={listing.id} xs={12} sm={6} md={4}>
                    <ListingCard listing={listing} />
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <Typography align="center" color="text.secondary">
              No sold items yet.
            </Typography>
          </TabPanel>

          <TabPanel value={tab} index={2}>
            <Typography align="center" color="text.secondary">
              No saved items yet.
            </Typography>
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
} 