/**
 * BuyBright Admin Wishlist — Product Wishlist Demand & Customer Analytics Modal.
 * Shows detailed product intelligence, customer save breakdown, demand KPIs, and direct contact options.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { AdminWishlistItem } from '../../../types/wishlist';
import { getWishlistItems } from '../../data/wishlistData';

interface WishlistDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: AdminWishlistItem | null;
  onSaveNotes?: (id: string, notes: string) => void;
}

export const WishlistDetailsModal: React.FC<WishlistDetailsModalProps> = ({
  isOpen,
  onClose,
  item,
  onSaveNotes,
}) => {
  const [adminNotes, setAdminNotes] = useState<string>('');
  const allWishlistItems = useMemo(() => getWishlistItems(), [isOpen]);

  useEffect(() => {
    if (item) {
      setAdminNotes(item.notes || '');
    }
  }, [item]);

  // Find all customers who saved this specific product (or similar SKU)
  const productWishlistEntries = useMemo(() => {
    if (!item) return [];
    return allWishlistItems.filter(
      (w) => w.productId === item.productId || w.productSku === item.productSku
    );
  }, [item, allWishlistItems]);

  if (!isOpen || !item) return null;

  const totalSavedCount = productWishlistEntries.length || 1;
  const totalProductDemandValue = (item.productPrice || 0) * totalSavedCount;
  const isHighDemand = totalSavedCount >= 2;

  const getStockBadgeClass = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'badge-stock-in';
      case 'Low Stock':
        return 'badge-stock-low';
      case 'Out of Stock':
        return 'badge-stock-out';
      default:
        return '';
    }
  };

  const handleSaveNotes = () => {
    if (onSaveNotes) {
      onSaveNotes(item.id, adminNotes);
    }
    onClose();
  };

  return (
    <div className="wishlist-modal-overlay" onClick={onClose}>
      <div className="wishlist-modal-card analytics-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="wishlist-modal-header">
          <div className="header-title-wrap">
            <div className="header-icon-circle">
              <i className="fa-solid fa-chart-pie" />
            </div>
            <div>
              <h3 className="modal-heading">Product Wishlist Analytics &amp; Customer Demand</h3>
              <span className="modal-subheading">
                SKU: {item.productSku} • Category: {item.productCategory} • Entry ID: #{item.id}
              </span>
            </div>
          </div>
          <button type="button" className="btn-close-modal" onClick={onClose} title="Close Modal">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="wishlist-modal-body">
          {/* Top Product Hero Summary Banner */}
          <div className="product-analytics-hero">
            <img
              src={item.productImage || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=160&auto=format&fit=crop&q=60'}
              alt={item.productName}
              className="hero-product-thumb"
            />
            <div className="hero-product-details">
              <div className="hero-top-tags">
                <span className="hero-cat-tag">{item.productCategory}</span>
                <span className="hero-sku-tag">SKU: {item.productSku}</span>
                <span className={`stock-pill ${getStockBadgeClass(item.stockStatus)}`}>
                  <i className="fa-solid fa-box" /> {item.stockStatus} ({item.stockQuantity} units)
                </span>
              </div>
              <h4 className="hero-product-name">{item.productName}</h4>
              <div className="hero-pricing-row">
                <span className="hero-price">₹{item.productPrice.toLocaleString()}</span>
                {item.productMrp > item.productPrice && (
                  <span className="hero-mrp">MRP: ₹{item.productMrp.toLocaleString()}</span>
                )}
                {item.productMrp > item.productPrice && (
                  <span className="hero-discount-badge">
                    {Math.round(((item.productMrp - item.productPrice) / item.productMrp) * 100)}% Margin
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Product Wishlist KPI Metrics Grid */}
          <div className="modal-kpi-grid">
            <div className="kpi-mini-card card-kpi-saves">
              <div className="kpi-mini-icon">
                <i className="fa-solid fa-heart" />
              </div>
              <div className="kpi-mini-info">
                <span className="kpi-mini-label">Total Wishlist Saves</span>
                <strong className="kpi-mini-val">{totalSavedCount} Doctors</strong>
              </div>
            </div>

            <div className="kpi-mini-card card-kpi-val">
              <div className="kpi-mini-icon">
                <i className="fa-solid fa-indian-rupee-sign" />
              </div>
              <div className="kpi-mini-info">
                <span className="kpi-mini-label">Potential Revenue</span>
                <strong className="kpi-mini-val">₹{totalProductDemandValue.toLocaleString()}</strong>
              </div>
            </div>

            <div className="kpi-mini-card card-kpi-demand">
              <div className="kpi-mini-icon">
                <i className="fa-solid fa-fire" />
              </div>
              <div className="kpi-mini-info">
                <span className="kpi-mini-label">Demand Intensity</span>
                <strong className="kpi-mini-val">{isHighDemand ? 'High Priority' : 'Steady Demand'}</strong>
              </div>
            </div>

            <div className="kpi-mini-card card-kpi-stock">
              <div className="kpi-mini-icon">
                <i className="fa-solid fa-warehouse" />
              </div>
              <div className="kpi-mini-info">
                <span className="kpi-mini-label">Warehouse Stock</span>
                <strong className="kpi-mini-val">{item.stockQuantity} in Stock</strong>
              </div>
            </div>
          </div>

          {/* Customer Wishlist Directory for this Product */}
          <div className="product-customers-section">
            <div className="section-header-row">
              <h4 className="section-title">
                <i className="fa-solid fa-users" /> Verified Doctors &amp; Clinics who Saved this Item ({productWishlistEntries.length})
              </h4>
              <span className="section-hint">Direct outreach tools for immediate order conversion</span>
            </div>

            <div className="customers-wishlist-table-wrap">
              <table className="customers-mini-table">
                <thead>
                  <tr>
                    <th>Doctor / Clinic Name</th>
                    <th>Contact Details</th>
                    <th>Saved Date</th>
                    <th style={{ textAlign: 'right' }}>Direct Action</th>
                  </tr>
                </thead>
                <tbody>
                  {productWishlistEntries.map((entry) => (
                    <tr key={entry.id}>
                      <td>
                        <div className="table-doc-cell">
                          {entry.customerAvatar ? (
                            <img src={entry.customerAvatar} alt={entry.customerName} className="doc-avatar-img" />
                          ) : (
                            <div className="doc-avatar-char">{entry.customerName.charAt(0)}</div>
                          )}
                          <div>
                            <strong className="doc-name">{entry.customerName}</strong>
                            {entry.clinicName && (
                              <span className="doc-clinic">{entry.clinicName}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="doc-contact-cell">
                          <span className="doc-email">{entry.customerEmail}</span>
                          <span className="doc-phone">{entry.customerPhone}</span>
                        </div>
                      </td>
                      <td>
                        <span className="doc-date">{entry.dateAdded}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="doc-actions-flex">
                          <a
                            href={`https://wa.me/${entry.customerPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(entry.customerName)},%20we%20noticed%20you%20saved%20${encodeURIComponent(item.productName)}%20in%20your%20BuyBright%20wishlist!`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-quick-contact btn-wa"
                            title="Chat on WhatsApp"
                          >
                            <i className="fa-brands fa-whatsapp" /> WhatsApp
                          </a>
                          <a
                            href={`tel:${entry.customerPhone.replace(/[^0-9+]/g, '')}`}
                            className="btn-quick-contact btn-ph"
                            title="Direct Phone Call"
                          >
                            <i className="fa-solid fa-phone" /> Call
                          </a>
                          <a
                            href={`mailto:${entry.customerEmail}?subject=Special%20BuyBright%20Wishlist%20Offer%20for%20${encodeURIComponent(item.productName)}`}
                            className="btn-quick-contact btn-em"
                            title="Send Email"
                          >
                            <i className="fa-regular fa-envelope" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Internal Notes & Demand Planning Section */}
          <div className="modal-notes-section">
            <label className="notes-label">
              <i className="fa-regular fa-clipboard mr-1" /> Internal Procurement &amp; Promotion Notes:
            </label>
            <textarea
              className="notes-textarea"
              rows={2}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add internal notes on restock schedule, doctor inquiries, or bundle discount eligibility..."
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="wishlist-modal-footer">
          <button type="button" className="btn-modal-cancel" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn-modal-save" onClick={handleSaveNotes}>
            <i className="fa-solid fa-floppy-disk mr-1" /> Save Notes &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
