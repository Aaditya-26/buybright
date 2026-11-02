/**
 * BuyBright Admin Wishlist — WhatsApp & Email Direct Customer Outreach Modal.
 * Clean, focused message composer with WhatsApp & Email delivery options (templates & discounts removed).
 */

import React, { useState, useEffect } from 'react';
import { AdminWishlistItem } from '../../../types/wishlist';

interface WishlistMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetItems: AdminWishlistItem[];
  onSendMessage: (
    items: AdminWishlistItem[],
    messageText: string,
    channels: { whatsapp: boolean; email: boolean }
  ) => void;
}

export const WishlistMessageModal: React.FC<WishlistMessageModalProps> = ({
  isOpen,
  onClose,
  targetItems,
  onSendMessage,
}) => {
  const isBulk = targetItems.length > 1;
  const singleItem = targetItems.length === 1 ? targetItems[0] : null;

  const [message, setMessage] = useState<string>('');
  const [channels, setChannels] = useState<{ whatsapp: boolean; email: boolean }>({
    whatsapp: true,
    email: true,
  });

  // Initialize pre-composed clean message when modal opens or target changes
  useEffect(() => {
    if (singleItem) {
      const clinicText = singleItem.clinicName ? ` (${singleItem.clinicName})` : '';
      setMessage(
        `Hello ${singleItem.customerName}${clinicText},\n\nWe noticed you saved "${singleItem.productName}" in your BuyBright wishlist! 📦✨\n\nIs there any special clinic requirement, pricing assistance, or technical query we can help you with today?\n\nOrder online at BuyBright with fast doorstep delivery.\n\nBest regards,\nBuyBright Support Desk`
      );
    } else if (isBulk) {
      setMessage(
        `Hello Doctor,\n\nWe noticed you saved dental supplies in your BuyBright wishlist! 📦✨\n\nOur clinical order desk is ready to assist your clinic with priority delivery and special offers.\n\nBest regards,\nBuyBright Support Desk`
      );
    }
  }, [singleItem, isBulk]);

  if (!isOpen || targetItems.length === 0) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channels.whatsapp && !channels.email) {
      alert('Please select at least one delivery channel (WhatsApp or Email).');
      return;
    }

    onSendMessage(targetItems, message, channels);

    // If single recipient and WhatsApp channel selected, open direct WhatsApp chat
    if (singleItem && channels.whatsapp) {
      const cleanPhone = singleItem.customerPhone.replace(/[^0-9]/g, '');
      const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');
    }

    onClose();
  };

  return (
    <div className="wishlist-modal-overlay" onClick={onClose}>
      <div className="wishlist-modal-card message-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="wishlist-modal-header">
          <div className="header-title-wrap">
            <div className="header-icon-circle msg-icon-circle">
              <i className="fa-brands fa-whatsapp" />
            </div>
            <div>
              <h3 className="modal-heading">
                {isBulk ? `Message (${targetItems.length}) Doctors` : `Send Message to ${singleItem?.customerName}`}
              </h3>
              <span className="modal-subheading">
                {isBulk
                  ? `Dispatch outreach message to ${targetItems.length} selected wishlist doctors`
                  : `${singleItem?.customerPhone} • ${singleItem?.customerEmail}`}
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
            {/* Target Product Summary Banner */}
            {singleItem && (
              <div className="msg-target-mini-card">
                <img
                  src={singleItem.productImage || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=80&auto=format&fit=crop&q=60'}
                  alt={singleItem.productName}
                  className="mini-thumb"
                />
                <div className="mini-info">
                  <strong className="mini-name">{singleItem.productName}</strong>
                  <span className="mini-meta">
                    SKU: {singleItem.productSku} • Price: ₹{singleItem.productPrice.toLocaleString()} • {singleItem.stockStatus}
                  </span>
                </div>
              </div>
            )}

            {/* Editable Message Textarea */}
            <div className="message-composer-section">
              <label className="composer-label">
                <i className="fa-regular fa-comment-dots mr-1" /> Customer Outreach Message:
              </label>
              <textarea
                className="message-composer-textarea"
                rows={7}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message to the doctor here..."
                required
              />
            </div>

            {/* Delivery Channel Checkboxes (WhatsApp and Email) */}
            <div className="channels-selection-card">
              <label className="channels-card-label">Send Via:</label>
              <div className="channels-checkboxes-flex">
                <label className={`channel-pill-checkbox ${channels.whatsapp ? 'active' : ''}`}>
                  <input
                    type="checkbox"
                    checked={channels.whatsapp}
                    onChange={(e) => setChannels({ ...channels, whatsapp: e.target.checked })}
                  />
                  <i className="fa-brands fa-whatsapp channel-icon-wa" />
                  <span className="channel-txt">WhatsApp Message</span>
                </label>

                <label className={`channel-pill-checkbox ${channels.email ? 'active' : ''}`}>
                  <input
                    type="checkbox"
                    checked={channels.email}
                    onChange={(e) => setChannels({ ...channels, email: e.target.checked })}
                  />
                  <i className="fa-regular fa-envelope channel-icon-em" />
                  <span className="channel-txt">Email Notification</span>
                </label>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="wishlist-modal-footer">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-dispatch-msg">
              <i className="fa-brands fa-whatsapp mr-1" />
              {isBulk ? `Send to ${targetItems.length} Doctors` : 'Send Message Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
