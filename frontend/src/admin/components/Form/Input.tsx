/**
 * Form Input Component.
 * Accessible form field with label, error display, and clean styling.
 */

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  id,
  className = '',
  style,
  ...rest
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={{ marginBottom: '14px', width: '100%' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            display: 'block',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#334155',
            marginBottom: '5px',
          }}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        style={{
          width: '100%',
          padding: '9px 12px',
          borderRadius: '8px',
          border: `1.5px solid ${error ? '#ef4444' : '#cbd5e1'}`,
          fontSize: '0.88rem',
          color: '#0f172a',
          outline: 'none',
          boxSizing: 'border-box',
          background: '#ffffff',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          ...style,
        }}
        {...rest}
      />
      {error && (
        <span style={{ display: 'block', fontSize: '0.75rem', color: '#ef4444', marginTop: '4px', fontWeight: 600 }}>
          {error}
        </span>
      )}
      {!error && helperText && (
        <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
          {helperText}
        </span>
      )}
    </div>
  );
};

export default Input;
