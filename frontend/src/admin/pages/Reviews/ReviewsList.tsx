/**
 * BuyBright Admin — Reviews & Ratings Management Page.
 * Features:
 * - Summary metric stat cards with live rating breakdown
 * - Reusable DataTable with exact columns: SR. NO. | ACTIONS | PRODUCT | CUSTOMER | RATING | REVIEW | STATUS | DATE
 * - Quick action buttons: View Details Modal, One-Click Approve / Reject, and Admin Reply
 * - Multi-filter search (Customer, Product, SKU, Rating, Status)
 * - Export to CSV / PDF
 * - Fully responsive with table and mobile card layout
 */

import React, { useState, useMemo } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { DataTable, type Column } from '../../components/DataTable';
import { SearchBar } from '../../components/SearchBar';
import { Pagination } from '../../components/Pagination';
import { useToast } from '../../../context/ToastContext';
import {
  getReviews,
  updateReviewStatus,
  addAdminReply,
  getReviewStats,
} from '../../data/reviewsData';
import { AdminReview, ReviewStatus } from '../../../types/review';
import { ReviewDetailsModal } from './ReviewDetailsModal';
import { ReviewReplyModal } from './ReviewReplyModal';
import { exportTableToCSV } from '../../utils/exportCsv';
import { exportTableToPDF } from '../../utils/exportPdf';

export const ReviewsList: React.FC = () => {
  const { showToast } = useToast();

  const [reviews, setReviews] = useState<AdminReview[]>(() => getReviews());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ReviewStatus>('All');
  const [ratingFilter, setRatingFilter] = useState<number | 'All'>('All');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Selected reviews for bulk action
  const [selectedReviewIds, setSelectedReviewIds] = useState<string[]>([]);

  // Modals state
  const [viewReview, setViewReview] = useState<AdminReview | null>(null);
  const [replyReview, setReplyReview] = useState<AdminReview | null>(null);

  // Stats calculation
  const stats = useMemo(() => getReviewStats(reviews), [reviews]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((rev) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        rev.id.toLowerCase().includes(q) ||
        rev.productName.toLowerCase().includes(q) ||
        rev.productSku.toLowerCase().includes(q) ||
        rev.productCategory.toLowerCase().includes(q) ||
        rev.customerName.toLowerCase().includes(q) ||
        rev.customerEmail.toLowerCase().includes(q) ||
        rev.title.toLowerCase().includes(q) ||
        rev.comment.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'All' || rev.status === statusFilter;
      const matchesRating = ratingFilter === 'All' || rev.rating === ratingFilter;

      return matchesSearch && matchesStatus && matchesRating;
    });
  }, [reviews, searchQuery, statusFilter, ratingFilter]);

  // Paginated records
  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredReviews.slice(start, start + pageSize);
  }, [filteredReviews, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredReviews.length / pageSize) || 1;

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleStatusChange = (id: string, newStatus: ReviewStatus) => {
    const updated = updateReviewStatus(id, newStatus);
    setReviews(updated);
    if (viewReview && viewReview.id === id) {
      setViewReview({ ...viewReview, status: newStatus });
    }
    showToast(`Review status updated to "${newStatus}"`, 'success');
  };

  const handleAdminReplySubmit = (id: string, replyText: string) => {
    const updated = addAdminReply(id, replyText);
    setReviews(updated);
    showToast('Admin response published successfully!', 'success');
  };

  // Bulk Actions
  const handleBulkStatusChange = (newStatus: ReviewStatus) => {
    if (selectedReviewIds.length === 0) return;
    let current = [...reviews];
    selectedReviewIds.forEach((id) => {
      current = updateReviewStatus(id, newStatus);
    });
    setReviews(current);
    setSelectedReviewIds([]);
    showToast(`Bulk updated ${selectedReviewIds.length} review(s) to "${newStatus}"`, 'success');
  };

  const toggleSelectAll = () => {
    if (selectedReviewIds.length === paginatedReviews.length) {
      setSelectedReviewIds([]);
    } else {
      setSelectedReviewIds(paginatedReviews.map((r) => r.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedReviewIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Export handlers
  const handleExportCSV = () => {
    if (filteredReviews.length === 0) {
      showToast('No reviews data to export.', 'warning');
      return;
    }

    exportTableToCSV({
      filename: `BuyBright_Reviews_${new Date().toISOString().split('T')[0]}`,
      headers: [
        'SR. NO.',
        'Review ID',
        'Product Name',
        'SKU',
        'Category',
        'Customer Name',
        'Customer Email',
        'Verified Buyer',
        'Rating',
        'Review Title',
        'Review Comment',
        'Status',
        'Date',
        'Admin Reply',
      ],
      rows: filteredReviews.map((r, idx) => [
        idx + 1,
        r.id,
        r.productName,
        r.productSku,
        r.productCategory,
        r.customerName,
        r.customerEmail,
        r.isVerifiedBuyer ? 'Yes' : 'No',
        `${r.rating} Stars`,
        r.title,
        r.comment,
        r.status,
        r.date,
        r.adminReply?.replyText || 'N/A',
      ]),
    });
    showToast('Customer reviews exported to CSV successfully.', 'success');
  };

  const handleExportPDF = () => {
    if (filteredReviews.length === 0) {
      showToast('No reviews data to export.', 'warning');
      return;
    }

    exportTableToPDF({
      title: 'BuyBright - Customer Reviews & Ratings Report',
      subtitle: `Generated on ${new Date().toLocaleDateString('en-GB')} • Total Records: ${filteredReviews.length} • Average Rating: ${stats.averageRating} ★`,
      headers: ['Sr. No.', 'Product', 'Customer', 'Rating', 'Review Title', 'Status', 'Date'],
      rows: filteredReviews.map((r, idx) => [
        `#${idx + 1}`,
        r.productName,
        r.customerName,
        `${r.rating} ★`,
        r.title,
        r.status,
        r.date,
      ]),
    });
    showToast('Customer reviews exported to PDF successfully.', 'success');
  };

  // Helper star renderer
  const renderRatingStars = (rating: number) => {
    return (
      <div className="review-stars-col">
        <div className="stars-icons">
          {Array.from({ length: 5 }, (_, i) => (
            <i
              key={i}
              className={`fa-star ${i < rating ? 'fa-solid' : 'fa-regular'}`}
              style={{
                color: i < rating ? '#f59e0b' : '#cbd5e1',
                fontSize: '12px',
                marginRight: '1px',
              }}
            />
          ))}
        </div>
        <span
          className={`rating-badge-pill rating-lvl-${rating}`}
          style={{
            fontSize: '11px',
            fontWeight: 800,
            padding: '1px 6px',
            borderRadius: '4px',
            display: 'inline-block',
            marginTop: '2px',
          }}
        >
          {rating}.0 ★
        </span>
      </div>
    );
  };

  // ── DataTable Columns Definition ──────────────────────────────────────────
  const columns: Column<AdminReview>[] = [
    {
      key: 'srNo',
      header: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <input
            type="checkbox"
            checked={paginatedReviews.length > 0 && selectedReviewIds.length === paginatedReviews.length}
            onChange={toggleSelectAll}
            title="Select all on this page"
            style={{ cursor: 'pointer', accentColor: '#0d9488' }}
          />
          <span>SR. NO.</span>
        </div>
      ),
      width: '85px',
      render: (row, idx) => {
        const actualIndex = (currentPage - 1) * pageSize + idx + 1;
        const isChecked = selectedReviewIds.includes(row.id);
        return (
          <div className="sr-no-cell">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => toggleSelectRow(row.id)}
              className="row-select-checkbox"
            />
            <span className="sr-num-badge">#{actualIndex}</span>
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'ACTIONS',
      width: '140px',
      render: (row) => (
        <div className="table-actions-cell">
          {/* View Details */}
          <button
            type="button"
            className="action-btn btn-view"
            onClick={() => setViewReview(row)}
            title="View Full Review Details"
          >
            <i className="fa-solid fa-eye" />
          </button>

          {/* Quick Approve / Reject */}
          {row.status !== 'Approved' ? (
            <button
              type="button"
              className="action-btn btn-approve"
              onClick={() => handleStatusChange(row.id, 'Approved')}
              title="Quick Approve Review"
            >
              <i className="fa-solid fa-circle-check" />
            </button>
          ) : (
            <button
              type="button"
              className="action-btn btn-reject"
              onClick={() => handleStatusChange(row.id, 'Rejected')}
              title="Quick Reject / Unpublish"
            >
              <i className="fa-solid fa-ban" />
            </button>
          )}

          {/* Reply */}
          <button
            type="button"
            className={`action-btn btn-reply ${row.adminReply ? 'has-reply' : ''}`}
            onClick={() => setReplyReview(row)}
            title={row.adminReply ? 'Edit Admin Response' : 'Write Admin Response'}
          >
            <i className="fa-solid fa-reply" />
          </button>
        </div>
      ),
    },
    {
      key: 'product',
      header: 'PRODUCT',
      minWidth: '240px',
      render: (row) => (
        <div className="table-product-cell">
          <img
            src={row.productImage || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=100&auto=format&fit=crop&q=60'}
            alt={row.productName}
            className="product-col-thumb"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="product-col-info">
            <strong className="product-col-name" title={row.productName}>
              {row.productName}
            </strong>
            <div className="product-col-meta">
              <span className="sku-badge">{row.productSku}</span>
              <span className="price-text">₹{row.productPrice.toLocaleString()}</span>
            </div>
            <span className="cat-text">{row.productCategory}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'CUSTOMER',
      minWidth: '190px',
      render: (row) => (
        <div className="table-customer-cell">
          {row.customerAvatar ? (
            <img src={row.customerAvatar} alt={row.customerName} className="customer-avatar-img" />
          ) : (
            <div className="customer-avatar-char">
              {row.customerName.charAt(0)}
            </div>
          )}
          <div className="customer-info-col">
            <div className="name-verified-row">
              <strong className="customer-name-label">{row.customerName}</strong>
              {row.isVerifiedBuyer && (
                <i className="fa-solid fa-circle-check verified-icon" title="Verified Customer" />
              )}
            </div>
            <span className="customer-email-sub">{row.customerEmail}</span>
            {row.clinicName && (
              <span className="customer-clinic-sub" title={row.clinicName}>
                {row.clinicName}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'rating',
      header: 'RATING',
      width: '120px',
      render: (row) => renderRatingStars(row.rating),
    },
    {
      key: 'review',
      header: 'REVIEW',
      minWidth: '260px',
      render: (row) => (
        <div className="table-review-cell">
          <strong className="review-snippet-title">"{row.title}"</strong>
          <p className="review-snippet-text">{row.comment}</p>
          <div className="review-extras-row">
            {row.images && row.images.length > 0 && (
              <span className="review-pill-photo" title={`${row.images.length} photo(s) attached`}>
                <i className="fa-solid fa-camera" /> {row.images.length} photo{row.images.length > 1 ? 's' : ''}
              </span>
            )}
            {row.adminReply && (
              <span className="review-pill-replied" title="Store admin has responded to this review">
                <i className="fa-solid fa-reply" /> Replied
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'STATUS',
      width: '140px',
      render: (row) => (
        <div className="table-status-cell">
          <select
            className={`status-dropdown-select status-val-${row.status.toLowerCase()}`}
            value={row.status}
            onChange={(e) => handleStatusChange(row.id, e.target.value as ReviewStatus)}
          >
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'DATE',
      width: '140px',
      render: (row) => (
        <div className="table-date-cell">
          <span className="date-main">
            <i className="fa-regular fa-calendar-days mr-1" />
            {row.date.split(',')[0]}
          </span>
          <span className="date-time-sub">
            <i className="fa-regular fa-clock mr-1" />
            {row.date.split(',')[1] || ''}
          </span>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Customer Reviews & Ratings Management"
      subtitle="Moderate customer feedback, manage rating approvals, publish official store replies, and track product quality metrics."
    >
      <div className="admin-page-container reviews-management-page">
        {/* Metric Stats Cards Row */}
        <div className="reviews-stats-grid">
          {/* Card 1: Total Reviews */}
          <div className="review-stat-card card-total">
            <div className="stat-card-icon">
              <i className="fa-solid fa-comments" />
            </div>
            <div className="stat-card-info">
              <span className="stat-label">Total Reviews</span>
              <strong className="stat-number">{stats.total}</strong>
              <span className="stat-sub">Across all dental products</span>
            </div>
          </div>

          {/* Card 2: Average Rating Score */}
          <div className="review-stat-card card-avg-rating">
            <div className="stat-card-icon">
              <i className="fa-solid fa-star" />
            </div>
            <div className="stat-card-info">
              <span className="stat-label">Average Rating</span>
              <div className="rating-score-flex">
                <strong className="stat-number">{stats.averageRating}</strong>
                <div className="stars-mini">
                  {renderRatingStars(Math.round(stats.averageRating))}
                </div>
              </div>
              <span className="stat-sub">Based on verified customer feedback</span>
            </div>
          </div>

          {/* Card 3: Approved Reviews (Live) */}
          <div className="review-stat-card card-approved">
            <div className="stat-card-icon">
              <i className="fa-solid fa-circle-check" />
            </div>
            <div className="stat-card-info">
              <span className="stat-label">Approved (Live)</span>
              <strong className="stat-number">{stats.approved}</strong>
              <span className="stat-sub">Visible on website catalog</span>
            </div>
          </div>

          {/* Card 4: Pending Moderation */}
          <div className="review-stat-card card-pending">
            <div className="stat-card-icon">
              <i className="fa-solid fa-clock" />
            </div>
            <div className="stat-card-info">
              <span className="stat-label">Pending Approval</span>
              <strong className="stat-number">{stats.pending}</strong>
              <span className="stat-sub">Requires admin action</span>
            </div>
          </div>
        </div>

        {/* Action Header & Search Filter Bar */}
        <div className="admin-card table-controls-card">
          <div className="table-controls-top-row">
            {/* Status Filter Tabs */}
            <div className="status-filter-pills">
              <button
                type="button"
                className={`filter-pill-btn ${statusFilter === 'All' ? 'active' : ''}`}
                onClick={() => {
                  setStatusFilter('All');
                  setCurrentPage(1);
                }}
              >
                All Reviews ({reviews.length})
              </button>
              <button
                type="button"
                className={`filter-pill-btn pill-approved ${statusFilter === 'Approved' ? 'active' : ''}`}
                onClick={() => {
                  setStatusFilter('Approved');
                  setCurrentPage(1);
                }}
              >
                <i className="fa-solid fa-circle-check" /> Approved ({stats.approved})
              </button>
              <button
                type="button"
                className={`filter-pill-btn pill-pending ${statusFilter === 'Pending' ? 'active' : ''}`}
                onClick={() => {
                  setStatusFilter('Pending');
                  setCurrentPage(1);
                }}
              >
                <i className="fa-solid fa-clock" /> Pending ({stats.pending})
              </button>
              <button
                type="button"
                className={`filter-pill-btn pill-rejected ${statusFilter === 'Rejected' ? 'active' : ''}`}
                onClick={() => {
                  setStatusFilter('Rejected');
                  setCurrentPage(1);
                }}
              >
                <i className="fa-solid fa-ban" /> Rejected ({stats.rejected})
              </button>
            </div>

            {/* Export Buttons */}
            <div className="export-buttons-group">
              <button type="button" className="btn-admin-outline" onClick={handleExportCSV}>
                <i className="fa-solid fa-file-csv" /> Export CSV
              </button>
              <button type="button" className="btn-admin-outline" onClick={handleExportPDF}>
                <i className="fa-solid fa-file-pdf" /> Export PDF
              </button>
            </div>
          </div>

          {/* Search Bar & Rating Filter Row */}
          <div className="search-and-filter-row mt-3">
            <div className="search-bar-wrap">
              <SearchBar
                value={searchQuery}
                onChange={(val) => {
                  setSearchQuery(val);
                  setCurrentPage(1);
                }}
                placeholder="Search reviews by Product, SKU, Customer Name, Email or Comment text..."
              />
            </div>

            <div className="rating-select-filter">
              <label>Filter Rating:</label>
              <select
                value={ratingFilter}
                onChange={(e) => {
                  setRatingFilter(e.target.value === 'All' ? 'All' : Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value="All">⭐ All Star Ratings</option>
                <option value="5">★★★★★ 5 Stars ({stats.ratingCounts[5]})</option>
                <option value="4">★★★★☆ 4 Stars ({stats.ratingCounts[4]})</option>
                <option value="3">★★★☆☆ 3 Stars ({stats.ratingCounts[3]})</option>
                <option value="2">★★☆☆☆ 2 Stars ({stats.ratingCounts[2]})</option>
                <option value="1">★☆☆☆☆ 1 Star ({stats.ratingCounts[1]})</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions Floating Bar */}
          {selectedReviewIds.length > 0 && (
            <div className="bulk-actions-banner">
              <div className="bulk-selection-count">
                <i className="fa-solid fa-check-double" />
                <strong>{selectedReviewIds.length}</strong> review(s) selected
              </div>
              <div className="bulk-btns-flex">
                <button
                  type="button"
                  className="btn-bulk-approve"
                  onClick={() => handleBulkStatusChange('Approved')}
                >
                  <i className="fa-solid fa-circle-check" /> Bulk Approve
                </button>
                <button
                  type="button"
                  className="btn-bulk-reject"
                  onClick={() => handleBulkStatusChange('Rejected')}
                >
                  <i className="fa-solid fa-ban" /> Bulk Reject
                </button>
                <button
                  type="button"
                  className="btn-bulk-clear"
                  onClick={() => setSelectedReviewIds([])}
                >
                  Deselect All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* DataTable Section */}
        <div className="admin-card table-wrapper-card">
          <DataTable
            columns={columns}
            data={paginatedReviews}
            keyExtractor={(row) => row.id}
            emptyMessage={
              searchQuery || statusFilter !== 'All' || ratingFilter !== 'All'
                ? 'No reviews match your selected filter criteria.'
                : 'No customer reviews recorded yet.'
            }
          />

          {/* Pagination Controls */}
          {filteredReviews.length > pageSize && (
            <div className="table-pagination-footer">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={filteredReviews.length}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </div>

        {/* Review Details Modal */}
        <ReviewDetailsModal
          isOpen={Boolean(viewReview)}
          onClose={() => setViewReview(null)}
          review={viewReview}
          onStatusChange={handleStatusChange}
          onOpenReplyModal={(rev) => setReplyReview(rev)}
        />

        {/* Admin Reply Modal */}
        <ReviewReplyModal
          isOpen={Boolean(replyReview)}
          onClose={() => setReplyReview(null)}
          review={replyReview}
          onSubmitReply={handleAdminReplySubmit}
        />
      </div>
    </AdminLayout>
  );
};

export default ReviewsList;
