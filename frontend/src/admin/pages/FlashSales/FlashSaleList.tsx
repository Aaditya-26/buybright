/**
 * BuyBright Admin — Flash Sale Products Listing.
 * Uses reusable Admin UI components (SearchBar, Select, Button, Pagination, AdminLayout).
 * Displays: Product Select, Original MRP, Flash Sale Price, Start Date & Time, End Date & Time, Status, and Actions.
 */

import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { getFlashSales, saveFlashSales, FlashSaleItem } from '../../data/flashSaleData';
import { SearchBar } from '../../components/SearchBar';
import { Select, Button } from '../../components/Form';
import { Pagination } from '../../components/Pagination/Pagination';
import { useToast } from '../../../context/ToastContext';
import { exportTableToCSV } from '../../utils/exportCsv';
import { exportTableToPDF } from '../../utils/exportPdf';

export const FlashSaleList: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [flashSales, setFlashSales] = useState<FlashSaleItem[]>(() => getFlashSales());

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filtered Flash Sales
  const filteredItems = useMemo(() => {
    return flashSales.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.productName.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q);

      const matchStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [flashSales, searchQuery, statusFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  // Metrics
  const metrics = useMemo(() => {
    const total = flashSales.length;
    const active = flashSales.filter((i) => i.status === 'Active').length;
    const inactive = flashSales.filter((i) => i.status === 'Inactive').length;
    const avgDiscount =
      total > 0
        ? Math.round(flashSales.reduce((acc, i) => acc + i.discountPercentage, 0) / total)
        : 0;

    return { total, active, inactive, avgDiscount };
  }, [flashSales]);

  // Toggle Status
  const handleToggleStatus = (item: FlashSaleItem) => {
    const updatedStatus: FlashSaleItem['status'] = item.status === 'Active' ? 'Inactive' : 'Active';
    const updated = flashSales.map((i) => (i.id === item.id ? { ...i, status: updatedStatus } : i));
    setFlashSales(updated);
    saveFlashSales(updated);
    showToast(`"${item.productName}" status changed to ${updatedStatus}.`, 'info');
  };

  
  // Format Date Time
  const formatDateTime = (dtStr: string) => {
    if (!dtStr) return '-';
    try {
      const d = new Date(dtStr);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dtStr;
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    exportTableToCSV({
      filename: `buybright_flash_sales_${Date.now()}`,
      headers: [
        'Product Name',
        'Brand',
        'Original Price (₹)',
        'Flash Sale Price (₹)',
        'Discount (%)',
        'Flash Sale Start Date & Time',
        'Flash Sale End Date & Time',
        'Status',
      ],
      rows: filteredItems.map((i) => [
        i.productName,
        i.brand,
        i.originalPrice,
        i.flashSalePrice,
        `${i.discountPercentage}%`,
        i.startDate.replace('T', ' '),
        i.endDate.replace('T', ' '),
        i.status,
      ]),
    });
    showToast('Flash sales list exported as CSV', 'success');
  };

  // Export PDF
  const handleExportPDF = () => {
    exportTableToPDF({
      title: 'BuyBright — Flash Sale Products Register',
      subtitle: `Total Flash Sale Products: ${filteredItems.length}`,
      headers: ['Product', 'Brand', 'MRP', 'Sale Price', 'Start Date', 'End Date', 'Status'],
      rows: filteredItems.map((i) => [
        i.productName,
        i.brand,
        `₹${i.originalPrice}`,
        `₹${i.flashSalePrice}`,
        i.startDate.replace('T', ' '),
        i.endDate.replace('T', ' '),
        i.status,
      ]),
    });
    showToast('Flash sales list exported as PDF', 'success');
  };

  return (
    <AdminLayout
      title="Flash Sale Management"
      subtitle="Manage flash sale products, discounted sale pricing, start/end dates and times"
    >
      {/* ── KPI Stat Cards ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div className="admin-card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
            }}
          >
            <i className="fa-solid fa-bolt-lightning" />
          </div>
          <div>
            <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Total Flash Sales
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{metrics.total}</div>
          </div>
        </div>

        <div className="admin-card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#f0fdf4',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
            }}
          >
            <i className="fa-solid fa-circle-check" />
          </div>
          <div>
            <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Active on Storefront
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16a34a' }}>{metrics.active}</div>
          </div>
        </div>

        <div className="admin-card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#fef2f2',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
            }}
          >
            <i className="fa-solid fa-tags" />
          </div>
          <div>
            <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Average Discount
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444' }}>{metrics.avgDiscount}% OFF</div>
          </div>
        </div>
      </div>

      {/* ── Toolbar with Reusable SearchBar, Select & Buttons ── */}
      <div
        className="admin-card"
        style={{
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
          {/* Reusable SearchBar Component */}
          <SearchBar
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            placeholder="Search product or brand..."
            width="280px"
          />

          {/* Reusable Select for Status Filter */}
          <div style={{ width: '160px', marginBottom: 0 }}>
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              options={[
                { value: 'All', label: 'All Statuses' },
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
              ]}
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            />
          </div>

          {/* Reusable Select for Page Size */}
          <div style={{ width: '130px', marginBottom: 0 }}>
            <Select
              value={String(pageSize)}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              options={[
                { value: '5', label: '5 per page' },
                { value: '10', label: '10 per page' },
                { value: '20', label: '20 per page' },
              ]}
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        {/* Reusable Button Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button
            variant="outline"
            size="md"
            icon="fa-solid fa-file-csv"
            onClick={handleExportCSV}
          >
            CSV
          </Button>

          <Button
            variant="outline"
            size="md"
            icon="fa-solid fa-file-pdf"
            onClick={handleExportPDF}
          >
            PDF
          </Button>

          <Button
            variant="primary"
            size="md"
            icon="fa-solid fa-plus"
            onClick={() => navigate('/admin/flash-sales/new')}
          >
            Add Flash Sale
          </Button>
        </div>
      </div>

      {/* ── Table ── */}
      <div
        className="admin-card"
        style={{
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
        }}
      >
        <div className="admin-table-responsive" style={{ margin: 0 }}>
          <table className="admin-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ minWidth: '240px' }}>Product Select</th>
                <th style={{ minWidth: '130px' }}>Original MRP (₹)</th>
                <th style={{ minWidth: '140px' }}>Flash Sale Price (₹)</th>
                <th style={{ textAlign: 'center', minWidth: '110px' }}>Discount</th>
                <th style={{ minWidth: '180px' }}>Flash Sale Start Date &amp; Time</th>
                <th style={{ minWidth: '180px' }}>Flash Sale End Date &amp; Time</th>
                <th style={{ textAlign: 'center', minWidth: '100px' }}>Status</th>
                <th style={{ textAlign: 'right', minWidth: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
                    <i
                      className="fa-solid fa-bolt-lightning"
                      style={{ fontSize: '2rem', marginBottom: '10px', display: 'block', color: '#cbd5e1' }}
                    />
                    <div style={{ fontWeight: 600, fontSize: '0.94rem', color: '#334155' }}>
                      No flash sales found
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
                      Click "Add Flash Sale" to add a new product with flash sale pricing and date/time schedules.
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => (
                  <tr key={item.id}>
                    {/* Product Name & Brand */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={item.image}
                          alt={item.productName}
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '8px',
                            objectFit: 'contain',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            padding: '2px',
                          }}
                        />
                        <div>
                          <Link
                            to={`/admin/flash-sales/edit/${item.id}`}
                            style={{
                              fontWeight: 700,
                              color: '#0f172a',
                              fontSize: '0.86rem',
                              textDecoration: 'none',
                              lineHeight: 1.3,
                              display: 'block',
                            }}
                          >
                            {item.productName}
                          </Link>
                          <span style={{ fontSize: '0.72rem', color: '#0d9488', fontWeight: 700 }}>
                            {item.brand}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Original MRP */}
                    <td>
                      <span style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 600 }}>
                        ₹{item.originalPrice.toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Flash Sale Price */}
                    <td>
                      <span style={{ fontSize: '0.95rem', color: '#0f766e', fontWeight: 800 }}>
                        ₹{item.flashSalePrice.toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Discount */}
                    <td style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          background: '#fef2f2',
                          color: '#ef4444',
                          border: '1px solid #fecaca',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.76rem',
                        }}
                      >
                        -{item.discountPercentage}% OFF
                      </span>
                    </td>

                    {/* Start Date & Time */}
                    <td>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                        <i className="fa-regular fa-calendar-plus" style={{ color: '#0d9488', marginRight: '6px' }} />
                        {formatDateTime(item.startDate)}
                      </div>
                    </td>

                    {/* End Date & Time */}
                    <td>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                        <i className="fa-regular fa-calendar-xmark" style={{ color: '#ef4444', marginRight: '6px' }} />
                        {formatDateTime(item.endDate)}
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td style={{ textAlign: 'center' }}>
                      <span
                        className={`admin-badge ${item.status === 'Active' ? 'badge-success' : 'badge-neutral'}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleToggleStatus(item)}
                        title="Click to toggle status"
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/flash-sales/edit/${item.id}`)}
                          className="btn-icon-action"
                          title="Edit Flash Sale"
                          style={{ color: '#0d9488' }}
                        >
                          <i className="fa-solid fa-pen-to-square" />
                        </button>
                       
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={filteredItems.length}
          onPageChange={(p) => setCurrentPage(p)}
        />
      </div>
    </AdminLayout>
  );
};

export default FlashSaleList;
