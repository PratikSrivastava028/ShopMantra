import { create } from 'zustand';
import { Product } from '../types';
import { api } from '../services/apiClient';

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  wishlist: Product[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string;
  selectedBrand: string;
  priceRange: [number, number];
  selectedRating: number;
  sortBy: string;
  layout: 'grid' | 'list';
  
  fetchProducts: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedBrand: (brand: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setSelectedRating: (rating: number) => void;
  setSortBy: (sortBy: string) => void;
  setLayout: (layout: 'grid' | 'list') => void;
  toggleWishlist: (product: Product) => void;
  resetFilters: () => void;
  applyFilters: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  filteredProducts: [],
  wishlist: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedCategory: 'All',
  selectedBrand: 'All',
  priceRange: [0, 1000000],
  selectedRating: 0,
  sortBy: 'featured',
  layout: 'grid',

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const products = await api.products.getAll();
      (window as any)._shopmantra_products = products;
      const maxPrice = products.length > 0 ? Math.max(...products.map(p => p.price)) : 1500;
      set({ products, filteredProducts: products, priceRange: [0, maxPrice], isLoading: false });
      get().applyFilters();
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch products', isLoading: false });
    }
  },
  
  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().applyFilters();
  },
  
  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
    get().applyFilters();
  },
  
  setSelectedBrand: (brand) => {
    set({ selectedBrand: brand });
    get().applyFilters();
  },
  
  setPriceRange: (range) => {
    set({ priceRange: range });
    get().applyFilters();
  },
  
  setSelectedRating: (rating) => {
    set({ selectedRating: rating });
    get().applyFilters();
  },
  
  setSortBy: (sortBy) => {
    set({ sortBy });
    get().applyFilters();
  },
  
  setLayout: (layout) => set({ layout }),
  
  toggleWishlist: (product) => {
    set((state) => {
      const exists = state.wishlist.some(p => p.id === product.id);
      if (exists) {
        return { wishlist: state.wishlist.filter(p => p.id !== product.id) };
      } else {
        return { wishlist: [...state.wishlist, product] };
      }
    });
  },
  
  resetFilters: () => {
    const { products } = get();
    const maxPrice = products.length > 0 ? Math.max(...products.map(p => p.price)) : 1500;
    set({
      searchQuery: '',
      selectedCategory: 'All',
      selectedBrand: 'All',
      priceRange: [0, maxPrice],
      selectedRating: 0,
      sortBy: 'featured',
    });
    get().applyFilters();
  },
  
  applyFilters: () => {
    const { products, searchQuery, selectedCategory, selectedBrand, priceRange, selectedRating, sortBy } = get();
    
    let result = [...products];
    
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    
    // Category filter
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    
    // Brand filter
    if (selectedBrand && selectedBrand !== 'All') {
      result = result.filter(p => p.brand.toLowerCase() === selectedBrand.toLowerCase());
    }
    
    // Price range filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    
    // Rating filter
    if (selectedRating > 0) {
      result = result.filter(p => p.rating >= selectedRating);
    }
    
    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'discount') {
      result.sort((a, b) => b.discount - a.discount);
    } else {
      // Default: featured
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    
    set({ filteredProducts: result });
  }
}));
