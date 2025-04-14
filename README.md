# Marketplace Tunisia

A modern online marketplace platform for Tunisia, allowing users to buy and sell items locally.

## Features

- User authentication (register, login, forgot password)
- Listing creation and management
- Search and filter listings
- User profiles and ratings
- Messaging between users
- Favorites and notifications
- Responsive design with Material UI

## Tech Stack

- **Frontend**: React, Material UI, React Router, Tanstack Query
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB

### Installation

1. Clone the repository
```bash
git clone https://github.com/ziyyyed/marketplace-tunisia.git
cd marketplace-tunisia
```

2. Install dependencies
```bash
npm install
cd src/server
npm install
cd ../..
```

3. Setup environment variables
```bash
cp src/server/.env.example src/server/.env
```
Edit the `.env` file with your MongoDB connection string and JWT secret.

### Running the Application

Run both frontend and backend concurrently:
```bash
npm run dev:full
```

Or run them separately:
- Frontend: `npm run dev:client`
- Backend: `npm run dev:server`

## Project Structure

- `/src` - Frontend React application
  - `/components` - Reusable UI components
  - `/pages` - Page components
  - `/contexts` - React contexts
  - `/services` - API services
  - `/server` - Backend Express API

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Material UI for the component library
- React Query for data fetching
- Express for the backend API
