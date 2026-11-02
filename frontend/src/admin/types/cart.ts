/**
 * BuyBright Admin — Cart Management Type Definitions.
 * Supports Cart List, Cart Analytics Funnel, Outreach & Conversion Tracking.
 */

export type CartStatus = 'Active' | 'Abandoned' | 'Converted' | 'Expired';

export type CustomerType =
  | 'Dentist / Clinic Owner'
  | 'Dental Hospital / Chain'
  | 'Dental Student / Resident'
  | 'Wholesale / Dealer';

export type CartStockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  productImage: string;
  variantPack: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  discountAmount: number;
  gstRate: number; // e.g. 5, 12, 18
  gstAmount: number;
  itemTotal: number;
  stockStatus: CartStockStatus;
  stockQuantity: number;
}

export interface AdminCart {
  id: string; // e.g. "CRT-80101"
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAvatar?: string;
  customerType: CustomerType;
  clinicName: string;
  city: string;
  state?: string;
  totalItems: number; // number of unique lines
  totalQuantity: number; // total units
  cartValue: number; // subtotal before coupon
  couponCode?: string;
  couponDiscount: number;
  gstTotal: number;
  shippingFee: number;
  finalTotal: number;
  cartStatus: CartStatus;
  lastUpdated: string;
  createdDate: string;
  items: CartItem[];
  convertedOrderId?: string; // e.g. "ORD-2026-9041"
  abandonedStep?: 'Cart' | 'Checkout' | 'Payment';
  lastOutreachSent?: string;
  notes?: string;
}

export interface CartAnalyticsStats {
  totalCarts: number;
  activeCarts: number;
  abandonedCarts: number;
  convertedCarts: number;
  expiredCarts: number;
  averageCartValue: number;
  totalPotentialRevenue: number;
  totalRecoveredRevenue: number;
  conversionRate: number;
  abandonmentRate: number;
}

export interface CartFunnelStage {
  stage: 'Cart Created' | 'Checkout Started' | 'Order Placed';
  count: number;
  percentage: number;
  dropOffCount: number;
  dropOffPercentage: number;
  description: string;
  color: string;
  icon: string;
}

export interface CartTrendPoint {
  date: string;
  label: string;
  total: number;
  active: number;
  abandoned: number;
  converted: number;
  avgValue: number;
}
