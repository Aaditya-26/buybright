/**
 * BuyBright Admin — HSN Codes List Page.
 * Directory of Harmonized System of Nomenclature codes with mapped GST rates, DataTable, and CSV/PDF export.
 * Clean, responsive design powered by external SCSS styles (zero inline styles).
 * Route: /admin/products/hsn
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { DataTable, type Column } from '../../../components/DataTable';
import { SearchBar } from '../../../components/SearchBar';
import { getHSNCodes, saveHSNCodes } from '../../../data/hsnData';
import type { AdminHSNCode } from '../../../types/hsn';
import { useToast } from '../../../../context/ToastContext';
import { exportTableToPDF } from '../../../utils/exportPdf';
import { exportTableToCSV } from '../../../utils/exportCsv';

export const HSNList: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [hsnCodes, setHsnCodes] = useState<AdminHSNCode[]>(() => getHSNCodes());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredCodes = useMemo(() => {
    return hsnCodes.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.hsnCode.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.gstRateLabel && item.gstRateLabel.toLowerCase().includes(q));

      const matchStatus = statusFilter === 'All' || item.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [hsnCodes, searchQuery, statusFilter]);

  const handleToggleStatus = (item: AdminHSNCode) => {
    const updatedStatus: AdminHSNCode['status'] = item.status === 'Active' ? 'Inactive' : 'Active';
    const updated = hsnCodes.map((c) => (c.id === item.id ? { ...c, status: updatedStatus } : c));
    setHsnCodes(updated);
    saveHSNCodes(updated);
    showToast(`HSN Code "${item.hsnCode}" status updated to ${updatedStatus}.`, 'info');
  };

  const handleExportCSV = () => {
    exportTableToCSV({
      filename: `hsn-codes-${new Date().toISOString().slice(0, 10)}`,
      headers: ['Sr.No.', 'HSN Code', 'Description', 'Mapped GST Rate', 'CGST (%)', 'SGST (%)', 'IGST (%)', 'Status'],
      rows: filteredCodes.map((item, idx) => [
        idx + 1,
        item.hsnCode,
        item.description,
        item.gstRateLabel || 'Not Mapped',
        item.cgst !== undefined ? `${item.cgst}%` : '—',
        item.sgst !== undefined ? `${item.sgst}%` : '—',
        item.igst !== undefined ? `${item.igst}%` : '—',
        item.status,
      ]),
    });
    showToast('HSN Codes CSV report exported.', 'success');
  };

  const handleExportPDF = () => {
    exportTableToPDF({
      title: 'BuyBright HSN Codes Directory',
      subtitle: `Harmonized System of Nomenclature taxation registry (${filteredCodes.length} codes)`,
      headers: ['Sr.No.', 'HSN Code', 'Description', 'Mapped GST', 'Total GST', 'Status'],
      rows: filteredCodes.map((item, idx) => [
        idx + 1,
        item.hsnCode,
        item.description,
        item.gstRateLabel || 'Not Mapped',
        item.totalGst !== undefined ? `${item.totalGst}%` : '—',
        item.status,
      ]),
    });
    showToast('HSN Codes PDF report exported.', 'success');
  };

  const columns: Column<AdminHSNCode>[] = [
    {
      key: 'actions',
      header: 'Action',
      width: '90px',
      minWidth: '90px',
      render: (item) => (
        <div className="table-action-btns">
          <button
            type="button"
            className="btn-icon-action"
            title="Edit HSN Code"
            onClick={() => navigate(`/admin/products/hsn/edit/${item.id}`)}
          >
            <i className="fa-solid fa-pen-to-square" />
          </button>
          <button
            type="button"
            className="btn-icon-action"
            title={item.status === 'Active' ? 'Deactivate' : 'Activate'}
            onClick={() => handleToggleStatus(item)}
          >
            <i
              className={`fa-solid ${item.status === 'Active' ? 'fa-toggle-on' : 'fa-toggle-off'}`}
            />
          </button>
        </div>
      ),
    },
    {
      key: 'hsnCode',
      header: 'HSN Code',
      width: '140px',
      minWidth: '130px',
      render: (item) => (
        <div className="hsn-code-badge-wrap">
          <i className="fa-solid fa-barcode" />
          <span className="hsn-code-badge">{item.hsnCode}</span>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      width: '260px',
      minWidth: '220px',
      className: 'hsn-desc-col',
      render: (item) => (
        <div className="hsn-desc-text">
          {item.description}
        </div>
      ),
    },
    {
      key: 'gstRate',
      header: 'Mapped GST Rate',
      width: '200px',
      minWidth: '180px',
      render: (item) => (
        item.gstRateLabel ? (
          <span className="hsn-rate-mapped-badge">
            <i className="fa-solid fa-receipt" /> {item.gstRateLabel}
          </span>
        ) : (
          <span className="hsn-rate-unmapped-badge">
            Not Mapped
          </span>
        )
      ),
    },
    {
      key: 'cgst',
      header: 'CGST (Auto)',
      width: '110px',
      minWidth: '100px',
      render: (item) => (
        <span className="gst-badge-pill cgst">
          {item.cgst !== undefined ? `${item.cgst}%` : '—'}
        </span>
      ),
    },
    {
      key: 'sgst',
      header: 'SGST (Auto)',
      width: '110px',
      minWidth: '100px',
      render: (item) => (
        <span className="gst-badge-pill sgst">
          {item.sgst !== undefined ? `${item.sgst}%` : '—'}
        </span>
      ),
    },
    {
      key: 'igst',
      header: 'IGST (Auto)',
      width: '110px',
      minWidth: '100px',
      render: (item) => (
        <span className="gst-badge-pill igst">
          {item.igst !== undefined ? `${item.igst}%` : '—'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '120px',
      minWidth: '120px',
      className: 'hsn-status-col',
      render: (item) => (
        <span className={`gst-status-pill ${item.status === 'Active' ? 'active' : 'inactive'}`}>
          {item.status}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout
      title="HSN Codes Directory"
      subtitle="Manage 8-digit Harmonized System of Nomenclature codes with mapped GST taxation slabs"
    >
      <div className="admin-card">
        {/* ── Toolbar ── */}
        <div className="card-toolbar">
          <div className="gst-toolbar-wrap">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search HSN code, description, rate…"
              width="260px"
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
              title="Download HSN Codes CSV"
            >
              <i className="fa-solid fa-file-csv" /> Export CSV
            </button>
            <button
              type="button"
              className="btn-export-pdf"
              onClick={handleExportPDF}
              title="Download HSN Codes PDF"
            >
              <i className="fa-solid fa-file-pdf" /> Export PDF
            </button>
          </div>
          <button
            type="button"
            className="btn-admin-primary"
            onClick={() => navigate('/admin/products/hsn/create')}
          >
            <i className="fa-solid fa-plus" /> Add HSN Code
          </button>
        </div>

        {/* ── Data Table ── */}
        <DataTable
          columns={columns}
          data={filteredCodes}
          keyExtractor={(item) => item.id}
          tableClassName="hsn-table"
          emptyMessage="No HSN codes found matching your criteria."
        />
      </div>
    </AdminLayout>
  );
};

export default HSNList;
