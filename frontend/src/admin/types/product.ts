/**
 * Product & Inventory Type Definitions for BuyBright Admin.
 * Full coverage of all 15 Add/Edit Product form sections.
 */

export type ProductStockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';
export type ProductAdminStatus = 'Active' | 'Draft' | 'Archived';
export type ProductType = 'Simple' | 'Variable' | 'Grouped' | 'External';
export type DiscountType = 'None' | 'Flat' | 'Percentage';

// ─── Section 8 ────────────────────────────────────────────────────────────────
export interface ProductVariant {
  id: string;
  packSize?: string;
  value?: string;
  mrp?: number;
  price?: number;
  sellingPrice?: number;
  stock?: number;
  hsnCode?: string;
  variantName?: string;
  variantSku?: string;
  variantImage?: string;
  brightPoints?: number;
  deliveryTime?: string;
}

// ─── Section 9 ────────────────────────────────────────────────────────────────
export interface ProductSpec {
  id: string;
  specName: string;
  value: string;
  unit: string;
  displayOrder: number;
}

// ─── Section 10 ───────────────────────────────────────────────────────────────
export interface ProductFeature {
  id: string;
  featureTitle: string;
  description: string;
  icon: string;
}

// ─── Section 13 ───────────────────────────────────────────────────────────────
export interface ProductCertification {
  id: string;
  title: string;
  description: string;
  icon: string;
  documentUrl: string;
}

// ─── Main Interface ───────────────────────────────────────────────────────────
export interface AdminProduct {
  id: string;

  // Section 1: Basic Information
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category: string;
  subCategory: string;
  productType: ProductType;
  status: ProductAdminStatus;

  // Section 2: Images & Media
  image: string;
  galleryImages: string[];
  videoUrl: string;
  videoThumbnail: string;

  // Section 3: Description
  shortDescription: string;
  description: string;
  clinicalPurpose: string;
  materialComposition: string;
  keyBenefits: string;
  applications: string;

  // Section 4: Pricing
  mrp: number;
  price: number;
  gstPercentage: string;
  gstIncluded: boolean;
  discountType: DiscountType;
  discountValue: number;
  brightPoints: number;

  // Section 5: Inventory
  stock: number;
  lowStockThreshold: number;
  stockStatus: ProductStockStatus;
  allowBackorder: boolean;

  // Section 6: Badges
  is_bestseller: boolean;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_genuine: boolean;
  is_limited_stock: boolean;
  is_authorized_partner: boolean;

  // Section 7: Delivery
  deliveryAvailable: boolean;
  deliveryType: string;
  deliveryTime: string;
  deliveryDays: string;
  freeDelivery: boolean;
  deliveryCharge: number;

  // Section 8: Variants
  variants?: any[];

  // Section 9: Technical Specifications
  technicalSpecsList?: ProductSpec[];
  technicalSpecs?: {
    sterilization?: string;
    storage?: string;
    certification?: string;
    shelfLife?: string;
    origin?: string;
  };

  // Section 10: Product Features
  features?: ProductFeature[];

  // Section 11: Packaging Information
  packageType?: string;
  packageWeight?: string;
  packageLength?: string;
  packageWidth?: string;
  packageHeight?: string;
  packageContents?: string;
  packagingDetails?: {
    dispensingFormat?: string;
    unitType?: string;
    barcodeLot?: string;
    transitProtection?: string;
  };

  // Section 12: Usage Guidelines
  usageInstructions?: string;
  precautions?: string;
  warnings?: string;
  storageInstructions?: string;
  cleaningInstructions?: string;
  usageGuidelines?: {
    step1?: string;
    step2?: string;
    step3?: string;
    step4?: string;
  };

  // Section 13: Certifications & Trust
  certifications?: ProductCertification[];

  // Section 14: Related Products
  similarProducts: string[];
  relatedProductIds: string[];
  frequentlyBoughtTogether: string[];

  // Section 15: SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;

  // Legacy / list-page compatibility fields
  rating?: number;
  reviews_count?: number;
  salesCount?: number;
  in_stock?: boolean;
  is_spotlight?: boolean;
  hsnCode?: string;
  gstRate?: string;
  expiryDate?: string;
  size?: string;
  volume_ml?: string;
  procured_count?: string;
  old_price?: number;
  discount?: string;
  brochureUrl?: string;
  featureBadge1?: string;
  featureBadge2?: string;
  featureBadge3?: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  categoryBadge?: string;
  categoryHeading?: string;
  totalProducts?: number;
  icon?: string;
  image?: string;
  images?: string;
  displayOrder?: number;
  order?: number;
  showInHome?: boolean;
  showInSidebar?: boolean;
  status?: 'Active' | 'Inactive';
}

export interface AdminSubCategory {
  id: string;
  name: string;
  slug: string;
  parentCategoryId: string;
  parentCategoryName: string;
  description: string;
  shortDescription?: string;
  totalProducts: number;
  icon?: string;
  image?: string;
  images?: string;
  displayOrder?: number;
  order?: number;
  showInMenu?: boolean;
  showInFeatured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  status: 'Active' | 'Inactive';
}

export interface AdminBrandCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  displayOrder?: number;
  status: 'Active' | 'Inactive';
  totalBrands?: number;
}

export interface AdminBrand {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  country: string;
  countryFlag: string;
  specialty: string;
  categorySlug: string;
  categoryName?: string;
  brandCategoryId?: string;
  brandCategoryName?: string;
  brandColor: string;
  website?: string;
  description?: string;
  totalProducts: number;
  isFeatured: boolean;
  status: 'Active' | 'Inactive';
  displayOrder?: number;
  sortOrder?: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

export type BannerPlacement =
  | 'Shop Header Banner'
  | 'Promo Showcase 3-Grid'
  | 'Dual Promo Card'
  | 'Brand Spotlight Strip'
  | 'Special Offer Bar';

export interface AdminProductBanner {
  id: string;
  // Badge section
  badgeText: string;
  badgeIcon: string;
  // Page meta
  pageHeading: string;
  description: string;
  // Right side metrics (matching website ShopHeaderBanner design)
  rightSideIcon?: string;
  metric1Icon?: string;
  metric1Title?: string;
  metric1Subtitle?: string;
  metric2Icon?: string;
  metric2Title?: string;
  metric2Subtitle?: string;
  highlightText?: string;
  // Banner content
  heading: string;
  subheading: string;
  // Legacy compat (used by list)
  title: string;
  subtitle: string;
  image?: string;
  targetUrl?: string;
  buttonText?: string;
  placement: BannerPlacement;
  bgColor?: string;
  discountBadge?: string;
  status: 'Active' | 'Inactive';
  displayOrder: number;
  startDate?: string;
  endDate?: string;
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  // Promotion flags (bottom checkboxes)
  isNewArrival?: boolean;
  isBestseller?: boolean;
}

export type { AdminGSTRate } from './gst';
export type { AdminHSNCode } from './hsn';
