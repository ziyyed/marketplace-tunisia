import axios from 'axios';

const API_URL = 'http://localhost:5003/api';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/api' : API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

// Listings API
const listings = {
  getAll: () => api.get('/listings'),
  getById: (id) => api.get(`/listings/${id}`),
  search: (filters) => api.get('/listings/search', { params: filters }),
  create: (data) => api.post('/listings', data),
  update: (id, data) => api.put(`/listings/${id}`, data),
  delete: (id) => api.delete(`/listings/${id}`),
  getByUser: (userId) => api.get(`/listings/user/${userId}`),
  getFavorites: () => api.get('/listings/favorites'),
};

// Users API
const users = {
  getProfile: () => api.get('/users/profile'),
  getById: (id) => api.get(`/users/${id}`),
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
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  verifyToken: () => api.get('/auth/verify'),
  logout: () => {
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