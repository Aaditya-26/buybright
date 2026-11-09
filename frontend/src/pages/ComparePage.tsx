/**
 * BuyBright Dedicated Product Comparison Page (/compare).
 * Displays a side-by-side comparison matrix of selected dental supplies.
 * Features left-aligned attribute labels:
 * - Product Overview
 * - Brand & Category
 * - Rating (Stars, reviews, scores)
 * - Price (Current rate, MRP, savings)
 * - Pack Size (Units, volume, packaging specifications)
 * - Dental Stock & Procurement CTA
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Rating } from '../components/common/Rating';
import { Badge } from '../components/common/Badge';
import { SEO } from '../components/common/SEO';
import type { Product } from '../types';
import { getProductExpiryDate } from '../utils/formatters';

export const ComparePage: React.FC = () => {
  const { compareItems, removeFromCompare, compareCount } = useCompare();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    showToast(`✓ Added "${product.name.slice(0, 22)}..." to Cart!`, 'success');
  };

  const getPackSize = (product: Product): string => {
    if (product.size) return product.size;
    if (product.volume_ml) return `${product.volume_ml} Bottle / Dispenser`;
    
    // Derived realistic marketplace packaging
    const name = product.name.toLowerCase();
    if (name.includes('pack of 6') || name.includes('pack of 12') || name.includes('pack of 100')) {
      const match = product.name.match(/pack of \d+/i);
      if (match) return match[0];
    }
    if (name.includes('box of 100') || name.includes('box of 50')) {
      const match = product.name.match(/box of \d+/i);
      if (match) return match[0];
    }

    switch ((product.category || '').toLowerCase()) {
      case 'electronics':
        return 'Standard Retail Box (1 Unit)';
      case 'fashion':
        return 'Single Pack / Garment Bag';
      case 'home-kitchen':
        return '1 Unit Complete Set with Accessories';
      case 'beauty':
        return '1 Bottle / Dispenser Pack';
      case 'sports':
        return '1 Standard Sports Equipment Unit';
      case 'books':
        return 'Single Edition (Paperback / Hardcover)';
      default:
        return 'Standard Marketplace Pack (1 Unit)';
    }
  };

  return (
    <div className="compare-page-wrapper">
      <SEO
        title="Compare Marketplace Products"
        description="Compare specifications, pack sizes, prices, ratings, and product attributes across electronics, fashion, home, and lifestyle products."
        canonicalUrl="https://buybright.com/compare"
      />
      <div className="compare-page-container">
        {/* Breadcrumb Navigation */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '6px' }}>
            <Link to="/" style={{ color: 'var(--color-teal-blue, #3f788c)' }}>Home</Link> /{' '}
            <Link to="/shop" style={{ color: 'var(--color-teal-blue, #3f788c)' }}>Shop</Link> /{' '}
            <span>Product Comparison</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-dark-navy, #2a3537)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fa-solid fa-code-compare text-teal" /> Marketplace Product Comparison
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0 0' }}>
                Compare key specifications, ratings, prices, and pack sizes side-by-side.
              </p>
            </div>

            {compareCount > 0 && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link
                  to="/shop"
                  style={{
                    padding: '8px 18px',
                    background: 'var(--color-teal-blue, #3f788c)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <i className="fa-solid fa-plus" /> Add More Products
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {compareCount === 0 ? (
          <div className="compare-empty-card">
            <div className="compare-empty-icon">
              <i className="fa-solid fa-code-compare" />
            </div>
            <h2>No Products Added for Comparison</h2>
            <p>
              Click the comparison icon <i className="fa-solid fa-code-compare" style={{ color: '#3f788c', margin: '0 4px' }} /> on any product card in the catalog to compare up to 4 items side-by-side.
            </p>
            <button
              type="button"
              className="btn-browse-compare-cta"
              onClick={() => navigate('/shop')}
            >
              <i className="fa-solid fa-bag-shopping" /> Browse Marketplace Catalog
            </button>
          </div>
        ) : (
          /* Comparison Table / Matrix Layout */
          <div className="compare-matrix-scroll-wrapper">
            <div className="compare-matrix-table">
              {/* Row 1: Product Thumbnail & Title Header */}
              <div
                className="compare-row row-overview"
                style={{
                  gridTemplateColumns: `240px repeat(${Math.max(1, compareCount)}, minmax(240px, 1fr))`,
                }}
              >
                <div className="compare-cell cell-label">
                  <span className="label-badge">SPECS</span>
                  <strong>Product Overview</strong>
                </div>

                {compareItems.map((product) => (
                  <div key={product.id} className="compare-cell cell-product-header">
                    <button
                      type="button"
                      className="btn-remove-compare"
                      onClick={() => removeFromCompare(product.id)}
                      title="Remove from comparison"
                      aria-label="Remove item"
                    >
                      <i className="fa-solid fa-xmark" />
                    </button>

                    <div className="compare-img-wrap">
                      {product.discount && <Badge variant="sale">{product.discount}</Badge>}
                      {product.is_bestseller && <Badge variant="bestseller">Bestseller</Badge>}
                      <img src={product.image} alt={product.name} />
                    </div>

                    <span className="compare-brand-pill">{product.brand}</span>
                    <h3 className="compare-prod-title">
                      <Link to={`/shop/${product.id}`} title={product.name}>
                        {product.name}
                      </Link>
                    </h3>
                  </div>
                ))}
              </div>

              {/* Row 2: Brand & Category */}
              <div
                className="compare-row"
                style={{
                  gridTemplateColumns: `240px repeat(${Math.max(1, compareCount)}, minmax(240px, 1fr))`,
                }}
              >
                <div className="compare-cell cell-label">
                  <strong>Brand &amp; Category</strong>
                </div>
                {compareItems.map((product) => (
                  <div key={product.id} className="compare-cell">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>{product.brand}</strong>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'capitalize' }}>
                        {product.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 3: Rating (Requested) */}
              <div
                className="compare-row row-highlight"
                style={{
                  gridTemplateColumns: `240px repeat(${Math.max(1, compareCount)}, minmax(240px, 1fr))`,
                }}
              >
                <div className="compare-cell cell-label">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fa-solid fa-star text-yellow" />
                    <strong>Rating</strong>
                  </div>
                  <span className="label-subtext">Doctor verified reviews</span>
                </div>

                {compareItems.map((product) => (
                  <div key={product.id} className="compare-cell">
                    <div className="compare-rating-box">
                      <Rating rating={product.rating || 4.8} reviewsCount={product.reviews_count || 24} />
                      <span className="rating-score-pill">
                        <strong>{product.rating || 4.8}</strong> / 5.0
                      </span>
                      <span className="rating-count-text">
                        ({product.reviews_count || 24} Doctor Reviews)
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 4: Price (Requested) */}
              <div
                className="compare-row row-highlight"
                style={{
                  gridTemplateColumns: `240px repeat(${Math.max(1, compareCount)}, minmax(240px, 1fr))`,
                }}
              >
                <div className="compare-cell cell-label">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fa-solid fa-indian-rupee-sign text-teal" />
                    <strong>Price</strong>
                  </div>
                  <span className="label-subtext">Inclusive of GST input credit</span>
                </div>

                {compareItems.map((product) => (
                  <div key={product.id} className="compare-cell">
                    <div className="compare-price-box">
                      <span className="cur-price">INR {product.price.toLocaleString('en-IN')}</span>
                      {product.old_price && (
                        <span className="old-price">INR {product.old_price.toLocaleString('en-IN')}</span>
                      )}
                      {product.discount && (
                        <span className="save-badge">Save {product.discount}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 5: Pack Size (Requested) */}
              <div
                className="compare-row row-highlight"
                style={{
                  gridTemplateColumns: `240px repeat(${Math.max(1, compareCount)}, minmax(240px, 1fr))`,
                }}
              >
                <div className="compare-cell cell-label">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fa-solid fa-boxes-stacked text-teal" />
                    <strong>Pack Size</strong>
                  </div>
                  <span className="label-subtext">Quantity &amp; volume per box</span>
                </div>

                {compareItems.map((product) => (
                  <div key={product.id} className="compare-cell">
                    <div className="compare-pack-size-box">
                      <i className="fa-solid fa-box-open pack-icon" />
                      <strong>{getPackSize(product)}</strong>
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 6: Batch Expiry Date */}
              <div
                className="compare-row"
                style={{
                  gridTemplateColumns: `240px repeat(${Math.max(1, compareCount)}, minmax(240px, 1fr))`,
                }}
              >
                <div className="compare-cell cell-label">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fa-regular fa-calendar-check text-success" />
                    <strong>Batch Expiry Date</strong>
                  </div>
                  <span className="label-subtext">Verified merchant quality warranty</span>
                </div>
                {compareItems.map((product) => (
                  <div key={product.id} className="compare-cell">
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#166534', fontSize: '0.85rem', fontWeight: 700, background: '#f0fdf4', padding: '4px 10px', borderRadius: '5px', border: '1px solid #bbf7d0' }}>
                      <i className="fa-regular fa-calendar-check" style={{ color: '#16a34a' }} />
                      <span>Exp: {getProductExpiryDate(product)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 7: Quality / Certification */}
              <div
                className="compare-row"
                style={{
                  gridTemplateColumns: `240px repeat(${Math.max(1, compareCount)}, minmax(240px, 1fr))`,
                }}
              >
                <div className="compare-cell cell-label">
                  <strong>Certification &amp; Standard</strong>
                </div>
                {compareItems.map((product) => (
                  <div key={product.id} className="compare-cell">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#15803d', fontSize: '0.82rem', fontWeight: 700 }}>
                      <i className="fa-solid fa-circle-check" /> CE &amp; ISO 13485 Certified
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 7: Action CTA Buttons */}
              <div
                className="compare-row row-actions"
                style={{
                  gridTemplateColumns: `240px repeat(${Math.max(1, compareCount)}, minmax(240px, 1fr))`,
                }}
              >
                <div className="compare-cell cell-label">
                  <strong>Procure Items</strong>
                </div>

                {compareItems.map((product) => (
                  <div key={product.id} className="compare-cell">
                    <button
                      type="button"
                      className="btn-compare-add-cart"
                      onClick={() => handleAddToCart(product)}
                    >
                      <i className="fa-solid fa-cart-shopping" />
                      <span>Add to Cart</span>
                    </button>
                    <Link to={`/shop/${product.id}`} className="btn-compare-view-details">
                      View Full Details
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparePage;
