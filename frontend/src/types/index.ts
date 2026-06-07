export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'customer' | 'seller' | 'admin';
  token?: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ProductSpec {
  name: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  ratingCount: number;
  category: string;
  image: string;
  images: string[];
  specs: ProductSpec[];
  reviews: Review[];
  stock: number;
  brand: string;
  trending?: boolean;
  featured?: boolean;
  active?: boolean;
  sellerId?: string;
  sellerName?: string;
  currency?: 'INR' | 'USD';
}

export interface CartItem {
  product: Product;
  quantity: number;
  savedForLater?: boolean;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  amount: number;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  paymentInfo?: {
    last4?: string;
    brand?: string;
    transactionId?: string;
  };
}

export interface Address {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export type NotificationType = 'Orders' | 'Payments' | 'Promotions' | 'Seller Alerts';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: string;
  recommendations?: ProductRecommendation[];
  isComparing?: boolean;
}

export interface ProductRecommendation {
  product: Product;
  matchPercent: number;
  reason: string;
}

export interface SellerKPI {
  revenue: number;
  sales: number;
  orders: number;
  productsCount: number;
  customers: number;
  conversionRate: number;
}

export interface SellerProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  sales: number;
  category: string;
  status: 'active' | 'draft' | 'out_of_stock';
  description: string;
  features: string[];
  seoKeywords: string[];
  tags: string[];
  active: boolean;
  imageUrl?: string;
  currency?: 'INR' | 'USD';
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'sale' | 'withdrawal' | 'payout';
  status: 'success' | 'pending' | 'failed';
  details: string;
}

export interface PayoutHistory {
  id: string;
  date: string;
  amount: number;
  status: 'completed' | 'processing' | 'failed';
  bankAccount: string;
}

// ─── Analytics Types ──────────────────────────────────────────────────────────

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  orders: number;
}

export interface TrendDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface DemandDataPoint {
  name: string;
  value: number;
  revenue: number;
}

export interface TopProduct {
  id: string;
  title: string;
  category: string;
  sold: number;
  revenue: number;
}

export interface CategoryStat {
  name: string;
  orders: number;
  revenue: number;
}

export interface InventoryItem {
  id: string;
  title: string;
  category: string;
  stock: number;
  sold: number;
  revenue: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  active: boolean;
  price: number;
}

export interface AiInsight {
  type: 'positive' | 'warning' | 'danger' | 'info';
  message: string;
}

export interface SellerAnalytics {
  totalProducts: number;
  activeProducts: number;
  outOfStockProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalSales: number;
  conversionRate: number;
  revenueByMonth: RevenueDataPoint[];
  trendData: TrendDataPoint[];
  demandWheel: DemandDataPoint[];
  topProducts: TopProduct[];
  categoryStats: CategoryStat[];
  inventory: InventoryItem[];
  aiInsights: AiInsight[];
}
