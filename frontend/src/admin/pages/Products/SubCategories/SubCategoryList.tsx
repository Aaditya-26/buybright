/**
 * BuyBright Admin — Sub-Categories List Page.
 * Secondary taxonomy management mapped to parent dental specialties.
 * Uses dedicated navigate-to-form pattern with DataTable and PDF/CSV export.
 * Clean, responsive design powered by external SCSS styles.
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { DataTable, type Column } from '../../../components/DataTable';
import { SearchBar } from '../../../components/SearchBar';
import { getSubCategories, saveSubCategories } from '../../../data/subCategoriesData';
import { getCategories } from '../../../data/productsData';
import type { AdminSubCategory } from '../../../types/product';
import { useToast } from '../../../../context/ToastContext';
import { exportTableToPDF } from '../../../utils/exportPdf';
import { exportTableToCSV } from '../../../utils/exportCsv';

export const SubCategoryList: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [subcategories, setSubcategories] = useState<AdminSubCategory[]>(() => getSubCategories());
  const [categories] = useState(() => getCategories());
  const [searchQuery, setSearchQuery] = useState('');
  const [parentFilter, setParentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredSubcategories = useMemo(() => {
    return subcategories.filter((sc) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        sc.name.toLowerCase().includes(q) ||
        sc.slug.toLowerCase().includes(q) ||
        sc.parentCategoryName.toLowerCase().includes(q);

      const matchParent = parentFilter === 'All' || sc.parentCategoryName === parentFilter;
      const matchStatus = statusFilter === 'All' || sc.status === statusFilter;

      return matchSearch && matchParent && matchStatus;
    });
  }, [subcategories, searchQuery, parentFilter, statusFilter]);

  const handleToggleStatus = (sc: AdminSubCategory) => {
    const updatedStatus: AdminSubCategory['status'] = sc.status === 'Active' ? 'Inactive' : 'Active';
    const updated = subcategories.map((item) => (item.id === sc.id ? { ...item, status: updatedStatus } : item));
    setSubcategories(updated);
    saveSubCategories(updated);
    showToast(`Sub-category "${sc.name}" status updated to ${updatedStatus}.`, 'info');
  };

  const handleExportCSV = () => {
    exportTableToCSV({
      filename: `subcategories-${new Date().toISOString().slice(0, 10)}`,
      headers: ['Sr.No.', 'Sub-Category', 'Parent Specialty', 'Slug', 'Order', 'Linked Products', 'Status'],
      rows: filteredSubcategories.map((sc, idx) => [
        idx + 1,
        sc.name,
        sc.parentCategoryName,
        sc.slug,
        sc.displayOrder ?? sc.order ?? 1,
        `${sc.totalProducts || 0} SKUs`,
        sc.status,
      ]),
    });
    showToast('Sub-categories CSV report exported.', 'success');
  };

  const handleExportPDF = () => {
    exportTableToPDF({
      title: 'BuyBright Sub-Categories Directory',
      subtitle: `Sub-specialty taxonomy and parent category mapping (${filteredSubcategories.length} total)`,
      headers: ['Sr.No.', 'Sub-Category', 'Parent Specialty', 'Slug', 'Order', 'Status'],
      rows: filteredSubcategories.map((sc, idx) => [
        idx + 1,
        sc.name,
        sc.parentCategoryName,
        sc.slug,
        sc.displayOrder ?? sc.order ?? 1,
        sc.status,
      ]),
    });
    showToast('Sub-categories PDF report exported.', 'success');
  };

  const totalSKUs = subcategories.reduce((acc, sc) => acc + (sc.totalProducts || 0), 0);
  const uniqueParents = new Set(subcategories.map((sc) => sc.parentCategoryName)).size;

  const stats = [
    { label: 'Sub-Categories', value: subcategories.length, icon: 'fa-solid fa-sitemap', theme: 'stat-theme-teal' },
    { label: 'Active Taxonomy', value: subcategories.filter((sc) => sc.status === 'Active').length, icon: 'fa-solid fa-circle-check', theme: 'stat-theme-green' },
    { label: 'Parent Specialties', value: uniqueParents, icon: 'fa-solid fa-layer-group', theme: 'stat-theme-indigo' },
    { label: 'Catalog SKUs', value: totalSKUs, icon: 'fa-solid fa-boxes-stacked', theme: 'stat-theme-orange' },
  ];

  const columns: Column<AdminSubCategory>[] = [
    {
      key: 'actions',
      header: 'Action',
      width: '80px',
      render: (sc) => (
        <div className="table-action-btns">
          <button
            type="button"
            className="btn-icon-action"
            title="Edit Sub-Category"
            onClick={() => navigate(`/admin/products/subcategories/edit/${sc.id}`)}
          >
            <i className="fa-solid fa-pen-to-square" />
          </button>
          <button
            type="button"
            className="btn-icon-action"
            title={sc.status === 'Active' ? 'Deactivate' : 'Activate'}
            onClick={() => handleToggleStatus(sc)}
          >
            <i
              className={`fa-solid ${sc.status === 'Active' ? 'fa-toggle-on' : 'fa-toggle-off'}`}
            />
          </button>
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Sub-Category',
      render: (sc) => (
        <div className="subcat-table-item">
          <div className="subcat-table-thumb">
            {sc.image ? (
              <img
                src={sc.image}
                alt={sc.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=400&q=80';
                }}
              />
            ) : (
              <i className="fa-solid fa-tag" />
            )}
          </div>
          <div className="subcat-table-info">
            <strong>{sc.name}</strong>
            <div className="subcat-table-slug">/{sc.slug}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'parent',
      header: 'Parent Category',
      render: (sc) => (
        <span className="subcat-parent-badge">
          <i className="fa-solid fa-layer-group" />
          {sc.parentCategoryName}
        </span>
      ),
    },
    {
      key: 'order',
      header: 'Order',
      width: '80px',
      render: (sc) => (
        <span className="subcat-order-badge">
          #{sc.displayOrder ?? sc.order ?? 1}
        </span>
      ),
    },
     
    {
      key: 'status',
      header: 'Status',
      width: '90px',
      render: (sc) => (
        <span className={`subcat-status-pill ${sc.status === 'Active' ? 'active' : 'inactive'}`}>
          {sc.status}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Product Sub-Categories"
      subtitle={`Managing ${subcategories.length} granular taxonomy subdivisions mapped across parent specialties`}
    >
      {/* ── Responsive Stat Cards ── */}
      <div className="subcat-stats-grid">
        {stats.map((s) => (
          <div key={s.label} className={`subcat-stat-card ${s.theme}`}>
            <div className="subcat-stat-icon-wrap">
              <i className={s.icon} />
            </div>
            <div>
              <div className="subcat-stat-val">{s.value}</div>
              <div className="subcat-stat-lbl">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        {/* ── Toolbar ── */}
        <div className="card-toolbar">
          <div className="subcat-toolbar-wrap">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search subcategory, slug, parent…"
              width="250px"
            />
            <select
              className="table-filter-select"
              value={parentFilter}
              onChange={(e) => setParentFilter(e.target.value)}
            >
              <option value="All">All Parent Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
            <select
              className="table-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            {(searchQuery || parentFilter !== 'All' || statusFilter !== 'All') && (
              <button
                type="button"
                className="btn-admin-secondary"
                onClick={() => { setSearchQuery(''); setParentFilter('All'); setStatusFilter('All'); }}
                title="Reset filters"
              >
                <i className="fa-solid fa-arrow-rotate-left" /> Reset
              </button>
            )}
            <button
              type="button"
              className="btn-export-csv"
              onClick={handleExportCSV}
              title="Download Sub-Categories CSV"
            >
              <i className="fa-solid fa-file-csv" /> Export CSV
            </button>
            <button
              type="button"
              className="btn-export-pdf"
              onClick={handleExportPDF}
              title="Download Sub-Categories PDF"
            >
              <i className="fa-solid fa-file-pdf" /> Export PDF
            </button>
          </div>
          <button
            type="button"
            className="btn-admin-primary"
            onClick={() => navigate('/admin/products/subcategories/create')}
          >
            <i className="fa-solid fa-plus" /> Add Sub-Category
          </button>
        </div>

        {/* ── Data Table ── */}
        <DataTable
          columns={columns}
          data={filteredSubcategories}
          keyExtractor={(sc) => sc.id}
          emptyMessage="No sub-categories found matching your criteria."
        />
      </div>
    </AdminLayout>
  );
};

export default SubCategoryList;
