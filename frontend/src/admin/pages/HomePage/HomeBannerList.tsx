/**
 * HomeBannerList Page.
 * BuyBright Admin Home Page Module - Home Banner Subpage.
 * Table listing with banner previews, two CTA buttons, SEO metadata, search, filters, and PDF export.
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { DataTable, type Column } from '../../components/DataTable';
import { SearchBar } from '../../components/SearchBar';
import { getHomeBanners, saveHomeBanners } from '../../data/homeData';
import type { HomeBanner } from '../../types/home';
import { useToast } from '../../../context/ToastContext';
import { exportTableToPDF } from '../../utils/exportPdf';
import { exportTableToCSV } from '../../utils/exportCsv';

export const HomeBannerList: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [banners, setBanners] = useState<HomeBanner[]>(() => getHomeBanners());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter banners based on search and status
  const filteredBanners = useMemo(() => {
    return banners.filter((b) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.subtitle.toLowerCase().includes(q) ||
        (b.button1Url && b.button1Url.toLowerCase().includes(q)) ||
        (b.seoTitle && b.seoTitle.toLowerCase().includes(q));

      const matchStatus = statusFilter === 'All' || b.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [banners, searchQuery, statusFilter]);

  // Toggle Active/Inactive status
  const handleToggleStatus = (banner: HomeBanner) => {
    const updatedStatus: HomeBanner['status'] = banner.status === 'Active' ? 'Inactive' : 'Active';
    const updated = banners.map((b) => (b.id === banner.id ? { ...b, status: updatedStatus } : b));
    setBanners(updated);
    saveHomeBanners(updated);
    showToast(`Banner "${banner.title}" status changed to ${updatedStatus}.`, 'info');
  };

  // Export to CSV
  const handleExportCSV = () => {
    exportTableToCSV({
      filename: `home_banners_${new Date().toISOString().slice(0, 10)}.csv`,
      headers: ['Sr.No.', 'Banner Title', 'Subtitle', 'Button 1 Text', 'Button 1 URL', 'Button 2 Text', 'Button 2 URL', 'SEO Title', 'Status'],
      rows: filteredBanners.map((b, idx) => [
        idx + 1,
        b.title,
        b.subtitle || '',
        b.button1Text || b.buttonText || '',
        b.button1Url || b.targetUrl || '',
        b.button2Text || '',
        b.button2Url || '',
        b.seoTitle || '',
        b.status,
      ]),
    });
    showToast('Home Banners CSV report exported.', 'success');
  };

  // Export to PDF
  const handleExportPDF = () => {
    exportTableToPDF({
      title: 'Homepage Banners Directory',
      subtitle: `BuyBright homepage carousel hero banners (${filteredBanners.length} total)`,
      headers: ['Sr.No.', 'Banner Title', 'Button 1', 'Button 2', 'SEO Title', 'Status'],
      rows: filteredBanners.map((b, idx) => [
        idx + 1,
        b.title,
        `${b.button1Text || b.buttonText || ''} (${b.button1Url || b.targetUrl || ''})`,
        b.button2Text ? `${b.button2Text} (${b.button2Url})` : 'None',
        b.seoTitle || 'Default SEO',
        b.status,
      ]),
    });
    showToast('Opening PDF export preview...', 'info');
  };

  // Table Columns
  const columns: Column<HomeBanner>[] = [
    {
      key: 'action',
      header: 'Action',
      width: '90px',
      render: (banner) => (
        <div className="table-action-btns">
          <button
            type="button"
            className="btn-icon-action"
            title="Edit Banner"
            onClick={() => navigate(`/admin/home/banners/edit/${banner.id}`)}
            aria-label={`Edit ${banner.title}`}
          >
            <i className="fa-solid fa-pen-to-square" style={{ color: '#0d9488' }} />
          </button>
          <button
            type="button"
            className="btn-icon-action"
            title={banner.status === 'Active' ? 'Deactivate Banner' : 'Activate Banner'}
            onClick={() => handleToggleStatus(banner)}
            aria-label="Toggle banner status"
          >
            <i
              className={`fa-solid ${banner.status === 'Active' ? 'fa-toggle-on' : 'fa-toggle-off'}`}
              style={{ color: banner.status === 'Active' ? '#10b981' : '#94a3b8' }}
            />
          </button>
        </div>
      ),
    },
    {
      key: 'srNo',
      header: 'Sr.No.',
      width: '75px',
      render: (b, idx) => (
        <span style={{ fontWeight: 700, color: '#64748b', fontSize: '0.85rem' }}>
          #{b.srNo || idx + 1}
        </span>
      ),
    },
    {
      key: 'banner',
      header: 'Banner Image',
      width: '130px',
      render: (b) => (
        <div
          style={{
            width: '110px',
            height: '52px',
            borderRadius: '6px',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            background: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={b.image}
            alt={b.seoAltText || b.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/banner.webp';
            }}
          />
        </div>
      ),
    },
    {
      key: 'title',
      header: 'Title & Description',
      minWidth: '240px',
      render: (b) => (
        <div style={{ minWidth: '200px', maxWidth: '380px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
          <strong style={{ display: 'block', fontSize: '0.86rem', color: '#0f172a', lineHeight: 1.35, marginBottom: '4px' }}>
            {b.title}
          </strong>
          <span style={{ display: 'block', fontSize: '0.78rem', color: '#64748b', lineHeight: 1.45, whiteSpace: 'normal', wordBreak: 'break-word' }}>
            {b.subtitle}
          </span>
        </div>
      ),
    },
    {
      key: 'buttons',
      header: 'Two Action Buttons',
      minWidth: '180px',
      render: (b) => {
        const btn1 = b.button1Text || b.buttonText;
        const btn1Url = b.button1Url || b.targetUrl;
        const btn2 = b.button2Text;
        const btn2Url = b.button2Url;

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '160px', maxWidth: '240px' }}>
            {btn1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#0d9488',
                    background: '#f0fdfa',
                    border: '1px solid #ccfbf1',
                    padding: '2px 7px',
                    borderRadius: '4px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Btn 1: {btn1}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {btn1Url}
                </span>
              </div>
            )}
            {btn2 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#475569',
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    padding: '2px 7px',
                    borderRadius: '4px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Btn 2: {btn2}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {btn2Url}
                </span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'seo',
      header: 'SEO Meta & Alt',
      minWidth: '170px',
      render: (b) => (
        <div style={{ minWidth: '150px', maxWidth: '240px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
          <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#0f766e', lineHeight: 1.3 }}>
            {b.seoTitle || 'BuyBright Dental Banner'}
          </span>
          {b.seoAltText && (
            <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', marginTop: '3px', lineHeight: 1.35 }}>
              Alt: {b.seoAltText}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'order',
      header: 'Order',
      width: '75px',
      render: (b) => (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background: '#f1f5f9',
            color: '#334155',
            fontWeight: 800,
            fontSize: '0.82rem',
          }}
        >
          {b.displayOrder}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '95px',
      render: (b) => (
        <span className={`admin-badge ${b.status === 'Active' ? 'badge-success' : 'badge-secondary'}`}>
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: b.status === 'Active' ? '#22c55e' : '#94a3b8',
              display: 'inline-block',
            }}
          />
          {b.status}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Home Banners"
      subtitle={`Homepage carousel sliders and promo hero banners (${banners.length} total)`}
    >
      <div className="admin-card">
        {/* Card Toolbar */}
        <div className="card-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search banner, buttons, SEO..."
              width="280px"
            />

            <select
              className="table-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by Status"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Banners</option>
              <option value="Inactive">Inactive Banners</option>
            </select>

            {(searchQuery || statusFilter !== 'All') && (
              <button
                type="button"
                className="btn-admin-secondary"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('All');
                }}
                style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                title="Reset filters"
              >
                <i className="fa-solid fa-arrow-rotate-left" /> Reset
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-export-csv"
              onClick={handleExportCSV}
              title="Export Banners list to CSV"
            >
              <i className="fa-solid fa-file-csv" /> Export CSV
            </button>

            <button
              type="button"
              className="btn-export-pdf"
              onClick={handleExportPDF}
              title="Export Banners list to PDF"
            >
              <i className="fa-solid fa-file-pdf" /> Export PDF
            </button>

            <button
              type="button"
              className="btn-admin-primary"
              onClick={() => navigate('/admin/home/banners/create')}
            >
              <i className="fa-solid fa-plus" /> Add New Banner
            </button>
          </div>
        </div>

        {/* Reusable Data Table */}
        <DataTable
          columns={columns}
          data={filteredBanners}
          keyExtractor={(b) => b.id}
          emptyMessage="No home banners match your search or filter."
        />
      </div>
    </AdminLayout>
  );
};

export default HomeBannerList;
