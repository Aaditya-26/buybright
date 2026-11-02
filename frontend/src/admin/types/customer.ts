/**
 * BuyBright Admin — Customer & Referral Management Types.
 * Fields: Sr.No. | Customers ID | Referred By | Referral Email ID | Bright Points | Referral Code | Name | Email ID | Phone No. | Address | Registered Date
 */

export interface AdminCustomer {
  id: string;
  customerId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  referredBy: string;
  referralEmail: string;
  brightPoints: number;
  referralCode: string;
  registeredDate: string;
  clinicName?: string;
  status: 'Active' | 'Inactive';
  totalOrders: number;
  totalSpent: number;
  avatar?: string;
}
