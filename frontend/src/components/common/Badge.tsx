/**
 * BuyBright Reusable Badge Component.
 * Supports types: sale/discount, bestseller, spotlight, status, and custom variants.
 */

import React from 'react';

export type BadgeVariant = 'sale' | 'bestseller' | 'spotlight' | 'new' | 'info' | 'success';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'sale',
  children,
  className = '',
  style,
}) => {
  return (
    <span className={`product-badge ${variant} ${className}`} style={style}>
      {children}
    </span>
  );
};
