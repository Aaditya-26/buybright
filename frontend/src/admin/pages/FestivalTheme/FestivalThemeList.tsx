/**
 * BuyBright Admin Festival Theme Management - List View.
 * Displays all festive promotional campaigns, active switch toggles, KPI summary cards,
 * and live preview triggers.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { useFestival } from '../../../context/FestivalContext';
import { useToast } from '../../../context/ToastContext';
import { FestivalTheme, FESTIVAL_PRESETS } from '../../../types/festival';

export const FestivalThemeList: React.FC = () => {
  const { festivals, activeFestival, activateFestival, deactivateFestival, removeFestival, resetDefaults } =
    useFestival();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterPreset, setFilterPreset] = useState<string>('All');
  const [previewTheme, setPreviewTheme] = useState<FestivalTheme | null>(null);

  // Filtered list
  const filteredThemes = festivals.filter((fest) => {
    const matchesSearch =
      fest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fest.couponCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (fest.badgeText ? fest.badgeText.toLowerCase().includes(searchQuery.toLowerCase()) : false);

    const matchesStatus = filterStatus === 'All' || fest.status === filterStatus;
    const matchesPreset = filterPreset === 'All' || fest.preset === filterPreset;

    return matchesSearch && matchesStatus && matchesPreset;
  });

  const handleToggleStatus = (fest: FestivalTheme) => {
    if (fest.status === 'Active') {
      deactivateFestival(fest.id);
      showToast(`Festival theme "${fest.name}" deactivated.`, 'info');
    } else {
      activateFestival(fest.id);
      showToast(`✓ "${fest.name}" is now the ACTIVE website theme!`, 'success');
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the festival campaign "${name}"?`)) {
      removeFestival(id);
      showToast(`Campaign "${name}" removed.`, 'info');
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all festival campaigns to system defaults? This will restore standard festive presets.')) {
      resetDefaults();
      showToast('✓ Restored default festival campaigns!', 'success');
    }
  };

  return (
    <AdminLayout
      title="Festival Theme & Campaigns"
      subtitle="Configure festive visual themes, top announcement bars, coupon promotions, and particle effects for the public store."
      onSearch={(q) => setSearchQuery(q)}
      searchValue={searchQuery}
      searchPlaceholder="Search by festival name, coupon, badge..."
    >
      <div className="admin-page-container festival-theme-admin-page">
        {/* KPI Summary Cards */}
        <div className="admin-kpi-grid-4">
          <div className="admin-kpi-card kpi-active-theme">
            <div className="kpi-icon-box" style={{ background: '#fef3c7', color: '#d97706' }}>
              <i className="fa-solid fa-wand-magic-sparkles" />
            </div>
            <div className="kpi-content">
              <span className="kpi-label">Currently Active Theme</span>
              <h3 className="kpi-value text-amber">
                {activeFestival ? activeFestival.name : 'None (Standard Theme)'}
              </h3>
              <span className="kpi-sub">
                {activeFestival ? `Coupon: ${activeFestival.couponCode} (${activeFestival.discountPercentage}% OFF)` : 'Standard site layout active'}
              </span>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="kpi-icon-box" style={{ background: '#f0fdfa', color: '#008080' }}>
              <i className="fa-solid fa-gifts" />
            </div>
            <div className="kpi-content">
              <span className="kpi-label">Total Campaigns</span>
              <h3 className="kpi-value">{festivals.length}</h3>
              <span className="kpi-sub">Preset &amp; custom themes</span>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="kpi-icon-box" style={{ background: '#eff6ff', color: '#2563eb' }}>
              <i className="fa-solid fa-calendar-days" />
            </div>
            <div className="kpi-content">
              <span className="kpi-label">Scheduled Campaigns</span>
              <h3 className="kpi-value">{festivals.filter((f) => f.status === 'Scheduled').length}</h3>
              <span className="kpi-sub">Upcoming season releases</span>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="kpi-icon-box" style={{ background: '#fdf2f8', color: '#db2777' }}>
              <i className="fa-solid fa-percent" />
            </div>
            <div className="kpi-content">
              <span className="kpi-label">Max Discount Available</span>
              <h3 className="kpi-value">
                {Math.max(...festivals.map((f) => f.discountValue ?? f.discountPercentage ?? 0), 0)}% OFF
              </h3>
              <span className="kpi-sub">Highest campaign offer</span>
            </div>
          </div>
        </div>

        {/* Action Header Bar */}
        <div className="admin-card table-control-card">
          <div className="control-left">
            <div className="filter-select-wrap">
              <label>Status:</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="All">All Statuses ({festivals.length})</option>
                <option value="Active">Active</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="filter-select-wrap">
              <label>Preset:</label>
              <select value={filterPreset} onChange={(e) => setFilterPreset(e.target.value)}>
                <option value="All">All Presets</option>
                <option value="diwali">Diwali Dhamaka</option>
                <option value="holi">Holi Colors</option>
                <option value="christmas">Christmas Carnival</option>
                <option value="newyear">New Year Bash</option>
                <option value="independence">Independence Day</option>
                <option value="ganesh_utsav">Ganesh Utsav</option>
                <option value="navratri">Navratri 9-Day</option>
                <option value="eid">Eid Mubarak</option>
                <option value="custom">Custom Fest</option>
              </select>
            </div>
          </div>

          <div className="control-right">
            <button
              type="button"
              className="btn-admin-outline"
              onClick={handleResetDefaults}
              title="Reset to default festive campaign templates"
            >
              <i className="fa-solid fa-rotate-left" /> Reset Defaults
            </button>

            <Link to="/admin/festival-theme/create" className="btn-admin-primary">
              <i className="fa-solid fa-plus" /> Create Festival Theme
            </Link>
          </div>
        </div>

        {/* Festivals List Table */}
        <div className="admin-card table-card">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>Icon</th>
                  <th>Festival Campaign</th>
                  <th>Theme Preset</th>
                  <th>Color Palette</th>
                  <th>Coupon &amp; Discount</th>
                  <th>Validity Dates</th>
                  <th>Announcement &amp; Ribbon</th>
                  <th style={{ textAlign: 'center' }}>Live Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredThemes.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8">
                      <div className="empty-table-state">
                        <i className="fa-solid fa-wand-magic-sparkles text-slate-400 text-3xl mb-2" />
                        <h4 className="text-base font-bold text-slate-700">No Festival Themes Found</h4>
                        <p className="text-sm text-slate-500">
                          Try adjusting your search criteria or create a new festive campaign.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredThemes.map((fest) => {
                    const presetMeta = FESTIVAL_PRESETS[fest.preset] || FESTIVAL_PRESETS.custom;
                    const isActive = fest.status === 'Active';

                    return (
                      <tr key={fest.id} className={isActive ? 'row-active-theme' : ''}>
                        <td>
                          <div
                            className="theme-table-icon"
                            style={{
                              background: fest.primaryColor,
                              color: fest.textColor || '#ffffff',
                            }}
                          >
                            <span>{fest.leftFestivalIcon || fest.leftDecorativeIcon || presetMeta.leftIcon}</span>
                          </div>
                        </td>

                        <td>
                          <div className="fest-name-col">
                            <strong className="fest-title">{fest.name}</strong>
                            <span className="fest-badge-chip">{fest.badgeText}</span>
                            <span className="fest-tagline-sub">{fest.tagline}</span>
                          </div>
                        </td>

                        <td>
                          <span className="preset-pill">
                            <i className={presetMeta.icon} /> {presetMeta.displayName}
                          </span>
                        </td>

                        <td>
                          <div className="color-swatch-box">
                            <span
                              className="swatch-circle"
                              style={{ background: fest.primaryColor }}
                              title={`Primary: ${fest.primaryColor}`}
                            />
                            <span
                              className="swatch-circle"
                              style={{ background: fest.secondaryColor }}
                              title={`Secondary: ${fest.secondaryColor}`}
                            />
                            <span
                              className="swatch-gradient"
                              style={{ background: fest.accentGradient }}
                              title="Accent Gradient"
                            />
                          </div>
                        </td>

                        <td>
                          <div className="coupon-cell">
                            <strong className="coupon-badge">{fest.couponCode}</strong>
                            <span className="discount-tag">
                              {fest.discountType === 'fixed'
                                ? `₹${Number(fest.discountValue ?? fest.discountPercentage ?? 0).toLocaleString()} OFF`
                                : `${fest.discountValue ?? fest.discountPercentage ?? 0}% OFF`}
                            </span>
                            <span className="min-order-hint">
                              Min Cart: ₹{Number(fest.minOrderAmount ?? fest.minCartValue ?? 0).toLocaleString()}
                            </span>
                          </div>
                        </td>

                        <td>
                          <div className="dates-cell">
                            <span>
                              <i className="fa-regular fa-calendar" /> {fest.startDate || fest.validFrom}
                            </span>
                            <span>
                              <i className="fa-solid fa-arrow-right-long" /> {fest.endDate || fest.validTo}
                            </span>
                          </div>
                        </td>

                        <td>
                          <div className="feature-badges-row">
                            <span
                              className={`feature-chip ${fest.topAnnouncementBar?.enabled ? 'enabled' : 'disabled'}`}
                              title="Top Announcement Bar"
                            >
                              <i className="fa-solid fa-bullhorn" /> Top Bar
                            </span>
                            <span
                              className={`feature-chip ${fest.floatingRibbon?.enabled ? 'enabled' : 'disabled'}`}
                              title="Floating Ribbon"
                            >
                              <i className="fa-solid fa-ribbon" /> Badge
                            </span>
                            <span
                              className={`feature-chip ${fest.excludeSaleItems ? 'enabled' : 'disabled'}`}
                              title="Exclude Sale Items"
                            >
                              <i className="fa-solid fa-tag" /> No Sale Items
                            </span>
                          </div>
                        </td>

                        <td style={{ textAlign: 'center' }}>
                          <div className="status-toggle-wrapper">
                            <label className="admin-switch" title={isActive ? 'Click to deactivate' : 'Click to activate as live theme'}>
                              <input
                                type="checkbox"
                                checked={isActive}
                                onChange={() => handleToggleStatus(fest)}
                              />
                              <span className="slider round" />
                            </label>
                            <span className={`status-text-pill ${fest.status.toLowerCase()}`}>
                              {fest.status}
                            </span>
                          </div>
                        </td>

                        <td style={{ textAlign: 'right' }}>
                          <div className="admin-actions-flex">
                            <button
                              type="button"
                              className="btn-action btn-preview"
                              onClick={() => setPreviewTheme(fest)}
                              title="Preview Theme Visuals"
                            >
                              <i className="fa-solid fa-eye" />
                            </button>

                            <Link
                              to={`/admin/festival-theme/edit/${fest.id}`}
                              className="btn-action btn-edit"
                              title="Edit Festival Theme"
                            >
                              <i className="fa-solid fa-pen-to-square" />
                            </Link>

                            <button
                              type="button"
                              className="btn-action btn-delete"
                              onClick={() => handleDelete(fest.id, fest.name)}
                              title="Delete Festival Theme"
                            >
                              <i className="fa-solid fa-trash-can" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-time Theme Preview Modal in Admin */}
        {previewTheme && (
          <div className="admin-modal-backdrop" onClick={() => setPreviewTheme(null)}>
            <div className="admin-modal-card festive-preview-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <span className="admin-badge text-teal">LIVE PREVIEW</span>
                  <h3 className="modal-title">{previewTheme.name}</h3>
                </div>
                <button type="button" className="btn-close" onClick={() => setPreviewTheme(null)}>
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>

              <div className="modal-body preview-body">
                {/* 1. Live Interactive Coupon Voucher Card */}
                <div className="coupon-live-preview-card mb-4">
                  <div className="coupon-card-top">
                    <div className="coupon-promo-box">
                      <i className="fa-solid fa-tag text-amber" />
                      <strong>{previewTheme.couponCode}</strong>
                    </div>
                    <span className="coupon-type-badge">
                      {previewTheme.discountType === 'percentage' ? 'Percentage Discount (%)' : 'Fixed Amount (₹)'}
                    </span>
                  </div>

                  <h4 className="coupon-discount-headline">
                    {previewTheme.discountType === 'fixed'
                      ? `Flat ₹${Number(previewTheme.discountValue ?? previewTheme.discountPercentage ?? 0).toLocaleString()} OFF`
                      : `Flat ${previewTheme.discountValue ?? previewTheme.discountPercentage ?? 0}% OFF`}
                  </h4>

                  <div className="coupon-rules-summary-grid">
                    <div className="rule-pair">
                      <span>Min Cart:</span>
                      <strong>₹{Number(previewTheme.minOrderAmount ?? previewTheme.minCartValue ?? 0).toLocaleString()}</strong>
                    </div>

                    <div className="rule-pair">
                      <span>Max Cap:</span>
                      <strong>
                        {previewTheme.maxDiscountAmount ? `₹${previewTheme.maxDiscountAmount.toLocaleString()}` : 'Unlimited'}
                      </strong>
                    </div>

                    <div className="rule-pair">
                      <span>Valid From:</span>
                      <strong>{previewTheme.startDate || previewTheme.validFrom}</strong>
                    </div>

                    <div className="rule-pair">
                      <span>Valid To:</span>
                      <strong>{previewTheme.endDate || previewTheme.validTo}</strong>
                    </div>

                    <div className="rule-pair">
                      <span>Usage Limit:</span>
                      <strong>{previewTheme.totalUsageLimit ? `${previewTheme.totalUsageLimit} total` : 'Unlimited'}</strong>
                    </div>

                    <div className="rule-pair">
                      <span>Per User:</span>
                      <strong>{previewTheme.perUserLimit || 1} time</strong>
                    </div>

                    <div className="rule-pair" style={{ gridColumn: 'span 2' }}>
                      <span>Categories:</span>
                      <strong>{previewTheme.targetCategories?.join(', ') || 'All Products'}</strong>
                    </div>

                    {previewTheme.excludeSaleItems && (
                      <div className="rule-pair" style={{ gridColumn: 'span 2' }}>
                        <span style={{ color: '#ea580c' }}>✓ Excludes clearance / sale items</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Simulated Top Announcement Bar */}
                <div
                  className="preview-festive-bar mb-3"
                  style={{
                    background: previewTheme.accentGradient || previewTheme.primaryColor,
                    color: previewTheme.textColor || '#ffffff',
                  }}
                >
                  <div className="bar-flex">
                    <span className="left-icon">{previewTheme.leftDecorativeIcon || '🪔'}</span>
                    <span className="badge-pill">{previewTheme.badgeText || 'SPECIAL OFFER'}</span>
                    <span className="msg">{previewTheme.topAnnouncementBar?.message}</span>
                    <span className="coupon-box">CODE: <strong>{previewTheme.couponCode}</strong></span>
                    <span className="btn-mock">{previewTheme.topAnnouncementBar?.buttonText || 'Shop Deals'}</span>
                  </div>
                </div>

                {/* 3. Simulated Floating Badge */}
                <div className="preview-floating-badge-box">
                  <h4>Floating Corner Badge:</h4>
                  <div
                    className="simulated-badge"
                    style={{
                      background: previewTheme.accentGradient || previewTheme.primaryColor,
                      color: '#ffffff',
                    }}
                  >
                    <span className="sim-icon">{previewTheme.leftDecorativeIcon || '🪔'}</span>
                    <div>
                      <strong>{previewTheme.floatingRibbon?.title}</strong>
                      <span>{previewTheme.floatingRibbon?.subtitle}</span>
                    </div>
                    <span className="sim-off">
                      {previewTheme.discountType === 'fixed'
                        ? `-₹${previewTheme.discountValue ?? previewTheme.discountPercentage}`
                        : `-${previewTheme.discountValue ?? previewTheme.discountPercentage}%`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-admin-outline"
                  onClick={() => setPreviewTheme(null)}
                >
                  Close Preview
                </button>
                {previewTheme.status !== 'Active' && (
                  <button
                    type="button"
                    className="btn-admin-primary"
                    onClick={() => {
                      activateFestival(previewTheme.id);
                      setPreviewTheme(null);
                      showToast(`✓ "${previewTheme.name}" activated as the live website theme!`, 'success');
                    }}
                  >
                    <i className="fa-solid fa-wand-magic-sparkles" /> Activate Theme Now
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default FestivalThemeList;
