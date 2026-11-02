/**
 * Home Page Module Type Definitions for BuyBright Admin.
 * Data types for Homepage Hero Banners (with two buttons, festival images, badges & SEO) and Advertisements (up to 3 images).
 */

export interface HomeBanner {
  id: string;
  srNo: number;
  title: string;
  subtitle: string;
  image: string;
  // Festival / Decorative Side Images
  leftFestivalImage?: string;
  rightFestivalImage?: string;
  // Badge Labels
  mainBadge?: string;
  subBadge1?: string;
  subBadge2?: string;
  subBadge3?: string;
  subBadge4?: string;
  // CTA Buttons
  button1Text: string;
  button1Url: string;
  button2Text?: string;
  button2Url?: string;
  // SEO Configuration
  seoTitle?: string;
  seoDescription?: string;
  seoAltText?: string;
  displayOrder: number;
  status: 'Active' | 'Inactive';
  createdAt?: string;
  // Backwards compatibility
  buttonText?: string;
  targetUrl?: string;
}

export interface AdImageItem {
  id?: string;
  image: string;
  link: string;
  order: number;
  title?: string;
  altText?: string;
}

export interface AdSectionItem {
  id: string;
  name: string;
  maxImages: number; // 3 max for Section 1, 2 max for Section 2 (Total 5)
  images: string[];
  links?: string[];
  orders?: number[];
  items?: AdImageItem[];
  placement?: string;
  displayOrder?: number;
  status: 'Active' | 'Inactive';
  updatedAt?: string;
}

export interface HomeAdvertisement {
  id: string;
  srNo?: number;
  title?: string;
  subtitle?: string;
  images: string[];
  links?: string[];
  orders?: number[];
  items?: AdImageItem[];
  image?: string;   // Primary thumbnail
  placement?: 'Hero Bottom Strip' | 'Mid-Page Promo' | 'Categories Sidebar' | 'Deals Countdown' | 'Footer Sponsor' | string;
  targetUrl?: string;
  startDate?: string;
  endDate?: string;
  status: 'Active' | 'Inactive';
  clicksCount?: number;
  maxImages?: number;
}

