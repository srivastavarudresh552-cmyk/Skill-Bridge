import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let sessionExpiredHandler = null;
export const registerSessionExpiredHandler = (handler) => {
  sessionExpiredHandler = handler;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    // const code = error.response?.data?.error?.code;
    const isAuthRoute = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/signup');

    if (status === 401 && !isAuthRoute && sessionExpiredHandler) {
      sessionExpiredHandler();
    }
    return Promise.reject(error);
  }
);

export default api;