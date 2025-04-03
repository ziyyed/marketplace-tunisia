import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  MenuItem,
  Alert,
} from '@mui/material';
import { listings } from '../services/api';

const categories = [
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Vehicles',
  'Sports',
  'Books',
  'Other',
];

const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

export default function CreateListing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    location: '',
    images: [] as string[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const listingData = {
        ...formData,
        price: parseFloat(formData.price),
      };

      const response = await listings.create(listingData);
      navigate(`/listing/${response.id}`);
    } catch (err) {
      setError('Failed to create listing');
      console.error('Error creating listing:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Create New Listing
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="title"
                  label="Title"
                  fullWidth
                  required
                  value={formData.title}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  fullWidth
                  required
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="price"
                  label="Price"
                  type="number"
                  fullWidth
                  required
                  value={formData.price}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: '$',
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="location"
                  label="Location"
                  fullWidth
                  required
                  value={formData.location}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="category"
                  label="Category"
                  select
                  fullWidth
                  required
                  value={formData.category}
                  onChange={handleChange}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="condition"
                  label="Condition"
                  select
                  fullWidth
                  required
                  value={formData.condition}
                  onChange={handleChange}
                >
                  {conditions.map((condition) => (
                    <MenuItem key={condition} value={condition}>
                      {condition}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="images"
                  label="Image URLs"
                  fullWidth
                  helperText="Enter image URLs separated by commas"
                  value={formData.images.join(', ')}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      images: e.target.value.split(',').map((url) => url.trim()),
                    }))
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Listing'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
} 