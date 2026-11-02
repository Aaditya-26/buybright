/**
 * BuyBright Admin Wishlist — Product Quick View Modal.
 * Clean, focused display of the wishlisted dental product, specifications, pricing, and stock status.
 */

import React from 'react';
import { AdminWishlistItem } from '../../../types/wishlist';

interface ProductViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: AdminWishlistItem | null;
}

export const ProductViewModal: React.FC<ProductViewModalProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  if (!isOpen || !item) return null;

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

  const discountPercent =
    item.productMrp > item.productPrice
      ? Math.round(((item.productMrp - item.productPrice) / item.productMrp) * 100)
      : 0;

  return (
    <div className="wishlist-modal-overlay" onClick={onClose}>
      <div className="wishlist-modal-card product-view-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="wishlist-modal-header">
          <div className="header-title-wrap">
            <div className="header-icon-circle">
              <i className="fa-solid fa-tooth" />
            </div>
            <div>
              <h3 className="modal-heading">Product Details</h3>
              <span className="modal-subheading">
                SKU: {item.productSku} • Category: {item.productCategory}
              </span>
            </div>
          </div>
          <button type="button" className="btn-close-modal" onClick={onClose} title="Close">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="wishlist-modal-body product-view-body">
          <div className="product-view-layout">
            {/* Product Image Section */}
            <div className="product-view-image-wrap">
              <img
                src={item.productImage || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&auto=format&fit=crop&q=80'}
                alt={item.productName}
                className="product-large-img"
              />
              <div className="image-badge-tag">
                <span className={`stock-pill ${getStockBadgeClass(item.stockStatus)}`}>
                  <i className="fa-solid fa-box" /> {item.stockStatus} ({item.stockQuantity} units)
                </span>
              </div>
            </div>

            {/* Product Specifications Section */}
            <div className="product-view-specs-wrap">
              <span className="product-cat-pill">{item.productCategory}</span>
              <h3 className="product-title-txt">{item.productName}</h3>

              <div className="product-price-box">
                <div className="price-main-row">
                  <span className="price-current">₹{item.productPrice.toLocaleString()}</span>
                  {item.productMrp > item.productPrice && (
                    <span className="price-mrp">MRP: ₹{item.productMrp.toLocaleString()}</span>
                  )}
                  {discountPercent > 0 && (
                    <span className="price-save-badge">{discountPercent}% OFF</span>
                  )}
                </div>
                <span className="price-tax-sub">Inclusive of applicable GST / Tax slabs</span>
              </div>

              {/* Specs Grid */}
              <div className="product-specs-grid">
                <div className="spec-item">
                  <span className="spec-label">Product SKU</span>
                  <strong className="spec-val">{item.productSku}</strong>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Category</span>
                  <strong className="spec-val">{item.productCategory}</strong>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Warehouse Stock</span>
                  <strong className="spec-val">{item.stockQuantity} Available</strong>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Availability</span>
                  <strong className={`spec-val ${item.stockStatus === 'In Stock' ? 'text-success' : 'text-danger'}`}>
                    {item.stockStatus}
                  </strong>
                </div>
              </div>

              {/* Description Snippet */}
              <div className="product-desc-box">
                <span className="desc-title">Product Overview &amp; Usage:</span>
                <p className="desc-text">
                  Premium professional-grade dental equipment and clinical supply. Tested for dental clinic sterilization standards and daily operatory use.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="wishlist-modal-footer">
          <button type="button" className="btn-modal-cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
