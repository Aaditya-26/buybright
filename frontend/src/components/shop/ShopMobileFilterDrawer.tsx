/**
 * BuyBright Universal Shop Filter Drawer.
 * Off-canvas slide-in modal drawer displaying the filter options smoothly across all viewports (desktop, tablet, mobile).
 * Features smooth left-slide animation, backdrop blur, ESC key closing, and targeted section auto-scrolling.
 */

import React, { useEffect } from 'react';
import type { Category, AvailabilityOption } from '../../types';
import { ShopFilterSidebar } from './ShopFilterSidebar';

interface ShopMobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  selectedCategories: string[];
  selectedBrands: string[];
  selectedSize: string;
  selectedVolume: string;
  availability: AvailabilityOption;
  priceRange: [number, number];
  minRating: number;
  minDiscount: number;
  onlyBestsellers?: boolean;
  onToggleCategory: (slug: string) => void;
  onToggleBrand: (brand: string) => void;
  onChangeSize: (size: string) => void;
  onChangeVolume: (volume: string) => void;
  onChangeAvailability: (avail: AvailabilityOption) => void;
  onChangePriceRange: (range: [number, number]) => void;
  onChangeMinRating: (rating: number) => void;
  onChangeMinDiscount: (discount: number) => void;
  onToggleBestsellers?: () => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
  targetSectionId?: string;
}

export const ShopMobileFilterDrawer: React.FC<ShopMobileFilterDrawerProps> = ({
  isOpen,
  onClose,
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
  totalFilteredCount,
  targetSectionId,
}) => {
  // Close drawer on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Scroll to target section if provided
  useEffect(() => {
    if (isOpen && targetSectionId) {
      const timer = setTimeout(() => {
        const el = document.getElementById(targetSectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, targetSectionId]);

  if (!isOpen) return null;

  return (
    <div className="shop-mobile-drawer-overlay">
      <div className="shop-mobile-drawer-backdrop" onClick={onClose} aria-hidden="true" />

      <div className="shop-mobile-drawer-content" role="dialog" aria-modal="true" aria-label="Filter Dental Supplies">
        <div className="drawer-header">
          <div className="drawer-title-group">
            <div className="drawer-icon-box">
              <i className="fa-solid fa-sliders" />
            </div>
            <div>
              <h3 className="drawer-main-heading">Filter Supplies</h3>
              <span className="drawer-subtitle">
                {totalFilteredCount} products found
              </span>
            </div>
          </div>
          <button
            type="button"
            className="btn-close-drawer"
            onClick={onClose}
            aria-label="Close filters"
            title="Close filter drawer (Esc)"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="drawer-body">
          <ShopFilterSidebar
            categories={categories}
            selectedCategories={selectedCategories}
            selectedBrands={selectedBrands}
            selectedSize={selectedSize}
            selectedVolume={selectedVolume}
            availability={availability}
            priceRange={priceRange}
            minRating={minRating}
            minDiscount={minDiscount}
            onToggleCategory={onToggleCategory}
            onToggleBrand={onToggleBrand}
            onChangeSize={onChangeSize}
            onChangeVolume={onChangeVolume}
            onChangeAvailability={onChangeAvailability}
            onChangePriceRange={onChangePriceRange}
            onChangeMinRating={onChangeMinRating}
            onChangeMinDiscount={onChangeMinDiscount}
            onResetFilters={onResetFilters}
          />
        </div>

        <div className="drawer-footer">
          <button type="button" className="btn-drawer-reset" onClick={onResetFilters}>
            <i className="fa-solid fa-rotate-left" />
            <span>Reset All</span>
          </button>
          <button type="button" className="btn-drawer-apply" onClick={onClose}>
            <span>View {totalFilteredCount} Supplies</span>
            <i className="fa-solid fa-arrow-right" />
          </button>
        </div>
      </div>
    </div>
  );
};
