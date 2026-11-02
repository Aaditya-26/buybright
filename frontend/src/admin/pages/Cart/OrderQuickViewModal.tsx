/**
 * BuyBright Admin — Converted Order Quick View Modal.
 * Opens when admin clicks "View Order" for converted carts.
 */

import React from 'react';
import { AdminCart } from '../../types/cart';

interface OrderQuickViewModalProps {
  cart: AdminCart | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderQuickViewModal: React.FC<OrderQuickViewModalProps> = ({
  cart,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !cart) return null;

  const orderId = cart.convertedOrderId || 'ORD-2026-9481';

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div
        className="admin-modal-container order-quick-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-modal-header">
          <div className="modal-title-with-badge">
            <div className="order-icon-badge">
              <i className="fa-solid fa-receipt" />
            </div>
            <div>
              <h3 className="modal-title">Converted Order &bull; {orderId}</h3>
              <p className="modal-subtitle">
                Converted from Cart: <strong>{cart.id}</strong> on <strong>{cart.lastUpdated}</strong>
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="admin-modal-body">
          {/* Order Summary Cards */}
          <div className="order-summary-grid">
            <div className="order-kpi-card">
              <span className="kpi-lbl">Order Status</span>
              <span className="order-status-pill badge-paid">
                <i className="fa-solid fa-circle-check" /> Confirmed &amp; In Process
              </span>
            </div>

            <div className="order-kpi-card">
              <span className="kpi-lbl">Payment Status</span>
              <span className="order-status-pill badge-paid">
                <i className="fa-solid fa-credit-card" /> Paid Online
              </span>
            </div>

            <div className="order-kpi-card">
              <span className="kpi-lbl">Total Paid Amount</span>
              <strong className="order-amount-text text-teal">₹{cart.finalTotal.toLocaleString()}</strong>
            </div>

            <div className="order-kpi-card">
              <span className="kpi-lbl">Delivery Destination</span>
              <span className="dest-text">
                <i className="fa-solid fa-truck mr-1 text-muted" />
                {cart.clinicName}, {cart.city}
              </span>
            </div>
          </div>

          {/* Ordered Products Snapshot */}
          <div className="ordered-products-box mt-3">
            <div className="box-title">
              <i className="fa-solid fa-box-open mr-2 text-primary" />
              <span>Fulfilled Order Items ({cart.items.length} Products)</span>
            </div>

            <div className="ordered-items-list">
              {cart.items.map((item) => (
                <div key={item.id} className="ordered-item-row">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="ordered-item-img"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="ordered-item-meta">
                    <strong className="ordered-item-name">{item.productName}</strong>
                    <div className="ordered-item-sub">
                      <span className="sku">{item.productSku}</span> &bull; <span>{item.variantPack}</span>
                    </div>
                  </div>
                  <div className="ordered-item-qty">
                    Qty: <strong>{item.quantity}</strong>
                  </div>
                  <div className="ordered-item-price">
                    <strong>₹{item.itemTotal.toLocaleString()}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="admin-modal-footer">
          <button type="button" className="btn-admin-outline" onClick={onClose}>
            Close
          </button>
          <a
            href={`/admin/orders/in-process`}
            className="btn-admin-primary"
            onClick={onClose}
          >
            <i className="fa-solid fa-arrow-up-right-from-square mr-1" /> Go to Orders Module
          </a>
        </div>
      </div>
    </div>
  );
};
