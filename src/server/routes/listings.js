import express from 'express';
import mongoose from 'mongoose';
import auth from '../middleware/auth.js';
import Listing from '../models/Listing.js';
import User from '../models/User.js';

const router = express.Router();

// IMPORTANT: Order of routes matters!
// 1. First, specific routes with static paths

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
        // For now, use placeholder images since we're not saving the files permanently
        const imageUrl = `https://placehold.co/600x400?text=${encodeURIComponent(title)}`;
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
    
    console.log('Saving listing to database...');
    const savedListing = await newListing.save();
    console.log('Listing saved with ID:', savedListing._id);
    
    // Add the listing to the user's listings array
    await User.findByIdAndUpdate(
      req.user._id, 
      { $push: { listings: savedListing._id } },
      { new: true }
    );
    console.log('Updated user document with new listing reference');
    
    // Return success response with the created listing
    res.status(201).json({
      message: 'Listing created successfully',
      listing: savedListing
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

export default router;