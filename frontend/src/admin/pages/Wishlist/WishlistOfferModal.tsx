/**
 * BuyBright Admin Wishlist — Send Promotional Offer Modal.
 * Generates custom discount code or incentive alert for wishlisted items.
 */

import React, { useState, useEffect } from 'react';
import { AdminWishlistItem } from '../../../types/wishlist';

interface WishlistOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: AdminWishlistItem | null;
  onSubmitOffer: (id: string, discountPercent: number, couponCode: string, customNote?: string) => void;
}

export const WishlistOfferModal: React.FC<WishlistOfferModalProps> = ({
  isOpen,
  onClose,
  item,
  onSubmitOffer,
}) => {
  const [discountPercent, setDiscountPercent] = useState<number>(10);
  const [couponCode, setCouponCode] = useState<string>('SPECIAL10');
  const [customNote, setCustomNote] = useState<string>('');
  const [sendChannels, setSendChannels] = useState<{ email: boolean; whatsapp: boolean; inApp: boolean }>({
    email: true,
    whatsapp: true,
    inApp: true,
  });

  useEffect(() => {
    if (item) {
      const generatedCode = `WISH${Math.floor(discountPercent || 10)}`;
      setCouponCode(generatedCode);
      setCustomNote(`Exclusive ${discountPercent}% discount on ${item.productName} for your clinic!`);
    }
  }, [item, discountPercent]);

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    onSubmitOffer(item.id, Number(discountPercent), couponCode, customNote);
    onClose();
  };

  const calculatedDiscountAmount = Math.round((item.productPrice * (discountPercent || 0)) / 100);
  const discountedPrice = item.productPrice - calculatedDiscountAmount;

  return (
    <div className="wishlist-modal-overlay" onClick={onClose}>
      <div className="wishlist-modal-card offer-composer-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="wishlist-modal-header">
          <div className="header-title-wrap">
            <div className="header-icon-circle offer-icon-circle">
              <i className="fa-solid fa-tags" />
            </div>
            <div>
              <h3 className="modal-heading">Send Targeted Wishlist Offer</h3>
              <span className="modal-subheading">
                Sending to {item.customerName} ({item.customerEmail})
              </span>
            </div>
          </div>
          <button type="button" className="btn-close-modal" onClick={onClose} title="Close">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit}>
          <div className="wishlist-modal-body">
            {/* Target Item Mini Banner */}
            <div className="offer-target-banner">
              <img
                src={item.productImage || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=80&auto=format&fit=crop&q=60'}
                alt={item.productName}
                className="target-thumb"
              />
              <div className="target-info">
                <strong className="target-name">{item.productName}</strong>
                <span className="target-sku">SKU: {item.productSku} • Category: {item.productCategory}</span>
                <div className="target-price-calc">
                  <span className="orig-price">Regular: ₹{item.productPrice.toLocaleString()}</span>
                  <span className="arrow-sep">➔</span>
                  <span className="new-price">Special Offer: ₹{discountedPrice.toLocaleString()}</span>
                  <span className="save-badge">(Customer Saves ₹{calculatedDiscountAmount.toLocaleString()})</span>
                </div>
              </div>
            </div>

            {/* Discount Inputs Row */}
            <div className="offer-form-grid">
              <div className="form-group-item">
                <label>Discount Percentage (%):</label>
                <div className="input-with-addon">
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="form-control-input"
                    required
                  />
                  <span className="input-addon">%</span>
                </div>
              </div>

              <div className="form-group-item">
                <label>Promo / Coupon Code:</label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="form-control-input coupon-input"
                  placeholder="e.g. WISH10"
                  required
                />
              </div>
            </div>

            {/* Quick Discount Presets */}
            <div className="preset-pills-row">
              <span className="preset-label">Quick Presets:</span>
              {[5, 8, 10, 12, 15, 20].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  className={`preset-btn ${discountPercent === pct ? 'active' : ''}`}
                  onClick={() => setDiscountPercent(pct)}
                >
                  {pct}% OFF
                </button>
              ))}
            </div>

            {/* Personalized Message */}
            <div className="form-group-item full-width mt-3">
              <label>Personalized Customer Message:</label>
              <textarea
                className="notes-textarea"
                rows={3}
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Write a personalized note for the customer..."
              />
            </div>

            {/* Dispatch Channels */}
            <div className="dispatch-channels-row mt-3">
              <label className="channels-title">Notification Channels:</label>
              <div className="channels-flex">
                <label className="channel-checkbox-label">
                  <input
                    type="checkbox"
                    checked={sendChannels.email}
                    onChange={(e) => setSendChannels({ ...sendChannels, email: e.target.checked })}
                  />
                  <i className="fa-regular fa-envelope" /> Email Notification
                </label>
                <label className="channel-checkbox-label">
                  <input
                    type="checkbox"
                    checked={sendChannels.whatsapp}
                    onChange={(e) => setSendChannels({ ...sendChannels, whatsapp: e.target.checked })}
                  />
                  <i className="fa-brands fa-whatsapp text-success" /> WhatsApp Message
                </label>
                <label className="channel-checkbox-label">
                  <input
                    type="checkbox"
                    checked={sendChannels.inApp}
                    onChange={(e) => setSendChannels({ ...sendChannels, inApp: e.target.checked })}
                  />
                  <i className="fa-solid fa-bell text-warning" /> In-App Notification
                </label>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="wishlist-modal-footer">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-dispatch-offer">
              <i className="fa-solid fa-paper-plane mr-1" /> Dispatch Special Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
