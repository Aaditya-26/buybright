/**
 * BuyBright "Shop By Marketplace Categories" Component.
 * Features:
 * - 12 Dental specialty categories
 * - Centered title, eyebrow tag, and subtitle
 * - High-definition photography thumbnails with floating icon badges
 * - Smooth horizontal scroll track with working Left & Right arrow controls
 * - Direct category selection and product jump
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import type { Category } from '../../types';
import { DiwaliDiyaIcon } from './HeroSlider';

interface CategoryGridProps {
  categories?: Category[];
  onSelectCategory?: (slug: string) => void;
}

interface CategoryItem {
  id: string;
  title: string;
  slug: string;
  itemCount: string;
  image: string;
  icon: string;
}

const CATEGORY_ITEMS: CategoryItem[] = [
  {
    id: 'cat-electronics',
    title: 'Electronics & Gadgets',
    slug: 'electronics',
    itemCount: '1,250+ Products',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=80',
    icon: 'fa-solid fa-laptop',
  },
  {
    id: 'cat-fashion',
    title: 'Fashion & Apparel',
    slug: 'fashion',
    itemCount: '3,400+ Products',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80',
    icon: 'fa-solid fa-shirt',
  },
  {
    id: 'cat-home-kitchen',
    title: 'Home & Kitchen',
    slug: 'home-kitchen',
    itemCount: '2,100+ Products',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
    icon: 'fa-solid fa-kitchen-set',
  },
  {
    id: 'cat-beauty',
    title: 'Beauty & Personal Care',
    slug: 'beauty',
    itemCount: '1,580+ Products',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80',
    icon: 'fa-solid fa-wand-magic-sparkles',
  },
  {
    id: 'cat-sports',
    title: 'Sports & Fitness',
    slug: 'sports',
    itemCount: '890+ Products',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    icon: 'fa-solid fa-dumbbell',
  },
  {
    id: 'cat-books',
    title: 'Books & Stationery',
    slug: 'books',
    itemCount: '1,450+ Products',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
    icon: 'fa-solid fa-book-open',
  },
];

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
  }, [checkScrollPosition]);

  const handleCategoryClick = (slug: string) => {
    if (onSelectCategory) {
      onSelectCategory(slug);
    }
    const productSec = document.getElementById('products');
    if (productSec) {
      productSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      const step = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollBy({ left: -step, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      const step = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollBy({ left: step, behavior: 'smooth' });
    }
  };

  return (
    <section className="pd-shop-by-categories-section" id="categories">
      <div className="pd-categories-card-surface">
        {/* Centered Section Header with Festive Diyas & Ornaments */}
        <div className="pd-categories-header text-center">
          <div className="header-text-col">
            <span className="cat-eyebrow-tag">
              <span className="festive-sparkle-star">✨</span>
              POPULAR CATEGORIES
              <span className="festive-sparkle-star">✨</span>
            </span>
            <div className="categories-title-festive-row">
              <span className="festive-title-diya left" aria-hidden="true">
                <DiwaliDiyaIcon width={32} height={32} idSuffix="cat-title-left" />
              </span>
              <h2 className="categories-main-title">Shop By Marketplace Categories</h2>
              <span className="festive-title-diya right" aria-hidden="true">
                <DiwaliDiyaIcon width={32} height={32} idSuffix="cat-title-right" />
              </span>
            </div>
            <p className="categories-sub-title">Explore verified products and essential supplies across all specialties</p>
          </div>
        </div>

        {/* Category Items Carousel Row with Left & Right Arrows */}
        <div className="pd-categories-carousel-wrap">
          <button
            type="button"
            className={`btn-cat-carousel-arrow prev ${!canScrollLeft ? 'is-disabled' : ''}`}
            onClick={handleScrollLeft}
            disabled={!canScrollLeft}
            aria-label="Scroll categories left"
            title="Previous Categories"
          >
            <i className="fa-solid fa-chevron-left" />
          </button>

          <div className="pd-categories-cards-track" ref={scrollContainerRef}>
            {CATEGORY_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className="pd-category-modern-card"
                onClick={() => handleCategoryClick(item.slug)}
                aria-label={`Shop ${item.title}`}
              >
                {/* Photo Thumbnail with Overlay Icon */}
                <div className="cat-thumb-box">
                  <img src={item.image} alt={item.title} loading="lazy" />
                  <div className="cat-floating-icon">
                    <i className={item.icon} />
                  </div>
                </div>

                {/* Category Body */}
                <div className="cat-card-body">
                  <h3 className="cat-card-title">{item.title}</h3>
                  <span className="cat-card-count">{item.itemCount}</span>
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            className={`btn-cat-carousel-arrow next ${!canScrollRight ? 'is-disabled' : ''}`}
            onClick={handleScrollRight}
            disabled={!canScrollRight}
            aria-label="Scroll categories right"
            title="Next Categories"
          >
            <i className="fa-solid fa-chevron-right" />
          </button>
        </div>
      </div>
    </section>
  );
};
