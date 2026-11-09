/**
 * BuyBright Admin — Cart Data Store & Analytics Management.
 * Provides mock cart dataset, funnel metrics, multi-timeframe trend lines, and localStorage persistence.
 */

import {
  AdminCart,
  CartAnalyticsStats,
  CartFunnelStage,
  CartTrendPoint,
  CartStatus,
} from '../types/cart';

const STORAGE_KEY = 'buybright_admin_cart_records_v2';

export const INITIAL_CARTS_DATA: AdminCart[] = [
  {
    id: 'CRT-80291',
    customerId: 'CUST-901',
    customerName: '  Rajesh Sharma',
    customerEmail: ' rajesh.sharma@apexdental.in',
    customerPhone: '+91 98201 44521',
    customerAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=60',
    customerType: 'Dentist / Clinic Owner',
    clinicName: 'Apex Dental Care & Implant Center',
    city: 'Mumbai',
    state: 'Maharashtra',
    totalItems: 3,
    totalQuantity: 6,
    cartValue: 48900,
    couponCode: 'PRESTO10',
    couponDiscount: 4890,
    gstTotal: 5281,
    shippingFee: 0,
    finalTotal: 49291,
    cartStatus: 'Abandoned',
    abandonedStep: 'Checkout',
    lastUpdated: '03 Oct 2026, 04:30 PM',
    createdDate: '03 Oct 2026, 11:15 AM',
    lastOutreachSent: '03 Oct 2026, 05:00 PM',
    notes: 'Dropped off at courier shipping calculation page. Followed up on WhatsApp with free express shipping offer.',
    items: [
      {
        id: 'CI-101',
        productId: 'PROD-101',
        productName: 'Woodpecker Endo Radar Plus Brushless Motor',
        productSku: 'WDP-ENDO-PLUS',
        productImage: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=200&auto=format&fit=crop&q=60',
        variantPack: 'Standard Unit with 2 Wireless Contra-angles',
        quantity: 1,
        unitPrice: 42500,
        discountPercent: 10,
        discountAmount: 4250,
        gstRate: 12,
        gstAmount: 4590,
        itemTotal: 42840,
        stockStatus: 'In Stock',
        stockQuantity: 14,
      },
      {
        id: 'CI-102',
        productId: 'PROD-105',
        productName: 'Mani Rotary Niti Dental K-Files Assorted',
        productSku: 'MNI-KFILE-AST',
        productImage: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=200&auto=format&fit=crop&q=60',
        variantPack: 'Pack of 6 (25mm #15-40)',
        quantity: 4,
        unitPrice: 1250,
        discountPercent: 10,
        discountAmount: 500,
        gstRate: 12,
        gstAmount: 540,
        itemTotal: 5040,
        stockStatus: 'In Stock',
        stockQuantity: 65,
      },
      {
        id: 'CI-103',
        productId: 'PROD-108',
        productName: 'Presto Pro EDTA Root Canal Cleansing Gel 17%',
        productSku: 'PRS-EDTA-17',
        productImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=60',
        variantPack: '3ml Syringe x 4 with Applicator Tips',
        quantity: 1,
        unitPrice: 1400,
        discountPercent: 10,
        discountAmount: 140,
        gstRate: 12,
        gstAmount: 151,
        itemTotal: 1411,
        stockStatus: 'In Stock',
        stockQuantity: 110,
      },
    ],
  },
  {
    id: 'CRT-80292',
    customerId: 'CUST-902',
    customerName: '  Priya Patel',
    customerEmail: ' priya.patel@smileart.org',
    customerPhone: '+91 98765 12340',
    customerAvatar: 'https://images.unsplash.com/photo-1594824813576-96a3cb863335?w=120&auto=format&fit=crop&q=60',
    customerType: 'Dentist / Clinic Owner',
    clinicName: 'Smile Art Aesthetic Dental Clinic',
    city: 'Ahmedabad',
    state: 'Gujarat',
    totalItems: 2,
    totalQuantity: 5,
    cartValue: 24800,
    couponCode: 'FESTIVE5',
    couponDiscount: 1240,
    gstTotal: 2827,
    shippingFee: 0,
    finalTotal: 26387,
    cartStatus: 'Active',
    lastUpdated: '03 Oct 2026, 05:22 PM',
    createdDate: '03 Oct 2026, 05:10 PM',
    notes: 'Customer actively browsing additional restorative composite shades.',
    items: [
      {
        id: 'CI-201',
        productId: 'PROD-102',
        productName: 'GC Gold Label IX Extra Glass Ionomer Restorative Pack',
        productSku: 'GC-GL-IX-EXT',
        productImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=60',
        variantPack: '1-1 Package (15g Powder + 6.4ml Liquid)',
        quantity: 3,
        unitPrice: 3450,
        discountPercent: 5,
        discountAmount: 517.5,
        gstRate: 12,
        gstAmount: 1179.9,
        itemTotal: 11012.4,
        stockStatus: 'In Stock',
        stockQuantity: 42,
      },
      {
        id: 'CI-202',
        productId: 'PROD-106',
        productName: '3M ESPE Filtek Z350 XT Universal Restorative Composite',
        productSku: '3M-FLTK-Z350',
        productImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=200&auto=format&fit=crop&q=60',
        variantPack: 'Syringe 4g (Shade A2 Universal Body)',
        quantity: 2,
        unitPrice: 7225,
        discountPercent: 5,
        discountAmount: 722.5,
        gstRate: 12,
        gstAmount: 1647.3,
        itemTotal: 15374.8,
        stockStatus: 'In Stock',
        stockQuantity: 38,
      },
    ],
  },
  {
    id: 'CRT-80293',
    customerId: 'CUST-903',
    customerName: '  Vikramaditya Rao',
    customerEmail: 'v.rao@apollooralhealth.com',
    customerPhone: '+91 99401 77231',
    customerAvatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120&auto=format&fit=crop&q=60',
    customerType: 'Dental Hospital / Chain',
    clinicName: 'Apollo White Dental Multispeciality Hospital',
    city: 'Bengaluru',
    state: 'Karnataka',
    totalItems: 4,
    totalQuantity: 12,
    cartValue: 184500,
    couponCode: 'HOSPITALVIP',
    couponDiscount: 18450,
    gstTotal: 29889,
    shippingFee: 0,
    finalTotal: 195939,
    cartStatus: 'Converted',
    convertedOrderId: 'ORD-2026-9481',
    lastUpdated: '02 Oct 2026, 06:40 PM',
    createdDate: '02 Oct 2026, 02:15 PM',
    notes: 'Converted through GST invoice B2B portal.',
    items: [
      {
        id: 'CI-301',
        productId: 'PROD-103',
        productName: 'NSK Ti-Max Z95L High Speed Optical 1:5 Handpiece',
        productSku: 'NSK-Z95L-OPT',
        productImage: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=200&auto=format&fit=crop&q=60',
        variantPack: 'Optic Quattro Spray with Ceramic Bearings',
        quantity: 2,
        unitPrice: 58000,
        discountPercent: 10,
        discountAmount: 11600,
        gstRate: 18,
        gstAmount: 18792,
        itemTotal: 123192,
        stockStatus: 'Low Stock',
        stockQuantity: 3,
      },
      {
        id: 'CI-302',
        productId: 'PROD-109',
        productName: 'Septodont Septanest 4% Articaine with Epinephrine 1:100k',
        productSku: 'SPT-ART-100K',
        productImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=60',
        variantPack: 'Box of 50 Glass Cartridges (1.7ml)',
        quantity: 10,
        unitPrice: 6850,
        discountPercent: 10,
        discountAmount: 6850,
        gstRate: 12,
        gstAmount: 7398,
        itemTotal: 69048,
        stockStatus: 'In Stock',
        stockQuantity: 80,
      },
    ],
  },
  {
    id: 'CRT-80294',
    customerId: 'CUST-904',
    customerName: '  Ananya Sen',
    customerEmail: 'ananya.sen@pearlsdental.in',
    customerPhone: '+91 97110 33892',
    customerAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&auto=format&fit=crop&q=60',
    customerType: 'Dentist / Clinic Owner',
    clinicName: 'Pearls Dental Lounge',
    city: 'Kolkata',
    state: 'West Bengal',
    totalItems: 2,
    totalQuantity: 8,
    cartValue: 18600,
    couponCode: undefined,
    couponDiscount: 0,
    gstTotal: 2232,
    shippingFee: 250,
    finalTotal: 21082,
    cartStatus: 'Abandoned',
    abandonedStep: 'Payment',
    lastUpdated: '01 Oct 2026, 08:30 PM',
    createdDate: '01 Oct 2026, 08:05 PM',
    lastOutreachSent: '02 Oct 2026, 10:15 AM',
    notes: 'Payment gateway timeout on HDFC Netbanking. WhatsApp recovery coupon dispatched.',
    items: [
      {
        id: 'CI-401',
        productId: 'PROD-104',
        productName: 'Dentsply Sirona ProTaper Gold Rotary Files 25mm',
        productSku: 'DSP-PTG-25MM',
        productImage: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=200&auto=format&fit=crop&q=60',
        variantPack: 'Assorted Pack (SX, S1, S2, F1, F2, F3)',
        quantity: 4,
        unitPrice: 3150,
        discountPercent: 0,
        discountAmount: 0,
        gstRate: 12,
        gstAmount: 1512,
        itemTotal: 14112,
        stockStatus: 'In Stock',
        stockQuantity: 90,
      },
      {
        id: 'CI-402',
        productId: 'PROD-110',
        productName: 'Kerr OptiBond Universal Single-Component Adhesive',
        productSku: 'KRR-OPT-5ML',
        productImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=60',
        variantPack: '5ml Bottle with Micro-applicators',
        quantity: 4,
        unitPrice: 1500,
        discountPercent: 0,
        discountAmount: 0,
        gstRate: 12,
        gstAmount: 720,
        itemTotal: 6720,
        stockStatus: 'In Stock',
        stockQuantity: 45,
      },
    ],
  },
  {
    id: 'CRT-80295',
    customerId: 'CUST-905',
    customerName: '  Rohan Mehra',
    customerEmail: ' rohan.mehra@dentacare.com',
    customerPhone: '+91 98190 66543',
    customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=60',
    customerType: 'Dental Student / Resident',
    clinicName: 'Government Dental College & Hospital',
    city: 'Pune',
    state: 'Maharashtra',
    totalItems: 1,
    totalQuantity: 2,
    cartValue: 7400,
    couponCode: 'STUDENT15',
    couponDiscount: 1110,
    gstTotal: 754.8,
    shippingFee: 150,
    finalTotal: 7194.8,
    cartStatus: 'Expired',
    abandonedStep: 'Cart',
    lastUpdated: '22 Sep 2026, 03:10 PM',
    createdDate: '20 Sep 2026, 10:00 AM',
    notes: 'Student discount cart expired after 7 days of inactivity.',
    items: [
      {
        id: 'CI-501',
        productId: 'PROD-111',
        productName: 'API Stainless Steel Extraction Forceps Upper Molars',
        productSku: 'API-FRCP-UPM',
        productImage: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=200&auto=format&fit=crop&q=60',
        variantPack: 'Pair #17 Upper Left & #18 Upper Right',
        quantity: 2,
        unitPrice: 3700,
        discountPercent: 15,
        discountAmount: 1110,
        gstRate: 12,
        gstAmount: 754.8,
        itemTotal: 7194.8,
        stockStatus: 'In Stock',
        stockQuantity: 25,
      },
    ],
  },
  {
    id: 'CRT-80296',
    customerId: 'CUST-906',
    customerName: '  Meenakshi Sundaram',
    customerEmail: ' meena@chennaidental.in',
    customerPhone: '+91 94440 12890',
    customerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=60',
    customerType: 'Dentist / Clinic Owner',
    clinicName: 'Sundaram Dental Ortho Center',
    city: 'Chennai',
    state: 'Tamil Nadu',
    totalItems: 3,
    totalQuantity: 9,
    cartValue: 62400,
    couponCode: 'PRESTO10',
    couponDiscount: 6240,
    gstTotal: 6739.2,
    shippingFee: 0,
    finalTotal: 62899.2,
    cartStatus: 'Converted',
    convertedOrderId: 'ORD-2026-9320',
    lastUpdated: '02 Oct 2026, 11:45 AM',
    createdDate: '01 Oct 2026, 09:20 PM',
    notes: 'Converted within 12 hours after cart creation.',
    items: [
      {
        id: 'CI-601',
        productId: 'PROD-107',
        productName: 'Ormco Damon Q Self-Ligating Orthodontic Metal Bracket Kit',
        productSku: 'ORM-DAMON-Q',
        productImage: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=200&auto=format&fit=crop&q=60',
        variantPack: 'Full Mouth 5x5 Kit with Hooks on 3,4,5 (0.022 Slot)',
        quantity: 2,
        unitPrice: 24500,
        discountPercent: 10,
        discountAmount: 4900,
        gstRate: 12,
        gstAmount: 5292,
        itemTotal: 49392,
        stockStatus: 'In Stock',
        stockQuantity: 18,
      },
      {
        id: 'CI-602',
        productId: 'PROD-112',
        productName: '3M Unitek Transbond XT Light Cure Orthodontic Adhesive',
        productSku: '3M-TRNS-XT',
        productImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=60',
        variantPack: 'Kit (2 Syringes x 4g + 6ml Primer + Brush Tips)',
        quantity: 3,
        unitPrice: 4466.6,
        discountPercent: 10,
        discountAmount: 1340,
        gstRate: 12,
        gstAmount: 1447.2,
        itemTotal: 13507.2,
        stockStatus: 'In Stock',
        stockQuantity: 30,
      },
    ],
  },
  {
    id: 'CRT-80297',
    customerId: 'CUST-907',
    customerName: '  Farhan Qureshi',
    customerEmail: 'farhan.q@careplusdental.org',
    customerPhone: '+91 99887 55412',
    customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=60',
    customerType: 'Dentist / Clinic Owner',
    clinicName: 'CarePlus Multi-Specialty Dental Clinic',
    city: 'Hyderabad',
    state: 'Telangana',
    totalItems: 1,
    totalQuantity: 1,
    cartValue: 95000,
    couponCode: 'EQUIPMENT5K',
    couponDiscount: 5000,
    gstTotal: 16200,
    shippingFee: 0,
    finalTotal: 106200,
    cartStatus: 'Active',
    lastUpdated: '03 Oct 2026, 04:55 PM',
    createdDate: '03 Oct 2026, 04:30 PM',
    notes: 'Customer inspecting autoclave chamber dimensions and warranty specs.',
    items: [
      {
        id: 'CI-701',
        productId: 'PROD-113',
        productName: 'Runyes 23L Class B Dental Autoclave Sterilizer with Printer',
        productSku: 'RUN-AUTO-23L',
        productImage: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=200&auto=format&fit=crop&q=60',
        variantPack: '23 Litres Medical Grade SS304 Chamber',
        quantity: 1,
        unitPrice: 95000,
        discountPercent: 5.26,
        discountAmount: 5000,
        gstRate: 18,
        gstAmount: 16200,
        itemTotal: 106200,
        stockStatus: 'In Stock',
        stockQuantity: 7,
      },
    ],
  },
  {
    id: 'CRT-80298',
    customerId: 'CUST-908',
    customerName: '  Neha Kulkarni',
    customerEmail: ' neha.kulkarni@dentocare.in',
    customerPhone: '+91 98230 99881',
    customerAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&auto=format&fit=crop&q=60',
    customerType: 'Dentist / Clinic Owner',
    clinicName: 'DentoCare Laser & Implant Center',
    city: 'Nagpur',
    state: 'Maharashtra',
    totalItems: 3,
    totalQuantity: 6,
    cartValue: 33200,
    couponCode: undefined,
    couponDiscount: 0,
    gstTotal: 3984,
    shippingFee: 0,
    finalTotal: 37184,
    cartStatus: 'Abandoned',
    abandonedStep: 'Cart',
    lastUpdated: '01 Oct 2026, 03:20 PM',
    createdDate: '01 Oct 2026, 02:45 PM',
    lastOutreachSent: '02 Oct 2026, 11:00 AM',
    notes: 'Sent automated cart reminder WhatsApp with direct checkout deep-link.',
    items: [
      {
        id: 'CI-801',
        productId: 'PROD-114',
        productName: 'Ivoclar Vivadent Tetric N-Ceram Bulk Fill Composite',
        productSku: 'IVO-TNC-BLK',
        productImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=60',
        variantPack: 'Syringe 3.5g (IVA Universal Enamel)',
        quantity: 3,
        unitPrice: 4200,
        discountPercent: 0,
        discountAmount: 0,
        gstRate: 12,
        gstAmount: 1512,
        itemTotal: 14112,
        stockStatus: 'In Stock',
        stockQuantity: 34,
      },
      {
        id: 'CI-802',
        productId: 'PROD-115',
        productName: 'Waldent Premium Diamond Dental Burs Assorted Crown Prep Kit',
        productSku: 'WLD-BUR-CRN10',
        productImage: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=200&auto=format&fit=crop&q=60',
        variantPack: 'Set of 10 FG Diamond Burs with Autoclavable Bur Block',
        quantity: 3,
        unitPrice: 6866.6,
        discountPercent: 0,
        discountAmount: 0,
        gstRate: 12,
        gstAmount: 2472,
        itemTotal: 23072,
        stockStatus: 'In Stock',
        stockQuantity: 50,
      },
    ],
  },
  {
    id: 'CRT-80299',
    customerId: 'CUST-909',
    customerName: 'Shri Balaji Dental Supplies Wholesale',
    customerEmail: 'orders@balajidentalsupply.com',
    customerPhone: '+91 98410 77112',
    customerType: 'Wholesale / Dealer',
    clinicName: 'Balaji Dental Trade Corporation',
    city: 'Jaipur',
    state: 'Rajasthan',
    totalItems: 5,
    totalQuantity: 45,
    cartValue: 342000,
    couponCode: 'BULKDEALER12',
    couponDiscount: 41040,
    gstTotal: 42134.4,
    shippingFee: 0,
    finalTotal: 343094.4,
    cartStatus: 'Converted',
    convertedOrderId: 'ORD-2026-9218',
    lastUpdated: '30 Sep 2026, 05:00 PM',
    createdDate: '30 Sep 2026, 11:30 AM',
    notes: 'Bulk purchase dispatched via commercial transport.',
    items: [
      {
        id: 'CI-901',
        productId: 'PROD-102',
        productName: 'GC Gold Label IX Extra Glass Ionomer Restorative Pack',
        productSku: 'GC-GL-IX-EXT',
        productImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=60',
        variantPack: '1-1 Package (Master Carton of 20 Units)',
        quantity: 20,
        unitPrice: 3200,
        discountPercent: 12,
        discountAmount: 7680,
        gstRate: 12,
        gstAmount: 6758.4,
        itemTotal: 63078.4,
        stockStatus: 'In Stock',
        stockQuantity: 42,
      },
    ],
  },
  {
    id: 'CRT-80300',
    customerId: 'CUST-910',
    customerName: '  Sameer Deshmukh',
    customerEmail: 'sameer.d@deshmukhdental.com',
    customerPhone: '+91 97654 33210',
    customerAvatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120&auto=format&fit=crop&q=60',
    customerType: 'Dentist / Clinic Owner',
    clinicName: 'Deshmukh Super-Specialty Dental Clinic',
    city: 'Nashik',
    state: 'Maharashtra',
    totalItems: 2,
    totalQuantity: 4,
    cartValue: 16500,
    couponCode: 'SAVE500',
    couponDiscount: 500,
    gstTotal: 1920,
    shippingFee: 0,
    finalTotal: 17920,
    cartStatus: 'Abandoned',
    abandonedStep: 'Checkout',
    lastUpdated: '03 Oct 2026, 01:10 PM',
    createdDate: '03 Oct 2026, 12:45 PM',
    lastOutreachSent: '03 Oct 2026, 02:00 PM',
    notes: 'Exited on Address confirmation step.',
    items: [
      {
        id: 'CI-1001',
        productId: 'PROD-105',
        productName: 'Mani Rotary Niti Dental K-Files Assorted',
        productSku: 'MNI-KFILE-AST',
        productImage: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=200&auto=format&fit=crop&q=60',
        variantPack: 'Pack of 6 (25mm #15-40)',
        quantity: 2,
        unitPrice: 1250,
        discountPercent: 3.03,
        discountAmount: 75.7,
        gstRate: 12,
        gstAmount: 290.9,
        itemTotal: 2715.2,
        stockStatus: 'In Stock',
        stockQuantity: 65,
      },
      {
        id: 'CI-1002',
        productId: 'PROD-106',
        productName: '3M ESPE Filtek Z350 XT Universal Restorative Composite',
        productSku: '3M-FLTK-Z350',
        productImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=200&auto=format&fit=crop&q=60',
        variantPack: 'Syringe 4g (Shade A3 Body)',
        quantity: 2,
        unitPrice: 7000,
        discountPercent: 3.03,
        discountAmount: 424.3,
        gstRate: 12,
        gstAmount: 1629.1,
        itemTotal: 15204.8,
        stockStatus: 'In Stock',
        stockQuantity: 38,
      },
    ],
  },
];

/**
 * Retrieve all cart records from localStorage or initial dataset
 */
export const getCarts = (): AdminCart[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CARTS_DATA));
      return INITIAL_CARTS_DATA;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CARTS_DATA;
  }
};

/**
 * Persist cart records to localStorage
 */
export const saveCarts = (carts: AdminCart[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carts));
  } catch (err) {
    console.error('Failed to save carts into storage:', err);
  }
};

/**
 * Retrieve single cart by ID
 */
export const getCartById = (id: string): AdminCart | undefined => {
  const list = getCarts();
  return list.find((c) => c.id === id);
};

/**
 * Update cart status
 */
export const updateCartStatus = (id: string, status: CartStatus): AdminCart[] => {
  const list = getCarts();
  const updated = list.map((c) =>
    c.id === id ? { ...c, cartStatus: status, lastUpdated: new Date().toLocaleString() } : c
  );
  saveCarts(updated);
  return updated;
};

/**
 * Record outreach timestamp
 */
export const recordCartOutreach = (id: string, note?: string): AdminCart[] => {
  const list = getCarts();
  const nowStr = new Date().toLocaleString();
  const updated = list.map((c) => {
    if (c.id === id) {
      return {
        ...c,
        lastOutreachSent: nowStr,
        notes: note ? `${c.notes ? c.notes + ' | ' : ''}${note}` : c.notes,
      };
    }
    return c;
  });
  saveCarts(updated);
  return updated;
};

/**
 * Calculate KPI summary statistics
 */
export const getCartAnalyticsStats = (carts: AdminCart[] = getCarts()): CartAnalyticsStats => {
  const totalCarts = carts.length;
  const activeCarts = carts.filter((c) => c.cartStatus === 'Active').length;
  const abandonedCarts = carts.filter((c) => c.cartStatus === 'Abandoned').length;
  const convertedCarts = carts.filter((c) => c.cartStatus === 'Converted').length;
  const expiredCarts = carts.filter((c) => c.cartStatus === 'Expired').length;

  const totalValue = carts.reduce((acc, c) => acc + c.cartValue, 0);
  const averageCartValue = totalCarts > 0 ? Math.round(totalValue / totalCarts) : 0;

  const totalPotentialRevenue = carts
    .filter((c) => c.cartStatus === 'Abandoned' || c.cartStatus === 'Active')
    .reduce((acc, c) => acc + c.cartValue, 0);

  const totalRecoveredRevenue = carts
    .filter((c) => c.cartStatus === 'Converted')
    .reduce((acc, c) => acc + c.cartValue, 0);

  const conversionRate = totalCarts > 0 ? Math.round((convertedCarts / totalCarts) * 100) : 0;
  const abandonmentRate = totalCarts > 0 ? Math.round((abandonedCarts / totalCarts) * 100) : 0;

  return {
    totalCarts,
    activeCarts,
    abandonedCarts,
    convertedCarts,
    expiredCarts,
    averageCartValue,
    totalPotentialRevenue,
    totalRecoveredRevenue,
    conversionRate,
    abandonmentRate,
  };
};

/**
 * Main Conversion Funnel Data: Cart → Checkout → Order
 */
export const getCartFunnelData = (carts: AdminCart[] = getCarts()): CartFunnelStage[] => {
  const totalCreated = carts.length || 1;
  const reachedCheckout = carts.filter(
    (c) => c.cartStatus === 'Converted' || c.abandonedStep === 'Checkout' || c.abandonedStep === 'Payment'
  ).length;
  const completedOrder = carts.filter((c) => c.cartStatus === 'Converted').length;

  const dropAfterCart = totalCreated - reachedCheckout;
  const dropAfterCheckout = reachedCheckout - completedOrder;

  return [
    {
      stage: 'Cart Created',
      count: totalCreated,
      percentage: 100,
      dropOffCount: dropAfterCart,
      dropOffPercentage: Math.round((dropAfterCart / totalCreated) * 100),
      description: 'Customer added items to cart and commenced session',
      color: '#0d9488',
      icon: 'fa-cart-shopping',
    },
    {
      stage: 'Checkout Started',
      count: reachedCheckout,
      percentage: Math.round((reachedCheckout / totalCreated) * 100),
      dropOffCount: dropAfterCheckout,
      dropOffPercentage: reachedCheckout > 0 ? Math.round((dropAfterCheckout / reachedCheckout) * 100) : 0,
      description: 'Proceeded to address & logistics verification',
      color: '#0284c7',
      icon: 'fa-truck-fast',
    },
    {
      stage: 'Order Placed',
      count: completedOrder,
      percentage: Math.round((completedOrder / totalCreated) * 100),
      dropOffCount: 0,
      dropOffPercentage: 0,
      description: 'Successfully converted & paid invoice generated',
      color: '#10b981',
      icon: 'fa-circle-check',
    },
  ];
};

/**
 * Dynamic Multi-Timeframe Trend Dataset (7 Days, 30 Days, 3 Months, 1 Year)
 */
export const getCartTrendData = (timeframe: '7d' | '30d' | '3m' | '1y'): CartTrendPoint[] => {
  switch (timeframe) {
    case '7d':
      return [
        { date: '27 Sep', label: 'Day 1 (Fri)', total: 14, active: 4, abandoned: 6, converted: 4, avgValue: 22400 },
        { date: '28 Sep', label: 'Day 2 (Sat)', total: 19, active: 5, abandoned: 9, converted: 5, avgValue: 26100 },
        { date: '29 Sep', label: 'Day 3 (Sun)', total: 16, active: 3, abandoned: 8, converted: 5, avgValue: 19800 },
        { date: '30 Sep', label: 'Day 4 (Mon)', total: 24, active: 7, abandoned: 10, converted: 7, avgValue: 31200 },
        { date: '01 Oct', label: 'Day 5 (Tue)', total: 28, active: 8, abandoned: 13, converted: 7, avgValue: 28500 },
        { date: '02 Oct', label: 'Day 6 (Wed)', total: 32, active: 10, abandoned: 14, converted: 8, avgValue: 34100 },
        { date: '03 Oct', label: 'Day 7 (Today)', total: 36, active: 12, abandoned: 15, converted: 9, avgValue: 35800 },
      ];
    case '30d':
      return [
        { date: '05 Sep', label: 'Week 1', total: 64, active: 18, abandoned: 28, converted: 18, avgValue: 24100 },
        { date: '12 Sep', label: 'Week 2', total: 78, active: 22, abandoned: 36, converted: 20, avgValue: 27500 },
        { date: '19 Sep', label: 'Week 3', total: 92, active: 26, abandoned: 41, converted: 25, avgValue: 29800 },
        { date: '26 Sep', label: 'Week 4', total: 110, active: 32, abandoned: 48, converted: 30, avgValue: 32400 },
        { date: '03 Oct', label: 'Week 5', total: 135, active: 42, abandoned: 55, converted: 38, avgValue: 34900 },
      ];
    case '3m':
      return [
        { date: 'Jul 2026', label: 'July', total: 240, active: 68, abandoned: 112, converted: 60, avgValue: 23200 },
        { date: 'Aug 2026', label: 'August', total: 310, active: 89, abandoned: 138, converted: 83, avgValue: 26800 },
        { date: 'Sep 2026', label: 'September', total: 385, active: 115, abandoned: 165, converted: 105, avgValue: 31500 },
        { date: 'Oct 2026', label: 'October (MTD)', total: 142, active: 44, abandoned: 58, converted: 40, avgValue: 34200 },
      ];
    case '1y':
      return [
        { date: 'Q4 2025', label: 'Q4 2025', total: 650, active: 180, abandoned: 310, converted: 160, avgValue: 21500 },
        { date: 'Q1 2026', label: 'Q1 2026', total: 780, active: 215, abandoned: 365, converted: 200, avgValue: 24900 },
        { date: 'Q2 2026', label: 'Q2 2026', total: 920, active: 260, abandoned: 420, converted: 240, avgValue: 28400 },
        { date: 'Q3 2026', label: 'Q3 2026', total: 1140, active: 320, abandoned: 510, converted: 310, avgValue: 32700 },
      ];
    default:
      return [];
  }
};

export interface ProductConversionRow {
  productId: string;
  productName: string;
  productSku: string;
  productImage: string;
  unitPrice: number;
  addedToCartCount: number;
  convertedCount: number;
  abandonedCount: number;
  conversionRate: number;
}

/**
 * Product-Level Cart vs Converted vs Abandoned Conversion Table Breakdown
 */
export const getProductConversionBreakdown = (carts: AdminCart[] = getCarts()): ProductConversionRow[] => {
  const map = new Map<string, ProductConversionRow>();

  carts.forEach((cart) => {
    cart.items.forEach((item) => {
      const key = item.productId;
      if (!map.has(key)) {
        map.set(key, {
          productId: item.productId,
          productName: item.productName,
          productSku: item.productSku,
          productImage: item.productImage,
          unitPrice: item.unitPrice,
          addedToCartCount: item.quantity,
          convertedCount: cart.cartStatus === 'Converted' ? item.quantity : 0,
          abandonedCount: cart.cartStatus === 'Abandoned' || cart.cartStatus === 'Expired' ? item.quantity : 0,
          conversionRate: 0,
        });
      } else {
        const row = map.get(key)!;
        row.addedToCartCount += item.quantity;
        if (cart.cartStatus === 'Converted') {
          row.convertedCount += item.quantity;
        } else if (cart.cartStatus === 'Abandoned' || cart.cartStatus === 'Expired') {
          row.abandonedCount += item.quantity;
        }
      }
    });
  });

  return Array.from(map.values())
    .map((row) => ({
      ...row,
      conversionRate:
        row.addedToCartCount > 0 ? Math.round((row.convertedCount / row.addedToCartCount) * 100) : 0,
    }))
    .sort((a, b) => b.addedToCartCount - a.addedToCartCount);
};
