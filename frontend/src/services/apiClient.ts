import axios from 'axios';
import { Product, Order, Notification, User, OrderStatus, Address } from '../types';

// Centralized relative base URL using Vite proxy setup
const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  withCredentials: true, // Crucial for transferring HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to catch 401s and trigger clear authentication sessions
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized request - session expired or invalid credentials.');
      // Remove local storage triggers to force auth providers to redirect
      localStorage.removeItem('shopmantra_auth');
    }
    return Promise.reject(error);
  }
);

// Map backend product schema to premium frontend Product model
export const mapProduct = (backendProd: any): Product => {
  if (!backendProd) return {} as Product;
  
  const image = backendProd.images?.[0]?.url || 
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80';
  
  return {
    id: backendProd._id || backendProd.id || '',
    name: backendProd.title || '',
    description: backendProd.description || '',
    price: backendProd.price?.amount || 0,
    originalPrice: Math.round((backendProd.price?.amount || 0) * 1.2),
    discount: 20,
    rating: 4.5,
    ratingCount: 120,
    category: backendProd.category || 'General',
    image: image,
    images: backendProd.images?.map((img: any) => img.url) || [image],
    specs: backendProd.specs || [],
    reviews: backendProd.reviews || [],
    stock: backendProd.stock || 0,
    brand: backendProd.sellerName || backendProd.brand || 'ShopMantra',
    trending: backendProd.trending ?? false,
    featured: backendProd.featured ?? false,
    active: backendProd.active !== false,
    sellerId: backendProd.seller?.toString() || '',
    sellerName: backendProd.sellerName || '',
    currency: backendProd.price?.currency || 'INR',
  };
};

// Map backend order schema to frontend Order model
export const mapOrder = (backendOrder: any, products: Product[] = []): Order => {
  if (!backendOrder) return {} as Order;
  return {
    id: backendOrder._id || backendOrder.id || '',
    date: backendOrder.createdAt ? new Date(backendOrder.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
    status: (backendOrder.status === 'PENDING' ? 'Pending' : 
             backendOrder.status === 'CONFIRMED' ? 'Processing' : 
             backendOrder.status === 'SHIPPED' ? 'Shipped' : 
             backendOrder.status === 'DELIVERED' ? 'Delivered' : 
             backendOrder.status === 'CANCELLED' ? 'Cancelled' : 'Pending') as OrderStatus,
    amount: backendOrder.totalPrice?.amount || 0,
    items: backendOrder.items?.map((item: any) => {
      const prodId = typeof item.product === 'string' ? item.product : (item.product?._id || item.product?.id || '');
      const matchedProduct = products.find(p => p.id === prodId) || {
        id: prodId,
        name: `Product ${prodId.slice(-4)}`,
        price: item.price?.amount || 0,
        originalPrice: item.price?.amount || 0,
        discount: 0,
        description: '',
        rating: 5,
        ratingCount: 0,
        category: 'Order Item',
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=200&q=80',
        images: [],
        specs: [],
        reviews: [],
        stock: 0,
        brand: 'ShopMantra',
      };
      
      return {
        product: matchedProduct as Product,
        quantity: item.quantity || 1,
        price: item.price?.amount || matchedProduct.price || 0,
      };
    }) || [],
    shippingAddress: {
      fullName: backendOrder.shippingAddress?.fullName || 'Customer',
      addressLine1: backendOrder.shippingAddress?.street || '',
      city: backendOrder.shippingAddress?.city || '',
      state: backendOrder.shippingAddress?.state || '',
      postalCode: backendOrder.shippingAddress?.zip || '',
      country: backendOrder.shippingAddress?.country || '',
      phone: backendOrder.shippingAddress?.phone || '',
    },
    billingAddress: {
      fullName: backendOrder.shippingAddress?.fullName || 'Customer',
      addressLine1: backendOrder.shippingAddress?.street || '',
      city: backendOrder.shippingAddress?.city || '',
      state: backendOrder.shippingAddress?.state || '',
      postalCode: backendOrder.shippingAddress?.zip || '',
      country: backendOrder.shippingAddress?.country || '',
      phone: backendOrder.shippingAddress?.phone || '',
    },
    paymentMethod: backendOrder.paymentMethod || 'Razorpay Online',
    paymentInfo: {
      transactionId: backendOrder.paymentId || '',
    }
  };
};

export const api = {
  categories: {
    getAll: async (): Promise<string[]> => {
      const response = await axiosInstance.get('/products/categories');
      return response.data?.data || [];
    },
    create: async (name: string): Promise<string> => {
      const response = await axiosInstance.post('/products/categories', { name });
      return response.data?.category?.name || name;
    },
  },
  auth: {
    register: async (userData: any) => {
      const response = await axiosInstance.post('/auth/register', userData);
      return response.data;
    },
    login: async (credentials: any) => {
      const response = await axiosInstance.post('/auth/login', credentials);
      return response.data;
    },
    getMe: async () => {
      const response = await axiosInstance.get('/auth/me');
      return response.data;
    },
    logout: async () => {
      const response = await axiosInstance.get('/auth/logout');
      return response.data;
    },
    getAddresses: async () => {
      const response = await axiosInstance.get('/auth/users/me/addresses');
      return response.data;
    },
    addAddress: async (addressData: any) => {
      const response = await axiosInstance.post('/auth/users/me/addresses', addressData);
      return response.data;
    },
    deleteAddress: async (addressId: string) => {
      const response = await axiosInstance.delete(`/auth/users/me/addresses/${addressId}`);
      return response.data;
    },
  },
  products: {
    getAll: async (params?: { q?: string; minprice?: number; maxprice?: number }): Promise<Product[]> => {
      const response = await axiosInstance.get('/products', { params });
      // Backend returns structure { data: [...] }
      const list = response.data?.data || response.data || [];
      return list.map(mapProduct);
    },
    getById: async (id: string): Promise<Product> => {
      const response = await axiosInstance.get(`/products/${id}`);
      const item = response.data?.data || response.data;
      return mapProduct(item);
    },
    getSellerProducts: async (): Promise<Product[]> => {
      const response = await axiosInstance.get('/products/seller');
      const list = response.data?.data || response.data || [];
      return list.map(mapProduct);
    },
    create: async (formData: FormData): Promise<Product> => {
      // Supports multipart images upload
      const response = await axiosInstance.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return mapProduct(response.data?.data || response.data);
    },
    update: async (id: string, productData: any): Promise<Product> => {
      const response = await axiosInstance.patch(`/products/${id}`, productData);
      return mapProduct(response.data?.product || response.data);
    },
    updateStock: async (id: string, stock: number): Promise<void> => {
      await axiosInstance.patch(`/products/${id}/stock`, { stock });
    },
    toggleStatus: async (id: string): Promise<void> => {
      await axiosInstance.patch(`/products/${id}/status`);
    },
    delete: async (id: string): Promise<void> => {
      await axiosInstance.delete(`/products/${id}`);
    },
  },
  cart: {
    get: async () => {
      const response = await axiosInstance.get('/cart');
      return response.data;
    },
    addItem: async (productId: string, qty: number) => {
      const response = await axiosInstance.post('/cart/items', { productId, qty });
      return response.data;
    },
    updateItem: async (productId: string, qty: number) => {
      const response = await axiosInstance.patch(`/cart/items/${productId}`, { qty });
      return response.data;
    },
    removeItem: async (productId: string) => {
      const response = await axiosInstance.delete(`/cart/items/${productId}`);
      return response.data;
    },
  },
  orders: {
    create: async (orderData: { shippingAddress: any; discountPercent?: number }): Promise<Order> => {
      const response = await axiosInstance.post('/orders', orderData);
      return mapOrder(response.data?.order || response.data);
    },
    getUserOrders: async (productsList: Product[] = []): Promise<Order[]> => {
      const response = await axiosInstance.get('/orders/me');
      const orders = response.data?.orders || response.data || [];
      return orders.map((o: any) => mapOrder(o, productsList));
    },
    getById: async (id: string, productsList: Product[] = []): Promise<Order> => {
      const response = await axiosInstance.get(`/orders/${id}`);
      return mapOrder(response.data?.order || response.data, productsList);
    },
    cancel: async (id: string): Promise<Order> => {
      const response = await axiosInstance.post(`/orders/${id}/cancel`);
      return mapOrder(response.data?.order || response.data);
    },
  },
  payments: {
    create: async (orderId: string) => {
      const response = await axiosInstance.post(`/payments/create/${orderId}`);
      return response.data;
    },
    verify: async (verificationData: { razorpayOrderId: string; paymentId: string; signature: string }) => {
      const response = await axiosInstance.post('/payments/verify', verificationData);
      return response.data;
    },
  },
  seller: {
    getMetrics: async () => {
      const response = await axiosInstance.get('/seller/dashboard/metrics');
      return response.data;
    },
    getOrders: async (): Promise<any[]> => {
      const response = await axiosInstance.get('/seller/dashboard/orders');
      return response.data || [];
    },
    updateOrderStatus: async (orderId: string, status: string): Promise<any> => {
      const response = await axiosInstance.patch(`/seller/dashboard/orders/${orderId}/status`, { status });
      return response.data;
    },
    getProducts: async (): Promise<any[]> => {
      const response = await axiosInstance.get('/seller/dashboard/products');
      return response.data || [];
    },
    getAnalytics: async () => {
      // metrics endpoint now returns full analytics
      const response = await axiosInstance.get('/seller/dashboard/metrics');
      return response.data;
    },
  },
  notifications: {
    getAll: async (): Promise<Notification[]> => {
      return [
        {
          id: 'notif-1',
          type: 'Orders',
          title: 'Order PENDING Confirmation',
          message: 'Your ShopMantra checkout order has been initiated in the database.',
          date: 'Just now',
          read: false,
        },
        {
          id: 'notif-2',
          type: 'Payments',
          title: 'Secure Payment Verification',
          message: 'Razorpay online transaction secure signatures validated successfully.',
          date: '5 minutes ago',
          read: true,
        },
        {
          id: 'notif-3',
          type: 'Seller Alerts',
          title: 'Successful Login - ShopMantra',
          message: 'Security credentials verified. Notification nodemailer alert broadcasted.',
          date: '2 hours ago',
          read: true,
        }
      ];
    }
  }
};
