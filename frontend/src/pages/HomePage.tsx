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
    title: it.title || 'Shop Marketplace Deals',
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
    title: it.title || 'Shop Verified Electronics & Gadgets',
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
        title="BuyBright — Smart Shopping, Brilliant Savings | Multi-Seller Marketplace"
        description="Shop authentic electronics, fashion, home essentials, and lifestyle products from verified marketplace sellers across India with fast doorstep delivery."
        canonicalUrl="https://buybright.com/"
        ogImage="/images/logo.svg"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "OnlineStore",
          "name": "BuyBright",
          "url": "https://buybright.com",
          "logo": "https://buybright.com/images/logo.svg",
          "image": "https://buybright.com/images/f1.png",
          "description": "India's modern multi-seller marketplace for electronics, fashion, home & kitchen, beauty, sports, and books.",
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
        title="Top Selling Marketplace Deals"
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
          SET 2: Brand Spotlight (6 Cards) -> Second Advertisement (3 Banners)
          ========================================================================= */}
      <SuperendoBrand products={set2Superendo} />

      <PromoBanners
        id="promo-set-2"
        banners={ad2Banners}
      />

      {/* =========================================================================
          SET 3: Consumer Electronics & Smart Devices (6 Cards) -> 3-Banner Showcase 2
          ========================================================================= */}
      <ProductCatalog
        id="products-set-3"
        eyebrow="CONSUMER ELECTRONICS &amp; GADGETS"
        title="Smartphones, Wireless Audio &amp; Wearables"
        viewAllLink="/shop?category=electronics"
        products={set3Products}
        activeCategory={selectedCategory}
        onCategoryChange={(cat) => setSelectedCategory(cat)}
      />

      <ShowcaseCards
        id="showcase-set-3"
        banners={[
          {
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
            alt: 'Premium Noise-Cancelling Audio Gear',
            title: 'Shop Premium Wireless Headphones & Audio',
          },
          {
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
            alt: 'Smart Wearables & Health Trackers',
            title: 'Explore Smartwatches & Fitness Bands',
          },
          {
            image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
            alt: 'Verified Authorized Sellers & Official Invoicing',
            title: 'Shop Direct Brand Warranty Products',
          },
        ]}
      />

      {/* =========================================================================
          SET 4: Fashion & Apparel Trends (6 Cards) -> 2-Banner Promo 2
          ========================================================================= */}
      <ProductCatalog
        id="products-set-4"
        eyebrow="FASHION &amp; LIFESTYLE APPAREL"
        title="Trending Activewear, Footwear &amp; Daily Wardrobe"
        viewAllLink="/shop?category=fashion"
        products={set4Superendo}
        activeCategory={selectedCategory}
        onCategoryChange={(cat) => setSelectedCategory(cat)}
      />

      <PromoBanners
        id="promo-set-4"
        banners={[
          {
            image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
            alt: 'Pan-India Express Delivery within 24-48 Hours',
            title: 'Enjoy Fast & Reliable Doorstep Delivery',
          },
          {
            image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
            alt: 'Direct Brand Authentic Warranty',
            title: 'Browse 100% Certified Authentic Brand Partners',
          },
        ]}
      />

      {/* =========================================================================
          SET 5: Home & Kitchen Appliances (6 Cards) -> 3-Banner Showcase 3
          ========================================================================= */}
      <ProductCatalog
        id="products-set-5"
        eyebrow="HOME &amp; KITCHEN APPLIANCES"
        title="Smart Cooking, Air Purifiers &amp; Home Essentials"
        viewAllLink="/shop?category=home-kitchen"
        products={set5Products}
        activeCategory={selectedCategory}
        onCategoryChange={(cat) => setSelectedCategory(cat)}
      />

      <ShowcaseCards
        id="showcase-set-5"
        banners={[
          {
            image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80',
            alt: 'Smart Multi-Cookers & Air Fryers',
            title: 'Explore Smart Instant Pots & Air Fryers',
          },
          {
            image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80',
            alt: 'Modern Kitchen Essentials',
            title: 'Upgrade Your Home Cookware & Cutlery',
          },
          {
            image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&q=80',
            alt: 'Cordless Vacuums & Air Purifiers',
            title: 'Shop Dyson & Philips Home Tech',
          },
        ]}
      />

      {/* =========================================================================
          SET 6: Sports, Fitness & Bestselling Books (6 Cards) -> 2-Banner Promo 3
          ========================================================================= */}
      <ProductCatalog
        id="products-set-6"
        eyebrow="SPORTS, FITNESS &amp; BOOKS"
        title="Gym Equipment, Active Gear &amp; Bestseller Paperbacks"
        viewAllLink="/shop?category=sports"
        products={set6Superendo}
        activeCategory={selectedCategory}
        onCategoryChange={(cat) => setSelectedCategory(cat)}
      />

      <PromoBanners
        id="promo-set-6"
        banners={[
          {
            image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80',
            alt: 'Workout Gear & Yoga Essentials',
            title: 'Decathlon Gym Weights & Yoga Mats',
          },
          {
            image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
            alt: 'Bestseller Fiction & Literature',
            title: 'Penguin & HarperCollins Top Paperbacks',
          },
        ]}
      />

      {/* About Us Feature Section */}
      <AboutSection />
    </div>
  );
};
