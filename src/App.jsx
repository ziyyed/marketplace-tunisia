import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from './theme';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ListingDetail from './pages/ListingDetail';
import CreateListing from './pages/CreateListing';
import Search from './pages/Search';
import Profile from './pages/Profile';
import ProfileEdit from './pages/ProfileEdit';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar/Navbar';
import ProductDetails from './pages/ProductDetails';
import ListingDebug from './pages/ListingDebug';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/listings/create" element={<CreateListing />} />
              <Route path="/listings/:id" element={<ListingDetail />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/search" element={<Search />} />
              <Route path="/profile/edit" element={<ProfileEdit />} />
              <Route path="/profile/debug" element={<ListingDebug />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/profile" element={<Profile />} />

              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
        <ToastContainer position="top-right" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;