/**
 * BuyBright Admin — Brands Directory Management Page.
 * Features:
 *   - Comprehensive Add/Edit Brand Form right on the top of the page.
 *   - Form fields: Brand Name, URL Slug, Brand Category, Brand Logo, Brand Description,
 *     Sort Order Sequence, Active Brand toggle, and SEO fields.
 *   - Live Brand Listing Table below with real-time editing, status toggle, search, category filter, and PDF export.
 * Route: /admin/products/brands
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { DataTable, type Column } from '../../../components/DataTable';
import { SearchBar } from '../../../components/SearchBar';
import { getBrands, saveBrands } from '../../../data/brandsData';
import { getBrandCategories } from '../../../data/brandCategoriesData';
import type { AdminBrand } from '../../../types/product';
import { useToast } from '../../../../context/ToastContext';
import { exportTableToPDF } from '../../../utils/exportPdf';
import { exportTableToCSV } from '../../../utils/exportCsv';
import '../ProductsModule.scss';

interface BrandFormState {
  id?: string;
  name: string;
  slug: string;
  brandCategoryId: string;
  brandCategoryName: string;
  logoUrl: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  // SEO fields
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  // Dental / extra metadata
  specialty: string;
  country: string;
  countryFlag: string;
  brandColor: string;
  website: string;
  isFeatured: boolean;
}

const DEFAULT_FORM: BrandFormState = {
  name: '',
  slug: '',
  brandCategoryId: '',
  brandCategoryName: '',
  logoUrl: '',
  description: '',
  sortOrder: 0,
  isActive: true,
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
  specialty: '',
  country: 'India',
  countryFlag: '🇮🇳',
  brandColor: '#008080',
  website: '',
  isFeatured: false,
};

const COUNTRY_OPTIONS = [
  { name: 'India', flag: '🇮🇳' },
  { name: 'USA', flag: '🇺🇸' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'Japan', flag: '🇯🇵' },
  { name: 'Liechtenstein', flag: '🇱🇮' },
  { name: 'France', flag: '🇫🇷' },
  { name: 'Switzerland', flag: '🇨🇭' },
  { name: 'Global', flag: '🌏' },
];

export const BrandList: React.FC = () => {
  const { showToast } = useToast();
  const formRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [brands, setBrands] = useState<AdminBrand[]>(() => getBrands());
  const [form, setForm] = useState<BrandFormState>(DEFAULT_FORM);
  const [isEditing, setIsEditing] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [fileName, setFileName] = useState<string>('No file chosen');
  const [showSeoSettings, setShowSeoSettings] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Load Brand Categories
  const brandCategories = useMemo(() => getBrandCategories(), []);

  // Initialize brandCategory if empty
  useEffect(() => {
    if (!form.brandCategoryId && brandCategories.length > 0) {
      setForm((prev) => ({
        ...prev,
        brandCategoryId: brandCategories[0].id,
        brandCategoryName: brandCategories[0].name,
      }));
    }
  }, [brandCategories, form.brandCategoryId]);

  // Filtered brands list
  const filteredBrands = useMemo(() => {
    return brands.filter((b) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.slug.toLowerCase().includes(q) ||
        (b.specialty && b.specialty.toLowerCase().includes(q)) ||
        (b.brandCategoryName && b.brandCategoryName.toLowerCase().includes(q)) ||
        (b.description && b.description.toLowerCase().includes(q));

      const matchCategory =
        categoryFilter === 'All' ||
        b.brandCategoryId === categoryFilter ||
        b.categorySlug === categoryFilter;

      const matchStatus = statusFilter === 'All' || b.status === statusFilter;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [brands, searchQuery, categoryFilter, statusFilter]);

  // Handle Name Input -> Auto Slug & SEO Title
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
      seoTitle: isEditing ? prev.seoTitle : val ? `${val} Official Brand Products | BuyBright` : '',
    }));
    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
  };

  // General Input Change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'sortOrder') {
      setForm((prev) => ({ ...prev, sortOrder: Number(value) || 0 }));
    } else if (name === 'brandCategoryId') {
      const selected = brandCategories.find((c) => c.id === value);
      setForm((prev) => ({
        ...prev,
        brandCategoryId: value,
        brandCategoryName: selected?.name || '',
      }));
    } else if (name === 'country') {
      const countryObj = COUNTRY_OPTIONS.find((c) => c.name === value);
      setForm((prev) => ({
        ...prev,
        country: value,
        countryFlag: countryObj?.flag || '🌏',
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Handle Logo File Upload
  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file (PNG, SVG, WEBP, JPEG).', 'danger');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image size exceeds 2MB limit.', 'danger');
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm((prev) => ({ ...prev, logoUrl: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
      setFileName('No file chosen');
    }
  };

  const handleClearLogo = () => {
    setForm((prev) => ({ ...prev, logoUrl: '' }));
    setFileName('No file chosen');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Reset Form
  const resetForm = () => {
    setForm({
      ...DEFAULT_FORM,
      brandCategoryId: brandCategories[0]?.id || '',
      brandCategoryName: brandCategories[0]?.name || '',
    });
    setFileName('No file chosen');
    setIsEditing(false);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Validate and Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Brand Name is required';
    if (!form.slug.trim()) errs.slug = 'URL Slug is required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      showToast('Please complete the required fields marked in red.', 'danger');
      return;
    }

    const cleanSlug = form.slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const brandPayload: AdminBrand = {
      id: isEditing && form.id ? form.id : `brand-${Date.now()}`,
      name: form.name.trim(),
      slug: cleanSlug,
      brandCategoryId: form.brandCategoryId,
      brandCategoryName: form.brandCategoryName,
      categorySlug: cleanSlug,
      categoryName: form.brandCategoryName,
      logoUrl: form.logoUrl || '/images/brands/superendo.svg',
      description: form.description.trim(),
      sortOrder: Number(form.sortOrder) || 0,
      displayOrder: Number(form.sortOrder) || 0,
      status: form.isActive ? 'Active' : 'Inactive',
      isFeatured: form.isFeatured,
      specialty: form.specialty || form.brandCategoryName || 'Dental Consumables',
      country: form.country,
      countryFlag: form.countryFlag,
      brandColor: form.brandColor,
      website: form.website,
      totalProducts: isEditing && form.id ? (brands.find((b) => b.id === form.id)?.totalProducts ?? 0) : 0,
      seoTitle: form.seoTitle || `${form.name.trim()} Official Dental Products | BuyBright`,
      seoDescription: form.seoDescription || form.description.slice(0, 160),
      seoKeywords: form.seoKeywords || `${form.name.toLowerCase()}, dental products, dental supplies`,
    };

    if (isEditing && form.id) {
      const updated = brands.map((b) => (b.id === form.id ? brandPayload : b));
      setBrands(updated);
      saveBrands(updated);
      showToast(`Brand "${brandPayload.name}" updated successfully!`, 'success');
    } else {
      const updated = [brandPayload, ...brands];
      setBrands(updated);
      saveBrands(updated);
      showToast(`Brand "${brandPayload.name}" registered successfully!`, 'success');
    }

    resetForm();
  };

  // Edit action: Populate top form & scroll
  const handleEdit = (brand: AdminBrand) => {
    setForm({
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      brandCategoryId: brand.brandCategoryId || '',
      brandCategoryName: brand.brandCategoryName || brand.categoryName || '',
      logoUrl: brand.logoUrl || '',
      description: brand.description || '',
      sortOrder: brand.sortOrder ?? brand.displayOrder ?? 0,
      isActive: brand.status === 'Active',
      seoTitle: brand.seoTitle || '',
      seoDescription: brand.seoDescription || '',
      seoKeywords: brand.seoKeywords || '',
      specialty: brand.specialty || '',
      country: brand.country || 'India',
      countryFlag: brand.countryFlag || '🇮🇳',
      brandColor: brand.brandColor || '#008080',
      website: brand.website || '',
      isFeatured: brand.isFeatured || false,
    });
    setFileName(brand.logoUrl ? 'Existing logo loaded' : 'No file chosen');
    setIsEditing(true);
    setIsFormVisible(true);
    setErrors({});
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleToggleStatus = (brand: AdminBrand) => {
    const updatedStatus: AdminBrand['status'] = brand.status === 'Active' ? 'Inactive' : 'Active';
    const updated = brands.map((b) => (b.id === brand.id ? { ...b, status: updatedStatus } : b));
    setBrands(updated);
    saveBrands(updated);
    showToast(`Brand "${brand.name}" set to ${updatedStatus}.`, 'info');
  };


  const handleExportCSV = () => {
    exportTableToCSV({
      filename: `brands_directory_${new Date().toISOString().slice(0, 10)}.csv`,
      headers: ['Sr.No.', 'Brand Name', 'URL Slug', 'Category', 'Sort Order', 'Status'],
      rows: filteredBrands.map((b, idx) => [
        idx + 1,
        b.name,
        b.slug,
        b.brandCategoryName || b.categoryName || 'General',
        b.sortOrder ?? b.displayOrder ?? 0,
        b.status,
      ]),
    });
    showToast('Brands CSV report exported successfully.', 'success');
  };

  const handleExportPDF = () => {
    exportTableToPDF({
      title: 'BuyBright Brands Directory',
      subtitle: `Authorized dental manufacturers & partners (${filteredBrands.length} brands)`,
      headers: ['Sr.No.', 'Brand Name', 'URL Slug', 'Category', 'Sort Order', 'Status'],
      rows: filteredBrands.map((b, idx) => [
        idx + 1,
        b.name,
        b.slug,
        b.brandCategoryName || b.categoryName || 'General',
        b.sortOrder ?? b.displayOrder ?? 0,
        b.status,
      ]),
    });
    showToast('Brands PDF report exported successfully.', 'success');
  };

  // KPI Metrics
  const totalSKUs = brands.reduce((sum, b) => sum + (b.totalProducts || 0), 0);
  const stats = [
    {
      label: 'Authorized Brands',
      value: brands.length,
      icon: 'fa-solid fa-certificate',
      color: '#0d9488',
      bg: '#f0fdfa',
      border: '#ccfbf1',
    },
    {
      label: 'Featured Spotlight',
      value: brands.filter((b) => b.isFeatured).length,
      icon: 'fa-solid fa-star',
      color: '#f59e0b',
      bg: '#fffbeb',
      border: '#fde68a',
    },
    {
      label: 'Active Partners',
      value: brands.filter((b) => b.status === 'Active').length,
      icon: 'fa-solid fa-circle-check',
      color: '#16a34a',
      bg: '#f0fdf4',
      border: '#bbf7d0',
    },
    {
      label: 'Catalog SKUs Linked',
      value: totalSKUs,
      icon: 'fa-solid fa-boxes-stacked',
      color: '#6366f1',
      bg: '#eef2ff',
      border: '#e0e7ff',
    },
  ];

  // Table Columns
  const columns: Column<AdminBrand>[] = [
    {
      key: 'actions',
      header: 'Action',
      width: '90px',
      render: (b) => (
        <div className="table-action-btns">
          <button
            type="button"
            className="btn-icon-action"
            title="Edit Brand (Top Form)"
            onClick={() => handleEdit(b)}
          >
            <i className="fa-solid fa-pen-to-square" style={{ color: '#0d9488' }} />
          </button>
          <button
            type="button"
            className="btn-icon-action"
            title={b.status === 'Active' ? 'Deactivate' : 'Activate'}
            onClick={() => handleToggleStatus(b)}
          >
            <i
              className={`fa-solid ${b.status === 'Active' ? 'fa-toggle-on' : 'fa-toggle-off'}`}
              style={{ color: b.status === 'Active' ? '#10b981' : '#94a3b8' }}
            />
          </button>
        </div>
      ),
    },
    {
      key: 'brand',
      header: 'Brand Name & Logo',
      minWidth: '220px',
      render: (b) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              backgroundColor: '#ffffff',
              border: `1.5px solid ${b.brandColor || '#e2e8f0'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              flexShrink: 0,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <img
              src={b.logoUrl || '/images/brands/superendo.svg'}
              alt={b.name}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/brands/superendo.svg';
              }}
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>
                {b.name}
              </span>
              {b.isFeatured && (
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    background: '#fef3c7',
                    color: '#b45309',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    border: '1px solid #fde68a',
                  }}
                >
                  SPOTLIGHT
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <code style={{ fontSize: '0.74rem', color: '#0d9488' }}>/{b.slug}</code>
              {b.website && (
                <a
                  href={b.website}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '0.72rem', color: '#64748b', textDecoration: 'none' }}
                >
                  <i className="fa-solid fa-arrow-up-right-from-square" />
                </a>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Brand Category',
      minWidth: '130px',
      render: (b) => (
        <span
          style={{
            fontSize: '0.78rem',
            fontWeight: 600,
            color: '#0f766e',
            background: '#f0fdfa',
            padding: '3px 10px',
            borderRadius: '6px',
            border: '1px solid #ccfbf1',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <i className="fa-solid fa-layer-group" style={{ fontSize: '0.7rem' }} />
          {b.brandCategoryName || b.categoryName || 'General'}
        </span>
      ),
    },
  
    {
      key: 'sortOrder',
      header: 'Sort Order',
      width: '95px',
      render: (b) => (
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
          #{b.sortOrder ?? b.displayOrder ?? 0}
        </span>
      ),
    },
  
    {
      key: 'status',
      header: 'Status',
      width: '100px',
      render: (b) => (
        <span
          style={{
            fontSize: '0.74rem',
            fontWeight: 700,
            padding: '3px 9px',
            borderRadius: '12px',
            background: b.status === 'Active' ? '#dcfce7' : '#fee2e2',
            color: b.status === 'Active' ? '#15803d' : '#b91c1c',
          }}
        >
          {b.status}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Brands Directory"
      subtitle="Manage manufacturer brands, brand categories, logo assets, sort orders, and SEO profiles"
    >
      <div className="products-admin-wrapper">
        {/* ── Breadcrumb & Action Bar ── */}
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
            <span style={{ color: '#0d9488', fontWeight: 600 }}>Brands</span>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link
              to="/admin/products/brand-categories"
              className="btn-admin-outline"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
            <i className="fa-solid fa-layer-group" style={{ color: '#0d9488' }} /> Manage Brand Categories
          </Link>
          <button
            type="button"
            className={isFormVisible ? 'btn-admin-primary' : 'btn-admin-outline'}
            onClick={() => setIsFormVisible((prev) => !prev)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <i className={isFormVisible ? 'fa-solid fa-chevron-up' : 'fa-solid fa-plus'} />
            {isFormVisible ? 'Hide Brand Form' : 'Add New Brand'}
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

      {/* ── TOP OF THE PAGE: Add / Edit Brand Form ── */}
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
          {/* Form Header */}
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
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: isEditing ? '#0d9488' : '#f0fdfa',
                  color: isEditing ? '#ffffff' : '#0d9488',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                }}
              >
                <i className={isEditing ? 'fa-solid fa-pen-nib' : 'fa-solid fa-certificate'} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  {isEditing ? `Edit Brand: ${form.name}` : 'Add Brand'}
                </h3>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
                  {isEditing
                    ? 'Modify manufacturer details, logo asset, sort sequence, SEO meta tags, and status.'
                    : 'Register an authorized manufacturer or dental supply brand with full catalog SEO.'}
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
            {/* Primary Fields Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '16px',
                marginBottom: '16px',
              }}
            >
              {/* Brand Name * */}
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Brand Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleNameChange}
                  placeholder="e.g. Cycle Pure"
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

              {/* URL Slug * */}
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  URL Slug <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="e.g. cycle-pure"
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

              {/* Brand Category */}
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Brand Category <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  name="brandCategoryId"
                  value={form.brandCategoryId}
                  onChange={handleChange}
                  className="form-control"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                  }}
                >
                  {brandCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Order Sequence */}
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Sort Order Sequence
                </label>
                <input
                  type="number"
                  name="sortOrder"
                  value={form.sortOrder}
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

            {/* Brand Logo Upload Field */}
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
                Brand Logo <span style={{ fontSize: '0.74rem', color: '#64748b' }}>(SVG, PNG, or WEBP Recommended)</span>
              </label>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                {/* Visual File Input */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFile}
                    id="brand-logo-file-input"
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

                {/* Direct URL Fallback */}
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <input
                    type="text"
                    name="logoUrl"
                    value={form.logoUrl.startsWith('data:') ? '' : form.logoUrl}
                    onChange={handleChange}
                    placeholder="Or enter logo URL (e.g. /images/brands/sample.svg)"
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

                {/* Logo Preview */}
                {form.logoUrl && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '8px',
                        backgroundColor: '#ffffff',
                        border: '1.5px solid #0d9488',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title="Logo Preview"
                    >
                      <img
                        src={form.logoUrl}
                        alt="Logo Preview"
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/brands/superendo.svg';
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleClearLogo}
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

            {/* Brand Description */}
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Brand Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="e.g. Renowned brand for high quality incense and spiritual products..."
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

            {/* Additional Settings & SEO Toggle */}
            <div style={{ marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => setShowSeoSettings((prev) => !prev)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0d9488',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0',
                }}
              >
                <i className={showSeoSettings ? 'fa-solid fa-chevron-down' : 'fa-solid fa-chevron-right'} />
                {showSeoSettings ? 'Hide SEO & Regional Metadata' : 'Show SEO & Regional Metadata (+)'}
              </button>

              {showSeoSettings && (
                <div
                  style={{
                    marginTop: '12px',
                    padding: '16px',
                    borderRadius: '10px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                    <i className="fa-solid fa-magnifying-glass" style={{ color: '#0d9488', marginRight: '6px' }} />
                    Search Engine Optimization (SEO) Fields
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                        SEO Meta Title
                      </label>
                      <input
                        type="text"
                        name="seoTitle"
                        value={form.seoTitle}
                        onChange={handleChange}
                        placeholder="e.g. Cycle Pure Official Products | BuyBright"
                        className="form-control"
                        style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                        SEO Meta Keywords
                      </label>
                      <input
                        type="text"
                        name="seoKeywords"
                        value={form.seoKeywords}
                        onChange={handleChange}
                        placeholder="e.g. dental files, dental instruments, equipment"
                        className="form-control"
                        style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                      SEO Meta Description
                    </label>
                    <textarea
                      name="seoDescription"
                      value={form.seoDescription}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Meta summary shown on search engines (150-160 characters)..."
                      className="form-control"
                      style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                    />
                  </div>

                  <h4 style={{ margin: '14px 0 10px 0', fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
                    <i className="fa-solid fa-globe" style={{ color: '#0d9488', marginRight: '6px' }} />
                    Origin &amp; Brand Metadata
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                        Country / Origin
                      </label>
                      <select
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        className="form-control"
                        style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                      >
                        {COUNTRY_OPTIONS.map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.flag} {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                        Dental Specialty
                      </label>
                      <input
                        type="text"
                        name="specialty"
                        value={form.specialty}
                        onChange={handleChange}
                        placeholder="e.g. Bioceramics & NiTi Files"
                        className="form-control"
                        style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                        Official Website
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={form.website}
                        onChange={handleChange}
                        placeholder="https://..."
                        className="form-control"
                        style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                        Brand Accent Color
                      </label>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <input
                          type="color"
                          name="brandColor"
                          value={form.brandColor}
                          onChange={handleChange}
                          style={{ width: '38px', height: '34px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                        />
                        <input
                          type="text"
                          name="brandColor"
                          value={form.brandColor}
                          onChange={handleChange}
                          className="form-control"
                          style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Row: Active Brand Switch & Submit Buttons */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '14px',
                borderTop: '1px solid #f1f5f9',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                {/* Active Brand Checkbox */}
                <label
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    userSelect: 'none',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: '#1e293b',
                  }}
                >
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                    style={{ width: '18px', height: '18px', accentColor: '#0d9488', cursor: 'pointer' }}
                  />
                  <span>Active Brand (Shown in Storefront Catalog &amp; Brand Filter)</span>
                </label>

                {/* Featured in Spotlight Checkbox */}
                <label
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    userSelect: 'none',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    color: '#64748b',
                  }}
                >
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={form.isFeatured}
                    onChange={handleChange}
                    style={{ width: '16px', height: '16px', accentColor: '#f59e0b', cursor: 'pointer' }}
                  />
                  <span>Spotlight Featured Partner</span>
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
                  {isEditing ? 'Update Brand' : 'Save Brand'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ── KPI Stat Cards ── */}
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

      {/* ── Search & Filter Controls ── */}
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
            placeholder="Search by brand name, specialty, or slug..."
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Brand Category Filter */}
          <select
            className="form-control"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1.5px solid #cbd5e1',
              fontSize: '0.85rem',
              color: '#334155',
              cursor: 'pointer',
            }}
          >
            <option value="All">All Categories</option>
            {brandCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
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
            <option value="All">All Statuses ({brands.length})</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>

          {/* Export CSV & PDF Buttons */}
          <button
            type="button"
            className="btn-export-csv"
            onClick={handleExportCSV}
            title="Export Brands Directory to CSV"
          >
            <i className="fa-solid fa-file-csv" /> Export CSV
          </button>

          <button
            type="button"
            className="btn-export-pdf"
            onClick={handleExportPDF}
            title="Export Brands Directory to PDF"
          >
            <i className="fa-solid fa-file-pdf" /> Export PDF
          </button>

          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
            Showing <strong>{filteredBrands.length}</strong> of {brands.length}
          </span>
        </div>
      </div>

      {/* ── Data Table Listing ── */}
      <div className="admin-card" style={{ padding: '0', overflow: 'hidden' }}>
        <DataTable
          columns={columns}
          data={filteredBrands}
          keyExtractor={(item) => item.id}
          emptyMessage="No brands match the selected filters."
        />
      </div>
    </div>
  </AdminLayout>
  );
};

export default BrandList;
