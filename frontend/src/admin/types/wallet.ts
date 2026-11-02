/**
 * BuyBright Admin — Customer Wallet & Ledger Types.
 */

export interface WalletTransaction {
  id: string;
  dateTime: string;
  orderNo: string;
  description: string;
  type: 'Credit' | 'Debit';
  amount: number;
  balance: number;
}

export interface AdminCustomerWallet {
  id: string;
  customerId: string;
  customerName: string;
  clinicName?: string;
  email: string;
  phone: string;
  walletBalance: number;
  lastUpdate: string;
  totalCredited: number;
  totalDebited: number;
  transactions: WalletTransaction[];
}
