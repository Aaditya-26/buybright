/**
 * About Page Module Data & Persistence Helpers.
 * Pre-populated with authentic marketplace content for BuyBright.
 */

import type { AboutPageData } from '../types/about';
export type { AboutPageData };

export const initialAboutData: AboutPageData = {
  hero: {
    badgeText: "ABOUT BUYBRIGHT • INDIA'S SMART MULTI-SELLER MARKETPLACE",
    title: 'Your Trusted Destination for 100% Genuine Products & Fast Delivery',
    highlightText: '100% Genuine Products',
    leadText:
      "BuyBright is India's premier multi-seller e-commerce marketplace connecting verified independent merchants, direct brand distributors, and modern shoppers. We deliver excellence across Electronics, Fashion, Home & Kitchen, Beauty, Sports, and Books with transparent pricing.",
    primaryBtnText: 'Explore Marketplace Catalog',
    primaryBtnUrl: '/shop',
    secondaryBtnText: 'Discover Our Story',
    secondaryBtnUrl: '#who-we-are',
    metrics: [
      {
        id: 'metric-1',
        number: '500,000+',
        label: 'Happy Shoppers Served',
        description: 'Trusted by customers across 500+ Indian cities and metro corridors.',
        icon: 'fa-solid fa-users',
        accentColor: '#008080',
      },
      {
        id: 'metric-2',
        number: '1,200+',
        label: 'Verified Merchant Partners',
        description: 'Direct manufacturer partnerships and vetted independent merchants.',
        icon: 'fa-solid fa-store',
        accentColor: '#cf4032',
      },
      {
        id: 'metric-3',
        number: '24 - 48 Hrs',
        label: 'Express Safe Dispatch',
        description: 'Automated fulfillment centers and express pan-India delivery.',
        icon: 'fa-solid fa-truck-fast',
        accentColor: '#f59e0b',
      },
      {
        id: 'metric-4',
        number: '100%',
        label: 'Verified GST Invoicing',
        description: 'Instant tax compliant invoices on all consumer and business orders.',
        icon: 'fa-solid fa-file-invoice-dollar',
        accentColor: '#3b82f6',
      },
    ],
  },
  whoWeAre: {
    eyebrow: 'WHO WE ARE',
    title: 'Builders & Innovators Powering India’s Next-Gen Marketplace',
    paragraph1:
      'We are a passionate team of e-commerce builders, engineers, and supply chain specialists on a mission to revolutionize online commerce for independent sellers and everyday consumers.',
    paragraph2:
      'BuyBright was engineered to provide transparent pricing, rapid automated fulfillment, and verified product authenticity across every category. Every seller is vetted, and every product is backed by customer-first return protection.',
    mainImage:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=900&auto=format&fit=crop',
    experienceBadgeNum: '100%',
    experienceBadgeText: 'Verified Genuine Quality',
    secondaryImage:
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=900&auto=format&fit=crop',
    highlights: [
      {
        id: 'high-1',
        title: 'Curated Marketplace Selection',
        description: 'Every product and brand partner undergoes thorough quality and authenticity checks.',
        icon: 'fa-solid fa-award',
      },
      {
        id: 'high-2',
        title: 'Pan-India Express Logistics',
        description: 'Advanced fulfillment hubs ensure swift 24-48h dispatch across tier-1, tier-2, and tier-3 cities.',
        icon: 'fa-solid fa-truck-fast',
      },
      {
        id: 'high-3',
        title: 'Direct Brand Warranties',
        description: 'Zero gray-market goods; 100% manufacturer warranty protection and genuine serialized tracking.',
        icon: 'fa-solid fa-certificate',
      },
    ],
  },
  missionVision: {
    eyebrow: 'GUIDING PRINCIPLES',
    title: 'Our Mission & Vision',
    subtitle:
      'The core values that guide our marketplace operations, seller relationships, and customer service.',
    missionStatement:
      '"To empower independent merchants and provide Indian consumers with guaranteed genuine products, transparent pricing, and lightning-fast fulfillment — creating a vibrant, fair, and frictionless marketplace for all."',
    missionPoints: [
      'Zero Counterfeit Tolerance: Strict seller onboarding verification & tamper-evident packaging.',
      'Transparent Value: Competitive everyday pricing, fair commissions, and instant GST invoices.',
      'Customer-Centric Service: 24/7 dedicated support desk with frictionless 7-day returns.',
    ],
    visionStatement:
      '"To become India\'s most trusted and beloved digital shopping platform — seamlessly connecting millions of shoppers with premier brands and exceptional local businesses."',
    visionPoints: [
      'Nationwide Express Reach: Expanding automated fulfillment nodes across all 28 states and territories.',
      'Sustainable Packaging: 100% recyclable, eco-conscious packaging materials for all orders.',
      'Smart Marketplace Tech: AI-driven personalized recommendations and real-time inventory tracking.',
    ],
  },
  journey: {
    eyebrow: 'MILESTONES & EVOLUTION',
    title: 'Our Journey of Growth & Trust',
    subtitle:
      "From an ambitious vision to India's fastest-growing multi-seller marketplace.",
    milestones: [
      {
        id: 'mile-1',
        year: '2020',
        tag: 'THE INCEPTION',
        title: 'A Vision for Fair Commerce',
        description:
          'Founded to create a transparent, reliable marketplace platform where independent sellers could reach consumers directly without predatory fees.',
        icon: 'fa-solid fa-lightbulb',
        accentColor: '#008080',
      },
      {
        id: 'mile-2',
        year: '2022',
        tag: 'MERCHANT EXPANSION',
        title: 'Onboarding 500+ Verified Sellers',
        description:
          'Expanded catalog coverage across Electronics, Fashion, and Home essentials with direct brand authorized distribution agreements.',
        icon: 'fa-solid fa-handshake-angle',
        accentColor: '#cf4032',
      },
      {
        id: 'mile-3',
        year: '2024',
        tag: 'INFRASTRUCTURE',
        title: 'Automated Fulfillment & Express Delivery',
        description:
          'Rolled out centralized warehouse automation and partnered with premier courier networks for 24-48h pan-India delivery.',
        icon: 'fa-solid fa-boxes-packing',
        accentColor: '#f59e0b',
      },
      {
        id: 'mile-4',
        year: '2026 & Beyond',
        tag: 'NATIONWIDE SCALE',
        title: '500,000+ Customers & Next-Gen Commerce',
        description:
          'Serving hundreds of thousands of satisfied buyers nationwide with instant checkout, live tracking, and dedicated buyer guarantees.',
        icon: 'fa-solid fa-rocket',
        accentColor: '#3b82f6',
      },
    ],
  },
  pillars: {
    eyebrow: 'THE BUYBRIGHT STANDARD',
    title: 'The 4 Pillars of Marketplace Trust',
    subtitle:
      'Every product, seller, and order adheres to strict quality and transparency benchmarks.',
    pillars: [
      {
        id: 'pil-1',
        title: 'Quality-Inspected Warehousing',
        description:
          'Systematic quality verification, barcode intake, and packaging checks before every dispatch.',
        icon: 'fa-solid fa-boxes-packing',
        themeColor: '#008080',
      },
      {
        id: 'pil-2',
        title: 'Transparent Everyday Pricing',
        description:
          'Zero hidden fees, authentic promotional discounts, and compliant GST invoices with every purchase.',
        icon: 'fa-solid fa-hand-holding-dollar',
        themeColor: '#cf4032',
      },
      {
        id: 'pil-3',
        title: 'Express Doorstep Delivery',
        description:
          'Real-time tracking, reliable courier partners, and priority handling across metro and non-metro corridors.',
        icon: 'fa-solid fa-truck-fast',
        themeColor: '#f59e0b',
      },
      {
        id: 'pil-4',
        title: 'Hassle-Free 7-Day Returns',
        description:
          'Enjoy complete peace of mind with simple 1-click returns, quick doorstep pickups, and fast refunds.',
        icon: 'fa-solid fa-rotate-left',
        themeColor: '#3b82f6',
      },
    ],
    ctaTag: 'EXPERIENCE THE BUYBRIGHT ADVANTAGE',
    ctaTitle: 'Ready to Upgrade Your Shopping Experience?',
    ctaSubtitle:
      'Join 500,000+ happy shoppers enjoying authentic products, verified sellers, and fast doorstep delivery.',
    ctaBtnText: 'Browse Full Catalog',
    ctaBtnUrl: '/shop',
    ctaPhone: '+91 98765 43210',
  },
  lastUpdated: '10 Nov 2026',
};

const ABOUT_STORAGE_KEY = 'buybright_admin_about_data_v1';

export function getAboutData(): AboutPageData {
  try {
    const raw = localStorage.getItem(ABOUT_STORAGE_KEY) || localStorage.getItem('prestodental_admin_about_data_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.hero && parsed.whoWeAre && parsed.missionVision && parsed.journey && parsed.pillars) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return initialAboutData;
}

export function saveAboutData(data: AboutPageData): void {
  try {
    const payload = {
      ...data,
      lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    localStorage.setItem(ABOUT_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // fallback
  }
}

export function updateAboutSection<K extends keyof AboutPageData>(
  sectionKey: K,
  sectionData: AboutPageData[K]
): AboutPageData {
  const current = getAboutData();
  const updated: AboutPageData = {
    ...current,
    [sectionKey]: sectionData,
    lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  };
  saveAboutData(updated);
  return updated;
}
