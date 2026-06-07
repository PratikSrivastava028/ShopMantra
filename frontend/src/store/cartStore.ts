import { create } from 'zustand';
import { CartItem, Product } from '../types';
import { api } from '../services/apiClient';

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  discountPercent: number;
  isLoading: boolean;
  error: string | null;
  fetchCart: (productsList: Product[]) => Promise<void>;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  toggleSaveForLater: (productId: string) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  clearCart: () => void;
  getSummary: () => {
    subtotal: number;
    discount: number;
    tax: number;
    shipping: number;
    total: number;
  };
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  couponCode: null,
  discountPercent: 0,
  isLoading: false,
  error: null,

  fetchCart: async (productsList) => {
    set({ isLoading: true });
    try {
      const response = await api.cart.get();
      const cart = response?.cart;
      if (cart && cart.items) {
        const mappedItems: CartItem[] = cart.items.map((item: any) => {
          const prodId = item.productId;
          const matchedProduct = productsList.find((p) => p.id === prodId) || {
            id: prodId,
            name: `Premium Item ${prodId.slice(-4)}`,
            price: 299, // default fallback price
            originalPrice: 350,
            discount: 15,
            description: 'ShopMantra curated premium product.',
            rating: 4.8,
            ratingCount: 88,
            category: 'General',
            image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80',
            images: [],
            specs: [],
            reviews: [],
            stock: 10,
            brand: 'ShopMantra',
          };
          return {
            product: matchedProduct as Product,
            quantity: item.quantity || 1,
            savedForLater: false,
          };
        });
        set({ items: mappedItems, isLoading: false });
      } else {
        set({ items: [], isLoading: false });
      }
    } catch (err) {
      console.error('Error fetching cart from server:', err);
      set({ isLoading: false });
    }
  },

  addToCart: async (product, quantity = 1) => {
    set({ isLoading: true });
    try {
      await api.cart.addItem(product.id, quantity);
      
      // Update local state proactively
      const currentItems = get().items;
      const existingIndex = currentItems.findIndex((item) => item.product.id === product.id && !item.savedForLater);
      if (existingIndex > -1) {
        const newItems = [...currentItems];
        newItems[existingIndex].quantity += quantity;
        set({ items: newItems, isLoading: false });
      } else {
        set({ items: [...currentItems, { product, quantity, savedForLater: false }], isLoading: false });
      }
    } catch (err: any) {
      console.error('Error adding item to backend cart:', err);
      set({ error: err.response?.data?.message || 'Error adding to cart', isLoading: false });
    }
  },

  removeFromCart: async (productId) => {
    set({ isLoading: true });
    try {
      await api.cart.removeItem(productId);
      set((state) => ({
        items: state.items.filter((item) => item.product.id !== productId),
        isLoading: false,
      }));
    } catch (err) {
      console.error('Error removing item from backend cart:', err);
      set({ isLoading: false });
    }
  },

  updateQuantity: async (productId, quantity) => {
    if (quantity <= 0) {
      await get().removeFromCart(productId);
      return;
    }
    set({ isLoading: true });
    try {
      await api.cart.updateItem(productId, quantity);
      set((state) => ({
        items: state.items.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        ),
        isLoading: false,
      }));
    } catch (err) {
      console.error('Error updating cart item quantity:', err);
      set({ isLoading: false });
    }
  },

  toggleSaveForLater: (productId) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId ? { ...item, savedForLater: !item.savedForLater } : item
      ),
    }));
  },

  applyCoupon: (code) => {
    const formattedCode = code.toUpperCase().trim();
    if (formattedCode === 'SHOPAI25' || formattedCode === 'MANTRA25') {
      set({ couponCode: formattedCode, discountPercent: 25 });
      return true;
    }
    if (formattedCode === 'WELCOME10') {
      set({ couponCode: formattedCode, discountPercent: 10 });
      return true;
    }
    return false;
  },

  removeCoupon: () => {
    set({ couponCode: null, discountPercent: 0 });
  },

  clearCart: () => {
    // Clear items in local state (backend automatically handles completed orders checkout)
    set({ items: [], couponCode: null, discountPercent: 0 });
  },

  getSummary: () => {
    const { items, discountPercent } = get();
    const activeItems = items.filter((item) => !item.savedForLater);
    
    const subtotal = activeItems.reduce(
      (sum, item) => {
        let price = item.product.price;
        if (item.product.currency === 'USD') {
          price = price * 83; // convert to INR
        }
        return sum + price * item.quantity;
      },
      0
    );
    
    const discount = subtotal * (discountPercent / 100);
    const tax = (subtotal - discount) * 0.08; // 8% sales tax
    
    // Free shipping above ₹5000
    const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 150;
    const total = subtotal - discount + tax + shipping;
    
    return {
      subtotal,
      discount,
      tax,
      shipping,
      total,
    };
  },
}));
