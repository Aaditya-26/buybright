/**
 * BuyBright Admin Settings Data & Persistence Engine.
 * Manages:
 * 1. General Settings
 * 2. Website Settings (Top Bar)
 * 3. Send Announcements & Notification History
 * 4. Header Settings
 * 5. Footer Settings
 */

export interface GeneralSettings {
  websiteName: string;
  companyName: string;
  supportEmail: string;
  supportPhone: string;
  gstNumber: string;
  timezone: string;
  currency: string;
  companyAddress: string;
  websiteLogo: string;
  favicon: string;
}

export interface WebsiteSettings {
  topbarEnabled: boolean;
  firstText: string;
  firstIcon: string;
  secondText: string;
  secondIcon: string;
  showAppBadges: boolean;
  playStoreUrl: string;
  appStoreUrl: string;
}

export interface HeaderSettings {
  stickyHeader: boolean;
  searchPlaceholder: string;
  showHelpSection: boolean;
  helpPhone: string;
  helpText: string;
  megaMenuTitle: string;
}

export interface FooterSettings {
  footerDescription: string;
  copyrightText: string;
  helplinePhone: string;
  supportEmail: string;
  warehouseAddress: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
  twitterUrl: string;
}

export interface AnnouncementNotification {
  id: string;
  title: string;
  message: string;
  targetAudience: 'All Customers' | 'Verified Clinics' | 'Wholesalers' | 'VIP Members';
  priority: 'General' | 'Promotional' | 'Urgent';
  actionUrl?: string;
  sentAt: string;
  status: 'Sent' | 'Scheduled' | 'Draft';
  recipientCount: number;
}

export interface PlatformSettings {
  general: GeneralSettings;
  website: WebsiteSettings;
  header: HeaderSettings;
  footer: FooterSettings;
}

const SETTINGS_STORAGE_KEY = 'prestodental_platform_settings';
const NOTIFICATIONS_STORAGE_KEY = 'prestodental_notification_history';

export const defaultGeneralSettings: GeneralSettings = {
  websiteName: 'BuyBright',
  companyName: 'Microlan IT Services Pvt Ltd',
  supportEmail: 'support@buybright.com',
  supportPhone: '+91 98201 23456',
  gstNumber: '27AAECP1234F1Z5',
  timezone: 'Asia/Kolkata (IST, GMT+05:30)',
  currency: 'INR - ₹ (Indian Rupee)',
  companyAddress: 'Presto Commercial Towers, 4th Floor, Andheri East, Mumbai, Maharashtra 400069',
  websiteLogo: '/images/logo.png',
  favicon: '/favicon.ico',
};

export const defaultWebsiteSettings: WebsiteSettings = {
  topbarEnabled: true,
  firstText: 'Diwali Dhamaka — Flat 20% Off Storewide',
  firstIcon: 'fa-solid fa-fire',
  secondText: '100% Genuine Certified Dental Supplies',
  secondIcon: 'fa-solid fa-shield-halved',
  showAppBadges: true,
  playStoreUrl: 'https://play.google.com',
  appStoreUrl: 'https://apple.com/app-store',
};

export const defaultHeaderSettings: HeaderSettings = {
  stickyHeader: true,
  searchPlaceholder: 'Search 15,000+ Dental Products, Instruments, Restoratives...',
  showHelpSection: true,
  helpPhone: '+91 98201 23456',
  helpText: 'Need Help? Call Us 24/7',
  megaMenuTitle: 'All Categories',
};

export const defaultFooterSettings: FooterSettings = {
  footerDescription:
    'BuyBright is India’s premier dental supply chain & medical equipment distributor, serving 25,000+ registered dental clinics, hospitals, and surgeons with authentic certified supplies.',
  copyrightText: '© 2026 BuyBright Healthcare Solutions Pvt Ltd. All Rights Reserved.',
  helplinePhone: '+91 98201 23456',
  supportEmail: 'support@buybright.com',
  warehouseAddress: 'Bhiwandi Central Fulfillment Centre, Gala #14-18, Logistics Park, Mumbai 421302',
  facebookUrl: 'https://facebook.com/prestodental',
  instagramUrl: 'https://instagram.com/prestodental',
  linkedinUrl: 'https://linkedin.com/company/prestodental',
  youtubeUrl: 'https://youtube.com/prestodental',
  twitterUrl: 'https://twitter.com/prestodental',
};

export const defaultNotifications: AnnouncementNotification[] = [
  {
    id: 'notif-1',
    title: 'Diwali Mega Sale Live Now!',
    message: 'Enjoy flat 20% discount across all endodontics, composites, and equipment categories.',
    targetAudience: 'All Customers',
    priority: 'Promotional',
    actionUrl: '/shop?sale=diwali',
    sentAt: '06 Oct 2026, 10:30 AM',
    status: 'Sent',
    recipientCount: 14250,
  },
  {
    id: 'notif-2',
    title: 'New 3M Restorative Stock Arrived',
    message: 'Fresh batch of 3M Filtek Z350 XT Universal Restorative Composite syringes now in stock.',
    targetAudience: 'Verified Clinics',
    priority: 'General',
    actionUrl: '/shop?category=materials',
    sentAt: '04 Oct 2026, 02:15 PM',
    status: 'Sent',
    recipientCount: 8900,
  },
  {
    id: 'notif-3',
    title: 'Logistics Update: Mumbai & Pune Next-Day Delivery',
    message: 'Orders placed before 4:00 PM will now be dispatched on the same day for next-day clinic delivery.',
    targetAudience: 'All Customers',
    priority: 'Urgent',
    actionUrl: '/shipping-policy',
    sentAt: '01 Oct 2026, 09:00 AM',
    status: 'Sent',
    recipientCount: 15400,
  },
];

export const defaultPlatformSettings: PlatformSettings = {
  general: defaultGeneralSettings,
  website: defaultWebsiteSettings,
  header: defaultHeaderSettings,
  footer: defaultFooterSettings,
};

export const getPlatformSettings = (): PlatformSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return defaultPlatformSettings;
    const parsed = JSON.parse(raw);
    return {
      general: { ...defaultGeneralSettings, ...parsed.general },
      website: { ...defaultWebsiteSettings, ...parsed.website },
      header: { ...defaultHeaderSettings, ...parsed.header },
      footer: { ...defaultFooterSettings, ...parsed.footer },
    };
  } catch {
    return defaultPlatformSettings;
  }
};

export const savePlatformSettings = (settings: PlatformSettings): void => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('prestodental_settings_updated', { detail: settings }));
  } catch (err) {
    console.error('Failed to save platform settings to localStorage:', err);
  }
};

export const getNotificationHistory = (): AnnouncementNotification[] => {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) return defaultNotifications;
    return JSON.parse(raw);
  } catch {
    return defaultNotifications;
  }
};

export const saveNotificationHistory = (list: AnnouncementNotification[]): void => {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save notification history:', err);
  }
};
