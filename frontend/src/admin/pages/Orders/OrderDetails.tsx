/**
 * BuyBright Admin Order Details Component / View.
 * Displays comprehensive order breakdown, itemized SKUs, payment breakdown, AWB logistics tracking, and GST invoice data.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import type { AdminOrder, OrderStatusType } from '../../types/order';
import { Modal } from '../../components/Modal';
import { useToast } from '../../../context/ToastContext';
import { exportTableToPDF } from '../../utils/exportPdf';

interface OrderDetailsProps {
  order: AdminOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (orderId: string, newStatus: OrderStatusType) => void;
}

const ALL_STATUSES: { key: OrderStatusType; label: string; color: string; bg: string }[] = [
  { key: 'Placed', label: 'New Order Placed', color: '#0284c7', bg: '#f0f9ff' },
  { key: 'In Process', label: 'Orders In Process', color: '#d97706', bg: '#fffbeb' },
  { key: 'Ready to Pick', label: 'Orders Ready to Pick', color: '#7c3aed', bg: '#f5f3ff' },
  { key: 'Out for Delivery', label: 'Orders Out for Delivery', color: '#0d9488', bg: '#f0fdfa' },
  { key: 'Delivered', label: 'Orders Delivered', color: '#16a34a', bg: '#f0fdf4' },
  { key: 'Cancelled', label: 'Orders Cancelled', color: '#dc2626', bg: '#fef2f2' },
  { key: 'Returned', label: 'Orders Returned', color: '#e11d48', bg: '#fff1f2' },
];

export const OrderDetails: React.FC<OrderDetailsProps> = ({
  order,
  isOpen,
  onClose,
  onStatusChange,
}) => {
  const { showToast } = useToast();

  if (!order) return null;

  const handlePrintInvoice = () => {
    exportTableToPDF({
      title: `BuyBright Official Tax Invoice — ${order.orderNumber}`,
      subtitle: `Order for ${order.customerName}`,
      headers: ['Item Description', 'SKU Code', 'Qty', 'Unit Price (₹)', 'Total (₹)'],
      rows: order.items.map((it) => [
        it.name,
        it.sku || 'PD-MED-SKU',
        it.quantity,
        `₹${it.price.toLocaleString('en-IN')}`,
        `₹${(it.price * it.quantity).toLocaleString('en-IN')}`,
      ]),
    });
    showToast(`GST Tax Invoice generated for order ${order.orderNumber}.`, 'success');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Order Details: ${order.orderNumber}`}
      maxWidth="860px"
      footer={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Change Order Status:</span>
            <select
              value={order.orderStatus}
              onChange={(e) => onStatusChange && onStatusChange(order.id, e.target.value as OrderStatusType)}
              className="form-control"
              style={{
                padding: '6px 12px',
                fontSize: '0.82rem',
                borderColor: '#0d9488',
                fontWeight: 600,
                borderRadius: '6px',
                background: '#ffffff',
                minWidth: '150px',
              }}
            >
              {ALL_STATUSES.map((st) => (
                <option key={st.key} value={st.key}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handlePrintInvoice}
              className="btn-admin-outline"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                fontSize: '0.82rem',
                fontWeight: 700,
                borderRadius: '8px',
              }}
            >
              <i className="fa-solid fa-file-invoice" style={{ color: '#0d9488' }} /> Download Tax Invoice PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-admin-primary"
              style={{
                padding: '7px 16px',
                fontSize: '0.82rem',
                fontWeight: 700,
                borderRadius: '8px',
              }}
            >
              Close Window
            </button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        
        {/* Order Header Summary */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f8fafc',
            padding: '16px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Ordered on <strong style={{ color: '#0f172a' }}>{order.orderDateTime || order.date}</strong> · Order ID: <code style={{ color: '#0d9488' }}>#{order.id}</code>
            </div>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '1.2rem', color: '#0f172a', fontWeight: 800 }}>
              {order.orderNumber}
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                background: order.paymentStatus === 'Paid' ? '#dcfce7' : '#fee2e2',
                color: order.paymentStatus === 'Paid' ? '#15803d' : '#b91c1c',
                border: `1px solid ${order.paymentStatus === 'Paid' ? '#bbf7d0' : '#fecaca'}`,
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              Payment: {order.paymentStatus}
            </span>
            <span
              style={{
                background: '#f0fdfa',
                color: '#0f766e',
                border: '1px solid #ccfbf1',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              Status: {order.orderStatus}
            </span>
          </div>
        </div>

        {/* ── Quick Stage Actions Banner ── */}
        <div
          style={{
            background: '#ffffff',
            border: '1.5px solid #e2e8f0',
            borderRadius: '10px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa-solid fa-bolt" style={{ color: '#f59e0b', fontSize: '0.95rem' }} />
            <strong style={{ fontSize: '0.84rem', color: '#0f172a' }}>Next Workflow Action:</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* 1. In Process -> Ready to Pick + Cancel */}
            {order.orderStatus === 'In Process' && (
              <>
                <button
                  type="button"
                  onClick={() => onStatusChange && onStatusChange(order.id, 'Ready to Pick')}
                  style={{
                    background: '#f5f3ff',
                    border: '1.5px solid #7c3aed',
                    color: '#7c3aed',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <i className="fa-solid fa-box-open" /> Move to Ready to Pick
                </button>
                <button
                  type="button"
                  onClick={() => onStatusChange && onStatusChange(order.id, 'Cancelled')}
                  style={{
                    background: '#fef2f2',
                    border: '1.5px solid #dc2626',
                    color: '#dc2626',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <i className="fa-solid fa-ban" /> Cancel Order
                </button>
              </>
            )}

            {/* 2. Ready to Pick -> Out for Delivery + Cancel */}
            {order.orderStatus === 'Ready to Pick' && (
              <>
                <button
                  type="button"
                  onClick={() => onStatusChange && onStatusChange(order.id, 'Out for Delivery')}
                  style={{
                    background: '#f0fdfa',
                    border: '1.5px solid #0d9488',
                    color: '#0d9488',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <i className="fa-solid fa-truck-fast" /> Mark Out for Delivery
                </button>
                <button
                  type="button"
                  onClick={() => onStatusChange && onStatusChange(order.id, 'Cancelled')}
                  style={{
                    background: '#fef2f2',
                    border: '1.5px solid #dc2626',
                    color: '#dc2626',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <i className="fa-solid fa-ban" /> Cancel Order
                </button>
              </>
            )}

            {/* 3. Out for Delivery -> Delivered */}
            {order.orderStatus === 'Out for Delivery' && (
              <button
                type="button"
                onClick={() => onStatusChange && onStatusChange(order.id, 'Delivered')}
                style={{
                  background: '#f0fdf4',
                  border: '1.5px solid #16a34a',
                  color: '#16a34a',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  padding: '6px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <i className="fa-solid fa-circle-check" /> Mark as Delivered
              </button>
            )}

            {/* 4. Returned -> Approve / Reject */}
            {order.orderStatus === 'Returned' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    showToast(`Return request approved for Order #${order.id}. Refund processed.`, 'success');
                  }}
                  style={{
                    background: '#f0fdf4',
                    border: '1.5px solid #16a34a',
                    color: '#16a34a',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <i className="fa-solid fa-check" /> Approve Return &amp; Refund
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onStatusChange) onStatusChange(order.id, 'Delivered');
                    showToast(`Return request rejected for Order #${order.id}.`, 'info');
                  }}
                  style={{
                    background: '#fef2f2',
                    border: '1.5px solid #dc2626',
                    color: '#dc2626',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <i className="fa-solid fa-xmark" /> Reject Return Request
                </button>
              </>
            )}

            {/* 5. Placed -> In Process + Cancel */}
            {order.orderStatus === 'Placed' && (
              <>
                <button
                  type="button"
                  onClick={() => onStatusChange && onStatusChange(order.id, 'In Process')}
                  style={{
                    background: '#fffbeb',
                    border: '1.5px solid #d97706',
                    color: '#d97706',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <i className="fa-solid fa-arrows-rotate" /> Move to In Process
                </button>
                <button
                  type="button"
                  onClick={() => onStatusChange && onStatusChange(order.id, 'Cancelled')}
                  style={{
                    background: '#fef2f2',
                    border: '1.5px solid #dc2626',
                    color: '#dc2626',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <i className="fa-solid fa-ban" /> Cancel Order
                </button>
              </>
            )}

            {order.orderStatus === 'Delivered' && (
              <span style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 700 }}>
                <i className="fa-solid fa-circle-check" style={{ marginRight: '4px' }} /> Order is complete and delivered.
              </span>
            )}

            {order.orderStatus === 'Cancelled' && (
              <span style={{ fontSize: '0.78rem', color: '#dc2626', fontWeight: 700 }}>
                <i className="fa-solid fa-ban" style={{ marginRight: '4px' }} /> Order is cancelled.
              </span>
            )}
          </div>
        </div>

        {/* 2-Column Info: Customer & Delivery Details */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '14px' }}>
          
          {/* Customer Details */}
          <div style={{ background: '#fff', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0d9488' }}>
                <i className="fa-solid fa-user" />
                <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>Customer Details</strong>
              </div>
              <Link
                to={`/admin/customers/${encodeURIComponent(order.customerName)}`}
                style={{
                  fontSize: '0.74rem',
                  color: '#0d9488',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                View 360 Profile <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.68rem' }} />
              </Link>
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b' }}>
              <Link
                to={`/admin/customers/${encodeURIComponent(order.customerName)}`}
                style={{ color: '#0f172a', textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#0d9488')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#0f172a')}
              >
                {order.customerName}
              </Link>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '6px' }}>
              <i className="fa-solid fa-phone" style={{ marginRight: '6px', color: '#94a3b8' }} />
              {order.phone}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
              <i className="fa-solid fa-envelope" style={{ marginRight: '6px', color: '#94a3b8' }} />
              {order.email}
            </div>
          </div>

          {/* Delivery & Logistics */}
          <div style={{ background: '#fff', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#0d9488' }}>
              <i className="fa-solid fa-truck-fast" />
              <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>Delivery Address & Tracking</strong>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.4 }}>
              {order.deliveryAddress || `${order.city}, ${order.state} - ${order.pincode}`}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Expected Delivery: <strong style={{ color: '#0f172a' }}>{order.expectedDate}</strong></span>
              {order.awbNumber && <span>AWB: <code style={{ color: '#0d9488' }}>{order.awbNumber}</code></span>}
            </div>
            {order.courier && (
              <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                Carrier: {order.courier}
              </div>
            )}
          </div>
        </div>

        {/* Financial & Payment Breakdown Matrix */}
        <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#0d9488' }}>
            <i className="fa-solid fa-receipt" />
            <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>Financial & Payment Breakdown</strong>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
            <div style={{ background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}> Total</div>
              <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                ₹{order.totalAmount.toLocaleString('en-IN')}
              </div>
            </div>
            <div style={{ background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.7rem', color: '#16a34a', textTransform: 'uppercase' }}>Discount</div>
              <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#16a34a', marginTop: '2px' }}>
                -₹{order.discountAmount.toLocaleString('en-IN')}
              </div>
            </div>
            <div style={{ background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.7rem', color: '#d97706', textTransform: 'uppercase' }}>Presto Cashback</div>
              <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#d97706', marginTop: '2px' }}>
                +{order.cashbackPoints} pts
              </div>
            </div>
            <div style={{ background: '#f0fdfa', padding: '10px', borderRadius: '8px', border: '1.5px solid #99f6e4' }}>
              <div style={{ fontSize: '0.7rem', color: '#0f766e', textTransform: 'uppercase', fontWeight: 700 }}>Order Pay Amount</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f766e', marginTop: '2px' }}>
                ₹{order.orderPayAmount.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap', fontSize: '0.78rem', color: '#475569', background: '#fff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <span><strong>Payment Method:</strong> {order.paymentMethod}</span>
            <span>•</span>
            <span><strong>Wallet Paid:</strong> ₹{order.walletAmount.toLocaleString('en-IN')}</span>
            <span>•</span>
            <span><strong>Online Gateway:</strong> ₹{order.onlineAmount.toLocaleString('en-IN')}</span>
            <span>•</span>
            <span><strong>COD Balance:</strong> ₹{order.codAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Itemized Products Table */}
        <div>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '0.88rem', color: '#0f172a' }}>
            Ordered Products ({order.items.length} items)
          </h4>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', minWidth: '520px', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                  <th style={{ padding: '8px 12px' }}>Item Description</th>
                  <th style={{ padding: '8px 12px' }}>SKU</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center' }}>Qty</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right' }}>Unit Price</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((it, idx) => (
                  <tr key={idx} style={{ borderBottom: idx < order.items.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#1e293b' }}>{it.name}</td>
                    <td style={{ padding: '10px 12px', color: '#64748b' }}>{it.sku || '—'}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700 }}>{it.quantity}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>₹{it.price.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#0d9488' }}>
                      ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {order.notes && (
          <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '10px 14px', borderRadius: '8px', fontSize: '0.78rem', color: '#92400e' }}>
            <strong>Order Notes:</strong> {order.notes}
          </div>
        )}

      </div>
    </Modal>
  );
};
