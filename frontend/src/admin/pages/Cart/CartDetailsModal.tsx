/**
 * BuyBright Admin — Cart Details Modal.
 * Displays comprehensive customer profile, cart product breakdown, financials, and quick outreach actions.
 */

import React from 'react';
import { AdminCart, CartStockStatus } from '../../types/cart';

interface CartDetailsModalProps {
  cart: AdminCart | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenMessage: (cart: AdminCart) => void;
  onViewCustomer?: (cart: AdminCart) => void;
  onViewOrder?: (orderId: string) => void;
}

export const CartDetailsModal: React.FC<CartDetailsModalProps> = ({
  cart,
  isOpen,
  onClose,
  onOpenMessage,
  onViewCustomer,
  onViewOrder,
}) => {
  if (!isOpen || !cart) return null;

  const renderStockBadge = (status: CartStockStatus, qty: number) => {
    switch (status) {
      case 'In Stock':
        return (
          <span className="cart-stock-badge stock-in" title={`${qty} units in warehouse`}>
            <i className="fa-solid fa-circle-check" /> In Stock ({qty})
          </span>
        );
      case 'Low Stock':
        return (
          <span className="cart-stock-badge stock-low" title={`Only ${qty} units remaining`}>
            <i className="fa-solid fa-triangle-exclamation" /> Low Stock ({qty})
          </span>
        );
      case 'Out of Stock':
        return (
          <span className="cart-stock-badge stock-out" title="Product out of stock">
            <i className="fa-solid fa-ban" /> Out of Stock
          </span>
        );
      default:
        return null;
    }
  };

  const renderStatusBadge = (status: AdminCart['cartStatus']) => {
    switch (status) {
      case 'Active':
        return (
          <span className="cart-status-pill status-active">
            <i className="fa-solid fa-bolt mr-1" /> Active Session
          </span>
        );
      case 'Abandoned':
        return (
          <span className="cart-status-pill status-abandoned">
            <i className="fa-solid fa-cart-arrow-down mr-1" /> Abandoned ({cart.abandonedStep || 'Checkout'})
          </span>
        );
      case 'Converted':
        return (
          <span className="cart-status-pill status-converted">
            <i className="fa-solid fa-circle-check mr-1" /> Converted to Order
          </span>
        );
      case 'Expired':
        return (
          <span className="cart-status-pill status-expired">
            <i className="fa-solid fa-clock-rotate-left mr-1" /> Expired
          </span>
        );
    }
  };

  const cleanPhone = cart.customerPhone.replace(/[^0-9]/g, '');

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div
        className="admin-modal-container cart-details-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="admin-modal-header">
          <div className="modal-title-with-badge">
            <div className="cart-header-icon">
              <i className="fa-solid fa-cart-shopping" />
            </div>
            <div>
              <div className="title-row-flex">
                <h3 className="modal-title">Cart Details &bull; {cart.id}</h3>
                {renderStatusBadge(cart.cartStatus)}
              </div>
              <p className="modal-subtitle">
                Created: <strong>{cart.createdDate}</strong> &bull; Last Updated: <strong>{cart.lastUpdated}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="admin-modal-body cart-modal-scrollable">
          {/* Section 1: Customer Details */}
          <div className="cart-detail-section-card">
            <div className="section-card-header">
              <div className="header-title">
                <i className="fa-solid fa-user-doctor text-primary mr-2" />
                <span>Customer Information</span>
              </div>
              {onViewCustomer && (
                <button
                  type="button"
                  className="btn-link-action"
                  onClick={() => onViewCustomer(cart)}
                >
                  <i className="fa-solid fa-id-card mr-1" /> View Full Profile
                </button>
              )}
            </div>

            <div className="customer-info-grid">
              <div className="info-item">
                <span className="info-label">Customer Name</span>
                <strong className="info-value text-primary">{cart.customerName}</strong>
              </div>

              <div className="info-item">
                <span className="info-label">Customer Type</span>
                <span className="customer-type-badge">{cart.customerType}</span>
              </div>

              <div className="info-item">
                <span className="info-label">Business / Clinic Name</span>
                <strong className="info-value">{cart.clinicName}</strong>
              </div>

              <div className="info-item">
                <span className="info-label">City &amp; Location</span>
                <span className="info-value">
                  <i className="fa-solid fa-location-dot mr-1 text-muted" />
                  {cart.city}{cart.state ? `, ${cart.state}` : ''}
                </span>
              </div>

              <div className="info-item">
                <span className="info-label">Email Address</span>
                <a href={`mailto:${cart.customerEmail}`} className="info-link">
                  <i className="fa-regular fa-envelope mr-1" /> {cart.customerEmail}
                </a>
              </div>

              <div className="info-item">
                <span className="info-label">Mobile Number</span>
                <div className="phone-contact-group">
                  <a href={`tel:${cleanPhone}`} className="info-link">
                    <i className="fa-solid fa-phone mr-1" /> {cart.customerPhone}
                  </a>
                  <a
                    href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                      `Hello ${cart.customerName}, we noticed you have items saved in your BuyBright cart (Cart ID: ${cart.id}). Would you like assistance in completing your clinic order?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="direct-wa-pill"
                    title="Open WhatsApp Chat"
                  >
                    <i className="fa-brands fa-whatsapp" /> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Cart Products List */}
          <div className="cart-detail-section-card mt-3">
            <div className="section-card-header">
              <div className="header-title">
                <i className="fa-solid fa-boxes-stacked text-primary mr-2" />
                <span>Cart Products ({cart.items.length} Items &bull; {cart.totalQuantity} Units)</span>
              </div>
              <span className="cart-total-badge">
                Gross Value: ₹{cart.cartValue.toLocaleString()}
              </span>
            </div>

            <div className="cart-items-table-wrapper">
              <table className="cart-products-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>Image</th>
                    <th>Product Name &amp; SKU</th>
                    <th>Variant / Pack</th>
                    <th style={{ textAlign: 'center' }}>Qty</th>
                    <th style={{ textAlign: 'right' }}>Unit Price</th>
                    <th style={{ textAlign: 'right' }}>Discount</th>
                    <th style={{ textAlign: 'right' }}>GST Rate</th>
                    <th style={{ textAlign: 'right' }}>Item Total</th>
                    <th style={{ textAlign: 'center' }}>Stock Status</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="cart-prod-thumb"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </td>
                      <td>
                        <div className="cart-prod-info-col">
                          <strong className="cart-prod-name">{item.productName}</strong>
                          <span className="cart-prod-sku">{item.productSku}</span>
                        </div>
                      </td>
                      <td>
                        <span className="variant-pack-tag">{item.variantPack}</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="qty-badge-pill">{item.quantity}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        ₹{item.unitPrice.toLocaleString()}
                      </td>
                      <td style={{ textAlign: 'right', color: item.discountAmount > 0 ? '#10b981' : '#64748b' }}>
                        {item.discountAmount > 0 ? (
                          <>
                            <strong>-₹{item.discountAmount.toLocaleString()}</strong>
                            <span className="discount-sub-pct">({item.discountPercent}%)</span>
                          </>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="gst-rate-tag">{item.gstRate}%</span>
                        <span className="gst-amount-sub">₹{item.gstAmount.toLocaleString()}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <strong className="item-total-val">₹{item.itemTotal.toLocaleString()}</strong>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {renderStockBadge(item.stockStatus, item.stockQuantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Financials Summary & Notes */}
          <div className="cart-financials-row-grid mt-3">
            {/* Notes / Context */}
            <div className="cart-notes-card">
              <div className="notes-header">
                <i className="fa-solid fa-comment-dots text-primary mr-2" />
                <strong>Cart Notes &amp; Drop-off Analysis</strong>
              </div>
              <p className="cart-notes-text">
                {cart.notes || 'No customer drop-off notes recorded for this active session.'}
              </p>
              {cart.lastOutreachSent && (
                <div className="outreach-history-badge">
                  <i className="fa-solid fa-paper-plane mr-1 text-teal" />
                  Last Outreach Dispatched: <strong>{cart.lastOutreachSent}</strong>
                </div>
              )}
            </div>

            {/* Financial Summary */}
            <div className="cart-summary-card">
              <div className="summary-line">
                <span>Items Subtotal:</span>
                <strong>₹{cart.cartValue.toLocaleString()}</strong>
              </div>

              {cart.couponCode && (
                <div className="summary-line coupon-line">
                  <span>
                    Coupon Discount (<code>{cart.couponCode}</code>):
                  </span>
                  <strong className="text-success">-₹{cart.couponDiscount.toLocaleString()}</strong>
                </div>
              )}

              <div className="summary-line">
                <span>Total GST Tax:</span>
                <strong>₹{cart.gstTotal.toLocaleString()}</strong>
              </div>

              <div className="summary-line">
                <span>Shipping &amp; Logistics:</span>
                <strong>{cart.shippingFee > 0 ? `₹${cart.shippingFee}` : 'FREE'}</strong>
              </div>

              <div className="summary-divider" />

              <div className="summary-line total-line">
                <span>Final Cart Payable:</span>
                <strong className="final-payable-val">₹{cart.finalTotal.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="admin-modal-footer cart-modal-footer">
          <div className="footer-left-actions">
            {cart.cartStatus === 'Converted' && cart.convertedOrderId && onViewOrder && (
              <button
                type="button"
                className="btn-admin-outline text-primary"
                onClick={() => onViewOrder(cart.convertedOrderId!)}
              >
                <i className="fa-solid fa-receipt mr-1" /> View Linked Order ({cart.convertedOrderId})
              </button>
            )}
          </div>

          <div className="footer-right-actions">
            <button type="button" className="btn-admin-outline" onClick={onClose}>
              Close
            </button>

            <button
              type="button"
              className="btn-admin-primary btn-reach-wa"
              onClick={() => onOpenMessage(cart)}
            >
              <i className="fa-brands fa-whatsapp mr-1" /> Send WhatsApp Recovery Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
