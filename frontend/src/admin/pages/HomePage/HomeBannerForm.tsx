/**
 * HomeBannerForm Page.
 * Dedicated full-width page for creating and editing homepage hero banners.
 * Supports:
 * - Banner Headline & Sub-Headline
 * - Left Festival Image & Right Festival Image (decorative side images)
 * - Main Badge Label & Four Sub-Badge Labels
 * - Two CTA Buttons (Button 1 & Button 2) with custom text and target links
 * - File picker for local image selection with live preview
 * - Comprehensive SEO settings (Meta Title, Meta Description, Image Alt Text)
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { getHomeBanners, saveHomeBanners } from '../../data/homeData';
import type { HomeBanner } from '../../types/home';
import { useToast } from '../../../context/ToastContext';

// ─── Reusable Image Upload Field ─────────────────────────────────────────────
interface ImageUploadFieldProps {
  id: string;
  label: string;
  hint: string;
  required?: boolean;
  value: string;
  recommendedSize?: string;
  onChange: (dataUrl: string) => void;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  id,
  label,
  hint,
  required,
  value,
  recommendedSize = '200x300 px',
  onChange,
}) => {
  const { showToast } = useToast();
  const ref = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPEG, PNG, WEBP).', 'danger');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      if (result) onChange(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="form-field-group">
      <label htmlFor={id}>
        {label} {required && <span className="required-star">*</span>}
      </label>

      {/* Preview Box */}
      <div
        onClick={() => ref.current?.click()}
        title="Click to select image"
        style={{
          width: '100%',
          height: '130px',
          borderRadius: '10px',
          border: value ? '2px solid #0d9488' : '2px dashed #cbd5e1',
          background: '#f8fafc',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          transition: 'border-color 0.2s',
          marginBottom: '6px',
        }}
      >
        {value ? (
          <img
            src={value}
            alt={label}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onError={(e) => { (e.target as HTMLImageElement).src = '/images/banner.webp'; }}
          />
        ) : (
          <div style={{ textAlign: 'center', color: '#94a3b8', padding: '10px' }}>
            <i className="fa-regular fa-image" style={{ fontSize: '2rem', marginBottom: '6px', display: 'block' }} />
            <span style={{ fontSize: '0.78rem' }}>Click to upload<br /><strong>{recommendedSize}</strong></span>
          </div>
        )}

        {/* Overlay on hover */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(13,148,136,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.2s',
          }}
          className="img-upload-hover-overlay"
        >
          <i className="fa-solid fa-pen-to-square" style={{ color: '#0d9488', fontSize: '1.2rem' }} />
        </div>
      </div>

      <button
        type="button"
        onClick={() => ref.current?.click()}
        style={{
          fontSize: '0.78rem',
          padding: '5px 12px',
          borderRadius: '6px',
          border: '1px solid #cbd5e1',
          background: '#fff',
          color: '#475569',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '4px',
        }}
      >
        <i className="fa-solid fa-folder-open" /> Choose File
      </button>

      <input
        ref={ref}
        id={id}
        type="file"
        accept="image/*"
        onChange={handleFile}
        style={{ display: 'none' }}
      />
      <span className="form-field-hint">{hint}</span>
    </div>
  );
};

// ─── Main Form Component ──────────────────────────────────────────────────────
export const HomeBannerForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { showToast } = useToast();
  const bannerFileRef = useRef<HTMLInputElement>(null);

  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    // ── Section 1: Headline ──────────────────────────────────────────────
    title: '',
    subtitle: '',

    // ── Section 2: Banner Image ──────────────────────────────────────────
    image: '/images/hero_dental_banner.jpg',

    // ── Section 3: Festival / Decorative Side Images ─────────────────────
    leftFestivalImage: '',
    rightFestivalImage: '',

    // ── Section 4: Badge Labels ──────────────────────────────────────────
    mainBadge: '',
    subBadge1: '',
    subBadge2: '',
    subBadge3: '',
    subBadge4: '',

    // ── Section 5: CTA Buttons ───────────────────────────────────────────
    button1Text: 'Shop Now',
    button1Url: '/shop',
    button2Text: '',
    button2Url: '',

    // ── Section 6: SEO ────────────────────────────────────────────────────
    seoTitle: '',
    seoDescription: '',
    seoAltText: '',

    // ── Section 7: Display Settings ──────────────────────────────────────
    displayOrder: 1,
    status: 'Active' as 'Active' | 'Inactive',
  });

  const [initialLoaded, setInitialLoaded] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      const all = getHomeBanners();
      const existing = all.find((b) => b.id === id);
      if (existing) {
        setFormData({
          title: existing.title,
          subtitle: existing.subtitle,
          image: existing.image,
          leftFestivalImage: existing.leftFestivalImage || '',
          rightFestivalImage: existing.rightFestivalImage || '',
          mainBadge: existing.mainBadge || '',
          subBadge1: existing.subBadge1 || '',
          subBadge2: existing.subBadge2 || '',
          subBadge3: existing.subBadge3 || '',
          subBadge4: existing.subBadge4 || '',
          button1Text: existing.button1Text || existing.buttonText || 'Shop Now',
          button1Url: existing.button1Url || existing.targetUrl || '/shop',
          button2Text: existing.button2Text || '',
          button2Url: existing.button2Url || '',
          seoTitle: existing.seoTitle || '',
          seoDescription: existing.seoDescription || '',
          seoAltText: existing.seoAltText || '',
          displayOrder: existing.displayOrder,
          status: existing.status,
        });
      } else {
        showToast('Banner not found.', 'warning');
        navigate('/admin/home/banners');
      }
    }
    setInitialLoaded(true);
  }, [id, isEdit, navigate, showToast]);

  // ── Main Banner Image File Handler ──────────────────────────────────────
  const handleBannerImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPEG, PNG, WEBP).', 'danger');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setFormData((prev) => ({
          ...prev,
          image: result,
          seoAltText: prev.seoAltText || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        }));
        showToast(`Banner image "${file.name}" uploaded successfully.`, 'info');
      }
    };
    reader.readAsDataURL(file);
  };

  // ── Form Submit ─────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.image.trim() ||
      !formData.button1Text.trim() ||
      !formData.button1Url.trim()
    ) {
      showToast(
        'Please fill in required fields: Banner Title, Banner Image, Button 1 Text & URL.',
        'danger'
      );
      return;
    }

    const all = getHomeBanners();

    const bannerPayload = {
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim(),
      image: formData.image.trim(),
      leftFestivalImage: formData.leftFestivalImage.trim() || undefined,
      rightFestivalImage: formData.rightFestivalImage.trim() || undefined,
      mainBadge: formData.mainBadge.trim() || undefined,
      subBadge1: formData.subBadge1.trim() || undefined,
      subBadge2: formData.subBadge2.trim() || undefined,
      subBadge3: formData.subBadge3.trim() || undefined,
      subBadge4: formData.subBadge4.trim() || undefined,
      button1Text: formData.button1Text.trim(),
      button1Url: formData.button1Url.trim(),
      button2Text: formData.button2Text.trim() || undefined,
      button2Url: formData.button2Url.trim() || undefined,
      seoTitle: formData.seoTitle.trim() || undefined,
      seoDescription: formData.seoDescription.trim() || undefined,
      seoAltText: formData.seoAltText.trim() || undefined,
      displayOrder: Number(formData.displayOrder) || 1,
      status: formData.status,
      // Backwards compatibility
      buttonText: formData.button1Text.trim(),
      targetUrl: formData.button1Url.trim(),
    };

    if (isEdit && id) {
      const updated = all.map((b) =>
        b.id === id ? { ...b, ...bannerPayload } : b
      );
      saveHomeBanners(updated);
      showToast(`Banner "${formData.title}" updated successfully.`, 'success');
    } else {
      const newBanner: HomeBanner = {
        id: `ban-${Date.now()}`,
        srNo: all.length + 1,
        ...bannerPayload,
        createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      };
      saveHomeBanners([...all, newBanner]);
      showToast(`New banner "${newBanner.title}" created successfully.`, 'success');
    }

    navigate('/admin/home/banners');
  };

  if (!initialLoaded) return null;

  // ── Shared section header style ─────────────────────────────────────────
  const sectionStyle: React.CSSProperties = {
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    background: '#ffffff',
  };

  const sectionHeaderStyle: React.CSSProperties = {
    marginBottom: '16px',
  };

  return (
    <AdminLayout
      title={isEdit ? `Edit Home Banner: ${formData.title || ''}` : 'Add New Home Banner'}
      subtitle={
        isEdit
          ? 'Update headline, festival images, badges, CTA buttons, and SEO metadata'
          : 'Create a homepage slider banner with festival images, badge labels, two CTA buttons, and SEO'
      }
    >
      <div style={{ width: '100%' }}>
        {/* Back Navigation */}
        <div style={{ marginBottom: '18px' }}>
          <Link
            to="/admin/home/banners"
            className="btn-admin-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
          >
            <i className="fa-solid fa-arrow-left" /> Back to Home Banners
          </Link>
        </div>

        {/* Main Form Card */}
        <div className="admin-card" style={{ padding: '28px' }}>
          {/* Card Header */}
          <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              <i className="fa-solid fa-panorama" style={{ color: '#0d9488', marginRight: '10px' }} />
              {isEdit ? 'Banner Configuration' : 'New Banner Information'}
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>
              Configure headline, festival side images, badge labels, action buttons, and SEO parameters.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="admin-modal-form">

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 1 — Headline & Sub-Headline
            ═══════════════════════════════════════════════════════════════ */}
            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>
                <strong style={{ fontSize: '0.95rem', color: '#0f172a', display: 'block' }}>
                  <i className="fa-solid fa-heading" style={{ color: '#0d9488', marginRight: '8px' }} />
                  Banner Headline &amp; Sub-Headline
                </strong>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Primary headline and supporting tagline shown on the hero banner slide.
                </span>
              </div>

              <div className="form-row-2col">
                <div className="form-field-group">
                  <label htmlFor="bannerTitle">
                    Banner Headline Title <span className="required-star">*</span>
                  </label>
                  <input
                    id="bannerTitle"
                    type="text"
                    className="form-input-text"
                    placeholder="e.g. Advanced Precision Dental Instruments"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                  <span className="form-field-hint">
                    Primary headline shown prominently in bold on the hero banner.
                  </span>
                </div>

                <div className="form-field-group">
                  <label htmlFor="bannerSubtitle">Sub-Headline Tagline</label>
                  <input
                    id="bannerSubtitle"
                    type="text"
                    className="form-input-text"
                    placeholder="e.g. Next-Gen Autoclaves & Diagnostics with 2-Year Warranty"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  />
                  <span className="form-field-hint">
                    Secondary descriptive text shown below the headline.
                  </span>
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 2 — Main Banner Image
            ═══════════════════════════════════════════════════════════════ */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <strong style={{ fontSize: '0.95rem', color: '#0f172a', display: 'block' }}>
                    <i className="fa-solid fa-cloud-arrow-up" style={{ color: '#0d9488', marginRight: '8px' }} />
                    Main Banner Background Image <span className="required-star">*</span>
                  </strong>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Full-width background image for the hero banner slide (Recommended: 1920×650 px, JPG, PNG, or WEBP).
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-admin-primary"
                  onClick={() => bannerFileRef.current?.click()}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <i className="fa-solid fa-folder-open" /> Choose Image File
                </button>
                <input
                  ref={bannerFileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBannerImageFileChange}
                  style={{ display: 'none' }}
                />
              </div>

              {/* Banner Preview */}
              <div
                style={{
                  width: '100%',
                  height: '160px',
                  borderRadius: '10px',
                  border: '2px dashed #cbd5e1',
                  background: '#ffffff',
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => bannerFileRef.current?.click()}
                title="Click to select banner image"
              >
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt={formData.seoAltText || 'Banner Preview'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/banner.webp'; }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                    <i className="fa-regular fa-image" style={{ fontSize: '2.5rem', marginBottom: '8px' }} />
                    <span style={{ display: 'block', fontSize: '0.85rem' }}>No image chosen. Click to select file.</span>
                  </div>
                )}
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 3 — Left & Right Festival Images
            ═══════════════════════════════════════════════════════════════ */}
            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>
                <strong style={{ fontSize: '0.95rem', color: '#0f172a', display: 'block' }}>
                  <i className="fa-solid fa-image" style={{ color: '#f59e0b', marginRight: '8px' }} />
                  Left &amp; Right Festival / Decorative Side Images
                </strong>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Optional festive or seasonal decorative images placed on the left and right sides of the banner.
                  Typically used for Diwali, Dussehra, Christmas, etc. (Recommended: 200×300 px, PNG with transparency).
                </span>
              </div>

              <div className="form-row-2col">
                <ImageUploadField
                  id="leftFestivalImage"
                  label="Left Festival Image"
                  hint="Decorative image displayed on the left side of the banner (e.g. left diya, left cracker graphic)."
                  recommendedSize="200×300 px, PNG"
                  value={formData.leftFestivalImage}
                  onChange={(url) => setFormData((prev) => ({ ...prev, leftFestivalImage: url }))}
                />
                <ImageUploadField
                  id="rightFestivalImage"
                  label="Right Festival Image"
                  hint="Decorative image displayed on the right side of the banner (e.g. right rangoli, right festive graphic)."
                  recommendedSize="200×300 px, PNG"
                  value={formData.rightFestivalImage}
                  onChange={(url) => setFormData((prev) => ({ ...prev, rightFestivalImage: url }))}
                />
              </div>

              {/* Clear buttons */}
              {(formData.leftFestivalImage || formData.rightFestivalImage) && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                  {formData.leftFestivalImage && (
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, leftFestivalImage: '' }))}
                      style={{ fontSize: '0.75rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px' }}
                    >
                      <i className="fa-solid fa-xmark" /> Clear Left Image
                    </button>
                  )}
                  {formData.rightFestivalImage && (
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, rightFestivalImage: '' }))}
                      style={{ fontSize: '0.75rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px' }}
                    >
                      <i className="fa-solid fa-xmark" /> Clear Right Image
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 4 — Main Badge & Four Sub-Badges
            ═══════════════════════════════════════════════════════════════ */}
            <div style={{ ...sectionStyle, background: '#fffbeb', border: '1px solid #fde68a' }}>
              <div style={sectionHeaderStyle}>
                <strong style={{ fontSize: '0.95rem', color: '#92400e', display: 'block' }}>
                  <i className="fa-solid fa-tags" style={{ color: '#f59e0b', marginRight: '8px' }} />
                  Banner Badge Labels
                </strong>
                <span style={{ fontSize: '0.78rem', color: '#78350f' }}>
                  Promotional labels displayed on the banner — one main badge and up to four sub-badge highlights.
                  Example: Main Badge = "Festival Sale" | Sub-Badges = "Up to 40% Off", "Free Shipping", "GST Invoice", "24hr Dispatch".
                </span>
              </div>

              {/* Main Badge */}
              <div className="form-field-group" style={{ marginBottom: '16px' }}>
                <label htmlFor="mainBadge">
                  Main Badge Label
                </label>
                <input
                  id="mainBadge"
                  type="text"
                  className="form-input-text"
                  placeholder="e.g. Diwali Festival Sale 🎉"
                  value={formData.mainBadge}
                  onChange={(e) => setFormData({ ...formData, mainBadge: e.target.value })}
                />
                <span className="form-field-hint">
                  Primary badge displayed prominently on the banner (e.g. a seasonal campaign name or sale event label).
                </span>
              </div>

              {/* Four Sub-Badges in a 2×2 grid */}
              <div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#92400e', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Sub-Badge Labels (up to 4)
                </span>

                <div className="form-row-2col">
                  {/* Sub Badge 1 */}
                  <div className="form-field-group">
                    <label htmlFor="subBadge1">Sub-Badge 1</label>
                    <input
                      id="subBadge1"
                      type="text"
                      className="form-input-text"
                      placeholder="e.g. Up to 40% Off"
                      value={formData.subBadge1}
                      onChange={(e) => setFormData({ ...formData, subBadge1: e.target.value })}
                    />
                    <span className="form-field-hint">First highlight badge (e.g. discount percentage).</span>
                  </div>

                  {/* Sub Badge 2 */}
                  <div className="form-field-group">
                    <label htmlFor="subBadge2">Sub-Badge 2</label>
                    <input
                      id="subBadge2"
                      type="text"
                      className="form-input-text"
                      placeholder="e.g. Free Shipping"
                      value={formData.subBadge2}
                      onChange={(e) => setFormData({ ...formData, subBadge2: e.target.value })}
                    />
                    <span className="form-field-hint">Second highlight badge (e.g. shipping offer).</span>
                  </div>
                </div>

                <div className="form-row-2col">
                  {/* Sub Badge 3 */}
                  <div className="form-field-group">
                    <label htmlFor="subBadge3">Sub-Badge 3</label>
                    <input
                      id="subBadge3"
                      type="text"
                      className="form-input-text"
                      placeholder="e.g. GST Invoice"
                      value={formData.subBadge3}
                      onChange={(e) => setFormData({ ...formData, subBadge3: e.target.value })}
                    />
                    <span className="form-field-hint">Third highlight badge (e.g. billing benefit).</span>
                  </div>

                  {/* Sub Badge 4 */}
                  <div className="form-field-group">
                    <label htmlFor="subBadge4">Sub-Badge 4</label>
                    <input
                      id="subBadge4"
                      type="text"
                      className="form-input-text"
                      placeholder="e.g. 24hr Express Dispatch"
                      value={formData.subBadge4}
                      onChange={(e) => setFormData({ ...formData, subBadge4: e.target.value })}
                    />
                    <span className="form-field-hint">Fourth highlight badge (e.g. dispatch speed).</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 5 — Two CTA Action Buttons
            ═══════════════════════════════════════════════════════════════ */}
            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>
                <strong style={{ fontSize: '0.95rem', color: '#0f172a', display: 'block' }}>
                  <i className="fa-solid fa-link" style={{ color: '#0d9488', marginRight: '8px' }} />
                  Two Call-To-Action (CTA) Buttons
                </strong>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Define Button 1 (Primary) and Button 2 (Secondary) for homepage banner visitors.
                </span>
              </div>

              {/* Button 1 — Primary */}
              <div style={{ padding: '14px', background: '#f0fdfa', borderRadius: '8px', marginBottom: '14px', border: '1px solid #99f6e4' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0d9488', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                  Button 1 — Primary CTA <span className="required-star">*</span>
                </span>
                <div className="form-row-2col">
                  <div className="form-field-group">
                    <label htmlFor="button1Text">
                      Button 1 Label Text <span className="required-star">*</span>
                    </label>
                    <input
                      id="button1Text"
                      type="text"
                      className="form-input-text"
                      placeholder="e.g. Shop Now"
                      value={formData.button1Text}
                      onChange={(e) => setFormData({ ...formData, button1Text: e.target.value })}
                      required
                    />
                    <span className="form-field-hint">Text label shown on the primary action button.</span>
                  </div>
                  <div className="form-field-group">
                    <label htmlFor="button1Url">
                      Button 1 Target URL <span className="required-star">*</span>
                    </label>
                    <input
                      id="button1Url"
                      type="text"
                      className="form-input-text"
                      placeholder="e.g. /shop"
                      value={formData.button1Url}
                      onChange={(e) => setFormData({ ...formData, button1Url: e.target.value })}
                      required
                    />
                    <span className="form-field-hint">URL the button navigates to when clicked.</span>
                  </div>
                </div>
              </div>

              {/* Button 2 — Secondary */}
              <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                  Button 2 — Secondary CTA (Optional)
                </span>
                <div className="form-row-2col">
                  <div className="form-field-group">
                    <label htmlFor="button2Text">Button 2 Label Text</label>
                    <input
                      id="button2Text"
                      type="text"
                      className="form-input-text"
                      placeholder="e.g. View All Equipment"
                      value={formData.button2Text}
                      onChange={(e) => setFormData({ ...formData, button2Text: e.target.value })}
                    />
                    <span className="form-field-hint">Text label for the optional secondary button.</span>
                  </div>
                  <div className="form-field-group">
                    <label htmlFor="button2Url">Button 2 Target URL</label>
                    <input
                      id="button2Url"
                      type="text"
                      className="form-input-text"
                      placeholder="e.g. /categories/equipment"
                      value={formData.button2Url}
                      onChange={(e) => setFormData({ ...formData, button2Url: e.target.value })}
                    />
                    <span className="form-field-hint">URL the secondary button navigates to.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 6 — SEO Configuration
            ═══════════════════════════════════════════════════════════════ */}
            <div
              style={{
                border: '1px solid #ccfbf1',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
                background: '#f0fdfa',
              }}
            >
              <div style={sectionHeaderStyle}>
                <strong style={{ fontSize: '0.95rem', color: '#0f766e', display: 'block' }}>
                  <i className="fa-solid fa-magnifying-glass-chart" style={{ color: '#0d9488', marginRight: '8px' }} />
                  Search Engine Optimization (SEO) Configuration
                </strong>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Optimize metadata for Google rankings and browser crawlers.
                </span>
              </div>

              <div className="form-row-2col">
                <div className="form-field-group">
                  <label htmlFor="seoTitle">SEO Meta Title</label>
                  <input
                    id="seoTitle"
                    type="text"
                    className="form-input-text"
                    placeholder="e.g. BuyBright - Advanced Precision Dental Instruments"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  />
                  <span className="form-field-hint">Optimized title for search engine result snippets.</span>
                </div>

                <div className="form-field-group">
                  <label htmlFor="seoAltText">Banner Image Alt Text (Accessibility &amp; SEO)</label>
                  <input
                    id="seoAltText"
                    type="text"
                    className="form-input-text"
                    placeholder="e.g. Modern dentalprecision tools and diagnostic equipment banner"
                    value={formData.seoAltText}
                    onChange={(e) => setFormData({ ...formData, seoAltText: e.target.value })}
                  />
                  <span className="form-field-hint">Descriptive alt text read by Google and screen readers.</span>
                </div>
              </div>

              <div className="form-field-group" style={{ marginTop: '10px' }}>
                <label htmlFor="seoDescription">SEO Meta Description</label>
                <textarea
                  id="seoDescription"
                  className="form-input-textarea"
                  placeholder="e.g. Order high-precision dental instruments, autoclaves, and handpieces with nationwide doorstep delivery..."
                  value={formData.seoDescription}
                  onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                  rows={2}
                />
                <span className="form-field-hint">Under 160 characters — summary for Google search results.</span>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 7 — Display Order & Status
            ═══════════════════════════════════════════════════════════════ */}
            <div className="form-row-2col">
              <div className="form-field-group">
                <label htmlFor="bannerDisplayOrder">Display Order</label>
                <input
                  id="bannerDisplayOrder"
                  type="number"
                  min="1"
                  max="99"
                  className="form-input-text"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                />
                <span className="form-field-hint">Lower numbers appear first in the carousel rotation.</span>
              </div>

              <div className="form-field-group">
                <label htmlFor="bannerStatus">Banner Status</label>
                <select
                  id="bannerStatus"
                  className="form-input-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
                >
                  <option value="Active">Active — Visible on Homepage</option>
                  <option value="Inactive">Inactive — Draft / Hidden</option>
                </select>
                <span className="form-field-hint">Only Active banners are shown in the homepage slider.</span>
              </div>
            </div>

            {/* ─── Bottom Action Bar ────────────────────────────────────── */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '12px',
                marginTop: '28px',
                paddingTop: '20px',
                borderTop: '1px solid #f1f5f9',
              }}
            >
              <button
                type="button"
                className="btn-admin-secondary"
                onClick={() => navigate('/admin/home/banners')}
              >
                Cancel
              </button>
              <button type="submit" className="btn-admin-primary">
                <i className="fa-solid fa-check" />{' '}
                {isEdit ? 'Update Banner' : 'Save Banner'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default HomeBannerForm;
