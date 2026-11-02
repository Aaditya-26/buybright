/**
 * BuyBright Festive Floating Ribbon & Interactive Deals Modal.
 * Displays an ambient festive floating badge on the bottom corner of the screen.
 * Clicking opens a festive modal showing full offer terms, coupon copy, and applicable categories.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFestival } from '../../context/FestivalContext';
import { useToast } from '../../context/ToastContext';

export const FestivalFloatingRibbon: React.FC = () => {
  const { activeFestival, showFestivalOfferModal, setShowFestivalOfferModal } = useFestival();
  const { showToast } = useToast();
  const [copied, setCopied] = useState<boolean>(false);

  if (!activeFestival || !activeFestival.floatingRibbon?.enabled) {
    return null;
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    showToast(`🎉 Festive Coupon "${code}" copied! Apply at checkout for ${activeFestival.discountPercentage}% OFF.`, 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const posClass =
    activeFestival.floatingRibbon.position === 'bottom-left'
      ? 'pos-bottom-left'
      : activeFestival.floatingRibbon.position === 'top-right'
      ? 'pos-top-right'
      : 'pos-bottom-right';

  return (
    <>
      {/* Floating Festive Trigger Badge */}
      <div
        className={`festive-floating-badge ${posClass}`}
        onClick={() => setShowFestivalOfferModal(true)}
        style={{
          background: activeFestival.accentGradient || activeFestival.primaryColor,
        }}
        title="Click to view Festive Offers & Coupons"
        role="button"
        tabIndex={0}
      >
        <div className="badge-glow-ring" />
        <span className="badge-icon">{activeFestival.floatingRibbon.badgeIcon || '🪔'}</span>
        <div className="badge-text-group">
          <span className="badge-title">{activeFestival.floatingRibbon.title}</span>
          <span className="badge-subtitle">{activeFestival.floatingRibbon.subtitle}</span>
        </div>
        <span className="badge-tag-percent">
          {activeFestival.discountType === 'fixed'
            ? `-₹${Number(activeFestival.discountValue ?? activeFestival.discountPercentage ?? 0).toLocaleString()}`
            : `-${activeFestival.discountValue ?? activeFestival.discountPercentage ?? 0}%`}
        </span>
      </div>

      {/* Interactive Festive Deals Modal */}
      {showFestivalOfferModal && (
        <div className="festive-modal-overlay" onClick={() => setShowFestivalOfferModal(false)}>
          <div
            className="festive-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              borderColor: activeFestival.primaryColor,
            }}
          >
            {/* Festive Card Header */}
            <div
              className="festive-modal-head"
              style={{
                background: activeFestival.accentGradient || activeFestival.primaryColor,
                color: activeFestival.textColor || '#ffffff',
              }}
            >
              <div className="head-content-wrap">
                <span className="festive-top-badge">{activeFestival.badgeText}</span>
                <h3 className="festive-main-title">{activeFestival.name}</h3>
                <p className="festive-tagline-txt">{activeFestival.tagline}</p>
              </div>

              <button
                type="button"
                className="btn-close-festive-modal"
                onClick={() => setShowFestivalOfferModal(false)}
                aria-label="Close Festive Offers"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="festive-modal-body">
              {/* Coupon Box */}
              <div className="festive-coupon-highlight-box">
                <div className="coupon-left">
                  <span className="coupon-save-lbl">FLAT DISCOUNT</span>
                  <div className="discount-huge-val">
                    {activeFestival.discountType === 'fixed'
                      ? `₹${Number(activeFestival.discountValue ?? activeFestival.discountPercentage ?? 0).toLocaleString()}`
                      : `${activeFestival.discountValue ?? activeFestival.discountPercentage ?? 0}%`}{' '}
                    <span className="off-txt">OFF</span>
                  </div>
                  <span className="min-order-sub">
                    {activeFestival.minOrderAmount && activeFestival.minOrderAmount > 0
                      ? `On orders above ₹${activeFestival.minOrderAmount.toLocaleString()}`
                      : 'No minimum cart required'}
                  </span>
                </div>

                <div className="coupon-right">
                  <span className="use-code-lbl">USE PROMO CODE</span>
                  <div className="coupon-code-pill-big">
                    <strong>{activeFestival.couponCode}</strong>
                    <button
                      type="button"
                      className="btn-modal-copy-code"
                      onClick={() => handleCopyCode(activeFestival.couponCode)}
                    >
                      <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`} />
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Highlights & Features Grid */}
              <div className="festive-perks-grid">
                <div className="perk-item">
                  <i className="fa-solid fa-truck-fast text-teal" />
                  <div>
                    <strong>Free Doorstep Dispatch</strong>
                   </div>
                </div>
                <div className="perk-item">
                  <i className="fa-solid fa-shield-halved text-blue" />
                  <div>
                    <strong>100% Genuine Supplies</strong>
                   </div>
                </div>
                <div className="perk-item">
                  <i className="fa-solid fa-rotate-left text-coral" />
                  <div>
                    <strong>7-Day Easy Returns</strong>
                   </div>
                </div>
               
              </div>

              {/* Applicable Categories */}
              {activeFestival.targetCategories && activeFestival.targetCategories.length > 0 && (
                <div className="festive-categories-section">
                  <h4>Applicable Categories for this Campaign:</h4>
                  <div className="categories-pills-row">
                    {activeFestival.targetCategories.map((cat, idx) => (
                      <span key={idx} className="category-pill-chip">
                        <i className="fa-solid fa-circle-check" /> {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Validity Banner */}
              <div className="festive-validity-banner">
                <i className="fa-solid fa-calendar-check" />
                <span>
                  Campaign valid from <strong>{activeFestival.startDate}</strong> to{' '}
                  <strong>{activeFestival.endDate}</strong>. Terms &amp; conditions apply.
                </span>
              </div>
            </div>

            {/* Modal Foot */}
            <div className="festive-modal-foot">
              <button
                type="button"
                className="btn-modal-secondary"
                onClick={() => setShowFestivalOfferModal(false)}
              >
                Close
              </button>
              <Link
                to={activeFestival.topAnnouncementBar.buttonLink || '/shop'}
                className="btn-festive-shop-now"
                onClick={() => setShowFestivalOfferModal(false)}
                style={{
                  background: activeFestival.accentGradient || activeFestival.primaryColor,
                }}
              >
                <i className="fa-solid fa-bag-shopping" /> Shop Festive Deals
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FestivalFloatingRibbon;
