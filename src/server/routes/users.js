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
    console.log('Avatar upload directory:', uploadsDir);
    if (!fs.existsSync(uploadsDir)) {
      console.log('Creating avatar directory:', uploadsDir);
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = 'avatar-' + uniqueSuffix + path.extname(file.originalname);
    console.log('Generated filename for avatar:', filename);
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: function(req, file, cb) {
    // Accept only images
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      console.log('File type rejected:', file.originalname);
      return cb(new Error('Only image files are allowed!'), false);
    }
    console.log('File type accepted:', file.originalname);
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
    if (location !== undefined) user.location = location;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;

    console.log('Updated user data:', {
      name: user.name,
      email: user.email,
      bio: user.bio,
      location: user.location,
      phone: user.phone
    });

    await user.save();
    console.log('User profile updated successfully');

    // Return updated user without password
    const updatedUser = await User.findById(req.user._id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating profile: ' + error.message });
  }
});

// Update user avatar
router.put('/avatar', verifyToken, async (req, res) => {
  try {
    console.log('Updating avatar for user:', req.user._id);

    // Use multer middleware manually to handle file upload
    upload.single('avatar')(req, res, async (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ message: 'Error uploading file: ' + err.message });
      }

      console.log('Request file after multer:', req.file ? 'Present' : 'Missing');

      if (!req.file) {
        return res.status(400).json({ message: 'No image uploaded' });
      }

      console.log('File details:', {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
      });

      try {
        // Find user
        const user = await User.findById(req.user._id);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        // Update avatar path
        const avatarUrl = `/uploads/avatars/${req.file.filename}`;
        user.avatar = avatarUrl;

        await user.save();
        console.log('User avatar updated successfully with URL:', avatarUrl);

        res.json({ message: 'Avatar updated successfully', avatar: avatarUrl });
      } catch (error) {
        console.error('User update error:', error);
        res.status(500).json({ message: 'Error updating user: ' + error.message });
      }
    });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({ message: 'Error updating avatar: ' + error.message });
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

// Sync user listings - add missing listings to user's listings array
router.post('/sync-listings', verifyToken, async (req, res) => {
  try {
    console.log('Syncing listings for user:', req.user._id);
    const { userId, listingIds } = req.body;

    // Verify user is authorized to sync these listings
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ message: 'You can only sync your own listings' });
    }

    if (!listingIds || !Array.isArray(listingIds) || listingIds.length === 0) {
      return res.status(400).json({ message: 'No listing IDs provided' });
    }

    console.log(`Attempting to sync ${listingIds.length} listings for user ${userId}`);

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get current listings array
    const currentListings = user.listings.map(id => id.toString());
    console.log('Current listings:', currentListings);

    // Filter out listings that are already in the user's listings array
    const newListingIds = listingIds.filter(id => !currentListings.includes(id.toString()));
    console.log('New listings to add:', newListingIds);

    if (newListingIds.length === 0) {
      return res.json({ message: 'No new listings to sync', addedCount: 0 });
    }

    // Verify all listings exist and belong to this user
    for (const listingId of newListingIds) {
      const listing = await Listing.findById(listingId);
      if (!listing) {
        return res.status(404).json({ message: `Listing ${listingId} not found` });
      }

      if (listing.user.toString() !== userId) {
        return res.status(403).json({
          message: `Listing ${listingId} does not belong to this user`
        });
      }
    }

    // Add new listings to user's listings array
    const result = await User.findByIdAndUpdate(
      userId,
      { $push: { listings: { $each: newListingIds } } },
      { new: true }
    );

    console.log(`Successfully added ${newListingIds.length} listings to user ${userId}`);
    console.log('User now has', result.listings.length, 'listings');

    res.json({
      message: 'Listings synced successfully',
      addedCount: newListingIds.length,
      totalCount: result.listings.length
    });
  } catch (error) {
    console.error('Sync listings error:', error);
    res.status(500).json({ message: 'Error syncing listings: ' + error.message });
  }
});

export default router;