/**
 * Contact Module Type Definitions.
 * Matches exact website fields on ContactPage.tsx.
 */

export type EnquiryStatus = 'New' | 'In Progress' | 'Contacted' | 'Resolved';

/**
 * ContactEnquiry interface.
 * Matches website form fields:
 * firstName, lastName, mobileNo, email, commentOrMessage, agreedToContact
 */
export interface ContactEnquiry {
  id: string;
  srNo: number;
  firstName: string;
  lastName: string;
  mobileNo: string;
  email: string;
  commentOrMessage: string;
  agreedToContact: boolean;
  status: EnquiryStatus;
  receivedAt: string;
  notes?: string;
  isStarred?: boolean;
}

export interface HubLocationItem {
  id: string;
  city: string; // Hub city name e.g. "Mumbai Central Logistics Hub"
  state: string;
  address: string;
  phone: string;
  email: string;
  timing: string;
  tag: string;
  mapLink?: string; // Google Maps directions/location link for this hub
  isPrimary: boolean;
}

export interface ContactFaqItem {
  id: string;
  category: 'delivery' | 'bulk' | 'gst' | 'quality';
  question: string;
  answer: string;
}

/**
 * ContactCustomizerSettings interface.
 * Configurable website sections matching ContactPage.tsx.
 */
export interface ContactCustomizerSettings {
  // 1. Hero Section
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;

  // 2. 4 Fast-Action Hero Channel Cards
  phoneTag: string;
  phoneNumber: string;
  phoneTiming: string;

  whatsappTag: string;
  whatsappNumber: string;
  whatsappTiming: string;

  emailTag: string;
  emailAddress: string;
  emailTiming: string;

  hubsTag: string;
  hubsTitle: string;
  hubsTiming: string;

  // 3. Inquiry Form Suite
  formPill: string;
  formTitle: string;
  formSubtitle: string;

  // 4. Sidebar Fast-Track WhatsApp Concierge Card (with 3 features)
  conciergeBadge: string;
  conciergeTitle: string;
  conciergeDescription: string;
  conciergeFeature1: string;
  conciergeFeature2: string;
  conciergeFeature3: string;

  // 5. Hub Locations & Google Map
  hubsCardTitle?: string;
  hubs: HubLocationItem[];
  mapBadge?: string;
  mapHeading: string;
  mapAddress: string;
  mapExternalUrl: string; // Google Maps External Link ("Open in Google Maps")
  mapEmbedUrl: string; // Google Maps Iframe Embed

  // 6. Frequently Asked Questions (FAQs)
  faqPill: string;
  faqHeading: string;
  faqSubheading: string;
  faqs: ContactFaqItem[];

  // 7. Bottom Conversion CTA Strip
  ctaPill: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaWhatsAppNumber: string;

  updatedAt?: string;
}
