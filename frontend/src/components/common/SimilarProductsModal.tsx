/**
 * BuyBright Similar Products Interactive Modal Component.
 * Triggered by the pulsing "View Similar" button on any Product Card.
 * Displays smart matching certified dental supplies using the EXACT same authentic
 * ProductCard component and design as the Home & Shop pages.
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { Product } from '../../types';
import { dentalService } from '../../services/dentalService';
import { ProductCard } from './ProductCard';

interface SimilarProductsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SimilarProductsModal: React.FC<SimilarProductsModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const location = useLocation();
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'category' | 'brand' | 'bestsellers'>('all');

  useEffect(() => {
    if (isOpen && product) {
      setLoading(true);
      dentalService
        .getRelatedProducts(product.category, product.id, 8)
        .then((items) => {
          setSimilarProducts(items || []);
        })
        .catch(() => {
          setSimilarProducts([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, product]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Close modal on route navigation
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location.pathname]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  // Filter similar items
  const filteredProducts = similarProducts.filter((item) => {
    if (activeFilter === 'category') {
      return item.category.toLowerCase() === product.category.toLowerCase();
    }
    if (activeFilter === 'brand') {
      return item.brand.toLowerCase() === product.brand.toLowerCase();
    }
    if (activeFilter === 'bestsellers') {
      return item.is_bestseller || (item.rating && item.rating >= 4.7);
    }
    return true;
  });

  return (
    <div className="similar-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="similar-modal-heading">
      <div className="similar-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Mobile Drag Pill Indicator */}
        <div className="similar-modal-drag-handle" />

        {/* Top Header Bar */}
        <div className="similar-modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge">
              <i className="fa-solid fa-wand-magic-sparkles" />
            </div>
            <div>
              <h2 id="similar-modal-heading">Similar &amp; Alternative Dental Supplies</h2>
              <p>Certified dental alternatives and complementary consumables</p>
            </div>
          </div>

          <button
            type="button"
            className="similar-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Reference Product Mini Bar */}
        <div className="reference-product-bar">
          <div className="ref-label">
            <span>REFERENCE ITEM</span>
            <i className="fa-solid fa-arrow-right" />
          </div>

          <div className="ref-item-card">
            <img src={product.image} alt={product.name} />
            <div className="ref-item-info">
              <span className="ref-brand">{product.brand}</span>
              <strong className="ref-name">{product.name}</strong>
              <div className="ref-meta">
                <span className="ref-category">{product.category}</span>
                <span className="ref-price">INR {product.price.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="similar-filter-tabs">
          <button
            type="button"
            className={`filter-tab-pill ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            <i className="fa-solid fa-layer-group" />
            All Certified Matches ({similarProducts.length})
          </button>

          <button
            type="button"
            className={`filter-tab-pill ${activeFilter === 'category' ? 'active' : ''}`}
            onClick={() => setActiveFilter('category')}
          >
            <i className="fa-solid fa-folder-tree" />
            Same Category ({product.category})
          </button>

          <button
            type="button"
            className={`filter-tab-pill ${activeFilter === 'brand' ? 'active' : ''}`}
            onClick={() => setActiveFilter('brand')}
          >
            <i className="fa-solid fa-certificate" />
            Same Brand ({product.brand})
          </button>

          <button
            type="button"
            className={`filter-tab-pill ${activeFilter === 'bestsellers' ? 'active' : ''}`}
            onClick={() => setActiveFilter('bestsellers')}
          >
            <i className="fa-solid fa-fire text-coral" />
            Top Rated Bestsellers
          </button>
        </div>

        {/* Modal Content / Products Grid */}
        <div className="similar-modal-body">
          {loading ? (
            <div className="similar-loading-state">
              <div className="similar-spinner">
                <i className="fa-solid fa-circle-notch fa-spin" />
              </div>
              <p>Scanning active dental inventory for matching formulations &amp; instruments...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="similar-empty-state">
              <i className="fa-solid fa-box-open" />
              <h3>No exact alternative matches in this filter</h3>
              <p>Try switching to "All Certified Matches" to view alternative dental solutions.</p>
              <button
                type="button"
                className="btn-reset-filter"
                onClick={() => setActiveFilter('all')}
              >
                Show All Matches
              </button>
            </div>
          ) : (
            <div className="similar-products-grid">
              {filteredProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="similar-modal-footer">
          <div className="footer-trust-notes">
            <span className="trust-item">
              <i className="fa-solid fa-shield-halved" /> 100% Certified Dental Genuine
            </span>
            <span className="trust-item">
              <i className="fa-solid fa-truck-fast" /> Fast 24-48h Delivery
            </span>
          </div>

          <Link to="/shop" className="btn-browse-all-catalog" onClick={onClose}>
            <span>Browse Full Catalog</span>
            <i className="fa-solid fa-chevron-right" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SimilarProductsModal;
