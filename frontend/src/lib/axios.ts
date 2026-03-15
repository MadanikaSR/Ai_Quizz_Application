import axios from 'axios';
import Cookies from 'js-cookie';

const getBaseURL = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!envUrl) return 'http://localhost:8000/api/';
  
  // Ensure the URL ends with /api/
  let url = envUrl.trim();
  if (!url.endsWith('/')) url += '/';
  if (!url.endsWith('/api/')) url += 'api/';
  return url;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Optional: Implement refresh token logic here if a 401 is received
    // For now, if 401, we might just redirect to login if not already there
    if (error.response?.status === 401 && !originalRequest._retry) {
      Cookies.remove('access_token');
      // window.location.href = '/login'; // Or handle via React context
    }
    return Promise.reject(error);
  }
);

export default api;
