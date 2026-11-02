/**
 * AboutMissionVisionForm Page.
 * BuyBright Admin About Page Module - Section 3: Mission & Vision.
 * Configures the mission statement, vision outlook, and their respective core value points.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { AboutSectionTabs } from './AboutSectionTabs';
import { getAboutData, updateAboutSection } from '../../data/aboutData';
import type { AboutMissionVisionSection } from '../../types/about';
import { useToast } from '../../../context/ToastContext';
import './AboutModule.scss';

export const AboutMissionVisionForm: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const initialData = getAboutData().missionVision;

  const [formData, setFormData] = useState<AboutMissionVisionSection>(initialData);

  const handleMissionPointChange = (index: number, val: string) => {
    const updated = [...formData.missionPoints];
    updated[index] = val;
    setFormData((prev) => ({ ...prev, missionPoints: updated }));
  };

  const handleAddMissionPoint = () => {
    setFormData((prev) => ({ ...prev, missionPoints: [...prev.missionPoints, ''] }));
  };

  const handleRemoveMissionPoint = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      missionPoints: prev.missionPoints.filter((_, i) => i !== index),
    }));
  };

  const handleMoveMissionPoint = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formData.missionPoints.length) return;
    const updated = [...formData.missionPoints];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFormData((prev) => ({ ...prev, missionPoints: updated }));
  };

  const handleVisionPointChange = (index: number, val: string) => {
    const updated = [...formData.visionPoints];
    updated[index] = val;
    setFormData((prev) => ({ ...prev, visionPoints: updated }));
  };

  const handleAddVisionPoint = () => {
    setFormData((prev) => ({ ...prev, visionPoints: [...prev.visionPoints, ''] }));
  };

  const handleRemoveVisionPoint = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      visionPoints: prev.visionPoints.filter((_, i) => i !== index),
    }));
  };

  const handleMoveVisionPoint = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formData.visionPoints.length) return;
    const updated = [...formData.visionPoints];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFormData((prev) => ({ ...prev, visionPoints: updated }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Section Title is required.', 'danger');
      return;
    }
    updateAboutSection('missionVision', formData);
    showToast('Section 3: Mission & Vision saved successfully!', 'success');
  };

  return (
    <AdminLayout
      title="About Page: Mission & Vision"
      subtitle="Section 3 - Configure core guiding principles, dental mission, and future vision statements"
    >
      <div className="about-admin-wrapper">
        {/* Navigation Tabs */}
        <AboutSectionTabs />

        {/* Back Link Bar */}
        <div className="about-nav-back-bar">
          <Link
            to="/admin/about/who-we-are"
            className="btn-admin-secondary nav-bar-btn"
          >
            <i className="fa-solid fa-arrow-left" /> Previous: Section 2 (Who We Are)
          </Link>

          <Link
            to="/admin/about/journey"
            className="btn-admin-outline nav-bar-btn"
          >
            Next: Section 4 (Our Journey) <i className="fa-solid fa-arrow-right" />
          </Link>
        </div>

        {/* Main Form Card */}
        <div className="about-form-card">
          <div className="about-card-header">
            <div className="header-text-col">
              <h3 className="card-main-title">
                <i className="fa-solid fa-bullseye" style={{ color: '#7c3aed' }} />
                Section 3: Guiding Principles (Mission &amp; Vision)
              </h3>
              <p className="card-main-desc">
                Formulate BuyBright's core purpose statement, future aspirations, and bullet-point commitments.
              </p>
            </div>
            <span className="admin-badge badge-info">Section 3 of 5</span>
          </div>

          <form onSubmit={handleSubmit} className="admin-modal-form">
            {/* Row 1: Eyebrow, Title & Subtitle */}
            <div className="form-row-2col">
              <div className="form-field-group">
                <label htmlFor="mvEyebrow">
                  Eyebrow Tag <span className="required-star">*</span>
                </label>
                <input
                  id="mvEyebrow"
                  type="text"
                  className="form-input-text"
                  placeholder="e.g. GUIDING PRINCIPLES"
                  value={formData.eyebrow}
                  onChange={(e) => setFormData({ ...formData, eyebrow: e.target.value })}
                  required
                />
              </div>

              <div className="form-field-group">
                <label htmlFor="mvTitle">
                  Section Headline <span className="required-star">*</span>
                </label>
                <input
                  id="mvTitle"
                  type="text"
                  className="form-input-text"
                  placeholder="e.g. Our Mission & Vision"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-field-group">
              <label htmlFor="mvSubtitle">Section Subtitle / Description</label>
              <input
                id="mvSubtitle"
                type="text"
                className="form-input-text"
                placeholder="The fundamental core values that drive every shipment..."
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              />
            </div>

            {/* Two Column Grid for Mission Card and Vision Card */}
            <div className="about-mv-duo-grid">
              {/* Mission Card Form */}
              <div className="about-mv-card mission-theme">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: '#0d9488',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem',
                    }}
                  >
                    <i className="fa-solid fa-bullseye" />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0d9488' }}>OUR PURPOSE</span>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                      Our Mission
                    </h4>
                  </div>
                </div>

                <div className="form-field-group">
                  <label htmlFor="missionStatement">
                    Mission Statement (Quote) <span className="required-star">*</span>
                  </label>
                  <textarea
                    id="missionStatement"
                    rows={4}
                    className="form-input-textarea"
                    placeholder="To empower dental practitioners across India..."
                    value={formData.missionStatement}
                    onChange={(e) => setFormData({ ...formData, missionStatement: e.target.value })}
                    required
                  />
                </div>

                {/* Redesigned Mission Value Points */}
                <div className="admin-value-points-box mission-theme">
                  <div className="points-box-header">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label className="points-box-title">
                          <i className="fa-solid fa-list-check" /> Mission Value Points
                        </label>
                        <span className="points-count-badge">
                          {formData.missionPoints.length} Points
                        </span>
                      </div>
                      <span className="points-box-hint">
                        Core quality commitments displayed as bullet cards under the mission statement.
                      </span>
                    </div>

                    <button
                      type="button"
                      className="btn-add-point"
                      onClick={handleAddMissionPoint}
                    >
                      <i className="fa-solid fa-plus" /> Add Value Point
                    </button>
                  </div>

                  {formData.missionPoints.length === 0 ? (
                    <div className="points-empty-state">
                      <i className="fa-solid fa-circle-info" />
                      <p>No mission value points added yet.</p>
                      <button
                        type="button"
                        className="btn-add-point-ghost"
                        onClick={handleAddMissionPoint}
                      >
                        + Add First Point
                      </button>
                    </div>
                  ) : (
                    <div className="points-items-list">
                      {formData.missionPoints.map((point, idx) => (
                        <div key={idx} className="point-card-row">
                          <div className="point-badge-pill">
                            <span className="point-index-num">#{idx + 1}</span>
                            <i className="fa-solid fa-circle-check point-check-icon" />
                          </div>

                          <div className="point-input-wrapper">
                            <input
                              type="text"
                              className="point-input-field"
                              value={point}
                              onChange={(e) => handleMissionPointChange(idx, e.target.value)}
                              placeholder={`e.g. Value point #${idx + 1} for product excellence...`}
                              required
                            />
                          </div>

                          <div className="point-actions-cluster">
                            <button
                              type="button"
                              className="btn-point-reorder"
                              onClick={() => handleMoveMissionPoint(idx, 'up')}
                              disabled={idx === 0}
                              title="Move Up"
                            >
                              <i className="fa-solid fa-arrow-up" />
                            </button>
                            <button
                              type="button"
                              className="btn-point-reorder"
                              onClick={() => handleMoveMissionPoint(idx, 'down')}
                              disabled={idx === formData.missionPoints.length - 1}
                              title="Move Down"
                            >
                              <i className="fa-solid fa-arrow-down" />
                            </button>
                            <button
                              type="button"
                              className="btn-point-delete"
                              onClick={() => handleRemoveMissionPoint(idx)}
                              title="Delete Point"
                              disabled={formData.missionPoints.length <= 1}
                              style={{ opacity: formData.missionPoints.length <= 1 ? 0.35 : 1, cursor: formData.missionPoints.length <= 1 ? 'not-allowed' : 'pointer' }}
                            >
                              <i className="fa-solid fa-trash-can" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Vision Card Form */}
              <div className="about-mv-card vision-theme">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: '#4f46e5',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem',
                    }}
                  >
                    <i className="fa-solid fa-eye" />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#4f46e5' }}>FUTURE OUTLOOK</span>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                      Our Vision
                    </h4>
                  </div>
                </div>

                <div className="form-field-group">
                  <label htmlFor="visionStatement">
                    Vision Statement (Quote) <span className="required-star">*</span>
                  </label>
                  <textarea
                    id="visionStatement"
                    rows={4}
                    className="form-input-textarea"
                    placeholder="To become India's most trusted dental procurement ecosystem..."
                    value={formData.visionStatement}
                    onChange={(e) => setFormData({ ...formData, visionStatement: e.target.value })}
                    required
                  />
                </div>

                {/* Redesigned Vision Goal Points */}
                <div className="admin-value-points-box vision-theme">
                  <div className="points-box-header">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label className="points-box-title">
                          <i className="fa-solid fa-compass" /> Vision Goal Points
                        </label>
                        <span className="points-count-badge">
                          {formData.visionPoints.length} Points
                        </span>
                      </div>
                      <span className="points-box-hint">
                        Strategic targets and roadmap objectives for dental care evolution.
                      </span>
                    </div>

                    <button
                      type="button"
                      className="btn-add-point"
                      onClick={handleAddVisionPoint}
                    >
                      <i className="fa-solid fa-plus" /> Add Goal Point
                    </button>
                  </div>

                  {formData.visionPoints.length === 0 ? (
                    <div className="points-empty-state">
                      <i className="fa-solid fa-circle-info" />
                      <p>No vision goal points added yet.</p>
                      <button
                        type="button"
                        className="btn-add-point-ghost"
                        onClick={handleAddVisionPoint}
                      >
                        + Add First Point
                      </button>
                    </div>
                  ) : (
                    <div className="points-items-list">
                      {formData.visionPoints.map((point, idx) => (
                        <div key={idx} className="point-card-row">
                          <div className="point-badge-pill">
                            <span className="point-index-num">#{idx + 1}</span>
                            <i className="fa-solid fa-circle-check point-check-icon" />
                          </div>

                          <div className="point-input-wrapper">
                            <input
                              type="text"
                              className="point-input-field"
                              value={point}
                              onChange={(e) => handleVisionPointChange(idx, e.target.value)}
                              placeholder={`e.g. Vision target #${idx + 1} for healthcare delivery...`}
                              required
                            />
                          </div>

                          <div className="point-actions-cluster">
                            <button
                              type="button"
                              className="btn-point-reorder"
                              onClick={() => handleMoveVisionPoint(idx, 'up')}
                              disabled={idx === 0}
                              title="Move Up"
                            >
                              <i className="fa-solid fa-arrow-up" />
                            </button>
                            <button
                              type="button"
                              className="btn-point-reorder"
                              onClick={() => handleMoveVisionPoint(idx, 'down')}
                              disabled={idx === formData.visionPoints.length - 1}
                              title="Move Down"
                            >
                              <i className="fa-solid fa-arrow-down" />
                            </button>
                            <button
                              type="button"
                              className="btn-point-delete"
                              onClick={() => handleRemoveVisionPoint(idx)}
                              title="Delete Point"
                              disabled={formData.visionPoints.length <= 1}
                              style={{ opacity: formData.visionPoints.length <= 1 ? 0.35 : 1, cursor: formData.visionPoints.length <= 1 ? 'not-allowed' : 'pointer' }}
                            >
                              <i className="fa-solid fa-trash-can" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                  <i className="fa-solid fa-check" /> Save Mission &amp; Vision
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AboutMissionVisionForm;
