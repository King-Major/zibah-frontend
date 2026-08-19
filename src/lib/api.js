import axios from 'axios';

const normalizeBaseUrl = (value) => {
  const fallback = 'https://zibah-backend.onrender.com';
  if (typeof value !== 'string') return fallback;

  const trimValue = value.trim();
  if (!trimValue) return fallback;

  try {
    const parsed = new URL(trimValue, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.toString().replace(/\/$/, '') : fallback;
  } catch {
    return fallback;
  }
};

export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL || 'https://zibah-backend.onrender.com');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// // Helpful debug when running locally to confirm which backend is used
// if (typeof window !== 'undefined') {
//   // eslint-disable-next-line no-console
//   console.info('Using API base URL:', API_BASE_URL);
// }

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const detail = error.response?.data?.message || error.message || 'Request failed';
    console.error('API request failed:', detail);
    return Promise.reject(error);
  }
);

export default api;
