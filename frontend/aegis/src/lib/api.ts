import axios from 'axios';

// 1. Base Configuration
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor: Auto-attach JWT Token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response Interceptor: Handle 401 Unauthorized (THE FIX)
api.interceptors.response.use(
  (response) => {
    // If response is good (200-299), just return it
    return response;
  },
  (error) => {
    // If response is an error...
    if (typeof window !== 'undefined' && error.response) {
      
      // Check for 401 (Unauthorized)
      if (error.response.status === 401) {
        console.warn("Session expired or invalid token. Logging out...");

        // A. Clear the stale data
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');

        // B. Redirect to login
        // We use window.location.href to force a full page refresh and clear any React state
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;