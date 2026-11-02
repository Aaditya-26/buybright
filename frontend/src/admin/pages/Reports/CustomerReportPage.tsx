/**
 * BuyBright Admin — Customer Report Page.
 * Purpose: Track doctor purchasing behavior, clinic acquisition, B2B vs B2C segments, and lifetime value.
 *
 * Features:
 *   - 8 Executive KPI Stat Cards (Total Customers, New Customers, Returning Customers, Active Customers, B2B, B2C, Customer Revenue, Average Customer Order Value)
 *   - Comprehensive Multi-Dimensional Filters (Quick Dates, Custom Range, Customer Type, City, State, Status, Search, Reset)
 *   - 4 Highcharts Data Visualizations:
 *       1. Customer Growth (Line / Area Spline Chart)
 *       2. New vs Returning Customers (Column Chart)
 *       3. B2B vs B2C Segment Breakdown (Donut Chart)
 *       4. Customers by Location (Horizontal Bar Chart)
 *   - Paginated Customer Ledger Table with Summary Totals Footer
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
import { initialCustomerReport, CustomerReportItem } from '../../data/reportsData';

type QuickDateOption = 'Today' | '7 Days' | '30 Days' | 'This Month' | 'Last Month' | 'Custom';

export const CustomerReportPage: React.FC = () => {
  const { showToast } = useToast();
  const [customersData] = useState<CustomerReportItem[]>(initialCustomerReport);

  // ── Filter States ──
  const [quickDate, setQuickDate] = useState<QuickDateOption>('30 Days');
  const [startDate, setStartDate] = useState<string>('2026-09-25');
  const [endDate, setEndDate] = useState<string>('2026-10-06');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customerTypeFilter, setCustomerTypeFilter] = useState<string>('All');
  const [cityFilter, setCityFilter] = useState<string>('All');
  const [stateFilter, setStateFilter] = useState<string>('All');
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
    setSearchQuery('');
    setCustomerTypeFilter('All');
    setCityFilter('All');
    setStateFilter('All');
    setStatusFilter('All');
    setCurrentPage(1);
    showToast('Customer filters reset to default', 'info');
  };

  // ── Filtered Customers Computation ──
  const filteredCustomers = useMemo(() => {
    return customersData.filter((item) => {
      if (startDate && item.rawDate < startDate) return false;
      if (endDate && item.rawDate > endDate) return false;
      if (
        searchQuery &&
        !item.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.clinicName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.email.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (customerTypeFilter !== 'All' && item.customerType !== customerTypeFilter) return false;
      if (cityFilter !== 'All' && item.city !== cityFilter) return false;
      if (stateFilter !== 'All' && item.state !== stateFilter) return false;
      if (statusFilter !== 'All' && item.customerStatus !== statusFilter) return false;
      return true;
    });
  }, [
    customersData,
    startDate,
    endDate,
    searchQuery,
    customerTypeFilter,
    cityFilter,
    stateFilter,
    statusFilter,
  ]);

  // ── Aggregated KPI Metrics ──
  const metrics = useMemo(() => {
    const totalCustomers = filteredCustomers.length;
    const newCustomers = filteredCustomers.filter((c) => c.isNewCustomer).length;
    const returningCustomers = totalCustomers - newCustomers;
    const activeCustomers = filteredCustomers.filter((c) => c.customerStatus === 'Active' || c.customerStatus === 'VIP').length;
    const b2bCustomers = filteredCustomers.filter((c) => c.customerType === 'B2B').length;
    const b2cCustomers = filteredCustomers.filter((c) => c.customerType === 'B2C').length;
    const customerRevenue = filteredCustomers.reduce((acc, curr) => acc + curr.totalSpent, 0);
    const totalOrders = filteredCustomers.reduce((acc, curr) => acc + curr.totalOrders, 0);
    const averageAOV = totalOrders > 0 ? customerRevenue / totalOrders : 0;

    return {
      totalCustomers,
      newCustomers,
      returningCustomers,
      activeCustomers,
      b2bCustomers,
      b2cCustomers,
      customerRevenue,
      averageAOV,
      totalOrders,
    };
  }, [filteredCustomers]);

  // ── 8 Executive KPI Stat Cards ──
  const kpis: ReportStatData[] = [
    {
      id: 'kpi-cust-1',
      label: 'Total Customers',
      value: `${metrics.totalCustomers} Accounts`,
      icon: 'fa-solid fa-users',
      color: '#0d9488',
      change: '+14.2% Growth',
      isPositive: true,
      subtext: 'Registered clinics and practitioners',
      badge: 'Total Base',
    },
    {
      id: 'kpi-cust-2',
      label: 'New Customers',
      value: `${metrics.newCustomers} Joined`,
      icon: 'fa-solid fa-user-plus',
      color: '#3b82f6',
      change: 'Recent Onboarding',
      isPositive: true,
      subtext: 'First-time registered doctors',
      badge: 'Acquisition',
    },
    {
      id: 'kpi-cust-3',
      label: 'Returning Customers',
      value: `${metrics.returningCustomers} Active`,
      icon: 'fa-solid fa-arrows-rotate',
      color: '#16a34a',
      change: `${((metrics.returningCustomers / (metrics.totalCustomers || 1)) * 100).toFixed(0)}% Retention Rate`,
      isPositive: true,
      subtext: 'Repeat order dental practices',
      badge: 'Retention',
    },
    {
      id: 'kpi-cust-4',
      label: 'Active Customers',
      value: `${metrics.activeCustomers} Live`,
      icon: 'fa-solid fa-circle-check',
      color: '#059669',
      change: 'Active in 30 Days',
      isPositive: true,
      subtext: 'Engaged with orders or cart activity',
      badge: 'Engagement',
    },
    {
      id: 'kpi-cust-5',
      label: 'B2B Customers',
      value: `${metrics.b2bCustomers} Clinics`,
      icon: 'fa-solid fa-building-user',
      color: '#8b5cf6',
      change: `${((metrics.b2bCustomers / (metrics.totalCustomers || 1)) * 100).toFixed(0)}% B2B Share`,
      isPositive: true,
      subtext: 'Verified dental clinics & hospitals',
      badge: 'B2B Dental',
    },
    {
      id: 'kpi-cust-6',
      label: 'B2C Customers',
      value: `${metrics.b2cCustomers} Dentists`,
      icon: 'fa-solid fa-user-doctor',
      color: '#f59e0b',
      change: 'Individual Dentists',
      isPositive: true,
      subtext: 'Retail practitioners & consultants',
      badge: 'B2C Retail',
    },
    {
      id: 'kpi-cust-7',
      label: 'Customer Revenue',
      value: `₹${metrics.customerRevenue.toLocaleString('en-IN')}`,
      icon: 'fa-solid fa-sack-dollar',
      color: '#0284c7',
      change: '+22.5% MoM',
      isPositive: true,
      subtext: 'Gross lifetime purchase invoices',
      badge: 'Cumulative Spent',
    },
    {
      id: 'kpi-cust-8',
      label: 'Average Customer Order Value',
      value: `₹${Math.round(metrics.averageAOV).toLocaleString('en-IN')}`,
      icon: 'fa-solid fa-chart-pie',
      color: '#ec4899',
      change: 'Mean Spend / Order',
      isPositive: true,
      subtext: 'Average requisition ticket size',
      badge: 'AOV Metric',
    },
  ];

  // ── Distinct Filter Options ──
  const citiesList = useMemo(() => {
    return Array.from(new Set(customersData.map((c) => c.city))).filter(Boolean);
  }, [customersData]);

  const statesList = useMemo(() => {
    return Array.from(new Set(customersData.map((c) => c.state))).filter(Boolean);
  }, [customersData]);

  // ── Pagination Calculation ──
  const totalPages = Math.ceil(filteredCustomers.length / pageSize) || 1;
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredCustomers.slice(startIndex, startIndex + pageSize);
  }, [filteredCustomers, currentPage, pageSize]);

  // ── Highcharts Data: 1. Customer Growth (Line / Area Spline) ──
  const customerGrowthOptions: Highcharts.Options = useMemo(() => {
    const dateMap = new Map<string, number>();

    filteredCustomers.forEach((item) => {
      const d = item.rawDate;
      dateMap.set(d, (dateMap.get(d) || 0) + 1);
    });

    const sortedDates = Array.from(dateMap.keys()).sort();
    let cumulative = 0;
    const growthData = sortedDates.map((d) => {
      cumulative += dateMap.get(d) || 0;
      return cumulative;
    });

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
        title: { text: 'Cumulative Customer Base', style: { color: '#64748b', fontSize: '12px' } },
        gridLineColor: '#f1f5f9',
        labels: { style: { color: '#64748b', fontSize: '11px' } },
      },
      tooltip: {
        shared: true,
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        borderRadius: 8,
        style: { color: '#ffffff' },
        formatter: function (this: any): string {
          const self = this as any;
          return `<b>${self.x}</b><br/>Total Accounts: <b>${self.y} Practitioners</b>`;
        },
      },
      plotOptions: {
        areaspline: {
          fillOpacity: 0.15,
          color: '#0d9488',
          lineWidth: 3,
          marker: { radius: 4, symbol: 'circle' },
        },
      },
      series: [
        {
          type: 'areaspline',
          name: 'Registered Doctors',
          data: growthData,
        },
      ],
    };
  }, [filteredCustomers]);

  // ── Highcharts Data: 2. New vs Returning Customers (Column Chart) ──
  const newVsReturningOptions: Highcharts.Options = useMemo(() => {
    const dateMap = new Map<string, { newCust: number; returningCust: number }>();

    filteredCustomers.forEach((item) => {
      const d = item.rawDate;
      const cur = dateMap.get(d) || { newCust: 0, returningCust: 0 };
      if (item.isNewCustomer) {
        cur.newCust += 1;
      } else {
        cur.returningCust += 1;
      }
      dateMap.set(d, cur);
    });

    const sortedDates = Array.from(dateMap.keys()).sort();
    const newSeries = sortedDates.map((d) => dateMap.get(d)?.newCust || 0);
    const returningSeries = sortedDates.map((d) => dateMap.get(d)?.returningCust || 0);

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
        type: 'column',
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
        title: { text: 'Practitioner Count', style: { color: '#64748b', fontSize: '12px' } },
        gridLineColor: '#f1f5f9',
        labels: { style: { color: '#64748b', fontSize: '11px' } },
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
            res += `<span style="color:${p.color}">●</span> ${p.series.name}: <b>${p.y} Doctors</b><br/>`;
          });
          return res;
        },
      },
      plotOptions: {
        column: {
          borderRadius: 4,
        },
      },
      series: [
        {
          type: 'column',
          name: 'New Customers',
          data: newSeries,
          color: '#38bdf8',
        },
        {
          type: 'column',
          name: 'Returning Doctors',
          data: returningSeries,
          color: '#22c55e',
        },
      ],
    };
  }, [filteredCustomers]);

  // ── Highcharts Data: 3. B2B vs B2C (Donut Chart) ──
  const b2bVsB2cOptions: Highcharts.Options = useMemo(() => {
    const b2bSpent = filteredCustomers.filter((c) => c.customerType === 'B2B').reduce((acc, curr) => acc + curr.totalSpent, 0);
    const b2cSpent = filteredCustomers.filter((c) => c.customerType === 'B2C').reduce((acc, curr) => acc + curr.totalSpent, 0);

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
          return `<b>${point.name}</b><br/>Revenue: <b>₹${Number(self.y).toLocaleString('en-IN')}</b><br/>Share: <b>${point.percentage?.toFixed(1)}%</b>`;
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
          name: 'Revenue Share',
          data: [
            { name: `B2B Clinics (${metrics.b2bCustomers})`, y: b2bSpent, color: '#8b5cf6' },
            { name: `B2C Dentists (${metrics.b2cCustomers})`, y: b2cSpent, color: '#f59e0b' },
          ],
        },
      ],
    };
  }, [filteredCustomers, metrics]);

  // ── Highcharts Data: 4. Customers by Location (Horizontal Bar Chart) ──
  const customersByLocationOptions: Highcharts.Options = useMemo(() => {
    const cityCountMap = new Map<string, { count: number; spend: number }>();

    filteredCustomers.forEach((item) => {
      const cur = cityCountMap.get(item.city) || { count: 0, spend: 0 };
      cur.count += 1;
      cur.spend += item.totalSpent;
      cityCountMap.set(item.city, cur);
    });

    const sortedCities = Array.from(cityCountMap.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 6);

    const categories = sortedCities.map((c) => c[0]);
    const data = sortedCities.map((c) => ({
      y: c[1].count,
      spend: c[1].spend,
    }));

    return {
      chart: {
        type: 'bar',
        backgroundColor: 'transparent',
        style: { fontFamily: "'Inter', system-ui, -apple-system, sans-serif" },
        height: 320,
      },
      title: { text: undefined },
      credits: { enabled: false },
      xAxis: {
        categories: categories.length > 0 ? categories : ['No Data'],
        labels: { style: { color: '#334155', fontSize: '11px', fontWeight: '600' } },
        lineColor: '#e2e8f0',
      },
      yAxis: {
        title: { text: 'Practitioner Count', style: { color: '#64748b', fontSize: '12px' } },
        gridLineColor: '#f1f5f9',
        labels: { style: { color: '#64748b', fontSize: '11px' } },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        borderRadius: 8,
        style: { color: '#ffffff' },
        formatter: function () {
          const self = this as any;
          const point = self.point || {};
          return `<b>City: ${self.x}</b><br/>Clinics: <span style="color:#0d9488;font-weight:700">${self.y} Accounts</span><br/>Cumulative Spend: <b>₹${Number(point.spend || 0).toLocaleString('en-IN')}</b>`;
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          color: '#0d9488',
          dataLabels: {
            enabled: true,
            format: '{y} clinics',
            style: { fontWeight: '700', color: '#134e4a', fontSize: '11px' },
          },
        },
      },
      series: [
        {
          type: 'bar',
          name: 'Clinics Count',
          data: data,
          showInLegend: false,
        },
      ],
    };
  }, [filteredCustomers]);

  // ── CSV Export ──
  const handleExportCSV = () => {
    exportTableToCSV({
      filename: `presto_customer_report_${Date.now()}`,
      headers: [
        'Doctor Name',
        'Clinic Name',
        'Email',
        'Phone',
        'Customer Type',
        'Total Orders',
        'Total Spent (₹)',
        'AOV (₹)',
        'Last Order Date',
        'City',
        'State',
        'Status',
      ],
      rows: filteredCustomers.map((c) => [
        c.doctorName,
        c.clinicName,
        c.email,
        c.phone,
        c.customerType,
        c.totalOrders,
        c.totalSpent,
        c.aov,
        c.lastOrderDate,
        c.city,
        c.state,
        c.customerStatus,
      ]),
    });
    showToast('Customer Report exported as CSV successfully', 'success');
  };

  // ── PDF Export ──
  const handleExportPDF = () => {
    exportTableToPDF({
      title: 'BuyBright — Practitioner & Clinic Customer Report',
      subtitle: `Doctor accounts, ordering frequency, and lifetime spend (${startDate} to ${endDate})`,
      headers: [
        'Doctor',
        'Type',
        'Orders',
        'Total Spent',
        'AOV',
        'Last Order',
        'City',
        'State',
      ],
      rows: filteredCustomers.map((c) => [
        `${c.doctorName} (${c.clinicName})`,
        c.customerType,
        c.totalOrders,
        `₹${c.totalSpent.toLocaleString('en-IN')}`,
        `₹${c.aov.toLocaleString('en-IN')}`,
        c.lastOrderDate,
        c.city,
        c.state,
      ]),
    });
    showToast('Customer Report exported as PDF successfully', 'success');
  };

  return (
    <AdminLayout
      title="Customer Performance & Lifetime Report"
      subtitle="Understand clinic ordering frequency, acquisition trends, B2B vs B2C segments, and geographic penetration"
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
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

          {/* Customer Search */}
          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
              Doctor / Clinic Search
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
                placeholder="Name, clinic, or email..."
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

          {/* Customer Type Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
              Customer Type
            </label>
            <select
              value={customerTypeFilter}
              onChange={(e) => {
                setCustomerTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="table-filter-select"
              style={{ width: '100%', fontSize: '0.82rem', padding: '7px 10px' }}
            >
              <option value="All">All Customer Types</option>
              <option value="B2B">B2B Verified Clinics</option>
              <option value="B2C">B2C Retail Dentists</option>
            </select>
          </div>

          {/* City Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
              City
            </label>
            <select
              value={cityFilter}
              onChange={(e) => {
                setCityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="table-filter-select"
              style={{ width: '100%', fontSize: '0.82rem', padding: '7px 10px' }}
            >
              <option value="All">All Cities</option>
              {citiesList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* State Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
              State
            </label>
            <select
              value={stateFilter}
              onChange={(e) => {
                setStateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="table-filter-select"
              style={{ width: '100%', fontSize: '0.82rem', padding: '7px 10px' }}
            >
              <option value="All">All States</option>
              {statesList.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Customer Status Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
              Customer Status
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
              <option value="VIP">VIP Accounts</option>
              <option value="Active">Active</option>
              <option value="Pending Verification">Pending Verification</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── 4 Interactive Highcharts Graphs (2x2 Grid) ── */}
      <div className="reports-charts-grid">
        {/* Graph 1: Customer Growth */}
        <div className="report-chart-card">
          <div className="report-chart-header">
            <div className="report-chart-title-wrap">
              <h3 className="report-chart-title">
                <i className="fa-solid fa-chart-line" style={{ color: '#0d9488' }} />
                1. Customer Growth
              </h3>
              <p className="report-chart-desc">
                Cumulative practitioner and clinic registration curve
              </p>
            </div>
            <span className="report-chart-badge">Line / Area Spline</span>
          </div>
          <div className="report-chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={customerGrowthOptions} />
          </div>
        </div>

        {/* Graph 2: New vs Returning Customers */}
        <div className="report-chart-card">
          <div className="report-chart-header">
            <div className="report-chart-title-wrap">
              <h3 className="report-chart-title">
                <i className="fa-solid fa-user-group" style={{ color: '#3b82f6' }} />
                2. New vs Returning Customers
              </h3>
              <p className="report-chart-desc">
                New clinic acquisitions compared with repeat buying practices
              </p>
            </div>
            <span className="report-chart-badge" style={{ color: '#3b82f6', background: '#eff6ff', borderColor: '#dbeafe' }}>
              Column Chart
            </span>
          </div>
          <div className="report-chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={newVsReturningOptions} />
          </div>
        </div>

        {/* Graph 3: B2B vs B2C */}
        <div className="report-chart-card">
          <div className="report-chart-header">
            <div className="report-chart-title-wrap">
              <h3 className="report-chart-title">
                <i className="fa-solid fa-chart-pie" style={{ color: '#8b5cf6' }} />
                3. B2B vs B2C Breakdown
              </h3>
              <p className="report-chart-desc">
                Verified dental clinics vs. retail individual practitioners spend share
              </p>
            </div>
            <span className="report-chart-badge" style={{ color: '#8b5cf6', background: '#f5f3ff', borderColor: '#ede9fe' }}>
              Donut Chart
            </span>
          </div>
          <div className="report-chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={b2bVsB2cOptions} />
          </div>
        </div>

        {/* Graph 4: Customers by Location */}
        <div className="report-chart-card">
          <div className="report-chart-header">
            <div className="report-chart-title-wrap">
              <h3 className="report-chart-title">
                <i className="fa-solid fa-location-dot" style={{ color: '#059669' }} />
                4. Customers by Location
              </h3>
              <p className="report-chart-desc">
                Top geographic territories ranked by practice density
              </p>
            </div>
            <span className="report-chart-badge" style={{ color: '#059669', background: '#ecfdf5', borderColor: '#a7f3d0' }}>
              Horizontal Bar
            </span>
          </div>
          <div className="report-chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={customersByLocationOptions} />
          </div>
        </div>
      </div>

      {/* ── Paginated Customer Ledger Table ── */}
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
              Doctor &amp; Clinic Performance Ledger
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
              {filteredCustomers.length} Accounts
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
                <th style={{ minWidth: '220px' }}>Customer</th>
                <th style={{ minWidth: '90px' }}>Type</th>
                <th style={{ textAlign: 'center', minWidth: '85px' }}>Orders</th>
                <th style={{ textAlign: 'right', minWidth: '120px' }}>Total Spent</th>
                <th style={{ textAlign: 'right', minWidth: '110px' }}>AOV</th>
                <th style={{ minWidth: '110px' }}>Last Order</th>
                <th style={{ minWidth: '110px' }}>City</th>
                <th style={{ minWidth: '120px' }}>State</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
                    <i
                      className="fa-solid fa-users-viewfinder"
                      style={{ fontSize: '2.2rem', marginBottom: '10px', display: 'block', color: '#cbd5e1' }}
                    />
                    <div style={{ fontWeight: 600, fontSize: '0.94rem', color: '#334155' }}>
                      No doctor accounts match your filters
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
                      Try adjusting your date range, search query, or location filters.
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((c) => {
                  return (
                    <tr key={c.id}>
                      {/* Customer (Doctor & Clinic) */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>
                            {c.doctorName}
                          </span>
                          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                            {c.clinicName}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                            {c.email} • {c.phone}
                          </span>
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td>
                        <span
                          className={`admin-badge ${c.customerType === 'B2B' ? 'badge-primary' : 'badge-neutral'}`}
                          style={{ fontSize: '0.75rem', fontWeight: 700 }}
                        >
                          {c.customerType}
                        </span>
                      </td>

                      {/* Orders */}
                      <td style={{ textAlign: 'center' }}>
                        <span
                          style={{
                            fontWeight: 700,
                            color: '#0d9488',
                            background: '#f0fdfa',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontSize: '0.84rem',
                          }}
                        >
                          {c.totalOrders}
                        </span>
                      </td>

                      {/* Total Spent */}
                      <td style={{ textAlign: 'right' }}>
                        <strong style={{ color: '#0f766e', fontSize: '0.92rem' }}>
                          ₹{c.totalSpent.toLocaleString('en-IN')}
                        </strong>
                      </td>

                      {/* AOV */}
                      <td style={{ textAlign: 'right' }}>
                        <strong style={{ color: '#0284c7', fontSize: '0.88rem' }}>
                          ₹{c.aov.toLocaleString('en-IN')}
                        </strong>
                      </td>

                      {/* Last Order Date */}
                      <td>
                        <span style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 500 }}>
                          {c.lastOrderDate}
                        </span>
                      </td>

                      {/* City */}
                      <td>
                        <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>
                          {c.city}
                        </span>
                      </td>

                      {/* State */}
                      <td>
                        <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                          {c.state}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* Totals Summary Footer */}
            {filteredCustomers.length > 0 && (
              <tfoot>
                <tr style={{ background: '#f8fafc', fontWeight: 700, borderTop: '2px solid #e2e8f0' }}>
                  <td colSpan={2} style={{ color: '#0f172a', fontSize: '0.88rem' }}>
                    <i className="fa-solid fa-calculator" style={{ color: '#0d9488', marginRight: '6px' }} />
                    Total Summary ({filteredCustomers.length} Accounts)
                  </td>
                  <td style={{ textAlign: 'center', color: '#0d9488', fontSize: '0.88rem' }}>
                    {metrics.totalOrders}
                  </td>
                  <td style={{ textAlign: 'right', color: '#0f766e', fontSize: '0.94rem' }}>
                    ₹{metrics.customerRevenue.toLocaleString('en-IN')}
                  </td>
                  <td style={{ textAlign: 'right', color: '#0284c7', fontSize: '0.9rem' }}>
                    ₹{Math.round(metrics.averageAOV).toLocaleString('en-IN')} Avg
                  </td>
                  <td colSpan={3} style={{ textAlign: 'right', color: '#64748b', fontSize: '0.82rem' }}>
                    {metrics.b2bCustomers} B2B • {metrics.b2cCustomers} B2C
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
          totalItems={filteredCustomers.length}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </AdminLayout>
  );
};

export default CustomerReportPage;
