/**
 * BuyBright Floating Toast Notifications Component.
 * Displays interactive alerts when items are added to cart or actions trigger.
 */

import React from 'react';
import { useToast } from '../../context/ToastContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="pd-toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`pd-toast ${toast.type}`}>
          <div className="toast-icon" style={{ marginTop: '2px' }}>
            {toast.type === 'success' && (
              <i className="fa-solid fa-circle-check" style={{ color: '#10B981', fontSize: '16px' }} />
            )}
            {toast.type === 'danger' && (
              <i className="fa-solid fa-circle-exclamation" style={{ color: '#EF4444', fontSize: '16px' }} />
            )}
            {toast.type === 'info' && (
              <i className="fa-solid fa-circle-info" style={{ color: '#32A7B9', fontSize: '16px' }} />
            )}
            {toast.type === 'warning' && (
              <i className="fa-solid fa-triangle-exclamation" style={{ color: '#F59E0B', fontSize: '16px' }} />
            )}
          </div>
          <div style={{ flex: 1 }}>
            {toast.title && <div className="pd-toast-title">{toast.title}</div>}
            <div className="pd-toast-msg">{toast.message}</div>
          </div>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '0 4px',
              fontSize: '14px',
            }}
            aria-label="Close notification"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
      ))}
    </div>
  );
};
