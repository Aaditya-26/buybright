/**
 * BuyBright Admin — Customer Wallet Mock Data & Persistence Engine.
 * LocalStorage persistence for customer wallet balances and transaction logs.
 */

import type { AdminCustomerWallet, WalletTransaction } from '../types/wallet';

export const initialWalletsData: AdminCustomerWallet[] = [
  {
    id: 'w-101',
    customerId: 'PD-CUST-1001',
    customerName: '  John Doe',
    clinicName: 'Apex Dental Care & Implant Center',
    email: ' johndoe@apexdental.in',
    phone: '+91 98201 23456',
    walletBalance: 4500.0,
    lastUpdate: '30 Sep 2026, 04:30 PM',
    totalCredited: 12000.0,
    totalDebited: 7500.0,
    transactions: [
      {
        id: 'tx-101-1',
        dateTime: '30 Sep 2026, 04:30 PM',
        orderNo: 'PRESTO-2026-892144',
        description: 'Order Cashback Presto Reward Credit',
        type: 'Credit',
        amount: 500.0,
        balance: 4500.0,
      },
      {
        id: 'tx-101-2',
        dateTime: '24 Sep 2026, 02:15 PM',
        orderNo: 'PRESTO-2026-841920',
        description: 'Applied on Checkout Purchase of Restorative Kits',
        type: 'Debit',
        amount: 2000.0,
        balance: 4000.0,
      },
      {
        id: 'tx-101-3',
        dateTime: '15 Sep 2026, 11:00 AM',
        orderNo: 'MANUAL-REFUND-401',
        description: 'Goodwill Credit for Minor Transit Packaging Delay',
        type: 'Credit',
        amount: 1500.0,
        balance: 6000.0,
      },
      {
        id: 'tx-101-4',
        dateTime: '01 Sep 2026, 10:00 AM',
        orderNo: 'WELCOME-BONUS',
        description: 'Doctor Account Welcome Wallet Credit',
        type: 'Credit',
        amount: 4500.0,
        balance: 4500.0,
      },
    ],
  },
  {
    id: 'w-102',
    customerId: 'PD-CUST-1002',
    customerName: '  Neha Kapoor',
    clinicName: 'WhitePearl Aesthetic Dental Clinic',
    email: 'neha.kapoor@whitepearl.com',
    phone: '+91 98331 12233',
    walletBalance: 2850.0,
    lastUpdate: '29 Sep 2026, 06:10 PM',
    totalCredited: 6850.0,
    totalDebited: 4000.0,
    transactions: [
      {
        id: 'tx-102-1',
        dateTime: '29 Sep 2026, 06:10 PM',
        orderNo: 'PRESTO-2026-892145',
        description: 'Wallet Deduction for Rotary Files Order',
        type: 'Debit',
        amount: 2000.0,
        balance: 2850.0,
      },
      {
        id: 'tx-102-2',
        dateTime: '20 Sep 2026, 01:20 PM',
        orderNo: 'REFERRAL-BONUS',
        description: 'Referral Reward for   Ananya Joshi Registration',
        type: 'Credit',
        amount: 1000.0,
        balance: 4850.0,
      },
      {
        id: 'tx-102-3',
        dateTime: '10 Sep 2026, 09:45 AM',
        orderNo: 'PROMO-CREDIT-99',
        description: 'Festive Dental Stocking Campaign Cashback',
        type: 'Credit',
        amount: 3850.0,
        balance: 3850.0,
      },
    ],
  },
  {
    id: 'w-103',
    customerId: 'PD-CUST-1003',
    customerName: '  Priya Sharma',
    clinicName: 'SmileCraft Orthodontic Studio',
    email: 'priya.sharma@smilecraft.org',
    phone: '+91 98198 27364',
    walletBalance: 6200.0,
    lastUpdate: '28 Sep 2026, 05:00 PM',
    totalCredited: 15200.0,
    totalDebited: 9000.0,
    transactions: [
      {
        id: 'tx-103-1',
        dateTime: '28 Sep 2026, 05:00 PM',
        orderNo: 'MANUAL-CREDIT-882',
        description: 'Orthodontic Conference Bulk Rebate Credit',
        type: 'Credit',
        amount: 2500.0,
        balance: 6200.0,
      },
      {
        id: 'tx-103-2',
        dateTime: '18 Sep 2026, 03:30 PM',
        orderNo: 'PRESTO-2026-674120',
        description: 'Checkout Partial Wallet Payment',
        type: 'Debit',
        amount: 3500.0,
        balance: 3700.0,
      },
      {
        id: 'tx-103-3',
        dateTime: '05 Sep 2026, 11:15 AM',
        orderNo: 'CASHBACK-7721',
        description: 'Monthly Tier Platinum Cashback Allocation',
        type: 'Credit',
        amount: 7200.0,
        balance: 7200.0,
      },
    ],
  },
  {
    id: 'w-104',
    customerId: 'PD-CUST-1004',
    customerName: '  Amit Patel',
    clinicName: 'Patel Multispecialty Dental Hospital',
    email: 'amit.patel@pateldental.co.in',
    phone: '+91 98450 91823',
    walletBalance: 1200.0,
    lastUpdate: '25 Sep 2026, 02:40 PM',
    totalCredited: 5000.0,
    totalDebited: 3800.0,
    transactions: [
      {
        id: 'tx-104-1',
        dateTime: '25 Sep 2026, 02:40 PM',
        orderNo: 'PRESTO-2026-551902',
        description: 'Loyalty Cashback Deposit',
        type: 'Credit',
        amount: 400.0,
        balance: 1200.0,
      },
      {
        id: 'tx-104-2',
        dateTime: '12 Sep 2026, 10:10 AM',
        orderNo: 'PRESTO-2026-441029',
        description: 'Redeemed for Endodontic Handpiece Order',
        type: 'Debit',
        amount: 2500.0,
        balance: 800.0,
      },
      {
        id: 'tx-104-3',
        dateTime: '01 Sep 2026, 09:00 AM',
        orderNo: 'WELCOME-BONUS',
        description: 'Account Setup Bonus',
        type: 'Credit',
        amount: 3300.0,
        balance: 3300.0,
      },
    ],
  },
  {
    id: 'w-105',
    customerId: 'PD-CUST-1005',
    customerName: '  Ananya Joshi',
    clinicName: 'ToothCraft Super-Speciality Care',
    email: 'ananya.joshi@toothcraft.in',
    phone: '+91 98765 43210',
    walletBalance: 3750.0,
    lastUpdate: '26 Sep 2026, 01:15 PM',
    totalCredited: 8750.0,
    totalDebited: 5000.0,
    transactions: [
      {
        id: 'tx-105-1',
        dateTime: '26 Sep 2026, 01:15 PM',
        orderNo: 'PRESTO-2026-339182',
        description: 'Endodontic Biomaterial Cashback Credit',
        type: 'Credit',
        amount: 750.0,
        balance: 3750.0,
      },
      {
        id: 'tx-105-2',
        dateTime: '14 Sep 2026, 12:45 PM',
        orderNo: 'PRESTO-2026-228174',
        description: 'Applied on Implant Motor Order',
        type: 'Debit',
        amount: 3000.0,
        balance: 3000.0,
      },
      {
        id: 'tx-105-3',
        dateTime: '02 Sep 2026, 03:00 PM',
        orderNo: 'PROMO-SUMMER',
        description: 'Bright Points Conversion into Wallet Balance',
        type: 'Credit',
        amount: 6000.0,
        balance: 6000.0,
      },
    ],
  },
];

const WALLET_STORAGE_KEY = 'prestodental_admin_wallets_v1';

export function getWallets(): AdminCustomerWallet[] {
  try {
    const raw = localStorage.getItem(WALLET_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AdminCustomerWallet[];
  } catch {
    // fallback
  }
  return initialWalletsData;
}

export function saveWallets(wallets: AdminCustomerWallet[]): void {
  try {
    localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallets));
  } catch {
    // silent fail
  }
}

export function getWalletById(id: string): AdminCustomerWallet | null {
  return getWallets().find((w) => w.id === id || w.customerId === id) ?? null;
}

export function creditWalletBalance(
  walletId: string,
  amount: number,
  description: string,
  orderNo?: string
): { success: boolean; updatedWallet?: AdminCustomerWallet } {
  const currentWallets = getWallets();
  const targetWallet = currentWallets.find((w) => w.id === walletId || w.customerId === walletId);

  if (!targetWallet) {
    return { success: false };
  }

  const creditAmount = Number(amount);
  if (isNaN(creditAmount) || creditAmount <= 0) {
    return { success: false };
  }

  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }) + ', ' + now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const newBalance = targetWallet.walletBalance + creditAmount;
  const newTx: WalletTransaction = {
    id: `tx-${Date.now()}`,
    dateTime: formattedDate,
    orderNo: orderNo?.trim() || `CREDIT-${Math.floor(100000 + Math.random() * 900000)}`,
    description: description.trim(),
    type: 'Credit',
    amount: creditAmount,
    balance: newBalance,
  };

  const updated: AdminCustomerWallet = {
    ...targetWallet,
    walletBalance: newBalance,
    totalCredited: targetWallet.totalCredited + creditAmount,
    lastUpdate: formattedDate,
    transactions: [newTx, ...targetWallet.transactions],
  };

  const allUpdated = currentWallets.map((w) => (w.id === targetWallet.id ? updated : w));
  saveWallets(allUpdated);

  return { success: true, updatedWallet: updated };
}
