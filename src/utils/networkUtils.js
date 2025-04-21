/**
 * Utility functions for network operations
 */

/**
 * Get the server's IP address dynamically
 * This will be used to allow connections from other devices on the network
 */
export const getServerIP = () => {
  // In a real production environment, this would be configured differently
  // For local development, we'll use window.location.hostname
  const hostname = window.location.hostname;
  
  // If we're using localhost, we need to get the actual IP address
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // For development, we'll use a fixed IP or the current hostname
    // Your actual local IP address will be shown in the console when you run the app
    return hostname;
  }
  
  return hostname;
};

/**
 * Get the base API URL based on the current environment
 */
export const getApiBaseUrl = () => {
  const hostname = getServerIP();
  const port = 5002; // Your API server port
  
  if (process.env.NODE_ENV === 'production') {
    return '/api';
  }
  
  return `http://${hostname}:${port}/api`;
};
