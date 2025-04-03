import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Avatar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { users } from '../services/api';

interface ProfileData {
  name: string;
  email: string;
  avatar?: string;
}

export default function Profile() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<ProfileData>({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
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
    setSuccess('');
    setLoading(true);

    try {
      await users.updateProfile(formData);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    try {
      logout();
    } catch (err) {
      setError('Failed to log out');
      console.error('Error logging out:', err);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} display="flex" justifyContent="center">
              <Avatar
                src={formData.avatar}
                alt={formData.name}
                sx={{ width: 120, height: 120 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h4" component="h1" gutterBottom align="center">
                Profile Settings
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      name="name"
                      label="Full Name"
                      fullWidth
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      name="email"
                      label="Email"
                      type="email"
                      fullWidth
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      name="avatar"
                      label="Avatar URL"
                      fullWidth
                      value={formData.avatar}
                      onChange={handleChange}
                      helperText="Enter the URL of your profile picture"
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
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </form>

              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleLogout}
                  sx={{ mt: 2 }}
                >
                  Log Out
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
} 