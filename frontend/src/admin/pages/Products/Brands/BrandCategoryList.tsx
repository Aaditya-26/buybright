/**
 * BuyBright Admin — Brand Categories Management Page.
 * Features: Form on top of page (Add/Edit) + Live listing table below with real-time CRUD and persistence.
 * Route: /admin/products/brand-categories
 */

import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { DataTable, type Column } from '../../../components/DataTable';
import { SearchBar } from '../../../components/SearchBar';
import { getBrandCategories, saveBrandCategories } from '../../../data/brandCategoriesData';
import { getBrands } from '../../../data/brandsData';
import type { AdminBrandCategory } from '../../../types/product';
import { useToast } from '../../../../context/ToastContext';
import { exportTableToPDF } from '../../../utils/exportPdf';
import { exportTableToCSV } from '../../../utils/exportCsv';

// Preset dental & medical icons for quick selection
const POPULAR_ICONS = [
  { icon: 'fa-solid fa-tooth', label: 'Tooth' },
  { icon: 'fa-solid fa-flask-vial', label: 'Flask' },
  { icon: 'fa-solid fa-microscope', label: 'Microscope' },
  { icon: 'fa-solid fa-scissors', label: 'Surgical' },
  { icon: 'fa-solid fa-shield-virus', label: 'Shield' },
  { icon: 'fa-solid fa-wand-magic-sparkles', label: 'Aesthetics' },
  { icon: 'fa-solid fa-award', label: 'Award' },
  { icon: 'fa-solid fa-certificate', label: 'Certificate' },
  { icon: 'fa-solid fa-gem', label: 'Gem' },
  { icon: 'fa-solid fa-layer-group', label: 'Layer' },
  { icon: 'fa-solid fa-screwdriver-wrench', label: 'Tools' },
  { icon: 'fa-solid fa-pills', label: 'Pharma' },
];

interface FormState {
  id?: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  displayOrder: number;
  status: 'Active' | 'Inactive';
}

const INITIAL_FORM: FormState = {
  name: '',
  slug: '',
  icon: 'fa-solid fa-tooth',
  description: '',
  displayOrder: 0,
  status: 'Active',
};

export const BrandCategoryList: React.FC = () => {
  const { showToast } = useToast();
  const formRef = useRef<HTMLDivElement>(null);

  const [categories, setCategories] = useState<AdminBrandCategory[]>(() => getBrandCategories());
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Recalculate brand counts dynamically
  const brands = useMemo(() => getBrands(), []);
  const enrichedCategories = useMemo(() => {
    return categories.map((cat) => {
      const count = brands.filter(
        (b) => b.brandCategoryId === cat.id || b.categorySlug === cat.slug
      ).length;
      return { ...cat, totalBrands: (cat.totalBrands && cat.totalBrands > 0) ? cat.totalBrands : count };
    });
  }, [categories, brands]);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return enrichedCategories.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q));

      const matchStatus = statusFilter === 'All' || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [enrichedCategories, searchQuery, statusFilter]);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, status: checked ? 'Active' : 'Inactive' }));
    } else if (name === 'displayOrder') {
      setForm((prev) => ({ ...prev, displayOrder: Number(value) || 0 }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectIcon = (iconClass: string) => {
    setForm((prev) => ({ ...prev, icon: iconClass }));
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setIsEditing(false);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setErrors({ name: 'Brand Category Name is required' });
      showToast('Brand Category Name is required.', 'danger');
      return;
    }

    const slug = (form.slug.trim() || form.name.trim())
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    if (isEditing && form.id) {
      const updated = categories.map((cat) =>
        cat.id === form.id
          ? {
              ...cat,
              name: form.name.trim(),
              slug,
              icon: form.icon || 'fa-solid fa-tooth',
              description: form.description.trim(),
              displayOrder: Number(form.displayOrder) || 0,
              status: form.status,
            }
          : cat
      );
      setCategories(updated);
      saveBrandCategories(updated);
      showToast(`Brand Category "${form.name}" updated successfully!`, 'success');
    } else {
      const newCategory: AdminBrandCategory = {
        id: `bcat-${Date.now()}`,
        name: form.name.trim(),
        slug,
        icon: form.icon || 'fa-solid fa-tooth',
        description: form.description.trim(),
        displayOrder: Number(form.displayOrder) || 0,
        status: form.status,
        totalBrands: 0,
      };
      const updated = [newCategory, ...categories];
      setCategories(updated);
      saveBrandCategories(updated);
      showToast(`Brand Category "${newCategory.name}" created successfully!`, 'success');
    }

    resetForm();
  };

  const handleEdit = (cat: AdminBrandCategory) => {
    setForm({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || 'fa-solid fa-tooth',
      description: cat.description || '',
      displayOrder: cat.displayOrder ?? 0,
      status: cat.status,
    });
    setIsEditing(true);
    setErrors({});
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleToggleStatus = (cat: AdminBrandCategory) => {
    const updatedStatus: AdminBrandCategory['status'] =
      cat.status === 'Active' ? 'Inactive' : 'Active';
    const updated = categories.map((c) =>
      c.id === cat.id ? { ...c, status: updatedStatus } : c
    );
    setCategories(updated);
    saveBrandCategories(updated);
    showToast(`Brand Category "${cat.name}" marked ${updatedStatus}.`, 'info');
  };


  const handleExportCSV = () => {
    exportTableToCSV({
      filename: `brand_categories_${new Date().toISOString().slice(0, 10)}.csv`,
      headers: ['Sr.No.', 'Category Name', 'URL Slug', 'Icon', 'Display Order' , 'Status'],
      rows: filteredCategories.map((c, idx) => [
        idx + 1,
        c.name,
        c.slug,
        c.icon,
        c.displayOrder ?? 0,
        
        c.status,
      ]),
    });
    showToast('Brand Categories CSV report exported.', 'success');
  };

  const handleExportPDF = () => {
    exportTableToPDF({
      title: 'BuyBright Brand Categories Directory',
      subtitle: `Manufacturer Taxonomy & Classifications (${filteredCategories.length} categories)`,
      headers: ['Sr.No.', 'Category Name', 'URL Slug', 'Icon', 'Display Order', 'Brands', 'Status'],
      rows: filteredCategories.map((c, idx) => [
        idx + 1,
        c.name,
        c.slug,
        c.icon,
        c.displayOrder ?? 0,
        
        c.status,
      ]),
    });
    showToast('Brand Categories PDF exported successfully.', 'success');
  };

  // Stats
  const stats = [
    {
      label: 'Brand Categories',
      value: categories.length,
      icon: 'fa-solid fa-layer-group',
      color: '#0d9488',
      bg: '#f0fdfa',
      border: '#ccfbf1',
    },
    {
      label: 'Active Categories',
      value: categories.filter((c) => c.status === 'Active').length,
      icon: 'fa-solid fa-circle-check',
      color: '#16a34a',
      bg: '#f0fdf4',
      border: '#bbf7d0',
    },
    
    {
      label: 'Inactive / Hidden',
      value: categories.filter((c) => c.status === 'Inactive').length,
      icon: 'fa-solid fa-eye-slash',
      color: '#dc2626',
      bg: '#fef2f2',
      border: '#fecaca',
    },
  ];

  // Table Columns
  const columns: Column<AdminBrandCategory>[] = [
    {
      key: 'actions',
      header: 'Action',
      width: '90px',
      render: (cat) => (
        <div className="table-action-btns">
          <button
            type="button"
            className="btn-icon-action"
            title="Edit Category"
            onClick={() => handleEdit(cat)}
          >
            <i className="fa-solid fa-pen-to-square" style={{ color: '#0d9488' }} />
          </button>
          <button
            type="button"
            className="btn-icon-action"
            title={cat.status === 'Active' ? 'Deactivate' : 'Activate'}
            onClick={() => handleToggleStatus(cat)}
          >
            <i
              className={`fa-solid ${cat.status === 'Active' ? 'fa-toggle-on' : 'fa-toggle-off'}`}
              style={{ color: cat.status === 'Active' ? '#10b981' : '#94a3b8' }}
            />
          </button>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Brand Category Name & Icon',
      render: (cat) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#f0fdfa',
              border: '1.5px solid #ccfbf1',
              color: '#0d9488',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.15rem',
              flexShrink: 0,
            }}
          >
            <i className={cat.icon || 'fa-solid fa-tooth'} />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>
              {cat.name}
            </div>
            {cat.description && (
              <div
                style={{
                  fontSize: '0.74rem',
                  color: '#64748b',
                  maxWidth: '360px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {cat.description}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'slug',
      header: 'URL Slug',
      render: (cat) => (
        <code
          style={{
            fontSize: '0.78rem',
            color: '#0d9488',
            background: '#f8fafc',
            padding: '2px 8px',
            borderRadius: '4px',
            border: '1px solid #e2e8f0',
          }}
        >
          {cat.slug}
        </code>
      ),
    },
    {
      key: 'displayOrder',
      header: 'Sort Order',
      width: '100px',
      render: (cat) => (
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#334155',
            background: '#f1f5f9',
            padding: '3px 8px',
            borderRadius: '6px',
          }}
        >
          #{cat.displayOrder ?? 0}
        </span>
      ),
    },
   
    {
      key: 'status',
      header: 'Status',
      width: '100px',
      render: (cat) => (
        <span
          style={{
            fontSize: '0.74rem',
            fontWeight: 700,
            padding: '3px 9px',
            borderRadius: '12px',
            background: cat.status === 'Active' ? '#dcfce7' : '#fee2e2',
            color: cat.status === 'Active' ? '#15803d' : '#b91c1c',
          }}
        >
          {cat.status}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Brand Categories"
      subtitle="Manage manufacturer classifications, category icons, and linked dental brand hierarchies"
    >
      {/* ── Top Navigation Bar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
          <Link to="/admin/products" style={{ color: '#64748b', textDecoration: 'none' }}>
            Products
          </Link>
          <span style={{ color: '#cbd5e1' }}>/</span>
          <Link to="/admin/products/brands" style={{ color: '#64748b', textDecoration: 'none' }}>
            Brands
          </Link>
          <span style={{ color: '#cbd5e1' }}>/</span>
          <span style={{ color: '#0d9488', fontWeight: 600 }}>Brand Categories</span>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          
          <button
            type="button"
            className="btn-admin-outline"
            onClick={handleExportPDF}
          >
            <i className="fa-solid fa-file-pdf" style={{ color: '#ef4444' }} /> Export PDF
          </button>
        </div>
      </div>

      {/* ── TOP OF PAGE: Add / Edit Brand Category Form ── */}
      <div
        ref={formRef}
        className="admin-card"
        style={{
          marginBottom: '24px',
          border: isEditing ? '2px solid #0d9488' : '1px solid #e2e8f0',
          boxShadow: isEditing ? '0 4px 20px rgba(13, 148, 136, 0.12)' : '0 1px 3px rgba(0,0,0,0.05)',
          borderRadius: '12px',
          transition: 'all 0.25s ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '14px',
            borderBottom: '1px solid #f1f5f9',
            marginBottom: '18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: isEditing ? '#0d9488' : '#f0fdfa',
                color: isEditing ? '#ffffff' : '#0d9488',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
              }}
            >
              <i className={isEditing ? 'fa-solid fa-pen' : 'fa-solid fa-plus'} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                {isEditing ? `Edit Brand Category: ${form.name}` : 'Add Brand Category'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
                {isEditing
                  ? 'Update classification name, category icon, sort order, and active status.'
                  : 'Register a new brand classification grouping with custom icon and taxonomy slug.'}
              </p>
            </div>
          </div>

          {isEditing && (
            <button
              type="button"
              className="btn-admin-outline"
              onClick={resetForm}
              style={{ fontSize: '0.78rem', padding: '6px 12px' }}
            >
              <i className="fa-solid fa-xmark" /> Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            {/* Brand Category Name */}
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Brand Category Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleNameChange}
                placeholder="e.g. Endodontics & Root Canal / Surgical Implants"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: errors.name ? '1.5px solid #ef4444' : '1.5px solid #cbd5e1',
                  fontSize: '0.88rem',
                }}
                required
              />
              {errors.name && (
                <span style={{ fontSize: '0.74rem', color: '#ef4444', marginTop: '4px', display: 'block' }}>
                  {errors.name}
                </span>
              )}
            </div>

            {/* URL Slug */}
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                URL Slug <span style={{ fontSize: '0.72rem', color: '#64748b' }}>(Auto-generated)</span>
              </label>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="e.g. endodontics-root-canal"
                className="form-control"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.88rem',
                  backgroundColor: '#f8fafc',
                }}
              />
            </div>

            {/* Category Icon Field with live preview */}
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Category Icon <span style={{ fontSize: '0.72rem', color: '#64748b' }}>(FontAwesome class)</span>
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '8px',
                    backgroundColor: '#f0fdfa',
                    border: '1.5px solid #0d9488',
                    color: '#0d9488',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    flexShrink: 0,
                  }}
                  title="Icon Preview"
                >
                  <i className={form.icon || 'fa-solid fa-tooth'} />
                </div>
                <input
                  type="text"
                  name="icon"
                  value={form.icon}
                  onChange={handleChange}
                  placeholder="e.g. fa-solid fa-tooth"
                  className="form-control"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.88rem',
                  }}
                />
              </div>
            </div>

            {/* Sort Order Sequence */}
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Sort Order Sequence
              </label>
              <input
                type="number"
                name="displayOrder"
                value={form.displayOrder}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="form-control"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.88rem',
                }}
              />
            </div>
          </div>

          {/* Quick Icon Selector Palette */}
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '8px' }}>
              Quick Pick Category Icon:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {POPULAR_ICONS.map((item) => (
                <button
                  key={item.icon}
                  type="button"
                  onClick={() => handleSelectIcon(item.icon)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: form.icon === item.icon ? '1.5px solid #0d9488' : '1px solid #e2e8f0',
                    backgroundColor: form.icon === item.icon ? '#f0fdfa' : '#ffffff',
                    color: form.icon === item.icon ? '#0d9488' : '#475569',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: form.icon === item.icon ? 700 : 500,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <i className={item.icon} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Brand Category Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
              placeholder="e.g. Brand category classification covering precision rotary files, obturation equipment, and bioceramics..."
              className="form-control"
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.88rem',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Active Brand Category Checkbox & Action Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '12px',
              borderTop: '1px solid #f1f5f9',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                userSelect: 'none',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#1e293b',
              }}
            >
              <input
                type="checkbox"
                checked={form.status === 'Active'}
                onChange={handleChange}
                style={{ width: '18px', height: '18px', accentColor: '#0d9488', cursor: 'pointer' }}
              />
              <span>Active Brand Category (Visible across website &amp; catalog filters)</span>
            </label>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn-admin-outline"
                onClick={resetForm}
                style={{ padding: '8px 16px', fontSize: '0.82rem' }}
              >
                Reset
              </button>
              <button
                type="submit"
                className="btn-admin-primary"
                style={{ padding: '8px 20px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <i className={isEditing ? 'fa-solid fa-floppy-disk' : 'fa-solid fa-plus'} />
                {isEditing ? 'Update Brand Category' : 'Save Brand Category'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* ── KPI Stats Cards ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '14px',
          marginBottom: '20px',
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: '#ffffff',
              borderRadius: '10px',
              padding: '14px 16px',
              border: `1.5px solid ${s.border}`,
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: s.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: s.color,
                fontSize: '1.25rem',
                flexShrink: 0,
              }}
            >
              <i className={s.icon} />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search and Filter Controls ── */}
      <div
        className="admin-card"
        style={{
          padding: '14px 18px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ flex: 1, minWidth: '260px', maxWidth: '420px' }}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by category name, icon, or slug..."
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <select
            className="form-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1.5px solid #cbd5e1',
              fontSize: '0.85rem',
              color: '#334155',
              cursor: 'pointer',
            }}
          >
            <option value="All">All Statuses ({categories.length})</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>

          <button
            type="button"
            className="btn-export-csv"
            onClick={handleExportCSV}
            title="Export Brand Categories to CSV"
          >
            <i className="fa-solid fa-file-csv" /> Export CSV
          </button>

          <button
            type="button"
            className="btn-export-pdf"
            onClick={handleExportPDF}
            title="Export Brand Categories to PDF"
          >
            <i className="fa-solid fa-file-pdf" /> Export PDF
          </button>

          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
            Showing <strong>{filteredCategories.length}</strong> of {categories.length}
          </span>
        </div>
      </div>

      {/* ── Data Table Listing ── */}
      <div className="admin-card" style={{ padding: '0', overflow: 'hidden' }}>
        <DataTable
          columns={columns}
          data={filteredCategories}
          keyExtractor={(item) => item.id}
          emptyMessage="No brand categories match your search filters."
        />
      </div>
    </AdminLayout>
  );
};

export default BrandCategoryList;
