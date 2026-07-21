import { create } from 'zustand';
import api from '../lib/api';

const getStoredToken = () => {
  if (typeof window === 'undefined') return null;

  try {
    const token = window.localStorage.getItem('customerToken');
    return typeof token === 'string' && token.trim().length > 0 ? token.trim() : null;
  } catch {
    return null;
  }
};

const sanitizeProductId = (value) => {
  if (typeof value === 'number' && Number.isInteger(value) && value > 0) return value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (/^\d+$/.test(trimmed)) return Number(trimmed);
    if (/^[a-z0-9-]+$/i.test(trimmed)) return trimmed;
  }
  return null;
};

export const useCartStore = create((set, get) => ({
  // State
  isCartOpen: false,
  cartItems: [],

  // UI Actions
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  // 📥 FETCH CART FROM POSTGRESQL
  fetchCart: async () => {
    const token = getStoredToken();
    if (!token) {
      set({ cartItems: [] });
      return;
    }

    try {
      const res = await api.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ cartItems: Array.isArray(res.data) ? res.data : [] });
    } catch (error) {
      console.error('Failed to fetch cart from database:', error);
      set({ cartItems: [] });
    }
  },

  // 📤 ADD TO POSTGRESQL
  addToCart: async (product) => {
    const token = getStoredToken();

    // If not logged in, return false so the UI knows to pop up the Login Modal.
    if (!token) return false;

    const productId = sanitizeProductId(product?.id);
    if (!productId) return false;

    try {
      await api.post(
        '/api/cart',
        { product_id: productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh the local state instantly from the DB
      await get().fetchCart();
      set({ isCartOpen: true });
      return true;
    } catch (error) {
      console.error('Failed to add item to database:', error);
      return false;
    }
  },

  // 🗑️ REMOVE FROM POSTGRESQL
  removeFromCart: async (productId) => {
    const token = getStoredToken();
    if (!token) return;

    const safeProductId = sanitizeProductId(productId);
    if (!safeProductId) return;

    try {
      await api.delete(`/api/cart/${encodeURIComponent(String(safeProductId))}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refresh the local state instantly from the DB
      await get().fetchCart();
    } catch (error) {
      console.error('Failed to remove item from database:', error);
    }
  },

  // Used after successful checkout
  clearLocalCart: () => set({ cartItems: [], isCartOpen: false })
}));