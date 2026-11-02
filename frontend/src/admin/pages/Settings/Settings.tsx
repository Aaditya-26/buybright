/**
 * BuyBright Admin Settings Page.
 * Configures:
 * 1. General Settings (Website Name, Company Name, Support Email, Support Mobile, GST Number, Time Zone, Currency, Company Address, Website Logo, Favicon)
 * 2. Website Settings (Top Bar Text, First Text with Icon, Second Text with Icon, App Store links, Live Preview)
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { Input, Select, Button } from '../../components/Form';
import {
  getPlatformSettings,
  savePlatformSettings,
  GeneralSettings,
  WebsiteSettings,
} from '../../data/settingsData';
import { useToast } from '../../../context/ToastContext';

type SettingTabType = 'general' | 'website';

export const Settings: React.FC = () => {
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as SettingTabType | null;

  const [activeTab, setActiveTab] = useState<SettingTabType>(
    tabParam && ['general', 'website'].includes(tabParam)
      ? tabParam
      : 'general'
  );

  // Sync tab with URL searchParams if URL changes
  useEffect(() => {
    if (tabParam && ['general', 'website'].includes(tabParam) && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam, activeTab]);

  const handleTabChange = (tab: SettingTabType) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Load Initial Settings
  const initialSettings = getPlatformSettings();

  // Tab 1: General Settings State
  const [generalConfig, setGeneralConfig] = useState<GeneralSettings>(initialSettings.general);

  // Tab 2: Website Settings State (Top Bar)
  const [websiteConfig, setWebsiteConfig] = useState<WebsiteSettings>(initialSettings.website);

  // Timezone options
  const timezoneOptions = [
    { value: 'Asia/Kolkata (IST, GMT+05:30)', label: 'Asia/Kolkata (IST, GMT+05:30) — India Standard Time' },
    { value: 'UTC (GMT+00:00)', label: 'UTC (GMT+00:00) — Coordinated Universal Time' },
    { value: 'America/New_York (EST, GMT-05:00)', label: 'America/New_York (EST, GMT-05:00) — Eastern Time' },
    { value: 'Europe/London (BST/GMT, GMT+01:00)', label: 'Europe/London (BST/GMT, GMT+01:00) — British Summer Time' },
    { value: 'Asia/Dubai (GST, GMT+04:00)', label: 'Asia/Dubai (GST, GMT+04:00) — Gulf Standard Time' },
    { value: 'Asia/Singapore (SGT, GMT+08:00)', label: 'Asia/Singapore (SGT, GMT+08:00) — Singapore Time' },
  ];

  // Currency options
  const currencyOptions = [
    { value: 'INR - ₹ (Indian Rupee)', label: 'INR - ₹ (Indian Rupee)' },
    { value: 'USD - $ (US Dollar)', label: 'USD - $ (US Dollar)' },
    { value: 'EUR - € (Euro)', label: 'EUR - € (Euro)' },
    { value: 'GBP - £ (British Pound)', label: 'GBP - £ (British Pound)' },
    { value: 'AED - د.إ (UAE Dirham)', label: 'AED - د.إ (UAE Dirham)' },
  ];

  // Handle Logo Upload via file reader
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setGeneralConfig((prev) => ({ ...prev, websiteLogo: uploadEvent.target!.result as string }));
          showToast('Website logo image uploaded successfully.', 'info');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Favicon Upload
  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setGeneralConfig((prev) => ({ ...prev, favicon: uploadEvent.target!.result as string }));
          showToast('Favicon uploaded successfully.', 'info');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save General Settings
  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    const current = getPlatformSettings();
    savePlatformSettings({
      ...current,
      general: generalConfig,
      website: websiteConfig,
    });
    showToast('General settings (Company, GST, Timezone, Currency, Logo & Favicon) saved successfully!', 'success');
  };

  // Save Website Settings
  const handleSaveWebsite = (e: React.FormEvent) => {
    e.preventDefault();
    const current = getPlatformSettings();
    savePlatformSettings({
      ...current,
      general: generalConfig,
      website: websiteConfig,
    });
    showToast('Website settings (Top Bar Text, Icons & App Badges) updated successfully!', 'success');
  };

  return (
    <AdminLayout
      title="Settings & Configuration"
      subtitle="Configure platform identity, corporate credentials, and website top bar announcements"
    >
      <div className="admin-settings-layout">
        {/* Navigation Sidebar Tabs */}
        <div className="admin-card admin-settings-nav-card">
          <div className="admin-settings-nav-list">
            {/* Tab 1: General Settings */}
            <button
              type="button"
              onClick={() => handleTabChange('general')}
              className={`admin-settings-nav-item ${activeTab === 'general' ? 'active' : ''}`}
            >
              <i className="fa-solid fa-sliders" style={{ color: activeTab === 'general' ? '#0d9488' : '#64748b' }} />
              <span className="nav-label">General Settings</span>
            </button>

            {/* Tab 2: Website Settings */}
            <button
              type="button"
              onClick={() => handleTabChange('website')}
              className={`admin-settings-nav-item ${activeTab === 'website' ? 'active' : ''}`}
            >
              <i className="fa-solid fa-globe" style={{ color: activeTab === 'website' ? '#0d9488' : '#64748b' }} />
              <span className="nav-label">Website Settings</span>
            </button>

            <div className="admin-settings-nav-divider" />

            {/* Quick Link: Send Notification */}
            <a
              href="/admin/settings/send-notification"
              className="admin-settings-nav-item"
            >
              <i className="fa-solid fa-paper-plane" style={{ color: '#0d9488' }} />
              <span>Send Notification</span>
            </a>

            {/* Quick Link: Notification History */}
            <a
              href="/admin/notifications"
              className="admin-settings-nav-item"
            >
              <i className="fa-solid fa-clock-rotate-left" style={{ color: '#2563eb' }} />
              <span>Notification History</span>
            </a>

            {/* Quick Link: Referral & Points */}
            <a
              href="/admin/settings/referral"
              className="admin-settings-nav-item"
            >
              <i className="fa-solid fa-coins" style={{ color: '#d97706' }} />
              <span>Referral &amp; Points</span>
            </a>

            {/* Quick Link: Shipping Charges */}
            <a
              href="/admin/settings/shipping"
              className="admin-settings-nav-item"
            >
              <i className="fa-solid fa-truck-ramp-box" style={{ color: '#0d9488' }} />
              <span>Shipping Charges</span>
            </a>
          </div>
        </div>

        {/* Content Pane */}
        <div className="admin-settings-content">
          {/* ══════════════════════════════════════════════════════════════════════
              TAB 1: GENERAL SETTINGS
             ══════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'general' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#0f172a', fontWeight: 800 }}>
                    <i className="fa-solid fa-sliders" style={{ color: '#0d9488', marginRight: '8px' }} />
                    General Settings
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b' }}>
                    Configure basic website metadata, company details, GST, timezone, currency, website logo, and favicon.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveGeneral}>
                {/* 1. Website Name & Company Name */}
                <div className="settings-grid-2">
                  <Input
                    label="Website Name *"
                    value={generalConfig.websiteName}
                    onChange={(e) => setGeneralConfig({ ...generalConfig, websiteName: e.target.value })}
                    placeholder="e.g. BuyBright"
                    required
                  />
                  <Input
                    label="Company Name *"
                    value={generalConfig.companyName}
                    onChange={(e) => setGeneralConfig({ ...generalConfig, companyName: e.target.value })}
                    placeholder="e.g. Microlan IT Services Pvt Ltd"
                    required
                  />
                </div>

                {/* 2. Support Email & Support Mobile Number */}
                <div className="settings-grid-2">
                  <Input
                    label="Support Email *"
                    type="email"
                    value={generalConfig.supportEmail}
                    onChange={(e) => setGeneralConfig({ ...generalConfig, supportEmail: e.target.value })}
                    placeholder="support@buybright.com"
                    required
                  />
                  <Input
                    label="Support Mobile Number *"
                    type="tel"
                    value={generalConfig.supportPhone}
                    onChange={(e) => setGeneralConfig({ ...generalConfig, supportPhone: e.target.value })}
                    placeholder="+91 98201 23456"
                    required
                  />
                </div>

                {/* 3. GST Number, Timezone & Currency */}
                <div className="settings-grid-3">
                  <Input
                    label="GST Number *"
                    value={generalConfig.gstNumber}
                    onChange={(e) => setGeneralConfig({ ...generalConfig, gstNumber: e.target.value })}
                    placeholder="27AAECP1234F1Z5"
                    required
                  />
                  <Select
                    label="Time Zone *"
                    value={generalConfig.timezone}
                    onChange={(e) => setGeneralConfig({ ...generalConfig, timezone: e.target.value })}
                    options={timezoneOptions}
                  />
                  <Select
                    label="Currency *"
                    value={generalConfig.currency}
                    onChange={(e) => setGeneralConfig({ ...generalConfig, currency: e.target.value })}
                    options={currencyOptions}
                  />
                </div>

                {/* 4. Company Address */}
                <div style={{ marginBottom: '18px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#334155',
                      marginBottom: '6px',
                    }}
                  >
                    Company Address *
                  </label>
                  <textarea
                    value={generalConfig.companyAddress}
                    onChange={(e) => setGeneralConfig({ ...generalConfig, companyAddress: e.target.value })}
                    rows={3}
                    className="table-search-input"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: '0.88rem',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      outline: 'none',
                      boxSizing: 'border-box',
                      resize: 'vertical',
                    }}
                    placeholder="Registered corporate address for invoices and dispatch manifests"
                    required
                  />
                </div>

                {/* 5. Website Logo & Favicon with Live Preview */}
                <div className="settings-media-grid">
                  {/* Website Logo Box */}
                  <div className="settings-media-box">
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        marginBottom: '4px',
                      }}
                    >
                      <i className="fa-solid fa-image" style={{ color: '#0d9488', marginRight: '6px' }} />
                      Website Logo
                    </label>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block', marginBottom: '12px' }}>
                      Recommended: PNG / SVG with transparent background (Height: 40-50px)
                    </span>

                    <div className="settings-media-preview-row">
                      <div
                        style={{
                          width: '140px',
                          height: '54px',
                          borderRadius: '8px',
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '6px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                        }}
                      >
                        {generalConfig.websiteLogo ? (
                          <img
                            src={generalConfig.websiteLogo}
                            alt="Website Logo Preview"
                            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/logo.png';
                            }}
                          />
                        ) : (
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>No Logo</span>
                        )}
                      </div>

                      <div className="settings-upload-btn-wrap" style={{ flex: 1 }}>
                        <input
                          type="file"
                          id="logoUploadInput"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleLogoUpload}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          icon="fa-solid fa-upload"
                          onClick={() => document.getElementById('logoUploadInput')?.click()}
                        >
                          Upload Logo
                        </Button>
                      </div>
                    </div>

                    <Input
                      label="Or Logo Image URL"
                      value={generalConfig.websiteLogo}
                      onChange={(e) => setGeneralConfig({ ...generalConfig, websiteLogo: e.target.value })}
                      placeholder="/images/logo.png or https://..."
                      style={{ marginBottom: 0, fontSize: '0.8rem', padding: '6px 10px' }}
                    />
                  </div>

                  {/* Favicon Box */}
                  <div className="settings-media-box">
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        marginBottom: '4px',
                      }}
                    >
                      <i className="fa-solid fa-circle-dot" style={{ color: '#0d9488', marginRight: '6px' }} />
                      Website Favicon
                    </label>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block', marginBottom: '12px' }}>
                      Displayed in browser tabs and bookmarks (.ico, .png, 32x32px)
                    </span>

                    <div className="settings-media-preview-row">
                      {/* Browser Tab Mockup */}
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: '#e2e8f0',
                          padding: '6px 12px',
                          borderRadius: '8px 8px 0 0',
                          borderBottom: '2px solid #0d9488',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#334155',
                        }}
                      >
                        {generalConfig.favicon ? (
                          <img
                            src={generalConfig.favicon}
                            alt="Favicon"
                            style={{ width: '18px', height: '18px', objectFit: 'contain' }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/favicon.ico';
                            }}
                          />
                        ) : (
                          <i className="fa-solid fa-tooth" style={{ color: '#0d9488' }} />
                        )}
                        <span>{generalConfig.websiteName || 'BuyBright'}</span>
                      </div>

                      <div className="settings-upload-btn-wrap" style={{ flex: 1 }}>
                        <input
                          type="file"
                          id="faviconUploadInput"
                          accept="image/*,.ico"
                          style={{ display: 'none' }}
                          onChange={handleFaviconUpload}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          icon="fa-solid fa-upload"
                          onClick={() => document.getElementById('faviconUploadInput')?.click()}
                        >
                          Upload Favicon
                        </Button>
                      </div>
                    </div>

                    <Input
                      label="Or Favicon URL"
                      value={generalConfig.favicon}
                      onChange={(e) => setGeneralConfig({ ...generalConfig, favicon: e.target.value })}
                      placeholder="/favicon.ico or https://..."
                      style={{ marginBottom: 0, fontSize: '0.8rem', padding: '6px 10px' }}
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="settings-actions-bar">
                  <Button type="submit" variant="primary" size="md" icon="fa-solid fa-floppy-disk">
                    Save General Settings
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════
              TAB 2: WEBSITE SETTINGS (TOP BAR / TAP BAR TEXT & ICONS)
             ══════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'website' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#0f172a', fontWeight: 800 }}>
                    <i className="fa-solid fa-globe" style={{ color: '#0d9488', marginRight: '8px' }} />
                    Website Settings (Top Bar)
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b' }}>
                    Configure top announcement bar text, first text with icon, second text with icon, and app store links.
                  </p>
                </div>
              </div>

              {/* Real-time Interactive Live Top Bar Preview */}
              <div
                style={{
                  marginBottom: '24px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>
                    <i className="fa-solid fa-eye" style={{ color: '#0d9488', marginRight: '6px' }} />
                    Live Storefront Top Bar Preview
                  </span>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    Updates dynamically across the BuyBright website
                  </span>
                </div>

                {/* Topbar Frame */}
                <div className="settings-topbar-preview-frame">
                  <div className="settings-topbar-left-group">
                    {/* First Text with Icon */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#fef08a' }}>
                      <i className={websiteConfig.firstIcon || 'fa-solid fa-fire'} style={{ color: '#f59e0b', fontSize: '0.95rem' }} />
                      <span style={{ fontWeight: 700 }}>{websiteConfig.firstText || 'Diwali Dhamaka — Flat 20% Off Storewide'}</span>
                    </div>

                    <span className="preview-divider" style={{ color: '#334155' }}>|</span>

                    {/* Second Text with Icon */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#e2e8f0' }}>
                      <i className={websiteConfig.secondIcon || 'fa-solid fa-shield-halved'} style={{ color: '#0d9488', fontSize: '0.95rem' }} />
                      <span style={{ fontWeight: 600 }}>{websiteConfig.secondText || '100% Genuine Certified'}</span>
                    </div>
                  </div>

                  {/* App Download Badges */}
                  {websiteConfig.showAppBadges && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Download App:</span>
                      <span
                        style={{
                          background: '#0f293a',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          color: '#ffffff',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <i className="fa-brands fa-google-play" style={{ color: '#10b981' }} />
                        Play Store
                      </span>
                      <span
                        style={{
                          background: '#0f293a',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          color: '#ffffff',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <i className="fa-brands fa-apple" style={{ color: '#ffffff' }} />
                        App Store
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <form onSubmit={handleSaveWebsite}>
                {/* Toggle Top Bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    background: '#f0fdfa',
                    border: '1px solid #ccfbf1',
                    borderRadius: '8px',
                    marginBottom: '20px',
                  }}
                >
                  <input
                    type="checkbox"
                    id="topbarEnabled"
                    checked={websiteConfig.topbarEnabled}
                    onChange={(e) => setWebsiteConfig({ ...websiteConfig, topbarEnabled: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: '#0d9488', cursor: 'pointer' }}
                  />
                  <label
                    htmlFor="topbarEnabled"
                    style={{ fontSize: '0.86rem', color: '#0f766e', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Enable Top Announcement Bar on Storefront
                  </label>
                </div>

                {/* 1. First Text with Icon */}
                <div
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '16px',
                    marginBottom: '18px',
                    background: '#ffffff',
                  }}
                >
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px 0' }}>
                    <i className="fa-solid fa-1" style={{ background: '#0d9488', color: '#fff', padding: '2px 7px', borderRadius: '4px', fontSize: '0.75rem', marginRight: '8px' }} />
                    First Top Bar Text &amp; Icon
                  </h4>

                  <div className="settings-icon-text-grid">
                    <Input
                      label="First Icon (FontAwesome Class) *"
                      value={websiteConfig.firstIcon}
                      onChange={(e) => setWebsiteConfig({ ...websiteConfig, firstIcon: e.target.value })}
                      placeholder="e.g. fa-solid fa-fire"
                      required
                    />

                    <Input
                      label="First Text (Announcement / Offer) *"
                      value={websiteConfig.firstText}
                      onChange={(e) => setWebsiteConfig({ ...websiteConfig, firstText: e.target.value })}
                      placeholder="e.g. Diwali Dhamaka — Flat 20% Off Storewide"
                      required
                    />
                  </div>
                </div>

                {/* 2. Second Text with Icon */}
                <div
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '16px',
                    marginBottom: '18px',
                    background: '#ffffff',
                  }}
                >
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px 0' }}>
                    <i className="fa-solid fa-2" style={{ background: '#0d9488', color: '#fff', padding: '2px 7px', borderRadius: '4px', fontSize: '0.75rem', marginRight: '8px' }} />
                    Second Top Bar Text &amp; Icon
                  </h4>

                  <div className="settings-icon-text-grid">
                    <Input
                      label="Second Icon (FontAwesome Class) *"
                      value={websiteConfig.secondIcon}
                      onChange={(e) => setWebsiteConfig({ ...websiteConfig, secondIcon: e.target.value })}
                      placeholder="e.g. fa-solid fa-shield-halved"
                      required
                    />

                    <Input
                      label="Second Text (Trust Badge / Shipping) *"
                      value={websiteConfig.secondText}
                      onChange={(e) => setWebsiteConfig({ ...websiteConfig, secondText: e.target.value })}
                      placeholder="e.g. 100% Genuine Certified Dental Supplies"
                      required
                    />
                  </div>
                </div>

                {/* 3. App Store & Play Store Badges */}
                <div
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '16px',
                    marginBottom: '20px',
                    background: '#ffffff',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      <i className="fa-solid fa-mobile-screen" style={{ color: '#0d9488', marginRight: '8px' }} />
                      Mobile App Download Badges
                    </h4>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        id="showAppBadges"
                        checked={websiteConfig.showAppBadges}
                        onChange={(e) => setWebsiteConfig({ ...websiteConfig, showAppBadges: e.target.checked })}
                        style={{ width: '16px', height: '16px', accentColor: '#0d9488', cursor: 'pointer' }}
                      />
                      <label htmlFor="showAppBadges" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
                        Show on Top Bar
                      </label>
                    </div>
                  </div>

                  <div className="settings-grid-2">
                    <Input
                      label="Google Play Store URL"
                      value={websiteConfig.playStoreUrl}
                      onChange={(e) => setWebsiteConfig({ ...websiteConfig, playStoreUrl: e.target.value })}
                      placeholder="https://play.google.com/store/apps/..."
                    />
                    <Input
                      label="Apple App Store URL"
                      value={websiteConfig.appStoreUrl}
                      onChange={(e) => setWebsiteConfig({ ...websiteConfig, appStoreUrl: e.target.value })}
                      placeholder="https://apps.apple.com/app/..."
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="settings-actions-bar">
                  <Button type="submit" variant="primary" size="md" icon="fa-solid fa-floppy-disk">
                    Save Website Settings
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
