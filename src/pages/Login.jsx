import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  Paper,
  InputAdornment,
} from '@mui/material';
import {
  Person,
  Lock,
  Email,
  ArrowBack,
  PersonAdd,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  });
  const [loading, setLoading] = useState(false);

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation
    if (name === 'email') {
      if (!value.trim()) {
        setErrors(prev => ({ ...prev, email: '' }));
      } else if (!validateEmail(value)) {
        setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      } else {
        setErrors(prev => ({ ...prev, email: '' }));
      }
    }

    if (name === 'password') {
      if (!value.trim()) {
        setErrors(prev => ({ ...prev, password: '' }));
      } else if (value.length < 6) {
        setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
      } else {
        setErrors(prev => ({ ...prev, password: '' }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(prev => ({ ...prev, general: '', email: '', password: '' }));

    // Validate form before submission
    let isValid = true;

    if (!formData.email.trim()) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      isValid = false;
    }

    if (!formData.password.trim()) {
      setErrors(prev => ({ ...prev, password: 'Password is required' }));
      isValid = false;
    } else if (formData.password.length < 6) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);

    try {
      await login(formData);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);

      // Check if the error is about invalid credentials
      if (err.response?.data?.message === 'Invalid credentials') {
        // Show more specific error messages for login failures
        setErrors(prev => ({
          ...prev,
          email: 'Email or password is incorrect',
          password: 'Email or password is incorrect',
          general: ''
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          general: err.response?.data?.message || 'Failed to login. Please try again.'
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2,
            background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Person sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
            <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold' }}>
              Sign In
            </Typography>
          </Box>

          {errors.general && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errors.general}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontSize: '1.1rem',
                textTransform: 'none',
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6,
                },
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Link
              component="span"
              variant="body2"
              sx={{
                display: 'block',
                mb: 2,
                color: 'primary.main',
                textDecoration: 'none',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
              onClick={() => {}}
            >
              Forgot Password?
            </Link>
            <Link
              component={RouterLink}
              to="/register"
              variant="body2"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              <PersonAdd sx={{ mr: 1 }} />
              Don't have an account? Sign Up
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;