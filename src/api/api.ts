import axios from 'axios';

export const API_BASE = "https://fastep-app.onrender.com";

const api = axios.create({
  baseURL: `${API_BASE}/api`,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('fw_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('fw_token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default api;
