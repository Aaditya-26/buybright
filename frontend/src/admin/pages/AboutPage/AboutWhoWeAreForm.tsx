/**
 * AboutWhoWeAreForm Page.
 * BuyBright Admin About Page Module - Section 2: Who We Are.
 * Configures the founders' story, 2 dental imagery assets, QC badge, and 3 key pillars.
 */

import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { AboutSectionTabs } from './AboutSectionTabs';
import { getAboutData, updateAboutSection } from '../../data/aboutData';
import type { AboutWhoWeAreSection, AboutHighlightItem } from '../../types/about';
import { useToast } from '../../../context/ToastContext';
import './AboutModule.scss';

export const AboutWhoWeAreForm: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const initialData = getAboutData().whoWeAre;

  const [formData, setFormData] = useState<AboutWhoWeAreSection>(initialData);

  const mainFileInputRef = useRef<HTMLInputElement>(null);
  const secondaryFileInputRef = useRef<HTMLInputElement>(null);

  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file.', 'danger');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setFormData((prev) => ({ ...prev, mainImage: result }));
        showToast('Main dental image uploaded.', 'info');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSecondaryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file.', 'danger');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setFormData((prev) => ({ ...prev, secondaryImage: result }));
        showToast('Secondary operatory image uploaded.', 'info');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleHighlightChange = (index: number, field: keyof AboutHighlightItem, val: string) => {
    const updated = [...formData.highlights];
    updated[index] = { ...updated[index], [field]: val };
    setFormData((prev) => ({ ...prev, highlights: updated }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Section Title is required.', 'danger');
      return;
    }
    updateAboutSection('whoWeAre', formData);
    showToast('Section 2: Who We Are saved successfully!', 'success');
  };

  return (
    <AdminLayout
      title="About Page: Who We Are"
      subtitle="Section 2 - Configure founders story, clinician background, 2 images, and quality badges"
    >
      <div className="about-admin-wrapper">
        {/* Navigation Tabs */}
        <AboutSectionTabs />

        {/* Back Link Bar */}
        <div className="about-nav-back-bar">
          <Link
            to="/admin/about/hero"
            className="btn-admin-secondary nav-bar-btn"
          >
            <i className="fa-solid fa-arrow-left" /> Previous: Section 1 (Hero)
          </Link>

          <Link
            to="/admin/about/mission-vision"
            className="btn-admin-outline nav-bar-btn"
          >
            Next: Section 3 (Mission &amp; Vision) <i className="fa-solid fa-arrow-right" />
          </Link>
        </div>

        {/* Main Form Card */}
        <div className="about-form-card">
          <div className="about-card-header">
            <div className="header-text-col">
              <h3 className="card-main-title">
                <i className="fa-solid fa-user-doctor" style={{ color: '#0284c7' }} />
                Section 2: Who We Are &amp; Clinician Story
              </h3>
              <p className="card-main-desc">
                Configure the heritage narrative, quality badges, operatory images, and 3 key clinician highlights.
              </p>
            </div>
            <span className="admin-badge badge-info">Section 2 of 5</span>
          </div>

          <form onSubmit={handleSubmit} className="admin-modal-form">
            {/* Row 1: Eyebrow & Title */}
            <div className="form-row-2col">
              <div className="form-field-group">
                <label htmlFor="whoEyebrow">
                  Eyebrow Tag <span className="required-star">*</span>
                </label>
                <input
                  id="whoEyebrow"
                  type="text"
                  className="form-input-text"
                  placeholder="e.g. WHO WE ARE"
                  value={formData.eyebrow}
                  onChange={(e) => setFormData({ ...formData, eyebrow: e.target.value })}
                  required
                />
              </div>

              <div className="form-field-group">
                <label htmlFor="whoTitle">
                  Section Headline <span className="required-star">*</span>
                </label>
                <input
                  id="whoTitle"
                  type="text"
                  className="form-input-text"
                  placeholder="e.g. Practitioners & Innovators Revolutionizing Dental Procurement"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Row 2: Two Story Paragraphs */}
            <div className="form-field-group">
              <label htmlFor="whoP1">
                Story Paragraph 1 (Problem / Frustrations Experienced) <span className="required-star">*</span>
              </label>
              <textarea
                id="whoP1"
                rows={3}
                className="form-input-textarea"
                placeholder="We are a team of practicing dental surgeons..."
                value={formData.paragraph1}
                onChange={(e) => setFormData({ ...formData, paragraph1: e.target.value })}
                required
              />
            </div>

            <div className="form-field-group">
              <label htmlFor="whoP2">
                Story Paragraph 2 (Solution / BuyBright Vision) <span className="required-star">*</span>
              </label>
              <textarea
                id="whoP2"
                rows={3}
                className="form-input-textarea"
                placeholder="BuyBright was built to eliminate these risks..."
                value={formData.paragraph2}
                onChange={(e) => setFormData({ ...formData, paragraph2: e.target.value })}
                required
              />
            </div>

            {/* Hidden File Inputs */}
            <input
              ref={mainFileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleMainImageUpload}
            />
            <input
              ref={secondaryFileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleSecondaryImageUpload}
            />

            {/* Row 3: Images & Badge Management */}
            <div style={{ marginTop: '20px' }}>
              <h4 style={{ margin: '0 0 14px 0', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                <i className="fa-solid fa-images" style={{ color: '#0284c7', marginRight: '8px' }} />
                Dental Imagery &amp; Batch QC Badge
              </h4>

              <div className="about-images-duo-grid">
                {/* Main Image Box */}
                <div className="about-image-upload-card">
                  <div className="image-card-head">
                    <strong>Primary Dental Quality Image</strong>
                    <button
                      type="button"
                      className="btn-admin-outline"
                      onClick={() => mainFileInputRef.current?.click()}
                    >
                      <i className="fa-solid fa-upload" /> Change Image
                    </button>
                  </div>

                  <div className="image-preview-frame">
                    <img
                      src={formData.mainImage}
                      alt="Primary dental quality"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/banner.webp';
                      }}
                    />
                  </div>

                  <div className="form-field-group">
                    <label>Or Image URL</label>
                    <input
                      type="text"
                      className="form-input-text"
                      value={formData.mainImage}
                      onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
                    />
                  </div>

                  {/* Badge Controls */}
                  <div className="about-form-row-2col" style={{ marginTop: '6px', marginBottom: 0 }}>
                    <div className="form-field-group">
                      <label>Badge Number</label>
                      <input
                        type="text"
                        className="form-input-text"
                        placeholder="100%"
                        value={formData.experienceBadgeNum}
                        onChange={(e) => setFormData({ ...formData, experienceBadgeNum: e.target.value })}
                      />
                    </div>
                    <div className="form-field-group">
                      <label>Badge Caption</label>
                      <input
                        type="text"
                        className="form-input-text"
                        placeholder="Authentic Batch QC Verified"
                        value={formData.experienceBadgeText}
                        onChange={(e) => setFormData({ ...formData, experienceBadgeText: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Secondary Image Box */}
                <div className="about-image-upload-card">
                  <div className="image-card-head">
                    <strong>Secondary Operatory Image</strong>
                    <button
                      type="button"
                      className="btn-admin-outline"
                      onClick={() => secondaryFileInputRef.current?.click()}
                    >
                      <i className="fa-solid fa-upload" /> Change Image
                    </button>
                  </div>

                  <div className="image-preview-frame">
                    <img
                      src={formData.secondaryImage}
                      alt="Secondary operatory"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/banner1.webp';
                      }}
                    />
                  </div>

                  <div className="form-field-group">
                    <label>Or Image URL</label>
                    <input
                      type="text"
                      className="form-input-text"
                      value={formData.secondaryImage}
                      onChange={(e) => setFormData({ ...formData, secondaryImage: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Row 4: 3 Key Highlights */}
            <div style={{ marginTop: '24px' }}>
              <h4 style={{ margin: '0 0 14px 0', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                <i className="fa-solid fa-star" style={{ color: '#0284c7', marginRight: '8px' }} />
                3 Key Highlights &amp; Advantages
              </h4>

              <div className="about-highlights-grid">
                {formData.highlights.map((high, idx) => (
                  <div key={high.id || idx} className="about-highlight-card">
                    <div className="highlight-badge-line">
                      <span className="badge-tag">
                        Highlight #{idx + 1}
                      </span>
                      <i className={high.icon} style={{ color: '#0284c7' }} />
                    </div>

                    <div className="form-field-group">
                      <label>Highlight Title</label>
                      <input
                        type="text"
                        className="form-input-text"
                        value={high.title}
                        onChange={(e) => handleHighlightChange(idx, 'title', e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-field-group">
                      <label>Short Description</label>
                      <textarea
                        rows={2}
                        className="form-input-textarea"
                        value={high.description}
                        onChange={(e) => handleHighlightChange(idx, 'description', e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-field-group">
                      <label>FontAwesome Icon</label>
                      <input
                        type="text"
                        className="form-input-text"
                        value={high.icon}
                        onChange={(e) => handleHighlightChange(idx, 'icon', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="about-form-footer">
              <button
                type="button"
                className="btn-admin-secondary"
                onClick={() => navigate('/admin/about')}
              >
                Cancel
              </button>

              <div className="footer-actions-right">
                <button type="submit" className="btn-admin-primary">
                  <i className="fa-solid fa-check" /> Save Who We Are
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AboutWhoWeAreForm;
