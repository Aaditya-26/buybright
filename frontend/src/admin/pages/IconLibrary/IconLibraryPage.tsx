/**
 * BuyBright Admin Icons Library Page.
 * Responsive, searchable icon catalog with 1-click copy for festivals, dental, e-commerce, and UI.
 * Uses external stylesheet ./IconLibrary.scss.
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { useToast } from '../../../context/ToastContext';
import './IconLibrary.scss';

export interface IconItem {
  id: string;
  name: string;
  type: 'emoji' | 'fa';
  value: string;
  category: 'festivals' | 'dental' | 'deals' | 'ecommerce' | 'ui' | 'emojis';
  tags: string[];
}

export const ICONS_CATALOG: IconItem[] = [
  // ─── 1. Festivals & Celebrations ───
  { id: 'f-1', name: 'Diya Lamp', type: 'emoji', value: '🪔', category: 'festivals', tags: ['diya', 'diwali', 'lamp', 'light', 'puja'] },
  { id: 'f-2', name: 'Sparkles', type: 'emoji', value: '✨', category: 'festivals', tags: ['sparkles', 'star', 'magic', 'shine', 'festive'] },
  { id: 'f-3', name: 'Fireworks', type: 'emoji', value: '🎆', category: 'festivals', tags: ['fireworks', 'new year', 'celebration', 'grand'] },
  { id: 'f-4', name: 'Firecracker', type: 'emoji', value: '🎇', category: 'festivals', tags: ['sparkler', 'cracker', 'diwali', 'pataka'] },
  { id: 'f-5', name: 'Color Palette', type: 'emoji', value: '🎨', category: 'festivals', tags: ['holi', 'colors', 'art', 'rangoli'] },
  { id: 'f-6', name: 'Christmas Tree', type: 'emoji', value: '🎄', category: 'festivals', tags: ['christmas', 'tree', 'xmas', 'december'] },
  { id: 'f-7', name: 'Santa Claus', type: 'emoji', value: '🎅', category: 'festivals', tags: ['santa', 'christmas', 'winter'] },
  { id: 'f-8', name: 'Gift Box', type: 'emoji', value: '🎁', category: 'festivals', tags: ['gift', 'present', 'offer', 'reward'] },
  { id: 'f-9', name: 'Celebration Bell', type: 'emoji', value: '🔔', category: 'festivals', tags: ['bell', 'christmas', 'temple', 'alert'] },
  { id: 'f-10', name: 'Snowflake', type: 'emoji', value: '❄️', category: 'festivals', tags: ['snow', 'winter', 'cool', 'christmas'] },
  { id: 'f-11', name: 'Party Popper', type: 'emoji', value: '🎉', category: 'festivals', tags: ['party', 'popper', 'congrats', 'sale', 'new year'] },
  { id: 'f-12', name: 'Confetti Ball', type: 'emoji', value: '🎊', category: 'festivals', tags: ['confetti', 'celebration', 'grand'] },
  { id: 'f-13', name: 'Hibiscus Flower', type: 'emoji', value: '🌺', category: 'festivals', tags: ['flower', 'puja', 'marigold', 'ganesh', 'auspicious'] },
  { id: 'f-14', name: 'Lotus Blossom', type: 'emoji', value: '🪷', category: 'festivals', tags: ['lotus', 'lakshmi', 'puja', 'sacred'] },
  { id: 'f-15', name: 'Crescent Moon', type: 'emoji', value: '🌙', category: 'festivals', tags: ['moon', 'eid', 'ramadan', 'night'] },
  { id: 'f-16', name: 'Glowing Star', type: 'emoji', value: '⭐', category: 'festivals', tags: ['star', 'favorite', 'rating', 'special'] },
  { id: 'f-17', name: 'Dizzy Star', type: 'emoji', value: '💫', category: 'festivals', tags: ['dizzy', 'shooting star', 'sparkle'] },
  { id: 'f-18', name: 'India Flag', type: 'emoji', value: '🇮🇳', category: 'festivals', tags: ['india', 'independence', 'republic', 'national'] },
  { id: 'f-19', name: 'Dove of Peace', type: 'emoji', value: '🕊️', category: 'festivals', tags: ['dove', 'peace', 'freedom', 'national'] },
  { id: 'f-20', name: 'Flame Fire', type: 'emoji', value: '🔥', category: 'festivals', tags: ['fire', 'flame', 'hot deal', 'bonfire', 'lohri'] },
  { id: 'f-21', name: 'FA Wand Magic', type: 'fa', value: 'fa-solid fa-wand-magic-sparkles', category: 'festivals', tags: ['wand', 'magic', 'sparkles', 'festival'] },
  { id: 'f-22', name: 'FA Gift', type: 'fa', value: 'fa-solid fa-gift', category: 'festivals', tags: ['gift', 'present', 'box'] },
  { id: 'f-23', name: 'FA Bell', type: 'fa', value: 'fa-solid fa-bell', category: 'festivals', tags: ['bell', 'ring', 'alert'] },
  { id: 'f-24', name: 'FA Snowflake', type: 'fa', value: 'fa-solid fa-snowflake', category: 'festivals', tags: ['snow', 'winter'] },
  { id: 'f-25', name: 'FA Palette', type: 'fa', value: 'fa-solid fa-palette', category: 'festivals', tags: ['palette', 'colors', 'holi'] },
  { id: 'f-26', name: 'FA Moon', type: 'fa', value: 'fa-solid fa-moon', category: 'festivals', tags: ['moon', 'eid', 'night'] },
  { id: 'f-27', name: 'FA Star', type: 'fa', value: 'fa-solid fa-star', category: 'festivals', tags: ['star', 'festive'] },
  { id: 'f-28', name: 'FA Champagne Glasses', type: 'fa', value: 'fa-solid fa-champagne-glasses', category: 'festivals', tags: ['toast', 'new year', 'cheers'] },

  // ─── 2. Dental & Clinical Healthcare ───
  { id: 'd-1', name: 'Tooth Emoji', type: 'emoji', value: '🦷', category: 'dental', tags: ['tooth', 'dental', 'teeth', 'dentist'] },
  { id: 'd-2', name: 'FA Single Tooth', type: 'fa', value: 'fa-solid fa-tooth', category: 'dental', tags: ['tooth', 'molar', 'dental'] },
  { id: 'd-3', name: 'FA Teeth Set', type: 'fa', value: 'fa-solid fa-teeth', category: 'dental', tags: ['teeth', 'denture', 'prostho'] },
  { id: 'd-4', name: 'FA Teeth Open', type: 'fa', value: 'fa-solid fa-teeth-open', category: 'dental', tags: ['smile', 'open', 'ortho'] },
  { id: 'd-5', name: 'FA Doctor / Dentist', type: 'fa', value: 'fa-solid fa-user-doctor', category: 'dental', tags: ['doctor', 'dentist', 'clinician', 'surgeon'] },
  { id: 'd-6', name: 'FA Dental Clinic', type: 'fa', value: 'fa-solid fa-hospital', category: 'dental', tags: ['hospital', 'clinic', 'center'] },
  { id: 'd-7', name: 'FA Syringe / Anesthesia', type: 'fa', value: 'fa-solid fa-syringe', category: 'dental', tags: ['syringe', 'injection', 'needle'] },
  { id: 'd-8', name: 'FA Stethoscope', type: 'fa', value: 'fa-solid fa-stethoscope', category: 'dental', tags: ['stethoscope', 'checkup', 'diagnostics'] },
  { id: 'd-9', name: 'FA Medicine Pills', type: 'fa', value: 'fa-solid fa-pills', category: 'dental', tags: ['pills', 'pharma', 'antibiotics'] },
  { id: 'd-10', name: 'FA Medical Kit', type: 'fa', value: 'fa-solid fa-kit-medical', category: 'dental', tags: ['kit', 'first aid', 'emergency'] },
  { id: 'd-11', name: 'FA Shield Virus', type: 'fa', value: 'fa-solid fa-shield-virus', category: 'dental', tags: ['hygiene', 'sterilization', 'autoclave', 'safety'] },
  { id: 'd-12', name: 'FA Microscope', type: 'fa', value: 'fa-solid fa-microscope', category: 'dental', tags: ['microscope', 'lab', 'endo', 'research'] },
  { id: 'd-13', name: 'FA Bandage', type: 'fa', value: 'fa-solid fa-bandage', category: 'dental', tags: ['bandage', 'care', 'surgery'] },
  { id: 'd-14', name: 'FA Bone / Implant', type: 'fa', value: 'fa-solid fa-bone', category: 'dental', tags: ['bone', 'graft', 'implant'] },
  { id: 'd-15', name: 'FA Heart Pulse', type: 'fa', value: 'fa-solid fa-heart-pulse', category: 'dental', tags: ['heart', 'pulse', 'vitals'] },
  { id: 'd-16', name: 'FA Droplet / Water', type: 'fa', value: 'fa-solid fa-droplet', category: 'dental', tags: ['water', 'blood', 'irrigation'] },

  // ─── 3. Deals, Sales & Discounts ───
  { id: 's-1', name: 'FA Discount Tag', type: 'fa', value: 'fa-solid fa-tag', category: 'deals', tags: ['tag', 'coupon', 'discount', 'price'] },
  { id: 's-2', name: 'FA Multi Tags', type: 'fa', value: 'fa-solid fa-tags', category: 'deals', tags: ['tags', 'offers', 'categories'] },
  { id: 's-3', name: 'FA Percentage Off', type: 'fa', value: 'fa-solid fa-percent', category: 'deals', tags: ['percent', 'off', 'discount', 'ratio'] },
  { id: 's-4', name: 'FA Flash Bolt', type: 'fa', value: 'fa-solid fa-bolt', category: 'deals', tags: ['bolt', 'flash sale', 'lightning', 'fast'] },
  { id: 's-5', name: 'FA Lightning Bold', type: 'fa', value: 'fa-solid fa-bolt-lightning', category: 'deals', tags: ['flash', 'electric', 'power deal'] },
  { id: 's-6', name: 'FA Fire Hot Deal', type: 'fa', value: 'fa-solid fa-fire', category: 'deals', tags: ['fire', 'hot deal', 'trending', 'viral'] },
  { id: 's-7', name: 'FA Flame Curved', type: 'fa', value: 'fa-solid fa-fire-flame-curved', category: 'deals', tags: ['flame', 'mega sale', 'diwali'] },
  { id: 's-8', name: 'FA Gold Trophy', type: 'fa', value: 'fa-solid fa-trophy', category: 'deals', tags: ['trophy', 'winner', 'top brand'] },
  { id: 's-9', name: 'FA Award Ribbon', type: 'fa', value: 'fa-solid fa-award', category: 'deals', tags: ['award', 'certified', 'bestseller'] },
  { id: 's-10', name: 'FA VIP Crown', type: 'fa', value: 'fa-solid fa-crown', category: 'deals', tags: ['crown', 'vip', 'premium', 'exclusive'] },
  { id: 's-11', name: 'FA Gold Coins', type: 'fa', value: 'fa-solid fa-coins', category: 'deals', tags: ['coins', 'money', 'bright points', 'cashback'] },
  { id: 's-12', name: 'FA Wallet', type: 'fa', value: 'fa-solid fa-wallet', category: 'deals', tags: ['wallet', 'balance', 'credits'] },
  { id: 's-13', name: 'FA Price Ribbon', type: 'fa', value: 'fa-solid fa-ribbon', category: 'deals', tags: ['ribbon', 'badge', 'guarantee'] },
  { id: 's-14', name: 'FA Badge Percent', type: 'fa', value: 'fa-solid fa-badge-percent', category: 'deals', tags: ['badge', 'deal', 'promo'] },

  // ─── 4. E-Commerce & Logistics ───
  { id: 'e-1', name: 'FA Shopping Cart', type: 'fa', value: 'fa-solid fa-cart-shopping', category: 'ecommerce', tags: ['cart', 'shop', 'order', 'basket'] },
  { id: 'e-2', name: 'FA Shopping Bag', type: 'fa', value: 'fa-solid fa-bag-shopping', category: 'ecommerce', tags: ['bag', 'shopping', 'store'] },
  { id: 'e-3', name: 'FA Express Truck', type: 'fa', value: 'fa-solid fa-truck-fast', category: 'ecommerce', tags: ['truck', 'express delivery', 'shipping', 'transit'] },
  { id: 'e-4', name: 'FA Delivery Box', type: 'fa', value: 'fa-solid fa-box-open', category: 'ecommerce', tags: ['box', 'parcel', 'dispatch'] },
  { id: 'e-5', name: 'FA Inventory Stack', type: 'fa', value: 'fa-solid fa-boxes-stacked', category: 'ecommerce', tags: ['boxes', 'stock', 'warehouse', 'catalog'] },
  { id: 'e-6', name: 'FA Receipt Bill', type: 'fa', value: 'fa-solid fa-receipt', category: 'ecommerce', tags: ['receipt', 'invoice', 'gst', 'tax'] },
  { id: 'e-7', name: 'FA Credit Card', type: 'fa', value: 'fa-solid fa-credit-card', category: 'ecommerce', tags: ['payment', 'card', 'checkout'] },
  { id: 'e-8', name: 'FA Shield Halved', type: 'fa', value: 'fa-solid fa-shield-halved', category: 'ecommerce', tags: ['shield', 'secure', 'safety', 'warranty'] },
  { id: 'e-9', name: 'FA Location Pin', type: 'fa', value: 'fa-solid fa-location-dot', category: 'ecommerce', tags: ['location', 'address', 'pin'] },
  { id: 'e-10', name: 'FA Storefront', type: 'fa', value: 'fa-solid fa-store', category: 'ecommerce', tags: ['store', 'shop', 'market'] },
  { id: 'e-11', name: 'Shopping Cart Emoji', type: 'emoji', value: '🛒', category: 'ecommerce', tags: ['cart', 'basket'] },
  { id: 'e-12', name: 'Shopping Bags Emoji', type: 'emoji', value: '🛍️', category: 'ecommerce', tags: ['bags', 'sale'] },

  // ─── 5. UI, Actions & Navigation ───
  { id: 'u-1', name: 'FA Heart Wishlist', type: 'fa', value: 'fa-solid fa-heart', category: 'ui', tags: ['heart', 'love', 'wishlist', 'favorite'] },
  { id: 'u-2', name: 'FA Check Mark', type: 'fa', value: 'fa-solid fa-check', category: 'ui', tags: ['check', 'done', 'yes'] },
  { id: 'u-3', name: 'FA Circle Check', type: 'fa', value: 'fa-solid fa-circle-check', category: 'ui', tags: ['success', 'verified', 'approved'] },
  { id: 'u-4', name: 'FA Close Mark', type: 'fa', value: 'fa-solid fa-xmark', category: 'ui', tags: ['close', 'remove', 'cancel', 'exit'] },
  { id: 'u-5', name: 'FA Search Glass', type: 'fa', value: 'fa-solid fa-magnifying-glass', category: 'ui', tags: ['search', 'find', 'explore'] },
  { id: 'u-6', name: 'FA Filter Funnel', type: 'fa', value: 'fa-solid fa-filter', category: 'ui', tags: ['filter', 'refine', 'sort'] },
  { id: 'u-7', name: 'FA Clock Timer', type: 'fa', value: 'fa-solid fa-clock', category: 'ui', tags: ['clock', 'time', 'validity', 'history'] },
  { id: 'u-8', name: 'FA Hourglass', type: 'fa', value: 'fa-solid fa-hourglass-half', category: 'ui', tags: ['hourglass', 'countdown', 'limited'] },
  { id: 'u-9', name: 'FA Megaphone', type: 'fa', value: 'fa-solid fa-bullhorn', category: 'ui', tags: ['megaphone', 'announcement', 'broadcast'] },
  { id: 'u-10', name: 'FA Share Nodes', type: 'fa', value: 'fa-solid fa-share-nodes', category: 'ui', tags: ['share', 'referral', 'connect'] },
  { id: 'u-11', name: 'FA Info Circle', type: 'fa', value: 'fa-solid fa-circle-info', category: 'ui', tags: ['info', 'help', 'tooltip'] },
  { id: 'u-12', name: 'FA Triangle Exclamation', type: 'fa', value: 'fa-solid fa-triangle-exclamation', category: 'ui', tags: ['warning', 'alert', 'danger'] },
  { id: 'u-13', name: 'FA Gear Settings', type: 'fa', value: 'fa-solid fa-gear', category: 'ui', tags: ['settings', 'config', 'options'] },
  { id: 'u-14', name: 'FA Arrow Right', type: 'fa', value: 'fa-solid fa-arrow-right', category: 'ui', tags: ['arrow', 'next', 'forward'] },
  { id: 'u-15', name: 'FA Arrow Left', type: 'fa', value: 'fa-solid fa-arrow-left', category: 'ui', tags: ['arrow', 'back', 'previous'] },
  { id: 'u-16', name: 'FA Copy Files', type: 'fa', value: 'fa-solid fa-copy', category: 'ui', tags: ['copy', 'clipboard', 'duplicate'] },

  // ─── 6. Expressive Emojis ───
  { id: 'm-1', name: 'Money Bag', type: 'emoji', value: '💰', category: 'emojis', tags: ['money', 'cash', 'discount', 'savings'] },
  { id: 'm-2', name: 'Gem Stone', type: 'emoji', value: '💎', category: 'emojis', tags: ['diamond', 'gem', 'premium', 'luxury'] },
  { id: 'm-3', name: 'Rocket', type: 'emoji', value: '🚀', category: 'emojis', tags: ['rocket', 'launch', 'fast', 'express'] },
  { id: 'm-4', name: 'Sun Radiant', type: 'emoji', value: '☀️', category: 'emojis', tags: ['sun', 'bright', 'summer'] },
  { id: 'm-5', name: 'Rainbow', type: 'emoji', value: '🌈', category: 'emojis', tags: ['rainbow', 'holi', 'vibrant'] },
  { id: 'm-6', name: 'Crown King', type: 'emoji', value: '👑', category: 'emojis', tags: ['crown', 'royal', 'gold'] },
  { id: 'm-7', name: 'Heart Red', type: 'emoji', value: '❤️', category: 'emojis', tags: ['heart', 'love', 'doctor'] },
  { id: 'm-8', name: 'Clapping Hands', type: 'emoji', value: '👏', category: 'emojis', tags: ['clap', 'bravo', 'congrats'] },
  { id: 'm-9', name: 'Thumbs Up', type: 'emoji', value: '👍', category: 'emojis', tags: ['like', 'approve', 'best'] },
  { id: 'm-10', name: 'Hundred Percent', type: 'emoji', value: '💯', category: 'emojis', tags: ['hundred', 'perfect', 'guarantee'] },
  { id: 'm-11', name: 'Smiling Doctor', type: 'emoji', value: '👨‍⚕️', category: 'emojis', tags: ['dentist', 'doctor', 'clinic'] },
  { id: 'm-12', name: 'Hospital Building', type: 'emoji', value: '🏥', category: 'emojis', tags: ['clinic', 'hospital'] },
];

export type CategoryFilter = 'all' | 'festivals' | 'dental' | 'deals' | 'ecommerce' | 'ui' | 'emojis';
export type CopyFormat = 'raw' | 'class' | 'react';

export const IconLibraryPage: React.FC = () => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [copyFormat, setCopyFormat] = useState<CopyFormat>('raw');
  const [recentlyCopiedId, setRecentlyCopiedId] = useState<string | null>(null);
  const [scratchpadText, setScratchpadText] = useState('');

  // Category Tabs Configuration
  const categories: { key: CategoryFilter; label: string; icon: string }[] = [
    { key: 'all', label: 'All Icons', icon: 'fa-solid fa-shapes' },
    { key: 'festivals', label: 'Festivals & Occasions', icon: 'fa-solid fa-wand-magic-sparkles' },
    { key: 'dental', label: 'Dental & Clinic', icon: 'fa-solid fa-tooth' },
    { key: 'deals', label: 'Deals & Discounts', icon: 'fa-solid fa-tag' },
    { key: 'ecommerce', label: 'E-Commerce & Orders', icon: 'fa-solid fa-cart-shopping' },
    { key: 'ui', label: 'UI & Controls', icon: 'fa-solid fa-sliders' },
    { key: 'emojis', label: 'Expressive Emojis', icon: 'fa-solid fa-face-smile' },
  ];

  // Filtered Icons
  const filteredIcons = useMemo(() => {
    let result = ICONS_CATALOG;

    if (activeCategory !== 'all') {
      result = result.filter((item) => item.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.value.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [activeCategory, searchQuery]);

  // Handle 1-Click Copy
  const handleCopyIcon = (icon: IconItem) => {
    let textToCopy = '';

    if (icon.type === 'emoji') {
      textToCopy = icon.value;
    } else {
      if (copyFormat === 'raw' || copyFormat === 'class') {
        textToCopy = icon.value; // e.g. "fa-solid fa-tooth"
      } else if (copyFormat === 'react') {
        textToCopy = `<i className="${icon.value}" />`;
      }
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
      setRecentlyCopiedId(icon.id);
      showToast(`✓ Copied "${textToCopy}" to clipboard!`, 'success');

      // Auto update scratchpad preview
      setScratchpadText(textToCopy);

      setTimeout(() => {
        setRecentlyCopiedId(null);
      }, 2000);
    }).catch(() => {
      showToast('Could not copy to clipboard automatically.', 'danger');
    });
  };

  return (
    <AdminLayout
      title="Icons & Emoji Library"
      subtitle="Explore, search, and 1-click copy hundreds of festive, dental, commercial, and interface icons."
    >
      <div className="admin-page-container icon-library-page">
        {/* Navigation Breadcrumb & Action Bar */}
        <div className="icon-library-header-bar">
          <div className="header-info-group">
            <div className="header-icon-badge">
              <i className="fa-solid fa-icons" />
            </div>
            <div className="header-titles">
              <h1>Icon &amp; Festive Graphics Library</h1>
              <p>Click any icon card to instantly copy its code or emoji to clipboard</p>
            </div>
          </div>

          <div className="header-actions-group">
            <Link to="/admin/festival-theme/create" className="btn-admin-primary">
              <i className="fa-solid fa-wand-magic-sparkles" /> Back to Festival Theme
            </Link>
          </div>
        </div>

        {/* Controls Card: Search & Copy Format Switcher */}
        <div className="icon-controls-card">
          <div className="controls-top-row">
            {/* Search Input */}
            <div className="search-wrapper">
              <i className="fa-solid fa-magnifying-glass search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search icons by name, keyword, diwali, tooth, gift, star, tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              )}
            </div>

            {/* Copy Format Selector */}
            <div className="format-switcher-group">
              <span className="format-label">Copy Format:</span>
              <div className="format-buttons-row">
                <button
                  type="button"
                  className={`format-btn ${copyFormat === 'raw' ? 'active' : ''}`}
                  onClick={() => setCopyFormat('raw')}
                  title="Copy as raw emoji or fontawesome class (e.g. 🪔 or fa-solid fa-tooth)"
                >
                  Emoji / Code
                </button>
                <button
                  type="button"
                  className={`format-btn ${copyFormat === 'class' ? 'active' : ''}`}
                  onClick={() => setCopyFormat('class')}
                  title="Copy as CSS class name (e.g. fa-solid fa-tooth)"
                >
                  CSS Class
                </button>
                <button
                  type="button"
                  className={`format-btn ${copyFormat === 'react' ? 'active' : ''}`}
                  onClick={() => setCopyFormat('react')}
                  title="Copy as React JSX tag (e.g. <i className='fa-solid fa-tooth' />)"
                >
                  JSX Tag
                </button>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="category-pills-row">
            {categories.map((cat) => {
              const count =
                cat.key === 'all'
                  ? ICONS_CATALOG.length
                  : ICONS_CATALOG.filter((i) => i.category === cat.key).length;

              return (
                <button
                  key={cat.key}
                  type="button"
                  className={`cat-pill-btn ${activeCategory === cat.key ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.key)}
                >
                  <i className={cat.icon} />
                  <span>{cat.label}</span>
                  <span className="cat-count-badge">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Paste & Test Scratchpad Bar */}
        <div className="scratchpad-bar">
          <span className="scratchpad-label">
            <i className="fa-solid fa-clipboard-check" />
            Last Copied Icon:
          </span>
          <input
            type="text"
            className="scratchpad-input"
            value={scratchpadText}
            onChange={(e) => setScratchpadText(e.target.value)}
            placeholder="Click an icon below or paste here to test..."
          />
          <span className="scratchpad-hint">
            Ready to paste in Festival Theme Banner or Product Badges!
          </span>
        </div>

        {/* Results Count & Instructions */}
        <div className="icons-results-header">
          <span className="results-count">
            Showing <strong>{filteredIcons.length}</strong> icon(s)
            {activeCategory !== 'all' && ` in "${categories.find((c) => c.key === activeCategory)?.label}"`}
            {searchQuery && ` matching "${searchQuery}"`}
          </span>
          <span className="copy-tip">
            <i className="fa-solid fa-mouse-pointer" /> 1-Click to Copy
          </span>
        </div>

        {/* Icons Grid */}
        {filteredIcons.length > 0 ? (
          <div className="icons-grid">
            {filteredIcons.map((icon) => {
              const isCopied = recentlyCopiedId === icon.id;

              return (
                <div
                  key={icon.id}
                  className={`icon-card ${isCopied ? 'is-copied' : ''}`}
                  onClick={() => handleCopyIcon(icon)}
                  title={`Click to copy ${icon.name} (${icon.value})`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCopyIcon(icon);
                    }
                  }}
                >
                  {/* Floating Action Badge on Hover / Copied */}
                  {isCopied ? (
                    <span className="copied-floating-badge">
                      <i className="fa-solid fa-check" /> Copied!
                    </span>
                  ) : (
                    <span className="icon-hover-copy-badge">
                      <i className="fa-solid fa-copy" /> Copy
                    </span>
                  )}

                  {/* Icon Visual Render */}
                  <div className="icon-preview-box">
                    {icon.type === 'emoji' ? (
                      <span>{icon.value}</span>
                    ) : (
                      <i className={icon.value} />
                    )}
                  </div>

                  {/* Icon Info */}
                  <span className="icon-name" title={icon.name}>{icon.name}</span>
                  <span className="icon-tag-badge">{icon.value}</span>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="icons-empty-state">
            <i className="fa-solid fa-magnifying-glass empty-icon" />
            <h3>No Icons Found</h3>
            <p>We couldn't find any icons matching "{searchQuery}". Try a different search term or reset filters.</p>
            <button
              type="button"
              className="btn-reset-filters"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
            >
              <i className="fa-solid fa-rotate-left" /> Reset All Filters
            </button>
          </div>
        )}

         
      </div>
    </AdminLayout>
  );
};

export default IconLibraryPage;
