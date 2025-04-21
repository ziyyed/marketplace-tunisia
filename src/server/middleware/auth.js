import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const auth = async (req, res, next) => {
  try {
    console.log('[Auth Middleware] Checking authentication for route:', req.method, req.originalUrl);
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[Auth Middleware] No token provided or invalid format:', authHeader);
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];
    console.log('[Auth Middleware] Token received:', token.substring(0, 15) + '...');

    // Get the JWT secret
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    console.log('[Auth Middleware] Using JWT secret:', jwtSecret.substring(0, 3) + '...');

    try {
      const decoded = jwt.verify(token, jwtSecret);
      console.log('[Auth Middleware] Token verified for user ID:', decoded.userId);

      // Get user from database
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        console.log('[Auth Middleware] User not found in database with ID:', decoded.userId);
        return res.status(401).json({ message: 'User not found' });
      }

      // Set user in request
      req.user = user;
      console.log('[Auth Middleware] Authentication successful for user:', user.name);
      next();
    } catch (jwtError) {
      console.error('[Auth Middleware] JWT verification error:', jwtError.message);
      return res.status(401).json({ message: 'Token is not valid' });
    }
  } catch (error) {
    console.error('[Auth Middleware] Auth error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default auth;