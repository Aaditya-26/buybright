/**
 * BuyBright Product Banners Mock Data and LocalStorage Persistence.
 * Controls promotional banners shown across Dental Shop, Product Catalog, and Category pages.
 */

import type { AdminProductBanner } from '../types/product';

export const initialProductBannersData: AdminProductBanner[] = [
  {
    id: 'pb-1',
    // Badge
    badgeText: '100% FACTORY DIRECT • AUTHORIZED DENTAL DISTRIBUTOR',
    badgeIcon: 'fa-solid fa-shield-halved',
    // Page meta
    pageHeading: 'Premium Dental Supplies',
    description: 'Explore 500+ dentist-approved consumables, instruments, and bioceramics with cold-chain shipping and direct brand warranties.',
    // Right side
    rightSideIcon: 'fa-solid fa-tooth',
    // Banner content
    heading: 'World-Class Dental Care Products',
    subheading: 'Trusted by 10,000+ dentists across India with guaranteed authenticity',
    // Legacy compat
    title: 'World-Class Dental Care Products',
    subtitle: 'Explore 500+ dentist-approved consumables, instruments, and bioceramics.',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
    targetUrl: '/shop',
    buttonText: 'Explore Catalog',
    placement: 'Shop Header Banner',
    bgColor: '#0f172a',
    discountBadge: 'Up to 35% Off Value Packs',
    status: 'Active',
    displayOrder: 1,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    seoTitle: 'Premium Dental Supplies & Equipment | BuyBright',
    seoDescription: 'Shop premium dental supplies and instruments with fast delivery across India. 10,000+ dentists trust BuyBright.',
    seoKeywords: 'dental supplies, dental equipment, dental instruments, buy dental products india',
    isNewArrival: false,
    isBestseller: true,
  },
  {
    id: 'pb-2',
    badgeText: 'FEATURED BRAND',
    badgeIcon: 'fa-solid fa-star',
    pageHeading: 'Medicept Dental Solutions',
    description: 'Advanced restorative composites and glass ionomer restorative materials trusted by top dental clinics.',
    rightSideIcon: 'fa-solid fa-flask',
    heading: 'Medicept Advanced Restoratives',
    subheading: 'Proven composites for superior aesthetics and strength',
    title: 'Medicept Dental Solutions',
    subtitle: 'Advanced restorative composites and glass ionomer restorative materials.',
    image: '/images/medicept.webp',
    targetUrl: '/shop?brand=Medicept',
    buttonText: 'SHOP NOW',
    placement: 'Promo Showcase 3-Grid',
    bgColor: '#1e293b',
    discountBadge: '25% OFF',
    status: 'Active',
    displayOrder: 2,
    seoTitle: 'Medicept Dental Products | BuyBright',
    seoDescription: 'Buy Medicept dental restorative composites and glass ionomers at best prices.',
    seoKeywords: 'medicept dental, dental composites, glass ionomer, restorative materials',
    isNewArrival: false,
    isBestseller: false,
  },
  {
    id: 'pb-3',
    badgeText: 'NEW ARRIVAL',
    badgeIcon: 'fa-solid fa-star',
    pageHeading: 'Flufic Precision Instruments',
    description: 'Ergonomic extraction forceps, periodontic probes, and diagnostic mirrors for precision dentistry.',
    rightSideIcon: 'fa-solid fa-stethoscope',
    heading: 'Flufic Precision Instruments',
    subheading: 'Ergonomically designed for superior dental outcomes',
    title: 'Flufic Precision Instruments',
    subtitle: 'Ergonomic extraction forceps, periodontic probes, and diagnostic mirrors.',
    image: '/images/flufic.webp',
    targetUrl: '/shop?category=instruments',
    buttonText: 'SHOP NOW',
    placement: 'Promo Showcase 3-Grid',
    bgColor: '#0d9488',
    discountBadge: '15% OFF',
    status: 'Active',
    displayOrder: 3,
    seoTitle: 'Flufic Dental Instruments | BuyBright',
    seoDescription: 'Buy Flufic precision dental instruments online. Best prices on forceps, probes and mirrors.',
    seoKeywords: 'flufic dental, dental instruments, extraction forceps, periodontic probe',
    isNewArrival: true,
    isBestseller: false,
  },
];

const PRODUCT_BANNERS_STORAGE_KEY = 'prestodental_admin_product_banners_v2';

export function getProductBanners(): AdminProductBanner[] {
  try {
    const raw = localStorage.getItem(PRODUCT_BANNERS_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AdminProductBanner[];
  } catch {
    // fallback
  }
  return initialProductBannersData;
}

export function saveProductBanners(banners: AdminProductBanner[]): void {
  try {
    localStorage.setItem(PRODUCT_BANNERS_STORAGE_KEY, JSON.stringify(banners));
  } catch {
    // silent fail
  }
}

export function getProductBannerById(id: string): AdminProductBanner | null {
  return getProductBanners().find((b) => b.id === id) ?? null;
}
