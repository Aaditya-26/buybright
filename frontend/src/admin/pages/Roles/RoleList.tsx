/**
 * RoleList Page.
 * BuyBright Admin Role Management Page.
 * Table columns: Action | Sr.No. | Role Name
 * Reusable DataTable with dedicated Add/Edit form page navigation and PDF export.
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { DataTable, type Column } from '../../components/DataTable';
import { SearchBar } from '../../components/SearchBar';
import { getRoles } from '../../data/usersData';
import type { RoleItem } from '../../types/user';
import { useToast } from '../../../context/ToastContext';
import { exportTableToPDF } from '../../utils/exportPdf';
import { exportTableToCSV } from '../../utils/exportCsv';

export const RoleList: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [roles] = useState<RoleItem[]>(() => getRoles());
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered roles based on search
  const filteredRoles = useMemo(() => {
    return roles.filter((r) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        r.roleName.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q))
      );
    });
  }, [roles, searchQuery]);

  // Table columns: Action, Sr.No., Role Name, Date
  const columns: Column<RoleItem>[] = [
    {
      key: 'action',
      header: 'Action',
      width: '90px',
      render: (role) => (
        <div className="table-action-btns">
          <button
            type="button"
            className="btn-icon-action"
            title="Edit Role"
            onClick={() => navigate(`/admin/roles/edit/${role.id}`)}
            aria-label={`Edit ${role.roleName}`}
          >
            <i className="fa-solid fa-pen-to-square" style={{ color: '#0d9488' }} />
          </button>
        </div>
      ),
    },
    {
      key: 'srNo',
      header: 'Sr.No.',
      width: '90px',
      render: (role, idx) => (
        <span style={{ fontWeight: 700, color: '#64748b', fontSize: '0.85rem' }}>
          #{role.srNo || idx + 1}
        </span>
      ),
    },
    {
      key: 'roleName',
      header: 'Role Name',
      render: (role) => (
        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>
          {role.roleName}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (role) => (
        <span style={{ fontSize: '0.82rem', color: '#64748b', whiteSpace: 'nowrap' }}>
          {role.createdAt || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      ),
    },
  ];

  // Export to CSV
  const handleExportCSV = () => {
    exportTableToCSV({
      filename: `roles_list_${new Date().toISOString().slice(0, 10)}.csv`,
      headers: ['Sr.No.', 'Role Name', 'Date', 'Status'],
      rows: filteredRoles.map((r, idx) => [
        idx + 1,
        r.roleName,
        r.createdAt || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        'Active',
      ]),
    });
    showToast('Roles CSV report exported successfully.', 'success');
  };

  const handleExportPDF = () => {
    exportTableToPDF({
      title: 'Administrative Roles',
      subtitle: `System roles summary report (${filteredRoles.length} configured roles)`,
      headers: ['Sr.No.', 'Role Name', 'Date', 'Status'],
      rows: filteredRoles.map((r, idx) => [
        idx + 1,
        r.roleName,
        r.createdAt || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        'Active',
      ]),
    });
    showToast('Opening PDF export preview...', 'info');
  };

  return (
    <AdminLayout title="All Roles" subtitle={`Administrative roles directory (${roles.length} roles)`}>
      <div className="admin-card">
        {/* Card Toolbar */}
        <div className="card-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search role by name..."
              width="280px"
            />
            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Showing <strong>{filteredRoles.length}</strong> roles
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="btn-export-csv"
              onClick={handleExportCSV}
              title="Export Roles list to CSV"
            >
              <i className="fa-solid fa-file-csv" /> Export CSV
            </button>

            <button
              type="button"
              className="btn-export-pdf"
              onClick={handleExportPDF}
              title="Export Roles list to PDF"
            >
              <i className="fa-solid fa-file-pdf" /> Export PDF
            </button>

            <button
              type="button"
              className="btn-admin-primary"
              onClick={() => navigate('/admin/roles/create')}
            >
              <i className="fa-solid fa-plus" /> Add New Role
            </button>
          </div>
        </div>

        {/* Reusable Data Table for Roles */}
        <DataTable
          columns={columns}
          data={filteredRoles}
          keyExtractor={(role) => role.id}
          emptyMessage="No roles matched your search criteria."
        />
      </div>
    </AdminLayout>
  );
};

export default RoleList;
