/**
 * BuyBright Admin Reviews & Ratings - Admin Reply Modal.
 */

import React, { useState, useEffect } from 'react';
import { AdminReview } from '../../../types/review';

interface ReviewReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: AdminReview | null;
  onSubmitReply: (reviewId: string, replyText: string) => void;
}

export const ReviewReplyModal: React.FC<ReviewReplyModalProps> = ({
  isOpen,
  onClose,
  review,
  onSubmitReply,
}) => {
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (review?.adminReply?.replyText) {
      setReplyText(review.adminReply.replyText);
    } else {
      setReplyText('');
    }
  }, [review, isOpen]);

  if (!isOpen || !review) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onSubmitReply(review.id, replyText.trim());
    onClose();
  };

  const QUICK_REPLY_TEMPLATES = [
    'Thank you for your valuable feedback, Doctor! We are glad BuyBright products are supporting your clinical excellence.',
    'Thank you for sharing your experience! We have notified our quality team and customer care will assist you shortly.',
    'We appreciate your feedback! Please reach out to our dedicated support helpline at +91 1800-PRESTO for any immediate assistance.',
  ];

  return (
    <div className="review-modal-overlay" onClick={onClose}>
      <div className="review-modal-card reply-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="review-modal-header">
          <div className="header-title-wrap">
            <div className="header-icon-circle reply-icon-circle">
              <i className="fa-solid fa-reply" />
            </div>
            <div>
              <h3 className="modal-heading">Reply to Customer Review</h3>
              <span className="modal-subheading">Responding to {review.customerName} on "{review.productName}"</span>
            </div>
          </div>
          <button type="button" className="btn-close-modal" onClick={onClose} title="Close Modal">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="review-modal-body">
            {/* Customer Review Summary Quote */}
            <div className="customer-review-quote">
              <div className="quote-top">
                <span className="reviewer-tag">
                  <i className="fa-solid fa-user" /> {review.customerName} (Rating: {review.rating} ★)
                </span>
                <span className="date-tag">{review.date}</span>
              </div>
              <p className="quote-comment">"{review.comment}"</p>
            </div>

            {/* Quick Reply Templates */}
            <div className="quick-templates-box">
              <label className="quick-templates-label">
                <i className="fa-solid fa-wand-magic-sparkles" /> Quick Response Templates:
              </label>
              <div className="templates-pills">
                {QUICK_REPLY_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="template-pill-btn"
                    onClick={() => setReplyText(tmpl)}
                  >
                    Template {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Reply Textarea */}
            <div className="admin-form-group mt-3">
              <label>Official Store Response *</label>
              <textarea
                required
                rows={5}
                placeholder="Type your official response to this review. It will be displayed publicly below the review on the product page..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              />
              <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                Your response will appear as "BuyBright Team" with the current timestamp.
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="review-modal-footer">
            <button type="button" className="btn-modal-close" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-approve-primary" disabled={!replyText.trim()}>
              <i className="fa-solid fa-paper-plane" /> Publish Response
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
