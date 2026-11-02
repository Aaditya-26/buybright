/**
 * BuyBright Shop Toolbar Component.
 * Features:
 * - Live Instant Search Bar on Top of Products
 * - Product count indicator
 * - Mobile filter toggle trigger
 * - Sort-by select dropdown
 * - View mode toggle (Grid vs. List layout)
 * - Items-per-page selector
 */

import React from 'react';
import type { SortOption, ViewMode } from '../../types';

interface ShopToolbarProps {
  totalCount: number;
  startIndex: number;
  endIndex: number;
  sortBy: SortOption;
  onChangeSortBy: (sort: SortOption) => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  itemsPerPage: number;
  onChangeItemsPerPage: (num: number) => void;
  onOpenMobileFilters: () => void;
  activeFilterCount: number;
  searchQuery?: string;
  onChangeSearchQuery?: (query: string) => void;
}

export const ShopToolbar: React.FC<ShopToolbarProps> = ({
  totalCount,
  startIndex,
  endIndex,
  sortBy,
  onChangeSortBy,
  viewMode,
  onChangeViewMode,
  itemsPerPage,
  onChangeItemsPerPage,
  onOpenMobileFilters,
  activeFilterCount,
}) => {
  return (
    <div className="shop-top-controls-wrapper">
      {/* Toolbar Sort, View Mode & Stats Bar */}
      <div className="shop-toolbar-bar">
        {/* Left: Product Results Stats */}
        <div className="toolbar-left-stats">
          {totalCount > 0 ? (
            <p className="toolbar-count-text">
              Showing <span className="highlight-count">{startIndex + 1}–{Math.min(endIndex, totalCount)}</span> of{' '}
              <span className="highlight-count">{totalCount}</span> dental supplies
            </p>
          ) : (
            <p className="toolbar-count-text">No matching supplies found</p>
          )}
        </div>

        {/* Right: Controls & Actions */}
        <div className="toolbar-right-actions">
          {/* Mobile Filter Trigger Button */}
          <button
            type="button"
            className="btn-mobile-filter-trigger"
            onClick={onOpenMobileFilters}
            aria-label="Open filter menu"
          >
            <i className="fa-solid fa-sliders" />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="filter-badge-count">{activeFilterCount}</span>
            )}
          </button>

          {/* Sort By Dropdown */}
          <div className="toolbar-control-group">
            <label htmlFor="shop-sort-select" className="control-label">
              Sort by:
            </label>
            <div className="select-custom-wrapper">
              <select
                id="shop-sort-select"
                value={sortBy}
                onChange={(e) => onChangeSortBy(e.target.value as SortOption)}
                className="toolbar-select"
              >
                <option value="featured">Featured / Best Match</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Highest Rated</option>
                <option value="discount_desc">Biggest Discount</option>
                <option value="newest">Newest Arrivals</option>
              </select>
              <i className="fa-solid fa-chevron-down select-arrow-icon" />
            </div>
          </div>

          {/* Items Per Page */}
          <div className="toolbar-control-group per-page-group">
            <label htmlFor="shop-per-page-select" className="control-label">
              Show:
            </label>
            <div className="select-custom-wrapper">
              <select
                id="shop-per-page-select"
                value={itemsPerPage}
                onChange={(e) => onChangeItemsPerPage(Number(e.target.value))}
                className="toolbar-select small"
              >
                <option value={18}>18</option>
                <option value={24}>24</option>
                <option value={36}>36</option>
                <option value={48}>48</option>
              </select>
              <i className="fa-solid fa-chevron-down select-arrow-icon" />
            </div>
          </div>

          {/* Grid vs List View Mode Switcher */}
          <div className="view-mode-toggle-group">
            <button
              type="button"
              className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => onChangeViewMode('grid')}
              title="Grid View"
              aria-label="Switch to grid view"
            >
              <i className="fa-solid fa-table-cells-large" />
            </button>
            <button
              type="button"
              className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => onChangeViewMode('list')}
              title="List View"
              aria-label="Switch to list view"
            >
              <i className="fa-solid fa-list-ul" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

