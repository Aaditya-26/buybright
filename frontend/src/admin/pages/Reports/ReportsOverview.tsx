/**
 * BuyBright Admin — Reports & Analytics Central Overview Hub.
 * Modern executive dashboard connecting to all 9 specialized report pages with professional KPI cards and direct navigation.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { ReportStatCard, ReportStatData } from './ReportStatCard';
import { salesTrendsData } from '../../data/dashboardData';
import { useToast } from '../../../context/ToastContext';
import { exportTableToPDF } from '../../utils/exportPdf';

interface ReportModuleCard {
  id: string;
  title: string;
  link: string;
  desc: string;
  icon: string;
  color: string;
  badge: string;
  statPreview: string;
  recordCount: number;
}

const REPORT_MODULES: ReportModuleCard[] = [
  {
    id: 'sales',
    title: 'Sales Report',
    link: '/admin/reports/sales',
    desc: 'Gross B2B billing ledger, 18%/12% GST tax liabilities, promo discounts, and gateway settlement reports.',
    icon: 'fa-solid fa-chart-line',
    color: '#0d9488',
    badge: 'Financial Ledger',
    statPreview: '₹1.72L Gross • 8 Transactions',
    recordCount: 8,
  },
  {
    id: 'orders',
    title: 'Orders Report',
    link: '/admin/reports/orders',
    desc: 'Fulfillment registers, BlueDart / Delhivery courier tracking AWBs, dispatch statuses, and delivery audits.',
    icon: 'fa-solid fa-box-open',
    color: '#3b82f6',
    badge: 'Logistics & AWB',
    statPreview: '8 Placed • ₹1.72L Order Value',
    recordCount: 8,
  },
  {
    id: 'products',
    title: 'Product Report',
    link: '/admin/reports/products',
    desc: 'Catalog sales velocity, profit margins, inventory stock levels, and units sold per SKU.',
    icon: 'fa-solid fa-boxes-stacked',
    color: '#10b981',
    badge: 'Inventory Velocity',
    statPreview: '7 SKUs • 2,169 Units Sold',
    recordCount: 7,
  },
  {
    id: 'categories',
    title: 'Category Report',
    link: '/admin/reports/categories',
    desc: 'Departmental revenue contribution, market share percentages, active SKU depth, and YoY growth rates.',
    icon: 'fa-solid fa-folder-tree',
    color: '#8b5cf6',
    badge: 'Department Share',
    statPreview: '5 Depts • ₹90.95L Total Rev',
    recordCount: 5,
  },
  {
    id: 'customers',
    title: 'Customer Report',
    link: '/admin/reports/customers',
    desc: 'Doctor purchasing behavior, clinic tier classification, geographic distribution, and lifetime spend.',
    icon: 'fa-solid fa-users',
    color: '#f59e0b',
    badge: 'Practitioner CRM',
    statPreview: '6 Clinics • ₹8.64L Spent',
    recordCount: 6,
  },
  {
    id: 'referrals',
    title: 'Referral Report',
    link: '/admin/reports/referrals',
    desc: 'Doctor-to-doctor invite conversions, pipeline influenced revenue, and loyalty points commission rewards.',
    icon: 'fa-solid fa-user-plus',
    color: '#ec4899',
    badge: 'Growth Loop',
    statPreview: '50 Onboarded • ₹6.57L Rev',
    recordCount: 5,
  },
  {
    id: 'wallet',
    title: 'Wallet Report',
    link: '/admin/reports/wallet',
    desc: 'BrightPoints liability ledger, doctor credit issuance, debit redemptions, and active balances.',
    icon: 'fa-solid fa-wallet',
    color: '#6366f1',
    badge: 'Loyalty Balances',
    statPreview: '₹18.8K Bal • 18.8K Pts',
    recordCount: 5,
  },
  {
    id: 'coupons',
    title: 'Coupon Report',
    link: '/admin/reports/coupons',
    desc: 'Promotional voucher campaigns, redemption counts, discount subsidies, and influenced revenue.',
    icon: 'fa-solid fa-ticket',
    color: '#14b8a6',
    badge: 'Campaign ROI',
    statPreview: '5 Codes • 762 Redemptions',
    recordCount: 5,
  },
  {
    id: 'carts',
    title: 'Cart Report',
    link: '/admin/reports/carts',
    desc: 'Abandoned cart checkout sessions, recovery email triggers, and at-risk sales pipeline values.',
    icon: 'fa-solid fa-cart-shopping',
    color: '#ef4444',
    badge: 'Cart Recoveries',
    statPreview: '5 Sessions • ₹78.8K At-Risk',
    recordCount: 5,
  },
];

export const ReportsOverview: React.FC = () => {
  const { showToast } = useToast();
  const [selectedCycle, setSelectedCycle] = useState('Current FY 2026-2027');

  const executiveKPIs: ReportStatData[] = [
    {
      id: 'gross-sales',
      label: 'Gross Platform Sales',
      value: '₹18,45,820',
      icon: 'fa-solid fa-indian-rupee-sign',
      color: '#0d9488',
      change: '+18.4%',
      isPositive: true,
      subtext: 'vs previous quarter',
      badge: 'Settled',
    },
    {
      id: 'gst-collected',
      label: 'GST Tax Liability (18%/12%)',
      value: '₹2,84,370',
      icon: 'fa-solid fa-receipt',
      color: '#3b82f6',
      change: '+14.1%',
      isPositive: true,
      subtext: 'Remittance due 20 Oct',
      badge: 'Tax Audit',
    },
    {
      id: 'active-clinics',
      label: 'Active Doctor Accounts',
      value: '148 Clinics',
      icon: 'fa-solid fa-user-doctor',
      color: '#8b5cf6',
      change: '+26 Clinics',
      isPositive: true,
      subtext: 'Across 14 States',
      badge: 'B2B CRM',
    },
    {
      id: 'net-settlement',
      label: 'Net Bank Settlements',
      value: '₹15,18,600',
      icon: 'fa-solid fa-building-columns',
      color: '#16a34a',
      change: '+19.2%',
      isPositive: true,
      subtext: 'HDFC Corporate Current A/c',
      badge: 'Disbursed',
    },
  ];

  const handleDownloadConsolidated = () => {
    exportTableToPDF({
      title: 'BuyBright — Master Consolidated Platform Audit',
      subtitle: `Enterprise analytical overview and financial ledger (${selectedCycle})`,
      headers: ['Report Module', 'Category / Domain', 'Active Records', 'Performance Preview'],
      rows: REPORT_MODULES.map((m) => [m.title, m.badge, `${m.recordCount} records`, m.statPreview]),
    });
    showToast('Consolidated Platform Manifest downloaded as PDF', 'success');
  };

  return (
    <AdminLayout
      title="Reports &amp; Analytics Hub"
      subtitle="Executive business intelligence, financial manifests, and audit ledgers across all platform operations"
    >
      {/* ── Cycle Filter & Master Download Bar ── */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          padding: '16px 20px',
          marginBottom: '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          boxShadow: '0 2px 8px -2px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>
            <i className="fa-solid fa-calendar-days" style={{ color: '#0d9488', marginRight: '6px' }} />
            Reporting Cycle:
          </span>
          <select
            value={selectedCycle}
            onChange={(e) => setSelectedCycle(e.target.value)}
            className="table-filter-select"
            style={{ fontWeight: 600, minWidth: '220px' }}
          >
            <option value="Current FY 2026-2027">Current FY 2026-2027</option>
            <option value="Quarter 2 (Jul - Sep 2026)">Q2 (Jul - Sep 2026)</option>
            <option value="Quarter 1 (Apr - Jun 2026)">Q1 (Apr - Jun 2026)</option>
            <option value="September 2026">September 2026</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleDownloadConsolidated}
          className="btn-admin-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <i className="fa-solid fa-cloud-arrow-down" /> Download Consolidated Manifest
        </button>
      </div>

      {/* ── Professional Responsive KPI Stat Cards ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '18px',
          marginBottom: '26px',
        }}
      >
        {executiveKPIs.map((kpi) => (
          <ReportStatCard key={kpi.id} stat={kpi} />
        ))}
      </div>

      {/* ── 9 Distinct Dedicated Report Cards Grid ── */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a', fontWeight: 800 }}>
            Specialized Business Reports ({REPORT_MODULES.length})
          </h3>
          <p style={{ margin: '3px 0 0', fontSize: '0.84rem', color: '#64748b' }}>
            Click on any report module below to view detailed data registers, date filters, and export tools.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px',
          }}
        >
          {REPORT_MODULES.map((report) => (
            <div
              key={report.id}
              className="admin-card"
              style={{
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = `${report.color}70`;
                e.currentTarget.style.boxShadow = '0 12px 24px -4px rgba(15, 23, 42, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <div>
                {/* Card Header with Icon & Domain Tag */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: `${report.color}15`,
                      color: report.color,
                      border: `1px solid ${report.color}25`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                    }}
                  >
                    <i className={report.icon} />
                  </div>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 9px',
                      borderRadius: '8px',
                      background: '#f1f5f9',
                      color: '#475569',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    {report.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <h4 style={{ margin: '0 0 6px', fontSize: '1.05rem', color: '#0f172a', fontWeight: 700 }}>
                  {report.title}
                </h4>
                <p style={{ margin: 0, fontSize: '0.83rem', color: '#64748b', lineHeight: 1.45, minHeight: '38px' }}>
                  {report.desc}
                </p>

                {/* Quick Stats Metric Preview Pill */}
                <div
                  style={{
                    marginTop: '14px',
                    padding: '9px 12px',
                    background: '#f8fafc',
                    borderRadius: '10px',
                    border: '1px solid #f1f5f9',
                    fontSize: '0.8rem',
                    color: '#334155',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <i className="fa-solid fa-chart-simple" style={{ color: report.color }} />
                  <span>{report.statPreview}</span>
                </div>
              </div>

              {/* Action Link Footer */}
              <div
                style={{
                  marginTop: '18px',
                  paddingTop: '14px',
                  borderTop: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>
                  {report.recordCount} Total Entries
                </span>
                <Link
                  to={report.link}
                  className="btn-admin-primary"
                  style={{
                    fontSize: '0.82rem',
                    padding: '8px 16px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    borderRadius: '8px',
                  }}
                >
                  <span>Open Report</span>
                  <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.75rem' }} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Monthly Revenue Trends Table ── */}
      <div className="admin-card" style={{ borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <div className="card-toolbar">
          <span className="toolbar-title">
            <i className="fa-solid fa-chart-column" style={{ color: '#0d9488' }} />
            Platform Revenue Velocity &amp; Monthly Order Volume
          </span>
        </div>
        <div className="admin-table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Orders Completed</th>
                <th>Gross Revenue</th>
                <th>Avg. Order Value</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {salesTrendsData.map((s, idx) => (
                <tr key={idx}>
                  <td>
                    <strong style={{ color: '#0f172a', fontSize: '0.88rem' }}>{s.month} 2026</strong>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{s.orders.toLocaleString('en-IN')} orders</span>
                  </td>
                  <td>
                    <strong style={{ color: '#0f766e', fontSize: '0.9rem' }}>
                      ₹{s.revenue.toLocaleString('en-IN')}
                    </strong>
                  </td>
                  <td>
                    <span>₹{Math.round(s.revenue / s.orders).toLocaleString('en-IN')}</span>
                  </td>
                  <td>
                    <span className="admin-badge badge-active">Audited</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ReportsOverview;
