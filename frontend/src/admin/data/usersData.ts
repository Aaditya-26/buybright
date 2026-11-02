/**
 * User & Role Mock Data for BuyBright Admin Portal.
 * Includes System Users, Roles (RBAC), and Registered Dental Clinics.
 */

import type { RoleItem, SystemUser, AdminUser } from '../types/user';

export const initialRolesData: RoleItem[] = [
  {
    id: 'role-1',
    srNo: 1,
    roleName: 'Super Admin',
    description: 'Unrestricted master access to all platform operations, financials, catalog, and administrative users.',
    permissions: ['All Permissions', 'Manage Users & Roles', 'Manage Financials', 'System Settings'],
    userCount: 2,
    createdAt: '10 Jan 2025',
    status: 'Active',
  },
  {
    id: 'role-2',
    srNo: 2,
    roleName: 'Administrator',
    description: 'Comprehensive administrative oversight across products, categories, orders, and customer accounts.',
    permissions: ['Manage Orders', 'Manage Products', 'Manage Categories', 'View Reports'],
    userCount: 4,
    createdAt: '12 Jan 2025',
    status: 'Active',
  },
  {
    id: 'role-3',
    srNo: 3,
    roleName: 'Product Quality Manager',
    description: 'Specialist responsible for verifying DCI registration licenses, quality authenticity, and practitioner orders.',
    permissions: ['Verify Doctors', 'Audit Quality Certifications', 'Approve Restricted Dental Items'],
    userCount: 3,
    createdAt: '15 Jan 2025',
    status: 'Active',
  },
  {
    id: 'role-4',
    srNo: 4,
    roleName: 'Inventory Manager',
    description: 'Controls dental warehouse supplies, batch tracking, expiry monitoring, and supplier restocks.',
    permissions: ['Manage Stock', 'Track Batches', 'Suppliers & PO', 'Low-Stock Alerts'],
    userCount: 5,
    createdAt: '20 Jan 2025',
    status: 'Active',
  },
  {
    id: 'role-5',
    srNo: 5,
    roleName: 'Order Processing Officer',
    description: 'Handles daily order packaging, warehouse picking, courier dispatches, and delivery status transitions.',
    permissions: ['Process Orders', 'Generate Invoices', 'Assign Couriers', 'Manage Dispatches'],
    userCount: 6,
    createdAt: '01 Feb 2025',
    status: 'Active',
  },
  {
    id: 'role-6',
    srNo: 6,
    roleName: 'Customer Support Executive',
    description: 'Assists dental practitioners with order queries, returns processing, tracking issues, and customer support.',
    permissions: ['View Orders', 'Process Returns', 'Resolve Support Tickets', 'Customer Communications'],
    userCount: 4,
    createdAt: '10 Feb 2025',
    status: 'Active',
  },
  {
    id: 'role-7',
    srNo: 7,
    roleName: 'Finance & Accounts Specialist',
    description: 'Oversees GST reconciliation, tax invoice filings, customer credit lines, and financial auditing.',
    permissions: ['GST Reports', 'Payment Reconciliation', 'Refund Approvals', 'Credit Terms'],
    userCount: 2,
    createdAt: '01 Mar 2025',
    status: 'Active',
  },
];

export const initialSystemUsersData: SystemUser[] = [
  {
    id: 'usr-sys-1',
    srNo: 1,
    userName: '  Rajesh Kulkarni',
    email: 'rajesh.kulkarni@buybright.com',
    contactNo: '+91 98201 12345',
    role: 'Super Admin',
    date: '12 Jan 2025',
    status: 'Active',
    password: 'PrestoAdmin#2025!',
    avatar: 'RK',
  },
  {
    id: 'usr-sys-2',
    srNo: 2,
    userName: 'Pooja Deshmukh',
    email: 'pooja.d@buybright.com',
    contactNo: '+91 98202 34567',
    role: 'Product Quality Manager',
    date: '18 Feb 2025',
    status: 'Active',
    password: 'QualityLead@2025',
    avatar: 'PD',
  },
  {
    id: 'usr-sys-3',
    srNo: 3,
    userName: 'Vikram Singhania',
    email: 'vikram.s@buybright.com',
    contactNo: '+91 98203 45678',
    role: 'Administrator',
    date: '05 Mar 2025',
    status: 'Active',
    password: 'AdminVikram#88',
    avatar: 'VS',
  },
  {
    id: 'usr-sys-4',
    srNo: 4,
    userName: 'Sneha Nair',
    email: 'sneha.nair@buybright.com',
    contactNo: '+91 98204 56789',
    role: 'Inventory Manager',
    date: '14 Apr 2025',
    status: 'Active',
    password: 'StockMaster!2025',
    avatar: 'SN',
  },
  {
    id: 'usr-sys-5',
    srNo: 5,
    userName: 'Amit Verma',
    email: 'amit.verma@buybright.com',
    contactNo: '+91 98205 67890',
    role: 'Order Processing Officer',
    date: '22 May 2025',
    status: 'Active',
    password: 'Dispatch@Presto#9',
    avatar: 'AV',
  },
  {
    id: 'usr-sys-6',
    srNo: 6,
    userName: 'Neha Joshi',
    email: 'neha.joshi@buybright.com',
    contactNo: '+91 98206 78901',
    role: 'Customer Support Executive',
    date: '10 Jun 2025',
    status: 'Active',
    password: 'Support#2025Secure',
    avatar: 'NJ',
  },
  {
    id: 'usr-sys-7',
    srNo: 7,
    userName: 'Rohan Mehta',
    email: 'rohan.mehta@buybright.com',
    contactNo: '+91 98207 89012',
    role: 'Finance & Accounts Specialist',
    date: '01 Jul 2025',
    status: 'Inactive',
    password: 'FinanceTax@2025',
    avatar: 'RM',
  },
  {
    id: 'usr-sys-8',
    srNo: 8,
    userName: 'Kavita Rao',
    email: 'kavita.rao@buybright.com',
    contactNo: '+91 98208 90123',
    role: 'Order Processing Officer',
    date: '15 Aug 2025',
    status: 'Active',
    password: 'Orders2025#Kavita',
    avatar: 'KR',
  },
  {
    id: 'usr-sys-9',
    srNo: 9,
    userName: 'Sandeep Patil',
    email: 'sandeep.p@buybright.com',
    contactNo: '+91 98209 01234',
    role: 'Product Quality Manager',
    date: '03 Sep 2025',
    status: 'Active',
    password: 'DCIReviewer#2025',
    avatar: 'SP',
  },
  {
    id: 'usr-sys-10',
    srNo: 10,
    userName: 'Ananya Sen',
    email: 'ananya.sen@buybright.com',
    contactNo: '+91 98210 12345',
    role: 'Customer Support Executive',
    date: '19 Sep 2025',
    status: 'Active',
    password: 'PrestoCare!2025',
    avatar: 'AS',
  },
];

export const initialUsersData: AdminUser[] = [
  {
    id: 'usr-1',
    doctorName: '  John Doe',
    clinicName: 'Apex Dental Care & Implant Center',
    email: ' johndoe@buybright.com',
    phone: '9820123456',
    city: 'Mumbai',
    state: 'Maharashtra',
    dciRegistrationNo: 'MDC-48920-A',
    gstin: '27AABCU9603R1ZM',
    address: 'Shop 4 & 5, Presto Commercial Hub, Central Road, Andheri East',
    totalOrders: 18,
    totalSpent: 142800,
    brightPointsBalance: 150,
    joinedDate: '12 Jan 2025',
    status: 'Verified',
  },
  {
    id: 'usr-2',
    doctorName: '  Priya Sharma',
    clinicName: 'SmileCraft Orthodontic Studio',
    email: 'priya.sharma@smilecraft.org',
    phone: '9819827364',
    city: 'Pune',
    state: 'Maharashtra',
    dciRegistrationNo: 'MDC-51029-B',
    gstin: '27AABCS5512L1ZK',
    address: '2nd Floor, Medico Square, Near FC Road, Shivaji Nagar',
    totalOrders: 11,
    totalSpent: 86400,
    brightPointsBalance: 90,
    joinedDate: '04 Mar 2025',
    status: 'Verified',
  },
  {
    id: 'usr-3',
    doctorName: '  Rajesh Patel',
    clinicName: 'Gujarat Advanced Dental Super-Speciality',
    email: 'contact@gujaratdental.com',
    phone: '9928172635',
    city: 'Ahmedabad',
    state: 'Gujarat',
    dciRegistrationNo: 'GDC-19283-A',
    gstin: '24AABCR8819P1ZW',
    address: 'Block C, Heritage Healthcare Complex, Bodakdev',
    totalOrders: 29,
    totalSpent: 268500,
    brightPointsBalance: 240,
    joinedDate: '18 Nov 2024',
    status: 'Verified',
  },
  {
    id: 'usr-4',
    doctorName: '  Ananya Mukherjee',
    clinicName: 'Kolkata Dental Health Clinic',
    email: 'ananya.m@kolkatadental.in',
    phone: '9830192847',
    city: 'Kolkata',
    state: 'West Bengal',
    dciRegistrationNo: 'WBDC-91028-C',
    gstin: '19AABCM1122N1ZU',
    address: '88/2 Park Street Dental Enclave',
    totalOrders: 4,
    totalSpent: 18400,
    brightPointsBalance: 40,
    joinedDate: '15 Jul 2026',
    status: 'Verified',
  },
  {
    id: 'usr-5',
    doctorName: '  Sameer Kapoor',
    clinicName: 'Kapoor Advanced Endodontics',
    email: 'sameer.k@dentcare.com',
    phone: '9811223344',
    city: 'Chandigarh',
    state: 'Punjab',
    dciRegistrationNo: 'PDC-33019-D',
    gstin: '04AABCK9901M1ZQ',
    address: 'Sector 35-B Healthcare Hub',
    totalOrders: 1,
    totalSpent: 6200,
    brightPointsBalance: 10,
    joinedDate: '24 Sep 2026',
    status: 'Pending Verification',
  },
];

// LocalStorage helpers for persistence across form navigation
const USERS_STORAGE_KEY = 'prestodental_admin_system_users';
const ROLES_STORAGE_KEY = 'prestodental_admin_roles';

export function getSystemUsers(): SystemUser[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return initialSystemUsersData;
}

export function saveSystemUsers(users: SystemUser[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch {
    // fallback
  }
}

export function getRoles(): RoleItem[] {
  try {
    const raw = localStorage.getItem(ROLES_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return initialRolesData;
}

export function saveRoles(roles: RoleItem[]): void {
  try {
    localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(roles));
  } catch {
    // fallback
  }
}

