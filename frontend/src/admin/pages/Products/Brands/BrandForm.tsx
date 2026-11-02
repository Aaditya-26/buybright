/**
 * BuyBright Admin — Dedicated Brand Form Page.
 * Route: /admin/products/brands/create & /admin/products/brands/edit/:id
 * Fully synchronized with BrandList top form, supporting:
 *   - Brand Name * (e.g. Cycle Pure)
 *   - URL Slug * (e.g. cycle-pure)
 *   - Brand Category (dynamic dropdown)
 *   - Brand Logo (file upload with "No file chosen" preview)
 *   - Brand Description
 *   - Sort Order Sequence
 *   - Active Brand toggle
 *   - SEO Meta Fields (Title, Description, Keywords)
 *   - Live preview card & dental options
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { getBrands, saveBrands, getBrandById } from '../../../data/brandsData';
import { getBrandCategories } from '../../../data/brandCategoriesData';
import type { AdminBrand } from '../../../types/product';
import { useToast } from '../../../../context/ToastContext';

const COUNTRY_PRESETS = [
  { country: 'India', flag: '🇮🇳' },
  { country: 'USA', flag: '🇺🇸' },
  { country: 'Germany', flag: '🇩🇪' },
  { country: 'Japan', flag: '🇯🇵' },
  { country: 'Liechtenstein', flag: '🇱🇮' },
  { country: 'France', flag: '🇫🇷' },
  { country: 'Switzerland', flag: '🇨🇭' },
  { country: 'Global', flag: '🌏' },
];

export const BrandForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const { showToast } = useToast();
  const logoInputRef = useRef<HTMLInputElement>(null);

  const brandCategories = useMemo(() => getBrandCategories(), []);

  const [form, setForm] = useState<Omit<AdminBrand, 'id'>>({
    name: '',
    slug: '',
    brandCategoryId: '',
    brandCategoryName: '',
    logoUrl: '',
    country: 'India',
    countryFlag: '🇮🇳',
    specialty: 'Dental Supplies',
    categorySlug: 'general',
    categoryName: 'General',
    brandColor: '#008080',
    website: '',
    description: '',
    totalProducts: 0,
    isFeatured: false,
    status: 'Active',
    displayOrder: 0,
    sortOrder: 0,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  });

  const [fileName, setFileName] = useState('No file chosen');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!form.brandCategoryId && brandCategories.length > 0) {
      setForm((prev) => ({
        ...prev,
        brandCategoryId: brandCategories[0].id,
        brandCategoryName: brandCategories[0].name,
      }));
    }
  }, [brandCategories, form.brandCategoryId]);

  useEffect(() => {
    if (isEdit && id) {
      const brand = getBrandById(id);
      if (brand) {
        setForm({
          name: brand.name,
          slug: brand.slug,
          brandCategoryId: brand.brandCategoryId || '',
          brandCategoryName: brand.brandCategoryName || brand.categoryName || '',
          logoUrl: brand.logoUrl || '',
          country: brand.country,
          countryFlag: brand.countryFlag,
          specialty: brand.specialty || '',
          categorySlug: brand.categorySlug,
          categoryName: brand.categoryName || '',
          brandColor: brand.brandColor || '#008080',
          website: brand.website || '',
          description: brand.description || '',
          totalProducts: brand.totalProducts || 0,
          isFeatured: brand.isFeatured,
          status: brand.status,
          displayOrder: brand.sortOrder ?? brand.displayOrder ?? 0,
          sortOrder: brand.sortOrder ?? brand.displayOrder ?? 0,
          seoTitle: brand.seoTitle || '',
          seoDescription: brand.seoDescription || '',
          seoKeywords: brand.seoKeywords || '',
        });
        if (brand.logoUrl) setFileName('Existing logo loaded');
      } else {
        showToast('Brand not found in directory.', 'danger');
        navigate('/admin/products/brands');
      }
    }
  }, [id, isEdit, navigate, showToast]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    setForm((prev) => ({
      ...prev,
      name: val,
      slug: isEdit ? prev.slug : generatedSlug,
      seoTitle: isEdit ? prev.seoTitle : val ? `${val} Official Products | BuyBright` : '',
    }));
    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === 'isActive') {
        setForm((prev) => ({ ...prev, status: checked ? 'Active' : 'Inactive' }));
      } else {
        setForm((prev) => ({ ...prev, [name]: checked }));
      }
    } else if (name === 'sortOrder' || name === 'displayOrder') {
      setForm((prev) => ({
        ...prev,
        sortOrder: Number(value) || 0,
        displayOrder: Number(value) || 0,
      }));
    } else if (name === 'brandCategoryId') {
      const selected = brandCategories.find((c) => c.id === value);
      setForm((prev) => ({
        ...prev,
        brandCategoryId: value,
        brandCategoryName: selected?.name || '',
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file (PNG, SVG, WEBP, JPEG).', 'danger');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        showToast('Logo file size exceeds 2MB limit.', 'danger');
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

  const handleCountryPreset = (preset: { country: string; flag: string }) => {
    setForm((prev) => ({ ...prev, country: preset.country, countryFlag: preset.flag }));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Brand Name is required';
    if (!form.slug.trim()) errs.slug = 'URL Slug is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the required fields marked in red.', 'danger');
      return;
    }

    setIsSubmitting(true);
    const brands = getBrands();
    const cleanSlug = form.slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const brandPayload: AdminBrand = {
      id: isEdit && id ? id : `brand-${Date.now()}`,
      name: form.name.trim(),
      slug: cleanSlug,
      brandCategoryId: form.brandCategoryId,
      brandCategoryName: form.brandCategoryName,
      categorySlug: cleanSlug,
      categoryName: form.brandCategoryName,
      logoUrl: form.logoUrl || '/images/brands/superendo.svg',
      country: form.country,
      countryFlag: form.countryFlag,
      specialty: form.specialty || form.brandCategoryName || 'Dental Consumables',
      brandColor: form.brandColor,
      website: form.website,
      description: form.description?.trim() || '',
      totalProducts: form.totalProducts,
      isFeatured: form.isFeatured,
      status: form.status,
      displayOrder: form.sortOrder ?? 0,
      sortOrder: form.sortOrder ?? 0,
      seoTitle: form.seoTitle || `${form.name.trim()} Official Brand Products | BuyBright`,
      seoDescription: form.seoDescription || (form.description || '').slice(0, 160),
      seoKeywords: form.seoKeywords || `${form.name.toLowerCase()}, dental products, catalog`,
    };

    if (isEdit && id) {
      const updated = brands.map((b) => (b.id === id ? brandPayload : b));
      saveBrands(updated);
      showToast(`Brand "${form.name}" updated successfully!`, 'success');
    } else {
      saveBrands([brandPayload, ...brands]);
      showToast(`Brand "${form.name}" registered into directory!`, 'success');
    }

    setIsSubmitting(false);
    navigate('/admin/products/brands');
  };

  return (
    <AdminLayout
      title={isEdit ? `Edit Brand: ${form.name}` : 'Add Brand'}
      subtitle="Complete dental manufacturer profile, logo asset, sort order, and SEO fields"
    >
      {/* ── Breadcrumb Bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
          <Link to="/admin/products" style={{ color: '#64748b', textDecoration: 'none' }}>
            Products
          </Link>
          <span style={{ color: '#cbd5e1' }}>/</span>
          <Link to="/admin/products/brands" style={{ color: '#64748b', textDecoration: 'none' }}>
            Brands
          </Link>
          <span style={{ color: '#cbd5e1' }}>/</span>
          <span style={{ color: '#0d9488', fontWeight: 600 }}>{isEdit ? 'Edit Brand' : 'Add Brand'}</span>
        </div>

        <button
          type="button"
          className="btn-admin-outline"
          onClick={() => navigate('/admin/products/brands')}
        >
          <i className="fa-solid fa-arrow-left" /> Back to Brands List
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
          {/* ── Left Column: Form Fields ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Card 1: Core Brand Identity */}
            <div className="admin-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                <i className="fa-solid fa-certificate" style={{ color: '#0d9488', fontSize: '1.1rem' }} />
                <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 700, color: '#0f172a' }}>
                  Brand Identity &amp; Classification
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Brand Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleNameChange}
                      placeholder="e.g. Cycle Pure"
                      className="form-control"
                      style={{ width: '100%', borderColor: errors.name ? '#ef4444' : undefined }}
                      required
                    />
                    {errors.name && <span style={{ color: '#ef4444', fontSize: '0.74rem' }}>{errors.name}</span>}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      URL Slug <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={form.slug}
                      onChange={handleChange}
                      placeholder="e.g. cycle-pure"
                      className="form-control"
                      style={{ width: '100%', borderColor: errors.slug ? '#ef4444' : undefined }}
                      required
                    />
                    {errors.slug && <span style={{ color: '#ef4444', fontSize: '0.74rem' }}>{errors.slug}</span>}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Brand Category <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      name="brandCategoryId"
                      value={form.brandCategoryId}
                      onChange={handleChange}
                      className="form-control"
                      style={{ width: '100%' }}
                    >
                      {brandCategories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
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
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                {/* Brand Logo Upload Field */}
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Brand Logo
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoFile}
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '6px',
                        border: '1.5px solid #0d9488',
                        background: '#f0fdfa',
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

                    <input
                      type="text"
                      name="logoUrl"
                      value={form.logoUrl.startsWith('data:') ? '' : form.logoUrl}
                      onChange={handleChange}
                      placeholder="Or enter logo image URL (/images/brands/...)"
                      className="form-control"
                      style={{ flex: 1, minWidth: '200px', fontSize: '0.8rem', padding: '6px 10px' }}
                    />
                  </div>
                </div>

                {/* Brand Description */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Brand Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="e.g. Renowned brand for high quality incense and spiritual products..."
                    className="form-control"
                    style={{ width: '100%', resize: 'vertical' }}
                  />
                </div>
              </div>
            </div>

            {/* Card 2: SEO Optimization Section */}
            <div className="admin-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                <i className="fa-solid fa-magnifying-glass" style={{ color: '#0d9488', fontSize: '1rem' }} />
                <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 700, color: '#0f172a' }}>
                  Search Engine Optimization (SEO) Fields
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    SEO Meta Title
                  </label>
                  <input
                    type="text"
                    name="seoTitle"
                    value={form.seoTitle}
                    onChange={handleChange}
                    placeholder="e.g. Cycle Pure Official Products | BuyBright"
                    className="form-control"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    SEO Meta Keywords
                  </label>
                  <input
                    type="text"
                    name="seoKeywords"
                    value={form.seoKeywords}
                    onChange={handleChange}
                    placeholder="e.g. cycle pure, dental instruments, certified dental catalog"
                    className="form-control"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    SEO Meta Description
                  </label>
                  <textarea
                    name="seoDescription"
                    value={form.seoDescription}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Brief description for search results (approx 150-160 characters)..."
                    className="form-control"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>

            {/* Card 3: Regional & Visual Customization */}
            <div className="admin-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                <i className="fa-solid fa-palette" style={{ color: '#0d9488', fontSize: '1rem' }} />
                <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 700, color: '#0f172a' }}>
                  Regional &amp; Brand Styling
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Country of Origin &amp; Flag
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {COUNTRY_PRESETS.map((p) => (
                      <button
                        key={p.country}
                        type="button"
                        onClick={() => handleCountryPreset(p)}
                        style={{
                          background: form.country === p.country ? '#f0fdfa' : '#ffffff',
                          border: form.country === p.country ? '1.5px solid #0d9488' : '1px solid #e2e8f0',
                          borderRadius: '6px',
                          padding: '5px 10px',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                        }}
                      >
                        {p.flag} {p.country}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Dental Specialty
                    </label>
                    <input
                      type="text"
                      name="specialty"
                      value={form.specialty}
                      onChange={handleChange}
                      placeholder="e.g. Rotary NiTi Files & Bioceramics"
                      className="form-control"
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Official Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={form.website}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="form-control"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                {/* Status and Active Switch */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', paddingTop: '10px', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
                  <label
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: '#1e293b',
                    }}
                  >
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={form.status === 'Active'}
                      onChange={handleChange}
                      style={{ width: '18px', height: '18px', accentColor: '#0d9488', cursor: 'pointer' }}
                    />
                    <span>Active Brand</span>
                  </label>

                  <label
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
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
              </div>
            </div>

            {/* Form Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn-admin-outline"
                onClick={() => navigate('/admin/products/brands')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-admin-primary"
                disabled={isSubmitting}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 24px' }}
              >
                <i className={isEdit ? 'fa-solid fa-floppy-disk' : 'fa-solid fa-plus'} />
                {isEdit ? 'Update Brand' : 'Save Brand'}
              </button>
            </div>
          </div>

          {/* ── Right Column: Live Luxury Brand Card Preview ── */}
          <div style={{ position: 'sticky', top: '20px' }}>
            <div className="admin-card" style={{ padding: '20px', borderTop: `4px solid ${form.brandColor || '#0d9488'}` }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0d9488', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
                <i className="fa-solid fa-eye" style={{ marginRight: '6px' }} /> Live Brand Card Preview
              </div>

              {/* Brand Logo Container */}
              <div
                style={{
                  width: '100%',
                  height: '110px',
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px',
                  marginBottom: '16px',
                }}
              >
                <img
                  src={form.logoUrl || '/images/brands/superendo.svg'}
                  alt={form.name || 'Brand Logo'}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/brands/superendo.svg';
                  }}
                />
              </div>

              {/* Title and Country */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                  {form.name || 'Brand Name'}
                </h4>
                <span style={{ fontSize: '1rem' }} title={form.country}>
                  {form.countryFlag}
                </span>
              </div>

              <div style={{ fontSize: '0.76rem', color: '#0d9488', fontWeight: 700, marginBottom: '6px' }}>
                {form.brandCategoryName || 'Brand Category'}
              </div>

              <div style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '12px', lineHeight: 1.4 }}>
                {form.description || 'Brand description will appear here...'}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '10px',
                    background: form.status === 'Active' ? '#dcfce7' : '#fee2e2',
                    color: form.status === 'Active' ? '#15803d' : '#b91c1c',
                  }}
                >
                  {form.status}
                </span>

                <span style={{ fontSize: '0.74rem', color: '#475569', fontWeight: 600 }}>
                  Sort Order: #{form.sortOrder ?? 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default BrandForm;
