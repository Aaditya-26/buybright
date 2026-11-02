/**
 * BuyBright Admin Wishlist Module Types.
 */

export type WishlistConversionStatus = 'In Wishlist' | 'Moved to Cart' | 'Purchased';
export type WishlistStockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';
export type WishlistNotificationStatus = 'Offer Sent' | 'Restock Alert Sent' | 'None';

export interface AdminWishlistItem {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAvatar?: string;
  clinicName?: string;
  productId: string;
  productName: string;
  productSku: string;
  productCategory: string;
  productPrice: number;
  productMrp: number;
  productImage: string;
  stockStatus: WishlistStockStatus;
  stockQuantity: number;
  dateAdded: string;
  status: WishlistConversionStatus;
  notifiedStatus: WishlistNotificationStatus;
  offerDetails?: {
    discountPercent?: number;
    couponCode?: string;
    sentDate?: string;
    customNote?: string;
  };
  notes?: string;
}

export interface WishlistStats {
  totalItems: number;
  uniqueCustomers: number;
  totalValue: number;
  inStockCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  inWishlistCount: number;
  movedToCartCount: number;
  purchasedCount: number;
  offersSentCount: number;
  categoryCounts: Record<string, number>;
}
