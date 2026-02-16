import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_URL || "https://fastep-app.onrender.com";

const api = axios.create({
  baseURL: `${API_BASE}/api`,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      const endpoint = error.config && error.config.url ? error.config.url : '';
      // Only logout if /users/me fails
      if (endpoint.includes('/users/me')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      // Otherwise, just reject and let the page handle
    }
    return Promise.reject(error);
  }
);

export default api;
