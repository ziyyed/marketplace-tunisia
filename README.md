# Marketplace Tunisia

A full-stack marketplace application for buying and selling items in Tunisia.

## Features

- User authentication (register, login, logout)
- Create, read, update, and delete listings
- Search and filter listings
- Favorite listings
- Messaging system
- User profiles
- Image uploads

## Tech Stack

- Frontend:
  - React
  - Material-UI
  - React Query
  - React Router
  - Formik & Yup
  - React Dropzone
  - React Image Crop
  - React Toastify

- Backend:
  - Node.js
  - Express
  - MongoDB
  - Mongoose
  - JWT Authentication
  - Multer (file uploads)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/marketplace-tunisia
   JWT_SECRET=your-secret-key-here
   NODE_ENV=development
   ```
4. Start MongoDB
5. Run the development servers:
   ```bash
   npm run dev:full
   ```
   This will start both the frontend and backend servers.

## Available Scripts

- `npm run dev` - Start frontend development server
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build
- `npm run server` - Start backend server
- `npm run dev:server` - Start backend server with nodemon
- `npm run dev:full` - Start both frontend and backend servers

## Project Structure

```
marketplace-tunisia/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── server/        # Backend code
│   │   ├── models/    # MongoDB models
│   │   ├── routes/    # API routes
│   │   └── index.js   # Server entry point
│   └── App.jsx        # Main application component
├── public/            # Static files
└── package.json       # Project dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Material-UI for the component library
- MongoDB for the database
- Express.js for the backend framework
- React for the frontend framework
