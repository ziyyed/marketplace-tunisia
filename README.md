# Marketplace Tunisia

A full-stack marketplace application for buying and selling items in Tunisia, built with React, Node.js, Express, and MongoDB.

## Features

- User authentication (register, login, logout)
- Create, read, update, and delete listings
- Search and filter listings
- Messaging system between buyers and sellers
- User profiles and ratings
- Responsive design with Material-UI

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI for styling
- React Router for navigation
- Axios for API calls
- Formik and Yup for form handling

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- RESTful API architecture

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/marketplace-tunisia.git
cd marketplace-tunisia
```

2. Install dependencies:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

3. Set up environment variables:
Create a `.env` file in the server directory with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Start the development servers:
```bash
# Start the backend server
cd server
npm run dev

# Start the frontend server (in a new terminal)
cd ..
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Project Structure

```
marketplace-tunisia/
├── src/                    # Frontend source code
│   ├── components/         # Reusable components
│   ├── contexts/           # React contexts
│   ├── pages/              # Page components
│   ├── services/           # API services
│   └── utils/              # Utility functions
├── server/                 # Backend source code
│   ├── src/
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   └── config/         # Configuration files
│   └── .env                # Environment variables
└── public/                 # Static assets
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Listings
- GET /api/listings - Get all listings
- GET /api/listings/:id - Get a single listing
- POST /api/listings - Create a new listing
- PUT /api/listings/:id - Update a listing
- DELETE /api/listings/:id - Delete a listing

### Users
- GET /api/users/profile - Get user profile
- PUT /api/users/profile - Update user profile
- GET /api/users/listings - Get user's listings

### Messages
- POST /api/messages/:listingId - Send a message
- GET /api/messages/conversations - Get conversations
- GET /api/messages/:conversationId - Get conversation messages

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Material-UI for the component library
- MongoDB for the database
- Express.js for the backend framework
- React for the frontend framework
