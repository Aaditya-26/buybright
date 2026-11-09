/**
 * BuyBright Terms of Use Page.
 * Clean, modern, responsive layout without heavy dark banners.
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../../components/common/SEO';

interface TermSection {
  id: string;
  title: string;
  icon: string;
}

const TERM_SECTIONS: TermSection[] = [
  { id: 'compliance-notice', title: 'Marketplace Compliance', icon: 'fa-solid fa-file-shield' },
  { id: 'key-terms', title: 'Terms & Conditions (1-27)', icon: 'fa-solid fa-list-check' },
  { id: 'privacy-summary', title: 'Privacy Summary', icon: 'fa-solid fa-shield-halved' },
  { id: 'limited-license', title: 'Limited Licensure', icon: 'fa-solid fa-scale-balanced' },
  { id: 'general-terms', title: 'General Provisions', icon: 'fa-solid fa-gavel' },
  { id: 'support-contact', title: 'Contact & Support', icon: 'fa-solid fa-headset' },
];

export const TermsOfUsePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('compliance-notice');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of TERM_SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 90;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="pd-terms-page">
      <SEO
        title="Terms of Use — BuyBright"
        description="Review the BuyBright Terms of Use, Consumer Protection compliance, ordering conditions, delivery zones, and customer agreement."
        canonicalUrl="/terms-of-use"
      />

      {/* Clean Light Header */}
      <header className="policy-clean-header">
        <div className="policy-header-container">
          <div className="policy-breadcrumb">
            <Link to="/">
              <i className="fa-solid fa-house" /> Home
            </Link>
            <i className="fa-solid fa-chevron-right separator" />
            <Link to="/contact">Customer Support</Link>
            <i className="fa-solid fa-chevron-right separator" />
            <span className="current">Terms of Use</span>
          </div>

          <div className="policy-header-main">
            <div className="policy-badge-pill">
              <i className="fa-solid fa-scale-balanced" />
              <span>Platform Agreement &amp; Consumer Protection Compliance</span>
            </div>

            <h1 className="policy-title">Terms of Use</h1>
            <p className="policy-lead-text">
              Welcome to <strong>BuyBright Marketplace</strong>. BuyBright is a multi-seller e-commerce platform.
              Please read this agreement carefully before proceeding with your marketplace purchases.
            </p>

            <div className="policy-meta-bar">
              <div className="meta-item">
                <i className="fa-regular fa-calendar-check" />
                <span>Effective Date: <strong>March 2026</strong></span>
              </div>
              <div className="meta-item">
                <i className="fa-solid fa-landmark" />
                <span>Jurisdiction: <strong>Mumbai, India</strong></span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content Layout */}
      <section className="terms-content-section">
        <div className="terms-layout-container">
          {/* Table of Contents Sidebar */}
          <aside className="terms-toc-sidebar">
            <div className="terms-toc-card">
              <div className="toc-header">
                <i className="fa-solid fa-list-ul" />
                <h3>Navigation Index</h3>
              </div>
              <nav className="toc-nav">
                {TERM_SECTIONS.map((sec, idx) => (
                  <button
                    key={sec.id}
                    type="button"
                    className={`toc-link ${activeSection === sec.id ? 'active' : ''}`}
                    onClick={() => scrollToSection(sec.id)}
                  >
                    <span className="toc-num">{idx + 1}</span>
                    <span className="toc-text">{sec.title}</span>
                    <i className="fa-solid fa-chevron-right toc-arrow" />
                  </button>
                ))}
              </nav>

              <div className="toc-support-card">
                <div className="support-icon-wrap">
                  <i className="fa-solid fa-envelope" />
                </div>
                <div className="support-info">
                  <strong>Need Clarification?</strong>
                  <p>Reach out to our customer care desk for order or compliance queries.</p>
                </div>
                <a href="mailto:support@buybright.com" className="btn-toc-mail">
                  support@buybright.com
                </a>
              </div>
            </div>
          </aside>

          {/* Main Legal Content */}
          <main className="terms-main-body">
            {/* Agreement & Compliance Callout */}
            <div id="compliance-notice" className="terms-mdr-callout">
              <div className="mdr-header">
                <div className="mdr-icon-badge">
                  <i className="fa-solid fa-file-shield" />
                </div>
                <div>
                  <h3>Binding Agreement &amp; Consumer Protection Mandate</h3>
                  <span className="mdr-sub-label">Verified Multi-Seller Marketplace Policy</span>
                </div>
              </div>

              <div className="mdr-body">
                <p>
                  With any purchase from <strong>BuyBright Marketplace</strong> website/app, customer unconditionally agrees to the terms and conditions mentioned below even if you have read them or not. Please read this agreement carefully before proceeding, as customer is bound to these conditions for accessing, browsing or purchase. If you (customer) do not agree and accept any of the terms, conditions and policies unconditionally, do not use this platform.
                </p>

                <div className="mdr-highlight-box">
                  <i className="fa-solid fa-triangle-exclamation" />
                  <div>
                    <strong>Marketplace Buyer &amp; Seller Eligibility:</strong>
                    <p>
                      In accordance with the Consumer Protection (E-Commerce) Rules, BuyBright connects verified third-party sellers with consumers across India with transparent pricing and warranty.{' '}
                      <a
                        href="https://consumeraffairs.nic.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mdr-link"
                      >
                        Click here <i className="fa-solid fa-arrow-up-right-from-square" />
                      </a>{' '}
                      for more details.
                    </p>
                    <p className="mdr-note-sub">
                      Buyers and sellers are required to provide accurate contact, billing, and tax information when completing transactions on the platform.
                    </p>
                  </div>
                </div>

                <div className="terms-governance-strip">
                  <p>
                    These Terms of Use govern all the products offered on the platform of <strong>BuyBright Marketplace</strong> website/app.
                  </p>
                  <p className="governance-def">
                    Throughout this document, <strong>“we”</strong>, <strong>“us”</strong>, <strong>“our”</strong>, <strong>“ours”</strong> refer to BuyBright Marketplace website/app. Wherever the text mentions <strong>‘you’</strong> or <strong>‘your’</strong>, this means <strong>YOU (reader/customer)</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* 27 Numbered Terms Grid / List */}
            <div id="key-terms" className="terms-clauses-wrapper">
              <div className="clauses-title-header">
                <i className="fa-solid fa-gavel" />
                <h2>Terms and Conditions of Purchase &amp; Usage</h2>
              </div>

              <div className="clauses-list">
                {/* 1 */}
                <div className="clause-item">
                  <span className="clause-num">1</span>
                  <div className="clause-content">
                    <p>
                      You acknowledge and undertake that you are wholly responsible for your decision to buy any product/products after your own analysis, judgement and thereafter transaction done by you on this website. <strong>BuyBright Marketplace</strong> website/app takes no responsibility of the usage, implementation and result/outcome of the products. It is entirely buyer’s/user’s responsibility to choose and decide the right product.
                    </p>
                  </div>
                </div>

                {/* 2 */}
                <div className="clause-item">
                  <span className="clause-num">2</span>
                  <div className="clause-content">
                    <p>
                      <strong>BuyBright Marketplace</strong> website/app reserves the right to refuse access to the website, terminate accounts, remove or edit content at any time without any prior notice and with absolute discretion.
                    </p>
                  </div>
                </div>

                {/* 3 */}
                <div className="clause-item">
                  <span className="clause-num">3</span>
                  <div className="clause-content">
                    <p>
                      In case of any violation of the terms and conditions, <strong>BuyBright Marketplace</strong> website/app reserves the right to refuse further use of services or even terminate account without any prior notice.
                    </p>
                  </div>
                </div>

                {/* 4 */}
                <div className="clause-item">
                  <span className="clause-num">4</span>
                  <div className="clause-content">
                    <p>
                      Entitlement to the goods remains that of <strong>BuyBright Marketplace</strong> website/app until you have paid for them. Entitlement will pass to you once the goods are paid in full and all payments have been cleared by a relevant banking process.
                    </p>
                  </div>
                </div>

                {/* 5 */}
                <div className="clause-item">
                  <span className="clause-num">5</span>
                  <div className="clause-content">
                    <p>
                      <strong>BuyBright Marketplace</strong> website/app reserves the right to not allow any changes to the order after the order has been accepted/placed.
                    </p>
                  </div>
                </div>

                {/* 6 */}
                <div className="clause-item">
                  <span className="clause-num">6</span>
                  <div className="clause-content">
                    <p>
                      <strong>BuyBright Marketplace</strong> website/app will not be responsible for any transactions done by mistake due to any internet issue at customer’s end.
                    </p>
                  </div>
                </div>

                {/* 7 */}
                <div className="clause-item">
                  <span className="clause-num">7</span>
                  <div className="clause-content">
                    <p>
                      All reasonable attempts will be made to ensure that all the information given on this website is accurate, but offers no liability or assurance of genuineness of the information. <strong>BuyBright Marketplace</strong> website/app will not be responsible for any errors or incomplete information of products on its website.
                    </p>
                  </div>
                </div>

                {/* 8 */}
                <div className="clause-item">
                  <span className="clause-num">8</span>
                  <div className="clause-content">
                    <p>
                      <strong>BuyBright Marketplace</strong> website/app assumes that you are a genuine buyer or authorized representative acting legally. Any accidental or intentional order placed by an unauthorized user is solely the responsibility of the account holder.
                    </p>
                  </div>
                </div>

                {/* 9 */}
                <div className="clause-item">
                  <span className="clause-num">9</span>
                  <div className="clause-content">
                    <p>
                      Customer is solely responsible for the account information like username and password and you hereby undertake the responsibility of any action taking place in your account.
                    </p>
                  </div>
                </div>

                {/* 10 */}
                <div className="clause-item">
                  <span className="clause-num">10</span>
                  <div className="clause-content">
                    <p>
                      You acknowledge and agree that any information provided by you is only yours and does not infringe the confidentiality of a third party/person in any way.
                    </p>
                  </div>
                </div>

                {/* 11 */}
                <div className="clause-item">
                  <span className="clause-num">11</span>
                  <div className="clause-content">
                    <p>
                      If you are making a purchase on someone else’s behalf, you agree and bound the account holder to all the terms and conditions of <strong>BuyBright Marketplace</strong> website/app.
                    </p>
                  </div>
                </div>

                {/* 12 */}
                <div className="clause-item highlight-clause">
                  <span className="clause-num">12</span>
                  <div className="clause-content">
                    <p>
                      In case of any knowledge or belief that your information has been breached in any way, you must contact <strong>BuyBright Marketplace</strong> website/app at <a href="mailto:support@buybright.com">support@buybright.com</a>.
                    </p>
                  </div>
                </div>

                {/* 13 */}
                <div className="clause-item">
                  <span className="clause-num">13</span>
                  <div className="clause-content">
                    <p>
                      If any issue is suspected as per the confidentiality of your account, you might be asked to change your password or re-register with no liability of <strong>BuyBright Marketplace</strong> website/app.
                    </p>
                  </div>
                </div>

                {/* 14 */}
                <div className="clause-item">
                  <span className="clause-num">14</span>
                  <div className="clause-content">
                    <p>
                      The pictures of all products at <strong>BuyBright Marketplace</strong> website/app are merely indicated for information and may vary from the actual product. Product packaging also might vary or change from time to time.
                    </p>
                  </div>
                </div>

                {/* 15 */}
                <div className="clause-item">
                  <span className="clause-num">15</span>
                  <div className="clause-content">
                    <p>
                      <strong>BuyBright Marketplace</strong> website/app strives to provide accurate product and pricing information; however, errors may occur.
                    </p>
                  </div>
                </div>

                {/* 16 */}
                <div className="clause-item">
                  <span className="clause-num">16</span>
                  <div className="clause-content">
                    <p>
                      <strong>BuyBright Marketplace</strong> website/app reserves all rights to change/alter prices of any product and suspend/cancel orders at any point of time unless it has been received by the customer.
                    </p>
                  </div>
                </div>

                {/* 17 */}
                <div className="clause-item">
                  <span className="clause-num">17</span>
                  <div className="clause-content">
                    <p>
                      No changes can be made to the order once the order has been dispatched from our fulfillment network. However, if you still require to contact us then drop us an email at <a href="mailto:support@buybright.com">support@buybright.com</a>. Our dedicated team aims to contact you within 24 hours. If ordered by mistake, you can still return the items by simply contacting our customer service.
                    </p>
                  </div>
                </div>

                {/* 18 */}
                <div className="clause-item">
                  <span className="clause-num">18</span>
                  <div className="clause-content">
                    <p>
                      In case of any delays in delivery you may track the status of your order by visiting ‘My Orders’. Our aim is to meet the delivery times but during busy periods like promotional sale, festive occasions, tech updates, extreme weather conditions may delay the delivery and it may take a little longer time than mentioned. <strong>BuyBright Marketplace</strong> website/app will not be responsible for any such delays; however, we always work hard to keep these temporary changes to a minimum. For any queries related to delays you may contact us by dropping an email at <a href="mailto:support@buybright.com">support@buybright.com</a>.
                    </p>
                  </div>
                </div>

                {/* 19 */}
                <div className="clause-item">
                  <span className="clause-num">19</span>
                  <div className="clause-content">
                    <p>
                      In case of cancellation of the paid order, the paid amount will be reversed to the account information provided at the time of purchase and <strong>BuyBright Marketplace</strong> website/app will not be responsible for any accurate time duration taken in the transfer. Transfer is solely due as per the time taken by the bank.
                    </p>
                  </div>
                </div>

                {/* 20 */}
                <div className="clause-item">
                  <span className="clause-num">20</span>
                  <div className="clause-content">
                    <p>
                      If any product is found unavailable after receiving the order, customer will be notified of the order cancellation via email and payment will be refunded to the same account of the account holder from which payment was made. <strong>BuyBright Marketplace</strong> website/app shall not be liable to any damages in such event/events owing to cancellation of the order or delay in delivery.
                    </p>
                  </div>
                </div>

                {/* 21 */}
                <div className="clause-item payment-clause">
                  <span className="clause-num">21</span>
                  <div className="clause-content">
                    <p>
                      Payments can be made via debit card, credit card, net banking, UPI wallet, Paytm, PhonePe, Google Pay, cash on delivery as per availability of services by third party payment gateways.
                    </p>
                  </div>
                </div>

                {/* 22 */}
                <div className="clause-item">
                  <span className="clause-num">22</span>
                  <div className="clause-content">
                    <p>
                      If you use the <strong>BuyBright Marketplace</strong> website/app, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer to prevent unauthorised access to your account. You agree to accept responsibility for all activities that occur under your account or password.
                    </p>
                  </div>
                </div>

                {/* 23 */}
                <div className="clause-item">
                  <span className="clause-num">23</span>
                  <div className="clause-content">
                    <p>
                      We will do our utmost to ensure that availability of the website will be uninterrupted and that transmissions will be error-free. However, this cannot be guaranteed due to nature of the Internet. Also, your access to the website may also be occasionally suspended or restricted to allow for repairs, maintenance, or the introduction of new features or services at any time without prior notice. We will attempt to limit the frequency and duration of any such suspension or restriction.
                    </p>
                  </div>
                </div>

                {/* 24 */}
                <div className="clause-item">
                  <span className="clause-num">24</span>
                  <div className="clause-content">
                    <p>
                      Any content of this website must not be copied, reproduced, sold/resold or duplicated for any commercial activity without prior written consent of BuyBright.
                    </p>
                  </div>
                </div>

                {/* 25 */}
                <div className="clause-item">
                  <span className="clause-num">25</span>
                  <div className="clause-content">
                    <p>
                      You must not use this website for any fraudulent/unlawful activity whatsoever.
                    </p>
                  </div>
                </div>

                {/* 26 */}
                <div className="clause-item jurisdiction-clause">
                  <span className="clause-num">26</span>
                  <div className="clause-content">
                    <p>
                      <strong>Jurisdiction:</strong> Any dispute will be subjected to <strong>Mumbai jurisdiction only</strong>.
                    </p>
                  </div>
                </div>

                {/* 27 */}
                <div className="clause-item delivery-clause">
                  <span className="clause-num">27</span>
                  <div className="clause-content">
                    <p>
                      <strong>Express Delivery Zone:</strong> Priority same-day and 24-hour delivery is available across major metro zones (Mumbai, Pune, Delhi NCR, Bengaluru, Hyderabad). Standard pan-India shipping takes 48–72 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Policy Section */}
            <div id="privacy-summary" className="terms-section-card">
              <div className="terms-card-header">
                <div className="header-icon-box">
                  <i className="fa-solid fa-shield-halved" />
                </div>
                <h2>Privacy Policy Summary</h2>
              </div>
              <div className="terms-card-body">
                <p>
                  This Privacy Policy outlines the approach of <strong>BuyBright Marketplace</strong> to Data Protection and Privacy in fulfillment of applicable Indian laws and IT Rules. This Privacy Policy applies to your Personal information processed by us in physical or electronic form. <strong>BuyBright Marketplace</strong> is committed to safeguarding your privacy.
                </p>
                <p>
                  The information we receive and gather from you is used to register your account, verify identity, process checkout payments, communicate order updates, inform about promotional offers, and maintain account security. We also use this information to customize your experience and improve platform services.
                </p>

                <ul className="terms-bullet-list">
                  <li>
                    <i className="fa-solid fa-circle-check" />
                    <span>We understand that your personal information is sensitive and take industry-standard measures to ensure its absolute protection.</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check" />
                    <span>You can choose not to provide certain information, though that may limit access to specific platform features like checkout.</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check" />
                    <span>Continued use of this website signifies your agreement to these terms and any future modifications.</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check" />
                    <span>We recommend reviewing this page periodically for updates to marketplace policies.</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check" />
                    <span>By accepting these terms, you consent to BuyBright processing your contact and shipping information for order delivery.</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check" />
                    <span>Information recorded includes: name, contact number, email address, shipping address, and secure payment transaction tokens.</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check" />
                    <span>Technical details collected include device type, browser metadata, and IP address for session security.</span>
                  </li>
                </ul>

                <div className="terms-privacy-redirect">
                  <i className="fa-solid fa-lock" />
                  <span>
                    For full privacy practices and data disclosures, please read our dedicated{' '}
                    <Link to="/privacy-policy">Privacy Policy</Link> page.
                  </span>
                </div>
              </div>
            </div>

            {/* Limited Licensure */}
            <div id="limited-license" className="terms-section-card">
              <div className="terms-card-header">
                <div className="header-icon-box">
                  <i className="fa-solid fa-scale-balanced" />
                </div>
                <h2>Limited Licensure</h2>
              </div>
              <div className="terms-card-body">
                <p>
                  <strong>BuyBright Marketplace</strong> website/app grants you a limited, non-exclusive, non-transferable license to access and make personal or commercial use of the platform. All rights not expressly granted to you are reserved by BuyBright and its affiliates.
                </p>
                <p>
                  <strong>BuyBright Marketplace</strong> reserves the right, at any time without notice, to terminate accounts or block access in cases of fraudulent activity or policy violation.
                </p>
              </div>
            </div>

            {/* General Provisions */}
            <div id="general-terms" className="terms-section-card">
              <div className="terms-card-header">
                <div className="header-icon-box">
                  <i className="fa-solid fa-gavel" />
                </div>
                <h2>General Provisions</h2>
              </div>
              <div className="terms-card-body">
                <p>
                  You acknowledge and agree that these Terms of Use constitute the complete agreement between you and <strong>BuyBright Marketplace</strong> concerning your use of the website and services.
                </p>
                <p>
                  We reserve the right to alter these Terms at any time by posting updates on the platform. Continued use constitutes acceptance of all revised terms.
                </p>
              </div>
            </div>

            {/* Support Desk Card */}
            <div id="support-contact" className="terms-support-card">
              <div className="support-header-row">
                <div className="support-badge-icon">
                  <i className="fa-solid fa-headset" />
                </div>
                <div>
                  <h3>BuyBright Compliance &amp; Support Desk</h3>
                  <p>Have questions regarding our terms, marketplace orders, or delivery policies?</p>
                </div>
              </div>

              <div className="support-channel-grid">
                <a href="mailto:support@buybright.com" className="support-channel-box">
                  <i className="fa-solid fa-envelope" />
                  <div>
                    <span>Official Email</span>
                    <strong>support@buybright.com</strong>
                  </div>
                </a>

                <a href="tel:+918806488054" className="support-channel-box">
                  <i className="fa-solid fa-phone" />
                  <div>
                    <span>Customer Helpline</span>
                    <strong>+91 88064 88054</strong>
                  </div>
                </a>

                <a
                  href="https://wa.me/918806488054"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="support-channel-box whatsapp-box"
                >
                  <i className="fa-brands fa-whatsapp" />
                  <div>
                    <span>WhatsApp Support</span>
                    <strong>+91 88064 88054</strong>
                  </div>
                </a>
              </div>

              <div className="terms-nav-buttons">
                <Link to="/" className="btn-back-home">
                  <i className="fa-solid fa-arrow-left" /> Return to Homepage
                </Link>
                <Link to="/privacy-policy" className="btn-view-privacy">
                  <i className="fa-solid fa-shield-check" /> View Privacy Policy
                </Link>
              </div>
            </div>
          </main>
        </div>
      </section>
    </div>
  );
};

export default TermsOfUsePage;
