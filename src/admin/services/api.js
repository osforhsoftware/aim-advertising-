import axios from 'axios';

// Base API client
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost/aimiac-backend',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Initialize session / CSRF cookie (no-op or session ping)
export const initCsrf = async () => {
  try {
    await api.get('/sanctum/csrf-cookie');
  } catch (err) {
    // Non-critical fallback for plain PHP session
  }
};

// Format image URL whether it's local static asset or backend upload
export const getImageUrl = (path) => {
  if (!path) return '';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('blob:') ||
    path.startsWith('data:')
  ) {
    return path;
  }
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost/aimiac-backend';
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
};

// Upload an image file to the PHP backend
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/api/v1/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Global interceptor for API errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthenticated (401), trigger login redirect ONLY if currently inside /admin
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/admin') && !currentPath.startsWith('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

