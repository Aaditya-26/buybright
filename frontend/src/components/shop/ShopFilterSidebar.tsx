/**
 * BuyBright Desktop Shop Filter Sidebar Component.
 * Comprehensive faceted filter controls with clean UX, search-in-brands,
 * size dropdown, milliliters dropdown, availability (In Stock / Out of Stock),
 * price ranges, discount tiers, rating filters, and toggle switches.
 */

import React, { useState, useMemo } from 'react';
import type { Category, AvailabilityOption } from '../../types';

export const POPULAR_MARKETPLACE_BRANDS = [
  'Apple',
  'Sony',
  'Samsung',
  'Dell',
  'boAt',
  'Nike',
  'Adidas',
  "Levi's",
  'Philips',
  'Dyson',
  'Instant Pot',
  "L'Oréal Paris",
  'Nivea',
  'Decathlon',
  'Penguin Books',
  'HarperCollins',
];

export const POPULAR_DENTAL_BRANDS = POPULAR_MARKETPLACE_BRANDS;

export const AVAILABLE_SIZES = [
  'All Sizes',
  'Universal',
  'Small (S)',
  'Medium (M)',
  'Large (L)',
  'Extra Large (XL)',
  'UK 7',
  'UK 8',
  'UK 9',
  'UK 10',
  '128 GB',
  '256 GB',
  '512 GB',
  '1 TB',
];

export const AVAILABLE_MILLILITERS = [
  'All Volumes',
  '3 ml',
  '5 ml',
  '10 ml',
  '25 ml',
  '50 ml',
  '100 ml',
  '250 ml',
  '500 ml',
  '1000 ml (1L)',
];

interface ShopFilterSidebarProps {
  categories: Category[];
  selectedCategories: string[];
  selectedBrands: string[];
  selectedSize: string;
  selectedVolume: string;
  availability: AvailabilityOption;
  priceRange: [number, number];
  minRating: number;
  minDiscount: number;
  onToggleCategory: (slug: string) => void;
  onToggleBrand: (brand: string) => void;
  onChangeSize: (size: string) => void;
  onChangeVolume: (volume: string) => void;
  onChangeAvailability: (avail: AvailabilityOption) => void;
  onChangePriceRange: (range: [number, number]) => void;
  onChangeMinRating: (rating: number) => void;
  onChangeMinDiscount: (discount: number) => void;
  onResetFilters: () => void;
}

export const ShopFilterSidebar: React.FC<ShopFilterSidebarProps> = ({
  categories,
  selectedCategories,
  selectedBrands,
  selectedSize,
  selectedVolume,
  availability,
  priceRange,
  minRating,
  minDiscount,
  onToggleCategory,
  onToggleBrand,
  onChangeSize,
  onChangeVolume,
  onChangeAvailability,
  onChangePriceRange,
  onChangeMinRating,
  onChangeMinDiscount,
  onResetFilters,
}) => {
  const [brandSearch, setBrandSearch] = useState('');

  // Filtered brands based on local search input
  const visibleBrands = useMemo(() => {
    if (!brandSearch.trim()) return POPULAR_DENTAL_BRANDS;
    return POPULAR_DENTAL_BRANDS.filter((b) =>
      b.toLowerCase().includes(brandSearch.toLowerCase().trim())
    );
  }, [brandSearch]);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value) || 0;
    onChangePriceRange([Math.max(0, Math.min(val, priceRange[1] - 100)), priceRange[1]]);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value) || 100000;
    onChangePriceRange([priceRange[0], Math.max(priceRange[0] + 100, Math.min(val, 100000))]);
  };

  return (
    <aside className="shop-filter-sidebar">
      <div className="filter-sidebar-header">
        <div className="sidebar-title-group">
          <i className="fa-solid fa-sliders" />
          <h3 className="sidebar-title">Filters</h3>
        </div>
        <button
          type="button"
          className="btn-reset-sidebar-filters"
          onClick={onResetFilters}
          title="Reset all filters"
        >
          Reset All
        </button>
      </div>

      {/* 1. Category Facet */}
      <div className="filter-section" id="filter-section-categories">
        <h4 className="filter-section-title">
          <span>Category</span>
        </h4>
        <div className="filter-categories-list">
          {categories.map((cat) => {
            const isChecked = selectedCategories.includes(cat.slug);
            return (
              <label key={cat.id} className={`filter-checkbox-row ${isChecked ? 'active' : ''}`}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleCategory(cat.slug)}
                />
                <span className="checkbox-custom" />
                <span className="checkbox-label-text">{cat.title}</span>
                <span className="checkbox-count-badge">{cat.count.split(' ')[0]}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 2. Size Dropdown Facet */}
      <div className="filter-section" id="filter-section-size">
        <h4 className="filter-section-title">
          <span>Size / Dimensions</span>
          {selectedSize && selectedSize !== 'All Sizes' && (
            <span className="section-active-badge">Active</span>
          )}
        </h4>
        <div className="sidebar-dropdown-wrapper">
          <select
            value={selectedSize || 'All Sizes'}
            onChange={(e) => onChangeSize(e.target.value)}
            className="sidebar-custom-select"
            aria-label="Filter by Size"
          >
            {AVAILABLE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <i className="fa-solid fa-chevron-down dropdown-arrow-icon" />
        </div>
      </div>

      {/* 3. Milliliters (Volume) Dropdown Facet */}
      <div className="filter-section" id="filter-section-volume">
        <h4 className="filter-section-title">
          <span>Milliliters (Volume in ml)</span>
          {selectedVolume && selectedVolume !== 'All Volumes' && (
            <span className="section-active-badge">Active</span>
          )}
        </h4>
        <div className="sidebar-dropdown-wrapper">
          <select
            value={selectedVolume || 'All Volumes'}
            onChange={(e) => onChangeVolume(e.target.value)}
            className="sidebar-custom-select"
            aria-label="Filter by Milliliters"
          >
            {AVAILABLE_MILLILITERS.map((ml) => (
              <option key={ml} value={ml}>
                {ml}
              </option>
            ))}
          </select>
          <i className="fa-solid fa-chevron-down dropdown-arrow-icon" />
        </div>
      </div>

      {/* 4. Availability (In Stock / Out of Stock) */}
      <div className="filter-section" id="filter-section-availability">
        <h4 className="filter-section-title">
          <span>Availability &amp; Stock</span>
          {availability !== 'all' && (
            <span className="section-active-badge">
              {availability === 'in_stock' ? 'In Stock' : 'Out of Stock'}
            </span>
          )}
        </h4>
        <div className="availability-options-list">
          <label className={`availability-radio-row ${availability === 'all' ? 'active' : ''}`}>
            <input
              type="radio"
              name="sidebar_availability"
              checked={availability === 'all'}
              onChange={() => onChangeAvailability('all')}
            />
            <span className="radio-custom" />
            <span className="availability-label-text">
              <strong>All Products</strong>
              <small>Show complete catalog</small>
            </span>
          </label>

          <label className={`availability-radio-row ${availability === 'in_stock' ? 'active' : ''}`}>
            <input
              type="radio"
              name="sidebar_availability"
              checked={availability === 'in_stock'}
              onChange={() => onChangeAvailability('in_stock')}
            />
            <span className="radio-custom in-stock-radio" />
            <span className="availability-label-text">
              <strong className="text-success-accent">
                <i className="fa-solid fa-circle-check me-1" /> In Stock
              </strong>
              <small>Ready for express 24-48h dispatch</small>
            </span>
          </label>

          <label className={`availability-radio-row ${availability === 'out_of_stock' ? 'active' : ''}`}>
            <input
              type="radio"
              name="sidebar_availability"
              checked={availability === 'out_of_stock'}
              onChange={() => onChangeAvailability('out_of_stock')}
            />
            <span className="radio-custom out-of-stock-radio" />
            <span className="availability-label-text">
              <strong className="text-warning-accent">
                <i className="fa-solid fa-clock-rotate-left me-1" /> Out of Stock
              </strong>
              <small>Pre-order or upcoming restock</small>
            </span>
          </label>
        </div>
      </div>

      {/* 5. Brand Facet with Search */}
      <div className="filter-section" id="filter-section-brands">
        <h4 className="filter-section-title">
          <span>Authorized Brands</span>
          {selectedBrands.length > 0 && (
            <span className="section-active-badge">{selectedBrands.length}</span>
          )}
        </h4>

        <div className="brand-search-input-wrap">
          <i className="fa-solid fa-magnifying-glass" />
          <input
            type="text"
            placeholder="Search brands..."
            value={brandSearch}
            onChange={(e) => setBrandSearch(e.target.value)}
          />
          {brandSearch && (
            <button
              type="button"
              className="btn-clear-brand-search"
              onClick={() => setBrandSearch('')}
            >
              <i className="fa-solid fa-xmark" />
            </button>
          )}
        </div>

        <div className="filter-brands-list scrollable-facet">
          {visibleBrands.length === 0 ? (
            <div className="facet-empty-msg">No matching brand found</div>
          ) : (
            visibleBrands.map((brand) => {
              const isChecked = selectedBrands.includes(brand);
              return (
                <label key={brand} className={`filter-checkbox-row ${isChecked ? 'active' : ''}`}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleBrand(brand)}
                  />
                  <span className="checkbox-custom" />
                  <span className="checkbox-label-text">{brand}</span>
                </label>
              );
            })
          )}
        </div>
      </div>

      {/* 6. Price Range Slider & Inputs */}
      <div className="filter-section" id="filter-section-price">
        <h4 className="filter-section-title">
          <span>Price Range (₹)</span>
        </h4>

        <div className="price-inputs-row">
          <div className="price-input-box">
            <span className="currency-prefix">₹</span>
            <input
              type="number"
              min={0}
              max={priceRange[1] - 100}
              step={100}
              value={priceRange[0]}
              onChange={handleMinPriceChange}
              aria-label="Minimum price"
            />
          </div>
          <span className="price-separator">to</span>
          <div className="price-input-box">
            <span className="currency-prefix">₹</span>
            <input
              type="number"
              min={priceRange[0] + 100}
              max={100000}
              step={500}
              value={priceRange[1]}
              onChange={handleMaxPriceChange}
              aria-label="Maximum price"
            />
          </div>
        </div>

        <div className="price-slider-wrap">
          <input
            type="range"
            min={0}
            max={100000}
            step={500}
            value={priceRange[1]}
            onChange={(e) => onChangePriceRange([priceRange[0], Number(e.target.value)])}
            className="dual-range-slider"
          />
          <div className="price-range-labels">
            <span>₹0</span>
            <span>₹50k</span>
            <span>₹100k+</span>
          </div>
        </div>
      </div>

      {/* 7. Minimum Discount Selection */}
      <div className="filter-section" id="filter-section-discount">
        <h4 className="filter-section-title">
          <span>Minimum Discount</span>
        </h4>
        <div className="discount-pills-grid">
          {[0, 10, 20, 30, 50].map((d) => (
            <button
              key={d}
              type="button"
              className={`discount-pill-btn ${minDiscount === d ? 'active' : ''}`}
              onClick={() => onChangeMinDiscount(minDiscount === d ? 0 : d)}
            >
              {d === 0 ? 'All' : `${d}%+ Off`}
            </button>
          ))}
        </div>
      </div>

      {/* 8. Minimum Customer Rating */}
      <div className="filter-section" id="filter-section-rating">
        <h4 className="filter-section-title">
          <span>Customer Ratings</span>
        </h4>
        <div className="rating-options-list">
          {[
            { val: 4.5, label: '4.5 & Above' },
            { val: 4.0, label: '4.0 & Above' },
            { val: 0, label: 'Any Rating' },
          ].map((item) => (
            <label
              key={item.val}
              className={`rating-radio-row ${minRating === item.val ? 'active' : ''}`}
            >
              <input
                type="radio"
                name="rating_filter"
                checked={minRating === item.val}
                onChange={() => onChangeMinRating(item.val)}
              />
              <span className="radio-custom" />
              <div className="rating-label-content">
                {item.val > 0 ? (
                  <>
                    <div className="rating-stars-preview">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <i
                          key={idx}
                          className={`fa-solid fa-star ${
                            idx < Math.floor(item.val)
                              ? 'star-filled'
                              : idx < item.val
                              ? 'star-half'
                              : 'star-empty'
                          }`}
                        />
                      ))}
                    </div>
                    <span>{item.label}</span>
                  </>
                ) : (
                  <span>{item.label}</span>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

    </aside>
  );
};

