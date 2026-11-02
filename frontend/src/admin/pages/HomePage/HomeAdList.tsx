/**
 * HomeAdList Page.
 * BuyBright Admin Home Page Module - Home Advertisement Management.
 * Master table listing with live image previews, slot capacity indicators, status toggles,
 * dedicated Add Advertisement navigation to separate form page, search, filters, and unified Export CSV / Export PDF buttons.
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { DataTable, type Column } from '../../components/DataTable';
import { SearchBar } from '../../components/SearchBar';
import { getAdSections, saveAdSections } from '../../data/homeData';
import type { AdSectionItem } from '../../types/home';
import { useToast } from '../../../context/ToastContext';
import { exportTableToPDF } from '../../utils/exportPdf';
import { exportTableToCSV } from '../../utils/exportCsv';

export const HomeAdList: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [sections, setSections] = useState<AdSectionItem[]>(() => getAdSections());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filtered Sections
  const filteredSections = useMemo(() => {
    return sections.filter((sec) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        sec.name.toLowerCase().includes(q) ||
        sec.id.toLowerCase().includes(q) ||
        (sec.placement && sec.placement.toLowerCase().includes(q));
      const matchStatus = statusFilter === 'All' || sec.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [sections, searchQuery, statusFilter]);

  // Toggle Status
  const handleToggleStatus = (sec: AdSectionItem) => {
    const nextStatus: 'Active' | 'Inactive' = sec.status === 'Active' ? 'Inactive' : 'Active';
    const updated = sections.map((s) => (s.id === sec.id ? { ...s, status: nextStatus } : s));
    setSections(updated);
    saveAdSections(updated);
    showToast(`${sec.name} is now ${nextStatus === 'Active' ? 'Active' : 'Inactive'}.`, 'info');
  };

  // Export to CSV
  const handleExportCSV = () => {
    exportTableToCSV({
      filename: `BuyBright_Home_Advertisements_${new Date().toISOString().split('T')[0]}`,
      headers: ['Sr.No.', 'Section ID', 'Section Name', 'Placement', 'Images Count', 'Max Capacity', 'Status', 'Last Updated'],
      rows: filteredSections.map((sec, idx) => [
        idx + 1,
        sec.id,
        sec.name,
        sec.placement || 'Homepage Showcase',
        sec.images.length,
        sec.maxImages,
        sec.status,
        sec.updatedAt || '26 Sep 2026',
      ]),
    });
    showToast('Exported Advertisements (.CSV) successfully.', 'success');
  };

  // Export to PDF
  const handleExportPDF = () => {
    exportTableToPDF({
      title: 'Homepage Advertisements Directory',
      subtitle: `BuyBright promotional advertisement sections (${filteredSections.length} configured sections)`,
      headers: ['Sr.No.', 'Section Name', 'Images Selected', 'Layout', 'Status', 'Updated Date'],
      rows: filteredSections.map((sec, idx) => [
        idx + 1,
        sec.name,
        `${sec.images.length} / ${sec.maxImages} Images`,
        sec.id === 'section-1' ? '3 Images Slot (First Triple Grid)' : '3 Images Slot (Second Triple Grid)',
        sec.status,
        sec.updatedAt || '26 Sep 2026',
      ]),
    });
    showToast('Generated Advertisements report PDF.', 'info');
  };

  // Overview metrics
  const totalBannersLoaded = sections.reduce((acc, s) => acc + s.images.length, 0);
  const activeSectionsCount = sections.filter((s) => s.status === 'Active').length;

  // Table Columns
  const columns: Column<AdSectionItem>[] = [
    // 1. Sr.No.
    {
      key: 'srNo',
      header: 'Sr.No.',
      width: '70px',
      render: (_, idx) => (
        <span style={{ fontWeight: 700, color: '#64748b', fontSize: '0.85rem' }}>
          #{(idx ?? 0) + 1}
        </span>
      ),
    },

    // 2. Action
    {
      key: 'action',
      header: 'Action',
      width: '100px',
      render: (sec) => (
        <div className="table-action-btns">
          <button
            type="button"
            className="btn-icon-action"
            title="Edit Advertisement in Form Page"
            onClick={() => navigate(`/admin/home/advertisements/edit/${sec.id}`)}
            aria-label={`Edit ${sec.name}`}
          >
            <i className="fa-solid fa-pen-to-square" style={{ color: '#0d9488' }} />
          </button>
          <button
            type="button"
            className="btn-icon-action"
            title={sec.status === 'Active' ? 'Deactivate Section' : 'Activate Section'}
            onClick={() => handleToggleStatus(sec)}
            aria-label="Toggle section status"
          >
            <i
              className={`fa-solid ${sec.status === 'Active' ? 'fa-toggle-on' : 'fa-toggle-off'}`}
              style={{ color: sec.status === 'Active' ? '#10b981' : '#94a3b8' }}
            />
          </button>
        </div>
      ),
    },

    // 3. Section Name
    {
      key: 'name',
      header: 'Advertisement Section',
      minWidth: '220px',
      render: (sec) => (
        <div>
          <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i
              className={sec.id === 'section-1' ? 'fa-solid fa-layer-group' : 'fa-solid fa-table-columns'}
              style={{ color: '#0d9488' }}
            />
            {sec.name}
          </strong>
          <span style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px', display: 'block' }}>
            {sec.id === 'section-1'
              ? 'First Advertisement (3 Images Limit • Hero Bottom)'
              : 'Second Advertisement (2 Images Limit • Mid-Page)'}
          </span>
        </div>
      ),
    },

    // 4. Images Preview Thumbnail Strip
    {
      key: 'images',
      header: 'Attached Images Preview',
      minWidth: '260px',
      render: (sec) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {sec.images.length === 0 ? (
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
              No images attached
            </span>
          ) : (
            sec.images.map((img, idx) => (
              <div
                key={idx}
                style={{
                  width: '64px',
                  height: '42px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: '1.5px solid #0d9488',
                  background: '#f8fafc',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  flexShrink: 0,
                  position: 'relative',
                }}
                title={`Slot #${idx + 1}`}
              >
                <img
                  src={img}
                  alt={`${sec.name} ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/banner.webp';
                  }}
                />
              </div>
            ))
          )}
        </div>
      ),
    },

    // 5. Image Slots Filled
    {
      key: 'capacity',
      header: 'Images Attached',
      width: '140px',
      render: (sec) => (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.76rem',
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: '12px',
            background: sec.images.length === sec.maxImages ? '#dcfce7' : '#f0fdfa',
            color: sec.images.length === sec.maxImages ? '#15803d' : '#0f766e',
            border: `1px solid ${sec.images.length === sec.maxImages ? '#bbf7d0' : '#ccfbf1'}`,
            whiteSpace: 'nowrap',
          }}
        >
          <i className="fa-regular fa-image" />
          {sec.images.length} of {sec.maxImages} Images
        </span>
      ),
    },

    // 6. Order
    {
      key: 'displayOrder',
      header: 'Order',
      width: '85px',
      render: (sec) => (
        <span
          style={{
            display: 'inline-block',
            fontWeight: 800,
            fontSize: '0.82rem',
            color: '#0f766e',
            background: '#f0fdfa',
            padding: '2px 8px',
            borderRadius: '6px',
            border: '1px solid #ccfbf1',
            textAlign: 'center',
          }}
        >
          #{sec.displayOrder || (sec.id === 'section-1' ? 1 : 2)}
        </span>
      ),
    },

    // 7. Status
    {
      key: 'status',
      header: 'Status',
      width: '100px',
      render: (sec) => (
        <span className={`admin-badge ${sec.status === 'Active' ? 'badge-success' : 'badge-secondary'}`}>
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: sec.status === 'Active' ? '#22c55e' : '#94a3b8',
              display: 'inline-block',
            }}
          />
          {sec.status}
        </span>
      ),
    },

    // 7. Date
    {
      key: 'updatedAt',
      header: 'Date',
      width: '130px',
      render: (sec) => (
        <span style={{ fontSize: '0.82rem', color: '#64748b', whiteSpace: 'nowrap' }}>
          {sec.updatedAt || '26 Sep 2026'}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Home Advertisements"
      subtitle={`Promotional advertisement sections management (${sections.length} sections configured)`}
    >
      {/* 3 Metric Stat KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
          marginBottom: '18px',
        }}
      >
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '14px 18px',
            border: '1.5px solid #ccfbf1',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: '#f0fdfa',
              color: '#0d9488',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              flexShrink: 0,
            }}
          >
            <i className="fa-solid fa-bullhorn" />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              {sections.length}
            </div>
            <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>
              Advertisement Sections
            </div>
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '14px 18px',
            border: '1.5px solid #bbf7d0',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: '#f0fdf4',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              flexShrink: 0,
            }}
          >
            <i className="fa-solid fa-circle-check" />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              {activeSectionsCount} Active
            </div>
            <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>
              Published Live on Storefront
            </div>
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '14px 18px',
            border: '1.5px solid #e0e7ff',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: '#eef2ff',
              color: '#6366f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              flexShrink: 0,
            }}
          >
            <i className="fa-solid fa-images" />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              {totalBannersLoaded}
            </div>
            <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>
              Attached Promo Images
            </div>
          </div>
        </div>
      </div>

      {/* ── Table Card Listing ── */}
      <div className="admin-card">
        {/* Card Toolbar */}
        <div className="card-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search advertisement section..."
              width="280px"
            />

            <select
              className="table-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by Status"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-export-csv"
              onClick={handleExportCSV}
              title="Export Advertisements to CSV spreadsheet"
            >
              <i className="fa-solid fa-file-csv" /> Export CSV
            </button>

            <button
              type="button"
              className="btn-export-pdf"
              onClick={handleExportPDF}
              title="Export Advertisements to PDF report"
            >
              <i className="fa-solid fa-file-pdf" /> Export PDF
            </button>

            <button
              type="button"
              className="btn-admin-primary"
              onClick={() => navigate('/admin/home/advertisements/create')}
              title="Add / Configure Advertisements"
            >
              <i className="fa-solid fa-plus" /> Add Advertisement
            </button>
          </div>
        </div>

        {/* Master Data Table */}
        <DataTable
          columns={columns}
          data={filteredSections}
          keyExtractor={(sec) => sec.id}
          emptyMessage="No advertisement sections match your search or filter."
        />
      </div>
    </AdminLayout>
  );
};

export default HomeAdList;
