/**
 * BuyBright Floating Product Comparison Dock Bar.
 * Appears dynamically at the bottom of the screen when 1 or more products are added to comparison.
 * Allows quick navigation to the Comparison Page (/compare) or clearing items.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompare } from '../../context/CompareContext';

export const CompareFloatingBar: React.FC = () => {
  const { compareItems, removeFromCompare, clearCompare, compareCount } = useCompare();
  const navigate = useNavigate();

  if (compareCount === 0) return null;

  return (
    <div className="compare-floating-dock-bar">
      <div className="compare-dock-container">
        {/* Left info label */}
        <div className="compare-dock-left">
          <div className="compare-badge-circle">
            <i className="fa-solid fa-code-compare" />
          </div>
          <div>
            <strong>Compare Products ({compareCount}/4)</strong>
            <span>Side-by-side specifications &amp; pricing</span>
          </div>
        </div>

        {/* Center thumbnails */}
        <div className="compare-dock-thumbnails">
          {compareItems.map((item) => (
            <div key={item.id} className="dock-thumb-item" title={item.name}>
              <img src={item.image} alt={item.name} />
              <button
                type="button"
                className="btn-dock-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromCompare(item.id);
                }}
                aria-label={`Remove ${item.name}`}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
          ))}

          {/* Empty slot indicators */}
          {Array.from({ length: 4 - compareCount }).map((_, idx) => (
            <div key={`empty-slot-${idx}`} className="dock-thumb-empty" title="Add up to 4 items">
              <i className="fa-solid fa-plus" />
            </div>
          ))}
        </div>

        {/* Right Action buttons */}
        <div className="compare-dock-actions">
          <button
            type="button"
            className="btn-dock-compare-now"
            onClick={() => navigate('/compare')}
          >
            <span>Compare Now</span>
            <i className="fa-solid fa-arrow-right" />
          </button>

          <button
            type="button"
            className="btn-dock-clear"
            onClick={clearCompare}
            title="Clear comparison list"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareFloatingBar;
