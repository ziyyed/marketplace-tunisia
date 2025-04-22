import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Make sure we have a valid MongoDB URI
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/marketplace-tunisia';
    console.log('Connecting to MongoDB at:', mongoURI);

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Increased timeout
      socketTimeoutMS: 45000,
      family: 4
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log('MongoDB Database Name:', conn.connection.name);

    // Connection events
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from MongoDB');
    });

    // Test connection listing 
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name).join(', ') || 'No collections found');

    // Gracefully close connection on termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('Mongoose connection closed through app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    console.error('MongoDB connection failed. Please make sure MongoDB is running.');
    process.exit(1);
  }
};

export default connectDB;
