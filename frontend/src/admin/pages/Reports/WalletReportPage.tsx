/**
 * BuyBright Admin — Wallet Report Page.
 * Purpose: Understand wallet liability, credits vs debits, transaction trends, and type distribution.
 *
 * Features:
 *   - 8 Executive KPI Stat Cards (Total Wallet Balance, Total Credits, Total Debits, Wallet Users, Total Expired Amount, Average Balance, Net Flow, Completed Transactions)
 *   - Multi-Dimensional Filters (Quick Date Chips, Custom Range, Search, Status, Types, Reset)
 *   - 3 Highcharts Visualizations:
 *       1. Wallet Credits vs Debits (Bar + Line Combo Chart)
 *       2. Wallet Transactions Over Time (Line / Area Spline Chart)
 *       3. Transaction Type Distribution (Donut Chart)
 *   - Paginated Transaction Ledger Table with Summary Totals Footer
 *   - Export to CSV / PDF
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { AdminLayout } from '../../layouts/AdminLayout';
import { ReportStatCard, ReportStatData } from './ReportStatCard';
import { Pagination } from '../../components/Pagination/Pagination';
import { useToast } from '../../../context/ToastContext';
import { exportTableToCSV } from '../../utils/exportCsv';
import { exportTableToPDF } from '../../utils/exportPdf';
import { initialWalletTransactions, WalletTransactionItem } from '../../data/reportsData';

type QuickDateOption = 'Today' | '7 Days' | '30 Days' | 'This Month' | 'Last Month' | 'Custom';

export const WalletReportPage: React.FC = () => {
  const { showToast } = useToast();
  const [transactionsData] = useState<WalletTransactionItem[]>(initialWalletTransactions);

  // ── Filter States ──
  const [quickDate, setQuickDate] = useState<QuickDateOption>('30 Days');
  const [startDate, setStartDate] = useState<string>('2026-09-25');
  const [endDate, setEndDate] = useState<string>('2026-10-06');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  // ── Table Pagination & Page Size States ──
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  // ── Quick Date Filter Handler ──
  const handleQuickDateChange = (opt: QuickDateOption) => {
    setQuickDate(opt);
    const today = new Date(2026, 9, 6); // 06 Oct 2026

    const formatDateStr = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    if (opt === 'Today') {
      setStartDate('2026-10-06');
      setEndDate('2026-10-06');
    } else if (opt === '7 Days') {
      const past7 = new Date(today);
      past7.setDate(today.getDate() - 6);
      setStartDate(formatDateStr(past7));
      setEndDate('2026-10-06');
    } else if (opt === '30 Days') {
      const past30 = new Date(today);
      past30.setDate(today.getDate() - 29);
      setStartDate(formatDateStr(past30));
      setEndDate('2026-10-06');
    } else if (opt === 'This Month') {
      setStartDate('2026-10-01');
      setEndDate('2026-10-31');
    } else if (opt === 'Last Month') {
      setStartDate('2026-09-01');
      setEndDate('2026-09-30');
    }
    setCurrentPage(1);
  };

  // ── Reset Filters Handler ──
  const handleResetFilters = () => {
    setQuickDate('30 Days');
    setStartDate('2026-09-25');
    setEndDate('2026-10-06');
    setSearchQuery('');
    setStatusFilter('All');
    setTypeFilter('All');
    setCurrentPage(1);
    showToast('Wallet filters reset to default', 'info');
  };

  // ── Filtered Transactions Computation ──
  const filteredTransactions = useMemo(() => {
    return transactionsData.filter((item) => {
      if (startDate && item.rawDate < startDate) return false;
      if (endDate && item.rawDate > endDate) return false;
      if (
        searchQuery &&
        !item.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.clinicName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.source.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (statusFilter !== 'All' && item.status !== statusFilter) return false;
      if (typeFilter !== 'All' && item.type !== typeFilter) return false;
      return true;
    });
  }, [transactionsData, startDate, endDate, searchQuery, statusFilter, typeFilter]);

  // ── Aggregated KPI Metrics ──
  const metrics = useMemo(() => {
    const completedTxns = filteredTransactions.filter((t) => t.status === 'Completed');
    
    // Credits include: Credit, Refund, Cashback, Referral Reward
    const totalCredits = completedTxns
      .filter((t) => ['Credit', 'Refund', 'Cashback', 'Referral Reward'].includes(t.type))
      .reduce((acc, curr) => acc + curr.amount, 0);

    // Debits
    const totalDebits = completedTxns
      .filter((t) => t.type === 'Debit')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const netFlow = totalCredits - totalDebits;

    const expiredTxns = filteredTransactions.filter((t) => t.status === 'Expired');
    const totalExpiredAmount = expiredTxns.reduce((acc, curr) => acc + (curr.expiredAmount || curr.amount), 0);

    const uniqueDoctors = new Set(filteredTransactions.map((t) => t.doctorName));
    const walletUsers = uniqueDoctors.size;

    // Total Wallet Balance calculated from latest balance after for each unique doctor
    const latestBalances = new Map<string, number>();
    // Sort transactions chronologically
    const sorted = [...filteredTransactions].sort((a, b) => a.rawDate.localeCompare(b.rawDate));
    sorted.forEach((t) => {
      if (t.status === 'Completed') {
        latestBalances.set(t.doctorName, t.balanceAfter);
      }
    });

    const totalWalletBalance = Array.from(latestBalances.values()).reduce((acc, curr) => acc + curr, 0) || 58450;
    const averageWalletBalance = walletUsers > 0 ? totalWalletBalance / walletUsers : 0;

    return {
      totalWalletBalance,
      totalCredits,
      totalDebits,
      netFlow,
      walletUsers,
      totalExpiredAmount,
      averageWalletBalance,
      completedCount: completedTxns.length,
      totalTxnCount: filteredTransactions.length,
    };
  }, [filteredTransactions]);

  // ── 8 Executive KPI Stat Cards ──
  const kpis: ReportStatData[] = [
    {
      id: 'kpi-wal-1',
      label: 'Total Wallet Balance',
      value: `₹${metrics.totalWalletBalance.toLocaleString('en-IN')}`,
      icon: 'fa-solid fa-wallet',
      color: '#0d9488',
      change: 'Platform Liability',
      isPositive: true,
      subtext: 'Current active doctor funds',
      badge: 'Liability',
    },
    {
      id: 'kpi-wal-2',
      label: 'Total Credits',
      value: `₹${metrics.totalCredits.toLocaleString('en-IN')}`,
      icon: 'fa-solid fa-circle-arrow-up',
      color: '#16a34a',
      change: '+19.2% Top-ups',
      isPositive: true,
      subtext: 'Recharges, refunds & bonuses',
      badge: 'Inflow',
    },
    {
      id: 'kpi-wal-3',
      label: 'Total Debits',
      value: `₹${metrics.totalDebits.toLocaleString('en-IN')}`,
      icon: 'fa-solid fa-circle-arrow-down',
      color: '#ef4444',
      change: 'Redeemed in Checkout',
      isPositive: true,
      subtext: 'Direct orders paid via wallet',
      badge: 'Outflow',
    },
    {
      id: 'kpi-wal-4',
      label: 'Wallet Users',
      value: `${metrics.walletUsers} Doctors`,
      icon: 'fa-solid fa-users',
      color: '#3b82f6',
      change: 'Active Balances',
      isPositive: true,
      subtext: 'Practitioners with funded wallets',
      badge: 'Adoption',
    },
    {
      id: 'kpi-wal-5',
      label: 'Total Expired Amount',
      value: `₹${metrics.totalExpiredAmount.toLocaleString('en-IN')}`,
      icon: 'fa-solid fa-hourglass-end',
      color: '#f59e0b',
      change: metrics.totalExpiredAmount === 0 ? 'Zero Expiries' : 'Lapsed Validity',
      isPositive: metrics.totalExpiredAmount === 0,
      subtext: 'Unclaimed promotional grants',
      badge: 'Expired Funds',
    },
    {
      id: 'kpi-wal-6',
      label: 'Average Wallet Balance',
      value: `₹${Math.round(metrics.averageWalletBalance).toLocaleString('en-IN')}`,
      icon: 'fa-solid fa-scale-balanced',
      color: '#8b5cf6',
      change: 'Mean Balance / User',
      isPositive: true,
      subtext: 'Average liquid balance held',
      badge: 'Per Clinic',
    },
    {
      id: 'kpi-wal-7',
      label: 'Net Wallet Flow',
      value: `₹${metrics.netFlow.toLocaleString('en-IN')}`,
      icon: 'fa-solid fa-arrow-right-arrow-left',
      color: metrics.netFlow >= 0 ? '#059669' : '#dc2626',
      change: metrics.netFlow >= 0 ? '+ Positive Flow' : '- Net Drawdown',
      isPositive: metrics.netFlow >= 0,
      subtext: 'Credits minus redemptions',
      badge: 'Net Balance',
    },
    {
      id: 'kpi-wal-8',
      label: 'Completed Transactions',
      value: `${metrics.completedCount} / ${metrics.totalTxnCount}`,
      icon: 'fa-solid fa-shield-check',
      color: '#0284c7',
      change: `${((metrics.completedCount / (metrics.totalTxnCount || 1)) * 100).toFixed(0)}% Success Rate`,
      isPositive: true,
      subtext: 'Audited ledger operations',
      badge: 'Settled',
    },
  ];

  // ── Pagination Calculation ──
  const totalPages = Math.ceil(filteredTransactions.length / pageSize) || 1;
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(startIndex, startIndex + pageSize);
  }, [filteredTransactions, currentPage, pageSize]);

  // ── Highcharts Data: 1. Wallet Credits vs Debits (Bar + Line Combo) ──
  const creditsVsDebitsOptions: Highcharts.Options = useMemo(() => {
    const dateMap = new Map<string, { credits: number; debits: number }>();

    filteredTransactions.forEach((t) => {
      if (t.status === 'Completed') {
        const d = t.rawDate;
        const cur = dateMap.get(d) || { credits: 0, debits: 0 };
        if (['Credit', 'Refund', 'Cashback', 'Referral Reward'].includes(t.type)) {
          cur.credits += t.amount;
        } else if (t.type === 'Debit') {
          cur.debits += t.amount;
        }
        dateMap.set(d, cur);
      }
    });

    const sortedDates = Array.from(dateMap.keys()).sort();
    const creditsData = sortedDates.map((d) => dateMap.get(d)?.credits || 0);
    const debitsData = sortedDates.map((d) => dateMap.get(d)?.debits || 0);
    const netFlowLine = sortedDates.map((d) => (dateMap.get(d)?.credits || 0) - (dateMap.get(d)?.debits || 0));

    const formattedDates = sortedDates.map((d) => {
      const parts = d.split('-');
      if (parts.length === 3) {
        const dateObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        return dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      }
      return d;
    });

    return {
      chart: {
        backgroundColor: 'transparent',
        style: { fontFamily: "'Inter', system-ui, -apple-system, sans-serif" },
        height: 320,
      },
      title: { text: undefined },
      credits: { enabled: false },
      xAxis: {
        categories: formattedDates.length > 0 ? formattedDates : ['No Data'],
        labels: { style: { color: '#64748b', fontSize: '11px', fontWeight: '600' } },
        lineColor: '#e2e8f0',
      },
      yAxis: {
        title: { text: 'Amount (₹)', style: { color: '#64748b', fontSize: '12px' } },
        gridLineColor: '#f1f5f9',
        labels: {
          formatter: function (this: any): string {
            return `₹${Number(this.value) / 1000}K`;
          },
          style: { color: '#64748b', fontSize: '11px' },
        },
      },
      tooltip: {
        shared: true,
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        borderRadius: 8,
        style: { color: '#ffffff' },
        formatter: function (this: any): string {
          const self = this as any;
          const points = self.points || [];
          let res = `<span style="font-size:12px;font-weight:700;color:#38bdf8">${self.x}</span><br/>`;
          points.forEach((p: any) => {
            res += `<span style="color:${p.color}">●</span> ${p.series.name}: <b>₹${Number(p.y).toLocaleString('en-IN')}</b><br/>`;
          });
          return res;
        },
      },
      series: [
        {
          type: 'column',
          name: 'Credits (Inflow)',
          data: creditsData,
          color: '#22c55e',
          borderRadius: 4,
        },
        {
          type: 'column',
          name: 'Debits (Redemptions)',
          data: debitsData,
          color: '#ef4444',
          borderRadius: 4,
        },
        {
          type: 'spline',
          name: 'Net Flow (Inflow - Outflow)',
          data: netFlowLine,
          color: '#0d9488',
          lineWidth: 3,
          marker: { radius: 4, symbol: 'diamond', fillColor: '#0d9488' },
        },
      ],
    };
  }, [filteredTransactions]);

  // ── Highcharts Data: 2. Wallet Transactions Over Time (Line / Area Spline) ──
  const transactionsOverTimeOptions: Highcharts.Options = useMemo(() => {
    const dateMap = new Map<string, { count: number; volume: number }>();

    filteredTransactions.forEach((t) => {
      const d = t.rawDate;
      const cur = dateMap.get(d) || { count: 0, volume: 0 };
      cur.count += 1;
      cur.volume += t.amount;
      dateMap.set(d, cur);
    });

    const sortedDates = Array.from(dateMap.keys()).sort();
    const countSeries = sortedDates.map((d) => dateMap.get(d)?.count || 0);

    const formattedDates = sortedDates.map((d) => {
      const parts = d.split('-');
      if (parts.length === 3) {
        const dateObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        return dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      }
      return d;
    });

    return {
      chart: {
        type: 'areaspline',
        backgroundColor: 'transparent',
        style: { fontFamily: "'Inter', system-ui, -apple-system, sans-serif" },
        height: 320,
      },
      title: { text: undefined },
      credits: { enabled: false },
      xAxis: {
        categories: formattedDates.length > 0 ? formattedDates : ['No Data'],
        labels: { style: { color: '#64748b', fontSize: '11px', fontWeight: '600' } },
        lineColor: '#e2e8f0',
      },
      yAxis: {
        title: { text: 'Transactions Count', style: { color: '#64748b', fontSize: '12px' } },
        gridLineColor: '#f1f5f9',
        labels: { style: { color: '#64748b', fontSize: '11px' } },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        borderRadius: 8,
        style: { color: '#ffffff' },
        formatter: function (this: any): string {
          const self = this as any;
          return `<b>${self.x}</b><br/>Ledger Movements: <b>${self.y} Transactions</b>`;
        },
      },
      plotOptions: {
        areaspline: {
          fillOpacity: 0.15,
          color: '#3b82f6',
          lineWidth: 3,
          marker: { radius: 4, symbol: 'circle' },
        },
      },
      series: [
        {
          type: 'areaspline',
          name: 'Transaction Volume',
          data: countSeries,
        },
      ],
    };
  }, [filteredTransactions]);

  // ── Highcharts Data: 3. Transaction Type Distribution (Donut Chart) ──
  const typeDistributionOptions: Highcharts.Options = useMemo(() => {
    const typeCountMap = new Map<string, number>();

    filteredTransactions.forEach((t) => {
      const count = typeCountMap.get(t.type) || 0;
      typeCountMap.set(t.type, count + t.amount);
    });

    const typeColorMap: Record<string, string> = {
      Credit: '#22c55e',
      Debit: '#ef4444',
      Refund: '#3b82f6',
      Cashback: '#f59e0b',
      'Referral Reward': '#8b5cf6',
    };

    const data = Array.from(typeCountMap.entries()).map(([name, y]) => ({
      name,
      y,
      color: typeColorMap[name] || '#64748b',
    }));

    return {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        style: { fontFamily: "'Inter', system-ui, -apple-system, sans-serif" },
        height: 320,
      },
      title: { text: undefined },
      credits: { enabled: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        borderRadius: 8,
        style: { color: '#ffffff' },
        formatter: function (this: any): string {
          const self = this as any;
          const point = self.point || {};
          return `<b>${point.name}</b><br/>Value: <b>₹${Number(self.y).toLocaleString('en-IN')}</b><br/>Share: <b>${point.percentage?.toFixed(1)}%</b>`;
        },
      },
      plotOptions: {
        pie: {
          innerSize: '62%',
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f}%',
            style: { color: '#334155', fontSize: '11px', fontWeight: '600' },
          },
        },
      },
      series: [
        {
          type: 'pie',
          name: 'Transaction Type Share',
          data: data.length > 0 ? data : [{ name: 'No Data', y: 1, color: '#e2e8f0' }],
        },
      ],
    };
  }, [filteredTransactions]);

  // ── CSV Export ──
  const handleExportCSV = () => {
    exportTableToCSV({
      filename: `buybright_wallet_report_${Date.now()}`,
      headers: [
        'Transaction ID',
        'Date & Time',
        'Doctor Name',
        'Clinic Name',
        'Type',
        'Amount (₹)',
        'Balance Before (₹)',
        'Balance After (₹)',
        'Source / Purpose',
        'Status',
      ],
      rows: filteredTransactions.map((t) => [
        t.transactionId,
        t.date,
        t.doctorName,
        t.clinicName,
        t.type,
        t.amount,
        t.balanceBefore,
        t.balanceAfter,
        t.source,
        t.status,
      ]),
    });
    showToast('Wallet Report exported as CSV successfully', 'success');
  };

  // ── PDF Export ──
  const handleExportPDF = () => {
    exportTableToPDF({
      title: 'BuyBright — Doctor Wallet & BrightPoints Ledger',
      subtitle: `Credits, redemptions, refunds, and balance movements (${startDate} to ${endDate})`,
      headers: [
        'Txn ID',
        'Date',
        'Customer',
        'Type',
        'Amount',
        'Bal Before',
        'Bal After',
        'Source',
        'Status',
      ],
      rows: filteredTransactions.map((t) => [
        t.transactionId,
        t.date,
        `${t.doctorName} (${t.clinicName})`,
        t.type,
        `₹${t.amount.toLocaleString('en-IN')}`,
        `₹${t.balanceBefore.toLocaleString('en-IN')}`,
        `₹${t.balanceAfter.toLocaleString('en-IN')}`,
        t.source,
        t.status,
      ]),
    });
    showToast('Wallet Report exported as PDF successfully', 'success');
  };

  return (
    <AdminLayout
      title="Wallet & BrightPoints Report"
      subtitle="Track doctor wallet liabilities, recharges, checkout debits, refunds, and loyalty points movements"
    >
      {/* ── Top Breadcrumb Action & Export Bar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '18px',
        }}
      >
        <Link
          to="/admin/reports"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.86rem',
            color: '#0d9488',
            fontWeight: 700,
            textDecoration: 'none',
            padding: '6px 14px',
            borderRadius: '8px',
            background: '#f0fdfa',
            border: '1px solid #ccfbf1',
            transition: 'all 0.15s ease',
          }}
        >
          <i className="fa-solid fa-arrow-left" style={{ fontSize: '0.78rem' }} />
          <span>Back to Reports Hub</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button type="button" onClick={handleExportCSV} className="btn-admin-outline" style={{ padding: '8px 14px' }}>
            <i className="fa-solid fa-file-csv" style={{ color: '#0d9488' }} /> Export CSV
          </button>
          <button type="button" onClick={handleExportPDF} className="btn-admin-primary" style={{ padding: '8px 14px' }}>
            <i className="fa-solid fa-file-pdf" /> Export PDF
          </button>
        </div>
      </div>

      {/* ── 8 Executive KPI Stat Cards ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '18px',
          marginBottom: '22px',
        }}
      >
        {kpis.map((kpi) => (
          <ReportStatCard key={kpi.id} stat={kpi} />
        ))}
      </div>

      {/* ── Multi-Dimensional Filter Suite ── */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 4px 12px -2px rgba(15, 23, 42, 0.04)',
        }}
      >
        {/* Quick Date Chips Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            paddingBottom: '16px',
            borderBottom: '1px solid #f1f5f9',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginRight: '4px' }}>
              <i className="fa-solid fa-calendar-day" style={{ color: '#0d9488', marginRight: '6px' }} />
              Quick Date:
            </span>
            {(['Today', '7 Days', '30 Days', 'This Month', 'Last Month', 'Custom'] as QuickDateOption[]).map((opt) => {
              const isActive = quickDate === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleQuickDateChange(opt)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    border: `1px solid ${isActive ? '#0d9488' : '#e2e8f0'}`,
                    background: isActive ? '#0d9488' : '#f8fafc',
                    color: isActive ? '#ffffff' : '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleResetFilters}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#64748b',
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              cursor: 'pointer',
            }}
          >
            <i className="fa-solid fa-rotate-left" /> Reset Filters
          </button>
        </div>

        {/* Detailed Dropdown & Input Controls */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '14px',
            alignItems: 'flex-end',
          }}
        >
          {/* Start Date */}
          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
              From Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setQuickDate('Custom');
                setCurrentPage(1);
              }}
              className="table-search-input"
              style={{ width: '100%', fontSize: '0.82rem', padding: '7px 10px' }}
            />
          </div>

          {/* End Date */}
          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
              To Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setQuickDate('Custom');
                setCurrentPage(1);
              }}
              className="table-search-input"
              style={{ width: '100%', fontSize: '0.82rem', padding: '7px 10px' }}
            />
          </div>

          {/* Customer / Txn Search */}
          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
              Search Customer / Txn ID
            </label>
            <div style={{ position: 'relative' }}>
              <i
                className="fa-solid fa-magnifying-glass"
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  fontSize: '0.8rem',
                }}
              />
              <input
                type="text"
                placeholder="Doctor name, clinic, or WTX..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="table-search-input"
                style={{ width: '100%', paddingLeft: '30px', fontSize: '0.82rem', padding: '7px 10px 7px 30px' }}
              />
            </div>
          </div>

          {/* Transaction Status Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
              Transaction Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="table-filter-select"
              style={{ width: '100%', fontSize: '0.82rem', padding: '7px 10px' }}
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          {/* Transaction Types Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
              Transaction Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="table-filter-select"
              style={{ width: '100%', fontSize: '0.82rem', padding: '7px 10px' }}
            >
              <option value="All">All Types</option>
              <option value="Credit">Credit (Top-up)</option>
              <option value="Debit">Debit (Order Checkout)</option>
              <option value="Refund">Refund</option>
              <option value="Cashback">Cashback</option>
              <option value="Referral Reward">Referral Reward</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── 3 Interactive Highcharts Visualizations (Grid Layout) ── */}
      <div className="reports-charts-grid">
        {/* Graph 1: Wallet Credits vs Debits */}
        <div className="report-chart-card">
          <div className="report-chart-header">
            <div className="report-chart-title-wrap">
              <h3 className="report-chart-title">
                <i className="fa-solid fa-chart-column" style={{ color: '#0d9488' }} />
                1. Wallet Credits vs Debits
              </h3>
              <p className="report-chart-desc">
                Inflow vs. outflow comparison with net balance movement curve
              </p>
            </div>
            <span className="report-chart-badge">Bar + Line Combo</span>
          </div>
          <div className="report-chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={creditsVsDebitsOptions} />
          </div>
        </div>

        {/* Graph 2: Wallet Transactions Over Time */}
        <div className="report-chart-card">
          <div className="report-chart-header">
            <div className="report-chart-title-wrap">
              <h3 className="report-chart-title">
                <i className="fa-solid fa-chart-line" style={{ color: '#3b82f6' }} />
                2. Wallet Transactions Over Time
              </h3>
              <p className="report-chart-desc">
                Daily velocity of wallet activity and practitioner engagements
              </p>
            </div>
            <span className="report-chart-badge" style={{ color: '#3b82f6', background: '#eff6ff', borderColor: '#dbeafe' }}>
              Line / Area Spline
            </span>
          </div>
          <div className="report-chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={transactionsOverTimeOptions} />
          </div>
        </div>

        {/* Graph 3: Transaction Type Distribution */}
        <div className="report-chart-card" style={{ gridColumn: '1 / -1' }}>
          <div className="report-chart-header">
            <div className="report-chart-title-wrap">
              <h3 className="report-chart-title">
                <i className="fa-solid fa-chart-pie" style={{ color: '#8b5cf6' }} />
                3. Transaction Type Distribution
              </h3>
              <p className="report-chart-desc">
                Relative volume share across Credits, Debits, Refunds, Cashbacks, and Referral Rewards
              </p>
            </div>
            <span className="report-chart-badge" style={{ color: '#8b5cf6', background: '#f5f3ff', borderColor: '#ede9fe' }}>
              Donut Chart
            </span>
          </div>
          <div className="report-chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={typeDistributionOptions} />
          </div>
        </div>
      </div>

      {/* ── Paginated Wallet Transactions Table ── */}
      <div
        className="admin-card"
        style={{
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 14px -3px rgba(15, 23, 42, 0.04)',
          overflow: 'hidden',
          background: '#ffffff',
        }}
      >
        {/* Table Toolbar Header */}
        <div
          style={{
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f1f5f9',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa-solid fa-table-list" style={{ color: '#0d9488', fontSize: '1rem' }} />
            <span style={{ fontWeight: 800, fontSize: '0.96rem', color: '#0f172a' }}>
              Wallet Ledger Entries
            </span>
            <span
              style={{
                background: '#f0fdfa',
                color: '#0d9488',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '12px',
                border: '1px solid #ccfbf1',
              }}
            >
              {filteredTransactions.length} Transactions
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#64748b' }}>
              <span>Show:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="table-filter-select"
                style={{ padding: '4px 8px', fontSize: '0.82rem' }}
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Responsive Table Body */}
        <div className="admin-table-responsive" style={{ margin: 0 }}>
          <table className="admin-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ minWidth: '150px' }}>Transaction ID</th>
                <th style={{ minWidth: '130px' }}>Date</th>
                <th style={{ minWidth: '180px' }}>Customer</th>
                <th style={{ minWidth: '120px' }}>Type</th>
                <th style={{ textAlign: 'right', minWidth: '110px' }}>Amount</th>
                <th style={{ textAlign: 'right', minWidth: '110px' }}>Balance Before</th>
                <th style={{ textAlign: 'right', minWidth: '110px' }}>Balance After</th>
                <th style={{ minWidth: '180px' }}>Source / Purpose</th>
                <th style={{ textAlign: 'center', minWidth: '100px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
                    <i
                      className="fa-solid fa-wallet"
                      style={{ fontSize: '2.2rem', marginBottom: '10px', display: 'block', color: '#cbd5e1' }}
                    />
                    <div style={{ fontWeight: 600, fontSize: '0.94rem', color: '#334155' }}>
                      No wallet transactions match your filters
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
                      Try adjusting your date range, search query, or transaction types.
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((t) => {
                  let typeColor = '#059669';
                  let typeBg = '#f0fdf4';
                  let isCreditType = true;

                  if (t.type === 'Debit') {
                    typeColor = '#dc2626';
                    typeBg = '#fef2f2';
                    isCreditType = false;
                  } else if (t.type === 'Refund') {
                    typeColor = '#0284c7';
                    typeBg = '#f0f9ff';
                  } else if (t.type === 'Cashback') {
                    typeColor = '#d97706';
                    typeBg = '#fffbeb';
                  } else if (t.type === 'Referral Reward') {
                    typeColor = '#7c3aed';
                    typeBg = '#f5f3ff';
                  }

                  let statusBadgeClass = 'badge-active';
                  if (t.status === 'Pending') statusBadgeClass = 'badge-pending';
                  if (t.status === 'Failed') statusBadgeClass = 'badge-inactive';
                  if (t.status === 'Expired') statusBadgeClass = 'badge-danger';

                  return (
                    <tr key={t.id}>
                      {/* Transaction ID */}
                      <td>
                        <span
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            color: '#0d9488',
                            letterSpacing: '0.5px',
                            background: '#f0fdfa',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            border: '1px solid #ccfbf1',
                            fontFamily: 'monospace',
                          }}
                        >
                          {t.transactionId}
                        </span>
                      </td>

                      {/* Date */}
                      <td>
                        <span style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 500 }}>
                          {t.date}
                        </span>
                      </td>

                      {/* Customer */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.86rem' }}>
                            {t.doctorName}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {t.clinicName}
                          </span>
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: typeColor,
                            background: typeBg,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <i
                            className={
                              isCreditType
                                ? 'fa-solid fa-arrow-down-left'
                                : 'fa-solid fa-arrow-up-right'
                            }
                            style={{ fontSize: '0.68rem' }}
                          />
                          {t.type}
                        </span>
                      </td>

                      {/* Amount */}
                      <td style={{ textAlign: 'right' }}>
                        <strong
                          style={{
                            color: isCreditType ? '#16a34a' : '#ef4444',
                            fontSize: '0.9rem',
                          }}
                        >
                          {isCreditType ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                        </strong>
                      </td>

                      {/* Balance Before */}
                      <td style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600 }}>
                          ₹{t.balanceBefore.toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Balance After */}
                      <td style={{ textAlign: 'right' }}>
                        <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>
                          ₹{t.balanceAfter.toLocaleString('en-IN')}
                        </strong>
                      </td>

                      {/* Source */}
                      <td>
                        <span style={{ fontSize: '0.8rem', color: '#334155', fontWeight: 500 }}>
                          {t.source}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ textAlign: 'center' }}>
                        <span className={`admin-badge ${statusBadgeClass}`}>{t.status}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* Totals Summary Footer */}
            {filteredTransactions.length > 0 && (
              <tfoot>
                <tr style={{ background: '#f8fafc', fontWeight: 700, borderTop: '2px solid #e2e8f0' }}>
                  <td colSpan={4} style={{ color: '#0f172a', fontSize: '0.88rem' }}>
                    <i className="fa-solid fa-calculator" style={{ color: '#0d9488', marginRight: '6px' }} />
                    Total Summary ({filteredTransactions.length} Ledger Records)
                  </td>
                  <td style={{ textAlign: 'right', color: '#0d9488', fontSize: '0.94rem' }}>
                    ₹{filteredTransactions.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString('en-IN')}
                  </td>
                  <td colSpan={2} style={{ textAlign: 'right', color: '#0f766e', fontSize: '0.88rem' }}>
                    Net Flow: ₹{metrics.netFlow.toLocaleString('en-IN')}
                  </td>
                  <td colSpan={2} style={{ textAlign: 'center', color: '#16a34a', fontSize: '0.82rem' }}>
                    {metrics.completedCount} Completed
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* ── Table Pagination Controls ── */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={filteredTransactions.length}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </AdminLayout>
  );
};

export default WalletReportPage;
