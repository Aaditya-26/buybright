/**
 * BuyBright Admin — Cart Report Page.
 * Purpose: Understand cart abandonment, checkout velocity, conversion rates, and product-level recovery.
 *
 * Features:
 *   - 8 Executive KPI Stat Cards (Total Carts, Active, Converted, Abandoned, Conversion Rate, Abandonment Rate, Products Added, Cart Revenue)
 *   - Advanced Filter Suite (Quick Dates, Custom Range, Product Search, Category, Brand, Customer Type, Cart Status, Reset)
 *   - 4 Highcharts Data Visualizations:
 *       1. Carts Over Time — Trend (Line / Area Spline)
 *       2. Added vs Converted vs Abandoned (Bar / Line Combo Chart)
 *       3. Cart Conversion Funnel (4-Stage Procurement Funnel)
 *       4. Top Abandoned Products (Horizontal Bar Chart)
 *   - Paginated Cart Product Performance Table with Totals Summary Footer
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
import { initialCartProductReport, CartProductReportItem } from '../../data/reportsData';

type QuickDateOption = 'Today' | '7 Days' | '30 Days' | 'This Month' | 'Last Month' | 'Custom';

export const CartReportPage: React.FC = () => {
  const { showToast } = useToast();
  const [cartProducts] = useState<CartProductReportItem[]>(initialCartProductReport);

  // ── Filter States ──
  const [quickDate, setQuickDate] = useState<QuickDateOption>('30 Days');
  const [startDate, setStartDate] = useState<string>('2026-09-25');
  const [endDate, setEndDate] = useState<string>('2026-10-06');
  const [productQuery, setProductQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [brandFilter, setBrandFilter] = useState<string>('All');
  const [customerTypeFilter, setCustomerTypeFilter] = useState<string>('All');
  const [cartStatusFilter, setCartStatusFilter] = useState<string>('All');

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
    setProductQuery('');
    setCategoryFilter('All');
    setBrandFilter('All');
    setCustomerTypeFilter('All');
    setCartStatusFilter('All');
    setCurrentPage(1);
    showToast('Cart filters reset to default', 'info');
  };

  // ── Filtered Products Computation ──
  const filteredProducts = useMemo(() => {
    return cartProducts.filter((item) => {
      if (startDate && item.rawDate < startDate) return false;
      if (endDate && item.rawDate > endDate) return false;
      if (
        productQuery &&
        !item.productName.toLowerCase().includes(productQuery.toLowerCase()) &&
        !item.sku.toLowerCase().includes(productQuery.toLowerCase())
      ) {
        return false;
      }
      if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
      if (brandFilter !== 'All' && item.brand !== brandFilter) return false;
      if (customerTypeFilter !== 'All' && item.customerType !== customerTypeFilter) return false;
      if (cartStatusFilter !== 'All' && item.cartStatus !== cartStatusFilter) return false;
      return true;
    });
  }, [
    cartProducts,
    startDate,
    endDate,
    productQuery,
    categoryFilter,
    brandFilter,
    customerTypeFilter,
    cartStatusFilter,
  ]);

  // ── Aggregated KPI Metrics ──
  const metrics = useMemo(() => {
    const totalProductsAdded = filteredProducts.reduce((acc, curr) => acc + curr.addedToCart, 0);
    const totalConverted = filteredProducts.reduce((acc, curr) => acc + curr.converted, 0);
    const totalAbandoned = filteredProducts.reduce((acc, curr) => acc + curr.abandoned, 0);
    const totalCartRevenue = filteredProducts.reduce((acc, curr) => acc + curr.cartValue, 0);

    const activeCartsCount = filteredProducts.filter((p) => p.cartStatus === 'Active').length;
    const convertedCartsCount = filteredProducts.filter((p) => p.cartStatus === 'Converted').length;
    const abandonedCartsCount = filteredProducts.filter((p) => p.cartStatus === 'Abandoned').length;
    const totalCartsCount = activeCartsCount + convertedCartsCount + abandonedCartsCount || filteredProducts.length;

    const conversionRate = totalProductsAdded > 0 ? (totalConverted / totalProductsAdded) * 100 : 0;
    const abandonmentRate = totalProductsAdded > 0 ? (totalAbandoned / totalProductsAdded) * 100 : 0;

    const totalViews = filteredProducts.reduce((acc, curr) => acc + curr.productViews, 0);
    const totalCheckoutStarted = filteredProducts.reduce((acc, curr) => acc + curr.checkoutStarted, 0);

    return {
      totalCartsCount,
      activeCartsCount,
      convertedCartsCount,
      abandonedCartsCount,
      totalProductsAdded,
      totalConverted,
      totalAbandoned,
      conversionRate,
      abandonmentRate,
      totalCartRevenue,
      totalViews,
      totalCheckoutStarted,
    };
  }, [filteredProducts]);

  // ── 8 Executive KPI Stat Cards ──
  const kpis: ReportStatData[] = [
    {
      id: 'kpi-cart-1',
      label: 'Total Carts',
      value: `${metrics.totalCartsCount} Active Sessions`,
      icon: 'fa-solid fa-cart-shopping',
      color: '#0d9488',
      change: '+18.4% MoM',
      isPositive: true,
      subtext: 'Monitored dental cart sessions',
      badge: 'Cart Volume',
    },
    {
      id: 'kpi-cart-2',
      label: 'Active Carts',
      value: `${metrics.activeCartsCount} Carts`,
      icon: 'fa-solid fa-clock-rotate-left',
      color: '#3b82f6',
      change: 'In Progress',
      isPositive: true,
      subtext: 'Clinics currently browsing checkout',
      badge: 'Live Carts',
    },
    {
      id: 'kpi-cart-3',
      label: 'Converted Carts',
      value: `${metrics.totalConverted.toLocaleString('en-IN')} Units`,
      icon: 'fa-solid fa-circle-check',
      color: '#16a34a',
      change: `${metrics.convertedCartsCount} Orders placed`,
      isPositive: true,
      subtext: 'Successful checkouts generated',
      badge: 'Orders Placed',
    },
    {
      id: 'kpi-cart-4',
      label: 'Abandoned Carts',
      value: `${metrics.totalAbandoned.toLocaleString('en-IN')} Units`,
      icon: 'fa-solid fa-cart-arrow-down',
      color: '#ef4444',
      change: `${metrics.abandonedCartsCount} Sessions`,
      isPositive: false,
      subtext: 'Unfinished checkouts at risk',
      badge: 'Drop-Offs',
    },
    {
      id: 'kpi-cart-5',
      label: 'Cart Conversion Rate',
      value: `${metrics.conversionRate.toFixed(1)}%`,
      icon: 'fa-solid fa-arrow-trend-up',
      color: '#059669',
      change: '+4.2% vs last month',
      isPositive: true,
      subtext: 'Added items converted to orders',
      badge: 'Conversion',
    },
    {
      id: 'kpi-cart-6',
      label: 'Abandonment Rate',
      value: `${metrics.abandonmentRate.toFixed(1)}%`,
      icon: 'fa-solid fa-triangle-exclamation',
      color: '#f59e0b',
      change: '-3.1% (Improving)',
      isPositive: true,
      subtext: 'Items left in abandoned carts',
      badge: 'Drop Rate',
    },
    {
      id: 'kpi-cart-7',
      label: 'Products Added',
      value: `${metrics.totalProductsAdded.toLocaleString('en-IN')} Items`,
      icon: 'fa-solid fa-boxes-stacked',
      color: '#8b5cf6',
      change: '+24.5% Volume',
      isPositive: true,
      subtext: 'Gross units placed in carts',
      badge: 'Cart Adds',
    },
    {
      id: 'kpi-cart-8',
      label: 'Cart Revenue',
      value: `₹${metrics.totalCartRevenue.toLocaleString('en-IN')}`,
      icon: 'fa-solid fa-coins',
      color: '#0284c7',
      change: 'Gross Cart Pipeline',
      isPositive: true,
      subtext: 'Total value of items in carts',
      badge: 'Pipeline Value',
    },
  ];

  // ── Pagination Calculation ──
  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredProducts.slice(startIndex, startIndex + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  // ── Distinct Filter Options ──
  const categoriesList = useMemo(() => {
    return Array.from(new Set(cartProducts.map((p) => p.category))).filter(Boolean);
  }, [cartProducts]);

  const brandsList = useMemo(() => {
    return Array.from(new Set(cartProducts.map((p) => p.brand))).filter(Boolean);
  }, [cartProducts]);

  // ── Highcharts Data: 1. Carts Over Time — Trend ──
  const cartsOverTimeOptions: Highcharts.Options = useMemo(() => {
    const dateMap = new Map<string, { added: number; converted: number; abandoned: number }>();

    filteredProducts.forEach((item) => {
      const d = item.rawDate;
      const current = dateMap.get(d) || { added: 0, converted: 0, abandoned: 0 };
      current.added += item.addedToCart;
      current.converted += item.converted;
      current.abandoned += item.abandoned;
      dateMap.set(d, current);
    });

    const sortedDates = Array.from(dateMap.keys()).sort();
    const addedSeries = sortedDates.map((d) => dateMap.get(d)?.added || 0);
    const convertedSeries = sortedDates.map((d) => dateMap.get(d)?.converted || 0);
    const abandonedSeries = sortedDates.map((d) => dateMap.get(d)?.abandoned || 0);

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
        tickColor: '#e2e8f0',
      },
      yAxis: {
        title: { text: 'Units in Cart', style: { color: '#64748b', fontSize: '12px' } },
        gridLineColor: '#f1f5f9',
        labels: { style: { color: '#64748b', fontSize: '11px' } },
      },
      tooltip: {
        shared: true,
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        borderRadius: 8,
        style: { color: '#ffffff' },
        useHTML: true,
        headerFormat: '<span style="font-size:12px;font-weight:700;color:#38bdf8">{point.key}</span><br/>',
        pointFormat: '<span style="color:{series.color}">●</span> {series.name}: <b>{point.y} Units</b><br/>',
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
          name: 'Added to Cart',
          data: addedSeries,
          color: '#0d9488',
        },
        {
          type: 'areaspline',
          name: 'Converted (Ordered)',
          data: convertedSeries,
          color: '#16a34a',
        },
        {
          type: 'areaspline',
          name: 'Abandoned Carts',
          data: abandonedSeries,
          color: '#ef4444',
        },
      ],
    };
  }, [filteredProducts]);

  // ── Highcharts Data: 2. Added vs Converted vs Abandoned (Combo Bar / Line) ──
  const addedVsConvertedVsAbandonedOptions: Highcharts.Options = useMemo(() => {
    const topProducts = [...filteredProducts]
      .sort((a, b) => b.addedToCart - a.addedToCart)
      .slice(0, 6);

    const categories = topProducts.map((p) => {
      const name = p.productName;
      return name.length > 20 ? `${name.substring(0, 20)}...` : name;
    });

    const addedData = topProducts.map((p) => p.addedToCart);
    const convertedData = topProducts.map((p) => p.converted);
    const abandonedData = topProducts.map((p) => p.abandoned);
    const convRateLine = topProducts.map((p) => p.conversionRate);

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
          style: { color: '#64748b', fontSize: '11px', fontWeight: '600' },
          rotation: -15,
        },
        lineColor: '#e2e8f0',
      },
      yAxis: [
        {
          title: { text: 'Units Volume', style: { color: '#64748b', fontSize: '12px' } },
          gridLineColor: '#f1f5f9',
          labels: { style: { color: '#64748b', fontSize: '11px' } },
        },
        {
          title: { text: 'Conversion Rate (%)', style: { color: '#0d9488', fontSize: '12px' } },
          opposite: true,
          gridLineWidth: 0,
          labels: {
            format: '{value}%',
            style: { color: '#0d9488', fontSize: '11px', fontWeight: '600' },
          },
          max: 100,
        },
      ],
      tooltip: {
        shared: true,
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        borderRadius: 8,
        style: { color: '#ffffff' },
      },
      series: [
        {
          type: 'column',
          name: 'Added',
          data: addedData,
          color: '#38bdf8',
          borderRadius: 4,
        },
        {
          type: 'column',
          name: 'Converted',
          data: convertedData,
          color: '#22c55e',
          borderRadius: 4,
        },
        {
          type: 'column',
          name: 'Abandoned',
          data: abandonedData,
          color: '#f87171',
          borderRadius: 4,
        },
        {
          type: 'spline',
          name: 'Conversion Rate',
          data: convRateLine,
          yAxis: 1,
          color: '#0d9488',
          lineWidth: 3,
          marker: { radius: 5, symbol: 'diamond', fillColor: '#0d9488' },
          tooltip: { valueSuffix: '%' },
        },
      ],
    };
  }, [filteredProducts]);

  // ── Highcharts Data: 3. Cart Conversion Funnel ──
  const cartFunnelOptions: Highcharts.Options = useMemo(() => {
    const views = metrics.totalViews || 8500;
    const added = metrics.totalProductsAdded || 3600;
    const checkout = metrics.totalCheckoutStarted || 2200;
    const orders = metrics.totalConverted || 1650;

    const stages = [
      { name: 'Product Viewed', y: views, color: '#38bdf8' },
      { name: 'Added to Cart', y: added, color: '#0d9488' },
      { name: 'Checkout Started', y: checkout, color: '#f59e0b' },
      { name: 'Order Placed', y: orders, color: '#16a34a' },
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
        title: { text: 'Session Count', style: { color: '#64748b', fontSize: '12px' } },
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
          const pctOfViews = ((stageVal / views) * 100).toFixed(1);
          return `<b>${stageName}</b><br/>Total: <b>${stageVal.toLocaleString('en-IN')}</b><br/>Funnel Yield: <b>${pctOfViews}% of Views</b>`;
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
              return `${y.toLocaleString('en-IN')}`;
            },
            style: { fontWeight: '700', color: '#0f172a', fontSize: '11px' },
          },
        },
      },
      series: [
        {
          type: 'column',
          name: 'Procurement Funnel',
          data: stages.map((s) => ({ y: s.y, color: s.color })),
          showInLegend: false,
        },
      ],
    };
  }, [metrics]);

  // ── Highcharts Data: 4. Top Abandoned Products (Horizontal Bar Chart) ──
  const topAbandonedProductsOptions: Highcharts.Options = useMemo(() => {
    const sortedAbandoned = [...filteredProducts]
      .sort((a, b) => b.abandoned - a.abandoned)
      .slice(0, 6);

    const categories = sortedAbandoned.map((p) => {
      const name = p.productName;
      return name.length > 22 ? `${name.substring(0, 22)}...` : name;
    });

    const data = sortedAbandoned.map((p) => ({
      y: p.abandoned,
      cartVal: p.cartValue,
      rate: p.abandonmentRate,
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
        labels: { style: { color: '#475569', fontSize: '11px', fontWeight: '600' } },
        lineColor: '#e2e8f0',
      },
      yAxis: {
        title: { text: 'Abandoned Units', style: { color: '#64748b', fontSize: '12px' } },
        gridLineColor: '#f1f5f9',
        labels: { style: { color: '#64748b', fontSize: '11px' } },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        borderRadius: 8,
        style: { color: '#ffffff' },
        formatter: function () {
          const self = this as any;
          const cat = self.x || self.point?.category || '';
          const units = self.y || 0;
          const pointObj = self.point || {};
          const rate = pointObj.rate ?? '';
          const cartVal = pointObj.cartVal ?? 0;
          return `<b>${cat}</b><br/>` +
            `Abandoned Units: <span style="color:#ef4444;font-weight:700">${units} Units</span><br/>` +
            `Abandonment Rate: <b>${rate}%</b><br/>` +
            `Cart Pipeline Value: <b>₹${Number(cartVal).toLocaleString('en-IN')}</b>`;
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 5,
          color: '#f43f5e',
          dataLabels: {
            enabled: true,
            format: '{y} units',
            style: { fontWeight: '700', color: '#881337', fontSize: '11px' },
          },
        },
      },
      series: [
        {
          type: 'bar',
          name: 'Abandoned Units',
          data: data,
          showInLegend: false,
        },
      ],
    };
  }, [filteredProducts]);

  // ── CSV Export ──
  const handleExportCSV = () => {
    exportTableToCSV({
      filename: `presto_cart_report_${Date.now()}`,
      headers: [
        'SKU',
        'Product Name',
        'Category',
        'Brand',
        'Customer Type',
        'Added to Cart',
        'Converted',
        'Abandoned',
        'Conversion Rate (%)',
        'Abandonment Rate (%)',
        'Cart Value (₹)',
      ],
      rows: filteredProducts.map((p) => [
        p.sku,
        p.productName,
        p.category,
        p.brand,
        p.customerType,
        p.addedToCart,
        p.converted,
        p.abandoned,
        `${p.conversionRate}%`,
        `${p.abandonmentRate}%`,
        p.cartValue,
      ]),
    });
    showToast('Cart Report exported as CSV successfully', 'success');
  };

  // ── PDF Export ──
  const handleExportPDF = () => {
    exportTableToPDF({
      title: 'BuyBright — Cart & Checkout Performance Report',
      subtitle: `Product additions, checkout drop-offs, and conversion rates (${startDate} to ${endDate})`,
      headers: [
        'Product',
        'Category',
        'Added',
        'Converted',
        'Abandoned',
        'Conv %',
        'Drop %',
        'Cart Value',
      ],
      rows: filteredProducts.map((p) => [
        p.productName,
        p.category,
        p.addedToCart,
        p.converted,
        p.abandoned,
        `${p.conversionRate}%`,
        `${p.abandonmentRate}%`,
        `₹${p.cartValue.toLocaleString('en-IN')}`,
      ]),
    });
    showToast('Cart Report exported as PDF successfully', 'success');
  };

  return (
    <AdminLayout
      title="Cart Performance & Abandonment Report"
      subtitle="Understand cart abandonment velocity, product conversion rates, and checkout recovery pipeline"
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

      {/* ── 8 Professional Responsive Executive KPI Stat Cards ── */}
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

      {/* ── Comprehensive Multi-Dimensional Filters Suite ── */}
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

          {/* Product Search */}
          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
              Product / SKU Search
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
                placeholder="Search Product or SKU..."
                value={productQuery}
                onChange={(e) => {
                  setProductQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="table-search-input"
                style={{ width: '100%', paddingLeft: '30px', fontSize: '0.82rem', padding: '7px 10px 7px 30px' }}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="table-filter-select"
              style={{ width: '100%', fontSize: '0.82rem', padding: '7px 10px' }}
            >
              <option value="All">All Categories</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
              Brand
            </label>
            <select
              value={brandFilter}
              onChange={(e) => {
                setBrandFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="table-filter-select"
              style={{ width: '100%', fontSize: '0.82rem', padding: '7px 10px' }}
            >
              <option value="All">All Brands</option>
              {brandsList.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Customer Type */}
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
              <option value="All">All Customers</option>
              <option value="B2B">B2B Verified Clinics</option>
              <option value="B2C">B2C Retail Dentists</option>
            </select>
          </div>

          {/* Cart Status */}
          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
              Cart Status
            </label>
            <select
              value={cartStatusFilter}
              onChange={(e) => {
                setCartStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="table-filter-select"
              style={{ width: '100%', fontSize: '0.82rem', padding: '7px 10px' }}
            >
              <option value="All">All Cart Statuses</option>
              <option value="Active">Active in Checkout</option>
              <option value="Converted">Converted to Order</option>
              <option value="Abandoned">Abandoned / Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── 4 Interactive Highcharts Graphs (2x2 Grid) ── */}
      <div className="reports-charts-grid">
        {/* Graph 1: Carts Over Time — Trend */}
        <div className="report-chart-card">
          <div className="report-chart-header">
            <div className="report-chart-title-wrap">
              <h3 className="report-chart-title">
                <i className="fa-solid fa-chart-line" style={{ color: '#0d9488' }} />
                1. Carts Over Time — Trend
              </h3>
              <p className="report-chart-desc">
                Daily added items vs. converted orders and abandonments
              </p>
            </div>
            <span className="report-chart-badge">Line / Area Spline</span>
          </div>
          <div className="report-chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={cartsOverTimeOptions} />
          </div>
        </div>

        {/* Graph 2: Added vs Converted vs Abandoned */}
        <div className="report-chart-card">
          <div className="report-chart-header">
            <div className="report-chart-title-wrap">
              <h3 className="report-chart-title">
                <i className="fa-solid fa-chart-column" style={{ color: '#3b82f6' }} />
                2. Added vs Converted vs Abandoned
              </h3>
              <p className="report-chart-desc">
                SKU volume comparison with conversion yield trajectory
              </p>
            </div>
            <span className="report-chart-badge" style={{ color: '#3b82f6', background: '#eff6ff', borderColor: '#dbeafe' }}>
              Bar + Line Combo
            </span>
          </div>
          <div className="report-chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={addedVsConvertedVsAbandonedOptions} />
          </div>
        </div>

        {/* Graph 3: Cart Conversion Funnel */}
        <div className="report-chart-card">
          <div className="report-chart-header">
            <div className="report-chart-title-wrap">
              <h3 className="report-chart-title">
                <i className="fa-solid fa-filter" style={{ color: '#f59e0b' }} />
                3. Cart Conversion Funnel
              </h3>
              <p className="report-chart-desc">
                Product Viewed ↓ Added to Cart ↓ Checkout Started ↓ Order Placed
              </p>
            </div>
            <span className="report-chart-badge" style={{ color: '#f59e0b', background: '#fffbeb', borderColor: '#fef3c7' }}>
              Procurement Funnel
            </span>
          </div>
          <div className="report-chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={cartFunnelOptions} />
          </div>
        </div>

        {/* Graph 4: Top Abandoned Products */}
        <div className="report-chart-card">
          <div className="report-chart-header">
            <div className="report-chart-title-wrap">
              <h3 className="report-chart-title">
                <i className="fa-solid fa-chart-bar" style={{ color: '#ef4444' }} />
                4. Top Abandoned Products
              </h3>
              <p className="report-chart-desc">
                High-priority SKUs requiring email &amp; WhatsApp recovery
              </p>
            </div>
            <span className="report-chart-badge" style={{ color: '#ef4444', background: '#fef2f2', borderColor: '#fee2e2' }}>
              Horizontal Bar Chart
            </span>
          </div>
          <div className="report-chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={topAbandonedProductsOptions} />
          </div>
        </div>
      </div>

      {/* ── Paginated Cart Products Data Table ── */}
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
              Cart Product Performance Ledger
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
              {filteredProducts.length} Products
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
                <th style={{ minWidth: '220px' }}>Product</th>
                <th style={{ minWidth: '130px' }}>Category</th>
                <th style={{ textAlign: 'center', minWidth: '100px' }}>Added to Cart</th>
                <th style={{ textAlign: 'center', minWidth: '95px' }}>Converted</th>
                <th style={{ textAlign: 'center', minWidth: '95px' }}>Abandoned</th>
                <th style={{ textAlign: 'center', minWidth: '120px' }}>Conversion Rate</th>
                <th style={{ textAlign: 'center', minWidth: '130px' }}>Abandonment Rate</th>
                <th style={{ textAlign: 'right', minWidth: '110px' }}>Cart Value</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
                    <i
                      className="fa-solid fa-cart-arrow-down"
                      style={{ fontSize: '2.2rem', marginBottom: '10px', display: 'block', color: '#cbd5e1' }}
                    />
                    <div style={{ fontWeight: 600, fontSize: '0.94rem', color: '#334155' }}>
                      No cart product records match your filters
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
                      Try adjusting your date range, search query, or category filters.
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => {
                  const isHighConv = p.conversionRate >= 70;
                  const isHighDrop = p.abandonmentRate >= 50;

                  return (
                    <tr key={p.id}>
                      {/* Product Name & SKU */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              color: '#0d9488',
                              letterSpacing: '0.5px',
                              background: '#f0fdfa',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              border: '1px solid #ccfbf1',
                              fontFamily: 'monospace',
                              width: 'fit-content',
                            }}
                          >
                            {p.sku}
                          </span>
                          <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.86rem', lineHeight: 1.35 }}>
                            {p.productName}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            Brand: <strong>{p.brand}</strong> • {p.customerType}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td>
                        <span className="admin-badge badge-neutral" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                          {p.category}
                        </span>
                      </td>

                      {/* Added to Cart */}
                      <td style={{ textAlign: 'center' }}>
                        <span
                          style={{
                            fontWeight: 700,
                            color: '#0284c7',
                            background: '#f0f9ff',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.84rem',
                          }}
                        >
                          {p.addedToCart.toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Converted */}
                      <td style={{ textAlign: 'center' }}>
                        <span
                          style={{
                            fontWeight: 700,
                            color: '#16a34a',
                            background: '#f0fdf4',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.84rem',
                          }}
                        >
                          {p.converted.toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Abandoned */}
                      <td style={{ textAlign: 'center' }}>
                        <span
                          style={{
                            fontWeight: 700,
                            color: '#ef4444',
                            background: '#fef2f2',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.84rem',
                          }}
                        >
                          {p.abandoned.toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Conversion Rate */}
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span
                            style={{
                              fontWeight: 800,
                              fontSize: '0.82rem',
                              color: isHighConv ? '#16a34a' : '#0f766e',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <i className="fa-solid fa-arrow-trend-up" style={{ fontSize: '0.72rem' }} />
                            {p.conversionRate}%
                          </span>
                          <div
                            style={{
                              width: '60px',
                              height: '4px',
                              background: '#e2e8f0',
                              borderRadius: '2px',
                              overflow: 'hidden',
                              marginTop: '3px',
                            }}
                          >
                            <div
                              style={{
                                width: `${p.conversionRate}%`,
                                height: '100%',
                                background: isHighConv ? '#16a34a' : '#0d9488',
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Abandonment Rate */}
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span
                            style={{
                              fontWeight: 800,
                              fontSize: '0.82rem',
                              color: isHighDrop ? '#dc2626' : '#ea580c',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <i className="fa-solid fa-arrow-trend-down" style={{ fontSize: '0.72rem' }} />
                            {p.abandonmentRate}%
                          </span>
                          <div
                            style={{
                              width: '60px',
                              height: '4px',
                              background: '#e2e8f0',
                              borderRadius: '2px',
                              overflow: 'hidden',
                              marginTop: '3px',
                            }}
                          >
                            <div
                              style={{
                                width: `${p.abandonmentRate}%`,
                                height: '100%',
                                background: isHighDrop ? '#dc2626' : '#f97316',
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Cart Value */}
                      <td style={{ textAlign: 'right' }}>
                        <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>
                          ₹{p.cartValue.toLocaleString('en-IN')}
                        </strong>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* Totals Summary Footer */}
            {filteredProducts.length > 0 && (
              <tfoot>
                <tr style={{ background: '#f8fafc', fontWeight: 700, borderTop: '2px solid #e2e8f0' }}>
                  <td colSpan={2} style={{ color: '#0f172a', fontSize: '0.88rem' }}>
                    <i className="fa-solid fa-calculator" style={{ color: '#0d9488', marginRight: '6px' }} />
                    Total Summary ({filteredProducts.length} SKUs)
                  </td>
                  <td style={{ textAlign: 'center', color: '#0284c7', fontSize: '0.88rem' }}>
                    {metrics.totalProductsAdded.toLocaleString('en-IN')}
                  </td>
                  <td style={{ textAlign: 'center', color: '#16a34a', fontSize: '0.88rem' }}>
                    {metrics.totalConverted.toLocaleString('en-IN')}
                  </td>
                  <td style={{ textAlign: 'center', color: '#ef4444', fontSize: '0.88rem' }}>
                    {metrics.totalAbandoned.toLocaleString('en-IN')}
                  </td>
                  <td style={{ textAlign: 'center', color: '#0d9488', fontSize: '0.88rem' }}>
                    {metrics.conversionRate.toFixed(1)}% Avg
                  </td>
                  <td style={{ textAlign: 'center', color: '#f59e0b', fontSize: '0.88rem' }}>
                    {metrics.abandonmentRate.toFixed(1)}% Avg
                  </td>
                  <td style={{ textAlign: 'right', color: '#0f766e', fontSize: '0.94rem' }}>
                    ₹{metrics.totalCartRevenue.toLocaleString('en-IN')}
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
          totalItems={filteredProducts.length}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </AdminLayout>
  );
};

export default CartReportPage;
