/**
 * BuyBright Admin — Wishlist Analytics & Customer Logs Management Page.
 * Two Primary Tabs:
 *   1. Product Demand & Analytics (KPI Cards, Category Demand Graph, Stock Health, Product Table)
 *   2. Customer Wishlist Logs & Direct Outreach (Customer logs, View Product Modal, Single & Bulk Messaging)
 */

import React, { useState, useMemo } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { DataTable, type Column } from '../../components/DataTable';
import { SearchBar } from '../../components/SearchBar';
import { Pagination } from '../../components/Pagination';
import { useToast } from '../../../context/ToastContext';
import {
  getWishlistItems,
  getWishlistStats,
} from '../../data/wishlistData';
import {
  AdminWishlistItem,
  WishlistStockStatus,
} from '../../../types/wishlist';
import { ProductViewModal } from './ProductViewModal';
import { WishlistMessageModal } from './WishlistMessageModal';
import { exportTableToCSV } from '../../utils/exportCsv';
import { exportTableToPDF } from '../../utils/exportPdf';

type WishlistTabType = 'analytics' | 'customer-logs';

const DENTAL_CATEGORIES = [
  'All',
  'Endodontics',
  'Materials',
  'Equipment',
  'Consumables',
  'Orthodontics',
  'Implants',
  'Instruments',
];

interface UniqueProductDemandRow {
  productId: string;
  productName: string;
  productSku: string;
  productCategory: string;
  productPrice: number;
  productMrp: number;
  productImage: string;
  stockStatus: WishlistStockStatus;
  stockQuantity: number;
  totalSaves: number;
  totalDemandValue: number;
  sampleItem: AdminWishlistItem;
}

export const WishlistList: React.FC = () => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<WishlistTabType>('analytics');
  const [wishlistItems] = useState<AdminWishlistItem[]>(() => getWishlistItems());

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'All' | WishlistStockStatus>('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Selected customer log IDs for bulk messaging
  const [selectedLogIds, setSelectedLogIds] = useState<string[]>([]);

  // Modals state
  const [productViewItem, setProductViewItem] = useState<AdminWishlistItem | null>(null);
  const [messagingTargets, setMessagingTargets] = useState<AdminWishlistItem[]>([]);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  // Top 10 Line Graph Hover State
  const [hoveredTop10Index, setHoveredTop10Index] = useState<number | null>(null);

  // Compute live statistics
  const stats = useMemo(() => getWishlistStats(wishlistItems), [wishlistItems]);

  // Compute unique products demand summary for Tab 1
  const uniqueProductsDemand = useMemo(() => {
    const productMap = new Map<string, UniqueProductDemandRow>();

    wishlistItems.forEach((item) => {
      const key = item.productId || item.productSku;
      if (!productMap.has(key)) {
        productMap.set(key, {
          productId: item.productId,
          productName: item.productName,
          productSku: item.productSku,
          productCategory: item.productCategory,
          productPrice: item.productPrice,
          productMrp: item.productMrp,
          productImage: item.productImage,
          stockStatus: item.stockStatus,
          stockQuantity: item.stockQuantity,
          totalSaves: 1,
          totalDemandValue: item.productPrice,
          sampleItem: item,
        });
      } else {
        const existing = productMap.get(key)!;
        existing.totalSaves += 1;
        existing.totalDemandValue += item.productPrice;
      }
    });

    return Array.from(productMap.values()).sort((a, b) => b.totalSaves - a.totalSaves);
  }, [wishlistItems]);

  // Top 10 Wishlisted Products for Line Graph
  const top10WishlistProducts = useMemo(() => {
    return uniqueProductsDemand.slice(0, 10);
  }, [uniqueProductsDemand]);

  // Top 10 SVG Line Graph Data Coordinates
  const top10GraphData = useMemo(() => {
    const width = 560;
    const height = 210;
    const pad = { top: 25, right: 35, bottom: 42, left: 45 };
    const innerW = width - pad.left - pad.right;
    const innerH = height - pad.top - pad.bottom;

    if (top10WishlistProducts.length === 0) {
      return { width, height, pad, innerW, innerH, yMax: 10, points: [], linePath: '', areaPath: '', yTicks: [] };
    }

    const maxVal = Math.max(...top10WishlistProducts.map((p) => p.totalSaves), 4);
    const yMax = Math.ceil(maxVal * 1.25);
    const yTicks = [0, Math.round(yMax * 0.33), Math.round(yMax * 0.66), yMax];

    const points = top10WishlistProducts.map((prod, idx) => {
      const divisor = Math.max(top10WishlistProducts.length - 1, 1);
      const x = pad.left + (idx / divisor) * innerW;
      const y = pad.top + innerH - (prod.totalSaves / yMax) * innerH;
      return {
        x,
        y,
        prod,
        rank: idx + 1,
      };
    });

    // Generate smooth bezier curve path
    let linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 5;
      const cp1y = p1.y + (p2.y - p0.y) / 5;
      const cp2x = p2.x - (p3.x - p1.x) / 5;
      const cp2y = p2.y - (p3.y - p1.y) / 5;

      linePath += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }

    const areaPath = `${linePath} L ${points[points.length - 1].x} ${pad.top + innerH} L ${points[0].x} ${pad.top + innerH} Z`;

    return {
      width,
      height,
      pad,
      innerW,
      innerH,
      yMax,
      points,
      linePath,
      areaPath,
      yTicks,
    };
  }, [top10WishlistProducts]);

  // Filtered unique products for Tab 1 Analytics Dashboard
  const paginatedAnalyticsDemand = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return uniqueProductsDemand.slice(start, start + pageSize);
  }, [uniqueProductsDemand, currentPage, pageSize]);

  // Filtered individual customer wishlist logs for Tab 2
  const filteredCustomerLogs = useMemo(() => {
    return wishlistItems.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.id.toLowerCase().includes(q) ||
        item.productName.toLowerCase().includes(q) ||
        item.productSku.toLowerCase().includes(q) ||
        item.productCategory.toLowerCase().includes(q) ||
        item.customerName.toLowerCase().includes(q) ||
        item.customerEmail.toLowerCase().includes(q) ||
        item.customerPhone.toLowerCase().includes(q) ||
        (item.clinicName && item.clinicName.toLowerCase().includes(q));

      const matchesStock = stockFilter === 'All' || item.stockStatus === stockFilter;
      const matchesCategory = categoryFilter === 'All' || item.productCategory === categoryFilter;

      return matchesSearch && matchesStock && matchesCategory;
    });
  }, [wishlistItems, searchQuery, stockFilter, categoryFilter]);

  // Paginated customer logs for Tab 2
  const paginatedCustomerLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCustomerLogs.slice(start, start + pageSize);
  }, [filteredCustomerLogs, currentPage, pageSize]);

  const currentTabTotalCount = activeTab === 'analytics' ? uniqueProductsDemand.length : filteredCustomerLogs.length;
  const totalPages = Math.ceil(currentTabTotalCount / pageSize) || 1;

  // Category demand graph data
  const categoryGraphData = useMemo(() => {
    const total = wishlistItems.length || 1;
    const categories = [
      { name: 'Endodontics', icon: 'fa-tooth', color: '#0d9488' },
      { name: 'Materials', icon: 'fa-flask', color: '#3b82f6' },
      { name: 'Equipment', icon: 'fa-microscope', color: '#8b5cf6' },
      { name: 'Consumables', icon: 'fa-box-tissue', color: '#f59e0b' },
      { name: 'Orthodontics', icon: 'fa-wand-magic-sparkles', color: '#ec4899' },
      { name: 'Implants', icon: 'fa-screwdriver-wrench', color: '#10b981' },
    ];

    return categories.map((cat) => {
      const count = stats.categoryCounts[cat.name] || 0;
      const percentage = Math.round((count / total) * 100);
      return {
        ...cat,
        count,
        percentage,
      };
    });
  }, [wishlistItems, stats]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleOpenSingleMessage = (item: AdminWishlistItem) => {
    setMessagingTargets([item]);
    setIsMessageModalOpen(true);
  };

  const handleOpenBulkMessage = () => {
    const selectedItems = wishlistItems.filter((item) => selectedLogIds.includes(item.id));
    if (selectedItems.length === 0) {
      showToast('Please select at least one customer from the list.', 'warning');
      return;
    }
    setMessagingTargets(selectedItems);
    setIsMessageModalOpen(true);
  };

  const handleSendMessageSuccess = (
    targets: AdminWishlistItem[],
    _messageText: string,
    channels: { whatsapp: boolean; email: boolean }
  ) => {
    const channelNames = [];
    if (channels.whatsapp) channelNames.push('WhatsApp');
    if (channels.email) channelNames.push('Email');

    showToast(
      `✓ Message dispatched to ${targets.length} doctor(s) via ${channelNames.join(' & ')}!`,
      'success'
    );
    setSelectedLogIds([]);
  };

  const toggleSelectAll = () => {
    if (selectedLogIds.length === paginatedCustomerLogs.length) {
      setSelectedLogIds([]);
    } else {
      setSelectedLogIds(paginatedCustomerLogs.map((item) => item.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedLogIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Direct WhatsApp trigger
  const handleQuickWhatsApp = (item: AdminWishlistItem) => {
    const cleanPhone = item.customerPhone.replace(/[^0-9]/g, '');
    const msg = `Hello ${item.customerName},\n\nWe noticed you saved "${item.productName}" in your BuyBright wishlist! 📦✨\n\nIs there any special clinic discount or technical query we can help you with?\n\nBest regards,\nBuyBright Support Team`;
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  // Direct Email trigger
  const handleQuickEmail = (item: AdminWishlistItem) => {
    const subject = encodeURIComponent(`Regarding your BuyBright Wishlist: ${item.productName}`);
    const body = encodeURIComponent(
      `Dear ${item.customerName},\n\nThank you for saving "${item.productName}" in your BuyBright wishlist.\n\nWe are pleased to inform you that our clinical sales desk is ready to offer you special clinic pricing.\n\nBest regards,\nBuyBright Team`
    );
    window.location.href = `mailto:${item.customerEmail}?subject=${subject}&body=${body}`;
  };

  // ── Export to CSV ───────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    exportTableToCSV({
      filename: `BuyBright_Customer_Wishlist_Logs_${new Date().toISOString().split('T')[0]}`,
      headers: ['SR.NO', 'WISHLIST ID', 'DOCTOR NAME', 'CLINIC', 'EMAIL', 'PHONE', 'PRODUCT NAME', 'SKU', 'PRICE (INR)', 'STOCK LEVEL', 'DATE ADDED'],
      rows: filteredCustomerLogs.map((item, idx) => [
        idx + 1,
        item.id,
        item.customerName,
        item.clinicName || '—',
        item.customerEmail,
        item.customerPhone,
        item.productName,
        item.productSku,
        item.productPrice,
        item.stockStatus,
        item.dateAdded,
      ]),
    });
    showToast('Wishlist data exported to CSV successfully.', 'success');
  };

  // ── Export to PDF ───────────────────────────────────────────────────────────
  const handleExportPDF = () => {
    exportTableToPDF({
      title: 'BuyBright - Customer Wishlist Activity Logs',
      subtitle: `Generated on ${new Date().toLocaleDateString('en-GB')} • Total Records: ${filteredCustomerLogs.length} • Total Demand Value: ₹${stats.totalValue.toLocaleString()}`,
      headers: ['SR.NO', 'DOCTOR / CLINIC', 'CONTACT', 'PRICE', 'STOCK LEVEL', 'PRODUCT NAME', 'DATE ADDED'],
      rows: filteredCustomerLogs.map((c, idx) => [
        `#${idx + 1}`,
        c.customerName,
        c.customerPhone,
        `₹${c.productPrice.toLocaleString()}`,
        c.stockStatus,
        c.productName,
        c.dateAdded.split(',')[0],
      ]),
    });
    showToast('Wishlist report exported to PDF.', 'success');
  };

  // Helper Stock Status Pill
  const renderStockBadge = (stockStatus: WishlistStockStatus, qty: number) => {
    switch (stockStatus) {
      case 'In Stock':
        return (
          <span className="stock-pill badge-stock-in" title={`${qty} units available`}>
            <i className="fa-solid fa-circle-check" /> In Stock ({qty})
          </span>
        );
      case 'Low Stock':
        return (
          <span className="stock-pill badge-stock-low" title={`Low stock: only ${qty} left`}>
            <i className="fa-solid fa-triangle-exclamation" /> Low ({qty})
          </span>
        );
      case 'Out of Stock':
        return (
          <span className="stock-pill badge-stock-out" title="Product currently out of stock">
            <i className="fa-solid fa-ban" /> Out of Stock
          </span>
        );
      default:
        return null;
    }
  };

  // ── Tab 1: Analytics Dashboard Table Columns (Exact 8 Columns) ──────────────
  const analyticsTableColumns: Column<UniqueProductDemandRow>[] = [
    {
      key: 'srNo',
      header: 'SR.NO',
      width: '65px',
      render: (_, idx) => {
        const actualIndex = (currentPage - 1) * pageSize + idx + 1;
        return <span className="sr-num-badge">#{actualIndex}</span>;
      },
    },
    {
      key: 'product',
      header: 'PRODUCT INFO',
      minWidth: '240px',
      render: (row) => (
        <div
          className="table-product-cell clickable-product-cell"
          onClick={() => setProductViewItem(row.sampleItem)}
          title="Click to view product specifications"
        >
          <img
            src={row.productImage || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=100&auto=format&fit=crop&q=60'}
            alt={row.productName}
            className="product-col-thumb"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="product-col-info">
            <strong className="product-col-name" title={row.productName}>
              {row.productName}
            </strong>
            <div className="product-col-meta">
              <span className="sku-badge">{row.productSku}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'CATEGORY',
      width: '130px',
      render: (row) => (
        <span className="category-pill-badge">{row.productCategory}</span>
      ),
    },
    {
      key: 'price',
      header: 'PRICE',
      width: '110px',
      render: (row) => (
        <div className="price-column-cell">
          <strong className="price-val-txt">₹{row.productPrice.toLocaleString()}</strong>
        </div>
      ),
    },
    {
      key: 'stockLevel',
      header: 'STOCK LEVEL',
      width: '120px',
      render: (row) => (
        <span className="stock-level-qty-pill">
          {row.stockQuantity} Units
        </span>
      ),
    },
    {
      key: 'wishlistCount',
      header: 'WISHLIST COUNT',
      width: '135px',
      render: (row) => (
        <div className="saves-count-badge">
          <i className="fa-solid fa-heart text-pink mr-1" />
          <strong>{row.totalSaves}</strong> Doctor{row.totalSaves > 1 ? 's' : ''}
        </div>
      ),
    },
    {
      key: 'potentialRevenueLoss',
      header: 'POTENTIAL REVENUE LOSS',
      width: '180px',
      render: (row) => {
        const lossAmount = row.productPrice * row.totalSaves;
        return (
          <div className="revenue-loss-cell">
            <strong className="loss-amount">₹{lossAmount.toLocaleString()}</strong>
            <span className="loss-calc">₹{row.productPrice.toLocaleString()} × {row.totalSaves} saves</span>
          </div>
        );
      },
    },
    {
      key: 'stockStatus',
      header: 'STOCK STATUS',
      width: '135px',
      render: (row) => renderStockBadge(row.stockStatus, row.stockQuantity),
    },
  ];

  // ── Tab 2: Customer Wishlist Logs Columns Definition ─────────────────────────
  const customerLogsColumns: Column<AdminWishlistItem>[] = [
    {
      key: 'srNo',
      header: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <input
            type="checkbox"
            checked={paginatedCustomerLogs.length > 0 && selectedLogIds.length === paginatedCustomerLogs.length}
            onChange={toggleSelectAll}
            title="Select all logs on this page"
            style={{ cursor: 'pointer', accentColor: '#0d9488' }}
          />
          <span>SR. NO.</span>
        </div>
      ),
      width: '75px',
      render: (row, idx) => {
        const actualIndex = (currentPage - 1) * pageSize + idx + 1;
        const isChecked = selectedLogIds.includes(row.id);
        return (
          <div className="sr-no-cell">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => toggleSelectRow(row.id)}
              className="row-select-checkbox"
            />
            <span className="sr-num-badge">#{actualIndex}</span>
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'ACTIONS',
      width: '80px',
      render: (row) => (
        <div className="table-actions-cell">
          <button
            type="button"
            className="action-btn btn-view"
            onClick={() => setProductViewItem(row)}
            title="View Product Specifications"
          >
            <i className="fa-solid fa-eye" />
          </button>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'DOCTOR / CLINIC',
      minWidth: '200px',
      render: (row) => (
        <div className="table-customer-cell">
          {row.customerAvatar ? (
            <img src={row.customerAvatar} alt={row.customerName} className="customer-avatar-img" />
          ) : (
            <div className="customer-avatar-char">{row.customerName.charAt(0)}</div>
          )}
          <div className="customer-info-col">
            <strong className="customer-name-label">{row.customerName}</strong>
            <span className="customer-email-sub">{row.customerEmail}</span>
            {row.clinicName ? (
              <span className="customer-clinic-sub" title={row.clinicName}>
                <i className="fa-solid fa-hospital mr-1" /> {row.clinicName}
              </span>
            ) : (
              <span className="customer-phone-sub">
                <i className="fa-solid fa-phone mr-1" /> {row.customerPhone}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'productName',
      header: 'PRODUCT NAME',
      minWidth: '220px',
      render: (row) => (
        <div
          className="table-product-cell clickable-product-cell"
          onClick={() => setProductViewItem(row)}
          title="Click to view product details"
        >
          <img
            src={row.productImage || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=100&auto=format&fit=crop&q=60'}
            alt={row.productName}
            className="product-col-thumb"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="product-col-info">
            <strong className="product-col-name" title={row.productName}>
              {row.productName}
            </strong>
            <div className="product-col-meta">
              <span className="sku-badge">{row.productSku}</span>
              <span className="cat-text">{row.productCategory}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      header: 'PRICE',
      width: '110px',
      render: (row) => (
        <div className="price-column-cell">
          <strong className="price-val-txt">₹{row.productPrice.toLocaleString()}</strong>
        </div>
      ),
    },
    {
      key: 'stockStatus',
      header: 'STOCK STATUS',
      width: '130px',
      render: (row) => renderStockBadge(row.stockStatus, row.stockQuantity),
    },
    {
      key: 'dateAdded',
      header: 'DATE ADDED',
      width: '130px',
      render: (row) => (
        <div className="table-date-cell">
          <span className="date-main">
            <i className="fa-regular fa-calendar-days mr-1" />
            {row.dateAdded.split(',')[0]}
          </span>
          <span className="date-time-sub">
            <i className="fa-regular fa-clock mr-1" />
            {row.dateAdded.split(',')[1] || ''}
          </span>
        </div>
      ),
    },
    {
      key: 'outreach',
      header: 'DIRECT OUTREACH',
      width: '170px',
      render: (row) => (
        <div className="outreach-actions-flex">
          {/* Direct WhatsApp to Customer */}
          <button
            type="button"
            className="btn-outreach-icon btn-wa-icon"
            onClick={() => handleQuickWhatsApp(row)}
            title={`Send WhatsApp message directly to ${row.customerName} (${row.customerPhone})`}
          >
            <i className="fa-brands fa-whatsapp" />
          </button>

          {/* Direct Email */}
          <button
            type="button"
            className="btn-outreach-icon btn-em-icon"
            onClick={() => handleQuickEmail(row)}
            title={`Email ${row.customerEmail}`}
          >
            <i className="fa-regular fa-envelope" />
          </button>

          {/* Compose WhatsApp Message Modal */}
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
      title="Customer Wishlists & Saved Products Management"
      subtitle="Analyze product demand trends, track doctor wishlist logs, and dispatch targeted WhatsApp & Email promotional outreach."
    >
      <div className="admin-page-container wishlist-management-page">
        {/* ── Main Module Tabs Navigation ── */}
        <div className="wishlist-main-tabs-bar">
          <button
            type="button"
            className={`tab-switch-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('analytics');
              setCurrentPage(1);
            }}
          >
            <i className="fa-solid fa-chart-pie" />
            <span>Analytics Dashboard</span>
            <span className="tab-badge">{uniqueProductsDemand.length} Products</span>
          </button>

          <button
            type="button"
            className={`tab-switch-btn ${activeTab === 'customer-logs' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('customer-logs');
              setCurrentPage(1);
            }}
          >
            <i className="fa-solid fa-users" />
            <span>Customer Wishlist Logs &amp; Outreach</span>
            <span className="tab-badge">{wishlistItems.length} Logs</span>
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 1: PRODUCT DEMAND & ANALYTICS
           ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'analytics' && (
          <>
            {/* 1. Executive KPI Stats Cards Row */}
            <div className="wishlist-stats-grid">
              {/* Card 1: Total Saved Items */}
              <div className="wishlist-stat-card card-total">
                <div className="stat-card-icon">
                  <i className="fa-solid fa-heart" />
                </div>
                <div className="stat-card-info">
                  <span className="stat-label">Total Wishlist Saves</span>
                  <strong className="stat-number">{stats.totalItems}</strong>
                  <span className="stat-sub">Across verified dental practices</span>
                </div>
              </div>

              {/* Card 2: Total Pipeline Value */}
              <div className="wishlist-stat-card card-value">
                <div className="stat-card-icon">
                  <i className="fa-solid fa-indian-rupee-sign" />
                </div>
                <div className="stat-card-info">
                  <span className="stat-label">Estimated Demand Value</span>
                  <strong className="stat-number">₹{stats.totalValue.toLocaleString()}</strong>
                  <span className="stat-sub">Combined value of wishlisted items</span>
                </div>
              </div>

              {/* Card 3: In Stock Rate */}
              <div className="wishlist-stat-card card-instock">
                <div className="stat-card-icon">
                  <i className="fa-solid fa-circle-check" />
                </div>
                <div className="stat-card-info">
                  <span className="stat-label">In-Stock Availability</span>
                  <strong className="stat-number">
                    {Math.round((stats.inStockCount / (stats.totalItems || 1)) * 100)}%
                  </strong>
                  <span className="stat-sub">{stats.inStockCount} items ready in warehouse</span>
                </div>
              </div>

              {/* Card 4: Unique Doctors */}
              <div className="wishlist-stat-card card-demand">
                <div className="stat-card-icon">
                  <i className="fa-solid fa-user-doctor" />
                </div>
                <div className="stat-card-info">
                  <span className="stat-label">Active Doctors / Clinics</span>
                  <strong className="stat-number">{stats.uniqueCustomers}</strong>
                  <span className="stat-sub">Clinics tracking dental supplies</span>
                </div>
              </div>
            </div>

            {/* 2. Visual Analytics Graph Dashboard Section */}
            <div className="wishlist-analytics-dashboard-grid">
              {/* Left Column: Category Demand Breakdown Bar Chart */}
              <div className="admin-card analytics-chart-card category-breakdown-card">
                <div className="chart-card-header">
                  <div className="chart-title-wrap">
                    <i className="fa-solid fa-chart-pie text-teal mr-2" />
                    <h4 className="chart-title">Wishlist Demand by Specialty Category</h4>
                  </div>
                  <span className="chart-badge">Live Demand</span>
                </div>

                <div className="category-demand-bars-list">
                  {categoryGraphData.map((cat) => (
                    <div key={cat.name} className="demand-bar-item">
                      <div className="demand-bar-info">
                        <div className="cat-name-icon">
                          <i className={`fa-solid ${cat.icon}`} style={{ color: cat.color }} />
                          <span>{cat.name}</span>
                        </div>
                        <div className="cat-count-pct">
                          <strong>{cat.count} saves</strong>
                          <span className="pct-txt">({cat.percentage}%)</span>
                        </div>
                      </div>
                      <div className="progress-track">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${Math.max(cat.percentage, 4)}%`,
                            backgroundColor: cat.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stock Distribution Micro-Stats Strip */}
                <div className="stock-micro-summary-row mt-3">
                  <div className="micro-stat-pill pill-instock">
                    <span className="dot dot-instock" />
                    <span>In Stock: <strong>{stats.inStockCount}</strong></span>
                  </div>
                  <div className="micro-stat-pill pill-lowstock">
                    <span className="dot dot-lowstock" />
                    <span>Low: <strong>{stats.lowStockCount}</strong></span>
                  </div>
                  <div className="micro-stat-pill pill-outstock">
                    <span className="dot dot-outstock" />
                    <span>Out: <strong>{stats.outOfStockCount}</strong></span>
                  </div>
                </div>
              </div>

              {/* Right Column: Top 10 Most Wishlisted Items Line Graph */}
              <div className="admin-card analytics-chart-card top10-graph-card">
                <div className="chart-card-header">
                  <div className="chart-title-wrap">
                    <i className="fa-solid fa-chart-line text-primary mr-2" />
                    <h4 className="chart-title">Top 10 Most Wishlisted Items</h4>
                  </div>
                  <div className="chart-header-actions">
                    <span className="chart-badge bg-primary-soft">
                      <i className="fa-solid fa-fire mr-1 text-amber" /> Demand Trend Curve
                    </span>
                  </div>
                </div>

                {/* Line Graph Summary Stats Strip */}
                <div className="top10-graph-kpi-bar">
                  <div className="kpi-mini-col">
                    <span className="kpi-mini-lbl">Top 10 Saves</span>
                    <strong className="kpi-mini-val">
                      {top10WishlistProducts.reduce((acc, p) => acc + p.totalSaves, 0)} Items
                    </strong>
                  </div>
                  <div className="kpi-mini-col">
                    <span className="kpi-mini-lbl">Top 10 Potential Revenue</span>
                    <strong className="kpi-mini-val text-teal">
                      ₹{top10WishlistProducts.reduce((acc, p) => acc + (p.productPrice * p.totalSaves), 0).toLocaleString()}
                    </strong>
                  </div>
                  <div className="kpi-mini-col">
                    <span className="kpi-mini-lbl">#1 Ranked Item</span>
                    <strong className="kpi-mini-val text-truncate-1" title={top10WishlistProducts[0]?.productName || '—'}>
                      {top10WishlistProducts[0]?.productName ? top10WishlistProducts[0].productName.slice(0, 18) + '...' : '—'}
                    </strong>
                  </div>
                </div>

                {/* Interactive SVG Line Graph Container */}
                <div className="top10-line-graph-wrapper">
                  <svg
                    viewBox={`0 0 ${top10GraphData.width} ${top10GraphData.height}`}
                    className="top10-svg-chart"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      <linearGradient id="top10LineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0d9488" />
                        <stop offset="50%" stopColor="#0284c7" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                      <linearGradient id="top10AreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#0d9488" stopOpacity="0.32" />
                        <stop offset="60%" stopColor="#0284c7" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                      </linearGradient>
                      <filter id="glowShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0d9488" floodOpacity="0.35" />
                      </filter>
                    </defs>

                    {/* Horizontal Gridlines & Y-Axis Scale */}
                    {top10GraphData.yTicks.map((val) => {
                      const yPos =
                        top10GraphData.pad.top +
                        top10GraphData.innerH -
                        (val / top10GraphData.yMax) * top10GraphData.innerH;
                      return (
                        <g key={val} className="grid-line-group">
                          <line
                            x1={top10GraphData.pad.left}
                            y1={yPos}
                            x2={top10GraphData.pad.left + top10GraphData.innerW}
                            y2={yPos}
                            stroke="#e2e8f0"
                            strokeDasharray="4,4"
                            strokeWidth="1"
                          />
                          <text
                            x={top10GraphData.pad.left - 8}
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

                    {/* Area Gradient Fill under Line */}
                    {top10GraphData.areaPath && (
                      <path
                        d={top10GraphData.areaPath}
                        fill="url(#top10AreaGradient)"
                      />
                    )}

                    {/* Smooth Curved Line Path */}
                    {top10GraphData.linePath && (
                      <path
                        d={top10GraphData.linePath}
                        fill="none"
                        stroke="url(#top10LineGradient)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#glowShadow)"
                      />
                    )}

                    {/* Interactive Data Nodes */}
                    {top10GraphData.points.map((pt, idx) => {
                      const isHovered = hoveredTop10Index === idx;
                      return (
                        <g
                          key={pt.prod.productId || idx}
                          className={`graph-node-group ${isHovered ? 'is-active' : ''}`}
                          onMouseEnter={() => setHoveredTop10Index(idx)}
                          onMouseLeave={() => setHoveredTop10Index(null)}
                          onClick={() => setProductViewItem(pt.prod.sampleItem)}
                          style={{ cursor: 'pointer' }}
                        >
                          {/* Vertical guide line on active */}
                          {isHovered && (
                            <line
                              x1={pt.x}
                              y1={top10GraphData.pad.top}
                              x2={pt.x}
                              y2={top10GraphData.pad.top + top10GraphData.innerH}
                              stroke="#0d9488"
                              strokeWidth="1.5"
                              strokeDasharray="3,3"
                              opacity="0.8"
                            />
                          )}

                          {/* Outer pulse circle on hover */}
                          {isHovered && (
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r="13"
                              fill="#0d9488"
                              fillOpacity="0.2"
                            />
                          )}

                          {/* Node Circle */}
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={isHovered ? 6.5 : 4.5}
                            fill="#ffffff"
                            stroke={isHovered ? '#0f766e' : '#0d9488'}
                            strokeWidth={isHovered ? '3' : '2.5'}
                            className="graph-node-dot"
                          />

                          {/* X-Axis Rank Label */}
                          <text
                            x={pt.x}
                            y={top10GraphData.pad.top + top10GraphData.innerH + 18}
                            fill={isHovered ? '#0d9488' : '#64748b'}
                            fontSize="11"
                            fontWeight={isHovered ? '800' : '600'}
                            textAnchor="middle"
                          >
                            #{pt.rank}
                          </text>

                          {/* Value above node for top items */}
                          <text
                            x={pt.x}
                            y={pt.y - 10}
                            fill={isHovered ? '#0f172a' : '#475569'}
                            fontSize="10"
                            fontWeight="700"
                            textAnchor="middle"
                          >
                            {pt.prod.totalSaves}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  {/* Interactive Tooltip Card on Hover */}
                  {hoveredTop10Index !== null && top10WishlistProducts[hoveredTop10Index] && (
                    <div
                      className="top10-hover-tooltip-card"
                      style={{
                        left: `${Math.min(
                          Math.max(
                            (top10GraphData.points[hoveredTop10Index]?.x / top10GraphData.width) * 100,
                            18
                          ),
                          82
                        )}%`,
                      }}
                    >
                      <div className="tooltip-header">
                        <span className="tooltip-rank">
                          #{hoveredTop10Index + 1} Most Wishlisted
                        </span>
                        <span className="tooltip-saves">
                          ❤️ {top10WishlistProducts[hoveredTop10Index].totalSaves} Saves
                        </span>
                      </div>
                      <div className="tooltip-body">
                        <strong className="tooltip-product-title">
                          {top10WishlistProducts[hoveredTop10Index].productName}
                        </strong>
                        <div className="tooltip-details-grid">
                          <span className="tooltip-detail-item">
                            Category: <strong>{top10WishlistProducts[hoveredTop10Index].productCategory}</strong>
                          </span>
                          <span className="tooltip-detail-item">
                            Unit Price: <strong>₹{top10WishlistProducts[hoveredTop10Index].productPrice.toLocaleString()}</strong>
                          </span>
                          <span className="tooltip-detail-item">
                            Stock: <strong>{top10WishlistProducts[hoveredTop10Index].stockStatus} ({top10WishlistProducts[hoveredTop10Index].stockQuantity})</strong>
                          </span>
                          <span className="tooltip-detail-item text-teal">
                            Demand Value: <strong>₹{(top10WishlistProducts[hoveredTop10Index].productPrice * top10WishlistProducts[hoveredTop10Index].totalSaves).toLocaleString()}</strong>
                          </span>
                        </div>
                      </div>
                      <div className="tooltip-footer">
                        <span className="tooltip-click-hint">
                          <i className="fa-solid fa-arrow-pointer mr-1" /> Click node to view specifications
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Analytics Dashboard Products Table (Exact 8 Columns) */}
            <div className="admin-card table-wrapper-card mt-3">
              <DataTable
                columns={analyticsTableColumns}
                data={paginatedAnalyticsDemand}
                keyExtractor={(row) => row.productId}
                emptyMessage="No wishlisted products found in analytics database."
              />

              {uniqueProductsDemand.length > pageSize && (
                <div className="table-pagination-footer">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalItems={uniqueProductsDemand.length}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              )}
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 2: CUSTOMER WISHLIST LOGS & DIRECT OUTREACH
           ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'customer-logs' && (
          <>
            {/* Customer Logs Controls Card */}
            <div className="admin-card table-controls-card">
              <div className="table-controls-top-row">
                <div className="table-title-banner">
                  <i className="fa-solid fa-users mr-2" />
                  <strong>Customer Wishlist Logs &amp; Communication Dispatch</strong>
                  <span className="count-pill">({filteredCustomerLogs.length} activity records)</span>
                </div>

                <div className="export-buttons-group">
                  <button
                    type="button"
                    className="btn-admin-primary btn-send-bulk-msg"
                    onClick={handleOpenBulkMessage}
                    disabled={selectedLogIds.length === 0}
                  >
                    <i className="fa-solid fa-paper-plane" />
                    {selectedLogIds.length > 0
                      ? `Message (${selectedLogIds.length}) Selected Doctors`
                      : 'Send Bulk Message'}
                  </button>
                  <button type="button" className="btn-admin-outline" onClick={handleExportCSV}>
                    <i className="fa-solid fa-file-csv" /> Export CSV
                  </button>
                  <button type="button" className="btn-admin-outline" onClick={handleExportPDF}>
                    <i className="fa-solid fa-file-pdf" /> Export PDF
                  </button>
                </div>
              </div>

              {/* Search Bar & Dropdown Filters Row */}
              <div className="search-and-filter-row mt-3">
                <div className="search-bar-wrap">
                  <SearchBar
                    value={searchQuery}
                    onChange={(val) => {
                      setSearchQuery(val);
                      setCurrentPage(1);
                    }}
                    placeholder="Search logs by Doctor Name, Clinic, Email, Phone, Product, or SKU..."
                  />
                </div>

                <div className="filter-dropdown-wrap">
                  <label>Stock Status:</label>
                  <select
                    value={stockFilter}
                    onChange={(e) => {
                      setStockFilter(e.target.value as 'All' | WishlistStockStatus);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="All">📦 All Stock Statuses</option>
                    <option value="In Stock">✅ In Stock</option>
                    <option value="Low Stock">⚠️ Low Stock</option>
                    <option value="Out of Stock">🚫 Out of Stock</option>
                  </select>
                </div>

                <div className="filter-dropdown-wrap">
                  <label>Category:</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => {
                      setCategoryFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    {DENTAL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === 'All' ? '🦷 All Dental Categories' : cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Bulk Selection Floating Action Bar */}
              {selectedLogIds.length > 0 && (
                <div className="bulk-actions-banner mt-3">
                  <div className="bulk-selection-count">
                    <i className="fa-solid fa-check-double" />
                    <strong>{selectedLogIds.length}</strong> doctor records selected for outreach
                  </div>
                  <div className="bulk-btns-flex">
                    <button
                      type="button"
                      className="btn-bulk-cart"
                      onClick={handleOpenBulkMessage}
                    >
                      <i className="fa-solid fa-paper-plane" /> Compose Bulk Message
                    </button>
                    <button
                      type="button"
                      className="btn-bulk-clear"
                      onClick={() => setSelectedLogIds([])}
                    >
                      Deselect All
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Customer Logs DataTable */}
            <div className="admin-card table-wrapper-card">
              <DataTable
                columns={customerLogsColumns}
                data={paginatedCustomerLogs}
                keyExtractor={(row) => row.id}
                emptyMessage="No customer wishlist activity logs match your filter criteria."
              />

              {filteredCustomerLogs.length > pageSize && (
                <div className="table-pagination-footer">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalItems={filteredCustomerLogs.length}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              )}
            </div>
          </>
        )}

        {/* ── Product Quick View Modal (Only Product Specs) ── */}
        <ProductViewModal
          isOpen={Boolean(productViewItem)}
          onClose={() => setProductViewItem(null)}
          item={productViewItem}
        />

        {/* ── Single / Bulk Messaging Outreach Modal ── */}
        <WishlistMessageModal
          isOpen={isMessageModalOpen}
          onClose={() => {
            setIsMessageModalOpen(false);
            setMessagingTargets([]);
          }}
          targetItems={messagingTargets}
          onSendMessage={handleSendMessageSuccess}
        />
      </div>
    </AdminLayout>
  );
};

export default WishlistList;
