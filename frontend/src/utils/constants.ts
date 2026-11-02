/**
 * BuyBright Global Application Constants.
 */

export const APP_CONFIG = {
  name: 'BuyBright',
  tagline: 'India’s Trusted Dental Supply Platform',
  freeShippingThreshold: 5000,
  supportPhone: '+91 98765 43210',
  supportEmail: 'support@buybright.com',
  b2bInvoicingEnabled: true,
} as const;

export const CATEGORY_SLUGS = [
  'instruments',
  'equipment',
  'materials',
  'consumables',
  'endodontics',
  'orthodontics',
] as const;
