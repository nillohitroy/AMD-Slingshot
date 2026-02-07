import axios from 'axios';

// 1. Base Configuration
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Matches your Django URL structure
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Interceptor: Auto-attach JWT Token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;