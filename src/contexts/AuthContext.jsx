import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        console.log('Verifying authentication on startup');
        const response = await auth.verifyToken();
        console.log('Auth verification successful:', response.data);
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth verification failed:', error);
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    
    verifyAuth();
  }, []);

  const register = async (userData) => {
    try {
      console.log('Registering user:', userData.email);
      setLoading(true);
      const response = await auth.register(userData);
      console.log('Registration successful:', response.data.user);
      
      // Update auth state
      setUser(response.data.user);
      setIsAuthenticated(true);
      
      // Notify user
      toast.success('Registration successful!');
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      console.log('Logging in user:', credentials.email);
      setLoading(true);
      const response = await auth.login(credentials);
      console.log('Login successful:', response.data.user);
      
      // Update auth state
      setUser(response.data.user);
      setIsAuthenticated(true);
      
      // Notify user
      toast.success('Login successful!');
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('Logging out user');
    auth.logout();
    setUser(null);
    setIsAuthenticated(false);
    toast.info('You have been logged out');
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 