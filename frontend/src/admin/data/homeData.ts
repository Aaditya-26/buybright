/**
 * Home Page Module Mock Data & Persistence Helpers.
 * Manages Home Banners (with two buttons and SEO) and Home Advertisements (up to 3 images) for BuyBright.
 */

import type { HomeBanner, HomeAdvertisement, AdSectionItem } from '../types/home';
export type { AdSectionItem };

export const initialHomeBanners: HomeBanner[] = [
  {
    id: 'ban-1',
    srNo: 1,
    title: 'Advanced Precision Dental Instruments',
    subtitle: 'Next-Generation High-Speed Handpieces, Autoclaves & Diagnostics with 2-Year Warranty',
    image: '/images/hero_dental_banner.jpg',
    button1Text: 'Explore Collection',
    button1Url: '/shop',
    button2Text: 'Dental Equipment',
    button2Url: '/categories/diagnostic',
    seoTitle: 'BuyBright - Advanced Dental Instruments & Equipment',
    seoDescription: 'Order high-precision dentalinstruments, autoclaves, and handpieces with nationwide doorstep delivery.',
    seoAltText: 'Modern dentalprecision tools and diagnostic equipment banner',
    displayOrder: 1,
    status: 'Active',
    createdAt: '10 Jan 2025',
  },
  {
    id: 'ban-2',
    srNo: 2,
    title: 'Exclusive 3M ESPE Endodontic Supplies',
    subtitle: 'Official Certified Dental Restoratives, Cements & Impression Materials',
    image: '/images/banner1.webp',
    button1Text: 'Shop 3M Solutions',
    button1Url: '/brands/3m-espe',
    button2Text: 'View Restoratives',
    button2Url: '/categories/materials',
    seoTitle: '3M ESPE Certified Dental Products in India | BuyBright',
    seoDescription: 'Authorized stock of 3M ESPE restorative composites, glass ionomer cements, and impression trays.',
    seoAltText: '3M ESPE certified dental restoratives and bonding materials',
    displayOrder: 2,
    status: 'Active',
    createdAt: '15 Jan 2025',
  },
  {
    id: 'ban-3',
    srNo: 3,
    title: 'Surgical Sterilization & Autoclave Units',
    subtitle: 'Class B Autoclaves, UV Chambers & Ultrasonic Cleaners for Modern Dental Clinics',
    image: '/images/banner.webp',
    button1Text: 'View Equipment',
    button1Url: '/categories/diagnostic',
    button2Text: 'Bulk Enquiries',
    button2Url: '/contact',
    seoTitle: 'Class B Dental Autoclaves & Sterilization Units - BuyBright',
    seoDescription: 'Hospital-grade autoclaves and ultrasonic cleaners designed for maximum dental operatory hygiene.',
    seoAltText: 'Class B surgical autoclave chamber for dental operatory sterilization',
    displayOrder: 3,
    status: 'Active',
    createdAt: '01 Feb 2025',
  },
  {
    id: 'ban-4',
    srNo: 4,
    title: 'Specialty Orthodontic Brackets & Wires',
    subtitle: 'NiTi Archwires, Ceramic Brackets & Pliers withBulk Discount Pricing',
    image: '/images/showcase_banner_promo.png',
    button1Text: 'Order Ortho Supplies',
    button1Url: '/categories/materials',
    button2Text: 'Download Price List',
    button2Url: '/reports',
    seoTitle: 'Orthodontic Brackets, NiTi Wires and Pliers | BuyBright India',
    seoDescription: 'Premium orthodontic solutions for dental orthodontists with volume tier pricing discounts.',
    seoAltText: 'Orthodontic brackets, wires and dental pliers assortment',
    displayOrder: 4,
    status: 'Inactive',
    createdAt: '20 Feb 2025',
  },
];

export const initialAdSections: AdSectionItem[] = [
  {
    id: 'section-1',
    name: 'First Advertisement',
    placement: 'Hero Bottom Triple Promo Strip',
    maxImages: 3,
    images: [
      '/images/showcase_medicept.png',
      '/images/showcase_flufic.png',
      '/images/showcase_3mespe.png',
    ],
    links: [
      '/shop?category=materials',
      '/shop?category=consumables',
      '/brands/3m-espe',
    ],
    orders: [1, 2, 3],
    displayOrder: 1,
    items: [
      {
        image: '/images/showcase_medicept.png',
        link: '/shop?category=materials',
        order: 1,
        title: 'Medicept Extreme Lite VPS - ₹1,761/-',
        altText: 'Medicept Extreme Lite VPS Impression Material',
      },
      {
        image: '/images/showcase_flufic.png',
        link: '/shop?category=consumables',
        order: 2,
        title: 'Gufic Pure Flufic-150 - ₹255/-',
        altText: 'Gufic Pure Flufic-150 Antifungal Medication',
      },
      {
        image: '/images/showcase_3mespe.png',
        link: '/brands/3m-espe',
        order: 3,
        title: '3M ESPE Express XT Light Body - ₹2,943/-',
        altText: '3M ESPE Express XT VPS Impression Material',
      },
    ],
    status: 'Active',
    updatedAt: '26 Sep 2026',
  },
  {
    id: 'section-2',
    name: 'Second Advertisement',
    placement: 'Mid-Page Dual Promo Banners',
    maxImages: 2,
    images: [
      '/images/show.webp',
      'https://r2dkmedia.dentalkart.com/backend-media-uploads/HomepageImages/crown%20dt%20(1).jpg',
    ],
    links: [
      '/shop?category=equipment',
      '/shop?category=materials',
    ],
    orders: [1, 2],
    displayOrder: 2,
    items: [
      {
        image: '/images/show.webp',
        link: '/shop?category=equipment',
        order: 1,
        title: 'Precision Dental Handpieces & Motors',
        altText: 'BuyBright Dental Equipment Showcase',
      },
      {
        image: 'https://r2dkmedia.dentalkart.com/backend-media-uploads/HomepageImages/crown%20dt%20(1).jpg',
        link: '/shop?category=materials',
        order: 2,
        title: 'Crown & Bridge Restorative Materials',
        altText: 'Crown & Bridge Restorative Preparations',
      },
    ],
    status: 'Active',
    updatedAt: '26 Sep 2026',
  },
];

export const initialHomeAds: HomeAdvertisement[] = initialAdSections.map((sec, idx) => ({
  id: sec.id,
  srNo: idx + 1,
  title: sec.name,
  images: sec.images,
  links: sec.links,
  orders: sec.orders,
  items: sec.items,
  image: sec.images[0] || '/images/showcase_medicept.png',
  placement: sec.placement,
  status: sec.status,
  maxImages: 3,
}));

// LocalStorage Persistence Keys
const BANNERS_STORAGE_KEY = 'prestodental_admin_home_banners';
const ADS_STORAGE_KEY = 'prestodental_admin_home_advertisements';
const AD_SECTIONS_STORAGE_KEY = 'prestodental_admin_ad_sections_tabs_v1';

export function getHomeBanners(): HomeBanner[] {
  try {
    const raw = localStorage.getItem(BANNERS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return initialHomeBanners;
}

export function saveHomeBanners(banners: HomeBanner[]): void {
  try {
    localStorage.setItem(BANNERS_STORAGE_KEY, JSON.stringify(banners));
  } catch {
    // fallback
  }
}

export function getAdSections(): AdSectionItem[] {
  try {
    const raw = localStorage.getItem(AD_SECTIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 2) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return initialAdSections;
}

export function saveAdSections(sections: AdSectionItem[]): void {
  try {
    localStorage.setItem(AD_SECTIONS_STORAGE_KEY, JSON.stringify(sections));
    // also sync to ads key
    const ads: HomeAdvertisement[] = sections.map((sec, idx) => ({
      id: sec.id,
      srNo: idx + 1,
      title: sec.name,
      images: sec.images,
      links: sec.links,
      orders: sec.orders,
      items: sec.items,
      image: sec.images[0] || '/images/banner.webp',
      placement: sec.placement,
      status: sec.status,
      maxImages: sec.maxImages || 3,
    }));
    localStorage.setItem(ADS_STORAGE_KEY, JSON.stringify(ads));
  } catch {
    // fallback
  }
}

export function getAdSection(id: string): AdSectionItem | undefined {
  const all = getAdSections();
  return all.find((s) => s.id === id) || all[0];
}

export function saveAdSection(
  id: string,
  images: string[],
  links?: string[],
  orders?: number[],
  status?: 'Active' | 'Inactive'
): void {
  const all = getAdSections();
  const target = all.find((s) => s.id === id);
  const max = target ? target.maxImages : 3;
  const updated = all.map((sec) => {
    if (sec.id === id) {
      const sliceImgs = images.slice(0, max);
      const sliceLinks = (links || sec.links || []).slice(0, max);
      const sliceOrders = (orders || sec.orders || [1, 2, 3]).slice(0, max);
      return {
        ...sec,
        images: sliceImgs,
        links: sliceLinks,
        orders: sliceOrders,
        items: sliceImgs.map((img, i) => ({
          image: img,
          link: sliceLinks[i] || '/shop',
          order: sliceOrders[i] || (i + 1),
        })),
        status: status !== undefined ? status : sec.status,
        updatedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      };
    }
    return sec;
  });
  saveAdSections(updated);
}

export function getHomeAdvertisements(): HomeAdvertisement[] {
  const sections = getAdSections();
  return sections.map((sec, idx) => ({
    id: sec.id,
    srNo: idx + 1,
    title: sec.name,
    images: sec.images,
    links: sec.links,
    orders: sec.orders,
    items: sec.items,
    image: sec.images[0] || '/images/banner.webp',
    placement: sec.placement,
    status: sec.status,
    maxImages: sec.maxImages || 3,
  }));
}

export function saveHomeAdvertisements(ads: HomeAdvertisement[]): void {
  try {
    localStorage.setItem(ADS_STORAGE_KEY, JSON.stringify(ads));
  } catch {
    // fallback
  }
}

