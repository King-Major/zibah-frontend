import { create } from 'zustand';

const getStoredToken = () => {
  if (typeof window === 'undefined') return null;

  try {
    const token = window.localStorage.getItem('customerToken');
    return typeof token === 'string' && token.trim().length > 0 ? token.trim() : null;
  } catch {
    return null;
  }
};

const setStoredToken = (token) => {
  if (typeof window === 'undefined') return;

  try {
    if (token) {
      window.localStorage.setItem('customerToken', token);
    } else {
      window.localStorage.removeItem('customerToken');
    }
  } catch {
    // Ignore storage access failures in restricted browser contexts.
  }
};

export const useAuthStore = create((set) => ({
  // State
  isAuthModalOpen: false,
  token: getStoredToken(),
  user: null,

  // Actions
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  setLogin: (token, userData) => {
    const sanitizedToken = typeof token === 'string' ? token.trim() : '';
    const safeUserData = userData && typeof userData === 'object' ? userData : null;

    if (!sanitizedToken) {
      setStoredToken(null);
      set({ token: null, user: null, isAuthModalOpen: false });
      return;
    }

    setStoredToken(sanitizedToken);
    set({ token: sanitizedToken, user: safeUserData, isAuthModalOpen: false });
  },

  setLogout: () => {
    setStoredToken(null);
    set({ token: null, user: null, isAuthModalOpen: false });
  }
}));