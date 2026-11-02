/**
 * About Page Module Mock Data & Persistence Helpers.
 * Pre-populated with authentic dental content from BuyBright's About Us page.
 */

import type { AboutPageData } from '../types/about';
export type { AboutPageData };

export const initialAboutData: AboutPageData = {
  hero: {
    badgeText: "ABOUT PRESTODENTAL • INDIA'S TRUSTED DENTAL NETWORK",
    title: 'Your Trusted Partner for 100% Genuine Dental Supplies & Cold-Chain Logistics',
    highlightText: '100% Genuine Dental Supplies',
    leadText:
      "BuyBright is India's leading specialized e-commerce platform dedicated exclusively to dental surgeons, implantologists, and dental hospitals. We streamline dental procurement by connecting practitioners directly with 40+ authorized global dental manufacturers.",
    primaryBtnText: 'Explore Dental Catalog',
    primaryBtnUrl: '/shop',
    secondaryBtnText: 'Discover Our Story',
    secondaryBtnUrl: '#who-we-are',
    metrics: [
      {
        id: 'metric-1',
        number: '10,000+',
        label: 'Dental Clinics Served',
        description: 'Trusted by dentists across 500+ Indian cities and dental hubs.',
        icon: 'fa-solid fa-hospital-user',
        accentColor: '#008080',
      },
      {
        id: 'metric-2',
        number: '40+',
        label: 'Authorized Global Brands',
        description: 'Direct tie-ups with 3M, Dentsply, Superendo, Ivoclar, GC & Mani.',
        icon: 'fa-solid fa-shield-halved',
        accentColor: '#cf4032',
      },
      {
        id: 'metric-3',
        number: '24 - 48 Hrs',
        label: 'Express Safe Dispatch',
        description: 'Temperature-safe packaging for sensitive VPS & composite resins.',
        icon: 'fa-solid fa-truck-fast',
        accentColor: '#f59e0b',
      },
      {
        id: 'metric-4',
        number: '100%',
        label: 'Verified GST Invoicing',
        description: 'Instant input tax credit invoices on all institutional dental orders.',
        icon: 'fa-solid fa-file-invoice-dollar',
        accentColor: '#3b82f6',
      },
    ],
  },
  whoWeAre: {
    eyebrow: 'WHO WE ARE',
    title: 'Practitioners & Innovators Revolutionizing Dental Procurement',
    paragraph1:
      'We are a team of practicing dental surgeons, biomedical specialists, and healthcare logistics leaders who experienced the real-world frustrations of dental supply procurement — counterfeit rotary files, expired composite batches, and erratic shipping delays that disrupt dailyschedules.',
    paragraph2:
      'BuyBright was built to eliminate these risks. We operate state-of-the-art cold-storage fulfillment centers, partner exclusively with authorized direct manufacturers, and enforce strict lot number traceability so that every instrument and material in your operatory is guaranteed original and factory fresh.',
    mainImage:
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=900&auto=format&fit=crop',
    experienceBadgeNum: '100%',
    experienceBadgeText: 'Authentic Batch QC Verified',
    secondaryImage:
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=900&auto=format&fit=crop',
    highlights: [
      {
        id: 'high-1',
        title: 'Clinician-Curated Selection',
        description: 'Every product is evaluated by our dental advisory board before entering our catalog.',
        icon: 'fa-solid fa-user-doctor',
      },
      {
        id: 'high-2',
        title: 'Cold-Chain Integrity',
        description: 'Thermal insulated packing protects adhesives, impression silicones, and bioceramics.',
        icon: 'fa-solid fa-temperature-snowflake',
      },
      {
        id: 'high-3',
        title: 'Direct Brand Warranties',
        description: 'Zero gray-market goods; 100% manufacturer warranties and genuine serial tracking.',
        icon: 'fa-solid fa-certificate',
      },
    ],
  },
  missionVision: {
    eyebrow: 'GUIDING PRINCIPLES',
    title: 'Our Mission & Vision',
    subtitle:
      'The fundamental core values that drive every shipment, every brand partnership, and every customer relationship.',
    missionStatement:
      '"To empower dental practitioners across India with guaranteed authentic, batch-inspected supplies, delivered with uncompromising speed, transparent pricing, and dedicated customer support — enabling exceptional patient outcomes in every procedure."',
    missionPoints: [
      'Zero Counterfeit Tolerance: Rigorous manufacturer batch inspection & tamper-proof sealing.',
      'Accessible Pricing: Fair wholesale discounts with full GST input tax credit for clinics.',
      'Practitioner First: 24/7 dedicated support desk staffed by dental knowledgeable personnel.',
    ],
    visionStatement:
      '"To become India\'s most trusted, technologically-advanced dental procurement ecosystem — seamlessly connecting global dental innovators with dental operatories to elevate the standard of oral healthcare nationwide."',
    visionPoints: [
      'Nationwide 24-Hour Reach: Expanding smart fulfillment hubs into all Tier-2 and Tier-3 cities.',
      'Sustainable Packaging: 100% recyclable, temperature-stable eco-friendly packaging materials.',
      'SmartAutomation: One-click variant reordering and automatedstock replenishment.',
    ],
  },
  journey: {
    eyebrow: 'MILESTONES & EVOLUTION',
    title: 'Our Journey of Innovation & Trust',
    subtitle:
      "From a small initiative by practicing doctors to India's premier authorized dental supply network.",
    milestones: [
      {
        id: 'mile-1',
        year: '2020',
        tag: 'THE INCEPTION',
        title: 'Born Out of Dental Need',
        description:
          'Founded by practicing dental surgeons to eradicate counterfeit supplies, stale batch composites, and unpredictable supply chain delays for dental clinics.',
        icon: 'fa-solid fa-lightbulb',
        accentColor: '#008080',
      },
      {
        id: 'mile-2',
        year: '2022',
        tag: 'BRAND ALLIANCES',
        title: 'Direct Manufacturer Partnerships',
        description:
          'Secured direct authorized procurement channels with 25+ global leaders including 3M, Dentsply Sirona, and Superendo with genuine factory warranties.',
        icon: 'fa-solid fa-handshake-angle',
        accentColor: '#cf4032',
      },
      {
        id: 'mile-3',
        year: '2024',
        tag: 'INFRASTRUCTURE',
        title: 'Smart Cold-Chain Fulfillment Hubs',
        description:
          'Engineered temperature-controlled fulfillment vaults and thermal packaging across major transit hubs to safeguard sensitive polymers and impression silicones.',
        icon: 'fa-solid fa-temperature-arrow-down',
        accentColor: '#f59e0b',
      },
      {
        id: 'mile-4',
        year: '2026 & Beyond',
        tag: 'NATIONWIDE SCALE',
        title: '10,000+ Clinics & Smart Reordering',
        description:
          'Empowering 10,000+ dental operatories across 500+ Indian cities with 24-48h express dispatch, instant GST invoicing, and 1-click variant ordering.',
        icon: 'fa-solid fa-rocket',
        accentColor: '#3b82f6',
      },
    ],
  },
  pillars: {
    eyebrow: 'THE PRESTODENTAL STANDARD',
    title: 'The 4 Pillars of Dental Trust',
    subtitle:
      'Every product and package adheres to strict international dental distribution standards.',
    pillars: [
      {
        id: 'pil-1',
        title: 'Batch-Inspected Warehousing',
        description:
          'Physical verification, lot number logging, and expiry validation ensuring at least 18-24 months shelf life on all materials.',
        icon: 'fa-solid fa-boxes-packing',
        themeColor: '#008080',
      },
      {
        id: 'pil-2',
        title: 'Transparent Bulk Pricing',
        description:
          'Tiered volume pricing with recurring scheduled dispatches and immediate GST invoices for maximum tax savings.',
        icon: 'fa-solid fa-hand-holding-dollar',
        themeColor: '#cf4032',
      },
      {
        id: 'pil-3',
        title: 'Cold-Chain Temperature Control',
        description:
          'Insulated cooling packs prevent heat degradation during transit for light-cured resins, VPS putties, and bioceramic sealers.',
        icon: 'fa-solid fa-temperature-arrow-down',
        themeColor: '#f59e0b',
      },
      {
        id: 'pil-4',
        title: 'Hassle-Free 7-Day Returns',
        description:
          'Received an incorrect size variant or damaged transit box? Our automated returns portal initiates immediate replacements.',
        icon: 'fa-solid fa-rotate-left',
        themeColor: '#3b82f6',
      },
    ],
    ctaTag: 'EXPERIENCE THE PRESTODENTAL ADVANTAGE',
    ctaTitle: 'Ready to Upgrade YourProcurement?',
    ctaSubtitle:
      'Join 10,000+ dental surgeons and hospitals enjoying genuine products, transparent pricing, and 24-48h safe dispatch.',
    ctaBtnText: 'Browse Full Catalog',
    ctaBtnUrl: '/shop',
    ctaPhone: '+91 88064 88054',
  },
  lastUpdated: '26 Sep 2026',
};

const ABOUT_STORAGE_KEY = 'prestodental_admin_about_data_v1';

export function getAboutData(): AboutPageData {
  try {
    const raw = localStorage.getItem(ABOUT_STORAGE_KEY);
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
