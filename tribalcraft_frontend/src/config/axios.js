import axios from 'axios';

// Determine the API URL based on environment
const getApiUrl = () => {
  // In production, if REACT_APP_API_URL is not set, use the same origin
  // This works when frontend and backend are served from the same domain
  if (process.env.NODE_ENV === 'production') {
    return window.location.origin || process.env.REACT_APP_API_URL;
  }
  // In development, use localhost:5000 or the configured URL
  return 'http://localhost:5000';
};

// Create axios instance with baseURL
const api = axios.create({
  baseURL: getApiUrl(),
});

export default api;

