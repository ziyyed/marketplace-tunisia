import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import connectDB from './db.js';
import listingsRouter from './routes/listings.js';
import usersRouter from './routes/users.js';
import messagesRouter from './routes/messages.js';
import authRouter from './routes/auth.js';
import fs from 'fs';

// Import necessary modules

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Ensure directory exists
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      console.error('Invalid file type:', file.originalname);
      return cb(new Error('Only image files are allowed!'), false);
    }

    // Check file size before processing
    if (file.size > 10 * 1024 * 1024) {
      console.error('File too large:', file.originalname, file.size);
      return cb(new Error('File too large. Maximum size is 10MB.'), false);
    }

    console.log('File accepted:', file.originalname, file.size);
    cb(null, true);
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directories exist
const uploadsDir = path.join(__dirname, 'uploads');
const avatarsDir = path.join(uploadsDir, 'avatars');
const listingsDir = path.join(uploadsDir, 'listings');

if (!fs.existsSync(uploadsDir)) {
  console.log('Creating uploads directory:', uploadsDir);
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(avatarsDir)) {
  console.log('Creating avatars directory:', avatarsDir);
  fs.mkdirSync(avatarsDir, { recursive: true });
}

if (!fs.existsSync(listingsDir)) {
  console.log('Creating listings directory:', listingsDir);
  fs.mkdirSync(listingsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Log all requests to /uploads for debugging
app.use('/uploads', (req, res, next) => {
  console.log('Static file request:', req.url);
  next();
});

// Make upload available to routes
app.use((req, res, next) => {
  req.upload = upload;
  next();
});

// Routes with specific handling
app.use('/api/listings', (req, res, next) => {
  // For POST requests to /api/listings, use multer to handle form data
  if (req.method === 'POST' && req.path === '/') {
    // Debug the auth header
    console.log('=======================================');
    console.log('Listing creation request received!');
    console.log('Auth header:', req.headers.authorization ? 'Present' : 'Missing');
    console.log('Content-Type:', req.headers['content-type']);

    return upload.array('images', 5)(req, res, (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ message: err.message });
      }

      // Log detailed information about uploaded files
      console.log('Multer processed successfully, files:', req.files?.length || 0);

      if (req.files && req.files.length > 0) {
        req.files.forEach((file, index) => {
          console.log(`File ${index + 1}:`, {
            filename: file.filename,
            originalname: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
            path: file.path
          });

          // Verify file exists on disk
          if (!fs.existsSync(file.path)) {
            console.error(`File ${file.filename} does not exist on disk!`);
          }
        });
      } else {
        console.log('No files uploaded, will use placeholder image');
      }

      next();
    });
  } else {
    next();
  }
}, listingsRouter);

app.use('/api/users', usersRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/auth', authRouter);

// Debug endpoint to check server status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Clear localStorage token (for development)
app.get('/api/clear-token', (req, res) => {
  console.log('Clearing token from localStorage');
  res.send(`
    <script>
      localStorage.removeItem('token');
      console.log('Token cleared from localStorage');
      window.location.href = '/';
    </script>
  `);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Access the server at http://localhost:${PORT} or your local IP address`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();