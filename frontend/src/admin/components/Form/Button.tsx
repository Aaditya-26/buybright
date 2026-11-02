/**
 * Form Button Component.
 * Styled button supporting primary, outline, danger variants with loading states.
 */

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  style,
  disabled,
  ...rest
}) => {
  let bg = '#0d9488';
  let color = '#ffffff';
  let border = 'none';

  if (variant === 'outline') {
    bg = '#ffffff';
    color = '#334155';
    border = '1px solid #cbd5e1';
  } else if (variant === 'danger') {
    bg = '#ef4444';
    color = '#ffffff';
    border = 'none';
  } else if (variant === 'success') {
    bg = '#16a34a';
    color = '#ffffff';
    border = 'none';
  }

  const padding = size === 'sm' ? '6px 12px' : size === 'lg' ? '12px 24px' : '9px 18px';
  const fontSize = size === 'sm' ? '0.78rem' : size === 'lg' ? '0.95rem' : '0.85rem';

  return (
    <button
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding,
        fontSize,
        fontWeight: 700,
        borderRadius: '8px',
        background: bg,
        color,
        border,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.7 : 1,
        transition: 'all 0.2s',
        ...style,
      }}
      {...rest}
    >
      {loading ? (
        <i className="fa-solid fa-spinner fa-spin" />
      ) : icon ? (
        <i className={icon} />
      ) : null}
      <span>{children}</span>
    </button>
  );
};

export default Button;
