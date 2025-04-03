import express from 'express';
import Listing from '../models/Listing.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all listings
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, minPrice, maxPrice } = req.query;
    let query = { status: 'active' };

    // Apply filters
    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Apply sorting
    let sortOption = {};
    if (sort) {
      switch (sort) {
        case 'price_asc':
          sortOption.price = 1;
          break;
        case 'price_desc':
          sortOption.price = -1;
          break;
        case 'newest':
          sortOption.createdAt = -1;
          break;
        case 'oldest':
          sortOption.createdAt = 1;
          break;
        default:
          sortOption.createdAt = -1;
      }
    }

    const listings = await Listing.find(query)
      .sort(sortOption)
      .populate('seller', 'name avatar rating reviews')
      .exec();

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching listings', error: error.message });
  }
});

// Get single listing
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('seller', 'name avatar rating reviews')
      .exec();

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Increment views
    listing.views += 1;
    await listing.save();

    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching listing', error: error.message });
  }
});

// Create listing
router.post('/', auth, async (req, res) => {
  try {
    const listing = new Listing({
      ...req.body,
      seller: req.user.userId
    });

    await listing.save();
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Error creating listing', error: error.message });
  }
});

// Update listing
router.put('/:id', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if user is the seller
    if (listing.seller.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(listing, req.body);
    await listing.save();

    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Error updating listing', error: error.message });
  }
});

// Delete listing
router.delete('/:id', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if user is the seller
    if (listing.seller.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    listing.status = 'deleted';
    await listing.save();

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting listing', error: error.message });
  }
});

export default router; 