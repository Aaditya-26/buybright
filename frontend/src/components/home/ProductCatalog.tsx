/**
 * BuyBright Product Catalog Component.
 * Displays dental supplies with responsive left/right navigation arrows,
 * smooth horizontal scrolling, touch support, and active scroll indicators.
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { ProductCard } from '../common/ProductCard';
import { DiwaliDiyaIcon } from './HeroSlider';

interface ProductCatalogProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  highlightText?: string;
  subtitle?: string;
  viewAllLink?: string;
  viewAllText?: string;
  products: Product[];
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  id = 'products',
  eyebrow = 'TRENDING ON BUYBRIGHT',
  title = 'Top Selling Marketplace Deals',
  highlightText,
  subtitle,
  viewAllLink = '/shop',
  viewAllText = 'Explore All Deals',
  products,
}) => {
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

    // Calculate dynamic step based on visible container width
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
    <section className="section product-section" id={id}>
      {/* Section Header */}
      <div className="section-head">
        <div className="section-head-left">
          <div className="section-eyebrow">{eyebrow}</div>
          <div className="section-title-festive-row">
            <span className="festive-title-diya left" aria-hidden="true">
              <DiwaliDiyaIcon width={30} height={30} idSuffix={`prod-left-${id}`} />
            </span>
            <h2 className="section-title">
              {title} {highlightText && <span className="highlight">{highlightText}</span>}
            </h2>
            <span className="festive-title-diya right" aria-hidden="true">
              <DiwaliDiyaIcon width={30} height={30} idSuffix={`prod-right-${id}`} />
            </span>
          </div>
          {subtitle && <p className="section-sub">{subtitle}</p>}
        </div>

        <div className="product-head-right">
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

          <Link to={viewAllLink} className="btn-cat-view-all">
            <span>{viewAllText}</span>
            <div className="btn-icon-circle" style={{ background: 'var(--color-primary, #008080)' }}>
              <i className="fa-solid fa-arrow-right" />
            </div>
          </Link>
        </div>
      </div>

      {/* Product Slider Container with Floating Left/Right Arrows */}
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
          id={`${id}Track`}
          ref={scrollContainerRef}
        >
          {products.map((product) => (
            <div key={product.id} className="product-slider-item">
              <ProductCard product={product} />
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
