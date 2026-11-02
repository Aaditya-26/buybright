/**
 * BuyBright Admin — Referral & Bonus Points Settings
 * Route: /admin/settings/referral
 */

import React, { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { useToast } from '../../../context/ToastContext';

const STORAGE_KEY = 'presto_referral_settings';

interface ReferralSettings {
  referralPoints: number | '';
  bonusPoints: number | '';
  orderPoints: number | '';
  pointsExpiry: number | '';
  expiryUnit: 'Days' | 'Months';
  isEnabled: boolean;
}

const DEFAULT: ReferralSettings = {
  referralPoints: 200,
  bonusPoints: 500,
  orderPoints: 15,
  pointsExpiry: 45,
  expiryUnit: 'Days',
  isEnabled: true,
};

function loadSettings(): ReferralSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return DEFAULT;
}

const S = {
  page: { padding: '24px', maxWidth: '900px', margin: '0 auto' } as React.CSSProperties,
  pageHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap' as const, gap: '12px' } as React.CSSProperties,
  headerLeft: { display: 'flex', alignItems: 'center', gap: '14px' } as React.CSSProperties,
  iconBox: { width: '46px', height: '46px', borderRadius: '12px', flexShrink: 0, background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' } as React.CSSProperties,
  card: { background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' } as React.CSSProperties,
  cardHead: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' } as React.CSSProperties,
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '18px' } as React.CSSProperties,
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '12px' } as React.CSSProperties,
  label: { display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '5px' } as React.CSSProperties,
  hint: { fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px', display: 'block' } as React.CSSProperties,
  req: { color: '#ef4444', marginLeft: '2px' } as React.CSSProperties,
  note: { background: '#fef9c3', border: '1px solid #fde047', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.83rem', fontWeight: 600, color: '#92400e', marginBottom: '20px' } as React.CSSProperties,
  toggleRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px', flexWrap: 'wrap' as const, gap: '10px' } as React.CSSProperties,
  saveBtn: { background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#fff', border: 'none', borderRadius: '10px', padding: '11px 28px', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 8px rgba(217,119,6,0.25)' } as React.CSSProperties,
};

export const ReferralSettingsPage: React.FC = () => {
  const { showToast } = useToast();
  const [form, setForm] = useState<ReferralSettings>(loadSettings);
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(p => ({ ...p, [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.referralPoints === '') { showToast('Referral Points is required.', 'danger'); return; }
    if (form.bonusPoints === '') { showToast('Bonus Points is required.', 'danger'); return; }
    if (form.orderPoints === '') { showToast('Order Points is required.', 'danger'); return; }
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
      setSaving(false);
      showToast('Referral & Points settings saved successfully!', 'success');
    }, 600);
  };

  const handleReset = () => { setForm(DEFAULT); showToast('Reset to defaults.', 'info'); };

  return (
    <AdminLayout title="Referral & Bonus Points Settings" subtitle="Configure customer rewards, referral points, and bonus conversion rules.">
      <div className="referral-settings-container">

        {/* Page Header */}
        <div className="referral-header-wrap">
          <div style={S.headerLeft}>
            <div style={S.iconBox}>
              <i className="fa-solid fa-coins" style={{ color: '#fff', fontSize: '1.2rem' }} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.22rem', fontWeight: 800, color: '#0f172a' }}>
                Referral & Bonus Points Settings
              </h1>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', marginTop: '3px' }}>
                Configure loyalty points for referrals, signups &amp; purchases
              </p>
            </div>
          </div>
          <button type="button" onClick={handleReset}
            style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '9px', padding: '9px 18px', fontSize: '0.83rem', fontWeight: 600, color: '#64748b', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <i className="fa-solid fa-rotate-left" /> Reset Defaults
          </button>
        </div>

        <form onSubmit={handleSave}>

          {/* Enable Toggle */}
          <div style={S.toggleRow}>
            <div>
              <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>
                <i className="fa-solid fa-toggle-on" style={{ color: form.isEnabled ? '#10b981' : '#94a3b8', marginRight: '8px' }} />
                Referral & Points Module
              </strong>
              <span style={{ display: 'block', fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>
                {form.isEnabled ? 'Customers can earn and redeem points' : 'Points module is currently disabled'}
              </span>
            </div>
            <select
              value={form.isEnabled ? 'Yes' : 'No'}
              onChange={e => setForm(p => ({ ...p, isEnabled: e.target.value === 'Yes' }))}
              className="form-control"
              style={{ width: '140px', fontWeight: 700, borderColor: form.isEnabled ? '#10b981' : undefined, background: form.isEnabled ? '#f0fdf9' : '#fff', color: form.isEnabled ? '#065f46' : '#334155' }}
            >
              <option value="Yes">Enabled</option>
              <option value="No">Disabled</option>
            </select>
          </div>

          {/* 1 Point = 1 Rs Note */}
          <div style={S.note}>
            <i className="fa-solid fa-circle-info" style={{ color: '#d97706', fontSize: '1.1rem', flexShrink: 0 }} />
            <span><strong>NOTE:</strong> 1 Point = ₹1 Rs. Points are automatically deducted from order total at checkout.</span>
          </div>

          {/* Referral Points Card */}
          <div style={S.card}>
            <div style={S.cardHead}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#fef9c3', border: '1px solid #fde047', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa-solid fa-user-plus" style={{ color: '#d97706', fontSize: '0.85rem' }} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>1. Referral Points</h3>
                <p style={{ margin: 0, fontSize: '0.74rem', color: '#94a3b8' }}>Points awarded when a referred user signs up or completes first purchase</p>
              </div>
            </div>

            <div className="referral-grid-2">
              <div>
                <label style={S.label}>
                  Referral Points <span style={S.req}>*</span>
                </label>
                <input type="number" name="referralPoints" value={form.referralPoints} onChange={handleChange}
                  min="0" placeholder="e.g. 200" className="form-control" style={{ width: '100%' }} required />
                <span style={S.hint}>Points given to <strong>referrer</strong> when friend signs up</span>
                {form.referralPoints !== '' && Number(form.referralPoints) > 0 && (
                  <span style={{ ...S.hint, color: '#d97706', fontWeight: 700, marginTop: 0 }}>≡ ₹{form.referralPoints} value per referral</span>
                )}
              </div>

              <div>
                <label style={S.label}>
                  Bonus Points <span style={S.req}>*</span>
                </label>
                <input type="number" name="bonusPoints" value={form.bonusPoints} onChange={handleChange}
                  min="0" placeholder="e.g. 500" className="form-control" style={{ width: '100%' }} required />
                <span style={S.hint}>Welcome bonus given to the <strong>new user</strong> on signup via referral</span>
                {form.bonusPoints !== '' && Number(form.bonusPoints) > 0 && (
                  <span style={{ ...S.hint, color: '#7c3aed', fontWeight: 700, marginTop: 0 }}>≡ ₹{form.bonusPoints} welcome bonus value</span>
                )}
              </div>
            </div>
          </div>

          {/* Order Points & Expiry Card */}
          <div style={S.card}>
            <div style={S.cardHead}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#f0fdf9', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa-solid fa-receipt" style={{ color: '#0d9488', fontSize: '0.85rem' }} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>2. Order Points & Expiry</h3>
                <p style={{ margin: 0, fontSize: '0.74rem', color: '#94a3b8' }}>Points earned on every order and validity period</p>
              </div>
            </div>

            <div className="referral-grid-2">
              <div>
                <label style={S.label}>
                  Order Points <span style={S.req}>*</span>
                </label>
                <input type="number" name="orderPoints" value={form.orderPoints} onChange={handleChange}
                  min="0" placeholder="e.g. 15" className="form-control" style={{ width: '100%' }} required />
                <span style={S.hint}>Points earned per ₹100 spent on an order</span>
                {form.orderPoints !== '' && Number(form.orderPoints) > 0 && (
                  <span style={{ ...S.hint, color: '#0d9488', fontWeight: 700, marginTop: 0 }}>= {form.orderPoints} pts per ₹100 order ≡ ₹{form.orderPoints} cashback</span>
                )}
              </div>

              <div>
                <label style={S.label}>
                  Points Expiry <span style={S.req}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <input type="number" name="pointsExpiry" value={form.pointsExpiry} onChange={handleChange}
                    min="1" placeholder="e.g. 45" className="form-control" style={{ flex: '1 1 120px' }} required />
                  <select name="expiryUnit" value={form.expiryUnit} onChange={handleChange}
                    className="form-control" style={{ width: '100px', flex: '0 0 auto' }}>
                    <option value="Days">Days</option>
                    <option value="Months">Months</option>
                  </select>
                </div>
                <span style={S.hint}>Points expire after {form.pointsExpiry || '—'} {form.expiryUnit} from date of earning</span>
              </div>
            </div>
          </div>
 

          {/* Actions */}
          <div className="referral-actions-row">
            <button type="button" onClick={handleReset}
              style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: '9px', padding: '10px 20px', fontSize: '0.83rem', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
              Reset
            </button>
            <button type="submit" style={S.saveBtn} disabled={saving}>
              {saving
                ? <><i className="fa-solid fa-spinner fa-spin" /> Saving...</>
                : <><i className="fa-solid fa-floppy-disk" /> Save Referral Settings</>
              }
            </button>
          </div>

        </form>
      </div>
    </AdminLayout>
  );
};

export default ReferralSettingsPage;
