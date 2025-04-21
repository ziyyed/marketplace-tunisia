import axios from 'axios';
import { getApiBaseUrl } from '../utils/networkUtils';

// Get the API URL dynamically based on the environment
const API_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('Using API URL:', API_URL);

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

// Mock data for demonstration
let mockListings = [
  {
    _id: 'mock1',
    title: 'iPhone 13 Pro - Like New',
    description: 'Selling my iPhone 13 Pro in excellent condition. Used for only 6 months.',
    price: 2200,
    category: 'Electronics',
    condition: 'Used - Like New',
    location: 'Tunis',
    images: ['https://placehold.co/600x400?text=iPhone+13'],
    status: 'active',
    createdAt: new Date(2023, 5, 15).toISOString(),
    seller: {
      id: 'seller1',
      name: 'Ahmed Ben Ali',
      avatar: 'https://placehold.co/150?text=A',
      rating: 4.7,
      ratingCount: 23
    }
  },
  {
    _id: 'mock2',
    title: 'MacBook Pro 16" M1 Max',
    description: 'Powerful MacBook Pro with M1 Max chip, 32GB RAM, 1TB SSD',
    price: 5500,
    category: 'Computers',
    condition: 'Used - Good',
    location: 'Sfax',
    images: ['https://placehold.co/600x400?text=MacBook'],
    status: 'active',
    createdAt: new Date(2023, 6, 10).toISOString(),
    seller: {
      id: 'seller2',
      name: 'Lina Karoui',
      avatar: 'https://placehold.co/150?text=L',
      rating: 4.9,
      ratingCount: 41
    }
  }
];

// Listings API
const listings = {
  getAll: () => {
    console.log("Fetching all listings");
    return api.get('/listings')
      .then(response => response.data);
  },
  getById: (id) => {
    console.log(`Fetching listing with ID ${id}`);
    return api.get(`/listings/${id}`)
      .then(response => response.data);
  },
  search: (filters) => {
    console.log("Searching listings with filters:", filters);
    return api.get('/listings/search', { params: filters })
      .then(response => response.data);
  },
  create: (data) => {
    console.log("Creating new listing with data:",
      data instanceof FormData
        ? "FormData object"
        : data
    );

    // If it's not FormData, convert it to FormData for file uploads
    let formData;
    if (!(data instanceof FormData)) {
      formData = new FormData();
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });
    } else {
      formData = data;

      // Debug FormData contents
      console.log("FormData fields:");
      for(let pair of formData.entries()) {
        // Don't log file objects, just their names
        if (pair[1] instanceof File) {
          console.log(pair[0], "File:", pair[1].name);
        } else {
          console.log(pair[0], pair[1]);
        }
      }
    }

    // Make the API call to the server with proper content type for FormData
    return api.post('/listings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(response => {
      console.log("Listing created successfully:", response.data);
      return response;
    }).catch(error => {
      console.error("Error creating listing:", error.response?.data || error.message);
      throw error;
    });
  },
  update: (id, data) => api.put(`/listings/${id}`, data),
  delete: (id) => api.delete(`/listings/${id}`),
  getByUser: async (userId) => {
    try {
      console.log(`Fetching listings for user ${userId}`);
      const response = await api.get(`/listings/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching listings for user ${userId}:`, error);
      // Return empty array instead of throwing to avoid breaking the UI
      return [];
    }
  },
  getFavorites: () => api.get('/listings/favorites'),
  rateListing: async (id, rating) => {
    try {
      console.log(`Rating listing ${id} with ${rating} stars`);
      const response = await api.post(`/listings/${id}/rate`, { rating });
      return response.data;
    } catch (error) {
      console.error(`Error rating listing ${id}:`, error);
      throw error;
    }
  },
};

// Users API
const users = {
  getProfile: () => api.get('/users/profile'),
  getById: async (id) => {
    try {
      console.log(`Fetching user with ID ${id}`);
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to load user profile');
    }
  },
  updateProfile: (data) => api.put('/users/profile', data),
  updateAvatar: (formData) => api.put('/users/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getNotifications: () => api.get('/users/notifications'),
};

// Messages API
const messages = {
  getConversations: () => api.get('/messages/conversations'),
  getMessages: (conversationId) => api.get(`/messages/${conversationId}`),
  sendMessage: (conversationId, content) => api.post(`/messages/${conversationId}`, { content }),
};

// Auth API
const auth = {
  login: async (credentials) => {
    console.log('Login request with:', credentials.email);
    try {
      const response = await api.post('/auth/login', credentials);
      console.log('Login response:', response.status);

      // Save token
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        console.log('Token saved to localStorage');
      }

      return response;
    } catch (error) {
      console.error('Login API error:', error.message);
      throw error;
    }
  },

  register: async (userData) => {
    console.log('Registration request for:', userData.email);
    try {
      const response = await api.post('/auth/register', userData);
      console.log('Registration response:', response.status);

      // Save token
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        console.log('Token saved to localStorage');
      }

      return response;
    } catch (error) {
      console.error('Registration API error:', error.message);
      throw error;
    }
  },

  verifyToken: async () => {
    const token = localStorage.getItem('token');
    console.log('Verifying token:', token ? `${token.substring(0, 15)}...` : 'No token');

    if (!token) {
      return Promise.reject(new Error('No token found'));
    }

    try {
      // Ensure header is set
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await api.get('/auth/verify');
      console.log('Token verification response:', response.status);
      return response;
    } catch (error) {
      console.error('Token verification error:', error.message);
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      throw error;
    }
  },

  logout: () => {
    console.log('Logging out, removing token');
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  },

  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
};

// Backward compatible exports
export const getListings = () => listings.getAll();
export const getListingById = (id) => listings.getById(id);
export const searchListings = (query) => listings.search(query);
export const createListing = (data) => listings.create(data);
export const updateListing = (id, data) => listings.update(id, data);
export const deleteListing = (id) => listings.delete(id);
export const getUserListings = (userId) => listings.getByUser(userId);
export const getFavoriteListings = () => listings.getFavorites();

// Auth exports
export const login = (credentials) => auth.login(credentials);
export const register = (userData) => auth.register(userData);
export const logout = () => auth.logout();

export { api, auth, listings, users, messages };