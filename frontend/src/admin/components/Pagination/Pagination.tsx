/**
 * Pagination Component.
 * Generic clean data table pagination controls.
 */

import React from 'react';
import type { PaginationProps } from '../../types/common';

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 20px',
        borderTop: '1px solid #f1f5f9',
        fontSize: '0.82rem',
        color: '#64748b',
        flexWrap: 'wrap',
        gap: '12px',
      }}
    >
      <div>
        Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of{' '}
        <strong>{totalItems}</strong> entries
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="btn-admin-outline"
          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
        >
          <i className="fa-solid fa-chevron-left" /> Previous
        </button>

        {Array.from({ length: totalPages }).map((_, idx) => {
          const pageNum = idx + 1;
          const isActive = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                border: `1px solid ${isActive ? '#0d9488' : '#e2e8f0'}`,
                background: isActive ? '#0d9488' : '#ffffff',
                color: isActive ? '#ffffff' : '#334155',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="btn-admin-outline"
          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
        >
          Next <i className="fa-solid fa-chevron-right" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
