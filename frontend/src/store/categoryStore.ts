import { create } from 'zustand';
import { api } from '../services/apiClient';

interface CategoryState {
  categories: string[];
  isLoading: boolean;
  fetchCategories: () => Promise<void>;
  createCategory: (name: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,

  fetchCategories: async () => {
    set({ isLoading: true });
    try {
      const cats = await api.categories.getAll();
      set({ categories: cats, isLoading: false });
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      // Fallback to defaults so UI never breaks
      set({ categories: ['Electronics', 'Fashion', 'Wellness', 'Home & Living', 'Sports'], isLoading: false });
    }
  },

  createCategory: async (name: string) => {
    if (!name.trim()) return;
    try {
      await api.categories.create(name.trim());
      // Refresh list from backend
      await get().fetchCategories();
    } catch (err) {
      console.error('Failed to create category:', err);
      // Optimistically add so seller flow doesn't stall
      set((state) => ({
        categories: [...new Set([...state.categories, name.trim()])]
      }));
    }
  },
}));
