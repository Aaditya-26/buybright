/**
 * BuyBright Admin — Product Types Management Page.
 * Features: Streamlined Form on same page (Add/Edit) + Live listing table below with real-time CRUD and persistence.
 * Fields: Product Type Name, Product Image, Status.
 * Route: /admin/products/types
 */

import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { DataTable, type Column } from '../../../components/DataTable';
import { SearchBar } from '../../../components/SearchBar';
import { getProductTypes, saveProductTypes, type AdminProductTypeItem } from '../../../data/productTypesData';
import { useToast } from '../../../../context/ToastContext';
import { exportTableToPDF } from '../../../utils/exportPdf';
import { exportTableToCSV } from '../../../utils/exportCsv';

interface FormState {
  id?: string;
  name: string;
  slug: string;
  image: string;
  status: 'Active' | 'Inactive';
}

const INITIAL_FORM: FormState = {
  name: '',
  slug: '',
  image: '',
  status: 'Active',
};

export const ProductTypeList: React.FC = () => {
  const { showToast } = useToast();
  const formRef = useRef<HTMLDivElement>(null);
  const imageFileInputRef = useRef<HTMLInputElement>(null);

  const [types, setTypes] = useState<AdminProductTypeItem[]>(() => getProductTypes());
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filtered product types
  const filteredTypes = useMemo(() => {
    return types.filter((t) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.slug.toLowerCase().includes(q);

      const matchStatus = statusFilter === 'All' || t.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [types, searchQuery, statusFilter]);

  // Form Handlers
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setForm((prev) => ({
      ...prev,
      name: val,
      slug: isEditing
        ? prev.slug
        : val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    }));
    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      showToast('Image file exceeds maximum 8MB limit.', 'danger');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setForm((prev) => ({ ...prev, image: ev.target!.result as string }));
        showToast(`Image "${file.name}" loaded.`, 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setIsEditing(false);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setErrors({ name: 'Product Type Name is required' });
      showToast('Product Type Name is required.', 'danger');
      return;
    }

    const slug = (form.slug.trim() || form.name.trim())
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    if (isEditing && form.id) {
      const updated = types.map((t) =>
        t.id === form.id
          ? {
              ...t,
              name: form.name.trim(),
              slug,
              image: form.image.trim(),
              status: form.status,
            }
          : t
      );
      setTypes(updated);
      saveProductTypes(updated);
      showToast(`Product Type "${form.name}" updated successfully!`, 'success');
    } else {
      const newType: AdminProductTypeItem = {
        id: `ptype-${Date.now()}`,
        name: form.name.trim(),
        slug,
        image: form.image.trim() || '/images/cat_composites.webp',
        status: form.status,
        totalProducts: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };
      const updated = [newType, ...types];
      setTypes(updated);
      saveProductTypes(updated);
      showToast(`Product Type "${newType.name}" created successfully!`, 'success');
    }

    resetForm();
  };

  const handleEdit = (t: AdminProductTypeItem) => {
    setForm({
      id: t.id,
      name: t.name,
      slug: t.slug,
      image: t.image || '',
      status: t.status,
    });
    setIsEditing(true);
    setErrors({});
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleToggleStatus = (t: AdminProductTypeItem) => {
    const updatedStatus: AdminProductTypeItem['status'] =
      t.status === 'Active' ? 'Inactive' : 'Active';
    const updated = types.map((item) =>
      item.id === t.id ? { ...item, status: updatedStatus } : item
    );
    setTypes(updated);
    saveProductTypes(updated);
    showToast(`Product Type "${t.name}" marked ${updatedStatus}.`, 'info');
  };

  

  const handleExportCSV = () => {
    exportTableToCSV({
      filename: `product_types_${new Date().toISOString().slice(0, 10)}.csv`,
      headers: ['Sr.No.', 'Product Type Name', 'Slug', 'Status'],
      rows: filteredTypes.map((t, idx) => [
        idx + 1,
        t.name,
        t.slug,
        t.status,
      ]),
    });
    showToast('Product Types CSV report exported.', 'success');
  };

  const handleExportPDF = () => {
    exportTableToPDF({
      title: 'BuyBright Product Types Directory',
      subtitle: `Product Classifications (${filteredTypes.length} records)`,
      headers: ['Sr.No.', 'Product Type Name', 'Slug', 'Status'],
      rows: filteredTypes.map((t, idx) => [
        idx + 1,
        t.name,
        t.slug,
        t.status,
      ]),
    });
    showToast('Product Types exported to PDF successfully.', 'success');
  };

  // Quick stats
  const stats = [
    {
      label: 'Total Product Types',
      value: types.length,
      icon: 'fa-solid fa-layer-group',
      color: '#0d9488',
      bg: '#f0fdfa',
      border: '#ccfbf1',
    },
    {
      label: 'Active Product Types',
      value: types.filter((t) => t.status === 'Active').length,
      icon: 'fa-solid fa-circle-check',
      color: '#16a34a',
      bg: '#f0fdf4',
      border: '#bbf7d0',
    },
    {
      label: 'With Media Assets',
      value: types.filter((t) => Boolean(t.image)).length,
      icon: 'fa-solid fa-image',
      color: '#0284c7',
      bg: '#f0f9ff',
      border: '#bae6fd',
    },
    {
      label: 'Inactive / Draft',
      value: types.filter((t) => t.status === 'Inactive').length,
      icon: 'fa-solid fa-eye-slash',
      color: '#dc2626',
      bg: '#fef2f2',
      border: '#fecaca',
    },
  ];

  // Table Columns
  const columns: Column<AdminProductTypeItem>[] = [
    {
      key: 'actions',
      header: 'Action',
      width: '100px',
      render: (t) => (
        <div className="table-action-btns" style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            className="btn-icon-action"
            title="Edit Product Type"
            onClick={() => handleEdit(t)}
            style={{ width: '30px', height: '30px', borderRadius: '6px', border: '1px solid #ccfbf1', background: '#f0fdfa', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <i className="fa-solid fa-pen-to-square" style={{ color: '#0d9488', fontSize: '0.85rem' }} />
          </button>
          <button
            type="button"
            className="btn-icon-action"
            title={t.status === 'Active' ? 'Deactivate' : 'Activate'}
            onClick={() => handleToggleStatus(t)}
            style={{ width: '30px', height: '30px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <i
              className={`fa-solid ${t.status === 'Active' ? 'fa-toggle-on' : 'fa-toggle-off'}`}
              style={{ color: t.status === 'Active' ? '#10b981' : '#94a3b8', fontSize: '1rem' }}
            />
          </button>
          
        </div>
      ),
    },
    {
      key: 'image',
      header: 'Image',
      width: '70px',
      render: (t) => (
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1.5px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {t.image ? (
            <img
              src={t.image}
              alt={t.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/cat_composites.webp';
              }}
            />
          ) : (
            <i className="fa-solid fa-image" style={{ color: '#cbd5e1', fontSize: '1.2rem' }} />
          )}
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Product Type Name',
      render: (t) => (
        <div>
          <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>{t.name}</strong>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '3px' }}>
            Slug: <code style={{ color: '#0d9488', background: '#f0fdfa', padding: '1px 5px', borderRadius: '4px' }}>{t.slug}</code>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '120px',
      render: (t) => (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.74rem',
            fontWeight: 700,
            backgroundColor: t.status === 'Active' ? '#dcfce7' : '#f1f5f9',
            color: t.status === 'Active' ? '#166534' : '#64748b',
            border: `1px solid ${t.status === 'Active' ? '#bbf7d0' : '#cbd5e1'}`,
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: t.status === 'Active' ? '#16a34a' : '#94a3b8',
            }}
          />
          {t.status}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Product Types"
      subtitle="Manage product type classifications, media assets, and storefront availability"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#64748b' }}>
            <Link to="/admin/dashboard" style={{ color: '#64748b', textDecoration: 'none' }}>
              Dashboard
            </Link>
            <span>/</span>
            <Link to="/admin/products" style={{ color: '#64748b', textDecoration: 'none' }}>
              Products
            </Link>
            <span>/</span>
            <span style={{ color: '#0d9488', fontWeight: 600 }}>Product Types</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-export-csv"
              onClick={handleExportCSV}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '0.82rem' }}
            >
              <i className="fa-solid fa-file-csv" style={{ color: '#0d9488' }} /> Export CSV
            </button>
            <button
              type="button"
              className="btn-export-pdf"
              onClick={handleExportPDF}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '0.82rem' }}
            >
              <i className="fa-solid fa-file-pdf" style={{ color: '#ef4444' }} /> Export PDF
            </button>
            <button
              type="button"
              className="btn-admin-primary"
              onClick={() => {
                resetForm();
                formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.82rem' }}
            >
              <i className="fa-solid fa-plus" /> Add Product Type
            </button>
          </div>
        </div>

        {/* 4 Stat Overview Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          {stats.map((s, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: s.bg,
                border: `1px solid ${s.border}`,
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: '#fff',
                  border: `1px solid ${s.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  color: s.color,
                  flexShrink: 0,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                <i className={s.icon} />
              </div>
              <div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── SAME PAGE FORM: Add / Edit Product Type Card ── */}
        <div
          ref={formRef}
          className="admin-card"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: isEditing ? '2px solid #0d9488' : '1px solid #e2e8f0',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: isEditing ? 'linear-gradient(135deg, #0d9488, #0891b2)' : 'linear-gradient(135deg, #0d9488, #14b8a6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '0.95rem',
                }}
              >
                <i className={isEditing ? 'fa-solid fa-pen-to-square' : 'fa-solid fa-plus'} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                  {isEditing ? `Edit Product Type: "${form.name}"` : 'Add New Product Type'}
                </h3>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  Enter product type name, image asset, and configure storefront visibility
                </span>
              </div>
            </div>

            {isEditing && (
              <span style={{ backgroundColor: '#ccfbf1', color: '#0f766e', fontSize: '0.74rem', fontWeight: 700, padding: '4px 10px', borderRadius: '12px' }}>
                Editing Mode Active
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Field 1 & Status: Product Type Name & Status */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Product Type Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleNameChange}
                  placeholder="e.g. Essential Dental Consumables, Electronic Dental Equipment"
                  className="form-control"
                  style={{ width: '100%', borderColor: errors.name ? '#ef4444' : undefined }}
                />
                {errors.name && (
                  <span style={{ color: '#ef4444', fontSize: '0.74rem', marginTop: '4px', display: 'block' }}>
                    {errors.name}
                  </span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as 'Active' | 'Inactive' }))}
                  className="form-control"
                  style={{ width: '100%' }}
                >
                  <option value="Active">Active (Visible)</option>
                  <option value="Inactive">Inactive (Hidden)</option>
                </select>
              </div>
            </div>

            {/* Field 2: Product Image (Upload + URL + Preview) */}
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                <i className="fa-solid fa-image" style={{ color: '#0d9488', marginRight: '6px' }} />
                Product Image <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: '0.74rem' }}>(Upload local file or paste online URL)</span>
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: form.image ? '80px 1fr' : '1fr', gap: '14px', alignItems: 'start' }}>
                {form.image && (
                  <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #0d9488', background: '#fff' }}>
                    <img
                      src={form.image}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/cat_composites.webp';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, image: '' }))}
                      style={{
                        position: 'absolute',
                        top: '3px',
                        right: '3px',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: '#ef4444',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                      }}
                      title="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn-admin-primary"
                      onClick={() => imageFileInputRef.current?.click()}
                      style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <i className="fa-solid fa-cloud-arrow-up" /> Choose Image File
                    </button>
                    <input
                      ref={imageFileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                    />
                    <span style={{ fontSize: '0.76rem', color: '#64748b' }}>or paste direct image URL below:</span>
                  </div>
                  <input
                    type="text"
                    name="image"
                    value={form.image}
                    onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                    placeholder="https://... or /images/cat_equipment.webp"
                    className="form-control"
                    style={{ width: '100%', fontSize: '0.82rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
              <button
                type="button"
                className="btn-admin-outline"
                onClick={resetForm}
                style={{ padding: '8px 18px', fontSize: '0.84rem' }}
              >
                {isEditing ? 'Cancel Edit' : 'Reset Form'}
              </button>
              <button
                type="submit"
                className="btn-admin-primary"
                style={{ padding: '8px 22px', fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <i className={isEditing ? 'fa-solid fa-check' : 'fa-solid fa-plus'} />
                {isEditing ? 'Update Product Type' : 'Save Product Type'}
              </button>
            </div>

          </form>
        </div>

        {/* ── SAME PAGE LISTING: Data Table Card ── */}
        <div
          className="admin-card"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          {/* Table Header & Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                All Registered Product Types ({filteredTypes.length})
              </h3>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                Manage live classifications, preview images, and toggle storefront visibility
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by name or slug..."
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-control"
                style={{ width: '130px', fontSize: '0.82rem' }}
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* DataTable Component */}
          <DataTable
            data={filteredTypes}
            columns={columns}
            keyExtractor={(item) => item.id}
            emptyMessage="No product types found matching your query."
          />
        </div>

      </div>
    </AdminLayout>
  );
};

export default ProductTypeList;
