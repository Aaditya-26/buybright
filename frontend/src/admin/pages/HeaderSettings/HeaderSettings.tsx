/**
 * BuyBright Admin — Header Settings Page.
 * Dedicated configuration page for Main Navigation Header, Sticky behavior, Search Placeholder & Helpline widget.
 */

import React, { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { Input, Button } from '../../components/Form';
import {
  getPlatformSettings,
  savePlatformSettings,
  HeaderSettings as IHeaderSettings,
} from '../../data/settingsData';
import { useToast } from '../../../context/ToastContext';

export const HeaderSettings: React.FC = () => {
  const { showToast } = useToast();
  const allSettings = getPlatformSettings();
  const [headerConfig, setHeaderConfig] = useState<IHeaderSettings>(allSettings.header);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const current = getPlatformSettings();
    savePlatformSettings({
      ...current,
      header: headerConfig,
    });
    showToast('Storefront header settings updated successfully!', 'success');
  };

  return (
    <AdminLayout
      title="Header Settings"
      subtitle="Configure storefront main navigation, search placeholder, sticky header, and helpline widget"
    >
      <div style={{ maxWidth: '840px' }}>
        <form onSubmit={handleSave}>
          <div className="admin-card" style={{ padding: '24px', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', color: '#0f172a', fontWeight: 800 }}>
              <i className="fa-solid fa-window-maximize" style={{ color: '#0d9488', marginRight: '8px' }} />
              Main Navigation &amp; Search Bar Settings
            </h3>

            {/* Sticky Header Toggle */}
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
                id="stickyHeader"
                checked={headerConfig.stickyHeader}
                onChange={(e) => setHeaderConfig({ ...headerConfig, stickyHeader: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: '#0d9488', cursor: 'pointer' }}
              />
              <label htmlFor="stickyHeader" style={{ fontSize: '0.86rem', color: '#0f766e', fontWeight: 700, cursor: 'pointer' }}>
                Enable Sticky Header (Navigation stays pinned on top when user scrolls down)
              </label>
            </div>

            <Input
              label="Search Bar Placeholder Text *"
              value={headerConfig.searchPlaceholder}
              onChange={(e) => setHeaderConfig({ ...headerConfig, searchPlaceholder: e.target.value })}
              placeholder="e.g. Search 15,000+ Dental Products, Instruments, Restoratives..."
              required
            />

            <Input
              label="Mega Menu Category Dropdown Title *"
              value={headerConfig.megaMenuTitle}
              onChange={(e) => setHeaderConfig({ ...headerConfig, megaMenuTitle: e.target.value })}
              placeholder="e.g. All Categories"
              required
            />
          </div>

          {/* Helpline Widget */}
          <div className="admin-card" style={{ padding: '24px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a', fontWeight: 800 }}>
                <i className="fa-solid fa-headset" style={{ color: '#0d9488', marginRight: '8px' }} />
                Header Customer Helpline Widget
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="showHelpSection"
                  checked={headerConfig.showHelpSection}
                  onChange={(e) => setHeaderConfig({ ...headerConfig, showHelpSection: e.target.checked })}
                  style={{ width: '16px', height: '16px', accentColor: '#0d9488', cursor: 'pointer' }}
                />
                <label htmlFor="showHelpSection" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
                  Show Helpline in Header
                </label>
              </div>
            </div>

            <div className="settings-grid-2">
              <Input
                label="Helpline Phone Number"
                value={headerConfig.helpPhone}
                onChange={(e) => setHeaderConfig({ ...headerConfig, helpPhone: e.target.value })}
                placeholder="+91 98201 23456"
              />
              <Input
                label="Helpline Subtitle / Working Hours"
                value={headerConfig.helpText}
                onChange={(e) => setHeaderConfig({ ...headerConfig, helpText: e.target.value })}
                placeholder="Need Help? Call Us 24/7"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button type="submit" variant="primary" size="md" icon="fa-solid fa-floppy-disk">
              Save Header Settings
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default HeaderSettings;
