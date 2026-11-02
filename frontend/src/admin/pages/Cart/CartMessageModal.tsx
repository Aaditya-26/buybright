/**
 * BuyBright Admin — Cart Messaging & Recovery Outreach Modal.
 * Dispatches targeted WhatsApp and Email cart abandonment recovery reminders.
 */

import React, { useState, useEffect } from 'react';
import { AdminCart } from '../../types/cart';

interface CartMessageModalProps {
  targets: AdminCart[];
  isOpen: boolean;
  onClose: () => void;
  onSendSuccess: (
    targets: AdminCart[],
    message: string,
    channels: { whatsapp: boolean; email: boolean }
  ) => void;
}

export const CartMessageModal: React.FC<CartMessageModalProps> = ({
  targets,
  isOpen,
  onClose,
  onSendSuccess,
}) => {
  const [sendWhatsApp, setSendWhatsApp] = useState(true);
  const [sendEmail, setSendEmail] = useState(true);
  const [templateType, setTemplateType] = useState<'discount' | 'reminder' | 'stock'>('discount');
  const [discountCode, setDiscountCode] = useState('RECOVER5');
  const [discountPercent, setDiscountPercent] = useState('5');
  const [customMessage, setCustomMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isBulk = targets.length > 1;
  const singleTarget = targets.length === 1 ? targets[0] : null;

  // Generate dynamic message content based on selected template
  useEffect(() => {
    if (!isOpen) return;

    const customerName = singleTarget ? singleTarget.customerName : 'Doctor / Clinic Partner';
    const clinicName = singleTarget ? singleTarget.clinicName : 'your dental clinic';
    const firstProduct = singleTarget?.items[0]?.productName || 'your selected dental supplies';
    const cartId = singleTarget ? singleTarget.id : 'your BuyBright Cart';

    if (templateType === 'discount') {
      setCustomMessage(
        `Dear ${customerName},\n\nWe noticed you left ${firstProduct} and other items in ${cartId} for ${clinicName}.\n\nComplete your order today and get an extra ${discountPercent}% OFF using promo code: *${discountCode}* at checkout!\n\n🛒 Click to complete checkout: https://prestodental.in/cart?resume=${singleTarget?.id || 'recovery'}\n\nBuyBright Support Team`
      );
    } else if (templateType === 'reminder') {
      setCustomMessage(
        `Hello ${customerName},\n\nYour dental supply order for ${clinicName} is saved in ${cartId}. Need any assistance with GST invoicing, product variants, or bulk shipping?\n\nOur dental supply specialist is available to help you right now.\n\nBuyBright Customer Care`
      );
    } else if (templateType === 'stock') {
      setCustomMessage(
        `⚠️ Urgent Stock Alert for ${customerName}:\n\nItems in ${cartId} (${firstProduct}) are running low on warehouse stock due to heavy festival demand.\n\nReserve your stock by completing your order now:\nhttps://prestodental.in/cart\n\nBuyBright Warehouse Logistics`
      );
    }
  }, [templateType, discountCode, discountPercent, singleTarget, isOpen]);

  if (!isOpen || targets.length === 0) return null;

  const handleSend = () => {
    if (!sendWhatsApp && !sendEmail) {
      alert('Please select at least one channel (WhatsApp or Email).');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // If single customer and WhatsApp is enabled, trigger direct WhatsApp Web
      if (singleTarget && sendWhatsApp) {
        const cleanPhone = singleTarget.customerPhone.replace(/[^0-9]/g, '');
        const encoded = encodeURIComponent(customMessage);
        window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
      }

      onSendSuccess(targets, customMessage, {
        whatsapp: sendWhatsApp,
        email: sendEmail,
      });

      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div
        className="admin-modal-container cart-message-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="admin-modal-header">
          <div className="modal-title-with-badge">
            <div className="msg-header-icon">
              <i className="fa-solid fa-paper-plane" />
            </div>
            <div>
              <h3 className="modal-title">
                {isBulk
                  ? `Dispatch Cart Recovery (${targets.length} Doctors)`
                  : `Cart Recovery Outreach &bull; ${singleTarget?.customerName}`}
              </h3>
              <p className="modal-subtitle">
                {isBulk
                  ? `Sending multi-channel cart abandonment messages to ${targets.length} selected clinic carts`
                  : `Cart ID: ${singleTarget?.id} &bull; ${singleTarget?.clinicName}`}
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Body */}
        <div className="admin-modal-body">
          {/* Target Summary Strip */}
          <div className="msg-target-summary-strip">
            <div className="strip-col">
              <span className="strip-lbl">Total Recipients</span>
              <strong className="strip-val">{targets.length} Cart{targets.length > 1 ? 's' : ''}</strong>
            </div>
            <div className="strip-col">
              <span className="strip-lbl">Total Recovery Potential</span>
              <strong className="strip-val text-teal">
                ₹{targets.reduce((acc, c) => acc + c.cartValue, 0).toLocaleString()}
              </strong>
            </div>
            <div className="strip-col">
              <span className="strip-lbl">Primary Product</span>
              <strong className="strip-val text-truncate-1">
                {singleTarget?.items[0]?.productName || `${targets.length} Carts Selected`}
              </strong>
            </div>
          </div>

          {/* Outreach Channel Checkboxes */}
          <div className="msg-field-group mt-3">
            <label className="field-label">Delivery Channels</label>
            <div className="channel-checkboxes-row">
              <label className={`channel-checkbox-card ${sendWhatsApp ? 'active' : ''}`}>
                <input
                  type="checkbox"
                  checked={sendWhatsApp}
                  onChange={(e) => setSendWhatsApp(e.target.checked)}
                />
                <i className="fa-brands fa-whatsapp channel-icon wa" />
                <div className="channel-text">
                  <strong>WhatsApp Messaging</strong>
                  <span>Instant notification to mobile</span>
                </div>
              </label>

              <label className={`channel-checkbox-card ${sendEmail ? 'active' : ''}`}>
                <input
                  type="checkbox"
                  checked={sendEmail}
                  onChange={(e) => setSendEmail(e.target.checked)}
                />
                <i className="fa-regular fa-envelope channel-icon email" />
                <div className="channel-text">
                  <strong>Email Notification</strong>
                  <span>Send detailed cart breakdown</span>
                </div>
              </label>
            </div>
          </div>

          {/* Template Selection */}
          <div className="msg-field-group mt-3">
            <label className="field-label">Select Recovery Template</label>
            <div className="template-pills-row">
              <button
                type="button"
                className={`template-pill ${templateType === 'discount' ? 'active' : ''}`}
                onClick={() => setTemplateType('discount')}
              >
                <i className="fa-solid fa-tag mr-1" /> Special Discount Incentive
              </button>
              <button
                type="button"
                className={`template-pill ${templateType === 'reminder' ? 'active' : ''}`}
                onClick={() => setTemplateType('reminder')}
              >
                <i className="fa-solid fa-bell mr-1" /> Friendly Cart Reminder
              </button>
              <button
                type="button"
                className={`template-pill ${templateType === 'stock' ? 'active' : ''}`}
                onClick={() => setTemplateType('stock')}
              >
                <i className="fa-solid fa-fire mr-1" /> Low Stock Urgency Alert
              </button>
            </div>
          </div>

          {/* Optional Coupon Settings (Only for discount template) */}
          {templateType === 'discount' && (
            <div className="coupon-config-row mt-3">
              <div className="config-item">
                <label className="sub-lbl">Promo Coupon Code</label>
                <div className="coupon-input-wrap">
                  <i className="fa-solid fa-ticket input-icon" />
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                    className="admin-form-input"
                    placeholder="e.g. RECOVER5"
                  />
                </div>
              </div>

              <div className="config-item">
                <label className="sub-lbl">Discount Percentage</label>
                <div className="coupon-input-wrap">
                  <i className="fa-solid fa-percent input-icon" />
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    className="admin-form-input"
                    placeholder="5"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Message Textarea */}
          <div className="msg-field-group mt-3">
            <label className="field-label">Customizable Message Preview</label>
            <textarea
              rows={6}
              className="admin-form-textarea msg-content-box"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
            />
            <span className="field-hint">
              <i className="fa-solid fa-circle-info mr-1 text-muted" />
              Dynamic tokens like doctor name and cart ID will be automatically personalized.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="admin-modal-footer">
          <button type="button" className="btn-admin-outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-admin-primary btn-dispatch-msg"
            onClick={handleSend}
            disabled={isSubmitting || (!sendWhatsApp && !sendEmail)}
          >
            {isSubmitting ? (
              <>
                <i className="fa-solid fa-spinner fa-spin mr-1" /> Dispatching...
              </>
            ) : (
              <>
                <i className="fa-solid fa-paper-plane mr-1" />
                {isBulk ? `Send to ${targets.length} Carts` : 'Send Recovery Message'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
