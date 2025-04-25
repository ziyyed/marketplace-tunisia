import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  TextField,
  CircularProgress,
  Card,
  CardMedia,
  IconButton,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { tunisianLocations } from '../utils/locationData';
import {
  AddPhotoAlternate,
  Delete,
  Send,
} from '@mui/icons-material';

const categories = [
  'Electronics',
  'Home & Garden',
  'Vehicles',
  'Jobs',
  'Services',
  'Fashion'
];

const conditions = [
  'New',
  'Used - Like New',
  'Used - Good',
  'Used - Fair',
  'Used - Poor',
  'For Parts'
];



const CreateListing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imageError, setImageError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Electronics',
    condition: 'New',
    location: 'Tunis',
    neighborhood: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'category' && (value === 'Services' || value === 'Jobs')) {
      setFormData({
        ...formData,
        [name]: value,
        condition: 'Not Applicable'
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setImageError('');

    if (files.length > 10 || images.length + files.length > 10) {
      setImageError('Maximum 10 images allowed');
      return;
    }

    const newImageFiles = [...imageFiles];
    const newImageUrls = [...images];

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        setImageError('Each image must be less than 5MB');
        return;
      }

      if (!file.type.match('image.*')) {
        setImageError('Only image files are allowed');
        return;
      }

      newImageFiles.push(file);
      const imageUrl = URL.createObjectURL(file);
      newImageUrls.push(imageUrl);
    });

    setImageFiles(newImageFiles);
    setImages(newImageUrls);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newImageFiles = [...imageFiles];

    URL.revokeObjectURL(newImages[index]);
    newImages.splice(index, 1);
    newImageFiles.splice(index, 1);

    setImages(newImages);
    setImageFiles(newImageFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please log in to create a listing');
      navigate('/login');
      return;
    }

    if (images.length === 0) {
      setImageError('At least one image is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('condition', formData.condition);
      data.append('location', formData.location);

      if (formData.neighborhood) {
        data.append('neighborhood', formData.neighborhood);
      }

      if (formData.phone) {
        data.append('phone', formData.phone);
      }

      imageFiles.forEach(file => {
        data.append('images', file);
      });

      console.log('Submitting listing with data:', {
        title: formData.title,
        price: formData.price,
        category: formData.category,
        location: formData.location,
        imageCount: imageFiles.length
      });

      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('You are not logged in. Please log in and try again.');
        navigate('/login');
        return;
      }

      toast.info('Creating your listing...', { autoClose: 2000 });

      const response = await axios.post(
        `http://${window.location.hostname}:5002/api/listings`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
          timeout: 30000 // 30 seconds timeout
        }
      );

      console.log('Listing created successfully:', response.data);
      toast.success('Listing created successfully!');

      navigate('/profile');
    } catch (error) {
      console.error('Error creating listing:', error);

      if (error.response) {
        console.error('Server response error:', error.response.data);
        toast.error(error.response.data.message || 'Server error. Please try again.');
      } else if (error.request) {
        console.error('No response received:', error.request);
        toast.error('No response from server. Please check your internet connection.');
      } else {
        console.error('Request setup error:', error.message);
        toast.error('Error creating listing: ' + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Create New Listing
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Fill in the details below to create your listing.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="What are you selling?"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {formData.category !== 'Services' && formData.category !== 'Jobs' && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Condition</InputLabel>
                  <Select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    label="Condition"
                  >
                    {conditions.map((condition) => (
                      <MenuItem key={condition} value={condition}>
                        {condition}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            {(formData.category === 'Services' || formData.category === 'Jobs') && (
              <input type="hidden" name="condition" value="Not Applicable" />
            )}

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your item in detail"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">TND</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your contact number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">+216</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>City</InputLabel>
                <Select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  label="City"
                >
                  {tunisianLocations.map((location) => (
                    <MenuItem key={location} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Neighborhood"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleChange}
                placeholder="Your neighborhood"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Upload Images
              </Typography>

              <Button
                variant="outlined"
                component="label"
                startIcon={<AddPhotoAlternate />}
                sx={{ mb: 2 }}
              >
                Select Images
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleImageUpload}
                />
              </Button>

              {imageError && (
                <Typography color="error" variant="body2" sx={{ ml: 2 }}>
                  {imageError}
                </Typography>
              )}

              <Grid container spacing={2} sx={{ mt: 1 }}>
                {images.map((image, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <Card sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="120"
                        image={image}
                        alt={`Image ${index + 1}`}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 5,
                          right: 5,
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
                        }}
                        onClick={() => removeImage(index)}
                      >
                        <Delete />
                      </IconButton>
                      {index === 0 && (
                        <Typography
                          variant="caption"
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            textAlign: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            color: 'white',
                            py: 0.5,
                          }}
                        >
                          Main Image
                        </Typography>
                      )}
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={isSubmitting}
                sx={{ mt: 2, py: 1.5, borderRadius: 2 }}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
              >
                {isSubmitting ? 'Creating Listing...' : 'Post Listing'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateListing;