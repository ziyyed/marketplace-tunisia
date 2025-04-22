import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [2, 'Title must be at least 2 characters long']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  condition: {
    type: String,
    default: 'Used'
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  neighborhood: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  model: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  images: {
    type: [String],
    default: []
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'inactive'],
    default: 'active'
  },
  views: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    value: {
      type: Number,
      required: true,
      min: 0.5,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

export default mongoose.model('Listing', listingSchema);