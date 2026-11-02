/**
 * ShopPriceRangeDropdown
 * Inline price range selector for the Shop Top Filter Bar.
 * Uses same checkbox-list dropdown design as the admin MultiSelectDropdown.
 * Preset price buckets — selecting one sets the priceRange state on ShopPage.
 */

import React, { useState, useRef, useEffect } from 'react';

export interface PricePreset {
  label: string;
  min: number;
  max: number;
}

export const PRICE_PRESETS: PricePreset[] = [
  { label: 'Under ₹500',         min: 0,      max: 500   },
  { label: '₹500 – ₹2,000',      min: 500,    max: 2000  },
  { label: '₹2,000 – ₹5,000',    min: 2000,   max: 5000  },
  { label: '₹5,000 – ₹10,000',   min: 5000,   max: 10000 },
  { label: '₹10,000 – ₹25,000',  min: 10000,  max: 25000 },
  { label: 'Above ₹25,000',      min: 25000,  max: 100000},
];

interface ShopPriceRangeDropdownProps {
  priceRange?: [number, number];
  onChangePriceRange?: (range: [number, number]) => void;
}

export const ShopPriceRangeDropdown: React.FC<ShopPriceRangeDropdownProps> = ({
  priceRange = [0, 100000],
  onChangePriceRange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const safeRange: [number, number] = Array.isArray(priceRange) && priceRange.length === 2
    ? priceRange
    : [0, 100000];

  const isDefault = safeRange[0] === 0 && safeRange[1] === 100000;

  // Which preset is active (if any)
  const activePreset = PRICE_PRESETS.find(
    (p) => p.min === safeRange[0] && p.max === safeRange[1]
  );

  const handleSelect = (preset: PricePreset) => {
    if (activePreset?.label === preset.label) {
      // Deselect → reset
      onChangePriceRange?.([0, 100000]);
    } else {
      onChangePriceRange?.([preset.min, preset.max]);
    }
    setIsOpen(false);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChangePriceRange?.([0, 100000]);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {/* Trigger Button — styled exactly like .top-filter-btn */}
      <button
        type="button"
        className={`top-filter-btn${!isDefault ? ' is-active' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        title="Filter by Price Range"
        style={{ gap: '6px' }}
      >
        <i className="fa-solid fa-indian-rupee-sign" />
        <span>Price Range</span>
        {!isDefault && activePreset ? (
          <span className="btn-active-dot" title="Price filter active" />
        ) : null}
        <i
          className="fa-solid fa-chevron-down"
          style={{
            fontSize: '0.65rem',
            marginLeft: '2px',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.18s',
            opacity: 0.6,
          }}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            zIndex: 1200,
            minWidth: '220px',
            background: '#ffffff',
            border: '1.5px solid #e2e8f0',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '10px 14px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#fafafa',
            }}
          >
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                color: '#334155',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              <i className="fa-solid fa-indian-rupee-sign" style={{ marginRight: '5px', color: '#0d9488' }} />
              Select Price Range
            </span>
            {!isDefault && (
              <button
                type="button"
                onClick={handleReset}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '2px 6px',
                  borderRadius: '4px',
                }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Preset options */}
          <div>
            {PRICE_PRESETS.map((preset) => {
              const isChecked = activePreset?.label === preset.label;
              return (
                <div
                  key={preset.label}
                  onClick={() => handleSelect(preset)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f8fafc',
                    background: isChecked ? '#f0fdf4' : '#ffffff',
                    userSelect: 'none',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isChecked)
                      (e.currentTarget as HTMLElement).style.background = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = isChecked
                      ? '#f0fdf4'
                      : '#ffffff';
                  }}
                >
                  {/* Checkbox */}
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      flexShrink: 0,
                      borderRadius: '3px',
                      border: `2px solid ${isChecked ? '#0d9488' : '#cbd5e1'}`,
                      background: isChecked ? '#0d9488' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.12s',
                    }}
                  >
                    {isChecked && (
                      <i
                        className="fa-solid fa-check"
                        style={{ color: '#fff', fontSize: '0.52rem' }}
                      />
                    )}
                  </div>

                  {/* Label */}
                  <span
                    style={{
                      fontSize: '0.87rem',
                      fontWeight: isChecked ? 700 : 400,
                      color: isChecked ? '#0f172a' : '#334155',
                    }}
                  >
                    {preset.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          {!isDefault && (
            <div
              style={{
                padding: '8px 14px',
                borderTop: '1px solid #f1f5f9',
                background: '#fafafa',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>
                {activePreset?.label || 'Custom range'}
              </span>
              <button
                type="button"
                onClick={handleReset}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopPriceRangeDropdown;
