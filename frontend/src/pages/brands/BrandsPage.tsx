/**
 * BuyBright Official Brands Directory & Showcase Page.
 * Modern, high-end marketplace design matching the BuyBright design system.
 * Features:
 * - ShopHeaderBanner with official manufacturer trust metrics
 * - Top Featured Brand Spotlight Carousel
 * - Interactive Specialty Tabs & A-Z Quick Jump Bar
 * - Live Search Filter
 * - Modern Brand Cards with crisp logo images, country origins, and product counts
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
  isBuyBrightSuggests?: boolean;
}

export const BRAND_LIST: BrandItem[] = [
  {
    name: 'Apple',
    slug: 'apple',
    logoUrl: '/images/brands/apple.svg',
    country: 'USA',
    countryFlag: '🇺🇸',
    specialty: 'Smartphones, MacBooks & Wearables',
    brandColor: '#0f172a',
    isFeatured: true,
    isTopBrand: true,
    isNewlyAdded: false,
    isBuyBrightSuggests: true,
  },
  {
    name: 'Sony',
    slug: 'sony',
    logoUrl: '/images/brands/sony.svg',
    country: 'Japan',
    countryFlag: '🇯🇵',
    specialty: 'Wireless Audio, Cameras & Gaming',
    brandColor: '#000000',
    isFeatured: true,
    isTopBrand: true,
    isNewlyAdded: false,
    isBuyBrightSuggests: true,
  },
  {
    name: 'Samsung',
    slug: 'samsung',
    logoUrl: '/images/brands/samsung.svg',
    country: 'South Korea',
    countryFlag: '🇰🇷',
    specialty: 'Galaxy Smart Devices & Displays',
    brandColor: '#034ea2',
    isFeatured: true,
    isTopBrand: true,
    isNewlyAdded: false,
    isBuyBrightSuggests: true,
  },
  {
    name: 'Dell',
    slug: 'dell',
    logoUrl: '/images/brands/dell.svg',
    country: 'USA',
    countryFlag: '🇺🇸',
    specialty: 'Laptops, Monitors & Workstations',
    brandColor: '#007db8',
    isFeatured: true,
    isTopBrand: true,
    isNewlyAdded: false,
    isBuyBrightSuggests: true,
  },
  {
    name: 'boAt',
    slug: 'boat',
    logoUrl: '/images/brands/boat.svg',
    country: 'India',
    countryFlag: '🇮🇳',
    specialty: 'TWS Earbuds & Smartwatches',
    brandColor: '#e11d48',
    isFeatured: true,
    isTopBrand: true,
    isNewlyAdded: false,
    isBuyBrightSuggests: true,
  },
  {
    name: 'Nike',
    slug: 'nike',
    logoUrl: '/images/brands/nike.svg',
    country: 'USA',
    countryFlag: '🇺🇸',
    specialty: 'Athletic Footwear & Activewear',
    brandColor: '#111827',
    isFeatured: true,
    isTopBrand: true,
    isNewlyAdded: false,
    isBuyBrightSuggests: true,
  },
  {
    name: 'Adidas',
    slug: 'adidas',
    logoUrl: '/images/brands/adidas.svg',
    country: 'Germany',
    countryFlag: '🇩🇪',
    specialty: 'Performance Sportswear & Running Shoes',
    brandColor: '#000000',
    isFeatured: true,
    isTopBrand: true,
    isNewlyAdded: false,
    isBuyBrightSuggests: true,
  },
  {
    name: "Levi's",
    slug: 'levis',
    logoUrl: '/images/brands/levis.svg',
    country: 'USA',
    countryFlag: '🇺🇸',
    specialty: 'Original Denim & Casual Wear',
    brandColor: '#c41230',
    isFeatured: true,
    isTopBrand: true,
    isNewlyAdded: false,
    isBuyBrightSuggests: true,
  },
  {
    name: 'Philips',
    slug: 'philips',
    logoUrl: '/images/brands/philips.svg',
    country: 'Netherlands',
    countryFlag: '🇳🇱',
    specialty: 'Personal Grooming & Kitchen Appliances',
    brandColor: '#0b5ed7',
    isFeatured: true,
    isTopBrand: true,
    isNewlyAdded: false,
    isBuyBrightSuggests: false,
  },
  {
    name: 'Dyson',
    slug: 'dyson',
    logoUrl: '/images/brands/dyson.svg',
    country: 'UK',
    countryFlag: '🇬🇧',
    specialty: 'Cordless Vacuums & Air Purifiers',
    brandColor: '#581c87',
    isFeatured: true,
    isTopBrand: true,
    isNewlyAdded: true,
    isBuyBrightSuggests: true,
  },
  {
    name: 'Instant Pot',
    slug: 'instant-pot',
    logoUrl: '/images/brands/instant-pot.svg',
    country: 'Canada',
    countryFlag: '🇨🇦',
    specialty: 'Smart Multi-Cookers & Air Fryers',
    brandColor: '#ea580c',
    isFeatured: true,
    isTopBrand: false,
    isNewlyAdded: true,
    isBuyBrightSuggests: true,
  },
  {
    name: "L'Oréal Paris",
    slug: 'loreal',
    logoUrl: '/images/brands/loreal.svg',
    country: 'France',
    countryFlag: '🇫🇷',
    specialty: 'Advanced Skincare & Hair Treatments',
    brandColor: '#0f172a',
    isFeatured: true,
    isTopBrand: true,
    isNewlyAdded: false,
    isBuyBrightSuggests: true,
  },
  {
    name: 'Nivea',
    slug: 'nivea',
    logoUrl: '/images/brands/nivea.svg',
    country: 'Germany',
    countryFlag: '🇩🇪',
    specialty: 'Dermatological Body Care & Moisturizers',
    brandColor: '#003399',
    isFeatured: false,
    isTopBrand: true,
    isNewlyAdded: false,
    isBuyBrightSuggests: true,
  },
  {
    name: 'Decathlon',
    slug: 'decathlon',
    logoUrl: '/images/brands/decathlon.svg',
    country: 'France',
    countryFlag: '🇫🇷',
    specialty: 'Outdoor Adventure & Gym Equipment',
    brandColor: '#0082c3',
    isFeatured: true,
    isTopBrand: true,
    isNewlyAdded: false,
    isBuyBrightSuggests: true,
  },
  {
    name: 'Penguin Books',
    slug: 'penguin',
    logoUrl: '/images/brands/penguin.svg',
    country: 'UK',
    countryFlag: '🇬🇧',
    specialty: 'Bestseller Fiction & World Literature',
    brandColor: '#ff6600',
    isFeatured: true,
    isTopBrand: true,
    isNewlyAdded: false,
    isBuyBrightSuggests: true,
  },
  {
    name: 'HarperCollins',
    slug: 'harpercollins',
    logoUrl: '/images/brands/harpercollins.svg',
    country: 'USA',
    countryFlag: '🇺🇸',
    specialty: 'Educational, Non-Fiction & Academic Texts',
    brandColor: '#dc2626',
    isFeatured: false,
    isTopBrand: false,
    isNewlyAdded: true,
    isBuyBrightSuggests: true,
  },
];

export type BrandTabId = 'all' | 'top' | 'new' | 'featured' | 'suggested';

export const BRAND_CATEGORY_TABS: { id: BrandTabId; label: string; icon: string }[] = [
  { id: 'all', label: 'All Brands', icon: 'fa-solid fa-border-all' },
  { id: 'top', label: 'Top Brands', icon: 'fa-solid fa-crown' },
  { id: 'new', label: 'Newly Added Brands', icon: 'fa-solid fa-sparkles' },
  { id: 'featured', label: 'Featured Brands', icon: 'fa-solid fa-star' },
  { id: 'suggested', label: 'BuyBright Recommends', icon: 'fa-solid fa-thumbs-up' },
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
    document.title = 'Official Authorized Brands Directory | BuyBright';
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
      if (selectedBrandTab === 'suggested' && !b.isBuyBrightSuggests) return false;

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
        title="Authorized Marketplace Brands Directory | BuyBright"
        description="Explore 16+ verified consumer brand partners and shop genuine products with manufacturer warranty from Apple, Sony, Samsung, Nike, Dyson, Philips, and more."
        canonicalUrl="https://buybright.com/brands"
        keywords="marketplace brands, verified brands, apple, sony, samsung, nike, adidas, levis, dyson, philips, decathlon"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Authorized Marketplace Brands Directory",
          "url": "https://buybright.com/brands",
          "description": "BuyBright Official Brands Directory featuring certified brand manufacturers and authorized sellers.",
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
        totalProductsCount={2400}
        badgeText="100% BRAND AUTHORIZED • 16+ VERIFIED GLOBAL PARTNERS"
        badgeIcon="fa-solid fa-certificate"
        title="Authorized Global & National "
        highlightText="Marketplace Brands"
        description="Shop directly from certified manufacturers and verified authorized sellers. Enjoy guaranteed 100% genuine inventory with official GST input tax invoices and direct manufacturer replacement warranties."
        breadcrumbLabel="Authorized Brands"
        metrics={[
          {
            icon: 'fa-solid fa-shield-check',
            iconColorClass: 'text-teal',
            title: '16+ Verified Partners',
            subtitle: 'Direct Brand Stock',
          },
          {
            icon: 'fa-solid fa-truck-fast',
            iconColorClass: 'text-coral',
            title: '24-48h Dispatch',
            subtitle: 'Express Pan-India Transit',
          },
          {
            icon: 'fa-solid fa-award',
            iconColorClass: 'text-yellow',
            title: 'Brand Warranty',
            subtitle: 'Official Manufacturer Coverage',
          },
        ]}
      />

      {/* 2. Top Spotlight Featured Brands Bar */}
      <section className="brands-spotlight-section mt-3">
        <div className="brands-spotlight-container">
          <div className="spotlight-header">
            <div className="spotlight-header-left">
              <span className="spotlight-eyebrow">
                <i className="fa-solid fa-crown" /> MARKETPLACE LEADERS
              </span>
              <h2 className="spotlight-title">Featured Partner Spotlight</h2>
            </div>
            <span className="spotlight-count-badge">Top Verified Brands</span>
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

      {/* 3. Search & Interactive Category Filters Bar */}
      <section className="brands-filters-sticky-bar">
        <div className="filters-bar-container">
          {/* Search Row */}
          <div className="filters-search-row">
            <div className="brand-search-input-wrap">
              <i className="fa-solid fa-magnifying-glass search-icon" />
              <input
                type="text"
                placeholder="Search brand logos by name, country, or category..."
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                aria-label="Search brand logos"
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

          {/* Brand Category Tabs (All Brands, Top Brands, Newly Added Brands, Featured Brands, BuyBright Recommends) */}
          <div className="specialty-pills-row">
            <div className="specialty-pills-scroll">
              {BRAND_CATEGORY_TABS.map((tab) => {
                const isActive = selectedBrandTab === tab.id;
                let tabCount = BRAND_LIST.length;
                if (tab.id === 'top') tabCount = BRAND_LIST.filter((b) => b.isTopBrand).length;
                else if (tab.id === 'new') tabCount = BRAND_LIST.filter((b) => b.isNewlyAdded).length;
                else if (tab.id === 'featured') tabCount = BRAND_LIST.filter((b) => b.isFeatured).length;
                else if (tab.id === 'suggested') tabCount = BRAND_LIST.filter((b) => b.isBuyBrightSuggests).length;

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
              <p>No brand matches your active filter or search query "{brandSearch}".</p>
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
