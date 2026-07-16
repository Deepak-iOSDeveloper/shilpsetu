export type UserRole = 'ARTISAN' | 'BRAND';

export interface User {
  uid: string;
  role: UserRole;
  name: string;
  phone: string;
  email?: string;
  verified: boolean;
  createdAt: string;
}

export interface ArtisanProfile {
  uid: string;
  idType: string;
  idStatus: 'unverified' | 'pending' | 'verified';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  businessType: string;
  teamSize: number;
  monthlyProduction: number;
  monthlyProductionUnit: string;
  craftTypes: string[];
  trustScore: number;
  walletId: string;
}

export interface BrandProfile {
  uid: string;
  brandName: string;
  contactPerson: string;
  categories: string[];
  craftInterests: string[];
  businessType: string;
  websiteUrl?: string;
  inventorySyncEnabled: boolean;
  walletId: string;
}

export interface Product {
  id: string;
  ownerId: string;
  name: string;
  category: string;
  craftType: string;
  material: string;
  price: number;
  stockQty: number;
  weight: number;
  description: string;
  images: string[];
  sku: string;
  status: 'inStock' | 'lowStock' | 'outOfStock';
  aiGenerated: boolean;
}

export interface ProductDraft {
  id: string;
  ownerId: string;
  name: string;
  category: string;
  craftType: string;
  material: string;
  price: number;
  stockQty: number;
  weight: number;
  description: string;
  images: string[];
  savedAt: string;
}

export interface InventoryItem {
  sku: string;
  qty: number;
  syncedToBrandIds: string[];
  lastSynced: string;
}

export interface RFQQuote {
  artisanId: string;
  artisanName: string;
  artisanAvatar: string;
  artisanLocation: string;
  artisanRating: number;
  price: number;
  days: number;
  status: 'pending' | 'accepted' | 'declined';
}

export interface RFQ {
  id: string;
  brandId: string;
  brandName: string;
  category: string;
  craftType: string;
  qty: number;
  budget: number;
  deliveryDate: string;
  deadlineDate?: string;
  status: 'open' | 'closed';
  techPackUrl?: string;
  quotes: RFQQuote[];
}

export type OrderStatus = 
  | 'placed' 
  | 'processing' 
  | 'shipped_to_hub' 
  | 'qc_branding' 
  | 'dispatched' 
  | 'delivered';

export interface OrderHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  sellerLocation: string;
  items: OrderItem[];
  qty: number;
  amount: number;
  status: OrderStatus;
  statusHistory: OrderHistoryItem[];
  deliveryDate: string;
  type: 'customer' | 'RFQ';
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
}

export interface Wallet {
  ownerId: string;
  balance: number;
  reservedAmount: number;
  transactions: Transaction[];
}

export interface Notification {
  id: string;
  uid: string;
  type: 'order' | 'rfq' | 'wallet' | 'system';
  message: string;
  read: boolean;
  createdAt: string;
}
