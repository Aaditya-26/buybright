/**
 * Modal Component.
 * Generic accessible modal popup dialog with backdrop blur and escape key listener.
 * Fully responsive with sticky header, scrollable body (minHeight: 0), and pinned footer.
 */

import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = '580px',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}
      onClick={onClose}
      role="presentation"
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '14px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '100%',
          maxWidth,
          maxHeight: 'calc(100vh - 32px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          margin: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-dialog-title"
      >
        {/* Sticky Modal Header */}
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            background: '#ffffff',
          }}
        >
          <h3 id="admin-dialog-title" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.1rem',
              color: '#64748b',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
            }}
            aria-label="Close dialog"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Scrollable Modal Body (minHeight: 0 is required for flex child to scroll properly) */}
        <div
          style={{
            padding: '20px',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            flex: '1 1 auto',
            minHeight: 0,
          }}
        >
          {children}
        </div>

        {/* Sticky Pinned Modal Footer */}
        {footer && (
          <div
            style={{
              padding: '12px 20px',
              borderTop: '1px solid #e2e8f0',
              background: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
