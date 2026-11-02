/**
 * BuyBright Admin — Customer Wallet Details & Ledger Page.
 * Displays wallet balance banner, quick balance credit form, and complete transaction history table.
 */

import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { DataTable, type Column } from '../../components/DataTable';
import { SearchBar } from '../../components/SearchBar';
import { getWalletById, creditWalletBalance } from '../../data/walletData';
import type { AdminCustomerWallet, WalletTransaction } from '../../types/wallet';
import { useToast } from '../../../context/ToastContext';
import { exportTableToPDF } from '../../utils/exportPdf';
import { exportTableToCSV } from '../../utils/exportCsv';

export const WalletDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Load customer wallet state
  const [wallet, setWallet] = useState<AdminCustomerWallet | null>(() => (id ? getWalletById(id) : null));

  // Form states for Add Balance
  const [amountToCredit, setAmountToCredit] = useState<string>('');
  const [descriptionReason, setDescriptionReason] = useState<string>('');
  const [orderNoRef, setOrderNoRef] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search filter for transactions table
  const [searchTx, setSearchTx] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Credit' | 'Debit'>('All');

  if (!wallet) {
    return (
      <AdminLayout title="Customer Wallet Details" subtitle="Wallet account record not found">
        <div className="admin-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#fef2f2',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              margin: '0 auto 16px',
            }}
          >
            <i className="fa-solid fa-wallet" />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            Customer Wallet Not Found
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '20px' }}>
            The requested customer wallet with ID <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{id}</code> could not be located in the system ledger.
          </p>
          <button
            type="button"
            onClick={() => navigate('/admin/wallet')}
            className="btn-admin-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <i className="fa-solid fa-arrow-left" /> Back to Wallets
          </button>
        </div>
      </AdminLayout>
    );
  }

  // Calculate parsed credit number and projected new balance
  const parsedCredit = parseFloat(amountToCredit) || 0;
  const projectedBalance = wallet.walletBalance + parsedCredit;

  // Handle Add Balance form submission
  const handleAddBalance = (e: React.FormEvent) => {
    e.preventDefault();

    if (parsedCredit <= 0) {
      showToast('Please enter a valid amount greater than 0.00 to credit.', 'danger');
      return;
    }

    if (!descriptionReason.trim()) {
      showToast('Description / Reason is required.', 'danger');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = creditWalletBalance(wallet.id, parsedCredit, descriptionReason.trim(), orderNoRef.trim());
      if (res.success && res.updatedWallet) {
        setWallet(res.updatedWallet);
        setAmountToCredit('');
        setDescriptionReason('');
        setOrderNoRef('');
        showToast(
          `₹${parsedCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })} successfully added to ${wallet.customerName}'s wallet!`,
          'success'
        );
      } else {
        showToast('Failed to credit balance. Please check the inputs.', 'danger');
      }
    } catch {
      showToast('An unexpected error occurred while updating wallet balance.', 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return (wallet.transactions || []).filter((tx) => {
      const matchesSearch =
        !searchTx ||
        tx.description.toLowerCase().includes(searchTx.toLowerCase()) ||
        tx.orderNo.toLowerCase().includes(searchTx.toLowerCase()) ||
        tx.dateTime.toLowerCase().includes(searchTx.toLowerCase());

      const matchesType = typeFilter === 'All' || tx.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [wallet.transactions, searchTx, typeFilter]);

  // Export transactions to CSV
  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      showToast('No transaction logs to export.', 'warning');
      return;
    }

    exportTableToCSV({
      filename: `Wallet_Statement_${wallet.customerId}_${new Date().toISOString().split('T')[0]}`,
      headers: ['Sr. No.', 'Date & Time', 'Order No.', 'Description', 'Type', 'Amount (INR)', 'Balance (INR)'],
      rows: filteredTransactions.map((tx, idx) => [
        idx + 1,
        tx.dateTime,
        tx.orderNo,
        tx.description,
        tx.type,
        tx.amount,
        tx.balance,
      ]),
    });
    showToast('Transactions statement exported to CSV.', 'success');
  };

  // Export transactions to PDF
  const handleExportPDF = () => {
    if (filteredTransactions.length === 0) {
      showToast('No transaction logs to export.', 'warning');
      return;
    }

    exportTableToPDF({
      title: `Wallet Statement — ${wallet.customerName}`,
      subtitle: `Customer ID: ${wallet.customerId} | Current Balance: ₹${wallet.walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      headers: ['Sr.', 'Date & Time', 'Order No.', 'Description', 'Type', 'Amount', 'Balance'],
      rows: filteredTransactions.map((tx, idx) => [
        idx + 1,
        tx.dateTime,
        tx.orderNo,
        tx.description,
        tx.type,
        `${tx.type === 'Credit' ? '+' : '-'}₹${tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
        `₹${tx.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      ]),
    });
    showToast('Wallet statement PDF generated.', 'success');
  };

  // Table Columns
  const columns: Column<WalletTransaction>[] = [
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

    // 2. Date & Time
    {
      key: 'dateTime',
      header: 'Date & Time',
      minWidth: '170px',
      render: (tx) => (
        <div style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 600 }}>
          <i className="fa-regular fa-clock" style={{ marginRight: '6px', color: '#94a3b8' }} />
          {tx.dateTime}
        </div>
      ),
    },

    // 3. Order No.
    {
      key: 'orderNo',
      header: 'Order No.',
      minWidth: '160px',
      render: (tx) => (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#0284c7',
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              padding: '2px 8px',
              borderRadius: '6px',
            }}
          >
            {tx.orderNo}
          </span>
        </div>
      ),
    },

    // 4. Description
    {
      key: 'description',
      header: 'Description',
      minWidth: '220px',
      render: (tx) => (
        <div style={{ fontSize: '0.84rem', color: '#1e293b', fontWeight: 600 }}>
          {tx.description}
        </div>
      ),
    },

    // 5. Type
    {
      key: 'type',
      header: 'Type',
      minWidth: '100px',
      render: (tx) => (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '3px 10px',
            borderRadius: '999px',
            fontSize: '0.76rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.4px',
            background: tx.type === 'Credit' ? '#f0fdf4' : '#fef2f2',
            color: tx.type === 'Credit' ? '#15803d' : '#b91c1c',
            border: `1px solid ${tx.type === 'Credit' ? '#bbf7d0' : '#fecaca'}`,
          }}
        >
          <i className={tx.type === 'Credit' ? 'fa-solid fa-arrow-down' : 'fa-solid fa-arrow-up'} />
          {tx.type}
        </span>
      ),
    },

    // 6. Amount
    {
      key: 'amount',
      header: 'Amount',
      minWidth: '120px',
      render: (tx) => (
        <span
          style={{
            fontWeight: 800,
            fontSize: '0.88rem',
            color: tx.type === 'Credit' ? '#16a34a' : '#dc2626',
          }}
        >
          {tx.type === 'Credit' ? '+' : '-'} ₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      ),
    },

    // 7. Balance
    {
      key: 'balance',
      header: 'Balance',
      minWidth: '130px',
      render: (tx) => (
        <span
          style={{
            fontWeight: 800,
            fontSize: '0.88rem',
            color: '#0f172a',
            background: '#f8fafc',
            padding: '3px 8px',
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
          }}
        >
          ₹{tx.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Wallet Details & Ledger"
      subtitle={`Account details, balance adjustment, and historical statement for ${wallet.customerName}`}
    >
      {/* ── Top Navigation / Breadcrumbs ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => navigate('/admin/wallet')}
            className="btn-admin-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '0.84rem' }}
          >
            <i className="fa-solid fa-arrow-left" /> Back to Wallets
          </button>
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
            <Link to="/admin/wallet" style={{ color: '#0d9488', textDecoration: 'none', fontWeight: 600 }}>
              Wallets
            </Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: '#0f172a', fontWeight: 700 }}>{wallet.customerName}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              background: '#f0fdfa',
              border: '1px solid #ccfbf1',
              color: '#0d9488',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            <i className="fa-solid fa-id-badge" style={{ marginRight: '5px' }} />
            {wallet.customerId}
          </span>
        </div>
      </div>

      {/* ── Top Section: Customer Info & Balance Card + Add Balance Form ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '18px', marginBottom: '22px' }}>
        {/* Card 1: Balance Banner & Profile */}
        <div
          className="admin-card"
          style={{
            background: 'linear-gradient(135deg, #0d9488 0%, #115e59 100%)',
            color: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 25px -5px rgba(13, 148, 136, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Background Decorative Icon */}
          <i
            className="fa-solid fa-wallet"
            style={{
              position: 'absolute',
              right: '-15px',
              bottom: '-15px',
              fontSize: '9rem',
              color: 'rgba(255, 255, 255, 0.08)',
              pointerEvents: 'none',
            }}
          />

          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <span
                  style={{
                    background: 'rgba(255, 255, 255, 0.18)',
                    backdropFilter: 'blur(6px)',
                    color: '#ffffff',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Active Customer Wallet
                </span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginTop: '8px', color: '#ffffff', lineHeight: 1.2 }}>
                  {wallet.customerName}
                </h2>
                {wallet.clinicName && (
                  <div style={{ fontSize: '0.85rem', color: '#ccfbf1', marginTop: '3px', fontWeight: 500 }}>
                    <i className="fa-solid fa-hospital" style={{ marginRight: '6px', opacity: 0.9 }} />
                    {wallet.clinicName}
                  </div>
                )}
              </div>

              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  color: '#ffffff',
                }}
              >
                <i className="fa-solid fa-coins" />
              </div>
            </div>

            {/* Wallet Balance Hero Display */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '16px 20px',
                marginTop: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.6px', color: '#99f6e4', fontWeight: 700 }}>
                Available Wallet Balance
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px', marginTop: '4px' }}>
                ₹{wallet.walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#ccfbf1', marginTop: '4px' }}>
                <i className="fa-regular fa-clock" style={{ marginRight: '5px' }} />
                Last Updated: {wallet.lastUpdate}
              </div>
            </div>
          </div>

          {/* Quick Stats Grid & Contact */}
          <div style={{ marginTop: '20px' }}>
           
            <div style={{ fontSize: '0.8rem', color: '#e0f2fe', display: 'flex', flexWrap: 'wrap', gap: '14px', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="fa-solid fa-envelope" style={{ color: '#99f6e4' }} />
                <span>{wallet.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="fa-solid fa-phone" style={{ color: '#99f6e4' }} />
                <span>{wallet.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Add Balance Form */}
        <div className="admin-card" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#f0fdf4',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
              }}
            >
              <i className="fa-solid fa-plus-circle" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Add Balance to Wallet
              </h3>
              <p style={{ fontSize: '0.76rem', color: '#64748b', margin: 0 }}>
                Credit funds, promotional rebates, or goodwill adjustments to this customer account.
              </p>
            </div>
          </div>

          <form onSubmit={handleAddBalance}>
            {/* Amount to Credit * */}
            <div style={{ marginBottom: '14px' }}>
              <label
                htmlFor="amountToCredit"
                style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}
              >
                Amount to Credit <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontWeight: 800,
                    color: '#64748b',
                    fontSize: '0.95rem',
                  }}
                >
                  ₹
                </span>
                <input
                  id="amountToCredit"
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="0.00"
                  value={amountToCredit}
                  onChange={(e) => setAmountToCredit(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 32px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#0d9488')}
                  onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                />
              </div>
            </div>

            {/* Description / Reason * */}
            <div style={{ marginBottom: '14px' }}>
              <label
                htmlFor="descriptionReason"
                style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}
              >
                Description / Reason <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                id="descriptionReason"
                rows={2}
                placeholder="e.g., Presto Reward Cashback, Goodwill credit for packaging delay, Clinic bulk rebate"
                value={descriptionReason}
                onChange={(e) => setDescriptionReason(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.84rem',
                  color: '#0f172a',
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#0d9488')}
                onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
              />
            </div>

            {/* Order No. / Reference (Optional) */}
            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="orderNoRef"
                style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}
              >
                Order No. / Reference <span style={{ color: '#94a3b8', fontWeight: 400 }}>(Optional)</span>
              </label>
              <input
                id="orderNoRef"
                type="text"
                placeholder="e.g. PRESTO-2026-892144 or MANUAL-CREDIT"
                value={orderNoRef}
                onChange={(e) => setOrderNoRef(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.84rem',
                  color: '#0f172a',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#0d9488')}
                onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
              />
            </div>

            {/* Real-time Calculation Breakdown */}
            {parsedCredit > 0 && (
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px dashed #cbd5e1',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b', marginBottom: '4px' }}>
                  <span>Current Balance:</span>
                  <span style={{ fontWeight: 600 }}>₹{wallet.walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#16a34a', marginBottom: '4px' }}>
                  <span>+ Amount to Credit:</span>
                  <span style={{ fontWeight: 700 }}>+ ₹{parsedCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: '#0f172a', fontWeight: 800, borderTop: '1px solid #e2e8f0', paddingTop: '6px', marginTop: '4px' }}>
                  <span>Projected New Balance:</span>
                  <span style={{ color: '#0d9488' }}>₹{projectedBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-admin-primary"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                fontSize: '0.92rem',
                fontWeight: 800,
                background: '#0d9488',
                borderColor: '#0d9488',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(13, 148, 136, 0.25)',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              <i className="fa-solid fa-wallet" />
              {isSubmitting ? 'Crediting Balance...' : 'Add Balance'}
            </button>
          </form>
        </div>
      </div>

      {/* ── Transactions Statement Ledger ── */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Table Header Bar */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-solid fa-receipt" style={{ color: '#0d9488' }} />
              Transaction Ledger & Statement
            </h3>
            <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '2px 0 0 0' }}>
              Chronological log of all credit additions, order deductions, and refunds for this wallet.
            </p>
          </div>

          {/* Search, Type Filter & Exports */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ width: '220px' }}>
              <SearchBar
                value={searchTx}
                onChange={setSearchTx}
                placeholder="Search order or reason..."
              />
            </div>

            {/* Type Filter Buttons */}
            <div
              style={{
                display: 'flex',
                background: '#f1f5f9',
                padding: '3px',
                borderRadius: '8px',
                gap: '2px',
              }}
            >
              {(['All', 'Credit', 'Debit'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTypeFilter(t)}
                  style={{
                    border: 'none',
                    background: typeFilter === t ? '#ffffff' : 'transparent',
                    color: typeFilter === t ? '#0d9488' : '#64748b',
                    fontWeight: typeFilter === t ? 800 : 600,
                    fontSize: '0.76rem',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    boxShadow: typeFilter === t ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleExportCSV}
              className="btn-admin-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', padding: '6px 10px' }}
            >
              <i className="fa-solid fa-file-excel" style={{ color: '#16a34a' }} /> CSV
            </button>
            <button
              type="button"
              onClick={handleExportPDF}
              className="btn-admin-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', padding: '6px 10px' }}
            >
              <i className="fa-solid fa-file-pdf" style={{ color: '#ef4444' }} /> PDF
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <DataTable<WalletTransaction>
          columns={columns}
          data={filteredTransactions}
          keyExtractor={(tx) => tx.id}
          emptyMessage="No wallet transactions recorded for this account."
        />
      </div>
    </AdminLayout>
  );
};

export default WalletDetailsPage;
