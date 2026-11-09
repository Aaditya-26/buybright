/**
 * Contact Module Mock Data & Persistence Engine.
 * Matches exact website fields on ContactPage.tsx.
 */

import type {
  ContactEnquiry,
  ContactCustomizerSettings,
  ContactFaqItem,
  EnquiryStatus,
} from '../types/contact';

const ENQUIRIES_STORAGE_KEY = 'buybright_contact_enquiries_v2';
const SETTINGS_STORAGE_KEY = 'buybright_contact_settings_v2';

export const initialContactEnquiries: ContactEnquiry[] = [
  {
    id: 'enq-101',
    srNo: 1,
    firstName: 'Rohan',
    lastName: 'Kulkarni',
    mobileNo: '9823411029',
    email: 'rohan.kulkarni@example.com',
    commentOrMessage:
      'We are expanding our retail office setup and need a bulk order quote for 25 Dell 27-inch monitors and 30 Sony WH-1000XM5 headphones with official GST tax invoices.',
    agreedToContact: true,
    status: 'New',
    receivedAt: '29 Sep 2026, 11:20 AM',
    notes: 'Urgent corporate order. Follow up with bulk corporate price matrix.',
    isStarred: true,
  },
  {
    id: 'enq-102',
    srNo: 2,
    firstName: 'Priya',
    lastName: 'Sharma',
    mobileNo: '9871244321',
    email: 'priya.sharma@example.com',
    commentOrMessage:
      'I am interested in becoming an authorized seller on BuyBright for consumer electronics and lifestyle accessories. Could you please share the seller commission tier schedule?',
    agreedToContact: true,
    status: 'In Progress',
    receivedAt: '28 Sep 2026, 04:45 PM',
    notes: 'Sent seller onboarding documentation and registration link.',
    isStarred: true,
  },
  {
    id: 'enq-103',
    srNo: 3,
    firstName: 'Amit',
    lastName: 'Patel',
    mobileNo: '9426078910',
    email: 'amit.patel@example.com',
    commentOrMessage:
      'Can you please confirm if the 2-year manufacturer warranty covers on-site technician visits in Ahmedabad? Also want to know the delivery timeline for Western Gujarat region.',
    agreedToContact: true,
    status: 'Contacted',
    receivedAt: '28 Sep 2026, 01:15 PM',
    notes: 'Clarified 48-hour delivery timeline and brand service center network.',
    isStarred: false,
  },
  {
    id: 'enq-104',
    srNo: 4,
    firstName: 'Sneha',
    lastName: 'Nair',
    mobileNo: '9745522340',
    email: 'sneha.nair@example.com',
    commentOrMessage:
      'Are the Apple Watch Series 9 GPS models in Midnight 45mm currently in stock? We need 5 units shipped urgently for corporate rewards.',
    agreedToContact: true,
    status: 'Resolved',
    receivedAt: '27 Sep 2026, 10:30 AM',
    notes: 'Confirmed stock availability and customer placed order online.',
    isStarred: false,
  },
  {
    id: 'enq-105',
    srNo: 5,
    firstName: 'Vikram',
    lastName: 'Deshmukh',
    mobileNo: '9822055112',
    email: 'vikram.deshmukh@example.com',
    commentOrMessage:
      'We recently received our order #ORD-840. The tax invoice has a minor typo in our company GSTIN number. Kindly reissue the amended tax invoice for input tax credit.',
    agreedToContact: true,
    status: 'Resolved',
    receivedAt: '26 Sep 2026, 03:10 PM',
    notes: 'Billing team regenerated amended GST invoice and emailed PDF.',
    isStarred: false,
  },
];

export const initialContactFaqs: ContactFaqItem[] = [
  {
    id: 'faq-1',
    category: 'delivery',
    question: 'How fast does BuyBright dispatch customer orders?',
    answer:
      'All verified orders placed before 3:00 PM IST on working days (Mon–Sat) are dispatched the same day via express logistics partners (BlueDart / Delhivery / Ekart). Major metro cities receive delivery in 24 to 48 hours, while Tier-2 and Tier-3 cities receive shipments in 48 to 72 hours.',
  },
  {
    id: 'faq-2',
    category: 'delivery',
    question: 'How are fragile electronics and luxury items packaged for transit?',
    answer:
      'We enforce tamper-evident, multi-layer shockproof bubble packaging with tamper-evident security tape. All high-value items require OTP verification upon doorstep delivery to ensure absolute transit safety.',
  },
  {
    id: 'faq-3',
    category: 'bulk',
    question: 'Do you provide bulk purchase discounts for corporate and wholesale buyers?',
    answer:
      'Yes! We offer tiered volume matrix discounts (up to 15% automatic checkout savings) and dedicated institutional bulk contracts with net-credit terms for enterprise procurement. Contact our corporate desk directly for custom quotes.',
  },
  {
    id: 'faq-4',
    category: 'gst',
    question: 'Can I claim GST Input Tax Credit (ITC) on business purchases?',
    answer:
      'Absolutely. Every purchase on BuyBright comes with a GST-compliant tax invoice featuring your verified business GSTIN and standard HSN codes. You can claim full ITC (typically 12% to 18% depending on product classification).',
  },
  {
    id: 'faq-5',
    category: 'quality',
    question: 'How do you guarantee 100% authenticity against counterfeit products?',
    answer:
      'BuyBright onboarded sellers are verified against strict manufacturer authorization agreements (Apple, Sony, Samsung, Nike, Dyson, Philips, etc.). Each item carries tamper-evident brand holograms, verifiable serial numbers, and standard manufacturer warranties.',
  },
  {
    id: 'faq-6',
    category: 'quality',
    question: 'What is your return policy for broken transit seals or defective products?',
    answer:
      'We provide a hassle-free 7-day Replacement & Return Guarantee. If any shipment arrives damaged or with broken seals, we initiate an immediate reverse pickup and dispatch a replacement or full refund at zero extra cost.',
  },
];

export const initialContactSettings: ContactCustomizerSettings = {
  // 1. Breadcrumb & SEO
  breadcrumbCurrent: 'Contact Us',

  // 2. Hero Section
  heroBadge: 'BUYBRIGHT CUSTOMER SUPPORT • RESPONSE TIME < 15 MINS',
  heroTitle: "We're Here to Help Your Shopping & Selling Journey with Genuine Products & Fast Support",
  heroSubtitle:
    'Direct support for customer orders, seller onboarding, bulk orders, tracking, and GST tax invoicing. Connect directly with our marketplace team.',

  phoneTag: 'Customer & Seller Helpline',
  phoneNumber: '+91 88064 88054',
  phoneTiming: 'Mon – Sat: 8:30 AM – 8:00 PM',

  whatsappTag: 'Instant WhatsApp Desk',
  whatsappNumber: '+91 88064 88054',
  whatsappTiming: 'Instant replies in < 5 mins',

  emailTag: 'Official Inquiries & Support',
  emailAddress: 'support@buybright.com',
  emailTiming: 'Orders, Invoicing & Seller Onboarding',

  hubsTag: 'Fulfillment Network',
  hubsTitle: 'Mumbai & Pune Hubs',
  hubsTiming: 'Dispatches Pan-India',

  // 3. Form Card Header
  formPill: 'DIRECT INQUIRY',
  formTitle: 'Send Us a Message',
  formSubtitle:
    'Fill in the details below. Our support team will respond promptly with order assistance, pricing, or seller guidance.',

  // 4. Sidebar Fast-Track WhatsApp Concierge Card
  conciergeBadge: 'FAST-TRACK WHATSAPP DESK',
  conciergeTitle: 'Need Instant Stock Availability or Order Updates?',
  conciergeDescription:
    'Connect directly with our customer support and logistics coordinator on WhatsApp for instant order tracking, product recommendations, and instant billing queries.',
  conciergeFeature1: 'Real-time order tracking & doorstep delivery dispatch',
  conciergeFeature2: 'Instant Proforma Invoice (PI) generation for accounting',
  conciergeFeature3: 'Live GPS courier tracking link upon dispatch',

  // 5. Hub Locations & Google Map
  hubsCardTitle: 'Nationwide Fulfillment & Logistics Centers',
  hubs: [
    {
      id: 'hub-mumbai',
      city: 'Mumbai Central Logistics Hub',
      state: 'Maharashtra',
      address: 'Unit 402, BuyBright Headquarters, MIDC Central Road, Andheri East, Mumbai 400069',
      phone: '+91 88064 88054',
      email: 'mumbai.hub@buybright.com',
      timing: 'Mon – Sat: 8:30 AM – 8:00 PM',
      tag: 'Primary Fulfillment Center',
      mapLink: 'https://maps.google.com/?q=MIDC+Central+Road+Andheri+East+Mumbai+400069',
      isPrimary: true,
    },
    {
      id: 'hub-pune',
      city: 'Pune Express Logistics Center',
      state: 'Maharashtra',
      address: 'Plot 18, Phase 1 Commercial Spine, Rajiv Gandhi Infotech Park, Hinjewadi, Pune 411057',
      phone: '+91 88064 88054',
      email: 'pune.desk@buybright.com',
      timing: 'Mon – Sat: 9:00 AM – 7:30 PM',
      tag: 'Express Air Hub',
      mapLink: 'https://maps.google.com/?q=Rajiv+Gandhi+Infotech+Park+Hinjewadi+Pune+411057',
      isPrimary: false,
    },
  ],
  mapBadge: 'PRIMARY FULFILLMENT HEADQUARTERS',
  mapHeading: 'Visit BuyBright Western Hub or Contact Our Corporate Team',
  mapAddress: 'Unit 402, BuyBright Headquarters, MIDC Central Road, Andheri East, Mumbai 400069, Maharashtra',
  mapExternalUrl: 'https://maps.google.com/?q=MIDC+Central+Road+Andheri+East+Mumbai',
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.7561845610815!2d72.86873527589332!3d19.11831825064563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c83c27e852bb%3A0xc07ce9b0579e00ec!2sMIDC%20Central%20Road%2C%20Andheri%20East%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',

  // 6. Frequently Asked Questions (FAQs)
  faqPill: 'FREQUENTLY ASKED QUESTIONS',
  faqHeading: 'Frequently Asked Questions',
  faqSubheading:
    'Quick answers about shipping timelines, order tracking, bulk discounts, and GST tax invoice claims.',
  faqs: initialContactFaqs,

  // 7. Bottom Action CTA Strip
  ctaPill: 'START SHOPPING ON BUYBRIGHT',
  ctaTitle: 'Ready to Experience 100% Genuine Marketplace Shopping?',
  ctaSubtitle:
    'Join over 50,000+ satisfied customers and 1,200+ verified sellers across India.',
  ctaWhatsAppNumber: '+91 88064 88054',
};

// ==========================================
// Persistence Helper Functions
// ==========================================

export function getContactEnquiries(): ContactEnquiry[] {
  try {
    const raw = localStorage.getItem(ENQUIRIES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(initialContactEnquiries));
      return initialContactEnquiries;
    }
    return JSON.parse(raw);
  } catch {
    return initialContactEnquiries;
  }
}

export function saveContactEnquiries(enquiries: ContactEnquiry[]): void {
  try {
    localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(enquiries));
  } catch (e) {
    console.error('Error saving contact enquiries to localStorage', e);
  }
}

export function updateContactEnquiryStatus(id: string, status: EnquiryStatus, notes?: string): void {
  const list = getContactEnquiries();
  const index = list.findIndex((e) => e.id === id);
  if (index !== -1) {
    list[index].status = status;
    if (notes !== undefined) {
      list[index].notes = notes;
    }
    saveContactEnquiries(list);
  }
}

export function deleteContactEnquiry(id: string): void {
  const list = getContactEnquiries().filter((e) => e.id !== id);
  saveContactEnquiries(list);
}

export function getContactSettings(): ContactCustomizerSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(initialContactSettings));
      return initialContactSettings;
    }
    return JSON.parse(raw);
  } catch {
    return initialContactSettings;
  }
}

export function saveContactSettings(settings: ContactCustomizerSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event('buybright_contact_settings_updated'));
  } catch (e) {
    console.error('Error saving contact settings to localStorage', e);
  }
}
