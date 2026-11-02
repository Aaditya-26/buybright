/**
 * BuyBright Admin Static Data.
 * High-quality authentic dental product mock data for administrative workflows.
 */

export interface AdminStat {
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

export interface AdminProduct {
  id: string;
  sku: string;
  name: string;
  category: 'Endodontics' | 'Orthodontics' | 'Equipment' | 'Consumables' | 'Implants' | 'Prosthodontics';
  price: number;
  mrp: number;
  stock: number;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  rating: number;
  brand: string;
  brightPoints: number;
  image: string;
  salesCount: number;
  status: 'Active' | 'Draft' | 'Archived';
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  doctorName: string;
  clinicName: string;
  city: string;
  state: string;
  date: string;
  itemsCount: number;
  totalAmount: number;
  paymentMethod: 'Razorpay' | 'Wallet + Online' | 'Wallet + COD' | 'Cash on Delivery';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  orderStatus: 'Placed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  awbNumber: string;
  courier: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
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
  totalOrders: number;
  totalSpent: number;
  brightPointsBalance: number;
  joinedDate: string;
  status: 'Verified' | 'Pending Verification' | 'Suspended';
}

export interface AdminReturn {
  id: string;
  orderNumber: string;
  doctorName: string;
  productName: string;
  quantity: number;
  amount: number;
  requestDate: string;
  reason: 'Damaged Packaging' | 'Defective Product' | 'Expired Batch' | 'Wrong Item Delivered';
  status: 'Pending Review' | 'Approved' | 'Refunded' | 'Rejected';
}

// 1. Dashboard Overview Statistics
export const adminStats: AdminStat[] = [
  {
    id: 'stat-rev',
    label: 'Total Platform Revenue',
    value: '₹18,45,820',
    numericValue: 1845820,
    change: '+18.4%',
    isPositive: true,
    icon: 'fa-solid fa-indian-rupee-sign',
    color: '#0d9488',
    timeframe: 'vs last month',
  },
  {
    id: 'stat-orders',
    label: 'Completed Dental Orders',
    value: '1,428',
    numericValue: 1428,
    change: '+12.6%',
    isPositive: true,
    icon: 'fa-solid fa-boxes-packing',
    color: '#3b82f6',
    timeframe: 'vs last month',
  },
  {
    id: 'stat-clinics',
    label: 'Active Verified Clinics',
    value: '684',
    numericValue: 684,
    change: '+8.2%',
    isPositive: true,
    icon: 'fa-solid fa-hospital-user',
    color: '#8b5cf6',
    timeframe: 'vs last month',
  },
  {
    id: 'stat-stock',
    label: 'Low Stock SKU Alerts',
    value: '12 SKUs',
    numericValue: 12,
    change: '-3 SKUs',
    isPositive: false,
    icon: 'fa-solid fa-triangle-exclamation',
    color: '#f59e0b',
    timeframe: 'action required',
  },
];

// 2. Mock Dental Products Catalog
export const adminProductsData: AdminProduct[] = [
  {
    id: 'prod-1',
    sku: 'PD-ENDO-01',
    name: 'ProTaper Gold Rotary Files 25mm (SX-F3 Assorted)',
    category: 'Endodontics',
    price: 2450,
    mrp: 3100,
    stock: 84,
    stockStatus: 'In Stock',
    rating: 4.9,
    brand: 'Dentsply Sirona',
    brightPoints: 45,
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=200&q=80',
    salesCount: 342,
    status: 'Active',
  },
  {
    id: 'prod-2',
    sku: 'PD-COMP-02',
    name: '3M Filtek Z350 XT Universal Restorative Composite Kit',
    category: 'Consumables',
    price: 4850,
    mrp: 6200,
    stock: 42,
    stockStatus: 'In Stock',
    rating: 4.8,
    brand: '3M ESPE',
    brightPoints: 80,
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=200&q=80',
    salesCount: 512,
    status: 'Active',
  },
  {
    id: 'prod-3',
    sku: 'PD-EQ-03',
    name: 'Woodpecker LED Curing Light (iLED Wireless Max Power)',
    category: 'Equipment',
    price: 6890,
    mrp: 9500,
    stock: 9,
    stockStatus: 'Low Stock',
    rating: 4.7,
    brand: 'Woodpecker',
    brightPoints: 120,
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=200&q=80',
    salesCount: 184,
    status: 'Active',
  },
  {
    id: 'prod-4',
    sku: 'PD-ORTHO-04',
    name: 'Roth 022 Metal Brackets Set (5-5 Upper & Lower)',
    category: 'Orthodontics',
    price: 1850,
    mrp: 2600,
    stock: 65,
    stockStatus: 'In Stock',
    rating: 4.6,
    brand: 'OrthoOrganizers',
    brightPoints: 30,
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=200&q=80',
    salesCount: 220,
    status: 'Active',
  },
  {
    id: 'prod-5',
    sku: 'PD-STERIL-05',
    name: 'Medical Grade Autoclave Pouches 90x230mm (Box of 200)',
    category: 'Consumables',
    price: 799,
    mrp: 1200,
    stock: 4,
    stockStatus: 'Low Stock',
    rating: 4.9,
    brand: 'PrestoMedical',
    brightPoints: 15,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=200&q=80',
    salesCount: 890,
    status: 'Active',
  },
  {
    id: 'prod-6',
    sku: 'PD-HAND-06',
    name: 'NSK Pana-Max Plus High Speed Dental Handpiece (Push Button)',
    category: 'Equipment',
    price: 8400,
    mrp: 11500,
    stock: 0,
    stockStatus: 'Out of Stock',
    rating: 4.9,
    brand: 'NSK Dental',
    brightPoints: 150,
    image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=200&q=80',
    salesCount: 128,
    status: 'Active',
  },
  {
    id: 'prod-7',
    sku: 'PD-IMPL-07',
    name: 'Titanium Dental Implant Fixture Internal Hex (Ø 4.2 x 11.5mm)',
    category: 'Implants',
    price: 12500,
    mrp: 16000,
    stock: 18,
    stockStatus: 'In Stock',
    rating: 5.0,
    brand: 'Nobel Biocare',
    brightPoints: 200,
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=200&q=80',
    salesCount: 96,
    status: 'Active',
  },
  {
    id: 'prod-8',
    sku: 'PD-PROS-08',
    name: 'Aquasil Soft Putty Vinyl Polysiloxane Impression Material',
    category: 'Prosthodontics',
    price: 3600,
    mrp: 4750,
    stock: 28,
    stockStatus: 'In Stock',
    rating: 4.8,
    brand: 'Dentsply Sirona',
    brightPoints: 60,
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=200&q=80',
    salesCount: 310,
    status: 'Active',
  },
];

// 3. Mock Dental Orders Data
export const adminOrdersData: AdminOrder[] = [
  {
    id: 'ord-101',
    orderNumber: 'PD-892144-IN',
    doctorName: '  John Doe',
    clinicName: 'Apex Dental Care & Implant Center',
    city: 'Mumbai',
    state: 'Maharashtra',
    date: '26 Sep 2026, 02:45 PM',
    itemsCount: 4,
    totalAmount: 11205,
    paymentMethod: 'Razorpay',
    paymentStatus: 'Paid',
    orderStatus: 'Processing',
    awbNumber: 'BLUEDART-84920194',
    courier: 'BlueDart Express  ',
    items: [
      { name: 'ProTaper Gold Rotary Files 25mm', quantity: 2, price: 2450 },
      { name: '3M Filtek Z350 Universal Restorative Kit', quantity: 1, price: 4850 },
      { name: 'Medical Grade Autoclave Pouches 90x230mm', quantity: 2, price: 799 },
    ],
  },
  {
    id: 'ord-102',
    orderNumber: 'PD-674120-IN',
    doctorName: '  Priya Sharma',
    clinicName: 'SmileCraft Orthodontic Studio',
    city: 'Pune',
    state: 'Maharashtra',
    date: '26 Sep 2026, 11:20 AM',
    itemsCount: 2,
    totalAmount: 6450,
    paymentMethod: 'Wallet + Online',
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    awbNumber: 'DELHIVERY-92018471',
    courier: 'Delhivery Priority Cargo',
    items: [
      { name: 'Roth 022 Metal Brackets Set', quantity: 3, price: 1850 },
      { name: 'Sterile Barrier Dental Bibs (500pcs)', quantity: 1, price: 900 },
    ],
  },
  {
    id: 'ord-103',
    orderNumber: 'PD-553912-IN',
    doctorName: '  Rajesh Patel',
    clinicName: 'Gujarat Advanced Dental Super-Speciality',
    city: 'Ahmedabad',
    state: 'Gujarat',
    date: '25 Sep 2026, 04:15 PM',
    itemsCount: 6,
    totalAmount: 23800,
    paymentMethod: 'Razorpay',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    awbNumber: 'BLUEDART-55319802',
    courier: 'BlueDart Express  ',
    items: [
      { name: 'Woodpecker LED Curing Light iLED', quantity: 2, price: 6890 },
      { name: 'Titanium Implant Fixture Ø 4.2', quantity: 1, price: 12500 },
    ],
  },
  {
    id: 'ord-104',
    orderNumber: 'PD-441982-IN',
    doctorName: '  Ananya Mukherjee',
    clinicName: 'Kolkata Dental Health Clinic',
    city: 'Kolkata',
    state: 'West Bengal',
    date: '25 Sep 2026, 01:10 PM',
    itemsCount: 3,
    totalAmount: 4399,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending',
    orderStatus: 'Placed',
    awbNumber: 'XPRESSBEES-11928371',
    courier: 'Xpressbees Medical Express',
    items: [
      { name: 'Aquasil Soft Putty Vinyl Impression Material', quantity: 1, price: 3600 },
      { name: 'Autoclave Pouches 90x230mm', quantity: 1, price: 799 },
    ],
  },
  {
    id: 'ord-105',
    orderNumber: 'PD-338291-IN',
    doctorName: '  Vikramaditya Rao',
    clinicName: 'Rao Dental Hospital & Maxillofacial Care',
    city: 'Bengaluru',
    state: 'Karnataka',
    date: '24 Sep 2026, 06:40 PM',
    itemsCount: 5,
    totalAmount: 18950,
    paymentMethod: 'Wallet + COD',
    paymentStatus: 'Pending',
    orderStatus: 'Shipped',
    awbNumber: 'BLUEDART-77291038',
    courier: 'BlueDart Express  ',
    items: [
      { name: 'NSK Pana-Max Plus High Speed Handpiece', quantity: 2, price: 8400 },
      { name: 'ProTaper Gold Rotary Files 25mm', quantity: 1, price: 2450 },
    ],
  },
  {
    id: 'ord-106',
    orderNumber: 'PD-220194-IN',
    doctorName: '  Neha Verma',
    clinicName: 'Verma Smile Aesthetic Center',
    city: 'New Delhi',
    state: 'Delhi NCR',
    date: '23 Sep 2026, 10:15 AM',
    itemsCount: 1,
    totalAmount: 4850,
    paymentMethod: 'Razorpay',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    awbNumber: 'DELHIVERY-66190283',
    courier: 'Delhivery Priority Cargo',
    items: [
      { name: '3M Filtek Z350 Universal Restorative Kit', quantity: 1, price: 4850 },
    ],
  },
];

// 4. Mock Registered Dental Clinics & Doctors
export const adminUsersData: AdminUser[] = [
  {
    id: 'usr-1',
    doctorName: '  John Doe',
    clinicName: 'Apex Dental Care & Implant Center',
    email: ' johndoe@buybright.com',
    phone: '9820123456',
    city: 'Mumbai',
    state: 'Maharashtra',
    dciRegistrationNo: 'MDC-48920-A',
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
    totalOrders: 1,
    totalSpent: 6200,
    brightPointsBalance: 10,
    joinedDate: '24 Sep 2026',
    status: 'Pending Verification',
  },
];

// 5. Mock Return & Replacement Requests
export const adminReturnsData: AdminReturn[] = [
  {
    id: 'ret-01',
    orderNumber: 'PD-892144-IN',
    doctorName: '  John Doe',
    productName: 'ProTaper Gold Rotary Files 25mm (Box 1)',
    quantity: 1,
    amount: 2450,
    requestDate: '26 Sep 2026',
    reason: 'Damaged Packaging',
    status: 'Approved',
  },
  {
    id: 'ret-02',
    orderNumber: 'PD-674120-IN',
    doctorName: '  Priya Sharma',
    productName: 'Roth 022 Metal Brackets Set',
    quantity: 1,
    amount: 1850,
    requestDate: '25 Sep 2026',
    reason: 'Wrong Item Delivered',
    status: 'Pending Review',
  },
  {
    id: 'ret-03',
    orderNumber: 'PD-441982-IN',
    doctorName: '  Ananya Mukherjee',
    productName: 'Medical Grade Autoclave Pouches',
    quantity: 1,
    amount: 799,
    requestDate: '23 Sep 2026',
    reason: 'Defective Product',
    status: 'Refunded',
  },
];

// 6. Monthly Sales Analytics
export const adminMonthlySales = [
  { month: 'Apr', revenue: 1120000, orders: 840 },
  { month: 'May', revenue: 1280000, orders: 960 },
  { month: 'Jun', revenue: 1420000, orders: 1080 },
  { month: 'Jul', revenue: 1590000, orders: 1210 },
  { month: 'Aug', revenue: 1710000, orders: 1340 },
  { month: 'Sep', revenue: 1845820, orders: 1428 },
];
