import { Product, Order, Notification, Transaction, PayoutHistory } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'AeroBlade 15 Gaming Laptop',
    description: 'Crush the competition with the AeroBlade 15. Powered by an NVIDIA GeForce RTX 4060 graphics card, 16GB DDR5 RAM, and a blistering 144Hz FHD display, this is the ultimate portable battle station.',
    price: 999.99,
    originalPrice: 1299.99,
    discount: 23,
    rating: 4.8,
    ratingCount: 342,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=60'
    ],
    specs: [
      { name: 'Processor', value: 'Intel Core i7-13700H' },
      { name: 'Graphics', value: 'NVIDIA GeForce RTX 4060 (8GB VRAM)' },
      { name: 'Memory', value: '16GB DDR5 4800MHz' },
      { name: 'Storage', value: '512GB NVMe PCIe Gen4 SSD' },
      { name: 'Display', value: '15.6-inch 144Hz FHD IPS' }
    ],
    reviews: [
      { id: 'rev-1', userName: 'Alex Mercer', rating: 5, comment: 'Absolute beast of a laptop! Runs Cyberpunk 2077 at high settings flawlessly. Thermals are surprisingly good for such a slim body.', date: '2026-05-12' },
      { id: 'rev-2', userName: 'Sarah Connor', rating: 4, comment: 'Great performance for the price. Battery life is quite short when gaming, but that is expected. Love the RGB keyboard!', date: '2026-05-20' }
    ],
    stock: 14,
    brand: 'AeroTech',
    featured: true
  },
  {
    id: 'prod-2',
    name: 'ProClick Stealth Wireless Mouse',
    description: 'Experience pure precision with zero noise. The ProClick Stealth features ultra-quiet mechanical switches, a 20,000 DPI optical sensor, and up to 150 hours of battery life with dual connectivity.',
    price: 59.99,
    originalPrice: 79.99,
    discount: 25,
    rating: 4.6,
    ratingCount: 1105,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1628144515213-909fe8267255?w=600&auto=format&fit=crop&q=60'
    ],
    specs: [
      { name: 'Sensor', value: '20,000 DPI Optical' },
      { name: 'Connectivity', value: '2.4GHz Wireless & Bluetooth 5.1' },
      { name: 'Weight', value: '68g Ultra-lightweight' },
      { name: 'Battery Life', value: 'Up to 150 Hours' }
    ],
    reviews: [
      { id: 'rev-3', userName: 'Linus T.', rating: 5, comment: 'Super lightweight and the quiet clicks are extremely satisfying. Great shape for claw grip.', date: '2026-04-18' }
    ],
    stock: 45,
    brand: 'LogiCraft',
    featured: true,
    trending: true
  },
  {
    id: 'prod-3',
    name: 'KeyArmor Mechanical Keyboard (Tenkeyless)',
    description: 'Tactile, responsive, and indestructible. Packed with Hot-Swappable Blue Linear switches, high-grade doubleshot PBT keycaps, and a gorgeous aluminum top casing with full customizable RGB backlighting.',
    price: 89.99,
    originalPrice: 99.99,
    discount: 10,
    rating: 4.7,
    ratingCount: 812,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=60'
    ],
    specs: [
      { name: 'Switches', value: 'Hot-Swappable Blue Mechanical Switches' },
      { name: 'Form Factor', value: 'TKL (80% Tenkeyless)' },
      { name: 'Material', value: 'Aircraft-grade Aluminum Frame' },
      { name: 'Backlight', value: 'Per-key Customizable RGB' }
    ],
    reviews: [
      { id: 'rev-4', userName: 'David K.', rating: 5, comment: 'The sound profile on this keyboard is amazing! Very crisp keystrokes and solid metal build weight.', date: '2026-03-30' }
    ],
    stock: 22,
    brand: 'LogiCraft',
    trending: true
  },
  {
    id: 'prod-4',
    name: 'Tailored Signature Black Office Shirt',
    description: 'Drape yourself in executive elegance. Woven from 100% premium double-ply cotton, this wrinkle-resistant shirt offers a sleek modern silhouette, structured Kent collar, and breathable wear all day.',
    price: 49.99,
    originalPrice: 69.99,
    discount: 28,
    rating: 4.5,
    ratingCount: 228,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=60'
    ],
    specs: [
      { name: 'Material', value: '100% Breathable Egyptian Cotton' },
      { name: 'Fit', value: 'Modern Slim Fit' },
      { name: 'Care', value: 'Wrinkle-free, Machine Washable' }
    ],
    reviews: [
      { id: 'rev-5', userName: 'Arthur Dent', rating: 4, comment: 'Excellent quality! Fits perfectly around the shoulders and does not wrinkle easily after packing in a suitcase.', date: '2026-05-15' }
    ],
    stock: 60,
    brand: 'SavileRow',
    featured: true
  },
  {
    id: 'prod-5',
    name: 'ZenMantra Organic Japanese Green Tea',
    description: 'Hand-picked from the misty valleys of Uji, Kyoto. This premium loose-leaf green tea is packed with powerful antioxidants, offers a rich umami sweetness, and provides a calm, focused energy boost.',
    price: 19.99,
    originalPrice: 24.99,
    discount: 20,
    rating: 4.9,
    ratingCount: 145,
    category: 'Wellness',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=60'
    ],
    specs: [
      { name: 'Origin', value: 'Uji, Kyoto, Japan' },
      { name: 'Grade', value: 'Premium Ceremonial Loose Leaf' },
      { name: 'Size', value: '100g Airtight Tin' }
    ],
    reviews: [
      { id: 'rev-6', userName: 'Yuki M.', rating: 5, comment: 'Incredibly smooth and sweet, without any bitterness. Tastes exactly like traditional Japanese sencha.', date: '2026-05-22' }
    ],
    stock: 120,
    brand: 'ZenMantra',
    trending: true
  },
  {
    id: 'prod-6',
    name: 'ApexPro Active Noise Cancelling Headphones',
    description: 'Immerse yourself entirely in the sound. Featuring custom 40mm dynamic drivers, hybrid active noise cancellation, and a stunning 45 hours of playback time with high-res audio certification.',
    price: 189.99,
    originalPrice: 249.99,
    discount: 24,
    rating: 4.8,
    ratingCount: 520,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=60'
    ],
    specs: [
      { name: 'Driver', value: '40mm Dynamic' },
      { name: 'ANC', value: 'Hybrid Active (up to 38dB reduction)' },
      { name: 'Playtime', value: '45 Hours (ANC Off), 35 Hours (ANC On)' },
      { name: 'Codecs', value: 'LDAC, AAC, SBC' }
    ],
    reviews: [
      { id: 'rev-7', userName: 'Marcus E.', rating: 5, comment: 'Better ANC than my Sony XM4s. Soundstage is very wide and vocal clarity is perfect.', date: '2026-05-01' }
    ],
    stock: 18,
    brand: 'AeroTech',
    trending: true
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    type: 'Orders',
    title: 'Order Shipped 📦',
    message: 'Your order #SM-84930 has been processed and is on its way via Express Shipping.',
    date: '2 hours ago',
    read: false
  },
  {
    id: 'notif-2',
    type: 'Payments',
    title: 'Payment Successful Receipt 💳',
    message: 'We successfully received your payment of ₹87,978 for order #SM-84930.',
    date: '3 hours ago',
    read: false
  },
  {
    id: 'notif-3',
    type: 'Promotions',
    title: 'AI Smart Picks: 25% OFF 🔥',
    message: 'ShopMantra AI has curated 5 premium electronics matching your interests, now with 25% off coupon.',
    date: '1 day ago',
    read: true
  },
  {
    id: 'notif-4',
    type: 'Seller Alerts',
    title: 'Payout Processed Successfully 🚀',
    message: 'Your monthly withdrawal of ₹400,000 has been transferred to your business bank account.',
    date: '3 days ago',
    read: true
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'SM-84930',
    date: '2026-06-01',
    status: 'Shipped',
    items: [
      { product: MOCK_PRODUCTS[0], quantity: 1, price: 999.99 },
      { product: MOCK_PRODUCTS[1], quantity: 1, price: 59.99 }
    ],
    amount: 1059.98,
    shippingAddress: {
      fullName: 'John Doe',
      addressLine1: '456 Innovation Boulevard',
      addressLine2: 'Suite 201',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94107',
      country: 'United States',
      phone: '+1 (555) 019-2834'
    },
    billingAddress: {
      fullName: 'John Doe',
      addressLine1: '456 Innovation Boulevard',
      addressLine2: 'Suite 201',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94107',
      country: 'United States',
      phone: '+1 (555) 019-2834'
    },
    paymentMethod: 'Credit Card',
    paymentInfo: {
      last4: '4242',
      brand: 'Visa',
      transactionId: 'ch_3M9hQeLkdIwHu7ix1J'
    }
  },
  {
    id: 'SM-73921',
    date: '2026-05-18',
    status: 'Delivered',
    items: [
      { product: MOCK_PRODUCTS[3], quantity: 2, price: 49.99 },
      { product: MOCK_PRODUCTS[4], quantity: 3, price: 19.99 }
    ],
    amount: 159.95,
    shippingAddress: {
      fullName: 'John Doe',
      addressLine1: '456 Innovation Boulevard',
      addressLine2: 'Suite 201',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94107',
      country: 'United States',
      phone: '+1 (555) 019-2834'
    },
    billingAddress: {
      fullName: 'John Doe',
      addressLine1: '456 Innovation Boulevard',
      addressLine2: 'Suite 201',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94107',
      country: 'United States',
      phone: '+1 (555) 019-2834'
    },
    paymentMethod: 'PayPal',
    paymentInfo: {
      transactionId: 'PAYID-MLD43802KJ908'
    }
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-201',
    date: '2026-06-01T10:14:00Z',
    amount: 1059.98,
    type: 'sale',
    status: 'success',
    details: 'Order payment SM-84930'
  },
  {
    id: 'tx-202',
    date: '2026-05-30T16:45:00Z',
    amount: 150.00,
    type: 'withdrawal',
    status: 'success',
    details: 'Transfer to Stripe balance'
  },
  {
    id: 'tx-203',
    date: '2026-05-28T09:30:00Z',
    amount: 4820.00,
    type: 'payout',
    status: 'success',
    details: 'Monthly bank auto-payout'
  },
  {
    id: 'tx-204',
    date: '2026-05-18T14:22:00Z',
    amount: 159.95,
    type: 'sale',
    status: 'success',
    details: 'Order payment SM-73921'
  }
];

export const MOCK_PAYOUTS: PayoutHistory[] = [
  {
    id: 'pay-001',
    date: '2026-05-28',
    amount: 4820.00,
    status: 'completed',
    bankAccount: 'Chase Business ending in 9482'
  },
  {
    id: 'pay-002',
    date: '2026-04-28',
    amount: 3950.00,
    status: 'completed',
    bankAccount: 'Chase Business ending in 9482'
  }
];
