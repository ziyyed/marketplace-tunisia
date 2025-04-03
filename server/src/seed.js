import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Listing from './models/Listing.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace-tunisia');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Listing.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const users = await User.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        avatar: 'https://i.pravatar.cc/150?img=1',
        rating: 4.5,
        reviews: 12
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        avatar: 'https://i.pravatar.cc/150?img=2',
        rating: 4.8,
        reviews: 8
      }
    ]);
    console.log('Created sample users');

    // Create sample listings
    const listings = await Listing.create([
      {
        title: 'iPhone 13 Pro Max',
        price: 999,
        description: 'Like new iPhone 13 Pro Max, 256GB, Graphite color. Comes with original box and accessories.',
        images: ['https://picsum.photos/800/600?random=1'],
        category: 'Electronics',
        condition: 'Like New',
        location: 'Tunis',
        seller: users[0]._id,
        views: 0,
        status: 'active'
      },
      {
        title: 'Nike Air Max 2023',
        price: 150,
        description: 'Brand new Nike Air Max shoes, size 42. Never worn, still in original box.',
        images: ['https://picsum.photos/800/600?random=2'],
        category: 'Fashion',
        condition: 'New',
        location: 'Sousse',
        seller: users[1]._id,
        views: 0,
        status: 'active'
      },
      {
        title: 'Gaming PC RTX 3080',
        price: 1500,
        description: 'High-end gaming PC with RTX 3080, 32GB RAM, 1TB SSD. Perfect for gaming and content creation.',
        images: ['https://picsum.photos/800/600?random=3'],
        category: 'Electronics',
        condition: 'Good',
        location: 'Sfax',
        seller: users[0]._id,
        views: 0,
        status: 'active'
      }
    ]);
    console.log('Created sample listings');

    console.log('Seed data created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData(); 