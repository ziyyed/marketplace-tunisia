import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  CircularProgress,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { ExpandMore, Refresh, ArrowBack } from '@mui/icons-material';

const ListingDebug = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugData, setDebugData] = useState(null);
  const [fixingIssue, setFixingIssue] = useState(false);

  const fetchDebugData = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://${window.location.hostname}:5002/api/listings/debug/user/${user._id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setDebugData(response.data);
    } catch (err) {
      console.error('Error fetching debug data:', err);
      setError(err.response?.data?.message || 'Failed to fetch debug data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDebugData();
    }
  }, [user]);

  const fixListingIssues = async () => {
    if (!user) return;
    
    setFixingIssue(true);
    
    try {
      const token = localStorage.getItem('token');
      
      // Get all direct listings
      const directListings = debugData.directListings;
      const userListingsIds = new Set(debugData.user.listingsIds.map(id => id.toString()));
      
      // Find listings that are not in the user's listings array
      const missingSyncListings = directListings.filter(listing => 
        !userListingsIds.has(listing.id.toString())
      );
      
      if (missingSyncListings.length > 0) {
        // Update user's listings array with missing listings
        await axios.post(
          `http://${window.location.hostname}:5002/api/users/sync-listings`,
          { 
            userId: user._id,
            listingIds: missingSyncListings.map(l => l.id)
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        alert(`Successfully added ${missingSyncListings.length} missing listings to your profile.`);
        
        // Refresh debug data
        await fetchDebugData();
      } else {
        alert('No listing synchronization issues found.');
      }
    } catch (err) {
      console.error('Error fixing listing issues:', err);
      alert(err.response?.data?.message || 'Failed to fix listing issues');
    } finally {
      setFixingIssue(false);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">
          You must be logged in to access this page.
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/login')}
          sx={{ mt: 2 }}
        >
          Go to Login
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            Listing Debug Tool
          </Typography>
          <Box>
            <Button 
              variant="outlined" 
              startIcon={<ArrowBack />} 
              onClick={() => navigate('/profile')}
              sx={{ mr: 1 }}
            >
              Back to Profile
            </Button>
            <Button 
              variant="contained" 
              startIcon={<Refresh />} 
              onClick={fetchDebugData}
              disabled={loading}
            >
              Refresh Data
            </Button>
          </Box>
        </Box>
        
        <Typography variant="body1" paragraph>
          This tool helps diagnose and fix issues with your listings not appearing in your profile.
        </Typography>
        
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        ) : debugData ? (
          <>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">User Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="User ID" 
                      secondary={debugData.user.id} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Name" 
                      secondary={debugData.user.name} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Email" 
                      secondary={debugData.user.email} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Listings Count in User Object" 
                      secondary={debugData.user.listingsCount} 
                    />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
            
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">
                  Direct Listings ({debugData.directListings.length})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  These are listings where you are set as the owner, found by querying the listings collection directly.
                </Typography>
                
                {debugData.directListings.length === 0 ? (
                  <Alert severity="info">No direct listings found.</Alert>
                ) : (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Title</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Category</TableCell>
                          <TableCell>Created At</TableCell>
                          <TableCell>In User's Array</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {debugData.directListings.map((listing) => {
                          const inUserArray = debugData.user.listingsIds.some(
                            id => id === listing.id || id.toString() === listing.id.toString()
                          );
                          
                          return (
                            <TableRow key={listing.id} sx={{ 
                              backgroundColor: inUserArray ? 'inherit' : 'rgba(255, 0, 0, 0.05)'
                            }}>
                              <TableCell>{listing.id}</TableCell>
                              <TableCell>{listing.title}</TableCell>
                              <TableCell>{listing.price} TND</TableCell>
                              <TableCell>{listing.category}</TableCell>
                              <TableCell>
                                {new Date(listing.createdAt).toLocaleString()}
                              </TableCell>
                              <TableCell>
                                {inUserArray ? 'Yes' : 'No'}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </AccordionDetails>
            </Accordion>
            
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">
                  User's Listings Array ({debugData.userListingsDetails.length})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  These are the listing IDs stored in your user profile's listings array.
                </Typography>
                
                {debugData.userListingsDetails.length === 0 ? (
                  <Alert severity="info">No listings in user's listings array.</Alert>
                ) : (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Exists</TableCell>
                          <TableCell>Title</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Category</TableCell>
                          <TableCell>Created At</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {debugData.userListingsDetails.map((listing) => (
                          <TableRow key={listing.id} sx={{ 
                            backgroundColor: listing.exists ? 'inherit' : 'rgba(255, 0, 0, 0.05)'
                          }}>
                            <TableCell>{listing.id}</TableCell>
                            <TableCell>{listing.exists ? 'Yes' : 'No'}</TableCell>
                            <TableCell>
                              {listing.details?.title || 'N/A'}
                            </TableCell>
                            <TableCell>
                              {listing.details?.price ? `${listing.details.price} TND` : 'N/A'}
                            </TableCell>
                            <TableCell>
                              {listing.details?.category || 'N/A'}
                            </TableCell>
                            <TableCell>
                              {listing.details?.createdAt 
                                ? new Date(listing.details.createdAt).toLocaleString() 
                                : 'N/A'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </AccordionDetails>
            </Accordion>
            
            <Divider sx={{ my: 3 }} />
            
            <Box>
              <Typography variant="h6" gutterBottom>
                Diagnosis
              </Typography>
              
              {debugData.directListings.length === 0 ? (
                <Alert severity="info" sx={{ mb: 2 }}>
                  You don't have any listings yet. Try creating a new listing.
                </Alert>
              ) : debugData.directListings.length > debugData.user.listingsCount ? (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Found {debugData.directListings.length} listings in the database, but only {debugData.user.listingsCount} in your user profile. 
                  This is likely why some listings don't appear in your profile.
                </Alert>
              ) : (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Your listings count matches between the database and your user profile.
                </Alert>
              )}
              
              <Button
                variant="contained"
                color="primary"
                onClick={fixListingIssues}
                disabled={fixingIssue || debugData.directListings.length === 0}
                startIcon={fixingIssue ? <CircularProgress size={20} /> : null}
                sx={{ mt: 2 }}
              >
                {fixingIssue ? 'Fixing Issues...' : 'Fix Listing Issues'}
              </Button>
            </Box>
          </>
        ) : null}
      </Paper>
    </Container>
  );
};

export default ListingDebug;
