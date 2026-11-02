/**
 * BuyBright Admin — Coupon Report Page.
 * Purpose: Understand coupon campaign performance, redemption velocity, discount subsidies, and influenced revenue.
 *
 * Features:
 *   - 8 Executive KPI Stat Cards (Total Coupons, Active Coupons, Coupons Used, Total Redemptions, Discount Given, Revenue Generated, Average Discount, Coupon Conversion Rate)
 *   - Comprehensive Filter Suite (Quick Dates, Custom Range, Coupon Search, Coupon Type, Coupon Status, Reset)
 *   - 3 Highcharts Data Visualizations:
 *       1. Coupon Usage Over Time (Line / Area Spline Chart)
 *       2. Top Coupons by Usage (Bar / Column Chart)
 *       3. Discount vs Revenue (Bar + Line Combo Chart)
 *   - Paginated Coupon Performance Table with Totals Summary Footer
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
import { initialCouponReport, CouponReportItem } from '../../data/reportsData';

type QuickDateOption = 'Today' | '7 Days' | '30 Days' | 'This Month' | 'Last Month' | 'Custom';

export const CouponReportPage: React.FC = () => {
  const { showToast } = useToast();
  const [couponsData] = useState<CouponReportItem[]>(initialCouponReport);

  // ── Filter States ──
  const [quickDate, setQuickDate] = useState<QuickDateOption>('30 Days');
  const [startDate, setStartDate] = useState<string>('2026-09-25');
  const [endDate, setEndDate] = useState<string>('2026-10-06');
  const [couponSearch, setCouponSearch] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
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
    setCouponSearch('');
    setTypeFilter('All');
    setStatusFilter('All');
    setCurrentPage(1);
    showToast('Coupon filters reset to default', 'info');
  };

  // ── Filtered Coupons Computation ──
  const filteredCoupons = useMemo(() => {
    return couponsData.filter((item) => {
      if (startDate && item.rawDate < startDate) return false;
      if (endDate && item.rawDate > endDate) return false;
      if (
        couponSearch &&
        !item.code.toLowerCase().includes(couponSearch.toLowerCase()) &&
        !item.discountValue.toLowerCase().includes(couponSearch.toLowerCase())
      ) {
        return false;
      }
      if (typeFilter !== 'All' && item.couponType !== typeFilter) return false;
      if (statusFilter !== 'All' && item.status !== statusFilter) return false;
      return true;
    });
  }, [couponsData, startDate, endDate, couponSearch, typeFilter, statusFilter]);

  // ── Aggregated KPI Metrics ──
  const metrics = useMemo(() => {
    const totalCoupons = filteredCoupons.length;
    const activeCoupons = filteredCoupons.filter((c) => c.status === 'Active').length;
    const couponsUsed = filteredCoupons.filter((c) => c.used > 0).length;
    const totalRedemptions = filteredCoupons.reduce((acc, curr) => acc + curr.used, 0);
    const totalOrders = filteredCoupons.reduce((acc, curr) => acc + curr.orders, 0);
    const discountGiven = filteredCoupons.reduce((acc, curr) => acc + curr.discountGiven, 0);
    const revenueGenerated = filteredCoupons.reduce((acc, curr) => acc + curr.revenueGenerated, 0);

    const averageDiscount = totalRedemptions > 0 ? discountGiven / totalRedemptions : 0;
    const totalLimit = filteredCoupons.reduce((acc, curr) => acc + (curr.usageLimit || curr.used), 0);
    const couponConversionRate = totalLimit > 0 ? (totalRedemptions / totalLimit) * 100 : 0;

    return {
      totalCoupons,
      activeCoupons,
      couponsUsed,
      totalRedemptions,
      totalOrders,
      discountGiven,
      revenueGenerated,
      averageDiscount,
      couponConversionRate,
    };
  }, [filteredCoupons]);

  // ── 8 Executive KPI Stat Cards ──
  const kpis: ReportStatData[] = [
    {
      id: 'kpi-coup-1',
      label: 'Total Coupons',
      value: `${metrics.totalCoupons} Coupons`,
      icon: 'fa-solid fa-ticket',
      color: '#0d9488',
      change: 'Campaign Portfolio',
      isPositive: true,
      subtext: 'Created promotional vouchers',
      badge: 'Portfolio',
    },
    {
      id: 'kpi-coup-2',
      label: 'Active Coupons',
      value: `${metrics.activeCoupons} Live`,
      icon: 'fa-solid fa-circle-check',
      color: '#16a34a',
      change: 'Live for Checkout',
      isPositive: true,
      subtext: 'Currently claimable codes',
      badge: 'Active Deals',
    },
    {
      id: 'kpi-coup-3',
      label: 'Coupons Used',
      value: `${metrics.couponsUsed} Vouchers`,
      icon: 'fa-solid fa-tags',
      color: '#3b82f6',
      change: `${((metrics.couponsUsed / (metrics.totalCoupons || 1)) * 100).toFixed(0)}% Adoption`,
      isPositive: true,
      subtext: 'Codes with ≥ 1 redemption',
      badge: 'Adoption',
    },
    {
      id: 'kpi-coup-4',
      label: 'Total Redemptions',
      value: `${metrics.totalRedemptions.toLocaleString('en-IN')} Uses`,
      icon: 'fa-solid fa-hand-holding-dollar',
      color: '#8b5cf6',
      change: '+22.4% MoM',
      isPositive: true,
      subtext: 'Completed coupon redemptions',
      badge: 'Redemptions',
    },
    {
      id: 'kpi-coup-5',
      label: 'Discount Given',
      value: `₹${metrics.discountGiven.toLocaleString('en-IN')}`,
      icon: 'fa-solid fa-piggy-bank',
      color: '#ec4899',
      change: 'Subsidies Granted',
      isPositive: true,
      subtext: 'Direct clinic savings passed',
      badge: 'Subsidies',
    },
    {
      id: 'kpi-coup-6',
      label: 'Revenue Generated',
      value: `₹${metrics.revenueGenerated.toLocaleString('en-IN')}`,
      icon: 'fa-solid fa-sack-dollar',
      color: '#0284c7',
      change: `${(metrics.discountGiven > 0 ? metrics.revenueGenerated / metrics.discountGiven : 0).toFixed(1)}x ROI`,
      isPositive: true,
      subtext: 'Influenced gross order billing',
      badge: 'Influenced ROI',
    },
    {
      id: 'kpi-coup-7',
      label: 'Average Discount',
      value: `₹${Math.round(metrics.averageDiscount).toLocaleString('en-IN')}`,
      icon: 'fa-solid fa-calculator',
      color: '#f59e0b',
      change: 'Avg Saving / Order',
      isPositive: true,
      subtext: 'Mean deduction per redemption',
      badge: 'AOV Relief',
    },
    {
      id: 'kpi-coup-8',
      label: 'Coupon Conversion Rate',
      value: `${metrics.couponConversionRate.toFixed(1)}%`,
      icon: 'fa-solid fa-arrow-trend-up',
      color: '#10b981',
      change: '+6.8% Efficiency',
      isPositive: true,
      subtext: 'Claimed vs allocated limits',
      badge: 'Conversion',
    },
  ];

  // ── Pagination Calculation ──
  const totalPages = Math.ceil(filteredCoupons.length / pageSize) || 1;
  const paginatedCoupons = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredCoupons.slice(startIndex, startIndex + pageSize);
  }, [filteredCoupons, currentPage, pageSize]);

  // ── Highcharts Data: 1. Coupon Usage Over Time (Line / Area Spline) ──
  const couponUsageOverTimeOptions: Highcharts.Options = useMemo(() => {
    const dateMap = new Map<string, { redemptions: number; orders: number }>();

    filteredCoupons.forEach((item) => {
      const d = item.rawDate;
      const cur = dateMap.get(d) || { redemptions: 0, orders: 0 };
      cur.redemptions += item.used;
      cur.orders += item.orders;
      dateMap.set(d, cur);
    });

    const sortedDates = Array.from(dateMap.keys()).sort();
    const redemptionsData = sortedDates.map((d) => dateMap.get(d)?.redemptions || 0);
    const ordersData = sortedDates.map((d) => dateMap.get(d)?.orders || 0);

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
        title: { text: 'Redemptions / Orders', style: { color: '#64748b', fontSize: '12px' } },
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
          name: 'Coupon Uses',
          data: redemptionsData,
          color: '#0d9488',
        },
        {
          type: 'areaspline',
          name: 'Orders Influenced',
          data: ordersData,
          color: '#3b82f6',
        },
      ],
    };
  }, [filteredCoupons]);

  // ── Highcharts Data: 2. Top Coupons by Usage (Bar / Column Chart) ──
  const topCouponsByUsageOptions: Highcharts.Options = useMemo(() => {
    const sorted = [...filteredCoupons].sort((a, b) => b.used - a.used).slice(0, 6);
    const categories = sorted.map((c) => c.code);
    const usedData = sorted.map((c) => ({
      y: c.used,
      discountVal: c.discountGiven,
      rev: c.revenueGenerated,
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
        categories: categories.length > 0 ? categories : ['No Data'],
        labels: {
          style: { color: '#334155', fontSize: '11px', fontWeight: '700' },
          rotation: -10,
        },
        lineColor: '#e2e8f0',
      },
      yAxis: {
        title: { text: 'Redemption Count', style: { color: '#64748b', fontSize: '12px' } },
        gridLineColor: '#f1f5f9',
        labels: { style: { color: '#64748b', fontSize: '11px' } },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        borderRadius: 8,
        style: { color: '#ffffff' },
        formatter: function () {
          const self = this as any;
          const code = self.x || self.point?.name || '';
          const used = self.y || 0;
          const pointObj = self.point || {};
          const discountVal = pointObj.discountVal ?? 0;
          const rev = pointObj.rev ?? 0;
          return `<b>Code: ${code}</b><br/>` +
            `Redemptions: <span style="color:#38bdf8;font-weight:700">${used} Uses</span><br/>` +
            `Discount Given: <b>₹${Number(discountVal).toLocaleString('en-IN')}</b><br/>` +
            `Revenue Generated: <b>₹${Number(rev).toLocaleString('en-IN')}</b>`;
        },
      },
      plotOptions: {
        column: {
          borderRadius: 6,
          color: '#8b5cf6',
          dataLabels: {
            enabled: true,
            format: '{y}',
            style: { fontWeight: '700', color: '#5b21b6', fontSize: '11px' },
          },
        },
      },
      series: [
        {
          type: 'column',
          name: 'Redemptions',
          data: usedData,
          showInLegend: false,
        },
      ],
    };
  }, [filteredCoupons]);

  // ── Highcharts Data: 3. Discount vs Revenue (Bar + Line Combo Chart) ──
  const discountVsRevenueOptions: Highcharts.Options = useMemo(() => {
    const topCoupons = [...filteredCoupons].sort((a, b) => b.revenueGenerated - a.revenueGenerated).slice(0, 6);
    const categories = topCoupons.map((c) => c.code);
    const discountData = topCoupons.map((c) => c.discountGiven);
    const revenueData = topCoupons.map((c) => c.revenueGenerated);

    return {
      chart: {
        backgroundColor: 'transparent',
        style: { fontFamily: "'Inter', system-ui, -apple-system, sans-serif" },
        height: 320,
      },
      title: { text: undefined },
      credits: { enabled: false },
      xAxis: {
        categories: categories.length > 0 ? categories : ['No Data'],
        labels: {
          style: { color: '#334155', fontSize: '11px', fontWeight: '700' },
          rotation: -10,
        },
        lineColor: '#e2e8f0',
      },
      yAxis: [
        {
          title: { text: 'Discount Given (₹)', style: { color: '#ec4899', fontSize: '12px' } },
          gridLineColor: '#f1f5f9',
          labels: {
            formatter: function (this: any): string {
              return `₹${Number(this.value) / 1000}K`;
            },
            style: { color: '#ec4899', fontSize: '11px' },
          },
        },
        {
          title: { text: 'Revenue Generated (₹)', style: { color: '#0284c7', fontSize: '12px' } },
          opposite: true,
          gridLineWidth: 0,
          labels: {
            formatter: function (this: any): string {
              return `₹${Number(this.value) / 100000}L`;
            },
            style: { color: '#0284c7', fontSize: '11px', fontWeight: '600' },
          },
        },
      ],
      tooltip: {
        shared: true,
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        borderRadius: 8,
        style: { color: '#ffffff' },
        formatter: function () {
          const self = this as any;
          const points = self.points || [];
          let res = `<b>Code: ${self.x}</b><br/>`;
          points.forEach((p: any) => {
            res += `<span style="color:${p.color}">●</span> ${p.series.name}: <b>₹${Number(p.y).toLocaleString('en-IN')}</b><br/>`;
          });
          return res;
        },
      },
      series: [
        {
          type: 'column',
          name: 'Discount Given',
          data: discountData,
          color: '#f472b6',
          borderRadius: 5,
        },
        {
          type: 'spline',
          name: 'Revenue Generated',
          data: revenueData,
          yAxis: 1,
          color: '#0284c7',
          lineWidth: 3,
          marker: { radius: 5, symbol: 'circle', fillColor: '#0284c7' },
        },
      ],
    };
  }, [filteredCoupons]);

  // ── CSV Export ──
  const handleExportCSV = () => {
    exportTableToCSV({
      filename: `presto_coupon_report_${Date.now()}`,
      headers: [
        'Coupon Code',
        'Coupon Type',
        'Discount Value',
        'Usage Limit',
        'Used Count',
        'Orders Influenced',
        'Discount Given (₹)',
        'Revenue Generated (₹)',
        'Status',
        'Valid From',
        'Valid Till',
      ],
      rows: filteredCoupons.map((c) => [
        c.code,
        c.couponType,
        c.discountValue,
        c.usageLimit === 0 ? 'Unlimited' : c.usageLimit,
        c.used,
        c.orders,
        c.discountGiven,
        c.revenueGenerated,
        c.status,
        c.validFrom,
        c.validTill,
      ]),
    });
    showToast('Coupon Report exported as CSV successfully', 'success');
  };

  // ── PDF Export ──
  const handleExportPDF = () => {
    exportTableToPDF({
      title: 'BuyBright — Promotional Coupon Performance Report',
      subtitle: `Coupon redemptions, discount subsidies, and generated sales (${startDate} to ${endDate})`,
      headers: [
        'Code',
        'Type',
        'Limit',
        'Used',
        'Orders',
        'Discount Given',
        'Revenue',
        'Status',
      ],
      rows: filteredCoupons.map((c) => [
        c.code,
        c.couponType,
        c.usageLimit === 0 ? 'Unlimited' : c.usageLimit,
        c.used,
        c.orders,
        `₹${c.discountGiven.toLocaleString('en-IN')}`,
        `₹${c.revenueGenerated.toLocaleString('en-IN')}`,
        c.status,
      ]),
    });
    showToast('Coupon Report exported as PDF successfully', 'success');
  };

  return (
    <AdminLayout
      title="Coupon & Promotion Report"
      subtitle="Track promotional voucher adoption, discount budget utilization, and campaign ROI"
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

          {/* Coupon Search */}
          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
              Coupon Code Search
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
                placeholder="Search code e.g. FESTIVE..."
                value={couponSearch}
                onChange={(e) => {
                  setCouponSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="table-search-input"
                style={{ width: '100%', paddingLeft: '30px', fontSize: '0.82rem', padding: '7px 10px 7px 30px' }}
              />
            </div>
          </div>

          {/* Coupon Type Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
              Coupon Type
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
              <option value="All">All Coupon Types</option>
              <option value="Flat Discount">Flat Discount (₹)</option>
              <option value="Percentage">Percentage Discount (%)</option>
              <option value="Free Shipping">Free Shipping</option>
              <option value="Buy X Get Y">Buy X Get Y (BOGO)</option>
            </select>
          </div>

          {/* Coupon Status Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
              Coupon Status
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
              <option value="Active">Active &amp; Claimable</option>
              <option value="Expired">Expired</option>
              <option value="Paused">Paused</option>
              <option value="Depleted">Depleted Limit</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── 3 Highcharts Visualizations (Grid Layout) ── */}
      <div className="reports-charts-grid">
        {/* Graph 1: Coupon Usage Over Time */}
        <div className="report-chart-card">
          <div className="report-chart-header">
            <div className="report-chart-title-wrap">
              <h3 className="report-chart-title">
                <i className="fa-solid fa-chart-line" style={{ color: '#0d9488' }} />
                1. Coupon Usage Over Time
              </h3>
              <p className="report-chart-desc">
                Daily coupon redemption velocity and influenced orders
              </p>
            </div>
            <span className="report-chart-badge">Line / Area Spline</span>
          </div>
          <div className="report-chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={couponUsageOverTimeOptions} />
          </div>
        </div>

        {/* Graph 2: Top Coupons by Usage */}
        <div className="report-chart-card">
          <div className="report-chart-header">
            <div className="report-chart-title-wrap">
              <h3 className="report-chart-title">
                <i className="fa-solid fa-ranking-star" style={{ color: '#8b5cf6' }} />
                2. Top Coupons by Usage
              </h3>
              <p className="report-chart-desc">
                Highest volume promo codes ranked by redemptions
              </p>
            </div>
            <span className="report-chart-badge" style={{ color: '#8b5cf6', background: '#f5f3ff', borderColor: '#ede9fe' }}>
              Bar / Column Chart
            </span>
          </div>
          <div className="report-chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={topCouponsByUsageOptions} />
          </div>
        </div>

        {/* Graph 3: Discount vs Revenue (Span 2 columns if space allows) */}
        <div className="report-chart-card" style={{ gridColumn: '1 / -1' }}>
          <div className="report-chart-header">
            <div className="report-chart-title-wrap">
              <h3 className="report-chart-title">
                <i className="fa-solid fa-chart-column" style={{ color: '#0284c7' }} />
                3. Discount vs Revenue
              </h3>
              <p className="report-chart-desc">
                Comparing discount subsidies granted against total generated sales volume
              </p>
            </div>
            <span className="report-chart-badge" style={{ color: '#0284c7', background: '#f0f9ff', borderColor: '#e0f2fe' }}>
              Bar + Line Combo Chart
            </span>
          </div>
          <div className="report-chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={discountVsRevenueOptions} />
          </div>
        </div>
      </div>

      {/* ── Paginated Coupon Performance Table ── */}
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
              Coupon Campaigns Performance Register
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
              {filteredCoupons.length} Vouchers
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
                <th style={{ minWidth: '180px' }}>Coupon Code</th>
                <th style={{ minWidth: '130px' }}>Coupon Type</th>
                <th style={{ textAlign: 'center', minWidth: '100px' }}>Usage Limit</th>
                <th style={{ textAlign: 'center', minWidth: '95px' }}>Used</th>
                <th style={{ textAlign: 'center', minWidth: '95px' }}>Orders</th>
                <th style={{ textAlign: 'right', minWidth: '120px' }}>Discount Given</th>
                <th style={{ textAlign: 'right', minWidth: '130px' }}>Revenue Generated</th>
                <th style={{ textAlign: 'center', minWidth: '100px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCoupons.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
                    <i
                      className="fa-solid fa-ticket"
                      style={{ fontSize: '2.2rem', marginBottom: '10px', display: 'block', color: '#cbd5e1' }}
                    />
                    <div style={{ fontWeight: 600, fontSize: '0.94rem', color: '#334155' }}>
                      No coupon campaigns match your filters
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
                      Try adjusting your date range, search query, or coupon type.
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedCoupons.map((c) => {
                  let badgeClass = 'badge-active';
                  if (c.status === 'Expired') badgeClass = 'badge-inactive';
                  if (c.status === 'Paused') badgeClass = 'badge-pending';
                  if (c.status === 'Depleted') badgeClass = 'badge-danger';

                  const isUnlimited = c.usageLimit === 0;
                  const usagePct = !isUnlimited && c.usageLimit > 0 ? ((c.used / c.usageLimit) * 100).toFixed(0) : null;

                  return (
                    <tr key={c.id}>
                      {/* Coupon Code & Value */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span
                            style={{
                              fontSize: '0.84rem',
                              fontWeight: 800,
                              color: '#0d9488',
                              letterSpacing: '0.8px',
                              background: '#f0fdfa',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              border: '1px solid #ccfbf1',
                              fontFamily: 'monospace',
                              width: 'fit-content',
                            }}
                          >
                            {c.code}
                          </span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155' }}>
                            {c.discountValue} • Min ₹{c.minOrderValue.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </td>

                      {/* Coupon Type */}
                      <td>
                        <span className="admin-badge badge-neutral" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                          {c.couponType}
                        </span>
                      </td>

                      {/* Usage Limit */}
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ fontWeight: 600, color: '#475569', fontSize: '0.82rem' }}>
                          {isUnlimited ? (
                            <span style={{ color: '#0d9488' }}>∞ Unlimited</span>
                          ) : (
                            `${c.usageLimit.toLocaleString('en-IN')} max`
                          )}
                        </span>
                      </td>

                      {/* Used / Progress */}
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span
                            style={{
                              fontWeight: 700,
                              color: '#3b82f6',
                              background: '#eff6ff',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '0.82rem',
                            }}
                          >
                            {c.used.toLocaleString('en-IN')}
                          </span>
                          {usagePct && (
                            <span style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                              {usagePct}% consumed
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Orders */}
                      <td style={{ textAlign: 'center' }}>
                        <strong style={{ color: '#0f172a', fontSize: '0.86rem' }}>
                          {c.orders.toLocaleString('en-IN')}
                        </strong>
                      </td>

                      {/* Discount Given */}
                      <td style={{ textAlign: 'right' }}>
                        <strong style={{ color: '#ec4899', fontSize: '0.88rem' }}>
                          ₹{c.discountGiven.toLocaleString('en-IN')}
                        </strong>
                      </td>

                      {/* Revenue Generated */}
                      <td style={{ textAlign: 'right' }}>
                        <strong style={{ color: '#0f766e', fontSize: '0.92rem' }}>
                          ₹{c.revenueGenerated.toLocaleString('en-IN')}
                        </strong>
                      </td>

                      {/* Status */}
                      <td style={{ textAlign: 'center' }}>
                        <span className={`admin-badge ${badgeClass}`}>{c.status}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* Totals Summary Footer */}
            {filteredCoupons.length > 0 && (
              <tfoot>
                <tr style={{ background: '#f8fafc', fontWeight: 700, borderTop: '2px solid #e2e8f0' }}>
                  <td colSpan={3} style={{ color: '#0f172a', fontSize: '0.88rem' }}>
                    <i className="fa-solid fa-calculator" style={{ color: '#0d9488', marginRight: '6px' }} />
                    Total Summary ({filteredCoupons.length} Vouchers)
                  </td>
                  <td style={{ textAlign: 'center', color: '#3b82f6', fontSize: '0.88rem' }}>
                    {metrics.totalRedemptions.toLocaleString('en-IN')}
                  </td>
                  <td style={{ textAlign: 'center', color: '#0f172a', fontSize: '0.88rem' }}>
                    {metrics.totalOrders.toLocaleString('en-IN')}
                  </td>
                  <td style={{ textAlign: 'right', color: '#ec4899', fontSize: '0.9rem' }}>
                    ₹{metrics.discountGiven.toLocaleString('en-IN')}
                  </td>
                  <td style={{ textAlign: 'right', color: '#0f766e', fontSize: '0.94rem' }}>
                    ₹{metrics.revenueGenerated.toLocaleString('en-IN')}
                  </td>
                  <td style={{ textAlign: 'center', color: '#16a34a', fontSize: '0.82rem' }}>
                    {metrics.activeCoupons} Active
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
          totalItems={filteredCoupons.length}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </AdminLayout>
  );
};

export default CouponReportPage;
