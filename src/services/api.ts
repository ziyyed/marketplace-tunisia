import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
};

// Listings API
export const listings = {
  getAll: async (params?: { sort?: string; category?: string; search?: string }) => {
    const response = await api.get('/listings', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/listings/${id}`);
    return response.data;
  },
  create: async (listing: {
    title: string;
    price: number;
    description: string;
    category: string;
    condition: string;
    location: string;
    images: string[];
  }) => {
    const response = await api.post('/listings', listing);
    return response.data;
  },
  update: async (id: string, listing: {
    title?: string;
    price?: number;
    description?: string;
    category?: string;
    condition?: string;
    location?: string;
    images?: string[];
  }) => {
    const response = await api.put(`/listings/${id}`, listing);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/listings/${id}`);
    return response.data;
  },
};

// User API
export const users = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  updateProfile: async (data: {
    name?: string;
    email?: string;
    avatar?: string;
  }) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },
  getListings: async () => {
    const response = await api.get('/users/listings');
    return response.data;
  },
};

// Messages API
export const messages = {
  send: async (listingId: string, message: string) => {
    const response = await api.post(`/messages/${listingId}`, { message });
    return response.data;
  },
  getConversations: async () => {
    const response = await api.get('/messages/conversations');
    return response.data;
  },
  getMessages: async (conversationId: string) => {
    const response = await api.get(`/messages/${conversationId}`);
    return response.data;
  },
};

export default api; 