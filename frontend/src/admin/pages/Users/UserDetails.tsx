/**
 * BuyBright Admin User Details Component / View.
 * Displays comprehensive verification, license, and dental ordering statistics for a doctor/clinic.
 */

import React from 'react';
import type { AdminUser } from '../../types/user';
import { Modal } from '../../components/Modal';

interface UserDetailsProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (id: string, newStatus: AdminUser['status']) => void;
}

export const UserDetails: React.FC<UserDetailsProps> = ({
  user,
  isOpen,
  onClose,
  onStatusChange,
}) => {
  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Doctor Profile: ${user.doctorName}`}
      maxWidth="680px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748b', marginRight: '8px' }}>Status:</span>
            <select
              value={user.status}
              onChange={(e) => onStatusChange && onStatusChange(user.id, e.target.value as AdminUser['status'])}
              className="table-filter-select"
              style={{ padding: '4px 10px', fontSize: '0.8rem' }}
            >
              <option value="Verified">Verified Doctor</option>
              <option value="Pending Verification">Pending Verification</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
          <button type="button" onClick={onClose} className="btn-admin-primary">
            Done
          </button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Header Summary */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            background: '#f8fafc',
            padding: '16px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: '#0d9488',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.2rem',
            }}
          >
            {user.doctorName.replace('  ', '').slice(0, 2).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: '#0f172a' }}>{user.doctorName}</h4>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
              <i className="fa-solid fa-hospital" style={{ color: '#0d9488', marginRight: '6px' }} />
              {user.clinicName}
            </p>
          </div>
          <span
            className={`admin-badge ${
              user.status === 'Verified'
                ? 'badge-in-stock'
                : user.status === 'Pending Verification'
                ? 'badge-processing'
                : 'badge-cancelled'
            }`}
          >
            {user.status}
          </span>
        </div>

        {/* Doctor Accreditation Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              DCI Dental Registration #
            </span>
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem', marginTop: '4px' }}>
              {user.dciRegistrationNo}
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              GSTIN Tax Identification
            </span>
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem', marginTop: '4px' }}>
              {user.gstin || 'Not Registered (Unregistered Clinic)'}
            </div>
          </div>
        </div>

        {/* Financial & Loyalty Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <div style={{ background: '#f0fdfa', border: '1px solid #ccfbf1', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#0f766e', fontWeight: 600 }}>Lifetime Spend</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f766e', marginTop: '2px' }}>
              ₹{user.totalSpent.toLocaleString('en-IN')}
            </div>
          </div>

          <div style={{ background: '#eff6ff', border: '1px solid #dbeafe', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#1d4ed8', fontWeight: 600 }}>Total Orders</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1d4ed8', marginTop: '2px' }}>
              {user.totalOrders}
            </div>
          </div>

          <div style={{ background: '#faf5ff', border: '1px solid #f3e8ff', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#7e22ce', fontWeight: 600 }}>Bright Points</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#7e22ce', marginTop: '2px' }}>
              {user.brightPointsBalance} pts
            </div>
          </div>
        </div>

        {/* Contact and Practice Location */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
          <h5 style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#334155', fontWeight: 700 }}>
            Practice Contact &amp; Shipping Location
          </h5>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.82rem' }}>
            <div>
              <span style={{ color: '#64748b' }}>Email: </span>
              <strong style={{ color: '#0f172a' }}>{user.email}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Phone: </span>
              <strong style={{ color: '#0f172a' }}>+91 {user.phone}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>City / State: </span>
              <strong style={{ color: '#0f172a' }}>{user.city}, {user.state}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Member Since: </span>
              <strong style={{ color: '#0f172a' }}>{user.joinedDate}</strong>
            </div>
          </div>
          {user.address && (
            <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #f1f5f9', fontSize: '0.82rem' }}>
              <span style={{ color: '#64748b' }}>Full Address: </span>
              <span style={{ color: '#334155' }}>{user.address}</span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default UserDetails;
