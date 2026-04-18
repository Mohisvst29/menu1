export interface ThemeColors {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  cardBackgroundColor: string;
  buttonColor: string;
  headerBackgroundColor: string;
  footerBackgroundColor: string;
}

export interface SiteConfig {
  businessName: string;
  description: string;
  logo: string;
  logoSize?: number; // Size percentage from 1 to 150
  fontFamily?: string; // Font type choice
  coverImage: string;
  coverImages?: string[];
  coverVideo?: string;
  whatsappNumber: string;
  address: string;
  workingHours: string;
  phone: string;
  instagram: string;
  twitter: string;
  facebook: string;
  snapchat: string;
  tiktok: string;
  youtube: string;
  linkedin: string;
  telegram: string;
  backupEmail?: string;
  googleDriveKeys?: {
    clientId: string;
    clientSecret: string;
  };
  themeMode?: 'light' | 'dark' | 'system';
  offersTitle?: string;
  theme: ThemeColors;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  order: number;
}

export interface Item {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  price: string;
  image: string;
  extraInfoLabel: string;
  extraInfoValue: string;
  badge: 'new' | 'popular' | 'offer' | '';
  isAvailable: boolean;
  isPopular: boolean;
}

export interface ItemsData {
  categories: Category[];
  items: Item[];
}

export interface AdminConfig {
  email: string;
  password: string;
}

export type Language = 'ar' | 'en' | 'ur' | 'hi' | 'fr';

export interface TranslationCache {
  [key: string]: {
    [lang: string]: string;
  };
}

export interface OrderItem {
  itemId: string;
  title: string;
  price: string;
  quantity: number;
}

export interface Order {
  id: string; // e.g. ORD-1023
  date: string; // ISO String
  customer: {
    name: string;
    phone: string;
    address: string;
    notes: string;
    type?: 'dineIn' | 'takeaway';
    tableNum?: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
}

export interface OfferBanner {
  id: string;
  title: string;
  description: string;
  image: string;
  linkUrl: string;
  isActive: boolean;
}
