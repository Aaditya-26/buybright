/**
 * ContactCustomizer Page.
 * BuyBright Admin Contact Customizer.
 * Refactored using standardized admin design system & reusable CSS classes:
 * - admin-card, admin-modal-form, form-row-2col, form-field-group, form-input-text, form-input-textarea
 * - Fully responsive across mobile, tablet, and desktop screens
 * - Clean tab navigation with horizontal scrolling on smaller viewports
 * - Exact fields matching ContactPage.tsx
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import {
  getContactSettings,
  saveContactSettings,
  resetContactSettings,
} from '../../data/contactData';
import type { ContactCustomizerSettings, HubLocationItem, ContactFaqItem } from '../../types/contact';
import { useToast } from '../../../context/ToastContext';

export const ContactCustomizer: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [settings, setSettings] = useState<ContactCustomizerSettings>(() => getContactSettings());
  const [activeTab, setActiveTab] = useState<'hero' | 'channels' | 'form' | 'concierge' | 'maps' | 'faqs' | 'cta'>('hero');
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Field change handler
  const handleChange = (
    field: keyof ContactCustomizerSettings,
    value: string | HubLocationItem[] | ContactFaqItem[]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Hub location change handler
  const handleHubChange = (
    index: number,
    field: keyof HubLocationItem,
    value: string | boolean
  ) => {
    const updatedHubs = [...settings.hubs];
    updatedHubs[index] = {
      ...updatedHubs[index],
      [field]: value,
    };
    setSettings((prev) => ({
      ...prev,
      hubs: updatedHubs,
    }));
  };

  // Add new Hub location
  const handleAddHub = () => {
    const newHub: HubLocationItem = {
      id: `hub-${Date.now()}`,
      city: '',
      state: '',
      address: '',
      phone: settings.phoneNumber || '+91 88064 88054',
      email: settings.emailAddress || 'support@prestodental.in',
      timing: 'Mon – Sat: 9:00 AM – 7:30 PM',
      tag: 'Express Distribution Depot',
      mapLink: '',
      isPrimary: false,
    };
    setSettings((prev) => ({
      ...prev,
      hubs: [...prev.hubs, newHub],
    }));
    showToast('New fulfillment hub added. Enter city, address, and map link.', 'info');
  };

  // Delete Hub location
  const handleDeleteHub = (index: number) => {
    if (settings.hubs.length <= 1) {
      showToast('At least one fulfillment hub location is required.', 'warning');
      return;
    }
    const updatedHubs = settings.hubs.filter((_, idx) => idx !== index);
    setSettings((prev) => ({
      ...prev,
      hubs: updatedHubs,
    }));
    showToast('Fulfillment hub location removed.', 'warning');
  };

  // Auto-generate Google Maps link for an individual hub
  const handleGenerateHubMapLink = (index: number) => {
    const hub = settings.hubs[index];
    const query = [hub.city, hub.address].filter(Boolean).join(' ');
    if (!query.trim()) {
      showToast('Please enter the Hub City or Address first.', 'warning');
      return;
    }
    const generatedUrl = `https://maps.google.com/?q=${encodeURIComponent(query)}`;
    handleHubChange(index, 'mapLink', generatedUrl);
    showToast('Generated Google Maps link for this hub.', 'success');
  };

  // Auto-generate Google Maps navigation link for headquarters
  const handleGenerateHqMapLink = () => {
    if (!settings.mapAddress.trim()) {
      showToast('Please enter the Headquarters Physical Address first.', 'warning');
      return;
    }
    const generatedUrl = `https://maps.google.com/?q=${encodeURIComponent(settings.mapAddress)}`;
    handleChange('mapExternalUrl', generatedUrl);
    showToast('Generated Google Maps link from HQ physical address.', 'success');
  };

  // FAQ Item Handlers
  const handleFaqChange = (index: number, field: keyof ContactFaqItem, value: string) => {
    const updatedFaqs = [...settings.faqs];
    updatedFaqs[index] = {
      ...updatedFaqs[index],
      [field]: value,
    };
    setSettings((prev) => ({
      ...prev,
      faqs: updatedFaqs,
    }));
  };

  const handleAddFaq = () => {
    const newFaq: ContactFaqItem = {
      id: `faq-${Date.now()}`,
      category: 'delivery',
      question: '',
      answer: '',
    };
    setSettings((prev) => ({
      ...prev,
      faqs: [...prev.faqs, newFaq],
    }));
    showToast('New FAQ added. Enter question and answer.', 'info');
  };

  const handleDeleteFaq = (index: number) => {
    const updatedFaqs = settings.faqs.filter((_, idx) => idx !== index);
    setSettings((prev) => ({
      ...prev,
      faqs: updatedFaqs,
    }));
    showToast('FAQ item deleted.', 'warning');
  };

  // Save Settings
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!settings.heroTitle.trim()) {
      showToast('Hero Title is required.', 'danger');
      setActiveTab('hero');
      return;
    }
    if (!settings.phoneNumber.trim()) {
      showToast('Phone Helpline number is required.', 'danger');
      setActiveTab('channels');
      return;
    }
    if (!settings.emailAddress.trim()) {
      showToast('Support Email address is required.', 'danger');
      setActiveTab('channels');
      return;
    }

    saveContactSettings(settings);
    showToast('Contact Page settings saved and published to website!', 'success');
  };

  // Reset to Defaults
  const handleReset = () => {
    const defaults = resetContactSettings();
    setSettings(defaults);
    setIsResetConfirmOpen(false);
    showToast('Restored default website contact settings.', 'info');
  };

  // Shared card section style matching HomeBannerForm & AboutHeroForm
  const sectionCardStyle: React.CSSProperties = {
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '22px',
    marginBottom: '22px',
    background: '#ffffff',
  };

  const sectionHeaderStyle: React.CSSProperties = {
    borderBottom: '1px solid #f1f5f9',
    paddingBottom: '14px',
    marginBottom: '20px',
  };

  return (
    <AdminLayout
      title="Contact Customizer"
      subtitle="Customize communication channels, concierge features, logistics hubs, FAQs, and bottom CTA strip"
    >
      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Top Action Control Bar */}
        <div className="customizer-top-actions">
          <div className="action-group-left">
            <button
              type="button"
              className="btn-admin-secondary"
              onClick={() => navigate('/admin/contact/enquiries')}
            >
              <i className="fa-solid fa-list-check" />
              <span>View Enquiries List</span>
            </button>

            <a
              href="/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-admin-secondary"
              title="Open public website contact page in new tab"
            >
              <i className="fa-solid fa-arrow-up-right-from-square" style={{ color: '#0d9488' }} />
              <span>Preview Live Page</span>
            </a>
          </div>

          <div className="action-group-right">
            <button
              type="button"
              className="btn-admin-outline"
              onClick={() => setIsResetConfirmOpen(true)}
              style={{ color: '#64748b' }}
            >
              <i className="fa-solid fa-arrow-rotate-left" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="button"
              className="btn-admin-primary"
              onClick={handleSave}
            >
              <i className="fa-solid fa-floppy-disk" />
              <span>Save &amp; Publish</span>
            </button>
          </div>
        </div>

        {/* Responsive Section Navigation Tabs Bar */}
        <div className="admin-card customizer-tabs-container">
          <div className="customizer-tabs-scroll">
            <button
              type="button"
              className={`customizer-tab-btn ${activeTab === 'hero' ? 'active' : ''}`}
              onClick={() => setActiveTab('hero')}
            >
              <i className="fa-solid fa-bullhorn" />
              <span>1. Hero Section</span>
            </button>

            <button
              type="button"
              className={`customizer-tab-btn ${activeTab === 'channels' ? 'active' : ''}`}
              onClick={() => setActiveTab('channels')}
            >
              <i className="fa-solid fa-headset" />
              <span>2. 4 Fast-Action Cards</span>
            </button>

            <button
              type="button"
              className={`customizer-tab-btn ${activeTab === 'form' ? 'active' : ''}`}
              onClick={() => setActiveTab('form')}
            >
              <i className="fa-solid fa-paper-plane" />
              <span>3. Form Suite</span>
            </button>

            <button
              type="button"
              className={`customizer-tab-btn ${activeTab === 'concierge' ? 'active' : ''}`}
              onClick={() => setActiveTab('concierge')}
            >
              <i className="fa-solid fa-truck-fast" />
              <span>4. Concierge &amp; Hubs</span>
            </button>

            <button
              type="button"
              className={`customizer-tab-btn ${activeTab === 'maps' ? 'active' : ''}`}
              onClick={() => setActiveTab('maps')}
            >
              <i className="fa-solid fa-map-location-dot" />
              <span>5. Google Map &amp; Links</span>
            </button>

            <button
              type="button"
              className={`customizer-tab-btn ${activeTab === 'faqs' ? 'active' : ''}`}
              onClick={() => setActiveTab('faqs')}
            >
              <i className="fa-solid fa-circle-question" />
              <span>6. FAQs ({settings.faqs.length})</span>
            </button>

            <button
              type="button"
              className={`customizer-tab-btn ${activeTab === 'cta' ? 'active' : ''}`}
              onClick={() => setActiveTab('cta')}
            >
              <i className="fa-brands fa-whatsapp" />
              <span>7. Bottom CTA Strip</span>
            </button>
          </div>
        </div>

        {/* Tab Form Content */}
        <form onSubmit={handleSave} className="admin-modal-form">
          {/* ================================================= */}
          {/* TAB 1: HERO SECTION */}
          {/* ================================================= */}
          {activeTab === 'hero' && (
            <div className="admin-card customizer-content-card">
              <div style={sectionHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="section-icon-badge teal">
                    <i className="fa-solid fa-bullhorn" />
                  </div>
                  <div>
                    <h3 className="section-title">Section 1: Hero Header &amp; Live Status</h3>
                    <p className="section-subtitle">
                      Configure the top live concierge badge, headline, and value proposition description.
                    </p>
                  </div>
                </div>
              </div>

              <div style={sectionCardStyle}>
                <div className="form-field-group">
                  <label htmlFor="heroBadge">
                    Hero Live Status Badge <span className="required-star">*</span>
                  </label>
                  <input
                    id="heroBadge"
                    type="text"
                    className="form-input-text"
                    value={settings.heroBadge}
                    onChange={(e) => handleChange('heroBadge', e.target.value)}
                    placeholder="e.g. PRESTODENTAL DENTAL CONCIERGE • RESPONSE TIME < 15 MINS"
                    required
                  />
                  <span className="form-field-hint">
                    Displayed inside the live pulsing green pill at the top of the contact page.
                  </span>
                </div>

                <div className="form-field-group">
                  <label htmlFor="heroTitle">
                    Main Hero Title <span className="required-star">*</span>
                  </label>
                  <input
                    id="heroTitle"
                    type="text"
                    className="form-input-text"
                    value={settings.heroTitle}
                    onChange={(e) => handleChange('heroTitle', e.target.value)}
                    placeholder="e.g. We're Here to Power Your Dental Practice with Genuine Supplies & Expert Support"
                    required
                  />
                  <span className="form-field-hint">Primary headline greeting visitors on the contact page.</span>
                </div>

                <div className="form-field-group">
                  <label htmlFor="heroSubtitle">
                    Hero Lead Description <span className="required-star">*</span>
                  </label>
                  <textarea
                    id="heroSubtitle"
                    className="form-input-textarea"
                    rows={4}
                    value={settings.heroSubtitle}
                    onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                    placeholder="Direct access for hospital bulk quotes, batch quality certifications..."
                    required
                  />
                  <span className="form-field-hint">Comprehensive subtitle outlining support desk capabilities.</span>
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="customizer-preview-box">
                <span className="preview-label">Live Preview: Hero Banner Header</span>
                <div className="preview-pill">
                  <span className="preview-pulse" />
                  <span>{settings.heroBadge}</span>
                </div>
                <h4 className="preview-title">{settings.heroTitle}</h4>
                <p className="preview-text">{settings.heroSubtitle}</p>
              </div>

              <div className="form-navigation-row end">
                <button
                  type="button"
                  className="btn-admin-primary"
                  onClick={() => setActiveTab('channels')}
                >
                  <span>Next: 4 Fast-Action Cards</span>
                  <i className="fa-solid fa-arrow-right" />
                </button>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* TAB 2: THE 4 FAST-ACTION HERO CARDS */}
          {/* ================================================= */}
          {activeTab === 'channels' && (
            <div className="admin-card customizer-content-card">
              <div style={sectionHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="section-icon-badge blue">
                    <i className="fa-solid fa-headset" />
                  </div>
                  <div>
                    <h3 className="section-title">Section 2: The 4 Fast-Action Hero Cards</h3>
                    <p className="section-subtitle">
                      Configure the 4 contact channel cards shown in the hero grid right below the title.
                    </p>
                  </div>
                </div>
              </div>

              {/* Responsive 2-Column Grid */}
              <div className="customizer-cards-grid">
                {/* Card 1: Phone */}
                <div style={sectionCardStyle}>
                  <div className="card-item-header">
                    <i className="fa-solid fa-phone-volume" style={{ color: '#0d9488' }} />
                    <strong>Card 1: Direct Doctor Helpline</strong>
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="phoneTag">Channel Tag</label>
                    <input
                      id="phoneTag"
                      type="text"
                      className="form-input-text"
                      value={settings.phoneTag}
                      onChange={(e) => handleChange('phoneTag', e.target.value)}
                      placeholder="e.g. Direct Doctor Helpline"
                    />
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="phoneNumber">
                      Phone Helpline Number <span className="required-star">*</span>
                    </label>
                    <input
                      id="phoneNumber"
                      type="text"
                      className="form-input-text"
                      value={settings.phoneNumber}
                      onChange={(e) => handleChange('phoneNumber', e.target.value)}
                      placeholder="e.g. +91 88064 88054"
                      required
                    />
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="phoneTiming">Available Timings</label>
                    <input
                      id="phoneTiming"
                      type="text"
                      className="form-input-text"
                      value={settings.phoneTiming}
                      onChange={(e) => handleChange('phoneTiming', e.target.value)}
                      placeholder="e.g. Mon – Sat: 8:30 AM – 8:00 PM"
                    />
                  </div>
                </div>

                {/* Card 2: WhatsApp (Clean channel without prefilled text) */}
                <div style={sectionCardStyle}>
                  <div className="card-item-header">
                    <i className="fa-brands fa-whatsapp" style={{ color: '#16a34a' }} />
                    <strong>Card 2: Instant WhatsApp Desk</strong>
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="whatsappTag">Channel Tag</label>
                    <input
                      id="whatsappTag"
                      type="text"
                      className="form-input-text"
                      value={settings.whatsappTag}
                      onChange={(e) => handleChange('whatsappTag', e.target.value)}
                      placeholder="e.g. Instant WhatsApp Desk"
                    />
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="whatsappNumber">
                      WhatsApp Number <span className="required-star">*</span>
                    </label>
                    <input
                      id="whatsappNumber"
                      type="text"
                      className="form-input-text"
                      value={settings.whatsappNumber}
                      onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                      placeholder="e.g. +91 88064 88054"
                      required
                    />
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="whatsappTiming">Response Time Subtitle</label>
                    <input
                      id="whatsappTiming"
                      type="text"
                      className="form-input-text"
                      value={settings.whatsappTiming}
                      onChange={(e) => handleChange('whatsappTiming', e.target.value)}
                      placeholder="e.g. Instant replies in < 5 mins"
                    />
                  </div>
                </div>

                {/* Card 3: Email */}
                <div style={sectionCardStyle}>
                  <div className="card-item-header">
                    <i className="fa-solid fa-envelope-open-text" style={{ color: '#0284c7' }} />
                    <strong>Card 3: Official Support Email</strong>
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="emailTag">Channel Tag</label>
                    <input
                      id="emailTag"
                      type="text"
                      className="form-input-text"
                      value={settings.emailTag}
                      onChange={(e) => handleChange('emailTag', e.target.value)}
                      placeholder="e.g. Official Inquiries & Orders"
                    />
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="emailAddress">
                      Email Address <span className="required-star">*</span>
                    </label>
                    <input
                      id="emailAddress"
                      type="email"
                      className="form-input-text"
                      value={settings.emailAddress}
                      onChange={(e) => handleChange('emailAddress', e.target.value)}
                      placeholder="e.g. support@prestodental.in"
                      required
                    />
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="emailTiming">Timing / Description</label>
                    <input
                      id="emailTiming"
                      type="text"
                      className="form-input-text"
                      value={settings.emailTiming}
                      onChange={(e) => handleChange('emailTiming', e.target.value)}
                      placeholder="e.g. GST Billing & Institutional RFQs"
                    />
                  </div>
                </div>

                {/* Card 4: Fulfillment Hubs */}
                <div style={sectionCardStyle}>
                  <div className="card-item-header">
                    <i className="fa-solid fa-hospital" style={{ color: '#f59e0b' }} />
                    <strong>Card 4: Fulfillment Hubs Network</strong>
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="hubsTag">Channel Tag</label>
                    <input
                      id="hubsTag"
                      type="text"
                      className="form-input-text"
                      value={settings.hubsTag}
                      onChange={(e) => handleChange('hubsTag', e.target.value)}
                      placeholder="e.g. Fulfillment Network"
                    />
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="hubsTitle">Hubs Title</label>
                    <input
                      id="hubsTitle"
                      type="text"
                      className="form-input-text"
                      value={settings.hubsTitle}
                      onChange={(e) => handleChange('hubsTitle', e.target.value)}
                      placeholder="e.g. Mumbai & Pune Hubs"
                    />
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="hubsTiming">Dispatch Note</label>
                    <input
                      id="hubsTiming"
                      type="text"
                      className="form-input-text"
                      value={settings.hubsTiming}
                      onChange={(e) => handleChange('hubsTiming', e.target.value)}
                      placeholder="e.g.   Dispatches Pan-India"
                    />
                  </div>
                </div>
              </div>

              <div className="form-navigation-row between">
                <button
                  type="button"
                  className="btn-admin-secondary"
                  onClick={() => setActiveTab('hero')}
                >
                  <i className="fa-solid fa-arrow-left" />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  className="btn-admin-primary"
                  onClick={() => setActiveTab('form')}
                >
                  <span>Next: Form Suite</span>
                  <i className="fa-solid fa-arrow-right" />
                </button>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* TAB 3: INQUIRY FORM SUITE */}
          {/* ================================================= */}
          {activeTab === 'form' && (
            <div className="admin-card customizer-content-card">
              <div style={sectionHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="section-icon-badge purple">
                    <i className="fa-solid fa-paper-plane" />
                  </div>
                  <div>
                    <h3 className="section-title">Section 3: Inquiry Form Card Headers</h3>
                    <p className="section-subtitle">
                      Configure the header pill, title, and instructions shown above the website form.
                    </p>
                  </div>
                </div>
              </div>

              <div style={sectionCardStyle}>
                <div className="form-row-2col">
                  <div className="form-field-group">
                    <label htmlFor="formPill">Form Header Pill</label>
                    <input
                      id="formPill"
                      type="text"
                      className="form-input-text"
                      value={settings.formPill}
                      onChange={(e) => handleChange('formPill', e.target.value)}
                      placeholder="e.g. DIRECT INQUIRY"
                    />
                    <span className="form-field-hint">Tag shown in the header pill above the form title.</span>
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="formTitle">
                      Form Heading Title <span className="required-star">*</span>
                    </label>
                    <input
                      id="formTitle"
                      type="text"
                      className="form-input-text"
                      value={settings.formTitle}
                      onChange={(e) => handleChange('formTitle', e.target.value)}
                      placeholder="e.g. Send Us an Inquiry"
                      required
                    />
                    <span className="form-field-hint">Primary heading on the contact form card.</span>
                  </div>
                </div>

                <div className="form-field-group">
                  <label htmlFor="formSubtitle">Form Subtitle / Instructions</label>
                  <textarea
                    id="formSubtitle"
                    className="form-input-textarea"
                    rows={3}
                    value={settings.formSubtitle}
                    onChange={(e) => handleChange('formSubtitle', e.target.value)}
                    placeholder="Fill in the details below. Our dental supply team will respond with product pricing, batch details, and delivery timelines."
                  />
                  <span className="form-field-hint">Instructional copy under the form title.</span>
                </div>
              </div>

              <div className="form-navigation-row between">
                <button
                  type="button"
                  className="btn-admin-secondary"
                  onClick={() => setActiveTab('channels')}
                >
                  <i className="fa-solid fa-arrow-left" />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  className="btn-admin-primary"
                  onClick={() => setActiveTab('concierge')}
                >
                  <span>Next: Concierge &amp; Hubs</span>
                  <i className="fa-solid fa-arrow-right" />
                </button>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* TAB 4: SIDEBAR CONCIERGE & HUBS */}
          {/* ================================================= */}
          {activeTab === 'concierge' && (
            <div className="admin-card customizer-content-card">
              <div style={sectionHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="section-icon-badge amber">
                    <i className="fa-solid fa-map-location-dot" />
                  </div>
                  <div>
                    <h3 className="section-title">Section 4: Sidebar Concierge Card &amp; Hub Locations</h3>
                    <p className="section-subtitle">
                      Configure the right sidebar WhatsApp card with 3 features, logistics depot city details, and map links.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sidebar Fast-Track WhatsApp Concierge with the 3 Feature Fields */}
              <div style={sectionCardStyle}>
                <div className="card-item-header">
                  <i className="fa-brands fa-whatsapp" style={{ color: '#16a34a' }} />
                  <strong>Right Sidebar Fast-Track Concierge Card</strong>
                </div>

                <div className="form-row-2col">
                  <div className="form-field-group">
                    <label htmlFor="conciergeBadge">Concierge Badge</label>
                    <input
                      id="conciergeBadge"
                      type="text"
                      className="form-input-text"
                      value={settings.conciergeBadge}
                      onChange={(e) => handleChange('conciergeBadge', e.target.value)}
                      placeholder="e.g. FAST-TRACK WHATSAPP DESK"
                    />
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="conciergeTitle">Concierge Heading</label>
                    <input
                      id="conciergeTitle"
                      type="text"
                      className="form-input-text"
                      value={settings.conciergeTitle}
                      onChange={(e) => handleChange('conciergeTitle', e.target.value)}
                      placeholder="e.g. Need Instant Stock Availability or Batch Photos?"
                    />
                  </div>
                </div>

                <div className="form-field-group">
                  <label htmlFor="conciergeDescription">Concierge Description</label>
                  <textarea
                    id="conciergeDescription"
                    className="form-input-textarea"
                    rows={3}
                    value={settings.conciergeDescription}
                    onChange={(e) => handleChange('conciergeDescription', e.target.value)}
                  />
                </div>

                {/* The 3 Feature Fields */}
                <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '16px', marginTop: '16px' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>
                    Concierge Checklist: The 3 Feature Fields
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="conciergeFeature1">
                      <i className="fa-solid fa-circle-check" style={{ color: '#0d9488', marginRight: '6px' }} />
                      Feature 1: Photo / Expiry Verification
                    </label>
                    <input
                      id="conciergeFeature1"
                      type="text"
                      className="form-input-text"
                      value={settings.conciergeFeature1}
                      onChange={(e) => handleChange('conciergeFeature1', e.target.value)}
                      placeholder="e.g. Real-time photo of batch manufacturing date & expiry"
                    />
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="conciergeFeature2">
                      <i className="fa-solid fa-circle-check" style={{ color: '#0d9488', marginRight: '6px' }} />
                      Feature 2: Invoice / Quote Generation
                    </label>
                    <input
                      id="conciergeFeature2"
                      type="text"
                      className="form-input-text"
                      value={settings.conciergeFeature2}
                      onChange={(e) => handleChange('conciergeFeature2', e.target.value)}
                      placeholder="e.g. Instant Proforma Invoice (PI) generation foraccounting"
                    />
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="conciergeFeature3">
                      <i className="fa-solid fa-circle-check" style={{ color: '#0d9488', marginRight: '6px' }} />
                      Feature 3: Live GPS Tracking
                    </label>
                    <input
                      id="conciergeFeature3"
                      type="text"
                      className="form-input-text"
                      value={settings.conciergeFeature3}
                      onChange={(e) => handleChange('conciergeFeature3', e.target.value)}
                      placeholder="e.g. Live GPS air tracking link on dispatch"
                    />
                  </div>
                </div>
              </div>

              {/* Nationwide Fulfillment & Cold-Chain Hubs */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <strong style={{ fontSize: '1.05rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fa-solid fa-truck-fast text-teal" />
                    <span>Nationwide Fulfillment &amp; Cold-Chain Hubs</span>
                  </strong>
                  <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                    Manage depot badges, city names, full address, phone, timings, and direct Google Maps navigation links matching the website right sidebar card.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-admin-primary"
                  onClick={handleAddHub}
                  style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                >
                  <i className="fa-solid fa-plus" />
                  <span>Add Fulfillment Hub</span>
                </button>
              </div>

              {/* Hubs Sidebar Card Header Title Field */}
              <div style={{ ...sectionCardStyle, marginBottom: '20px' }}>
                <div className="form-field-group">
                  <label htmlFor="hubsCardTitle">
                    <i className="fa-solid fa-heading" style={{ color: '#0d9488', marginRight: '6px' }} />
                    Hubs Sidebar Card Title <span className="required-star">*</span>
                  </label>
                  <input
                    id="hubsCardTitle"
                    type="text"
                    className="form-input-text"
                    value={settings.hubsCardTitle || 'Nationwide Fulfillment & Cold-Chain Hubs'}
                    onChange={(e) => handleChange('hubsCardTitle', e.target.value)}
                    placeholder="e.g. Nationwide Fulfillment & Cold-Chain Hubs"
                  />
                  <span className="form-field-hint">
                    Heading displayed at the top of the right sidebar fulfillment hubs card on the website.
                  </span>
                </div>
              </div>

              {/* Hubs List Editors */}
              {settings.hubs.map((hub, idx) => (
                <div key={hub.id} style={{ ...sectionCardStyle, marginBottom: '20px', borderLeft: hub.isPrimary ? '4px solid #0d9488' : '1px solid #e2e8f0' }}>
                  <div className="hub-card-top-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9', marginBottom: '16px' }}>
                    <div className="hub-title-wrap" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="hub-counter" style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#0d9488', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700 }}>
                        {idx + 1}
                      </span>
                      <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>
                        Hub #{idx + 1}: {hub.city || 'Unnamed Hub'}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', cursor: 'pointer', background: hub.isPrimary ? '#ecfdf5' : '#f8fafc', color: hub.isPrimary ? '#047857' : '#64748b', padding: '4px 10px', borderRadius: '12px', border: hub.isPrimary ? '1px solid #a7f3d0' : '1px solid #e2e8f0', fontWeight: 600, userSelect: 'none' }}>
                        <input
                          type="checkbox"
                          checked={Boolean(hub.isPrimary)}
                          onChange={(e) => handleHubChange(idx, 'isPrimary', e.target.checked)}
                          style={{ accentColor: '#0d9488', cursor: 'pointer' }}
                        />
                        <span>Primary HQ Depot</span>
                      </label>

                      {settings.hubs.length > 1 && (
                        <button
                          type="button"
                          className="btn-icon-action danger"
                          onClick={() => handleDeleteHub(idx)}
                          title="Delete this hub"
                          style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                        >
                          <i className="fa-solid fa-trash-can" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Row 1: Depot Badge / Tag & Hub City Name (Matches Website Top Row) */}
                  <div className="form-row-2col">
                    <div className="form-field-group">
                      <label>
                        Depot Badge / Tag <span className="required-star">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-input-text"
                        value={hub.tag}
                        onChange={(e) => handleHubChange(idx, 'tag', e.target.value)}
                        placeholder="e.g. Primary Cold-Chain Depot"
                      />
                      <span className="form-field-hint">
                        Displayed as the teal badge in the top row on the website card.
                      </span>
                    </div>

                    <div className="form-field-group">
                      <label>
                        Hub / City Name <span className="required-star">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-input-text"
                        value={hub.city}
                        onChange={(e) => handleHubChange(idx, 'city', e.target.value)}
                        placeholder="e.g. Mumbai Central Logistics Hub"
                      />
                      <span className="form-field-hint">
                        Displayed next to the badge in the top row on the website card.
                      </span>
                    </div>
                  </div>

                  {/* Row 2: Full Street Address (Matches Website Address Row) */}
                  <div className="form-field-group" style={{ marginTop: '12px' }}>
                    <label>
                      Full Street Address <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input-text"
                      value={hub.address}
                      onChange={(e) => handleHubChange(idx, 'address', e.target.value)}
                      placeholder="e.g. Unit 402, Presto Heights, MIDC Central Road, Andheri East, Mumbai 400069"
                    />
                    <span className="form-field-hint">
                      Displayed with the location pin icon on the website card.
                    </span>
                  </div>

                  {/* Row 3: Google Maps Location Link Field */}
                  <div className="hub-map-link-box" style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', margin: '14px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                      <label style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '0.84rem', color: '#1e293b' }}>
                        <i className="fa-solid fa-location-arrow" style={{ color: '#0d9488' }} />
                        <span>Direct Google Maps Directions Link for this Hub</span>
                      </label>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          type="button"
                          className="btn-admin-outline"
                          onClick={() => handleGenerateHubMapLink(idx)}
                          style={{ fontSize: '0.74rem', padding: '3px 8px' }}
                          title="Generate link automatically from city and address"
                        >
                          <i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#0d9488' }} />
                          <span>Auto-Generate</span>
                        </button>
                        {hub.mapLink && (
                          <a
                            href={hub.mapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-admin-secondary"
                            style={{ fontSize: '0.74rem', padding: '3px 8px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            title="Test this map link in Google Maps"
                          >
                            <i className="fa-solid fa-arrow-up-right-from-square" style={{ color: '#0d9488' }} />
                            <span>Test Link</span>
                          </a>
                        )}
                      </div>
                    </div>
                    <input
                      type="url"
                      className="form-input-text"
                      value={hub.mapLink || ''}
                      onChange={(e) => handleHubChange(idx, 'mapLink', e.target.value)}
                      placeholder="https://maps.google.com/?q=..."
                    />
                    <span className="form-field-hint">
                      When customers click on this hub address on the website, it directly opens this Google Maps directions link in a new tab.
                    </span>
                  </div>

                  {/* Row 4: Phone & Timings (Matches Website Contact Row) */}
                  <div className="form-row-2col">
                    <div className="form-field-group">
                      <label>
                        Contact Phone Number <span className="required-star">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-input-text"
                        value={hub.phone}
                        onChange={(e) => handleHubChange(idx, 'phone', e.target.value)}
                        placeholder="e.g. +91 88064 88054"
                      />
                      <span className="form-field-hint">
                        Displayed with the phone icon in the hub contact row.
                      </span>
                    </div>

                    <div className="form-field-group">
                      <label>
                        Operating Timings <span className="required-star">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-input-text"
                        value={hub.timing}
                        onChange={(e) => handleHubChange(idx, 'timing', e.target.value)}
                        placeholder="e.g. Mon – Sat: 8:30 AM – 8:00 PM"
                      />
                      <span className="form-field-hint">
                        Displayed with the clock icon in the hub contact row.
                      </span>
                    </div>
                  </div>

                  {/* Additional / Internal Reference Fields (State & Email) */}
                  <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed #e2e8f0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="form-field-group">
                        <label style={{ fontSize: '0.78rem', color: '#64748b' }}>State (Additional Reference)</label>
                        <input
                          type="text"
                          className="form-input-text"
                          value={hub.state}
                          onChange={(e) => handleHubChange(idx, 'state', e.target.value)}
                          placeholder="e.g. Maharashtra"
                          style={{ padding: '6px 10px', fontSize: '0.82rem' }}
                        />
                      </div>
                      <div className="form-field-group">
                        <label style={{ fontSize: '0.78rem', color: '#64748b' }}>Hub Internal Email (Optional)</label>
                        <input
                          type="email"
                          className="form-input-text"
                          value={hub.email}
                          onChange={(e) => handleHubChange(idx, 'email', e.target.value)}
                          placeholder="e.g. mumbai.hub@prestodental.in"
                          style={{ padding: '6px 10px', fontSize: '0.82rem' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Live Website Card Preview Component */}
              <div style={{ marginTop: '28px', background: '#f8fafc', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fa-solid fa-eye" style={{ color: '#0d9488', fontSize: '1rem' }} />
                    <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>Live Website Card Preview (Right Sidebar)</strong>
                  </div>
                  <span style={{ fontSize: '0.75rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 10px', borderRadius: '12px', fontWeight: 600 }}>
                    Matches ContactPage.tsx Component
                  </span>
                </div>

                <div style={{ maxWidth: '440px', margin: '0 auto', background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '22px 20px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                    <i className="fa-solid fa-truck-fast" style={{ color: '#0d9488', fontSize: '17px' }} />
                    <h4 style={{ margin: 0, fontSize: '14.5px', fontWeight: 800, color: '#0f172a' }}>
                      {settings.hubsCardTitle || 'Nationwide Fulfillment & Cold-Chain Hubs'}
                    </h4>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {settings.hubs.map((hub, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: hub.isPrimary ? 'rgba(13, 148, 136, 0.03)' : '#f8fafc',
                          border: hub.isPrimary ? '1px solid rgba(13, 148, 136, 0.35)' : '1px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '12px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                          <span style={{ fontSize: '10px', fontWeight: 800, background: 'rgba(13, 148, 136, 0.1)', color: '#0d9488', padding: '2px 7px', borderRadius: '4px', textTransform: 'uppercase' }}>
                            {hub.tag || 'DEPOT'}
                          </span>
                          <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#0f172a' }}>
                            {hub.city || 'Hub City Name'}
                          </span>
                        </div>

                        <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                          <i className="fa-solid fa-location-dot" style={{ color: '#0d9488', marginTop: '3px', flexShrink: 0 }} />
                          <span>{hub.address || 'Street address not configured'}</span>
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px', fontSize: '11.5px', color: '#64748b', fontWeight: 600, marginTop: '2px', paddingTop: '6px', borderTop: '1px solid #e2e8f0' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                            <i className="fa-solid fa-phone" style={{ color: '#0d9488' }} /> {hub.phone || '+91 88064 88054'}
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                            <i className="fa-solid fa-clock" style={{ color: '#0d9488' }} /> {hub.timing || 'Operating Timings'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-navigation-row between">
                <button
                  type="button"
                  className="btn-admin-secondary"
                  onClick={() => setActiveTab('form')}
                >
                  <i className="fa-solid fa-arrow-left" />
                  <span>Previous: Form Suite</span>
                </button>

                <button
                  type="button"
                  className="btn-admin-primary"
                  onClick={() => setActiveTab('maps')}
                >
                  <span>Next: Google Map &amp; Links</span>
                  <i className="fa-solid fa-arrow-right" />
                </button>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* TAB 5: GOOGLE MAP & LOCATION LINKS */}
          {/* ================================================= */}
          {activeTab === 'maps' && (
            <div className="admin-card customizer-content-card">
              <div style={sectionHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="section-icon-badge teal">
                    <i className="fa-solid fa-map-location-dot" />
                  </div>
                  <div>
                    <h3 className="section-title">Section 5: Interactive Google Map &amp; Location Links</h3>
                    <p className="section-subtitle">
                      Configure headquarters map location, direct Google Maps navigation button link, and interactive embedded map iframe.
                    </p>
                  </div>
                </div>
              </div>

              {/* Headquarters Map Section & Navigation URL */}
              <div style={sectionCardStyle}>
                <div className="card-item-header">
                  <i className="fa-solid fa-location-dot" style={{ color: '#0d9488' }} />
                  <strong>Headquarters Map Section Details &amp; Navigation Link</strong>
                </div>

                <div className="form-row-2col">
                  <div className="form-field-group">
                    <label htmlFor="mapBadge">Map Section Tag Badge</label>
                    <input
                      id="mapBadge"
                      type="text"
                      className="form-input-text"
                      value={settings.mapBadge || 'PRIMARY FULFILLMENT HEADQUARTERS'}
                      onChange={(e) => handleChange('mapBadge', e.target.value)}
                      placeholder="e.g. PRIMARY FULFILLMENT HEADQUARTERS"
                    />
                    <span className="form-field-hint">Pill tag shown above the headquarters map headline.</span>
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="mapHeading">
                      Map Section Heading Title <span className="required-star">*</span>
                    </label>
                    <input
                      id="mapHeading"
                      type="text"
                      className="form-input-text"
                      value={settings.mapHeading}
                      onChange={(e) => handleChange('mapHeading', e.target.value)}
                      placeholder="e.g. Visit BuyBright Western Hub or Schedule Operatory Demo"
                      required
                    />
                    <span className="form-field-hint">Primary heading displayed above the interactive map.</span>
                  </div>
                </div>

                <div className="form-field-group">
                  <label htmlFor="mapAddress">
                    Headquarters Physical Address Line <span className="required-star">*</span>
                  </label>
                  <input
                    id="mapAddress"
                    type="text"
                    className="form-input-text"
                    value={settings.mapAddress}
                    onChange={(e) => handleChange('mapAddress', e.target.value)}
                    placeholder="Unit 402, Presto Heights, MIDC Central Road, Andheri East, Mumbai 400069, Maharashtra"
                    required
                  />
                  <span className="form-field-hint">Official location address displayed on the map header banner.</span>
                </div>

                {/* Map External URL ("Open in Google Maps" Button Link) */}
                <div className="form-field-group" style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                    <label htmlFor="mapExternalUrl" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                      <i className="fa-solid fa-diamond-turn-right" style={{ color: '#0d9488' }} />
                      <span>Google Maps Navigation Link ("Open in Google Maps" Button)</span>
                      <span className="required-star">*</span>
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        className="btn-admin-outline"
                        onClick={handleGenerateHqMapLink}
                        style={{ fontSize: '0.74rem', padding: '4px 10px' }}
                        title="Auto-generate link from Headquarters address"
                      >
                        <i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#0d9488' }} />
                        <span>Auto-Generate from Address</span>
                      </button>
                      {settings.mapExternalUrl && (
                        <a
                          href={settings.mapExternalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-admin-secondary"
                          style={{ fontSize: '0.74rem', padding: '4px 10px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          title="Test external Google Maps navigation link in new tab"
                        >
                          <i className="fa-solid fa-arrow-up-right-from-square" style={{ color: '#0d9488' }} />
                          <span>Test Navigation Link</span>
                        </a>
                      )}
                    </div>
                  </div>
                  <input
                    id="mapExternalUrl"
                    type="url"
                    className="form-input-text"
                    value={settings.mapExternalUrl}
                    onChange={(e) => handleChange('mapExternalUrl', e.target.value)}
                    placeholder="https://maps.google.com/?q=..."
                    required
                  />
                  <span className="form-field-hint">
                    Direct navigation link launched when website visitors click the prominent <strong>"Open in Google Maps"</strong> button.
                  </span>
                </div>

                {/* Map Embed URL (Iframe Src) */}
                <div className="form-field-group" style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', marginTop: '16px' }}>
                  <label htmlFor="mapEmbedUrl" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                    <i className="fa-solid fa-code" style={{ color: '#0d9488' }} />
                    <span>Google Maps Embed Iframe URL (`src`)</span>
                    <span className="required-star">*</span>
                  </label>
                  <input
                    id="mapEmbedUrl"
                    type="text"
                    className="form-input-text"
                    value={settings.mapEmbedUrl}
                    onChange={(e) => handleChange('mapEmbedUrl', e.target.value)}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                    required
                  />
                  <span className="form-field-hint">
                    Embed iframe source URL used to render the live interactive Google Map locator on the website.
                  </span>
                </div>
              </div>

              {/* Instructions Guide Card */}
              <div style={{ ...sectionCardStyle, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <i className="fa-solid fa-circle-info" style={{ color: '#16a34a', fontSize: '1.2rem', marginTop: '2px' }} />
                  <div>
                    <strong style={{ fontSize: '0.92rem', color: '#166534' }}>
                      How to get your Google Maps Embed Iframe URL in 30 seconds:
                    </strong>
                    <ol style={{ margin: '8px 0 0', paddingLeft: '18px', fontSize: '0.83rem', color: '#15803d', lineHeight: '1.6' }}>
                      <li>Open <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" style={{ color: '#15803d', fontWeight: 700, textDecoration: 'underline' }}>Google Maps</a> and search for youror fulfillment center address.</li>
                      <li>Click the <strong>Share</strong> button located under the location details.</li>
                      <li>In the dialog that appears, click the <strong>"Embed a map"</strong> tab.</li>
                      <li>Copy only the URL inside the <code>src="..."</code> attribute (starts with <code>https://www.google.com/maps/embed?pb=...</code>) and paste it into the field above.</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Live Interactive Map Preview */}
              <div className="customizer-preview-box" style={{ padding: '24px', background: '#0f172a', borderRadius: '12px', color: '#ffffff' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <span className="preview-label" style={{ color: '#94a3b8' }}>Live Interactive Preview: Website Google Map Card</span>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(13, 148, 136, 0.2)', color: '#2dd4bf', padding: '3px 10px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700, marginTop: '4px' }}>
                      <i className="fa-solid fa-map-location-dot" />
                      <span>{settings.mapBadge || 'PRIMARY FULFILLMENT HEADQUARTERS'}</span>
                    </div>
                    <h4 style={{ margin: '8px 0 4px', fontSize: '1.1rem', color: '#f8fafc' }}>{settings.mapHeading}</h4>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#94a3b8' }}>{settings.mapAddress}</p>
                  </div>

                  {settings.mapExternalUrl && (
                    <a
                      href={settings.mapExternalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-admin-primary"
                      style={{ fontSize: '0.82rem', padding: '8px 16px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <i className="fa-solid fa-diamond-turn-right" />
                      <span>Open in Google Maps</span>
                    </a>
                  )}
                </div>

                <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)', background: '#1e293b', minHeight: '300px' }}>
                  {settings.mapEmbedUrl ? (
                    <iframe
                      title="BuyBright Headquarters Map Preview"
                      src={settings.mapEmbedUrl}
                      width="100%"
                      height="320"
                      style={{ border: 0, display: 'block' }}
                      allowFullScreen={false}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#64748b', gap: '10px' }}>
                      <i className="fa-solid fa-map-location-dot" style={{ fontSize: '2.5rem', color: '#475569' }} />
                      <span>No Google Maps Embed URL provided yet</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Hub Location Maps Overview Card */}
              <div style={{ ...sectionCardStyle, marginTop: '22px' }}>
                <div className="card-item-header">
                  <i className="fa-solid fa-network-wired" style={{ color: '#0d9488' }} />
                  <strong>All Fulfillment Hubs Map Links Summary</strong>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                        <th style={{ padding: '10px 14px', color: '#475569' }}>Hub / City</th>
                        <th style={{ padding: '10px 14px', color: '#475569' }}>Address</th>
                        <th style={{ padding: '10px 14px', color: '#475569' }}>Map Link Status</th>
                        <th style={{ padding: '10px 14px', color: '#475569', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {settings.hubs.map((hub, idx) => (
                        <tr key={hub.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0f172a' }}>
                            {hub.city || `Hub #${idx + 1}`}
                          </td>
                          <td style={{ padding: '10px 14px', color: '#64748b', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {hub.address || '—'}
                          </td>
                          <td style={{ padding: '10px 14px' }}>
                            {hub.mapLink ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#059669', fontWeight: 600, fontSize: '0.78rem' }}>
                                <i className="fa-solid fa-circle-check" /> Configured
                              </span>
                            ) : (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#d97706', fontWeight: 600, fontSize: '0.78rem' }}>
                                <i className="fa-solid fa-circle-exclamation" /> Not Set
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                            {hub.mapLink ? (
                              <a
                                href={hub.mapLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-admin-secondary"
                                style={{ fontSize: '0.75rem', padding: '4px 10px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              >
                                <i className="fa-solid fa-arrow-up-right-from-square" style={{ color: '#0d9488' }} />
                                <span>Test Map</span>
                              </a>
                            ) : (
                              <button
                                type="button"
                                className="btn-admin-outline"
                                onClick={() => setActiveTab('concierge')}
                                style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                              >
                                <span>Set in Hubs</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="form-navigation-row between">
                <button
                  type="button"
                  className="btn-admin-secondary"
                  onClick={() => setActiveTab('concierge')}
                >
                  <i className="fa-solid fa-arrow-left" />
                  <span>Previous: Concierge &amp; Hubs</span>
                </button>

                <button
                  type="button"
                  className="btn-admin-primary"
                  onClick={() => setActiveTab('faqs')}
                >
                  <span>Next: FAQs</span>
                  <i className="fa-solid fa-arrow-right" />
                </button>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* TAB 6: FAQS */}
          {/* ================================================= */}
          {activeTab === 'faqs' && (
            <div className="admin-card customizer-content-card">
              <div style={sectionHeaderStyle}>
                <div className="faq-header-split">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="section-icon-badge teal">
                      <i className="fa-solid fa-circle-question" />
                    </div>
                    <div>
                      <h3 className="section-title">Section 6: Frequently Asked Questions (FAQs)</h3>
                      <p className="section-subtitle">
                        Manage categorized question &amp; answer accordions displayed on the contact page.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-admin-primary"
                    onClick={handleAddFaq}
                    style={{ fontSize: '0.82rem', padding: '7px 14px' }}
                  >
                    <i className="fa-solid fa-plus" />
                    <span>Add New FAQ</span>
                  </button>
                </div>
              </div>

              {/* FAQ Section Header Inputs */}
              <div style={sectionCardStyle}>
                <div className="form-row-2col">
                  <div className="form-field-group">
                    <label htmlFor="faqPill">FAQ Section Tag Pill</label>
                    <input
                      id="faqPill"
                      type="text"
                      className="form-input-text"
                      value={settings.faqPill}
                      onChange={(e) => handleChange('faqPill', e.target.value)}
                      placeholder="e.g. FREQUENTLY ASKED QUESTIONS"
                    />
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="faqHeading">FAQ Section Heading</label>
                    <input
                      id="faqHeading"
                      type="text"
                      className="form-input-text"
                      value={settings.faqHeading}
                      onChange={(e) => handleChange('faqHeading', e.target.value)}
                      placeholder="e.g. Frequently Asked Questions"
                    />
                  </div>
                </div>

                <div className="form-field-group">
                  <label htmlFor="faqSubheading">FAQ Subheading / Description</label>
                  <textarea
                    id="faqSubheading"
                    className="form-input-textarea"
                    rows={2}
                    value={settings.faqSubheading}
                    onChange={(e) => handleChange('faqSubheading', e.target.value)}
                    placeholder="Quick answers about shipping timelines, temperature control..."
                  />
                </div>
              </div>

              {/* FAQ Items Loop */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {settings.faqs.map((faq, idx) => (
                  <div key={faq.id} style={sectionCardStyle}>
                    <div className="faq-item-top-bar">
                      <div className="faq-title-wrap">
                        <span className="faq-counter">{idx + 1}</span>
                        <strong>Question #{idx + 1}</strong>
                      </div>

                      <div className="faq-actions-wrap">
                        <select
                          value={faq.category}
                          onChange={(e) => handleFaqChange(idx, 'category', e.target.value)}
                          className="form-input-select faq-category-select"
                        >
                          <option value="delivery">Delivery &amp; Cold-Chain</option>
                          <option value="bulk">Bulk &amp; Institutional Quotes</option>
                          <option value="gst">GST Invoicing &amp; ITC</option>
                          <option value="quality">Authenticity &amp; Returns</option>
                        </select>

                        <button
                          type="button"
                          className="btn-icon-action danger"
                          onClick={() => handleDeleteFaq(idx)}
                          title="Delete this FAQ"
                          style={{ color: '#ef4444' }}
                        >
                          <i className="fa-solid fa-trash-can" />
                        </button>
                      </div>
                    </div>

                    <div className="form-field-group">
                      <label>Question Text</label>
                      <input
                        type="text"
                        className="form-input-text"
                        value={faq.question}
                        onChange={(e) => handleFaqChange(idx, 'question', e.target.value)}
                        placeholder="Enter question..."
                      />
                    </div>

                    <div className="form-field-group">
                      <label>Answer Text</label>
                      <textarea
                        className="form-input-textarea"
                        rows={3}
                        value={faq.answer}
                        onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)}
                        placeholder="Enter the detailed answer..."
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-navigation-row between">
                <button
                  type="button"
                  className="btn-admin-secondary"
                  onClick={() => setActiveTab('maps')}
                >
                  <i className="fa-solid fa-arrow-left" />
                  <span>Previous: Google Map &amp; Links</span>
                </button>

                <button
                  type="button"
                  className="btn-admin-primary"
                  onClick={() => setActiveTab('cta')}
                >
                  <span>Next: Bottom CTA Strip</span>
                  <i className="fa-solid fa-arrow-right" />
                </button>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* TAB 7: BOTTOM ACTION CTA STRIP */}
          {/* ================================================= */}
          {activeTab === 'cta' && (
            <div className="admin-card customizer-content-card">
              <div style={sectionHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="section-icon-badge green">
                    <i className="fa-brands fa-whatsapp" />
                  </div>
                  <div>
                    <h3 className="section-title">Section 7: Bottom Action CTA Strip</h3>
                    <p className="section-subtitle">
                      Configure the high-converting bottom call-to-action banner on the contact page.
                    </p>
                  </div>
                </div>
              </div>

              <div style={sectionCardStyle}>
                <div className="form-row-2col">
                  <div className="form-field-group">
                    <label htmlFor="ctaPill">CTA Pill Tag</label>
                    <input
                      id="ctaPill"
                      type="text"
                      className="form-input-text"
                      value={settings.ctaPill}
                      onChange={(e) => handleChange('ctaPill', e.target.value)}
                      placeholder="e.g. UPGRADE YOUR OPERATORY SUPPLY CHAIN"
                    />
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="ctaWhatsAppNumber">Quick WhatsApp Order Number</label>
                    <input
                      id="ctaWhatsAppNumber"
                      type="text"
                      className="form-input-text"
                      value={settings.ctaWhatsAppNumber}
                      onChange={(e) => handleChange('ctaWhatsAppNumber', e.target.value)}
                      placeholder="e.g. +91 88064 88054"
                    />
                  </div>
                </div>

                <div className="form-field-group">
                  <label htmlFor="ctaTitle">CTA Heading</label>
                  <input
                    id="ctaTitle"
                    type="text"
                    className="form-input-text"
                    value={settings.ctaTitle}
                    onChange={(e) => handleChange('ctaTitle', e.target.value)}
                    placeholder="e.g. Ready to Procure 100% Genuine Supplies with Batch Guarantees?"
                  />
                </div>

                <div className="form-field-group">
                  <label htmlFor="ctaSubtitle">CTA Description</label>
                  <textarea
                    id="ctaSubtitle"
                    className="form-input-textarea"
                    rows={3}
                    value={settings.ctaSubtitle}
                    onChange={(e) => handleChange('ctaSubtitle', e.target.value)}
                    placeholder="Join over 1,420+ verified solo clinics..."
                  />
                </div>
              </div>

              <div className="form-navigation-row between">
                <button
                  type="button"
                  className="btn-admin-secondary"
                  onClick={() => setActiveTab('faqs')}
                >
                  <i className="fa-solid fa-arrow-left" />
                  <span>Previous</span>
                </button>

                <button
                  type="submit"
                  className="btn-admin-primary"
                  style={{ padding: '10px 24px' }}
                >
                  <i className="fa-solid fa-floppy-disk" />
                  <span>Save All Settings</span>
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Reset Confirmation Modal */}
        {isResetConfirmOpen && (
          <div
            className="admin-modal-overlay"
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(4px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
          >
            <div
              className="admin-modal-card"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                maxWidth: '420px',
                width: '100%',
                padding: '24px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: '#fee2e2',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  margin: '0 auto 16px',
                }}
              >
                <i className="fa-solid fa-arrow-rotate-left" />
              </div>
              <h4 style={{ margin: '0 0 8px', fontSize: '1.1rem', color: '#0f172a' }}>
                Restore Default Contact Configuration?
              </h4>
              <p style={{ margin: '0 0 20px', fontSize: '0.86rem', color: '#64748b' }}>
                This will reset all contact customizer fields back to default website values.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-admin-secondary"
                  onClick={() => setIsResetConfirmOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-admin-primary"
                  style={{ backgroundColor: '#ef4444', borderColor: '#ef4444' }}
                  onClick={handleReset}
                >
                  Reset Defaults
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scoped CSS for Perfect Responsiveness & Layout */}
      <style>{`
        .customizer-top-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 20px;
        }

        .action-group-left,
        .action-group-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .customizer-tabs-container {
          padding: 8px;
          margin-bottom: 22px;
          background: #ffffff;
        }

        .customizer-tabs-scroll {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          scrollbar-width: thin;
          padding-bottom: 2px;
        }

        .customizer-tab-btn {
          padding: 10px 18px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.86rem;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: transparent;
          color: #475569;
          white-space: nowrap;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .customizer-tab-btn:hover {
          background-color: #f1f5f9;
          color: #1e293b;
        }

        .customizer-tab-btn.active {
          background-color: #0d9488;
          color: #ffffff;
          box-shadow: 0 2px 4px rgba(13, 148, 136, 0.25);
        }

        .customizer-content-card {
          padding: 28px;
        }

        .section-icon-badge {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .section-icon-badge.teal {
          background: #ccfbf1;
          color: #0d9488;
        }

        .section-icon-badge.blue {
          background: #e0f2fe;
          color: #0284c7;
        }

        .section-icon-badge.purple {
          background: #ede9fe;
          color: #6d28d9;
        }

        .section-icon-badge.amber {
          background: #ffedd5;
          color: #ea580c;
        }

        .section-icon-badge.green {
          background: #dcfce7;
          color: #16a34a;
        }

        .section-title {
          margin: 0;
          font-size: 1.15rem;
          color: #0f172a;
          font-weight: 700;
        }

        .section-subtitle {
          margin: 2px 0 0;
          font-size: 0.82rem;
          color: #64748b;
        }

        .customizer-cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .card-item-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
          font-size: 0.95rem;
          color: #1e293b;
        }

        .form-row-3col {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 16px;
        }

        .hub-card-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .hub-title-wrap,
        .faq-title-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .hub-counter,
        .faq-counter {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background-color: #0d9488;
          color: #ffffff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.8rem;
        }

        .hub-tag-input {
          max-width: 220px;
          font-size: 0.8rem;
          padding: 5px 10px;
        }

        .faq-header-split {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .faq-item-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .faq-actions-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .faq-category-select {
          font-size: 0.78rem;
          padding: 4px 8px;
          min-width: 170px;
        }

        .form-navigation-row {
          display: flex;
          margin-top: 24px;
          gap: 10px;
        }

        .form-navigation-row.end {
          justify-content: flex-end;
        }

        .form-navigation-row.between {
          justify-content: space-between;
        }

        .customizer-preview-box {
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: 10px;
          padding: 20px;
          margin-top: 10px;
        }

        .preview-label {
          font-size: 0.72rem;
          text-transform: uppercase;
          color: #64748b;
          font-weight: 700;
          margin-bottom: 8px;
          display: block;
        }

        .preview-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ecfdf5;
          color: #047857;
          padding: 3px 10px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .preview-pulse {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #10b981;
        }

        .preview-title {
          margin: 0 0 6px;
          font-size: 1.15rem;
          color: #0f172a;
        }

        .preview-text {
          margin: 0;
          font-size: 0.85rem;
          color: #64748b;
          line-height: 1.5;
        }

        .btn-admin-outline {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #334155;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .btn-admin-outline:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
          color: #0f172a;
        }

        .hub-map-link-box {
          transition: border-color 0.2s ease;
        }

        .hub-map-link-box:focus-within {
          border-color: #0d9488 !important;
        }

        /* ── Responsive Mobile Media Queries ── */
        @media (max-width: 900px) {
          .customizer-cards-grid {
            grid-template-columns: 1fr;
          }
          .form-row-3col {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .customizer-content-card {
            padding: 18px;
          }
          .customizer-top-actions {
            flex-direction: column;
            align-items: stretch;
          }
          .action-group-left,
          .action-group-right {
            width: 100%;
            justifyContent: space-between;
          }
          .action-group-left button,
          .action-group-left a,
          .action-group-right button {
            flex: 1;
            justify-content: center;
          }
          .hub-tag-input {
            max-width: 100%;
            width: 100%;
          }
          .faq-category-select {
            min-width: 130px;
          }
        }
      `}</style>
    </AdminLayout>
  );
};

export default ContactCustomizer;
