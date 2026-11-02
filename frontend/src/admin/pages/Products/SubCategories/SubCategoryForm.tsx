/**
 * BuyBright Admin — Sub-Category Form Page.
 * Streamlined form with clean image upload, taxonomy mapping, and live preview.
 * Fully responsive layout powered by external SCSS styles (no inline styles).
 * Route: /admin/products/subcategories/create & /admin/products/subcategories/edit/:id
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { getSubCategories, saveSubCategories, getSubCategoryById } from '../../../data/subCategoriesData';
import { getCategories } from '../../../data/productsData';
import type { AdminSubCategory } from '../../../types/product';
import { useToast } from '../../../../context/ToastContext';

export const SubCategoryForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories] = useState(() => getCategories());
  const [fileName, setFileName] = useState('No file chosen');

  const [form, setForm] = useState<Omit<AdminSubCategory, 'id'>>({
    name: '',
    slug: '',
    parentCategoryId: categories[0]?.id || 'cat-1',
    parentCategoryName: categories[0]?.name || 'Endodontics',
    description: '',
    image: '',
    totalProducts: 0,
    displayOrder: 1,
    order: 1,
    status: 'Active',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      const sub = getSubCategoryById(id);
      if (sub) {
        setForm({
          name: sub.name,
          slug: sub.slug,
          parentCategoryId: sub.parentCategoryId,
          parentCategoryName: sub.parentCategoryName,
          description: sub.description || '',
          image: sub.image || '',
          totalProducts: sub.totalProducts || 0,
          displayOrder: sub.displayOrder ?? sub.order ?? 1,
          order: sub.order ?? sub.displayOrder ?? 1,
          status: sub.status,
        });

        if (sub.image) {
          setFileName(sub.image?.startsWith('data:') ? 'Uploaded image' : sub.image.split('/').pop() || 'Existing image');
        }
      } else {
        showToast('Sub-category not found.', 'danger');
        navigate('/admin/products/subcategories');
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
      slug: !isEdit ? generatedSlug : prev.slug,
    }));
    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
  };

  const handleParentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const catId = e.target.value;
    const cat = categories.find((c) => c.id === catId);
    setForm((prev) => ({
      ...prev,
      parentCategoryId: catId,
      parentCategoryName: cat?.name || '',
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'displayOrder' || name === 'order') {
      const num = Number(value) || 1;
      setForm((prev) => ({ ...prev, displayOrder: num, order: num }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
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
    if (!form.name.trim()) errs.name = 'Sub-category name is required';
    if (!form.slug.trim()) errs.slug = 'URL slug is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix validation errors before saving.', 'danger');
      return;
    }

    setIsSubmitting(true);
    const existing = getSubCategories();

    const cleanSlug = form.slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const payload: AdminSubCategory = {
      ...form,
      id: isEdit && id ? id : `subcat-${Date.now()}`,
      slug: cleanSlug,
      displayOrder: Number(form.displayOrder) || 1,
      order: Number(form.displayOrder) || 1,
    };

    if (isEdit && id) {
      const updated = existing.map((sc) => (sc.id === id ? payload : sc));
      saveSubCategories(updated);
      showToast(`Sub-category "${form.name}" updated successfully!`, 'success');
    } else {
      saveSubCategories([...existing, payload]);
      showToast(`Sub-category "${form.name}" created successfully!`, 'success');
    }

    setIsSubmitting(false);
    navigate('/admin/products/subcategories');
  };

  return (
    <AdminLayout
      title={isEdit ? `Edit Sub-Category: ${form.name}` : 'Create Sub-Category'}
      subtitle="Configure granular dental product classification mapped to specialty parent"
    >
      {/* ── Responsive Top Bar & Breadcrumb ── */}
      <div className="subcat-top-bar">
        <div className="subcat-breadcrumbs">
          <Link to="/admin/products">Products</Link>
          <span className="breadcrumb-sep">/</span>
          <Link to="/admin/products/subcategories">Sub-Categories</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{isEdit ? 'Edit' : 'Create'}</span>
        </div>
        <button
          type="button"
          className="btn-admin-outline"
          onClick={() => navigate('/admin/products/subcategories')}
        >
          <i className="fa-solid fa-arrow-left" /> Back to Sub-Categories
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="subcat-form-grid">
          {/* ════════ LEFT COLUMN: Clean Responsive Form ════════ */}
          <div className="admin-card">
            <div className="subcat-card-header">
              <i className="fa-solid fa-sitemap" />
              <h3>Sub-Category Information</h3>
            </div>

            <div className="subcat-form-fields-stack">
              {/* Parent Specialty & Publish Status */}
              <div className="subcat-form-row-2col">
                <div>
                  <label className="subcat-field-label">
                    Parent Specialty Category <span className="required">*</span>
                  </label>
                  <select
                    name="parentCategoryId"
                    value={form.parentCategoryId}
                    onChange={handleParentChange}
                    className="form-control"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="subcat-field-label">
                    Publish Status
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="Active">Active (Visible)</option>
                    <option value="Inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Sub-Category Name & URL Slug */}
              <div className="subcat-form-row-split">
                <div>
                  <label className="subcat-field-label">
                    Sub-Category Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleNameChange}
                    placeholder="e.g. Rotary NiTi Files"
                    className="form-control"
                  />
                  {errors.name && <span className="subcat-field-error">{errors.name}</span>}
                </div>

                <div>
                  <label className="subcat-field-label">
                    URL Slug <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="e.g. rotary-niti-files"
                    className="form-control"
                  />
                  {errors.slug && <span className="subcat-field-error">{errors.slug}</span>}
                </div>
              </div>

              {/* Sub-Category Image Upload & Direct URL Box */}
              <div className="subcat-image-box">
                <div className="subcat-image-header">
                  <label className="subcat-field-label">
                    Sub-Category Image <span className="label-hint">(Upload thumbnail or banner)</span>
                  </label>
                  {form.image && (
                    <button
                      type="button"
                      onClick={handleClearImage}
                      className="subcat-image-remove-btn"
                    >
                      <i className="fa-solid fa-xmark" /> Remove Image
                    </button>
                  )}
                </div>

                <div className="subcat-image-controls">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFile}
                    className="subcat-file-hidden-input"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="subcat-file-btn"
                  >
                    <i className="fa-solid fa-cloud-arrow-up" /> Choose File
                  </button>
                  <span className={`subcat-file-name ${fileName === 'No file chosen' ? 'no-file' : 'has-file'}`}>
                    {fileName}
                  </span>

                  <span className="subcat-url-divider">|</span>

                  <input
                    type="text"
                    name="image"
                    value={form.image?.startsWith('data:') ? '' : (form.image || '')}
                    onChange={handleChange}
                    placeholder="Or enter direct Image URL (https://...)"
                    className="form-control subcat-url-input"
                  />
                </div>

                {/* Thumbnail Preview bar if image present */}
                {form.image && (
                  <div className="subcat-image-preview-bar">
                    <img
                      src={form.image}
                      alt="Sub-category preview"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                    <div className="subcat-image-source-text">
                      <strong>Active Image Source:</strong>{' '}
                      {form.image?.startsWith('data:') ? 'Local file uploaded successfully' : form.image}
                    </div>
                  </div>
                )}

                <div className="subcat-image-hint">
                  <i className="fa-solid fa-circle-info" />
                  Recommended dimensions: 400x400px or 600x400px (JPG, PNG, WEBP, SVG, Max 4MB).
                </div>
              </div>

              {/* Display Order Index */}
              <div className="subcat-form-row-2col">
                <div>
                  <label className="subcat-field-label">
                    Display Order Index
                  </label>
                  <input
                    type="number"
                    name="displayOrder"
                    min="1"
                    value={form.displayOrder || 1}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="subcat-form-actions">
              <button
                type="button"
                className="btn-admin-outline"
                onClick={() => navigate('/admin/products/subcategories')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-admin-primary"
                disabled={isSubmitting}
              >
                <i className="fa-solid fa-floppy-disk" /> {isEdit ? 'Save Changes' : 'Create Sub-Category'}
              </button>
            </div>
          </div>

          {/* ════════ RIGHT COLUMN: Live Sub-Category Card Preview ════════ */}
          <div className="subcat-preview-column">
            <div className="subcat-preview-card">
              <div className="subcat-preview-header">
                <span className="subcat-preview-title">
                  <i className="fa-solid fa-eye" />
                  Storefront Preview
                </span>
                <span className={`subcat-status-pill ${form.status === 'Active' ? 'active' : 'inactive'}`}>
                  {form.status}
                </span>
              </div>

              {/* Website Subcategory Card Rendering */}
              <div className="subcat-preview-box">
                {/* Hero / Banner Image Preview */}
                <div className="subcat-preview-hero">
                  {form.image ? (
                    <img
                      src={form.image}
                      alt={form.name || 'Sub-Category'}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                  ) : (
                    <div className="subcat-preview-no-img">
                      <i className="fa-regular fa-image" />
                      No Image Uploaded
                    </div>
                  )}

                  {/* Specialty Badge pill overlaid on image */}
                  <span className="subcat-preview-badge">
                    <i className="fa-solid fa-layer-group" />
                    {form.parentCategoryName}
                  </span>
                </div>

                {/* Card Body */}
                <div className="subcat-preview-body">
                  <h4>{form.name || 'Sub-Category Name'}</h4>
                  <div className="subcat-preview-slug">
                    /shop?subcat={form.slug || 'slug'}
                  </div>

                  <div className="subcat-preview-footer">
                    <span>Assigned Catalog:</span>
                    <strong>{form.totalProducts || 0} SKUs</strong>
                  </div>
                </div>
              </div>

              {/* Meta details */}
              <div className="subcat-preview-meta">
                <div className="subcat-meta-row">
                  <span>Parent Category:</span>
                  <strong>{form.parentCategoryName}</strong>
                </div>
                <div className="subcat-meta-row">
                  <span>Parent ID:</span>
                  <code>{form.parentCategoryId}</code>
                </div>
                <div className="subcat-meta-row">
                  <span>Display Order:</span>
                  <strong>#{form.displayOrder}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default SubCategoryForm;
