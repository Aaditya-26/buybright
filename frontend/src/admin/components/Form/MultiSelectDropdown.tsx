/**
 * MultiSelectDropdown — Reusable admin component.
 * Fully styled via external CSS: ./MultiSelectDropdown.scss (no inline styling).
 * Used across Flash Sales, Festival Campaigns, and Catalog management.
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import './MultiSelectDropdown.scss';

export interface MultiSelectOption {
  value: string;
  label: string;
  /** Optional secondary line rendered below label */
  subLabel?: string;
  /** Optional icon or emoji to display before label */
  icon?: string;
}

export interface MultiSelectDropdownProps {
  label?: string;
  placeholder?: string;
  options: MultiSelectOption[];
  value: string[];
  onChange: (selected: string[]) => void;
  error?: string;
  /** Max height of the scrollable list area in px. Default: 280 */
  listMaxHeight?: number;
  /** Show search input. Default: true */
  searchable?: boolean;
  /** Disable the control */
  disabled?: boolean;
  /** Single-select mode (behaves like standard dropdown with same styling) */
  singleSelect?: boolean;
  /** Custom trigger style override */
  triggerStyle?: React.CSSProperties;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  placeholder = 'Select options...',
  options,
  value,
  onChange,
  error,
  listMaxHeight = 280,
  searchable = true,
  disabled = false,
  singleSelect = false,
  triggerStyle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Auto-detect whether to open upwards (dropup) or downwards
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      if (spaceBelow < 320 && spaceAbove > 280) {
        setOpenUpwards(true);
      } else {
        setOpenUpwards(false);
      }
    }
  }, [isOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Auto-focus search when opened
  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 60);
    }
  }, [isOpen, searchable]);

  const filteredOptions = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        (o.subLabel && o.subLabel.toLowerCase().includes(q))
    );
  }, [options, search]);

  const allFilteredSelected =
    filteredOptions.length > 0 && filteredOptions.every((o) => value.includes(o.value));
  const someSelected = filteredOptions.some((o) => value.includes(o.value));

  const handleToggle = (optValue: string) => {
    if (singleSelect) {
      onChange([optValue]);
      setIsOpen(false);
      setSearch('');
      return;
    }
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  };

  const handleSelectAll = () => {
    if (allFilteredSelected) {
      const filteredVals = new Set(filteredOptions.map((o) => o.value));
      onChange(value.filter((v) => !filteredVals.has(v)));
    } else {
      const filteredVals = filteredOptions.map((o) => o.value);
      onChange(Array.from(new Set([...value, ...filteredVals])));
    }
  };

  // Build trigger button label
  const triggerLabel = (() => {
    if (value.length === 0) return '';
    if (singleSelect) {
      const opt = options.find((o) => o.value === value[0]);
      return opt ? opt.label : value[0] || '';
    }
    if (value.length === 1) {
      const opt = options.find((o) => o.value === value[0]);
      return opt ? opt.label : '1 selected';
    }
    return `${value.length} items selected`;
  })();

  return (
    <div
      ref={containerRef}
      className={`ms-dropdown-container ${isOpen ? 'is-open' : ''}`}
      style={{ zIndex: isOpen ? 1060 : 'auto', position: 'relative' }}
    >
      {/* Label */}
      {label && (
        <label className="ms-dropdown-label">
          {label}
          {value.length > 0 && !singleSelect && (
            <span className="ms-dropdown-count-badge">
              {value.length} selected
            </span>
          )}
        </label>
      )}

      {/* ── Trigger Button ── */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`ms-dropdown-trigger ${triggerLabel ? 'has-value' : ''} ${isOpen ? 'is-open' : ''} ${error ? 'has-error' : ''}`}
        style={triggerStyle}
      >
        {triggerLabel || placeholder}
        <span className={`ms-dropdown-chevron ${isOpen ? 'rotate-180' : ''}`}>
          <i className="fa-solid fa-chevron-down" />
        </span>
      </button>

      {/* ── Dropdown Panel ── */}
      {isOpen && (
        <div className={`ms-dropdown-panel ${openUpwards ? 'open-upwards' : ''}`}>
          {/* Search */}
          {searchable && (
            <div className="ms-dropdown-search-box">
              <div className="ms-dropdown-search-wrapper">
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="ms-dropdown-search-input"
                />
                <i className="fa-solid fa-magnifying-glass ms-dropdown-search-icon" />
              </div>
            </div>
          )}

          {/* Options list */}
          <div className="ms-dropdown-list" style={{ maxHeight: `${listMaxHeight}px` }}>
            {filteredOptions.length === 0 ? (
              <div className="ms-dropdown-empty">
                <i className="fa-solid fa-search-minus" />
                No results for "{search}"
              </div>
            ) : (
              <>
                {/* Select All row (only in multi-select mode) */}
                {!singleSelect && (
                  <div onClick={handleSelectAll} className="ms-dropdown-select-all">
                    <div
                      className={`ms-indicator-box ${
                        allFilteredSelected
                          ? 'is-checked'
                          : someSelected
                          ? 'is-indeterminate'
                          : ''
                      }`}
                    >
                      {allFilteredSelected && (
                        <i className="fa-solid fa-check ms-check-icon" />
                      )}
                      {!allFilteredSelected && someSelected && (
                        <div className="ms-indet-bar" />
                      )}
                    </div>
                    <span className="ms-select-all-label">Select All</span>
                    <span className="ms-select-all-count">
                      {filteredOptions.length} options
                    </span>
                  </div>
                )}

                {/* Individual option rows */}
                {filteredOptions.map((opt) => {
                  const isChecked = value.includes(opt.value);
                  return (
                    <div
                      key={opt.value}
                      onClick={() => handleToggle(opt.value)}
                      className={`ms-dropdown-option ${isChecked ? 'is-checked' : ''} ${opt.subLabel ? 'compact' : ''}`}
                    >
                      {/* Checkbox or Radio Indicator */}
                      <div
                        className={`ms-indicator-box ${singleSelect ? 'is-radio' : ''} ${
                          isChecked ? 'is-checked' : ''
                        }`}
                      >
                        {isChecked &&
                          (singleSelect ? (
                            <div className="ms-radio-dot" />
                          ) : (
                            <i className="fa-solid fa-check ms-check-icon" />
                          ))}
                      </div>

                      {/* Optional Icon */}
                      {opt.icon && (
                        <span className="ms-option-icon">{opt.icon}</span>
                      )}

                      {/* Label + sub-label */}
                      <div className="ms-option-content">
                        <div className={`ms-option-label ${isChecked ? 'is-checked' : ''}`}>
                          {opt.label}
                        </div>
                        {opt.subLabel && (
                          <div className="ms-option-sublabel">
                            {opt.subLabel}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Footer (only in multi-select mode) */}
          {!singleSelect && value.length > 0 && (
            <div className="ms-dropdown-footer">
              <span className="ms-dropdown-footer-count">
                {value.length} of {options.length} selected
              </span>
              <button
                type="button"
                onClick={() => onChange([])}
                className="ms-dropdown-footer-clear"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <span className="ms-dropdown-error">
          <i className="fa-solid fa-circle-exclamation" />
          {error}
        </span>
      )}
    </div>
  );
};

export interface SingleSelectDropdownProps {
  label?: string;
  placeholder?: string;
  options: MultiSelectOption[];
  value: string;
  onChange: (selected: string) => void;
  error?: string;
  listMaxHeight?: number;
  searchable?: boolean;
  disabled?: boolean;
  triggerStyle?: React.CSSProperties;
}

export const SingleSelectDropdown: React.FC<SingleSelectDropdownProps> = ({
  value,
  onChange,
  ...props
}) => {
  return (
    <MultiSelectDropdown
      {...props}
      singleSelect
      value={value ? [value] : []}
      onChange={(selected) => onChange(selected[0] || '')}
    />
  );
};

export default MultiSelectDropdown;
