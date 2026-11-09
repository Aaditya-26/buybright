/**
 * BuyBright Admin — Wishlist Data Store & Mock Management.
 * Manages customer saved items, stock availability demand, and promotional offers with localStorage persistence.
 */

import { AdminWishlistItem, WishlistStats, WishlistConversionStatus, WishlistNotificationStatus } from '../../types/wishlist';

const STORAGE_KEY = 'buybright_admin_wishlist_records_v2';

export const INITIAL_WISHLIST_DATA: AdminWishlistItem[] = [
  {
    id: 'WSH-1001',
    customerId: 'CUST-801',
    customerName: '  Rajesh Sharma',
    customerEmail: ' rajesh.sharma@apexdental.in',
    customerPhone: '+91 98201 44521',
    customerAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=60',
    clinicName: 'Apex Dental Care & Implant Center',
    productId: 'PROD-101',
    productName: 'Woodpecker Endo Radar Plus Brushless Motor',
    productSku: 'WDP-ENDO-PLUS',
    productCategory: 'Endodontics',
    productPrice: 42500,
    productMrp: 48000,
    productImage: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=200&auto=format&fit=crop&q=60',
    stockStatus: 'In Stock',
    stockQuantity: 14,
    dateAdded: '03 Oct 2026, 11:20 AM',
    status: 'In Wishlist',
    notifiedStatus: 'Offer Sent',
    offerDetails: {
      discountPercent: 8,
      couponCode: 'WISHLIST8',
      sentDate: '03 Oct 2026, 01:45 PM',
      customNote: 'Special 8% festive discount applied for Woodpecker Endo series.',
    },
    notes: '  Rajesh is looking for bundle offer with reciprocating files.',
  },
  {
    id: 'WSH-1002',
    customerId: 'CUST-802',
    customerName: '  Priya Patel',
    customerEmail: ' priya.patel@smileart.org',
    customerPhone: '+91 98765 12340',
    customerAvatar: 'https://images.unsplash.com/photo-1594824813576-96a3cb863335?w=120&auto=format&fit=crop&q=60',
    clinicName: 'Smile Art Aesthetic Dental Clinic',
    productId: 'PROD-102',
    productName: 'GC Gold Label IX Extra Glass Ionomer Restorative Pack',
    productSku: 'GC-GL-IX-EXT',
    productCategory: 'Materials',
    productPrice: 3450,
    productMrp: 3900,
    productImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=60',
    stockStatus: 'In Stock',
    stockQuantity: 42,
    dateAdded: '02 Oct 2026, 04:15 PM',
    status: 'Moved to Cart',
    notifiedStatus: 'None',
    notes: 'Moved to cart during Diwali festival flash sale.',
  },
  {
    id: 'WSH-1003',
    customerId: 'CUST-803',
    customerName: '  Amitav Mukherjee',
    customerEmail: 'amitav.ortho@mukherjeedental.com',
    customerPhone: '+91 94330 89123',
    customerAvatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120&auto=format&fit=crop&q=60',
    clinicName: 'Mukherjee Orthodontic Center',
    productId: 'PROD-103',
    productName: '3M RelyX U200 Self-Adhesive Resin Cement Automix',
    productSku: '3M-RELYX-U200',
    productCategory: 'Materials',
    productPrice: 6850,
    productMrp: 7500,
    productImage: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=200&auto=format&fit=crop&q=60',
    stockStatus: 'Low Stock',
    stockQuantity: 3,
    dateAdded: '01 Oct 2026, 02:40 PM',
    status: 'In Wishlist',
    notifiedStatus: 'Restock Alert Sent',
    offerDetails: {
      sentDate: '02 Oct 2026, 10:00 AM',
      customNote: 'Low stock alert sent (only 3 units left in warehouse).',
    },
    notes: 'Customer requested notification before stock runs out.',
  },
  {
    id: 'WSH-1004',
    customerId: 'CUST-804',
    customerName: '  Neha Kulkarni',
    customerEmail: 'neha.kulkarni@perfectsmile.in',
    customerPhone: '+91 99224 55678',
    customerAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&auto=format&fit=crop&q=60',
    clinicName: 'Perfect Smile Multi-Specialty Dental',
    productId: 'PROD-104',
    productName: 'Dentsply Protaper Gold Rotary Files 25mm Assorted',
    productSku: 'DNT-PROT-GOLD',
    productCategory: 'Endodontics',
    productPrice: 2890,
    productMrp: 3200,
    productImage: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=200&auto=format&fit=crop&q=60',
    stockStatus: 'In Stock',
    stockQuantity: 65,
    dateAdded: '30 Sep 2026, 09:10 AM',
    status: 'Purchased',
    notifiedStatus: 'Offer Sent',
    offerDetails: {
      discountPercent: 5,
      couponCode: 'ENDO5',
      sentDate: '30 Sep 2026, 11:30 AM',
    },
    notes: 'Converted to purchase via Order #ORD-9821.',
  },
  {
    id: 'WSH-1005',
    customerId: 'CUST-805',
    customerName: '  Vikramaditya Rao',
    customerEmail: ' vikram.rao@royalident.com',
    customerPhone: '+91 98450 77112',
    customerAvatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=120&auto=format&fit=crop&q=60',
    clinicName: 'Royal Ident Maxillofacial Hospital',
    productId: 'PROD-105',
    productName: 'Ivoclar Bluephase PowerCure LED Curing Light',
    productSku: 'IVC-BLUPH-PWR',
    productCategory: 'Equipment',
    productPrice: 78000,
    productMrp: 85000,
    productImage: 'https://images.unsplash.com/photo-1583912267670-6575ad31804b?w=200&auto=format&fit=crop&q=60',
    stockStatus: 'Out of Stock',
    stockQuantity: 0,
    dateAdded: '29 Sep 2026, 06:50 PM',
    status: 'In Wishlist',
    notifiedStatus: 'None',
    notes: 'Awaiting container shipment from Ivoclar Europe warehouse.',
  },
  {
    id: 'WSH-1006',
    customerId: 'CUST-806',
    customerName: '  Shalini Deshmukh',
    customerEmail: 'shalini.deshmukh@dentovision.co.in',
    customerPhone: '+91 97654 32189',
    customerAvatar: 'https://images.unsplash.com/photo-1594824813576-96a3cb863335?w=120&auto=format&fit=crop&q=60',
    clinicName: 'DentoVision Micro-Endo Clinic',
    productId: 'PROD-106',
    productName: 'Kerr OptiBond Universal Single-Component Adhesive',
    productSku: 'KRR-OPTIB-UNIV',
    productCategory: 'Consumables',
    productPrice: 4100,
    productMrp: 4600,
    productImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=60',
    stockStatus: 'In Stock',
    stockQuantity: 28,
    dateAdded: '28 Sep 2026, 03:30 PM',
    status: 'In Wishlist',
    notifiedStatus: 'Offer Sent',
    offerDetails: {
      discountPercent: 10,
      couponCode: 'ADHESIVE10',
      sentDate: '29 Sep 2026, 12:00 PM',
      customNote: '10% discount on orders containing 2 or more bottles.',
    },
    notes: 'Followed up via WhatsApp regarding bulk clinic requirement.',
  },
  {
    id: 'WSH-1007',
    customerId: 'CUST-807',
    customerName: '  Harish Chawla',
    customerEmail: 'chawla.ortho@delhidental.org',
    customerPhone: '+91 98110 65432',
    clinicName: 'Delhi Central Orthodontic Hub',
    productId: 'PROD-107',
    productName: 'Ormco Damon Q2 Self-Ligating Metal Brackets System',
    productSku: 'ORM-DAMON-Q2',
    productCategory: 'Orthodontics',
    productPrice: 18500,
    productMrp: 21000,
    productImage: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=200&auto=format&fit=crop&q=60',
    stockStatus: 'In Stock',
    stockQuantity: 18,
    dateAdded: '27 Sep 2026, 01:15 PM',
    status: 'Moved to Cart',
    notifiedStatus: 'None',
    notes: 'Customer comparing Roth 0.022 vs MBT prescription.',
  },
  {
    id: 'WSH-1008',
    customerId: 'CUST-808',
    customerName: '  Ananya Sen',
    customerEmail: 'ananya.sen@sensmilecare.com',
    customerPhone: '+91 93310 45678',
    customerAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&auto=format&fit=crop&q=60',
    clinicName: 'Sen Smile Care Clinic',
    productId: 'PROD-108',
    productName: 'W&H Synea Vision Dental Turbine Handpiece with LED',
    productSku: 'WNH-SYN-VIS',
    productCategory: 'Equipment',
    productPrice: 32000,
    productMrp: 36000,
    productImage: 'https://images.unsplash.com/photo-1583912267670-6575ad31804b?w=200&auto=format&fit=crop&q=60',
    stockStatus: 'Low Stock',
    stockQuantity: 2,
    dateAdded: '26 Sep 2026, 10:45 AM',
    status: 'In Wishlist',
    notifiedStatus: 'None',
    notes: '  Ananya requested demo before purchase.',
  },
  {
    id: 'WSH-1009',
    customerId: 'CUST-809',
    customerName: '  Farhan Qureshi',
    customerEmail: ' farhan@qureshidental.in',
    customerPhone: '+91 97112 34567',
    clinicName: 'Qureshi Advanced Implantology Studio',
    productId: 'PROD-109',
    productName: 'Osstem TS III SA Implant Fixture Kit',
    productSku: 'OSS-TS3-KIT',
    productCategory: 'Implants',
    productPrice: 54000,
    productMrp: 60000,
    productImage: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=200&auto=format&fit=crop&q=60',
    stockStatus: 'In Stock',
    stockQuantity: 12,
    dateAdded: '25 Sep 2026, 05:20 PM',
    status: 'In Wishlist',
    notifiedStatus: 'Offer Sent',
    offerDetails: {
      discountPercent: 12,
      couponCode: 'IMPLANT12',
      sentDate: '26 Sep 2026, 03:00 PM',
      customNote: '12% discount offered on surgical kit bundle.',
    },
    notes: 'Looking for 3.5mm and 4.0mm diameter fixtures.',
  },
  {
    id: 'WSH-1010',
    customerId: 'CUST-810',
    customerName: '  Sunita Iyer',
    customerEmail: 'sunita.iyer@chennaidental.in',
    customerPhone: '+91 94440 12345',
    customerAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=60',
    clinicName: 'Chennai Smiles Dental Care',
    productId: 'PROD-110',
    productName: 'Mani K-Files Stainless Steel 25mm Assorted 15-40',
    productSku: 'MNI-KFILE-25',
    productCategory: 'Endodontics',
    productPrice: 380,
    productMrp: 450,
    productImage: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=200&auto=format&fit=crop&q=60',
    stockStatus: 'In Stock',
    stockQuantity: 120,
    dateAdded: '24 Sep 2026, 08:30 AM',
    status: 'Purchased',
    notifiedStatus: 'None',
    notes: 'Purchased 20 boxes in bulk order #ORD-9804.',
  },
];

/**
 * Retrieve all wishlist items from localStorage (or seed default if empty).
 */
export const getWishlistItems = (): AdminWishlistItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_WISHLIST_DATA));
      return INITIAL_WISHLIST_DATA;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_WISHLIST_DATA;
  } catch {
    return INITIAL_WISHLIST_DATA;
  }
};

/**
 * Persist wishlist items to localStorage.
 */
export const saveWishlistItems = (items: AdminWishlistItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save wishlist items to storage', err);
  }
};

/**
 * Update conversion status of a wishlist item.
 */
export const updateWishlistItemStatus = (
  id: string,
  newStatus: WishlistConversionStatus,
  notes?: string
): AdminWishlistItem[] => {
  const current = getWishlistItems();
  const updated = current.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        status: newStatus,
        ...(notes !== undefined ? { notes } : {}),
      };
    }
    return item;
  });
  saveWishlistItems(updated);
  return updated;
};

/**
 * Send marketing discount offer / coupon to customer for saved wishlist item.
 */
export const sendWishlistOffer = (
  id: string,
  discountPercent: number,
  couponCode: string,
  customNote?: string
): AdminWishlistItem[] => {
  const current = getWishlistItems();
  const updated = current.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        notifiedStatus: 'Offer Sent' as WishlistNotificationStatus,
        offerDetails: {
          discountPercent,
          couponCode: couponCode.toUpperCase().trim(),
          sentDate: new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          customNote,
        },
      };
    }
    return item;
  });
  saveWishlistItems(updated);
  return updated;
};

/**
 * Delete a wishlist item record.
 */
export const deleteWishlistItem = (id: string): AdminWishlistItem[] => {
  const current = getWishlistItems();
  const updated = current.filter((item) => item.id !== id);
  saveWishlistItems(updated);
  return updated;
};

/**
 * Compute key performance statistics from wishlist items.
 */
export const getWishlistStats = (items: AdminWishlistItem[]): WishlistStats => {
  const totalItems = items.length;
  const uniqueCustomerSet = new Set(items.map((i) => i.customerId || i.customerEmail));
  const uniqueCustomers = uniqueCustomerSet.size;

  const totalValue = items.reduce((sum, item) => sum + (item.productPrice || 0), 0);

  let inStockCount = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;
  let inWishlistCount = 0;
  let movedToCartCount = 0;
  let purchasedCount = 0;
  let offersSentCount = 0;
  const categoryCounts: Record<string, number> = {};

  items.forEach((item) => {
    if (item.stockStatus === 'In Stock') inStockCount++;
    else if (item.stockStatus === 'Low Stock') lowStockCount++;
    else if (item.stockStatus === 'Out of Stock') outOfStockCount++;

    if (item.status === 'In Wishlist') inWishlistCount++;
    else if (item.status === 'Moved to Cart') movedToCartCount++;
    else if (item.status === 'Purchased') purchasedCount++;

    if (item.notifiedStatus === 'Offer Sent' || item.notifiedStatus === 'Restock Alert Sent') {
      offersSentCount++;
    }

    const cat = item.productCategory || 'Other';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  return {
    totalItems,
    uniqueCustomers,
    totalValue,
    inStockCount,
    lowStockCount,
    outOfStockCount,
    inWishlistCount,
    movedToCartCount,
    purchasedCount,
    offersSentCount,
    categoryCounts,
  };
};
