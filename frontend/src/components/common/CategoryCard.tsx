/**
 * BuyBright Reusable Category Card Component.
 * Displays specialty category imagery, count tag, dynamic accent colors, and interactive hover animation.
 */

import React from 'react';
import type { Category } from '../../types';

interface CategoryCardProps {
  category: Category;
  onSelect?: (slug: string) => void;
  className?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onSelect,
  className = '',
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onSelect) {
      onSelect(category.slug);
    }
    const productSec = document.getElementById('products');
    if (productSec) {
      productSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href={`#products-${category.slug}`}
      className={`cat-product-card ${className}`}
      style={{ '--cat-accent': category.accent_color } as React.CSSProperties}
      onClick={handleClick}
    >
      <div className="cat-img-box">
        <span className="cat-item-num">{category.item_num}</span>
        <img src={category.image} alt={category.title} loading="lazy" />
      </div>
      <div className="cat-body">
        <h3 className="cat-heading">{category.title}</h3>
        <span className="cat-count-badge">{category.count}</span>
        <div className="cat-explore-btn">
          <span>View Catalog</span>
          <i className="fa-solid fa-arrow-right" />
        </div>
      </div>
    </a>
  );
};
