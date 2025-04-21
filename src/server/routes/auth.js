import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { name, email, password, location, phone } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      console.log('Registration failed: Missing required fields');
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Registration failed: User already exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password,
      avatar: `https://placehold.co/150?text=${name.charAt(0)}`,
      location: location || '',
      phone: phone || ''
    });

    console.log('Attempting to save new user to database...');

    try {
      // Save the user to MongoDB
      const savedUser = await newUser.save();
      console.log('New user registered successfully with ID:', savedUser._id);
      console.log('User data saved:', {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email
      });

      // Create token
      const token = jwt.sign(
        { userId: savedUser._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      // Return user data without password
      const userToReturn = {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        avatar: savedUser.avatar,
        location: savedUser.location,
        phone: savedUser.phone
      };

      res.status(201).json({
        token,
        user: userToReturn
      });
    } catch (saveError) {
      console.error('Error saving user to database:', saveError);
      return res.status(500).json({ message: 'Error saving user to database', error: saveError.message });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Login failed: Missing credentials');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Login failed: User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Login failed: Invalid password');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('User logged in successfully:', user._id);

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return user data without password
    const userToReturn = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      location: user.location,
      phone: user.phone
    };

    res.json({
      token,
      user: userToReturn
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify token middleware for other routes to use
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth header received:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Auth verification failed: No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token received:', token.substring(0, 15) + '...');

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      console.log('Token verified for user:', decoded.userId);
      req.user = { _id: decoded.userId };
      next();
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

// Get current user
router.get('/verify', verifyToken, async (req, res) => {
  try {
    console.log('Verifying user:', req.user._id);

    // Find user by ID from token
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      console.log('User verification failed: User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User verified successfully');
    res.json(user);
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;