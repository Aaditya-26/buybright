/**
 * BuyBright Admin — Customer Profile & Referral Details Modal.
 */

import React from 'react';
import type { AdminCustomer } from '../../types/customer';
import { Modal } from '../../components/Modal';
import { useToast } from '../../../context/ToastContext';

interface CustomerDetailsModalProps {
  customer: AdminCustomer | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({
  customer,
  isOpen,
  onClose,
}) => {
  const { showToast } = useToast();

  if (!customer) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(customer.referralCode);
    showToast(`Referral Code "${customer.referralCode}" copied to clipboard!`, 'success');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Customer Profile: ${customer.name}`}
      maxWidth="780px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <button
            type="button"
            onClick={handleCopyCode}
            className="btn-admin-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <i className="fa-solid fa-copy" style={{ color: '#0d9488' }} /> Copy Referral Code
          </button>
          <button type="button" onClick={onClose} className="btn-admin-primary">
            Close Window
          </button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Header summary card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #f0fdfa, #f8fafc)',
            padding: '16px 20px',
            borderRadius: '12px',
            border: '1.5px solid #ccfbf1',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#0d9488',
                color: '#fff',
                fontSize: '1.1rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(13,148,136,0.3)',
              }}
            >
              {customer.avatar || customer.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                CUSTOMER ID: <strong style={{ color: '#0f172a' }}>{customer.customerId}</strong>
              </div>
              <h3 style={{ margin: '2px 0 0 0', fontSize: '1.25rem', color: '#0f172a', fontWeight: 800 }}>
                {customer.name}
              </h3>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                background: '#fff',
                border: '1px solid #fde68a',
                padding: '6px 14px',
                borderRadius: '10px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.68rem', color: '#b45309', fontWeight: 700, textTransform: 'uppercase' }}>
                Bright Points
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#d97706' }}>
                ⭐ {customer.brightPoints} pts
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Info: Contact & Referral Info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
          
          {/* Contact & Address */}
          <div style={{ background: '#fff', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#0d9488' }}>
              <i className="fa-solid fa-address-card" />
              <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>Contact &amp; Clinic Address</strong>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Email Address</span>
                <strong style={{ color: '#0f172a' }}>{customer.email}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Phone Number</span>
                <strong style={{ color: '#0f172a' }}>{customer.phone}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Full Registered Address</span>
                <span style={{ color: '#334155', lineHeight: 1.4 }}>{customer.address}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Registration Date &amp; Time</span>
                <strong style={{ color: '#0f172a' }}>{customer.registeredDate}</strong>
              </div>
            </div>
          </div>

          {/* Referral Network Breakdown */}
          <div style={{ background: '#fff', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#6366f1' }}>
              <i className="fa-solid fa-network-wired" />
              <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>Referral &amp; Loyalty Data</strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem' }}>
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', fontSize: '0.74rem', display: 'block' }}>Customer's Unique Referral Code</span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                  <code style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0d9488', letterSpacing: '0.5px' }}>
                    {customer.referralCode}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: '#0d9488',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                    }}
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Referred By Clinician</span>
                <div style={{ fontWeight: 700, color: customer.referredBy !== '—' ? '#0f172a' : '#94a3b8', marginTop: '2px' }}>
                  {customer.referredBy !== '—' ? (
                    <span>
                      <i className="fa-solid fa-user-doctor" style={{ marginRight: '6px', color: '#0d9488' }} />
                      {customer.referredBy}
                    </span>
                  ) : (
                    'Direct Registration (No Referral)'
                  )}
                </div>
              </div>

              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Referral Contact Email</span>
                <span style={{ color: customer.referralEmail !== '—' ? '#0f172a' : '#94a3b8', fontWeight: 600 }}>
                  {customer.referralEmail}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 600 }}>Lifetime Orders</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#16a34a' }}>{customer.totalOrders}</div>
                </div>
                <div style={{ background: '#f0fdfa', border: '1px solid #99f6e4', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: '#0f766e', fontWeight: 600 }}>Lifetime Spend</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0d9488' }}>₹{customer.totalSpent.toLocaleString('en-IN')}</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </Modal>
  );
};
