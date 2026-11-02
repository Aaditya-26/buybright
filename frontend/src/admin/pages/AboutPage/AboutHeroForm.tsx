/**
 * AboutHeroForm Page.
 * BuyBright Admin About Page Module - Section 1: Hero & Metrics Form.
 * Configures the top hero banner, value proposition lead text, CTAs, and 4 trust statistics.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { AboutSectionTabs } from './AboutSectionTabs';
import { getAboutData, updateAboutSection } from '../../data/aboutData';
import type { AboutHeroSection, AboutMetricItem } from '../../types/about';
import { useToast } from '../../../context/ToastContext';
import './AboutModule.scss';

export const AboutHeroForm: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const initialData = getAboutData().hero;

  const [formData, setFormData] = useState<AboutHeroSection>(initialData);

  const handleMetricChange = (index: number, field: keyof AboutMetricItem, value: string) => {
    const updatedMetrics = [...formData.metrics];
    updatedMetrics[index] = {
      ...updatedMetrics[index],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, metrics: updatedMetrics }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Hero Title is required.', 'danger');
      return;
    }
    updateAboutSection('hero', formData);
    showToast('Section 1: Hero & Metrics saved successfully!', 'success');
  };

  return (
    <AdminLayout
      title="About Page: Hero & Metrics"
      subtitle="Section 1 - Configure top banner, introductory statement, CTA buttons, and key performance metrics"
    >
      <div className="about-admin-wrapper">
        {/* Navigation Tabs */}
        <AboutSectionTabs />

        {/* Back Link Bar */}
        <div className="about-nav-back-bar">
          <Link
            to="/admin/about"
            className="btn-admin-secondary nav-bar-btn"
          >
            <i className="fa-solid fa-arrow-left" /> Back to Overview
          </Link>

          <Link
            to="/admin/about/who-we-are"
            className="btn-admin-outline nav-bar-btn"
          >
            Next: Section 2 (Who We Are) <i className="fa-solid fa-arrow-right" />
          </Link>
        </div>

        {/* Main Form Card */}
        <div className="about-form-card">
          <div className="about-card-header">
            <div className="header-text-col">
              <h3 className="card-main-title">
                <i className="fa-solid fa-bullhorn" style={{ color: '#0d9488' }} />
                Section 1: Hero Banner &amp; Performance Metrics
              </h3>
              <p className="card-main-desc">
                Fill out the brand headline, introductory copy, button URLs, and the 4 live metrics displayed on the storefront.
              </p>
            </div>
            <span className="admin-badge badge-info">Section 1 of 5</span>
          </div>

          <form onSubmit={handleSubmit} className="admin-modal-form">
            {/* Row 1: Eyebrow Badge Text */}
            <div className="form-field-group">
              <label htmlFor="badgeText">
                Eyebrow Badge Text <span className="required-star">*</span>
              </label>
              <input
                id="badgeText"
                type="text"
                className="form-input-text"
                placeholder="e.g. ABOUT PRESTODENTAL • INDIA'S TRUSTED DENTAL NETWORK"
                value={formData.badgeText}
                onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                required
              />
              <span className="form-field-hint">Small pill label shown above the main title.</span>
            </div>

            {/* Row 2: Main Title */}
            <div className="form-field-group">
              <label htmlFor="heroTitle">
                Hero Main Title <span className="required-star">*</span>
              </label>
              <textarea
                id="heroTitle"
                rows={2}
                className="form-input-textarea"
                placeholder="e.g. Your Trusted Partner for 100% Genuine Dental Supplies & Cold-Chain Logistics"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <span className="form-field-hint">The primary H1 statement visible upon landing on the page.</span>
            </div>

            {/* Row 3: Lead Paragraph */}
            <div className="form-field-group">
              <label htmlFor="leadText">
                Lead Overview Paragraph <span className="required-star">*</span>
              </label>
              <textarea
                id="leadText"
                rows={3}
                className="form-input-textarea"
                placeholder="Detailed platform description and value proposition..."
                value={formData.leadText}
                onChange={(e) => setFormData({ ...formData, leadText: e.target.value })}
                required
              />
              <span className="form-field-hint">Comprehensive summary of BuyBright's dental procurement service.</span>
            </div>

            {/* Row 4: CTA Buttons */}
            <div className="about-cta-boxes-grid">
              <div className="cta-action-box">
                <strong className="box-title">
                  <i className="fa-solid fa-play" style={{ color: '#0d9488' }} />
                  Primary Action Button
                </strong>
                <div className="form-field-group">
                  <label htmlFor="primaryBtnText">Button Label</label>
                  <input
                    id="primaryBtnText"
                    type="text"
                    className="form-input-text"
                    value={formData.primaryBtnText}
                    onChange={(e) => setFormData({ ...formData, primaryBtnText: e.target.value })}
                  />
                </div>
                <div className="form-field-group">
                  <label htmlFor="primaryBtnUrl">Button Target URL</label>
                  <input
                    id="primaryBtnUrl"
                    type="text"
                    className="form-input-text"
                    value={formData.primaryBtnUrl}
                    onChange={(e) => setFormData({ ...formData, primaryBtnUrl: e.target.value })}
                  />
                </div>
              </div>

              <div className="cta-action-box">
                <strong className="box-title">
                  <i className="fa-solid fa-compass" style={{ color: '#64748b' }} />
                  Secondary Action Button
                </strong>
                <div className="form-field-group">
                  <label htmlFor="secondaryBtnText">Button Label</label>
                  <input
                    id="secondaryBtnText"
                    type="text"
                    className="form-input-text"
                    value={formData.secondaryBtnText}
                    onChange={(e) => setFormData({ ...formData, secondaryBtnText: e.target.value })}
                  />
                </div>
                <div className="form-field-group">
                  <label htmlFor="secondaryBtnUrl">Button Target URL (or Anchor)</label>
                  <input
                    id="secondaryBtnUrl"
                    type="text"
                    className="form-input-text"
                    value={formData.secondaryBtnUrl}
                    onChange={(e) => setFormData({ ...formData, secondaryBtnUrl: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Metrics Section: 4 Proof Statistics */}
            <div style={{ marginTop: '24px' }}>
              <div style={{ marginBottom: '14px' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                  <i className="fa-solid fa-chart-simple" style={{ color: '#0d9488', marginRight: '8px' }} />
                  4 Live Performance Metrics &amp; Trust Numbers
                </h4>
                <p style={{ margin: '3px 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                  These 4 statistics are displayed directly below the hero banner.
                </p>
              </div>

              <div className="about-metrics-grid">
                {formData.metrics.map((metric, idx) => (
                  <div key={metric.id || idx} className="about-metric-card">
                    <div className="metric-top-header">
                      <span className="metric-badge">
                        Metric #{idx + 1}
                      </span>
                      <i className={metric.icon} style={{ color: metric.accentColor, fontSize: '1rem' }} />
                    </div>

                    <div className="form-field-group">
                      <label>Metric Value / Stat</label>
                      <input
                        type="text"
                        className="form-input-text"
                        placeholder="e.g. 10,000+"
                        value={metric.number}
                        onChange={(e) => handleMetricChange(idx, 'number', e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-field-group">
                      <label>Label</label>
                      <input
                        type="text"
                        className="form-input-text"
                        placeholder="e.g. Dental Clinics Served"
                        value={metric.label}
                        onChange={(e) => handleMetricChange(idx, 'label', e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-field-group">
                      <label>Description Note</label>
                      <textarea
                        rows={2}
                        className="form-input-textarea"
                        placeholder="Short supportive detail..."
                        value={metric.description}
                        onChange={(e) => handleMetricChange(idx, 'description', e.target.value)}
                      />
                    </div>

                    <div className="metric-split-row">
                      <div className="form-field-group">
                        <label>FontAwesome Icon</label>
                        <input
                          type="text"
                          className="form-input-text"
                          value={metric.icon}
                          onChange={(e) => handleMetricChange(idx, 'icon', e.target.value)}
                        />
                      </div>
                      <div className="form-field-group">
                        <label>Accent Color</label>
                        <input
                          type="text"
                          className="form-input-text"
                          value={metric.accentColor}
                          onChange={(e) => handleMetricChange(idx, 'accentColor', e.target.value)}
                        />
                      </div>
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
                  <i className="fa-solid fa-check" /> Save Hero &amp; Metrics
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AboutHeroForm;
