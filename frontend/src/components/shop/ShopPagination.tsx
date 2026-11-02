/**
 * BuyBright Shop Pagination Component.
 * Responsive, accessible pagination navigation with numeric buttons, previous/next triggers,
 * and page summary.
 */

import React from 'react';

interface ShopPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const ShopPagination: React.FC<ShopPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const handleSelectPage = (page: number) => {
    onPageChange(page);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  return (
    <div className="shop-pagination-wrap" aria-label="Pagination Navigation">
      {/* Previous Button */}
      <button
        type="button"
        className="pagination-btn prev-btn"
        disabled={currentPage === 1}
        onClick={() => handleSelectPage(currentPage - 1)}
        aria-label="Previous page"
      >
        <i className="fa-solid fa-chevron-left" />
        <span>Prev</span>
      </button>

      {/* Page Numbers */}
      <div className="pagination-numbers-list">
        {getPageNumbers().map((p, idx) => {
          if (p === '...') {
            return (
              <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
                …
              </span>
            );
          }

          const pageNum = p as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              type="button"
              className={`pagination-num-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleSelectPage(pageNum)}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        type="button"
        className="pagination-btn next-btn"
        disabled={currentPage === totalPages}
        onClick={() => handleSelectPage(currentPage + 1)}
        aria-label="Next page"
      >
        <span>Next</span>
        <i className="fa-solid fa-chevron-right" />
      </button>
    </div>
  );
};
