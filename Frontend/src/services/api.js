import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request
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

// Handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || '';

      const isAuthEndpoint =
        url.includes('/auth/login') ||
        url.includes('/auth/register');

      if (!isAuthEndpoint) {
        localStorage.removeItem('dabba_token');
        localStorage.removeItem('token');
        localStorage.removeItem('dabba_user');
      }
    }

    return Promise.reject(error);
  }
);

export default api;