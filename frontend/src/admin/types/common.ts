/**
 * Common Type Definitions for BuyBright Admin.
 */

export interface StatItem {
  id: string;
  label: string;
  value: string;
  numericValue: number;
  change: string;
  isPositive: boolean;
  icon: string;
  color: string;
  timeframe: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export interface SelectOption {
  value: string;
  label: string;
}

export type StatusBadgeVariant =
  | 'Placed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'In Stock'
  | 'Low Stock'
  | 'Out of Stock'
  | 'Verified'
  | 'Pending Verification'
  | 'Suspended'
  | 'Active'
  | 'Inactive'
  | 'Paid'
  | 'Pending'
  | 'Refunded';
