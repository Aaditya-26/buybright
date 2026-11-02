/**
 * BuyBright Homepage View.
 * Aggregates all storefront sections with 6 alternating sets of:
 * [1 Row Product Section (6 cards)] -> [1 Showcase / Promotional Ads Section]
 */

import React, { useState, useEffect } from 'react';
import type { Category, Product, ShowcaseItem } from '../types';
import { dentalService } from '../services/dentalService';
import { HeroSlider } from '../components/home/HeroSlider';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { ProductCatalog } from '../components/home/ProductCatalog';
import { ShowcaseCards } from '../components/home/ShowcaseCards';
import { SuperendoBrand } from '../components/home/SuperendoBrand';
import { PromoBanners } from '../components/home/PromoBanners';
import { AboutSection } from '../components/home/AboutSection';
import { FlashDealsSection } from '../components/home/FlashDealsSection';
import { SEO } from '../components/common/SEO';
import { getAdSections } from '../admin/data/homeData';

interface HomePageProps {
  searchQuery?: string;
}

export const HomePage: React.FC<HomePageProps> = ({ searchQuery }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [superendoProducts, setSuperendoProducts] = useState<Product[]>([]);
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [cats, feat, superendo, showcase] = await Promise.all([
          dentalService.getCategories(),
          dentalService.getFeaturedProducts(selectedCategory, searchQuery),
          dentalService.getSuperendoProducts(),
          dentalService.getShowcaseItems(),
        ]);

        if (isMounted) {
          setCategories(cats);
          setFeaturedProducts(feat);
          setSuperendoProducts(superendo);
          setShowcaseItems(showcase);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to load storefront data', err);
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, searchQuery]);

  if (isLoading && categories.length === 0) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading BuyBright Catalog...</span>
        </div>
      </div>
    );
  }

  // Distinct product subsets for each section with smooth horizontal arrow scrolling
  const set1Products = featuredProducts.slice(0, 12);
  const set2Superendo = superendoProducts.slice(0, 12);
  const set3Products = featuredProducts.slice(6, 18).length >= 6
    ? featuredProducts.slice(6, 18)
    : featuredProducts;
  const set4Superendo = superendoProducts.slice(6, 18).length >= 6
    ? superendoProducts.slice(6, 18)
    : superendoProducts;
  const set5Products = featuredProducts.slice(12, 24).length >= 6
    ? featuredProducts.slice(12, 24)
    : featuredProducts;
  const set6Superendo = superendoProducts.slice(12, 24).length >= 6
    ? superendoProducts.slice(12, 24)
    : superendoProducts;

  // Configured Advertisement Sections (Limit 3 per section, Total 6)
  const adSections = getAdSections();
  const adSection1 = adSections.find((s) => s.id === 'section-1');
  const adSection2 = adSections.find((s) => s.id === 'section-2');

  const ad1Banners = adSection1?.items?.map((it) => ({
    image: it.image,
    alt: it.altText || it.title || 'BuyBright Promotion',
    title: it.title || 'Shop Clinical Supplies',
    link: it.link || '/shop',
    order: it.order,
  })) || (adSection1?.images.map((img, i) => ({
    image: img,
    alt: `Promotion #${i + 1}`,
    title: `Shop Promotion #${i + 1}`,
    link: adSection1.links?.[i] || '/shop',
    order: adSection1.orders?.[i] || (i + 1),
  })));

  const ad2Banners = adSection2?.items?.map((it) => ({
    image: it.image,
    alt: it.altText || it.title || 'BuyBright Equipment Promo',
    title: it.title || 'Shop Dental Handpieces & Equipment',
    link: it.link || '/shop',
    order: it.order,
  })) || (adSection2?.images.map((img, i) => ({
    image: img,
    alt: `Equipment Promo #${i + 1}`,
    title: `Shop Equipment Promo #${i + 1}`,
    link: adSection2.links?.[i] || '/shop',
    order: adSection2.orders?.[i] || (i + 1),
  })));

  return (
    <div className="homepage-wrapper">
      <SEO
        title="India's Trusted Dental Supply Platform"
        description="BuyBright provides authentic dental supplies, rotary endodontic files, composite materials, dental equipment, and consumables direct from authorized brand distributors across India."
        canonicalUrl="https://buybright.com/"
        ogImage="/images/logo.webp"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "MedicalBusiness",
          "name": "BuyBright",
          "url": "https://buybright.com",
          "logo": "https://buybright.com/images/logo.webp",
          "image": "https://buybright.com/images/f1.png",
          "description": "BuyBright provides authentic dental supplies, endodontic files, dental equipment, and dental materials direct to clinics across India.",
          "telephone": "+91-98765-43210",
          "priceRange": "₹₹",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "IN"
          }
        }}
      />

      {/* 1. Hero Dynamic Slider */}
      <HeroSlider />

      {/* 2. Specialties & Categories Grid */}
      <CategoryGrid
        categories={categories}
        onSelectCategory={(slug) => setSelectedCategory(slug)}
      />

      {/* 3. Modern Flash Deals & Lightning Offers Section */}
      <FlashDealsSection />

      {/* =========================================================================
          SET 1: Featured Products (6 Cards) -> First Advertisement (3 Banners)
          ========================================================================= */}
      <ProductCatalog
        id="products-set-1"
        eyebrow="FEATURED PRODUCTS"
        title="Top Selling Dental Supplies"
        viewAllLink="/shop?sortBy=featured"
        products={set1Products}
        activeCategory={selectedCategory}
        onCategoryChange={(cat) => setSelectedCategory(cat)}
      />

      <ShowcaseCards
        id="showcase-set-1"
        items={showcaseItems}
        banners={ad1Banners}
      />

      {/* =========================================================================
          SET 2: Brand Spotlight Superendo (6 Cards) -> Second Advertisement (3 Banners)
          ========================================================================= */}
      <SuperendoBrand products={set2Superendo} />

      <PromoBanners
        id="promo-set-2"
        banners={ad2Banners}
      />

      {/* =========================================================================
          SET 3: Doctor's Choice Dental Essentials (6 Cards) -> 3-Banner Showcase 2
          ========================================================================= */}
      <ProductCatalog
        id="products-set-3"
        eyebrow="DOCTOR'S CHOICE & DENTAL ESSENTIALS"
        title="High Demand Restorative & Impression Supplies"
        viewAllLink="/shop?category=materials"
        products={set3Products}
        activeCategory={selectedCategory}
        onCategoryChange={(cat) => setSelectedCategory(cat)}
      />

      <ShowcaseCards
        id="showcase-set-3"
        banners={[
          {
            image: '/images/show.webp',
            alt: 'Precision Dental Equipment & Diagnostic Tools',
            title: 'Shop Precision Dental Handpieces & Motors',
          },
          {
            image: '/images/Dental_supplies_e-commerce_banner_202608211734.jpeg',
            alt: 'Dental Impression & Consumables Super Deals',
            title: 'Shop Dental Impression & Consumables',
          },
          {
            image: '/images/banner1.webp',
            alt: 'Institutional Bulk Volume Pricing & 100% GST Invoicing',
            title: 'Explore Institutional Wholesale Pricing',
          },
        ]}
      />

      {/* =========================================================================
          SET 4: Precision Endodontics & Rotary Range (6 Cards) -> 2-Banner Promo 2
          ========================================================================= */}
      <ProductCatalog
        id="products-set-4"
        eyebrow="ADVANCED ENDODONTICS & SURGICAL"
        title="Rotary NiTi Files, Apex Locators & Surgical Kits"
        viewAllLink="/shop?category=endodontics"
        products={set4Superendo}
        activeCategory={selectedCategory}
        onCategoryChange={(cat) => setSelectedCategory(cat)}
      />

      <PromoBanners
        id="promo-set-4"
        banners={[
          {
            image: '/images/f2.png',
            alt: 'Pan-India Express Safe Dispatch within 24-48 Hours',
            title: 'Check Temperature-Safe Express Delivery Speeds',
          },
          {
            image: '/images/Dental_healthcare_website_banner…_202608211731.webp',
            alt: 'Direct 40+ Manufacturer Verified Genuine Warranty',
            title: 'Browse 100% Certified Authentic Dental Brands',
          },
        ]}
      />

      {/* =========================================================================
          SET 5: Diagnostic & Sterilization Care (6 Cards) -> 3-Banner Showcase 3
          ========================================================================= */}
      <ProductCatalog
        id="products-set-5"
        eyebrow="DIAGNOSTICS & STERILIZATION"
        title="Hospital Grade Diagnostics & Infection Control"
        viewAllLink="/shop?category=equipment"
        products={set5Products}
        activeCategory={selectedCategory}
        onCategoryChange={(cat) => setSelectedCategory(cat)}
      />

      <ShowcaseCards
        id="showcase-set-5"
        banners={[
          {
            image: '/images/showcase_medicept.png',
            alt: 'Medicept Extreme Lite High-Accuracy Impression VPS',
            title: 'Shop Medicept Extreme Lite VPS - ₹1,761/-',
          },
          {
            image: '/images/showcase_flufic.png',
            alt: 'Gufic Pure Flufic-150 Fast Relief Tablets',
            title: 'Shop Gufic Pure Flufic-150 - ₹255/-',
          },
          {
            image: '/images/showcase_3mespe.png',
            alt: '3M ESPE Express XT Light Body Precision Margins',
            title: 'Shop 3M ESPE Express XT Light Body - ₹2,943/-',
          },
        ]}
      />

      {/* =========================================================================
          SET 6: Bioceramic Sealers & Obturation (6 Cards) -> 2-Banner Promo 3
          ========================================================================= */}
      <ProductCatalog
        id="products-set-6"
        eyebrow="BIOCERAMIC & OBTURATION SYSTEMS"
        title="Biocompatible Root Repair, Cements & Heated Obturation"
        viewAllLink="/shop?category=endodontics"
        products={set6Superendo}
        activeCategory={selectedCategory}
        onCategoryChange={(cat) => setSelectedCategory(cat)}
      />

      <PromoBanners
        id="promo-set-6"
        banners={[
          {
            image: 'https://r2dkmedia.dentalkart.com/backend-media-uploads/HomepageImages/crown%20dt%20(1).jpg',
            alt: 'Crown & Bridge Restorative Materials',
            title: 'Shop Restorative & Crown Preparations',
          },
          {
            image: '/images/show.webp',
            alt: 'BuyBright Dental Equipment Showcase',
            title: 'Shop Dental Equipment & Diagnostic Tools',
          },
        ]}
      />

      {/* About Us Feature Section */}
      <AboutSection />
    </div>
  );
};
