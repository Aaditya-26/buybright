/**
 * BuyBright Admin — Products List Page.
 * Dental inventory: search, filter, stat cards, DataTable with navigate-to-form pattern.
 * Pattern mirrors HomeBannerList: uses useNavigate for create/edit (no modals).
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { DataTable, type Column } from '../../../components/DataTable';
import { SearchBar } from '../../../components/SearchBar';
import { Pagination } from '../../../components/Pagination';
import { getProducts, saveProducts } from '../../../data/productsData';
import type { AdminProduct } from '../../../types/product';
import { useToast } from '../../../../context/ToastContext';
import { exportTableToPDF } from '../../../utils/exportPdf';
import { exportTableToCSV } from '../../../utils/exportCsv';
import '../ProductsModule.scss';

const CATEGORIES = [
  'All', 'Endodontics', 'Orthodontics', 'Equipment',
  'Consumables', 'Implants', 'Prosthodontics', 'Materials', 'Instruments',
];
const STOCK_STATUSES = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];
const PAGE_SIZE = 8;

export const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [products, setProducts] = useState<AdminProduct[]>(() => getProducts());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStockStatus, setSelectedStockStatus] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  /* ── Filtered Products ── */
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.hsnCode || '').toLowerCase().includes(q);
      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchStock = selectedStockStatus === 'All' || p.stockStatus === selectedStockStatus;
      const matchStatus = selectedStatus === 'All' || p.status === selectedStatus;
      return matchSearch && matchCategory && matchStock && matchStatus;
    });
  }, [products, searchQuery, selectedCategory, selectedStockStatus, selectedStatus]);

  /* ── Pagination ── */
  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, currentPage]);

  /* ── Toggle Status ── */
  const handleToggleStatus = (product: AdminProduct) => {
    const newStatus: AdminProduct['status'] = product.status === 'Active' ? 'Draft' : 'Active';
    const updated = products.map((p) => (p.id === product.id ? { ...p, status: newStatus } : p));
    setProducts(updated);
    saveProducts(updated);
    showToast(`"${product.name}" status changed to ${newStatus}.`, 'info');
  };

  /* ── Export Handlers ── */
  const handleExportCSV = () => {
    exportTableToCSV({
      filename: `products-${new Date().toISOString().slice(0, 10)}`,
      headers: ['Sr.No.', 'Product Name', 'SKU', 'Category', 'Brand', 'Price (₹)', 'MRP (₹)', 'Stock', 'Stock Status', 'Status'],
      rows: filteredProducts.map((p, idx) => [
        idx + 1,
        p.name,
        p.sku,
        p.category,
        p.brand,
        p.price,
        p.mrp,
        p.stock,
        p.stockStatus,
        p.status,
      ]),
    });
    showToast('Products CSV report exported successfully.', 'success');
  };

  const handleExportPDF = () => {
    exportTableToPDF({
      title: 'BuyBright Catalog Products Directory',
      subtitle: `Dental inventory catalog (${filteredProducts.length} items)`,
      headers: ['Sr.No.', 'Product Name', 'SKU', 'Category', 'Brand', 'Price (₹)', 'Stock', 'Status'],
      rows: filteredProducts.map((p, idx) => [
        idx + 1,
        p.name,
        p.sku,
        p.category,
        p.brand,
        `₹${p.price.toLocaleString('en-IN')}`,
        p.stock,
        p.status,
      ]),
    });
    showToast('Products PDF report exported successfully.', 'success');
  };

  /* ── Stat summary ── */
  const stats = [
    { label: 'Total SKUs', value: products.length, icon: 'fa-solid fa-box', color: '#0d9488', bg: '#f0fdfa', border: '#ccfbf1' },
    { label: 'In Stock', value: products.filter((p) => p.stockStatus === 'In Stock').length, icon: 'fa-solid fa-circle-check', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
    { label: 'Low Stock', value: products.filter((p) => p.stockStatus === 'Low Stock').length, icon: 'fa-solid fa-triangle-exclamation', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
    { label: 'Out of Stock', value: products.filter((p) => p.stockStatus === 'Out of Stock').length, icon: 'fa-solid fa-ban', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  ];

  /* ── Table Columns ── */
  const columns: Column<AdminProduct>[] = [
    {
      key: 'actions',
      header: 'Action',
      width: '90px',
      minWidth: '90px',
      render: (p) => (
        <div className="table-action-btns">
          <button
            type="button"
            className="btn-icon-action"
            title="Edit Product"
            onClick={() => navigate(`/admin/products/edit/${p.id}`)}
          >
            <i className="fa-solid fa-pen-to-square" style={{ color: '#0d9488' }} />
          </button>
          <button
            type="button"
            className="btn-icon-action"
            title={p.status === 'Active' ? 'Deactivate' : 'Activate'}
            onClick={() => handleToggleStatus(p)}
          >
            <i
              className={`fa-solid ${p.status === 'Active' ? 'fa-toggle-on' : 'fa-toggle-off'}`}
              style={{ color: p.status === 'Active' ? '#10b981' : '#94a3b8' }}
            />
          </button>
        </div>
      ),
    },
    {
      key: 'product',
      header: 'Product & SKU',
      minWidth: '240px',
      render: (p) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={p.image}
            alt={p.name}
            style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e2e8f0', flexShrink: 0 }}
            onError={(e) => { (e.target as HTMLImageElement).src = '/images/banner.webp'; }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap', marginBottom: '2px' }}>
              <strong style={{ fontSize: '0.85rem', color: '#0f172a', lineHeight: 1.3 }}>{p.name}</strong>
              {p.is_bestseller && (
                <span style={{ fontSize: '0.62rem', background: '#fef3c7', color: '#b45309', padding: '1px 5px', borderRadius: '3px', fontWeight: 800, flexShrink: 0 }}>
                  BESTSELLER
                </span>
              )}
              {p.is_spotlight && (
                <span style={{ fontSize: '0.62rem', background: '#ede9fe', color: '#6d28d9', padding: '1px 5px', borderRadius: '3px', fontWeight: 800, flexShrink: 0 }}>
                  SPOTLIGHT
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.73rem', color: '#0d9488', fontWeight: 700 }}>SKU: {p.sku}</span>
              {p.size && <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>· {p.size}</span>}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category / Brand',
      width: '140px',
      minWidth: '130px',
      render: (p) => (
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>{p.category}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.brand}</div>
        </div>
      ),
    },
    {
      key: 'pricing',
      header: 'Price / MRP',
      width: '120px',
      minWidth: '110px',
      render: (p) => (
        <div>
          <strong style={{ color: '#0f766e', fontSize: '0.9rem' }}>
            ₹{p.price.toLocaleString('en-IN')}
          </strong>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', textDecoration: 'line-through' }}>
            ₹{p.mrp.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700 }}>
            {Math.round(((p.mrp - p.price) / p.mrp) * 100)}% OFF
          </div>
        </div>
      ),
    },
    {
      key: 'stock',
      header: 'Stock',
      width: '110px',
      minWidth: '100px',
      render: (p) => (
        <div>
          <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{p.stock} pcs</strong>
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              marginTop: '3px',
              color:
                p.stockStatus === 'In Stock' ? '#16a34a'
                : p.stockStatus === 'Low Stock' ? '#d97706'
                : '#dc2626',
            }}
          >
            ● {p.stockStatus}
          </div>
        </div>
      ),
    },
    {
      key: 'tax',
      header: 'HSN / GST',
      width: '110px',
      minWidth: '105px',
      render: (p) => (
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>{p.hsnCode || '—'}</div>
          <div style={{ fontSize: '0.73rem', color: '#64748b' }}>GST: {p.gstRate || '—'}</div>
        </div>
      ),
    },
    {
      key: 'points',
      header: 'Presto Pts',
      width: '95px',
      minWidth: '90px',
      render: (p) => (
        <span style={{ color: '#7e22ce', fontWeight: 700, fontSize: '0.82rem' }}>
          <i className="fa-solid fa-gem" style={{ marginRight: '4px' }} />
          {p.brightPoints}
        </span>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      width: '100px',
      minWidth: '95px',
      render: (p) => (
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
            <i className="fa-solid fa-star" style={{ color: '#f59e0b', marginRight: '3px', fontSize: '0.75rem' }} />
            {Number(p.rating || 0).toFixed(1)}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{p.reviews_count ?? 0} reviews</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '95px',
      minWidth: '90px',
      render: (p) => (
        <span
          style={{
            fontSize: '0.73rem',
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: '20px',
            background: p.status === 'Active' ? '#dcfce7' : p.status === 'Draft' ? '#fef9c3' : '#f1f5f9',
            color: p.status === 'Active' ? '#16a34a' : p.status === 'Draft' ? '#92400e' : '#64748b',
          }}
        >
          {p.status}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Dental Products & Catalog"
      subtitle={`Managing ${products.length} registered dental supply SKUs`}
    >
      <div className="products-admin-wrapper">
        {/* ── Stat Cards ── */}
        <div className="product-stats-grid">
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

        <div className="admin-card" style={{ padding: '0', overflow: 'hidden' }}>
          {/* ── Responsive Toolbar ── */}
          <div className="product-toolbar-wrap">
            <div className="product-toolbar-left">
              <div className="product-search-item">
                <SearchBar
                  value={searchQuery}
                  onChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
                  placeholder="Search name, SKU, brand, HSN…"
                  width="100%"
                />
              </div>
              <select
                className="table-filter-select"
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
                ))}
              </select>
              <select
                className="table-filter-select"
                value={selectedStockStatus}
                onChange={(e) => { setSelectedStockStatus(e.target.value); setCurrentPage(1); }}
              >
                {STOCK_STATUSES.map((s) => (
                  <option key={s} value={s}>{s === 'All' ? 'All Stock' : s}</option>
                ))}
              </select>
              <select
                className="table-filter-select"
                value={selectedStatus}
                onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
              {(searchQuery || selectedCategory !== 'All' || selectedStockStatus !== 'All' || selectedStatus !== 'All') && (
                <button
                  type="button"
                  className="btn-admin-secondary"
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedStockStatus('All'); setSelectedStatus('All'); setCurrentPage(1); }}
                  style={{ padding: '7px 12px', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                  title="Reset filters"
                >
                  <i className="fa-solid fa-arrow-rotate-left" /> Reset
                </button>
              )}
              <div className="product-export-group">
                <button
                  type="button"
                  className="btn-export-csv"
                  onClick={handleExportCSV}
                  title="Download Products CSV"
                >
                  <i className="fa-solid fa-file-csv" /> Export CSV
                </button>
                <button
                  type="button"
                  className="btn-export-pdf"
                  onClick={handleExportPDF}
                  title="Download Products PDF"
                >
                  <i className="fa-solid fa-file-pdf" /> Export PDF
                </button>
              </div>
            </div>
            <button
              type="button"
              className="btn-admin-primary product-add-btn"
              onClick={() => navigate('/admin/products/create')}
            >
              <i className="fa-solid fa-plus" /> Add New Product
            </button>
          </div>

          {/* ── Data Table ── */}
          <DataTable
            columns={columns}
            data={paginatedProducts}
            keyExtractor={(p) => p.id}
            emptyMessage="No dental supplies matching your search or filter criteria."
          />

          {/* ── Pagination ── */}
          <div style={{ padding: '12px 18px' }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={PAGE_SIZE}
              totalItems={filteredProducts.length}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductList;
