/**
 * BuyBright Admin — Category Form Page (Create / Edit).
 * Fields:
 *   1. Category Name *
 *   2. Slug *
 *   3. Category Heading (Optional)
 *   4. Category Badge (Optional)
 *   5. Category Icon
 *   6. Images (File upload + URL fallback + preview)
 *   7. Order
 *   8. Show in Home Page (checkbox)
 *   9. Show in Sidebar (checkbox)
 * Routes: /admin/products/categories/create & /admin/products/categories/edit/:id
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { getCategories, saveCategories, getCategoryById } from '../../../data/productsData';
import type { AdminCategory } from '../../../types/product';
import { useToast } from '../../../../context/ToastContext';

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

export const CategoryForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<CategoryFormState>(DEFAULT_FORM);
  const [fileName, setFileName] = useState('No file chosen');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      const category = getCategoryById(id);
      if (category) {
        setForm({
          name: category.name,
          slug: category.slug,
          categoryHeading: category.categoryHeading || '',
          categoryBadge: category.categoryBadge || '',
          icon: category.icon || 'fa-solid fa-tooth',
          image: category.image || category.images || '',
          order: category.order ?? category.displayOrder ?? 0,
          showInHome: Boolean(category.showInHome),
          showInSidebar: Boolean(category.showInSidebar),
        });
        if (category.image || category.images) {
          setFileName('Existing image loaded');
        }
      } else {
        showToast('Category not found.', 'danger');
        navigate('/admin/products/categories');
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
    }));
    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
  };

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

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Category name is required';
    if (!form.slug.trim()) errs.slug = 'Slug is required';
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
    const existing = getCategories();
    const cleanSlug = form.slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const categoryPayload: AdminCategory = {
      id: isEdit && id ? id : `cat-${Date.now()}`,
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
      totalProducts: isEdit && id ? (existing.find((c) => c.id === id)?.totalProducts ?? 0) : 0,
      status: 'Active',
    };

    if (isEdit && id) {
      const updated = existing.map((c) => (c.id === id ? categoryPayload : c));
      saveCategories(updated);
      showToast(`Category "${form.name}" updated successfully!`, 'success');
    } else {
      saveCategories([...existing, categoryPayload]);
      showToast(`Category "${form.name}" created successfully!`, 'success');
    }

    setIsSubmitting(false);
    navigate('/admin/products/categories');
  };

  return (
    <AdminLayout
      title={isEdit ? `Edit Category: ${form.name}` : 'Add Category'}
      subtitle="Manage product category name, slug, category heading, badge, image, order, and storefront visibility"
    >
      {/* ── Breadcrumb & Top Bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
          <Link to="/admin/products" style={{ color: '#64748b', textDecoration: 'none' }}>
            Products
          </Link>
          <span style={{ color: '#cbd5e1' }}>/</span>
          <Link to="/admin/products/categories" style={{ color: '#64748b', textDecoration: 'none' }}>
            Categories
          </Link>
          <span style={{ color: '#cbd5e1' }}>/</span>
          <span style={{ color: '#0d9488', fontWeight: 600 }}>{isEdit ? 'Edit Category' : 'Add Category'}</span>
        </div>
        <button
          type="button"
          className="btn-admin-outline"
          onClick={() => navigate('/admin/products/categories')}
        >
          <i className="fa-solid fa-arrow-left" /> Back to Categories
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '22px', alignItems: 'start' }}>
          {/* ════════ LEFT COLUMN: Fields ════════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="admin-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                <i className="fa-solid fa-layer-group" style={{ color: '#0d9488', fontSize: '1.1rem' }} />
                <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 700, color: '#0f172a' }}>
                  Category Information
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* 1. Category Name & 2. Slug */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                      Category Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleNameChange}
                      placeholder="e.g. Endodontics"
                      className="form-control"
                      style={{ width: '100%', borderColor: errors.name ? '#ef4444' : undefined }}
                      required
                    />
                    {errors.name && <span style={{ color: '#ef4444', fontSize: '0.74rem', marginTop: '3px', display: 'block' }}>{errors.name}</span>}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                      Slug <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={form.slug}
                      onChange={handleChange}
                      placeholder="e.g. endodontics"
                      className="form-control"
                      style={{ width: '100%', borderColor: errors.slug ? '#ef4444' : undefined, backgroundColor: '#f8fafc' }}
                      required
                    />
                    {errors.slug && <span style={{ color: '#ef4444', fontSize: '0.74rem', marginTop: '3px', display: 'block' }}>{errors.slug}</span>}
                  </div>
                </div>

                {/* 3. Category Heading & 4. Category Badge (Unmandatory / Optional) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px', background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '5px' }}>
                      <i className="fa-solid fa-heading" style={{ color: '#0d9488', marginRight: '6px' }} />
                      Category Heading <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 400 }}>(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="categoryHeading"
                      value={form.categoryHeading}
                      onChange={handleChange}
                      placeholder="e.g. Root Canal & Rotary Systems"
                      className="form-control"
                      style={{ width: '100%', fontSize: '0.84rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '5px' }}>
                      <i className="fa-solid fa-tag" style={{ color: '#0d9488', marginRight: '6px' }} />
                      Category Badge <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 400 }}>(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="categoryBadge"
                      value={form.categoryBadge}
                      onChange={handleChange}
                      placeholder="e.g. Bestseller, Featured, Premium"
                      className="form-control"
                      style={{ width: '100%', fontSize: '0.84rem' }}
                    />
                  </div>
                </div>

                {/* Category Icon Field with live preview */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
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
                      style={{ width: '100%', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>

                {/* Quick Icon Selector Palette */}
                <div>
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

                {/* Images Upload & URL */}
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Images <span style={{ fontSize: '0.74rem', color: '#64748b' }}>(Upload category banner/thumbnail)</span>
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
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
                      name="image"
                      value={form.image.startsWith('data:') ? '' : form.image}
                      onChange={handleChange}
                      placeholder="Or enter image URL (https://...)"
                      className="form-control"
                      style={{ flex: 1, minWidth: '200px', fontSize: '0.8rem', padding: '6px 10px' }}
                    />

                    {form.image && (
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
                    )}
                  </div>
                </div>

                {/* Order */}
                <div style={{ maxWidth: '240px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
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
                    style={{ width: '100%' }}
                  />
                </div>

                {/* Visibility Controls: Show to Home Page & Show in Sidebar */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '14px',
                    paddingTop: '16px',
                    borderTop: '1.5px solid #f1f5f9',
                  }}
                >
                  {/* 1. Show to Home Page Card */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      borderRadius: '10px',
                      border: form.showInHome ? '1.5px solid #0d9488' : '1.5px solid #e2e8f0',
                      background: form.showInHome ? '#f0fdfa' : '#f8fafc',
                      cursor: 'pointer',
                      userSelect: 'none',
                      transition: 'all 0.2s ease',
                      boxShadow: form.showInHome ? '0 2px 8px rgba(13,148,136,0.1)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          background: form.showInHome ? '#0d9488' : '#e2e8f0',
                          color: form.showInHome ? '#ffffff' : '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.95rem',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <i className="fa-solid fa-house" />
                      </div>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                          Show to Home Page
                        </span>
                        <span style={{ display: 'block', fontSize: '0.74rem', color: '#64748b' }}>
                          Feature in homepage specialties grid
                        </span>
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      name="showInHome"
                      checked={form.showInHome}
                      onChange={handleChange}
                      style={{
                        width: '20px',
                        height: '20px',
                        accentColor: '#0d9488',
                        cursor: 'pointer',
                        borderRadius: '4px',
                      }}
                    />
                  </label>

                  {/* 2. Show in Sidebar Card */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      borderRadius: '10px',
                      border: form.showInSidebar ? '1.5px solid #0d9488' : '1.5px solid #e2e8f0',
                      background: form.showInSidebar ? '#f0fdfa' : '#f8fafc',
                      cursor: 'pointer',
                      userSelect: 'none',
                      transition: 'all 0.2s ease',
                      boxShadow: form.showInSidebar ? '0 2px 8px rgba(13,148,136,0.1)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          background: form.showInSidebar ? '#0d9488' : '#e2e8f0',
                          color: form.showInSidebar ? '#ffffff' : '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.95rem',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <i className="fa-solid fa-bars-staggered" />
                      </div>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                          Show in Sidebar
                        </span>
                        <span style={{ display: 'block', fontSize: '0.74rem', color: '#64748b' }}>
                          Display in shop catalog filter menu
                        </span>
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      name="showInSidebar"
                      checked={form.showInSidebar}
                      onChange={handleChange}
                      style={{
                        width: '20px',
                        height: '20px',
                        accentColor: '#0d9488',
                        cursor: 'pointer',
                        borderRadius: '4px',
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn-admin-outline"
                onClick={() => navigate('/admin/products/categories')}
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
                {isEdit ? 'Update Category' : 'Save Category'}
              </button>
            </div>
          </div>

          {/* ════════ RIGHT COLUMN: Live Category Preview Card ════════ */}
          <div style={{ position: 'sticky', top: '20px' }}>
            <div className="admin-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0d9488', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
                <i className="fa-solid fa-eye" style={{ marginRight: '6px' }} /> Live Category Preview
              </div>

              {/* Category Image */}
              <div
                style={{
                  width: '100%',
                  height: '140px',
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                }}
              >
                {form.image ? (
                  <img
                    src={form.image}
                    alt={form.name || 'Category'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.78rem' }}>
                    <i className="fa-regular fa-image" style={{ fontSize: '2rem', display: 'block', marginBottom: '6px' }} />
                    No Image Selected
                  </div>
                )}
              </div>

              {/* Optional Category Badge & Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '4px' }}>
                {form.categoryBadge && (
                  <span
                    style={{
                      backgroundColor: '#ccfbf1',
                      color: '#0f766e',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '12px',
                      border: '1px solid #99f6e4',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <i className="fa-solid fa-tag" style={{ fontSize: '0.62rem' }} />
                    {form.categoryBadge}
                  </span>
                )}
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                  {form.name || 'Category Name'}
                </h4>
              </div>

              {/* Optional Category Heading */}
              {form.categoryHeading && (
                <div style={{ fontSize: '0.76rem', color: '#0d9488', fontWeight: 700, marginBottom: '6px' }}>
                  <i className="fa-solid fa-heading" style={{ marginRight: '4px', fontSize: '0.7rem' }} />
                  {form.categoryHeading}
                </div>
              )}

              <code style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '14px' }}>
                /{form.slug || 'category-slug'}
              </code>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>Order:</span>
                  <strong style={{ color: '#0f172a' }}>#{form.order}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', alignItems: 'center' }}>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>Show in Home:</span>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      background: form.showInHome ? '#dcfce7' : '#f1f5f9',
                      color: form.showInHome ? '#15803d' : '#64748b',
                    }}
                  >
                    {form.showInHome ? 'Yes' : 'No'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', alignItems: 'center' }}>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>Show in Sidebar:</span>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      background: form.showInSidebar ? '#e0f2fe' : '#f1f5f9',
                      color: form.showInSidebar ? '#0369a1' : '#64748b',
                    }}
                  >
                    {form.showInSidebar ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default CategoryForm;
