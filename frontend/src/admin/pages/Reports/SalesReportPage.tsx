/**
 * BuyBright Admin — Sales Report Page.
 * Purpose: Understand revenue and sales performance.
 * Powered by:
 *   - Highcharts (Interactive Line/Area, Dual-Axis Bar+Line, Category Column, Donut Charts)
 *   - Responsive Pagination & Multi-Dimensional Filter Engine
 *   - 8 Executive KPI Metric Cards
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
import { initialDailySalesData, DailySalesSummaryItem } from '../../data/reportsData';

type QuickDateOption = 'Today' | '7 Days' | '30 Days' | 'This Month' | 'Last Month' | 'Custom';

export const SalesReportPage: React.FC = () => {
  const { showToast } = useToast();
  const [salesRecords] = useState<DailySalesSummaryItem[]>(initialDailySalesData);

  // ── Filter States ──
  const [quickDate, setQuickDate] = useState<QuickDateOption>('30 Days');
  const [startDate, setStartDate] = useState<string>('2026-09-25');
  const [endDate, setEndDate] = useState<string>('2026-10-06');
  const [orderStatus, setOrderStatus] = useState<string>('All');
  const [paymentStatus, setPaymentStatus] = useState<string>('All');
  const [paymentMethod, setPaymentMethod] = useState<string>('All');
  const [category, setCategory] = useState<string>('All');
  const [brand, setBrand] = useState<string>('All');
  const [customerType, setCustomerType] = useState<string>('All');
  const [location, setLocation] = useState<string>('All');
  const [couponFilter, setCouponFilter] = useState<string>('All');
  const [productQuery, setProductQuery] = useState<string>('');

  // ── Pagination States ──
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

  // ── Reset Filters ──
  const handleResetFilters = () => {
    setQuickDate('30 Days');
    setStartDate('2026-09-25');
    setEndDate('2026-10-06');
    setOrderStatus('All');
    setPaymentStatus('All');
    setPaymentMethod('All');
    setCategory('All');
    setBrand('All');
    setCustomerType('All');
    setLocation('All');
    setCouponFilter('All');
    setProductQuery('');
    setCurrentPage(1);
    showToast('Filters reset to default', 'info');
  };

  // ── Filtered Data Computation ──
  const filteredData = useMemo(() => {
    return salesRecords.filter((item) => {
      if (startDate && item.rawDate < startDate) return false;
      if (endDate && item.rawDate > endDate) return false;
      if (orderStatus !== 'All' && item.orderStatus !== orderStatus) return false;
      if (paymentStatus !== 'All' && item.paymentStatus !== paymentStatus) return false;
      if (paymentMethod !== 'All' && item.paymentMethod !== paymentMethod) return false;
      if (category !== 'All' && item.category !== category) return false;
      if (brand !== 'All' && item.brand !== brand) return false;
      if (customerType !== 'All' && item.customerType !== customerType) return false;
      if (location !== 'All' && `${item.city}, ${item.state}` !== location && item.city !== location) return false;
      if (couponFilter === 'With Coupon' && !item.couponUsed) return false;
      if (couponFilter === 'Without Coupon' && item.couponUsed) return false;
      if (productQuery && !item.product.toLowerCase().includes(productQuery.toLowerCase())) return false;

      return true;
    });
  }, [
    salesRecords,
    startDate,
    endDate,
    orderStatus,
    paymentStatus,
    paymentMethod,
    category,
    brand,
    customerType,
    location,
    couponFilter,
    productQuery,
  ]);

  // ── Paginated Slice ──
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // ── KPI Metrics Calculations ──
  const metrics = useMemo(() => {
    const totalOrders = filteredData.reduce((acc, curr) => acc + curr.orders, 0);
    const grossSales = filteredData.reduce((acc, curr) => acc + curr.grossSales, 0);
    const totalDiscount = filteredData.reduce((acc, curr) => acc + curr.discount, 0);
    const totalGST = filteredData.reduce((acc, curr) => acc + curr.gst, 0);
    const totalShipping = filteredData.reduce((acc, curr) => acc + curr.shipping, 0);
    const totalRefund = filteredData.reduce((acc, curr) => acc + curr.refund, 0);
    const netSales = filteredData.reduce((acc, curr) => acc + curr.netSales, 0);
    const netRevenue = grossSales - totalDiscount - totalRefund;
    const aov = totalOrders > 0 ? Math.round(grossSales / totalOrders) : 0;

    return {
      totalOrders,
      grossSales,
      totalDiscount,
      totalGST,
      totalShipping,
      totalRefund,
      netSales,
      netRevenue,
      aov,
    };
  }, [filteredData]);

  // ── 8 KPI Cards Array ──
  const kpiCards: ReportStatData[] = [
    {
      id: 'kpi-1',
      label: 'Total Sales (Gross)',
      value: `₹${metrics.grossSales.toLocaleString('en-IN')}`,
      icon: 'fa-solid fa-chart-line',
      color: '#0d9488',
      change: '+18.4%',
      isPositive: true,
      subtext: 'Gross catalog sales value',
      badge: 'Gross Billing',
    },
    {
      id: 'kpi-2',
      label: 'Net Sales',
      value: `₹${metrics.netSales.toLocaleString('en-IN')}`,
      icon: 'fa-solid fa-wallet',
      color: '#16a34a',
      change: '+16.2%',
      isPositive: true,
      subtext: 'Sales + GST + Ship - Refund',
      badge: 'Realized Value',
    },
    {
      id: 'kpi-3',
      label: 'Total Orders',
      value: `${metrics.totalOrders.toLocaleString('en-IN')} Orders`,
      icon: 'fa-solid fa-boxes-stacked',
      color: '#3b82f6',
      change: '+12.5%',
      isPositive: true,
      subtext: 'Across all practices',
      badge: 'Volume',
    },
    {
      id: 'kpi-4',
      label: 'Average Order Value',
      value: `₹${metrics.aov.toLocaleString('en-IN')}`,
      icon: 'fa-solid fa-chart-pie',
      color: '#8b5cf6',
      change: '+5.8%',
      isPositive: true,
      subtext: 'Average spend per order',
      badge: 'AOV Metric',
    },
    {
      id: 'kpi-5',
      label: 'Total Discount',
      value: `₹${metrics.totalDiscount.toLocaleString('en-IN')}`,
      icon: 'fa-solid fa-tags',
      color: '#ec4899',
      change: 'Promotions & Coupons',
      isPositive: true,
      subtext: 'Subsidized marketing cost',
      badge: 'Deductions',
    },
    {
      id: 'kpi-6',
      label: 'Total GST (18%/12%)',
      value: `₹${metrics.totalGST.toLocaleString('en-IN')}`,
      icon: 'fa-solid fa-receipt',
      color: '#0284c7',
      change: '100% Tax Compliant',
      isPositive: true,
      subtext: 'B2B GSTR-1 Tax Collected',
      badge: 'Tax Audit',
    },
    {
      id: 'kpi-7',
      label: 'Refund Amount',
      value: `₹${metrics.totalRefund.toLocaleString('en-IN')}`,
      icon: 'fa-solid fa-arrow-rotate-left',
      color: '#ef4444',
      change: metrics.totalRefund > 0 ? 'Returns / Cancellations' : 'Zero Returns',
      isPositive: metrics.totalRefund === 0,
      subtext: 'Processed refunds to wallet/card',
      badge: 'Returns',
    },
    {
      id: 'kpi-8',
      label: 'Net Revenue',
      value: `₹${metrics.netRevenue.toLocaleString('en-IN')}`,
      icon: 'fa-solid fa-building-columns',
      color: '#f59e0b',
      change: '+19.1%',
      isPositive: true,
      subtext: 'Gross - Discount - Refund',
      badge: 'Settlement Base',
    },
  ];

  // ── Highcharts Chronological Data ──
  const trendData = useMemo(() => {
    return [...filteredData].sort((a, b) => a.rawDate.localeCompare(b.rawDate));
  }, [filteredData]);

  // 1. Highcharts: Sales Trend (Line / Area Chart)
  const salesTrendOptions: Highcharts.Options = useMemo(() => {
    const categories = trendData.map((d) => d.date);
    const grossSeries = trendData.map((d) => d.grossSales);
    const netSeries = trendData.map((d) => d.netSales);

    return {
      chart: {
        type: 'areaspline',
        backgroundColor: 'transparent',
        style: { fontFamily: 'inherit' },
        height: 280,
      },
      title: { text: undefined },
      credits: { enabled: false },
      xAxis: {
        categories,
        crosshair: true,
        labels: { style: { color: '#64748b', fontSize: '11px' } },
        lineColor: '#e2e8f0',
      },
      yAxis: {
        title: { text: 'Amount (₹)', style: { color: '#64748b', fontSize: '11px' } },
        gridLineColor: '#f1f5f9',
        labels: {
          formatter: function (this: any): string {
            return `₹${(Number(this.value) / 1000).toFixed(0)}k`;
          },
          style: { color: '#64748b', fontSize: '11px' },
        },
      },
      tooltip: {
        shared: true,
        backgroundColor: '#0f172a',
        borderRadius: 8,
        style: { color: '#ffffff', fontSize: '12px' },
        valuePrefix: '₹',
      },
      legend: {
        align: 'right',
        verticalAlign: 'top',
        itemStyle: { color: '#334155', fontWeight: '600', fontSize: '12px' },
      },
      plotOptions: {
        areaspline: {
          marker: { radius: 4, lineWidth: 2, lineColor: '#ffffff' },
          lineWidth: 2.5,
        },
      },
      series: [
        {
          name: 'Gross Sales',
          type: 'areaspline',
          data: grossSeries,
          color: '#0d9488',
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, 'rgba(13, 148, 136, 0.35)'],
              [1, 'rgba(13, 148, 136, 0.0)'],
            ],
          },
        },
        {
          name: 'Net Sales',
          type: 'areaspline',
          data: netSeries,
          color: '#16a34a',
          dashStyle: 'ShortDash',
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, 'rgba(22, 163, 74, 0.30)'],
              [1, 'rgba(22, 163, 74, 0.0)'],
            ],
          },
        },
      ],
    };
  }, [trendData]);

  // 2. Highcharts: Orders vs Revenue (Bar + Line Combo Chart)
  const ordersVsRevenueOptions: Highcharts.Options = useMemo(() => {
    const categories = trendData.map((d) => d.date);
    const orderCounts = trendData.map((d) => d.orders);
    const revenues = trendData.map((d) => d.grossSales);

    return {
      chart: {
        backgroundColor: 'transparent',
        style: { fontFamily: 'inherit' },
        height: 280,
      },
      title: { text: undefined },
      credits: { enabled: false },
      xAxis: {
        categories,
        crosshair: true,
        labels: { style: { color: '#64748b', fontSize: '11px' } },
        lineColor: '#e2e8f0',
      },
      yAxis: [
        {
          // Primary Axis: Revenue
          title: { text: 'Revenue (₹)', style: { color: '#0d9488', fontSize: '11px', fontWeight: '600' } },
          gridLineColor: '#f1f5f9',
          labels: {
            formatter: function (this: any): string {
              return `₹${(Number(this.value) / 1000).toFixed(0)}k`;
            },
            style: { color: '#0d9488', fontSize: '11px' },
          },
        },
        {
          // Secondary Axis: Orders Count
          title: { text: 'Orders Placed', style: { color: '#3b82f6', fontSize: '11px', fontWeight: '600' } },
          opposite: true,
          gridLineWidth: 0,
          labels: {
            format: '{value} ord',
            style: { color: '#3b82f6', fontSize: '11px' },
          },
        },
      ],
      tooltip: {
        shared: true,
        backgroundColor: '#0f172a',
        borderRadius: 8,
        style: { color: '#ffffff', fontSize: '12px' },
      },
      legend: {
        align: 'right',
        verticalAlign: 'top',
        itemStyle: { color: '#334155', fontWeight: '600', fontSize: '12px' },
      },
      series: [
        {
          name: 'Orders Volume',
          type: 'column',
          yAxis: 1,
          data: orderCounts,
          color: '#3b82f6',
          borderRadius: 4,
          tooltip: { valueSuffix: ' orders' },
        },
        {
          name: 'Gross Revenue',
          type: 'spline',
          yAxis: 0,
          data: revenues,
          color: '#f59e0b',
          lineWidth: 2.5,
          marker: { radius: 4, lineWidth: 2, lineColor: '#ffffff' },
          tooltip: { valuePrefix: '₹' },
        },
      ],
    };
  }, [trendData]);

  // 3. Highcharts: Sales by Category (Bar / Column Chart)
  const salesByCategoryOptions: Highcharts.Options = useMemo(() => {
    const map: Record<string, number> = {
      'Consumables': 0,
      'Endodontics': 0,
      'Equipment': 0,
      'Implants': 0,
      'Orthodontics': 0,
    };

    filteredData.forEach((item) => {
      const key = item.category.split(' ')[0];
      if (map[key] !== undefined) {
        map[key] += item.grossSales;
      } else {
        map[key] = item.grossSales;
      }
    });

    const categories = Object.keys(map);
    const data = Object.values(map);
    const colors = ['#0d9488', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'];

    return {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        style: { fontFamily: 'inherit' },
        height: 280,
      },
      title: { text: undefined },
      credits: { enabled: false },
      xAxis: {
        categories,
        crosshair: true,
        labels: { style: { color: '#334155', fontSize: '11px', fontWeight: '600' } },
        lineColor: '#e2e8f0',
      },
      yAxis: {
        title: { text: 'Sales Amount (₹)', style: { color: '#64748b', fontSize: '11px' } },
        gridLineColor: '#f1f5f9',
        labels: {
          formatter: function (this: any): string {
            return `₹${(Number(this.value) / 1000).toFixed(0)}k`;
          },
          style: { color: '#64748b', fontSize: '11px' },
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        borderRadius: 8,
        style: { color: '#ffffff', fontSize: '12px' },
        valuePrefix: '₹',
      },
      legend: { enabled: false },
      plotOptions: {
        column: {
          colorByPoint: true,
          colors,
          borderRadius: 6,
          dataLabels: {
            enabled: true,
            formatter: function (this: any): string {
              return `₹${(Number(this.y) / 1000).toFixed(0)}k`;
            },
            style: { fontSize: '10px', color: '#475569' },
          },
        },
      },
      series: [
        {
          name: 'Category Sales',
          type: 'column',
          data,
        },
      ],
    };
  }, [filteredData]);

  // 4. Highcharts: Payment Method Distribution (Donut Chart)
  const paymentMethodOptions: Highcharts.Options = useMemo(() => {
    const map: Record<string, { amount: number; color: string }> = {
      'UPI / Razorpay': { amount: 0, color: '#0d9488' },
      'Credit / Debit Card': { amount: 0, color: '#3b82f6' },
      'Net Banking': { amount: 0, color: '#8b5cf6' },
      'Cash on Delivery': { amount: 0, color: '#f59e0b' },
    };

    filteredData.forEach((item) => {
      if (map[item.paymentMethod]) {
        map[item.paymentMethod].amount += item.grossSales;
      }
    });

    const data = Object.entries(map).map(([name, val]) => ({
      name,
      y: val.amount,
      color: val.color,
    }));

    return {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        style: { fontFamily: 'inherit' },
        height: 280,
      },
      title: { text: undefined },
      credits: { enabled: false },
      tooltip: {
        backgroundColor: '#0f172a',
        borderRadius: 8,
        style: { color: '#ffffff', fontSize: '12px' },
        pointFormat: '{series.name}: <b>₹{point.y:,.0f}</b> ({point.percentage:.1f}%)',
      },
      plotOptions: {
        pie: {
          innerSize: '62%',
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f}%',
            style: { fontSize: '11px', color: '#334155', fontWeight: '500' },
          },
          showInLegend: true,
        },
      },
      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal',
        itemStyle: { color: '#334155', fontWeight: '600', fontSize: '11px' },
      },
      series: [
        {
          name: 'Revenue Share',
          type: 'pie',
          data,
        },
      ],
    };
  }, [filteredData]);

  // ── CSV Export Handler ──
  const handleExportCSV = () => {
    exportTableToCSV({
      filename: `buybright_sales_report_${Date.now()}`,
      headers: ['Date', 'Orders', 'Gross Sales (₹)', 'Discount (₹)', 'GST (₹)', 'Shipping (₹)', 'Refund (₹)', 'Net Sales (₹)', 'Category', 'Payment Method'],
      rows: filteredData.map((d) => [
        d.date,
        d.orders,
        d.grossSales,
        d.discount,
        d.gst,
        d.shipping,
        d.refund,
        d.netSales,
        d.category,
        d.paymentMethod,
      ]),
    });
    showToast('Sales Report downloaded as CSV', 'success');
  };

  // ── PDF Export Handler ──
  const handleExportPDF = () => {
    exportTableToPDF({
      title: 'BuyBright — Comprehensive Sales & Revenue Report',
      subtitle: `Revenue breakdown, order metrics, tax liabilities, and settlement registers (${startDate} to ${endDate})`,
      headers: ['Date', 'Orders', 'Gross Sales', 'Discount', 'GST (18%)', 'Shipping', 'Refund', 'Net Sales'],
      rows: [
        ...filteredData.map((d) => [
          d.date,
          d.orders,
          `₹${d.grossSales.toLocaleString('en-IN')}`,
          `₹${d.discount.toLocaleString('en-IN')}`,
          `₹${d.gst.toLocaleString('en-IN')}`,
          `₹${d.shipping.toLocaleString('en-IN')}`,
          `₹${d.refund.toLocaleString('en-IN')}`,
          `₹${d.netSales.toLocaleString('en-IN')}`,
        ]),
        [
          'TOTALS',
          metrics.totalOrders,
          `₹${metrics.grossSales.toLocaleString('en-IN')}`,
          `₹${metrics.totalDiscount.toLocaleString('en-IN')}`,
          `₹${metrics.totalGST.toLocaleString('en-IN')}`,
          `₹${metrics.totalShipping.toLocaleString('en-IN')}`,
          `₹${metrics.totalRefund.toLocaleString('en-IN')}`,
          `₹${metrics.netSales.toLocaleString('en-IN')}`,
        ],
      ],
    });
  };

  return (
    <AdminLayout
      title="Sales &amp; Revenue Report"
      subtitle="Understand platform gross revenue, net billings, discount liabilities, and multi-channel performance"
    >
      {/* ── Top Breadcrumb Action ── */}
      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link
          to="/admin/reports"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.84rem',
            color: '#0d9488',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          <i className="fa-solid fa-arrow-left" style={{ fontSize: '0.76rem' }} />
          <span>Back to Reports Hub</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button type="button" onClick={handleExportCSV} className="btn-admin-outline" style={{ padding: '7px 14px', fontSize: '0.82rem' }}>
            <i className="fa-solid fa-file-csv" style={{ color: '#0d9488' }} /> Export CSV
          </button>
          <button type="button" onClick={handleExportPDF} className="btn-admin-primary" style={{ padding: '7px 14px', fontSize: '0.82rem' }}>
            <i className="fa-solid fa-file-pdf" /> Export PDF
          </button>
        </div>
      </div>

      {/* ── 8 Professional Responsive KPI Stat Cards ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {kpiCards.map((kpi) => (
          <ReportStatCard key={kpi.id} stat={kpi} />
        ))}
      </div>

      {/* ── Comprehensive Multi-Dimensional Filters Card ── */}
      <div
        className="admin-card"
        style={{
          padding: '20px',
          marginBottom: '24px',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#0d948815',
                color: '#0d9488',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
              }}
            >
              <i className="fa-solid fa-filter" />
            </div>
            <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>Filter Sales Intelligence</strong>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>({filteredData.length} records matched)</span>
          </div>

          <button
            type="button"
            onClick={handleResetFilters}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#0d9488',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <i className="fa-solid fa-arrow-rotate-left" /> Reset All Filters
          </button>
        </div>

        {/* Quick Date Range Selection Bar */}
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginRight: '4px' }}>
            Quick Range:
          </span>
          {(['Today', '7 Days', '30 Days', 'This Month', 'Last Month', 'Custom'] as QuickDateOption[]).map((opt) => {
            const isActive = quickDate === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleQuickDateChange(opt)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: isActive ? '1px solid #0d9488' : '1px solid #e2e8f0',
                  background: isActive ? '#0d9488' : '#f8fafc',
                  color: isActive ? '#ffffff' : '#475569',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Detailed 10-Field Filter Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
          }}
        >
          {/* 1. Custom Start Date */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
              Start Date
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
              style={{ width: '100%', fontSize: '0.8rem', padding: '6px 10px' }}
            />
          </div>

          {/* 2. Custom End Date */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
              End Date
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
              style={{ width: '100%', fontSize: '0.8rem', padding: '6px 10px' }}
            />
          </div>

          {/* 3. Order Status */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
              Order Status
            </label>
            <select
              value={orderStatus}
              onChange={(e) => {
                setOrderStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="table-filter-select"
              style={{ width: '100%', fontSize: '0.8rem' }}
            >
              <option value="All">All Order Statuses</option>
              <option value="Delivered">Delivered</option>
              <option value="Placed">Placed</option>
              <option value="In Process">In Process</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Returned">Returned</option>
            </select>
          </div>

          {/* 4. Payment Status */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
              Payment Status
            </label>
            <select
              value={paymentStatus}
              onChange={(e) => {
                setPaymentStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="table-filter-select"
              style={{ width: '100%', fontSize: '0.8rem' }}
            >
              <option value="All">All Payment Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          {/* 5. Payment Method */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setCurrentPage(1);
              }}
              className="table-filter-select"
              style={{ width: '100%', fontSize: '0.8rem' }}
            >
              <option value="All">All Payment Modes</option>
              <option value="UPI / Razorpay">UPI / Razorpay</option>
              <option value="Credit / Debit Card">Credit / Debit Card</option>
              <option value="Net Banking">Net Banking</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
            </select>
          </div>

          {/* 6. Category */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
              Department / Category
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="table-filter-select"
              style={{ width: '100%', fontSize: '0.8rem' }}
            >
              <option value="All">All Categories</option>
              <option value="Consumables & Restoratives">Consumables & Restoratives</option>
              <option value="Endodontics & Rotary">Endodontics & Rotary</option>
              <option value="Equipment">Equipment</option>
              <option value="Implants & Surgical">Implants & Surgical</option>
              <option value="Orthodontics">Orthodontics</option>
            </select>
          </div>

          {/* 7. Brand */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
              Brand Alliance
            </label>
            <select
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
                setCurrentPage(1);
              }}
              className="table-filter-select"
              style={{ width: '100%', fontSize: '0.8rem' }}
            >
              <option value="All">All Brands</option>
              <option value="3M ESPE">3M ESPE</option>
              <option value="Dentsply Sirona">Dentsply Sirona</option>
              <option value="Woodpecker">Woodpecker</option>
              <option value="Hu-Friedy">Hu-Friedy</option>
              <option value="Osstem">Osstem</option>
            </select>
          </div>

          {/* 8. Customer Type */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
              Customer Segment
            </label>
            <select
              value={customerType}
              onChange={(e) => {
                setCustomerType(e.target.value);
                setCurrentPage(1);
              }}
              className="table-filter-select"
              style={{ width: '100%', fontSize: '0.8rem' }}
            >
              <option value="All">All Customer Types</option>
              <option value="B2B">B2B (Clinics & Hospitals)</option>
              <option value="B2C">B2C (Individual Dentists)</option>
            </select>
          </div>

          {/* 9. City / State */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
              City / State
            </label>
            <select
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setCurrentPage(1);
              }}
              className="table-filter-select"
              style={{ width: '100%', fontSize: '0.8rem' }}
            >
              <option value="All">All Geographic Locations</option>
              <option value="Mumbai, Maharashtra">Mumbai, Maharashtra</option>
              <option value="Bengaluru, Karnataka">Bengaluru, Karnataka</option>
              <option value="New Delhi, Delhi">New Delhi, Delhi</option>
              <option value="Hyderabad, Telangana">Hyderabad, Telangana</option>
              <option value="Ahmedabad, Gujarat">Ahmedabad, Gujarat</option>
              <option value="Pune, Maharashtra">Pune, Maharashtra</option>
              <option value="Chennai, Tamil Nadu">Chennai, Tamil Nadu</option>
              <option value="Jaipur, Rajasthan">Jaipur, Rajasthan</option>
              <option value="Kolkata, West Bengal">Kolkata, West Bengal</option>
              <option value="Lucknow, Uttar Pradesh">Lucknow, Uttar Pradesh</option>
            </select>
          </div>

          {/* 10. Coupon Used */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
              Coupon Attribution
            </label>
            <select
              value={couponFilter}
              onChange={(e) => {
                setCouponFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="table-filter-select"
              style={{ width: '100%', fontSize: '0.8rem' }}
            >
              <option value="All">All Orders (With / Without)</option>
              <option value="With Coupon">With Coupon Applied</option>
              <option value="Without Coupon">Without Coupon</option>
            </select>
          </div>

          {/* 11. Product Search */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
              Product SKU / Keyword Search
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
                  fontSize: '0.76rem',
                }}
              />
              <input
                type="text"
                placeholder="Search by product name (e.g. 3M Filtek, ProTaper, Scaler, Forceps)..."
                value={productQuery}
                onChange={(e) => {
                  setProductQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="table-search-input"
                style={{ width: '100%', paddingLeft: '30px', fontSize: '0.8rem' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── 4 Highcharts Interactive Visualizations Grid ── */}
      <div className="reports-charts-grid">
        {/* ── Graph 1: Sales Trend (Highcharts Area/Line Chart) ── */}
        <div className="report-chart-card">
          <div className="report-chart-header">
            <div className="report-chart-title-wrap">
              <strong className="report-chart-title">
                <i className="fa-solid fa-chart-area" style={{ color: '#0d9488' }} />
                1. Sales Trend (Gross vs Net Sales)
              </strong>
              <p className="report-chart-desc">
                Daily gross billings vs net realized platform sales with Highcharts
              </p>
            </div>
            <span className="report-chart-badge">Area / Line</span>
          </div>
          <div className="report-chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={salesTrendOptions} />
          </div>
        </div>

        {/* ── Graph 2: Orders vs Revenue (Highcharts Bar + Line Combo) ── */}
        <div className="report-chart-card">
          <div className="report-chart-header">
            <div className="report-chart-title-wrap">
              <strong className="report-chart-title">
                <i className="fa-solid fa-chart-column" style={{ color: '#3b82f6' }} />
                2. Orders vs Revenue (Bar + Line Combo)
              </strong>
              <p className="report-chart-desc">
                Daily order volume bars combined with gross revenue trajectory
              </p>
            </div>
            <span className="report-chart-badge">Combo Chart</span>
          </div>
          <div className="report-chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={ordersVsRevenueOptions} />
          </div>
        </div>

        {/* ── Graph 3: Sales by Category (Highcharts Column Chart) ── */}
        <div className="report-chart-card">
          <div className="report-chart-header">
            <div className="report-chart-title-wrap">
              <strong className="report-chart-title">
                <i className="fa-solid fa-folder-tree" style={{ color: '#8b5cf6' }} />
                3. Sales by Category (Department Breakdown)
              </strong>
              <p className="report-chart-desc">
                Gross revenue generated across major dental specialties
              </p>
            </div>
            <span className="report-chart-badge">Column Chart</span>
          </div>
          <div className="report-chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={salesByCategoryOptions} />
          </div>
        </div>

        {/* ── Graph 4: Payment Method Distribution (Highcharts Donut Chart) ── */}
        <div className="report-chart-card">
          <div className="report-chart-header">
            <div className="report-chart-title-wrap">
              <strong className="report-chart-title">
                <i className="fa-solid fa-circle-notch" style={{ color: '#f59e0b' }} />
                4. Payment Method Distribution (Donut Chart)
              </strong>
              <p className="report-chart-desc">
                Gateway settlement volume percentage share across payment channels
              </p>
            </div>
            <span className="report-chart-badge">Donut Chart</span>
          </div>
          <div className="report-chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={paymentMethodOptions} />
          </div>
        </div>
      </div>

      {/* ── Detailed Daily Breakdown Table with Pagination & Totals Footer ── */}
      <div className="admin-card" style={{ borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <div className="card-toolbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <span className="toolbar-title">
              <i className="fa-solid fa-table-list" style={{ color: '#0d9488', marginRight: '8px' }} />
              Daily Sales Ledger &amp; Tax Reconciliations ({filteredData.length} records)
            </span>
            <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>
              Detailed audit breakdown of daily orders, discount liabilities, GST tax, shipping, and net payouts
            </div>
          </div>

          {/* Page Size Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#64748b' }}>
            <span>Show:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="table-filter-select"
              style={{ padding: '4px 8px', fontSize: '0.8rem' }}
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
            </select>
          </div>
        </div>

        <div className="admin-table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Orders</th>
                <th>Gross Sales</th>
                <th>Discount</th>
                <th>GST (18%)</th>
                <th>Shipping</th>
                <th>Refund</th>
                <th>Net Sales</th>
                <th>Department</th>
                <th>Payment Mode</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
                    <i className="fa-solid fa-inbox" style={{ fontSize: '2rem', marginBottom: '8px', display: 'block', color: '#cbd5e1' }} />
                    <span>No sales data found matching your selected filters.</span>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <strong style={{ color: '#0f172a', fontSize: '0.86rem' }}>{row.date}</strong>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{row.city}, {row.state}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#3b82f6' }}>{row.orders} orders</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>
                        ₹{row.grossSales.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: row.discount > 0 ? '#16a34a' : '#94a3b8', fontWeight: 600 }}>
                        {row.discount > 0 ? `-₹${row.discount.toLocaleString('en-IN')}` : '₹0'}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: '#64748b' }}>₹{row.gst.toLocaleString('en-IN')}</span>
                    </td>
                    <td>
                      <span style={{ color: '#475569' }}>₹{row.shipping.toLocaleString('en-IN')}</span>
                    </td>
                    <td>
                      <span style={{ color: row.refund > 0 ? '#dc2626' : '#94a3b8', fontWeight: 600 }}>
                        {row.refund > 0 ? `-₹${row.refund.toLocaleString('en-IN')}` : '₹0'}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: '#0f766e', fontSize: '0.92rem' }}>
                        ₹{row.netSales.toLocaleString('en-IN')}
                      </strong>
                    </td>
                    <td>
                      <span className="admin-badge badge-neutral" style={{ fontSize: '0.74rem' }}>
                        {row.category.split('&')[0]}
                      </span>
                    </td>
                    <td>
                      <span className="admin-badge badge-neutral" style={{ fontSize: '0.74rem' }}>
                        {row.paymentMethod}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredData.length > 0 && (
              <tfoot>
                <tr style={{ background: '#f8fafc', fontWeight: 800, borderTop: '2px solid #0d9488' }}>
                  <td style={{ color: '#0d9488', fontSize: '0.88rem' }}>
                    <i className="fa-solid fa-calculator" style={{ marginRight: '6px' }} />
                    TOTALS ({filteredData.length} Records)
                  </td>
                  <td style={{ color: '#3b82f6' }}>{metrics.totalOrders} orders</td>
                  <td style={{ color: '#0f172a' }}>₹{metrics.grossSales.toLocaleString('en-IN')}</td>
                  <td style={{ color: '#16a34a' }}>-₹{metrics.totalDiscount.toLocaleString('en-IN')}</td>
                  <td style={{ color: '#64748b' }}>₹{metrics.totalGST.toLocaleString('en-IN')}</td>
                  <td style={{ color: '#475569' }}>₹{metrics.totalShipping.toLocaleString('en-IN')}</td>
                  <td style={{ color: '#dc2626' }}>-₹{metrics.totalRefund.toLocaleString('en-IN')}</td>
                  <td style={{ color: '#0f766e', fontSize: '0.98rem' }}>₹{metrics.netSales.toLocaleString('en-IN')}</td>
                  <td colSpan={2} style={{ color: '#64748b', fontSize: '0.76rem', textAlign: 'right' }}>
                    AOV: ₹{metrics.aov.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* ── Reusable Pagination Controls ── */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={filteredData.length}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </AdminLayout>
  );
};

export default SalesReportPage;
