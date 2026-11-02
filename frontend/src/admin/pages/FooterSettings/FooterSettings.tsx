/**
 * BuyBright Admin — Footer Settings Page.
 * Dedicated configuration page for Storefront Footer description, warehouse address, copyright, and social channels.
 */

import React, { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { Input, Button } from '../../components/Form';
import {
  getPlatformSettings,
  savePlatformSettings,
  FooterSettings as IFooterSettings,
} from '../../data/settingsData';
import { useToast } from '../../../context/ToastContext';

export const FooterSettings: React.FC = () => {
  const { showToast } = useToast();
  const allSettings = getPlatformSettings();
  const [footerConfig, setFooterConfig] = useState<IFooterSettings>(allSettings.footer);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const current = getPlatformSettings();
    savePlatformSettings({
      ...current,
      footer: footerConfig,
    });
    showToast('Storefront footer settings & social profiles updated successfully!', 'success');
  };

  return (
    <AdminLayout
      title="Footer Settings"
      subtitle="Configure storefront footer introduction, fulfillment address, copyright notice, and social media channels"
    >
      <div style={{ maxWidth: '840px' }}>
        <form onSubmit={handleSave}>
          {/* Main Footer Info */}
          <div className="admin-card" style={{ padding: '24px', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', color: '#0f172a', fontWeight: 800 }}>
              <i className="fa-solid fa-table-cells" style={{ color: '#0d9488', marginRight: '8px' }} />
              Footer Content &amp; Contact Details
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                Footer Company Description *
              </label>
              <textarea
                value={footerConfig.footerDescription}
                onChange={(e) => setFooterConfig({ ...footerConfig, footerDescription: e.target.value })}
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
                placeholder="Short brand introduction displayed below footer logo"
                required
              />
            </div>

            <div className="settings-grid-2">
              <Input
                label="Footer Helpline Phone *"
                value={footerConfig.helplinePhone}
                onChange={(e) => setFooterConfig({ ...footerConfig, helplinePhone: e.target.value })}
                placeholder="+91 98201 23456"
                required
              />
              <Input
                label="Footer Support Email *"
                type="email"
                value={footerConfig.supportEmail}
                onChange={(e) => setFooterConfig({ ...footerConfig, supportEmail: e.target.value })}
                placeholder="support@buybright.com"
                required
              />
            </div>

            <Input
              label="Fulfillment &amp; Distribution Center Address *"
              value={footerConfig.warehouseAddress}
              onChange={(e) => setFooterConfig({ ...footerConfig, warehouseAddress: e.target.value })}
              placeholder="Bhiwandi Central Fulfillment Centre, Gala #14-18, Logistics Park, Mumbai"
              required
            />

            <Input
              label="Copyright Notice Line *"
              value={footerConfig.copyrightText}
              onChange={(e) => setFooterConfig({ ...footerConfig, copyrightText: e.target.value })}
              placeholder="© 2026 BuyBright Healthcare Solutions Pvt Ltd. All Rights Reserved."
              required
            />
          </div>

          {/* Social Media Links */}
          <div className="admin-card" style={{ padding: '24px', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', color: '#0f172a', fontWeight: 800 }}>
              <i className="fa-solid fa-share-nodes" style={{ color: '#0d9488', marginRight: '8px' }} />
              Social Media Channels &amp; Outlets
            </h3>

            <div className="settings-grid-2">
              <Input
                label="Facebook URL"
                value={footerConfig.facebookUrl}
                onChange={(e) => setFooterConfig({ ...footerConfig, facebookUrl: e.target.value })}
                placeholder="https://facebook.com/..."
              />
              <Input
                label="Instagram URL"
                value={footerConfig.instagramUrl}
                onChange={(e) => setFooterConfig({ ...footerConfig, instagramUrl: e.target.value })}
                placeholder="https://instagram.com/..."
              />
              <Input
                label="LinkedIn URL"
                value={footerConfig.linkedinUrl}
                onChange={(e) => setFooterConfig({ ...footerConfig, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/..."
              />
              <Input
                label="YouTube URL"
                value={footerConfig.youtubeUrl}
                onChange={(e) => setFooterConfig({ ...footerConfig, youtubeUrl: e.target.value })}
                placeholder="https://youtube.com/..."
              />
            </div>

            <Input
              label="Twitter / X URL"
              value={footerConfig.twitterUrl}
              onChange={(e) => setFooterConfig({ ...footerConfig, twitterUrl: e.target.value })}
              placeholder="https://twitter.com/..."
              style={{ marginBottom: 0 }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button type="submit" variant="primary" size="md" icon="fa-solid fa-floppy-disk">
              Save Footer Settings
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default FooterSettings;
