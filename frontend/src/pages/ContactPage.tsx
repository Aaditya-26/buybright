/**
 * BuyBright Dedicated Contact Us Page View.
 * Implements:
 * 1. Breadcrumbs & Modern Dental Hero Header with Live Support Status
 * 2. 4 Fast-Action Communication Channel Cards (Call, WhatsApp, Email, Hubs)
 * 3. Interactive Multi-Category Inquiry & Bulk RFQ Form with Validation & Instant Confirmation
 * 4. Dental Concierge & Strategic Logistics Depot Highlights
 * 5. Interactive Categorized FAQ Accordion
 * 6. Responsive Map & Hub Location Suite
 * 7. Fast-Track WhatsApp CTA Banner
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { SEO } from '../components/common/SEO';
import { MathCaptcha } from '../components/common/MathCaptcha';
import { addContactEnquiry, getContactSettings } from '../admin/data/contactData';

interface FAQItem {
  id: string;
  category: 'delivery' | 'bulk' | 'gst' | 'quality';
  question: string;
  answer: string;
}

const FAQS_DATA: FAQItem[] = [
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

const HUB_LOCATIONS = [
  {
    city: 'Mumbai Central Logistics Hub',
    state: 'Maharashtra',
    address: 'Unit 402, Presto Heights, MIDC Central Road, Andheri East, Mumbai 400069',
    phone: '+91 88064 88054',
    email: 'mumbai.hub@prestodental.in',
    timing: 'Mon – Sat: 8:30 AM – 8:00 PM',
    tag: 'Primary Cold-Chain Depot',
    icon: 'fa-solid fa-warehouse',
    isPrimary: true,
  },
  {
    city: 'Pune Air Express Logistics Center',
    state: 'Maharashtra',
    address: 'Plot 18, Phase 1 Commercial Spine, Rajiv Gandhi Infotech Park, Hinjewadi, Pune 411057',
    phone: '+91 88064 88054',
    email: 'pune.desk@prestodental.in',
    timing: 'Mon – Sat: 9:00 AM – 7:30 PM',
    tag: '  Express Terminal',
    icon: 'fa-solid fa-truck-fast',
    isPrimary: false,
  },
];

export const ContactPage: React.FC = () => {
  const { showToast } = useToast();
  const contactSettings = getContactSettings();

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Contact & Support Desk | BuyBright Supplies';
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNo: '',
    email: '',
    commentOrMessage: '',
    agreedToContact: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isCaptchaValid, setIsCaptchaValid] = useState<boolean>(false);
  const [captchaError, setCaptchaError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // FAQ Active Category and Open Accordions
  const [activeFaqCategory, setActiveFaqCategory] = useState<'all' | 'delivery' | 'bulk' | 'gst' | 'quality'>('all');
  const [openFaqIds, setOpenFaqIds] = useState<string[]>(['faq-1', 'faq-4']);

  const handleToggleFaq = (id: string) => {
    setOpenFaqIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const allFaqs = contactSettings.faqs && contactSettings.faqs.length > 0 ? contactSettings.faqs : FAQS_DATA;

  const filteredFaqs =
    activeFaqCategory === 'all'
      ? allFaqs
      : allFaqs.filter((faq) => faq.category === activeFaqCategory);

  // Single field validation rule
  const validateSingleField = (name: string, value: string | boolean): string => {
    switch (name) {
      case 'firstName':
        if (typeof value !== 'string' || !value.trim()) return 'First name is required.';
        if (value.trim().length < 2) return 'First name must be at least 2 characters.';
        return '';
      case 'lastName':
        if (typeof value !== 'string' || !value.trim()) return 'Last name is required.';
        return '';
      case 'mobileNo': {
        if (typeof value !== 'string') return 'Mobile number is required.';
        const clean = value.replace(/[^0-9]/g, '');
        if (!clean) return 'Mobile number is required.';
        if (clean.length < 10) return 'Please enter a valid 10-digit mobile number.';
        return '';
      }
      case 'email':
        if (typeof value !== 'string' || !value.trim()) return 'Email address is required.';
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value.trim())) {
          return 'Please enter a valid email format (e.g. name@example.com).';
        }
        return '';
      case 'commentOrMessage':
        if (typeof value !== 'string' || !value.trim()) return 'Please enter your comment or message.';
        if (value.trim().length < 5) return 'Message must be at least 5 characters.';
        return '';
      case 'agreedToContact':
        if (!value) return 'Please accept the consent checkbox to continue.';
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const nextVal = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({ ...prev, [name]: nextVal }));

    // If already touched, validate in real time
    if (touched[name]) {
      const fieldError = validateSingleField(name, nextVal);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
  };

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const val = formData[name as keyof typeof formData];
    const fieldError = validateSingleField(name, val);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const allErrors: Record<string, string> = {
      firstName: validateSingleField('firstName', formData.firstName),
      lastName: validateSingleField('lastName', formData.lastName),
      mobileNo: validateSingleField('mobileNo', formData.mobileNo),
      email: validateSingleField('email', formData.email),
      commentOrMessage: validateSingleField('commentOrMessage', formData.commentOrMessage),
      agreedToContact: validateSingleField('agreedToContact', formData.agreedToContact),
    };

    // Filter to active error messages
    const activeErrors: Record<string, string> = {};
    Object.keys(allErrors).forEach((key) => {
      if (allErrors[key]) activeErrors[key] = allErrors[key];
    });

    setErrors(activeErrors);
    setTouched({
      firstName: true,
      lastName: true,
      mobileNo: true,
      email: true,
      commentOrMessage: true,
      agreedToContact: true,
    });

    let hasCaptchaError = false;
    if (!isCaptchaValid) {
      setCaptchaError('Please solve the security math challenge correctly.');
      hasCaptchaError = true;
    } else {
      setCaptchaError(undefined);
    }

    if (Object.keys(activeErrors).length > 0 || hasCaptchaError) {
      showToast('Please correct the highlighted errors and solve the math challenge.', 'danger', 'Validation Error');
      return;
    }

    setIsSubmitting(true);

    // Save to BuyBright enquiries database (localStorage)
    try {
      addContactEnquiry({
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobileNo: formData.mobileNo,
        email: formData.email,
        commentOrMessage: formData.commentOrMessage,
        agreedToContact: formData.agreedToContact,
        status: 'New',
      });
    } catch (err) {
      console.error('Failed to save enquiry locally', err);
    }

    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast('✓ Inquiry submitted successfully! Oursupply desk will contact you.', 'success');
    }, 700);
  };

  const handleResetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      mobileNo: '',
      email: '',
      commentOrMessage: '',
      agreedToContact: false,
    });
    setErrors({});
    setTouched({});
    setIsSubmitted(false);
  };

    return (
      <div className="contact-page-wrapper">
        <SEO
          title="Contact Support &amp;Procurement Desk"
          description="Contact BuyBrightsupport team for bulk quotes, institutional orders, order status, cold-chain delivery questions, and GST invoicing."
          canonicalUrl="https://buybright.com/contact"
          keywords="contact prestodental, dental supply helpline, bulk dental supplies quote, dental equipment support"
          jsonLd={{
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "BuyBright Support Desk",
            "url": "https://buybright.com/contact",
            "description": "Customer andsupport desk for BuyBright.",
            "mainEntity": {
              "@type": "MedicalOrganization",
              "name": "BuyBright",
              "telephone": "+91 88064 88054",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91 88064 88054",
                "contactType": "Customer Support",
                "availableLanguage": ["English", "Hindi", "Marathi"]
              }
            }
          }}
        />

        {/* 1. Breadcrumb Bar */}
        <div className="contact-breadcrumb-bar">
          <div className="contact-container">
            <nav className="contact-breadcrumb" aria-label="Breadcrumb">
              <Link to="/" className="breadcrumb-link">
                <i className="fa-solid fa-house" />
                <span>Home</span>
              </Link>
              <i className="fa-solid fa-chevron-right breadcrumb-separator" />
              <span className="breadcrumb-active">Contact &amp; Support Desk</span>
            </nav>
          </div>
        </div>

        {/* 2. Hero Section */}
        <section className="contact-hero-section">
          {/* Decorative Ambient Glows matching Shop Banner */}
          <div className="banner-ambient-glow glow-1" />
          <div className="banner-ambient-glow glow-2" />

          <div className="contact-container">
            <div className="contact-hero-content">
              <div className="contact-hero-badge">
                <span className="live-pulse-dot" />
                <span>{contactSettings.heroBadge || 'PRESTODENTAL DENTAL CONCIERGE • RESPONSE TIME < 15 MINS'}</span>
              </div>

              <h1 className="contact-hero-title">
                {contactSettings.heroTitle || (
                  <>
                    We're Here to Power Your Dental Practice with{' '}
                    <span className="text-gradient">Genuine Supplies &amp; Expert Support</span>
                  </>
                )}
              </h1>

              <p className="contact-hero-lead">
                {contactSettings.heroSubtitle ||
                  'Direct access for hospital bulk quotes, batch quality certifications, cold-chain shipment tracking, and GST tax invoicing. Connect directly with our team of dental product specialists.'}
              </p>

              {/* Quick Channel Cards Matrix */}
              <div className="hero-channel-cards-grid">
                {/* Channel 1: Phone */}
                <a href={`tel:${contactSettings.phoneNumber?.replace(/[^0-9+]/g, '') || '+918806488054'}`} className="channel-card">
                  <div className="channel-icon-wrap phone-icon">
                    <i className="fa-solid fa-phone-volume" />
                  </div>
                  <div className="channel-card-body">
                    <span className="channel-tag">{contactSettings.phoneTag || 'Direct Doctor Helpline'}</span>
                    <strong className="channel-title">{contactSettings.phoneNumber || '+91 88064 88054'}</strong>
                    <span className="channel-timing">{contactSettings.phoneTiming || 'Mon – Sat: 8:30 AM – 8:00 PM'}</span>
                  </div>
                  <div className="channel-action-btn">
                    <span>Call Now</span>
                    <i className="fa-solid fa-arrow-right" />
                  </div>
                </a>

                {/* Channel 2: WhatsApp */}
                <a
                  href={`https://wa.me/${contactSettings.whatsappNumber?.replace(/[^0-9]/g, '') || '918806488054'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="channel-card whatsapp-channel"
                >
                  <div className="channel-icon-wrap whatsapp-icon">
                    <i className="fa-brands fa-whatsapp" />
                  </div>
                  <div className="channel-card-body">
                    <span className="channel-tag">{contactSettings.whatsappTag || 'Instant WhatsApp Desk'}</span>
                    <strong className="channel-title">{contactSettings.whatsappNumber || '+91 88064 88054'}</strong>
                    <span className="channel-timing">{contactSettings.whatsappTiming || 'Instant replies in < 5 mins'}</span>
                  </div>
                  <div className="channel-action-btn">
                    <span>Chat on WhatsApp</span>
                    <i className="fa-solid fa-arrow-right" />
                  </div>
                </a>

                {/* Channel 3: Email */}
                <a href={`mailto:${contactSettings.emailAddress || 'support@prestodental.in'}`} className="channel-card">
                  <div className="channel-icon-wrap email-icon">
                    <i className="fa-solid fa-envelope-open-text" />
                  </div>
                  <div className="channel-card-body">
                    <span className="channel-tag">{contactSettings.emailTag || 'Official Inquiries & Orders'}</span>
                    <strong className="channel-title">{contactSettings.emailAddress || 'support@prestodental.in'}</strong>
                    <span className="channel-timing">{contactSettings.emailTiming || 'GST Billing & Institutional RFQs'}</span>
                  </div>
                  <div className="channel-action-btn">
                    <span>Send Email</span>
                    <i className="fa-solid fa-arrow-right" />
                  </div>
                </a>

                {/* Channel 4: Fulfillment Hubs */}
                <div className="channel-card">
                  <div className="channel-icon-wrap hub-icon">
                    <i className="fa-solid fa-hospital" />
                  </div>
                  <div className="channel-card-body">
                    <span className="channel-tag">{contactSettings.hubsTag || 'Fulfillment Network'}</span>
                    <strong className="channel-title">{contactSettings.hubsTitle || 'Mumbai & Pune Hubs'}</strong>
                    <span className="channel-timing">{contactSettings.hubsTiming || '  Dispatches Pan-India'}</span>
                  </div>
                  <div className="channel-action-btn">
                    <span>View Locations</span>
                    <i className="fa-solid fa-arrow-down" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Main Inquiry Suite & Concierge Highlights */}
        <section className="contact-main-suite-section">
          <div className="contact-container">
            <div className="contact-suite-grid">
              {/* Left Column: Interactive Inquiry & Bulk RFQ Form */}
              <div className="contact-form-card">
                <div className="form-card-header">
                  <div className="header-pill">
                    <i className="fa-solid fa-paper-plane text-teal" />
                    <span>{contactSettings.formPill || 'DIRECT INQUIRY'}</span>
                  </div>
                  <h2 className="form-title">{contactSettings.formTitle || 'Send Us an Inquiry'}</h2>
                  <p className="form-subtitle">
                    {contactSettings.formSubtitle ||
                      'Fill in the details below. Our dental supply team will respond with product pricing, batch details, and delivery timelines.'}
                  </p>
                </div>

                {isSubmitted ? (
                  <div className="form-success-state">
                    <div className="success-icon-circle">
                      <i className="fa-solid fa-circle-check" />
                    </div>
                    <h3>Thank You, {formData.firstName ? `${formData.firstName} ${formData.lastName}`.trim() : 'Doctor'}!</h3>
                    <p>
                      Your inquiry has been assigned to our dedicated supply desk. We have received your message and will contact you at <strong>{formData.mobileNo}</strong> and <strong>{formData.email}</strong> shortly.
                    </p>
                    <div className="success-ticket-box">
                      <span className="ticket-label">Reference ID:</span>
                      <strong className="ticket-number">PD-INQ-{Math.floor(100000 + Math.random() * 900000)}</strong>
                    </div>
                    <button type="button" className="btn-send-another" onClick={handleResetForm}>
                      <i className="fa-solid fa-rotate-left" /> Send Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form className="contact-actual-form" onSubmit={handleSubmit} noValidate>
                    {/* Field 1: Name * (First & Last) */}
                    <div className="form-field-group">
                      <label>
                        Name <span className="req-star">*</span>
                      </label>
                      <div className="form-row-2">
                        <div className="name-sub-field">
                          <div className={`input-with-icon ${errors.firstName && touched.firstName ? 'has-error' : ''}`}>
                            <i className="fa-solid fa-user field-icon" />
                            <input
                              type="text"
                              id="firstName"
                              name="firstName"
                              placeholder="First Name"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              onBlur={() => handleBlur('firstName')}
                              className={errors.firstName && touched.firstName ? 'has-error' : ''}
                            />
                          </div>
                           {errors.firstName && touched.firstName && (
                            <span className="contact-field-error">
                              <i className="fa-solid fa-circle-exclamation" /> {errors.firstName}
                            </span>
                          )}
                        </div>

                        <div className="name-sub-field">
                          <div className={`input-with-icon ${errors.lastName && touched.lastName ? 'has-error' : ''}`}>
                            <i className="fa-solid fa-user field-icon" />
                            <input
                              type="text"
                              id="lastName"
                              name="lastName"
                              placeholder="Last Name"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              onBlur={() => handleBlur('lastName')}
                              className={errors.lastName && touched.lastName ? 'has-error' : ''}
                            />
                          </div>
                           {errors.lastName && touched.lastName && (
                            <span className="contact-field-error">
                              <i className="fa-solid fa-circle-exclamation" /> {errors.lastName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Field 2 & 3: Mobile No. * | Email * */}
                    <div className="form-row-2">
                      <div className="form-field-group">
                        <label htmlFor="mobileNo">
                          Mobile No. <span className="req-star">*</span>
                        </label>
                        <div className={`input-with-icon ${errors.mobileNo && touched.mobileNo ? 'has-error' : ''}`}>
                          <span className="phone-prefix">+91</span>
                          <input
                            type="tel"
                            id="mobileNo"
                            name="mobileNo"
                            placeholder="9876543210"
                            value={formData.mobileNo}
                            onChange={handleInputChange}
                            onBlur={() => handleBlur('mobileNo')}
                            className={errors.mobileNo && touched.mobileNo ? 'has-error' : ''}
                          />
                        </div>
                        {errors.mobileNo && touched.mobileNo && (
                          <span className="contact-field-error">
                            <i className="fa-solid fa-circle-exclamation" /> {errors.mobileNo}
                          </span>
                        )}
                      </div>

                      <div className="form-field-group">
                        <label htmlFor="email">
                          Email <span className="req-star">*</span>
                        </label>
                        <div className={`input-with-icon ${errors.email && touched.email ? 'has-error' : ''}`}>
                          <i className="fa-solid fa-envelope field-icon" />
                          <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="doctor@dentalclinic.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            onBlur={() => handleBlur('email')}
                            className={errors.email && touched.email ? 'has-error' : ''}
                          />
                        </div>
                        {errors.email && touched.email && (
                          <span className="contact-field-error">
                            <i className="fa-solid fa-circle-exclamation" /> {errors.email}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Field 4: Comment or Message * */}
                    <div className="form-field-group">
                      <label htmlFor="commentOrMessage">
                        Comment or Message <span className="req-star">*</span>
                      </label>
                      <textarea
                        id="commentOrMessage"
                        name="commentOrMessage"
                        rows={4}
                        placeholder="Please enter your comment or message here..."
                        value={formData.commentOrMessage}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('commentOrMessage')}
                        className={errors.commentOrMessage && touched.commentOrMessage ? 'has-error' : ''}
                      />
                      {errors.commentOrMessage && touched.commentOrMessage && (
                        <span className="contact-field-error">
                          <i className="fa-solid fa-circle-exclamation" /> {errors.commentOrMessage}
                        </span>
                      )}
                    </div>

                    {/* Consent Agreement */}
                    <div className={`form-checkbox-group ${errors.agreedToContact && touched.agreedToContact ? 'has-error' : ''}`}>
                      <label className="checkbox-label" htmlFor="agreedToContact">
                        <input
                          type="checkbox"
                          id="agreedToContact"
                          name="agreedToContact"
                          checked={formData.agreedToContact}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur('agreedToContact')}
                        />
                        <span className="custom-checkbox-box" />
                        <span className="checkbox-text">
                          I agree to be contacted regarding my inquiry
                        </span>
                      </label>
                      {errors.agreedToContact && touched.agreedToContact && (
                        <span className="contact-field-error" style={{ marginLeft: '28px' }}>
                          <i className="fa-solid fa-circle-exclamation" /> {errors.agreedToContact}
                        </span>
                      )}
                    </div>

                    {/* Security Math Captcha */}
                    <MathCaptcha
                      id="contact-security-captcha"
                      onValidChange={(valid) => {
                        setIsCaptchaValid(valid);
                        if (valid) setCaptchaError(undefined);
                      }}
                      error={captchaError}
                    />

                    {/* Submit Button */}
                    <div className="form-footer-action-row">
                      <div className="form-trust-badges">
                        <span>
                          <i className="fa-solid fa-shield-check text-teal" /> 100% Secure &amp; Confidential
                        </span>
                        <span>
                          <i className="fa-solid fa-bolt text-gold" /> Rapid &lt; 15 Min Turnaround
                        </span>
                      </div>

                      <button
                        type="submit"
                        className={`btn-submit-inquiry ${isSubmitting ? 'submitting' : ''}`}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="btn-spinner" />
                            <span>Sending Message...</span>
                          </>
                        ) : (
                          <>
                            <span>Send Message</span>
                            <i className="fa-solid fa-paper-plane" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Right Column: Support Concierge & Guarantees */}
              <div className="contact-sidebar-suite">
                {/* Card 1: Fast-Track WhatsApp Concierge */}
                <div className="sidebar-concierge-card">
                  <div className="concierge-badge">
                    <i className="fa-brands fa-whatsapp" />
                    <span>{contactSettings.conciergeBadge || 'FAST-TRACK WHATSAPP DESK'}</span>
                  </div>
                  <h3>{contactSettings.conciergeTitle || 'Need Instant Stock Availability or Batch Photos?'}</h3>
                  <p>
                    {contactSettings.conciergeDescription ||
                      'Connect directly with our senior product specialist and logistics coordinator on WhatsApp for instant batch expiry verification, quotation generation, and real-time shipment updates.'}
                  </p>
                  <div className="concierge-feature-list">
                    <div className="feature-item">
                      <i className="fa-solid fa-circle-check text-teal" />
                      <span>{contactSettings.conciergeFeature1 || 'Real-time photo of batch manufacturing date & expiry'}</span>
                    </div>
                    <div className="feature-item">
                      <i className="fa-solid fa-circle-check text-teal" />
                      <span>{contactSettings.conciergeFeature2 || 'Instant Proforma Invoice (PI) generation foraccounting'}</span>
                    </div>
                    <div className="feature-item">
                      <i className="fa-solid fa-circle-check text-teal" />
                      <span>{contactSettings.conciergeFeature3 || 'Live GPS air tracking link on dispatch'}</span>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/${contactSettings.whatsappNumber?.replace(/[^0-9]/g, '') || '918806488054'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp-direct"
                  >
                    <i className="fa-brands fa-whatsapp" />
                    <span>Chat on WhatsApp ({contactSettings.whatsappNumber || '+91 88064 88054'})</span>
                  </a>
                </div>

                {/* Card 2: Strategic Hubs & Logistics */}
                <div className="sidebar-hubs-card">
                  <div className="hubs-card-header">
                    <i className="fa-solid fa-truck-fast text-teal" />
                    <h4>{contactSettings.hubsCardTitle || 'Nationwide Fulfillment & Cold-Chain Hubs'}</h4>
                  </div>

                  <div className="hubs-list">
                    {(contactSettings.hubs || HUB_LOCATIONS).map((hub, index) => (
                      <div key={index} className={`hub-item ${hub.isPrimary ? 'primary-hub' : ''}`}>
                        <div className="hub-top-row">
                          <span className="hub-tag">{hub.tag}</span>
                          <span className="hub-city">{hub.city}</span>
                        </div>
                        <p className="hub-address">
                          <a
                            href={hub.mapLink || `https://maps.google.com/?q=${encodeURIComponent(hub.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'flex-start', gap: '6px' }}
                            title="Open hub location in Google Maps"
                          >
                            <i className="fa-solid fa-location-dot" style={{ color: '#0d9488', marginTop: '3px' }} />
                            <span>{hub.address}</span>
                          </a>
                        </p>
                        <div className="hub-contact-row">
                          <span>
                            <i className="fa-solid fa-phone" /> {hub.phone}
                          </span>
                          <span>
                            <i className="fa-solid fa-clock" /> {hub.timing}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                
              </div>
            </div>
          </div>
        </section>

        {/* 4. Interactive Categorized FAQ Section */}
        <section className="contact-faq-section">
          <div className="contact-container">
            <div className="faq-section-header">
              <span className="section-pill">{contactSettings.faqPill || 'FREQUENTLY ASKED QUESTIONS'}</span>
              <h2 className="faq-heading">{contactSettings.faqHeading || 'Frequently Asked Questions'}</h2>
              <p className="faq-subheading">
                {contactSettings.faqSubheading ||
                  'Quick answers about shipping timelines, temperature control, bulk hospital discounts, and GST tax invoice claims.'}
              </p>

              {/* Category Filter Buttons */}
              <div className="faq-filter-chips">
                {[
                  { id: 'all', label: 'All FAQs', icon: 'fa-list-check' },
                  { id: 'delivery', label: 'Delivery & Cold-Chain', icon: 'fa-truck' },
                  { id: 'bulk', label: 'Bulk & Institutional Quotes', icon: 'fa-boxes-stacked' },
                  { id: 'gst', label: 'GST Invoicing & ITC', icon: 'fa-receipt' },
                  { id: 'quality', label: 'Authenticity & Returns', icon: 'fa-shield-halved' },
                ].map((btn) => (
                  <button
                    key={btn.id}
                    type="button"
                    className={`faq-chip-btn ${activeFaqCategory === btn.id ? 'active' : ''}`}
                    onClick={() => setActiveFaqCategory(btn.id as any)}
                  >
                    <i className={`fa-solid ${btn.icon}`} />
                    <span>{btn.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="faq-accordion-container">
              {filteredFaqs.map((faq) => {
                const isOpen = openFaqIds.includes(faq.id);
                return (
                  <div key={faq.id} className={`faq-card-item ${isOpen ? 'open' : ''}`}>
                    <button
                      type="button"
                      className="faq-question-btn"
                      onClick={() => handleToggleFaq(faq.id)}
                      aria-expanded={isOpen}
                    >
                      <span className="faq-q-text">{faq.question}</span>
                      <span className="faq-toggle-icon">
                        <i className={`fa-solid ${isOpen ? 'fa-minus' : 'fa-plus'}`} />
                      </span>
                    </button>

                    {isOpen && (
                      <div className="faq-answer-pane">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. Live Interactive Google Maps & Logistics Hub */}
        <section className="contact-map-section">
          <div className="contact-container">
            <div className="map-card-wrapper">
              <div className="map-card-header">
                <div className="map-header-left">
                  <span className="map-badge">
                    <i className="fa-solid fa-map-location-dot" /> {contactSettings.mapBadge || 'PRIMARY FULFILLMENT HEADQUARTERS'}
                  </span>
                  <h3>{contactSettings.mapHeading || 'Visit BuyBright Western Hub or Schedule Operatory Demo'}</h3>
                  <p>{contactSettings.mapAddress || 'Unit 402, Presto Heights, MIDC Central Road, Andheri East, Mumbai 400069, Maharashtra'}</p>
                </div>
                <div className="map-header-right">
                  <a
                    href={contactSettings.mapExternalUrl || 'https://maps.google.com/?q=MIDC+Central+Road+Andheri+East+Mumbai'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-google-maps"
                  >
                    <i className="fa-solid fa-diamond-turn-right" />
                    <span>Open in Google Maps</span>
                  </a>
                </div>
              </div>

              <div className="map-iframe-container">
                <iframe
                  title="BuyBright Headquarters Map"
                  src={
                    contactSettings.mapEmbedUrl ||
                    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.7561845610815!2d72.86873527589332!3d19.11831825064563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c83c27e852bb%3A0xc07ce9b0579e00ec!2sMIDC%20Central%20Road%2C%20Andheri%20East%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin'
                  }
                  width="100%"
                  height="380"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 6. High-Converting Bottom Action CTA Strip */}
        <section className="contact-bottom-cta-section">
          <div className="contact-container">
            <div className="bottom-cta-banner">
              <div className="cta-content-col">
                <span className="cta-pill">{contactSettings.ctaPill || 'UPGRADE YOUR OPERATORY SUPPLY CHAIN'}</span>
                <h2>{contactSettings.ctaTitle || 'Ready to Procure 100% Genuine Supplies with Batch Guarantees?'}</h2>
                <p>
                  {contactSettings.ctaSubtitle ||
                    'Join over 1,420+ verified solo clinics, multispecialty dental hospitals, and academic institutions across India.'}
                </p>
              </div>
              <div className="cta-actions-col">
                
                <a
                  href={`https://wa.me/${contactSettings.ctaWhatsAppNumber?.replace(/[^0-9]/g, '') || '918806488054'}?text=Hello%20BuyBright%2C%20I%20would%20like%20to%20place%20a%20clinic%20order.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-cta-whatsapp"
                >
                  <i className="fa-brands fa-whatsapp" />
                  <span>Quick WhatsApp Order</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };
