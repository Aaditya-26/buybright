/**
 * BuyBright Admin — Customer Wallet Directory Page.
 * Displays all customer wallet accounts, current balance, last update, and direct navigation to transaction ledger.
 * Table Columns: Sr. No. | Action (View Details) | Customer Name | Email | Phone | Wallet Balance | Last Update
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { DataTable, type Column } from '../../components/DataTable';
import { SearchBar } from '../../components/SearchBar';
import { getWallets } from '../../data/walletData';
import type { AdminCustomerWallet } from '../../types/wallet';
import { useToast } from '../../../context/ToastContext';
import { exportTableToPDF } from '../../utils/exportPdf';
import { exportTableToCSV } from '../../utils/exportCsv';

export const WalletList: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [wallets] = useState<AdminCustomerWallet[]>(() => getWallets());
  const [searchQuery, setSearchQuery] = useState('');
  const [balanceFilter, setBalanceFilter] = useState<'All' | 'Positive' | 'Zero'>('All');

  // Filtered wallets
  const filteredWallets = useMemo(() => {
    return wallets.filter((w) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        w.customerName.toLowerCase().includes(q) ||
        w.email.toLowerCase().includes(q) ||
        w.phone.toLowerCase().includes(q) ||
        w.customerId.toLowerCase().includes(q) ||
        (w.clinicName && w.clinicName.toLowerCase().includes(q));

      const matchBalance =
        balanceFilter === 'All' ||
        (balanceFilter === 'Positive' && w.walletBalance > 0) ||
        (balanceFilter === 'Zero' && w.walletBalance === 0);

      return matchSearch && matchBalance;
    });
  }, [wallets, searchQuery, balanceFilter]);

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredWallets.length === 0) {
      showToast('No wallet records available to export.', 'warning');
      return;
    }

    exportTableToCSV({
      filename: `BuyBright_Customer_Wallets_${new Date().toISOString().split('T')[0]}`,
      headers: [
        'Sr. No.',
        'Customer ID',
        'Customer Name',
        'Email',
        'Phone',
        'Wallet Balance (INR)',
        'Total Credited (INR)',
        'Total Debited (INR)',
        'Last Update',
      ],
      rows: filteredWallets.map((w, idx) => [
        idx + 1,
        w.customerId,
        w.customerName,
        w.email,
        w.phone,
        w.walletBalance,
        w.totalCredited,
        w.totalDebited,
        w.lastUpdate,
      ]),
    });
    showToast('Wallet records exported to CSV successfully.', 'success');
  };

  // Export to PDF
  const handleExportPDF = () => {
    if (filteredWallets.length === 0) {
      showToast('No wallet records available to export.', 'warning');
      return;
    }

    exportTableToPDF({
      title: 'BuyBright Customer Wallet Directory',
      subtitle: `Master Balance Ledger (${filteredWallets.length} customer wallets)`,
      headers: ['Sr.', 'Customer Name', 'Email', 'Phone', 'Wallet Balance', 'Last Update'],
      rows: filteredWallets.map((w, idx) => [
        idx + 1,
        w.customerName,
        w.email,
        w.phone,
        `₹${w.walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
        w.lastUpdate,
      ]),
    });
    showToast('Wallet report generated in PDF format.', 'success');
  };

  // Metrics
  const totalBalance = useMemo(() => wallets.reduce((acc, w) => acc + w.walletBalance, 0), [wallets]);
  const totalCredited = useMemo(() => wallets.reduce((acc, w) => acc + w.totalCredited, 0), [wallets]);
  const totalDebited = useMemo(() => wallets.reduce((acc, w) => acc + w.totalDebited, 0), [wallets]);

  const stats = [
    { label: 'Total Customer Wallets', value: wallets.length, icon: 'fa-solid fa-wallet', color: '#0d9488', bg: '#f0fdfa', border: '#ccfbf1' },
    { label: 'Total Wallet Balance', value: `₹${totalBalance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, icon: 'fa-solid fa-indian-rupee-sign', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
    { label: 'Total Lifetime Credits', value: `₹${totalCredited.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, icon: 'fa-solid fa-circle-arrow-down', color: '#6366f1', bg: '#eef2ff', border: '#e0e7ff' },
    { label: 'Total Redemptions (Debits)', value: `₹${totalDebited.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, icon: 'fa-solid fa-circle-arrow-up', color: '#ea580c', bg: '#fff7ed', border: '#ffedd5' },
  ];

  // Table Columns
  const columns: Column<AdminCustomerWallet>[] = [
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

    // 2. Action (View Button opening the wallet detail page)
    {
      key: 'action',
      header: 'Action',
      width: '90px',
      render: (w) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button
            type="button"
            title="View Wallet Ledger & Credit Balance"
            onClick={() => navigate(`/admin/wallet/details/${w.id}`)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1.5px solid #0d9488',
              background: '#f0fdfa',
              color: '#0d9488',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
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
            <i className="fa-solid fa-eye" />
            <span>View</span>
          </button>
        </div>
      ),
    },

    // 3. Customer Name
    {
      key: 'customerName',
      header: 'Customer Name',
      minWidth: '180px',
      render: (w) => (
        <div>
          <button
            type="button"
            onClick={() => navigate(`/admin/wallet/details/${w.id}`)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              color: '#0f172a',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'block',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#0d9488')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#0f172a')}
          >
            {w.customerName}
          </button>
          {w.clinicName && (
            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginTop: '1px' }}>
              <i className="fa-solid fa-hospital" style={{ marginRight: '4px', color: '#94a3b8' }} />
              {w.clinicName}
            </span>
          )}
        </div>
      ),
    },

    // 4. Email
    {
      key: 'email',
      header: 'Email',
      minWidth: '180px',
      render: (w) => (
        <a href={`mailto:${w.email}`} style={{ color: '#0d9488', fontSize: '0.82rem', textDecoration: 'none' }}>
          {w.email}
        </a>
      ),
    },

    // 5. Phone
    {
      key: 'phone',
      header: 'Phone',
      minWidth: '130px',
      render: (w) => (
        <span style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 600 }}>
          {w.phone}
        </span>
      ),
    },

    // 6. Wallet Balance
    {
      key: 'walletBalance',
      header: 'Wallet Balance',
      minWidth: '140px',
      render: (w) => (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            padding: '4px 10px',
            borderRadius: '8px',
            color: '#15803d',
            fontWeight: 800,
            fontSize: '0.88rem',
          }}
        >
          <i className="fa-solid fa-wallet" style={{ fontSize: '0.8rem', color: '#16a34a' }} />
          <span>₹{w.walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      ),
    },

    // 7. Last Update
    {
      key: 'lastUpdate',
      header: 'Last Update',
      minWidth: '160px',
      render: (w) => (
        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
          <i className="fa-regular fa-clock" style={{ marginRight: '5px', color: '#94a3b8' }} />
          {w.lastUpdate}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Wallet Management"
      subtitle={`Managing ${wallets.length} customer wallets, real-time balance ledger, and automated cashback credits`}
    >
      {/* ── Stat Summary Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '18px' }}>
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
          <div style={{ flex: 1, minWidth: '260px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by customer name, email, phone, ID, clinic..."
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                className={`filter-pill-btn ${balanceFilter === 'All' ? 'active' : ''}`}
                onClick={() => setBalanceFilter('All')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: balanceFilter === 'All' ? '1px solid #0d9488' : '1px solid #e2e8f0',
                  background: balanceFilter === 'All' ? '#0d9488' : '#ffffff',
                  color: balanceFilter === 'All' ? '#ffffff' : '#475569',
                }}
              >
                All ({wallets.length})
              </button>
              <button
                type="button"
                className={`filter-pill-btn ${balanceFilter === 'Positive' ? 'active' : ''}`}
                onClick={() => setBalanceFilter('Positive')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: balanceFilter === 'Positive' ? '1px solid #16a34a' : '1px solid #e2e8f0',
                  background: balanceFilter === 'Positive' ? '#16a34a' : '#ffffff',
                  color: balanceFilter === 'Positive' ? '#ffffff' : '#475569',
                }}
              >
                <i className="fa-solid fa-wallet" style={{ marginRight: '4px' }} />
                Active Balance
              </button>
              <button
                type="button"
                className={`filter-pill-btn ${balanceFilter === 'Zero' ? 'active' : ''}`}
                onClick={() => setBalanceFilter('Zero')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: balanceFilter === 'Zero' ? '1px solid #64748b' : '1px solid #e2e8f0',
                  background: balanceFilter === 'Zero' ? '#64748b' : '#ffffff',
                  color: balanceFilter === 'Zero' ? '#ffffff' : '#475569',
                }}
              >
                Zero Balance
              </button>
            </div>
          </div>

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

      {/* ── Wallets Data Table ── */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <DataTable<AdminCustomerWallet>
          columns={columns}
          data={filteredWallets}
          keyExtractor={(w) => w.id}
          emptyMessage="No customer wallets found matching your search."
        />
      </div>
    </AdminLayout>
  );
};

export default WalletList;
