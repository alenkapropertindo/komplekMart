export enum ScreenType {
  LOGIN = 'login',
  HOME = 'home',
  PRODUCT_DETAIL = 'product-detail',
  CART = 'cart',
  CHECKOUT = 'checkout',
  RECEIPT = 'receipt',
  ACCOUNT = 'account',
  ADMIN = 'admin'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  unit: string;
  rating: string;
  description: string;
  left?: number;
  iconName?: string;
  isFlashSale?: boolean;
  originalPrice?: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  items: {
    productName: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'Diproses' | 'Diantar' | 'Selesai';
  statusDescription: string;
  date: string;
  address: string;
  phone: string;
  paymentMethod: string;
  time?: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  address: string;
  avatar: string;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'admin';
  text: string;
  timestamp: string;
  image?: string;
  fileName?: string;
}

export interface Resident {
  id: string;
  name: string;
  block: string;
  phone: string;
  totalSpent: number;
  transactions: number;
  status: string;
}
