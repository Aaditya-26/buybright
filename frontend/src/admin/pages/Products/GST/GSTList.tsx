/**
 * BuyBright Admin — GST Rates List Page.
 * Central taxation management with auto-split percentages, DataTable, and CSV/PDF export.
 * Clean, responsive design powered by external SCSS styles (no inline styles).
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { DataTable, type Column } from '../../../components/DataTable';
import { SearchBar } from '../../../components/SearchBar';
import { getGSTRates, saveGSTRates } from '../../../data/gstData';
import type { AdminGSTRate } from '../../../types/gst';
import { useToast } from '../../../../context/ToastContext';
import { exportTableToPDF } from '../../../utils/exportPdf';
import { exportTableToCSV } from '../../../utils/exportCsv';

export const GSTList: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [gstRates, setGstRates] = useState<AdminGSTRate[]>(() => getGSTRates());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredRates = useMemo(() => {
    return gstRates.filter((r) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        r.rateLabel.toLowerCase().includes(q) ||
        r.totalGst.toString().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q));

      const matchStatus = statusFilter === 'All' || r.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [gstRates, searchQuery, statusFilter]);

  const handleToggleStatus = (rate: AdminGSTRate) => {
    const updatedStatus: AdminGSTRate['status'] = rate.status === 'Active' ? 'Inactive' : 'Active';
    const updated = gstRates.map((item) => (item.id === rate.id ? { ...item, status: updatedStatus } : item));
    setGstRates(updated);
    saveGSTRates(updated);
    showToast(`GST Rate "${rate.rateLabel}" status updated to ${updatedStatus}.`, 'info');
  };

  const handleExportCSV = () => {
    exportTableToCSV({
      filename: `gst-rates-${new Date().toISOString().slice(0, 10)}`,
      headers: ['Sr.No.', 'Rate Label', 'Total GST (%)', 'CGST (%)', 'SGST (%)', 'IGST (%)', 'Description', 'Status'],
      rows: filteredRates.map((r, idx) => [
        idx + 1,
        r.rateLabel,
        `${r.totalGst}%`,
        `${r.cgst}%`,
        `${r.sgst}%`,
        `${r.igst}%`,
        r.description || '',
        r.status,
      ]),
    });
    showToast('GST Rates CSV report exported.', 'success');
  };

  const handleExportPDF = () => {
    exportTableToPDF({
      title: 'BuyBright GST Taxation Directory',
      subtitle: `Central and state goods & services tax slabs (${filteredRates.length} total)`,
      headers: ['Sr.No.', 'Rate Label', 'Total GST', 'CGST (50%)', 'SGST (50%)', 'IGST (100%)', 'Status'],
      rows: filteredRates.map((r, idx) => [
        idx + 1,
        r.rateLabel,
        `${r.totalGst}%`,
        `${r.cgst}%`,
        `${r.sgst}%`,
        `${r.igst}%`,
        r.status,
      ]),
    });
    showToast('GST Rates PDF report exported.', 'success');
  };

  const columns: Column<AdminGSTRate>[] = [
    {
      key: 'actions',
      header: 'Action',
      width: '90px',
      minWidth: '90px',
      render: (r) => (
        <div className="table-action-btns">
          <button
            type="button"
            className="btn-icon-action"
            title="Edit GST Rate"
            onClick={() => navigate(`/admin/products/gst/edit/${r.id}`)}
          >
            <i className="fa-solid fa-pen-to-square" />
          </button>
          <button
            type="button"
            className="btn-icon-action"
            title={r.status === 'Active' ? 'Deactivate' : 'Activate'}
            onClick={() => handleToggleStatus(r)}
          >
            <i
              className={`fa-solid ${r.status === 'Active' ? 'fa-toggle-on' : 'fa-toggle-off'}`}
            />
          </button>
        </div>
      ),
    },
    {
      key: 'rateLabel',
      header: 'Rate Label',
      width: '210px',
      minWidth: '180px',
      render: (r) => (
        <div className="gst-table-rate-wrap">
          <div className="gst-table-icon">
            <i className="fa-solid fa-percent" />
          </div>
          <div>
            <span className="gst-table-label-text">{r.rateLabel}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'totalGst',
      header: 'Total GST',
      width: '110px',
      minWidth: '100px',
      render: (r) => (
        <span className="gst-badge-pill total">
          {r.totalGst}%
        </span>
      ),
    },
    {
      key: 'cgst',
      header: 'CGST (Auto)',
      width: '110px',
      minWidth: '100px',
      render: (r) => (
        <span className="gst-badge-pill cgst">
          {r.cgst}%
        </span>
      ),
    },
    {
      key: 'sgst',
      header: 'SGST (Auto)',
      width: '110px',
      minWidth: '100px',
      render: (r) => (
        <span className="gst-badge-pill sgst">
          {r.sgst}%
        </span>
      ),
    },
    {
      key: 'igst',
      header: 'IGST (Auto)',
      width: '110px',
      minWidth: '100px',
      render: (r) => (
        <span className="gst-badge-pill igst">
          {r.igst}%
        </span>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      width: '250px',
      minWidth: '200px',
      className: 'gst-desc-col',
      render: (r) => (
        <div className="gst-desc-text">
          {r.description || '—'}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '120px',
      minWidth: '120px',
      className: 'gst-status-col',
      render: (r) => (
        <span className={`gst-status-pill ${r.status === 'Active' ? 'active' : 'inactive'}`}>
          {r.status}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout
      title="GST Tax Rates"
      subtitle="Manage central goods and services tax rates with automated 50/50 intra-state and inter-state tax split"
    >
      <div className="admin-card">
        {/* ── Toolbar ── */}
        <div className="card-toolbar">
          <div className="gst-toolbar-wrap">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search rate label, %, desc…"
              width="250px"
            />
            <select
              className="table-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            {(searchQuery || statusFilter !== 'All') && (
              <button
                type="button"
                className="btn-admin-secondary"
                onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}
                title="Reset filters"
              >
                <i className="fa-solid fa-arrow-rotate-left" /> Reset
              </button>
            )}
            <button
              type="button"
              className="btn-export-csv"
              onClick={handleExportCSV}
              title="Download GST Rates CSV"
            >
              <i className="fa-solid fa-file-csv" /> Export CSV
            </button>
            <button
              type="button"
              className="btn-export-pdf"
              onClick={handleExportPDF}
              title="Download GST Rates PDF"
            >
              <i className="fa-solid fa-file-pdf" /> Export PDF
            </button>
          </div>
          <button
            type="button"
            className="btn-admin-primary"
            onClick={() => navigate('/admin/products/gst/create')}
          >
            <i className="fa-solid fa-plus" /> Add GST Rate
          </button>
        </div>

        {/* ── Data Table ── */}
        <DataTable
          columns={columns}
          data={filteredRates}
          keyExtractor={(r) => r.id}
          tableClassName="gst-table"
          emptyMessage="No GST rates found matching your criteria."
        />
      </div>
    </AdminLayout>
  );
};

export default GSTList;
