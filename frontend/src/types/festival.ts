/**
 * BuyBright Festival & Campaign Theme Type Definitions.
 * Comprehensive model for managing festive campaigns, promotional banners, 
 * particle effects, announcement bars, floating badges, and coupon discounts.
 */

export type FestivalPresetType =
  | 'diwali'
  | 'holi'
  | 'christmas'
  | 'newyear'
  | 'independence'
  | 'eid'
  | 'ganesh_utsav'
  | 'navratri'
  | 'custom';

export type ParticleEffectType =
  | 'sparkles_diyas'
  | 'fireworks'
  | 'confetti'
  | 'snowflakes'
  | 'colors_splash'
  | 'marigold_flowers'
  | 'none';

export type DiscountType = 'percentage' | 'fixed';

export interface TopAnnouncementBarConfig {
  enabled: boolean;
  message: string;
  buttonText: string;
  buttonLink: string;
  showCountdown: boolean;
}

export interface FloatingRibbonConfig {
  enabled: boolean;
  position: 'bottom-right' | 'bottom-left' | 'top-right';
  title: string;
  subtitle: string;
  badgeIcon: string;
}

export interface FestivalTheme {
  id: string;
  name: string;
  preset: FestivalPresetType;
  tagline: string;
  badgeText?: string;

  // Comprehensive Coupon & Discount Rules
  couponCode: string;
  discountType: DiscountType;
  discountValue: number;
  discountPercentage?: number; // Backwards compatibility alias
  maxDiscountAmount?: number;
  minOrderAmount: number; // Minimum Cart Value (defaults to 0)
  minCartValue?: number; // Alias for minOrderAmount
  startDate: string; // Valid From *
  endDate: string; // Valid To *
  validFrom?: string; // Alias
  validTo?: string; // Alias

  // Advanced Rules
  totalUsageLimit?: number; // Total Usage Limit (Across all users)
  perUserLimit: number; // Per User Limit (Default 1)
  excludeSaleItems: boolean; // Exclude Sale Items

  // Restrictions & Customer Eligibility
  customerEligibility?: 'All Customers' | 'Specific Customer' | 'Verified Clinics' | 'VIP Members' | 'New Customers';
  targetCustomers?: string[]; // Specific customer IDs
  targetCategories: string[]; // Specific Category restrictions
  targetProducts: string[]; // Specific Product restrictions

  // Publication Status
  status: 'Active' | 'Inactive' | 'Scheduled';

  // Visual Theme & Particles
  primaryColor: string;
  secondaryColor: string;
  accentGradient: string;
  textColor: string;
  particleEffect: ParticleEffectType;
  topAnnouncementBar: TopAnnouncementBarConfig;
  floatingRibbon: FloatingRibbonConfig;

  // Optional Icons & images
  leftFestivalIcon?: string;
  rightFestivalIcon?: string;
  leftFestivalImage?: string;
  rightFestivalImage?: string;
  heroBannerOverlayImage?: string;
  bannerOverlayEnabled?: boolean;
  bannerBadgeText?: string;
  bannerImage?: string;
  leftDecorativeIcon?: string;
  rightDecorativeIcon?: string;

  createdAt: string;
  updatedAt: string;
}

export interface PresetThemeTemplate {
  preset: FestivalPresetType;
  displayName: string;
  icon: string;
  defaultName: string;
  defaultTagline: string;
  defaultBadge: string;
  defaultCoupon: string;
  discountType: DiscountType;
  defaultDiscount: number;
  maxDiscountAmount?: number;
  minOrderAmount: number;
  totalUsageLimit?: number;
  perUserLimit: number;
  excludeSaleItems: boolean;
  targetCategories?: string[];
  targetProducts?: string[];
  primaryColor: string;
  secondaryColor: string;
  accentGradient: string;
  textColor: string;
  particleEffect: ParticleEffectType;
  leftIcon: string;
  rightIcon: string;
  announcementMessage: string;
  buttonText: string;
  buttonLink: string;
}

export const FESTIVAL_PRESETS: Record<FestivalPresetType, PresetThemeTemplate> = {
  diwali: {
    preset: 'diwali',
    displayName: 'Diwali Dhamaka',
    icon: 'fa-solid fa-fire-burner',
    defaultName: 'Diwali Dental Mahotsav 2026',
    defaultTagline: 'Illuminate Your Dental Practice with Up to 50% Off on Premium Instruments & Equipment!',
    defaultBadge: '🪔 DIWALI MEGA OFFERS',
    defaultCoupon: 'DIWALI50',
    discountType: 'percentage',
    defaultDiscount: 50,
    maxDiscountAmount: 2500,
    minOrderAmount: 0,
    totalUsageLimit: 1000,
    perUserLimit: 1,
    excludeSaleItems: false,
    targetCategories: ['All Products'],
    targetProducts: [],
    primaryColor: '#b45309',
    secondaryColor: '#ea580c',
    accentGradient: 'linear-gradient(135deg, #d97706 0%, #dc2626 50%, #9333ea 100%)',
    textColor: '#ffffff',
    particleEffect: 'sparkles_diyas',
    leftIcon: '🪔',
    rightIcon: '✨',
    announcementMessage: '🪔 Diwali Grand Dental Fest is LIVE! Get Extra 15% Cashback + Free Courier Delivery across India.',
    buttonText: 'Claim Diwali Deals',
    buttonLink: '/shop?sale=diwali',
  },
  holi: {
    preset: 'holi',
    displayName: 'Holi Colors Fest',
    icon: 'fa-solid fa-palette',
    defaultName: 'Holi Colors Dental Expo',
    defaultTagline: 'Splash Colors of Joy with Flat 40% Off on Dental Disposables, Gloves & Impression Kits!',
    defaultBadge: '🎨 HOLI COLOR BLAST',
    defaultCoupon: 'HOLI40',
    discountType: 'percentage',
    defaultDiscount: 40,
    maxDiscountAmount: 2000,
    minOrderAmount: 0,
    totalUsageLimit: 500,
    perUserLimit: 1,
    excludeSaleItems: false,
    targetCategories: ['All Products'],
    targetProducts: [],
    primaryColor: '#e11d48',
    secondaryColor: '#7c3aed',
    accentGradient: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #06b6d4 100%)',
    textColor: '#ffffff',
    particleEffect: 'colors_splash',
    leftIcon: '🎨',
    rightIcon: '🌈',
    announcementMessage: '🎨 Celebrate Holi with BuyBright! Use code HOLI40 for Flat 40% discount on endodontic supplies.',
    buttonText: 'Explore Holi Offers',
    buttonLink: '/shop?sale=holi',
  },
  christmas: {
    preset: 'christmas',
    displayName: 'Christmas Dental Carnival',
    icon: 'fa-solid fa-tree',
    defaultName: 'Christmas & Year-End Carnival',
    defaultTagline: 'Unwrap Joy & Precision with Exclusive Discounts on Rotary Burs & Surgical Handpieces!',
    defaultBadge: '🎄 MERRY CHRISTMAS DEALS',
    defaultCoupon: 'XMAS45',
    discountType: 'percentage',
    defaultDiscount: 45,
    maxDiscountAmount: 2000,
    minOrderAmount: 0,
    totalUsageLimit: 800,
    perUserLimit: 1,
    excludeSaleItems: false,
    targetCategories: ['All Products'],
    targetProducts: [],
    primaryColor: '#15803d',
    secondaryColor: '#b91c1c',
    accentGradient: 'linear-gradient(135deg, #16a34a 0%, #dc2626 60%, #1e293b 100%)',
    textColor: '#ffffff',
    particleEffect: 'snowflakes',
    leftIcon: '🎄',
    rightIcon: '🎁',
    announcementMessage: '🎄 Merry Christmas! Unwrap festive gifts with every order above ₹3,000 + 45% OFF.',
    buttonText: 'Shop Christmas Fest',
    buttonLink: '/shop?sale=christmas',
  },
  newyear: {
    preset: 'newyear',
    displayName: 'New Year Mega Bash',
    icon: 'fa-solid fa-champagne-glasses',
    defaultName: 'New Year 2027 Mega Sale',
    defaultTagline: 'Start the New Year with State-of-the-art Dental Operatory Gear at Unbeatable Rates!',
    defaultBadge: '🎉 NEW YEAR 2027 BASH',
    defaultCoupon: 'NEWYEAR27',
    discountType: 'percentage',
    defaultDiscount: 55,
    maxDiscountAmount: 3000,
    minOrderAmount: 0,
    totalUsageLimit: 1000,
    perUserLimit: 1,
    excludeSaleItems: false,
    targetCategories: ['All Products'],
    targetProducts: [],
    primaryColor: '#4f46e5',
    secondaryColor: '#9333ea',
    accentGradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
    textColor: '#ffffff',
    particleEffect: 'confetti',
    leftIcon: '🎉',
    rightIcon: '🥂',
    announcementMessage: '🎉 Ring in 2027 with BuyBright! Upgrade your operatory with 55% Off + 0% EMI options.',
    buttonText: 'Unlock New Year Deals',
    buttonLink: '/shop?sale=newyear',
  },
  independence: {
    preset: 'independence',
    displayName: 'Independence Day',
    icon: 'fa-solid fa-flag',
    defaultName: 'Freedom Dental Festival',
    defaultTagline: 'Celebrating India’s Freedom with Special Atmanirbhar Bharat Healthcare Discounts!',
    defaultBadge: '🇮🇳 FREEDOM DENTAL SALE',
    defaultCoupon: 'FREEDOM78',
    discountType: 'percentage',
    defaultDiscount: 40,
    maxDiscountAmount: 1500,
    minOrderAmount: 0,
    totalUsageLimit: 500,
    perUserLimit: 1,
    excludeSaleItems: false,
    targetCategories: ['All Products'],
    targetProducts: [],
    primaryColor: '#c2410c',
    secondaryColor: '#15803d',
    accentGradient: 'linear-gradient(135deg, #ea580c 0%, #ffffff 50%, #16a34a 100%)',
    textColor: '#0f172a',
    particleEffect: 'fireworks',
    leftIcon: '🇮🇳',
    rightIcon: '⭐',
    announcementMessage: '🇮🇳 Freedom to Smile! Celebrate Independence with Flat 40% OFF across all Indian-made dental tools.',
    buttonText: 'View Freedom Offers',
    buttonLink: '/shop?sale=independence',
  },
  ganesh_utsav: {
    preset: 'ganesh_utsav',
    displayName: 'Ganesh Utsav',
    icon: 'fa-solid fa-om',
    defaultName: 'Ganesh Utsav Mangal Mahotsav',
    defaultTagline: 'Auspicious Beginnings for Your Clinic with Blessed Prices on Restorative Supplies!',
    defaultBadge: '🌺 GANESH UTSAV OFFERS',
    defaultCoupon: 'GANPATI35',
    discountType: 'percentage',
    defaultDiscount: 35,
    maxDiscountAmount: 1500,
    minOrderAmount: 0,
    totalUsageLimit: 500,
    perUserLimit: 1,
    excludeSaleItems: false,
    targetCategories: ['All Products'],
    targetProducts: [],
    primaryColor: '#c2410c',
    secondaryColor: '#d97706',
    accentGradient: 'linear-gradient(135deg, #f97316 0%, #eab308 50%, #dc2626 100%)',
    textColor: '#ffffff',
    particleEffect: 'marigold_flowers',
    leftIcon: '🌺',
    rightIcon: '🪔',
    announcementMessage: '🌺 Happy Ganesh Chaturthi! Get Blessed Savings with Code GANPATI35 + Free Sterilization Pouches.',
    buttonText: 'Avail Mangal Offers',
    buttonLink: '/shop?sale=ganesh',
  },
  navratri: {
    preset: 'navratri',
    displayName: 'Navratri Dandiya Fest',
    icon: 'fa-solid fa-music',
    defaultName: 'Navratri 9-Day Super Deals',
    defaultTagline: '9 Days of Divine Savings on Endodontic Motors, Apex Locators & Ultrasonic Scalers!',
    defaultBadge: '✨ 9 DAYS OF SAVINGS',
    defaultCoupon: 'NAVRATRI9',
    discountType: 'percentage',
    defaultDiscount: 45,
    maxDiscountAmount: 2000,
    minOrderAmount: 0,
    totalUsageLimit: 500,
    perUserLimit: 1,
    excludeSaleItems: false,
    targetCategories: ['All Products'],
    targetProducts: [],
    primaryColor: '#be185d',
    secondaryColor: '#f59e0b',
    accentGradient: 'linear-gradient(135deg, #db2777 0%, #f59e0b 50%, #059669 100%)',
    textColor: '#ffffff',
    particleEffect: 'sparkles_diyas',
    leftIcon: '🪔',
    rightIcon: '✨',
    announcementMessage: '✨ 9 Days of Non-Stop Deals! Extra 10% on Rotary Systems with Coupon NAVRATRI9.',
    buttonText: 'Shop 9-Day Fest',
    buttonLink: '/shop?sale=navratri',
  },
  eid: {
    preset: 'eid',
    displayName: 'Eid Mubarak Special',
    icon: 'fa-solid fa-moon',
    defaultName: 'Eid Mubarak Dental Joy Fest',
    defaultTagline: 'Celebrate Eid with Special Blessings and Exclusive Discounts on Premium Dental Kits!',
    defaultBadge: '🌙 EID MUBARAK DEALS',
    defaultCoupon: 'EID2026',
    discountType: 'percentage',
    defaultDiscount: 40,
    maxDiscountAmount: 1800,
    minOrderAmount: 0,
    totalUsageLimit: 500,
    perUserLimit: 1,
    excludeSaleItems: false,
    targetCategories: ['All Products'],
    targetProducts: [],
    primaryColor: '#047857',
    secondaryColor: '#d97706',
    accentGradient: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #eab308 100%)',
    textColor: '#ffffff',
    particleEffect: 'sparkles_diyas',
    leftIcon: '🌙',
    rightIcon: '⭐',
    announcementMessage: '🌙 Eid Mubarak! Enjoy Flat 40% Off on Autoclaves & Impression Supplies with code EID2026.',
    buttonText: 'Explore Eid Deals',
    buttonLink: '/shop?sale=eid',
  },
  custom: {
    preset: 'custom',
    displayName: 'Custom Festive Campaign',
    icon: 'fa-solid fa-wand-magic-sparkles',
    defaultName: 'BuyBright Super Dental Expo',
    defaultTagline: 'Exclusive Professional Clinic Discounts on Advanced Dental Supplies!',
    defaultBadge: '⭐ PRESTODENTAL EXPO',
    defaultCoupon: 'PRESTO50',
    discountType: 'percentage',
    defaultDiscount: 30,
    maxDiscountAmount: 1500,
    minOrderAmount: 0,
    totalUsageLimit: 500,
    perUserLimit: 1,
    excludeSaleItems: false,
    targetCategories: ['All Products'],
    targetProducts: [],
    primaryColor: '#008080',
    secondaryColor: '#0f766e',
    accentGradient: 'linear-gradient(135deg, #008080 0%, #0284c7 50%, #4f46e5 100%)',
    textColor: '#ffffff',
    particleEffect: 'confetti',
    leftIcon: '⭐',
    rightIcon: '🦷',
    announcementMessage: '⭐ BuyBright Expo is LIVE! Save up to 30% on dental essentials with fast doorstep delivery.',
    buttonText: 'Shop All Offers',
    buttonLink: '/shop',
  },
};
