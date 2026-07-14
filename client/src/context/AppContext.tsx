import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, UserRole, ArtisanProfile, BrandProfile, Product, 
  RFQ, RFQQuote, Order, OrderStatus, Wallet, Notification, Transaction 
} from '../types';
import { supabase, isSupabaseConfigured } from '../supabase/supabaseClient';

interface AppContextType {
  // Authentication & Session
  currentUser: User | null;
  activeRole: UserRole | null;
  artisanProfile: ArtisanProfile | null;
  brandProfile: BrandProfile | null;
  setActiveRole: (role: UserRole | null) => void;
  login: (phone: string, role: UserRole) => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string, role: UserRole) => Promise<void>;
  signUpWithEmail: (email: string, password: string, fullName: string, phone: string, role: UserRole) => Promise<void>;
  logout: () => void;
  registerUser: (data: any) => void;
  
  // Onboarding Wizard State
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  onboardingData: any;
  updateOnboardingData: (data: any) => void;
  
  // Commerce & Core DB
  products: Product[];
  rfqs: RFQ[];
  orders: Order[];
  wallets: Record<string, Wallet>;
  notifications: Notification[];
  
  // Actions
  addProduct: (product: Omit<Product, 'id' | 'ownerId' | 'sku' | 'status'>) => Promise<{ success: boolean; error?: string }>;
  updateProductStock: (id: string, qty: number) => void;
  updateProduct: (id: string, updatedFields: Partial<Product>) => void;
  createRFQ: (rfqData: Omit<RFQ, 'id' | 'brandId' | 'brandName' | 'quotes' | 'status'>) => void;
  submitQuote: (rfqId: string, quote: Omit<RFQQuote, 'status'>) => void;
  acceptQuote: (rfqId: string, artisanId: string) => void;
  declineQuote: (rfqId: string, artisanId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  rechargeWallet: (uid: string, amount: number) => void;
  syncProductToBrand: (productId: string, brandId: string) => void;
  addNotification: (uid: string, type: Notification['type'], message: string) => void;
  placeDirectOrder: (order: Order) => void;
  portfolioPosts: any[];
  addPortfolioPost: (post: { title: string; category: string; image: string; description: string; artisanName: string; location: string; avatarBg: string; avatarChar: string }) => void;
  deletePortfolioPost: (title: string) => void;
  aiAutofillData: any;
  setAiAutofillData: (data: any) => void;
  
  // Screen/View Routing State
  currentView: string;
  setCurrentView: (view: string) => void;
  
  // AI Simulated Service Trigger
  triggerAIAutofill: (photoUrl: string) => Promise<any>;
  triggerAIImageStudio: (productId: string, style: string, metadata?: any) => Promise<string>;
  triggerAIScanMatch: (barcodeOrPhoto: string) => Promise<any>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const API_BASE = import.meta.env.PROD ? 'https://shilpsetu.onrender.com/api' : 'http://localhost:5000/api';

const defaultProducts: Product[] = [
  {
    id: 'p-0',
    ownerId: 'artisan-1',
    name: 'Jaipur Cotton Block-Print Saree',
    category: 'Textiles',
    craftType: 'Block Printing',
    material: 'Organic Mul Cotton',
    price: 2450,
    stockQty: 15,
    weight: 450,
    description: 'Elegant hand block-printed cotton saree featuring floral indigo patterns. Made using organic vegetable dyes in Jaipur.',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600'],
    sku: 'BS-BLO-003',
    status: 'inStock',
    aiGenerated: false
  },
  {
    id: 'p-1',
    ownerId: 'artisan-1',
    name: 'Blue Pure Silk Organza Kadwa Banarasi Saree',
    category: 'Textiles',
    craftType: 'Kadwa Handwoven',
    material: 'Pure Silk Organza',
    price: 14999,
    stockQty: 12,
    weight: 650,
    description: 'Traditional royal blue pure silk organza saree, handwoven using the antique Kadwa technique. Features tested gold zari and unstitched blouse (0.8 m). Origin: Banaras, UP.',
    images: ['/saree_blue.png'],
    sku: 'BS001',
    status: 'inStock',
    aiGenerated: false
  },
  {
    id: 'p-2',
    ownerId: 'artisan-1',
    name: 'Light Green Silk Viscose Cutwork Banarasi Saree',
    category: 'Textiles',
    craftType: 'Cutwork',
    material: 'Silk Viscose',
    price: 5699,
    stockQty: 18,
    weight: 700,
    description: 'Charming light green Banaras saree with exquisite viscose cutwork. Soft drape, tested zari work with unstitched blouse (0.8 m).',
    images: ['/saree_green.png'],
    sku: 'BS002',
    status: 'inStock',
    aiGenerated: false
  },
  {
    id: 'p-3',
    ownerId: 'artisan-1',
    name: 'Light Green Silk Viscose Cutwork Banarasi Saree',
    category: 'Textiles',
    craftType: 'Cutwork',
    material: 'Silk Viscose',
    price: 7124,
    stockQty: 10,
    weight: 700,
    description: 'Exquisite light green Banaras saree with detailed viscose cutwork, tested zari borders, and premium finish. Comes with unstitched blouse (0.8 m).',
    images: ['/saree_green.png'],
    sku: 'BS003',
    status: 'inStock',
    aiGenerated: false
  },
  {
    id: 'p-4',
    ownerId: 'artisan-1',
    name: 'Orange Silk Viscose Cutwork Banarasi Saree',
    category: 'Textiles',
    craftType: 'Cutwork',
    material: 'Silk Viscose',
    price: 5699,
    stockQty: 20,
    weight: 700,
    description: 'Vibrant orange Banaras saree featuring premium silk viscose cutwork design. Tested zari borders, perfect for traditional events.',
    images: ['/saree_orange.png'],
    sku: 'BS004',
    status: 'inStock',
    aiGenerated: false
  },
  {
    id: 'p-5',
    ownerId: 'artisan-1',
    name: 'Black Silk Viscose Kadwa Banarasi Saree',
    category: 'Textiles',
    craftType: 'Kadwa',
    material: 'Silk Viscose',
    price: 5699,
    stockQty: 15,
    weight: 720,
    description: 'Elegant black silk viscose saree crafted using the traditional Kadwa weaving method. Beautiful tested zari details, comes with unstitched blouse (0.8 m).',
    images: ['/saree_black.png'],
    sku: 'BS005',
    status: 'inStock',
    aiGenerated: false
  },
  {
    id: 'p-6',
    ownerId: 'artisan-1',
    name: 'Beige Silk Viscose Kadwa Banarasi Saree',
    category: 'Textiles',
    craftType: 'Kadwa',
    material: 'Silk Viscose',
    price: 5699,
    stockQty: 9,
    weight: 720,
    description: 'Classic beige silk viscose saree crafted in traditional Kadwa style. Exquisite tested zari borders, perfect for weddings and festive wear.',
    images: ['/saree_beige.png'],
    sku: 'BS006',
    status: 'inStock',
    aiGenerated: false
  }
];

const defaultRfqs: RFQ[] = [
  {
    id: 'rfq-1',
    brandId: 'brand-1',
    brandName: 'FabIndia',
    category: 'Textiles',
    craftType: 'Kadwa Banarasi Weaving',
    qty: 100,
    budget: 1320000,
    deliveryDate: '2026-08-15',
    status: 'open',
    techPackUrl: '#',
    quotes: [
      {
        artisanId: 'artisan-1',
        artisanName: 'Ramesh Kumar',
        artisanAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        artisanLocation: 'Varanasi, UP',
        artisanRating: 4.8,
        price: 13000,
        days: 45,
        status: 'pending'
      },
      {
        artisanId: 'artisan-2',
        artisanName: 'Naresh Patel',
        artisanAvatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150',
        artisanLocation: 'Bhuj, Gujarat',
        artisanRating: 4.6,
        price: 12800,
        days: 50,
        status: 'pending'
      }
    ]
  },
  {
    id: 'rfq-2',
    brandId: 'brand-1',
    brandName: 'Anouk Crafts',
    category: 'Textiles',
    craftType: 'Cutwork Banarasi Weaving',
    qty: 150,
    budget: 1920000,
    deliveryDate: '2026-08-30',
    status: 'open',
    techPackUrl: '#',
    quotes: [
      {
        artisanId: 'artisan-1',
        artisanName: 'Ramesh Kumar',
        artisanAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        artisanLocation: 'Varanasi, UP',
        artisanRating: 4.8,
        price: 12500,
        days: 40,
        status: 'pending'
      }
    ]
  }
];

const defaultOrders: Order[] = [
  // ==========================================
  // DIRECT RETAIL CUSTOMER ORDERS (type: 'customer')
  // ==========================================
  
  // Card 1: SS-2505-1023 (Ready to Ship)
  {
    id: 'SS-2505-1023',
    buyerId: 'cust-1',
    buyerName: 'Ananya Goel',
    buyerSubtitle: 'Direct Retail Client',
    buyerLogo: 'A',
    sellerId: 'artisan-1',
    sellerName: 'Ramesh Kumar',
    sellerLocation: 'Varanasi, UP',
    items: [
      {
        productId: 'p-1',
        name: 'Banarasi Saree',
        price: 14999,
        qty: 2,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400'
      }
    ],
    qty: 2,
    amount: 29998,
    status: 'shipped_to_hub', // Ready to Ship
    statusHistory: [{ status: 'placed', timestamp: '2026-05-20T10:30:00Z' }],
    deliveryDate: '28 May, 2025',
    type: 'customer',
    createdAt: '2026-05-20T10:30:00Z'
  },
  
  // Card 2: #ORD-2024-0891 (Ready to Ship)
  {
    id: '#ORD-2024-0891',
    buyerId: 'cust-2',
    buyerName: 'Vikram Singh',
    buyerSubtitle: 'Direct Retail Client',
    buyerLogo: 'V',
    sellerId: 'artisan-1',
    sellerName: 'Ramesh Kumar',
    sellerLocation: 'Varanasi, UP',
    items: [
      {
        productId: 'p-2',
        name: 'Banarasi Saree',
        price: 11500,
        qty: 2,
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400'
      }
    ],
    qty: 2,
    amount: 23000,
    status: 'shipped_to_hub', // Ready to Ship
    statusHistory: [{ status: 'placed', timestamp: '2026-05-20T11:00:00Z' }],
    deliveryDate: '28 May, 2025',
    type: 'customer',
    createdAt: '2026-05-20T11:00:00Z'
  },
  
  // Card 3: #ORD-2024-0890 (Processing)
  {
    id: '#ORD-2024-0890',
    buyerId: 'cust-3',
    buyerName: 'Sunita Mehra',
    buyerSubtitle: 'Direct Retail Client',
    buyerLogo: 'S',
    sellerId: 'artisan-1',
    sellerName: 'Ramesh Kumar',
    sellerLocation: 'Varanasi, UP',
    items: [
      {
        productId: 'p-3',
        name: 'Chanderi Dupatta',
        price: 3200,
        qty: 6,
        image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400'
      }
    ],
    qty: 6,
    amount: 19200,
    status: 'processing',
    statusHistory: [{ status: 'placed', timestamp: '2026-05-20T12:00:00Z' }],
    deliveryDate: '30 May, 2025',
    type: 'customer',
    createdAt: '2026-05-20T12:00:00Z'
  },

  // Card 4: #ORD-2024-0889 (Delivered)
  {
    id: '#ORD-2024-0889',
    buyerId: 'cust-4',
    buyerName: 'Kriti Sharma',
    buyerSubtitle: 'Direct Retail Client',
    buyerLogo: 'K',
    sellerId: 'artisan-1',
    sellerName: 'Ramesh Kumar',
    sellerLocation: 'Varanasi, UP',
    items: [
      {
        productId: 'p-2',
        name: 'Banarasi Saree',
        price: 11500,
        qty: 4,
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400'
      }
    ],
    qty: 4,
    amount: 46000,
    status: 'delivered',
    statusHistory: [{ status: 'placed', timestamp: '2026-05-19T09:00:00Z' }],
    deliveryDate: '26 May, 2025',
    type: 'customer',
    createdAt: '2026-05-19T09:00:00Z'
  },

  // Placed (New Orders) Direct Retail - Qty 3 items to show badge 3
  {
    id: 'SS-2505-8891',
    buyerId: 'cust-5',
    buyerName: 'Rahul Patel',
    buyerSubtitle: 'Direct Retail Client',
    buyerLogo: 'R',
    sellerId: 'artisan-1',
    sellerName: 'Ramesh Kumar',
    sellerLocation: 'Varanasi, UP',
    items: [{ productId: 'p-1', name: 'Banarasi Saree', price: 14999, qty: 1, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400' }],
    qty: 1,
    amount: 14999,
    status: 'placed',
    statusHistory: [{ status: 'placed', timestamp: '2026-05-20T15:00:00Z' }],
    deliveryDate: '3 June, 2025',
    type: 'customer',
    createdAt: '2026-05-20T15:00:00Z'
  },
  {
    id: 'SS-2505-8892',
    buyerId: 'cust-6',
    buyerName: 'Divya Rao',
    buyerSubtitle: 'Direct Retail Client',
    buyerLogo: 'D',
    sellerId: 'artisan-1',
    sellerName: 'Ramesh Kumar',
    sellerLocation: 'Varanasi, UP',
    items: [{ productId: 'p-3', name: 'Chanderi Dupatta', price: 3200, qty: 2, image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400' }],
    qty: 2,
    amount: 6400,
    status: 'placed',
    statusHistory: [{ status: 'placed', timestamp: '2026-05-20T16:00:00Z' }],
    deliveryDate: '4 June, 2025',
    type: 'customer',
    createdAt: '2026-05-20T16:00:00Z'
  },
  {
    id: 'SS-2505-8893',
    buyerId: 'cust-7',
    buyerName: 'Vijay Kumar',
    buyerSubtitle: 'Direct Retail Client',
    buyerLogo: 'V',
    sellerId: 'artisan-1',
    sellerName: 'Ramesh Kumar',
    sellerLocation: 'Varanasi, UP',
    items: [{ productId: 'p-5', name: 'Terracotta Pot', price: 850, qty: 5, image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=400' }],
    qty: 5,
    amount: 4250,
    status: 'placed',
    statusHistory: [{ status: 'placed', timestamp: '2026-05-20T17:00:00Z' }],
    deliveryDate: '5 June, 2025',
    type: 'customer',
    createdAt: '2026-05-20T17:00:00Z'
  },

  // ==========================================
  // RFQ BULK ORDERS (type: 'RFQ')
  // ==========================================
  {
    id: 'RFQ-SS-9921',
    buyerId: 'brand-taneira',
    buyerName: 'Taneira',
    buyerSubtitle: 'A TATA Product',
    buyerLogo: 'T',
    sellerId: 'artisan-1',
    sellerName: 'Ramesh Kumar',
    sellerLocation: 'Varanasi, UP',
    items: [{ productId: 'p-1', name: 'Kadwa Banarasi Silk Saree', price: 12500, qty: 100, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400' }],
    qty: 100,
    amount: 1250000,
    status: 'placed',
    statusHistory: [{ status: 'placed', timestamp: '2026-05-20T09:00:00Z' }],
    deliveryDate: '25 Aug, 2025',
    type: 'RFQ',
    createdAt: '2026-05-20T09:00:00Z'
  },
  {
    id: 'RFQ-SS-9922',
    buyerId: 'brand-fabindia',
    buyerName: 'Fabindia',
    buyerSubtitle: 'Celebrate India',
    buyerLogo: 'F',
    sellerId: 'artisan-1',
    sellerName: 'Ramesh Kumar',
    sellerLocation: 'Varanasi, UP',
    items: [{ productId: 'p-2', name: 'Bhuj Organic Indigo Fabric', price: 450, qty: 250, image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400' }],
    qty: 250,
    amount: 112500,
    status: 'placed',
    statusHistory: [{ status: 'placed', timestamp: '2026-05-20T10:00:00Z' }],
    deliveryDate: '10 Sept, 2025',
    type: 'RFQ',
    createdAt: '2026-05-20T10:00:00Z'
  },
  {
    id: 'RFQ-SS-9923',
    buyerId: 'brand-aachho',
    buyerName: 'Aachho',
    buyerSubtitle: 'Ethnic. Authentic. You.',
    buyerLogo: 'A',
    sellerId: 'artisan-1',
    sellerName: 'Ramesh Kumar',
    sellerLocation: 'Varanasi, UP',
    items: [{ productId: 'p-3', name: 'Chanderi Silk Saree', price: 11000, qty: 50, image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400' }],
    qty: 50,
    amount: 550000,
    status: 'processing',
    statusHistory: [{ status: 'placed', timestamp: '2026-05-19T10:00:00Z' }, { status: 'processing', timestamp: '2026-05-19T14:00:00Z' }],
    deliveryDate: '15 Oct, 2025',
    type: 'RFQ',
    createdAt: '2026-05-19T10:00:00Z'
  },
  {
    id: 'RFQ-SS-9924',
    buyerId: 'brand-kalki',
    buyerName: 'Kalki Fashion',
    buyerSubtitle: 'Celebrate Craftsmanship',
    buyerLogo: 'K',
    sellerId: 'artisan-1',
    sellerName: 'Ramesh Kumar',
    sellerLocation: 'Varanasi, UP',
    items: [{ productId: 'p-4', name: 'Premium Jute Bags', price: 350, qty: 200, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400' }],
    qty: 200,
    amount: 70000,
    status: 'shipped_to_hub',
    statusHistory: [{ status: 'placed', timestamp: '2026-05-18T10:00:00Z' }, { status: 'processing', timestamp: '2026-05-18T15:00:00Z' }, { status: 'shipped_to_hub', timestamp: '2026-05-19T11:00:00Z' }],
    deliveryDate: '1 Nov, 2025',
    type: 'RFQ',
    createdAt: '2026-05-18T10:00:00Z'
  },
  {
    id: 'ORD-2505-1024',
    buyerId: 'brand-1',
    buyerName: 'FabIndia Boutique',
    buyerSubtitle: 'Bespoke Sourcing',
    buyerLogo: 'F',
    sellerId: 'artisan-1',
    sellerName: 'Ramesh Kumar',
    sellerLocation: 'Varanasi, UP',
    items: [
      {
        productId: 'p-10',
        name: 'Vibrant Blue Pure Organza Silk Banarasi Saree',
        price: 48000,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=150'
      }
    ],
    qty: 1,
    amount: 48000,
    status: 'placed',
    statusHistory: [
      {
        status: 'placed',
        timestamp: '2026-06-29T10:00:00Z'
      }
    ],
    deliveryDate: '15 July, 2025',
    type: 'customer',
    createdAt: '2026-06-29T10:00:00Z'
  },
  {
    id: 'ORD-2505-1025',
    buyerId: 'brand-1',
    buyerName: 'Anouk Crafts',
    buyerSubtitle: 'Ethnic curation',
    buyerLogo: 'A',
    sellerId: 'artisan-2',
    sellerName: 'Naresh Patel',
    sellerLocation: 'Bhuj, Gujarat',
    items: [
      {
        productId: 'p-12',
        name: 'Chanderi Handwoven Zari Motif Saree',
        price: 16500,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=150'
      }
    ],
    qty: 1,
    amount: 16500,
    status: 'processing',
    statusHistory: [
      {
        status: 'placed',
        timestamp: '2026-06-28T11:00:00Z'
      },
      {
        status: 'processing',
        timestamp: '2026-06-28T16:00:00Z'
      }
    ],
    deliveryDate: '20 July, 2025',
    type: 'customer',
    createdAt: '2026-06-28T11:00:00Z'
  },
  {
    id: 'ORD-2505-1026',
    buyerId: 'brand-1',
    buyerName: 'FabIndia',
    buyerSubtitle: 'Celebrate India',
    buyerLogo: 'F',
    sellerId: 'artisan-1',
    sellerName: 'Ramesh Kumar',
    sellerLocation: 'Varanasi, UP',
    items: [
      {
        productId: 'p-1',
        name: 'Banarasi Silk Saree - Kadwa Weave (Bulk)',
        price: 13000,
        qty: 100,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=150'
      }
    ],
    qty: 100,
    amount: 1300000,
    status: 'qc_branding',
    statusHistory: [
      {
        status: 'placed',
        timestamp: '2026-06-10T09:00:00Z'
      },
      {
        status: 'processing',
        timestamp: '2026-06-12T10:00:00Z'
      },
      {
        status: 'shipped_to_hub',
        timestamp: '2026-06-25T14:00:00Z'
      },
      {
        status: 'qc_branding',
        timestamp: '2026-06-28T11:30:00Z'
      }
    ],
    deliveryDate: '25 July, 2025',
    type: 'RFQ',
    createdAt: '2026-06-10T09:00:00Z'
  },
  {
    id: 'ORD-2505-1027',
    buyerId: 'brand-1',
    buyerName: 'Anouk Crafts',
    buyerSubtitle: 'Ethnic curation',
    buyerLogo: 'A',
    sellerId: 'artisan-1',
    sellerName: 'Ramesh Kumar',
    sellerLocation: 'Varanasi, UP',
    items: [
      {
        productId: 'p-2',
        name: 'Light Green Silk Viscose Cutwork Banaras Saree (Bulk)',
        price: 12500,
        qty: 150,
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=150'
      }
    ],
    qty: 150,
    amount: 1875000,
    status: 'dispatched',
    statusHistory: [
      {
        status: 'placed',
        timestamp: '2026-05-15T09:00:00Z'
      },
      {
        status: 'processing',
        timestamp: '2026-05-18T10:00:00Z'
      },
      {
        status: 'shipped_to_hub',
        timestamp: '2026-06-10T14:00:00Z'
      },
      {
        status: 'qc_branding',
        timestamp: '2026-06-15T11:30:00Z'
      },
      {
        status: 'dispatched',
        timestamp: '2026-06-28T09:00:00Z'
      }
    ],
    deliveryDate: '5 July, 2025',
    type: 'RFQ',
    createdAt: '2026-05-15T09:00:00Z'
  },
  {
    id: 'ORD-2505-1028',
    buyerId: 'brand-2',
    buyerName: 'New Brand Ltd',
    buyerSubtitle: 'Bespoke sourcing',
    buyerLogo: 'N',
    sellerId: 'artisan-2',
    sellerName: 'Naresh Patel',
    sellerLocation: 'Bhuj, Gujarat',
    items: [
      {
        productId: 'p-13',
        name: 'Chanderi Silk Buti Saree (Festive Collection Bulk)',
        price: 9500,
        qty: 50,
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=150'
      }
    ],
    qty: 50,
    amount: 475000,
    status: 'delivered',
    statusHistory: [
      {
        status: 'placed',
        timestamp: '2026-05-01T09:00:00Z'
      },
      {
        status: 'processing',
        timestamp: '2026-05-05T10:00:00Z'
      },
      {
        status: 'shipped_to_hub',
        timestamp: '2026-05-20T14:00:00Z'
      },
      {
        status: 'qc_branding',
        timestamp: '2026-05-25T11:30:00Z'
      },
      {
        status: 'dispatched',
        timestamp: '2026-05-28T09:00:00Z'
      },
      {
        status: 'delivered',
        timestamp: '2026-06-10T16:00:00Z'
      }
    ],
    deliveryDate: '10 June, 2025',
    type: 'RFQ',
    createdAt: '2026-05-01T09:00:00Z'
  },
  {
    id: 'RFQ-2026-001',
    buyerId: 'brand-heritage',
    buyerName: 'Heritage Looms Pvt. Ltd.',
    buyerSubtitle: 'Ananya Sharma | +91 98765 43210',
    buyerLogo: 'H',
    sellerId: 'artisan-1',
    sellerName: 'Ramesh Kumar',
    sellerLocation: 'Varanasi, UP',
    items: [
      {
        productId: 'p-1',
        name: 'Banarasi Silk Saree (Bulk RFQ)',
        price: 5000,
        qty: 50,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
        description: 'Specs: Pure Banarasi weaving with zari border. Terms: 50% Advance, 50% Before Dispatch. Dest: Mumbai, MH.'
      }
    ],
    qty: 50,
    amount: 250000,
    status: 'placed',
    statusHistory: [{ status: 'placed', timestamp: '2026-06-30T10:00:00Z' }],
    deliveryDate: 'Within 30 Days',
    type: 'RFQ',
    createdAt: '2026-06-30T10:00:00Z'
  },
  {
    id: 'RFQ-2026-002',
    buyerId: 'brand-ethnic',
    buyerName: 'Ethnic Threads India',
    buyerSubtitle: 'Rahul Mehta | +91 99887 66554',
    buyerLogo: 'E',
    sellerId: 'artisan-1',
    sellerName: 'Ramesh Kumar',
    sellerLocation: 'Varanasi, UP',
    items: [
      {
        productId: 'p-1',
        name: 'Banarasi Silk Saree (Bulk RFQ)',
        price: 5000,
        qty: 50,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
        description: 'Specs: Handwoven Banarasi silk with gold zari pallu. Terms: 30% Advance, 70% After Quality Inspection. Dest: Bengaluru, KA.'
      }
    ],
    qty: 50,
    amount: 250000,
    status: 'processing',
    statusHistory: [
      { status: 'placed', timestamp: '2026-06-29T09:00:00Z' },
      { status: 'processing', timestamp: '2026-06-29T14:00:00Z' }
    ],
    deliveryDate: 'Within 25 Days',
    type: 'RFQ',
    createdAt: '2026-06-29T09:00:00Z'
  }
];

const defaultWallets: Record<string, Wallet> = {
  'artisan-1': {
    ownerId: 'artisan-1',
    balance: 14500,
    reservedAmount: 4000,
    transactions: [
      { id: 'tx-1', type: 'credit', amount: 8500, description: 'Payout received: ORD-2026-002', date: '2026-06-20' },
      { id: 'tx-2', type: 'credit', amount: 6000, description: 'Advance received: ORD-2026-001', date: '2026-06-20' }
    ]
  },
  'brand-1': {
    ownerId: 'brand-1',
    balance: 12450,
    reservedAmount: 3200,
    transactions: [
      { id: 'tx-b1', type: 'debit', amount: 25000, description: 'Payment for order ORD-2026-001', date: '2026-06-20' },
      { id: 'tx-b2', type: 'credit', amount: 10000, description: 'Wallet recharge via NetBanking', date: '2026-06-19' }
    ]
  }
};

const defaultNotifications: Notification[] = [
  { id: 'n-1', uid: 'artisan-1', type: 'order', message: 'You have received a new order for 2 Banarasi Silk Sarees from FabIndia Boutique.', read: false, createdAt: '2026-06-20T10:05:00Z' },
  { id: 'n-2', uid: 'brand-1', type: 'rfq', message: 'Naaz Begum has submitted a quote of ₹295/pc for your Hand Block Printing RFQ.', read: false, createdAt: '2026-06-21T08:30:00Z' }
];

const defaultPortfolioPosts = [
  {
    artisanName: "Kavita Sharma",
    avatarBg: "bg-purple-700 text-white",
    avatarChar: "K",
    location: "Varanasi, Uttar Pradesh",
    title: "National Craft Award 2024",
    category: "Award",
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=300",
    description: "Awarded by the Ministry of Textiles for exceptional skill in Kadwa weaving on mulberry silk."
  },
  {
    artisanName: "Kavita Sharma",
    avatarBg: "bg-purple-700 text-white",
    avatarChar: "K",
    location: "Varanasi, Uttar Pradesh",
    title: "Handloom Mark Certified",
    category: "Verification",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300",
    description: "Official Handloom Mark Registry certificate validating authenticity of pure handloom products."
  },
  {
    artisanName: "Rahul Deshmukh",
    avatarBg: "bg-rose-700 text-white",
    avatarChar: "R",
    location: "Paithan, Maharashtra",
    title: "GI Authenticity Certificate",
    category: "Verification",
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=300",
    description: "Geographical Indication Registry document validating authentic Paithani handcrafting."
  },
  {
    artisanName: "Ramesh Kumar",
    avatarBg: "bg-primary text-white",
    avatarChar: "R",
    location: "Varanasi, Uttar Pradesh",
    title: "UNESCO Crafts Seal 2021",
    category: "Award",
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=300",
    description: "Awarded for keeping block printing methods 100% biodegradable and zero waste."
  },
  {
    artisanName: "Kavita Sharma",
    avatarBg: "bg-purple-700 text-white",
    avatarChar: "K",
    location: "Varanasi, Uttar Pradesh",
    title: "Traditional Jacquard Setup",
    category: "BTS",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=300",
    description: "Setting up the complex card pattern deck on the loom, which defines the floral border details."
  },
  {
    artisanName: "Rahul Deshmukh",
    avatarBg: "bg-rose-700 text-white",
    avatarChar: "R",
    location: "Paithan, Maharashtra",
    title: "Golden Zari Quality Test",
    category: "Verification",
    image: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=300",
    description: "Lab grade authentication verifying the metallic silver and gold threads have 98% pure silver core."
  },
  {
    artisanName: "Ramesh Kumar",
    avatarBg: "bg-primary text-white",
    avatarChar: "R",
    location: "Varanasi, Uttar Pradesh",
    title: "BTS Wood carving blocks",
    category: "BTS",
    image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=300",
    description: "Ramesh wood carving traditional floral patterns on dense teakwood block sets."
  },
  {
    artisanName: "Kavita Sharma",
    avatarBg: "bg-purple-700 text-white",
    avatarChar: "K",
    location: "Varanasi, Uttar Pradesh",
    title: "Organic Dye Preparation",
    category: "BTS",
    image: "https://images.unsplash.com/photo-1603006905393-af5c083652ea?w=300",
    description: "Boiling madder root and indigo powders to formulate chemical-free crimson dye."
  },
  {
    artisanName: "Ramesh Kumar",
    avatarBg: "bg-primary text-white",
    avatarChar: "R",
    location: "Varanasi, Uttar Pradesh",
    title: "Dye Fixing Sun Drying",
    category: "BTS",
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e3a9?w=300",
    description: "Hanging organically block printed mul cotton sheets to bake under intense sunlight for color fastening."
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Session Auth State
  const [currentUser, setCurrentUser] = useState<User | null>({
    uid: 'artisan-1',
    role: 'ARTISAN',
    name: 'Ramesh Kumar',
    phone: '+919876543210',
    verified: true,
    createdAt: '2026-05-01T00:00:00Z'
  });
  const [activeRole, setActiveRoleState] = useState<UserRole | null>('ARTISAN');
  const [artisanProfile, setArtisanProfile] = useState<ArtisanProfile | null>({
    uid: 'artisan-1',
    idType: 'Artisan Card',
    idStatus: 'verified',
    location: { lat: 25.3176, lng: 82.9739, address: 'Kabeer Nagar, Varanasi, UP' },
    businessType: 'Family Business',
    teamSize: 5,
    monthlyProduction: 20,
    monthlyProductionUnit: 'pcs',
    craftTypes: ['Banarasi Weaving', 'Zardozi Embroidery'],
    trustScore: 4.8,
    walletId: 'artisan-1'
  });
  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>({
    uid: 'brand-1',
    brandName: 'FabIndia Boutique',
    contactPerson: 'Ananya Goel',
    categories: ['Textiles', 'Apparel', 'Home Decor'],
    craftInterests: ['Banarasi Weaving', 'Hand Block Printing', 'Kalamkari'],
    businessType: 'Boutique',
    websiteUrl: 'https://fabindia.example.com',
    inventorySyncEnabled: true,
    walletId: 'brand-1'
  });

  // DB States (Local Mirror)
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [rfqs, setRfqs] = useState<RFQ[]>(defaultRfqs);
  const [orders, setOrders] = useState<Order[]>(defaultOrders);
  const [wallets, setWallets] = useState<Record<string, Wallet>>(defaultWallets);
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);
  const [portfolioPosts, setPortfolioPosts] = useState<any[]>(defaultPortfolioPosts);

  const addPortfolioPost = (post: any) => {
    setPortfolioPosts(prev => [post, ...prev]);
  };

  const deletePortfolioPost = (title: string) => {
    setPortfolioPosts(prev => prev.filter(post => post.title !== title));
  };

  // Router View States
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [onboardingStep, setOnboardingStep] = useState<number>(0);
  const [onboardingData, setOnboardingData] = useState<any>({});
  const [aiAutofillData, setAiAutofillData] = useState<any>(null);

  // Sync state from server on startup if reachable, else use seed data
  useEffect(() => {
    const fetchServerState = async () => {
      let syncedFromSupabase = false;
      // 1. Sync from Supabase database tables if configured
      if (isSupabaseConfigured()) {
        try {
          console.log("Shilp Setu: Fetching state from live Supabase database...");
          
          // Fetch Products
          const { data: dbProds, error: pErr } = await supabase.from('products').select('*');
          if (!pErr && dbProds && dbProds.length > 0) {
            const mappedProds: Product[] = dbProds.map((p: any) => ({
              id: p.id,
              ownerId: p.artisan_id,
              name: p.name,
              category: p.category,
              craftType: p.craft_type,
              material: 'Organic Material',
              price: Number(p.price),
              stockQty: p.stock,
              weight: 500,
              description: p.description || '',
              images: p.images || ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600'],
              sku: 'SKU-' + p.id.slice(0, 5).toUpperCase(),
              status: p.stock > 5 ? 'inStock' : (p.stock > 0 ? 'lowStock' : 'outOfStock'),
              aiGenerated: false
            }));
            setProducts(mappedProds);
            syncedFromSupabase = true;
          }

          // Fetch Orders
          const { data: dbOrders, error: oErr } = await supabase.from('orders').select('*');
          if (!oErr && dbOrders && dbOrders.length > 0) {
            const mappedOrders: Order[] = dbOrders.map((o: any) => ({
              id: o.id,
              buyerId: o.brand_id,
              buyerName: 'Fabindia Boutique',
              sellerId: o.artisan_id,
              sellerName: 'Ramesh Kumar',
              sellerLocation: 'Varanasi, UP',
              items: [
                {
                  productId: 'db-item',
                  name: 'Procured Saree / Craft item',
                  price: Number(o.total_amount) / o.quantity,
                  qty: o.quantity,
                  image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400'
                }
              ],
              qty: o.quantity,
              amount: Number(o.total_amount),
              status: o.status,
              statusHistory: [{ status: o.status, timestamp: o.created_at }],
              deliveryDate: '28 Aug, 2026',
              type: o.order_type === 'direct_retail' ? 'customer' : 'RFQ',
              createdAt: o.created_at,
              awb: o.awb_tracking_id || undefined
            }));
            setOrders(mappedOrders);
            syncedFromSupabase = true;
          }
        } catch (se) {
          console.warn("Supabase database fetch error, falling back to seed arrays:", se);
        }
      }

      // 2. Fallback to Express mock backend endpoints if not loaded from Supabase
      if (!syncedFromSupabase) {
        try {
          const prodRes = await fetch(`${API_BASE}/products`);
          if (prodRes.ok) {
            const data = await prodRes.json();
            if (data && data.length > 0) setProducts(data);
          }
          const rfqRes = await fetch(`${API_BASE}/rfqs`);
          if (rfqRes.ok) {
            const data = await rfqRes.json();
            if (data && data.length > 0) setRfqs(data);
          }
          const ordRes = await fetch(`${API_BASE}/orders`);
          if (ordRes.ok) {
            const data = await ordRes.json();
            if (data && data.length > 0) setOrders(data);
          }
        } catch (err) {
          console.warn("Express Server not running. Running in browser-local prototype state.");
        }
      }
    };
    fetchServerState();
  }, []);

  const syncPersonalData = async (userId: string, role: UserRole) => {
    if (!isSupabaseConfigured()) return;
    
    try {
      console.log(`ShilpSetu: Fetching personal database records for ${role} (ID: ${userId})...`);
      
      // 1. Fetch Products
      let productQuery = supabase.from('products').select('*');
      if (role === 'ARTISAN') {
        productQuery = productQuery.eq('artisan_id', userId);
      }
      const { data: dbProds, error: pErr } = await productQuery;
      if (!pErr && dbProds) {
        const mappedProds: Product[] = dbProds.map((p: any) => ({
          id: p.id,
          ownerId: p.artisan_id,
          name: p.name,
          category: p.category,
          craftType: p.craft_type,
          material: 'Organic Material',
          price: Number(p.price),
          stockQty: p.stock,
          weight: 500,
          description: p.description || '',
          images: p.images || ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600'],
          sku: 'SKU-' + p.id.slice(0, 5).toUpperCase(),
          status: p.stock > 5 ? 'inStock' : (p.stock > 0 ? 'lowStock' : 'outOfStock'),
          aiGenerated: false
        }));
        setProducts(mappedProds);
      }

      // 2. Fetch Orders
      let orderQuery = supabase.from('orders').select('*');
      if (role === 'ARTISAN') {
        orderQuery = orderQuery.eq('artisan_id', userId);
      } else {
        orderQuery = orderQuery.eq('brand_id', userId);
      }
      const { data: dbOrders, error: oErr } = await orderQuery;
      if (!oErr && dbOrders) {
        const mappedOrders: Order[] = dbOrders.map((o: any) => ({
          id: o.id,
          buyerId: o.brand_id,
          buyerName: 'Fabindia Boutique',
          sellerId: o.artisan_id,
          sellerName: 'Ramesh Kumar',
          sellerLocation: 'Varanasi, UP',
          items: [
            {
              productId: 'db-item',
              name: 'Procured Saree / Craft item',
              price: Number(o.total_amount) / o.quantity,
              qty: o.quantity,
              image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400'
            }
          ],
          qty: o.quantity,
          amount: Number(o.total_amount),
          status: o.status,
          statusHistory: [{ status: o.status, timestamp: o.created_at }],
          deliveryDate: '28 Aug, 2026',
          type: o.order_type === 'direct_retail' ? 'customer' : 'RFQ',
          createdAt: o.created_at,
          awb: o.awb_tracking_id || undefined
        }));
        setOrders(mappedOrders);
      }

      // 3. Fetch Wallet Balance
      const { data: walletData, error: wErr } = await supabase
        .from('wallet_balances')
        .select('balance')
        .eq('user_id', userId)
        .maybeSingle();
      if (!wErr && walletData) {
        const dbBalance = Number(walletData.balance);
        setWallets(prev => ({
          ...prev,
          [userId]: {
            ownerId: userId,
            balance: dbBalance,
            reservedAmount: 0,
            transactions: [
              { id: 'tx-db-sync-' + Date.now(), type: 'credit', amount: dbBalance, description: 'Live Wallet Sync', date: new Date().toISOString().split('T')[0] }
            ]
          }
        }));
      }
    } catch (err) {
      console.warn("Error syncing user personal data from database:", err);
    }
  };

  // Synchronize personal database records whenever the current user changes (login/onboard)
  useEffect(() => {
    if (currentUser?.uid) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const targetUid = uuidRegex.test(currentUser.uid) 
        ? currentUser.uid 
        : (currentUser.role === 'BRAND' ? '11111111-1111-1111-1111-111111111111' : '00000000-0000-0000-0000-000000000000');
      
      syncPersonalData(targetUid, currentUser.role);
    }
  }, [currentUser]);

  // Listen to Supabase Auth state changes dynamically
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const user = session.user;
          console.log("Shilp Setu: Supabase Auth Session Active for", user.email);

          // Fetch the user's role and name from public.users database table
          const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          if (!error && profile) {
            setCurrentUser({
              uid: profile.id,
              role: profile.role as UserRole,
              name: profile.full_name,
              phone: profile.phone,
              email: profile.email || undefined,
              verified: true,
              createdAt: profile.created_at
            });
            setActiveRoleState(profile.role as UserRole);

            // Populate role profile
            if (profile.role === 'ARTISAN') {
              const { data: artData } = await supabase.from('artisans').select('*').eq('id', user.id).single();
              if (artData) {
                setArtisanProfile({
                  uid: artData.id,
                  idType: artData.id_type,
                  idStatus: 'verified',
                  location: { lat: artData.location_lat || 25.3, lng: artData.location_lng || 82.9, address: artData.location_address || '' },
                  businessType: artData.business_type,
                  teamSize: artData.team_size,
                  monthlyProduction: artData.monthly_capacity,
                  monthlyProductionUnit: artData.monthly_capacity_unit,
                  craftTypes: artData.craft_types,
                  trustScore: 5.0,
                  walletId: artData.id
                });
              }
            } else {
              const { data: brandData } = await supabase.from('brands').select('*').eq('id', user.id).single();
              if (brandData) {
                setBrandProfile({
                  uid: brandData.id,
                  brandName: brandData.brand_name,
                  contactPerson: brandData.brand_name,
                  categories: brandData.categories_interest,
                  craftInterests: brandData.crafts_interest,
                  businessType: brandData.business_type,
                  websiteUrl: brandData.website || undefined,
                  inventorySyncEnabled: true,
                  walletId: brandData.id
                });
              }
            }
            setCurrentView('dashboard');
          } else {
            // New user without database profile yet (redirect to onboarding)
            const userRole = (user.user_metadata?.role as UserRole) || 'ARTISAN';
            setCurrentUser({
              uid: user.id,
              role: userRole,
              name: user.user_metadata?.full_name || 'New Shilp User',
              phone: user.user_metadata?.phone || '',
              email: user.email || undefined,
              verified: true,
              createdAt: new Date().toISOString()
            });
            setActiveRoleState(userRole);
            if (userRole === 'BRAND') {
              setCurrentView('brand-onboarding');
            } else {
              setCurrentView('artisan-onboarding');
            }
          }
        } else {
          setCurrentUser(null);
          setActiveRoleState(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const setActiveRole = (role: UserRole | null) => {
    setActiveRoleState(role);
    if (role === 'ARTISAN') {
      setCurrentUser(prev => prev ? { ...prev, role: 'ARTISAN' } : {
        uid: 'artisan-1',
        role: 'ARTISAN',
        name: 'Ramesh Kumar',
        phone: '+919876543210',
        verified: true,
        createdAt: '2026-05-01T00:00:00Z'
      });
      setCurrentView('dashboard');
    } else if (role === 'BRAND') {
      setCurrentUser(prev => prev ? { ...prev, role: 'BRAND' } : {
        uid: 'brand-1',
        role: 'BRAND',
        name: 'Ananya Goel',
        phone: '+919812345678',
        verified: true,
        createdAt: '2026-05-15T00:00:00Z'
      });
      setCurrentView('dashboard');
    } else {
      setCurrentUser(null);
      setCurrentView('splash');
      setOnboardingStep(0);
      setOnboardingData({});
    }
  };

  const login = (phone: string, role: UserRole) => {
    if (role === 'ARTISAN') {
      setCurrentUser({
        uid: 'artisan-1',
        role: 'ARTISAN',
        name: 'Ramesh Kumar',
        phone: phone,
        verified: true,
        createdAt: '2026-05-01T00:00:00Z'
      });
      setActiveRoleState('ARTISAN');
      setCurrentView('dashboard');
    } else {
      setCurrentUser({
        uid: 'brand-1',
        role: 'BRAND',
        name: 'Ananya Goel',
        phone: phone,
        verified: true,
        createdAt: '2026-05-15T00:00:00Z'
      });
      setActiveRoleState('BRAND');
      setCurrentView('dashboard');
    }
  };

  const loginWithGoogle = async () => {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: window.location.origin }
        });
        if (error) alert("Google Login error: " + error.message);
      } catch (err) {
        console.error("Auth error:", err);
      }
    } else {
      login('+919876543210', 'ARTISAN');
      alert("Mock Google Auth successful!");
    }
  };

  const loginWithEmail = async (email: string, password: string, role: UserRole) => {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          alert("Login failed: " + error.message);
        } else {
          setActiveRoleState(role);
        }
      } catch (err) {
        console.error("Auth error:", err);
      }
    } else {
      login('+919876543210', role);
      alert(`Logged in locally via ${email}`);
    }
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string, phone: string, role: UserRole) => {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, phone }
          }
        });
        if (error) {
          alert("Signup failed: " + error.message);
        } else if (data.user) {
          alert("Registration request sent! Please check your email for the verification link.");
        }
      } catch (err) {
        console.error("Auth error:", err);
      }
    } else {
      setActiveRoleState(role);
      registerUser({ name: fullName, phone, email });
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error("Signout error:", e);
      }
    }
    setCurrentUser(null);
    setActiveRoleState(null);
    setCurrentView('splash');
  };

  const registerUser = async (data: any) => {
    let userUuid = currentUser?.uid || '';
    let isRealAuthSession = false;
    
    // If Supabase is configured, try to fetch the real authenticated user's ID
    if (isSupabaseConfigured()) {
      try {
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user) {
          userUuid = authData.user.id;
          isRealAuthSession = true;
        }
      } catch (err) {
        console.warn("Could not get Supabase authenticated user ID:", err);
      }
    }
    
    // Validate if userUuid is a valid UUID, otherwise generate a valid UUID for the database write
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!userUuid || !uuidRegex.test(userUuid)) {
      userUuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
      console.log("ShilpSetu: Generated valid UUID for mock onboarding session:", userUuid);
    }
    
    const newUser: User = {
      uid: userUuid,
      role: activeRole || 'ARTISAN',
      name: data.name || data.brandName || 'New User',
      phone: data.phone || '+910000000000',
      email: data.email,
      verified: true,
      createdAt: new Date().toISOString()
    };
    
    setCurrentUser(newUser);

    // Supabase DB Profile Sync (Only for real authenticated sessions)
    if (isSupabaseConfigured() && isRealAuthSession) {
      try {
        // 1. Create Core public.users Profile
        const { error: userError } = await supabase.from('users').upsert({
          id: userUuid,
          full_name: newUser.name,
          role: newUser.role,
          phone: newUser.phone,
          email: newUser.email
        });
        if (userError) {
          console.error("Supabase user profile insertion failed:", userError.message, userError.details);
        }

        // 2. Create role-specific details
        if (newUser.role === 'ARTISAN') {
          const { error: artisanError } = await supabase.from('artisans').upsert({
            id: userUuid,
            id_type: data.idType || 'Artisan Card',
            categories: data.craftCategories || [],
            craft_types: data.craftTypes || [],
            business_type: data.businessType || 'Individual Artisan',
            team_size: data.teamSize || 1,
            monthly_capacity: data.monthlyProduction || 100,
            monthly_capacity_unit: data.monthlyProductionUnit || 'pcs',
            location_address: 'Varanasi, UP',
            verified_status: true
          });
          if (artisanError) {
            console.error("Supabase artisan profile insertion failed:", artisanError.message, artisanError.details);
          }
        } else {
          const { error: brandError } = await supabase.from('brands').upsert({
            id: userUuid,
            brand_name: data.brandName || 'New Brand',
            company_name: data.brandName || 'New Brand Ltd',
            business_type: data.businessType || 'Retailer',
            website: data.websiteUrl || '',
            categories_interest: data.categories || [],
            crafts_interest: data.craftInterests || []
          });
          if (brandError) {
            console.error("Supabase brand profile insertion failed:", brandError.message, brandError.details);
          }
        }
        console.log("Shilp Setu: Supabase user profile synchronized successfully!");
      } catch (err) {
        console.error("Supabase profile sync exception:", err);
      }
    }

    if (newUser.role === 'ARTISAN') {
      const artProf: ArtisanProfile = {
        uid: userUuid,
        idType: data.idType || 'Artisan Card',
        idStatus: 'verified',
        location: data.location || { lat: 25.3, lng: 82.9, address: 'Kabeer Nagar, Varanasi, UP' },
        businessType: data.businessType || 'Individual Artisan',
        teamSize: data.teamSize || 1,
        monthlyProduction: data.monthlyProduction || 10,
        monthlyProductionUnit: data.monthlyProductionUnit || 'pcs',
        craftTypes: data.craftTypes || ['Handloom'],
        trustScore: 5.0,
        walletId: userUuid
      };
      setArtisanProfile(artProf);
      setWallets(prev => ({
        ...prev,
        [userUuid]: { ownerId: userUuid, balance: 0, reservedAmount: 0, transactions: [] }
      }));
    } else {
      const brProf: BrandProfile = {
        uid: userUuid,
        brandName: data.brandName || 'New Brand Ltd',
        contactPerson: data.contactPerson || newUser.name,
        categories: data.categories || ['Textiles'],
        craftInterests: data.craftInterests || [],
        businessType: data.businessType || 'Retail Store',
        websiteUrl: data.websiteUrl,
        inventorySyncEnabled: data.inventorySyncEnabled ?? true,
        walletId: userUuid
      };
      setBrandProfile(brProf);
      setWallets(prev => ({
        ...prev,
        [userUuid]: { 
          ownerId: userUuid, 
          balance: 1000, 
          reservedAmount: 0, 
          transactions: [
            { id: 'tx-welcome', type: 'credit', amount: 1000, description: 'Welcome Credits Activated', date: new Date().toISOString().split('T')[0] }
          ] 
        }
      }));
    }
    
    setCurrentView('dashboard');
  };

  const updateOnboardingData = (data: any) => {
    setOnboardingData((prev: any) => ({ ...prev, ...data }));
  };

  const addProduct = async (pData: Omit<Product, 'id' | 'ownerId' | 'sku' | 'status'>): Promise<{ success: boolean; error?: string }> => {
    let authUserId = currentUser?.uid;

    if (isSupabaseConfigured()) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          authUserId = user.id;
        } else {
          // If no active auth session, use fallback seeded profile UUID
          authUserId = currentUser?.role === 'BRAND' ? '11111111-1111-1111-1111-111111111111' : '00000000-0000-0000-0000-000000000000';
          console.warn("ShilpSetu: No active auth session. Using mock seed user ID for products sync:", authUserId);
        }
      } catch (err: any) {
        console.warn("Authentication check error, using fallback seed user ID:", err.message);
        authUserId = currentUser?.role === 'BRAND' ? '11111111-1111-1111-1111-111111111111' : '00000000-0000-0000-0000-000000000000';
      }
    }

    const finalUserId = authUserId || 'artisan-1';
    const sku = 'SKU-' + pData.craftType.substring(0, 3).toUpperCase() + '-' + Math.floor(Math.random() * 900 + 100);
    const newProduct: Product = {
      ...pData,
      id: 'p-' + (products.length + 1),
      ownerId: finalUserId,
      sku,
      status: pData.stockQty > 5 ? 'inStock' : (pData.stockQty > 0 ? 'lowStock' : 'outOfStock')
    };

    // Client update
    setProducts(prev => [newProduct, ...prev]);

    // Supabase DB Sync
    if (isSupabaseConfigured() && authUserId) {
      try {
        // 1. Check if the artisan profile exists in public.artisans table
        const { data: artisanExists } = await supabase
          .from('artisans')
          .select('id')
          .eq('id', authUserId)
          .maybeSingle();

        // 2. If it does not exist, automatically create one in public.users and public.artisans
        if (!artisanExists) {
          console.log("ShilpSetu: Auto-creating missing database profile for artisan UUID:", authUserId);
          
          const { data: { user: authUser } } = await supabase.auth.getUser();
          const fullName = authUser?.user_metadata?.full_name || currentUser?.name || 'Ramesh Kumar';
          const phone = authUser?.phone || currentUser?.phone || '+919876543210';
          const email = authUser?.email || currentUser?.email || 'artisan@shilpsetu.com';

          // Insert into users
          const { error: userError } = await supabase.from('users').upsert({
            id: authUserId,
            full_name: fullName,
            role: 'ARTISAN',
            phone: phone,
            email: email
          });
          if (userError) {
            return { success: false, error: "Failed to create user profile: " + userError.message };
          }

          // Insert into artisans
          const { error: artisanError } = await supabase.from('artisans').upsert({
            id: authUserId,
            id_type: 'Aadhaar',
            business_type: 'Individual',
            team_size: 1,
            monthly_capacity: 100,
            verified_status: true
          });
          if (artisanError) {
            return { success: false, error: "Failed to create artisan profile: " + artisanError.message };
          }
        }

        // 3. Perform the actual product insert safely
        const { error: productError } = await supabase.from('products').insert({
          artisan_id: authUserId,
          name: newProduct.name,
          description: newProduct.description,
          category: newProduct.category,
          craft_type: newProduct.craftType,
          price: newProduct.price,
          stock: newProduct.stockQty,
          images: newProduct.images
        });
        if (productError) {
          return { success: false, error: productError.message };
        }
      } catch (err: any) {
        return { success: false, error: "Database sync error: " + err.message };
      }
    }

    // Backend save
    try {
      await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
    } catch (e) {
      console.warn("Express endpoint offline, saved locally.");
    }

    addNotification(
      finalUserId,
      'system',
      `Product "${newProduct.name}" added successfully.`
    );

    return { success: true };
  };

  const updateProductStock = (id: string, qty: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const nextQty = Math.max(0, qty);
        return {
          ...p,
          stockQty: nextQty,
          status: nextQty > 5 ? 'inStock' : (nextQty > 0 ? 'lowStock' : 'outOfStock')
        };
      }
      return p;
    }));

    // Supabase DB Sync for Stock
    if (isSupabaseConfigured()) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(id)) {
        try {
          supabase.from('products')
            .update({ stock: Math.max(0, qty) })
            .eq('id', id)
            .then(({ error }) => {
              if (error) console.error("Supabase stock update failed:", error.message);
              else console.log("ShilpSetu: Stock updated in Supabase!");
            });
        } catch (err) {
          console.error("Supabase stock update exception:", err);
        }
      }
    }
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const nextQty = updatedFields.stockQty !== undefined ? Math.max(0, updatedFields.stockQty) : p.stockQty;
        return {
          ...p,
          ...updatedFields,
          stockQty: nextQty,
          status: nextQty > 5 ? 'inStock' : (nextQty > 0 ? 'lowStock' : 'outOfStock')
        };
      }
      return p;
    }));

    // Supabase DB Sync for Product Metadata Updates
    if (isSupabaseConfigured()) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(id)) {
        try {
          const updates: any = {};
          if (updatedFields.name !== undefined) updates.name = updatedFields.name;
          if (updatedFields.price !== undefined) updates.price = updatedFields.price;
          if (updatedFields.stockQty !== undefined) updates.stock = updatedFields.stockQty;
          if (updatedFields.description !== undefined) updates.description = updatedFields.description;
          if (updatedFields.category !== undefined) updates.category = updatedFields.category;
          if (updatedFields.craftType !== undefined) updates.craft_type = updatedFields.craftType;

          if (Object.keys(updates).length > 0) {
            supabase.from('products')
              .update(updates)
              .eq('id', id)
              .then(({ error }) => {
                if (error) console.error("Supabase product update failed:", error.message);
                else console.log("ShilpSetu: Product metadata updated in Supabase!");
              });
          }
        } catch (err) {
          console.error("Supabase product update exception:", err);
        }
      }
    }
  };

  const createRFQ = async (rfqData: Omit<RFQ, 'id' | 'brandId' | 'brandName' | 'quotes' | 'status'>) => {
    const newRfq: RFQ = {
      ...rfqData,
      id: 'rfq-' + (rfqs.length + 1),
      brandId: currentUser?.uid || 'brand-1',
      brandName: brandProfile?.brandName || 'FabIndia Boutique',
      status: 'open',
      quotes: [
        {
          artisanId: 'artisan-1',
          artisanName: 'Ramesh Kumar',
          artisanAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          artisanLocation: 'Varanasi, UP',
          artisanRating: 4.8,
          price: Math.floor(rfqData.budget / rfqData.qty * 0.95),
          days: 20,
          status: 'pending'
        },
        {
          artisanId: 'artisan-2',
          artisanName: 'Naresh Patel',
          artisanAvatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150',
          artisanLocation: 'Bhuj, Gujarat',
          artisanRating: 4.6,
          price: Math.floor(rfqData.budget / rfqData.qty * 0.92),
          days: 30,
          status: 'pending'
        }
      ]
    };

    setRfqs(prev => [newRfq, ...prev]);

    // Supabase DB Sync for RFQ Orders
    if (isSupabaseConfigured()) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const brandUuid = uuidRegex.test(newRfq.brandId) ? newRfq.brandId : '11111111-1111-1111-1111-111111111111';

      try {
        supabase.from('rfq_orders').insert({
          brand_id: brandUuid,
          title: newRfq.craftType + ' Sourcing RFQ',
          description: `RFQ for ${newRfq.qty} pcs in ${newRfq.category} category. Budget: ₹${newRfq.budget}. Delivery Deadline: ${newRfq.deliveryDate}.`,
          target_price: Number(newRfq.budget) / newRfq.qty,
          required_moq: newRfq.qty,
          deadline_date: newRfq.deliveryDate,
          status: 'published'
        }).then(({ error }) => {
          if (error) {
            console.error("Supabase RFQ sync failed:", error.message, error.details);
          } else {
            console.log("ShilpSetu: RFQ synchronized to Supabase!");
          }
        });
      } catch (err) {
        console.error("Supabase RFQ sync exception:", err);
      }
    }

    try {
      await fetch(`${API_BASE}/rfqs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRfq)
      });
    } catch (e) {
      console.warn("Express server offline, saved locally.");
    }
    
    addNotification('artisan-1', 'rfq', `New RFQ published by ${newRfq.brandName} for ${newRfq.qty} pcs of ${newRfq.craftType}.`);
  };

  const submitQuote = (rfqId: string, quote: Omit<RFQQuote, 'status'>) => {
    setRfqs(prev => prev.map(r => {
      if (r.id === rfqId) {
        return {
          ...r,
          quotes: [...r.quotes, { ...quote, status: 'pending' }]
        };
      }
      return r;
    }));

    // Supabase DB Sync for Quotes
    if (isSupabaseConfigured()) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const rfqUuid = uuidRegex.test(rfqId) ? rfqId : null;
      const artisanUuid = uuidRegex.test(quote.artisanId) ? quote.artisanId : '00000000-0000-0000-0000-000000000000';

      if (rfqUuid) {
        try {
          supabase.from('rfq_quotations').insert({
            rfq_id: rfqUuid,
            artisan_id: artisanUuid,
            quote_amount: quote.price,
            lead_time_days: quote.days,
            notes: 'Submitted via artisan wizard portal.',
            status: 'submitted'
          }).then(({ error }) => {
            if (error) {
              console.error("Supabase quote sync failed:", error.message, error.details);
            } else {
              console.log("ShilpSetu: Quote synchronized to Supabase!");
            }
          });
        } catch (err) {
          console.error("Supabase quote sync exception:", err);
        }
      }
    }
    
    const r = rfqs.find(x => x.id === rfqId);
    if (r) {
      addNotification(r.brandId, 'rfq', `Artisan ${quote.artisanName} submitted a quote of ₹${quote.price}/pc for your RFQ.`);
    }
  };

  const acceptQuote = async (rfqId: string, artisanId: string) => {
    let acceptedQuote: RFQQuote | undefined;
    let targetRfq: RFQ | undefined;

    setRfqs(prev => prev.map(r => {
      if (r.id === rfqId) {
        targetRfq = r;
        return {
          ...r,
          status: 'closed',
          quotes: r.quotes.map(q => {
            if (q.artisanId === artisanId) {
              acceptedQuote = q;
              return { ...q, status: 'accepted' };
            }
            return { ...q, status: 'declined' };
          })
        };
      }
      return r;
    }));

    if (targetRfq && acceptedQuote) {
      const orderAmount = acceptedQuote.price * targetRfq.qty;
      const orderId = 'ORD-RFQ-' + Math.floor(100000 + Math.random() * 900000);
      
      // Deduct buyer wallet
      const buyerId = targetRfq.brandId;
      setWallets(prev => {
        const wallet = prev[buyerId];
        if (!wallet) return prev;
        return {
          ...prev,
          [buyerId]: {
            ...wallet,
            balance: wallet.balance - orderAmount,
            reservedAmount: wallet.reservedAmount + orderAmount,
            transactions: [
              {
                id: 'tx-' + Date.now(),
                type: 'debit',
                amount: orderAmount,
                description: `Payment reserved for RFQ Order ${orderId}`,
                date: new Date().toISOString().split('T')[0]
              },
              ...wallet.transactions
            ]
          }
        };
      });

      const newOrder: Order = {
        id: orderId,
        buyerId,
        buyerName: targetRfq.brandName,
        sellerId: artisanId,
        sellerName: acceptedQuote.artisanName,
        sellerLocation: acceptedQuote.artisanLocation,
        items: [
          {
            productId: 'rfq-item',
            name: `${targetRfq.craftType} (${targetRfq.category})`,
            price: acceptedQuote.price,
            qty: targetRfq.qty,
            image: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=150'
          }
        ],
        qty: targetRfq.qty,
        amount: orderAmount,
        status: 'placed',
        statusHistory: [
          { status: 'placed', timestamp: new Date().toISOString(), note: 'RFQ quote accepted, order created' }
        ],
        deliveryDate: new Date(Date.now() + acceptedQuote.days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'RFQ',
        createdAt: new Date().toISOString()
      };

      setOrders(prev => [newOrder, ...prev]);

      // Supabase DB Sync for RFQ Orders
      if (isSupabaseConfigured()) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const buyerUuid = uuidRegex.test(buyerId) ? buyerId : '11111111-1111-1111-1111-111111111111';
        const sellerUuid = uuidRegex.test(artisanId) ? artisanId : '00000000-0000-0000-0000-000000000000';

        try {
          supabase.from('orders').insert({
            brand_id: buyerUuid,
            artisan_id: sellerUuid,
            order_type: 'rfq_bulk',
            status: 'Processing',
            total_amount: orderAmount,
            quantity: targetRfq.qty
          }).then(({ error }) => {
            if (error) {
              console.error("Supabase RFQ order sync failed:", error.message, error.details);
            } else {
              console.log("ShilpSetu: RFQ order synchronized to Supabase!");
            }
          });
        } catch (err) {
          console.error("Supabase order sync exception:", err);
        }
      }

      try {
        await fetch(`${API_BASE}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newOrder)
        });
      } catch (e) {
        console.warn("Express server offline, saved locally.");
      }

      addNotification(artisanId, 'order', `Your quote of ₹${acceptedQuote.price}/pc was ACCEPTED! Order ${orderId} created.`);
    }
  };

  const declineQuote = (rfqId: string, artisanId: string) => {
    setRfqs(prev => prev.map(r => {
      if (r.id === rfqId) {
        return {
          ...r,
          quotes: r.quotes.map(q => {
            if (q.artisanId === artisanId) {
              return { ...q, status: 'declined' };
            }
            return q;
          })
        };
      }
      return r;
    }));
    addNotification(artisanId, 'rfq', `Your quote for RFQ ${rfqId} has been declined.`);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const history = [...o.statusHistory, { status, timestamp: new Date().toISOString() }];
        
        if (status === 'delivered') {
          const sellerId = o.sellerId;
          const buyerId = o.buyerId;
          
          setWallets(wal => {
            const artisanWallet = wal[sellerId] || { ownerId: sellerId, balance: 0, reservedAmount: 0, transactions: [] };
            const brandWallet = wal[buyerId] || { ownerId: buyerId, balance: 0, reservedAmount: 0, transactions: [] };
            
            return {
              ...wal,
              [sellerId]: {
                ...artisanWallet,
                balance: artisanWallet.balance + o.amount,
                transactions: [
                  {
                    id: 'tx-release-' + Date.now(),
                    type: 'credit',
                    amount: o.amount,
                    description: `Payout released for completed Order ${orderId}`,
                    date: new Date().toISOString().split('T')[0]
                  },
                  ...artisanWallet.transactions
                ]
              },
              [buyerId]: {
                ...brandWallet,
                reservedAmount: Math.max(0, brandWallet.reservedAmount - o.amount),
              }
            };
          });
          
          addNotification(sellerId, 'wallet', `Payout of ₹${o.amount} released for Order ${orderId}!`);
          addNotification(buyerId, 'order', `Order ${orderId} delivered! Funds released to artisan.`);
        } else {
          addNotification(o.buyerId, 'order', `Order ${orderId} status updated to: ${status.replace(/_/g, ' ').toUpperCase()}`);
        }

        // Supabase DB Sync for Order Status updates
        if (isSupabaseConfigured()) {
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          if (uuidRegex.test(orderId)) {
            let mappedStatus = 'Processing';
            if (status === 'placed') mappedStatus = 'New Orders';
            else if (status === 'processing') mappedStatus = 'Processing';
            else if (status === 'shipped_to_hub') mappedStatus = 'Ready to Ship';
            else mappedStatus = 'Shipped to Hub';

            supabase.from('orders')
              .update({ status: mappedStatus })
              .eq('id', orderId)
              .then(({ error }) => {
                if (error) {
                  console.error("Supabase order status sync failed:", error.message);
                } else {
                  console.log("ShilpSetu: Order status updated in Supabase!");
                }
              });
          }
        }

        return {
          ...o,
          status,
          statusHistory: history
        };
      }
      return o;
    }));
  };

  const rechargeWallet = (uid: string, amount: number) => {
    setWallets(prev => {
      const wallet = prev[uid] || { ownerId: uid, balance: 0, reservedAmount: 0, transactions: [] };
      return {
        ...prev,
        [uid]: {
          ...wallet,
          balance: wallet.balance + amount,
          transactions: [
            {
              id: 'tx-rcg-' + Date.now(),
              type: 'credit',
              amount,
              description: 'Wallet recharged via Razorpay',
              date: new Date().toISOString().split('T')[0]
            },
            ...wallet.transactions
          ]
        }
      };
    });

    // Supabase DB Sync for Wallet Balances
    if (isSupabaseConfigured()) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const userUuid = uuidRegex.test(uid) ? uid : (currentUser?.role === 'BRAND' ? '11111111-1111-1111-1111-111111111111' : '00000000-0000-0000-0000-000000000000');

      try {
        supabase.from('wallet_balances')
          .select('balance')
          .eq('user_id', userUuid)
          .maybeSingle()
          .then(({ data }) => {
            const currentBal = data ? Number(data.balance) : 0.0;
            const nextBal = currentBal + amount;
            
            supabase.from('wallet_balances').upsert({
              user_id: userUuid,
              balance: nextBal,
              updated_at: new Date().toISOString()
            }).then(({ error }) => {
              if (error) {
                console.error("Supabase wallet sync failed:", error.message, error.details);
              } else {
                console.log("ShilpSetu: Wallet balance updated in Supabase!");
              }
            });
          });
      } catch (err) {
        console.error("Supabase wallet update exception:", err);
      }
    }

    addNotification(uid, 'wallet', `₹${amount} recharged successfully via Razorpay.`);
  };

  const syncProductToBrand = (productId: string, brandId: string) => {
    addNotification(brandId, 'system', `Product synced successfully to your shop catalog.`);
  };

  const addNotification = (uid: string, type: Notification['type'], message: string) => {
    const newNotif: Notification = {
      id: 'notif-' + Date.now() + Math.random().toString(36).substr(2, 4),
      uid,
      type,
      message,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const placeDirectOrder = (order: Order) => {
    setWallets(prev => {
      const wallet = prev[order.buyerId] || { ownerId: order.buyerId, balance: 0, reservedAmount: 0, transactions: [] };
      return {
        ...prev,
        [order.buyerId]: {
          ...wallet,
          balance: Math.max(0, wallet.balance - order.amount),
          reservedAmount: wallet.reservedAmount + order.amount,
          transactions: [
            {
              id: 'tx-buy-' + Date.now(),
              type: 'debit',
              amount: order.amount,
              description: `Direct Sourcing Purchase: ${order.items[0].name}`,
              date: new Date().toISOString().split('T')[0]
            },
            ...wallet.transactions
          ]
        }
      };
    });

    setOrders(prev => [order, ...prev]);
    
    // Supabase DB Sync for Direct Orders
    if (isSupabaseConfigured()) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const buyerUuid = uuidRegex.test(order.buyerId) ? order.buyerId : '11111111-1111-1111-1111-111111111111';
      const sellerUuid = uuidRegex.test(order.sellerId || '') ? order.sellerId : '00000000-0000-0000-0000-000000000000';

      try {
        supabase.from('orders').insert({
          brand_id: buyerUuid,
          artisan_id: sellerUuid,
          order_type: 'direct_retail',
          status: 'Processing',
          total_amount: order.amount,
          quantity: order.qty
        }).then(({ error }) => {
          if (error) {
            console.error("Supabase direct order sync failed:", error.message, error.details);
          } else {
            console.log("ShilpSetu: Direct order synchronized to Supabase!");
          }
        });
      } catch (err) {
        console.error("Supabase order sync exception:", err);
      }
    }

    addNotification(order.buyerId, 'order', `Order ${order.id} placed successfully using wallet balance.`);
    if (order.sellerId) {
      addNotification(order.sellerId, 'order', `New direct sourcing order ${order.id} received from buyer.`);
    }
  };

  // AI Simulated Service Endpoints - calls Express endpoints with fallback
  const triggerAIAutofill = async (photoUrl: string): Promise<any> => {
    try {
      const res = await fetch(`${API_BASE}/ai/autofill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoUrl })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Express server unavailable. Using browser AI simulation fallback.");
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
    const seedResponses = [
      {
        name: 'Handcrafted Blue Pottery Vase',
        category: 'Pottery',
        craftType: 'Blue Pottery',
        material: 'Clay / Glazed Quartz',
        price: 1850,
        weight: 1200,
        description: 'Stunning cobalt blue ceramic pottery vase featuring floral motifs. Hand-painted by local artisans in Jaipur using glazed quartz clay.'
      },
      {
        name: 'Handloom Cotton Ikat Kurti',
        category: 'Apparel',
        craftType: 'Ikat Dyeing',
        material: '100% Pure Cotton',
        price: 2200,
        weight: 350,
        description: 'Premium handloom cotton tunic with authentic double-ikat weave patterns. Naturally dyed, breathable fabric crafted in Odisha.'
      }
    ];
    return seedResponses[Math.floor(Math.random() * seedResponses.length)];
  };

  const triggerAIImageStudio = async (productId: string, style: string, metadata?: any): Promise<string> => {
    try {
      const res = await fetch(`${API_BASE}/ai/image-studio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, style, metadata })
      });
      if (res.ok) {
        const data = await res.json();
        return data.url;
      }
    } catch (e) {
      console.warn("Express server unavailable. Using browser AI simulation fallback.");
    }

    await new Promise(resolve => setTimeout(resolve, 2500));
    const styledImages: Record<string, string> = {
      'White Background': 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80',
      'Lifestyle Shot': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
      'Model Shot': 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
      'Catalog': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
      'Luxury Style': 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80'
    };

    const promptLower = style.toLowerCase();
    if (promptLower.includes('white') || promptLower.includes('background') || promptLower.includes('#ffffff')) {
      return styledImages['White Background'];
    } else if (promptLower.includes('model') || promptLower.includes('wearing')) {
      return styledImages['Model Shot'];
    } else if (promptLower.includes('lifestyle') || promptLower.includes('courtyard')) {
      return styledImages['Lifestyle Shot'];
    } else if (promptLower.includes('catalog') || promptLower.includes('lookbook')) {
      return styledImages['Catalog'];
    } else if (promptLower.includes('luxury') || promptLower.includes('designer') || promptLower.includes('marble')) {
      return styledImages['Luxury Style'];
    }

    return styledImages[style] || styledImages['Lifestyle Shot'];
  };

  const triggerAIScanMatch = async (barcodeOrPhoto: string): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      confidence: 98,
      matched: true,
      productId: 'p-1',
      name: 'Banarasi Silk Saree',
      category: 'Textiles',
      images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=150']
    };
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      activeRole,
      artisanProfile,
      brandProfile,
      setActiveRole,
      login,
      loginWithGoogle,
      loginWithEmail,
      signUpWithEmail,
      logout,
      registerUser,
      
      onboardingStep,
      setOnboardingStep,
      onboardingData,
      updateOnboardingData,
      
      products,
      rfqs,
      orders,
      wallets,
      notifications,
      
      addProduct,
      updateProductStock,
      updateProduct,
      createRFQ,
      submitQuote,
      acceptQuote,
      declineQuote,
      updateOrderStatus,
      rechargeWallet,
      syncProductToBrand,
      addNotification,
      placeDirectOrder,
      portfolioPosts,
      addPortfolioPost,
      deletePortfolioPost,
      aiAutofillData,
      setAiAutofillData,
      
      currentView,
      setCurrentView,
      
      triggerAIAutofill,
      triggerAIImageStudio,
      triggerAIScanMatch
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
