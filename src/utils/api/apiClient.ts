import axios from 'axios';

export const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_APP_BACKEND_API_URL || 'http://localhost:3000/api',
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
