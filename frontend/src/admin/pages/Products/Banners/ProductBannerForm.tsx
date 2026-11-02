/**
 * BuyBright Admin — Product Banner Form Page.
 * Create / Edit product banners with badge, unified title/description,
 * and the right-side metrics section matching the website ShopHeaderBanner design.
 * Route: /admin/products/banners/create & /admin/products/banners/edit/:id
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AdminLayout } from '../../../layouts/AdminLayout';
import {
  getProductBanners,
  saveProductBanners,
  getProductBannerById,
} from '../../../data/productBannersData';
import type { AdminProductBanner } from '../../../types/product';
import { useToast } from '../../../../context/ToastContext';

/* ── Constants ─────────────────────────────────────────────────────────────── */

const FA_ICON_SUGGESTIONS = [
  'fa-solid fa-truck-fast',
  'fa-solid fa-file-invoice-dollar',
  'fa-solid fa-shield-halved',
  'fa-solid fa-certificate',
  'fa-solid fa-sparkles',
  'fa-solid fa-award',
  'fa-solid fa-bolt',
  'fa-solid fa-star',
  'fa-solid fa-circle-check',
  'fa-solid fa-tooth',
  'fa-solid fa-stethoscope',
  'fa-solid fa-flask',
  'fa-solid fa-tags',
  'fa-solid fa-gem',
];

/* ── Form State ─────────────────────────────────────────────────────────────── */

type BannerFormState = Omit<AdminProductBanner, 'id'>;

const EMPTY_FORM: BannerFormState = {
  badgeText: '100% FACTORY DIRECT • AUTHORIZED DENTAL DISTRIBUTOR',
  badgeIcon: 'fa-solid fa-shield-halved',
  heading: 'Premium Dental ',
  highlightText: 'Supplies & Equipment',
  subheading: 'Explore 500+ dentist-approved consumables, instruments, bioceramics, and digital devices with cold-chain shipping and direct brand warranties.',
  pageHeading: 'Premium Dental Supplies',
  description: 'Explore 500+ dentist-approved consumables, instruments, bioceramics, and digital devices with cold-chain shipping and direct brand warranties.',
  rightSideIcon: 'fa-solid fa-tooth',
  // Right side metrics matching website banner
  metric1Icon: 'fa-solid fa-truck-fast',
  metric1Title: '24-48h Dispatch',
  metric1Subtitle: 'Pan-India Transit',
  metric2Icon: 'fa-solid fa-file-invoice-dollar',
  metric2Title: 'GST Invoiced',
  metric2Subtitle: 'Input Tax Credit',
  // Compatibility defaults
  title: 'Premium Dental Supplies',
  subtitle: 'Explore 500+ clinician-approved consumables, instruments, bioceramics.',
  image: '',
  targetUrl: '/shop',
  buttonText: 'SHOP NOW',
  placement: 'Shop Header Banner',
  bgColor: '#0f172a',
  discountBadge: '',
  status: 'Active',
  displayOrder: 1,
  startDate: '',
  endDate: '',
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
  // Promotion flags (bottom checkboxes)
  isNewArrival: false,
  isBestseller: false,
};

/* ── Styles ─────────────────────────────────────────────────────────────────── */

const s = {
  label: {
    display: 'block',
    fontSize: '0.82rem',
    fontWeight: 600,
    color: '#334155',
    marginBottom: '6px',
  } as React.CSSProperties,
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #f1f5f9',
  } as React.CSSProperties,
  cardTitle: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 700,
    color: '#0f172a',
  } as React.CSSProperties,
  cardSubtitle: {
    margin: '3px 0 0 0',
    fontSize: '0.78rem',
    color: '#64748b',
  } as React.CSSProperties,
  fieldCol: { display: 'flex', flexDirection: 'column', gap: '16px' } as React.CSSProperties,
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' } as React.CSSProperties,
  errorText: { color: '#ef4444', fontSize: '0.74rem', marginTop: '4px', display: 'block' } as React.CSSProperties,
};

/* ══════════════════════════════════════════════════════════════════════════════
   Component
══════════════════════════════════════════════════════════════════════════════ */

export const ProductBannerForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const isEdit = Boolean(id);

  const [form, setForm] = useState<BannerFormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* Load existing banner on edit */
  useEffect(() => {
    if (isEdit && id) {
      const banner = getProductBannerById(id);
      if (banner) {
        const unifiedHeading = banner.heading || banner.pageHeading || banner.title || '';
        const unifiedSubheading = banner.subheading || banner.description || banner.subtitle || '';

        setForm({
          badgeText: banner.badgeText ?? '',
          badgeIcon: banner.badgeIcon ?? 'fa-solid fa-shield-halved',
          heading: unifiedHeading,
          highlightText: banner.highlightText ?? '',
          subheading: unifiedSubheading,
          pageHeading: unifiedHeading,
          description: unifiedSubheading,
          rightSideIcon: banner.rightSideIcon ?? 'fa-solid fa-tooth',
          metric1Icon: banner.metric1Icon ?? 'fa-solid fa-truck-fast',
          metric1Title: banner.metric1Title ?? '24-48h Dispatch',
          metric1Subtitle: banner.metric1Subtitle ?? 'Pan-India Transit',
          metric2Icon: banner.metric2Icon ?? 'fa-solid fa-file-invoice-dollar',
          metric2Title: banner.metric2Title ?? 'GST Invoiced',
          metric2Subtitle: banner.metric2Subtitle ?? 'Input Tax Credit',
          title: unifiedHeading,
          subtitle: unifiedSubheading,
          image: banner.image ?? '',
          targetUrl: banner.targetUrl ?? '/shop',
          buttonText: banner.buttonText ?? 'SHOP NOW',
          placement: banner.placement ?? 'Shop Header Banner',
          bgColor: banner.bgColor ?? '#0f172a',
          discountBadge: banner.discountBadge ?? '',
          status: banner.status ?? 'Active',
          displayOrder: banner.displayOrder ?? 1,
          startDate: banner.startDate ?? '',
          endDate: banner.endDate ?? '',
          seoTitle: banner.seoTitle ?? '',
          seoDescription: banner.seoDescription ?? '',
          seoKeywords: banner.seoKeywords ?? '',
          isNewArrival: Boolean(banner.isNewArrival),
          isBestseller: Boolean(banner.isBestseller),
        });
      } else {
        showToast('Product banner not found.', 'danger');
        navigate('/admin/products/banners');
      }
    }
  }, [id, isEdit, navigate, showToast]);

  /* Handlers */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      // Keep unified content fields synchronized
      if (name === 'heading') {
        updated.pageHeading = value;
        updated.title = value;
      }
      if (name === 'subheading') {
        updated.description = value;
        updated.subtitle = value;
      }

      return updated;
    });

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const setIcon = (field: 'badgeIcon' | 'metric1Icon' | 'metric2Icon', icon: string) =>
    setForm((prev) => ({ ...prev, [field]: icon }));

  /* Validation */
  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.heading.trim()) e.heading = 'Banner heading is required';
    if (!form.subheading.trim()) e.subheading = 'Banner description / subheading is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* Submit */
  const handleSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();
    if (!validate()) {
      showToast('Please fill in all required fields.', 'danger');
      return;
    }
    setIsSubmitting(true);

    const headingVal = form.heading.trim();
    const subVal = form.subheading.trim();

    const fullForm: BannerFormState = {
      ...form,
      heading: headingVal,
      pageHeading: headingVal,
      title: headingVal,
      subheading: subVal,
      description: subVal,
      subtitle: subVal,
      isNewArrival: Boolean(form.isNewArrival),
      isBestseller: Boolean(form.isBestseller),
    };

    const existing = getProductBanners();
    if (isEdit && id) {
      const updated = existing.map((b) => (b.id === id ? { ...fullForm, id } : b));
      saveProductBanners(updated);
      showToast(`Banner "${headingVal}" updated successfully!`, 'success');
    } else {
      const newBanner: AdminProductBanner = { ...fullForm, id: `pb-${Date.now()}` };
      saveProductBanners([newBanner, ...existing]);
      showToast(`Banner "${headingVal}" created successfully!`, 'success');
    }

    setIsSubmitting(false);
    navigate('/admin/products/banners');
  };

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <AdminLayout
      title={isEdit ? 'Edit Product Banner' : 'Create Product Banner'}
      subtitle={isEdit ? 'Update promotional banner headline, badge, right-side metrics and SEO' : 'Configure promotional banner with badge, content, right-side metrics and SEO'}
    >
      <div style={{ width: '100%', maxWidth: '980px', margin: '0 auto' }}>
        {/* ── Breadcrumb & Back Action Bar ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <Link to="/admin/products" style={{ color: '#64748b', textDecoration: 'none' }}>Products</Link>
            <span style={{ color: '#cbd5e1' }}>/</span>
            <Link to="/admin/products/banners" style={{ color: '#64748b', textDecoration: 'none' }}>Banners</Link>
            <span style={{ color: '#cbd5e1' }}>/</span>
            <span style={{ color: '#0d9488', fontWeight: 600 }}>{isEdit ? 'Edit Banner' : 'New Banner'}</span>
          </div>
          <button
            type="button"
            className="btn-admin-secondary"
            onClick={() => navigate('/admin/products/banners')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <i className="fa-solid fa-arrow-left" /> Back to Banners List
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="admin-modal-form">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

            {/* ── Panel 1: Badge Settings ── */}
            <div className="admin-card" style={{ padding: '24px' }}>
              <div style={s.cardHeader}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f0fdfa', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-certificate" style={{ fontSize: '0.95rem' }} />
                </div>
                <div>
                  <h3 style={s.cardTitle}>Badge Settings</h3>
                  <p style={s.cardSubtitle}>Top pill tag displayed on the banner</p>
                </div>
              </div>

              <div style={s.grid2}>
                <div className="form-field-group">
                  <label style={s.label} htmlFor="badgeText">
                    Badge Text
                  </label>
                  <input
                    id="badgeText"
                    type="text"
                    name="badgeText"
                    value={form.badgeText}
                    onChange={handleChange}
                    placeholder="e.g. 100% FACTORY DIRECT • AUTHORIZED DENTAL DISTRIBUTOR"
                    className="form-input-text"
                  />
                  <span className="form-field-hint">Small pill badge shown above the main headline.</span>
                </div>

                <div className="form-field-group">
                  <label style={s.label} htmlFor="badgeIcon">
                    Badge Icon <span style={{ fontWeight: 400, color: '#94a3b8' }}>(FontAwesome class)</span>
                  </label>
                  <input
                    id="badgeIcon"
                    type="text"
                    name="badgeIcon"
                    value={form.badgeIcon}
                    onChange={handleChange}
                    placeholder="e.g. fa-solid fa-shield-halved"
                    className="form-input-text"
                    style={{ marginBottom: '8px' }}
                  />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {FA_ICON_SUGGESTIONS.slice(0, 8).map((ic) => (
                      <button
                        key={ic}
                        type="button"
                        title={ic}
                        onClick={() => setIcon('badgeIcon', ic)}
                        style={{
                          width: '32px',
                          height: '32px',
                          border: form.badgeIcon === ic ? '2px solid #0d9488' : '1px solid #e2e8f0',
                          borderRadius: '6px',
                          background: form.badgeIcon === ic ? '#f0fdf9' : '#f8fafc',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: form.badgeIcon === ic ? '#0d9488' : '#64748b',
                          fontSize: '0.8rem',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <i className={ic} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Panel 2: Banner Content ── */}
            <div className="admin-card" style={{ padding: '24px' }}>
              <div style={s.cardHeader}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f0fdfa', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-heading" style={{ fontSize: '0.95rem' }} />
                </div>
                <div>
                  <h3 style={s.cardTitle}>Banner Content (Left Side)</h3>
                  <p style={s.cardSubtitle}>Main title headline, highlighted gradient text, and supporting description</p>
                </div>
              </div>

              <div style={s.fieldCol}>
                <div style={s.grid2}>
                  <div className="form-field-group">
                    <label style={s.label} htmlFor="heading">
                      Main Title <span className="required-star">*</span>
                    </label>
                    <input
                      id="heading"
                      type="text"
                      name="heading"
                      value={form.heading}
                      onChange={handleChange}
                      placeholder="e.g. Premium Dental "
                      className="form-input-text"
                      style={{ borderColor: errors.heading ? '#ef4444' : undefined }}
                      required
                    />
                    {errors.heading && <span style={s.errorText}>{errors.heading}</span>}
                    <span className="form-field-hint">Primary headline text.</span>
                  </div>

                  <div className="form-field-group">
                    <label style={s.label} htmlFor="highlightText">
                      Highlighted Gradient Text
                    </label>
                    <input
                      id="highlightText"
                      type="text"
                      name="highlightText"
                      value={form.highlightText || ''}
                      onChange={handleChange}
                      placeholder="e.g. Supplies & Equipment"
                      className="form-input-text"
                    />
                    <span className="form-field-hint">Rendered with vibrant teal-to-emerald gradient on the website.</span>
                  </div>
                </div>

                <div className="form-field-group">
                  <label style={s.label} htmlFor="subheading">
                    Description <span className="required-star">*</span>
                  </label>
                  <textarea
                    id="subheading"
                    name="subheading"
                    rows={3}
                    value={form.subheading}
                    onChange={handleChange}
                    placeholder="e.g. Explore 500+ clinician-approved consumables, instruments, bioceramics, and digital devices with cold-chain shipping and direct brand warranties."
                    className="form-input-textarea"
                    style={{ borderColor: errors.subheading ? '#ef4444' : undefined }}
                    required
                  />
                  {errors.subheading && <span style={s.errorText}>{errors.subheading}</span>}
                  <span className="form-field-hint">Supporting paragraph displayed below the headline.</span>
                </div>
              </div>
            </div>

            {/* ── Panel 3: Right-Side Metrics (Website Design Feature Badges) ── */}
            <div className="admin-card" style={{ padding: '24px' }}>
              <div style={s.cardHeader}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f0fdfa', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-award" style={{ fontSize: '0.95rem' }} />
                </div>
                <div>
                  <h3 style={s.cardTitle}>Right-Side Metrics (Website Banner Right Side Design)</h3>
                  <p style={s.cardSubtitle}>
                    Configure the 2 trust/feature metric pills displayed on the right side of the header banner on the website
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {/* Metric 1 */}
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#0d9488', color: '#ffffff', padding: '2px 8px', borderRadius: '12px' }}>
                      Metric Pill 1
                    </span>
                    <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>First Right-Side Badge</strong>
                  </div>

                  <div className="form-field-group" style={{ marginBottom: '10px' }}>
                    <label style={s.label}>Icon Class</label>
                    <input
                      type="text"
                      name="metric1Icon"
                      value={form.metric1Icon || ''}
                      onChange={handleChange}
                      placeholder="e.g. fa-solid fa-truck-fast"
                      className="form-input-text"
                    />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '6px' }}>
                      {['fa-solid fa-truck-fast', 'fa-solid fa-certificate', 'fa-solid fa-shield-halved', 'fa-solid fa-bolt'].map((ic) => (
                        <button
                          key={ic}
                          type="button"
                          onClick={() => setIcon('metric1Icon', ic)}
                          style={{
                            padding: '3px 8px',
                            fontSize: '0.72rem',
                            borderRadius: '4px',
                            border: form.metric1Icon === ic ? '1px solid #0d9488' : '1px solid #cbd5e1',
                            background: form.metric1Icon === ic ? '#f0fdf9' : '#ffffff',
                            color: form.metric1Icon === ic ? '#0d9488' : '#475569',
                            cursor: 'pointer',
                          }}
                        >
                          <i className={ic} style={{ marginRight: '4px' }} /> {ic.split('-').pop()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-field-group" style={{ marginBottom: '10px' }}>
                    <label style={s.label}>Title</label>
                    <input
                      type="text"
                      name="metric1Title"
                      value={form.metric1Title || ''}
                      onChange={handleChange}
                      placeholder="e.g. 24-48h Dispatch"
                      className="form-input-text"
                    />
                  </div>

                  <div className="form-field-group">
                    <label style={s.label}>Subtitle</label>
                    <input
                      type="text"
                      name="metric1Subtitle"
                      value={form.metric1Subtitle || ''}
                      onChange={handleChange}
                      placeholder="e.g. Pan-India Transit"
                      className="form-input-text"
                    />
                  </div>
                </div>

                {/* Metric 2 */}
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#0d9488', color: '#ffffff', padding: '2px 8px', borderRadius: '12px' }}>
                      Metric Pill 2
                    </span>
                    <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>Second Right-Side Badge</strong>
                  </div>

                  <div className="form-field-group" style={{ marginBottom: '10px' }}>
                    <label style={s.label}>Icon Class</label>
                    <input
                      type="text"
                      name="metric2Icon"
                      value={form.metric2Icon || ''}
                      onChange={handleChange}
                      placeholder="e.g. fa-solid fa-file-invoice-dollar"
                      className="form-input-text"
                    />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '6px' }}>
                      {['fa-solid fa-file-invoice-dollar', 'fa-solid fa-award', 'fa-solid fa-star', 'fa-solid fa-sparkles'].map((ic) => (
                        <button
                          key={ic}
                          type="button"
                          onClick={() => setIcon('metric2Icon', ic)}
                          style={{
                            padding: '3px 8px',
                            fontSize: '0.72rem',
                            borderRadius: '4px',
                            border: form.metric2Icon === ic ? '1px solid #0d9488' : '1px solid #cbd5e1',
                            background: form.metric2Icon === ic ? '#f0fdf9' : '#ffffff',
                            color: form.metric2Icon === ic ? '#0d9488' : '#475569',
                            cursor: 'pointer',
                          }}
                        >
                          <i className={ic} style={{ marginRight: '4px' }} /> {ic.split('-').pop()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-field-group" style={{ marginBottom: '10px' }}>
                    <label style={s.label}>Title</label>
                    <input
                      type="text"
                      name="metric2Title"
                      value={form.metric2Title || ''}
                      onChange={handleChange}
                      placeholder="e.g. GST Invoiced"
                      className="form-input-text"
                    />
                  </div>

                  <div className="form-field-group">
                    <label style={s.label}>Subtitle</label>
                    <input
                      type="text"
                      name="metric2Subtitle"
                      value={form.metric2Subtitle || ''}
                      onChange={handleChange}
                      placeholder="e.g. Input Tax Credit"
                      className="form-input-text"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Panel 4: Live Website Component Banner Preview ── */}
            <div className="admin-card" style={{ padding: '24px' }}>
              <div style={s.cardHeader}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f0fdfa', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-eye" style={{ fontSize: '0.95rem' }} />
                </div>
                <div>
                  <h3 style={s.cardTitle}>Live Website Banner Preview</h3>
                  <p style={s.cardSubtitle}>Real-time preview of the left-side copy and the right-side metrics</p>
                </div>
              </div>

              {/* Exact Website Banner Design Render */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #093b3b 0%, #0d5c5c 50%, #082d2d 100%)',
                  borderRadius: '16px',
                  padding: '28px 24px',
                  color: '#ffffff',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
                  {/* Left Side Content */}
                  <div style={{ flex: '1 1 440px', minWidth: '280px' }}>
                    {/* Badge Pill */}
                    {form.badgeText && (
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: 'rgba(255, 255, 255, 0.12)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          color: '#5eead4',
                          marginBottom: '12px',
                          backdropFilter: 'blur(4px)',
                        }}
                      >
                        <i className={form.badgeIcon || 'fa-solid fa-shield-halved'} />
                        <span>{form.badgeText}</span>
                      </div>
                    )}

                    {/* Headline with Highlight Gradient */}
                    <h2 style={{ margin: '0 0 10px 0', fontSize: '1.45rem', fontWeight: 900, color: '#ffffff', lineHeight: 1.25 }}>
                      {form.heading || 'Banner Headline '}
                      {form.highlightText && (
                        <span style={{
                          background: 'linear-gradient(135deg, #5eead4 0%, #34d399 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          display: 'inline',
                        }}>
                          {form.highlightText}
                        </span>
                      )}
                    </h2>

                    {/* Description */}
                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.6, maxWidth: '580px' }}>
                      {form.subheading || 'Banner description text will appear here...'}
                    </p>
                  </div>

                  {/* Right Side Metrics (Website Layout) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    {/* Metric 1 Pill */}
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: '12px',
                        padding: '10px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <i className={form.metric1Icon || 'fa-solid fa-truck-fast'} style={{ fontSize: '20px', color: '#5eead4' }} />
                      <div>
                        <strong style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                          {form.metric1Title || '24-48h Dispatch'}
                        </strong>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                          {form.metric1Subtitle || 'Pan-India Transit'}
                        </span>
                      </div>
                    </div>

                    {/* Metric 2 Pill */}
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: '12px',
                        padding: '10px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <i className={form.metric2Icon || 'fa-solid fa-file-invoice-dollar'} style={{ fontSize: '20px', color: '#f87171' }} />
                      <div>
                        <strong style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                          {form.metric2Title || 'GST Invoiced'}
                        </strong>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                          {form.metric2Subtitle || 'Input Tax Credit'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Panel 5: SEO Settings ── */}
            <div className="admin-card" style={{ padding: '24px' }}>
              <div style={s.cardHeader}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f0fdfa', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-magnifying-glass-chart" style={{ fontSize: '0.95rem' }} />
                </div>
                <div>
                  <h3 style={s.cardTitle}>SEO Settings</h3>
                  <p style={s.cardSubtitle}>Metadata and search engine index attributes</p>
                </div>
              </div>

              <div style={s.fieldCol}>
                <div className="form-field-group">
                  <label style={s.label} htmlFor="seoTitle">
                    SEO Meta Title
                    <span style={{ fontWeight: 400, color: '#94a3b8', marginLeft: '6px' }}>
                      ({(form.seoTitle || '').length}/60 chars)
                    </span>
                  </label>
                  <input
                    id="seoTitle"
                    type="text"
                    name="seoTitle"
                    maxLength={60}
                    value={form.seoTitle ?? ''}
                    onChange={handleChange}
                    placeholder="e.g. Premium Dental Supplies & Equipment | BuyBright"
                    className="form-input-text"
                  />
                  <span className="form-field-hint">Optimized title displayed in Google search results.</span>
                </div>

                <div className="form-field-group">
                  <label style={s.label} htmlFor="seoDescription">
                    SEO Meta Description
                    <span style={{ fontWeight: 400, color: '#94a3b8', marginLeft: '6px' }}>
                      ({(form.seoDescription || '').length}/160 chars)
                    </span>
                  </label>
                  <textarea
                    id="seoDescription"
                    name="seoDescription"
                    rows={2}
                    maxLength={160}
                    value={form.seoDescription ?? ''}
                    onChange={handleChange}
                    placeholder="e.g. Shop premium dental supplies and instruments with fast delivery across India."
                    className="form-input-textarea"
                  />
                  <span className="form-field-hint">Concise summary shown under the title link in search engines.</span>
                </div>

                <div className="form-field-group">
                  <label style={s.label} htmlFor="seoKeywords">
                    SEO Keywords <span style={{ fontWeight: 400, color: '#94a3b8' }}>(comma separated)</span>
                  </label>
                  <input
                    id="seoKeywords"
                    type="text"
                    name="seoKeywords"
                    value={form.seoKeywords ?? ''}
                    onChange={handleChange}
                    placeholder="e.g. dental supplies, dental equipment, dental instruments"
                    className="form-input-text"
                  />
                  <span className="form-field-hint">Target search phrases separated by commas.</span>
                </div>
              </div>
            </div>

            {/* ── Panel 6: Promotional Badging & Flags (Bottom Checkboxes) ── */}
            <div className="admin-card" style={{ padding: '24px' }}>
              <div style={s.cardHeader}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f0fdfa', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-tags" style={{ fontSize: '0.95rem' }} />
                </div>
                <div>
                  <h3 style={s.cardTitle}>Promotional Flags &amp; Placement Badges</h3>
                  <p style={s.cardSubtitle}>Tag this banner for New Arrival and Bestseller storefront sections</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {/* New Arrival Checkbox Card */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '16px',
                    borderRadius: '10px',
                    border: form.isNewArrival ? '2px solid #0d9488' : '1.5px solid #e2e8f0',
                    backgroundColor: form.isNewArrival ? '#f0fdfa' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <input
                    type="checkbox"
                    name="isNewArrival"
                    checked={Boolean(form.isNewArrival)}
                    onChange={handleChange}
                    style={{ width: '18px', height: '18px', accentColor: '#0d9488', marginTop: '2px', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                      <i className="fa-solid fa-sparkles" style={{ color: '#0d9488' }} />
                      <span>New Arrival</span>
                    </div>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
                      Flag this banner under the <strong>New Arrival</strong> promotional spotlight and collection pages.
                    </p>
                  </div>
                </label>

                {/* Bestseller Checkbox Card */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '16px',
                    borderRadius: '10px',
                    border: form.isBestseller ? '2px solid #f59e0b' : '1.5px solid #e2e8f0',
                    backgroundColor: form.isBestseller ? '#fffbeb' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <input
                    type="checkbox"
                    name="isBestseller"
                    checked={Boolean(form.isBestseller)}
                    onChange={handleChange}
                    style={{ width: '18px', height: '18px', accentColor: '#f59e0b', marginTop: '2px', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                      <i className="fa-solid fa-crown" style={{ color: '#f59e0b' }} />
                      <span>Bestseller</span>
                    </div>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
                      Flag this banner under the <strong>Bestseller</strong> featured showcase and top-selling sections.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* ── Form Actions Bar ── */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '12px',
                paddingTop: '16px',
                borderTop: '1px solid #e2e8f0',
              }}
            >
              <button
                type="button"
                className="btn-admin-secondary"
                onClick={() => navigate('/admin/products/banners')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-admin-primary"
                disabled={isSubmitting}
                style={{ minWidth: '140px' }}
              >
                <i className="fa-solid fa-check" /> {isEdit ? 'Save Changes' : 'Create Banner'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ProductBannerForm;
