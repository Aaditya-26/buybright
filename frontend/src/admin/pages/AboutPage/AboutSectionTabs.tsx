/**
 * AboutSectionTabs Component.
 * Horizontal section-navigation tabs for the About Page module.
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import './AboutModule.scss';

export const AboutSectionTabs: React.FC = () => {
  return (
    <div className="admin-nav-tabs-wrapper">
      <NavLink
        to="/admin/about"
        end
        className={({ isActive }) => `admin-tab-btn ${isActive ? 'active' : ''}`}
      >
        <i className="fa-solid fa-table-cells-large" />
        <span>Sections Overview</span>
      </NavLink>

      <NavLink
        to="/admin/about/hero"
        className={({ isActive }) => `admin-tab-btn ${isActive ? 'active' : ''}`}
      >
        <i className="fa-solid fa-bullhorn" />
        <span>Hero &amp; Metrics</span>
        <span className="tab-badge">Section 1</span>
      </NavLink>

      <NavLink
        to="/admin/about/who-we-are"
        className={({ isActive }) => `admin-tab-btn ${isActive ? 'active' : ''}`}
      >
        <i className="fa-solid fa-user-doctor" />
        <span>Who We Are</span>
        <span className="tab-badge">Section 2</span>
      </NavLink>

      <NavLink
        to="/admin/about/mission-vision"
        className={({ isActive }) => `admin-tab-btn ${isActive ? 'active' : ''}`}
      >
        <i className="fa-solid fa-bullseye" />
        <span>Mission &amp; Vision</span>
        <span className="tab-badge">Section 3</span>
      </NavLink>

      <NavLink
        to="/admin/about/journey"
        className={({ isActive }) => `admin-tab-btn ${isActive ? 'active' : ''}`}
      >
        <i className="fa-solid fa-timeline" />
        <span>Our Journey</span>
        <span className="tab-badge">Section 4</span>
      </NavLink>

      <NavLink
        to="/admin/about/pillars"
        className={({ isActive }) => `admin-tab-btn ${isActive ? 'active' : ''}`}
      >
        <i className="fa-solid fa-shield-halved" />
        <span>Trust Pillars &amp; CTA</span>
        <span className="tab-badge">Section 5</span>
      </NavLink>
    </div>
  );
};

export default AboutSectionTabs;
