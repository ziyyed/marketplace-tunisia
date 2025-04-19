import express from 'express';
import { verifyToken } from './auth.js';

const router = express.Router();

// Mock user data
const mockUsers = [
  {
    _id: 'user1',
    name: 'Test User',
    email: 'test@example.com',
    avatar: 'https://placehold.co/150?text=TU',
    location: 'Tunis',
    phone: '12345678'
  }
];

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = mockUsers.find(user => user._id === req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, email, location, phone } = req.body;
    
    // Find user
    const userIndex = mockUsers.findIndex(user => user._id === req.user._id);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user
    const user = mockUsers[userIndex];
    mockUsers[userIndex] = {
      ...user,
      name: name || user.name,
      email: email || user.email,
      location: location || user.location,
      phone: phone || user.phone
    };
    
    res.json(mockUsers[userIndex]);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Get user by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const user = mockUsers.find(user => user._id === req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

export default router; 