/**
 * BuyBright Admin — Referral Report Page.
 * Purpose: Track doctor-to-doctor referral performance, acquisition funnel, reward incentives, and influenced revenue.
 *
 * Features:
 *   - 8 Executive KPI Stat Cards (Total Referrals, Successful Referrals, Referral Orders, Referral Revenue, Referral Rewards, Conversion Rate, AOV, Active Advocates)
 *   - Multi-Dimensional Filters (Quick Date Chips, Custom Range, Source, Code Search, Status, Reset)
 *   - 3 Highcharts Visualizations:
 *       1. Referrals Over Time (Line / Area Spline Chart)
 *       2. Referral Conversion Funnel (4-Stage Funnel Chart)
 *       3. Revenue by Referral Source (Bar / Column Chart)
 *   - Paginated Referral Ledger Table with Summary Totals Footer
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
import { initialReferralReport, ReferralReportItem } from '../../data/reportsData';

type QuickDateOption = 'Today' | '7 Days' | '30 Days' | 'This Month' | 'Last Month' | 'Custom';

export const ReferralReportPage: React.FC = () => {
  const { showToast } = useToast();
  const [referralsData] = useState<ReferralReportItem[]>(initialReferralReport);

  // ── Filter States ──
  const [quickDate, setQuickDate] = useState<QuickDateOption>('30 Days');
  const [startDate, setStartDate] = useState<string>('2026-09-25');
  const [endDate, setEndDate] = useState<string>('2026-10-06');
  const [codeSearch, setCodeSearch] = useState<string>('');
  const [sourceFilter, setSourceFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

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
    setCodeSearch('');
    setSourceFilter('All');
    setStatusFilter('All');
    setCurrentPage(1);
    showToast('Referral filters reset to default', 'info');
  };

  // ── Filtered Referrals Computation ──
  const filteredReferrals = useMemo(() => {
    return referralsData.filter((item) => {
      if (startDate && item.rawDate < startDate) return false;
      if (endDate && item.rawDate > endDate) return false;
      if (
        codeSearch &&
        !item.referralCode.toLowerCase().includes(codeSearch.toLowerCase()) &&
        !item.referrerName.toLowerCase().includes(codeSearch.toLowerCase()) &&
        !item.referredCustomerName.toLowerCase().includes(codeSearch.toLowerCase())
      ) {
        return false;
      }
      if (sourceFilter !== 'All' && item.source !== sourceFilter) return false;
      if (statusFilter !== 'All' && item.status !== statusFilter) return false;
      return true;
    });
  }, [referralsData, startDate, endDate, codeSearch, sourceFilter, statusFilter]);

  // ── Aggregated KPI Metrics ──
  const metrics = useMemo(() => {
    const totalReferrals = filteredReferrals.length;
    const successfulReferrals = filteredReferrals.filter((r) => r.status === 'Converted').length;
    const totalOrders = filteredReferrals.reduce((acc, curr) => acc + curr.orders, 0);
    const totalRevenue = filteredReferrals.reduce((acc, curr) => acc + curr.orderValue, 0);
    const totalRewards = filteredReferrals.reduce((acc, curr) => acc + curr.reward, 0);

    const conversionRate = totalReferrals > 0 ? (successfulReferrals / totalReferrals) * 100 : 0;
    const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const uniqueAdvocates = new Set(filteredReferrals.map((r) => r.referrerName)).size;
    const totalVisits = filteredReferrals.reduce((acc, curr) => acc + curr.visitsCount, 0);

    return {
      totalReferrals,
      successfulReferrals,
      totalOrders,
      totalRevenue,
      totalRewards,
      conversionRate,
      aov,
      uniqueAdvocates,
      totalVisits,
    };
  }, [filteredReferrals]);

  // ── 8 Executive KPI Stat Cards ──
  const kpis: ReportStatData[] = [
    {
      id: 'kpi-ref-1',
      label: 'Total Referrals',
      value: `${metrics.totalReferrals} Invitations`,
      icon: 'fa-solid fa-paper-plane',
      color: '#0d9488',
      change: 'Doctor Advocates',
      isPositive: true,
      subtext: 'Tracked peer invite links',
      badge: 'Advocacy',
    },
    {
      id: 'kpi-ref-2',
      label: 'Successful Referrals',
      value: `${metrics.successfulReferrals} Converted`,
      icon: 'fa-solid fa-user-check',
      color: '#16a34a',
      change: `${((metrics.successfulReferrals / (metrics.totalReferrals || 1)) * 100).toFixed(0)}% Success Rate`,
      isPositive: true,
      subtext: 'Completed first order checkouts',
      badge: 'Acquisition',
    },
    {
      id: 'kpi-ref-3',
      label: 'Referral Orders',
      value: `${metrics.totalOrders} Orders`,
      icon: 'fa-solid fa-boxes-stacked',
      color: '#3b82f6',
      change: '+26.8% Volume',
      isPositive: true,
      subtext: 'Orders placed by referred clinics',
      badge: 'Order Volume',
    },
    {
      id: 'kpi-ref-4',
      label: 'Referral Revenue',
      value: `₹${metrics.totalRevenue.toLocaleString('en-IN')}`,
      icon: 'fa-solid fa-sack-dollar',
      color: '#0284c7',
      change: '+31.4% MoM',
      isPositive: true,
      subtext: 'Influenced gross catalog revenue',
      badge: 'Influenced Sales',
    },
    {
      id: 'kpi-ref-5',
      label: 'Referral Rewards',
      value: `₹${metrics.totalRewards.toLocaleString('en-IN')}`,
      icon: 'fa-solid fa-gem',
      color: '#ec4899',
      change: 'BrightPoints Credited',
      isPositive: true,
      subtext: 'Commission bonuses granted',
      badge: 'Commissions',
    },
    {
      id: 'kpi-ref-6',
      label: 'Conversion Rate',
      value: `${metrics.conversionRate.toFixed(1)}%`,
      icon: 'fa-solid fa-arrow-trend-up',
      color: '#059669',
      change: '+5.4% vs last month',
      isPositive: true,
      subtext: 'Invites converted to ordering doctors',
      badge: 'Conversion',
    },
    {
      id: 'kpi-ref-7',
      label: 'Average Order Value (AOV)',
      value: `₹${Math.round(metrics.aov).toLocaleString('en-IN')}`,
      icon: 'fa-solid fa-chart-pie',
      color: '#8b5cf6',
      change: 'Per Referral Order',
      isPositive: true,
      subtext: 'Mean spend of referred clients',
      badge: 'AOV Metric',
    },
    {
      id: 'kpi-ref-8',
      label: 'Active Advocates',
      value: `${metrics.uniqueAdvocates} Doctors`,
      icon: 'fa-solid fa-user-doctor',
      color: '#f59e0b',
      change: 'Top Tier Referrers',
      isPositive: true,
      subtext: 'Practitioners actively sharing codes',
      badge: 'Network',
    },
  ];

  // ── Pagination Calculation ──
  const totalPages = Math.ceil(filteredReferrals.length / pageSize) || 1;
  const paginatedReferrals = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredReferrals.slice(startIndex, startIndex + pageSize);
  }, [filteredReferrals, currentPage, pageSize]);

  // ── Highcharts Data: 1. Referrals Over Time (Line / Area Spline) ──
  const referralsOverTimeOptions: Highcharts.Options = useMemo(() => {
    const dateMap = new Map<string, { invites: number; conversions: number }>();

    filteredReferrals.forEach((item) => {
      const d = item.rawDate;
      const cur = dateMap.get(d) || { invites: 0, conversions: 0 };
      cur.invites += 1;
      if (item.status === 'Converted') cur.conversions += 1;
      dateMap.set(d, cur);
    });

    const sortedDates = Array.from(dateMap.keys()).sort();
    const invitesData = sortedDates.map((d) => dateMap.get(d)?.invites || 0);
    const conversionsData = sortedDates.map((d) => dateMap.get(d)?.conversions || 0);

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
        title: { text: 'Referral Events', style: { color: '#64748b', fontSize: '12px' } },
        gridLineColor: '#f1f5f9',
        labels: { style: { color: '#64748b', fontSize: '11px' } },
      },
      tooltip: {
        shared: true,
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        borderRadius: 8,
        style: { color: '#ffffff' },
        headerFormat: '<span style="font-size:12px;font-weight:700;color:#38bdf8">{point.key}</span><br/>',
        pointFormat: '<span style="color:{series.color}">●</span> {series.name}: <b>{point.y}</b><br/>',
      },
      plotOptions: {
        areaspline: {
          fillOpacity: 0.15,
          marker: { radius: 4, symbol: 'circle' },
          lineWidth: 3,
        },
      },
      series: [
        {
          type: 'areaspline',
          name: 'Invites Generated',
          data: invitesData,
          color: '#0d9488',
        },
        {
          type: 'areaspline',
          name: 'Converted Doctors',
          data: conversionsData,
          color: '#16a34a',
        },
      ],
    };
  }, [filteredReferrals]);

  // ── Highcharts Data: 2. Referral Conversion Funnel (Funnel / Column Flow) ──
  const referralFunnelOptions: Highcharts.Options = useMemo(() => {
    const visits = metrics.totalVisits || 150;
    const registered = Math.round(visits * 0.65) || 98;
    const ordered = metrics.totalOrders || 45;
    const converted = metrics.successfulReferrals || 28;

    const stages = [
      { name: 'Referral Visits', y: visits, color: '#38bdf8' },
      { name: 'Registered', y: registered, color: '#0d9488' },
      { name: 'Ordered', y: ordered, color: '#f59e0b' },
      { name: 'Converted', y: converted, color: '#16a34a' },
    ];

    return {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        style: { fontFamily: "'Inter', system-ui, -apple-system, sans-serif" },
        height: 320,
      },
      title: { text: undefined },
      credits: { enabled: false },
      xAxis: {
        categories: stages.map((s) => s.name),
        labels: { style: { color: '#334155', fontSize: '11px', fontWeight: '700' } },
        lineColor: '#e2e8f0',
      },
      yAxis: {
        title: { text: 'Practitioners', style: { color: '#64748b', fontSize: '12px' } },
        gridLineColor: '#f1f5f9',
        labels: { style: { color: '#64748b', fontSize: '11px' } },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        borderRadius: 8,
        style: { color: '#ffffff' },
        formatter: function () {
          const self = this as any;
          const stageName = self.x || self.point?.name || '';
          const stageVal = self.y || 0;
          const pctOfVisits = ((stageVal / visits) * 100).toFixed(1);
          return `<b>${stageName}</b><br/>Total: <b>${stageVal}</b><br/>Funnel Yield: <b>${pctOfVisits}% of Visits</b>`;
        },
      },
      plotOptions: {
        column: {
          borderRadius: 6,
          colorByPoint: true,
          dataLabels: {
            enabled: true,
            formatter: function (this: any): string {
              const y: number = this.y || 0;
              return `${y}`;
            },
            style: { fontWeight: '700', color: '#0f172a', fontSize: '11px' },
          },
        },
      },
      series: [
        {
          type: 'column',
          name: 'Conversion Stage',
          data: stages.map((s) => ({ y: s.y, color: s.color })),
          showInLegend: false,
        },
      ],
    };
  }, [metrics]);

  // ── Highcharts Data: 3. Revenue by Referral Source (Bar / Column Chart) ──
  const revenueBySourceOptions: Highcharts.Options = useMemo(() => {
    const sourceRevMap = new Map<string, number>();

    filteredReferrals.forEach((item) => {
      const cur = sourceRevMap.get(item.source) || 0;
      sourceRevMap.set(item.source, cur + item.orderValue);
    });

    const sources = Array.from(sourceRevMap.keys());
    const data = sources.map((s) => ({
      name: s,
      y: sourceRevMap.get(s) || 0,
    }));

    return {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        style: { fontFamily: "'Inter', system-ui, -apple-system, sans-serif" },
        height: 320,
      },
      title: { text: undefined },
      credits: { enabled: false },
      xAxis: {
        categories: sources.length > 0 ? sources : ['No Data'],
        labels: {
          style: { color: '#334155', fontSize: '11px', fontWeight: '700' },
          rotation: -10,
        },
        lineColor: '#e2e8f0',
      },
      yAxis: {
        title: { text: 'Influenced Sales (₹)', style: { color: '#64748b', fontSize: '12px' } },
        gridLineColor: '#f1f5f9',
        labels: {
          formatter: function (this: any): string {
            return `₹${Number(this.value) / 1000}K`;
          },
          style: { color: '#64748b', fontSize: '11px' },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        borderRadius: 8,
        style: { color: '#ffffff' },
        formatter: function () {
          const self = this as any;
          return `<b>Source: ${self.x}</b><br/>Revenue: <span style="color:#38bdf8;font-weight:700">₹${Number(self.y).toLocaleString('en-IN')}</span>`;
        },
      },
      plotOptions: {
        column: {
          borderRadius: 6,
          color: '#8b5cf6',
          dataLabels: {
            enabled: true,
            formatter: function (this: any): string {
              const y: number = this.y || 0;
              return `₹${(y / 1000).toFixed(0)}K`;
            },
            style: { fontWeight: '700', color: '#4c1d95', fontSize: '11px' },
          },
        },
      },
      series: [
        {
          type: 'column',
          name: 'Influenced Sales',
          data: data.map((d) => d.y),
          showInLegend: false,
        },
      ],
    };
  }, [filteredReferrals]);

  // ── CSV Export ──
  const handleExportCSV = () => {
    exportTableToCSV({
      filename: `buybright_referral_report_${Date.now()}`,
      headers: [
        'Referral Code',
        'Referrer Doctor',
        'Referrer Clinic',
        'Referred Customer',
        'Referred Clinic',
        'Date',
        'Orders',
        'Order Value (₹)',
        'Reward (₹)',
        'Source',
        'Status',
      ],
      rows: filteredReferrals.map((r) => [
        r.referralCode,
        r.referrerName,
        r.referrerClinic,
        r.referredCustomerName,
        r.referredCustomerClinic,
        r.date,
        r.orders,
        r.orderValue,
        r.reward,
        r.source,
        r.status,
      ]),
    });
    showToast('Referral Report exported as CSV successfully', 'success');
  };

  // ── PDF Export ──
  const handleExportPDF = () => {
    exportTableToPDF({
      title: 'BuyBright — Doctor Referral & Peer Acquisition Report',
      subtitle: `Doctor invitations, conversion yields, and reward payouts (${startDate} to ${endDate})`,
      headers: [
        'Code',
        'Referrer',
        'Referred Doctor',
        'Date',
        'Orders',
        'Order Value',
        'Reward',
        'Status',
      ],
      rows: filteredReferrals.map((r) => [
        r.referralCode,
        r.referrerName,
        r.referredCustomerName,
        r.date,
        r.orders,
        `₹${r.orderValue.toLocaleString('en-IN')}`,
        `₹${r.reward.toLocaleString('en-IN')}`,
        r.status,
      ]),
    });
    showToast('Referral Report exported as PDF successfully', 'success');
  };

  return (
    <AdminLayout
      title="Referral & Peer Acquisition Report"
      subtitle="Track doctor-to-doctor advocacy loops, peer conversions, reward incentives, and influenced revenue"
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

        {/* Granular Input Controls */}
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

          {/* Referral Code / Doctor Search */}
          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
              Referral Code / Doctor
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
                placeholder="Code or Doctor Name..."
                value={codeSearch}
                onChange={(e) => {
                  setCodeSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="table-search-input"
                style={{ width: '100%', paddingLeft: '30px', fontSize: '0.82rem', padding: '7px 10px 7px 30px' }}
              />
            </div>
          </div>

          {/* Referral Source Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
              Referral Source
            </label>
            <select
              value={sourceFilter}
              onChange={(e) => {
                setSourceFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="table-filter-select"
              style={{ width: '100%', fontSize: '0.82rem', padding: '7px 10px' }}
            >
              <option value="All">All Sources</option>
              <option value="WhatsApp Share">WhatsApp Share</option>
              <option value="Direct Link">Direct Link</option>
              <option value="Email Invite">Email Invite</option>
              <option value="QR Code Scan">QR Code Scan</option>
              <option value="SMS Invite">SMS Invite</option>
            </select>
          </div>

          {/* Referral Status Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
              Referral Status
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
              <option value="Converted">Converted to Order</option>
              <option value="Pending First Order">Pending First Order</option>
              <option value="Registered">Registered Only</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── 3 Highcharts Visualizations (Grid Layout) ── */}
      <div className="reports-charts-grid">
        {/* Graph 1: Referrals Over Time */}
        <div className="report-chart-card">
          <div className="report-chart-header">
            <div className="report-chart-title-wrap">
              <h3 className="report-chart-title">
                <i className="fa-solid fa-chart-line" style={{ color: '#0d9488' }} />
                1. Referrals Over Time
              </h3>
              <p className="report-chart-desc">
                Daily doctor-to-doctor invitations vs. converted ordering clinics
              </p>
            </div>
            <span className="report-chart-badge">Line / Area Spline</span>
          </div>
          <div className="report-chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={referralsOverTimeOptions} />
          </div>
        </div>

        {/* Graph 2: Referral Conversion Funnel */}
        <div className="report-chart-card">
          <div className="report-chart-header">
            <div className="report-chart-title-wrap">
              <h3 className="report-chart-title">
                <i className="fa-solid fa-filter" style={{ color: '#3b82f6' }} />
                2. Referral Conversion Funnel
              </h3>
              <p className="report-chart-desc">
                Referral Visits ↓ Registered ↓ Ordered ↓ Converted
              </p>
            </div>
            <span className="report-chart-badge" style={{ color: '#3b82f6', background: '#eff6ff', borderColor: '#dbeafe' }}>
              Conversion Funnel
            </span>
          </div>
          <div className="report-chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={referralFunnelOptions} />
          </div>
        </div>

        {/* Graph 3: Revenue by Referral Source (Span 2 columns if space allows) */}
        <div className="report-chart-card" style={{ gridColumn: '1 / -1' }}>
          <div className="report-chart-header">
            <div className="report-chart-title-wrap">
              <h3 className="report-chart-title">
                <i className="fa-solid fa-chart-column" style={{ color: '#8b5cf6' }} />
                3. Revenue by Referral Source
              </h3>
              <p className="report-chart-desc">
                Comparing sales yield across WhatsApp, Direct Links, Email, QR Codes, and SMS
              </p>
            </div>
            <span className="report-chart-badge" style={{ color: '#8b5cf6', background: '#f5f3ff', borderColor: '#ede9fe' }}>
              Bar / Column Chart
            </span>
          </div>
          <div className="report-chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={revenueBySourceOptions} />
          </div>
        </div>
      </div>

      {/* ── Paginated Referral Ledger Table ── */}
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
              Doctor Referral Ledger
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
              {filteredReferrals.length} Referrals
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
                <th style={{ minWidth: '150px' }}>Referral Code</th>
                <th style={{ minWidth: '180px' }}>Referrer</th>
                <th style={{ minWidth: '180px' }}>Referred Customer</th>
                <th style={{ minWidth: '120px' }}>Date</th>
                <th style={{ textAlign: 'center', minWidth: '90px' }}>Orders</th>
                <th style={{ textAlign: 'right', minWidth: '120px' }}>Order Value</th>
                <th style={{ textAlign: 'right', minWidth: '110px' }}>Reward</th>
                <th style={{ textAlign: 'center', minWidth: '120px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReferrals.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
                    <i
                      className="fa-solid fa-paper-plane"
                      style={{ fontSize: '2.2rem', marginBottom: '10px', display: 'block', color: '#cbd5e1' }}
                    />
                    <div style={{ fontWeight: 600, fontSize: '0.94rem', color: '#334155' }}>
                      No referral records match your filters
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
                      Try adjusting your date range, search query, or source filter.
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedReferrals.map((r) => {
                  let statusBadgeClass = 'badge-active';
                  if (r.status === 'Pending First Order') statusBadgeClass = 'badge-pending';
                  if (r.status === 'Registered') statusBadgeClass = 'badge-neutral';
                  if (r.status === 'Expired') statusBadgeClass = 'badge-inactive';

                  return (
                    <tr key={r.id}>
                      {/* Referral Code */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span
                            style={{
                              fontSize: '0.8rem',
                              fontWeight: 800,
                              color: '#0d9488',
                              letterSpacing: '0.6px',
                              background: '#f0fdfa',
                              padding: '2px 7px',
                              borderRadius: '5px',
                              border: '1px solid #ccfbf1',
                              fontFamily: 'monospace',
                              width: 'fit-content',
                            }}
                          >
                            {r.referralCode}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            via {r.source}
                          </span>
                        </div>
                      </td>

                      {/* Referrer Doctor & Clinic */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.86rem' }}>
                            {r.referrerName}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {r.referrerClinic}
                          </span>
                        </div>
                      </td>

                      {/* Referred Customer */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.86rem' }}>
                            {r.referredCustomerName}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {r.referredCustomerClinic}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td>
                        <span style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 500 }}>
                          {r.date}
                        </span>
                      </td>

                      {/* Orders */}
                      <td style={{ textAlign: 'center' }}>
                        <span
                          style={{
                            fontWeight: 700,
                            color: r.orders > 0 ? '#16a34a' : '#64748b',
                            background: r.orders > 0 ? '#f0fdf4' : '#f1f5f9',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontSize: '0.82rem',
                          }}
                        >
                          {r.orders}
                        </span>
                      </td>

                      {/* Order Value */}
                      <td style={{ textAlign: 'right' }}>
                        <strong style={{ color: '#0f766e', fontSize: '0.92rem' }}>
                          ₹{r.orderValue.toLocaleString('en-IN')}
                        </strong>
                      </td>

                      {/* Reward */}
                      <td style={{ textAlign: 'right' }}>
                        <strong style={{ color: '#ec4899', fontSize: '0.88rem' }}>
                          {r.reward > 0 ? `₹${r.reward.toLocaleString('en-IN')}` : '—'}
                        </strong>
                      </td>

                      {/* Status */}
                      <td style={{ textAlign: 'center' }}>
                        <span className={`admin-badge ${statusBadgeClass}`}>{r.status}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* Totals Summary Footer */}
            {filteredReferrals.length > 0 && (
              <tfoot>
                <tr style={{ background: '#f8fafc', fontWeight: 700, borderTop: '2px solid #e2e8f0' }}>
                  <td colSpan={4} style={{ color: '#0f172a', fontSize: '0.88rem' }}>
                    <i className="fa-solid fa-calculator" style={{ color: '#0d9488', marginRight: '6px' }} />
                    Total Summary ({filteredReferrals.length} Referrals)
                  </td>
                  <td style={{ textAlign: 'center', color: '#16a34a', fontSize: '0.88rem' }}>
                    {metrics.totalOrders}
                  </td>
                  <td style={{ textAlign: 'right', color: '#0f766e', fontSize: '0.94rem' }}>
                    ₹{metrics.totalRevenue.toLocaleString('en-IN')}
                  </td>
                  <td style={{ textAlign: 'right', color: '#ec4899', fontSize: '0.9rem' }}>
                    ₹{metrics.totalRewards.toLocaleString('en-IN')}
                  </td>
                  <td style={{ textAlign: 'center', color: '#059669', fontSize: '0.82rem' }}>
                    {metrics.successfulReferrals} Converted
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
          totalItems={filteredReferrals.length}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </AdminLayout>
  );
};

export default ReferralReportPage;
