/**
 * AboutPillarsForm Page.
 * BuyBright Admin About Page Module - Section 5: Trust Pillars & CTA Callout.
 * Configures the 4 dental trust pillars and the bottom promotional call-to-action banner.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { AboutSectionTabs } from './AboutSectionTabs';
import { getAboutData, updateAboutSection } from '../../data/aboutData';
import type { AboutPillarsSection, AboutPillarItem } from '../../types/about';
import { useToast } from '../../../context/ToastContext';
import './AboutModule.scss';

export const AboutPillarsForm: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const initialData = getAboutData().pillars;

  const [formData, setFormData] = useState<AboutPillarsSection>(initialData);

  const handlePillarChange = (index: number, field: keyof AboutPillarItem, val: string) => {
    const updated = [...formData.pillars];
    updated[index] = { ...updated[index], [field]: val };
    setFormData((prev) => ({ ...prev, pillars: updated }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Section Title is required.', 'danger');
      return;
    }
    updateAboutSection('pillars', formData);
    showToast('Section 5: Trust Pillars & CTA saved successfully!', 'success');
  };

  return (
    <AdminLayout
      title="About Page: Trust Pillars & CTA"
      subtitle="Section 5 - Configure the 4 pillars of dental trust and bottom helpdesk action banner"
    >
      <div className="about-admin-wrapper">
        {/* Navigation Tabs */}
        <AboutSectionTabs />

        {/* Back Link Bar */}
        <div className="about-nav-back-bar">
          <Link
            to="/admin/about/journey"
            className="btn-admin-secondary nav-bar-btn"
          >
            <i className="fa-solid fa-arrow-left" /> Previous: Section 4 (Our Journey)
          </Link>

          <Link
            to="/admin/about"
            className="btn-admin-outline nav-bar-btn"
          >
            Return to Overview <i className="fa-solid fa-table-cells-large" />
          </Link>
        </div>

        {/* Main Form Card */}
        <div className="about-form-card">
          <div className="about-card-header">
            <div className="header-text-col">
              <h3 className="card-main-title">
                <i className="fa-solid fa-shield-halved" style={{ color: '#16a34a' }} />
                Section 5: The 4 Pillars of Dental Trust &amp; Storefront CTA
              </h3>
              <p className="card-main-desc">
                Manage international quality standards (QC, bulk pricing, cold-chain, returns) and the bottom conversion banner.
              </p>
            </div>
            <span className="admin-badge badge-info">Section 5 of 5</span>
          </div>

          <form onSubmit={handleSubmit} className="admin-modal-form">
            {/* Row 1: Eyebrow, Title & Subtitle */}
            <div className="form-row-2col">
              <div className="form-field-group">
                <label htmlFor="pillarsEyebrow">
                  Eyebrow Tag <span className="required-star">*</span>
                </label>
                <input
                  id="pillarsEyebrow"
                  type="text"
                  className="form-input-text"
                  placeholder="e.g. THE PRESTODENTAL STANDARD"
                  value={formData.eyebrow}
                  onChange={(e) => setFormData({ ...formData, eyebrow: e.target.value })}
                  required
                />
              </div>

              <div className="form-field-group">
                <label htmlFor="pillarsTitle">
                  Section Headline <span className="required-star">*</span>
                </label>
                <input
                  id="pillarsTitle"
                  type="text"
                  className="form-input-text"
                  placeholder="e.g. The 4 Pillars of Dental Trust"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-field-group">
              <label htmlFor="pillarsSubtitle">Section Subtitle / Description</label>
              <input
                id="pillarsSubtitle"
                type="text"
                className="form-input-text"
                placeholder="Every product and package adheres to strict international dental distribution standards."
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              />
            </div>

            {/* The 4 Trust Pillars Cards */}
            <div style={{ marginTop: '24px' }}>
              <h4 style={{ margin: '0 0 14px 0', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                <i className="fa-solid fa-list-check" style={{ color: '#16a34a', marginRight: '8px' }} />
                4 Dental Trust Pillars
              </h4>

              <div className="about-pillars-grid">
                {formData.pillars.map((pillar, idx) => (
                  <div
                    key={pillar.id || idx}
                    className="about-pillar-card"
                    style={{
                      borderTop: `4px solid ${pillar.themeColor || '#16a34a'}`,
                    }}
                  >
                    <div className="pillar-head-row">
                      <span
                        className="pillar-badge"
                        style={{
                          color: pillar.themeColor,
                        }}
                      >
                        Pillar #{idx + 1}
                      </span>
                      <i className={pillar.icon} style={{ color: pillar.themeColor }} />
                    </div>

                    <div className="form-field-group">
                      <label>Pillar Title</label>
                      <input
                        type="text"
                        className="form-input-text"
                        value={pillar.title}
                        onChange={(e) => handlePillarChange(idx, 'title', e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-field-group">
                      <label>Detailed Description</label>
                      <textarea
                        rows={3}
                        className="form-input-textarea"
                        value={pillar.description}
                        onChange={(e) => handlePillarChange(idx, 'description', e.target.value)}
                        required
                      />
                    </div>

                    <div className="pillar-icon-color-row">
                      <div className="form-field-group">
                        <label>Icon</label>
                        <input
                          type="text"
                          className="form-input-text"
                          value={pillar.icon}
                          onChange={(e) => handlePillarChange(idx, 'icon', e.target.value)}
                        />
                      </div>
                      <div className="form-field-group">
                        <label>Color</label>
                        <input
                          type="text"
                          className="form-input-text"
                          value={pillar.themeColor}
                          onChange={(e) => handlePillarChange(idx, 'themeColor', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Storefront Action Callout Banner */}
            <div className="about-cta-banner-card">
              <div className="cta-banner-header">
                <h4 className="cta-banner-title">
                  <i className="fa-solid fa-sparkles" style={{ color: '#0d9488' }} />
                  Bottom Action Callout Banner (Footer Transition)
                </h4>
                <span className="cta-banner-sub">
                  High-converting gradient banner encouraging orders or direct phone inquiries.
                </span>
              </div>

              <div className="about-form-row-2col">
                <div className="form-field-group">
                  <label htmlFor="ctaTag">CTA Badge Pill Text</label>
                  <input
                    id="ctaTag"
                    type="text"
                    className="form-input-text"
                    value={formData.ctaTag}
                    onChange={(e) => setFormData({ ...formData, ctaTag: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label htmlFor="ctaPhone">Phone Support Hotline</label>
                  <input
                    id="ctaPhone"
                    type="text"
                    className="form-input-text"
                    value={formData.ctaPhone}
                    onChange={(e) => setFormData({ ...formData, ctaPhone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-field-group" style={{ marginTop: '10px' }}>
                <label htmlFor="ctaTitle">CTA Headline</label>
                <input
                  id="ctaTitle"
                  type="text"
                  className="form-input-text"
                  value={formData.ctaTitle}
                  onChange={(e) => setFormData({ ...formData, ctaTitle: e.target.value })}
                />
              </div>

              <div className="form-field-group" style={{ marginTop: '10px' }}>
                <label htmlFor="ctaSubtitle">CTA Subtitle Copy</label>
                <textarea
                  id="ctaSubtitle"
                  rows={2}
                  className="form-input-textarea"
                  value={formData.ctaSubtitle}
                  onChange={(e) => setFormData({ ...formData, ctaSubtitle: e.target.value })}
                />
              </div>

              <div className="about-form-row-2col" style={{ marginTop: '10px', marginBottom: 0 }}>
                <div className="form-field-group">
                  <label htmlFor="ctaBtnText">Catalog Action Button Text</label>
                  <input
                    id="ctaBtnText"
                    type="text"
                    className="form-input-text"
                    value={formData.ctaBtnText}
                    onChange={(e) => setFormData({ ...formData, ctaBtnText: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label htmlFor="ctaBtnUrl">Catalog Target Link</label>
                  <input
                    id="ctaBtnUrl"
                    type="text"
                    className="form-input-text"
                    value={formData.ctaBtnUrl}
                    onChange={(e) => setFormData({ ...formData, ctaBtnUrl: e.target.value })}
                  />
                </div>
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
                  <i className="fa-solid fa-check" /> Save Trust Pillars &amp; CTA
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AboutPillarsForm;
