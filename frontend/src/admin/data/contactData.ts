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

const ENQUIRIES_STORAGE_KEY = 'prestodental_contact_enquiries';
const SETTINGS_STORAGE_KEY = 'prestodental_contact_settings';

export const initialContactEnquiries: ContactEnquiry[] = [
  {
    id: 'enq-101',
    srNo: 1,
    firstName: 'Rohan',
    lastName: 'Kulkarni',
    mobileNo: '9823411029',
    email: ' rohan@kulkarnidental.com',
    commentOrMessage:
      'We are expanding our operatory setup with 3 new chairs. Need a bulk contract quote for 30 syringes of 3M Filtek Z350 XT composites and 15 kits of Single Bond Universal Adhesive.',
    agreedToContact: true,
    status: 'New',
    receivedAt: '29 Sep 2026, 11:20 AM',
    notes: 'Urgentexpansion. Follow up with composite shade assortment card.',
    isStarred: true,
  },
  {
    id: 'enq-102',
    srNo: 2,
    firstName: 'Priya',
    lastName: 'Sharma',
    mobileNo: '9871244321',
    email: 'drpriyasharma.ortho@gmail.com',
    commentOrMessage:
      'Looking for institutional rate agreement for our hospital dental department. We require monthly regular shipments of impression materials, pouches, andbibs.',
    agreedToContact: true,
    status: 'In Progress',
    receivedAt: '28 Sep 2026, 04:45 PM',
    notes: 'Sent corporate price schedule. Awaiting hospital board clearance.',
    isStarred: true,
  },
  {
    id: 'enq-103',
    srNo: 3,
    firstName: 'Amit',
    lastName: 'Patel',
    mobileNo: '9426078910',
    email: 'amit.patel.bds@outlook.com',
    commentOrMessage:
      'Can you please confirm if the 2-year on-site warranty covers technician visits in Ahmedabad? Also want to know the delivery timeline for Western Gujarat region.',
    agreedToContact: true,
    status: 'Contacted',
    receivedAt: '28 Sep 2026, 01:15 PM',
    notes: 'Clarified 48-hour delivery timeline and local technician support.',
    isStarred: false,
  },
  {
    id: 'enq-104',
    srNo: 4,
    firstName: 'Sneha',
    lastName: 'Nair',
    mobileNo: '9745522340',
    email: 'sneha.nair.endo@yahoo.com',
    commentOrMessage:
      'Are the Gold Pro taper rotary files in 25mm length currently in stock? We need 10 packs shipped urgently for root canal procedures.',
    agreedToContact: true,
    status: 'Resolved',
    receivedAt: '27 Sep 2026, 10:30 AM',
    notes: 'Confirmed stock availability and doctor placed order online.',
    isStarred: false,
  },
  {
    id: 'enq-105',
    srNo: 5,
    firstName: 'Vikram',
    lastName: 'Deshmukh',
    mobileNo: '9822055112',
    email: ' vikram@deshmukhdental.in',
    commentOrMessage:
      'We recently received our consignment for order #ORD-840. The invoice has a minor typo in our GSTIN number. Kindly reissue the amended tax invoice for input tax credit.',
    agreedToContact: true,
    status: 'Resolved',
    receivedAt: '26 Sep 2026, 03:10 PM',
    notes: 'Accounts team re-generated GST invoice and sent via email.',
    isStarred: false,
  },
];

export const initialContactFaqs: ContactFaqItem[] = [
  {
    id: 'faq-1',
    category: 'delivery',
    question: 'How fast does BuyBright dispatch dental orders?',
    answer:
      'All verified orders placed before 3:00 PM IST on working days (Mon–Sat) are dispatched the same day via express   (Bluedart / Delhivery Medical Express). Major metro clinics receive delivery in 24 to 48 hours, while Tier-2 and Tier-3 cities receive shipments in 48 to 72 hours.',
  },
  {
    id: 'faq-2',
    category: 'delivery',
    question: 'How are temperature-sensitive items (Composites, Silicones, Cements) transported?',
    answer:
      'We use medical-grade thermal packaging with reusable frozen gel packs and active temperature-monitoring strips. This prevents viscosity changes and polymer breakdown in transit, guaranteeing factory-fresh performance in your operatory.',
  },
  {
    id: 'faq-3',
    category: 'bulk',
    question: 'Do you provide institutional pricing for multi-chair dental hospitals and colleges?',
    answer:
      'Yes! We offer tiered volume matrix discounts (up to 15% automatic checkout savings) and dedicated institutional bulk contracts with net-credit terms for multispecialty hospitals, chains, and dental institutions. Contact our B2B desk directly for custom annual quotes.',
  },
  {
    id: 'faq-4',
    category: 'gst',
    question: 'Can I claim 100% GST Input Tax Credit (ITC) on all dental purchases?',
    answer:
      'Absolutely. Every purchase through BuyBright comes with a GST-compliant tax invoice featuring your Clinic/Hospital GSTIN and standard HSN codes. You can claim full ITC (typically 12% to 18% depending on medical device classification).',
  },
  {
    id: 'faq-5',
    category: 'quality',
    question: 'How do you guarantee 100% authenticity against counterfeit dental supplies?',
    answer:
      'BuyBright procures exclusively from authorized brand direct manufacturer channels (such as 3M ESPE, Dentsply Sirona, Superendo, GC India, and Waldent). Each box carries tamper-proof manufacturer holograms, authentic serial batch codes, and standard factory warranties.',
  },
  {
    id: 'faq-6',
    category: 'quality',
    question: 'What is your return policy for broken transit seals or batch variance?',
    answer:
      'We provide a hassle-free 7-day Replacement Guarantee. If any shipment arrives with damaged packaging, broken manufacturer seal, or batch discrepancy, we initiate a reverse pickup and issue an immediate replacement at zero extra cost.',
  },
];

export const initialContactSettings: ContactCustomizerSettings = {
  // 1. Hero Section
  heroBadge: 'PRESTODENTAL DENTAL CONCIERGE • RESPONSE TIME < 15 MINS',
  heroTitle: "We're Here to Power Your Dental Practice with Genuine Supplies & Expert Support",
  heroSubtitle:
    'Direct access for hospital bulk quotes, batch quality certifications, cold-chain shipment tracking, and GST tax invoicing. Connect directly with our team of dental product specialists.',

  // 2. The 4 Fast-Action Hero Channel Cards
  phoneTag: 'Direct Doctor Helpline',
  phoneNumber: '+91 88064 88054',
  phoneTiming: 'Mon – Sat: 8:30 AM – 8:00 PM',

  whatsappTag: 'Instant WhatsApp Desk',
  whatsappNumber: '+91 88064 88054',
  whatsappTiming: 'Instant replies in < 5 mins',

  emailTag: 'Official Inquiries & Orders',
  emailAddress: 'support@prestodental.in',
  emailTiming: 'GST Billing & Institutional RFQs',

  hubsTag: 'Fulfillment Network',
  hubsTitle: 'Mumbai & Pune Hubs',
  hubsTiming: '  Dispatches Pan-India',

  // 3. Form Card Header
  formPill: 'DIRECT INQUIRY',
  formTitle: 'Send Us an Inquiry',
  formSubtitle:
    'Fill in the details below. Our dental supply team will respond with product pricing, batch details, and delivery timelines.',

  // 4. Sidebar Fast-Track WhatsApp Concierge Card (with 3 features)
  conciergeBadge: 'FAST-TRACK WHATSAPP DESK',
  conciergeTitle: 'Need Instant Stock Availability or Batch Photos?',
  conciergeDescription:
    'Connect directly with our senior product specialist and logistics coordinator on WhatsApp for instant batch expiry verification, quotation generation, and real-time shipment updates.',
  conciergeFeature1: 'Real-time photo of batch manufacturing date & expiry',
  conciergeFeature2: 'Instant Proforma Invoice (PI) generation foraccounting',
  conciergeFeature3: 'Live GPS air tracking link on dispatch',

  // 5. Hub Locations & Google Map
  hubsCardTitle: 'Nationwide Fulfillment & Cold-Chain Hubs',
  hubs: [
    {
      id: 'hub-mumbai',
      city: 'Mumbai Central Logistics Hub',
      state: 'Maharashtra',
      address: 'Unit 402, Presto Heights, MIDC Central Road, Andheri East, Mumbai 400069',
      phone: '+91 88064 88054',
      email: 'mumbai.hub@prestodental.in',
      timing: 'Mon – Sat: 8:30 AM – 8:00 PM',
      tag: 'Primary Cold-Chain Depot',
      mapLink: 'https://maps.google.com/?q=Unit+402+Presto+Heights+MIDC+Central+Road+Andheri+East+Mumbai+400069',
      isPrimary: true,
    },
    {
      id: 'hub-pune',
      city: 'Pune Air Express Logistics Center',
      state: 'Maharashtra',
      address: 'Plot 18, Phase 1 Commercial Spine, Rajiv Gandhi Infotech Park, Hinjewadi, Pune 411057',
      phone: '+91 88064 88054',
      email: 'pune.desk@prestodental.in',
      timing: 'Mon – Sat: 9:00 AM – 7:30 PM',
      tag: '  Express Terminal',
      mapLink: 'https://maps.google.com/?q=Rajiv+Gandhi+Infotech+Park+Hinjewadi+Pune+411057',
      isPrimary: false,
    },
  ],
  mapBadge: 'PRIMARY FULFILLMENT HEADQUARTERS',
  mapHeading: 'Visit BuyBright Western Hub or Schedule Operatory Demo',
  mapAddress: 'Unit 402, Presto Heights, MIDC Central Road, Andheri East, Mumbai 400069, Maharashtra',
  mapExternalUrl: 'https://maps.google.com/?q=MIDC+Central+Road+Andheri+East+Mumbai',
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.7561845610815!2d72.86873527589332!3d19.11831825064563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c83c27e852bb%3A0xc07ce9b0579e00ec!2sMIDC%20Central%20Road%2C%20Andheri%20East%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',

  // 6. Frequently Asked Questions (FAQs)
  faqPill: 'FREQUENTLY ASKED QUESTIONS',
  faqHeading: 'Frequently Asked Questions',
  faqSubheading:
    'Quick answers about shipping timelines, temperature control, bulk hospital discounts, and GST tax invoice claims.',
  faqs: initialContactFaqs,

  // 7. Bottom Action CTA Strip
  ctaPill: 'UPGRADE YOUR OPERATORY SUPPLY CHAIN',
  ctaTitle: 'Ready to Procure 100% Genuine Supplies with Batch Guarantees?',
  ctaSubtitle:
    'Join over 1,420+ verified solo clinics, multispecialty dental hospitals, and academic institutions across India.',
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

export function addContactEnquiry(
  entry: Omit<ContactEnquiry, 'id' | 'srNo' | 'receivedAt'> & { receivedAt?: string }
): ContactEnquiry {
  const current = getContactEnquiries();
  const dateFormatted =
    entry.receivedAt ||
    new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const newEntry: ContactEnquiry = {
    ...entry,
    id: `enq-${Date.now()}`,
    srNo: current.length + 1,
    receivedAt: dateFormatted,
    status: entry.status || 'New',
  };

  const updated = [newEntry, ...current];
  saveContactEnquiries(updated);
  return newEntry;
}

export function updateContactEnquiryStatus(
  id: string,
  status: EnquiryStatus,
  notes?: string
): void {
  const current = getContactEnquiries();
  const updated = current.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        status,
        ...(notes !== undefined ? { notes } : {}),
      };
    }
    return item;
  });
  saveContactEnquiries(updated);
}

export function toggleStarEnquiry(id: string): boolean {
  const current = getContactEnquiries();
  let nextVal = false;
  const updated = current.map((item) => {
    if (item.id === id) {
      nextVal = !item.isStarred;
      return { ...item, isStarred: nextVal };
    }
    return item;
  });
  saveContactEnquiries(updated);
  return nextVal;
}

export function deleteContactEnquiry(id: string): void {
  const current = getContactEnquiries();
  const updated = current.filter((item) => item.id !== id);
  // Re-index srNo
  const reindexed = updated.map((item, idx) => ({ ...item, srNo: idx + 1 }));
  saveContactEnquiries(reindexed);
}

export function getContactSettings(): ContactCustomizerSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(initialContactSettings));
      return initialContactSettings;
    }
    return { ...initialContactSettings, ...JSON.parse(raw) };
  } catch {
    return initialContactSettings;
  }
}

export function saveContactSettings(settings: ContactCustomizerSettings): void {
  try {
    const updated = {
      ...settings,
      updatedAt: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving contact settings to localStorage', e);
  }
}

export function resetContactSettings(): ContactCustomizerSettings {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(initialContactSettings));
  } catch {
    // fallback
  }
  return initialContactSettings;
}
