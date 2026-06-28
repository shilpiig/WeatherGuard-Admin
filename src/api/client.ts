import axios, { AxiosInstance } from 'axios';
import Cookie from 'js-cookie';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3001';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = Cookie.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  googleLogin: (code: string) => apiClient.get(`/auth/google?code=${code}`),
  githubLogin: (code: string) => apiClient.get(`/auth/github?code=${code}`),
  getCurrentUser: () => apiClient.get('/auth/me'),
  logout: () => apiClient.post('/auth/logout'),
};

export const usersAPI = {
  getPendingRequests: () => apiClient.get('/users/pending'),
  getApprovedUsers: () => apiClient.get('/users/approved'),
  getAllUsers: () => apiClient.get('/users/all'),
  approveUser: (userId: string) => apiClient.post(`/users/approve/${userId}`),
  rejectUser: (userId: string) => apiClient.post(`/users/reject/${userId}`),
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data: any) => apiClient.post('/users/update', data),
};

export const weatherAPI = {
  getAlerts: () => apiClient.get('/weather/alerts'),
  simulateAlert: (city: string) => apiClient.post('/weather/simulate-alert', { city }),
};

export default apiClient;
