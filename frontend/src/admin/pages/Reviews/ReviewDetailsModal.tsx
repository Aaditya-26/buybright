/**
 * BuyBright Admin Reviews & Ratings - Review Details Modal.
 */

import React from 'react';
import { AdminReview, ReviewStatus } from '../../../types/review';

interface ReviewDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: AdminReview | null;
  onStatusChange: (id: string, status: ReviewStatus) => void;
  onOpenReplyModal: (review: AdminReview) => void;
}

export const ReviewDetailsModal: React.FC<ReviewDetailsModalProps> = ({
  isOpen,
  onClose,
  review,
  onStatusChange,
  onOpenReplyModal,
}) => {
  if (!isOpen || !review) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`fa-star ${i < rating ? 'fa-solid text-warning' : 'fa-regular text-muted'}`}
        style={{ color: i < rating ? '#f59e0b' : '#cbd5e1', fontSize: '15px', marginRight: '2px' }}
      />
    ));
  };

  const getStatusBadgeClass = (status: ReviewStatus) => {
    switch (status) {
      case 'Approved':
        return 'badge-status-approved';
      case 'Pending':
        return 'badge-status-pending';
      case 'Rejected':
        return 'badge-status-rejected';
      default:
        return '';
    }
  };

  return (
    <div className="review-modal-overlay" onClick={onClose}>
      <div className="review-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="review-modal-header">
          <div className="header-title-wrap">
            <div className="header-icon-circle">
              <i className="fa-solid fa-star-half-stroke" />
            </div>
            <div>
              <h3 className="modal-heading">Customer Review &amp; Rating Details</h3>
              <span className="modal-subheading">Review ID: #{review.id} • Submitted on {review.date}</span>
            </div>
          </div>
          <button type="button" className="btn-close-modal" onClick={onClose} title="Close Modal">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="review-modal-body">
          {/* Top Info Banner: Product & Customer */}
          <div className="review-meta-grid">
            {/* Product Card Box */}
            <div className="meta-box product-meta-box">
              <div className="box-label">
                <i className="fa-solid fa-box" /> Reviewed Product
              </div>
              <div className="product-info-flex">
                <img
                  src={review.productImage || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=100&auto=format&fit=crop&q=60'}
                  alt={review.productName}
                  className="product-modal-thumb"
                />
                <div className="product-details-col">
                  <strong className="prod-name-txt">{review.productName}</strong>
                  <div className="prod-sub-tags">
                    <span className="sku-tag">SKU: {review.productSku}</span>
                    <span className="price-tag">₹{review.productPrice.toLocaleString()}</span>
                  </div>
                  <span className="cat-sub-text">{review.productCategory}</span>
                </div>
              </div>
            </div>

            {/* Customer Card Box */}
            <div className="meta-box customer-meta-box">
              <div className="box-label">
                <i className="fa-solid fa-user-doctor" /> Reviewer Information
              </div>
              <div className="customer-info-flex">
                {review.customerAvatar ? (
                  <img src={review.customerAvatar} alt={review.customerName} className="customer-modal-avatar" />
                ) : (
                  <div className="customer-avatar-fallback">
                    {review.customerName.charAt(0)}
                  </div>
                )}
                <div className="customer-details-col">
                  <div className="customer-name-row">
                    <strong className="customer-name-txt">{review.customerName}</strong>
                    {review.isVerifiedBuyer && (
                      <span className="verified-badge-pill" title="Verified Customer Purchase">
                        <i className="fa-solid fa-circle-check" /> Verified Buyer
                      </span>
                    )}
                  </div>
                  <span className="cust-email-txt">
                    <i className="fa-solid fa-envelope" /> {review.customerEmail}
                  </span>
                  {review.customerPhone && (
                    <span className="cust-phone-txt">
                      <i className="fa-solid fa-phone" /> {review.customerPhone}
                    </span>
                  )}
                  {review.clinicName && (
                    <span className="cust-clinic-txt">
                      <i className="fa-solid fa-hospital" /> {review.clinicName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Rating & Review Content Box */}
          <div className="review-content-card">
            <div className="rating-headline-row">
              <div className="stars-cluster">
                {renderStars(review.rating)}
                <span className="numeric-score-pill">{review.rating}.0 / 5.0</span>
              </div>
              <div className="status-indicator-box">
                <span className={`status-pill-badge ${getStatusBadgeClass(review.status)}`}>
                  <i className={`fa-solid ${
                    review.status === 'Approved'
                      ? 'fa-circle-check'
                      : review.status === 'Pending'
                      ? 'fa-clock'
                      : 'fa-ban'
                  }`} />
                  {review.status === 'Approved'
                    ? 'Approved (Live)'
                    : review.status === 'Pending'
                    ? 'Pending Moderation'
                    : 'Rejected'}
                </span>
              </div>
            </div>

            <h4 className="review-title-text">"{review.title}"</h4>
            <p className="review-body-text">{review.comment}</p>

            {/* Attached Images */}
            {review.images && review.images.length > 0 && (
              <div className="attached-images-wrap">
                <span className="attach-label">Customer Uploaded Photos:</span>
                <div className="images-thumbnails-row">
                  {review.images.map((imgUrl, idx) => (
                    <a key={idx} href={imgUrl} target="_blank" rel="noopener noreferrer" className="thumb-link">
                      <img src={imgUrl} alt={`Review Attachment ${idx + 1}`} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Admin Response / Reply Section */}
          <div className="admin-reply-box">
            <div className="reply-header-row">
              <div className="reply-title">
                <i className="fa-solid fa-reply-all" />
                <strong>Store Admin Response</strong>
              </div>
              <button
                type="button"
                className="btn-action-reply-modal"
                onClick={() => {
                  onClose();
                  onOpenReplyModal(review);
                }}
              >
                <i className="fa-solid fa-pen-to-square" /> {review.adminReply ? 'Edit Response' : 'Write Reply'}
              </button>
            </div>

            {review.adminReply ? (
              <div className="reply-content-card">
                <p className="reply-text">"{review.adminReply.replyText}"</p>
                <div className="reply-meta">
                  <span>Replied by <strong>{review.adminReply.repliedBy}</strong></span>
                  <span>•</span>
                  <span>{review.adminReply.replyDate}</span>
                </div>
              </div>
            ) : (
              <div className="no-reply-placeholder">
                <i className="fa-regular fa-comment-dots" />
                <span>No admin response published yet. Click "Write Reply" to post a public response.</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="review-modal-footer">
          <div className="right-action-buttons" style={{ marginLeft: 'auto' }}>
            {review.status !== 'Approved' && (
              <button
                type="button"
                className="btn-approve-primary"
                onClick={() => onStatusChange(review.id, 'Approved')}
              >
                <i className="fa-solid fa-circle-check" /> Approve Review
              </button>
            )}

            {review.status !== 'Rejected' && (
              <button
                type="button"
                className="btn-reject-outline"
                onClick={() => onStatusChange(review.id, 'Rejected')}
              >
                <i className="fa-solid fa-ban" /> Reject Review
              </button>
            )}

            <button type="button" className="btn-modal-close" onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
