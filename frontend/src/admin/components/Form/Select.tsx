/**
 * Form Select Component.
 * Dropdown selector with options mapping, label, and accessible controls.
 */

import React from 'react';
import type { SelectOption } from '../../types/common';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  id,
  style,
  ...rest
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={{ marginBottom: '14px', width: '100%' }}>
      {label && (
        <label
          htmlFor={selectId}
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
      <select
        id={selectId}
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
          cursor: 'pointer',
          ...style,
        }}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span style={{ display: 'block', fontSize: '0.75rem', color: '#ef4444', marginTop: '4px', fontWeight: 600 }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Select;
