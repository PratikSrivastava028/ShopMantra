import { create } from 'zustand';
import { SellerProduct, SellerKPI, Transaction, PayoutHistory, SellerAnalytics } from '../types';
import { api } from '../services/apiClient';

interface SellerState {
  kpis: SellerKPI;
  products: SellerProduct[];
  orders: any[];
  transactions: Transaction[];
  payouts: PayoutHistory[];
  analytics: SellerAnalytics | null;
  isLoading: boolean;

  fetchDashboardData: () => Promise<void>;
  addProduct: (product: Omit<SellerProduct, 'id' | 'sales'>) => Promise<void>;
  editProduct: (product: SellerProduct) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateStock: (id: string, stock: number) => Promise<void>;
  toggleProductStatus: (id: string) => Promise<void>;
  requestPayout: (amount: number) => Promise<boolean>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
}

const INITIAL_KPIS: SellerKPI = {
  revenue: 0, sales: 0, orders: 0, productsCount: 0, customers: 0, conversionRate: 0,
};

export const useSellerStore = create<SellerState>((set, get) => ({
  kpis: INITIAL_KPIS,
  products: [],
  orders: [],
  transactions: [],
  payouts: [],
  analytics: null,
  isLoading: false,

  fetchDashboardData: async () => {
    set({ isLoading: true });
    try {
      // Fetch full analytics (metrics + charts + inventory + AI insights)
      const analytics: SellerAnalytics = await api.seller.getAnalytics();

      // Also fetch orders for the transactions table
      const ordersList = await api.seller.getOrders();

      // Legacy KPI shape for backward compatibility
      const kpis: SellerKPI = {
        revenue: analytics.totalRevenue || 0,
        sales: analytics.totalSales || 0,
        orders: analytics.totalOrders || 0,
        productsCount: analytics.totalProducts || 0,
        customers: ordersList.length,
        conversionRate: analytics.conversionRate || 0,
      };

      // Map products from inventory (has all fields)
      const mappedProducts: SellerProduct[] = analytics.inventory.map((item: any) => ({
        id: item.id,
        name: item.title,
        price: item.price,
        currency: item.currency || 'INR',
        stock: item.stock,
        sales: item.sold,
        category: item.category,
        status: item.stock === 0 ? 'out_of_stock' : item.active ? 'active' : 'draft',
        description: item.description || '',
        features: (item.specs || []).map((s: any) => s.name === 'Feature' ? s.value : `${s.name}: ${s.value}`),
        seoKeywords: [],
        tags: [],
        active: item.active,
        imageUrl: item.images?.[0]?.url || '',
      }));

      // Map orders to transactions
      const mappedTransactions: Transaction[] = ordersList.map((o: any) => ({
        id: o._id || o.id || '',
        date: o.createdAt || new Date().toISOString(),
        amount: o.totalPrice?.amount || 0,
        type: 'sale',
        status: o.status === 'CANCELLED' ? 'failed' : o.status === 'PENDING' ? 'pending' : 'success',
        details: `Order #${(o._id || '').slice(-6)} — ${o.items?.length || 0} item(s)`,
      }));

      set({
        kpis,
        products: mappedProducts,
        orders: ordersList,
        transactions: mappedTransactions,
        analytics,
        isLoading: false,
      });
    } catch (err) {
      console.error('Error fetching seller dashboard data:', err);
      set({ isLoading: false });
    }
  },

  addProduct: async (product) => {
    set({ isLoading: true });
    try {
      const formData = new FormData();
      formData.append('title', product.name);
      formData.append('description', product.description);
      formData.append('priceAmount', product.price.toString());
      formData.append('priceCurrency', product.currency || 'INR');
      formData.append('category', product.category || 'Electronics');
      formData.append('stock', product.stock.toString());
      if (product.imageUrl) {
        formData.append('imageUrl', product.imageUrl);
      }

      // Convert features bullet list to name/value specs
      const specs = (product.features || []).map(f => {
        const parts = f.split(':');
        if (parts.length > 1) {
          return { name: parts[0].trim(), value: parts.slice(1).join(':').trim() };
        }
        return { name: 'Feature', value: f.trim() };
      });
      formData.append('specs', JSON.stringify(specs));

      await api.products.create(formData);
      await get().fetchDashboardData();
    } catch (err) {
      console.error('Error adding product:', err);
      set({ isLoading: false });
    }
  },

  editProduct: async (product) => {
    set({ isLoading: true });
    try {
      const specs = (product.features || []).map(f => {
        const parts = f.split(':');
        if (parts.length > 1) {
          return { name: parts[0].trim(), value: parts.slice(1).join(':').trim() };
        }
        return { name: 'Feature', value: f.trim() };
      });
      await api.products.update(product.id, {
        title: product.name,
        description: product.description,
        price: { amount: product.price, currency: product.currency || 'INR' },
        category: product.category,
        stock: product.stock,
        imageUrl: product.imageUrl,
        specs,
      });
      await get().fetchDashboardData();
    } catch (err) {
      console.error('Error updating product:', err);
      set({ isLoading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true });
    try {
      await api.products.delete(id);
      await get().fetchDashboardData();
    } catch (err) {
      console.error('Error deleting product:', err);
      set({ isLoading: false });
    }
  },

  updateStock: async (id, stock) => {
    try {
      await api.products.updateStock(id, stock);
      await get().fetchDashboardData();
    } catch (err) {
      console.error('Error updating stock:', err);
    }
  },

  toggleProductStatus: async (id) => {
    try {
      await api.products.toggleStatus(id);
      await get().fetchDashboardData();
    } catch (err) {
      console.error('Error toggling product status:', err);
    }
  },

  requestPayout: async (amount) => {
    if (amount <= 0 || amount > get().kpis.revenue) return false;
    set({ isLoading: true });
    await new Promise(r => setTimeout(r, 1000));

    const newPayout: PayoutHistory = {
      id: `pay-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      amount,
      status: 'processing',
      bankAccount: 'Business Account ending in ****',
    };

    const newTransaction: Transaction = {
      id: `tx-${Math.floor(300 + Math.random() * 600)}`,
      date: new Date().toISOString(),
      amount, type: 'payout', status: 'pending',
      details: 'Requested business bank transfer',
    };

    set((state) => ({
      payouts: [newPayout, ...state.payouts],
      transactions: [newTransaction, ...state.transactions],
      kpis: { ...state.kpis, revenue: state.kpis.revenue - amount },
      isLoading: false,
    }));
    return true;
  },

  updateOrderStatus: async (id, status) => {
    set({ isLoading: true });
    try {
      await api.seller.updateOrderStatus(id, status);
      await get().fetchDashboardData();
    } catch (err) {
      console.error('Error updating order status:', err);
      set({ isLoading: false });
    }
  },
}));
