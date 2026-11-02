/**
 * User & Role Type Definitions for BuyBright Admin Portal.
 * Clean TypeScript interfaces for RBAC and Administrative User Management.
 */

export interface RoleItem {
  id: string;
  srNo: number;
  roleName: string;
  description?: string;
  permissions?: string[];
  userCount?: number;
  createdAt?: string;
  status?: 'Active' | 'Inactive';
}

export interface SystemUser {
  id: string;
  srNo: number;
  userName: string;
  email: string;
  contactNo: string;
  role: string;
  date: string;
  status: 'Active' | 'Inactive' | 'Pending';
  password: string;
  avatar?: string;
  aadhaarNumber?: string;
  panNumber?: string;
  profileImage?: string;
  address?: string;
}

export interface AdminUser {
  id: string;
  doctorName: string;
  clinicName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  dciRegistrationNo: string;
  gstin?: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  brightPointsBalance: number;
  joinedDate: string;
  status: 'Verified' | 'Pending Verification' | 'Suspended';
}
