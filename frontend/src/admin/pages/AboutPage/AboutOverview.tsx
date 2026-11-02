/**
 * AboutOverview Page.
 * BuyBright Admin About Page Module - Sections Hub.
 * Shows high-level summary cards of all 5 configurable sections with live status and direct edit links.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { AboutSectionTabs } from './AboutSectionTabs';
import { getAboutData } from '../../data/aboutData';
import type { AboutPageData } from '../../types/about';
import './AboutModule.scss';

export const AboutOverview: React.FC = () => {
  const navigate = useNavigate();
  const [data] = useState<AboutPageData>(() => getAboutData());

  const sections = [
    {
      id: 'hero',
      number: 'Section 1',
      title: 'Hero & Performance Metrics',
      icon: 'fa-solid fa-bullhorn',
      color: '#0d9488',
      summary: `${data.hero.metrics.length} Metrics • Eyebrow Badge • Primary & Secondary CTAs`,
      preview: data.hero.title,
      link: '/admin/about/hero',
    },
    {
      id: 'who-we-are',
      number: 'Section 2',
      title: 'Who We Are & Clinician Story',
      icon: 'fa-solid fa-user-doctor',
      color: '#0284c7',
      summary: `2 Images • ${data.whoWeAre.highlights.length} Key Highlights • QC Badge`,
      preview: data.whoWeAre.title,
      link: '/admin/about/who-we-are',
    },
    {
      id: 'mission-vision',
      number: 'Section 3',
      title: 'Mission & Vision Principles',
      icon: 'fa-solid fa-bullseye',
      color: '#7c3aed',
      summary: `Our Purpose • Future Outlook • ${data.missionVision.missionPoints.length + data.missionVision.visionPoints.length} Core Value Points`,
      preview: data.missionVision.title,
      link: '/admin/about/mission-vision',
    },
    {
      id: 'journey',
      number: 'Section 4',
      title: 'Our Journey & Milestones',
      icon: 'fa-solid fa-timeline',
      color: '#ea580c',
      summary: `${data.journey.milestones.length} Historical Growth Milestones • Animated Timeline`,
      preview: data.journey.title,
      link: '/admin/about/journey',
    },
    {
      id: 'pillars',
      number: 'Section 5',
      title: 'Trust Pillars & CTA Callout',
      icon: 'fa-solid fa-shield-halved',
      color: '#16a34a',
      summary: `${data.pillars.pillars.length} Trust Pillars • Bottom Helpdesk Callout Banner`,
      preview: data.pillars.title,
      link: '/admin/about/pillars',
    },
  ];

  return (
    <AdminLayout
      title="About Page Module"
      subtitle="Configure storefront content, images, statistics, and practice principles for the About Us page"
    >
      <div className="about-admin-wrapper">
        {/* Navigation Tabs */}
        <AboutSectionTabs />

        {/* Top Announcement / Quick Actions Bar */}
        <div className="about-overview-banner">
          <div className="banner-flex-container">
            <div className="banner-text-col">
              <div className="banner-headline-row">
                <span className="live-cms-pill">Live CMS</span>
                <h3 className="banner-heading">
                  About BuyBright Content Management
                </h3>
              </div>
              <p className="banner-subtext">
                Manage all 5 narrative sections of your public About Us page. Edits save to persistent storage immediately.
              </p>
            </div>

            <div className="banner-actions-col">
              <a
                href="/about"
                target="_blank"
                rel="noreferrer"
                className="btn-admin-outline"
              >
                <i className="fa-solid fa-arrow-up-right-from-square" /> View Public Page
              </a>
              <button
                type="button"
                className="btn-admin-primary"
                onClick={() => navigate('/admin/about/hero')}
              >
                <i className="fa-solid fa-pen-to-square" /> Start Editing (Section 1)
              </button>
            </div>
          </div>
        </div>

        {/* 5 Section Cards Grid */}
        <div className="about-sections-overview-grid">
          {sections.map((sec) => (
            <div key={sec.id} className="about-overview-card">
              <div>
                {/* Header */}
                <div className="card-top-header">
                  <div className="icon-title-pair">
                    <div
                      className="card-icon-bubble"
                      style={{
                        background: `${sec.color}15`,
                        color: sec.color,
                      }}
                    >
                      <i className={sec.icon} />
                    </div>
                    <div className="title-meta-col">
                      <span className="sec-num-label">{sec.number}</span>
                      <h4 className="sec-card-name">{sec.title}</h4>
                    </div>
                  </div>

                  <span className="admin-badge badge-success">
                    Active
                  </span>
                </div>

                <div className="preview-quote-box">
                  <span className="preview-label">
                    Current Heading Preview:
                  </span>
                  <p className="preview-text">
                    {sec.preview}
                  </p>
                </div>

                <div className="summary-info-line">
                  <i className="fa-solid fa-layer-group" />
                  {sec.summary}
                </div>
              </div>

              {/* Action Button */}
              <Link
                to={sec.link}
                className="btn-admin-secondary btn-configure-section"
              >
                <i className="fa-solid fa-pen-to-square" style={{ color: sec.color }} />
                <span>Configure {sec.number}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AboutOverview;
