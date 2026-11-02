/**
 * BuyBright TypeScript Type Definitions.
 * Comprehensive models for Products, Categories, Showcase Cards, Cart, and Admin Stats.
 */

export interface Category {
  id: string;
  title: string;
  count: string;
  item_num: string;
  image: string;
  accent_color: string;
  slug: string;
}

export interface Product {
  id: string;
  brand: string;
  name: string;
  category: 'materials' | 'instruments' | 'equipment' | 'endodontics' | 'consumables' | 'orthodontics' | string;
  price: number;
  old_price?: number;
  discount?: string;
  is_bestseller: boolean;
  rating: number;
  reviews_count: number;
  image: string;
  is_spotlight?: boolean;
  size?: string;
  volume_ml?: string;
  in_stock?: boolean;
  expiry_date?: string;
}

export interface ShowcaseItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  image: string;
  badgeIcon?: string;
  stats?: { label: string; value: string }[];
  ctaText?: string;
  ctaLink?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DashboardStats {
  website_status: string;
  active_page: string;
  total_categories: number;
  total_products: number;
  total_orders: number;
  total_clinics: number;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  count?: number;
  data: T;
  message?: string;
}

export type SortOption =
  | 'featured'
  | 'price_asc'
  | 'price_desc'
  | 'rating_desc'
  | 'discount_desc'
  | 'newest';

export type ViewMode = 'grid' | 'list';

export type AvailabilityOption = 'all' | 'in_stock' | 'out_of_stock';

export interface ShopFilterState {
  selectedCategories: string[];
  selectedBrands: string[];
  selectedSizes: string[];
  selectedVolumes: string[];
  priceRange: [number, number];
  minRating: number;
  minDiscount: number;
  onlyBestsellers: boolean;
  availability: AvailabilityOption;
  searchQuery: string;
  sortBy: SortOption;
  page: number;
  itemsPerPage: number;
  viewMode: ViewMode;
}

export type UserRole = 'dentist' | 'clinic' | 'hospital' | 'distributor' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  clinicName?: string;
  dciNumber?: string;
  gstin?: string;
  city?: string;
  state?: string;
  avatar?: string;
  isVerified?: boolean;
}

export interface LoginCredentials {
  identifier: string; // email or phone
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: UserRole;
  clinicName?: string;
  dciNumber?: string;
  gstin?: string;
  city?: string;
  agreeToTerms: boolean;
  whatsappUpdates?: boolean;
}

export * from './wishlist';




