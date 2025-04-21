import express from 'express';
import mongoose from 'mongoose';
import auth from '../middleware/auth.js';
import Listing from '../models/Listing.js';
import User from '../models/User.js';

const router = express.Router();

// IMPORTANT: Order of routes matters!
// 1. First, specific routes with static paths

// Get listings by user ID - must be before /:id to avoid being interpreted as an ID
router.get('/user/:userId', async (req, res) => {
  try {
    console.log(`Getting listings for user: ${req.params.userId}`);

    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const listings = await Listing.find({
      user: req.params.userId,
      status: 'active'
    })
    .sort({ createdAt: -1 })
    .populate('user', 'name avatar')
    .exec();

    console.log(`Found ${listings.length} listings for user`);
    res.json(listings);
  } catch (error) {
    console.error('Error fetching user listings:', error);
    res.status(500).json({ message: error.message });
  }
});

// Search listings - must be before /:id to avoid being interpreted as an ID
router.get('/search', async (req, res) => {
  try {
    console.log('Search request received with query:', req.query);
    const { query, category, minPrice, maxPrice, condition, city, sort } = req.query;
    const searchQuery = {};

    // Build the search query with all possible filters
    if (query) {
      searchQuery.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    if (category) {
      searchQuery.category = category;
    }

    if (condition) {
      searchQuery.condition = condition;
    }

    if (city) {
      searchQuery.location = city;
    }

    if (minPrice || maxPrice) {
      searchQuery.price = {};
      if (minPrice) searchQuery.price.$gte = Number(minPrice);
      if (maxPrice) searchQuery.price.$lte = Number(maxPrice);
    }

    // Default sorting by newest
    let sortOption = { createdAt: -1 };

    if (sort) {
      switch (sort) {
        case 'price_asc':
          sortOption = { price: 1 };
          break;
        case 'price_desc':
          sortOption = { price: -1 };
          break;
        case 'newest':
          sortOption = { createdAt: -1 };
          break;
        case 'oldest':
          sortOption = { createdAt: 1 };
          break;
      }
    }

    // Query the database
    const listings = await Listing.find(searchQuery)
      .sort(sortOption)
      .populate('user', 'name avatar')
      .exec();

    console.log(`Found ${listings.length} listings matching query`);
    res.json(listings);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create listing (POST must come before /:id GET)
router.post('/', auth, async (req, res) => {
  try {
    console.log('=======================================');
    console.log('Create listing route handler called');
    console.log('Auth user:', req.user?._id || 'Not authenticated');
    console.log('Request body keys:', Object.keys(req.body));
    console.log('Request files:', req.files?.length || 'No files');

    // Get data from the request
    const { title, description, price, category, condition, location } = req.body;

    // Print values to verify
    console.log('Title:', title);
    console.log('Description:', description?.substring(0, 30) + '...');
    console.log('Price:', price);
    console.log('Category:', category);
    console.log('Condition:', condition || 'Not provided');
    console.log('Location:', location);

    // Basic validation
    if (!title) {
      console.log('VALIDATION ERROR: Missing title');
      return res.status(400).json({ message: 'Title is required' });
    }
    if (!description) {
      console.log('VALIDATION ERROR: Missing description');
      return res.status(400).json({ message: 'Description is required' });
    }
    if (!price) {
      console.log('VALIDATION ERROR: Missing price');
      return res.status(400).json({ message: 'Price is required' });
    }
    if (!category) {
      console.log('VALIDATION ERROR: Missing category');
      return res.status(400).json({ message: 'Category is required' });
    }
    if (!location) {
      console.log('VALIDATION ERROR: Missing location');
      return res.status(400).json({ message: 'Location is required' });
    }

    // Process uploaded files (if any)
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      console.log(`Processing ${req.files.length} images`);
      req.files.forEach((file) => {
        // Save the file path to the database
        const imageUrl = `/uploads/${file.filename}`;
        imageUrls.push(imageUrl);
      });
    } else {
      // No images uploaded, use a default placeholder
      console.log('No images uploaded, using default placeholder');
      imageUrls.push(`https://placehold.co/600x400?text=${encodeURIComponent(title)}`);
    }

    // Create a new listing document
    const newListing = new Listing({
      title,
      description,
      price: Number(price),
      category,
      condition: condition || 'Used',
      location,
      images: imageUrls,
      user: req.user._id
    });

    console.log('Saving listing to database with data:', {
      title,
      price: Number(price),
      category,
      condition: condition || 'Used',
      location,
      userId: req.user._id,
      imageCount: imageUrls.length
    });

    try {
      const savedListing = await newListing.save();
      console.log('Listing saved successfully with ID:', savedListing._id);

      // Add the listing to the user's listings array
      try {
        const updatedUser = await User.findByIdAndUpdate(
          req.user._id,
          { $push: { listings: savedListing._id } },
          { new: true }
        );

        if (updatedUser) {
          console.log('Updated user document with new listing reference');
          console.log('User now has', updatedUser.listings.length, 'listings');
        } else {
          console.error('User not found when updating listings array');
        }
      } catch (userUpdateError) {
        console.error('Error updating user with new listing:', userUpdateError);
        // Continue even if user update fails - the listing is still saved
      }
    } catch (saveError) {
      console.error('Error saving listing to database:', saveError);
      return res.status(500).json({ message: 'Error saving listing to database', error: saveError.message });
    }

    // Return success response with the created listing
    res.status(201).json({
      message: 'Listing created successfully',
      listing: newListing
    });
  } catch (error) {
    console.error('ERROR creating listing:', error);
    res.status(500).json({ message: 'Failed to create listing', error: error.message });
  }
});

// 2. Then, get all listings
router.get('/', async (req, res) => {
  try {
    console.log("Getting all listings");
    const listings = await Listing.find({ status: 'active' })
      .sort({ createdAt: -1 })
      .populate('user', 'name avatar')
      .exec();

    console.log(`Found ${listings.length} listings`);
    res.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ message: error.message });
  }
});

// 3. Last, routes with path parameters like :id
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid listing ID' });
    }

    const listing = await Listing.findById(req.params.id)
      .populate('user', 'name avatar')
      .exec();

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.json(listing);
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({ message: error.message });
  }
});

// Rate a listing
router.post('/:id/rate', auth, async (req, res) => {
  try {
    const { rating } = req.body;

    if (!rating || rating < 0.5 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 0.5 and 5' });
    }

    console.log(`User ${req.user._id} rating listing ${req.params.id} with ${rating} stars`);

    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if the user is the owner of the listing
    if (listing.user.toString() === req.user._id.toString()) {
      return res.status(403).json({ message: 'You cannot rate your own listing' });
    }

    // Check if user has already rated this listing
    const existingRatingIndex = listing.ratings.findIndex(
      r => r.user.toString() === req.user._id.toString()
    );

    if (existingRatingIndex > -1) {
      // Update existing rating
      listing.ratings[existingRatingIndex].value = rating;
    } else {
      // Add new rating
      listing.ratings.push({
        user: req.user._id,
        value: rating
      });
    }

    // Calculate new average rating
    const totalRating = listing.ratings.reduce((sum, r) => sum + r.value, 0);
    listing.rating = totalRating / listing.ratings.length;
    listing.ratingCount = listing.ratings.length;

    await listing.save();

    res.json({
      message: 'Rating submitted successfully',
      rating: listing.rating,
      ratingCount: listing.ratingCount
    });
  } catch (error) {
    console.error('Error rating listing:', error);
    res.status(500).json({ message: 'Error submitting rating' });
  }
});

export default router;