/**
 * HomeAdForm Page.
 * BuyBright Admin Home Page Module - Dedicated Advertisement Form Page.
 * Features:
 *   - Two Tabs:
 *       1. "First Advertisement" (Limit: 3 Ads)
 *       2. "Second Advertisement" (Limit: 3 Ads)
 *       -> Total 6 Advertisements across homepage
 *   - Tab-Wise Order Configuration:
 *       - Single "Advertisement Order" numeric field per tab/section (First Tab Order, Second Tab Order)
 *   - Each Advertisement Card includes:
 *       1. Particular Image (Click-to-upload / change file with live preview)
 *       2. Target Link / URL Field (Click destination / redirect link)
 *       3. Image Alt Text Field (SEO & accessibility descriptive alt text)
 *   - Standardized Save & Cancel action buttons with full localStorage persistence.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { getAdSections, saveAdSections } from '../../data/homeData';
import type { AdSectionItem, AdImageItem } from '../../types/home';
import { useToast } from '../../../context/ToastContext';

interface FormSlotState {
  image: string;
  link: string;
  altText: string;
}

export const HomeAdForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  // Determine initial active tab from route params or query string
  const initialTab = id === 'section-2' || searchParams.get('tab') === 'section-2' ? 'section-2' : 'section-1';
  const [activeTab, setActiveTab] = useState<'section-1' | 'section-2'>(initialTab);

  // Loaded sections data
  const [sections, setSections] = useState<AdSectionItem[]>(() => getAdSections());

  // Tab-wise Single Order Field (First Tab Order & Second Tab Order)
  const [tab1Order, setTab1Order] = useState<number>(1);
  const [tab2Order, setTab2Order] = useState<number>(2);

  // Tab 1 Slots (First Advertisement - Limit 3)
  const [tab1Slots, setTab1Slots] = useState<FormSlotState[]>([
    { image: '', link: '/shop?category=materials', altText: '' },
    { image: '', link: '/shop?category=consumables', altText: '' },
    { image: '', link: '/brands/3m-espe', altText: '' },
  ]);

  // Tab 2 Slots (Second Advertisement - Limit 2)
  const [tab2Slots, setTab2Slots] = useState<FormSlotState[]>([
    { image: '', link: '/shop?category=equipment', altText: '' },
    { image: '', link: '/shop?category=materials', altText: '' },
  ]);

  // Hidden File Inputs
  const singleInputRef = useRef<HTMLInputElement>(null);
  const batchInputRef = useRef<HTMLInputElement>(null);
  const [activeSlotTarget, setActiveSlotTarget] = useState<{ tab: 'section-1' | 'section-2'; index: number } | null>(null);

  // Initialize slots and tab-wise orders from localStorage
  useEffect(() => {
    const s1 = sections.find((s) => s.id === 'section-1');
    const s2 = sections.find((s) => s.id === 'section-2');

    if (s1) {
      setTab1Order(s1.displayOrder ?? 1);
      const defaultLinks1 = ['/shop?category=materials', '/shop?category=consumables', '/brands/3m-espe'];
      const defaultAlts1 = [
        'Medicept Extreme Lite VPS Promo',
        'Gufic Pure Flufic-150 Promo',
        '3M ESPE Express XT Light Body Promo',
      ];
      const slots: FormSlotState[] = [0, 1, 2].map((i) => {
        const item = s1.items?.[i];
        return {
          image: item?.image || s1.images?.[i] || '',
          link: item?.link || s1.links?.[i] || defaultLinks1[i] || '/shop',
          altText: item?.altText || item?.title || defaultAlts1[i] || `First Advertisement #${i + 1}`,
        };
      });
      setTab1Slots(slots);
    }

    if (s2) {
      setTab2Order(s2.displayOrder ?? 2);
      const defaultLinks2 = ['/shop?category=equipment', '/shop?category=materials'];
      const defaultAlts2 = [
        'Precision Dental Handpieces Promo',
        'Crown & Bridge Restorative Materials Promo',
      ];
      const slots: FormSlotState[] = [0, 1].map((i) => {
        const item = s2.items?.[i];
        return {
          image: item?.image || s2.images?.[i] || '',
          link: item?.link || s2.links?.[i] || defaultLinks2[i] || '/shop',
          altText: item?.altText || item?.title || defaultAlts2[i] || `Second Advertisement #${i + 1}`,
        };
      });
      setTab2Slots(slots);
    }
  }, [sections]);

  // Handle Single Image Slot Upload Click
  const handleSlotClick = (tab: 'section-1' | 'section-2', index: number) => {
    setActiveSlotTarget({ tab, index });
    if (singleInputRef.current) {
      singleInputRef.current.value = '';
      singleInputRef.current.click();
    }
  };

  // Handle File Selected
  const handleSingleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeSlotTarget) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP).', 'danger');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      if (result) {
        if (activeSlotTarget.tab === 'section-1') {
          setTab1Slots((prev) => {
            const next = [...prev];
            next[activeSlotTarget.index] = {
              ...next[activeSlotTarget.index],
              image: result,
            };
            return next;
          });
        } else {
          setTab2Slots((prev) => {
            const next = [...prev];
            next[activeSlotTarget.index] = {
              ...next[activeSlotTarget.index],
              image: result,
            };
            return next;
          });
        }
        showToast(`Image #${activeSlotTarget.index + 1} attached successfully.`, 'info');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
    setActiveSlotTarget(null);
  };

  // Handle Batch Files Upload for Current Tab
  const handleBatchUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) return;

    const maxCount = 3;
    let loaded = 0;
    const readImages: string[] = [];

    files.slice(0, maxCount).forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const res = ev.target?.result as string;
        if (res) readImages.push(res);
        loaded++;
        if (loaded === Math.min(files.length, maxCount)) {
          if (activeTab === 'section-1') {
            setTab1Slots((prev) => {
              const next = [...prev];
              readImages.forEach((img, i) => {
                if (i < 3) {
                  next[i] = { ...next[i], image: img };
                }
              });
              return next;
            });
            showToast(
              `Attached ${Math.min(readImages.length, 3)} images to First Advertisement (Limit 3).`,
              'success'
            );
          } else {
            setTab2Slots((prev) => {
              const next = [...prev];
              readImages.forEach((img, i) => {
                if (i < 2) {
                  next[i] = { ...next[i], image: img };
                }
              });
              return next;
            });
            showToast(
              `Attached ${Math.min(readImages.length, 2)} images to Second Advertisement (Limit 2).`,
              'success'
            );
          }
        }
      };
      reader.readAsDataURL(f);
    });

    e.target.value = '';
  };

  // Handle Field Changes for Cards
  const handleFieldChange = (
    tab: 'section-1' | 'section-2',
    index: number,
    field: keyof FormSlotState,
    value: string
  ) => {
    if (tab === 'section-1') {
      setTab1Slots((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], [field]: value };
        return next;
      });
    } else {
      setTab2Slots((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], [field]: value };
        return next;
      });
    }
  };

  // Clear Slot
  const handleClearSlot = (tab: 'section-1' | 'section-2', index: number) => {
    if (tab === 'section-1') {
      setTab1Slots((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], image: '' };
        return next;
      });
    } else {
      setTab2Slots((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], image: '' };
        return next;
      });
    }
  };

  // Save All Changes
  const handleSave = () => {
    const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    // Section 1 items (First Advertisement - max 3)
    const valid1 = tab1Slots.filter((s) => Boolean(s.image.trim()));
    const items1: AdImageItem[] = tab1Slots.map((s, idx) => ({
      image: s.image,
      link: s.link || '/shop',
      order: idx + 1,
      title: s.altText || `First Advertisement #${idx + 1}`,
      altText: s.altText || `First Advertisement #${idx + 1}`,
    }));

    // Section 2 items (Second Advertisement - max 2)
    const valid2 = tab2Slots.slice(0, 2).filter((s) => Boolean(s.image.trim()));
    const items2: AdImageItem[] = tab2Slots.slice(0, 2).map((s, idx) => ({
      image: s.image,
      link: s.link || '/shop',
      order: idx + 1,
      title: s.altText || `Second Advertisement #${idx + 1}`,
      altText: s.altText || `Second Advertisement #${idx + 1}`,
    }));

    const updatedSections: AdSectionItem[] = [
      {
        id: 'section-1',
        name: 'First Advertisement',
        placement: 'Hero Bottom Triple Promo Strip',
        maxImages: 3,
        images: valid1.map((s) => s.image),
        links: tab1Slots.map((s) => s.link),
        orders: [1, 2, 3],
        displayOrder: Number(tab1Order) || 1,
        items: items1,
        status: 'Active',
        updatedAt: nowStr,
      },
      {
        id: 'section-2',
        name: 'Second Advertisement',
        placement: 'Mid-Page Dual Promo Banners',
        maxImages: 2,
        images: valid2.map((s) => s.image),
        links: tab2Slots.slice(0, 2).map((s) => s.link),
        orders: [1, 2],
        displayOrder: Number(tab2Order) || 2,
        items: items2,
        status: 'Active',
        updatedAt: nowStr,
      },
    ];

    setSections(updatedSections);
    saveAdSections(updatedSections);
    showToast('All 5 Advertisement slots (3 in Tab 1, 2 in Tab 2) saved successfully!', 'success');
    navigate('/admin/home/advertisements');
  };

  const currentSlots = activeTab === 'section-1' ? tab1Slots : tab2Slots;
  const currentLimit = activeTab === 'section-1' ? 3 : 2;
  const slotIndexes = activeTab === 'section-1' ? [0, 1, 2] : [0, 1];
  const activeSectionName = activeTab === 'section-1' ? 'First Advertisement' : 'Second Advertisement';

  return (
    <AdminLayout
      title="Advertisement Setup"
      subtitle="Configure advertisement images, target redirect links, alt text, and section display order (3 Ads in Tab 1, 2 Ads in Tab 2 — Total 5)"
    >
      {/* Hidden File Inputs */}
      <input
        ref={singleInputRef}
        type="file"
        accept="image/*"
        onChange={handleSingleFileChange}
        style={{ display: 'none' }}
      />
      <input
        ref={batchInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleBatchUploadChange}
        style={{ display: 'none' }}
      />

      {/* Breadcrumb & Navigation Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#64748b' }}>
          <Link to="/admin/dashboard" style={{ color: '#64748b', textDecoration: 'none' }}>
            Dashboard
          </Link>
          <span>/</span>
          <Link to="/admin/home/advertisements" style={{ color: '#64748b', textDecoration: 'none' }}>
            Advertisements
          </Link>
          <span>/</span>
          <span style={{ color: '#0d9488', fontWeight: 600 }}>Configure Ads &amp; Links</span>
        </div>

        <button
          type="button"
          className="btn-admin-secondary"
          onClick={() => navigate('/admin/home/advertisements')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}
        >
          <i className="fa-solid fa-arrow-left" /> Back to Advertisements List
        </button>
      </div>

      {/* Main Form Container Card */}
      <div className="admin-card ad-form-card">
        {/* Tab Navigation Headers */}
        <div className="ad-tabs-header-wrap">
          {/* Tab 1 Button */}
          <button
            type="button"
            className="ad-tab-btn"
            onClick={() => setActiveTab('section-1')}
            style={{
              border: activeTab === 'section-1' ? '2px solid #0d9488' : '1px solid #e2e8f0',
              background: activeTab === 'section-1' ? '#f0fdfa' : '#f8fafc',
              color: activeTab === 'section-1' ? '#0f766e' : '#64748b',
            }}
          >
            <i
              className="fa-solid fa-layer-group"
              style={{ color: activeTab === 'section-1' ? '#0d9488' : '#94a3b8', fontSize: '1rem' }}
            />
            <span>First Advertisement</span>
            <span
              style={{
                fontSize: '0.72rem',
                padding: '3px 9px',
                borderRadius: '10px',
                background: activeTab === 'section-1' ? '#0d9488' : '#cbd5e1',
                color: '#ffffff',
                fontWeight: 800,
              }}
            >
              Limit: 3 Ads
            </span>
          </button>

          {/* Tab 2 Button */}
          <button
            type="button"
            className="ad-tab-btn"
            onClick={() => setActiveTab('section-2')}
            style={{
              border: activeTab === 'section-2' ? '2px solid #0d9488' : '1px solid #e2e8f0',
              background: activeTab === 'section-2' ? '#f0fdfa' : '#f8fafc',
              color: activeTab === 'section-2' ? '#0f766e' : '#64748b',
            }}
          >
            <i
              className="fa-solid fa-table-columns"
              style={{ color: activeTab === 'section-2' ? '#0d9488' : '#94a3b8', fontSize: '1rem' }}
            />
            <span>Second Advertisement</span>
            <span
              style={{
                fontSize: '0.72rem',
                padding: '3px 9px',
                borderRadius: '10px',
                background: activeTab === 'section-2' ? '#0d9488' : '#cbd5e1',
                color: '#ffffff',
                fontWeight: 800,
              }}
            >
              Limit: 2 Ads
            </span>
          </button>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#0d9488',
                background: '#f0fdfa',
                padding: '5px 12px',
                borderRadius: '20px',
                border: '1px solid #ccfbf1',
                whiteSpace: 'nowrap',
              }}
            >
              <i className="fa-solid fa-circle-check" style={{ marginRight: '5px' }} />
              Total Limit: 5 Advertisements (3 + 2)
            </span>

            <button
              type="button"
              className="btn-admin-secondary"
              onClick={() => batchInputRef.current?.click()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '7px 14px', whiteSpace: 'nowrap' }}
            >
              <i className="fa-solid fa-cloud-arrow-up" style={{ color: '#0d9488' }} />
              <span>Batch Upload ({currentLimit} Files)</span>
            </button>
          </div>
        </div>

        {/* Tab-Wise Section Settings Banner & Single Order Field */}
        <div className="ad-section-settings-bar">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                {activeSectionName}
              </h3>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: '#e0f2fe',
                  color: '#0369a1',
                  fontWeight: 700,
                }}
              >
                Tab #{activeTab === 'section-1' ? '1' : '2'}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
              Attach {currentLimit} advertisement images with target redirect links and alt text for this promotional section.
            </p>
          </div>

          {/* Tab-Wise Single Order Field */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#ffffff',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#1e293b',
                whiteSpace: 'nowrap',
              }}
            >
              <i className="fa-solid fa-arrow-down-1-9" style={{ color: '#0d9488' }} />
              Advertisement Order:
            </label>
            <input
              type="number"
              min="1"
              max="99"
              value={activeTab === 'section-1' ? tab1Order : tab2Order}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10) || 1;
                if (activeTab === 'section-1') {
                  setTab1Order(val);
                } else {
                  setTab2Order(val);
                }
              }}
              style={{
                width: '75px',
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1.5px solid #0d9488',
                fontSize: '0.9rem',
                fontWeight: 800,
                color: '#0f766e',
                textAlign: 'center',
                background: '#f0fdfa',
              }}
              title="Set display order sequence for this advertisement section"
            />
          </div>
        </div>

        {/* Attachment Cards Grid (Limit: 3 for Tab 1, 2 for Tab 2, Total 5) */}
        <div className="ad-slots-responsive-grid">
          {slotIndexes.map((idx) => {
            const slot = currentSlots[idx] || { image: '', link: '/shop', altText: '' };
            const globalAdNumber = activeTab === 'section-1' ? idx + 1 : idx + 4;

            return (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: slot.image ? '1.5px solid #0d9488' : '1.5px dashed #cbd5e1',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  boxShadow: slot.image ? '0 4px 14px rgba(13,148,136,0.08)' : '0 1px 3px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Slot Card Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        color: '#0d9488',
                        background: '#f0fdfa',
                        padding: '3px 10px',
                        borderRadius: '6px',
                        border: '1px solid #ccfbf1',
                      }}
                    >
                      <i className="fa-solid fa-bullhorn" style={{ marginRight: '5px' }} />
                      Ad #{globalAdNumber} (Slot {idx + 1} of {currentLimit})
                    </span>
                  </div>

                  {slot.image && (
                    <button
                      type="button"
                      onClick={() => handleClearSlot(activeTab, idx)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '0.78rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: 600,
                      }}
                      title="Clear image"
                    >
                      <i className="fa-solid fa-trash-can" /> Clear Image
                    </button>
                  )}
                </div>

                {/* 1. Particular Image Box */}
                <div>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      color: '#334155',
                      marginBottom: '6px',
                    }}
                  >
                    <span>
                      <i className="fa-regular fa-image" style={{ color: '#0d9488', marginRight: '5px' }} />
                      Particular Image (Slot #{idx + 1})
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>PNG, JPG, WEBP</span>
                  </label>

                  <div
                    onClick={() => handleSlotClick(activeTab, idx)}
                    title="Click to browse or replace image"
                    style={{
                      width: '100%',
                      height: '155px',
                      borderRadius: '8px',
                      background: '#f8fafc',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      border: '1px solid #e2e8f0',
                      position: 'relative',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    {slot.image ? (
                      <>
                        <img
                          src={slot.image}
                          alt={slot.altText || `Advertisement ${globalAdNumber}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/banner.webp';
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(15, 23, 42, 0.55)',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            opacity: 0,
                            transition: 'opacity 0.15s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                        >
                          <i className="fa-solid fa-camera" /> Change Image
                        </div>
                      </>
                    ) : (
                      <div style={{ textAlign: 'center', color: '#94a3b8', padding: '12px' }}>
                        <i
                          className="fa-solid fa-cloud-arrow-up"
                          style={{ fontSize: '2rem', color: '#0d9488', marginBottom: '6px', display: 'block' }}
                        />
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', display: 'block' }}>
                          Upload Ad Image #{idx + 1}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Click to select local file</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Target Link / URL Input */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: '#334155',
                      marginBottom: '4px',
                    }}
                  >
                    <i className="fa-solid fa-link" style={{ color: '#0d9488', marginRight: '4px' }} />
                    Target Link / URL:
                  </label>
                  <input
                    type="text"
                    value={slot.link}
                    onChange={(e) => handleFieldChange(activeTab, idx, 'link', e.target.value)}
                    placeholder="e.g. /shop?category=materials or /brands/3m-espe"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.82rem',
                      background: '#ffffff',
                    }}
                  />
                </div>

                {/* 3. Image Alt Text Input */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: '#334155',
                      marginBottom: '4px',
                    }}
                  >
                    <i className="fa-solid fa-font" style={{ color: '#0d9488', marginRight: '4px' }} />
                    Image Alt Text:
                  </label>
                  <input
                    type="text"
                    value={slot.altText}
                    onChange={(e) => handleFieldChange(activeTab, idx, 'altText', e.target.value)}
                    placeholder="e.g. Medicept Extreme Lite VPS Promo"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.82rem',
                      background: '#ffffff',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Footer Buttons */}
        <div className="ad-actions-footer-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.8rem' }}>
            <i className="fa-solid fa-circle-info" style={{ color: '#0d9488' }} />
            <span>Changes will apply directly to the homepage promotional showcase and dual promo grids.</span>
          </div>

          <div className="ad-actions-buttons-group">
            <button
              type="button"
              className="btn-admin-secondary"
              onClick={() => navigate('/admin/home/advertisements')}
              style={{ padding: '9px 20px', fontSize: '0.85rem' }}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn-admin-primary"
              onClick={handleSave}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 26px',
                fontSize: '0.88rem',
                fontWeight: 700,
              }}
            >
              <i className="fa-solid fa-floppy-disk" /> Save All Advertisements (Total 5)
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default HomeAdForm;
