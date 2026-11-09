/**
 * BuyBright Admin — Customer & Referral Management Data Engine.
 * LocalStorage persistence for customer directory, points, and referral logs.
 */

import type { AdminCustomer } from '../types/customer';

export const initialCustomersData: AdminCustomer[] = [
  {
    id: 'cust-101',
    customerId: 'PD-CUST-1001',
    name: '  John Doe',
    clinicName: 'Apex Dental Care & Implant Center',
    email: ' johndoe@apexdental.in',
    phone: '+91 98201 23456',
    address: 'Suite 402, Metro Healthcare Plaza, Link Road, Andheri West, Mumbai, Maharashtra - 400069',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400069',
    referredBy: '  Vivek Mehra',
    referralEmail: ' vivek@mehradental.com',
    brightPoints: 450,
    referralCode: 'PRESTO-JOHN450',
    registeredDate: '14 Jan 2026, 10:30 AM',
    status: 'Active',
    totalOrders: 6,
    totalSpent: 48500,
    avatar: 'JD',
  },
  {
    id: 'cust-102',
    customerId: 'PD-CUST-1002',
    name: '  Neha Kapoor',
    clinicName: 'WhitePearl Aesthetic Dental Clinic',
    email: 'neha.kapoor@whitepearl.com',
    phone: '+91 98331 12233',
    address: 'Ground Floor, Galleria Arcade, Hiranandani Gardens, Powai, Mumbai, Maharashtra - 400076',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400076',
    referredBy: '  John Doe',
    referralEmail: ' johndoe@apexdental.in',
    brightPoints: 720,
    referralCode: 'PRESTO-NEHA72',
    registeredDate: '18 Jan 2026, 03:15 PM',
    status: 'Active',
    totalOrders: 4,
    totalSpent: 32400,
    avatar: 'NK',
  },
  {
    id: 'cust-103',
    customerId: 'PD-CUST-1003',
    name: '  Priya Sharma',
    clinicName: 'SmileCraft Orthodontic Studio',
    email: 'priya.sharma@smilecraft.org',
    phone: '+91 98198 27364',
    address: 'Shop 12, FC Road Commercial Complex, Shivaji Nagar, Pune, Maharashtra - 411005',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411005',
    referredBy: '  Rajesh Sharma',
    referralEmail: ' rajesh@sharmadental.com',
    brightPoints: 1250,
    referralCode: 'PRESTO-PRIYA12',
    registeredDate: '22 Jan 2026, 11:45 AM',
    status: 'Active',
    totalOrders: 9,
    totalSpent: 87600,
    avatar: 'PS',
  },
  {
    id: 'cust-104',
    customerId: 'PD-CUST-1004',
    name: '  Amit Patel',
    clinicName: 'Patel Multispecialty Dental Hospital',
    email: 'amit.patel@pateldental.co.in',
    phone: '+91 98450 91823',
    address: '3rd Floor, Silicon Towers, 100 Feet Road, Indiranagar, Bengaluru, Karnataka - 560038',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    referredBy: '—',
    referralEmail: '—',
    brightPoints: 310,
    referralCode: 'PRESTO-AMIT31',
    registeredDate: '02 Feb 2026, 09:20 AM',
    status: 'Active',
    totalOrders: 3,
    totalSpent: 21900,
    avatar: 'AP',
  },
  {
    id: 'cust-105',
    customerId: 'PD-CUST-1005',
    name: '  Ananya Joshi',
    clinicName: 'ToothCraft Super-Speciality Care',
    email: 'ananya.joshi@toothcraft.in',
    phone: '+91 98765 43210',
    address: 'B-14, Green Park Main Market, Near Metro Gate 3, New Delhi, Delhi - 110016',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110016',
    referredBy: '  John Doe',
    referralEmail: ' johndoe@apexdental.in',
    brightPoints: 890,
    referralCode: 'PRESTO-ANAN89',
    registeredDate: '10 Feb 2026, 04:40 PM',
    status: 'Active',
    totalOrders: 7,
    totalSpent: 64200,
    avatar: 'AJ',
  },
  {
    id: 'cust-106',
    customerId: 'PD-CUST-1006',
    name: '  Suresh Nair',
    clinicName: 'Kerala Endodontic & Laser Center',
    email: 'suresh.nair@keraladental.com',
    phone: '+91 94471 23890',
    address: 'Door No. 44/1202, MG Road, Ravipuram, Kochi, Kerala - 682016',
    city: 'Kochi',
    state: 'Kerala',
    pincode: '682016',
    referredBy: '  Priya Sharma',
    referralEmail: 'priya.sharma@smilecraft.org',
    brightPoints: 540,
    referralCode: 'PRESTO-SURE54',
    registeredDate: '15 Feb 2026, 01:10 PM',
    status: 'Active',
    totalOrders: 5,
    totalSpent: 39800,
    avatar: 'SN',
  },
  {
    id: 'cust-107',
    customerId: 'PD-CUST-1007',
    name: '  Vikramaditya Rao',
    clinicName: 'Hyderabad Smiles Micro-Dentistry',
    email: 'vikram.rao@hyderabadsmiles.org',
    phone: '+91 98480 11223',
    address: 'Road No. 36, Jubilee Hills, Opposite Pillar 1680, Hyderabad, Telangana - 500033',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500033',
    referredBy: '—',
    referralEmail: '—',
    brightPoints: 1600,
    referralCode: 'PRESTO-VIKR16',
    registeredDate: '20 Feb 2026, 11:00 AM',
    status: 'Active',
    totalOrders: 11,
    totalSpent: 112500,
    avatar: 'VR',
  },
  {
    id: 'cust-108',
    customerId: 'PD-CUST-1008',
    name: '  Ritu Sengupta',
    clinicName: 'CityDental Implant & Prosthodontic Hub',
    email: 'ritu.sengupta@citydental.in',
    phone: '+91 98300 45678',
    address: 'Flat 3B, Park Street Mansions, Park Street, Kolkata, West Bengal - 700016',
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700016',
    referredBy: '  Neha Kapoor',
    referralEmail: 'neha.kapoor@whitepearl.com',
    brightPoints: 380,
    referralCode: 'PRESTO-RITU38',
    registeredDate: '28 Feb 2026, 05:25 PM',
    status: 'Active',
    totalOrders: 2,
    totalSpent: 18400,
    avatar: 'RS',
  },
];

const CUSTOMERS_STORAGE_KEY = 'buybright_admin_customers_v2';

export function getCustomers(): AdminCustomer[] {
  try {
    const raw = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AdminCustomer[];
  } catch {
    // fallback
  }
  return initialCustomersData;
}

export function saveCustomers(customers: AdminCustomer[]): void {
  try {
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
  } catch {
    // silent fail
  }
}

export function getCustomerById(id: string): AdminCustomer | null {
  return getCustomers().find((c) => c.id === id || c.customerId === id) ?? null;
}
