/**
 * BuyBright Admin Dashboard Page.
 * Executive overview with custom KPI cards (Total Sales, Total Order, Total Products, Total Customers),
 * Revenue Report 12-month bar chart with year dropdown,
 * and Right-side Earning & Order Fulfillment graph (Delivered, Processing, Return).
 */

import React, { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { StatCard } from '../../components/StatCard';
import {
  timeframeStats,
  yearlyRevenueData,
  revenueEarningData,
  type DashboardTimeframe,
} from '../../data/dashboardData';

export const Dashboard: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<'2026' | '2025' | '2024'>('2026');
  const [activeMonthHover, setActiveMonthHover] = useState<string | null>('Sep');
  const [activeTimeframe, setActiveTimeframe] = useState<DashboardTimeframe>('30days');

  const currentYearData = yearlyRevenueData[selectedYear] || yearlyRevenueData['2026'];
  const { thisMonth, growthPercent, growthNote, peakMonth, monthlyTrends } = currentYearData;
  const { orderFulfillment } = revenueEarningData;

  // Active metrics based on selected timeframe chip
  const activeStats = timeframeStats[activeTimeframe] || timeframeStats['30days'];

  const timeframeChips: { id: DashboardTimeframe; label: string; icon: string }[] = [
    { id: '30days', label: '30 Days', icon: 'fa-solid fa-clock-rotate-left' },
    { id: '1month', label: '1 Month', icon: 'fa-regular fa-calendar-days' },
    { id: '3month', label: '3 Months', icon: 'fa-solid fa-chart-simple' },
  ];

  // Calculate annual total and monthly average
  const annualTotal = monthlyTrends.reduce((acc, curr) => acc + curr.amount, 0);
  const monthlyAverage = Math.round(annualTotal / monthlyTrends.length);

  return (
    <AdminLayout title="Dashboard">
      {/* 0. Timeframe Chip Filter View (30 Days / 1 Month / 3 Months) */}
      <div className="dashboard-timeframe-header-bar">
        <div className="timeframe-title-group">
          <div className="timeframe-icon-badge">
            <i className="fa-solid fa-sliders" />
          </div>
          <div>
            <h2 className="timeframe-bar-title">Performance Overview</h2>
            <span className="timeframe-bar-subtitle">
              Filter clinical order statistics, customer activity, and gross volume
            </span>
          </div>
        </div>

        <div className="dashboard-chip-filter-group" role="tablist" aria-label="Timeframe Filters">
          {timeframeChips.map((chip) => {
            const isActive = activeTimeframe === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`dashboard-filter-chip ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTimeframe(chip.id)}
              >
                <i className={chip.icon} />
                <span className="chip-label">{chip.label}</span>
                {isActive && <span className="chip-active-dot" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. KPI Metric Cards (Total Sales, Total Order, Total Products, Total Customers) */}
      <div className="admin-stats-grid">
        {activeStats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      {/* 2. Main Analytics Grid: Left = Revenue Report (12 Months), Right = Earning & Fulfillment */}
      <div className="dashboard-analytics-grid">
        {/* Left Column: Revenue Report (12 Months Bar Graph with Year Dropdown) */}
        <div className="admin-card revenue-report-card">
          <div className="card-toolbar">
            <div>
              <span className="toolbar-title">
                <i className="fa-solid fa-chart-line" style={{ color: '#0d9488' }} />
                Revenue Report
              </span>
              <span className="toolbar-subtitle">12-Month platform sales trends &amp; annual cashflow</span>
            </div>

            {/* Yearly Filter Dropdown */}
            <div className="year-selector-wrapper">
              <label htmlFor="dashboard-year-select" className="year-select-label">
                <i className="fa-solid fa-calendar-days" />
                <span>Fiscal Year:</span>
              </label>
              <select
                id="dashboard-year-select"
                className="year-dropdown-select"
                value={selectedYear}
                onChange={(e) => {
                  const yr = e.target.value as '2026' | '2025' | '2024';
                  setSelectedYear(yr);
                  setActiveMonthHover(yr === '2026' ? 'Sep' : 'Dec');
                }}
              >
                <option value="2026">Year 2026 (Current)</option>
                <option value="2025">Year 2025</option>
                <option value="2024">Year 2024</option>
              </select>
            </div>
          </div>

          <div className="revenue-content-body full-chart-focus">
            {/* Annual Summary Metrics Strip */}
            <div className="revenue-summary-strip">
              <div className="strip-item">
                <span className="strip-label">Total Annual Revenue</span>
                <strong className="strip-value">Rs. {annualTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</strong>
              </div>
              <div className="strip-divider" />
              <div className="strip-item">
                <span className="strip-label">Monthly Average</span>
                <strong className="strip-value">Rs. {monthlyAverage.toLocaleString('en-IN')}</strong>
              </div>
              <div className="strip-divider" />
              <div className="strip-item">
                <span className="strip-label">Peak Performance Month</span>
                <strong className="strip-value peak-color">{peakMonth}</strong>
              </div>
            </div>

            {/* Interactive 12-Month Revenue Bar Chart Visual */}
            <div className="revenue-chart-container extended-height">
              <div className="chart-header-row">
                <span className="chart-legend-title">All 12 Months Breakdown ({selectedYear})</span>
                <span className="chart-peak-indicator">
                  Hover bar to view exact monthly gross
                </span>
              </div>

              <div className="revenue-bar-chart-visual twelve-months">
                {monthlyTrends.map((trend) => {
                  const isCurrent = (selectedYear === '2026' && trend.month === 'Sep') || (selectedYear !== '2026' && trend.month === 'Dec');
                  const isHovered = activeMonthHover === trend.month;

                  return (
                    <div
                      key={trend.month}
                      className={`chart-bar-column ${isCurrent ? 'current-active' : ''} ${isHovered ? 'hovered' : ''}`}
                      onMouseEnter={() => setActiveMonthHover(trend.month)}
                    >
                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{ height: `${trend.percentage}%` }}
                        >
                          <div className="bar-tooltip">
                            <span>{trend.displayAmount}</span>
                          </div>
                        </div>
                      </div>
                      <span className="bar-label">{trend.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Earning Metric & Order Fulfillment Breakdown Graph */}
        <div className="admin-card fulfillment-breakdown-card">
          <div className="card-toolbar">
            <div>
              <span className="toolbar-title">
                <i className="fa-solid fa-chart-pie" style={{ color: '#3b82f6' }} />
                Earning &amp; Order Fulfillment
              </span>
              <span className="toolbar-subtitle">Current month earnings &amp; dispatch lifecycle</span>
            </div>
            <span className="total-orders-badge">
              {orderFulfillment.totalOrders} Total Orders
            </span>
          </div>

          <div className="fulfillment-card-body">
            {/* Earning Highlight Card (Displayed on Right Side as requested) */}
            <div className="monthly-earning-highlight-banner right-side-earning">
              <div className="earning-banner-left">
                <span className="earning-subtitle-label">This Month ({selectedYear})</span>
                <h2 className="earning-highlight-amount">{thisMonth}</h2>
                <div className="earning-growth-row">
                  <span className="growth-badge-chip">
                    <i className="fa-solid fa-arrow-trend-up" /> {growthPercent}
                  </span>
                  <span className="growth-note-text">{growthNote}</span>
                </div>
              </div>
              <div className="earning-banner-icon-badge">
                <i className="fa-solid fa-sack-dollar" />
              </div>
            </div>

            {/* Donut SVG Visual Graph */}
            <div className="donut-chart-wrapper">
              <svg viewBox="0 0 160 160" className="donut-svg-chart">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth="20"
                />
                {/* Delivered Arc (72%) */}
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="20"
                  strokeDasharray="271.4 376.99"
                  strokeDashoffset="0"
                  className="donut-segment delivered-segment"
                />
                {/* Processing Arc (22%) */}
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeWidth="20"
                  strokeDasharray="82.9 376.99"
                  strokeDashoffset="-271.4"
                  className="donut-segment processing-segment"
                />
                {/* Return Arc (6%) */}
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="transparent"
                  stroke="#ef4444"
                  strokeWidth="20"
                  strokeDasharray="22.6 376.99"
                  strokeDashoffset="-354.3"
                  className="donut-segment return-segment"
                />
              </svg>

              {/* Center Donut Label */}
              <div className="donut-center-label">
                <strong>{orderFulfillment.totalOrders}</strong>
                <span>Orders</span>
              </div>
            </div>

            {/* Status Breakdown Category Bars */}
            <div className="fulfillment-categories-list">
              {/* 1. Delivered */}
              <div className="status-progress-item delivered">
                <div className="status-item-header">
                  <div className="status-title-box">
                    <span className="status-color-dot" style={{ background: orderFulfillment.delivered.color }} />
                    <i className={orderFulfillment.delivered.icon} style={{ color: orderFulfillment.delivered.color }} />
                    <span className="status-name">{orderFulfillment.delivered.label}</span>
                  </div>
                  <div className="status-numbers">
                    <strong>{orderFulfillment.delivered.count}</strong>
                    <span className="status-percent">({orderFulfillment.delivered.percentage}%)</span>
                  </div>
                </div>
                <div className="status-progress-track">
                  <div
                    className="status-progress-fill"
                    style={{
                      width: `${orderFulfillment.delivered.percentage}%`,
                      background: orderFulfillment.delivered.color,
                    }}
                  />
                </div>
              </div>

              {/* 2. Processing */}
              <div className="status-progress-item processing">
                <div className="status-item-header">
                  <div className="status-title-box">
                    <span className="status-color-dot" style={{ background: orderFulfillment.processing.color }} />
                    <i className={orderFulfillment.processing.icon} style={{ color: orderFulfillment.processing.color }} />
                    <span className="status-name">{orderFulfillment.processing.label}</span>
                  </div>
                  <div className="status-numbers">
                    <strong>{orderFulfillment.processing.count}</strong>
                    <span className="status-percent">({orderFulfillment.processing.percentage}%)</span>
                  </div>
                </div>
                <div className="status-progress-track">
                  <div
                    className="status-progress-fill"
                    style={{
                      width: `${orderFulfillment.processing.percentage}%`,
                      background: orderFulfillment.processing.color,
                    }}
                  />
                </div>
              </div>

              {/* 3. Return */}
              <div className="status-progress-item return">
                <div className="status-item-header">
                  <div className="status-title-box">
                    <span className="status-color-dot" style={{ background: orderFulfillment.return.color }} />
                    <i className={orderFulfillment.return.icon} style={{ color: orderFulfillment.return.color }} />
                    <span className="status-name">{orderFulfillment.return.label}</span>
                  </div>
                  <div className="status-numbers">
                    <strong>{orderFulfillment.return.count}</strong>
                    <span className="status-percent">({orderFulfillment.return.percentage}%)</span>
                  </div>
                </div>
                <div className="status-progress-track">
                  <div
                    className="status-progress-fill"
                    style={{
                      width: `${orderFulfillment.return.percentage}%`,
                      background: orderFulfillment.return.color,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
