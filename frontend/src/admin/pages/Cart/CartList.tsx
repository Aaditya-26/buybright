/**
 * BuyBright Admin — Cart Management Module.
 * Features:
 *   1. Analytics Dashboard:
 *      - Executive KPI Cards (Total Carts, Active Carts, Abandoned Carts, Converted Carts, Average Cart Value)
 *      - Cart Conversion Main Funnel (Cart -> Checkout -> Order)
 *      - Carts Over Time Interactive Trend Line/Area Chart (7D, 30D, 3M, 1Y)
 *      - Product Conversion Table: Product Name | Added to Cart | Converted | Abandoned
 *   2. Cart List:
 *      - Required Fields: Cart ID, Customer Name, Customer Type, Total Items, Cart Value, Coupon, Cart Status, Last Updated, Created Date, Actions (View Cart | View Customer | View Order)
 *   3. Cart Recovery Multi-Channel WhatsApp & Email Outreach Engine.
 */

import React, { useState, useMemo } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { DataTable, type Column } from '../../components/DataTable';
import { SearchBar } from '../../components/SearchBar';
import { Pagination } from '../../components/Pagination';
import { useToast } from '../../../context/ToastContext';
import {
  getCarts,
  getCartAnalyticsStats,
  getCartFunnelData,
  getCartTrendData,
  getProductConversionBreakdown,
  recordCartOutreach,
  type ProductConversionRow,
} from '../../data/cartData';
import {
  AdminCart,
  CartStatus,
  CustomerType,
} from '../../types/cart';
import { CartDetailsModal } from './CartDetailsModal';
import { CustomerQuickViewModal } from './CustomerQuickViewModal';
import { OrderQuickViewModal } from './OrderQuickViewModal';
import { ProductViewModal } from '../Wishlist/ProductViewModal';
import { WishlistMessageModal } from '../Wishlist/WishlistMessageModal';
import { AdminWishlistItem } from '../../../types/wishlist';
import { exportTableToCSV } from '../../utils/exportCsv';
import { exportTableToPDF } from '../../utils/exportPdf';

type CartTabType = 'analytics' | 'cart-list';
type TimeframeFilter = '7d' | '30d' | '3m' | '1y';

export const CartList: React.FC = () => {
  const { showToast } = useToast();

  // Tab State
  const [activeTab, setActiveTab] = useState<CartTabType>('analytics');

  // Master Data State
  const [carts, setCarts] = useState<AdminCart[]>(() => getCarts());

  // Search & Filter State for Tab 2
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | CartStatus>('All');
  const [customerTypeFilter, setCustomerTypeFilter] = useState<'All' | CustomerType>('All');
  const [selectedCartIds, setSelectedCartIds] = useState<string[]>([]);

  // Chart Timeframe State
  const [timeframe, setTimeframe] = useState<TimeframeFilter>('7d');
  const [hoveredTrendIndex, setHoveredTrendIndex] = useState<number | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modal States
  const [viewingCart, setViewingCart] = useState<AdminCart | null>(null);
  const [viewingCustomerCart, setViewingCustomerCart] = useState<AdminCart | null>(null);
  const [viewingOrderCart, setViewingOrderCart] = useState<AdminCart | null>(null);
  const [productViewItem, setProductViewItem] = useState<AdminWishlistItem | null>(null);
  const [messagingTargets, setMessagingTargets] = useState<AdminWishlistItem[]>([]);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  // ── Computed Statistics ───────────────────────────────────────────────────
  const stats = useMemo(() => getCartAnalyticsStats(carts), [carts]);
  const funnelStages = useMemo(() => getCartFunnelData(carts), [carts]);
  const trendData = useMemo(() => getCartTrendData(timeframe), [timeframe]);
  const productConversionData = useMemo(() => getProductConversionBreakdown(carts), [carts]);

  // ── Filtered Cart List for Tab 2 ──────────────────────────────────────────
  const filteredCarts = useMemo(() => {
    return carts.filter((cart) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        cart.id.toLowerCase().includes(q) ||
        cart.customerName.toLowerCase().includes(q) ||
        cart.customerEmail.toLowerCase().includes(q) ||
        cart.customerPhone.toLowerCase().includes(q) ||
        cart.clinicName.toLowerCase().includes(q) ||
        cart.city.toLowerCase().includes(q) ||
        (cart.couponCode && cart.couponCode.toLowerCase().includes(q)) ||
        cart.items.some((item) => item.productName.toLowerCase().includes(q) || item.productSku.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'All' || cart.cartStatus === statusFilter;
      const matchesType = customerTypeFilter === 'All' || cart.customerType === customerTypeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [carts, searchQuery, statusFilter, customerTypeFilter]);

  // Paginated carts
  const paginatedCarts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCarts.slice(start, start + pageSize);
  }, [filteredCarts, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredCarts.length / pageSize) || 1;

  // ── SVG Trend Chart Coordinates Generator ─────────────────────────────────
  const chartCoordinates = useMemo(() => {
    const width = 640;
    const height = 230;
    const pad = { top: 25, right: 35, bottom: 42, left: 45 };
    const innerW = width - pad.left - pad.right;
    const innerH = height - pad.top - pad.bottom;

    if (trendData.length === 0) {
      return { width, height, pad, innerW, innerH, yMax: 10, points: [], totalPath: '', abandonedPath: '', convertedPath: '', yTicks: [] };
    }

    const maxVal = Math.max(...trendData.map((d) => d.total), 10);
    const yMax = Math.ceil(maxVal * 1.2);
    const yTicks = [0, Math.round(yMax * 0.33), Math.round(yMax * 0.66), yMax];

    const points = trendData.map((d, idx) => {
      const divisor = Math.max(trendData.length - 1, 1);
      const x = pad.left + (idx / divisor) * innerW;
      const yTotal = pad.top + innerH - (d.total / yMax) * innerH;
      const yAbandoned = pad.top + innerH - (d.abandoned / yMax) * innerH;
      const yConverted = pad.top + innerH - (d.converted / yMax) * innerH;
      return { x, yTotal, yAbandoned, yConverted, data: d };
    });

    const createPath = (key: 'yTotal' | 'yAbandoned' | 'yConverted') => {
      let path = `M ${points[0].x} ${points[0][key]}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i === 0 ? 0 : i - 1];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

        const cp1x = p1.x + (p2.x - p0.x) / 5;
        const cp1y = p1[key] + (p2[key] - p0[key]) / 5;
        const cp2x = p2.x - (p3.x - p1.x) / 5;
        const cp2y = p2[key] - (p3[key] - p1[key]) / 5;

        path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2[key].toFixed(1)}`;
      }
      return path;
    };

    const totalPath = createPath('yTotal');
    const abandonedPath = createPath('yAbandoned');
    const convertedPath = createPath('yConverted');

    const totalArea = `${totalPath} L ${points[points.length - 1].x} ${pad.top + innerH} L ${points[0].x} ${pad.top + innerH} Z`;

    return {
      width,
      height,
      pad,
      innerW,
      innerH,
      yMax,
      points,
      totalPath,
      abandonedPath,
      convertedPath,
      totalArea,
      yTicks,
    };
  }, [trendData]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleToggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedCartIds(paginatedCarts.map((c) => c.id));
    } else {
      setSelectedCartIds([]);
    }
  };

  const handleToggleSelectCart = (id: string) => {
    setSelectedCartIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Convert Cart to Wishlist item structure for modals
  const convertCartToWishlistItem = (cart: AdminCart, itemIndex: number = 0): AdminWishlistItem => {
    const item = cart.items[itemIndex] || cart.items[0];
    const unitPrice = item ? item.unitPrice : cart.cartValue;
    const mrp = unitPrice + Math.round(unitPrice * 0.15);
    return {
      id: item ? `${cart.id}-${item.id}` : cart.id,
      customerId: cart.customerId,
      customerName: cart.customerName,
      customerEmail: cart.customerEmail,
      customerPhone: cart.customerPhone,
      customerAvatar: cart.customerAvatar,
      clinicName: cart.clinicName,
      productId: item ? item.productId : cart.id,
      productName: item ? item.productName : `Cart Items (${cart.totalItems})`,
      productSku: item ? item.productSku : cart.id,
      productCategory: 'Dental Clinic Supplies',
      productPrice: unitPrice,
      productMrp: mrp,
      productImage:
        item?.productImage ||
        'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&auto=format&fit=crop&q=80',
      stockStatus: item?.stockStatus || 'In Stock',
      stockQuantity: item?.stockQuantity || 24,
      dateAdded: cart.createdDate,
      status: 'In Wishlist',
      notifiedStatus: 'None',
    };
  };

  const handleViewCartProduct = (cart: AdminCart) => {
    setProductViewItem(convertCartToWishlistItem(cart));
  };

  const handleOpenSingleMessage = (cart: AdminCart) => {
    setMessagingTargets([convertCartToWishlistItem(cart)]);
    setIsMessageModalOpen(true);
  };

  // Direct WhatsApp trigger
  const handleQuickWhatsApp = (cart: AdminCart) => {
    const cleanPhone = cart.customerPhone.replace(/[^0-9]/g, '');
    const primaryItem = cart.items[0];
    const itemText = primaryItem ? `"${primaryItem.productName}"` : 'items in your cart';
    const msg = `Hello ${cart.customerName},\n\nWe noticed you left ${itemText} in your BuyBright shopping cart (Total: ₹${cart.cartValue.toLocaleString()})! 🛒✨\n\nIs there any special clinic discount or technical query we can help you with?\n\nBest regards,\nBuyBright Support Team`;
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  // Direct Email trigger
  const handleQuickEmail = (cart: AdminCart) => {
    const primaryItem = cart.items[0];
    const itemText = primaryItem ? `"${primaryItem.productName}"` : 'your cart items';
    const subject = encodeURIComponent(`Regarding your BuyBright Cart: ${itemText}`);
    const body = encodeURIComponent(
      `Dear ${cart.customerName},\n\nThank you for visiting BuyBright. We noticed you have saved ${itemText} in your cart (Total: ₹${cart.cartValue.toLocaleString()}).\n\nWe are pleased to inform you that our clinical sales team is ready to assist you with order processing or special institutional pricing.\n\nBest regards,\nBuyBright Team`
    );
    window.location.href = `mailto:${cart.customerEmail}?subject=${subject}&body=${body}`;
  };

  const handleOpenBulkMessage = () => {
    const selected = carts.filter((c) => selectedCartIds.includes(c.id));
    if (selected.length === 0) {
      showToast('Please select at least one cart to dispatch message outreach.', 'warning');
      return;
    }
    setMessagingTargets(selected.map((c) => convertCartToWishlistItem(c)));
    setIsMessageModalOpen(true);
  };

  const handleSendMessageSuccess = (
    targets: AdminWishlistItem[],
    _message: string,
    channels: { whatsapp: boolean; email: boolean }
  ) => {
    targets.forEach((t) => {
      recordCartOutreach(t.id, 'Dispatched cart recovery notification.');
    });
    setCarts(getCarts());

    const channelNames = [];
    if (channels.whatsapp) channelNames.push('WhatsApp');
    if (channels.email) channelNames.push('Email');

    showToast(
      `Dispatched recovery notification via ${channelNames.join(' & ')} to ${targets.length} customer(s).`,
      'success'
    );
    setSelectedCartIds([]);
    setIsMessageModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = [
      'Cart ID',
      'Customer Name',
      'Email',
      'Phone',
      'Customer Type',
      'Clinic Name',
      'City',
      'Total Items',
      'Cart Value (INR)',
      'Coupon Code',
      'Cart Status',
      'Last Updated',
      'Created Date',
    ];

    const rows = filteredCarts.map((c) => [
      c.id,
      c.customerName,
      c.customerEmail,
      c.customerPhone,
      c.customerType,
      c.clinicName,
      c.city,
      `${c.totalItems} Items (${c.totalQuantity} Units)`,
      c.cartValue,
      c.couponCode || 'None',
      c.cartStatus,
      c.lastUpdated,
      c.createdDate,
    ]);

    exportTableToCSV({
      filename: `BuyBright_Cart_Records_${new Date().toISOString().slice(0, 10)}.csv`,
      headers,
      rows,
    });
    showToast('Cart data exported to CSV.', 'success');
  };

  const handleExportPDF = () => {
    const headers = ['Cart ID', 'Customer Name', 'Clinic', 'Items', 'Cart Value', 'Coupon', 'Status', 'Updated'];
    const rows = filteredCarts.map((c) => [
      c.id,
      c.customerName,
      c.clinicName,
      `${c.totalItems} Items`,
      `₹${c.cartValue.toLocaleString()}`,
      c.couponCode || '—',
      c.cartStatus,
      c.lastUpdated,
    ]);

    exportTableToPDF({
      title: 'BuyBright — Cart Activity & Recovery Report',
      subtitle: `Exported on ${new Date().toLocaleDateString()} | Total Records: ${filteredCarts.length}`,
      headers,
      rows,
    });
    showToast('Cart report exported to PDF.', 'success');
  };

  // Helper Cart Status Badge
  const renderCartStatusBadge = (status: CartStatus) => {
    switch (status) {
      case 'Active':
        return (
          <span className="cart-badge badge-active">
            <i className="fa-solid fa-bolt" /> Active
          </span>
        );
      case 'Abandoned':
        return (
          <span className="cart-badge badge-abandoned">
            <i className="fa-solid fa-cart-arrow-down" /> Abandoned
          </span>
        );
      case 'Converted':
        return (
          <span className="cart-badge badge-converted">
            <i className="fa-solid fa-circle-check" /> Converted
          </span>
        );
      case 'Expired':
        return (
          <span className="cart-badge badge-expired">
            <i className="fa-solid fa-clock-rotate-left" /> Expired
          </span>
        );
      default:
        return null;
    }
  };


  // ── Tab 1: Product Conversion Table Columns ────────────────────────────────
  const productConversionColumns: Column<ProductConversionRow>[] = [
    {
      key: 'productName',
      header: 'Product Name',
      minWidth: '260px',
      render: (row) => (
        <div className="prod-conv-cell">
          <img
            src={row.productImage}
            alt={row.productName}
            className="prod-conv-thumb"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="prod-conv-info">
            <strong className="prod-conv-title" title={row.productName}>
              {row.productName}
            </strong>
            <span className="prod-conv-sku">{row.productSku} &bull; ₹{row.unitPrice.toLocaleString()}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'addedToCart',
      header: 'Added to Cart',
      width: '160px',
      render: (row) => (
        <div className="conv-stat-pill pill-added">
          <i className="fa-solid fa-cart-plus mr-1" />
          <strong>{row.addedToCartCount}</strong> Units
        </div>
      ),
    },
    {
      key: 'converted',
      header: 'Converted',
      width: '180px',
      render: (row) => (
        <div className="conv-stat-pill pill-converted">
          <i className="fa-solid fa-circle-check mr-1" />
          <strong>{row.convertedCount}</strong> Units
          <span className="conv-pct-sub">({row.conversionRate}%)</span>
        </div>
      ),
    },
    {
      key: 'abandoned',
      header: 'Abandoned',
      width: '180px',
      render: (row) => {
        const dropPct =
          row.addedToCartCount > 0 ? Math.round((row.abandonedCount / row.addedToCartCount) * 100) : 0;
        return (
          <div className="conv-stat-pill pill-abandoned">
            <i className="fa-solid fa-cart-arrow-down mr-1" />
            <strong>{row.abandonedCount}</strong> Units
            <span className="drop-pct-sub">({dropPct}%)</span>
          </div>
        );
      },
    },
  ];

  // ── Tab 2: Exact Required Fields Table Columns ─────────────────────────────
  const cartTableColumns: Column<AdminCart>[] = [
    {
      key: 'cartId',
      header: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={paginatedCarts.length > 0 && selectedCartIds.length === paginatedCarts.length}
            onChange={handleToggleSelectAll}
            title="Select all on this page"
            className="admin-table-checkbox"
          />
          <span>Cart ID</span>
        </div>
      ),
      width: '135px',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={selectedCartIds.includes(row.id)}
            onChange={() => handleToggleSelectCart(row.id)}
            className="admin-table-checkbox"
          />
          <strong
            className="cart-id-link"
            onClick={() => setViewingCart(row)}
            title="Click to view full cart details"
          >
            {row.id}
          </strong>
        </div>
      ),
    },
    {
      key: 'customerName',
      header: 'Customer Name',
      minWidth: '220px',
      render: (row) => (
        <div className="cust-cell-wrap">
          <div className="cust-cell-avatar">
            {row.customerAvatar ? (
              <img src={row.customerAvatar} alt={row.customerName} />
            ) : (
              <span>{row.customerName.slice(0, 2).toUpperCase()}</span>
            )}
          </div>
          <div className="cust-cell-info">
            <strong
              className="cust-cell-name clickable-link"
              onClick={() => setViewingCustomerCart(row)}
              title="Click to view customer profile"
            >
              {row.customerName}
            </strong>
            <span className="cust-cell-clinic" title={row.clinicName}>
              {row.clinicName}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'products',
      header: 'PRODUCT(S)',
      minWidth: '240px',
      render: (row) => {
        const primaryItem = row.items[0];
        const extraCount = row.items.length - 1;
        return (
          <div
            className="table-product-cell clickable-product-cell"
            onClick={() => handleViewCartProduct(row)}
            title="Click to view product specifications"
          >
            <img
              src={
                primaryItem?.productImage ||
                'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=100&auto=format&fit=crop&q=60'
              }
              alt={primaryItem?.productName || 'Cart Item'}
              className="product-col-thumb"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="product-col-info">
              <strong className="product-col-name" title={primaryItem?.productName}>
                {primaryItem ? primaryItem.productName : 'No items in cart'}
              </strong>
              <div className="product-col-meta">
                {primaryItem && <span className="sku-badge">{primaryItem.productSku}</span>}
                {primaryItem && (
                  <strong className="product-price-badge">
                    ₹{primaryItem.unitPrice.toLocaleString()}
                  </strong>
                )}
                {extraCount > 0 && (
                  <span className="extra-count-badge" title={`${extraCount} more products in this cart`}>
                    +{extraCount} more
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: 'totalItems',
      header: 'Total Items',
      width: '130px',
      render: (row) => (
        <div className="total-items-cell">
          <span className="items-main-val">
            <i className="fa-solid fa-box-archive mr-1 text-muted" />
            <strong>{row.totalItems}</strong> Items
          </span>
          <span className="units-sub-val">({row.totalQuantity} Units)</span>
        </div>
      ),
    },
    {
      key: 'cartValue',
      header: 'Cart Value',
      width: '130px',
      render: (row) => (
        <div className="cart-value-cell">
          <strong className="value-txt">₹{row.cartValue.toLocaleString()}</strong>
          {row.couponDiscount > 0 && (
            <span className="discount-tag">-₹{row.couponDiscount.toLocaleString()}</span>
          )}
        </div>
      ),
    },
    {
      key: 'coupon',
      header: 'Coupon',
      width: '110px',
      render: (row) =>
        row.couponCode ? (
          <span className="coupon-code-pill" title={`Coupon: ${row.couponCode}`}>
            <i className="fa-solid fa-ticket mr-1" />
            {row.couponCode}
          </span>
        ) : (
          <span className="no-coupon-tag">—</span>
        ),
    },
    {
      key: 'cartStatus',
      header: 'Cart Status',
      width: '130px',
      render: (row) => renderCartStatusBadge(row.cartStatus),
    },
    {
      key: 'lastUpdated',
      header: 'Last Updated',
      width: '150px',
      render: (row) => (
        <div className="date-time-cell">
          <span className="time-val">{row.lastUpdated}</span>
        </div>
      ),
    },
    {
      key: 'createdDate',
      header: 'Created Date',
      width: '145px',
      render: (row) => (
        <div className="date-time-cell">
          <span className="date-val">{row.createdDate}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'ACTIONS',
      width: '190px',
      render: (row) => (
        <div className="table-actions-cell">
          <button
            type="button"
            className="action-btn btn-view"
            onClick={() => handleViewCartProduct(row)}
            title="View Product Specifications"
          >
            <i className="fa-solid fa-eye" />
          </button>

          <button
            type="button"
            className="btn-outreach-icon btn-wa-icon"
            onClick={() => handleQuickWhatsApp(row)}
            title={`Direct WhatsApp to ${row.customerName} (${row.customerPhone})`}
          >
            <i className="fa-brands fa-whatsapp" />
          </button>

          <button
            type="button"
            className="btn-outreach-icon btn-em-icon"
            onClick={() => handleQuickEmail(row)}
            title={`Email ${row.customerEmail}`}
          >
            <i className="fa-regular fa-envelope" />
          </button>

          <button
            type="button"
            className="btn-outreach-text"
            onClick={() => handleOpenSingleMessage(row)}
            title={`Compose custom message for ${row.customerName}`}
          >
            <i className="fa-solid fa-paper-plane mr-1" /> Message
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Cart Management & Abandonment Recovery"
      subtitle="Monitor live shopping carts, analyze conversion bottlenecks, and dispatch targeted WhatsApp recovery outreach."
    >
      <div className="admin-page-container cart-management-page">
        {/* ── Main Module Tabs Navigation ── */}
        <div className="cart-main-tabs-bar">
          <button
            type="button"
            className={`tab-switch-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('analytics');
              setCurrentPage(1);
            }}
          >
            <i className="fa-solid fa-chart-line" />
            <span>Analytics Dashboard</span>
            <span className="tab-badge">{carts.length} Total Carts</span>
          </button>

          <button
            type="button"
            className={`tab-switch-btn ${activeTab === 'cart-list' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('cart-list');
              setCurrentPage(1);
            }}
          >
            <i className="fa-solid fa-cart-flatbed" />
            <span>Cart List</span>
            <span className="tab-badge">{filteredCarts.length} Records</span>
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 1: ANALYTICS DASHBOARD, CONVERSION FUNNEL & PRODUCT BREAKDOWN
           ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'analytics' && (
          <>
            {/* 1. Executive KPI Cards Row */}
            <div className="cart-stats-grid">
              {/* Card 1: Total Carts */}
              <div className="cart-stat-card card-total">
                <div className="stat-card-icon">
                  <i className="fa-solid fa-cart-shopping" />
                </div>
                <div className="stat-card-info">
                  <span className="stat-label">Total Carts</span>
                  <strong className="stat-number">{stats.totalCarts}</strong>
                  <span className="stat-subtext">
                    Gross Demand: <strong>₹{stats.totalPotentialRevenue.toLocaleString()}</strong>
                  </span>
                </div>
              </div>

              {/* Card 2: Active Carts */}
              <div className="cart-stat-card card-active">
                <div className="stat-card-icon">
                  <i className="fa-solid fa-bolt" />
                </div>
                <div className="stat-card-info">
                  <span className="stat-label">Active Carts</span>
                  <strong className="stat-number">{stats.activeCarts}</strong>
                  <span className="stat-subtext text-cyan">In session right now</span>
                </div>
              </div>

              {/* Card 3: Abandoned Carts */}
              <div className="cart-stat-card card-abandoned">
                <div className="stat-card-icon">
                  <i className="fa-solid fa-cart-arrow-down" />
                </div>
                <div className="stat-card-info">
                  <span className="stat-label">Abandoned Carts</span>
                  <strong className="stat-number">{stats.abandonedCarts}</strong>
                  <span className="stat-subtext text-amber">
                    {stats.abandonmentRate}% Abandonment rate
                  </span>
                </div>
              </div>

              {/* Card 4: Converted Carts */}
              <div className="cart-stat-card card-converted">
                <div className="stat-card-icon">
                  <i className="fa-solid fa-circle-check" />
                </div>
                <div className="stat-card-info">
                  <span className="stat-label">Converted Carts</span>
                  <strong className="stat-number">{stats.convertedCarts}</strong>
                  <span className="stat-subtext text-emerald">
                    {stats.conversionRate}% Conversion rate
                  </span>
                </div>
              </div>

              {/* Card 5: Average Cart Value */}
              <div className="cart-stat-card card-avg">
                <div className="stat-card-icon">
                  <i className="fa-solid fa-coins" />
                </div>
                <div className="stat-card-info">
                  <span className="stat-label">Average Cart Value</span>
                  <strong className="stat-number">₹{stats.averageCartValue.toLocaleString()}</strong>
                  <span className="stat-subtext">Per doctor checkout</span>
                </div>
              </div>
            </div>

            {/* 2. Visual Analytics Grid: Main Funnel Chart + Line Graph Over Time */}
            <div className="cart-visual-analytics-grid mt-3">
              {/* Left Column: Cart Conversion — Main Chart (Cart -> Checkout -> Order) */}
              <div className="admin-card funnel-card">
                <div className="chart-card-header">
                  <div className="chart-title-wrap">
                    <i className="fa-solid fa-filter-circle-dollar text-primary mr-2" />
                    <div>
                      <h4 className="chart-title">Cart Conversion &bull; Main Funnel</h4>
                      <p className="chart-sub">
                        Cart &rarr; Checkout &rarr; Order conversion drop-off analysis.
                      </p>
                    </div>
                  </div>
                  <span className="funnel-rate-badge">
                    {stats.conversionRate}% Overall Conversion
                  </span>
                </div>

                {/* Funnel Flow Visual */}
                <div className="funnel-steps-container">
                  {funnelStages.map((stage, idx) => (
                    <div key={stage.stage} className="funnel-step-wrapper">
                      <div className="funnel-step-card" style={{ borderLeftColor: stage.color }}>
                        <div className="step-left">
                          <div
                            className="step-icon-circle"
                            style={{ backgroundColor: `${stage.color}15`, color: stage.color }}
                          >
                            <i className={`fa-solid ${stage.icon}`} />
                          </div>
                          <div className="step-info">
                            <strong className="step-title">{stage.stage}</strong>
                            <p className="step-desc">{stage.description}</p>
                          </div>
                        </div>

                        <div className="step-right">
                          <strong className="step-count">{stage.count} Carts</strong>
                          <span
                            className="step-pct-pill"
                            style={{ backgroundColor: `${stage.color}20`, color: stage.color }}
                          >
                            {stage.percentage}% of Initial
                          </span>
                        </div>
                      </div>

                      {/* Drop-off connector between stages */}
                      {idx < funnelStages.length - 1 && (
                        <div className="funnel-connector-bar">
                          <div className="connector-line" />
                          <div className="drop-off-badge">
                            <i className="fa-solid fa-arrow-trend-down mr-1" />
                            <span>
                              {stage.dropOffCount} Dropped Off ({stage.dropOffPercentage}% loss)
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="funnel-footer-note">
                  <i className="fa-solid fa-lightbulb mr-1 text-amber" />
                  <strong>Conversion Insight:</strong> Dropped-off checkouts can be recovered instantly using direct WhatsApp recovery prompts.
                </div>
              </div>

              {/* Right Column: Carts Over Time — Line / Area Chart */}
              <div className="admin-card trend-graph-card">
                <div className="chart-card-header">
                  <div className="chart-title-wrap">
                    <i className="fa-solid fa-chart-area text-primary mr-2" />
                    <div>
                      <h4 className="chart-title">Carts Over Time &bull; Trend</h4>
                      <p className="chart-sub">Total, Active, Abandoned &amp; Converted trajectory</p>
                    </div>
                  </div>

                  {/* Filter Buttons: 7 Days | 30 Days | 3 Months | 1 Year */}
                  <div className="timeframe-filters-group">
                    <button
                      type="button"
                      className={`time-filter-btn ${timeframe === '7d' ? 'active' : ''}`}
                      onClick={() => setTimeframe('7d')}
                    >
                      7 Days
                    </button>
                    <button
                      type="button"
                      className={`time-filter-btn ${timeframe === '30d' ? 'active' : ''}`}
                      onClick={() => setTimeframe('30d')}
                    >
                      30 Days
                    </button>
                    <button
                      type="button"
                      className={`time-filter-btn ${timeframe === '3m' ? 'active' : ''}`}
                      onClick={() => setTimeframe('3m')}
                    >
                      3 Months
                    </button>
                    <button
                      type="button"
                      className={`time-filter-btn ${timeframe === '1y' ? 'active' : ''}`}
                      onClick={() => setTimeframe('1y')}
                    >
                      1 Year
                    </button>
                  </div>
                </div>

                {/* Chart Legend */}
                <div className="chart-legend-strip">
                  <div className="legend-item">
                    <span className="legend-dot dot-total" />
                    <span>Total Carts</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot dot-abandoned" />
                    <span>Abandoned</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot dot-converted" />
                    <span>Converted</span>
                  </div>
                </div>

                {/* Interactive SVG Line Graph */}
                <div className="cart-svg-chart-wrapper">
                  <svg
                    viewBox={`0 0 ${chartCoordinates.width} ${chartCoordinates.height}`}
                    className="cart-svg-chart"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      <linearGradient id="totalAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#0d9488" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
                      </linearGradient>
                      <filter id="cartGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#0d9488" floodOpacity="0.4" />
                      </filter>
                    </defs>

                    {/* Y-Axis Grid Lines */}
                    {chartCoordinates.yTicks.map((val) => {
                      const yPos =
                        chartCoordinates.pad.top +
                        chartCoordinates.innerH -
                        (val / chartCoordinates.yMax) * chartCoordinates.innerH;
                      return (
                        <g key={val} className="grid-line-group">
                          <line
                            x1={chartCoordinates.pad.left}
                            y1={yPos}
                            x2={chartCoordinates.pad.left + chartCoordinates.innerW}
                            y2={yPos}
                            stroke="#e2e8f0"
                            strokeDasharray="4 4"
                            strokeWidth="1"
                          />
                          <text
                            x={chartCoordinates.pad.left - 10}
                            y={yPos + 4}
                            fill="#94a3b8"
                            fontSize="10"
                            fontWeight="600"
                            textAnchor="end"
                          >
                            {val}
                          </text>
                        </g>
                      );
                    })}

                    {/* Shaded Area for Total Carts */}
                    {chartCoordinates.totalArea && (
                      <path d={chartCoordinates.totalArea} fill="url(#totalAreaGrad)" />
                    )}

                    {/* Line 1: Total Carts (Teal) */}
                    {chartCoordinates.totalPath && (
                      <path
                        d={chartCoordinates.totalPath}
                        fill="none"
                        stroke="#0d9488"
                        strokeWidth="2.8"
                        filter="url(#cartGlow)"
                      />
                    )}

                    {/* Line 2: Abandoned Carts (Amber) */}
                    {chartCoordinates.abandonedPath && (
                      <path
                        d={chartCoordinates.abandonedPath}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2.2"
                        strokeDasharray="5 3"
                      />
                    )}

                    {/* Line 3: Converted Carts (Emerald) */}
                    {chartCoordinates.convertedPath && (
                      <path
                        d={chartCoordinates.convertedPath}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2.2"
                      />
                    )}

                    {/* Interactive Points & X-Labels */}
                    {chartCoordinates.points.map((pt, idx) => {
                      const isHovered = hoveredTrendIndex === idx;
                      return (
                        <g
                          key={pt.data.date}
                          className="chart-interactive-point"
                          onMouseEnter={() => setHoveredTrendIndex(idx)}
                          onMouseLeave={() => setHoveredTrendIndex(null)}
                          style={{ cursor: 'pointer' }}
                        >
                          {/* Total Node */}
                          <circle
                            cx={pt.x}
                            cy={pt.yTotal}
                            r={isHovered ? 6 : 4}
                            fill="#ffffff"
                            stroke="#0d9488"
                            strokeWidth={isHovered ? '3' : '2'}
                          />

                          {/* Abandoned Node */}
                          <circle
                            cx={pt.x}
                            cy={pt.yAbandoned}
                            r={isHovered ? 5 : 3.5}
                            fill="#ffffff"
                            stroke="#f59e0b"
                            strokeWidth="2"
                          />

                          {/* Converted Node */}
                          <circle
                            cx={pt.x}
                            cy={pt.yConverted}
                            r={isHovered ? 5 : 3.5}
                            fill="#ffffff"
                            stroke="#10b981"
                            strokeWidth="2"
                          />

                          {/* X-Axis Label */}
                          <text
                            x={pt.x}
                            y={chartCoordinates.pad.top + chartCoordinates.innerH + 18}
                            fill={isHovered ? '#0d9488' : '#64748b'}
                            fontSize="10"
                            fontWeight={isHovered ? '800' : '600'}
                            textAnchor="middle"
                          >
                            {pt.data.date}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  {/* Tooltip on Hover */}
                  {hoveredTrendIndex !== null && chartCoordinates.points[hoveredTrendIndex] && (
                    <div
                      className="cart-trend-tooltip-card"
                      style={{
                        left: `${Math.min(
                          Math.max(
                            (chartCoordinates.points[hoveredTrendIndex].x / chartCoordinates.width) * 100,
                            18
                          ),
                          82
                        )}%`,
                      }}
                    >
                      <div className="tooltip-title">
                        {chartCoordinates.points[hoveredTrendIndex].data.label}
                      </div>
                      <div className="tooltip-stat-row">
                        <span>Total Carts:</span>
                        <strong className="text-teal">
                          {chartCoordinates.points[hoveredTrendIndex].data.total}
                        </strong>
                      </div>
                      <div className="tooltip-stat-row">
                        <span>Abandoned:</span>
                        <strong className="text-amber">
                          {chartCoordinates.points[hoveredTrendIndex].data.abandoned}
                        </strong>
                      </div>
                      <div className="tooltip-stat-row">
                        <span>Converted:</span>
                        <strong className="text-emerald">
                          {chartCoordinates.points[hoveredTrendIndex].data.converted}
                        </strong>
                      </div>
                      <div className="tooltip-stat-row">
                        <span>Avg Cart Value:</span>
                        <strong>
                          ₹{chartCoordinates.points[hoveredTrendIndex].data.avgValue.toLocaleString()}
                        </strong>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Product Conversion Breakdown Table (Product Name | Added to Cart | Converted | Abandoned) */}
            <div className="admin-card table-wrapper-card mt-3">
              <div className="prod-conv-header-strip">
                <div className="strip-title">
                  <i className="fa-solid fa-boxes-stacked mr-2 text-primary" />
                  <strong>Product Cart Conversion Breakdown</strong>
                  <span className="count-sub">({productConversionData.length} Products Tracked)</span>
                </div>
              </div>

              <DataTable
                columns={productConversionColumns}
                data={productConversionData}
                keyExtractor={(row) => row.productId}
                emptyMessage="No product cart conversion data available."
              />
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 2: CART LIST & OUTREACH MANAGEMENT (MAIN PAGE)
           ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'cart-list' && (
          <>
            {/* Table Controls Card */}
            <div className="admin-card table-controls-card">
              <div className="table-controls-top-row">
                <div className="table-title-banner">
                  <i className="fa-solid fa-cart-flatbed mr-2 text-primary" />
                  <strong>Live Shopping Carts &amp; Abandonment Registry</strong>
                  <span className="count-pill">({filteredCarts.length} Records)</span>
                </div>

                <div className="export-buttons-group">
                  <button
                    type="button"
                    className="btn-admin-primary btn-send-bulk-msg"
                    onClick={handleOpenBulkMessage}
                    disabled={selectedCartIds.length === 0}
                  >
                    <i className="fa-brands fa-whatsapp" />
                    {selectedCartIds.length > 0
                      ? `Message (${selectedCartIds.length}) Selected`
                      : 'Bulk Recovery Message'}
                  </button>

                  <button type="button" className="btn-admin-outline" onClick={handleExportCSV}>
                    <i className="fa-solid fa-file-csv" /> Export CSV
                  </button>

                  <button type="button" className="btn-admin-outline" onClick={handleExportPDF}>
                    <i className="fa-solid fa-file-pdf" /> Export PDF
                  </button>
                </div>
              </div>

              {/* Filters & Search Row */}
              <div className="table-filters-row mt-3">
                <div className="search-bar-wrap">
                  <SearchBar
                    placeholder="Search by Cart ID, Doctor, Clinic, Phone, SKU..."
                    value={searchQuery}
                    onChange={(q: string) => {
                      setSearchQuery(q);
                      setCurrentPage(1);
                    }}
                    width="100%"
                  />
                </div>

                <div className="filters-right-group">
                  {/* Status Filter */}
                  <div className="filter-select-wrap">
                    <label className="filter-lbl">Status:</label>
                    <select
                      className="admin-form-select filter-select"
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value as 'All' | CartStatus);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="All">All Statuses ({carts.length})</option>
                      <option value="Active">Active ({stats.activeCarts})</option>
                      <option value="Abandoned">Abandoned ({stats.abandonedCarts})</option>
                      <option value="Converted">Converted ({stats.convertedCarts})</option>
                      <option value="Expired">Expired ({stats.expiredCarts})</option>
                    </select>
                  </div>

                  {/* Customer Type Filter */}
                  <div className="filter-select-wrap">
                    <label className="filter-lbl">Customer Type:</label>
                    <select
                      className="admin-form-select filter-select"
                      value={customerTypeFilter}
                      onChange={(e) => {
                        setCustomerTypeFilter(e.target.value as 'All' | CustomerType);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="All">All Customer Types</option>
                      <option value="Dentist / Clinic Owner">Dentist / Clinic Owner</option>
                      <option value="Dental Hospital / Chain">Dental Hospital / Chain</option>
                      <option value="Dental Student / Resident">Dental Student / Resident</option>
                      <option value="Wholesale / Dealer">Wholesale / Dealer</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="admin-card table-wrapper-card mt-3">
              <DataTable
                columns={cartTableColumns}
                data={paginatedCarts}
                keyExtractor={(row) => row.id}
                emptyMessage="No shopping carts found matching your search and filter criteria."
              />

              {filteredCarts.length > pageSize && (
                <div className="table-pagination-footer">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalItems={filteredCarts.length}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Modals ── */}
      {/* 1. Cart Details Modal (Clicking Cart ID) */}
      <CartDetailsModal
        cart={viewingCart}
        isOpen={Boolean(viewingCart)}
        onClose={() => setViewingCart(null)}
        onOpenMessage={(cart) => {
          setViewingCart(null);
          handleOpenSingleMessage(cart);
        }}
        onViewCustomer={(cart) => {
          setViewingCart(null);
          setViewingCustomerCart(cart);
        }}
        onViewOrder={(_orderId) => {
          if (viewingCart) {
            setViewingOrderCart(viewingCart);
          }
        }}
      />

      {/* 2. Customer Quick Profile Modal (View Customer) */}
      <CustomerQuickViewModal
        cart={viewingCustomerCart}
        isOpen={Boolean(viewingCustomerCart)}
        onClose={() => setViewingCustomerCart(null)}
        onComposeMessage={(cart) => {
          setViewingCustomerCart(null);
          handleOpenSingleMessage(cart);
        }}
      />

      {/* 3. Converted Order Quick Modal (View Order) */}
      <OrderQuickViewModal
        cart={viewingOrderCart}
        isOpen={Boolean(viewingOrderCart)}
        onClose={() => setViewingOrderCart(null)}
      />

      {/* 4. Product Quick View Modal (Exact same as Wishlist) */}
      <ProductViewModal
        isOpen={Boolean(productViewItem)}
        onClose={() => setProductViewItem(null)}
        item={productViewItem}
      />

      {/* 5. WhatsApp & Email Message Outreach Modal (Exact same as Wishlist) */}
      <WishlistMessageModal
        isOpen={isMessageModalOpen}
        onClose={() => {
          setIsMessageModalOpen(false);
          setMessagingTargets([]);
        }}
        targetItems={messagingTargets}
        onSendMessage={handleSendMessageSuccess}
      />
    </AdminLayout>
  );
};
