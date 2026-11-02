/**
 * AboutJourneyForm Page.
 * BuyBright Admin About Page Module - Section 4: Our Journey & Milestones.
 * Configures the historical growth timeline with editable milestones, icons, and theme accents.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { AboutSectionTabs } from './AboutSectionTabs';
import { getAboutData, updateAboutSection } from '../../data/aboutData';
import type { AboutJourneySection, AboutMilestoneItem } from '../../types/about';
import { useToast } from '../../../context/ToastContext';
import './AboutModule.scss';

export const AboutJourneyForm: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const initialData = getAboutData().journey;

  const [formData, setFormData] = useState<AboutJourneySection>(initialData);

  const handleMilestoneChange = (index: number, field: keyof AboutMilestoneItem, val: string) => {
    const updated = [...formData.milestones];
    updated[index] = { ...updated[index], [field]: val };
    setFormData((prev) => ({ ...prev, milestones: updated }));
  };

  const handleAddMilestone = () => {
    const newMilestone: AboutMilestoneItem = {
      id: `mile-${Date.now()}`,
      year: `${new Date().getFullYear()}`,
      tag: 'NEW MILESTONE',
      title: 'Expansion & Innovation',
      description: 'Milestone description highlighting new partnerships and infrastructure.',
      icon: 'fa-solid fa-flag-checkered',
      accentColor: '#0d9488',
    };
    setFormData((prev) => ({ ...prev, milestones: [...prev.milestones, newMilestone] }));
    showToast('New milestone entry added.', 'info');
  };

  const handleRemoveMilestone = (index: number) => {
    if (formData.milestones.length <= 1) {
      showToast('At least 1 milestone is required.', 'warning');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index),
    }));
    showToast('Milestone entry removed.', 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Section Title is required.', 'danger');
      return;
    }
    updateAboutSection('journey', formData);
    showToast('Section 4: Our Journey saved successfully!', 'success');
  };

  return (
    <AdminLayout
      title="About Page: Our Journey"
      subtitle="Section 4 - Configure growth timeline milestones, inception story, and future roadmap"
    >
      <div className="about-admin-wrapper">
        {/* Navigation Tabs */}
        <AboutSectionTabs />

        {/* Back Link Bar */}
        <div className="about-nav-back-bar">
          <Link
            to="/admin/about/mission-vision"
            className="btn-admin-secondary nav-bar-btn"
          >
            <i className="fa-solid fa-arrow-left" /> Previous: Section 3 (Mission &amp; Vision)
          </Link>

          <Link
            to="/admin/about/pillars"
            className="btn-admin-outline nav-bar-btn"
          >
            Next: Section 5 (Trust Pillars) <i className="fa-solid fa-arrow-right" />
          </Link>
        </div>

        {/* Main Form Card */}
        <div className="about-form-card">
          <div className="about-card-header">
            <div className="header-text-col">
              <h3 className="card-main-title">
                <i className="fa-solid fa-timeline" style={{ color: '#ea580c' }} />
                Section 4: Milestones &amp; Evolution Timeline
              </h3>
              <p className="card-main-desc">
                Customize each milestone in the chronological roadmap, with years, badges, headlines, and color themes.
              </p>
            </div>
            <span className="admin-badge badge-info">Section 4 of 5</span>
          </div>

          <form onSubmit={handleSubmit} className="admin-modal-form">
            {/* Row 1: Eyebrow, Title & Subtitle */}
            <div className="form-row-2col">
              <div className="form-field-group">
                <label htmlFor="journeyEyebrow">
                  Eyebrow Tag <span className="required-star">*</span>
                </label>
                <input
                  id="journeyEyebrow"
                  type="text"
                  className="form-input-text"
                  placeholder="e.g. MILESTONES & EVOLUTION"
                  value={formData.eyebrow}
                  onChange={(e) => setFormData({ ...formData, eyebrow: e.target.value })}
                  required
                />
              </div>

              <div className="form-field-group">
                <label htmlFor="journeyTitle">
                  Section Headline <span className="required-star">*</span>
                </label>
                <input
                  id="journeyTitle"
                  type="text"
                  className="form-input-text"
                  placeholder="e.g. Our Journey of Innovation & Trust"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-field-group">
              <label htmlFor="journeySubtitle">Section Subtitle / Description</label>
              <input
                id="journeySubtitle"
                type="text"
                className="form-input-text"
                placeholder="From a small initiative by practicing doctors to India's premier dental network..."
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              />
            </div>

            {/* Milestones Timeline Items Manager */}
            <div style={{ marginTop: '24px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                    <i className="fa-solid fa-list-check" style={{ color: '#ea580c', marginRight: '8px' }} />
                    Milestone Cards ({formData.milestones.length} Milestones)
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Rendered as animated interactive glassmorphism cards on the public timeline.
                  </span>
                </div>

                <button
                  type="button"
                  className="btn-admin-primary"
                  onClick={handleAddMilestone}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <i className="fa-solid fa-plus" /> Add Milestone
                </button>
              </div>

              {/* Milestones Cards Grid */}
              <div className="about-milestones-grid">
                {formData.milestones.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="about-milestone-card"
                    style={{
                      borderTop: `4px solid ${item.accentColor || '#ea580c'}`,
                    }}
                  >
                    <div className="milestone-top-head">
                      <span
                        className="step-tag-pill"
                        style={{
                          background: `${item.accentColor}18`,
                          color: item.accentColor,
                        }}
                      >
                        Step #{idx + 1}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRemoveMilestone(idx)}
                        className="btn-delete-milestone"
                        title="Delete Milestone"
                      >
                        <i className="fa-solid fa-trash-can" /> Delete
                      </button>
                    </div>

                    <div className="milestone-duo-inputs">
                      <div className="form-field-group">
                        <label>Year / Era</label>
                        <input
                          type="text"
                          className="form-input-text"
                          placeholder="e.g. 2020"
                          value={item.year}
                          onChange={(e) => handleMilestoneChange(idx, 'year', e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-field-group">
                        <label>Category Tag</label>
                        <input
                          type="text"
                          className="form-input-text"
                          placeholder="e.g. THE INCEPTION"
                          value={item.tag}
                          onChange={(e) => handleMilestoneChange(idx, 'tag', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-field-group">
                      <label>Milestone Title</label>
                      <input
                        type="text"
                        className="form-input-text"
                        placeholder="e.g. Born Out of Dental Need"
                        value={item.title}
                        onChange={(e) => handleMilestoneChange(idx, 'title', e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-field-group">
                      <label>Detailed Description</label>
                      <textarea
                        rows={3}
                        className="form-input-textarea"
                        placeholder="What was achieved during this milestone period..."
                        value={item.description}
                        onChange={(e) => handleMilestoneChange(idx, 'description', e.target.value)}
                        required
                      />
                    </div>

                    <div className="milestone-duo-inputs">
                      <div className="form-field-group">
                        <label>FontAwesome Icon</label>
                        <input
                          type="text"
                          className="form-input-text"
                          value={item.icon}
                          onChange={(e) => handleMilestoneChange(idx, 'icon', e.target.value)}
                        />
                      </div>

                      <div className="form-field-group">
                        <label>Accent Color</label>
                        <input
                          type="text"
                          className="form-input-text"
                          value={item.accentColor}
                          onChange={(e) => handleMilestoneChange(idx, 'accentColor', e.target.value)}
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
                  <i className="fa-solid fa-check" /> Save Our Journey
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AboutJourneyForm;
