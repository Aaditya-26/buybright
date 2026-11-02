/**
 * BuyBright Official Brands Directory & Showcase Page.
 * Modern, high-end design matching the BuyBright design system.
 * Features:
 * - ShopHeaderBanner with official manufacturer trust metrics
 * - Top Featured Brand Spotlight Carousel
 * - Interactive Specialty Tabs & A-Z Quick Jump Bar
 * - Live Search Filter
 * - Modern Luxury Brand Cards with crisp logo images, country origins, and product counts
 * - Bottom Trust Features
 * - Full SEO and JSON-LD schema
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopHeaderBanner } from '../../components/shop/ShopHeaderBanner';
import { SEO } from '../../components/common/SEO';

export interface BrandItem {
  name: string;
  slug: string;
  logoUrl: string;
  country: string;
  countryFlag: string;
  specialty: string;
  brandColor: string;
  isFeatured?: boolean;
  isTopBrand?: boolean;
  isNewlyAdded?: boolean;
  isPrestodentalSuggests?: boolean;
}

export const BRAND_LIST: BrandItem[] = [
  {
    name: 'SUPERENDO',
    slug: 'superendo',
    logoUrl: '/images/brands/superendo.svg',
    country: 'India',
    countryFlag: '🇮🇳',
    specialty: 'Rotary NiTi Files & Bioceramics',
    brandColor: '#008080',
    isFeatured: true,
    isTopBrand: true,
    isNewlyAdded: false,
    isPrestodentalSuggests: true,
  },
  {
    name: '3M ESPE',
    slug: '3m-espe',
    logoUrl: '/images/brands/3m-espe.svg',
    country: 'USA',
    countryFlag: '🇺🇸',
    specialty: 'Composites & Universal Adhesives',
    brandColor: '#cf4032',
    isFeatured: true,
    isTopBrand: true,
    isNewlyAdded: false,
    isPrestodentalSuggests: true,
  },
  {
    name: 'Dentsply Sirona',
    slug: 'dentsply-sirona',
    logoUrl: '/images/brands/dentsply-sirona.svg',
    country: 'Germany / USA',
    countryFlag: '🇩🇪',
    specialty: 'ProTaper Gold & Imaging Systems',
    brandColor: '#0284c7',
    isFeatured: true,
    isTopBrand: true,
    isNewlyAdded: false,
    isPrestodentalSuggests: true,
  },
  {
    name: 'Woodpecker',
    slug: 'woodpecker',
    logoUrl: '/images/brands/woodpecker.svg',
    country: 'Global',
    countryFlag: '🌏',
    specialty: 'LED Curing Lights & Piezo Scalers',
    brandColor: '#059669',
    isFeatured: true,
    isTopBrand: true,
    isNewlyAdded: false,
    isPrestodentalSuggests: true,
  },
  {
    name: 'Ivoclar Vivadent',
    slug: 'ivoclar-vivadent',
    logoUrl: '/images/brands/ivoclar-vivadent.svg',
    country: 'Liechtenstein',
    countryFlag: '🇱🇮',
    specialty: 'Tetric N-Ceram & IPS e.max',
    brandColor: '#4f46e5',
    isFeatured: true,
    isTopBrand: true,
    isNewlyAdded: false,
    isPrestodentalSuggests: true,
  },
  {
    name: 'GC Dental',
    slug: 'gc-dental',
    logoUrl: '/images/brands/gc-dental.svg',
    country: 'Japan',
    countryFlag: '🇯🇵',
    specialty: 'Fuji Glass Ionomer Cements',
    brandColor: '#d97706',
    isFeatured: true,
    isTopBrand: true,
    isNewlyAdded: false,
    isPrestodentalSuggests: true,
  },
  {
    name: 'Waldent',
    slug: 'waldent',
    logoUrl: '/images/brands/waldent.svg',
    country: 'India',
    countryFlag: '🇮🇳',
    specialty: 'Air Rotors & Dental Devices',
    brandColor: '#0369a1',
    isFeatured: true,
    isTopBrand: true,
    isNewlyAdded: false,
    isPrestodentalSuggests: true,
  },
  {
    name: 'Mani Japan',
    slug: 'mani-japan',
    logoUrl: '/images/brands/mani-japan.svg',
    country: 'Japan',
    countryFlag: '🇯🇵',
    specialty: 'Diamond Burs & Hand K-Files',
    brandColor: '#dc2626',
    isFeatured: true,
    isTopBrand: true,
    isNewlyAdded: false,
    isPrestodentalSuggests: true,
  },
  {
    name: 'Kerr Dental',
    slug: 'kerr-dental',
    logoUrl: '/images/brands/kerr-dental.svg',
    country: 'USA',
    countryFlag: '🇺🇸',
    specialty: 'OptiBond Universal Adhesives',
    brandColor: '#7c3aed',
    isFeatured: true,
    isTopBrand: true,
    isNewlyAdded: false,
    isPrestodentalSuggests: false,
  },
  {
    name: 'Coltene',
    slug: 'coltene',
    logoUrl: '/images/brands/coltene.svg',
    country: 'Switzerland',
    countryFlag: '🇨🇭',
    specialty: 'HyFlex CM Files & Silicones',
    brandColor: '#0d9488',
    isFeatured: false,
    isTopBrand: false,
    isNewlyAdded: true,
    isPrestodentalSuggests: true,
  },
  {
    name: 'Ultradent',
    slug: 'ultradent',
    logoUrl: '/images/brands/ultradent.svg',
    country: 'USA',
    countryFlag: '🇺🇸',
    specialty: 'Opalescence & Ultra-Etch 35%',
    brandColor: '#ea580c',
    isFeatured: true,
    isTopBrand: true,
    isNewlyAdded: false,
    isPrestodentalSuggests: true,
  },
  {
    name: 'Shofu Dental',
    slug: 'shofu-dental',
    logoUrl: '/images/brands/shofu-dental.svg',
    country: 'Japan',
    countryFlag: '🇯🇵',
    specialty: 'Beautifil Giomer & Super-Snap',
    brandColor: '#e11d48',
    isFeatured: false,
    isTopBrand: false,
    isNewlyAdded: true,
    isPrestodentalSuggests: true,
  },
  {
    name: 'VDW Dental',
    slug: 'vdw-dental',
    logoUrl: '/images/brands/vdw-dental.svg',
    country: 'Germany',
    countryFlag: '🇩🇪',
    specialty: 'RECIPROC Blue & Endo Motors',
    brandColor: '#2563eb',
    isFeatured: true,
    isTopBrand: false,
    isNewlyAdded: true,
    isPrestodentalSuggests: true,
  },
  {
    name: 'Hu-Friedy',
    slug: 'hu-friedy',
    logoUrl: '/images/brands/hu-friedy.svg',
    country: 'USA',
    countryFlag: '🇺🇸',
    specialty: 'Immunity Steel Surgical Forceps',
    brandColor: '#475569',
    isFeatured: false,
    isTopBrand: true,
    isNewlyAdded: false,
    isPrestodentalSuggests: true,
  },
  {
    name: 'Septodont',
    slug: 'septodont',
    logoUrl: '/images/brands/septodont.svg',
    country: 'France',
    countryFlag: '🇫🇷',
    specialty: 'Anesthetics & Biodentine XP',
    brandColor: '#0284c7',
    isFeatured: true,
    isTopBrand: true,
    isNewlyAdded: false,
    isPrestodentalSuggests: true,
  },
  {
    name: 'Medicept',
    slug: 'medicept',
    logoUrl: '/images/brands/medicept.svg',
    country: 'UK / Global',
    countryFlag: '🇬🇧',
    specialty: 'Impression Putty & Liners',
    brandColor: '#0891b2',
    isFeatured: false,
    isTopBrand: false,
    isNewlyAdded: true,
    isPrestodentalSuggests: false,
  },
  {
    name: 'PrestoCare',
    slug: 'prestocare',
    logoUrl: '/images/brands/prestocare.svg',
    country: 'India',
    countryFlag: '🇮🇳',
    specialty: 'Nitrile Gloves & Sterilization',
    brandColor: '#3f788c',
    isFeatured: true,
    isTopBrand: false,
    isNewlyAdded: true,
    isPrestodentalSuggests: true,
  },
];

export type BrandTabId = 'all' | 'top' | 'new' | 'featured' | 'suggested';

export const BRAND_CATEGORY_TABS: { id: BrandTabId; label: string; icon: string }[] = [
  { id: 'all', label: 'All Brands', icon: 'fa-solid fa-border-all' },
  { id: 'top', label: 'Top Brands', icon: 'fa-solid fa-crown' },
  { id: 'new', label: 'Newly Added Brands', icon: 'fa-solid fa-sparkles' },
  { id: 'featured', label: 'Featured Brands', icon: 'fa-solid fa-star' },
  { id: 'suggested', label: 'Prestodental Suggests', icon: 'fa-solid fa-thumbs-up' },
];

export const BrandsPage: React.FC = () => {
  const navigate = useNavigate();

  // Filter States
  const [brandSearch, setBrandSearch] = useState<string>('');
  const [selectedBrandTab, setSelectedBrandTab] = useState<BrandTabId>('all');
  const [selectedLetter, setSelectedLetter] = useState<string>('ALL');

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Official Authorized Dental Brands | BuyBright';
  }, []);

  // Alphabet list from available brands
  const alphabetLetters = useMemo(() => {
    const letters = new Set<string>();
    BRAND_LIST.forEach((b) => {
      const firstChar = b.name.charAt(0).toUpperCase();
      if (/^[A-Z]$/.test(firstChar)) {
        letters.add(firstChar);
      } else {
        letters.add('#');
      }
    });
    return ['ALL', ...Array.from(letters).sort()];
  }, []);

  // Featured Spotlight Brands
  const featuredBrands = useMemo(() => {
    return BRAND_LIST.filter((b) => b.isFeatured);
  }, []);

  // Filtered Brands
  const filteredBrands = useMemo(() => {
    return BRAND_LIST.filter((b) => {
      if (brandSearch.trim()) {
        const q = brandSearch.toLowerCase().trim();
        const matchesName = b.name.toLowerCase().includes(q);
        const matchesCountry = b.country.toLowerCase().includes(q);
        const matchesSpecialty = b.specialty.toLowerCase().includes(q);
        if (!matchesName && !matchesCountry && !matchesSpecialty) {
          return false;
        }
      }

      if (selectedBrandTab === 'top' && !b.isTopBrand) return false;
      if (selectedBrandTab === 'new' && !b.isNewlyAdded) return false;
      if (selectedBrandTab === 'featured' && !b.isFeatured) return false;
      if (selectedBrandTab === 'suggested' && !b.isPrestodentalSuggests) return false;

      if (selectedLetter !== 'ALL') {
        const first = b.name.charAt(0).toUpperCase();
        if (selectedLetter === '#') {
          if (/^[A-Z]$/.test(first)) return false;
        } else if (first !== selectedLetter) {
          return false;
        }
      }

      return true;
    });
  }, [brandSearch, selectedBrandTab, selectedLetter]);

  // Handle clicking a brand card -> Navigates directly to Shop page filtered by this brand
  const handleSelectBrand = (brand: BrandItem) => {
    navigate(`/shop?brand=${encodeURIComponent(brand.name)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pd-brands-page-wrapper shop-page-wrapper">
      <SEO
        title="Authorized Dental Brands Directory | BuyBright"
        description="Explore 17+ certified dental brand logos and shop genuine dental supplies from SUPERENDO, 3M ESPE, Dentsply Sirona, Woodpecker, Ivoclar, GC, Mani, and Kerr."
        canonicalUrl="https://buybright.com/brands"
        keywords="dental brands, dental brand logos, superendo, 3m ESPE, dentsply sirona, ivoclar vivadent, gc dental, mani japan"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Authorized Dental Brands Directory",
          "url": "https://buybright.com/brands",
          "description": "BuyBright Official Brands Directory featuring certified dental manufacturers.",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://buybright.com/" },
              { "@type": "ListItem", "position": 2, "name": "Brands", "item": "https://buybright.com/brands" },
            ],
          },
        }}
      />

      {/* 1. Official Standardized Shop Header Banner */}
      <ShopHeaderBanner
        totalProductsCount={1200}
        badgeText="100% FACTORY DIRECT • 17+ VERIFIED DENTAL PARTNERS"
        badgeIcon="fa-solid fa-certificate"
        title="Authorized Global & National "
        highlightText="Dental Brands"
        description="Shop directly from certified dental manufacturers. Enjoy guaranteed 100% genuine inventory with full GST input tax invoices, cold-chain assurance, and direct replacement warranties."
        breadcrumbLabel="Authorized Brands"
        metrics={[
          {
            icon: 'fa-solid fa-shield-check',
            iconColorClass: 'text-teal',
            title: '17+ Verified Partners',
            subtitle: 'Direct Manufacturer Stock',
          },
          {
            icon: 'fa-solid fa-truck-fast',
            iconColorClass: 'text-coral',
            title: '24-48h Dispatch',
            subtitle: 'Pan-India Transit',
          },
          {
            icon: 'fa-solid fa-award',
            iconColorClass: 'text-yellow',
            title: 'Direct Warranty',
            subtitle: 'Replacement Assured',
          },
        ]}
      />

      {/* 2. Top Spotlight Featured Brands Bar */}
      <section className="brands-spotlight-section mt-3">
        <div className="brands-spotlight-container">
          <div className="spotlight-header">
            <div className="spotlight-header-left">
              <span className="spotlight-eyebrow">
                <i className="fa-solid fa-crown" /> NATIONAL DENTAL LEADERS
              </span>
              <h2 className="spotlight-title">Featured Partner Spotlight</h2>
            </div>
            <span className="spotlight-count-badge">Top 8 Dentist Choices</span>
          </div>

          <div className="spotlight-cards-track">
            {featuredBrands.map((brand) => (
              <div
                key={`spotlight-${brand.slug}`}
                className="spotlight-brand-card"
                onClick={() => handleSelectBrand(brand)}
                role="button"
                tabIndex={0}
                title={`Click to shop ${brand.name} products`}
              >
                <div className="spotlight-logo-wrap">
                  <img src={brand.logoUrl} alt={`${brand.name} Logo`} className="spotlight-logo-img" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Search & Interactive Specialty Filters Bar */}
      <section className="brands-filters-sticky-bar">
        <div className="filters-bar-container">
          {/* Search Row */}
          <div className="filters-search-row">
            <div className="brand-search-input-wrap">
              <i className="fa-solid fa-magnifying-glass search-icon" />
              <input
                type="text"
                placeholder="Search brand logos by name, country, or dental specialty..."
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                aria-label="Search dental brand logos"
              />
              {brandSearch && (
                <button
                  type="button"
                  className="btn-clear-search"
                  onClick={() => setBrandSearch('')}
                  aria-label="Clear brand search"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              )}
            </div>

            {/* Quick Count Tag */}
            <div className="filters-status-wrap">
              <span className="brand-results-count">
                Showing <strong>{filteredBrands.length}</strong> of {BRAND_LIST.length} Brands
              </span>
            </div>
          </div>

          {/* Brand Category Tabs (All Brands, Top Brands, Newly Added Brands, Featured Brands, Prestodental Suggests) */}
          <div className="specialty-pills-row">
            <div className="specialty-pills-scroll">
              {BRAND_CATEGORY_TABS.map((tab) => {
                const isActive = selectedBrandTab === tab.id;
                let tabCount = BRAND_LIST.length;
                if (tab.id === 'top') tabCount = BRAND_LIST.filter((b) => b.isTopBrand).length;
                else if (tab.id === 'new') tabCount = BRAND_LIST.filter((b) => b.isNewlyAdded).length;
                else if (tab.id === 'featured') tabCount = BRAND_LIST.filter((b) => b.isFeatured).length;
                else if (tab.id === 'suggested') tabCount = BRAND_LIST.filter((b) => b.isPrestodentalSuggests).length;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    className={`specialty-pill-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedBrandTab(tab.id)}
                  >
                    <i className={tab.icon} />
                    <span>{tab.label}</span>
                    <span className="pill-count">{tabCount}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Alphabet Quick Jump Bar */}
          <div className="alphabet-jump-row">
            <span className="jump-label">Quick Jump:</span>
            <div className="alphabet-pills-wrap">
              {alphabetLetters.map((char) => (
                <button
                  key={char}
                  type="button"
                  className={`alphabet-btn ${selectedLetter === char ? 'active' : ''}`}
                  onClick={() => setSelectedLetter(char)}
                >
                  {char}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Main Brand Cards Grid */}
      <section className="brands-main-directory-section">
        <div className="brands-directory-container">
          {filteredBrands.length === 0 ? (
            <div className="empty-brands-box">
              <div className="empty-icon-wrap">
                <i className="fa-solid fa-box-open" />
              </div>
              <h3>No Brand Found</h3>
              <p>No dental brand matches your active filter or search query "{brandSearch}".</p>
              <button
                type="button"
                className="btn-reset-brands-filter"
                onClick={() => {
                  setBrandSearch('');
                  setSelectedBrandTab('all');
                  setSelectedLetter('ALL');
                }}
              >
                <i className="fa-solid fa-rotate-left" /> Reset All Filters
              </button>
            </div>
          ) : (
            <div className="modern-brands-grid">
              {filteredBrands.map((brand) => (
                <div
                  key={brand.slug}
                  className="modern-brand-card"
                  onClick={() => handleSelectBrand(brand)}
                  role="button"
                  tabIndex={0}
                  title={`Click to shop ${brand.name} official products`}
                >
                  <div className="brand-card-logo-frame">
                    <img
                      src={brand.logoUrl}
                      alt={`${brand.name} Brand Logo`}
                      className="brand-card-logo-image"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BrandsPage;
