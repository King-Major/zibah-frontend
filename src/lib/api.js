import axios from 'axios';

const normalizeBaseUrl = (value) => {
  const fallback = 'http://localhost:5000';
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

export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const detail = error.response?.data?.message || error.message || 'Request failed';
    console.error('API request failed:', detail);
    return Promise.reject(error);
  }
);

export default api;
