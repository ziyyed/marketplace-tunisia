import express from 'express';
import { verifyToken } from './auth.js';
import User from '../models/User.js';
import Listing from '../models/Listing.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Ensure directory exists
    const uploadsDir = path.join(__dirname, '..', 'uploads', 'avatars');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  },
  fileFilter: function(req, file, cb) {
    // Accept only images
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    console.log('Getting profile for user:', req.user._id);
    const user = await User.findById(req.user._id).select('-password');
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
    const { name, email, location, phone, bio } = req.body;
    console.log('Updating profile for user:', req.user._id);
    console.log('Update data:', { name, email, location, phone, bio });

    // Find and update user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (location) user.location = location;
    if (phone) user.phone = phone;
    if (bio) user.bio = bio;

    await user.save();
    console.log('User profile updated successfully');

    // Return updated user without password
    const updatedUser = await User.findById(req.user._id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Update user avatar
router.put('/avatar', verifyToken, upload.single('avatar'), async (req, res) => {
  try {
    console.log('Updating avatar for user:', req.user._id);

    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    // Find user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update avatar path
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    user.avatar = avatarUrl;

    await user.save();
    console.log('User avatar updated successfully');

    res.json({ message: 'Avatar updated successfully', avatar: avatarUrl });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({ message: 'Error updating avatar' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    console.log('Getting user by ID:', req.params.id);
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Get listings by user ID
router.get('/:id/listings', async (req, res) => {
  try {
    console.log('Getting listings for user:', req.params.id);
    const listings = await Listing.find({ user: req.params.id, status: 'active' })
      .sort({ createdAt: -1 })
      .exec();

    console.log(`Found ${listings.length} listings for user`);
    res.json(listings);
  } catch (error) {
    console.error('Get user listings error:', error);
    res.status(500).json({ message: 'Error fetching user listings' });
  }
});

export default router;