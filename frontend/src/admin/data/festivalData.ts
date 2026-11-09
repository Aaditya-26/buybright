/**
 * BuyBright Festival Theme Mock Data & Repository Engine.
 * Provides default pre-configured festival themes, persistence with localStorage,
 * and CRUD operations for both Admin Console and Customer Portal.
 */

import { FestivalTheme, FESTIVAL_PRESETS } from '../../types/festival';

const STORAGE_KEY = 'buybright_festival_themes_v2';

export const INITIAL_FESTIVALS: FestivalTheme[] = [
  {
    id: 'FEST-DIWALI-2026',
    name: 'Diwali Dental Mahotsav 2026',
    preset: 'diwali',
    tagline: 'Illuminate Your Dental Practice with Up to 50% Off on Premium Instruments, Autoclaves & Rotary Files!',
    badgeText: '🪔 DIWALI MEGA OFFERS',
    couponCode: 'DIWALI50',
    discountType: 'percentage',
    discountValue: 50,
    discountPercentage: 50,
    maxDiscountAmount: 2500,
    minOrderAmount: 0,
    minCartValue: 0,
    startDate: '2026-10-15',
    endDate: '2026-11-20',
    validFrom: '2026-10-15',
    validTo: '2026-11-20',
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
    topAnnouncementBar: {
      enabled: true,
      message: '🪔 Diwali Grand Dental Fest is LIVE! Get Extra 15% Cashback + Free Courier Delivery across India.',
      buttonText: 'Claim Diwali Deals',
      buttonLink: '/shop?sale=diwali',
      showCountdown: true,
    },
    floatingRibbon: {
      enabled: true,
      position: 'bottom-right',
      title: 'Diwali Dhamaka Sale',
      subtitle: 'Flat 50% Off with code DIWALI50',
      badgeIcon: '🪔',
    },
    status: 'Active',
    leftDecorativeIcon: '🪔',
    rightDecorativeIcon: '✨',
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-10-01T14:30:00Z',
  },
  {
    id: 'FEST-HOLI-2027',
    name: 'Holi Colors Dental Expo',
    preset: 'holi',
    tagline: 'Splash Colors of Joy with Flat 40% Off on Dental Disposables, Gloves & Impression Kits!',
    badgeText: '🎨 HOLI COLOR BLAST',
    couponCode: 'HOLI40',
    discountType: 'percentage',
    discountValue: 40,
    discountPercentage: 40,
    maxDiscountAmount: 2000,
    minOrderAmount: 0,
    minCartValue: 0,
    startDate: '2027-03-10',
    endDate: '2027-03-25',
    validFrom: '2027-03-10',
    validTo: '2027-03-25',
    totalUsageLimit: 500,
    perUserLimit: 1,
    excludeSaleItems: false,
    targetCategories: ['Restorative & Instruments', 'Endodontics & Rotary Files'],
    targetProducts: [],
    primaryColor: '#e11d48',
    secondaryColor: '#7c3aed',
    accentGradient: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #06b6d4 100%)',
    textColor: '#ffffff',
    particleEffect: 'colors_splash',
    topAnnouncementBar: {
      enabled: true,
      message: '🎨 Celebrate Holi with BuyBright! Use code HOLI40 for Flat 40% discount on endodontic supplies.',
      buttonText: 'Explore Holi Offers',
      buttonLink: '/shop?sale=holi',
      showCountdown: true,
    },
    floatingRibbon: {
      enabled: true,
      position: 'bottom-right',
      title: 'Holi Colors Expo',
      subtitle: '40% Off + Surprise Gifts',
      badgeIcon: '🎨',
    },
    status: 'Inactive',
    leftDecorativeIcon: '🎨',
    rightDecorativeIcon: '🌈',
    createdAt: '2026-08-15T12:00:00Z',
    updatedAt: '2026-08-15T12:00:00Z',
  },
  {
    id: 'FEST-NEWYEAR-2027',
    name: 'New Year 2027 Mega Sale',
    preset: 'newyear',
    tagline: 'Start the New Year with State-of-the-art Dental Operatory Gear at Unbeatable Rates!',
    badgeText: '🎉 NEW YEAR 2027 BASH',
    couponCode: 'NEWYEAR27',
    discountType: 'percentage',
    discountValue: 55,
    discountPercentage: 55,
    maxDiscountAmount: 3000,
    minOrderAmount: 0,
    minCartValue: 0,
    startDate: '2026-12-24',
    endDate: '2027-01-10',
    validFrom: '2026-12-24',
    validTo: '2027-01-10',
    totalUsageLimit: 1000,
    perUserLimit: 1,
    excludeSaleItems: true,
    targetCategories: ['All Products'],
    targetProducts: [],
    primaryColor: '#4f46e5',
    secondaryColor: '#9333ea',
    accentGradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
    textColor: '#ffffff',
    particleEffect: 'confetti',
    topAnnouncementBar: {
      enabled: true,
      message: '🎉 Ring in 2027 with BuyBright! Upgrade your operatory with 55% Off + 0% EMI options.',
      buttonText: 'Unlock New Year Deals',
      buttonLink: '/shop?sale=newyear',
      showCountdown: true,
    },
    floatingRibbon: {
      enabled: true,
      position: 'bottom-right',
      title: 'New Year Mega Bash',
      subtitle: 'Upto 55% Off on Equipment',
      badgeIcon: '🎉',
    },
    status: 'Scheduled',
    leftDecorativeIcon: '🎉',
    rightDecorativeIcon: '🥂',
    createdAt: '2026-09-10T09:00:00Z',
    updatedAt: '2026-09-10T09:00:00Z',
  },
  {
    id: 'FEST-XMAS-2026',
    name: 'Christmas & Year-End Carnival',
    preset: 'christmas',
    tagline: 'Unwrap Joy & Precision with Exclusive Discounts on Rotary Burs & Surgical Handpieces!',
    badgeText: '🎄 MERRY CHRISTMAS DEALS',
    couponCode: 'XMAS45',
    discountType: 'fixed',
    discountValue: 450,
    discountPercentage: 45,
    maxDiscountAmount: 1000,
    minOrderAmount: 0,
    minCartValue: 0,
    startDate: '2026-12-15',
    endDate: '2026-12-31',
    validFrom: '2026-12-15',
    validTo: '2026-12-31',
    totalUsageLimit: 800,
    perUserLimit: 2,
    excludeSaleItems: false,
    targetCategories: ['Restorative & Instruments', 'Oral Surgery & Handpieces'],
    targetProducts: [],
    primaryColor: '#15803d',
    secondaryColor: '#b91c1c',
    accentGradient: 'linear-gradient(135deg, #16a34a 0%, #dc2626 60%, #1e293b 100%)',
    textColor: '#ffffff',
    particleEffect: 'snowflakes',
    topAnnouncementBar: {
      enabled: true,
      message: '🎄 Merry Christmas! Unwrap festive gifts with every order above ₹3,000 + 45% OFF.',
      buttonText: 'Shop Christmas Fest',
      buttonLink: '/shop?sale=christmas',
      showCountdown: true,
    },
    floatingRibbon: {
      enabled: true,
      position: 'bottom-right',
      title: 'Christmas Carnival',
      subtitle: 'Flat ₹450 Off on Instruments',
      badgeIcon: '🎄',
    },
    status: 'Inactive',
    leftDecorativeIcon: '🎄',
    rightDecorativeIcon: '🎁',
    createdAt: '2026-09-12T11:00:00Z',
    updatedAt: '2026-09-12T11:00:00Z',
  },
];

/** Retrieve all festival themes from localStorage or defaults */
export const getStoredFestivalThemes = (): FestivalTheme[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading festival themes from storage:', err);
  }
  // Initialize with default themes
  saveStoredFestivalThemes(INITIAL_FESTIVALS);
  return INITIAL_FESTIVALS;
};

/** Save all festival themes to localStorage and dispatch custom event */
export const saveStoredFestivalThemes = (themes: FestivalTheme[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(themes));
    window.dispatchEvent(new Event('buybright_festival_update'));
  } catch (err) {
    console.error('Error saving festival themes to storage:', err);
  }
};

/** Retrieve the current active festival theme */
export const getActiveFestivalTheme = (): FestivalTheme | null => {
  const all = getStoredFestivalThemes();
  return all.find((f) => f.status === 'Active') || null;
};

/** Toggle active status for a specific festival theme (ensures single active theme) */
export const setActiveFestivalTheme = (id: string, active: boolean): FestivalTheme[] => {
  const current = getStoredFestivalThemes();
  const updated = current.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        status: (active ? 'Active' : 'Inactive') as 'Active' | 'Inactive',
        updatedAt: new Date().toISOString(),
      };
    }
    // If setting a theme to active, deactivate all other themes
    if (active && item.status === 'Active') {
      return {
        ...item,
        status: 'Inactive' as const,
        updatedAt: new Date().toISOString(),
      };
    }
    return item;
  });
  saveStoredFestivalThemes(updated);
  return updated;
};

/** Add or update a festival theme */
export const saveOrUpdateFestivalTheme = (theme: Partial<FestivalTheme>): FestivalTheme => {
  const current = getStoredFestivalThemes();
  const now = new Date().toISOString();

  let targetId = theme.id;

  if (!targetId) {
    const preset = theme.preset || 'custom';
    targetId = `FEST-${preset.toUpperCase()}-${Date.now().toString().slice(-4)}`;
  }

  const existingIndex = current.findIndex((f) => f.id === targetId);

  const discountVal = Number(theme.discountValue ?? theme.discountPercentage ?? 40);
  const minCart = Number(theme.minOrderAmount ?? theme.minCartValue ?? 0);
  const validFromStr = theme.validFrom || theme.startDate || new Date().toISOString().split('T')[0];
  const validToStr = theme.validTo || theme.endDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

  const fullTheme: FestivalTheme = {
    id: targetId,
    name: theme.name || 'New Festival Campaign',
    preset: theme.preset || 'diwali',
    tagline: theme.tagline || 'Exclusive Festive Discounts on Dental Supplies!',
    badgeText: theme.badgeText || '🪔 FESTIVAL OFFERS',
    
    // Comprehensive Coupon & Discount Rules
    couponCode: (theme.couponCode || 'FEST2026').toUpperCase().trim(),
    discountType: theme.discountType || 'percentage',
    discountValue: discountVal,
    discountPercentage: discountVal,
    maxDiscountAmount: theme.maxDiscountAmount ? Number(theme.maxDiscountAmount) : undefined,
    minOrderAmount: minCart,
    minCartValue: minCart,
    startDate: validFromStr,
    endDate: validToStr,
    validFrom: validFromStr,
    validTo: validToStr,

    // Advanced Rules
    totalUsageLimit: theme.totalUsageLimit ? Number(theme.totalUsageLimit) : undefined,
    perUserLimit: Number(theme.perUserLimit ?? 1),
    excludeSaleItems: Boolean(theme.excludeSaleItems),

    // Restrictions & Eligibility
    customerEligibility: theme.customerEligibility || 'All Customers',
    targetCustomers: theme.targetCustomers || [],
    targetCategories: theme.targetCategories && theme.targetCategories.length > 0 ? theme.targetCategories : ['All Products'],
    targetProducts: theme.targetProducts || [],

    // Publication Status
    status: theme.status || 'Inactive',

    // Visual Theme & Particles
    primaryColor: theme.primaryColor || '#b45309',
    secondaryColor: theme.secondaryColor || '#ea580c',
    accentGradient: theme.accentGradient || 'linear-gradient(135deg, #d97706 0%, #dc2626 50%, #9333ea 100%)',
    textColor: theme.textColor || '#ffffff',
    particleEffect: theme.particleEffect || 'sparkles_diyas',

    topAnnouncementBar: {
      enabled: theme.topAnnouncementBar?.enabled ?? true,
      message: theme.topAnnouncementBar?.message || '🪔 Festive Offers are LIVE! Save big on all dental essentials.',
      buttonText: theme.topAnnouncementBar?.buttonText || 'Shop Deals',
      buttonLink: theme.topAnnouncementBar?.buttonLink || '/shop',
      showCountdown: theme.topAnnouncementBar?.showCountdown ?? true,
    },
    floatingRibbon: {
      enabled: theme.floatingRibbon?.enabled ?? true,
      position: theme.floatingRibbon?.position || 'bottom-right',
      title: theme.floatingRibbon?.title || theme.name || 'Festive Deals',
      subtitle: theme.floatingRibbon?.subtitle || (theme.discountType === 'fixed' ? `Flat ₹${discountVal} Off` : `Flat ${discountVal}% Off`),
      badgeIcon: theme.floatingRibbon?.badgeIcon || FESTIVAL_PRESETS[theme.preset || 'diwali']?.leftIcon || '🪔',
    },

    leftDecorativeIcon: theme.leftDecorativeIcon || '🪔',
    rightDecorativeIcon: theme.rightDecorativeIcon || '✨',
    createdAt: existingIndex >= 0 ? current[existingIndex].createdAt : now,
    updatedAt: now,
  };

  let updatedList: FestivalTheme[];

  if (existingIndex >= 0) {
    updatedList = [...current];
    updatedList[existingIndex] = fullTheme;
  } else {
    updatedList = [fullTheme, ...current];
  }

  // If this theme is set to Active, deactivate any other active theme
  if (fullTheme.status === 'Active') {
    updatedList = updatedList.map((item) =>
      item.id === fullTheme.id ? item : item.status === 'Active' ? { ...item, status: 'Inactive' } : item
    );
  }

  saveStoredFestivalThemes(updatedList);
  return fullTheme;
};

/** Delete a festival theme by ID */
export const deleteFestivalTheme = (id: string): FestivalTheme[] => {
  const current = getStoredFestivalThemes();
  const filtered = current.filter((f) => f.id !== id);
  saveStoredFestivalThemes(filtered);
  return filtered;
};

/** Reset all festival themes to defaults */
export const resetFestivalThemesToDefaults = (): FestivalTheme[] => {
  saveStoredFestivalThemes(INITIAL_FESTIVALS);
  return INITIAL_FESTIVALS;
};
