/**
 * BuyBright Admin — Categories Management Page.
 * Features:
 *   - Form on Top of the page containing:
 *     1. Category Name *
 *     2. Slug *
 *     3. Category Heading (Optional)
 *     4. Category Badge (Optional)
 *     5. Category Icon
 *     6. Images (Upload + preview + URL)
 *     7. Order
 *     8. Show in Home Page (checkbox)
 *     9. Show in Sidebar (checkbox)
 *   - Live Category Listing Table directly below the form with full CRUD & PDF export.
 * Route: /admin/products/categories
 */

import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { DataTable, type Column } from '../../../components/DataTable';
import { SearchBar } from '../../../components/SearchBar';
import { getCategories, saveCategories } from '../../../data/productsData';
import type { AdminCategory } from '../../../types/product';
import { useToast } from '../../../../context/ToastContext';
import { exportTableToPDF } from '../../../utils/exportPdf';
import { exportTableToCSV } from '../../../utils/exportCsv';

// Popular Dental Icons Palette
const POPULAR_CATEGORY_ICONS = [
  { icon: 'fa-solid fa-tooth', label: 'Tooth / Endo' },
  { icon: 'fa-solid fa-flask', label: 'Materials / Composites' },
  { icon: 'fa-solid fa-scissors', label: 'Surgical / Instruments' },
  { icon: 'fa-solid fa-microscope', label: 'Equipment / Devices' },
  { icon: 'fa-solid fa-shield-virus', label: 'Care / Hygiene' },
  { icon: 'fa-solid fa-box-tissue', label: 'Consumables' },
  { icon: 'fa-solid fa-wand-magic-sparkles', label: 'Aesthetics / Ortho' },
  { icon: 'fa-solid fa-syringe', label: 'Anesthetics' },
  { icon: 'fa-solid fa-screwdriver-wrench', label: 'Rotors / Handpieces' },
  { icon: 'fa-solid fa-pills', label: 'Pharma / Meds' },
  { icon: 'fa-solid fa-gem', label: 'Ceramics' },
  { icon: 'fa-solid fa-layer-group', label: 'General / Bundles' },
];

interface CategoryFormState {
  id?: string;
  name: string;
  slug: string;
  categoryHeading: string;
  categoryBadge: string;
  icon: string;
  image: string;
  order: number;
  showInHome: boolean;
  showInSidebar: boolean;
}

const DEFAULT_FORM: CategoryFormState = {
  name: '',
  slug: '',
  categoryHeading: '',
  categoryBadge: '',
  icon: 'fa-solid fa-tooth',
  image: '',
  order: 0,
  showInHome: false,
  showInSidebar: false,
};

export const CategoryList: React.FC = () => {
  const { showToast } = useToast();
  const formRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<AdminCategory[]>(() => getCategories());
  const [form, setForm] = useState<CategoryFormState>(DEFAULT_FORM);
  const [isEditing, setIsEditing] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [fileName, setFileName] = useState('No file chosen');
  const [searchQuery, setSearchQuery] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      return (
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        (c.categoryBadge && c.categoryBadge.toLowerCase().includes(q)) ||
        (c.categoryHeading && c.categoryHeading.toLowerCase().includes(q))
      );
    });
  }, [categories, searchQuery]);

  // Handle Name Input -> Auto-slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    setForm((prev) => ({
      ...prev,
      name: val,
      slug: isEditing ? prev.slug : generatedSlug,
    }));
    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
  };

  // General field change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'order') {
      setForm((prev) => ({ ...prev, order: Number(value) || 0 }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSelectIcon = (iconClass: string) => {
    setForm((prev) => ({ ...prev, icon: iconClass }));
  };

  // Image Upload
  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file (JPG, PNG, WEBP, SVG).', 'danger');
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        showToast('Image size exceeds 4MB limit.', 'danger');
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm((prev) => ({ ...prev, image: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
      setFileName('No file chosen');
    }
  };

  const handleClearImage = () => {
    setForm((prev) => ({ ...prev, image: '' }));
    setFileName('No file chosen');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Reset form
  const resetForm = () => {
    setForm(DEFAULT_FORM);
    setFileName('No file chosen');
    setIsEditing(false);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Category name is required';
    if (!form.slug.trim()) errs.slug = 'Slug is required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      showToast('Please complete the required fields.', 'danger');
      return;
    }

    const cleanSlug = form.slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const categoryPayload: AdminCategory = {
      id: isEditing && form.id ? form.id : `cat-${Date.now()}`,
      name: form.name.trim(),
      slug: cleanSlug,
      categoryHeading: form.categoryHeading.trim(),
      categoryBadge: form.categoryBadge.trim(),
      icon: form.icon || 'fa-solid fa-tooth',
      image: form.image,
      images: form.image,
      description: '',
      shortDescription: '',
      order: Number(form.order) || 0,
      displayOrder: Number(form.order) || 0,
      showInHome: form.showInHome,
      showInSidebar: form.showInSidebar,
      totalProducts: isEditing && form.id ? (categories.find((c) => c.id === form.id)?.totalProducts ?? 0) : 0,
      status: 'Active',
    };

    if (isEditing && form.id) {
      const updated = categories.map((c) => (c.id === form.id ? categoryPayload : c));
      setCategories(updated);
      saveCategories(updated);
      showToast(`Category "${categoryPayload.name}" updated successfully!`, 'success');
    } else {
      const updated = [...categories, categoryPayload];
      setCategories(updated);
      saveCategories(updated);
      showToast(`Category "${categoryPayload.name}" created successfully!`, 'success');
    }

    resetForm();
  };

  // Edit
  const handleEdit = (cat: AdminCategory) => {
    setForm({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      categoryHeading: cat.categoryHeading || '',
      categoryBadge: cat.categoryBadge || '',
      icon: cat.icon || 'fa-solid fa-tooth',
      image: cat.image || cat.images || '',
      order: cat.order ?? cat.displayOrder ?? 0,
      showInHome: Boolean(cat.showInHome),
      showInSidebar: Boolean(cat.showInSidebar),
    });
    setFileName(cat.image || cat.images ? 'Existing image loaded' : 'No file chosen');
    setIsEditing(true);
    setIsFormVisible(true);
    setErrors({});
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

 

  // CSV Export
  const handleExportCSV = () => {
    exportTableToCSV({
      filename: `categories_directory_${new Date().toISOString().slice(0, 10)}.csv`,
      headers: ['Sr.No.', 'Category Name', 'Slug', 'Heading', 'Badge', 'Display Order', 'Show in Home', 'Show in Sidebar', 'Total Products', 'Status'],
      rows: filteredCategories.map((c, idx) => [
        idx + 1,
        c.name,
        c.slug,
        c.categoryHeading || '—',
        c.categoryBadge || '—',
        c.order ?? c.displayOrder ?? 0,
        c.showInHome ? 'Yes' : 'No',
        c.showInSidebar ? 'Yes' : 'No',
        c.totalProducts || 0,
        c.status || 'Active',
      ]),
    });
    showToast('Categories CSV report exported successfully.', 'success');
  };

  // PDF Export
  const handleExportPDF = () => {
    exportTableToPDF({
      title: 'BuyBright Categories Directory',
      subtitle: `Product catalog taxonomy & storefront display rules (${filteredCategories.length} categories)`,
      headers: ['Sr.No.', 'Category Name', 'Slug', 'Heading', 'Badge', 'Order', 'Show in Home'],
      rows: filteredCategories.map((c, idx) => [
        idx + 1,
        c.name,
        c.slug,
        c.categoryHeading || '—',
        c.categoryBadge || '—',
        c.order ?? c.displayOrder ?? 0,
        c.showInHome ? 'Yes' : 'No' 
      ]),
    });
    showToast('Categories PDF report exported successfully.', 'success');
  };

  // Table Columns
  const columns: Column<AdminCategory>[] = [
    {
      key: 'actions',
      header: 'Action',
      width: '90px',
      render: (cat) => (
        <div className="table-action-btns">
          <button
            type="button"
            className="btn-icon-action"
            title="Edit Category (Top Form)"
            onClick={() => handleEdit(cat)}
          >
            <i className="fa-solid fa-pen-to-square" style={{ color: '#0d9488' }} />
          </button>
          
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category Details & Icon',
      render: (cat) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Category Icon Badge */}
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
            title={`Icon: ${cat.icon || 'fa-solid fa-tooth'}`}
          >
            <i className={cat.icon || 'fa-solid fa-tooth'} />
          </div>

          {/* Category Image */}
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '8px',
              backgroundColor: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {cat.image || cat.images ? (
              <img
                src={cat.image || cat.images}
                alt={cat.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=200&q=80';
                }}
              />
            ) : (
              <i className="fa-regular fa-image" style={{ color: '#94a3b8', fontSize: '1.2rem' }} />
            )}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              {cat.categoryBadge && (
                <span
                  style={{
                    backgroundColor: '#ccfbf1',
                    color: '#0f766e',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '10px',
                    border: '1px solid #99f6e4',
                  }}
                >
                  {cat.categoryBadge}
                </span>
              )}
              <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>
                {cat.name}
              </strong>
            </div>
            {cat.categoryHeading && (
              <span style={{ fontSize: '0.74rem', color: '#0d9488', fontWeight: 600, display: 'block' }}>
                {cat.categoryHeading}
              </span>
            )}
            <code style={{ fontSize: '0.72rem', color: '#64748b' }}>/{cat.slug}</code>
          </div>
        </div>
      ),
    },
    {
      key: 'order',
      header: 'Order',
      width: '90px',
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
          #{cat.order ?? cat.displayOrder ?? 0}
        </span>
      ),
    },
    {
      key: 'showInHome',
      header: 'Show to Home Page',
      width: '145px',
      render: (cat) => (
        <span
          style={{
            fontSize: '0.74rem',
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: '12px',
            background: cat.showInHome ? '#dcfce7' : '#f1f5f9',
            color: cat.showInHome ? '#15803d' : '#64748b',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <i className={cat.showInHome ? 'fa-solid fa-check' : 'fa-solid fa-xmark'} />
          {cat.showInHome ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      key: 'showInSidebar',
      header: 'Show in Sidebar',
      width: '130px',
      render: (cat) => (
        <span
          style={{
            fontSize: '0.74rem',
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: '12px',
            background: cat.showInSidebar ? '#e0f2fe' : '#f1f5f9',
            color: cat.showInSidebar ? '#0369a1' : '#64748b',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <i className={cat.showInSidebar ? 'fa-solid fa-check' : 'fa-solid fa-xmark'} />
          {cat.showInSidebar ? 'Yes' : 'No'}
        </span>
      ),
    },
    
  ];

  return (
    <AdminLayout
      title="Product Categories"
      subtitle="Manage product category name, slug, category heading, badge, images, order, and home/sidebar visibility"
    >
      {/* ── Breadcrumb & Top Bar ── */}
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
          <span style={{ color: '#0d9488', fontWeight: 600 }}>Categories</span>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className={isFormVisible ? 'btn-admin-primary' : 'btn-admin-outline'}
            onClick={() => setIsFormVisible((prev) => !prev)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <i className={isFormVisible ? 'fa-solid fa-chevron-up' : 'fa-solid fa-plus'} />
            {isFormVisible ? 'Hide Category Form' : 'Add New Category'}
          </button>
          <button
            type="button"
            className="btn-admin-outline"
            onClick={handleExportPDF}
          >
            <i className="fa-solid fa-file-pdf" style={{ color: '#ef4444' }} /> Export PDF
          </button>
        </div>
      </div>

      {/* ── TOP OF THE PAGE: Add / Edit Category Form ── */}
      {isFormVisible && (
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
                  {isEditing ? `Edit Category: ${form.name}` : 'Add Category'}
                </h3>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
                  Provide category name, slug, heading, badge, image, order, and toggle visibility.
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
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '16px',
                marginBottom: '16px',
              }}
            >
              {/* 1. Category Name */}
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Category Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleNameChange}
                  placeholder="e.g. Endodontics"
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

              {/* 2. Slug */}
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Slug <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="e.g. endodontics"
                  className={`form-control ${errors.slug ? 'is-invalid' : ''}`}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: errors.slug ? '1.5px solid #ef4444' : '1.5px solid #cbd5e1',
                    fontSize: '0.88rem',
                    backgroundColor: '#f8fafc',
                  }}
                  required
                />
                {errors.slug && (
                  <span style={{ fontSize: '0.74rem', color: '#ef4444', marginTop: '4px', display: 'block' }}>
                    {errors.slug}
                  </span>
                )}
              </div>

              {/* 3. Category Heading (Optional) */}
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  <i className="fa-solid fa-heading" style={{ color: '#0d9488', marginRight: '6px' }} />
                  Category Heading <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 400 }}>(Optional)</span>
                </label>
                <input
                  type="text"
                  name="categoryHeading"
                  value={form.categoryHeading}
                  onChange={handleChange}
                  placeholder="e.g. Root Canal & Rotary Systems"
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

              {/* 4. Category Badge (Optional) */}
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  <i className="fa-solid fa-tag" style={{ color: '#0d9488', marginRight: '6px' }} />
                  Category Badge <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 400 }}>(Optional)</span>
                </label>
                <input
                  type="text"
                  name="categoryBadge"
                  value={form.categoryBadge}
                  onChange={handleChange}
                  placeholder="e.g. Bestseller, Featured, Premium"
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

              {/* 5. Category Icon Field */}
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

              {/* 6. Order */}
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={form.order}
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
                {POPULAR_CATEGORY_ICONS.map((item) => (
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

            {/* Images Field (Upload + URL + Preview) */}
            <div
              className="form-group"
              style={{
                marginBottom: '16px',
                background: '#f8fafc',
                padding: '14px 16px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
              }}
            >
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                Images
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFile}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '6px',
                      border: '1.5px solid #0d9488',
                      backgroundColor: '#f0fdfa',
                      color: '#0d9488',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <i className="fa-solid fa-cloud-arrow-up" /> Choose File
                  </button>
                  <span
                    style={{
                      fontSize: '0.82rem',
                      color: fileName === 'No file chosen' ? '#94a3b8' : '#0f766e',
                      fontWeight: fileName === 'No file chosen' ? 400 : 600,
                    }}
                  >
                    {fileName}
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: '220px' }}>
                  <input
                    type="text"
                    name="image"
                    value={form.image.startsWith('data:') ? '' : form.image}
                    onChange={handleChange}
                    placeholder="Or enter image URL (https://...)"
                    className="form-control"
                    style={{
                      width: '100%',
                      padding: '7px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.82rem',
                    }}
                  />
                </div>

                {form.image && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        border: '1.5px solid #0d9488',
                      }}
                    >
                      <img
                        src={form.image}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleClearImage}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                      }}
                    >
                      <i className="fa-solid fa-xmark" /> Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Show in Home Page & Show in Sidebar Checkbox Cards */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '14px',
                borderTop: '1px solid #f1f5f9',
                flexWrap: 'wrap',
                gap: '14px',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '12px',
                  width: '100%',
                }}
              >
                {/* 1. Show to Home Page Card */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: form.showInHome ? '1.5px solid #0d9488' : '1.5px solid #e2e8f0',
                    background: form.showInHome ? '#f0fdfa' : '#f8fafc',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        background: form.showInHome ? '#0d9488' : '#e2e8f0',
                        color: form.showInHome ? '#ffffff' : '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                      }}
                    >
                      <i className="fa-solid fa-house" />
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
                        Show to Home Page
                      </span>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748b' }}>
                        Feature on homepage
                      </span>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    name="showInHome"
                    checked={form.showInHome}
                    onChange={handleChange}
                    style={{ width: '18px', height: '18px', accentColor: '#0d9488', cursor: 'pointer' }}
                  />
                </label>

                {/* 2. Show in Sidebar Card */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: form.showInSidebar ? '1.5px solid #0d9488' : '1.5px solid #e2e8f0',
                    background: form.showInSidebar ? '#f0fdfa' : '#f8fafc',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        background: form.showInSidebar ? '#0d9488' : '#e2e8f0',
                        color: form.showInSidebar ? '#ffffff' : '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                      }}
                    >
                      <i className="fa-solid fa-bars-staggered" />
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
                        Show in Sidebar
                      </span>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748b' }}>
                        Shop filter menu
                      </span>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    name="showInSidebar"
                    checked={form.showInSidebar}
                    onChange={handleChange}
                    style={{ width: '18px', height: '18px', accentColor: '#0d9488', cursor: 'pointer' }}
                  />
                </label>
              </div>

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
                  style={{ padding: '8px 22px', fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <i className={isEditing ? 'fa-solid fa-floppy-disk' : 'fa-solid fa-plus'} />
                  {isEditing ? 'Update Category' : 'Save Category'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ── Search & Filter Bar ── */}
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
        <div style={{ flex: 1, minWidth: '260px', maxWidth: '380px' }}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search categories by name, slug, heading, badge..."
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-export-csv"
            onClick={handleExportCSV}
            title="Export Categories Directory to CSV"
          >
            <i className="fa-solid fa-file-csv" /> Export CSV
          </button>

          <button
            type="button"
            className="btn-export-pdf"
            onClick={handleExportPDF}
            title="Export Categories Directory to PDF"
          >
            <i className="fa-solid fa-file-pdf" /> Export PDF
          </button>

          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
            Total Categories: <strong>{filteredCategories.length}</strong>
          </span>
        </div>
      </div>

      {/* ── Category Data Table Listing ── */}
      <div className="admin-card" style={{ padding: '0', overflow: 'hidden' }}>
        <DataTable
          columns={columns}
          data={filteredCategories}
          keyExtractor={(cat) => cat.id}
          emptyMessage="No dental categories found matching your criteria."
        />
      </div>
    </AdminLayout>
  );
};

export default CategoryList;
