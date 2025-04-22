import express from 'express';
import mongoose from 'mongoose';
import auth from '../middleware/auth.js';
import Listing from '../models/Listing.js';
import User from '../models/User.js';

const router = express.Router();

// IMPORTANT: Order of routes matters!
// 1. First, specific routes with static paths

// Debug route to get detailed information about user listings
router.get('/debug/user/:userId', async (req, res) => {
  try {
    console.log(`DEBUG: Getting detailed listing info for user: ${req.params.userId}`);

    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Get user information
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's listings array
    const userListingsIds = user.listings || [];
    console.log(`User has ${userListingsIds.length} listing IDs in their listings array:`, userListingsIds);

    // Get all listings where user is the owner
    const directListings = await Listing.find({ user: req.params.userId }).lean();
    console.log(`Found ${directListings.length} listings directly for user`);

    // Get detailed information about each listing in the user's listings array
    const userListingsDetails = [];
    for (const listingId of userListingsIds) {
      const listing = await Listing.findById(listingId).lean();
      userListingsDetails.push({
        id: listingId,
        exists: !!listing,
        details: listing ? {
          title: listing.title,
          price: listing.price,
          category: listing.category,
          createdAt: listing.createdAt
        } : null
      });
    }

    // Return detailed debug information
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        listingsCount: userListingsIds.length,
        listingsIds: userListingsIds
      },
      userListingsDetails,
      directListings: directListings.map(l => ({
        id: l._id,
        title: l.title,
        price: l.price,
        category: l.category,
        createdAt: l.createdAt
      }))
    });
  } catch (error) {
    console.error('Error in debug route:', error);
    res.status(500).json({ message: error.message, stack: error.stack });
  }
});

// Get listings by user ID - must be before /:id to avoid being interpreted as an ID
router.get('/user/:userId', async (req, res) => {
  try {
    console.log(`Getting listings for user: ${req.params.userId}`);

    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // First, try to get the user to access their listings array
    const user = await User.findById(req.params.userId).populate('listings');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`User has ${user.listings?.length || 0} listings in their listings array`);

    // As a backup, also query listings directly
    const directListings = await Listing.find({
      user: req.params.userId
    })
    .sort({ createdAt: -1 })
    .populate('user', 'name avatar')
    .exec();

    console.log(`Found ${directListings.length} listings directly for user`);

    // Combine both approaches to ensure we get all listings
    let allListings = [];

    // Add listings from user.listings if they exist
    if (user.listings && user.listings.length > 0) {
      // Filter out any null values
      const populatedListings = user.listings.filter(listing => listing != null);
      allListings = [...populatedListings];
    }

    // Add any listings from direct query that aren't already included
    if (directListings.length > 0) {
      directListings.forEach(directListing => {
        // Check if this listing is already in allListings
        const exists = allListings.some(l => l._id.toString() === directListing._id.toString());
        if (!exists) {
          allListings.push(directListing);
        }
      });
    }

    // Sort by creation date
    allListings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    console.log(`Returning ${allListings.length} total listings for user`);
    res.json(allListings);
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
    let newListing = new Listing({
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
      // Save the listing without using a transaction first
      console.log('Saving listing to database without transaction');
      console.log('Listing data:', JSON.stringify(newListing, null, 2));

      try {
        const savedListing = await newListing.save();
        console.log('Listing saved successfully with ID:', savedListing._id);

        // Add the listing to the user's listings array
        console.log('Updating user with listing ID:', savedListing._id);
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
          // Don't throw an error here, just log it
          console.error('Will continue anyway as the listing was saved successfully');
        }

        // Set the listing variable for the response
        newListing = savedListing;
      } catch (mongoError) {
        console.error('MongoDB Error Details:', mongoError);
        console.error('Error Code:', mongoError.code);
        console.error('Error Name:', mongoError.name);
        console.error('Error Message:', mongoError.message);

        if (mongoError.code === 11000) {
          // Duplicate key error
          console.error('Duplicate key error. Field:', Object.keys(mongoError.keyPattern)[0]);
          return res.status(400).json({
            message: 'A listing with this information already exists',
            error: 'Duplicate entry',
            field: Object.keys(mongoError.keyPattern)[0]
          });
        }

        throw mongoError; // Re-throw for the outer catch block
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

// Delete a listing
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log(`Deleting listing ${req.params.id} by user ${req.user._id}`);

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid listing ID' });
    }

    // Find the listing
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if the user is the owner of the listing
    if (listing.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own listings' });
    }

    // Delete the listing
    await Listing.findByIdAndDelete(req.params.id);

    // Remove the listing from the user's listings array
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { listings: req.params.id } }
    );

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ message: 'Error deleting listing', error: error.message });
  }
});

export default router;