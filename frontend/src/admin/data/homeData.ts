/**
 * Home Page Module Data & Persistence Helpers.
 * Manages Home Banners (with two buttons and SEO) and Home Advertisements (up to 3 images) for BuyBright.
 */

import type { HomeBanner, HomeAdvertisement, AdSectionItem } from '../types/home';
export type { AdSectionItem };

export const initialHomeBanners: HomeBanner[] = [
  {
    id: 'ban-1',
    srNo: 1,
    title: 'Next-Gen Electronics & Smart Gadgets',
    subtitle: 'Top Smartphones, Wireless Noise-Canceling Audio, Smartwatches & Laptops from Verified Sellers',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1200&auto=format&fit=crop',
    button1Text: 'Explore Electronics',
    button1Url: '/shop?category=electronics',
    button2Text: 'Trending Tech',
    button2Url: '/shop',
    seoTitle: 'BuyBright - Advanced Consumer Electronics & Smart Gadgets',
    seoDescription: 'Order high-performance laptops, smartphones, audio devices, and smart wearables with nationwide express delivery.',
    seoAltText: 'Modern smart electronics and laptop showcase banner',
    displayOrder: 1,
    status: 'Active',
    createdAt: '10 Jan 2026',
  },
  {
    id: 'ban-2',
    srNo: 2,
    title: 'Trending Fashion & Premium Apparel',
    subtitle: 'Curated Men’s & Women’s Fashion, Activewear, Footwear & Accessories with 7-Day Easy Returns',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop',
    button1Text: 'Shop Fashion',
    button1Url: '/shop?category=fashion',
    button2Text: 'New Arrivals',
    button2Url: '/shop',
    seoTitle: 'Fashion & Apparel Collection | BuyBright Marketplace',
    seoDescription: 'Explore the latest fashion trends, comfortable activewear, and designer accessories from top brands.',
    seoAltText: 'Contemporary fashion and lifestyle apparel banner',
    displayOrder: 2,
    status: 'Active',
    createdAt: '15 Jan 2026',
  },
  {
    id: 'ban-3',
    srNo: 3,
    title: 'Modern Home, Kitchen & Living Essentials',
    subtitle: 'Smart Cookware, Air Fryers, Home Decor & Organizational Essentials for Modern Living',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop',
    button1Text: 'View Home & Kitchen',
    button1Url: '/shop?category=home-kitchen',
    button2Text: 'Best Sellers',
    button2Url: '/shop',
    seoTitle: 'Home & Kitchen Essentials - BuyBright',
    seoDescription: 'Upgrade your living space and kitchen with modern, high-efficiency appliances and cookware.',
    seoAltText: 'Modern kitchen appliances and home living banner',
    displayOrder: 3,
    status: 'Active',
    createdAt: '01 Feb 2026',
  },
  {
    id: 'ban-4',
    srNo: 4,
    title: 'Sports, Fitness & Outdoor Adventure Gear',
    subtitle: 'Pro Gym Equipment, Training Gear, Yoga Essentials & Sports Accessories with Fast Shipping',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
    button1Text: 'Order Sports Gear',
    button1Url: '/shop?category=sports',
    button2Text: 'Explore Catalog',
    button2Url: '/shop',
    seoTitle: 'Sports, Fitness & Training Equipment | BuyBright India',
    seoDescription: 'Premium workout equipment, fitness gear, and active lifestyle accessories.',
    seoAltText: 'Sports fitness and active training equipment banner',
    displayOrder: 4,
    status: 'Active',
    createdAt: '20 Feb 2026',
  },
];

export const initialAdSections: AdSectionItem[] = [
  {
    id: 'section-1',
    name: 'First Advertisement',
    placement: 'Hero Bottom Triple Promo Strip',
    maxImages: 3,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600&auto=format&fit=crop',
    ],
    links: [
      '/shop?category=electronics',
      '/shop?category=electronics',
      '/shop?category=home-kitchen',
    ],
    orders: [1, 2, 3],
    displayOrder: 1,
    items: [
      {
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop',
        link: '/shop?category=electronics',
        order: 1,
        title: 'Noise-Canceling Wireless Earbuds - ₹2,499/-',
        altText: 'Noise-Canceling Wireless Earbuds Pro',
      },
      {
        image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=600&auto=format&fit=crop',
        link: '/shop?category=electronics',
        order: 2,
        title: 'Smart Fitness Tracker Pro - ₹1,899/-',
        altText: 'Smart Fitness Tracker with Heart Rate Monitor',
      },
      {
        image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600&auto=format&fit=crop',
        link: '/shop?category=home-kitchen',
        order: 3,
        title: 'Ceramic Non-Stick Cookware Set - ₹3,299/-',
        altText: 'Ceramic Non-Stick Kitchen Cookware Collection',
      },
    ],
    status: 'Active',
    updatedAt: '10 Nov 2026',
  },
  {
    id: 'section-2',
    name: 'Second Advertisement',
    placement: 'Mid-Page Dual Promo Banners',
    maxImages: 2,
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop',
    ],
    links: [
      '/shop?category=electronics',
      '/shop?category=home-kitchen',
    ],
    orders: [1, 2],
    displayOrder: 2,
    items: [
      {
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop',
        link: '/shop?category=electronics',
        order: 1,
        title: 'Smart Audio & Lifestyle Tech Showcase',
        altText: 'BuyBright Audio Equipment Showcase',
      },
      {
        image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop',
        link: '/shop?category=home-kitchen',
        order: 2,
        title: 'Modern Living & Home Styling Collection',
        altText: 'Modern Home Decor and Living Essentials',
      },
    ],
    status: 'Active',
    updatedAt: '10 Nov 2026',
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
  image: sec.images[0] || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop',
  placement: sec.placement,
  status: sec.status,
  maxImages: 3,
}));

// LocalStorage Persistence Keys
const BANNERS_STORAGE_KEY = 'buybright_admin_home_banners';
const ADS_STORAGE_KEY = 'buybright_admin_home_advertisements';
const AD_SECTIONS_STORAGE_KEY = 'buybright_admin_ad_sections_tabs_v1';

export function getHomeBanners(): HomeBanner[] {
  try {
    const raw = localStorage.getItem(BANNERS_STORAGE_KEY) || localStorage.getItem('buybright_admin_home_banners');
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
    const raw = localStorage.getItem(AD_SECTIONS_STORAGE_KEY) || localStorage.getItem('buybright_admin_ad_sections_tabs_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return initialAdSections;
}

export function saveAdSections(sections: AdSectionItem[]): void {
  try {
    localStorage.setItem(AD_SECTIONS_STORAGE_KEY, JSON.stringify(sections));
  } catch {
    // fallback
  }
}

export function getHomeAds(): HomeAdvertisement[] {
  try {
    const raw = localStorage.getItem(ADS_STORAGE_KEY) || localStorage.getItem('buybright_admin_home_advertisements');
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return initialHomeAds;
}

export function saveHomeAds(ads: HomeAdvertisement[]): void {
  try {
    localStorage.setItem(ADS_STORAGE_KEY, JSON.stringify(ads));
  } catch {
    // fallback
  }
}
