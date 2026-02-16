// API service for FASTEP frontend
import axios from 'axios';

export const API_BASE = "https://fastep-app.onrender.com";

const api = axios.create({
  baseURL: `${API_BASE}/api`,
});

// Attach token automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('fw_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
