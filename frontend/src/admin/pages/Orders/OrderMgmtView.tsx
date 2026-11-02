/**
 * BuyBright Admin — Reusable Master Order Management View.
 * Clean, focused order table view for order pipeline stages.
 * Columns: Sr.No. | Action (Eye Icon Only) | Order ID | Order Number | Customer | Total Amount | Discount Amount | Cashback Bright Points | Order Pay Amount | Payment Method | Wallet Amount | Online Amount | COD Amount | Delivery Address | Order Date Time | Expected Date
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { DataTable, type Column } from '../../components/DataTable';
import { SearchBar } from '../../components/SearchBar';
import { getOrders, updateOrderStatus } from '../../data/ordersData';
import type { AdminOrder, OrderStatusType } from '../../types/order';
import { OrderDetails } from './OrderDetails';
import { Pagination } from '../../components/Pagination';
import { useToast } from '../../../context/ToastContext';
import { exportTableToPDF } from '../../utils/exportPdf';
import { exportTableToCSV } from '../../utils/exportCsv';

export interface OrderMgmtViewProps {
  stageTitle: string;
  stageSubtitle: string;
  filterStatus: OrderStatusType;
  activeNavTab?: 'placed' | 'in-process' | 'ready-to-pick' | 'out-for-delivery' | 'delivered' | 'cancelled' | 'returned';
}

export const OrderMgmtView: React.FC<OrderMgmtViewProps> = ({
  stageTitle,
  stageSubtitle,
  filterStatus,
}) => {
  const { showToast } = useToast();

  const [orders, setOrders] = useState<AdminOrder[]>(() => getOrders());
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 8;

  // Selected Order for Modal
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filtered orders strictly matching current stage status
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Must match active page stage status
      if (o.orderStatus !== filterStatus) {
        return false;
      }

      // Search query filtering
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q) ||
        o.deliveryAddress.toLowerCase().includes(q) ||
        (o.awbNumber && o.awbNumber.toLowerCase().includes(q));

      // Payment method filtering
      const matchPayment =
        paymentMethodFilter === 'All' ||
        o.paymentMethod.toLowerCase().includes(paymentMethodFilter.toLowerCase());

      return matchSearch && matchPayment;
    });
  }, [orders, searchQuery, filterStatus, paymentMethodFilter]);

  // Reset pagination to page 1 whenever filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, paymentMethodFilter]);

  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredOrders.slice(start, start + PAGE_SIZE);
  }, [filteredOrders, currentPage]);

  // Status transition handler inside details modal
  const handleStatusChange = (orderId: string, newStatus: OrderStatusType) => {
    const updated = updateOrderStatus(orderId, newStatus);
    setOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev: AdminOrder | null) => (prev ? { ...prev, orderStatus: newStatus } : null));
    }
    showToast(`Order #${orderId} moved to "${newStatus}".`, 'success');
  };

  const handleOpenDetails = (order: AdminOrder) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  // ── Export to CSV (Spreadsheet) ───────────────────────────────────────────
  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      showToast('No records available to export.', 'warning');
      return;
    }

    exportTableToCSV({
      filename: `BuyBright_${stageTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`,
      headers: [
        'Sr.No.',
        'Order ID',
        'Order Number',
        'Customer Name',
        'Phone',
        'Total Amount (INR)',
        'Discount Amount (INR)',
        'Cashback Bright Points',
        'Order Pay Amount (INR)',
        'Payment Method',
        'Wallet Amount (INR)',
        'Online Amount (INR)',
        'COD Amount (INR)',
        'Delivery Address',
        'City',
        'State',
        'Pincode',
        'Order Date Time',
        'Expected Date',
        'Status',
      ],
      rows: filteredOrders.map((o, idx) => [
        idx + 1,
        `#${o.id}`,
        o.orderNumber,
        o.customerName || '',
        o.phone || '',
        o.totalAmount,
        o.discountAmount,
        o.cashbackPoints,
        o.orderPayAmount,
        o.paymentMethod,
        o.walletAmount,
        o.onlineAmount,
        o.codAmount,
        o.deliveryAddress,
        o.city || '',
        o.state || '',
        o.pincode || '',
        o.orderDateTime || o.date || '',
        o.expectedDate || '',
        o.orderStatus,
      ]),
    });
    showToast('Orders spreadsheet (.CSV) exported successfully.', 'success');
  };

  // ── Export to PDF ─────────────────────────────────────────────────────────
  const handleExportPDF = () => {
    if (filteredOrders.length === 0) {
      showToast('No records available to export.', 'warning');
      return;
    }

    exportTableToPDF({
      title: `BuyBright Order Management — ${stageTitle}`,
      subtitle: `Orders Report (${filteredOrders.length} records)`,
      headers: [
        'Sr.',
        'Order ID',
        'Order Number',
        'Customer Name',
        'Total (₹)',
        'Discount (₹)',
        'Pay Amount (₹)',
        'Payment Method',
        'Delivery Address',
        'Expected Date',
      ],
      rows: filteredOrders.map((o, idx) => [
        idx + 1,
        `#${o.id}`,
        o.orderNumber,
        o.customerName,
        `₹${o.totalAmount.toLocaleString('en-IN')}`,
        `₹${o.discountAmount.toLocaleString('en-IN')}`,
        `₹${o.orderPayAmount.toLocaleString('en-IN')}`,
        o.paymentMethod,
        o.deliveryAddress,
        o.expectedDate,
      ]),
    });
    showToast('Orders export PDF generated successfully.', 'success');
  };

  // ── 16 Table Columns Matching User Request ────────────────────────────────
  const columns: Column<AdminOrder>[] = [
    // 1. Sr.No.
    {
      key: 'srNo',
      header: 'Sr.No.',
      width: '64px',
      render: (_, index) => (
        <div style={{ textAlign: 'center' }}>
          <span
            style={{
              display: 'inline-block',
              fontWeight: 700,
              color: '#475569',
              fontSize: '0.8rem',
              background: '#f1f5f9',
              padding: '2px 8px',
              borderRadius: '6px',
            }}
          >
            {(index ?? 0) + 1}
          </span>
        </div>
      ),
    },

    // 2. Action Column with stage-specific quick workflow buttons
    {
      key: 'action',
      header: 'Action',
      minWidth: '190px',
      render: (order) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {/* View Details Eye Icon Button */}
          <button
            type="button"
            title="View Full Order Details & Invoice"
            onClick={() => handleOpenDetails(order)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '7px',
              border: '1px solid #0d9488',
              background: '#f0fdfa',
              color: '#0d9488',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#0d9488';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f0fdfa';
              e.currentTarget.style.color = '#0d9488';
            }}
          >
            <i className="fa-solid fa-eye" />
          </button>

          {/* 1. In Process -> Ready to Pick + Cancel */}
          {order.orderStatus === 'In Process' && (
            <>
              <button
                type="button"
                title="Mark Order as Ready to Pick"
                onClick={() => handleStatusChange(order.id, 'Ready to Pick')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: '1px solid #c4b5fd',
                  background: '#f5f3ff',
                  color: '#7c3aed',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#7c3aed';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f5f3ff';
                  e.currentTarget.style.color = '#7c3aed';
                }}
              >
                <i className="fa-solid fa-box-open" style={{ fontSize: '0.7rem' }} /> Ready to Pick
              </button>
              <button
                type="button"
                title="Cancel Order"
                onClick={() => handleStatusChange(order.id, 'Cancelled')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 9px',
                  borderRadius: '6px',
                  border: '1px solid #fecaca',
                  background: '#fef2f2',
                  color: '#dc2626',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#dc2626';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fef2f2';
                  e.currentTarget.style.color = '#dc2626';
                }}
              >
                <i className="fa-solid fa-ban" style={{ fontSize: '0.7rem' }} /> Cancel
              </button>
            </>
          )}

          {/* 2. Ready to Pick -> Out for Delivery + Cancel */}
          {order.orderStatus === 'Ready to Pick' && (
            <>
              <button
                type="button"
                title="Dispatch: Mark Out for Delivery"
                onClick={() => handleStatusChange(order.id, 'Out for Delivery')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: '1px solid #99f6e4',
                  background: '#f0fdfa',
                  color: '#0d9488',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#0d9488';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f0fdfa';
                  e.currentTarget.style.color = '#0d9488';
                }}
              >
                <i className="fa-solid fa-truck-fast" style={{ fontSize: '0.7rem' }} /> Out for Delivery
              </button>
              <button
                type="button"
                title="Cancel Order"
                onClick={() => handleStatusChange(order.id, 'Cancelled')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 9px',
                  borderRadius: '6px',
                  border: '1px solid #fecaca',
                  background: '#fef2f2',
                  color: '#dc2626',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#dc2626';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fef2f2';
                  e.currentTarget.style.color = '#dc2626';
                }}
              >
                <i className="fa-solid fa-ban" style={{ fontSize: '0.7rem' }} /> Cancel
              </button>
            </>
          )}

          {/* 3. Out for Delivery -> Delivered */}
          {order.orderStatus === 'Out for Delivery' && (
            <button
              type="button"
              title="Confirm Delivery Completion"
              onClick={() => handleStatusChange(order.id, 'Delivered')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 11px',
                borderRadius: '6px',
                border: '1px solid #86efac',
                background: '#f0fdf4',
                color: '#16a34a',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#16a34a';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f0fdf4';
                e.currentTarget.style.color = '#16a34a';
              }}
            >
              <i className="fa-solid fa-circle-check" style={{ fontSize: '0.7rem' }} /> Delivered
            </button>
          )}

          {/* 4. Returned -> Approve / Reject */}
          {order.orderStatus === 'Returned' && (
            <>
              <button
                type="button"
                title="Approve Return & Initiate Refund"
                onClick={() => {
                  showToast(`Return request approved for Order #${order.id}. Refund processed.`, 'success');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: '1px solid #86efac',
                  background: '#f0fdf4',
                  color: '#16a34a',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#16a34a';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f0fdf4';
                  e.currentTarget.style.color = '#16a34a';
                }}
              >
                <i className="fa-solid fa-check" style={{ fontSize: '0.7rem' }} /> Approve
              </button>
              <button
                type="button"
                title="Reject Return Request"
                onClick={() => {
                  const updated = updateOrderStatus(order.id, 'Delivered');
                  setOrders(updated);
                  showToast(`Return request rejected for Order #${order.id}.`, 'info');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 9px',
                  borderRadius: '6px',
                  border: '1px solid #fecaca',
                  background: '#fef2f2',
                  color: '#dc2626',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#dc2626';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fef2f2';
                  e.currentTarget.style.color = '#dc2626';
                }}
              >
                <i className="fa-solid fa-xmark" style={{ fontSize: '0.7rem' }} /> Reject
              </button>
            </>
          )}

          {/* 5. Placed -> In Process + Cancel */}
          {order.orderStatus === 'Placed' && (
            <>
              <button
                type="button"
                title="Accept & Move to In Process"
                onClick={() => handleStatusChange(order.id, 'In Process')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: '1px solid #fde68a',
                  background: '#fffbeb',
                  color: '#d97706',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#d97706';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fffbeb';
                  e.currentTarget.style.color = '#d97706';
                }}
              >
                <i className="fa-solid fa-arrows-rotate" style={{ fontSize: '0.7rem' }} /> In Process
              </button>
              <button
                type="button"
                title="Cancel Order"
                onClick={() => handleStatusChange(order.id, 'Cancelled')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 9px',
                  borderRadius: '6px',
                  border: '1px solid #fecaca',
                  background: '#fef2f2',
                  color: '#dc2626',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#dc2626';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fef2f2';
                  e.currentTarget.style.color = '#dc2626';
                }}
              >
                <i className="fa-solid fa-ban" style={{ fontSize: '0.7rem' }} /> Cancel
              </button>
            </>
          )}
        </div>
      ),
    },

    // 3. Order ID
    {
      key: 'id',
      header: 'Order ID',
      minWidth: '105px',
      render: (order) => (
        <button
          type="button"
          onClick={() => handleOpenDetails(order)}
          title={`View Details for Order #${order.id}`}
          style={{
            fontFamily: 'Consolas, monospace',
            fontSize: '0.8rem',
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            padding: '3px 8px',
            borderRadius: '5px',
            color: '#0d9488',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#0d9488';
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.borderColor = '#0d9488';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#f8fafc';
            e.currentTarget.style.color = '#0d9488';
            e.currentTarget.style.borderColor = '#cbd5e1';
          }}
        >
          #{order.id}
        </button>
      ),
    },

    // 4. Order Number
    {
      key: 'orderNumber',
      header: 'Order Number',
      minWidth: '180px',
      render: (order) => (
        <div>
          <button
            type="button"
            onClick={() => handleOpenDetails(order)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              color: '#0d9488',
              fontWeight: 800,
              fontSize: '0.86rem',
              cursor: 'pointer',
              textDecoration: 'underline',
              textAlign: 'left',
              display: 'inline-block',
            }}
          >
            {order.orderNumber}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
            <span
              style={{
                fontSize: '0.7rem',
                backgroundColor: '#f1f5f9',
                color: '#475569',
                padding: '1px 6px',
                borderRadius: '4px',
                fontWeight: 600,
              }}
            >
              {order.itemsCount} SKUs
            </span>
            {order.awbNumber && order.awbNumber !== 'CANCELLED-NA' && (
              <span
                style={{
                  fontSize: '0.68rem',
                  backgroundColor: '#f0fdf4',
                  color: '#16a34a',
                  border: '1px solid #bbf7d0',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  fontWeight: 600,
                }}
              >
                <i className="fa-solid fa-truck" style={{ marginRight: '3px' }} />
                AWB Assigned
              </span>
            )}
          </div>
        </div>
      ),
    },

    // 5. Customer (Clickable link to full Customer Profile & Analytics)
    {
      key: 'customer',
      header: 'Customer',
      minWidth: '200px',
      render: (order) => (
        <div style={{ minWidth: '180px' }}>
          <Link
            to={`/admin/customers/${encodeURIComponent(order.customerName)}`}
            title={`Open 360 Profile & Analytics for ${order.customerName}`}
            style={{
              fontWeight: 800,
              color: '#0d9488',
              fontSize: '0.86rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#0f766e';
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#0d9488';
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            <i className="fa-solid fa-user-doctor" style={{ fontSize: '0.82rem' }} />
            {order.customerName}
          </Link>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <i className="fa-solid fa-phone" style={{ color: '#94a3b8', fontSize: '0.68rem' }} />
            <a href={`tel:${order.phone}`} style={{ color: '#64748b', textDecoration: 'none' }}>
              {order.phone}
            </a>
          </div>
        </div>
      ),
    },

    // 6. Total Amount (Gross)
    {
      key: 'totalAmount',
      header: 'Total Amount',
      minWidth: '120px',
      render: (order) => (
        <span style={{ fontWeight: 700, color: '#334155', fontSize: '0.86rem', whiteSpace: 'nowrap' }}>
          ₹{order.totalAmount.toLocaleString('en-IN')}
        </span>
      ),
    },

    // 7. Discount Amount
    {
      key: 'discountAmount',
      header: 'Discount Amount',
      minWidth: '125px',
      render: (order) => (
        <span
          style={{
            fontWeight: 700,
            fontSize: '0.82rem',
            color: order.discountAmount > 0 ? '#16a34a' : '#94a3b8',
            whiteSpace: 'nowrap',
          }}
        >
          {order.discountAmount > 0 ? `-₹${order.discountAmount.toLocaleString('en-IN')}` : '₹0'}
        </span>
      ),
    },

    // 8. Cashback Bright Points
    {
      key: 'cashbackPoints',
      header: 'Cashback Bright Points',
      minWidth: '160px',
      render: (order) => (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            background: '#fffbeb',
            color: '#b45309',
            border: '1px solid #fde68a',
            padding: '3px 9px',
            borderRadius: '12px',
            fontSize: '0.76rem',
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          <i className="fa-solid fa-gem" style={{ fontSize: '0.72rem', color: '#d97706' }} />
          +{order.cashbackPoints} Pts
        </span>
      ),
    },

    // 9. Order Pay Amount
    {
      key: 'orderPayAmount',
      header: 'Order Pay Amount',
      minWidth: '135px',
      render: (order) => (
        <span
          style={{
            display: 'inline-block',
            fontWeight: 800,
            color: '#0f766e',
            background: '#f0fdfa',
            border: '1px solid #ccfbf1',
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '0.88rem',
            whiteSpace: 'nowrap',
          }}
        >
          ₹{order.orderPayAmount.toLocaleString('en-IN')}
        </span>
      ),
    },

    // 10. Payment Method
    {
      key: 'paymentMethod',
      header: 'Payment Method',
      minWidth: '160px',
      render: (order) => {
        const isCOD = order.paymentMethod.toLowerCase().includes('cod') || order.paymentMethod.toLowerCase().includes('cash');
        const isWallet = order.paymentMethod.toLowerCase().includes('wallet');
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '0.74rem',
              color: '#334155',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            <i
              className={`fa-solid ${
                isWallet ? 'fa-wallet' : isCOD ? 'fa-hand-holding-dollar' : 'fa-credit-card'
              }`}
              style={{ color: '#0d9488' }}
            />
            {order.paymentMethod}
          </span>
        );
      },
    },

    // 11. Wallet Amount
    {
      key: 'walletAmount',
      header: 'Wallet Amount',
      minWidth: '115px',
      render: (order) => (
        <span
          style={{
            fontSize: '0.82rem',
            color: order.walletAmount > 0 ? '#7c3aed' : '#94a3b8',
            fontWeight: order.walletAmount > 0 ? 700 : 500,
            whiteSpace: 'nowrap',
          }}
        >
          {order.walletAmount > 0 ? `₹${order.walletAmount.toLocaleString('en-IN')}` : '₹0'}
        </span>
      ),
    },

    // 12. Online Amount
    {
      key: 'onlineAmount',
      header: 'Online Amount',
      minWidth: '120px',
      render: (order) => (
        <span
          style={{
            fontSize: '0.82rem',
            color: order.onlineAmount > 0 ? '#0284c7' : '#94a3b8',
            fontWeight: order.onlineAmount > 0 ? 700 : 500,
            whiteSpace: 'nowrap',
          }}
        >
          {order.onlineAmount > 0 ? `₹${order.onlineAmount.toLocaleString('en-IN')}` : '₹0'}
        </span>
      ),
    },

    // 13. COD Amount
    {
      key: 'codAmount',
      header: 'COD Amount',
      minWidth: '115px',
      render: (order) => (
        <span
          style={{
            fontSize: '0.82rem',
            color: order.codAmount > 0 ? '#d97706' : '#94a3b8',
            fontWeight: order.codAmount > 0 ? 700 : 500,
            whiteSpace: 'nowrap',
          }}
        >
          {order.codAmount > 0 ? `₹${order.codAmount.toLocaleString('en-IN')}` : '₹0'}
        </span>
      ),
    },

    // 14. Delivery Address
    {
      key: 'deliveryAddress',
      header: 'Delivery Address',
      minWidth: '280px',
      render: (order) => (
        <div style={{ minWidth: '260px', fontSize: '0.78rem', color: '#334155', lineHeight: 1.45 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
            <i className="fa-solid fa-location-dot" style={{ color: '#0d9488', marginTop: '2px', flexShrink: 0, fontSize: '0.82rem' }} />
            <span style={{ fontWeight: 500, color: '#1e293b' }}>
              {order.deliveryAddress || `${order.city}, ${order.state} - ${order.pincode}`}
            </span>
          </div>
        </div>
      ),
    },

    // 15. Order Date Time
    {
      key: 'orderDateTime',
      header: 'Order Date Time',
      minWidth: '160px',
      render: (order) => (
        <div style={{ fontSize: '0.76rem', color: '#334155', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <i className="fa-solid fa-clock" style={{ color: '#0d9488' }} />
          {order.orderDateTime || order.date}
        </div>
      ),
    },

    // 16. Expected Date
    {
      key: 'expectedDate',
      header: 'Expected Date',
      minWidth: '135px',
      render: (order) => (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.76rem',
            fontWeight: 700,
            color: order.orderStatus === 'Delivered' ? '#16a34a' : '#0f172a',
            background: order.orderStatus === 'Delivered' ? '#dcfce7' : '#f1f5f9',
            padding: '3px 8px',
            borderRadius: '6px',
            whiteSpace: 'nowrap',
          }}
        >
          <i className={`fa-solid ${order.orderStatus === 'Delivered' ? 'fa-circle-check' : 'fa-calendar-day'}`} />
          {order.expectedDate}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout title="Order Management" subtitle={stageSubtitle}>
      <div className="order-management-master-page" style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '24px' }}>
        
        {/* Top Header Controls: Title & Export Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#64748b', marginBottom: '4px' }}>
              <Link to="/admin/dashboard" style={{ color: '#64748b', textDecoration: 'none' }}>Dashboard</Link>
              <span>/</span>
              <span style={{ color: '#64748b' }}>Order Fulfillment</span>
              <span>/</span>
              <span style={{ color: '#0d9488', fontWeight: 600 }}>{stageTitle}</span>
            </div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-solid fa-boxes-packing" style={{ color: '#0d9488' }} />
              {stageTitle}
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  backgroundColor: '#e0f2fe',
                  color: '#0369a1',
                  padding: '2px 9px',
                  borderRadius: '12px',
                  marginLeft: '4px',
                }}
              >
                {filteredOrders.length} Orders
              </span>
            </h1>
          </div>

          {/* Export Actions: CSV & PDF */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              type="button"
              className="btn-admin-outline"
              onClick={handleExportCSV}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#16a34a',
                borderColor: '#86efac',
                background: '#f0fdf4',
              }}
            >
              <i className="fa-solid fa-file-csv" style={{ fontSize: '0.95rem' }} /> Export CSV
            </button>

            <button
              type="button"
              className="btn-admin-outline"
              onClick={handleExportPDF}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#dc2626',
                borderColor: '#fca5a5',
                background: '#fef2f2',
              }}
            >
              <i className="fa-solid fa-file-pdf" style={{ fontSize: '0.95rem' }} /> Export PDF
            </button>
          </div>
        </div>

        {/* ── Table Card Container (Clean, Direct Table View) ── */}
        <div
          className="admin-card"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '18px 20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}
        >
          {/* Table Search & Filter Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>
                {stageTitle}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                — {filteredOrders.length} records found
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search order ID, customer, phone, AWB..."
              />
              <select
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
                className="form-control"
                style={{ width: '160px', fontSize: '0.82rem' }}
              >
                <option value="All">All Payment Methods</option>
                <option value="UPI">UPI / QR</option>
                <option value="Razorpay">Razorpay / NetBanking</option>
                <option value="Wallet">Presto Wallet</option>
                <option value="COD">Cash on Delivery</option>
              </select>
            </div>
          </div>

          {/* Master Responsive DataTable with Horizontal Scroll & Pagination */}
          <div
            style={{
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              overflow: 'hidden',
            }}
          >
            <DataTable
              data={paginatedOrders}
              columns={columns}
              keyExtractor={(item) => item.id}
              emptyMessage={`No orders currently found in "${stageTitle}".`}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={PAGE_SIZE}
              totalItems={filteredOrders.length}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>

        {/* Modal: Itemized Order Details & Invoice */}
        <OrderDetails
          order={selectedOrder}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          onStatusChange={handleStatusChange}
        />

      </div>
    </AdminLayout>
  );
};
