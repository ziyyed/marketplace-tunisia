import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  Container,
  Grid,
  Typography,
  Box,
  Avatar,
  Paper,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { Save, Cancel, PhotoCamera, LocationOn, Phone } from '@mui/icons-material';

const ProfileEdit = () => {
  const { user, token, setUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    phone: '',
    bio: ''
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Initialize form data with user data
    setFormData({
      name: user.name || '',
      email: user.email || '',
      location: user.location || '',
      phone: user.phone || '',
      bio: user.bio || ''
    });
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    setAvatarLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const response = await axios.put(
        `http://${window.location.hostname}:5002/api/users/avatar`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update user in context
      setUser(prev => ({
        ...prev,
        avatar: response.data.avatar
      }));

      toast.success('Avatar updated successfully');
      setAvatarFile(null);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setError('Failed to update avatar');
      toast.error('Failed to update avatar');
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `http://${window.location.hostname}:5002/api/users/profile`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update user in context
      setUser(response.data);

      toast.success('Profile updated successfully');
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Edit Profile
          </Typography>
          <Box flexGrow={1} />
          <Button
            variant="outlined"
            startIcon={<Cancel />}
            onClick={() => navigate('/profile')}
          >
            Cancel
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Avatar Section */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6" gutterBottom color="primary">
                Profile Photo
              </Typography>
              <Avatar
                src={avatarPreview || (user.avatar?.startsWith('http') ? user.avatar :
                     `http://${window.location.hostname}:5002${user.avatar}` || '/default-avatar.png')}
                sx={{ width: 180, height: 180, mb: 3, boxShadow: 2 }}
              />
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                <Button
                  component="label"
                  variant="outlined"
                  fullWidth
                  startIcon={<PhotoCamera />}
                  color="primary"
                >
                  Select Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </Button>

                {avatarFile && (
                  <Button
                    variant="contained"
                    onClick={handleAvatarUpload}
                    disabled={avatarLoading}
                    fullWidth
                    color="success"
                  >
                    {avatarLoading ? <CircularProgress size={24} /> : 'Upload Photo'}
                  </Button>
                )}
              </Box>

              {avatarFile && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
                  Click "Upload Photo" to save your new profile picture
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Form Section */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom color="primary">
                Personal Information
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      InputProps={{
                        sx: { borderRadius: 2 }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      InputProps={{
                        sx: { borderRadius: 2 }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="City, Country"
                      variant="outlined"
                      InputProps={{
                        startAdornment: <LocationOn color="action" sx={{ mr: 1 }} />,
                        sx: { borderRadius: 2 }
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
                      placeholder="+216 XX XXX XXX"
                      variant="outlined"
                      InputProps={{
                        startAdornment: <Phone color="action" sx={{ mr: 1 }} />,
                        sx: { borderRadius: 2 }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      About Me
                    </Typography>
                    <TextField
                      fullWidth
                      label="Bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      multiline
                      rows={4}
                      placeholder="Tell others about yourself..."
                      variant="outlined"
                      InputProps={{
                        sx: { borderRadius: 2 }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Box display="flex" justifyContent="flex-end" gap={2}>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<Save />}
                        disabled={loading}
                        size="large"
                        sx={{ borderRadius: 2, px: 4 }}
                      >
                        {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfileEdit;
