import { create } from 'zustand';
import { ClothingItem, AddItemRequest } from '../types';
import { wardrobeAPI } from '../services/api/wardrobe';
import { friendlyError } from '../utils/friendlyError';

interface WardrobeState {
  items: ClothingItem[];
  categories: Record<string, number>;
  selectedCategory: string;
  isLoading: boolean;
  error: string | null;
  sortMode: 'newest' | 'oldest' | 'name';

  fetchItems: (category?: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  addItem: (req: AddItemRequest) => Promise<ClothingItem>;
  deleteItem: (id: string) => Promise<void>;
  setCategory: (category: string) => void;
  clearError: () => void;
  setSortMode: (mode: 'newest' | 'oldest' | 'name') => void;
}

const sortItems = (items: ClothingItem[], mode: 'newest' | 'oldest' | 'name') => {
  return [...items].sort((a, b) => {
    if (mode === 'name') {
      return a.name.localeCompare(b.name);
    }

    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();

    if (mode === 'newest') return dateB - dateA;
    return dateA - dateB;
  });
};

export const useWardrobeStore = create<WardrobeState>((set, get) => ({
  items: [],
  categories: {},
  selectedCategory: '',
  isLoading: false,
  error: null,
  sortMode: 'newest',

  fetchItems: async (category) => {
    set({ isLoading: true, error: null });
    try {
      const items = await wardrobeAPI.listItems(category || get().selectedCategory || undefined);
      const sortedItems = sortItems(items, get().sortMode);
      set({ items: sortedItems, isLoading: false });
    } catch (e: unknown) {
      set({ isLoading: false, error: friendlyError(e, 'Couldn\'t load your wardrobe. Please try again.') });
    }
  },

  fetchCategories: async () => {
    try {
      const categories = await wardrobeAPI.getCategories();
      set({ categories });
    } catch (e: unknown) {
      set({ error: friendlyError(e, 'Couldn\'t load categories. Please try again.') });
    }
  },

// Without error handling, failures would be silent,
// leaving the UI inconsistent and users without feedback.

  addItem: async (req) => {
    set({ isLoading: true, error: null });
    try {
      const item = await wardrobeAPI.addItem(req);
      set((state) => ({
        items: sortItems([item, ...state.items], state.sortMode),
        isLoading: false,
      }));
      return item;
    } catch (e: unknown) {
      set({
        isLoading: false,
        error: friendlyError(e, "Couldn't add item. Please try again."),
      });
      throw e;
    }
  },

  deleteItem: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await wardrobeAPI.deleteItem(id);
      set((state) => ({
        items: sortItems(
          state.items.filter((i) => i.id !== id),
          state.sortMode
        ),
        isLoading: false,
      }));
    } catch (e: unknown) {
      set({
        isLoading: false,
        error: friendlyError(e, "Couldn't delete item. Please try again."),
      });
      throw e;
    }
  },

  setCategory: (category) => {
    set({ selectedCategory: category });
    get().fetchItems(category);
  },
  clearError: () => set({ error: null }),

  setSortMode: (mode) => {
    set((state) => ({
      sortMode: mode,
      items: sortItems(state.items, mode),
    }));
  },
}));
