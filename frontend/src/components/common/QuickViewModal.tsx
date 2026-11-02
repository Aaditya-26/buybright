/**
 * BuyBright Quick View Modal Component.
 * Allows instant detailed preview of dental supplies, quantity selection, specifications, and fast add-to-cart.
 */

import React, { useState, useEffect } from 'react';
import type { Product } from '../../types';
import { Rating } from './Rating';
import { Badge } from './Badge';
import { useCart } from '../../context/CartContext';
import { getProductExpiryDate } from '../../utils/formatters';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [product]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <div className="quickview-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="quickview-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className="quickview-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <i className="fa-solid fa-xmark" />
        </button>

        <div className="quickview-grid">
          {/* Media Column */}
          <div className="quickview-media">
            {product.discount && <Badge variant="sale">{product.discount}</Badge>}
            {product.is_bestseller && <Badge variant="bestseller">Bestseller</Badge>}
            <img src={product.image} alt={product.name} />
          </div>

          {/* Details Column */}
          <div className="quickview-details">
            <span className="quickview-brand">{product.brand}</span>
            <h2 className="quickview-title">{product.name}</h2>

            <div className="quickview-rating-row">
              <Rating rating={product.rating} reviewsCount={product.reviews_count} />
              <span className="quickview-category-tag">Category: {product.category}</span>
            </div>

            <div className="quickview-price-row">
              <span className="quickview-price">INR {product.price.toLocaleString('en-IN')}</span>
              {product.old_price && (
                <span className="quickview-price-old">
                  INR {product.old_price.toLocaleString('en-IN')}
                </span>
              )}
              {product.discount && (
                <span className="quickview-save-tag">Save {product.discount}</span>
              )}
            </div>

            <p className="quickview-desc">
              Authentic, CE/ISO certified dental supply delivered with standard temperature-controlled
              cold-chain compliance and manufacturer warranty.
            </p>

            <div className="quickview-specs">
              <div className="spec-item">
                <i className="fa-solid fa-truck-fast" />
                <span>Express Dispatch (24-48h)</span>
              </div>
              <div className="spec-item">
                <i className="fa-solid fa-shield-halved" />
                <span>100% Genuine Guaranteed</span>
              </div>
              <div className="spec-item">
                <i className="fa-regular fa-calendar-check text-success" />
                <span>Expiry: <strong>{getProductExpiryDate(product)}</strong></span>
              </div>
              
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="quickview-actions">
              <div className="quickview-qty-control">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  <i className="fa-solid fa-minus" />
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  <i className="fa-solid fa-plus" />
                </button>
              </div>

              <button
                type="button"
                className="btn-add-cart quickview-add-btn"
                onClick={handleAddToCart}
              >
                <i className="fa-solid fa-cart-shopping" />
                <span>Add ({quantity}) to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
