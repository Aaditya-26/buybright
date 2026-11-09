/**
 * BuyBright Admin — Product Report Page.
 * Purpose: Track SKU performance, sales velocity, inventory levels, revenue yield, and customer ratings.
 *
 * Features:
 *   - 8 Executive KPI Stat Cards (Total Products, Active Products, Out of Stock, Low Stock, Total Units Sold, Top Selling Product, Product Revenue, In Stock Products)
 *   - Multi-Dimensional Filters (Quick Date Chips, Custom Range, Category, Subcategory, Brand, Product Search, Stock Status, Reset)
 *   - 4 Highcharts Visualizations:
 *       1. Top Products by Revenue (Horizontal Bar Chart)
 *       2. Top Products by Units Sold (Column / Bar Chart)
 *       3. Product Sales Trend (Line / Area Spline Chart)
 *       4. Product Stock Status (Donut Chart: In Stock, Low Stock, Out of Stock)
 *   - Paginated Product Ledger Table with Summary Totals Footer
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
import { initialProductReport, ProductReportItem } from '../../data/reportsData';

type QuickDateOption = 'Today' | '7 Days' | '30 Days' | 'This Month' | 'Last Month' | 'Custom';

export const ProductReportPage: React.FC = () => {
  const { showToast } = useToast();
  const [productsData] = useState<ProductReportItem[]>(initialProductReport);

  // ── Filter States ──
  const [quickDate, setQuickDate] = useState<QuickDateOption>('30 Days');
  const [startDate, setStartDate] = useState<string>('2026-09-25');
  const [endDate, setEndDate] = useState<string>('2026-10-06');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [subcategoryFilter, setSubcategoryFilter] = useState<string>('All');
  const [brandFilter, setBrandFilter] = useState<string>('All');
  const [productSearch, setProductSearch] = useState<string>('');
  const [stockStatusFilter, setStockStatusFilter] = useState<string>('All');

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
    setCategoryFilter('All');
    setSubcategoryFilter('All');
    setBrandFilter('All');
    setProductSearch('');
    setStockStatusFilter('All');
    setCurrentPage(1);
    showToast('Product filters reset to default', 'info');
  };

  // ── Filtered Products Computation ──
  const filteredProducts = useMemo(() => {
    return productsData.filter((item) => {
      if (startDate && item.rawDate < startDate) return false;
      if (endDate && item.rawDate > endDate) return false;
      if (
        productSearch &&
        !item.productName.toLowerCase().includes(productSearch.toLowerCase()) &&
        !item.sku.toLowerCase().includes(productSearch.toLowerCase())
      ) {
        return false;
      }
      if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
      if (subcategoryFilter !== 'All' && item.subcategory !== subcategoryFilter) return false;
      if (brandFilter !== 'All' && item.brand !== brandFilter) return false;
      if (stockStatusFilter !== 'All' && item.stockStatus !== stockStatusFilter) return false;
      return true;
    });
  }, [
    productsData,
    startDate,
    endDate,
    productSearch,
    categoryFilter,
    subcategoryFilter,
    brandFilter,
    stockStatusFilter,
  ]);

  // ── Aggregated KPI Metrics ──
  const metrics = useMemo(() => {
    const totalProducts = filteredProducts.length;
    const activeProducts = filteredProducts.filter((p) => p.isActive).length;
    const outOfStock = filteredProducts.filter((p) => p.stockStatus === 'Out of Stock').length;
    const lowStock = filteredProducts.filter((p) => p.stockStatus === 'Low Stock').length;
    const inStock = filteredProducts.filter((p) => p.stockStatus === 'In Stock').length;
    const totalUnitsSold = filteredProducts.reduce((acc, curr) => acc + curr.unitsSold, 0);
    const totalOrders = filteredProducts.reduce((acc, curr) => acc + curr.ordersCount, 0);
    const productRevenue = filteredProducts.reduce((acc, curr) => acc + curr.revenueGenerated, 0);
    const totalDiscount = filteredProducts.reduce((acc, curr) => acc + curr.discount, 0);

    const topProductItem = [...filteredProducts].sort((a, b) => b.revenueGenerated - a.revenueGenerated)[0];
    const topSellingProduct = topProductItem ? topProductItem.productName : 'None';

    return {
      totalProducts,
      activeProducts,
      outOfStock,
      lowStock,
      inStock,
      totalUnitsSold,
      totalOrders,
      productRevenue,
      totalDiscount,
      topSellingProduct,
    };
  }, [filteredProducts]);

  // ── 8 Executive KPI Stat Cards ──
  const kpis: ReportStatData[] = [
    {
      id: 'kpi-prd-1',
      label: 'Total Products',
      value: `${metrics.totalProducts} SKUs`,
      icon: 'fa-solid fa-boxes-stacked',
      color: '#0d9488',
      change: 'Catalog Depth',
      isPositive: true,
      subtext: 'Cataloged dental products',
      badge: 'Catalog',
    },
    {
      id: 'kpi-prd-2',
      label: 'Active Products',
      value: `${metrics.activeProducts} Live`,
      icon: 'fa-solid fa-circle-check',
      color: '#16a34a',
      change: `${((metrics.activeProducts / (metrics.totalProducts || 1)) * 100).toFixed(0)}% Active Ratio`,
      isPositive: true,
      subtext: 'Published on doctor portal',
      badge: 'Live SKUs',
    },
    {
      id: 'kpi-prd-3',
      label: 'Out of Stock',
      value: `${metrics.outOfStock} SKUs`,
      icon: 'fa-solid fa-circle-xmark',
      color: '#ef4444',
      change: metrics.outOfStock === 0 ? 'Optimal Stock' : 'Restock Needed',
      isPositive: metrics.outOfStock === 0,
      subtext: 'Zero available inventory units',
      badge: 'Depleted',
    },
    {
      id: 'kpi-prd-4',
      label: 'Low Stock',
      value: `${metrics.lowStock} Alerts`,
      icon: 'fa-solid fa-triangle-exclamation',
      color: '#f59e0b',
      change: 'Threshold Alerts',
      isPositive: false,
      subtext: 'Inventory under safety buffer',
      badge: 'Reorder Buffer',
    },
    {
      id: 'kpi-prd-5',
      label: 'Total Units Sold',
      value: `${metrics.totalUnitsSold.toLocaleString('en-IN')} Units`,
      icon: 'fa-solid fa-dolly',
      color: '#3b82f6',
      change: '+22.4% Throughput',
      isPositive: true,
      subtext: 'Fulfilled physical quantities',
      badge: 'Volume',
    },
    {
      id: 'kpi-prd-6',
      label: 'Top Selling Product',
      value: metrics.topSellingProduct.length > 20 ? `${metrics.topSellingProduct.substring(0, 20)}...` : metrics.topSellingProduct,
      icon: 'fa-solid fa-crown',
      color: '#ec4899',
      change: 'Revenue Leader',
      isPositive: true,
      subtext: 'Highest generating item',
      badge: 'Leader',
    },
    {
      id: 'kpi-prd-7',
      label: 'Product Revenue',
      value: `₹${metrics.productRevenue.toLocaleString('en-IN')}`,
      icon: 'fa-solid fa-sack-dollar',
      color: '#059669',
      change: '+28.1% MoM',
      isPositive: true,
      subtext: 'Gross catalog sales turnover',
      badge: 'Sales Value',
    },
    {
      id: 'kpi-prd-8',
      label: 'In Stock Products',
      value: `${metrics.inStock} SKUs`,
      icon: 'fa-solid fa-warehouse',
      color: '#0284c7',
      change: `${((metrics.inStock / (metrics.totalProducts || 1)) * 100).toFixed(0)}% Availability`,
      isPositive: true,
      subtext: 'Ready for immediate dispatch',
      badge: 'Available',
    },
  ];

  // ── Distinct Filter Options ──
  const categoriesList = useMemo(() => {
    return Array.from(new Set(productsData.map((p) => p.category))).filter(Boolean);
  }, [productsData]);

  const subcategoriesList = useMemo(() => {
    return Array.from(new Set(productsData.map((p) => p.subcategory))).filter(Boolean);
  }, [productsData]);

  const brandsList = useMemo(() => {
    return Array.from(new Set(productsData.map((p) => p.brand))).filter(Boolean);
  }, [productsData]);

  // ── Pagination Calculation ──
  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredProducts.slice(startIndex, startIndex + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  // ── Highcharts Data: 1. Top Products by Revenue (Horizontal Bar Chart) ──
  const topProductsByRevenueOptions: Highcharts.Options = useMemo(() => {
    const sorted = [...filteredProducts].sort((a, b) => b.revenueGenerated - a.revenueGenerated).slice(0, 6);
    const categories = sorted.map((p) => {
      const name = p.productName;
      return name.length > 20 ? `${name.substring(0, 20)}...` : name;
    });
    const data = sorted.map((p) => ({
      y: p.revenueGenerated,
      units: p.unitsSold,
      sku: p.sku,
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
        title: { text: 'Gross Revenue (₹)', style: { color: '#64748b', fontSize: '12px' } },
        gridLineColor: '#f1f5f9',
        labels: {
          formatter: function (this: any): string {
            return `₹${Number(this.value) / 100000}L`;
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
          const point = self.point || {};
          return `<b>${self.x}</b><br/>SKU: <b>${point.sku}</b><br/>Revenue: <span style="color:#38bdf8;font-weight:700">₹${Number(self.y).toLocaleString('en-IN')}</span><br/>Units Sold: <b>${point.units} Units</b>`;
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          color: '#0d9488',
          dataLabels: {
            enabled: true,
            formatter: function (this: any): string {
              const y: number = this.y || 0;
              return `₹${(y / 100000).toFixed(1)}L`;
            },
            style: { fontWeight: '700', color: '#134e4a', fontSize: '11px' },
          },
        },
      },
      series: [
        {
          type: 'bar',
          name: 'Revenue Generated',
          data: data,
          showInLegend: false,
        },
      ],
    };
  }, [filteredProducts]);

  // ── Highcharts Data: 2. Top Products by Units Sold (Column / Bar Chart) ──
  const topProductsByUnitsOptions: Highcharts.Options = useMemo(() => {
    const sorted = [...filteredProducts].sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 6);
    const categories = sorted.map((p) => {
      const name = p.productName;
      return name.length > 18 ? `${name.substring(0, 18)}...` : name;
    });
    const unitsData = sorted.map((p) => p.unitsSold);

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
          style: { color: '#334155', fontSize: '11px', fontWeight: '600' },
          rotation: -15,
        },
        lineColor: '#e2e8f0',
      },
      yAxis: {
        title: { text: 'Units Sold', style: { color: '#64748b', fontSize: '12px' } },
        gridLineColor: '#f1f5f9',
        labels: { style: { color: '#64748b', fontSize: '11px' } },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        borderRadius: 8,
        style: { color: '#ffffff' },
        formatter: function () {
          const self = this as any;
          return `<b>${self.x}</b><br/>Units Fulfilled: <span style="color:#8b5cf6;font-weight:700">${Number(self.y).toLocaleString('en-IN')} Units</span>`;
        },
      },
      plotOptions: {
        column: {
          borderRadius: 5,
          color: '#8b5cf6',
          dataLabels: {
            enabled: true,
            formatter: function (this: any): string {
              const y: number = this.y || 0;
              return `${y.toLocaleString('en-IN')}`;
            },
            style: { fontWeight: '700', color: '#4c1d95', fontSize: '11px' },
          },
        },
      },
      series: [
        {
          type: 'column',
          name: 'Units Sold',
          data: unitsData,
          showInLegend: false,
        },
      ],
    };
  }, [filteredProducts]);

  // ── Highcharts Data: 3. Product Sales Trend (Line / Area Spline) ──
  const productSalesTrendOptions: Highcharts.Options = useMemo(() => {
    const dateMap = new Map<string, number>();

    filteredProducts.forEach((item) => {
      const d = item.rawDate;
      dateMap.set(d, (dateMap.get(d) || 0) + item.revenueGenerated);
    });

    const sortedDates = Array.from(dateMap.keys()).sort();
    const trendData = sortedDates.map((d) => dateMap.get(d) || 0);

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
        title: { text: 'Sales Turnover (₹)', style: { color: '#64748b', fontSize: '12px' } },
        gridLineColor: '#f1f5f9',
        labels: {
          formatter: function (this: any): string {
            return `₹${Number(this.value) / 100000}L`;
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
          return `<b>${self.x}</b><br/>Product Sales: <b>₹${Number(self.y).toLocaleString('en-IN')}</b>`;
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
          name: 'Product Revenue',
          data: trendData,
        },
      ],
    };
  }, [filteredProducts]);

  // ── Highcharts Data: 4. Product Stock Status (Donut Chart) ──
  const stockStatusDonutOptions: Highcharts.Options = useMemo(() => {
    const inStock = filteredProducts.filter((p) => p.stockStatus === 'In Stock').length;
    const lowStock = filteredProducts.filter((p) => p.stockStatus === 'Low Stock').length;
    const outOfStock = filteredProducts.filter((p) => p.stockStatus === 'Out of Stock').length;

    const data = [
      { name: 'In Stock', y: inStock, color: '#16a34a' },
      { name: 'Low Stock', y: lowStock, color: '#f59e0b' },
      { name: 'Out of Stock', y: outOfStock, color: '#ef4444' },
    ];

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
        formatter: function () {
          const self = this as any;
          const point = self.point || {};
          return `<b>${point.name}</b><br/>SKUs: <b>${self.y} Products</b><br/>Share: <b>${point.percentage?.toFixed(1)}%</b>`;
        },
      },
      plotOptions: {
        pie: {
          innerSize: '62%',
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.y} ({point.percentage:.1f}%)',
            style: { color: '#334155', fontSize: '11px', fontWeight: '600' },
          },
        },
      },
      series: [
        {
          type: 'pie',
          name: 'Stock Status',
          data: data,
        },
      ],
    };
  }, [filteredProducts]);

  // ── CSV Export ──
  const handleExportCSV = () => {
    exportTableToCSV({
      filename: `buybright_product_report_${Date.now()}`,
      headers: [
        'Product Name',
        'SKU',
        'Category',
        'Brand',
        'Units Sold',
        'Orders Count',
        'Gross Revenue (₹)',
        'Discount (₹)',
        'Stock Level',
        'Stock Status',
        'Rating',
      ],
      rows: filteredProducts.map((p) => [
        p.productName,
        p.sku,
        p.category,
        p.brand,
        p.unitsSold,
        p.ordersCount,
        p.revenueGenerated,
        p.discount,
        p.currentStock,
        p.stockStatus,
        p.rating,
      ]),
    });
    showToast('Product Report exported as CSV successfully', 'success');
  };

  // ── PDF Export ──
  const handleExportPDF = () => {
    exportTableToPDF({
      title: 'BuyBright — Product Catalog Velocity & Inventory Report',
      subtitle: `Product SKUs, units fulfilled, revenue yield, and stock metrics (${startDate} to ${endDate})`,
      headers: [
        'Product',
        'SKU',
        'Category',
        'Brand',
        'Units Sold',
        'Orders',
        'Revenue',
        'Stock',
        'Rating',
      ],
      rows: filteredProducts.map((p) => [
        p.productName,
        p.sku,
        p.category,
        p.brand,
        p.unitsSold,
        p.ordersCount,
        `₹${p.revenueGenerated.toLocaleString('en-IN')}`,
        `${p.currentStock} (${p.stockStatus})`,
        `★ ${p.rating}`,
      ]),
    });
    showToast('Product Report exported as PDF successfully', 'success');
  };

  return (
    <AdminLayout
      title="Product Catalog & Inventory Report"
      subtitle="Track dental SKU turnover, units dispatched, revenue contributions, and stock alert levels"
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
                placeholder="Product name or SKU..."
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value);
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
                setSubcategoryFilter('All');
                setCurrentPage(1);
              }}
              className="table-filter-select"
              style={{ width: '100%', fontSize: '0.82rem', padding: '7px 10px' }}
            >
              <option value="All">All Categories</option>
              {categoriesList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
              Subcategory
            </label>
            <select
              value={subcategoryFilter}
              onChange={(e) => {
                setSubcategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="table-filter-select"
              style={{ width: '100%', fontSize: '0.82rem', padding: '7px 10px' }}
            >
              <option value="All">All Subcategories</option>
              {subcategoriesList.map((sc) => (
                <option key={sc} value={sc}>
                  {sc}
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

          {/* Stock Status Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
              Stock Status
            </label>
            <select
              value={stockStatusFilter}
              onChange={(e) => {
                setStockStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="table-filter-select"
              style={{ width: '100%', fontSize: '0.82rem', padding: '7px 10px' }}
            >
              <option value="All">All Statuses</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── 4 Interactive Highcharts Graphs (2x2 Grid) ── */}
      <div className="reports-charts-grid">
        {/* Graph 1: Top Products by Revenue */}
        <div className="report-chart-card">
          <div className="report-chart-header">
            <div className="report-chart-title-wrap">
              <h3 className="report-chart-title">
                <i className="fa-solid fa-ranking-star" style={{ color: '#0d9488' }} />
                1. Top Products by Revenue
              </h3>
              <p className="report-chart-desc">
                Top generating SKUs ranked by gross sales turnover
              </p>
            </div>
            <span className="report-chart-badge">Horizontal Bar</span>
          </div>
          <div className="report-chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={topProductsByRevenueOptions} />
          </div>
        </div>

        {/* Graph 2: Top Products by Units Sold */}
        <div className="report-chart-card">
          <div className="report-chart-header">
            <div className="report-chart-title-wrap">
              <h3 className="report-chart-title">
                <i className="fa-solid fa-boxes-packing" style={{ color: '#8b5cf6' }} />
                2. Top Products by Units Sold
              </h3>
              <p className="report-chart-desc">
                Highest volume velocity dental consumables and instruments
              </p>
            </div>
            <span className="report-chart-badge" style={{ color: '#8b5cf6', background: '#f5f3ff', borderColor: '#ede9fe' }}>
              Column Chart
            </span>
          </div>
          <div className="report-chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={topProductsByUnitsOptions} />
          </div>
        </div>

        {/* Graph 3: Product Sales Trend */}
        <div className="report-chart-card">
          <div className="report-chart-header">
            <div className="report-chart-title-wrap">
              <h3 className="report-chart-title">
                <i className="fa-solid fa-chart-line" style={{ color: '#3b82f6' }} />
                3. Product Sales Trend
              </h3>
              <p className="report-chart-desc">
                Catalog daily purchasing momentum trajectory
              </p>
            </div>
            <span className="report-chart-badge" style={{ color: '#3b82f6', background: '#eff6ff', borderColor: '#dbeafe' }}>
              Line / Area Spline
            </span>
          </div>
          <div className="report-chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={productSalesTrendOptions} />
          </div>
        </div>

        {/* Graph 4: Product Stock Status */}
        <div className="report-chart-card">
          <div className="report-chart-header">
            <div className="report-chart-title-wrap">
              <h3 className="report-chart-title">
                <i className="fa-solid fa-chart-pie" style={{ color: '#16a34a' }} />
                4. Product Stock Status
              </h3>
              <p className="report-chart-desc">
                Inventory health breakdown across in-stock, low buffer, and depleted SKUs
              </p>
            </div>
            <span className="report-chart-badge" style={{ color: '#16a34a', background: '#f0fdf4', borderColor: '#bbf7d0' }}>
              Donut Chart
            </span>
          </div>
          <div className="report-chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={stockStatusDonutOptions} />
          </div>
        </div>
      </div>

      {/* ── Paginated Product Performance Table ── */}
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
              Product SKU Velocity &amp; Inventory Register
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
                <th style={{ minWidth: '110px' }}>SKU</th>
                <th style={{ minWidth: '130px' }}>Category</th>
                <th style={{ minWidth: '110px' }}>Brand</th>
                <th style={{ textAlign: 'center', minWidth: '90px' }}>Units Sold</th>
                <th style={{ textAlign: 'center', minWidth: '85px' }}>Orders</th>
                <th style={{ textAlign: 'right', minWidth: '110px' }}>Revenue</th>
                <th style={{ textAlign: 'right', minWidth: '100px' }}>Discount</th>
                <th style={{ textAlign: 'center', minWidth: '110px' }}>Stock</th>
                <th style={{ textAlign: 'center', minWidth: '90px' }}>Rating</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
                    <i
                      className="fa-solid fa-boxes-stacked"
                      style={{ fontSize: '2.2rem', marginBottom: '10px', display: 'block', color: '#cbd5e1' }}
                    />
                    <div style={{ fontWeight: 600, fontSize: '0.94rem', color: '#334155' }}>
                      No products match your filters
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
                      Try adjusting your search query, date range, or category filter.
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => {
                  let stockColor = '#16a34a';
                  let stockBg = '#f0fdf4';
                  if (p.stockStatus === 'Low Stock') {
                    stockColor = '#d97706';
                    stockBg = '#fffbeb';
                  } else if (p.stockStatus === 'Out of Stock') {
                    stockColor = '#dc2626';
                    stockBg = '#fef2f2';
                  }

                  return (
                    <tr key={p.id}>
                      {/* Product Name */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.86rem', lineHeight: 1.35 }}>
                            {p.productName}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            Subcategory: <strong>{p.subcategory}</strong>
                          </span>
                        </div>
                      </td>

                      {/* SKU */}
                      <td>
                        <span
                          style={{
                            fontSize: '0.76rem',
                            fontWeight: 800,
                            color: '#0d9488',
                            letterSpacing: '0.5px',
                            background: '#f0fdfa',
                            padding: '2px 7px',
                            borderRadius: '4px',
                            border: '1px solid #ccfbf1',
                            fontFamily: 'monospace',
                          }}
                        >
                          {p.sku}
                        </span>
                      </td>

                      {/* Category */}
                      <td>
                        <span className="admin-badge badge-neutral" style={{ fontSize: '0.74rem', fontWeight: 600 }}>
                          {p.category}
                        </span>
                      </td>

                      {/* Brand */}
                      <td>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                          {p.brand}
                        </span>
                      </td>

                      {/* Units Sold */}
                      <td style={{ textAlign: 'center' }}>
                        <span
                          style={{
                            fontWeight: 700,
                            color: '#8b5cf6',
                            background: '#f5f3ff',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontSize: '0.82rem',
                          }}
                        >
                          {p.unitsSold.toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Orders Count */}
                      <td style={{ textAlign: 'center' }}>
                        <strong style={{ color: '#0f172a', fontSize: '0.84rem' }}>
                          {p.ordersCount}
                        </strong>
                      </td>

                      {/* Revenue */}
                      <td style={{ textAlign: 'right' }}>
                        <strong style={{ color: '#0f766e', fontSize: '0.92rem' }}>
                          ₹{p.revenueGenerated.toLocaleString('en-IN')}
                        </strong>
                      </td>

                      {/* Discount */}
                      <td style={{ textAlign: 'right' }}>
                        <span style={{ color: '#ec4899', fontSize: '0.84rem', fontWeight: 600 }}>
                          ₹{p.discount.toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Stock Level & Status */}
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span
                            style={{
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              color: stockColor,
                              background: stockBg,
                              padding: '2px 8px',
                              borderRadius: '6px',
                            }}
                          >
                            {p.currentStock} units
                          </span>
                          <span style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                            {p.stockStatus}
                          </span>
                        </div>
                      </td>

                      {/* Rating */}
                      <td style={{ textAlign: 'center' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            fontWeight: 700,
                            color: '#d97706',
                            background: '#fffbeb',
                            padding: '2px 7px',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                          }}
                        >
                          <i className="fa-solid fa-star" style={{ fontSize: '0.7rem' }} />
                          {p.rating}
                        </span>
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
                  <td colSpan={4} style={{ color: '#0f172a', fontSize: '0.88rem' }}>
                    <i className="fa-solid fa-calculator" style={{ color: '#0d9488', marginRight: '6px' }} />
                    Total Summary ({filteredProducts.length} SKUs)
                  </td>
                  <td style={{ textAlign: 'center', color: '#8b5cf6', fontSize: '0.88rem' }}>
                    {metrics.totalUnitsSold.toLocaleString('en-IN')}
                  </td>
                  <td style={{ textAlign: 'center', color: '#0f172a', fontSize: '0.88rem' }}>
                    {metrics.totalOrders}
                  </td>
                  <td style={{ textAlign: 'right', color: '#0f766e', fontSize: '0.94rem' }}>
                    ₹{metrics.productRevenue.toLocaleString('en-IN')}
                  </td>
                  <td style={{ textAlign: 'right', color: '#ec4899', fontSize: '0.88rem' }}>
                    ₹{metrics.totalDiscount.toLocaleString('en-IN')}
                  </td>
                  <td colSpan={2} style={{ textAlign: 'center', color: '#16a34a', fontSize: '0.82rem' }}>
                    {metrics.inStock} In Stock • {metrics.lowStock} Low • {metrics.outOfStock} Out
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

export default ProductReportPage;
