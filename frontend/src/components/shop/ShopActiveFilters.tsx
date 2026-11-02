/**
 * BuyBright Shop Active Filters Component.
 * Displays interactive dismissible chips for each currently applied filter.
 */

import React from 'react';
import type { Category, AvailabilityOption } from '../../types';

interface ShopActiveFiltersProps {
  categories: Category[];
  selectedCategories: string[];
  selectedBrands: string[];
  selectedSize: string;
  selectedVolume: string;
  availability: AvailabilityOption;
  priceRange: [number, number];
  minRating: number;
  minDiscount: number;
  onlyBestsellers: boolean;
  searchQuery: string;
  onRemoveCategory: (slug: string) => void;
  onRemoveBrand: (brand: string) => void;
  onResetSize: () => void;
  onResetVolume: () => void;
  onResetAvailability: () => void;
  onResetPrice: () => void;
  onResetRating: () => void;
  onResetDiscount: () => void;
  onToggleBestsellers: () => void;
  onClearSearch: () => void;
  onClearAll: () => void;
}

export const ShopActiveFilters: React.FC<ShopActiveFiltersProps> = ({
  categories,
  selectedCategories,
  selectedBrands,
  selectedSize,
  selectedVolume,
  availability,
  priceRange,
  minRating,
  minDiscount,
  onlyBestsellers,
  searchQuery,
  onRemoveCategory,
  onRemoveBrand,
  onResetSize,
  onResetVolume,
  onResetAvailability,
  onResetPrice,
  onResetRating,
  onResetDiscount,
  onToggleBestsellers,
  onClearSearch,
  onClearAll,
}) => {
  const hasActiveSize = selectedSize && selectedSize !== 'All Sizes';
  const hasActiveVolume = selectedVolume && selectedVolume !== 'All Volumes';
  const hasActiveAvailability = availability !== 'all';
  const hasActivePrice = priceRange[0] > 0 || priceRange[1] < 100000;
  const hasActiveRating = minRating > 0;
  const hasActiveDiscount = minDiscount > 0;
  const hasActiveSearch = searchQuery.trim().length > 0;

  const totalActiveCount =
    selectedCategories.length +
    selectedBrands.length +
    (hasActiveSize ? 1 : 0) +
    (hasActiveVolume ? 1 : 0) +
    (hasActiveAvailability ? 1 : 0) +
    (hasActivePrice ? 1 : 0) +
    (hasActiveRating ? 1 : 0) +
    (hasActiveDiscount ? 1 : 0) +
    (onlyBestsellers ? 1 : 0) +
    (hasActiveSearch ? 1 : 0);

  if (totalActiveCount === 0) return null;

  return (
    <div className="shop-active-filters-bar">
      <div className="active-filters-label">
        <i className="fa-solid fa-filter" />
        <span>Active Filters ({totalActiveCount}):</span>
      </div>

      <div className="active-chips-list">
        {/* Search Query Chip */}
        {hasActiveSearch && (
          <span className="filter-chip search-chip">
            <i className="fa-solid fa-magnifying-glass search-chip-icon" />
            <span>Search: "{searchQuery}"</span>
            <button
              type="button"
              onClick={onClearSearch}
              title="Remove search query"
              aria-label="Remove search filter"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </span>
        )}

        {/* Category Chips */}
        {selectedCategories.map((slug) => {
          const catName = categories.find((c) => c.slug === slug)?.title || slug;
          return (
            <span key={slug} className="filter-chip">
              <span>Category: {catName}</span>
              <button
                type="button"
                onClick={() => onRemoveCategory(slug)}
                title={`Remove ${catName}`}
                aria-label={`Remove ${catName} filter`}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </span>
          );
        })}

        {/* Brand Chips */}
        {selectedBrands.map((brand) => (
          <span key={brand} className="filter-chip brand-chip">
            <span>Brand: {brand}</span>
            <button
              type="button"
              onClick={() => onRemoveBrand(brand)}
              title={`Remove ${brand}`}
              aria-label={`Remove ${brand} filter`}
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </span>
        ))}

        {/* Size Chip */}
        {hasActiveSize && (
          <span className="filter-chip size-chip">
            <i className="fa-solid fa-ruler-combined me-1" />
            <span>Size: {selectedSize}</span>
            <button
              type="button"
              onClick={onResetSize}
              title="Remove size filter"
              aria-label="Remove size filter"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </span>
        )}

        {/* Milliliters (Volume) Chip */}
        {hasActiveVolume && (
          <span className="filter-chip volume-chip">
            <i className="fa-solid fa-flask-vial me-1" />
            <span>Volume: {selectedVolume}</span>
            <button
              type="button"
              onClick={onResetVolume}
              title="Remove volume filter"
              aria-label="Remove volume filter"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </span>
        )}

        {/* Availability Chip */}
        {hasActiveAvailability && (
          <span
            className={`filter-chip ${
              availability === 'in_stock' ? 'stock-chip' : 'out-of-stock-chip'
            }`}
          >
            <span>{availability === 'in_stock' ? '✓ In Stock' : '⏳ Out of Stock'}</span>
            <button
              type="button"
              onClick={onResetAvailability}
              title="Reset availability filter"
              aria-label="Reset availability filter"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </span>
        )}

        {/* Price Range Chip */}
        {hasActivePrice && (
          <span className="filter-chip price-chip">
            <span>Price: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}</span>
            <button
              type="button"
              onClick={onResetPrice}
              title="Reset price range"
              aria-label="Reset price filter"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </span>
        )}

        {/* Rating Chip */}
        {hasActiveRating && (
          <span className="filter-chip rating-chip">
            <span>{minRating}★ &amp; above</span>
            <button
              type="button"
              onClick={onResetRating}
              title="Reset rating filter"
              aria-label="Reset rating filter"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </span>
        )}

        {/* Discount Chip */}
        {hasActiveDiscount && (
          <span className="filter-chip discount-chip">
            <span>{minDiscount}%+ Off</span>
            <button
              type="button"
              onClick={onResetDiscount}
              title="Reset discount filter"
              aria-label="Reset discount filter"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </span>
        )}

        {/* Bestseller Chip */}
        {onlyBestsellers && (
          <span className="filter-chip bestseller-chip">
            <span>Bestsellers Only</span>
            <button
              type="button"
              onClick={onToggleBestsellers}
              title="Remove bestsellers filter"
              aria-label="Remove bestsellers filter"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </span>
        )}

        {/* Clear All Button */}
        <button type="button" className="btn-clear-all-chips" onClick={onClearAll}>
          <i className="fa-solid fa-rotate-left" />
          <span>Clear All</span>
        </button>
      </div>
    </div>
  );
};

