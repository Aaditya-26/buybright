/**
 * BuyBright Superendo Brand Spotlight Component.
 * Dedicated brand section showcasing specialized endodontic equipment & supplies.
 * Features responsive left/right navigation arrows, smooth track scrolling, and brand-specific accenting.
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { ProductCard } from '../common/ProductCard';
import { DiwaliDiyaIcon } from './HeroSlider';

interface SuperendoBrandProps {
  products: Product[];
}

export const SuperendoBrand: React.FC<SuperendoBrandProps> = ({ products }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Update navigation button states based on current scroll position
  const checkScrollPosition = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    checkScrollPosition();
    el.addEventListener('scroll', checkScrollPosition, { passive: true });
    window.addEventListener('resize', checkScrollPosition);

    return () => {
      el.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [checkScrollPosition, products]);

  // Smooth scroll handler
  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const scrollAmount = Math.max(el.clientWidth * 0.75, 280);
    const targetScroll = direction === 'left'
      ? el.scrollLeft - scrollAmount
      : el.scrollLeft + scrollAmount;

    el.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  };

  return (
    <section className="section brand-spotlight-section" id="superendo">
      {/* Header */}
      <div className="category-header-wrap">
        <div className="category-header-left">
          <div
            className="cat-eyebrow-badge"
            style={{
              background: 'rgba(207, 64, 50, 0.1)',
              borderColor: 'rgba(207, 64, 50, 0.25)',
              color: 'var(--color-coral-red)',
            }}
          >
            <i className="fa-solid fa-certificate" />
            <span>MARKETPLACE SPOTLIGHT • TOP BRANDS</span>
          </div>
          <div className="section-title-festive-row">
            <span className="festive-title-diya left" aria-hidden="true">
              <DiwaliDiyaIcon width={30} height={30} idSuffix="superendo-title-left" />
            </span>
            <h2 className="cat-main-title">
              Featured Brands & <span className="highlight">Top Sellers</span>
            </h2>
            <span className="festive-title-diya right" aria-hidden="true">
              <DiwaliDiyaIcon width={30} height={30} idSuffix="superendo-title-right" />
            </span>
          </div>
        </div>

        <div className="category-header-right">
          {/* Header Navigation Controls */}
          <div className="product-nav-controls">
            <button
              type="button"
              className={`product-nav-btn btn-prev ${!canScrollLeft ? 'is-disabled' : ''}`}
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              aria-label="Scroll products left"
              title="Previous Products"
            >
              <i className="fa-solid fa-chevron-left" />
            </button>
            <button
              type="button"
              className={`product-nav-btn btn-next ${!canScrollRight ? 'is-disabled' : ''}`}
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              aria-label="Scroll products right"
              title="Next Products"
            >
              <i className="fa-solid fa-chevron-right" />
            </button>
          </div>

          <Link to="/shop" className="btn-cat-view-all brand-superendo">
            <span>Explore All Brands</span>
            <div className="btn-icon-circle" style={{ background: 'var(--color-coral-red)' }}>
              <i className="fa-solid fa-arrow-right" />
            </div>
          </Link>
        </div>
      </div>

      {/* Superendo Slider Container with Floating Left/Right Arrows */}
      <div className="product-slider-wrapper">
        {/* Floating Left Arrow */}
        <button
          type="button"
          className={`product-floating-arrow floating-prev ${!canScrollLeft ? 'is-disabled' : ''}`}
          onClick={() => handleScroll('left')}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
        >
          <i className="fa-solid fa-chevron-left" />
        </button>

        {/* Scrollable Track */}
        <div
          className="product-slider-track"
          id="superendoTrack"
          ref={scrollContainerRef}
        >
          {products.map((product) => (
            <div key={product.id} className="product-slider-item">
              <ProductCard product={product} brandColor="var(--color-coral-red)" />
            </div>
          ))}
        </div>

        {/* Floating Right Arrow */}
        <button
          type="button"
          className={`product-floating-arrow floating-next ${!canScrollRight ? 'is-disabled' : ''}`}
          onClick={() => handleScroll('right')}
          disabled={!canScrollRight}
          aria-label="Scroll right"
        >
          <i className="fa-solid fa-chevron-right" />
        </button>
      </div>
    </section>
  );
};
