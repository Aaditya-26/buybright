/**
 * BuyBright Admin — Customers Management Page.
 * Displays customer directory, referral tree tracking, and loyalty Bright Points ledger.
 * Table Columns: Sr. No. | Customers ID | Referred By | Referral Email ID | Bright Points | Referral Code | Name | Email ID | Phone No. | Address | Registered Date | Action
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { DataTable, type Column } from '../../components/DataTable';
import { SearchBar } from '../../components/SearchBar';
import { getCustomers } from '../../data/customersData';
import type { AdminCustomer } from '../../types/customer';
import { CustomerDetailsModal } from './CustomerDetailsModal';
import { useToast } from '../../../context/ToastContext';
import { exportTableToPDF } from '../../utils/exportPdf';
import { exportTableToCSV } from '../../utils/exportCsv';

export const CustomerList: React.FC = () => {
  const { showToast } = useToast();

  const [customers] = useState<AdminCustomer[]>(() => getCustomers());
  const [searchQuery, setSearchQuery] = useState('');
  const [referralFilter, setReferralFilter] = useState<'All' | 'With Referral' | 'Direct'>('All');

  // Selected customer for Profile Modal
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtered customer list
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        c.customerId.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.referralCode.toLowerCase().includes(q) ||
        c.referredBy.toLowerCase().includes(q) ||
        c.referralEmail.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q);

      const hasReferral = c.referredBy && c.referredBy !== '—';
      const matchReferral =
        referralFilter === 'All' ||
        (referralFilter === 'With Referral' && hasReferral) ||
        (referralFilter === 'Direct' && !hasReferral);

      return matchSearch && matchReferral;
    });
  }, [customers, searchQuery, referralFilter]);

  const handleOpenDetails = (cust: AdminCustomer) => {
    setSelectedCustomer(cust);
    setIsModalOpen(true);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`Referral Code "${code}" copied to clipboard!`, 'success');
  };

  // ── Export to CSV ───────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    if (filteredCustomers.length === 0) {
      showToast('No customer records available to export.', 'warning');
      return;
    }

    exportTableToCSV({
      filename: `BuyBright_Customers_${new Date().toISOString().split('T')[0]}`,
      headers: [
        'Sr. No.',
        'Customers ID',
        'Referred By',
        'Referral Email ID',
        'Bright Points',
        'Referral Code',
        'Name',
        'Email ID',
        'Phone No.',
        'Address',
        'Registered Date',
      ],
      rows: filteredCustomers.map((c, idx) => [
        idx + 1,
        c.customerId,
        c.referredBy,
        c.referralEmail,
        c.brightPoints,
        c.referralCode,
        c.name,
        c.email,
        c.phone,
        c.address,
        c.registeredDate,
      ]),
    });
    showToast('Customers spreadsheet (.CSV) exported successfully.', 'success');
  };

  // ── Export to PDF ───────────────────────────────────────────────────────────
  const handleExportPDF = () => {
    if (filteredCustomers.length === 0) {
      showToast('No customer records available to export.', 'warning');
      return;
    }

    exportTableToPDF({
      title: 'BuyBright Customer & Referral Directory',
      subtitle: `Official Customer Master List (${filteredCustomers.length} registered clinicians)`,
      headers: [
        'Sr.',
        'Customer ID',
        'Name',
        'Referred By',
        'Bright Points',
        'Referral Code',
        'Email ID',
        'Phone No.',
        'Registered Date',
      ],
      rows: filteredCustomers.map((c, idx) => [
        idx + 1,
        c.customerId,
        c.name,
        c.referredBy,
        `${c.brightPoints} pts`,
        c.referralCode,
        c.email,
        c.phone,
        c.registeredDate,
      ]),
    });
    showToast('Customer directory PDF report generated successfully.', 'success');
  };

  // Metrics summary
  const totalPoints = useMemo(() => customers.reduce((acc, c) => acc + c.brightPoints, 0), [customers]);
  const withReferralCount = useMemo(() => customers.filter((c) => c.referredBy && c.referredBy !== '—').length, [customers]);

  const stats = [
    { label: 'Total Customers', value: customers.length, icon: 'fa-solid fa-users', color: '#0d9488', bg: '#f0fdfa', border: '#ccfbf1' },
    { label: 'Referred Customers', value: withReferralCount, icon: 'fa-solid fa-user-plus', color: '#6366f1', bg: '#eef2ff', border: '#e0e7ff' },
    { label: 'Total Bright Points', value: `⭐ ${totalPoints.toLocaleString('en-IN')}`, icon: 'fa-solid fa-coins', color: '#d97706', bg: '#fffbeb', border: '#fef3c7' },
    { label: 'Active Dental Clinics', value: customers.filter((c) => c.clinicName).length, icon: 'fa-solid fa-hospital', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  ];

  // ── 11 Requested Table Columns + Action ────────────────────────────────────
  const columns: Column<AdminCustomer>[] = [
    // 1. Sr. No.
    {
      key: 'srNo',
      header: 'Sr. No.',
      width: '64px',
      render: (_, index) => (
        <div style={{ textAlign: 'center' }}>
          <span
            style={{
              display: 'inline-block',
              fontWeight: 700,
              color: '#475569',
              fontSize: '0.8rem',
              background: '#f1f5f9',
              padding: '2px 8px',
              borderRadius: '6px',
            }}
          >
            {(index ?? 0) + 1}
          </span>
        </div>
      ),
    },

    // 2. Customers ID
    {
      key: 'customerId',
      header: 'Customers ID',
      width: '120px',
      render: (c) => (
        <span
          style={{
            fontFamily: 'Consolas, monospace',
            fontSize: '0.78rem',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            padding: '3px 8px',
            borderRadius: '5px',
            color: '#0f172a',
            fontWeight: 800,
            whiteSpace: 'nowrap',
          }}
        >
          {c.customerId}
        </span>
      ),
    },

    // 3. Referred By
    {
      key: 'referredBy',
      header: 'Referred By',
      minWidth: '150px',
      render: (c) => (
        <div>
          {c.referredBy && c.referredBy !== '—' ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#f5f3ff', border: '1px solid #ddd6fe', padding: '2px 8px', borderRadius: '6px', color: '#6d28d9', fontSize: '0.76rem', fontWeight: 700 }}>
              <i className="fa-solid fa-user-doctor" style={{ fontSize: '0.7rem' }} />
              <span>{c.referredBy}</span>
            </div>
          ) : (
            <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic' }}>— Direct</span>
          )}
        </div>
      ),
    },

    // 4. Referral Email ID
    {
      key: 'referralEmail',
      header: 'Referral Email ID',
      minWidth: '160px',
      render: (c) => (
        <div style={{ fontSize: '0.78rem', color: c.referralEmail !== '—' ? '#334155' : '#94a3b8' }}>
          {c.referralEmail !== '—' ? (
            <a href={`mailto:${c.referralEmail}`} style={{ color: '#0d9488', textDecoration: 'none' }}>
              {c.referralEmail}
            </a>
          ) : (
            '—'
          )}
        </div>
      ),
    },

    // 5. Bright Points
    {
      key: 'brightPoints',
      header: 'Bright Points',
      width: '120px',
      render: (c) => (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: '#fffbeb',
            border: '1px solid #fde68a',
            padding: '3px 8px',
            borderRadius: '6px',
            color: '#b45309',
            fontSize: '0.78rem',
            fontWeight: 800,
          }}
        >
          <span>⭐</span>
          <span>{c.brightPoints.toLocaleString('en-IN')} pts</span>
        </div>
      ),
    },

    // 6. Referral Code
    {
      key: 'referralCode',
      header: 'Referral Code',
      width: '140px',
      render: (c) => (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <code
            style={{
              fontFamily: 'Consolas, monospace',
              fontSize: '0.76rem',
              background: '#f0fdfa',
              border: '1px solid #99f6e4',
              padding: '2px 6px',
              borderRadius: '4px',
              color: '#0f766e',
              fontWeight: 800,
            }}
          >
            {c.referralCode}
          </code>
          <button
            type="button"
            title="Copy Referral Code"
            onClick={() => handleCopyCode(c.referralCode)}
            style={{
              border: 'none',
              background: 'none',
              color: '#0d9488',
              cursor: 'pointer',
              fontSize: '0.75rem',
              padding: '2px 4px',
            }}
          >
            <i className="fa-solid fa-copy" />
          </button>
        </div>
      ),
    },

    // 7. Name
    {
      key: 'name',
      header: 'Name',
      minWidth: '170px',
      render: (c) => (
        <div>
          <Link
            to={`/admin/customers/${c.id}`}
            title={`View 360 Profile & Analytics for ${c.name}`}
            style={{
              color: '#0f172a',
              fontWeight: 800,
              fontSize: '0.86rem',
              textDecoration: 'none',
              display: 'block',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#0d9488';
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#0f172a';
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            {c.name}
          </Link>
        </div>
      ),
    },

    // 8. Email ID
    {
      key: 'email',
      header: 'Email ID',
      minWidth: '160px',
      render: (c) => (
        <a href={`mailto:${c.email}`} style={{ color: '#0d9488', fontSize: '0.78rem', textDecoration: 'none' }}>
          {c.email}
        </a>
      ),
    },

    // 9. Phone No.
    {
      key: 'phone',
      header: 'Phone No.',
      minWidth: '120px',
      render: (c) => (
        <span style={{ fontSize: '0.78rem', color: '#334155', fontWeight: 600 }}>
          {c.phone}
        </span>
      ),
    },

    // 10. Address
    {
      key: 'address',
      header: 'Address',
      minWidth: '220px',
      render: (c) => (
        <div style={{ fontSize: '0.76rem', color: '#475569', lineHeight: 1.3, maxWidth: '240px' }} title={c.address}>
          {c.address.length > 55 ? `${c.address.slice(0, 55)}…` : c.address}
        </div>
      ),
    },

    // 11. Registered Date
    {
      key: 'registeredDate',
      header: 'Registered Date',
      minWidth: '140px',
      render: (c) => (
        <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
          <i className="fa-regular fa-calendar" style={{ marginRight: '4px', color: '#94a3b8' }} />
          {c.registeredDate}
        </div>
      ),
    },

    // Action (View Profile Page / Modal)
    {
      key: 'action',
      header: 'Action',
      width: '90px',
      render: (c) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <Link
            to={`/admin/customers/${c.id}`}
            title="Open Full 360 Profile & Analytics"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '7px',
              border: '1px solid #0d9488',
              background: '#f0fdfa',
              color: '#0d9488',
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#0d9488';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f0fdfa';
              e.currentTarget.style.color = '#0d9488';
            }}
          >
            <i className="fa-solid fa-user-gear" />
          </Link>
          <button
            type="button"
            title="Quick View Modal"
            onClick={() => handleOpenDetails(c)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '7px',
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              color: '#475569',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e2e8f0';
              e.currentTarget.style.color = '#0f172a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.color = '#475569';
            }}
          >
            <i className="fa-solid fa-eye" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Customer Management"
      subtitle={`Directory of ${customers.length} registered dental practitioners, loyalty Bright Points, and referral trees`}
    >
      {/* ── Stat Summary Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px', marginBottom: '18px' }}>
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: s.bg,
              border: `1px solid ${s.border}`,
              borderRadius: '12px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: `${s.color}18`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <i className={s.icon} style={{ fontSize: '1.1rem', color: s.color }} />
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: s.color, lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, marginTop: '3px' }}>
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter & Search Action Bar ── */}
      <div className="admin-card" style={{ marginBottom: '16px', padding: '14px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          
          {/* Search bar */}
          <div style={{ flex: 1, minWidth: '260px' }}>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by ID, name, email, phone, referral code, referred by..."
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Filter:</span>
            {(['All', 'With Referral', 'Direct'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setReferralFilter(mode)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: referralFilter === mode ? '1.5px solid #0d9488' : '1px solid #cbd5e1',
                  background: referralFilter === mode ? '#f0fdfa' : '#ffffff',
                  color: referralFilter === mode ? '#0d9488' : '#64748b',
                  transition: 'all 0.15s ease',
                }}
              >
                {mode === 'All' ? `All (${customers.length})` : mode === 'With Referral' ? `With Referral (${withReferralCount})` : `Direct (${customers.length - withReferralCount})`}
              </button>
            ))}
          </div>

          {/* Export Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={handleExportCSV}
              className="btn-admin-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '6px 12px' }}
            >
              <i className="fa-solid fa-file-excel" style={{ color: '#16a34a' }} /> Export CSV
            </button>
            <button
              type="button"
              onClick={handleExportPDF}
              className="btn-admin-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '6px 12px' }}
            >
              <i className="fa-solid fa-file-pdf" style={{ color: '#ef4444' }} /> Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* ── Customers Data Table ── */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <DataTable<AdminCustomer>
          columns={columns}
          data={filteredCustomers}
          keyExtractor={(c) => c.id}
          emptyMessage="No customer records match your filter criteria."
        />
      </div>

      {/* ── Customer Details Modal ── */}
      <CustomerDetailsModal
        customer={selectedCustomer}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCustomer(null);
        }}
      />
    </AdminLayout>
  );
};

export default CustomerList;
