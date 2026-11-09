/**
 * BuyBright User Profile Page View.
 * Implements the exact requested structural hierarchy with complete responsive design:
 * 
 * Profile
 * ├── Profile Overview (Customer Name, Customer Type, Email, Mobile, Account Status)
 * ├── My Orders (Total Orders, Processing, Delivered, Cancelled)
 * ├── Quick Actions (My Orders, Wishlist, Saved Addresses, Download Invoices, Reorder)
 * ├── Business Information (Clinic / Business Name, Customer Type, GSTIN, Billing Info)
 * ├── Saved Addresses (Billing Address, Shipping Address)
 * ├── Account Preferences (Email Notifications, WhatsApp Updates, Order Notifications)
 * └── Security (Change Password, Logout)
 * 
 * Interactive Modals & Actions:
 * - Order Tracking Modal with step-by-step dispatch timeline
 * - Tax-compliant GST Invoice Modal (printable / downloadable)
 * - Invoices Central Hub (Bulk/individual invoice downloads)
 * - Product Review & 5-Star Rating Modal for Delivered Orders
 * - Quick Reorder System
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/common/ProductCard';
import { SEO } from '../components/common/SEO';

export type ReturnTimelineStage =
  | 'Return Requested'
  | 'Return Approved'
  | 'Pickup Scheduled'
  | 'Product Picked Up'
  | 'Product Received'
  | 'Product Inspected'
  | 'Refund Initiated'
  | 'Refund Completed'
  | 'Return Rejected';

export interface ReturnRequestData {
  returnId: string;
  orderId: string;
  itemSku: string;
  itemName: string;
  itemPrice: number;
  returnQty: number;
  maxQty: number;
  reason: string;
  details: string;
  images: string[];
  requestedDate: string;
  currentStageIndex: number;
  status: ReturnTimelineStage;
  isRejected?: boolean;
  rejectReason?: string;
  refundAmount: number;
  refundMethod: string;
  pickupAddress: string;
}

export const RETURN_TIMELINE_STAGES = [
  {
    title: 'Return Requested',
    desc: 'Your return request has been submitted and is currently under review.',
    icon: 'fa-regular fa-clipboard',
  },
  {
    title: 'Return Approved',
    desc: 'Your return request has been approved. Pickup details will be provided shortly.',
    icon: 'fa-solid fa-check-double',
  },
  {
    title: 'Pickup Scheduled',
    desc: 'Your product pickup has been scheduled.',
    icon: 'fa-solid fa-calendar-check',
  },
  {
    title: 'Product Picked Up',
    desc: 'Your product has been picked up and is on its way to our facility.',
    icon: 'fa-solid fa-truck-ramp-box',
  },
  {
    title: 'Product Received',
    desc: 'We have received your returned product and will inspect it shortly.',
    icon: 'fa-solid fa-box-open',
  },
  {
    title: 'Product Inspected',
    desc: 'Your returned product is currently being inspected.',
    icon: 'fa-solid fa-microscope',
  },
  {
    title: 'Refund Initiated',
    desc: 'Your refund has been initiated to your original payment method.',
    icon: 'fa-solid fa-hand-holding-dollar',
  },
  {
    title: 'Refund Completed',
    desc: 'Your refund has been successfully processed.',
    icon: 'fa-solid fa-circle-check',
  },
];

export const RETURN_REASONS = [
  'Damaged Product',
  'Defective Product',
  'Wrong Product Received',
  'Product Does Not Match the Description',
  'Missing Items or Accessories',
  'Incorrect Quantity Received',
  'Other',
];

export const SAMPLE_RETURN_PHOTOS = [
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80',
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=500&q=80',
];

interface OrderItem {
  name: string;
  sku: string;
  hsn: string;
  qty: number;
  rate: number;
  amount: number;
  image?: string;
  category?: string;
  status?: 'Active' | 'Cancelled';
  returnStatus?: ReturnTimelineStage;
  returnId?: string;
}

interface OrderRecord {
  id: string;
  date: string;
  deliveredDate?: string;
  status: 'Processing' | 'Delivered' | 'Cancelled';
  statusColor: string;
  trackingNo: string;
  courier: string;
  items: OrderItem[];
  taxableValue: number;
  gstAmount: number;
  total: number;
  invoiceNo: string;
  hasReview?: boolean;
  userRating?: number;
  userReviewText?: string;
  isReturnEligible?: boolean;
  ineligibleReason?: string;
  returnStatus?: ReturnTimelineStage;
  returnId?: string;
  returnDecision?: 'Accepted' | 'Rejected' | 'Under Review';
  isReordered?: boolean;
  reorderedDate?: string;
}

const INDIAN_STATES = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

export const UserProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const { addToCart } = useCart();
  const { wishlist, clearWishlist, wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Active navigation section/tab
  const [activeSection, setActiveSection] = useState<
    'overview' | 'orders' | 'wishlist' | 'addresses' | 'preferences' | 'security'
  >('overview');

  // Orders Filter State (All, Processing, Delivered, Cancelled, Reorder)
  const [orderFilter, setOrderFilter] = useState<'All' | 'Processing' | 'Delivered' | 'Cancelled' | 'Reorder'>('All');

  // 1. Profile Overview State
  const [profileOverview, setProfileOverview] = useState({
    customerName: user?.name || 'Aaditya Sharma',
    customerType: user?.role === 'seller' ? 'Seller Account' : user?.role === 'admin' ? 'Administrator' : 'Verified Customer',
    registrationNo: 'BB-USR-48291',
    email: user?.email || 'customer@buybright.com',
    mobile: user?.phone || '9820123456',
    accountStatus: user?.isVerified ? 'Active & Verified' : 'Active & Verified',
  });
  const [isEditingOverview, setIsEditingOverview] = useState(false);

  // Sync when user changes
  useEffect(() => {
    if (user) {
      setProfileOverview((prev) => ({
        ...prev,
        customerName: user.name,
        customerType: user.role === 'seller' ? 'Seller Account' : user.role === 'admin' ? 'Administrator' : 'Verified Customer',
        registrationNo: prev.registrationNo || 'BB-USR-48291',
        email: user.email,
        mobile: user.phone,
      }));
      if (user.clinicName || (user as any).businessName) {
        setBusinessInfo((prev) => ({
          ...prev,
          businessName: user.clinicName || (user as any).businessName || prev.businessName,
        }));
      }
    }
  }, [user]);

  // 2. Practice & Business Credentials for Invoices & Receipts
  const [businessInfo, setBusinessInfo] = useState({
    businessName: 'Prime Retail Hub',
    customerType: 'Retail Business Buyer',
    gstin: '27AAACD9910Q1ZS',
    billingInfo: 'Flat 402, Skyline Residency, Central MIDC Road, Andheri East, Mumbai, Maharashtra - 400069',
  });

  // 3. Saved Addresses State
  const [addresses, setAddresses] = useState({
    billingAddress: {
      fullName: 'Aaditya Sharma',
      clinicName: 'Prime Retail Hub',
      street: 'Flat 402, Skyline Residency, Central MIDC Road, Andheri East',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400069',
      phone: '9820123456',
    },
    shippingAddress: {
      fullName: 'Aaditya Sharma',
      clinicName: 'Prime Retail Hub',
      street: 'Flat 402, Skyline Residency, Central MIDC Road, Andheri East',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400069',
      phone: '9820123456',
    },
  });
  const [isEditingAddresses, setIsEditingAddresses] = useState(false);

  // 4. Account Preferences State
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    whatsappUpdates: true,
    orderNotifications: true,
  });

  // 5. Security & Password State
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  // 6. Orders Data
  const [orders, setOrders] = useState<OrderRecord[]>([
    {
      id: '#ORD1001',
      invoiceNo: 'PSD-108254',
      date: '13 Sep 2026',
      deliveredDate: '15 Sep 2026',
      status: 'Delivered',
      statusColor: '#10b981',
      trackingNo: 'BD-EXP-9921001',
      courier: 'BlueDart Healthcare Logistics',
      taxableValue: 8836,
      gstAmount: 0,
      total: 8836,
      isReturnEligible: true,
      isReordered: true,
      reorderedDate: '16 Sep 2026',
      items: [
        { name: 'Sure Endo Gutta Percha 6% - 20', sku: 'SE-GP-20', hsn: '30064000', qty: 2, rate: 499, amount: 998, category: 'Endodontics' },
        { name: 'Sure Endo Gutta Percha 6% - 25', sku: 'SE-GP-25', hsn: '30064000', qty: 3, rate: 499, amount: 1497, category: 'Endodontics' },
        { name: 'Sure Endo Gutta Percha 6% - 30', sku: 'SE-GP-30', hsn: '30064000', qty: 1, rate: 499, amount: 499, category: 'Endodontics' },
        { name: 'Sure Endo Gutta Percha 6% - 35', sku: 'SE-GP-35', hsn: '30064000', qty: 1, rate: 499, amount: 499, category: 'Endodontics' },
        { name: 'Tropicalgin', sku: 'ZRM-TRP-453', hsn: '30064000', qty: 2, rate: 395, amount: 790, category: 'Prosthodontics' },
        { name: 'Wizdent Secure GIC Lute RMGI', sku: 'WZD-GIC-LUTE', hsn: '30064000', qty: 1, rate: 2659, amount: 2659, category: 'Endodontics' },
        { name: 'Mani k files 21mm - #6', sku: 'MNI-KF-06', hsn: '90184900', qty: 2, rate: 186, amount: 372, category: 'Endodontics' },
        { name: 'Mani k files 21mm - #8', sku: 'MNI-KF-08', hsn: '90184900', qty: 2, rate: 186, amount: 372, category: 'Endodontics' },
        { name: 'Mani k files 21mm - #10', sku: 'MNI-KF-10', hsn: '90184900', qty: 2, rate: 186, amount: 372, category: 'Endodontics' },
        { name: 'Mani k files 21mm - #15', sku: 'MNI-KF-15', hsn: '90184900', qty: 5, rate: 186, amount: 930, category: 'Endodontics' },
        { name: 'Mani k files 21mm - #20', sku: 'MNI-KF-20', hsn: '90184900', qty: 1, rate: 186, amount: 186, category: 'Endodontics' },
      ],
    },
    {
      id: 'PD-ORD-894210',
      invoiceNo: 'INV-2026-89421',
      date: '10 Sep 2026',
      status: 'Processing',
      statusColor: '#0284c7',
      trackingNo: 'BD-EXP-8890214',
      courier: 'BlueDart Cold-Chain Express Air',
      taxableValue: 7161,
      gstAmount: 1289,
      total: 8450,
      items: [
        { name: 'Superendo Gold Rotary Files (6 Pk - Assorted)', sku: 'SE-GLD-25', hsn: '90184900', qty: 2, rate: 2450, amount: 4900 },
        { name: '3M Filtek Z350 XT Universal Restorative Composite (4g A2)', sku: '3M-FLT-A2', hsn: '30064000', qty: 2, rate: 1775, amount: 3550 },
      ],
    },
    {
      id: 'PD-ORD-887120',
      invoiceNo: 'INV-2026-88712',
      date: '02 Sep 2026',
      deliveredDate: '04 Sep 2026',
      status: 'Delivered',
      statusColor: '#10b981',
      trackingNo: 'BD-EXP-7729104',
      courier: 'BlueDart Express Healthcare Logistics',
      taxableValue: 4762,
      gstAmount: 858,
      total: 5620,
      hasReview: true,
      userRating: 5,
      userReviewText: 'Exceptional adhesion and glass ionomer consistency. Arrived in perfect temperature packaging.',
      isReturnEligible: true,
      returnStatus: 'Return Requested',
      returnId: 'RET1001',
      isReordered: true,
      reorderedDate: '08 Sep 2026',
      items: [
        { name: 'GC Fuji IX GP Extra Glass Ionomer Restorative (Box of 50 Capsules)', sku: 'GC-FJ9-50', hsn: '30064000', qty: 1, rate: 4120, amount: 4120, returnStatus: 'Return Requested', returnId: 'RET1001' },
        { name: 'Mani Diamond Burs Friction Grip Round End (Pack of 10)', sku: 'MNI-BR-10', hsn: '90184900', qty: 1, rate: 1500, amount: 1500 },
      ],
    },
    {
      id: 'PD-ORD-871900',
      invoiceNo: 'INV-2026-87190',
      date: '18 Aug 2026',
      deliveredDate: '20 Aug 2026',
      status: 'Delivered',
      statusColor: '#10b981',
      trackingNo: 'BD-EXP-6638109',
      courier: 'BlueDart Express Healthcare Logistics',
      taxableValue: 8305,
      gstAmount: 1495,
      total: 9800,
      hasReview: false,
      isReturnEligible: false,
      ineligibleReason: 'This product cannot be returned based on our return policy.',
      items: [
        { name: 'Ivoclar Vivadent Tetric N-Ceram Syringes Kit (A1, A2, A3)', sku: 'IVO-TNC-3', hsn: '30064000', qty: 1, rate: 6800, amount: 6800 },
        { name: 'Microshield Medical Nitrile Examination Gloves (Box of 100)', sku: 'MS-NTRL-100', hsn: '40151900', qty: 3, rate: 1000, amount: 3000 },
      ],
    },
    {
      id: 'PD-ORD-854120',
      invoiceNo: 'INV-2026-85412',
      date: '05 Jul 2026',
      status: 'Cancelled',
      statusColor: '#cf4032',
      trackingNo: 'N/A',
      courier: 'N/A',
      taxableValue: 2712,
      gstAmount: 488,
      total: 3200,
      items: [
        { name: 'Dental Air Motor Handpiece Standard External Spray (4-Hole)', sku: 'HP-AM-04', hsn: '90184900', qty: 1, rate: 3200, amount: 3200 },
      ],
    },
  ]);

  // Real-time Order Counts & Metrics
  const orderStats = {
    totalOrders: orders.length,
    processing: orders.filter((o) => o.status === 'Processing').length,
    delivered: orders.filter((o) => o.status === 'Delivered').length,
    cancelled: orders.filter((o) => o.status === 'Cancelled').length,
    reordered: orders.filter((o) => Boolean(o.isReordered)).length,
  };

  // Filtered Orders based on active KPI card or filter tab
  const filteredOrders = orders.filter((ord) => {
    if (orderFilter === 'All') return true;
    if (orderFilter === 'Reorder') return Boolean(ord.isReordered);
    return ord.status === orderFilter;
  });

  // Modals state
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<OrderRecord | null>(null);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<OrderRecord | null>(null);
  const [activeReviewOrder, setActiveReviewOrder] = useState<OrderRecord | null>(null);
  const [showInvoicesHubModal, setShowInvoicesHubModal] = useState(false);
  const reviewModalBodyRef = useRef<HTMLDivElement>(null);

  // Review Form State
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewHoverRating, setReviewHoverRating] = useState<number>(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [recommendProduct, setRecommendProduct] = useState<boolean>(true);

  // =========================================================================
  // PRODUCT RETURN FLOW STATE & REPOSITORY
  // =========================================================================
  const [activeReturnOrder, setActiveReturnOrder] = useState<OrderRecord | null>(null);
  const [returnStep, setReturnStep] = useState<1 | 2 | 3 | 'success'>(1);
  const [selectedReturnSku, setSelectedReturnSku] = useState<string>('');
  const [returnQty, setReturnQty] = useState<number>(1);
  const [returnReason, setReturnReason] = useState<string>('Damaged Product');
  const [returnDetails, setReturnDetails] = useState<string>('');
  const [eligibilityConfirmed, setEligibilityConfirmed] = useState<boolean>(true);
  const [submittedReturnId, setSubmittedReturnId] = useState<string>('RET1001');

  // Order Details Modal ([View Order])
  const [activeViewOrder, setActiveViewOrder] = useState<OrderRecord | null>(null);

  // Return Policy Explainer Modal ([View Return Policy])
  const [showReturnPolicyModal, setShowReturnPolicyModal] = useState<boolean>(false);

  // Product-wise Reorder Handler
  const handleReorderItem = (item: OrderItem) => {
    addToCart(
      {
        id: item.sku || `pd-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: item.name,
        price: item.rate,
        image: item.image || '/images/cat_instruments_1787401955005.jpg',
        brand: 'BuyBright',
        category: 'Restorative & Instruments',
        in_stock: true,
        is_bestseller: false,
        rating: 4.8,
        reviews_count: 12,
      },
      item.qty || 1
    );
    showToast(`✓ Added "${item.name}" (Qty: ${item.qty}) to cart for reorder!`, 'success');
  };

  // Full Order Reorder Handler (repeats entire order and marks as Reordered)
  const handleReorderEntireOrder = (order: OrderRecord) => {
    const activeItems = order.items.filter((i) => i.status !== 'Cancelled');
    activeItems.forEach((it) => handleReorderItem(it));
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, isReordered: true, reorderedDate: today } : o))
    );
    showToast(`✓ Reordered entire ${order.id} (${activeItems.length} supplies added to cart)!`, 'success');
  };

  // Running Order: Product-wise Cancel Handler
  const handleCancelOrderItem = (orderId: string, itemSku: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((ord) => {
        if (ord.id !== orderId) return ord;
        const updatedItems = ord.items.map((it) => {
          if (it.sku === itemSku || it.name === itemSku) {
            return { ...it, status: 'Cancelled' as const };
          }
          return it;
        });
        const allCancelled = updatedItems.every((it) => it.status === 'Cancelled');
        return {
          ...ord,
          items: updatedItems,
          status: allCancelled ? ('Cancelled' as const) : ord.status,
          statusColor: allCancelled ? '#cf4032' : ord.statusColor,
        };
      })
    );
    showToast(`✓ Item "${itemSku}" has been cancelled from Order #${orderId}.`, 'info');
  };

  // Handler: Start Return Flow for an Order (product-wise)
  const handleInitiateReturn = (order: OrderRecord, preselectedSku?: string) => {
    setActiveReturnOrder(order);
    const chosenSku =
      preselectedSku ||
      (order.items && order.items.length > 0
        ? (order.items.find((it) => !it.returnStatus)?.sku || order.items[0].sku)
        : '');
    setSelectedReturnSku(chosenSku);
    const chosenItem = order.items.find((i) => i.sku === chosenSku) || order.items[0];
    setReturnQty(chosenItem ? chosenItem.qty : 1);
    setReturnReason('Damaged Product');
    setReturnDetails('');
    setEligibilityConfirmed(true);
    // Directly start on Reason & Details step (no redundant multi-select screen)
    setReturnStep(2);
  };

  // Handler: Submit Return Request
  const handleSubmitReturnRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReturnOrder) return;

    const selectedItem =
      activeReturnOrder.items.find((i) => i.sku === selectedReturnSku) || activeReturnOrder.items[0];

    // Generate clean Return Request ID
    const newReturnId = activeReturnOrder.id.includes('1001')
      ? 'RET1001'
      : `RET${activeReturnOrder.id.replace('#', '').replace('PD-ORD-', '')}`;

    // Update order status and product return status in orders state
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== activeReturnOrder.id) return o;
        const updatedItems = o.items.map((it) =>
          it.sku === selectedReturnSku
            ? { ...it, returnStatus: 'Return Requested' as const, returnId: newReturnId }
            : it
        );
        return {
          ...o,
          returnStatus: 'Return Requested' as const,
          returnId: newReturnId,
          items: updatedItems,
        };
      })
    );

    setSubmittedReturnId(newReturnId);
    setReturnStep('success');
    showToast(`✓ Return request ${newReturnId} for "${selectedItem.name}" submitted successfully!`, 'success');
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'My Profile & Account | BuyBright';
  }, []);

  // When review modal opens, automatically scroll up to the top
  useEffect(() => {
    if (activeReviewOrder && reviewModalBodyRef.current) {
      reviewModalBodyRef.current.scrollTop = 0;
    }
  }, [activeReviewOrder]);

  // Sync active section from URL query params (e.g. ?tab=wishlist or ?tab=orders or ?tab=reorder)
  useEffect(() => {
    const tabParam = searchParams.get('tab') || searchParams.get('section');
    if (tabParam === 'reorder') {
      setActiveSection('orders');
      setOrderFilter('Reorder');
    } else if (
      tabParam &&
      ['overview', 'orders', 'wishlist', 'addresses', 'preferences', 'security'].includes(tabParam)
    ) {
      setActiveSection(tabParam as any);
      if (tabParam === 'orders' && orderFilter === 'Reorder') {
        setOrderFilter('All');
      }
    }
  }, [searchParams]);

  const handleAddAllWishlistToCart = () => {
    if (wishlist.length === 0) return;
    wishlist.forEach((prod) => addToCart(prod, 1));
    showToast(`✓ Added all ${wishlist.length} saved wishlist products to your cart!`, 'success');
  };

  const handleClearWishlist = () => {
    clearWishlist();
    showToast('Your wishlist has been cleared.', 'info');
  };

  const handleSaveOverview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileOverview.registrationNo || !profileOverview.registrationNo.trim()) {
      showToast('Registration Number is mandatory. Please enter your valid registration no.', 'danger');
      return;
    }
    setIsEditingOverview(false);
    showToast('✓ Profile Overview updated successfully!', 'success');
  };

  const handleSaveAddresses = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingAddresses(false);
    showToast('✓ Saved Addresses updated successfully!', 'success');
  };

  const handleTogglePreference = (key: keyof typeof preferences) => {
    setPreferences((prev) => {
      const nextVal = !prev[key];
      showToast(`✓ Preference updated: ${key} is now ${nextVal ? 'ON' : 'OFF'}`, 'info');
      return { ...prev, [key]: nextVal };
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!securityForm.currentPassword || !securityForm.newPassword) {
      showToast('Please enter both current and new password.', 'danger');
      return;
    }
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      showToast('New passwords do not match. Please re-enter.', 'danger');
      return;
    }
    setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    showToast('✓ Password changed successfully!', 'success');
  };

  const handleLogout = () => {
    logout();
    showToast('You have been logged out safely.', 'info');
    navigate('/login');
  };

  const handleOpenReviewModal = (order: OrderRecord) => {
    setActiveReviewOrder(order);
    setReviewRating(order.userRating || 5);
    setReviewTitle(order.hasReview ? 'Product Evaluation' : '');
    setReviewComment(order.userReviewText || '');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReviewOrder) return;
    if (!reviewComment.trim()) {
      showToast('Please write a brief product experience review.', 'danger');
      return;
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === activeReviewOrder.id
          ? {
            ...o,
            hasReview: true,
            userRating: reviewRating,
            userReviewText: reviewComment,
          }
          : o
      )
    );

    showToast(`✓ Thank you! Your ${reviewRating}-star review for ${activeReviewOrder.id} has been submitted.`, 'success');
    setActiveReviewOrder(null);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="user-profile-page-wrapper">
      <SEO
        title="My Profile &amp; Account"
        description="Manage your BuyBright marketplace account, recent orders, downloaded tax invoices, and shipping addresses."
        canonicalUrl="https://buybright.com/profile"
      />
      {/* Top Breadcrumb Bar */}
      <div className="profile-breadcrumb-bar">
        <div className="profile-container">
          <nav className="profile-breadcrumb" aria-label="Breadcrumb">
            <Link to="/" className="breadcrumb-link">
              <i className="fa-solid fa-house" />
              <span>Home</span>
            </Link>
            <i className="fa-solid fa-chevron-right breadcrumb-separator" />
            <span className="breadcrumb-active">User Profile</span>
          </nav>
        </div>
      </div>

      {/* Profile Panoramic Hero Banner */}
      <section className="profile-hero-section">
        <div className="banner-ambient-glow glow-1" />
        <div className="banner-ambient-glow glow-2" />

        <div className="profile-container">
          <div className="profile-hero-card">
            <div className="doctor-avatar-col">
              <div className="doctor-avatar-circle">
                <i className="fa-solid fa-user-circle" />
              </div>
              <span className="tier-badge">
                <i className="fa-solid fa-circle-check text-teal" /> {profileOverview.accountStatus}
              </span>
            </div>

            <div className="doctor-info-col">
              <div className="name-status-row">
                <h1 className="doctor-name">{profileOverview.customerName || 'User Name'}</h1>
                <span className="type-pill">{profileOverview.customerType}</span>
              </div>

              <div className="doctor-meta-line">
                <span className="email-txt"><i className="fa-regular fa-envelope text-teal" /> {profileOverview.email}</span>
                <span className="meta-separator">•</span>
                <span className="mobile-txt"><i className="fa-solid fa-phone text-teal" /> +91 {profileOverview.mobile}</span>
                {profileOverview.registrationNo && (
                  <>
                    <span className="meta-separator">•</span>
                    <span className="reg-txt"><i className="fa-solid fa-id-card text-teal" /> ID: {profileOverview.registrationNo}</span>
                  </>
                )}
              </div>

              <div className="clinic-headline">
                <i className="fa-solid fa-building text-teal" />
                <strong>{businessInfo.businessName}</strong>
              </div>
            </div>

            <div className="hero-action-col">
              <button
                type="button"
                className="btn-quick-reorder-hero"
                onClick={() => {
                  setActiveSection('orders');
                  setOrderFilter('Reorder');
                }}
              >
                <i className="fa-solid fa-rotate-right" />
                <span>Quick Reorder</span>
              </button>
              <Link to="/shop" className="btn-quick-order">
                <i className="fa-solid fa-bag-shopping" />
                <span>Shop Supplies</span>
              </Link>
              <button type="button" className="btn-logout-hero" onClick={handleLogout}>
                <i className="fa-solid fa-arrow-right-from-bracket" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Profile Layout */}
      <section className="profile-main-section">
        <div className="profile-container">
          <div className="profile-layout-grid">
            {/* Left Navigation Sidebar */}
            <aside className="profile-sidebar-card">
              <div className="sidebar-nav-list">
                <button
                  type="button"
                  className={`sidebar-nav-btn ${activeSection === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveSection('overview')}
                >
                  <i className="fa-solid fa-id-badge" />
                  <span>Profile Overview</span>
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-btn ${activeSection === 'orders' && orderFilter !== 'Reorder' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSection('orders');
                    if (orderFilter === 'Reorder') setOrderFilter('All');
                  }}
                >
                  <i className="fa-solid fa-box-open" />
                  <span>My Orders</span>
                  <span className="badge-count">{orderStats.totalOrders}</span>
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-btn ${activeSection === 'orders' && orderFilter === 'Reorder' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSection('orders');
                    setOrderFilter('Reorder');
                  }}
                >
                  <i className="fa-solid fa-rotate-right" />
                  <span>Reordered Orders</span>
                  <span className="badge-count reorder-badge">{orderStats.reordered}</span>
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-btn ${activeSection === 'wishlist' ? 'active' : ''}`}
                  onClick={() => setActiveSection('wishlist')}
                >
                  <i className="fa-solid fa-heart" />
                  <span>Saved Wishlist</span>
                  <span className="badge-count wishlist-count">{wishlistCount}</span>
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-btn ${activeSection === 'addresses' ? 'active' : ''}`}
                  onClick={() => setActiveSection('addresses')}
                >
                  <i className="fa-solid fa-location-dot" />
                  <span>Saved Addresses</span>
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-btn ${activeSection === 'preferences' ? 'active' : ''}`}
                  onClick={() => setActiveSection('preferences')}
                >
                  <i className="fa-solid fa-sliders" />
                  <span>Account Preferences</span>
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-btn ${activeSection === 'security' ? 'active' : ''}`}
                  onClick={() => setActiveSection('security')}
                >
                  <i className="fa-solid fa-shield-halved" />
                  <span>Security &amp; Logout</span>
                </button>

                <button
                  type="button"
                  className="sidebar-logout-btn"
                  onClick={handleLogout}
                  title="Logout from Account"
                >
                  <i className="fa-solid fa-arrow-right-from-bracket" />
                  <span>Logout Account</span>
                </button>
              </div>
            </aside>

            {/* Right Main Content Pane */}
            <main className="profile-content-pane">
              {/* SECTION 1: Profile Overview */}
              {activeSection === 'overview' && (
                <div className="profile-card-content">
                  <div className="pane-header-row">
                    <div>
                      <h2 className="pane-title">Profile Overview</h2>
                      <p className="pane-subtitle">Manage your personal details and primary account contact credentials.</p>
                    </div>
                    {!isEditingOverview ? (
                      <button type="button" className="btn-pane-edit" onClick={() => setIsEditingOverview(true)}>
                        <i className="fa-solid fa-pen-to-square" /> Edit Overview
                      </button>
                    ) : (
                      <span className="editing-mode-badge">
                        <i className="fa-solid fa-circle-dot" /> Editing Active
                      </span>
                    )}
                  </div>

                  {!isEditingOverview ? (
                    <div className="profile-overview-matrix">
                      <div className="overview-section-card">
                        <div className="overview-card-head">
                          <i className="fa-solid fa-user-gear text-teal" />
                          <h3>Primary Account Details</h3>
                        </div>
                        <div className="overview-data-grid">
                          <div className="data-item">
                            <span className="data-label">Account / User ID:</span>
                            <strong className="data-val text-teal">
                              <i className="fa-solid fa-id-card" style={{ marginRight: '6px' }} />
                              {profileOverview.registrationNo || 'Not Provided'}
                            </strong>
                          </div>

                          <div className="data-item">
                            <span className="data-label">Customer Name:</span>
                            <strong className="data-val">{profileOverview.customerName || 'N/A'}</strong>
                          </div>

                          <div className="data-item">
                            <span className="data-label">Customer Type:</span>
                            <strong className="data-val text-teal">{profileOverview.customerType || 'N/A'}</strong>
                          </div>

                          <div className="data-item">
                            <span className="data-label">Email Address:</span>
                            <strong className="data-val">{profileOverview.email || 'N/A'}</strong>
                          </div>

                          <div className="data-item">
                            <span className="data-label">Mobile Number:</span>
                            <strong className="data-val">{profileOverview.mobile ? `+91 ${profileOverview.mobile}` : 'N/A'}</strong>
                          </div>

                          <div className="data-item full-width">
                            <span className="data-label">Account Status:</span>
                            <strong className="data-val text-green">
                              <i className="fa-solid fa-circle-check" /> {profileOverview.accountStatus}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveOverview} className="profile-details-form">
                      <div className="form-group">
                        <label htmlFor="registrationNo">Account / User ID*</label>
                        <input
                          type="text"
                          id="registrationNo"
                          name="registrationNo"
                          placeholder="e.g. BB-USR-48291 or Business ID"
                          value={profileOverview.registrationNo}
                          onChange={(e) => setProfileOverview({ ...profileOverview, registrationNo: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-row-2">
                        <div className="form-group">
                          <label htmlFor="customerName">Customer Name <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 400 }}>(Optional)</span></label>
                          <input
                            type="text"
                            id="customerName"
                            name="customerName"
                            placeholder="e.g. John Doe"
                            value={profileOverview.customerName}
                            onChange={(e) => setProfileOverview({ ...profileOverview, customerName: e.target.value })}
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="customerType">Customer Type <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 400 }}>(Optional)</span></label>
                          <select
                            id="customerType"
                            name="customerType"
                            value={profileOverview.customerType}
                            onChange={(e) => setProfileOverview({ ...profileOverview, customerType: e.target.value })}
                          >
                            <option value="Verified Customer">Verified Customer</option>
                            <option value="Seller Account">Seller Account</option>
                            <option value="Business Buyer">Business Buyer</option>
                            <option value="Administrator">Administrator</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-row-2">
                        <div className="form-group">
                          <label htmlFor="email">Email Address <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 400 }}>(Optional)</span></label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="e.g. user@buybright.com"
                            value={profileOverview.email}
                            onChange={(e) => setProfileOverview({ ...profileOverview, email: e.target.value })}
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="mobile">Mobile Number <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 400 }}>(Optional)</span></label>
                          <input
                            type="tel"
                            id="mobile"
                            name="mobile"
                            placeholder="e.g. 9876543210 (10 digits)"
                            value={profileOverview.mobile}
                            onChange={(e) => setProfileOverview({ ...profileOverview, mobile: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="form-actions-bar">
                        <button type="button" className="btn-cancel" onClick={() => setIsEditingOverview(false)}>
                          Cancel
                        </button>
                        <button type="submit" className="btn-save-profile">
                          <i className="fa-solid fa-floppy-disk" /> Save Profile
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* SECTION 2: My Orders */}
              {activeSection === 'orders' && (
                <div className="profile-card-content orders-pane-content">
                  <div className="pane-header-row">
                    <div>
                      <h2 className="pane-title">My Orders</h2>
                      <p className="pane-subtitle">Live status, tax invoices, reorders, and product reviews.</p>
                    </div>
                    <button
                      type="button"
                      className="btn-pane-download-all"
                      onClick={() => setShowInvoicesHubModal(true)}
                    >
                      <i className="fa-solid fa-file-invoice-dollar" /> Invoices Hub
                    </button>
                  </div>

                  {/* 4 Interactive Order KPI Cards */}
                  <div className="order-kpi-grid">
                    {/* Card 1: All Orders */}
                    <div
                      className={`order-kpi-card card-all ${orderFilter === 'All' ? 'active' : ''}`}
                      onClick={() => setOrderFilter('All')}
                      role="button"
                      tabIndex={0}
                      title="Filter: Show All Orders"
                    >
                      <div className="kpi-card-header">
                        <div className="kpi-icon-wrap all-icon">
                          <i className="fa-solid fa-boxes-stacked" />
                        </div>
                        <span className="kpi-badge all-badge">All Orders</span>
                      </div>
                      <div className="kpi-card-body">
                        <span className="kpi-val">{orderStats.totalOrders}</span>
                        <strong className="kpi-label">Total Orders</strong>
                        <span className="kpi-sub">Lifetime dental orders</span>
                      </div>
                      {orderFilter === 'All' && <div className="kpi-active-indicator" />}
                    </div>

                    {/* Card 2: Running / Processing */}
                    <div
                      className={`order-kpi-card card-processing ${orderFilter === 'Processing' ? 'active' : ''}`}
                      onClick={() => setOrderFilter('Processing')}
                      role="button"
                      tabIndex={0}
                      title="Filter: Show Running / Processing Orders"
                    >
                      <div className="kpi-card-header">
                        <div className="kpi-icon-wrap processing-icon">
                          <i className="fa-solid fa-truck-fast" />
                        </div>
                        <span className="kpi-badge processing-badge">
                          <span className="live-dot" /> Running
                        </span>
                      </div>
                      <div className="kpi-card-body">
                        <span className="kpi-val text-blue">{orderStats.processing}</span>
                        <strong className="kpi-label">Running Orders</strong>
                        <span className="kpi-sub">In-transit &amp; packaging</span>
                      </div>
                      {orderFilter === 'Processing' && <div className="kpi-active-indicator" />}
                    </div>

                    {/* Card 3: Delivered */}
                    <div
                      className={`order-kpi-card card-delivered ${orderFilter === 'Delivered' ? 'active' : ''}`}
                      onClick={() => setOrderFilter('Delivered')}
                      role="button"
                      tabIndex={0}
                      title="Filter: Show Delivered Orders"
                    >
                      <div className="kpi-card-header">
                        <div className="kpi-icon-wrap delivered-icon">
                          <i className="fa-solid fa-circle-check" />
                        </div>
                        <span className="kpi-badge delivered-badge">Delivered</span>
                      </div>
                      <div className="kpi-card-body">
                        <span className="kpi-val text-green">{orderStats.delivered}</span>
                        <strong className="kpi-label">Delivered</strong>
                        <span className="kpi-sub">Verified dispatches</span>
                      </div>
                      {orderFilter === 'Delivered' && <div className="kpi-active-indicator" />}
                    </div>

                    {/* Card 4: Cancelled */}
                    <div
                      className={`order-kpi-card card-cancelled ${orderFilter === 'Cancelled' ? 'active' : ''}`}
                      onClick={() => setOrderFilter('Cancelled')}
                      role="button"
                      tabIndex={0}
                      title="Filter: Show Cancelled Orders"
                    >
                      <div className="kpi-card-header">
                        <div className="kpi-icon-wrap cancelled-icon">
                          <i className="fa-solid fa-circle-xmark" />
                        </div>
                        <span className="kpi-badge cancelled-badge">Cancelled</span>
                      </div>
                      <div className="kpi-card-body">
                        <span className="kpi-val text-coral">{orderStats.cancelled}</span>
                        <strong className="kpi-label">Cancelled</strong>
                        <span className="kpi-sub">Voided / Refunded</span>
                      </div>
                      {orderFilter === 'Cancelled' && <div className="kpi-active-indicator" />}
                    </div>

                    {/* Card 5: Reordered Orders */}
                    <div
                      className={`order-kpi-card card-reorder ${orderFilter === 'Reorder' ? 'active' : ''}`}
                      onClick={() => setOrderFilter('Reorder')}
                      role="button"
                      tabIndex={0}
                      title="Filter: Reordered Orders"
                    >
                      <div className="kpi-card-header">
                        <div className="kpi-icon-wrap reorder-icon">
                          <i className="fa-solid fa-rotate-right" />
                        </div>
                        <span className="kpi-badge reorder-badge">
                          <i className="fa-solid fa-repeat" /> Reordered
                        </span>
                      </div>
                      <div className="kpi-card-body">
                        <span className="kpi-val text-teal">{orderStats.reordered}</span>
                        <strong className="kpi-label">Reordered</strong>
                        <span className="kpi-sub">Previously repeated orders</span>
                      </div>
                      {orderFilter === 'Reorder' && <div className="kpi-active-indicator" />}
                    </div>
                  </div>

                  {/* Filter Pills Bar & Counter */}
                  <div className="orders-filter-strip">
                    <div className="filter-pills-group">
                      <button
                        type="button"
                        className={`filter-pill-btn ${orderFilter === 'All' ? 'active' : ''}`}
                        onClick={() => setOrderFilter('All')}
                      >
                        <i className="fa-solid fa-boxes-stacked" />
                        <span>All Orders</span>
                        <span className="pill-badge">{orderStats.totalOrders}</span>
                      </button>

                      <button
                        type="button"
                        className={`filter-pill-btn processing ${orderFilter === 'Processing' ? 'active' : ''}`}
                        onClick={() => setOrderFilter('Processing')}
                      >
                        <i className="fa-solid fa-truck-fast" />
                        <span>Running / Processing</span>
                        <span className="pill-badge">{orderStats.processing}</span>
                      </button>

                      <button
                        type="button"
                        className={`filter-pill-btn delivered ${orderFilter === 'Delivered' ? 'active' : ''}`}
                        onClick={() => setOrderFilter('Delivered')}
                      >
                        <i className="fa-solid fa-circle-check" />
                        <span>Delivered</span>
                        <span className="pill-badge">{orderStats.delivered}</span>
                      </button>

                      <button
                        type="button"
                        className={`filter-pill-btn cancelled ${orderFilter === 'Cancelled' ? 'active' : ''}`}
                        onClick={() => setOrderFilter('Cancelled')}
                      >
                        <i className="fa-solid fa-circle-xmark" />
                        <span>Cancelled</span>
                        <span className="pill-badge">{orderStats.cancelled}</span>
                      </button>

                      <button
                        type="button"
                        className={`filter-pill-btn reorder ${orderFilter === 'Reorder' ? 'active' : ''}`}
                        onClick={() => setOrderFilter('Reorder')}
                      >
                        <i className="fa-solid fa-rotate-right" />
                        <span>Reordered</span>
                        <span className="pill-badge">{orderStats.reordered}</span>
                      </button>
                    </div>

                    <div className="filter-summary-txt">
                      Showing <strong>{filteredOrders.length}</strong> {filteredOrders.length === 1 ? 'order' : 'orders'}
                      {orderFilter !== 'All' && (
                        <button
                          type="button"
                          className="btn-clear-filter"
                          onClick={() => setOrderFilter('All')}
                          title="Clear filter and show all"
                        >
                          Clear filter <i className="fa-solid fa-xmark" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Orders List / Empty State */}
                  {filteredOrders.length === 0 ? (
                    <div className="orders-empty-state">
                      <div className="empty-state-icon">
                        <i className={orderFilter === 'Reorder' ? 'fa-solid fa-rotate-right' : 'fa-solid fa-box-open'} />
                      </div>
                      <h3 className="empty-state-title">
                        {orderFilter === 'Reorder' ? 'No Reordered Orders Found' : `No ${orderFilter} Orders Found`}
                      </h3>
                      <p className="empty-state-desc">
                        {orderFilter === 'Reorder'
                          ? 'You have not reordered any orders yet. When you click "Reorder All" on any completed order, it will appear here.'
                          : `There are currently no orders under the "${orderFilter}" category in your account history.`}
                      </p>
                      <button
                        type="button"
                        className="btn-show-all-orders"
                        onClick={() => setOrderFilter('All')}
                      >
                        <i className="fa-solid fa-boxes-stacked" /> View All Orders ({orderStats.totalOrders})
                      </button>
                    </div>
                  ) : (
                    <div className="orders-list-wrapper">
                      {filteredOrders.map((order) => (
                        <div key={order.id} className="order-item-card">
                          {/* Order Header */}
                          <div className="order-top-bar">
                            <div className="order-ident">
                              <strong className="order-id-txt">{order.id}</strong>
                              {order.isReordered && (
                                <span
                                  className="reorder-tag-badge"
                                  title={order.reorderedDate ? `Reordered on ${order.reorderedDate}` : 'Reordered order'}
                                >
                                  <i className="fa-solid fa-rotate-right" /> Reordered
                                </span>
                              )}
                              <span className="order-date-txt">Placed on {order.date}</span>
                            </div>
                            <div
                              className="order-status-pill"
                              style={{
                                color: order.statusColor,
                                borderColor: `${order.statusColor}40`,
                                background: `${order.statusColor}12`,
                              }}
                            >
                              <i className="fa-solid fa-circle-dot" />
                              <span>{order.status}</span>
                            </div>
                          </div>

                          {/* Desktop View: Order Items Table (>= 769px) */}
                          <div className="order-items-table-wrap">
                            <table className="order-items-table">
                              <thead>
                                <tr>
                                  <th>Item Description</th>
                                  <th>SKU</th>
                                  <th>Qty</th>
                                  <th>Price</th>
                                  <th style={{ textAlign: 'right' }}>Total</th>
                                  <th style={{ textAlign: 'center' }}>Item Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.items.map((item, idx) => (
                                  <tr key={idx} style={{ opacity: item.status === 'Cancelled' ? 0.65 : 1 }}>
                                    <td>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                        <span className="item-name-txt" style={{ textDecoration: item.status === 'Cancelled' ? 'line-through' : 'none' }}>
                                          {item.name}
                                        </span>
                                        {item.status === 'Cancelled' && (
                                          <span
                                            style={{
                                              background: '#fee2e2',
                                              color: '#dc2626',
                                              fontSize: '0.72rem',
                                              fontWeight: 800,
                                              padding: '2px 8px',
                                              borderRadius: '12px',
                                              border: '1px solid #fca5a5',
                                              display: 'inline-flex',
                                              alignItems: 'center',
                                              gap: '4px',
                                            }}
                                          >
                                            <i className="fa-solid fa-ban" /> Cancelled
                                          </span>
                                        )}
                                      </div>
                                      <span className="item-hsn-txt">HSN: {item.hsn}</span>
                                    </td>
                                    <td><span className="sku-badge">{item.sku}</span></td>
                                    <td>{item.qty}</td>
                                    <td>₹{item.rate.toLocaleString()}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 700 }}>₹{item.amount.toLocaleString()}</td>
                                    <td style={{ textAlign: 'center' }}>
                                      <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                                        {/* Product-wise Reorder Button */}
                                        <button
                                          type="button"
                                          className="btn-item-action-reorder"
                                          onClick={() => handleReorderItem(item)}
                                          style={{
                                            background: '#f0fdfa',
                                            color: '#0f766e',
                                            border: '1px solid #99f6e4',
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            fontSize: '0.78rem',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            whiteSpace: 'nowrap',
                                          }}
                                          title={`Reorder ${item.name}`}
                                        >
                                          <i className="fa-solid fa-rotate-right" /> Reorder
                                        </button>

                                        {/* Running Order -> Product-wise Cancel Button */}
                                        {order.status === 'Processing' && item.status !== 'Cancelled' && (
                                          <button
                                            type="button"
                                            className="btn-item-action-cancel"
                                            onClick={() => handleCancelOrderItem(order.id, item.sku)}
                                            style={{
                                              background: '#fff1f2',
                                              color: '#e11d48',
                                              border: '1px solid #fecdd3',
                                              padding: '4px 10px',
                                              borderRadius: '6px',
                                              fontSize: '0.78rem',
                                              fontWeight: 700,
                                              cursor: 'pointer',
                                              display: 'inline-flex',
                                              alignItems: 'center',
                                              gap: '4px',
                                              whiteSpace: 'nowrap',
                                            }}
                                            title={`Cancel ${item.name} from this order`}
                                          >
                                            <i className="fa-solid fa-xmark" /> Cancel
                                          </button>
                                        )}

                                        {/* Delivered Order -> Product-wise Return Button or Return Status Badge */}
                                        {order.status === 'Delivered' && (
                                          item.returnStatus ? (
                                            <span
                                              style={{
                                                background: '#fef3c7',
                                                color: '#b45309',
                                                border: '1px solid #fde68a',
                                                padding: '3px 8px',
                                                borderRadius: '6px',
                                                fontSize: '0.74rem',
                                                fontWeight: 700,
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                whiteSpace: 'nowrap',
                                              }}
                                              title={`Return: ${item.returnStatus} (${item.returnId || ''})`}
                                            >
                                              <i className="fa-regular fa-clock" /> {item.returnStatus}
                                            </span>
                                          ) : order.isReturnEligible !== false ? (
                                            <button
                                              type="button"
                                              className="btn-item-action-return"
                                              onClick={() => handleInitiateReturn(order, item.sku)}
                                              style={{
                                                background: '#fff7ed',
                                                color: '#c2410c',
                                                border: '1px solid #fed7aa',
                                                padding: '4px 10px',
                                                borderRadius: '6px',
                                                fontSize: '0.78rem',
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                whiteSpace: 'nowrap',
                                              }}
                                              title={`Return ${item.name}`}
                                            >
                                              <i className="fa-solid fa-rotate-left" /> Return
                                            </button>
                                          ) : null
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Mobile View: Order Items Card Layout (< 769px) */}
                          <div className="order-items-mobile-cards">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="order-item-mobile-card" style={{ opacity: item.status === 'Cancelled' ? 0.65 : 1 }}>
                                <div className="mob-card-head">
                                  <div className="mob-prod-title-wrap">
                                    <span className="mob-item-name" style={{ textDecoration: item.status === 'Cancelled' ? 'line-through' : 'none' }}>
                                      {item.name}
                                    </span>
                                    {item.status === 'Cancelled' && (
                                      <span className="mob-badge-cancelled">
                                        <i className="fa-solid fa-ban" /> Cancelled
                                      </span>
                                    )}
                                  </div>
                                  <span className="sku-badge">{item.sku}</span>
                                </div>

                                <div className="mob-card-details">
                                  <div className="mob-detail-col">
                                    <span className="mob-detail-lbl">HSN Code</span>
                                    <span className="mob-detail-val">{item.hsn || '9018'}</span>
                                  </div>
                                  <div className="mob-detail-col">
                                    <span className="mob-detail-lbl">Unit Rate</span>
                                    <span className="mob-detail-val">₹{item.rate.toLocaleString()}</span>
                                  </div>
                                  <div className="mob-detail-col">
                                    <span className="mob-detail-lbl">Quantity</span>
                                    <span className="mob-detail-val">{item.qty} pcs</span>
                                  </div>
                                  <div className="mob-detail-col mob-detail-total">
                                    <span className="mob-detail-lbl">Item Total</span>
                                    <strong className="mob-detail-val text-teal">₹{item.amount.toLocaleString()}</strong>
                                  </div>
                                </div>

                                <div className="mob-card-actions">
                                  {/* Product-wise Reorder Button */}
                                  <button
                                    type="button"
                                    className="btn-item-action-reorder"
                                    onClick={() => handleReorderItem(item)}
                                    title={`Reorder ${item.name}`}
                                  >
                                    <i className="fa-solid fa-rotate-right" /> Reorder
                                  </button>

                                  {/* Running Order -> Product-wise Cancel Button */}
                                  {order.status === 'Processing' && item.status !== 'Cancelled' && (
                                    <button
                                      type="button"
                                      className="btn-item-action-cancel"
                                      onClick={() => handleCancelOrderItem(order.id, item.sku)}
                                      title={`Cancel ${item.name} from this order`}
                                    >
                                      <i className="fa-solid fa-xmark" /> Cancel Item
                                    </button>
                                  )}

                                  {/* Delivered Order -> Product-wise Return Button or Return Status Badge */}
                                  {order.status === 'Delivered' && (
                                    item.returnStatus ? (
                                      <span
                                        className="mob-return-status-pill"
                                        title={`Return: ${item.returnStatus} (${item.returnId || ''})`}
                                      >
                                        <i className="fa-regular fa-clock" /> {item.returnStatus}
                                      </span>
                                    ) : order.isReturnEligible !== false ? (
                                      <button
                                        type="button"
                                        className="btn-item-action-return"
                                        onClick={() => handleInitiateReturn(order, item.sku)}
                                        title={`Return ${item.name}`}
                                      >
                                        <i className="fa-solid fa-rotate-left" /> Return Item
                                      </button>
                                    ) : null
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Order Footer & Action Buttons */}
                          <div className="order-card-footer">
                            <div className="order-total-block">
                              <span className="total-label">Grand Total:</span>
                              <strong className="total-val text-teal">₹{order.total.toLocaleString()}</strong>
                            </div>

                            <div className="order-actions-cluster">
                              {/* View Order Button */}
                              <button
                                type="button"
                                className="btn-order-view-details"
                                onClick={() => setActiveViewOrder(order)}
                              >
                                <i className="fa-regular fa-eye text-teal" /> View Order
                              </button>

                              {/* Delivered Order -> Return Product / View Return Details Button */}
                              {order.status === 'Delivered' && (
                                <>
                                  {order.returnStatus ? (
                                    <span style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '4px 10px', borderRadius: '14px', fontSize: '0.77rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                      <i className="fa-regular fa-clock" /> {order.returnStatus}
                                    </span>
                                  ) : order.isReturnEligible !== false ? (
                                    <button
                                      type="button"
                                      className="btn-order-return"
                                      onClick={() => handleInitiateReturn(order)}
                                    >
                                      <i className="fa-solid fa-rotate-left" /> Return Product
                                    </button>
                                  ) : null}
                                </>
                              )}

                              {/* Tax Invoice Button */}
                              <button
                                type="button"
                                className="btn-order-invoice"
                                onClick={() => setActiveInvoiceOrder(order)}
                              >
                                <i className="fa-solid fa-file-invoice text-blue" /> Tax Invoice
                              </button>

                              {/* Reorder All Button */}
                              <button
                                type="button"
                                className="btn-order-reorder"
                                onClick={() => handleReorderEntireOrder(order)}
                              >
                                <i className="fa-solid fa-rotate-right" /> Reorder All
                              </button>

                              {/* Delivered Order -> Add / Edit Review Button */}
                              {order.status === 'Delivered' && (
                                <button
                                  type="button"
                                  className={`btn-order-review ${order.hasReview ? 'reviewed' : ''}`}
                                  onClick={() => handleOpenReviewModal(order)}
                                >
                                  <i className="fa-solid fa-star" />
                                  {order.hasReview ? `Edit Review (${order.userRating}★)` : 'Add Review'}
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Return Status Banner on Order Card */}
                          {order.returnStatus && (
                            <div className="order-return-status-banner" style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                              <div className="return-meta" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div className="icon-box" style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                                  <i className="fa-solid fa-arrow-rotate-left" />
                                </div>
                                <div className="return-status-txt">
                                  Return Status: <strong>{order.returnStatus}</strong>
                                  {order.returnId && (
                                    <span style={{ marginLeft: 8, color: '#0f766e', fontWeight: 700, fontSize: 12 }}>
                                      (ID: #{order.returnId.replace('#', '')})
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Status Badge Only — no Accept/Reject buttons */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {order.returnDecision === 'Accepted' || (order.returnStatus as string) === 'Return Accepted' ? (
                                  <span style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                    <i className="fa-solid fa-circle-check" /> Return Accepted • Refund Initiated
                                  </span>
                                ) : order.returnDecision === 'Rejected' || (order.returnStatus as string) === 'Return Rejected' ? (
                                  <span style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                    <i className="fa-solid fa-circle-xmark" /> Return Rejected
                                  </span>
                                ) : (
                                  <span style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '5px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                    <i className="fa-regular fa-clock" /> Request Under Review
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Ineligible Return Notice Banner */}
                          {order.status === 'Delivered' && !order.returnStatus && order.isReturnEligible === false && (
                            <div className="order-ineligible-banner">
                              <div className="ineligible-info">
                                <i className="fa-solid fa-triangle-exclamation" />
                                <div>
                                  <strong>This product is not eligible for return.</strong>
                                  <span style={{ display: 'block', fontSize: '11.5px', color: '#92400e' }}>
                                    This product cannot be returned based on our return policy.
                                  </span>
                                </div>
                              </div>
                              <button
                                type="button"
                                className="btn-view-return-policy"
                                onClick={() => setShowReturnPolicyModal(true)}
                              >
                                <i className="fa-solid fa-shield-halved" /> View Return Policy
                              </button>
                            </div>
                          )}

                          {/* If reviewed, show mini review banner with edit trigger */}
                          {order.hasReview && order.userReviewText && (
                            <div className="order-review-preview" onClick={() => handleOpenReviewModal(order)} style={{ cursor: 'pointer' }} title="Click to edit your product review">
                              <div className="review-preview-stars">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <i
                                    key={star}
                                    className={`fa-solid fa-star ${star <= (order.userRating || 5) ? 'star-filled' : 'star-empty'}`}
                                  />
                                ))}
                                <span className="review-verified-pill">
                                  <i className="fa-solid fa-circle-check text-green" /> Verified Feedback (Click to edit)
                                </span>
                              </div>
                              <p className="review-preview-txt">"{order.userReviewText}"</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 2.5: Saved Wishlist */}
              {activeSection === 'wishlist' && (
                <div className="profile-card-content wishlist-pane-content">
                  <div className="pane-header-row">
                    <div>
                      <h2 className="pane-title">Saved Wishlist ({wishlist.length})</h2>
                      <p className="pane-subtitle">Direct access to your preferred materials, rotary instruments, and essentials.</p>
                    </div>
                    {wishlist.length > 0 && (
                      <div className="wishlist-pane-actions">
                        <button
                          type="button"
                          className="btn-pane-add-all-cart"
                          onClick={handleAddAllWishlistToCart}
                        >
                          <i className="fa-solid fa-cart-plus" /> Add All to Cart
                        </button>
                        <button
                          type="button"
                          className="btn-pane-clear-wishlist"
                          onClick={handleClearWishlist}
                        >
                          <i className="fa-solid fa-trash-can" /> Clear All
                        </button>
                      </div>
                    )}
                  </div>

                  {wishlist.length === 0 ? (
                    <div className="wishlist-empty-state">
                      <div className="empty-heart-circle">
                        <i className="fa-regular fa-heart" />
                      </div>
                      <h3 className="empty-title">Your Wishlist is Empty</h3>
                      <p className="empty-desc">
                        Save supplies you use regularly or want to purchase for your operatory later by clicking the heart icon on any product.
                      </p>
                      <Link to="/shop" className="btn-explore-catalog">
                        <i className="fa-solid fa-bag-shopping" /> Browse Dental Catalog
                      </Link>
                    </div>
                  ) : (
                    <div className="wishlist-products-grid products-grid">
                      {wishlist.map((item) => (
                        <ProductCard key={item.id} product={item} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 4: Saved Addresses */}
              {activeSection === 'addresses' && (
                <div className="profile-card-content">
                  <div className="pane-header-row">
                    <div>
                      <h2 className="pane-title">Saved Addresses</h2>
                      <p className="pane-subtitle">Manage your Billing Address and Shipping Address for dental dispatches.</p>
                    </div>
                    {!isEditingAddresses ? (
                      <button type="button" className="btn-pane-edit" onClick={() => setIsEditingAddresses(true)}>
                        <i className="fa-solid fa-pen-to-square" /> Edit Addresses
                      </button>
                    ) : (
                      <span className="editing-mode-badge">
                        <i className="fa-solid fa-circle-dot" /> Editing Active
                      </span>
                    )}
                  </div>

                  {!isEditingAddresses ? (
                    <div className="addresses-dual-grid">
                      {/* Billing Address Card */}
                      <div className="address-card">
                        <div className="address-card-head">
                          <div className="address-tag billing-tag">
                            <i className="fa-solid fa-file-invoice text-teal" /> BILLING ADDRESS
                          </div>
                        </div>
                        <h3 className="address-name">{addresses.billingAddress.fullName}</h3>
                        <span className="address-clinic">{addresses.billingAddress.clinicName}</span>
                        <p className="address-street">{addresses.billingAddress.street}</p>
                        <p className="address-city">
                          {addresses.billingAddress.city}, {addresses.billingAddress.state} – {addresses.billingAddress.pincode}
                        </p>
                        <p className="address-phone"><i className="fa-solid fa-phone text-teal" /> {addresses.billingAddress.phone}</p>
                      </div>

                      {/* Shipping Address Card */}
                      <div className="address-card">
                        <div className="address-card-head">
                          <div className="address-tag shipping-tag">
                            <i className="fa-solid fa-truck-fast text-teal" /> SHIPPING ADDRESS
                          </div>
                        </div>
                        <h3 className="address-name">{addresses.shippingAddress.fullName}</h3>
                        <span className="address-clinic">{addresses.shippingAddress.clinicName}</span>
                        <p className="address-street">{addresses.shippingAddress.street}</p>
                        <p className="address-city">
                          {addresses.shippingAddress.city}, {addresses.shippingAddress.state} – {addresses.shippingAddress.pincode}
                        </p>
                        <p className="address-phone"><i className="fa-solid fa-phone text-teal" /> {addresses.shippingAddress.phone}</p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveAddresses} className="profile-details-form">
                      <h4 className="form-sub-heading"><i className="fa-solid fa-file-invoice text-teal" /> Billing Address</h4>
                      <div className="form-row-2">
                        <div className="form-group">
                          <label>Full Name *</label>
                          <input
                            type="text"
                            placeholder="e.g.   John Doe"
                            value={addresses.billingAddress.fullName}
                            onChange={(e) =>
                              setAddresses({
                                ...addresses,
                                billingAddress: { ...addresses.billingAddress, fullName: e.target.value },
                              })
                            }
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>Practice / Business Name *</label>
                          <input
                            type="text"
                            placeholder="e.g. Apex Dental Care"
                            value={addresses.billingAddress.clinicName}
                            onChange={(e) =>
                              setAddresses({
                                ...addresses,
                                billingAddress: { ...addresses.billingAddress, clinicName: e.target.value },
                              })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Contact Phone Number *</label>
                        <input
                          type="tel"
                          placeholder="e.g. +91 98765 43210"
                          value={addresses.billingAddress.phone}
                          onChange={(e) =>
                            setAddresses({
                              ...addresses,
                              billingAddress: { ...addresses.billingAddress, phone: e.target.value },
                            })
                          }
                          required
                        />
                      </div>

                      <div className="form-row-3">
                        <div className="form-group">
                          <label>State *</label>
                          <select
                            value={addresses.billingAddress.state}
                            onChange={(e) =>
                              setAddresses({
                                ...addresses,
                                billingAddress: { ...addresses.billingAddress, state: e.target.value },
                              })
                            }
                            required
                          >
                            <option value="">Select State / UT</option>
                            {INDIAN_STATES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group">
                          <label>City *</label>
                          <input
                            type="text"
                            placeholder="e.g. Mumbai"
                            value={addresses.billingAddress.city}
                            onChange={(e) =>
                              setAddresses({
                                ...addresses,
                                billingAddress: { ...addresses.billingAddress, city: e.target.value },
                              })
                            }
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>PIN Code *</label>
                          <input
                            type="text"
                            placeholder="e.g. 400069"
                            value={addresses.billingAddress.pincode}
                            onChange={(e) =>
                              setAddresses({
                                ...addresses,
                                billingAddress: { ...addresses.billingAddress, pincode: e.target.value },
                              })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Street Address *</label>
                        <input
                          type="text"
                          placeholder="e.g. Shop 4 & 5, Presto Heights, MIDC Central Road"
                          value={addresses.billingAddress.street}
                          onChange={(e) =>
                            setAddresses({
                              ...addresses,
                              billingAddress: { ...addresses.billingAddress, street: e.target.value },
                            })
                          }
                          required
                        />
                      </div>

                      <h4 className="form-sub-heading mt-4"><i className="fa-solid fa-truck-fast text-teal" /> Shipping Address</h4>
                      <div className="form-row-2">
                        <div className="form-group">
                          <label>Full Name *</label>
                          <input
                            type="text"
                            placeholder="e.g.   John Doe"
                            value={addresses.shippingAddress.fullName}
                            onChange={(e) =>
                              setAddresses({
                                ...addresses,
                                shippingAddress: { ...addresses.shippingAddress, fullName: e.target.value },
                              })
                            }
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>Practice / Business Name *</label>
                          <input
                            type="text"
                            placeholder="e.g. Apex Dental Care (Operatory Hub)"
                            value={addresses.shippingAddress.clinicName}
                            onChange={(e) =>
                              setAddresses({
                                ...addresses,
                                shippingAddress: { ...addresses.shippingAddress, clinicName: e.target.value },
                              })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Contact Phone Number *</label>
                        <input
                          type="tel"
                          placeholder="e.g. +91 98765 43210"
                          value={addresses.shippingAddress.phone}
                          onChange={(e) =>
                            setAddresses({
                              ...addresses,
                              shippingAddress: { ...addresses.shippingAddress, phone: e.target.value },
                            })
                          }
                          required
                        />
                      </div>

                      <div className="form-row-3">
                        <div className="form-group">
                          <label>State *</label>
                          <select
                            value={addresses.shippingAddress.state}
                            onChange={(e) =>
                              setAddresses({
                                ...addresses,
                                shippingAddress: { ...addresses.shippingAddress, state: e.target.value },
                              })
                            }
                            required
                          >
                            <option value="">Select State / UT</option>
                            {INDIAN_STATES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group">
                          <label>City *</label>
                          <input
                            type="text"
                            placeholder="e.g. Mumbai"
                            value={addresses.shippingAddress.city}
                            onChange={(e) =>
                              setAddresses({
                                ...addresses,
                                shippingAddress: { ...addresses.shippingAddress, city: e.target.value },
                              })
                            }
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>PIN Code *</label>
                          <input
                            type="text"
                            placeholder="e.g. 400069"
                            value={addresses.shippingAddress.pincode}
                            onChange={(e) =>
                              setAddresses({
                                ...addresses,
                                shippingAddress: { ...addresses.shippingAddress, pincode: e.target.value },
                              })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Street Address *</label>
                        <input
                          type="text"
                          placeholder="e.g. Shop 4 & 5, Presto Heights, MIDC Central Road, Andheri East"
                          value={addresses.shippingAddress.street}
                          onChange={(e) =>
                            setAddresses({
                              ...addresses,
                              shippingAddress: { ...addresses.shippingAddress, street: e.target.value },
                            })
                          }
                          required
                        />
                      </div>

                      <div className="form-actions-bar">
                        <button type="button" className="btn-cancel" onClick={() => setIsEditingAddresses(false)}>
                          Cancel
                        </button>
                        <button type="submit" className="btn-save-profile">
                          <i className="fa-solid fa-floppy-disk" /> Save Addresses
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* SECTION 5: Account Preferences */}
              {activeSection === 'preferences' && (
                <div className="profile-card-content">
                  <div className="pane-header-row">
                    <div>
                      <h2 className="pane-title">Account Preferences</h2>
                      <p className="pane-subtitle">Control your communication channels and order notifications.</p>
                    </div>
                  </div>

                  <div className="preferences-list">
                    {/* Email Notifications */}
                    <div className="preference-item-card">
                      <div className="preference-text-col">
                        <div className="preference-icon email-pref-icon">
                          <i className="fa-regular fa-envelope" />
                        </div>
                        <div>
                          <strong className="pref-title">Email Notifications</strong>
                          <p className="pref-desc">Receive tax invoices, monthly statements, and catalog updates via email.</p>
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={preferences.emailNotifications}
                          onChange={() => handleTogglePreference('emailNotifications')}
                        />
                        <span className="toggle-slider" />
                      </label>
                    </div>

                    {/* WhatsApp Updates */}
                    <div className="preference-item-card">
                      <div className="preference-text-col">
                        <div className="preference-icon wa-pref-icon">
                          <i className="fa-brands fa-whatsapp" />
                        </div>
                        <div>
                          <strong className="pref-title">WhatsApp Updates</strong>
                          <p className="pref-desc">Get instant dispatches,   tracking links, and emergency replenishment alerts on WhatsApp.</p>
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={preferences.whatsappUpdates}
                          onChange={() => handleTogglePreference('whatsappUpdates')}
                        />
                        <span className="toggle-slider" />
                      </label>
                    </div>

                    {/* Order Notifications */}
                    <div className="preference-item-card">
                      <div className="preference-text-col">
                        <div className="preference-icon order-pref-icon">
                          <i className="fa-solid fa-box" />
                        </div>
                        <div>
                          <strong className="pref-title">Order Notifications</strong>
                          <p className="pref-desc">Receive real-time cold-chain temperature verification and courier delivery alerts.</p>
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={preferences.orderNotifications}
                          onChange={() => handleTogglePreference('orderNotifications')}
                        />
                        <span className="toggle-slider" />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 6: Security */}
              {activeSection === 'security' && (
                <div className="profile-card-content">
                  <div className="pane-header-row">
                    <div>
                      <h2 className="pane-title">Security &amp; Logout</h2>
                      <p className="pane-subtitle">Manage your account password and active session.</p>
                    </div>
                  </div>

                  <div className="security-pane-body">
                    <form onSubmit={handleChangePassword} className="profile-details-form">
                      <h4 className="form-sub-heading"><i className="fa-solid fa-key text-teal" /> Change Password</h4>

                      <div className="form-group">
                        <label htmlFor="currentPassword">Current Password *</label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="currentPassword"
                          placeholder="Enter your current password"
                          value={securityForm.currentPassword}
                          onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-row-2">
                        <div className="form-group">
                          <label htmlFor="newPassword">New Password *</label>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            id="newPassword"
                            placeholder="Enter new strong password"
                            value={securityForm.newPassword}
                            onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="confirmPassword">Confirm New Password *</label>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            placeholder="Re-enter new password"
                            value={securityForm.confirmPassword}
                            onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="password-options-row">
                        <label className="show-pw-label">
                          <input
                            type="checkbox"
                            checked={showPassword}
                            onChange={() => setShowPassword(!showPassword)}
                          />
                          <span>Show Passwords</span>
                        </label>
                      </div>

                      <div className="form-actions-bar">
                        <button type="submit" className="btn-save-profile">
                          <i className="fa-solid fa-lock" /> Update Password
                        </button>
                      </div>
                    </form>

                    {/* Logout Session Area */}
                    <div className="logout-card-section">
                      <div className="logout-info">
                        <div className="logout-badge-icon">
                          <i className="fa-solid fa-arrow-right-from-bracket" />
                        </div>
                        <div className="logout-text-wrap">
                          <strong className="logout-title">Account Session &amp; Logout</strong>
                          <p className="logout-desc">Sign out of your current doctor portal session on this device safely.</p>
                        </div>
                      </div>
                      <button type="button" className="btn-logout-danger" onClick={handleLogout}>
                        <i className="fa-solid fa-arrow-right-from-bracket" /> Logout of Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MODAL 1: ORDER TRACKING TIMELINE
          ========================================================================= */}
      {activeTrackingOrder && (
        <div className="profile-modal-overlay" onClick={() => setActiveTrackingOrder(null)}>
          <div className="profile-modal-card tracking-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <span className="modal-tag"><i className="fa-solid fa-satellite-dish text-teal" /> LIVE SHIPMENT TRACKING</span>
                <h3 className="modal-title">Order {activeTrackingOrder.id}</h3>
              </div>
              <button type="button" className="btn-modal-close" onClick={() => setActiveTrackingOrder(null)}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className="modal-body">
              {/* Courier Header Card */}
              <div className="tracking-summary-card">
                <div className="tracking-col">
                  <span className="tr-lbl">Courier Partner</span>
                  <strong className="tr-val">{activeTrackingOrder.courier}</strong>
                </div>
                <div className="tracking-col">
                  <span className="tr-lbl">AWB Tracking Number</span>
                  <strong className="tr-val text-teal">{activeTrackingOrder.trackingNo}</strong>
                </div>
                <div className="tracking-col">
                  <span className="tr-lbl">Current Status</span>
                  <span className="tr-status-pill" style={{ color: activeTrackingOrder.statusColor }}>
                    {activeTrackingOrder.status}
                  </span>
                </div>
              </div>

              {/* 7-Step Delivery Timeline */}
              <div className="tracking-stepper">
                {/* 1. Order Placed */}
                <div className="stepper-item step-completed">
                  <div className="step-bullet"><i className="fa-solid fa-check" /></div>
                  <div className="step-text">
                    <strong>Order Placed</strong>
                    <span>{activeTrackingOrder.date} • Digital Order Registered</span>
                  </div>
                </div>

                {/* 2. Payment Confirmed */}
                <div className="stepper-item step-completed">
                  <div className="step-bullet"><i className="fa-solid fa-check" /></div>
                  <div className="step-text">
                    <strong>Payment Confirmed</strong>
                    <span>Online Verified &amp; Tax Invoice Generated</span>
                  </div>
                </div>

                {/* 3. Processing */}
                <div className="stepper-item step-completed">
                  <div className="step-bullet"><i className="fa-solid fa-check" /></div>
                  <div className="step-text">
                    <strong>Processing</strong>
                    <span>Central Fulfillment Center • Quality Inspection</span>
                  </div>
                </div>

                {/* 4. Packed */}
                <div className="stepper-item step-completed">
                  <div className="step-bullet"><i className="fa-solid fa-check" /></div>
                  <div className="step-text">
                    <strong>Packed</strong>
                    <span>Cold-Chain Vacuum Sealed &amp; Quality Checked</span>
                  </div>
                </div>

                {/* 5. Shipped */}
                <div className={`stepper-item ${activeTrackingOrder.status !== 'Cancelled' ? 'step-completed' : 'step-pending'}`}>
                  <div className="step-bullet">
                    {activeTrackingOrder.status === 'Processing' ? <i className="fa-solid fa-circle" style={{ fontSize: '0.65rem' }} /> : <i className="fa-solid fa-check" />}
                  </div>
                  <div className="step-text">
                    <strong>Shipped</strong>
                    <span>Dispatched via {activeTrackingOrder.courier} • AWB #{activeTrackingOrder.trackingNo}</span>
                  </div>
                </div>

                {/* 6. Out for Delivery */}
                <div className={`stepper-item ${activeTrackingOrder.status === 'Delivered' ? 'step-completed' : 'step-pending'}`}>
                  <div className="step-bullet">
                    {activeTrackingOrder.status === 'Delivered' ? <i className="fa-solid fa-check" /> : <i className="fa-regular fa-circle" style={{ fontSize: '0.65rem' }} />}
                  </div>
                  <div className="step-text">
                    <strong>Out for Delivery</strong>
                    <span>Assigned to Courier for Direct Delivery</span>
                  </div>
                </div>

                {/* 7. Delivered */}
                <div className={`stepper-item ${activeTrackingOrder.status === 'Delivered' ? 'step-completed last' : 'step-pending last'}`}>
                  <div className="step-bullet">
                    {activeTrackingOrder.status === 'Delivered' ? <i className="fa-solid fa-check" /> : <i className="fa-regular fa-circle" style={{ fontSize: '0.65rem' }} />}
                  </div>
                  <div className="step-text">
                    <strong>Delivered</strong>
                    <span>{activeTrackingOrder.status === 'Delivered' ? `Delivered (${activeTrackingOrder.deliveredDate || 'Delivered'})` : 'Expected Delivery by Tomorrow, 4:00 PM'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-foot">
              <button
                type="button"
                className="btn-modal-secondary"
                onClick={() => {
                  showToast('Connecting to courier partner BlueDart live tracking portal...', 'info');
                }}
              >
                <i className="fa-solid fa-arrow-up-right-from-square" /> Open Courier Web Portal
              </button>
              <button type="button" className="btn-modal-primary" onClick={() => setActiveTrackingOrder(null)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: TAX-COMPLIANT GST INVOICE MODAL
          ========================================================================= */}
      {activeInvoiceOrder && (
        <div className="profile-modal-overlay" onClick={() => setActiveInvoiceOrder(null)}>
          <div className="profile-modal-card invoice-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head print-hide">
              <div>
                <span className="modal-tag"><i className="fa-solid fa-file-invoice text-teal" /> OFFICIAL TAX INVOICE</span>
                <h3 className="modal-title">Tax Invoice #{activeInvoiceOrder.invoiceNo.startsWith('PSD-') ? activeInvoiceOrder.invoiceNo : activeInvoiceOrder.invoiceNo.replace('INV-2026-', 'PSD-')}</h3>
              </div>
              <div className="modal-head-actions">
                <button type="button" className="btn-print-invoice" onClick={handlePrintInvoice}>
                  <i className="fa-solid fa-print" /> Print Invoice
                </button>
                <button type="button" className="btn-modal-close" onClick={() => setActiveInvoiceOrder(null)}>
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
            </div>

            <div className="modal-body invoice-modal-body">
              <div className="invoice-printable-sheet">
                {/* Header Row */}
                <div className="psd-inv-header">
                  <div className="psd-inv-header-left">
                    <h1 className="psd-inv-title">INVOICE</h1>
                    <div className="psd-inv-meta-line">
                      <strong>Invoice #:</strong> {activeInvoiceOrder.invoiceNo.startsWith('PSD-') ? activeInvoiceOrder.invoiceNo : activeInvoiceOrder.invoiceNo.replace('INV-2026-', 'PSD-')}
                    </div>
                    <div className="psd-inv-meta-line">
                      <strong>Date:</strong> {activeInvoiceOrder.date}
                    </div>
                    <div className="psd-inv-meta-line">
                      <strong>Status:</strong> {activeInvoiceOrder.status === 'Delivered' ? 'Wc-delivered' : activeInvoiceOrder.status === 'Processing' ? 'Wc-processing' : 'Wc-cancelled'}
                    </div>
                  </div>

                  <div className="psd-inv-header-right">
                    <img src="/images/logo.svg" alt="BuyBright" className="psd-inv-logo" />
                    <div className="psd-inv-company-name">BuyBright Marketplace</div>
                    <div className="psd-inv-company-details">
                      <div>Central MIDC Road, Andheri East, Mumbai - 400069, Maharashtra</div>
                      <div>Phone: +91 98765 43210</div>
                      <div>Email: support@buybright.com</div>
                      <div>GST: 27AAACD9910Q1ZS</div>
                    </div>
                  </div>
                </div>

                {/* Billing Details Box */}
                <div className="psd-inv-billing-box">
                  <div className="psd-inv-billing-head">Billing Details</div>
                  <div className="psd-inv-billing-body">
                    <div className="psd-inv-buyer-name">
                      {profileOverview.customerName || ' abdul Azim'}
                    </div>
                    <div className="psd-inv-buyer-address">
                      {addresses.billingAddress.street}, {addresses.billingAddress.city}, {addresses.billingAddress.state} - {addresses.billingAddress.pincode}
                    </div>
                    <div className="psd-inv-buyer-phone">
                      Phone: {profileOverview.mobile || '9049636447'}
                    </div>
                  </div>
                </div>

                {/* Order Items Table */}
                <div className="psd-inv-items-section">
                  <h4 className="psd-inv-section-title">Order Items</h4>
                  <div className="psd-inv-table-wrap">
                    <table className="psd-inv-table">
                      <thead>
                        <tr>
                          <th className="col-num">#</th>
                          <th className="col-prod">Product</th>
                          <th className="col-cat">Category</th>
                          <th className="col-qty">Qty</th>
                          <th className="col-price">Price (Rs.)</th>
                          <th className="col-total">Total (Rs.)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeInvoiceOrder.items.map((it, idx) => {
                          const itemCat = it.category || (it.name.toLowerCase().includes('endo') || it.name.toLowerCase().includes('file') || it.name.toLowerCase().includes('bur') ? 'Endodontics' : it.name.toLowerCase().includes('algin') ? 'Prosthodontics' : 'Restorative');
                          return (
                            <tr key={idx}>
                              <td className="col-num">{idx + 1}</td>
                              <td className="col-prod">{it.name}</td>
                              <td className="col-cat">{itemCat}</td>
                              <td className="col-qty">{it.qty}</td>
                              <td className="col-price">{it.rate.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                              <td className="col-total">{(it.rate * it.qty).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Calculations and Totals Table */}
                  {(() => {
                    const subtotal = activeInvoiceOrder.items.reduce((acc, it) => acc + (it.rate * it.qty), 0);
                    const shippingCharges = 29.00;
                    const grandTotal = activeInvoiceOrder.total;
                    const usedPoints = (subtotal + shippingCharges) > grandTotal ? ((subtotal + shippingCharges) - grandTotal) : 0;
                    return (
                      <div className="psd-inv-totals-wrap">
                        <table className="psd-inv-totals-table">
                          <tbody>
                            <tr>
                              <td className="tot-lbl">Subtotal:</td>
                              <td className="tot-val">Rs. {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                            <tr>
                              <td className="tot-lbl">Offer Discount:</td>
                              <td className="tot-val">-Rs. 0.00</td>
                            </tr>
                            <tr>
                              <td className="tot-lbl">Shipping Charges:</td>
                              <td className="tot-val">+Rs. {shippingCharges.toFixed(2)}</td>
                            </tr>
                            {usedPoints > 0 && (
                              <tr>
                                <td className="tot-lbl">Used Bright Points:</td>
                                <td className="tot-val">-Rs. {usedPoints.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                              </tr>
                            )}
                            <tr className="tot-bold-row">
                              <td className="tot-lbl">Grand Total:</td>
                              <td className="tot-val">Rs. {grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                            <tr className="tot-bold-row">
                              <td className="tot-lbl">Total Payable:</td>
                              <td className="tot-val">Rs. {grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                            <tr>
                              <td className="tot-lbl">Payment Method:</td>
                              <td className="tot-val">Wallet + Cash on Delivery</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}

                  <div className="psd-inv-footer-msg">
                    <em>Thank you for your purchase!</em>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-foot print-hide">
              <button
                type="button"
                className="btn-modal-secondary"
                onClick={handlePrintInvoice}
              >
                <i className="fa-solid fa-file-pdf text-coral" /> Download PDF / Print
              </button>
              <button type="button" className="btn-modal-primary" onClick={() => setActiveInvoiceOrder(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: INVOICES CENTRAL HUB MODAL
          ========================================================================= */}
      {showInvoicesHubModal && (
        <div className="profile-modal-overlay" onClick={() => setShowInvoicesHubModal(false)}>
          <div className="profile-modal-card invoices-hub-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <span className="modal-tag"><i className="fa-solid fa-file-invoice-dollar text-teal" /> ACCOUNTS &amp; TAX</span>
                <h3 className="modal-title">Download Tax Invoices</h3>
              </div>
              <button type="button" className="btn-modal-close" onClick={() => setShowInvoicesHubModal(false)}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-sub-text">
                All invoices include full GST breakdown (HSN, CGST, SGST, IGST) formatted for your clinic's monthly GST-2B input tax claims.
              </p>

              <div className="invoices-hub-list">
                {orders.map((ord) => (
                  <div key={ord.id} className="invoice-hub-item">
                    <div className="inv-hub-info">
                      <div className="inv-hub-tag">
                        <i className="fa-solid fa-file-pdf text-coral" /> {ord.invoiceNo}
                      </div>
                      <strong className="inv-hub-title">{ord.items.map((i) => i.name).join(', ')}</strong>
                      <span className="inv-hub-meta">Order {ord.id} • {ord.date} • Total: ₹{ord.total.toLocaleString()}</span>
                    </div>

                    <div className="inv-hub-btns">
                      <button
                        type="button"
                        className="btn-hub-preview"
                        onClick={() => {
                          setShowInvoicesHubModal(false);
                          setActiveInvoiceOrder(ord);
                        }}
                      >
                        <i className="fa-solid fa-eye" /> View
                      </button>
                      <button
                        type="button"
                        className="btn-hub-dl"
                        onClick={() => showToast(`✓ Downloading PDF for ${ord.invoiceNo}`, 'success')}
                      >
                        <i className="fa-solid fa-download" /> Download PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-foot">
              <button
                type="button"
                className="btn-modal-secondary"
                onClick={() => showToast('✓ Generating Consolidated FY 2026-27 GST Statement ZIP...', 'info')}
              >
                <i className="fa-solid fa-file-zipper" /> Download All (ZIP)
              </button>
              <button type="button" className="btn-modal-primary" onClick={() => setShowInvoicesHubModal(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: RATE & REVIEW DELIVERED ORDER MODAL
          ========================================================================= */}
      {activeReviewOrder && (
        <div className="profile-modal-overlay" onClick={() => setActiveReviewOrder(null)}>
          <div className="profile-modal-card review-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <span className="modal-tag"><i className="fa-solid fa-star text-gold" /> PRODUCT EXPERIENCE &amp; RATING</span>
                <h3 className="modal-title">Rate Products in Order {activeReviewOrder.id}</h3>
              </div>
              <button type="button" className="btn-modal-close" onClick={() => setActiveReviewOrder(null)}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview}>
              <div className="modal-body" ref={reviewModalBodyRef}>
                {/* Delivered Products Summary */}
                <div className="review-order-summary">
                  <span className="lbl">Items Delivered to Clinic:</span>
                  <div className="review-items-chips">
                    {activeReviewOrder.items.map((it, idx) => (
                      <span key={idx} className="review-item-chip">
                        <i className="fa-solid fa-tooth text-teal" /> {it.name} ({it.qty}x)
                      </span>
                    ))}
                  </div>
                </div>

                {/* Star Rating Selector */}
                <div className="star-rating-control-section">
                  <label className="rating-head-lbl">Overall Product Satisfaction &amp; Quality *</label>
                  <div className="interactive-stars-row">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star-btn ${star <= (reviewHoverRating || reviewRating) ? 'hovered' : ''}`}
                        onMouseEnter={() => setReviewHoverRating(star)}
                        onMouseLeave={() => setReviewHoverRating(0)}
                        onClick={() => setReviewRating(star)}
                        aria-label={`${star} star rating`}
                      >
                        <i className="fa-solid fa-star" />
                      </button>
                    ))}
                    <span className="rating-verdict-txt">
                      {reviewRating === 5 && '★★★★★ Excellent (Highly Recommended for Practice)'}
                      {reviewRating === 4 && '★★★★☆ Very Good (Satisfactory Dental Outcome)'}
                      {reviewRating === 3 && '★★★☆☆ Average (Standard Quality)'}
                      {reviewRating === 2 && '★★☆☆☆ Below Average'}
                      {reviewRating === 1 && '★☆☆☆☆ Poor Experience'}
                    </span>
                  </div>
                </div>

                {/* Review Title & Comments */}
                <div className="form-group">
                  <label htmlFor="reviewTitle">Review Title (Optional)</label>
                  <input
                    type="text"
                    id="reviewTitle"
                    placeholder="e.g. Excellent bonding strength, easy to finish & polish"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="reviewComment">Feedback &amp; Restorative Experience *</label>
                  <textarea
                    id="reviewComment"
                    rows={3}
                    placeholder="e.g. We have been using this material across 20+ composite restorations. Arrived in pristine cold packaging with valid batch test certificates."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                  />
                </div>

                {/* Recommendation Radio */}
                <div className="recommendation-toggle-row">
                  <span className="rec-txt">Would you recommend these supplies to peer dental surgeons?</span>
                  <div className="rec-btn-group">
                    <button
                      type="button"
                      className={`rec-btn ${recommendProduct ? 'active' : ''}`}
                      onClick={() => setRecommendProduct(true)}
                    >
                      <i className="fa-solid fa-thumbs-up" /> Yes
                    </button>
                    <button
                      type="button"
                      className={`rec-btn ${!recommendProduct ? 'active' : ''}`}
                      onClick={() => setRecommendProduct(false)}
                    >
                      <i className="fa-solid fa-thumbs-down" /> No
                    </button>
                  </div>
                </div>
              </div>

              <div className="modal-foot">
                <button
                  type="button"
                  className="btn-modal-secondary btn-scroll-top-helper"
                  onClick={() => reviewModalBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                  title="Scroll back up to top"
                >
                  <i className="fa-solid fa-arrow-up" /> Scroll Up
                </button>
                <button type="button" className="btn-modal-secondary" onClick={() => setActiveReviewOrder(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-modal-primary">
                  <i className="fa-solid fa-paper-plane" /> Submit Product Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 5: ORDER DETAILS MODAL ([View Order])
          ========================================================================= */}
      {activeViewOrder && (
        <div className="profile-modal-overlay" onClick={() => setActiveViewOrder(null)}>
          <div className="profile-modal-card order-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <span className="modal-tag">
                  <i className="fa-solid fa-file-lines text-teal" /> COMPREHENSIVE ORDER DETAILS
                </span>
                <h3 className="modal-title">Order {activeViewOrder.id}</h3>
              </div>
              <button type="button" className="btn-modal-close" onClick={() => setActiveViewOrder(null)}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className="modal-body order-details-body">
              {/* Order Status & Courier Bar */}
              <div className="order-status-banner-head">
                <div className="order-meta-info">
                  <h4>Order {activeViewOrder.id}</h4>
                  <span>
                    Placed on {activeViewOrder.date}
                    {activeViewOrder.deliveredDate && ` • Delivered on ${activeViewOrder.deliveredDate}`}
                  </span>
                </div>
                <div
                  className="order-status-pill"
                  style={{
                    color: activeViewOrder.statusColor,
                    borderColor: `${activeViewOrder.statusColor}40`,
                    background: `${activeViewOrder.statusColor}12`,
                  }}
                >
                  <i className="fa-solid fa-circle-dot" />
                  <span>{activeViewOrder.status}</span>
                </div>
              </div>

              {/* Items in Order */}
              <div className="order-items-listing">
                <h5>Purchased Items</h5>
                {activeViewOrder.items.map((it, idx) => (
                  <div key={idx} className="detail-item-row" style={{ opacity: it.status === 'Cancelled' ? 0.65 : 1 }}>
                    <div className="item-text-info">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ textDecoration: it.status === 'Cancelled' ? 'line-through' : 'none' }}>{it.name}</strong>
                        {it.status === 'Cancelled' && (
                          <span style={{ background: '#fee2e2', color: '#dc2626', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '12px', border: '1px solid #fca5a5' }}>
                            <i className="fa-solid fa-ban" /> Cancelled
                          </span>
                        )}
                      </div>
                      <span>SKU: {it.sku} • HSN: {it.hsn} • Qty: {it.qty}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <div className="item-pricing">
                        ₹{it.amount.toLocaleString()}
                        <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 400 }}>
                          (₹{it.rate.toLocaleString()} each)
                        </span>
                      </div>

                      <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleReorderItem(it)}
                          style={{
                            background: '#f0fdfa',
                            color: '#0f766e',
                            border: '1px solid #99f6e4',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          <i className="fa-solid fa-rotate-right" /> Reorder
                        </button>
                        {activeViewOrder.status === 'Processing' && it.status !== 'Cancelled' && (
                          <button
                            type="button"
                            onClick={() => {
                              handleCancelOrderItem(activeViewOrder.id, it.sku);
                              setActiveViewOrder((prev) => {
                                if (!prev) return null;
                                const updatedItems = prev.items.map((i) => (i.sku === it.sku ? { ...i, status: 'Cancelled' as const } : i));
                                const allCancelled = updatedItems.every((i) => i.status === 'Cancelled');
                                return {
                                  ...prev,
                                  items: updatedItems,
                                  status: allCancelled ? 'Cancelled' : prev.status,
                                  statusColor: allCancelled ? '#cf4032' : prev.statusColor,
                                };
                              });
                            }}
                            style={{
                              background: '#fff1f2',
                              color: '#e11d48',
                              border: '1px solid #fecdd3',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            <i className="fa-solid fa-xmark" /> Cancel
                          </button>
                        )}
                        {/* Delivered Order -> Product-wise Return in Order Details */}
                        {activeViewOrder.status === 'Delivered' && (
                          it.returnStatus ? (
                            <span
                              style={{
                                background: '#fef3c7',
                                color: '#b45309',
                                border: '1px solid #fde68a',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              <i className="fa-regular fa-clock" /> {it.returnStatus}
                            </span>
                          ) : activeViewOrder.isReturnEligible !== false ? (
                            <button
                              type="button"
                              onClick={() => {
                                const ord = activeViewOrder;
                                setActiveViewOrder(null);
                                handleInitiateReturn(ord, it.sku);
                              }}
                              style={{
                                background: '#fff7ed',
                                color: '#c2410c',
                                border: '1px solid #fed7aa',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              <i className="fa-solid fa-rotate-left" /> Return
                            </button>
                          ) : null
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Addresses & Logistics Grid */}
              <div className="order-summary-grid">
                <div className="summary-box">
                  <h6>Shipping Destination</h6>
                  <p>
                    <strong>{addresses.shippingAddress.fullName}</strong><br />
                    {addresses.shippingAddress.street}, {addresses.shippingAddress.city}, {addresses.shippingAddress.state} - {addresses.shippingAddress.pincode}<br />
                    Phone: {addresses.shippingAddress.phone}
                  </p>
                </div>

                <div className="summary-box">
                  <h6>Courier &amp; Logistics</h6>
                  <p>
                    <strong>Carrier:</strong> {activeViewOrder.courier}<br />
                    <strong>Tracking AWB:</strong> {activeViewOrder.trackingNo}<br />
                    <strong>Tax Invoice:</strong> #{activeViewOrder.invoiceNo}<br />
                    <strong>Payment Mode:</strong> Razorpay / Online Verified
                  </p>
                </div>
              </div>

              {/* Total & Return Flow CTA inside Order Details */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: '16px 20px',
                  marginTop: 10,
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <div>
                  <span style={{ fontSize: 13, color: '#64748b' }}>Grand Total Paid:</span>
                  <strong style={{ display: 'block', fontSize: 18, color: '#008080' }}>
                    ₹{activeViewOrder.total.toLocaleString()}
                  </strong>
                </div>

                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  {activeViewOrder.status === 'Delivered' && (
                    <>
                      {activeViewOrder.returnDecision === 'Accepted' || (activeViewOrder.returnStatus as string) === 'Return Accepted' ? (
                        <span style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', padding: '6px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <i className="fa-solid fa-circle-check" /> Return Accepted • Refund Initiated
                        </span>
                      ) : activeViewOrder.returnDecision === 'Rejected' || (activeViewOrder.returnStatus as string) === 'Return Rejected' ? (
                        <span style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', padding: '6px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <i className="fa-solid fa-circle-xmark" /> Return Rejected
                        </span>
                      ) : activeViewOrder.returnStatus ? (
                        <span style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '6px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <i className="fa-regular fa-clock" /> {activeViewOrder.returnStatus}
                        </span>
                      ) : activeViewOrder.isReturnEligible !== false ? (
                        <button
                          type="button"
                          className="btn-order-return"
                          onClick={() => {
                            const ord = activeViewOrder;
                            setActiveViewOrder(null);
                            handleInitiateReturn(ord);
                          }}
                        >
                          <i className="fa-solid fa-rotate-left" /> Return Product
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn-view-return-policy"
                          onClick={() => setShowReturnPolicyModal(true)}
                        >
                          <i className="fa-solid fa-shield-halved" /> View Return Policy
                        </button>
                      )}
                    </>
                  )}
                  <button
                    type="button"
                    className="btn-order-invoice"
                    onClick={() => {
                      const ord = activeViewOrder;
                      setActiveViewOrder(null);
                      setActiveInvoiceOrder(ord);
                    }}
                  >
                    <i className="fa-solid fa-file-invoice text-blue" /> Tax Invoice
                  </button>

                  <button
                    type="button"
                    className="btn-order-reorder"
                    onClick={() => {
                      const ord = activeViewOrder;
                      setActiveViewOrder(null);
                      handleReorderEntireOrder(ord);
                    }}
                  >
                    <i className="fa-solid fa-rotate-right" /> Reorder Order
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-foot">
              <button type="button" className="btn-modal-secondary" onClick={() => setActiveViewOrder(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 6: PRODUCT RETURN WIZARD (DIRECT STREAMLINED PRODUCT RETURN FLOW)
          ========================================================================= */}
      {activeReturnOrder && (
        <div className="profile-modal-overlay" onClick={() => setActiveReturnOrder(null)}>
          <div className="profile-modal-card return-wizard-modal" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="modal-head">
              <div>
                <span className="modal-tag">
                  <i className="fa-solid fa-rotate-left text-teal" /> RETURN &amp; REFUND REQUEST
                </span>
                <h3 className="modal-title">
                  {returnStep === 2 && `Return Details — Order #${activeReturnOrder.id.replace('#', '')}`}
                  {returnStep === 3 && `Review & Submit — Order #${activeReturnOrder.id.replace('#', '')}`}
                  {returnStep === 'success' && `Return Confirmed — Order #${activeReturnOrder.id.replace('#', '')}`}
                </h3>
              </div>
              <button type="button" className="btn-modal-close" onClick={() => setActiveReturnOrder(null)}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            {/* Stepper Progress Bar (Only show if not on success view) */}
            {returnStep !== 'success' && (
              <div className="wizard-progress-bar">
                <div className={`wizard-step-node ${returnStep === 2 ? 'active' : 'completed'}`}>
                  <span className="node-num">{returnStep === 3 ? <i className="fa-solid fa-check" /> : '1'}</span>
                  <span>1. Return Reason &amp; Qty</span>
                </div>
                <div className={`wizard-step-line ${returnStep === 3 ? 'active' : ''}`} />

                <div className={`wizard-step-node ${returnStep === 3 ? 'active' : ''}`}>
                  <span className="node-num">2</span>
                  <span>2. Review &amp; Submit</span>
                </div>
              </div>
            )}

            {/* Form & Steps Body */}
            <div className="return-wizard-body">
              {/* SCREEN 1 / STEP 2: PRODUCT SELECTED + RETURN REASON */}
              {returnStep === 2 && (
                <div className="return-reasons-container">
                  {/* Selected Product Card */}
                  {(() => {
                    const selectedItem =
                      activeReturnOrder.items.find((i) => i.sku === selectedReturnSku) ||
                      activeReturnOrder.items[0];
                    return (
                      <div className="selected-product-return-card">
                        <div className="sel-prod-left">
                          <div className="sel-prod-icon">
                            <i className="fa-solid fa-box-open" />
                          </div>
                          <div className="sel-prod-details">
                            <span className="sel-prod-badge">Product Selected for Return</span>
                            <h4 className="sel-prod-name">{selectedItem.name}</h4>
                            <div className="sel-prod-meta">
                              <span>SKU: <strong>{selectedItem.sku}</strong></span>
                              <span>Price: <strong>₹{selectedItem.rate.toLocaleString()}</strong></span>
                              {selectedItem.hsn && <span>HSN: {selectedItem.hsn}</span>}
                            </div>
                          </div>
                        </div>

                        <div className="sel-prod-qty-box">
                          <span className="qty-label">Return Qty:</span>
                          <div className="stepper-control">
                            <button
                              type="button"
                              className="btn-step"
                              disabled={returnQty <= 1}
                              onClick={() => setReturnQty(Math.max(1, returnQty - 1))}
                            >
                              <i className="fa-solid fa-minus" />
                            </button>
                            <span className="step-display">{returnQty}</span>
                            <button
                              type="button"
                              className="btn-step"
                              disabled={returnQty >= selectedItem.qty}
                              onClick={() => setReturnQty(Math.min(selectedItem.qty, returnQty + 1))}
                            >
                              <i className="fa-solid fa-plus" />
                            </button>
                          </div>
                          <span className="max-qty-hint">Max {selectedItem.qty} unit(s)</span>
                        </div>
                      </div>
                    );
                  })()}

                  <h4 className="reason-question-title">
                    <i className="fa-solid fa-circle-question text-teal" /> Why are you returning this product?
                  </h4>

                  <div className="reasons-options-list">
                    {RETURN_REASONS.map((r) => (
                      <div
                        key={r}
                        className={`reason-option-card ${returnReason === r ? 'active' : ''}`}
                        onClick={() => setReturnReason(r)}
                      >
                        <div className="radio-indicator" />
                        <span className="reason-text">{r}</span>
                      </div>
                    ))}
                  </div>

                  <div className="additional-details-wrap">
                    <label htmlFor="returnDetails">Additional Details / Notes (Optional)</label>
                    <div className="field-subtext">Please share any specific details regarding product condition or reason for return.</div>
                    <textarea
                      id="returnDetails"
                      rows={3}
                      placeholder="e.g. Received incorrect tip size, sealed original packaging intact..."
                      value={returnDetails}
                      onChange={(e) => setReturnDetails(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* SCREEN 2 / STEP 3: REVIEW & SUBMIT REQUEST */}
              {returnStep === 3 && (
                <div className="return-summary-container">
                  <h4 className="summary-headline">
                    <i className="fa-solid fa-clipboard-check text-teal" /> Review &amp; Confirm Return Request
                  </h4>

                  <div className="summary-details-card">
                    <div className="summary-row">
                      <span className="s-lbl">Order ID:</span>
                      <strong className="s-val">#{activeReturnOrder.id.replace('#', '')}</strong>
                    </div>

                    <div className="summary-row">
                      <span className="s-lbl">Selected Product:</span>
                      <strong className="s-val">
                        {activeReturnOrder.items.find((i) => i.sku === selectedReturnSku)?.name || activeReturnOrder.items[0].name}
                      </strong>
                    </div>

                    <div className="summary-row">
                      <span className="s-lbl">Return Quantity:</span>
                      <strong className="s-val">{returnQty} unit(s)</strong>
                    </div>

                    <div className="summary-row">
                      <span className="s-lbl">Return Reason:</span>
                      <strong className="s-val text-coral">{returnReason}</strong>
                    </div>

                    {returnDetails.trim() && (
                      <div className="summary-row">
                        <span className="s-lbl">Additional Notes:</span>
                        <span className="s-val" style={{ maxWidth: 300, textAlign: 'right' }}>{returnDetails}</span>
                      </div>
                    )}

                    <div className="summary-row">
                      <span className="s-lbl">Estimated Refund Amount:</span>
                      <strong className="s-val text-highlight">
                        ₹{(
                          returnQty *
                          (activeReturnOrder.items.find((i) => i.sku === selectedReturnSku)?.rate || 500)
                        ).toLocaleString()}
                      </strong>
                    </div>

                    <div className="summary-row">
                      <span className="s-lbl">Refund Method:</span>
                      <strong className="s-val">Original Payment Method (Direct Bank / UPI Refund)</strong>
                    </div>

                    <div className="summary-row">
                      <span className="s-lbl">Doorstep Pickup Address:</span>
                      <span className="s-val" style={{ maxWidth: 320, fontSize: '12px' }}>
                        {addresses.shippingAddress.street}, {addresses.shippingAddress.city}, {addresses.shippingAddress.state} - {addresses.shippingAddress.pincode}
                      </span>
                    </div>
                  </div>

                  <label className="eligibility-consent" style={{ marginTop: '16px' }}>
                    <input
                      type="checkbox"
                      checked={eligibilityConfirmed}
                      onChange={(e) => setEligibilityConfirmed(e.target.checked)}
                    />
                    <span>I confirm that the product is unused, in original sealed packaging, and matches the return conditions.</span>
                  </label>
                </div>
              )}

              {/* SUCCESS CONFIRMATION SCREEN */}
              {returnStep === 'success' && (
                <div className="return-success-container">
                  <div className="success-celebration-circle">
                    <i className="fa-solid fa-check" />
                  </div>

                  <h3>Return Request Submitted Successfully!</h3>

                  <div className="return-id-card">
                    <span className="id-lbl">Return Request ID</span>
                    <strong className="id-val">#{submittedReturnId.replace('#', '')}</strong>
                  </div>

                  <p>
                    Your return request for Order #{activeReturnOrder.id.replace('#', '')} has been logged. Our logistics team will inspect the request and schedule courier pickup.
                  </p>

                  <div className="success-actions-row">
                    <button
                      type="button"
                      className="btn-back-to-orders"
                      onClick={() => setActiveReturnOrder(null)}
                    >
                      <i className="fa-solid fa-box-open" /> Back to My Orders
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Navigation Footer */}
            {returnStep !== 'success' && (
              <div className="modal-foot wizard-foot">
                <div>
                  {returnStep === 2 ? (
                    <button
                      type="button"
                      className="btn-modal-secondary"
                      onClick={() => setActiveReturnOrder(null)}
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn-wizard-back"
                      onClick={() => setReturnStep(2)}
                    >
                      <i className="fa-solid fa-arrow-left" /> Back to Reason
                    </button>
                  )}
                </div>

                <div>
                  {returnStep === 2 && (
                    <button
                      type="button"
                      className="btn-wizard-next"
                      onClick={() => {
                        if (!returnReason) {
                          showToast('Please select a return reason.', 'danger');
                          return;
                        }
                        setReturnStep(3);
                      }}
                    >
                      Proceed to Review &amp; Submit <i className="fa-solid fa-arrow-right" />
                    </button>
                  )}

                  {returnStep === 3 && (
                    <button
                      type="button"
                      className="btn-wizard-next"
                      onClick={handleSubmitReturnRequest}
                      disabled={!eligibilityConfirmed}
                    >
                      <i className="fa-solid fa-paper-plane" /> Submit Return Request
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}


      {/* =========================================================================
          MODAL 8: RETURN POLICY EXPLAINER
          ========================================================================= */}

      {/* =========================================================================
          MODAL 8: PRODUCT RETURN POLICY EXPLAINER
          ========================================================================= */}
      {showReturnPolicyModal && (
        <div className="profile-modal-overlay" onClick={() => setShowReturnPolicyModal(false)}>
          <div className="profile-modal-card return-policy-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <span className="modal-tag">
                  <i className="fa-solid fa-shield-halved text-teal" /> PRESTODENTAL RETURN POLICY
                </span>
                <h3 className="modal-title">Return &amp; Refund Policy</h3>
              </div>
              <button type="button" className="btn-modal-close" onClick={() => setShowReturnPolicyModal(false)}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className="modal-body policy-modal-body">
              <p className="policy-intro">
                BuyBright ensures all dental supplies, rotary burs, and impression materials comply with rigorous healthcare and safety standards. Please review the return conditions below:
              </p>

              <div className="policy-rule-card">
                <div className="rule-icon"><i className="fa-solid fa-calendar-days" /></div>
                <div className="rule-text">
                  <h5>7-Day Return Window</h5>
                  <p>Return requests must be submitted within 7 days from the verified date of courier delivery.</p>
                </div>
              </div>

              <div className="policy-rule-card">
                <div className="rule-icon"><i className="fa-solid fa-box-archive" /></div>
                <div className="rule-text">
                  <h5>Original Packaging &amp; Sealed Condition</h5>
                  <p>The product must be unused, unadulterated, and intact in its original manufacturer packaging with all seals intact.</p>
                </div>
              </div>

              <div className="policy-rule-card">
                <div className="rule-icon"><i className="fa-solid fa-temperature-arrow-down" /></div>
                <div className="rule-text">
                  <h5>Hygiene &amp; Temperature-Sensitive Exemptions</h5>
                  <p>Opened rotary instruments, impression materials, autoclaved packs, and cold-chain biologics cannot be returned once unsealed.</p>
                </div>
              </div>

              <div className="policy-rule-card">
                <div className="rule-icon"><i className="fa-solid fa-hand-holding-dollar" /></div>
                <div className="rule-text">
                  <h5>Doorstep Pickup &amp; Direct Refund</h5>
                  <p>Once inspected and approved, 100% refund is initiated to your original payment method (Razorpay / UPI / Net Banking) within 3-5 business days.</p>
                </div>
              </div>
            </div>

            <div className="modal-foot">
              <button type="button" className="btn-modal-primary" onClick={() => setShowReturnPolicyModal(false)}>
                Understood, Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;

