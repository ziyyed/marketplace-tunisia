import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/Auth/PrivateRoute';
import Navbar from './components/Navigation/Navbar';
import Footer from './components/Footer/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ListingDetails from './pages/ListingDetails';
import CreateListing from './pages/CreateListing';
import SearchResults from './pages/SearchResults';
import Profile from './pages/Profile';
import Messages from './pages/Messages';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/listing/:id" element={<ListingDetails />} />
            <Route path="/search" element={<SearchResults />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-listing"
              element={
                <PrivateRoute>
                  <CreateListing />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <PrivateRoute>
                  <Messages />
                </PrivateRoute>
              }
            />
          </Routes>
          <Footer />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
