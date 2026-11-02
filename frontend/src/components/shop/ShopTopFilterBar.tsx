/**
 * BuyBright Shop Top Filter Bar Component.
 * Features:
 * - Integrated Live Search Input Box right in the filter bar
 * - "FILTERS BY:" header label with quick-access category buttons
 * - Buttons for: All Filters, Brands, Price Range, Availability, Discount, Rating, Categories
 * - Active indicator badges on each filter button
 * - Clean English text, type-safe props, and responsive layout
 */

import React from 'react';
import { ShopPriceRangeDropdown } from './ShopPriceRangeDropdown';

interface ShopTopFilterBarProps {
  onOpenDrawer: (sectionId?: string) => void;
  activeFilterCount: number;
  selectedBrandsCount: number;
  isPriceFiltered: boolean;
  priceRange?: [number, number];
  onChangePriceRange?: (range: [number, number]) => void;
  isAvailabilityFiltered: boolean;
  isDiscountFiltered: boolean;
  isRatingFiltered: boolean;
  selectedCategoriesCount: number;
  onlyBestsellers: boolean;
  searchQuery: string;
  onChangeSearchQuery: (query: string) => void;
  onResetFilters: () => void;
}

export const ShopTopFilterBar: React.FC<ShopTopFilterBarProps> = ({
  onOpenDrawer,
  activeFilterCount,
  selectedBrandsCount,
  isPriceFiltered: _isPriceFiltered,
  priceRange = [0, 100000],
  onChangePriceRange,
  isAvailabilityFiltered,
  isDiscountFiltered,
  isRatingFiltered,
  selectedCategoriesCount,
  onlyBestsellers,
  searchQuery,
  onChangeSearchQuery,
  onResetFilters,
}) => {
  return (
    <div className="shop-top-filter-bar-container">
      <div className="top-filter-bar-inner">
        {/* 1. Left: Main Label */}
        <div className="top-filter-label-group">
          <div className="filter-badge-icon">
            <i className="fa-solid fa-sliders" />
          </div>
          <span className="filter-main-title">FILTERS BY:</span>
        </div>

        {/* 2. Integrated Instant Live Search Box */}
        <div className="top-filter-search-inline">
          <i className="fa-solid fa-magnifying-glass search-inline-icon" />
          <input
            type="text"
            placeholder="Search supplies, brands, files..."
            value={searchQuery}
            onChange={(e) => onChangeSearchQuery(e.target.value)}
            className="search-inline-input"
            aria-label="Search dental products"
          />
          {searchQuery && (
            <button
              type="button"
              className="btn-clear-inline-search"
              onClick={() => onChangeSearchQuery('')}
              title="Clear search"
              aria-label="Clear search"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          )}
        </div>

        {/* 3. Center / Right: Filter Trigger Buttons */}
        <div className="top-filter-buttons-scroll">
          {/* All Filters (Master Button) */}
          <button
            type="button"
            className={`top-filter-btn primary-filter-btn ${activeFilterCount > 0 ? 'is-active' : ''}`}
            onClick={() => onOpenDrawer()}
            title="Open all filters drawer"
          >
            <i className="fa-solid fa-filter" />
            <span>All Filters</span>
            {activeFilterCount > 0 && (
              <span className="btn-counter-badge">{activeFilterCount}</span>
            )}
          </button>

          {/* Brands */}
          <button
            type="button"
            className={`top-filter-btn ${selectedBrandsCount > 0 ? 'is-active' : ''}`}
            onClick={() => onOpenDrawer('filter-section-brands')}
            title="Filter by Brands"
          >
            <i className="fa-solid fa-tag" />
            <span>Brands</span>
            {selectedBrandsCount > 0 && (
              <span className="btn-counter-badge">{selectedBrandsCount}</span>
            )}
          </button>

          {/* Price Range — inline checkbox dropdown */}
          <ShopPriceRangeDropdown
            priceRange={priceRange}
            onChangePriceRange={onChangePriceRange}
          />

          {/* Availability */}
          <button
            type="button"
            className={`top-filter-btn ${isAvailabilityFiltered ? 'is-active' : ''}`}
            onClick={() => onOpenDrawer('filter-section-availability')}
            title="Filter by Availability & Stock"
          >
            <i className="fa-solid fa-boxes-stacked" />
            <span>Availability</span>
            {isAvailabilityFiltered && (
              <span className="btn-active-dot" title="Stock filter applied" />
            )}
          </button>

          {/* Discount */}
          <button
            type="button"
            className={`top-filter-btn ${isDiscountFiltered ? 'is-active' : ''}`}
            onClick={() => onOpenDrawer('filter-section-discount')}
            title="Filter by Minimum Discount"
          >
            <i className="fa-solid fa-percent" />
            <span>Discount</span>
            {isDiscountFiltered && (
              <span className="btn-active-dot" title="Discount filter applied" />
            )}
          </button>

          {/* Rating */}
          <button
            type="button"
            className={`top-filter-btn ${isRatingFiltered ? 'is-active' : ''}`}
            onClick={() => onOpenDrawer('filter-section-rating')}
            title="Filter by Customer Rating"
          >
            <i className="fa-solid fa-star" />
            <span>Rating</span>
            {isRatingFiltered && (
              <span className="btn-active-dot" title="Rating filter applied" />
            )}
          </button>

          {/* Categories */}
          <button
            type="button"
            className={`top-filter-btn ${selectedCategoriesCount > 0 ? 'is-active' : ''}`}
            onClick={() => onOpenDrawer('filter-section-categories')}
            title="Filter by Categories"
          >
            <i className="fa-solid fa-layer-group" />
            <span>Categories</span>
            {selectedCategoriesCount > 0 && (
              <span className="btn-counter-badge">{selectedCategoriesCount}</span>
            )}
          </button>

          {/* Bestsellers Indicator */}
          {onlyBestsellers && (
            <button
              type="button"
              className="top-filter-btn is-active bestseller-btn"
              onClick={() => onOpenDrawer()}
              title="Bestsellers filter active"
            >
              <i className="fa-solid fa-fire" />
              <span>Bestsellers</span>
            </button>
          )}

          {/* Reset All Button */}
          {activeFilterCount > 0 && (
            <button
              type="button"
              className="top-filter-reset-btn"
              onClick={onResetFilters}
              title="Reset all active filters"
            >
              <i className="fa-solid fa-rotate-left" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
