/**
 * BuyBright Admin — Product Banners List Page.
 * Directory and placement manager for promotional banners, shop headers, and showcase cards.
 * Pattern mirrors HomeBannerList: full-page navigate pattern, DataTable, and PDF export.
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { DataTable, type Column } from '../../../components/DataTable';
import { SearchBar } from '../../../components/SearchBar';
import { getProductBanners, saveProductBanners } from '../../../data/productBannersData';
import type { AdminProductBanner, BannerPlacement } from '../../../types/product';
import { useToast } from '../../../../context/ToastContext';
import { exportTableToPDF } from '../../../utils/exportPdf';
import { exportTableToCSV } from '../../../utils/exportCsv';

const PLACEMENTS: (BannerPlacement | 'All')[] = [
  'All',
  'Shop Header Banner',
  'Promo Showcase 3-Grid',
  'Dual Promo Card',
  'Brand Spotlight Strip',
  'Special Offer Bar',
];

export const ProductBannerList: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [banners, setBanners] = useState<AdminProductBanner[]>(() => getProductBanners());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlacement, setSelectedPlacement] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Filter banners based on search, placement, and status
  const filteredBanners = useMemo(() => {
    return banners.filter((b) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        (b.pageHeading && b.pageHeading.toLowerCase().includes(q)) ||
        (b.heading && b.heading.toLowerCase().includes(q)) ||
        (b.subheading && b.subheading.toLowerCase().includes(q)) ||
        b.title.toLowerCase().includes(q) ||
        (b.badgeText && b.badgeText.toLowerCase().includes(q));

      const matchPlacement = selectedPlacement === 'All' || b.placement === selectedPlacement;
      const matchStatus = selectedStatus === 'All' || b.status === selectedStatus;

      return matchSearch && matchPlacement && matchStatus;
    });
  }, [banners, searchQuery, selectedPlacement, selectedStatus]);

  // Toggle Active/Inactive status
  const handleToggleStatus = (banner: AdminProductBanner) => {
    const updatedStatus: AdminProductBanner['status'] = banner.status === 'Active' ? 'Inactive' : 'Active';
    const updated = banners.map((b) => (b.id === banner.id ? { ...b, status: updatedStatus } : b));
    setBanners(updated);
    saveProductBanners(updated);
    showToast(`Banner "${banner.title}" set to ${updatedStatus}.`, 'info');
  };

  // Export to CSV
  const handleExportCSV = () => {
    exportTableToCSV({
      filename: `product-banners-${new Date().toISOString().slice(0, 10)}`,
      headers: ['Sr.No.', 'Page Heading', 'Heading', 'Badge Text', 'Flags', 'Placement', 'Status'],
      rows: filteredBanners.map((b, idx) => [
        idx + 1,
        b.pageHeading || b.title || '',
        b.heading || b.title || '',
        b.badgeText || '',
        [b.isNewArrival ? 'New Arrival' : '', b.isBestseller ? 'Bestseller' : ''].filter(Boolean).join(', ') || '—',
        b.placement || '',
        b.status || '',
      ]),
    });
    showToast('Product banners CSV downloaded successfully.', 'success');
  };

  // Export to PDF
  const handleExportPDF = () => {
    exportTableToPDF({
      title: 'BuyBright Product Banners Directory',
      subtitle: `Promotional banners and showcase placements (${filteredBanners.length} total)`,
      headers: ['Sr.No.', 'Page Heading', 'Heading', 'Badge / Flags', 'Placement', 'Status'],
      rows: filteredBanners.map((b, idx) => [
        idx + 1,
        b.pageHeading || b.title || '',
        b.heading || '',
        [b.badgeText, b.isNewArrival ? '[New Arrival]' : '', b.isBestseller ? '[Bestseller]' : ''].filter(Boolean).join(' ') || '—',
        b.placement,
        b.status,
      ]),
    });
    showToast('Product banners PDF report generated.', 'success');
  };

  // Metrics
  const stats = [
    { label: 'Total Banners', value: banners.length, icon: 'fa-solid fa-panorama', color: '#0d9488', bg: '#f0fdfa', border: '#ccfbf1' },
    { label: 'Active Placements', value: banners.filter((b) => b.status === 'Active').length, icon: 'fa-solid fa-circle-check', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
    { label: 'Shop Headers', value: banners.filter((b) => b.placement === 'Shop Header Banner').length, icon: 'fa-solid fa-heading', color: '#6366f1', bg: '#eef2ff', border: '#e0e7ff' },
    { label: 'Showcase Grid', value: banners.filter((b) => b.placement === 'Promo Showcase 3-Grid' || b.placement === 'Dual Promo Card').length, icon: 'fa-solid fa-table-cells-large', color: '#ea580c', bg: '#fff7ed', border: '#ffedd5' },
  ];

  // Table Columns
  const columns: Column<AdminProductBanner>[] = [
    {
      key: 'actions',
      header: 'Action',
      width: '90px',
      render: (b) => (
        <div className="table-action-btns">
          <button
            type="button"
            className="btn-icon-action"
            title="Edit Banner"
            onClick={() => navigate(`/admin/products/banners/edit/${b.id}`)}
          >
            <i className="fa-solid fa-pen-to-square" style={{ color: '#0d9488' }} />
          </button>
          <button
            type="button"
            className="btn-icon-action"
            title={b.status === 'Active' ? 'Deactivate' : 'Activate'}
            onClick={() => handleToggleStatus(b)}
          >
            <i
              className={`fa-solid ${b.status === 'Active' ? 'fa-toggle-on' : 'fa-toggle-off'}`}
              style={{ color: b.status === 'Active' ? '#10b981' : '#94a3b8' }}
            />
          </button>
        </div>
      ),
    },
    {
      key: 'preview',
      header: 'Preview',
      width: '110px',
      render: (b) => (
        <div
          style={{
            width: '90px',
            height: '52px',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: b.bgColor || '#1e293b',
            border: '1px solid #cbd5e1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
          }}
        >
          {b.rightSideIcon && (
            <i className={b.rightSideIcon} style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,0.6)' }} />
          )}
          {!b.rightSideIcon && (
            <i className="fa-solid fa-panorama" style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,0.4)' }} />
          )}
          {b.badgeText && (
            <span
              style={{
                position: 'absolute',
                top: '3px',
                left: '3px',
                background: 'rgba(13,148,136,0.9)',
                color: '#fff',
                fontSize: '0.5rem',
                fontWeight: 800,
                padding: '1px 4px',
                borderRadius: '3px',
                maxWidth: '80px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {b.badgeText}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'title',
      header: 'Page Heading & Heading',
      render: (b) => (
        <div style={{ maxWidth: '280px' }}>
          {/* Page Heading */}
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>
            {b.pageHeading || '—'}
          </div>
          {/* Heading */}
          <strong style={{ fontSize: '0.85rem', color: '#0f172a', display: 'block', marginBottom: '3px' }}>
            {b.heading || b.title}
          </strong>
          {/* Subheading */}
          {(b.subheading || b.subtitle) && (
            <div style={{ fontSize: '0.74rem', color: '#64748b', lineHeight: 1.3 }}>
              {(b.subheading || b.subtitle).length > 60
                ? `${(b.subheading || b.subtitle).slice(0, 60)}…`
                : (b.subheading || b.subtitle)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'placement',
      header: 'Placement & Order',
      render: (b) => (
        <div>
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '4px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#334155',
              display: 'inline-block',
            }}
          >
            {b.placement}
          </span>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '3px' }}>
            Order Index: <strong>#{b.displayOrder}</strong>
          </div>
        </div>
      ),
    },
    {
      key: 'icons',
      header: 'Badge & Flags',
      render: (b) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {b.badgeText && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f0fdf9', border: '1px solid #a7f3d0', borderRadius: '4px', padding: '2px 7px', fontSize: '0.7rem', fontWeight: 700, color: '#065f46', width: 'fit-content' }}>
              <i className={b.badgeIcon || 'fa-solid fa-tag'} style={{ color: '#0d9488', fontSize: '0.65rem' }} />
              {b.badgeText.length > 24 ? `${b.badgeText.slice(0, 24)}…` : b.badgeText}
            </div>
          )}
          {/* Promotional Flags Badges */}
          {(b.isNewArrival || b.isBestseller) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {b.isNewArrival && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: '#f0fdfa', border: '1px solid #99f6e4', color: '#0f766e', fontSize: '0.66rem', fontWeight: 800, padding: '1px 6px', borderRadius: '4px' }}>
                  <i className="fa-solid fa-sparkles" style={{ fontSize: '0.6rem' }} /> NEW ARRIVAL
                </span>
              )}
              {b.isBestseller && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: '#fffbeb', border: '1px solid #fde68a', color: '#b45309', fontSize: '0.66rem', fontWeight: 800, padding: '1px 6px', borderRadius: '4px' }}>
                  <i className="fa-solid fa-crown" style={{ fontSize: '0.6rem' }} /> BESTSELLER
                </span>
              )}
            </div>
          )}
          {b.rightSideIcon && (
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              <i className={b.rightSideIcon} style={{ marginRight: '5px', color: '#6366f1' }} />
              <span style={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>{b.rightSideIcon.split(' ').pop()}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '90px',
      render: (b) => (
        <span
          style={{
            fontSize: '0.73rem',
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: '20px',
            background: b.status === 'Active' ? '#dcfce7' : '#fee2e2',
            color: b.status === 'Active' ? '#16a34a' : '#ef4444',
          }}
        >
          {b.status}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Product Banners & Promotions"
      subtitle={`Managing ${banners.length} promotional banners, shop header hero visuals, and campaign cards`}
    >
      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '18px' }}>
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: s.bg,
              border: `1px solid ${s.border}`,
              borderRadius: '12px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: `${s.color}18`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <i className={s.icon} style={{ fontSize: '1.1rem', color: s.color }} />
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: s.color, lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        {/* ── Toolbar ── */}
        <div className="card-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search title, copy, URL, discount…"
              width="250px"
            />
            <select
              className="table-filter-select"
              value={selectedPlacement}
              onChange={(e) => setSelectedPlacement(e.target.value)}
            >
              {PLACEMENTS.map((p) => (
                <option key={p} value={p}>{p === 'All' ? 'All Placements' : p}</option>
              ))}
            </select>
            <select
              className="table-filter-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            {(searchQuery || selectedPlacement !== 'All' || selectedStatus !== 'All') && (
              <button
                type="button"
                className="btn-admin-secondary"
                onClick={() => { setSearchQuery(''); setSelectedPlacement('All'); setSelectedStatus('All'); }}
                style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                title="Reset filters"
              >
                <i className="fa-solid fa-arrow-rotate-left" /> Reset
              </button>
            )}
            <button
              type="button"
              className="btn-export-csv"
              onClick={handleExportCSV}
              title="Download Product Banners CSV"
            >
              <i className="fa-solid fa-file-csv" /> Export CSV
            </button>
            <button
              type="button"
              className="btn-export-pdf"
              onClick={handleExportPDF}
              title="Download Product Banners PDF"
            >
              <i className="fa-solid fa-file-pdf" /> Export PDF
            </button>
          </div>
          <button
            type="button"
            className="btn-admin-primary"
            onClick={() => navigate('/admin/products/banners/create')}
          >
            <i className="fa-solid fa-plus" /> Add New Banner
          </button>
        </div>

        {/* ── Data Table ── */}
        <DataTable
          columns={columns}
          data={filteredBanners}
          keyExtractor={(b) => b.id}
          emptyMessage="No promotional banners found matching your search or filters."
        />
      </div>
    </AdminLayout>
  );
};

export default ProductBannerList;
