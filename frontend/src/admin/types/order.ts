/**
 * BuyBright Admin — Order Management Type Definitions.
 * Comprehensive order workflow data structure supporting multi-tier fulfillment statuses and split payments.
 */

export type OrderStatusType =
  | 'Placed'
  | 'In Process'
  | 'Ready to Pick'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export interface OrderItem {
  name: string;
  sku?: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  doctorName?: string;
  clinicName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  city: string;
  state: string;
  pincode: string;
  orderDateTime: string;
  date?: string; // backwards compatibility
  expectedDate: string;
  itemsCount: number;
  totalAmount: number; // Gross Order Total
  discountAmount: number; // Applied discount
  cashbackPoints: number; // Bright Points earned as cashback
  orderPayAmount: number; // Final payable amount after discounts
  paymentMethod: string; // Razorpay, UPI, Presto Wallet + Online, Cash on Delivery, etc.
  walletAmount: number; // Presto Wallet deduction
  onlineAmount: number; // Online gateway payment (UPI/Card/NetBanking)
  codAmount: number; // Cash on Delivery collected upon handover
  paymentStatus: 'Paid' | 'Pending' | 'Refunded' | 'COD Pending' | 'Partially Paid';
  orderStatus: OrderStatusType;
  awbNumber?: string;
  courier?: string;
  items: OrderItem[];
  notes?: string;
}
