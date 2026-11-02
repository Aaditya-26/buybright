/**
 * BuyBright Shop Product Grid Component.
 * Supports both Multi-Column Grid Layout and Detailed Horizontal List Layout.
 * Integrates ProductCard, loading skeleton states, and empty filter states.
 */

import React from 'react';
import type { Product, ViewMode } from '../../types';
import { ProductCard } from '../common/ProductCard';

interface ShopProductGridProps {
  products: Product[];
  isLoading: boolean;
  viewMode: ViewMode;
  onResetFilters: () => void;
}

export const ShopProductGrid: React.FC<ShopProductGridProps> = ({
  products,
  isLoading,
  viewMode,
  onResetFilters,
}) => {
  if (isLoading) {
    return (
      <div className={`shop-products-container ${viewMode === 'list' ? 'list-view-mode' : 'grid-view-mode'}`}>
        {Array.from({ length: 12 }).map((_, idx) => (
          <div key={idx} className="product-card-skeleton">
            <div className="skeleton-image-box" />
            <div className="skeleton-line title" />
            <div className="skeleton-line price" />
            <div className="skeleton-line btn" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="shop-empty-state">
        <div className="empty-icon-wrap">
          <i className="fa-solid fa-box-open" />
        </div>
        <h3 className="empty-title">No Matching Dental Supplies Found</h3>
        <p className="empty-desc">
          We couldn't find any products matching your current combination of category, brand, price, or search criteria.
        </p>
        <div className="empty-actions">
          <button type="button" className="btn-empty-reset" onClick={onResetFilters}>
            <i className="fa-solid fa-rotate-left" />
            <span>Reset All Filters</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`shop-products-container ${
        viewMode === 'list' ? 'list-view-mode' : 'grid-view-mode'
      }`}
    >
      {products.map((product) => (
        <div key={product.id} className="shop-grid-item">
          <ProductCard product={product} viewMode={viewMode} />
        </div>
      ))}
    </div>
  );
};
