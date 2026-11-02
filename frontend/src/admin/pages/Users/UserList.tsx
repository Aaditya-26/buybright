/**
 * BuyBright Admin User Management Page.
 * Subpage for All Users in the User / Role Module.
 * Table columns: Action | Sr.No. | User Name | Email Id | Contact No. | Role | Date | Status
 * Features: Reusable DataTable, Search, Filters, Dedicated Form Page Navigation, and Export PDF.
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { DataTable, type Column } from '../../components/DataTable';
import { SearchBar } from '../../components/SearchBar';
import { Pagination } from '../../components/Pagination';
import { getSystemUsers, getRoles } from '../../data/usersData';
import type { SystemUser } from '../../types/user';
import { useToast } from '../../../context/ToastContext';
import { exportTableToPDF } from '../../utils/exportPdf';
import { exportTableToCSV } from '../../utils/exportCsv';

export const UserList: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [users] = useState<SystemUser[]>(() => getSystemUsers());
  const roles = useMemo(() => getRoles(), []);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filtered Users based on search query, role, and status
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        u.userName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.contactNo.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q);

      const matchRole = roleFilter === 'All' || u.role === roleFilter;
      const matchStatus = statusFilter === 'All' || u.status === statusFilter;

      return matchSearch && matchRole && matchStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // Export to CSV
  const handleExportCSV = () => {
    exportTableToCSV({
      filename: `users_list_${new Date().toISOString().slice(0, 10)}.csv`,
      headers: ['Sr.No.', 'User Name', 'Email Id', 'Contact No.', 'Role', 'Date', 'Status'],
      rows: filteredUsers.map((u, idx) => [
        idx + 1,
        u.userName,
        u.email,
        u.contactNo,
        u.role,
        u.date,
        u.status,
      ]),
    });
    showToast('Users CSV report exported successfully.', 'success');
  };

  // Export to PDF
  const handleExportPDF = () => {
    exportTableToPDF({
      title: 'Administrative Users Report',
      subtitle: `System users summary (${filteredUsers.length} total records)`,
      headers: ['Sr.No.', 'User Name', 'Email Id', 'Contact No.', 'Role', 'Date', 'Status'],
      rows: filteredUsers.map((u, idx) => [
        idx + 1,
        u.userName,
        u.email,
        u.contactNo,
        u.role,
        u.date,
        u.status,
      ]),
    });
    showToast('Opening PDF export preview...', 'info');
  };

  // Role Badge Class Helper
  const getRoleBadgeClass = (role: string) => {
    if (role.includes('Super')) return 'role-super-admin';
    if (role.includes('Quality') || role.includes('Dental') || role.includes('Specialist') || role.includes('Clinical')) return 'role-quality';
    if (role.includes('Inventory')) return 'role-inventory';
    if (role.includes('Order')) return 'role-orders';
    if (role.includes('Support')) return 'role-support';
    if (role.includes('Finance')) return 'role-finance';
    return 'role-admin';
  };

  // Table Columns:
  // Action | Sr.No. | User Name | Email Id | Contact No. | Role | Date | Status
  const columns: Column<SystemUser>[] = [
    {
      key: 'action',
      header: 'Action',
      width: '80px',
      render: (u) => (
        <div className="table-action-btns">
          <button
            type="button"
            className="btn-icon-action"
            title="Edit User"
            onClick={() => navigate(`/admin/users/edit/${u.id}`)}
            aria-label={`Edit ${u.userName}`}
          >
            <i className="fa-solid fa-pen-to-square" style={{ color: '#0d9488' }} />
          </button>
        </div>
      ),
    },
    {
      key: 'srNo',
      header: 'Sr.No.',
      width: '80px',
      render: (u, idx) => (
        <span style={{ fontWeight: 700, color: '#64748b', fontSize: '0.85rem' }}>
          #{u.srNo || idx + 1}
        </span>
      ),
    },
    {
      key: 'userName',
      header: 'User Name',
      render: (u) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {u.profileImage ? (
            <img
              src={u.profileImage}
              alt={u.userName}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid #0d9488',
                flexShrink: 0,
              }}
            />
          ) : (
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#ccfbf1',
                color: '#0f766e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.78rem',
                flexShrink: 0,
              }}
            >
              {u.avatar || u.userName.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <strong style={{ display: 'block', fontSize: '0.86rem', color: '#0f172a' }}>
              {u.userName}
            </strong>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email Id',
      render: (u) => (
        <span style={{ fontSize: '0.84rem', color: '#334155' }}>
          {u.email}
        </span>
      ),
    },
    {
      key: 'contactNo',
      header: 'Contact No.',
      render: (u) => (
        <span style={{ fontSize: '0.84rem', color: '#475569', whiteSpace: 'nowrap' }}>
          {u.contactNo}
        </span>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (u) => (
        <span className={`role-badge ${getRoleBadgeClass(u.role)}`}>
          <i className="fa-solid fa-shield-halved" />
          {u.role}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (u) => (
        <span style={{ fontSize: '0.82rem', color: '#64748b', whiteSpace: 'nowrap' }}>
          {u.date}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (u) => {
        let badgeClass = 'badge-success';
        if (u.status === 'Inactive') badgeClass = 'badge-secondary';
        else if (u.status === 'Pending') badgeClass = 'badge-warning';

        return (
          <span className={`admin-badge ${badgeClass}`}>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: u.status === 'Active' ? '#22c55e' : '#94a3b8',
                display: 'inline-block',
              }}
            />
            {u.status}
          </span>
        );
      },
    },
  ];

  return (
    <AdminLayout title="All Users" subtitle={`System users directory (${users.length} users)`}>
      <div className="admin-card">
        {/* Card Toolbar with Search, Role Filter, Status Filter & Action Buttons */}
        <div className="card-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <SearchBar
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val);
                setCurrentPage(1);
              }}
              placeholder="Search user name, email, contact..."
              width="260px"
            />

            {/* Role Filter */}
            <select
              className="table-filter-select"
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by Role"
            >
              <option value="All">All Roles</option>
              {roles.map((r) => (
                <option key={r.id} value={r.roleName}>
                  {r.roleName}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              className="table-filter-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by Status"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            {(searchQuery || roleFilter !== 'All' || statusFilter !== 'All') && (
              <button
                type="button"
                className="btn-admin-secondary"
                onClick={() => {
                  setSearchQuery('');
                  setRoleFilter('All');
                  setStatusFilter('All');
                  setCurrentPage(1);
                }}
                style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                title="Reset search and filters"
              >
                <i className="fa-solid fa-arrow-rotate-left" /> Reset
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="btn-export-csv"
              onClick={handleExportCSV}
              title="Export Users list to CSV"
            >
              <i className="fa-solid fa-file-csv" /> Export CSV
            </button>

            <button
              type="button"
              className="btn-export-pdf"
              onClick={handleExportPDF}
              title="Export Users list to PDF"
            >
              <i className="fa-solid fa-file-pdf" /> Export PDF
            </button>

            <button
              type="button"
              className="btn-admin-primary"
              onClick={() => navigate('/admin/users/create')}
            >
              <i className="fa-solid fa-user-plus" /> Add New User
            </button>
          </div>
        </div>

        {/* Reusable Data Table */}
        <DataTable
          columns={columns}
          data={paginatedUsers}
          keyExtractor={(u) => u.id}
          emptyMessage="No administrative users match your filter criteria."
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={filteredUsers.length}
          onPageChange={setCurrentPage}
        />
      </div>
    </AdminLayout>
  );
};

export default UserList;
