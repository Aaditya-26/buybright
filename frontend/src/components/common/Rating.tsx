/**
 * BuyBright Reusable Star Rating Component.
 * Supports configurable ratings, review count display, and scalable SVG stars.
 */

import React from 'react';

interface RatingProps {
  rating?: number;
  reviewsCount?: number;
  maxStars?: number;
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  rating = 5,
  reviewsCount,
  maxStars = 5,
  className = '',
}) => {
  return (
    <div className={`product-rating ${className}`}>
      <span className="stars" aria-label={`Rating: ${rating} out of ${maxStars}`}>
        {[...Array(maxStars)].map((_, i) => (
          <svg
            key={i}
            viewBox="0 0 24 24"
            fill={i < Math.round(rating) ? 'var(--color-gold-yellow, #CE9A3E)' : '#DEDBD0'}
            stroke="none"
          >
            <path d="M12 2l2.9 6.6L22 9.3l-5 4.8 1.2 7-6.2-3.6-6.2 3.6 1.2-7-5-4.8 7.1-.7z" />
          </svg>
        ))}
      </span>
      {reviewsCount !== undefined && (
        <span className="rating-num">({reviewsCount})</span>
      )}
    </div>
  );
};
