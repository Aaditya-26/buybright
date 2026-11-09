/**
 * BuyBright Admin — Orders Report Page.
 * Purpose: Understand order volume and order status.
 * Powered by:
 *   - Highcharts (Orders Over Time Area, Orders by Status Donut, Payment Method Column, Delivery Performance Bar Charts)
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
import { initialOrdersReport, OrdersReportItem } from '../../data/reportsData';

type QuickDateOption = 'Today' | '7 Days' | '30 Days' | 'This Month' | 'Last Month' | 'Custom';

export const OrdersReportPage: React.FC = () => {
  const { showToast } = useToast();
  const [ordersData] = useState<OrdersReportItem[]>(initialOrdersReport);

  // ── Filter States ──
  const [quickDate, setQuickDate] = useState<QuickDateOption>('30 Days');
  const [startDate, setStartDate] = useState<string>('2026-09-25');
  const [endDate, setEndDate] = useState<string>('2026-10-06');
  const [orderStatus, setOrderStatus] = useState<string>('All');
  const [paymentStatus, setPaymentStatus] = useState<string>('All');
  const [paymentMethod, setPaymentMethod] = useState<string>('All');
  const [customerQuery, setCustomerQuery] = useState<string>('');
  const [customerType, setCustomerType] = useState<string>('All');
  const [city, setCity] = useState<string>('All');
  const [state, setState] = useState<string>('All');
  const [courier, setCourier] = useState<string>('All');
  const [deliveryStatus, setDeliveryStatus] = useState<string>('All');

  // ── Pagination States ──
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  // ── Quick Date Filter Handler ──
  const handleQuickDateChange = (opt: QuickDateOption) => {
    setQuickDate(opt);
    const today = new Date(2026, 9, 6); // 06 Oct 2026

    const formatDateStr = (d: Date) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
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
    setCustomerQuery('');
    setCustomerType('All');
    setCity('All');
    setState('All');
    setCourier('All');
    setDeliveryStatus('All');
    setCurrentPage(1);
    showToast('Filters reset to default', 'info');
  };

  // ── Filtered Orders Dataset ──
  const filteredOrders = useMemo(() => {
    return ordersData.filter((item) => {
      if (startDate && item.rawDate < startDate) return false;
      if (endDate && item.rawDate > endDate) return false;
      if (orderStatus !== 'All' && item.orderStatus !== orderStatus) return false;
      if (paymentStatus !== 'All' && item.paymentStatus !== paymentStatus) return false;
      if (paymentMethod !== 'All' && item.paymentMethod !== paymentMethod) return false;
      if (
        customerQuery &&
        !item.doctorName.toLowerCase().includes(customerQuery.toLowerCase()) &&
        !item.clinicName.toLowerCase().includes(customerQuery.toLowerCase()) &&
        !item.orderNumber.toLowerCase().includes(customerQuery.toLowerCase())
      ) {
        return false;
      }
      if (customerType !== 'All' && item.customerType !== customerType) return false;
      if (city !== 'All' && item.city !== city) return false;
      if (state !== 'All' && item.state !== state) return false;
      if (courier !== 'All' && item.courier !== courier) return false;
      if (deliveryStatus !== 'All' && item.deliveryStatus !== deliveryStatus) return false;

      return true;
    });
  }, [
    ordersData,
    startDate,
    endDate,
    orderStatus,
    paymentStatus,
    paymentMethod,
    customerQuery,
    customerType,
    city,
    state,
    courier,
    deliveryStatus,
  ]);

  // ── Paginated Slice ──
  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  // ── KPI Metrics Counts ──
  const metrics = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const pendingOrders = filteredOrders.filter((o) => o.orderStatus === 'Pending').length;
    const processingOrders = filteredOrders.filter((o) => o.orderStatus === 'Processing').length;
    const shippedOrders = filteredOrders.filter((o) => o.orderStatus === 'Shipped').length;
    const deliveredOrders = filteredOrders.filter((o) => o.orderStatus === 'Delivered').length;
    const cancelledOrders = filteredOrders.filter((o) => o.orderStatus === 'Cancelled').length;
    const returnedOrders = filteredOrders.filter((o) => o.orderStatus === 'Returned').length;
    const failedOrders = filteredOrders.filter((o) => o.orderStatus === 'Failed').length;
    const totalAmount = filteredOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);

    return {
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      returnedOrders,
      failedOrders,
      totalAmount,
    };
  }, [filteredOrders]);

  // ── 8 KPI Cards Array ──
  const kpiCards: ReportStatData[] = [
    {
      id: 'kpi-ord-1',
      label: 'Total Orders',
      value: `${metrics.totalOrders} Orders`,
      icon: 'fa-solid fa-box-open',
      color: '#0d9488',
      change: '100% Tracked',
      isPositive: true,
      subtext: `₹${(metrics.totalAmount / 100000).toFixed(1)}L Total Value`,
      badge: 'All Orders',
    },
    {
      id: 'kpi-ord-2',
      label: 'Pending Orders',
      value: `${metrics.pendingOrders} Orders`,
      icon: 'fa-solid fa-clock-rotate-left',
      color: '#f59e0b',
      change: 'Awaiting Pick',
      isPositive: true,
      subtext: 'Verification in progress',
      badge: 'Pending',
    },
    {
      id: 'kpi-ord-3',
      label: 'Processing Orders',
      value: `${metrics.processingOrders} Orders`,
      icon: 'fa-solid fa-gears',
      color: '#3b82f6',
      change: 'In Warehouse',
      isPositive: true,
      subtext: 'Packing & sterilization QC',
      badge: 'Processing',
    },
    {
      id: 'kpi-ord-4',
      label: 'Shipped Orders',
      value: `${metrics.shippedOrders} Orders`,
      icon: 'fa-solid fa-truck-fast',
      color: '#8b5cf6',
      change: 'In Transit',
      isPositive: true,
      subtext: 'With carrier logistics',
      badge: 'Shipped',
    },
    {
      id: 'kpi-ord-5',
      label: 'Delivered Orders',
      value: `${metrics.deliveredOrders} Orders`,
      icon: 'fa-solid fa-circle-check',
      color: '#16a34a',
      change: `${metrics.totalOrders > 0 ? Math.round((metrics.deliveredOrders / metrics.totalOrders) * 100) : 0}% Success Rate`,
      isPositive: true,
      subtext: 'Successfully received by clinic',
      badge: 'Delivered',
    },
    {
      id: 'kpi-ord-6',
      label: 'Cancelled Orders',
      value: `${metrics.cancelledOrders} Orders`,
      icon: 'fa-solid fa-ban',
      color: '#ef4444',
      change: 'Prior to Dispatch',
      isPositive: metrics.cancelledOrders === 0,
      subtext: 'Cancelled by practitioner/system',
      badge: 'Cancelled',
    },
    {
      id: 'kpi-ord-7',
      label: 'Returned Orders',
      value: `${metrics.returnedOrders} Orders`,
      icon: 'fa-solid fa-arrow-rotate-left',
      color: '#ea580c',
      change: 'RTO / Return Processed',
      isPositive: metrics.returnedOrders === 0,
      subtext: 'Returned to central depot',
      badge: 'Returned',
    },
    {
      id: 'kpi-ord-8',
      label: 'Failed Orders',
      value: `${metrics.failedOrders} Orders`,
      icon: 'fa-solid fa-triangle-exclamation',
      color: '#dc2626',
      change: 'Payment/Address Failure',
      isPositive: metrics.failedOrders === 0,
      subtext: 'Checkout or delivery failure',
      badge: 'Failed',
    },
  ];

  // ── Highcharts 1: Orders Over Time ──
  const dailyOrderTrends = useMemo(() => {
    const map: Record<string, { date: string; orders: number; rawDate: string }> = {};

    filteredOrders.forEach((o) => {
      const shortDate = o.orderDate.split(',')[0];
      if (!map[shortDate]) {
        map[shortDate] = { date: shortDate, orders: 0, rawDate: o.rawDate };
      }
      map[shortDate].orders += 1;
    });

    return Object.values(map).sort((a, b) => a.rawDate.localeCompare(b.rawDate));
  }, [filteredOrders]);

  const ordersOverTimeOptions: Highcharts.Options = useMemo(() => {
    const categories = dailyOrderTrends.map((d) => d.date);
    const data = dailyOrderTrends.map((d) => d.orders);

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
        title: { text: 'Orders Placed', style: { color: '#64748b', fontSize: '11px' } },
        gridLineColor: '#f1f5f9',
        allowDecimals: false,
        labels: {
          style: { color: '#64748b', fontSize: '11px' },
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        borderRadius: 8,
        style: { color: '#ffffff', fontSize: '12px' },
        valueSuffix: ' orders',
      },
      legend: { enabled: false },
      plotOptions: {
        areaspline: {
          marker: { radius: 4, lineWidth: 2, lineColor: '#ffffff' },
          lineWidth: 2.5,
          color: '#0d9488',
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, 'rgba(13, 148, 136, 0.35)'],
              [1, 'rgba(13, 148, 136, 0.0)'],
            ],
          },
        },
      },
      series: [
        {
          name: 'Order Volume',
          type: 'areaspline',
          data,
        },
      ],
    };
  }, [dailyOrderTrends]);

  // ── Highcharts 2: Orders by Status (Donut Chart) ──
  const ordersByStatusOptions: Highcharts.Options = useMemo(() => {
    const statuses = [
      { name: 'Delivered', y: metrics.deliveredOrders, color: '#16a34a' },
      { name: 'Shipped', y: metrics.shippedOrders, color: '#8b5cf6' },
      { name: 'Processing', y: metrics.processingOrders, color: '#3b82f6' },
      { name: 'Pending', y: metrics.pendingOrders, color: '#f59e0b' },
      { name: 'Cancelled', y: metrics.cancelledOrders, color: '#ef4444' },
      { name: 'Returned', y: metrics.returnedOrders, color: '#ea580c' },
      { name: 'Failed', y: metrics.failedOrders, color: '#dc2626' },
    ].filter((s) => s.y > 0);

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
        pointFormat: '{series.name}: <b>{point.y}</b> ({point.percentage:.1f}%)',
      },
      plotOptions: {
        pie: {
          innerSize: '62%',
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.y}',
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
          name: 'Orders',
          type: 'pie',
          data: statuses,
        },
      ],
    };
  }, [metrics]);

  // ── Highcharts 3: Orders by Payment Method (Column / Bar Chart) ──
  const ordersByPaymentOptions: Highcharts.Options = useMemo(() => {
    const map: Record<string, { count: number; color: string }> = {
      'UPI / Razorpay': { count: 0, color: '#0d9488' },
      'Credit / Debit Card': { count: 0, color: '#3b82f6' },
      'Net Banking': { count: 0, color: '#8b5cf6' },
      'Cash on Delivery': { count: 0, color: '#f59e0b' },
    };

    filteredOrders.forEach((o) => {
      if (map[o.paymentMethod]) {
        map[o.paymentMethod].count += 1;
      }
    });

    const categories = Object.keys(map);
    const data = Object.values(map).map((item) => ({
      y: item.count,
      color: item.color,
    }));

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
        title: { text: 'Orders Count', style: { color: '#64748b', fontSize: '11px' } },
        gridLineColor: '#f1f5f9',
        allowDecimals: false,
        labels: { style: { color: '#64748b', fontSize: '11px' } },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        borderRadius: 8,
        style: { color: '#ffffff', fontSize: '12px' },
        valueSuffix: ' orders',
      },
      legend: { enabled: false },
      plotOptions: {
        column: {
          borderRadius: 6,
          dataLabels: {
            enabled: true,
            format: '{point.y} orders',
            style: { fontSize: '10px', color: '#475569' },
          },
        },
      },
      series: [
        {
          name: 'Orders',
          type: 'column',
          data,
        },
      ],
    };
  }, [filteredOrders]);

  // ── Highcharts 4: Delivery Performance Lifecycle (Bar Chart) ──
  const deliveryPerformanceOptions: Highcharts.Options = useMemo(() => {
    const stages = [
      {
        name: 'Processing',
        y: filteredOrders.filter((o) => o.deliveryStatus === 'Ready to Pick' || o.orderStatus === 'Processing').length,
        color: '#3b82f6',
      },
      {
        name: 'Shipped',
        y: filteredOrders.filter((o) => o.deliveryStatus === 'In Transit' || o.orderStatus === 'Shipped').length,
        color: '#8b5cf6',
      },
      {
        name: 'Out for Delivery',
        y: filteredOrders.filter((o) => o.deliveryStatus === 'Out for Delivery').length,
        color: '#0284c7',
      },
      {
        name: 'Delivered',
        y: filteredOrders.filter((o) => o.deliveryStatus === 'Delivered').length,
        color: '#16a34a',
      },
      {
        name: 'Cancelled',
        y: filteredOrders.filter((o) => o.deliveryStatus === 'Cancelled' || o.orderStatus === 'Cancelled').length,
        color: '#ef4444',
      },
    ];

    const categories = stages.map((s) => s.name);

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
        title: { text: 'Orders at Stage', style: { color: '#64748b', fontSize: '11px' } },
        gridLineColor: '#f1f5f9',
        allowDecimals: false,
        labels: { style: { color: '#64748b', fontSize: '11px' } },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        borderRadius: 8,
        style: { color: '#ffffff', fontSize: '12px' },
        valueSuffix: ' consignments',
      },
      legend: { enabled: false },
      plotOptions: {
        column: {
          borderRadius: 6,
          dataLabels: {
            enabled: true,
            format: '{point.y}',
            style: { fontSize: '11px', color: '#0f172a', fontWeight: '700' },
          },
        },
      },
      series: [
        {
          name: 'Consignments',
          type: 'column',
          data: stages,
        },
      ],
    };
  }, [filteredOrders]);

  // ── Export CSV Handler ──
  const handleExportCSV = () => {
    exportTableToCSV({
      filename: `buybright_orders_report_${Date.now()}`,
      headers: ['Order ID', 'Date', 'Customer Name', 'Clinic', 'Items', 'Amount (₹)', 'Payment Method', 'Payment Status', 'Order Status', 'Delivery Status', 'Courier', 'AWB'],
      rows: filteredOrders.map((o) => [
        o.orderNumber,
        o.orderDate,
        o.doctorName,
        o.clinicName,
        o.itemsCount,
        o.totalAmount,
        o.paymentMethod,
        o.paymentStatus,
        o.orderStatus,
        o.deliveryStatus,
        o.courier,
        o.awbNumber,
      ]),
    });
    showToast('Orders Report downloaded as CSV', 'success');
  };

  // ── Export PDF Handler ──
  const handleExportPDF = () => {
    exportTableToPDF({
      title: 'BuyBright — Orders & Logistics Performance Report',
      subtitle: `Consignment register, order fulfillment stages, and delivery tracking (${startDate} to ${endDate})`,
      headers: ['Order ID', 'Date', 'Customer & Clinic', 'Items', 'Amount', 'Payment', 'Order Status', 'Delivery Status'],
      rows: [
        ...filteredOrders.map((o) => [
          o.orderNumber,
          o.orderDate,
          `${o.doctorName} (${o.clinicName})`,
          `${o.itemsCount} SKU(s)`,
          `₹${o.totalAmount.toLocaleString('en-IN')}`,
          `${o.paymentMethod} (${o.paymentStatus})`,
          o.orderStatus,
          `${o.deliveryStatus} [${o.courier}]`,
        ]),
        [
          'TOTALS',
          `${filteredOrders.length} Orders`,
          '—',
          '—',
          `₹${metrics.totalAmount.toLocaleString('en-IN')}`,
          '—',
          '—',
          '—',
        ],
      ],
    });
  };

  return (
    <AdminLayout
      title="Orders Report"
      subtitle="Understand order volume, delivery performance, fulfillment lifecycle, and courier tracking"
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
                background: '#3b82f615',
                color: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
              }}
            >
              <i className="fa-solid fa-filter" />
            </div>
            <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>Filter Orders Intelligence</strong>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>({filteredOrders.length} orders matched)</span>
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
                  border: isActive ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                  background: isActive ? '#3b82f6' : '#f8fafc',
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
          {/* 1. Start Date */}
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

          {/* 2. End Date */}
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
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Returned">Returned</option>
              <option value="Failed">Failed</option>
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
              <option value="Failed">Failed</option>
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

          {/* 6. Customer Type */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
              Customer Type
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

          {/* 7. City */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
              City
            </label>
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setCurrentPage(1);
              }}
              className="table-filter-select"
              style={{ width: '100%', fontSize: '0.8rem' }}
            >
              <option value="All">All Cities</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="New Delhi">New Delhi</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Pune">Pune</option>
              <option value="Chennai">Chennai</option>
              <option value="Jaipur">Jaipur</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Lucknow">Lucknow</option>
            </select>
          </div>

          {/* 8. State */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
              State
            </label>
            <select
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                setCurrentPage(1);
              }}
              className="table-filter-select"
              style={{ width: '100%', fontSize: '0.8rem' }}
            >
              <option value="All">All States</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Delhi">Delhi</option>
              <option value="Telangana">Telangana</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
            </select>
          </div>

          {/* 9. Courier Partner */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
              Courier Partner
            </label>
            <select
              value={courier}
              onChange={(e) => {
                setCourier(e.target.value);
                setCurrentPage(1);
              }}
              className="table-filter-select"
              style={{ width: '100%', fontSize: '0.8rem' }}
            >
              <option value="All">All Logistics Carriers</option>
              <option value="BlueDart Express">BlueDart Express</option>
              <option value="Delhivery Surface">Delhivery Surface</option>
              <option value="BlueDart Air Cargo">BlueDart Air Cargo</option>
              <option value="Shadowfax">Shadowfax</option>
              <option value="Ekart Logistics">Ekart Logistics</option>
            </select>
          </div>

          {/* 10. Delivery Status */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
              Delivery Lifecycle Stage
            </label>
            <select
              value={deliveryStatus}
              onChange={(e) => {
                setDeliveryStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="table-filter-select"
              style={{ width: '100%', fontSize: '0.8rem' }}
            >
              <option value="All">All Delivery Stages</option>
              <option value="Ready to Pick">Ready to Pick</option>
              <option value="In Transit">In Transit</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Returned">Returned</option>
              <option value="Delivery Failed">Delivery Failed</option>
            </select>
          </div>

          {/* 11. Customer / Order Search Box */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
              Customer / Order ID Search
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
                placeholder="Search by Order ID (PRESTO-2026-...), Doctor Name, Clinic..."
                value={customerQuery}
                onChange={(e) => {
                  setCustomerQuery(e.target.value);
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
        {/* ── Graph 1: Orders Over Time (Highcharts Area/Line Chart) ── */}
        <div className="report-chart-card">
          <div className="report-chart-header">
            <div className="report-chart-title-wrap">
              <strong className="report-chart-title">
                <i className="fa-solid fa-chart-line" style={{ color: '#0d9488' }} />
                1. Orders Over Time (Highcharts)
              </strong>
              <p className="report-chart-desc">
                Daily requisition order counts and volume velocity
              </p>
            </div>
            <span className="report-chart-badge">Area / Line</span>
          </div>
          <div className="report-chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={ordersOverTimeOptions} />
          </div>
        </div>

        {/* ── Graph 2: Orders by Status (Highcharts Donut Chart) ── */}
        <div className="report-chart-card">
          <div className="report-chart-header">
            <div className="report-chart-title-wrap">
              <strong className="report-chart-title">
                <i className="fa-solid fa-chart-pie" style={{ color: '#3b82f6' }} />
                2. Orders by Status (Donut Chart)
              </strong>
              <p className="report-chart-desc">
                Percentage volume breakdown across fulfillment states
              </p>
            </div>
            <span className="report-chart-badge">Donut Chart</span>
          </div>
          <div className="report-chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={ordersByStatusOptions} />
          </div>
        </div>

        {/* ── Graph 3: Orders by Payment Method (Highcharts Column Chart) ── */}
        <div className="report-chart-card">
          <div className="report-chart-header">
            <div className="report-chart-title-wrap">
              <strong className="report-chart-title">
                <i className="fa-solid fa-credit-card" style={{ color: '#8b5cf6' }} />
                3. Orders by Payment Method (Bar Chart)
              </strong>
              <p className="report-chart-desc">
                Transaction counts and conversion share across payment gateways
              </p>
            </div>
            <span className="report-chart-badge">Column Chart</span>
          </div>
          <div className="report-chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={ordersByPaymentOptions} />
          </div>
        </div>

        {/* ── Graph 4: Delivery Performance Lifecycle (Highcharts Column Chart) ── */}
        <div className="report-chart-card">
          <div className="report-chart-header">
            <div className="report-chart-title-wrap">
              <strong className="report-chart-title">
                <i className="fa-solid fa-truck-ramp-box" style={{ color: '#f59e0b' }} />
                4. Delivery Performance Lifecycle (Bar Chart)
              </strong>
              <p className="report-chart-desc">
                Processing, Shipped, Out for Delivery, Delivered, and Cancelled stages
              </p>
            </div>
            <span className="report-chart-badge">Bar Chart</span>
          </div>
          <div className="report-chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={deliveryPerformanceOptions} />
          </div>
        </div>
      </div>

      {/* ── Detailed Orders Table with Pagination & Totals Footer ── */}
      <div className="admin-card" style={{ borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <div className="card-toolbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <span className="toolbar-title">
              <i className="fa-solid fa-table-list" style={{ color: '#0d9488', marginRight: '8px' }} />
              Orders &amp; Consignment Fulfillment Register ({filteredOrders.length} orders)
            </span>
            <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>
              Order ID, Customer Clinic, Items Count, Amount, Payment Gateway, Order Status, and Delivery Status
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
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Order Status</th>
                <th>Delivery Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
                    <i className="fa-solid fa-inbox" style={{ fontSize: '2rem', marginBottom: '8px', display: 'block', color: '#cbd5e1' }} />
                    <span>No orders found matching your selected criteria.</span>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <strong style={{ color: '#0d9488', fontSize: '0.86rem', fontFamily: 'monospace' }}>
                        {row.orderNumber}
                      </strong>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.82rem', color: '#0f172a', fontWeight: 600 }}>
                        {row.orderDate.split(',')[0]}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {row.orderDate.split(',')[1] || ''}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{row.doctorName}</div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        {row.clinicName} • <span style={{ color: '#475569' }}>{row.city}, {row.state}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: '#475569' }}>{row.itemsCount} SKU(s)</span>
                    </td>
                    <td>
                      <strong style={{ color: '#0f766e', fontSize: '0.92rem' }}>
                        ₹{row.totalAmount.toLocaleString('en-IN')}
                      </strong>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 600 }}>
                        {row.paymentMethod}
                      </div>
                      <span
                        className={`admin-badge ${row.paymentStatus === 'Paid' ? 'badge-active' : 'badge-inactive'}`}
                        style={{ fontSize: '0.68rem', marginTop: '2px' }}
                      >
                        {row.paymentStatus}
                      </span>
                    </td>
                    <td>
                      {(() => {
                        let badgeClass = 'badge-neutral';
                        if (row.orderStatus === 'Delivered') badgeClass = 'badge-active';
                        else if (row.orderStatus === 'Shipped' || row.orderStatus === 'Processing' || row.orderStatus === 'Pending') badgeClass = 'badge-pending';
                        else if (row.orderStatus === 'Cancelled' || row.orderStatus === 'Returned' || row.orderStatus === 'Failed') badgeClass = 'badge-inactive';
                        return <span className={`admin-badge ${badgeClass}`}>{row.orderStatus}</span>;
                      })()}
                    </td>
                    <td>
                      <div>
                        <span style={{ fontWeight: 600, fontSize: '0.82rem', color: '#0f172a' }}>
                          {row.deliveryStatus}
                        </span>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          {row.courier} ({row.awbNumber})
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredOrders.length > 0 && (
              <tfoot>
                <tr style={{ background: '#f8fafc', fontWeight: 800, borderTop: '2px solid #0d9488' }}>
                  <td style={{ color: '#0d9488', fontSize: '0.88rem' }}>
                    <i className="fa-solid fa-calculator" style={{ marginRight: '6px' }} />
                    TOTALS ({filteredOrders.length} Orders)
                  </td>
                  <td>—</td>
                  <td>—</td>
                  <td style={{ color: '#3b82f6' }}>
                    {filteredOrders.reduce((acc, c) => acc + c.itemsCount, 0)} Items
                  </td>
                  <td style={{ color: '#0f766e', fontSize: '0.96rem' }}>
                    ₹{metrics.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td>—</td>
                  <td style={{ color: '#16a34a' }}>
                    {metrics.deliveredOrders} Delivered
                  </td>
                  <td style={{ color: '#64748b', fontSize: '0.76rem' }}>
                    Avg ₹{Math.round(metrics.totalAmount / (filteredOrders.length || 1)).toLocaleString('en-IN')} / Order
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
          totalItems={filteredOrders.length}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </AdminLayout>
  );
};

export default OrdersReportPage;
