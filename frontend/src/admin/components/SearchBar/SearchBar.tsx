/**
 * SearchBar Component.
 * Generic search input with clear trigger and icon for table and list filters.
 */

import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  width?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  width = '240px',
}) => {
  return (
    <div className="table-search-input" style={{ width }}>
      <i className="fa-solid fa-magnifying-glass" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%' }}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: 0,
            fontSize: '0.8rem',
          }}
          title="Clear search"
        >
          <i className="fa-solid fa-xmark" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
