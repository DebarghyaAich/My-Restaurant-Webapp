import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = 
      localStorage.getItem('dabba_token') || 
      localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or unauthorized, optionally clear token
      const isAuthEndpoint = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      if (!isAuthEndpoint) {
        // Only clear if an existing token was rejected
        localStorage.removeItem('dabba_token');
        localStorage.removeItem('token');
        localStorage.removeItem('dabba_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
