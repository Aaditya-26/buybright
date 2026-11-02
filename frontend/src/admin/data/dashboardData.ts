/**
 * Dashboard Mock Data & Metrics for BuyBright Admin.
 */

import type { StatItem } from '../types/common';

export type DashboardTimeframe = '30days' | '1month' | '3month';

export const timeframeStats: Record<DashboardTimeframe, StatItem[]> = {
  '30days': [
    {
      id: 'stat-sales',
      label: 'Total Sales',
      value: 'Rs. 1,645,508.61',
      numericValue: 1645508.61,
      change: '+18.4%',
      isPositive: true,
      icon: 'fa-solid fa-wallet',
      color: '#0d9488',
      timeframe: 'vs last 30 days',
    },
    {
      id: 'stat-orders',
      label: 'Total Order',
      value: '344',
      numericValue: 344,
      change: '+12.6%',
      isPositive: true,
      icon: 'fa-solid fa-cart-shopping',
      color: '#3b82f6',
      timeframe: 'vs last 30 days',
    },
    {
      id: 'stat-products',
      label: 'Total Products',
      value: '578',
      numericValue: 578,
      change: '+24 new',
      isPositive: true,
      icon: 'fa-solid fa-teeth',
      color: '#8b5cf6',
      timeframe: 'active SKUs',
    },
    {
      id: 'stat-customers',
      label: 'Total Customers',
      value: '350',
      numericValue: 350,
      change: '+8.2%',
      isPositive: true,
      icon: 'fa-solid fa-users',
      color: '#f59e0b',
      timeframe: 'verified clinics',
    },
  ],
  '1month': [
    {
      id: 'stat-sales',
      label: 'Total Sales',
      value: 'Rs. 2,180,450.00',
      numericValue: 2180450.0,
      change: '+22.1%',
      isPositive: true,
      icon: 'fa-solid fa-wallet',
      color: '#0d9488',
      timeframe: 'this calendar month',
    },
    {
      id: 'stat-orders',
      label: 'Total Order',
      value: '462',
      numericValue: 462,
      change: '+16.4%',
      isPositive: true,
      icon: 'fa-solid fa-cart-shopping',
      color: '#3b82f6',
      timeframe: 'this calendar month',
    },
    {
      id: 'stat-products',
      label: 'Total Products',
      value: '578',
      numericValue: 578,
      change: '+18 new',
      isPositive: true,
      icon: 'fa-solid fa-teeth',
      color: '#8b5cf6',
      timeframe: 'active SKUs',
    },
    {
      id: 'stat-customers',
      label: 'Total Customers',
      value: '395',
      numericValue: 395,
      change: '+11.5%',
      isPositive: true,
      icon: 'fa-solid fa-users',
      color: '#f59e0b',
      timeframe: 'verified clinics',
    },
  ],
  '3month': [
    {
      id: 'stat-sales',
      label: 'Total Sales',
      value: 'Rs. 5,840,920.00',
      numericValue: 5840920.0,
      change: '+34.8%',
      isPositive: true,
      icon: 'fa-solid fa-wallet',
      color: '#0d9488',
      timeframe: 'quarterly growth',
    },
    {
      id: 'stat-orders',
      label: 'Total Order',
      value: '1,280',
      numericValue: 1280,
      change: '+28.2%',
      isPositive: true,
      icon: 'fa-solid fa-cart-shopping',
      color: '#3b82f6',
      timeframe: 'quarterly volume',
    },
    {
      id: 'stat-products',
      label: 'Total Products',
      value: '578',
      numericValue: 578,
      change: '+56 new',
      isPositive: true,
      icon: 'fa-solid fa-teeth',
      color: '#8b5cf6',
      timeframe: 'active SKUs',
    },
    {
      id: 'stat-customers',
      label: 'Total Customers',
      value: '480',
      numericValue: 480,
      change: '+24.0%',
      isPositive: true,
      icon: 'fa-solid fa-users',
      color: '#f59e0b',
      timeframe: 'verified clinics',
    },
  ],
};

export const dashboardStats: StatItem[] = timeframeStats['30days'];

export interface MonthlyTrendItem {
  month: string;
  amount: number;
  displayAmount: string;
  percentage: number;
}

export interface YearRevenueRecord {
  thisMonth: string;
  growthPercent: string;
  growthNote: string;
  peakMonth: string;
  monthlyTrends: MonthlyTrendItem[];
}

export const yearlyRevenueData: Record<string, YearRevenueRecord> = {
  '2026': {
    thisMonth: 'Rs. 415,974.80',
    growthPercent: '80%',
    growthNote: '80% more earnings than last month.',
    peakMonth: 'September (Rs. 415,974.80)',
    monthlyTrends: [
      { month: 'Jan', amount: 145000, displayAmount: 'Rs. 145k', percentage: 35 },
      { month: 'Feb', amount: 182000, displayAmount: 'Rs. 182k', percentage: 44 },
      { month: 'Mar', amount: 198000, displayAmount: 'Rs. 198k', percentage: 48 },
      { month: 'Apr', amount: 215000, displayAmount: 'Rs. 215k', percentage: 52 },
      { month: 'May', amount: 260000, displayAmount: 'Rs. 260k', percentage: 63 },
      { month: 'Jun', amount: 310000, displayAmount: 'Rs. 310k', percentage: 75 },
      { month: 'Jul', amount: 355000, displayAmount: 'Rs. 355k', percentage: 85 },
      { month: 'Aug', amount: 231000, displayAmount: 'Rs. 231k', percentage: 56 },
      { month: 'Sep', amount: 415974.8, displayAmount: 'Rs. 415.9k', percentage: 100 },
      { month: 'Oct', amount: 380000, displayAmount: 'Rs. 380k', percentage: 91 },
      { month: 'Nov', amount: 395000, displayAmount: 'Rs. 395k', percentage: 95 },
      { month: 'Dec', amount: 410000, displayAmount: 'Rs. 410k', percentage: 98 },
    ],
  },
  '2025': {
    thisMonth: 'Rs. 230,500.00',
    growthPercent: '45%',
    growthNote: '45% more earnings than previous year.',
    peakMonth: 'December (Rs. 310,000.00)',
    monthlyTrends: [
      { month: 'Jan', amount: 95000, displayAmount: 'Rs. 95k', percentage: 30 },
      { month: 'Feb', amount: 110000, displayAmount: 'Rs. 110k', percentage: 35 },
      { month: 'Mar', amount: 125000, displayAmount: 'Rs. 125k', percentage: 40 },
      { month: 'Apr', amount: 140000, displayAmount: 'Rs. 140k', percentage: 45 },
      { month: 'May', amount: 155000, displayAmount: 'Rs. 155k', percentage: 50 },
      { month: 'Jun', amount: 170000, displayAmount: 'Rs. 170k', percentage: 55 },
      { month: 'Jul', amount: 190000, displayAmount: 'Rs. 190k', percentage: 61 },
      { month: 'Aug', amount: 205000, displayAmount: 'Rs. 205k', percentage: 66 },
      { month: 'Sep', amount: 230500, displayAmount: 'Rs. 230.5k', percentage: 74 },
      { month: 'Oct', amount: 245000, displayAmount: 'Rs. 245k', percentage: 79 },
      { month: 'Nov', amount: 270000, displayAmount: 'Rs. 270k', percentage: 87 },
      { month: 'Dec', amount: 310000, displayAmount: 'Rs. 310k', percentage: 100 },
    ],
  },
  '2024': {
    thisMonth: 'Rs. 165,000.00',
    growthPercent: '32%',
    growthNote: '32% annual expansion trajectory.',
    peakMonth: 'December (Rs. 210,000.00)',
    monthlyTrends: [
      { month: 'Jan', amount: 65000, displayAmount: 'Rs. 65k', percentage: 31 },
      { month: 'Feb', amount: 72000, displayAmount: 'Rs. 72k', percentage: 34 },
      { month: 'Mar', amount: 84000, displayAmount: 'Rs. 84k', percentage: 40 },
      { month: 'Apr', amount: 96000, displayAmount: 'Rs. 96k', percentage: 46 },
      { month: 'May', amount: 110000, displayAmount: 'Rs. 110k', percentage: 52 },
      { month: 'Jun', amount: 125000, displayAmount: 'Rs. 125k', percentage: 60 },
      { month: 'Jul', amount: 135000, displayAmount: 'Rs. 135k', percentage: 64 },
      { month: 'Aug', amount: 148000, displayAmount: 'Rs. 148k', percentage: 70 },
      { month: 'Sep', amount: 165000, displayAmount: 'Rs. 165k', percentage: 79 },
      { month: 'Oct', amount: 175000, displayAmount: 'Rs. 175k', percentage: 83 },
      { month: 'Nov', amount: 190000, displayAmount: 'Rs. 190k', percentage: 90 },
      { month: 'Dec', amount: 210000, displayAmount: 'Rs. 210k', percentage: 100 },
    ],
  },
};

export const revenueEarningData = {
  thisMonth: 'Rs. 415,974.80',
  growthPercent: '80%',
  growthNote: '80% more earnings than last month.',
  orderFulfillment: {
    totalOrders: 344,
    delivered: {
      label: 'Delivered',
      count: 248,
      percentage: 72,
      color: '#10b981',
      bgLight: '#ecfdf5',
      icon: 'fa-solid fa-circle-check',
    },
    processing: {
      label: 'Processing',
      count: 76,
      percentage: 22,
      color: '#3b82f6',
      bgLight: '#eff6ff',
      icon: 'fa-solid fa-clock',
    },
    return: {
      label: 'Return',
      count: 20,
      percentage: 6,
      color: '#ef4444',
      bgLight: '#fef2f2',
      icon: 'fa-solid fa-arrow-rotate-left',
    },
  },
};

export const salesTrendsData = [
  { month: 'Apr', revenue: 1120000, orders: 840 },
  { month: 'May', revenue: 1280000, orders: 960 },
  { month: 'Jun', revenue: 1420000, orders: 1080 },
  { month: 'Jul', revenue: 1590000, orders: 1210 },
  { month: 'Aug', revenue: 1710000, orders: 1340 },
  { month: 'Sep', revenue: 1845820, orders: 1428 },
];

export const platformHealthMetrics = {
  databaseUptime: '99.98%',
  razorpayStatus: 'Active & Verified',
  courierApiStatus: 'BlueDart Express Synced',
  activeAdminSessions: 1,
};
