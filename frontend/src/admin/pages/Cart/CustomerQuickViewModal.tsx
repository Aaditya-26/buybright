/**
 * BuyBright Admin — Customer Quick Profile Modal.
 * Opens when admin clicks "View Customer" from the Cart List.
 */

import React from 'react';
import { AdminCart } from '../../types/cart';

interface CustomerQuickViewModalProps {
  cart: AdminCart | null;
  isOpen: boolean;
  onClose: () => void;
  onComposeMessage: (cart: AdminCart) => void;
}

export const CustomerQuickViewModal: React.FC<CustomerQuickViewModalProps> = ({
  cart,
  isOpen,
  onClose,
  onComposeMessage,
}) => {
  if (!isOpen || !cart) return null;

  const cleanPhone = cart.customerPhone.replace(/[^0-9]/g, '');

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div
        className="admin-modal-container customer-quick-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-modal-header">
          <div className="modal-title-with-badge">
            <div className="cust-avatar-large">
              {cart.customerAvatar ? (
                <img src={cart.customerAvatar} alt={cart.customerName} />
              ) : (
                <span>{cart.customerName.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div>
              <h3 className="modal-title">{cart.customerName}</h3>
              <p className="modal-subtitle">
                ID: <strong>{cart.customerId}</strong> &bull; <span className="type-tag">{cart.customerType}</span>
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="admin-modal-body">
          {/* Practice & Contact Details */}
          <div className="cust-details-grid">
            <div className="cust-info-card">
              <span className="card-lbl">Clinic / Enterprise Name</span>
              <strong className="card-val">{cart.clinicName}</strong>
            </div>

            <div className="cust-info-card">
              <span className="card-lbl">Location &amp; Region</span>
              <strong className="card-val">
                <i className="fa-solid fa-location-dot mr-1 text-teal" />
                {cart.city}, {cart.state || 'India'}
              </strong>
            </div>

            <div className="cust-info-card">
              <span className="card-lbl">Email Address</span>
              <a href={`mailto:${cart.customerEmail}`} className="card-link">
                <i className="fa-regular fa-envelope mr-1" />
                {cart.customerEmail}
              </a>
            </div>

            <div className="cust-info-card">
              <span className="card-lbl">Phone Number</span>
              <div className="phone-row">
                <a href={`tel:${cleanPhone}`} className="card-link">
                  <i className="fa-solid fa-phone mr-1" />
                  {cart.customerPhone}
                </a>
                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="quick-wa-btn"
                  title="Direct WhatsApp"
                >
                  <i className="fa-brands fa-whatsapp" />
                </a>
              </div>
            </div>
          </div>

          {/* Cart Activity Summary */}
          <div className="cart-activity-box mt-3">
            <div className="act-header">
              <i className="fa-solid fa-cart-shopping text-primary mr-2" />
              <strong>Current Active Cart Activity</strong>
            </div>
            <div className="act-stats-strip">
              <div className="act-stat">
                <span className="act-lbl">Cart ID</span>
                <strong className="act-val text-primary">{cart.id}</strong>
              </div>
              <div className="act-stat">
                <span className="act-lbl">Cart Items</span>
                <strong className="act-val">{cart.totalItems} Items ({cart.totalQuantity} Units)</strong>
              </div>
              <div className="act-stat">
                <span className="act-lbl">Cart Value</span>
                <strong className="act-val text-teal">₹{cart.cartValue.toLocaleString()}</strong>
              </div>
              <div className="act-stat">
                <span className="act-lbl">Status</span>
                <strong className={`act-val status-${cart.cartStatus.toLowerCase()}`}>{cart.cartStatus}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-modal-footer">
          <button type="button" className="btn-admin-outline" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="btn-admin-primary btn-reach-wa"
            onClick={() => {
              onClose();
              onComposeMessage(cart);
            }}
          >
            <i className="fa-brands fa-whatsapp mr-1" /> Message Customer
          </button>
        </div>
      </div>
    </div>
  );
};
