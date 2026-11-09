/**
 * BuyBright Admin — Category Report Page.
 * Purpose: Understand department revenue share, volume throughput, discount margins, and growth trajectory.
 *
 * Features:
 *   - 8 Executive KPI Stat Cards (Total Categories, Active Categories, Products, Units Sold, Total Orders, Category Revenue, Average Order Value, Top Category)
 *   - Comprehensive Multi-Dimensional Filters (Quick Dates, Custom Range, Category, Subcategory, Search, Reset)
 *   - 4 Highcharts Data Visualizations:
 *       1. Revenue by Category (Bar / Column Chart)
 *       2. Units Sold by Category (Bar / Column Chart)
 *       3. Category Sales Trend (Line / Area Spline Chart)
 *       4. Category Contribution (Donut Chart)
 *   - Paginated Category Performance Table with Summary Totals Footer
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
import { initialCategoryReport, CategoryReportItem } from '../../data/reportsData';

type QuickDateOption = 'Today' | '7 Days' | '30 Days' | 'This Month' | 'Last Month' | 'Custom';

export const CategoryReportPage: React.FC = () => {
  const { showToast } = useToast();
  const [categoriesData] = useState<CategoryReportItem[]>(initialCategoryReport);

  // ── Filter States ──
  const [quickDate, setQuickDate] = useState<QuickDateOption>('30 Days');
  const [startDate, setStartDate] = useState<string>('2026-09-25');
  const [endDate, setEndDate] = useState<string>('2026-10-06');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [subcategoryFilter, setSubcategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

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
    setSearchQuery('');
    setCurrentPage(1);
    showToast('Category filters reset to default', 'info');
  };

  // ── Filtered Categories Computation ──
  const filteredCategories = useMemo(() => {
    return categoriesData.filter((item) => {
      if (startDate && item.rawDate < startDate) return false;
      if (endDate && item.rawDate > endDate) return false;
      if (
        searchQuery &&
        !item.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.subcategories.some((sc) => sc.toLowerCase().includes(searchQuery.toLowerCase()))
      ) {
        return false;
      }
      if (categoryFilter !== 'All' && item.categoryName !== categoryFilter) return false;
      if (subcategoryFilter !== 'All' && !item.subcategories.includes(subcategoryFilter)) return false;
      return true;
    });
  }, [categoriesData, startDate, endDate, searchQuery, categoryFilter, subcategoryFilter]);

  // ── Aggregated KPI Metrics ──
  const metrics = useMemo(() => {
    const totalCategories = filteredCategories.length;
    const activeCategories = filteredCategories.filter((c) => c.isActive).length;
    const totalProducts = filteredCategories.reduce((acc, curr) => acc + curr.productsCount, 0);
    const totalUnitsSold = filteredCategories.reduce((acc, curr) => acc + curr.unitsSold, 0);
    const totalOrders = filteredCategories.reduce((acc, curr) => acc + curr.ordersCount, 0);
    const categoryRevenue = filteredCategories.reduce((acc, curr) => acc + curr.netSales, 0);
    const totalGross = filteredCategories.reduce((acc, curr) => acc + curr.grossSales, 0);
    const totalDiscount = filteredCategories.reduce((acc, curr) => acc + curr.discount, 0);
    const averageAOV = totalOrders > 0 ? categoryRevenue / totalOrders : 0;

    const topCategoryItem = [...filteredCategories].sort((a, b) => b.netSales - a.netSales)[0];
    const topCategory = topCategoryItem ? topCategoryItem.categoryName : 'None';

    return {
      totalCategories,
      activeCategories,
      totalProducts,
      totalUnitsSold,
      totalOrders,
      categoryRevenue,
      totalGross,
      totalDiscount,
      averageAOV,
      topCategory,
    };
  }, [filteredCategories]);

  // ── 8 Executive KPI Stat Cards ──
  const kpis: ReportStatData[] = [
    {
      id: 'kpi-cat-1',
      label: 'Total Categories',
      value: `${metrics.totalCategories} Categories`,
      icon: 'fa-solid fa-folder-tree',
      color: '#0d9488',
      change: 'Active Hierarchy',
      isPositive: true,
      subtext: 'Catalog classifications',
      badge: 'Hierarchy',
    },
    {
      id: 'kpi-cat-2',
      label: 'Active Categories',
      value: `${metrics.activeCategories} Live`,
      icon: 'fa-solid fa-circle-check',
      color: '#16a34a',
      change: '100% In Stock',
      isPositive: true,
      subtext: 'Departments with active stock',
      badge: 'Live Depts',
    },
    {
      id: 'kpi-cat-3',
      label: 'Products',
      value: `${metrics.totalProducts} SKUs`,
      icon: 'fa-solid fa-boxes-stacked',
      color: '#3b82f6',
      change: '+18.5% Depth',
      isPositive: true,
      subtext: 'Cataloged dental products',
      badge: 'Catalog Depth',
    },
    {
      id: 'kpi-cat-4',
      label: 'Units Sold',
      value: `${metrics.totalUnitsSold.toLocaleString('en-IN')} Units`,
      icon: 'fa-solid fa-dolly',
      color: '#8b5cf6',
      change: '+21.4% Throughput',
      isPositive: true,
      subtext: 'Dispatched product volume',
      badge: 'Volume',
    },
    {
      id: 'kpi-cat-5',
      label: 'Total Orders',
      value: `${metrics.totalOrders.toLocaleString('en-IN')} Orders`,
      icon: 'fa-solid fa-clipboard-list',
      color: '#0284c7',
      change: 'Multi-category Baskets',
      isPositive: true,
      subtext: 'Orders containing department items',
      badge: 'Orders',
    },
    {
      id: 'kpi-cat-6',
      label: 'Category Revenue',
      value: `₹${metrics.categoryRevenue.toLocaleString('en-IN')}`,
      icon: 'fa-solid fa-sack-dollar',
      color: '#059669',
      change: '+24.6% MoM',
      isPositive: true,
      subtext: 'Net realized category sales',
      badge: 'Net Revenue',
    },
    {
      id: 'kpi-cat-7',
      label: 'Average Order Value',
      value: `₹${Math.round(metrics.averageAOV).toLocaleString('en-IN')}`,
      icon: 'fa-solid fa-chart-pie',
      color: '#f59e0b',
      change: 'Per Department Order',
      isPositive: true,
      subtext: 'Mean basket spend',
      badge: 'AOV Index',
    },
    {
      id: 'kpi-cat-8',
      label: 'Top Category',
      value: metrics.topCategory.length > 18 ? `${metrics.topCategory.substring(0, 18)}...` : metrics.topCategory,
      icon: 'fa-solid fa-crown',
      color: '#ec4899',
      change: 'Revenue Leader',
      isPositive: true,
      subtext: 'Highest sales contribution',
      badge: 'Leader',
    },
  ];

  // ── Subcategories List Computation ──
  const allSubcategories = useMemo(() => {
    const list: string[] = [];
    categoriesData.forEach((c) => {
      c.subcategories.forEach((sc) => {
        if (!list.includes(sc)) list.push(sc);
      });
    });
    return list;
  }, [categoriesData]);

  // ── Pagination Calculation ──
  const totalPages = Math.ceil(filteredCategories.length / pageSize) || 1;
  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredCategories.slice(startIndex, startIndex + pageSize);
  }, [filteredCategories, currentPage, pageSize]);

  // ── Highcharts Data: 1. Revenue by Category (Bar / Column Chart) ──
  const revenueByCategoryOptions: Highcharts.Options = useMemo(() => {
    const sorted = [...filteredCategories].sort((a, b) => b.netSales - a.netSales);
    const categories = sorted.map((c) => c.categoryName);
    const grossData = sorted.map((c) => c.grossSales);
    const netData = sorted.map((c) => c.netSales);

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
        title: { text: 'Sales Revenue (₹)', style: { color: '#64748b', fontSize: '12px' } },
        gridLineColor: '#f1f5f9',
        labels: {
          formatter: function (this: any): string {
            return `₹${Number(this.value) / 100000}L`;
          },
          style: { color: '#64748b', fontSize: '11px' },
        },
      },
      tooltip: {
        shared: true,
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        borderRadius: 8,
        style: { color: '#ffffff' },
        formatter: function () {
          const self = this as any;
          const points = self.points || [];
          let res = `<span style="font-size:12px;font-weight:700;color:#38bdf8">${self.x}</span><br/>`;
          points.forEach((p: any) => {
            res += `<span style="color:${p.color}">●</span> ${p.series.name}: <b>₹${Number(p.y).toLocaleString('en-IN')}</b><br/>`;
          });
          return res;
        },
      },
      plotOptions: {
        column: {
          borderRadius: 5,
        },
      },
      series: [
        {
          type: 'column',
          name: 'Gross Sales',
          data: grossData,
          color: '#38bdf8',
        },
        {
          type: 'column',
          name: 'Net Sales',
          data: netData,
          color: '#0d9488',
        },
      ],
    };
  }, [filteredCategories]);

  // ── Highcharts Data: 2. Units Sold by Category (Bar / Column Chart) ──
  const unitsSoldByCategoryOptions: Highcharts.Options = useMemo(() => {
    const sorted = [...filteredCategories].sort((a, b) => b.unitsSold - a.unitsSold);
    const categories = sorted.map((c) => c.categoryName);
    const unitsData = sorted.map((c) => c.unitsSold);

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
        title: { text: 'Units Dispatched', style: { color: '#64748b', fontSize: '12px' } },
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
          borderRadius: 6,
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
  }, [filteredCategories]);

  // ── Highcharts Data: 3. Category Sales Trend (Line / Area Spline) ──
  const categorySalesTrendOptions: Highcharts.Options = useMemo(() => {
    const dateMap = new Map<string, number>();

    filteredCategories.forEach((item) => {
      const d = item.rawDate;
      dateMap.set(d, (dateMap.get(d) || 0) + item.netSales);
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
        title: { text: 'Net Revenue (₹)', style: { color: '#64748b', fontSize: '12px' } },
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
          return `<b>${self.x}</b><br/>Net Department Sales: <b>₹${Number(self.y).toLocaleString('en-IN')}</b>`;
        },
      },
      plotOptions: {
        areaspline: {
          fillOpacity: 0.15,
          color: '#10b981',
          lineWidth: 3,
          marker: { radius: 4, symbol: 'circle' },
        },
      },
      series: [
        {
          type: 'areaspline',
          name: 'Net Category Sales',
          data: trendData,
        },
      ],
    };
  }, [filteredCategories]);

  // ── Highcharts Data: 4. Category Contribution (Donut Chart) ──
  const categoryContributionOptions: Highcharts.Options = useMemo(() => {
    const palette = ['#0d9488', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#10b981', '#6366f1', '#14b8a6'];
    const data = filteredCategories.map((c, idx) => ({
      name: c.categoryName,
      y: c.netSales,
      color: palette[idx % palette.length],
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
        formatter: function () {
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
          data: data.length > 0 ? data : [{ name: 'No Data', y: 1, color: '#e2e8f0' }],
        },
      ],
    };
  }, [filteredCategories]);

  // ── CSV Export ──
  const handleExportCSV = () => {
    exportTableToCSV({
      filename: `buybright_category_report_${Date.now()}`,
      headers: [
        'Category Name',
        'Products Count',
        'Orders Count',
        'Units Sold',
        'Gross Sales (₹)',
        'Discount (₹)',
        'Net Sales (₹)',
        'Contribution (%)',
      ],
      rows: filteredCategories.map((c) => [
        c.categoryName,
        c.productsCount,
        c.ordersCount,
        c.unitsSold,
        c.grossSales,
        c.discount,
        c.netSales,
        `${c.contributionPercent}%`,
      ]),
    });
    showToast('Category Report exported as CSV successfully', 'success');
  };

  // ── PDF Export ──
  const handleExportPDF = () => {
    exportTableToPDF({
      title: 'BuyBright — Dental Specialty Category Report',
      subtitle: `Department sales volume, gross invoices, and revenue contribution (${startDate} to ${endDate})`,
      headers: [
        'Category',
        'Products',
        'Orders',
        'Units Sold',
        'Gross Sales',
        'Discount',
        'Net Sales',
        '% Share',
      ],
      rows: filteredCategories.map((c) => [
        c.categoryName,
        c.productsCount,
        c.ordersCount,
        c.unitsSold,
        `₹${c.grossSales.toLocaleString('en-IN')}`,
        `₹${c.discount.toLocaleString('en-IN')}`,
        `₹${c.netSales.toLocaleString('en-IN')}`,
        `${c.contributionPercent}%`,
      ]),
    });
    showToast('Category Report exported as PDF successfully', 'success');
  };

  return (
    <AdminLayout
      title="Category & Department Performance Report"
      subtitle="Track specialty sales contribution, catalog depth, units throughput, and discount subsidies"
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

          {/* Search Query */}
          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
              Search Category / Specialty
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
                placeholder="Category or subcategory..."
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
              {categoriesData.map((c) => (
                <option key={c.id} value={c.categoryName}>
                  {c.categoryName}
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
              {allSubcategories.map((sc) => (
                <option key={sc} value={sc}>
                  {sc}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── 4 Interactive Highcharts Graphs (2x2 Grid) ── */}
      <div className="reports-charts-grid">
        {/* Graph 1: Revenue by Category */}
        <div className="report-chart-card">
          <div className="report-chart-header">
            <div className="report-chart-title-wrap">
              <h3 className="report-chart-title">
                <i className="fa-solid fa-chart-column" style={{ color: '#0d9488' }} />
                1. Revenue by Category
              </h3>
              <p className="report-chart-desc">
                Gross sales vs. net realized department revenue
              </p>
            </div>
            <span className="report-chart-badge">Column Chart</span>
          </div>
          <div className="report-chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={revenueByCategoryOptions} />
          </div>
        </div>

        {/* Graph 2: Units Sold by Category */}
        <div className="report-chart-card">
          <div className="report-chart-header">
            <div className="report-chart-title-wrap">
              <h3 className="report-chart-title">
                <i className="fa-solid fa-boxes-packing" style={{ color: '#8b5cf6' }} />
                2. Units Sold by Category
              </h3>
              <p className="report-chart-desc">
                Total fulfilled volume throughput by dental department
              </p>
            </div>
            <span className="report-chart-badge" style={{ color: '#8b5cf6', background: '#f5f3ff', borderColor: '#ede9fe' }}>
              Bar / Column
            </span>
          </div>
          <div className="report-chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={unitsSoldByCategoryOptions} />
          </div>
        </div>

        {/* Graph 3: Category Sales Trend */}
        <div className="report-chart-card">
          <div className="report-chart-header">
            <div className="report-chart-title-wrap">
              <h3 className="report-chart-title">
                <i className="fa-solid fa-chart-line" style={{ color: '#10b981' }} />
                3. Category Sales Trend
              </h3>
              <p className="report-chart-desc">
                Daily category revenue progression trajectory
              </p>
            </div>
            <span className="report-chart-badge" style={{ color: '#10b981', background: '#ecfdf5', borderColor: '#a7f3d0' }}>
              Line / Area Spline
            </span>
          </div>
          <div className="report-chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={categorySalesTrendOptions} />
          </div>
        </div>

        {/* Graph 4: Category Contribution */}
        <div className="report-chart-card">
          <div className="report-chart-header">
            <div className="report-chart-title-wrap">
              <h3 className="report-chart-title">
                <i className="fa-solid fa-chart-pie" style={{ color: '#f59e0b' }} />
                4. Category Contribution
              </h3>
              <p className="report-chart-desc">
                Percentage share of total gross platform billing
              </p>
            </div>
            <span className="report-chart-badge" style={{ color: '#f59e0b', background: '#fffbeb', borderColor: '#fef3c7' }}>
              Donut Chart
            </span>
          </div>
          <div className="report-chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={categoryContributionOptions} />
          </div>
        </div>
      </div>

      {/* ── Paginated Category Performance Table ── */}
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
              Category &amp; Department Performance Register
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
              {filteredCategories.length} Categories
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
                <th style={{ minWidth: '220px' }}>Category</th>
                <th style={{ textAlign: 'center', minWidth: '90px' }}>Products</th>
                <th style={{ textAlign: 'center', minWidth: '90px' }}>Orders</th>
                <th style={{ textAlign: 'center', minWidth: '100px' }}>Units Sold</th>
                <th style={{ textAlign: 'right', minWidth: '120px' }}>Gross Sales</th>
                <th style={{ textAlign: 'right', minWidth: '110px' }}>Discount</th>
                <th style={{ textAlign: 'right', minWidth: '120px' }}>Net Sales</th>
                <th style={{ textAlign: 'center', minWidth: '80px' }}>%</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCategories.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
                    <i
                      className="fa-solid fa-folder-open"
                      style={{ fontSize: '2.2rem', marginBottom: '10px', display: 'block', color: '#cbd5e1' }}
                    />
                    <div style={{ fontWeight: 600, fontSize: '0.94rem', color: '#334155' }}>
                      No dental categories match your filters
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
                      Try adjusting your search query, date range, or subcategory filter.
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedCategories.map((c) => {
                  return (
                    <tr key={c.id}>
                      {/* Category Name & Subcategories */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>
                            {c.categoryName}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {c.subcategories.slice(0, 2).join(', ')}
                            {c.subcategories.length > 2 ? ` +${c.subcategories.length - 2} more` : ''}
                          </span>
                        </div>
                      </td>

                      {/* Products */}
                      <td style={{ textAlign: 'center' }}>
                        <span
                          style={{
                            fontWeight: 700,
                            color: '#0284c7',
                            background: '#f0f9ff',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontSize: '0.82rem',
                          }}
                        >
                          {c.productsCount}
                        </span>
                      </td>

                      {/* Orders */}
                      <td style={{ textAlign: 'center' }}>
                        <span
                          style={{
                            fontWeight: 700,
                            color: '#334155',
                            fontSize: '0.84rem',
                          }}
                        >
                          {c.ordersCount}
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
                          {c.unitsSold.toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Gross Sales */}
                      <td style={{ textAlign: 'right' }}>
                        <span style={{ color: '#64748b', fontSize: '0.86rem', fontWeight: 600 }}>
                          ₹{c.grossSales.toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Discount */}
                      <td style={{ textAlign: 'right' }}>
                        <span style={{ color: '#ec4899', fontSize: '0.86rem', fontWeight: 600 }}>
                          ₹{c.discount.toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Net Sales */}
                      <td style={{ textAlign: 'right' }}>
                        <strong style={{ color: '#0f766e', fontSize: '0.92rem' }}>
                          ₹{c.netSales.toLocaleString('en-IN')}
                        </strong>
                      </td>

                      {/* % Contribution */}
                      <td style={{ textAlign: 'center' }}>
                        <span
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            color: '#0d9488',
                            background: '#f0fdfa',
                            padding: '2px 7px',
                            borderRadius: '6px',
                            border: '1px solid #ccfbf1',
                          }}
                        >
                          {c.contributionPercent}%
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* Totals Summary Footer */}
            {filteredCategories.length > 0 && (
              <tfoot>
                <tr style={{ background: '#f8fafc', fontWeight: 700, borderTop: '2px solid #e2e8f0' }}>
                  <td style={{ color: '#0f172a', fontSize: '0.88rem' }}>
                    <i className="fa-solid fa-calculator" style={{ color: '#0d9488', marginRight: '6px' }} />
                    Total Summary ({filteredCategories.length} Categories)
                  </td>
                  <td style={{ textAlign: 'center', color: '#0284c7', fontSize: '0.88rem' }}>
                    {metrics.totalProducts}
                  </td>
                  <td style={{ textAlign: 'center', color: '#334155', fontSize: '0.88rem' }}>
                    {metrics.totalOrders}
                  </td>
                  <td style={{ textAlign: 'center', color: '#8b5cf6', fontSize: '0.88rem' }}>
                    {metrics.totalUnitsSold.toLocaleString('en-IN')}
                  </td>
                  <td style={{ textAlign: 'right', color: '#64748b', fontSize: '0.88rem' }}>
                    ₹{metrics.totalGross.toLocaleString('en-IN')}
                  </td>
                  <td style={{ textAlign: 'right', color: '#ec4899', fontSize: '0.88rem' }}>
                    ₹{metrics.totalDiscount.toLocaleString('en-IN')}
                  </td>
                  <td style={{ textAlign: 'right', color: '#0f766e', fontSize: '0.94rem' }}>
                    ₹{metrics.categoryRevenue.toLocaleString('en-IN')}
                  </td>
                  <td style={{ textAlign: 'center', color: '#0d9488', fontSize: '0.84rem' }}>
                    100%
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
          totalItems={filteredCategories.length}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </AdminLayout>
  );
};

export default CategoryReportPage;
