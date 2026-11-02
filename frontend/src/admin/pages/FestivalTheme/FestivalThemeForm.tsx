/**
 * BuyBright Admin Festival Theme & Coupon Management - Create & Edit Form.
 * Features:
 * - Comprehensive Coupon & Discount Rules (Code, Discount Type %, ₹, Value, Max Cap, Min Cart Value, Validity Dates)
 * - Advanced Rules (Total Usage Limit Across All Users, Per User Limit, Exclude Sale Items)
 * - Restrictions (Specific Categories & Specific Products)
 * - Publication Status (Active, Scheduled, Inactive)
 * - Visual Themes, Color Pickers & Particle Animations
 * - Real-time Interactive Visual Preview
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { useFestival } from '../../../context/FestivalContext';
import { useToast } from '../../../context/ToastContext';
import { initialProductsData } from '../../data/productsData';
import { getCustomers } from '../../data/customersData';
import {
  MultiSelectDropdown,
  SingleSelectDropdown,
  MultiSelectOption,
} from '../../components/Form';
import {
  FestivalTheme,
  FestivalPresetType,
  ParticleEffectType,
  FESTIVAL_PRESETS,
} from '../../../types/festival';

const AVAILABLE_CATEGORIES = [
  'All Products',
  'Restorative & Instruments',
  'Endodontics & Rotary Files',
  'Dental Equipment & Autoclaves',
  'Prosthodontics & Impression Trays',
  'Orthodontics & Pliers',
  'Oral Surgery & Handpieces',
  'Dental Disposables & Gloves',
];

export const FestivalThemeForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const { festivals, saveFestival, activateFestival } = useFestival();
  const { showToast } = useToast();

  const allCustomers = useMemo(() => getCustomers(), []);

  // Dropdown options matching custom dropdown design
  const statusOptions: MultiSelectOption[] = [
    { value: 'Active', label: 'Active (Publish Live on Website)', subLabel: 'Visible immediately to clinicians & visitors', icon: '🟢' },
    { value: 'Scheduled', label: 'Scheduled (Auto-activate on start date)', subLabel: 'Goes live automatically on campaign start date', icon: '📅' },
    { value: 'Inactive', label: 'Inactive / Draft', subLabel: 'Saved as draft without public display', icon: '⚪' },
  ];

  const discountTypeOptions: MultiSelectOption[] = [
    { value: 'percentage', label: 'Percentage Discount (%) — e.g. 20% Off', subLabel: 'Applies percentage deduction with optional maximum cap', icon: '🏷️' },
    { value: 'fixed', label: 'Fixed Amount Discount (₹) — e.g. ₹500 Flat Off', subLabel: 'Direct rupee value deduction from cart total', icon: '💰' },
  ];



  const customerOptions: MultiSelectOption[] = useMemo(() => {
    return allCustomers.map((c) => ({
      value: c.customerId,
      label: c.name,
    }));
  }, [allCustomers]);

  const categoryOptions: MultiSelectOption[] = useMemo(() => {
    return AVAILABLE_CATEGORIES.map((cat) => ({
      value: cat,
      label: cat === 'All Products' ? 'All Products (Storewide)' : cat,
    }));
  }, []);

  const allProductsList = useMemo(() => {
    const list: { id: string; name: string }[] = initialProductsData.map((p) => ({
      id: p.id,
      name: p.name,
    }));
    const extraDental = [
      { id: 'dent-01', name: 'Superendo Gold Rotary NiTi Files (Pack of 6)' },
      { id: 'dent-02', name: 'Waldent FlexiShield Dam Sheets Box of 36' },
      { id: 'dent-03', name: 'Woodpecker iLed Plus 1-Sec Curing Light' },
      { id: 'dent-04', name: '3M Filtek Z350 XT Universal Restorative Composite' },
      { id: 'dent-05', name: 'Dentsply AH Plus Bioceramic Root Canal Sealer Paste Syringe' },
      { id: 'se-2', name: 'Superendo Pro-Apex 5th Gen Multi-Frequency Apex Locator' },
      { id: 'dent-07', name: 'Waldent German Stainless Extraction Forceps Set of 12' },
      { id: 'dent-08', name: 'Medicept Extreme Lite VPS Wash 50ml' },
    ];
    extraDental.forEach((item) => {
      if (!list.some((p) => p.id === item.id)) {
        list.push(item);
      }
    });
    return list;
  }, []);

  const productOptions: MultiSelectOption[] = useMemo(() => {
    return allProductsList.map((prod) => ({
      value: prod.id,
      label: prod.name,
    }));
  }, [allProductsList]);

  const particleOptions: MultiSelectOption[] = [
    { value: 'sparkles_diyas', label: '✨ Sparkles & Diyas (Diwali / Auspicious)', subLabel: 'Floating golden diyas & twinkling sparkles', icon: '🪔' },
    { value: 'colors_splash', label: '🎨 Color Splashes (Holi)', subLabel: 'Vibrant celebratory color powder bursts', icon: '🎨' },
    { value: 'snowflakes', label: '❄️ Snowflakes (Christmas / Winter)', subLabel: 'Gently falling crystalline snowflakes', icon: '❄️' },
    { value: 'confetti', label: '🎉 Party Confetti (New Year / Celebrations)', subLabel: 'Colorful falling party streamers & confetti', icon: '🎉' },
    { value: 'marigold_flowers', label: '🌺 Marigold Petals (Ganesh Utsav / Puja)', subLabel: 'Auspicious fresh saffron flower petals', icon: '🌺' },
    { value: 'fireworks', label: '🎆 Fireworks (Independence / Grand Fest)', subLabel: 'Spectacular night sky festival fireworks', icon: '🎆' },
    { value: 'none', label: 'None (Static)', subLabel: 'Clean static banner without particle animations', icon: '⚪' },
  ];

  const ribbonPositionOptions: MultiSelectOption[] = [
    { value: 'bottom-right', label: 'Bottom Right (Recommended)', subLabel: 'Floating badge docked at bottom-right corner', icon: '↘️' },
    { value: 'bottom-left', label: 'Bottom Left', subLabel: 'Floating badge docked at bottom-left corner', icon: '↙️' },
    { value: 'top-right', label: 'Top Right', subLabel: 'Floating badge docked at top-right corner below header', icon: '↗️' },
  ];

  const [formData, setFormData] = useState<Partial<FestivalTheme>>({
    name: '',
    preset: 'diwali',
    tagline: '',
    badgeText: '🪔 SPECIAL OFFER',

    // Coupon & Discount fields
    couponCode: '',
    discountType: 'percentage',
    discountValue: 40,
    discountPercentage: 40,
    maxDiscountAmount: 2000,
    minOrderAmount: 0,
    minCartValue: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    validFrom: new Date().toISOString().split('T')[0],
    validTo: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],

    // Advanced Rules
    totalUsageLimit: 500,
    perUserLimit: 1,
    excludeSaleItems: false,

    // Restrictions & Eligibility
    customerEligibility: 'All Customers',
    targetCustomers: [],
    targetCategories: ['All Products'],
    targetProducts: [],

    // Status
    status: 'Active',

    // Visual Theme & Effects
    primaryColor: '#b45309',
    secondaryColor: '#ea580c',
    accentGradient: 'linear-gradient(135deg, #d97706 0%, #dc2626 50%, #9333ea 100%)',
    textColor: '#ffffff',
    particleEffect: 'sparkles_diyas',

    topAnnouncementBar: {
      enabled: true,
      message: '',
      buttonText: 'Shop Deals',
      buttonLink: '/shop',
      showCountdown: true,
    },
    floatingRibbon: {
      enabled: true,
      position: 'bottom-right',
      title: '',
      subtitle: '',
      badgeIcon: '🪔',
    },
    leftDecorativeIcon: '🪔',
    rightDecorativeIcon: '✨',
    leftFestivalIcon: '🪔',
    rightFestivalIcon: '✨',
  });

  // Populate data when in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const existing = festivals.find((f) => f.id === id);
      if (existing) {
        setFormData({ ...existing });
      } else {
        showToast(`Festival campaign ${id} not found.`, 'danger');
        navigate('/admin/festival-theme');
      }
    } else if (!isEditMode) {
      // Auto fill with default Diwali preset
      applyPreset('diwali');
    }
  }, [id, isEditMode]);

  const applyPreset = (presetKey: FestivalPresetType) => {
    const template = FESTIVAL_PRESETS[presetKey];
    if (!template) return;

    setFormData((prev) => ({
      ...prev,
      preset: presetKey,
      name: prev.name && isEditMode ? prev.name : template.defaultName,
      tagline: prev.tagline && isEditMode ? prev.tagline : template.defaultTagline,
      badgeText: prev.badgeText && isEditMode ? prev.badgeText : template.defaultBadge,
      couponCode: prev.couponCode && isEditMode ? prev.couponCode : template.defaultCoupon,
      discountType: template.discountType || 'percentage',
      discountValue: template.defaultDiscount,
      discountPercentage: template.defaultDiscount,
      maxDiscountAmount: template.maxDiscountAmount ?? 2000,
      minOrderAmount: template.minOrderAmount ?? 0,
      minCartValue: template.minOrderAmount ?? 0,
      totalUsageLimit: template.totalUsageLimit ?? 500,
      perUserLimit: template.perUserLimit ?? 1,
      excludeSaleItems: template.excludeSaleItems ?? false,
      customerEligibility: prev.customerEligibility || 'All Customers',
      targetCustomers: prev.targetCustomers || [],
      primaryColor: template.primaryColor,
      secondaryColor: template.secondaryColor,
      accentGradient: template.accentGradient,
      textColor: template.textColor,
      particleEffect: template.particleEffect,
      leftDecorativeIcon: template.leftIcon,
      rightDecorativeIcon: template.rightIcon,
      leftFestivalIcon: template.leftIcon,
      rightFestivalIcon: template.rightIcon,
      topAnnouncementBar: {
        enabled: prev.topAnnouncementBar?.enabled ?? true,
        message: template.announcementMessage,
        buttonText: template.buttonText,
        buttonLink: template.buttonLink,
        showCountdown: prev.topAnnouncementBar?.showCountdown ?? true,
      },
      floatingRibbon: {
        enabled: prev.floatingRibbon?.enabled ?? true,
        position: prev.floatingRibbon?.position || 'bottom-right',
        title: template.displayName,
        subtitle: `Flat ${template.defaultDiscount}% Off with code ${template.defaultCoupon}`,
        badgeIcon: template.leftIcon,
      },
    }));
  };

  const handleRemoveCustomer = (custId: string) => {
    const current = formData.targetCustomers || [];
    setFormData({
      ...formData,
      targetCustomers: current.filter((c) => c !== custId),
    });
  };

  const handleRemoveCategory = (cat: string) => {
    const current = formData.targetCategories || [];
    const updated = current.filter((c) => c !== cat);
    setFormData({
      ...formData,
      targetCategories: updated.length > 0 ? updated : ['All Products'],
    });
  };

  const handleRemoveProduct = (prodId: string) => {
    const current = formData.targetProducts || [];
    setFormData({
      ...formData,
      targetProducts: current.filter((p) => p !== prodId),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      showToast('Campaign Name is required.', 'danger');
      return;
    }
    if (!formData.couponCode?.trim()) {
      showToast('Coupon Code is required.', 'danger');
      return;
    }
    if (formData.discountValue === undefined || formData.discountValue <= 0) {
      showToast('Please enter a valid Discount Value greater than 0.', 'danger');
      return;
    }

    const saved = saveFestival({
      ...formData,
      couponCode: formData.couponCode.toUpperCase().trim(),
      discountPercentage: Number(formData.discountValue),
      discountValue: Number(formData.discountValue),
      minOrderAmount: Number(formData.minOrderAmount ?? 0),
      minCartValue: Number(formData.minOrderAmount ?? 0),
      customerEligibility: formData.customerEligibility || 'All Customers',
      targetCustomers: formData.targetCustomers || [],
      validFrom: formData.startDate,
      validTo: formData.endDate,
      leftDecorativeIcon: formData.leftFestivalIcon || formData.leftDecorativeIcon || '🪔',
      rightDecorativeIcon: formData.rightFestivalIcon || formData.rightDecorativeIcon || '✨',
      leftFestivalIcon: formData.leftFestivalIcon || formData.leftDecorativeIcon || '🪔',
      rightFestivalIcon: formData.rightFestivalIcon || formData.rightDecorativeIcon || '✨',
    });

    if (formData.status === 'Active') {
      activateFestival(saved.id);
    }

    showToast(
      isEditMode
        ? `✓ Festival campaign & coupon "${saved.name}" updated successfully!`
        : `✓ Festival campaign & coupon "${saved.name}" created successfully!`,
      'success'
    );

    navigate('/admin/festival-theme');
  };

  return (
    <AdminLayout
      title={isEditMode ? `Edit Festival Campaign: ${formData.name}` : 'Create Festival Theme & Coupon'}
      subtitle="Configure promotional coupon rules, discount types, validity dates, usage limits, restrictions, and festive themes."
    >
      <div className="admin-page-container festival-form-page">
        {/* Navigation Breadcrumb Bar */}
        <div className="admin-form-header-bar">
          <Link to="/admin/festival-theme" className="btn-back-link">
            <i className="fa-solid fa-arrow-left" /> Back to All Festival Themes
          </Link>
          <div className="action-buttons-group">
            <button type="button" className="btn-admin-outline" onClick={() => navigate('/admin/festival-theme')}>
              Cancel
            </button>
            <button type="button" className="btn-admin-primary" onClick={handleSubmit}>
              <i className="fa-solid fa-floppy-disk" /> {isEditMode ? 'Update Campaign & Coupon' : 'Save & Publish Coupon'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="festival-form-grid-layout">
          {/* Main Form Fields (Left Column) */}
          <div className="form-main-column">
            {/* Section 1: Choose Festival Preset */}
            <div className="admin-card form-section-card" style={{ overflow: 'visible', position: 'relative', zIndex: 6 }}>
              <div className="section-header">
                <span className="step-num">1</span>
                <div>
                  <h3 className="section-title">Select Festival Theme Preset</h3>
                  <p className="section-sub">Choose a festive occasion to auto-fill themed colors, coupon discounts, and announcements.</p>
                </div>
              </div>

              <div className="presets-cards-grid">
                {(Object.keys(FESTIVAL_PRESETS) as FestivalPresetType[]).map((presetKey) => {
                  const p = FESTIVAL_PRESETS[presetKey];
                  const isSelected = formData.preset === presetKey;

                  return (
                    <div
                      key={presetKey}
                      className={`preset-card-item ${isSelected ? 'active' : ''}`}
                      onClick={() => applyPreset(presetKey)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="preset-card-icon" style={{ background: p.primaryColor }}>
                        <span>{p.leftIcon}</span>
                      </div>
                      <div className="preset-card-info">
                        <strong>{p.displayName}</strong>
                        <span>{p.defaultCoupon} • {p.defaultDiscount}% OFF</span>
                      </div>
                      {isSelected && (
                        <div className="check-badge">
                          <i className="fa-solid fa-circle-check" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Campaign Details */}
            <div className="admin-card form-section-card" style={{ overflow: 'visible', position: 'relative', zIndex: 5 }}>
              <div className="section-header">
                <span className="step-num">2</span>
                <div>
                  <h3 className="section-title">Campaign Details &amp; Status</h3>
                  <p className="section-sub">Set the campaign name, description tagline, and publication status.</p>
                </div>
              </div>

              <div className="form-row-2">
                <div className="admin-form-group">
                  <label>Festival Campaign Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Diwali Dental Mahotsav 2026"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <SingleSelectDropdown
                    label="Publication Status *"
                    value={formData.status || 'Active'}
                    onChange={(val) => setFormData({ ...formData, status: val as any })}
                    options={statusOptions}
                    searchable={false}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Campaign Tagline / Subtitle</label>
                <input
                  type="text"
                  placeholder="e.g. Illuminate Your Dental Practice with Up to 50% Off on Autoclaves & Rotary Files!"
                  value={formData.tagline || ''}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                />
              </div>
            </div>

            {/* Section 3: Dedicated Comprehensive Coupon & Discount Configuration */}
            <div className="admin-card form-section-card" style={{ overflow: 'visible', position: 'relative', zIndex: 30 }}>
              <div className="section-header">
                <span className="step-num">3</span>
                <div>
                  <h3 className="section-title">Coupon &amp; Discount Configuration</h3>
                  <p className="section-sub">Configure coupon promo codes, discount types (percentage or fixed amount), cart limits, and validity period.</p>
                </div>
              </div>

              {/* Coupon Code & Discount Type Switcher */}
              <div className="form-row-2">
                <div className="admin-form-group">
                  <label>Coupon Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DIWALI50"
                    value={formData.couponCode || ''}
                    onChange={(e) => setFormData({ ...formData, couponCode: e.target.value.toUpperCase() })}
                    style={{ textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 800, fontSize: '15px' }}
                  />
                </div>

                <div className="admin-form-group">
                  <SingleSelectDropdown
                    label="Discount Type *"
                    value={formData.discountType || 'percentage'}
                    onChange={(val) => setFormData({ ...formData, discountType: val as 'percentage' | 'fixed' })}
                    options={discountTypeOptions}
                    searchable={false}
                  />
                </div>
              </div>

              {/* Discount Value, Max Discount Amount & Minimum Cart Value */}
              <div className="form-row-3">
                <div className="admin-form-group">
                  <label>
                    Discount Value * {formData.discountType === 'percentage' ? '(%)' : '(₹)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={formData.discountType === 'percentage' ? 100 : 100000}
                    required
                    placeholder={formData.discountType === 'percentage' ? 'e.g. 20' : 'e.g. 500'}
                    value={formData.discountValue ?? 40}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountValue: Number(e.target.value),
                        discountPercentage: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <label>Max Discount Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    placeholder="e.g. 2000 (Optional cap for % discount)"
                    value={formData.maxDiscountAmount ?? ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxDiscountAmount: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <label>Minimum Cart Value (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    placeholder="0"
                    value={formData.minOrderAmount ?? 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minOrderAmount: Number(e.target.value),
                        minCartValue: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              {/* Valid From & Valid To Dates */}
              <div className="form-row-2">
                <div className="admin-form-group">
                  <label>Valid From *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        startDate: e.target.value,
                        validFrom: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <label>Valid To *</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        endDate: e.target.value,
                        validTo: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Advanced Rules Sub-section */}
              <div className="advanced-rules-box">
                <div className="advanced-rules-title">
                  <i className="fa-solid fa-sliders" />
                  <span>Advanced Coupon Rules</span>
                </div>

                <div className="form-row-2">
                  <div className="admin-form-group">
                    <label>Total Usage Limit (Across all users)</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 1000 (Leave empty for unlimited)"
                      value={formData.totalUsageLimit ?? ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          totalUsageLimit: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Per User Limit</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="1"
                      value={formData.perUserLimit ?? 1}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          perUserLimit: Number(e.target.value || 1),
                        })
                      }
                    />
                  </div>
                </div>

                {/* Exclude Sale Items Toggle */}
                <div className="toggle-rule-item">
                  <label className="admin-switch">
                    <input
                      type="checkbox"
                      checked={formData.excludeSaleItems ?? false}
                      onChange={(e) => setFormData({ ...formData, excludeSaleItems: e.target.checked })}
                    />
                    <span className="slider round" />
                  </label>
                  <div className="rule-desc">
                    <strong>Exclude Sale Items</strong>
                    <span>Do not apply coupon discount on products already on clearance / discounted price.</span>
                  </div>
                </div>
              </div>

              {/* Restrictions Sub-section: Customer Eligibility, Categories & Specific Products */}
              <div className="advanced-rules-box mt-3" style={{ overflow: 'visible', position: 'relative' }}>
                <div className="advanced-rules-title">
                  <i className="fa-solid fa-shield-halved" />
                  <span>Usage & Customer Restrictions</span>
                </div>

                {/* Customer Eligibility - Multiple Selection with Customer Names Only */}
                <div className="admin-form-group">
                  <div className="ms-field-header-row">
                    <label className="ms-field-header-label">
                      <i className="fa-solid fa-users" />
                      Customer Eligibility *
                    </label>
                    <span className="ms-field-header-badge">
                      {(formData.targetCustomers || []).length > 0
                        ? `${(formData.targetCustomers || []).length} customer(s) selected`
                        : 'All Customers (Storewide)'}
                    </span>
                  </div>

                  <MultiSelectDropdown
                    placeholder="Search and select customers by name..."
                    value={formData.targetCustomers || []}
                    onChange={(selected) => {
                      setFormData((prev) => ({
                        ...prev,
                        targetCustomers: selected,
                        customerEligibility: selected.length > 0 ? 'Specific Customer' : 'All Customers',
                      }));
                    }}
                    options={customerOptions}
                    searchable={true}
                  />

                  {/* Selected Customers Tag Pills Tray */}
                  {(formData.targetCustomers || []).length > 0 && (
                    <div className="ms-selected-tags-tray">
                      {(formData.targetCustomers || []).map((targetId) => {
                        const cust = allCustomers.find((c) => c.customerId === targetId || c.id === targetId);
                        const customerName = cust?.name || targetId;
                        return (
                          <span key={targetId} className="ms-selected-tag-pill">
                            <i className="fa-solid fa-user-doctor ms-tag-pill-icon" />
                            <span className="ms-tag-pill-text">{customerName}</span>
                            <button
                              type="button"
                              className="ms-tag-pill-remove"
                              onClick={() => handleRemoveCustomer(targetId)}
                              title={`Remove ${customerName}`}
                            >
                              <i className="fa-solid fa-xmark" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Specific Category Restriction - Custom MultiSelectDropdown */}
                <div className="admin-form-group mt-3">
                  <div className="ms-field-header-row">
                    <label className="ms-field-header-label">
                      <i className="fa-solid fa-layer-group" />
                      Restriction: Specific Category
                    </label>
                    <span className="ms-field-header-badge">
                      {(formData.targetCategories || []).includes('All Products')
                        ? 'Storewide (All Categories)'
                        : `${(formData.targetCategories || []).length} category(s) restricted`}
                    </span>
                  </div>

                  <MultiSelectDropdown
                    placeholder="Search and select categories to restrict coupon..."
                    value={formData.targetCategories || ['All Products']}
                    onChange={(selected) => {
                      let updated = selected;
                      if (selected.includes('All Products') && selected.length > 1) {
                        if (selected[selected.length - 1] === 'All Products') {
                          updated = ['All Products'];
                        } else {
                          updated = selected.filter((c) => c !== 'All Products');
                        }
                      }
                      if (updated.length === 0) {
                        updated = ['All Products'];
                      }
                      setFormData((prev) => ({ ...prev, targetCategories: updated }));
                    }}
                    options={categoryOptions}
                    searchable={true}
                  />

                  {/* Selected Category Tags Tray */}
                  {(formData.targetCategories || []).length > 0 && (
                    <div className="ms-selected-tags-tray">
                      {(formData.targetCategories || []).map((cat) => (
                        <span key={cat} className="ms-selected-tag-pill">
                          <i className="fa-solid fa-tag ms-tag-pill-icon" />
                          <span className="ms-tag-pill-text">{cat}</span>
                          {cat !== 'All Products' && (
                            <button
                              type="button"
                              className="ms-tag-pill-remove"
                              onClick={() => handleRemoveCategory(cat)}
                              title={`Remove ${cat}`}
                            >
                              <i className="fa-solid fa-xmark" />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Specific Product Restriction - Custom MultiSelectDropdown */}
                <div className="admin-form-group mt-3" style={{ overflow: 'visible', position: 'relative' }}>
                  <div className="ms-field-header-row">
                    <label className="ms-field-header-label">
                      <i className="fa-solid fa-box-open" />
                      Restriction: Specific Product (Optional)
                    </label>
                    <span className="ms-field-header-badge">
                      {(formData.targetProducts || []).length > 0
                        ? `${(formData.targetProducts || []).length} product(s) restricted`
                        : 'All Products (No Restriction)'}
                    </span>
                  </div>

                  <MultiSelectDropdown
                    placeholder="Search and select products by name..."
                    value={formData.targetProducts || []}
                    onChange={(selected) => setFormData((prev) => ({ ...prev, targetProducts: selected }))}
                    options={productOptions}
                    searchable={true}
                  />

                  {/* Selected Products Tag Pills Tray (Product Name Only) */}
                  {(formData.targetProducts || []).length > 0 && (
                    <div className="ms-selected-tags-tray">
                      {(formData.targetProducts || []).map((prodId) => {
                        const prod = allProductsList.find((p) => p.id === prodId || (p as any).productId === prodId);
                        const productName = prod?.name || (prod as any)?.productName || prodId;
                        return (
                          <span key={prodId} className="ms-selected-tag-pill">
                            <i className="fa-solid fa-tooth ms-tag-pill-icon" />
                            <span className="ms-tag-pill-text">{productName}</span>
                            <button
                              type="button"
                              className="ms-tag-pill-remove"
                              onClick={() => handleRemoveProduct(prodId)}
                              title={`Remove ${productName}`}
                            >
                              <i className="fa-solid fa-xmark" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section 4: Visual Styling & Particle Effects */}
            <div className="admin-card form-section-card" style={{ overflow: 'visible', position: 'relative', zIndex: 20 }}>
              <div className="section-header">
                <span className="step-num">4</span>
                <div>
                  <h3 className="section-title">Visual Styling &amp; Particle Effects</h3>
                  <p className="section-sub">Fine-tune the festive color scheme and dynamic particle animation.</p>
                </div>
              </div>

              <div className="form-row-3">
                <div className="admin-form-group">
                  <label>Primary Theme Color</label>
                  <div className="color-picker-row">
                    <input
                      type="color"
                      value={formData.primaryColor || '#b45309'}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    />
                    <input
                      type="text"
                      value={formData.primaryColor || '#b45309'}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Secondary Color</label>
                  <div className="color-picker-row">
                    <input
                      type="color"
                      value={formData.secondaryColor || '#ea580c'}
                      onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    />
                    <input
                      type="text"
                      value={formData.secondaryColor || '#ea580c'}
                      onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <SingleSelectDropdown
                    label="Particle Animation Effect"
                    value={formData.particleEffect || 'sparkles_diyas'}
                    onChange={(val) => setFormData({ ...formData, particleEffect: val as ParticleEffectType })}
                    options={particleOptions}
                    searchable={false}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Accent CSS Gradient</label>
                <input
                  type="text"
                  placeholder="linear-gradient(135deg, #d97706 0%, #dc2626 50%, #9333ea 100%)"
                  value={formData.accentGradient || ''}
                  onChange={(e) => setFormData({ ...formData, accentGradient: e.target.value })}
                />
              </div>
            </div>

            {/* Section 5: Top Announcement Bar & Floating Ribbon */}
            <div className="admin-card form-section-card" style={{ overflow: 'visible', position: 'relative', zIndex: 10 }}>
              <div className="section-header">
                <span className="step-num">5</span>
                <div>
                  <h3 className="section-title">Top Announcement Bar &amp; Floating Ribbon</h3>
                  <p className="section-sub">Configure how the message displays on the public website header and corner ribbon.</p>
                </div>
              </div>

              {/* Top Announcement Bar Controls */}
              <div className="sub-module-box">
                <div className="sub-module-head">
                  <label className="admin-switch">
                    <input
                      type="checkbox"
                      checked={formData.topAnnouncementBar?.enabled ?? true}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          topAnnouncementBar: {
                            ...formData.topAnnouncementBar!,
                            enabled: e.target.checked,
                          },
                        })
                      }
                    />
                    <span className="slider round" />
                  </label>
                  <div>
                    <strong>Top Announcement Bar</strong>
                    <span>Displays full-width banner at the very top of all website pages.</span>
                  </div>
                </div>

                {formData.topAnnouncementBar?.enabled && (
                  <div className="sub-module-fields">
                    <div className="admin-form-group">
                      <label>Announcement Message</label>
                      <input
                        type="text"
                        placeholder="e.g. 🪔 Diwali Grand Dental Fest is LIVE! Extra 15% Cashback + Free Delivery."
                        value={formData.topAnnouncementBar?.message || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            topAnnouncementBar: {
                              ...formData.topAnnouncementBar!,
                              message: e.target.value,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="form-row-2">
                      <div className="admin-form-group">
                        <label>CTA Button Text</label>
                        <input
                          type="text"
                          placeholder="e.g. Claim Deals"
                          value={formData.topAnnouncementBar?.buttonText || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              topAnnouncementBar: {
                                ...formData.topAnnouncementBar!,
                                buttonText: e.target.value,
                              },
                            })
                          }
                        />
                      </div>

                      <div className="admin-form-group">
                        <label>CTA Button Link</label>
                        <input
                          type="text"
                          placeholder="e.g. /shop?sale=diwali"
                          value={formData.topAnnouncementBar?.buttonLink || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              topAnnouncementBar: {
                                ...formData.topAnnouncementBar!,
                                buttonLink: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Floating Ribbon Controls */}
              <div className="sub-module-box mt-4">
                <div className="sub-module-head">
                  <label className="admin-switch">
                    <input
                      type="checkbox"
                      checked={formData.floatingRibbon?.enabled ?? true}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          floatingRibbon: {
                            ...formData.floatingRibbon!,
                            enabled: e.target.checked,
                          },
                        })
                      }
                    />
                    <span className="slider round" />
                  </label>
                  <div>
                    <strong>Floating Festive Badge / Ribbon</strong>
                    <span>Interactive floating button on the bottom corner for quick coupon access.</span>
                  </div>
                </div>

                {formData.floatingRibbon?.enabled && (
                  <div className="sub-module-fields">
                    <div className="form-row-3">
                      <div className="admin-form-group">
                        <label>Ribbon Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Diwali Dhamaka Sale"
                          value={formData.floatingRibbon?.title || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              floatingRibbon: {
                                ...formData.floatingRibbon!,
                                title: e.target.value,
                              },
                            })
                          }
                        />
                      </div>

                      <div className="admin-form-group">
                        <label>Ribbon Subtitle</label>
                        <input
                          type="text"
                          placeholder="e.g. Flat 50% Off with code DIWALI50"
                          value={formData.floatingRibbon?.subtitle || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              floatingRibbon: {
                                ...formData.floatingRibbon!,
                                subtitle: e.target.value,
                              },
                            })
                          }
                        />
                      </div>

                      <div className="admin-form-group">
                        <SingleSelectDropdown
                          label="Position On Screen"
                          value={formData.floatingRibbon?.position || 'bottom-right'}
                          onChange={(val) =>
                            setFormData({
                              ...formData,
                              floatingRibbon: {
                                ...formData.floatingRibbon!,
                                position: val as any,
                              },
                            })
                          }
                          options={ribbonPositionOptions}
                          searchable={false}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section 6: Header Festival Icons */}
            <div className="admin-card form-section-card" style={{ overflow: 'visible', position: 'relative', zIndex: 1 }}>
              <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span className="step-num">6</span>
                  <div>
                    <h3 className="section-title">Header Festival Icons</h3>
                    <p className="section-sub">Configure decorative festive icons displayed on the left and right positions of the header banner.</p>
                  </div>
                </div>
                <Link
                  to="/admin/icon-library"
                  target="_blank"
                  className="btn-admin-outline"
                  title="Open Icons Library to search and copy icons"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    borderColor: '#0d9488',
                    color: '#0d9488',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    padding: '7px 14px',
                    borderRadius: '8px',
                    background: '#f0fdfa',
                    textDecoration: 'none',
                  }}
                >
                  <i className="fa-solid fa-icons" />
                  <span>Browse All Icons Library</span>
                  <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '11px' }} />
                </Link>
              </div>

              <div className="form-row-2">
                {/* Header Left Festival Icon */}
                <div className="admin-form-group">
                  <label>Header Left Festival Icon</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '8px',
                        background: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        flexShrink: 0,
                      }}
                    >
                      {formData.leftFestivalIcon || formData.leftDecorativeIcon || '🪔'}
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. 🪔 or fa-solid fa-gift"
                      value={formData.leftFestivalIcon ?? formData.leftDecorativeIcon ?? '🪔'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          leftFestivalIcon: e.target.value,
                          leftDecorativeIcon: e.target.value,
                        })
                      }
                      style={{ flex: 1 }}
                    />
                  </div>
                  {/* Quick Preset Icon Selector Chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                    <span style={{ fontSize: '11.5px', color: '#64748b', alignSelf: 'center', marginRight: '4px' }}>
                      Quick Select:
                    </span>
                    {['🪔', '✨', '🎨', '🎄', '🎆', '🌺', '🌙', '🇮🇳', '🎁', '🔔', '🎉', '🛍️', '⭐', '💫'].map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            leftFestivalIcon: icon,
                            leftDecorativeIcon: icon,
                          })
                        }
                        style={{
                          background: (formData.leftFestivalIcon || formData.leftDecorativeIcon) === icon ? '#e2e8f0' : '#f8fafc',
                          border: `1px solid ${(formData.leftFestivalIcon || formData.leftDecorativeIcon) === icon ? '#008080' : '#e2e8f0'}`,
                          borderRadius: '6px',
                          padding: '4px 8px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Header Right Festival Icon */}
                <div className="admin-form-group">
                  <label>Header Right Festival Icon</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '8px',
                        background: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        flexShrink: 0,
                      }}
                    >
                      {formData.rightFestivalIcon || formData.rightDecorativeIcon || '✨'}
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. ✨ or fa-solid fa-sparkles"
                      value={formData.rightFestivalIcon ?? formData.rightDecorativeIcon ?? '✨'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rightFestivalIcon: e.target.value,
                          rightDecorativeIcon: e.target.value,
                        })
                      }
                      style={{ flex: 1 }}
                    />
                  </div>
                  {/* Quick Preset Icon Selector Chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                    <span style={{ fontSize: '11.5px', color: '#64748b', alignSelf: 'center', marginRight: '4px' }}>
                      Quick Select:
                    </span>
                    {['✨', '🪔', '🎉', '⭐', '💫', '🎆', '🎄', '🎨', '🌺', '🌙', '🎁', '🔔', '🎊', '🔥'].map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            rightFestivalIcon: icon,
                            rightDecorativeIcon: icon,
                          })
                        }
                        style={{
                          background: (formData.rightFestivalIcon || formData.rightDecorativeIcon) === icon ? '#e2e8f0' : '#f8fafc',
                          border: `1px solid ${(formData.rightFestivalIcon || formData.rightDecorativeIcon) === icon ? '#008080' : '#e2e8f0'}`,
                          borderRadius: '6px',
                          padding: '4px 8px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Interactive Live Preview Column (Right Column) */}
          <div className="form-preview-column">
            <div className="sticky-preview-wrapper admin-card">
              <div className="preview-card-head">
                <i className="fa-solid fa-eye text-teal" />
                <h4>Live Visual Preview</h4>
                <span className="preview-tag">Interactive</span>
              </div>

              <div className="preview-canvas-box">
                <p className="preview-hint">This is how your coupon and promotional campaign will display:</p>

                {/* 1. Live Interactive Coupon Card */}
                <div className="coupon-live-preview-card">
                  <div className="coupon-card-top">
                    <div className="coupon-promo-box">
                      <i className="fa-solid fa-tag text-amber" />
                      <strong>{formData.couponCode || 'PROMOCODE'}</strong>
                    </div>
                    <span className="coupon-type-badge">
                      {formData.discountType === 'percentage' ? 'Percentage Discount' : 'Fixed Amount'}
                    </span>
                  </div>

                  <h4 className="coupon-discount-headline">
                    {formData.discountType === 'percentage'
                      ? `Flat ${formData.discountValue || 40}% OFF`
                      : `Flat ₹${Number(formData.discountValue || 500).toLocaleString()} OFF`}
                  </h4>

                  <div className="coupon-rules-summary-grid">
                    <div className="rule-pair">
                      <span>Min Cart:</span>
                      <strong>₹{Number(formData.minOrderAmount || 0).toLocaleString()}</strong>
                    </div>

                    <div className="rule-pair">
                      <span>Max Discount:</span>
                      <strong>
                        {formData.maxDiscountAmount ? `₹${formData.maxDiscountAmount.toLocaleString()}` : 'Unlimited'}
                      </strong>
                    </div>

                    <div className="rule-pair">
                      <span>Valid From:</span>
                      <strong>{formData.startDate || 'Immediate'}</strong>
                    </div>

                    <div className="rule-pair">
                      <span>Valid To:</span>
                      <strong>{formData.endDate || 'Ongoing'}</strong>
                    </div>

                    <div className="rule-pair">
                      <span>Total Usage:</span>
                      <strong>{formData.totalUsageLimit ? `${formData.totalUsageLimit} uses` : 'Unlimited'}</strong>
                    </div>

                    <div className="rule-pair">
                      <span>Per User:</span>
                      <strong>{formData.perUserLimit || 1} time</strong>
                    </div>

                    <div className="rule-pair" style={{ gridColumn: 'span 2' }}>
                      <span>Categories:</span>
                      <strong>{formData.targetCategories?.join(', ') || 'All Products'}</strong>
                    </div>

                    {formData.excludeSaleItems && (
                      <div className="rule-pair" style={{ gridColumn: 'span 2' }}>
                        <span style={{ color: '#ea580c' }}>✓ Excludes already discounted sale items</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Simulated Top Announcement Bar */}
                <div
                  className="preview-top-bar"
                  style={{
                    background: formData.accentGradient || formData.primaryColor,
                    color: formData.textColor || '#ffffff',
                  }}
                >
                  <div className="bar-mock-content">
                    <span className="mock-icon">{formData.leftFestivalIcon || formData.leftDecorativeIcon || '🪔'}</span>
                    <span className="mock-badge">{formData.name || 'FESTIVAL DEALS'}</span>
                    <span className="mock-msg">{formData.topAnnouncementBar?.message || formData.tagline || 'Offers Live!'}</span>
                    {formData.couponCode && (
                      <span className="mock-coupon">CODE: <strong>{formData.couponCode}</strong></span>
                    )}
                    <span className="mock-btn">{formData.topAnnouncementBar?.buttonText || 'Shop Now'}</span>
                    <span className="mock-icon">{formData.rightFestivalIcon || formData.rightDecorativeIcon || '✨'}</span>
                  </div>
                </div>

                {/* 3. Simulated Floating Corner Badge */}
                <div className="preview-floating-ribbon-preview">
                  <span className="preview-subhead">Corner Floating Badge:</span>
                  <div
                    className="simulated-ribbon-badge"
                    style={{
                      background: formData.accentGradient || formData.primaryColor,
                      color: '#ffffff',
                    }}
                  >
                    <span className="ribbon-icon">{formData.leftDecorativeIcon || '🪔'}</span>
                    <div className="ribbon-txt">
                      <strong>{formData.floatingRibbon?.title || formData.name || 'Festival Offer'}</strong>
                      <span>{formData.floatingRibbon?.subtitle || (formData.discountType === 'fixed' ? `Save ₹${formData.discountValue}` : `Save ${formData.discountValue}%`)}</span>
                    </div>
                    <span className="ribbon-off">
                      {formData.discountType === 'fixed' ? `-₹${formData.discountValue}` : `-${formData.discountValue}%`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="preview-actions-foot">
                <button type="button" className="btn-admin-primary full-width" onClick={handleSubmit}>
                  <i className="fa-solid fa-floppy-disk" /> {isEditMode ? 'Save Changes' : 'Publish Coupon & Theme'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default FestivalThemeForm;
