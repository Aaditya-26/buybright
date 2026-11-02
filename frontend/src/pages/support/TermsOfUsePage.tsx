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
  { id: 'mdr-notice', title: 'MDR Council Notice', icon: 'fa-solid fa-file-medical' },
  { id: 'key-terms', title: 'Terms & Conditions (1-27)', icon: 'fa-solid fa-list-check' },
  { id: 'privacy-summary', title: 'Privacy Summary', icon: 'fa-solid fa-shield-halved' },
  { id: 'limited-license', title: 'Limited Licensure', icon: 'fa-solid fa-scale-balanced' },
  { id: 'general-terms', title: 'General Provisions', icon: 'fa-solid fa-gavel' },
  { id: 'support-contact', title: 'Contact & Support', icon: 'fa-solid fa-headset' },
];

export const TermsOfUsePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('mdr-notice');

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
        description="Review the BuyBright Terms of Use, Medical Device Rules (MDR) compliance, ordering conditions, delivery zones, and customer agreement."
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
              <span>Platform Agreement &amp; Medical Device Rules Compliance</span>
            </div>

            <h1 className="policy-title">Terms of Use</h1>
            <p className="policy-lead-text">
              Welcome to <strong>Prestodental.store</strong>. BuyBright is registered with BuyBright.
              Please read this agreement carefully before proceeding with your dental purchases.
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
                <a href="mailto:support@Prestodental.store" className="btn-toc-mail">
                  support@Prestodental.store
                </a>
              </div>
            </div>
          </aside>

          {/* Main Legal Content */}
          <main className="terms-main-body">
            {/* Agreement & MDR Rules Callout */}
            <div id="mdr-notice" className="terms-mdr-callout">
              <div className="mdr-header">
                <div className="mdr-icon-badge">
                  <i className="fa-solid fa-file-shield" />
                </div>
                <div>
                  <h3>Binding Agreement &amp; Medical Device Rules (MDR) Mandate</h3>
                  <span className="mdr-sub-label">Mandatory Dental &amp; Medical Council Verification</span>
                </div>
              </div>

              <div className="mdr-body">
                <p>
                  With any purchase from <strong>Prestodental.store</strong> website/app, customer unconditionally agrees to the terms and conditions mentioned below even if you have read them or not. Please read this agreement carefully before proceeding, as customer is bound to these conditions for accessing, browsing or purchase. If you (customer) do not agree and accept any of the terms, conditions and policies unconditionally, do not use this platform.
                </p>

                <div className="mdr-highlight-box">
                  <i className="fa-solid fa-triangle-exclamation" />
                  <div>
                    <strong>Mandatory Dental Council / Drug License Requirement:</strong>
                    <p>
                      According to new medical device rules (MDR) it is mandatory to buy from registered suppliers like BuyBright and sell to dental/medical council registered doctors.{' '}
                      <a
                        href="https://dentalkart-application-media.s3.ap-south-1.amazonaws.com/india-medical-devices-rules-2017.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mdr-link"
                      >
                        Click here <i className="fa-solid fa-arrow-up-right-from-square" />
                      </a>{' '}
                      for more Details.
                    </p>
                    <p className="mdr-note-sub">
                      So it is mandatory to provide the council registration number or drug licence number before placing the order and BuyBright will assume that the provided details are correct and will not be responsible for any false information provided by the customer.
                    </p>
                  </div>
                </div>

                <div className="terms-governance-strip">
                  <p>
                    These Terms of Use govern all the products offered on the platform of <strong>Prestodental.store</strong> website/app.
                  </p>
                  <p className="governance-def">
                    Throughout this document, <strong>“we”</strong>, <strong>“us”</strong>, <strong>“our”</strong>, <strong>“ours”</strong> refer to Prestodental.store website/app. Wherever the text mentions <strong>‘you’</strong> or <strong>‘your’</strong>, this means <strong>YOU (reader/customer)</strong>.
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
                      You acknowledge and undertake that you are wholly responsible for your decision to buy any product/products after your own analysis, judgement and thereafter transaction done by you on this website. <strong>Prestodental.store</strong> website/app takes no responsibility of the usage, implementation and result/outcome of the products. It is entirely buyer’s/user’s responsibility to choose and decide the right product.
                    </p>
                  </div>
                </div>

                {/* 2 */}
                <div className="clause-item">
                  <span className="clause-num">2</span>
                  <div className="clause-content">
                    <p>
                      <strong>Prestodental.store</strong> website/app reserves the right to refuse access to the website, terminate accounts, remove or edit content at any time without any prior notice and with absolute discretion.
                    </p>
                  </div>
                </div>

                {/* 3 */}
                <div className="clause-item">
                  <span className="clause-num">3</span>
                  <div className="clause-content">
                    <p>
                      In case of any violation of the terms and conditions, <strong>Prestodental.store</strong> website/app reserves the right to refuse further use of services or even terminate account without any prior notice.
                    </p>
                  </div>
                </div>

                {/* 4 */}
                <div className="clause-item">
                  <span className="clause-num">4</span>
                  <div className="clause-content">
                    <p>
                      Entitlement to the goods remains that of <strong>Prestodental.store</strong> website/app until you have paid for them. Entitlement will pass to you once the goods are paid in full and all payments have been cleared by a relevant banking process.
                    </p>
                  </div>
                </div>

                {/* 5 */}
                <div className="clause-item">
                  <span className="clause-num">5</span>
                  <div className="clause-content">
                    <p>
                      <strong>Prestodental.store</strong> website/app reserves the right to not allow any changes to the order after the order has been accepted/placed.
                    </p>
                  </div>
                </div>

                {/* 6 */}
                <div className="clause-item">
                  <span className="clause-num">6</span>
                  <div className="clause-content">
                    <p>
                      <strong>Prestodental.store</strong> website/app will not be responsible for any transactions done by mistake due to any internet issue at customer’s end.
                    </p>
                  </div>
                </div>

                {/* 7 */}
                <div className="clause-item">
                  <span className="clause-num">7</span>
                  <div className="clause-content">
                    <p>
                      All reasonable attempts will be made to ensure that all the information given on this website is accurate, but offers no liability or assurance of genuineness of the information. <strong>Prestodental.store</strong> website/app will not be responsible for any errors or incomplete information of products on its website.
                    </p>
                  </div>
                </div>

                {/* 8 */}
                <div className="clause-item">
                  <span className="clause-num">8</span>
                  <div className="clause-content">
                    <p>
                      <strong>Prestodental.store</strong> website/app assumes that you are a dental clinician or someone who is using it on his/her behalf. Any accidental/intentional order placed by someone else is solely the responsibility of the account owner.
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
                      If you are making a purchase on someone else’s behalf, you agree and bound the account holder to all the terms and conditions of <strong>Prestodental.store</strong> website/app.
                    </p>
                  </div>
                </div>

                {/* 12 */}
                <div className="clause-item highlight-clause">
                  <span className="clause-num">12</span>
                  <div className="clause-content">
                    <p>
                      In case of any knowledge or belief that your information has been breached in any way, you must contact <strong>Prestodental.store</strong> website/app at <a href="mailto:support@Prestodental.store">support@Prestodental.store</a>.
                    </p>
                  </div>
                </div>

                {/* 13 */}
                <div className="clause-item">
                  <span className="clause-num">13</span>
                  <div className="clause-content">
                    <p>
                      If any issue is suspected as per the confidentiality of your account, you might be asked to change your password or re-register with no liability of <strong>Prestodental.store</strong> website/app.
                    </p>
                  </div>
                </div>

                {/* 14 */}
                <div className="clause-item">
                  <span className="clause-num">14</span>
                  <div className="clause-content">
                    <p>
                      The pictures of all products at <strong>Prestodental.store</strong> website/app are merely indicated for information and may vary from the actual product. Product packaging also might vary or change from time to time.
                    </p>
                  </div>
                </div>

                {/* 15 */}
                <div className="clause-item">
                  <span className="clause-num">15</span>
                  <div className="clause-content">
                    <p>
                      <strong>Prestodental.store</strong> website/app strives to provide accurate product and pricing information; however, errors may occur.
                    </p>
                  </div>
                </div>

                {/* 16 */}
                <div className="clause-item">
                  <span className="clause-num">16</span>
                  <div className="clause-content">
                    <p>
                      <strong>Prestodental.store</strong> website/app reserves all rights to change/alter prices of any product and suspend/cancel orders at any point of time unless it has been received by the customer.
                    </p>
                  </div>
                </div>

                {/* 17 */}
                <div className="clause-item">
                  <span className="clause-num">17</span>
                  <div className="clause-content">
                    <p>
                      No changes can be made to the order once the order has been dispatched from our warehouse. However, if you still require to contact us then drop us an email at <a href="mailto:support@Prestodental.store">support@Prestodental.store</a>. Our dedicated team aims to contact you within 24 hours. If ordered by mistake, you can still return the items by simply contacting our customer service.
                    </p>
                  </div>
                </div>

                {/* 18 */}
                <div className="clause-item">
                  <span className="clause-num">18</span>
                  <div className="clause-content">
                    <p>
                      In case of any delays in delivery you may track the status of your order by visiting ‘My Orders’. Our aim is to meet the delivery times but during busy periods like promotional sale, festive occasions, tech updates, extreme weather conditions may delay the delivery and it may take a little longer time than mentioned. <strong>Prestodental.store</strong> website/app will not be responsible for any such delays; however, we always work hard to keep these temporary changes to a minimum. For any queries related to delays you may contact us by dropping an email at <a href="mailto:support@Prestodental.store">support@Prestodental.store</a>.
                    </p>
                  </div>
                </div>

                {/* 19 */}
                <div className="clause-item">
                  <span className="clause-num">19</span>
                  <div className="clause-content">
                    <p>
                      In case of cancellation of the paid order, the paid amount will be reversed to the account information provided at the time of purchase and <strong>Prestodental.store</strong> website/app will not be responsible for any accurate time duration taken in the transfer. Transfer is solely due as per the time taken by the bank.
                    </p>
                  </div>
                </div>

                {/* 20 */}
                <div className="clause-item">
                  <span className="clause-num">20</span>
                  <div className="clause-content">
                    <p>
                      If any product is found unavailable after receiving the order, customer will be notified of the order cancellation via email and payment will be refunded to the same account of the account holder from which payment was made. <strong>Prestodental.store</strong> website/app shall not be liable to any damages in such event/events owing to cancellation of the order or delay in delivery.
                    </p>
                  </div>
                </div>

                {/* 21 */}
                <div className="clause-item payment-clause">
                  <span className="clause-num">21</span>
                  <div className="clause-content">
                    <p>
                      Payments can be made via debit card, credit card, net banking, UPI wallet, Paytm, Mobikwik, cash on delivery as per availability of services by third party companies.
                    </p>
                  </div>
                </div>

                {/* 22 */}
                <div className="clause-item">
                  <span className="clause-num">22</span>
                  <div className="clause-content">
                    <p>
                      If you use the <strong>Prestodental.store</strong> website/app, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer to prevent unauthorised access to your account. You agree to accept responsibility for all activities that occur under your account or password.
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
                      <strong>Express Delivery Zone:</strong> 24 hours delivery is only applicable for <strong>Thane, Kalyan, Bhiwandi, Kalwa, Mumbra</strong> areas only.
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
                  This Privacy Policy outlines approach of <strong>Prestodental.store</strong> website/app to Data Protection and Privacy to fulfil its obligations under the applicable laws and regulations. This Privacy Policy applies to your Personal information which is processed by us, whether in physical or electronic form. <strong>Prestodental.store</strong> website/app is committed to treating your privacy seriously. It is important that you know as to what we do with your provided information.
                </p>
                <p>
                  The information we receive and gather from you, personal or otherwise, is used to register you, verify your identity to permit you to use the app, undertake transactions for payments, to communicate with you, to inform for any promotional offers, services or updates associated with Prestodental.store website/app, and to generally maintain your account information with us. We also use this information to customize your experience and improve Prestodental.store website/app.
                </p>

                <ul className="terms-bullet-list">
                  <li>
                    <i className="fa-solid fa-circle-check" />
                    <span>We understand that your personal information is important and sensitive so must be safeguarded, thereby every attempt is made to ensure protection of the same.</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check" />
                    <span>You can choose not to provide certain information, but then you might not be able to use Prestodental.store website/app.</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check" />
                    <span>If you continue to use this website, it implies that you have read these terms and conditions along with the changes made to it time and again.</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check" />
                    <span>Therefore, it is advised that you visit the ‘Terms and conditions’ page frequently for any modifications made to it.</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check" />
                    <span>By agreeing to the terms and conditions you are giving your consent to Prestodental.store website/app to use your personal information.</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check" />
                    <span>We might receive information about you from other sources, such as updated delivery and address information from our courier partners, which we use to correct our records and deliver your next purchase a better experience.</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check" />
                    <span>Data/information recorded may include: name, contact number, email address, shipping address, date of birth, country or citizenship and transaction details like name of bank, branch name, card number, type of card and transaction number.</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check" />
                    <span>Technical details which will be recorded are location, device information and network carrier used for the device.</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check" />
                    <span>Location details such as IP address and your location at the time of place of order.</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check" />
                    <span>Other details such as pages viewed at Prestodental.store website/app.</span>
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
                  <strong>Prestodental.store</strong> website/app grants you limited, non-exclusive, non-transferable, non-sublicensable license to access, and make personal or/and commercial use of the platform. All rights not expressly granted to you in these Terms of Use, are reserved and retained by the Prestodental.store website/app and its affiliates.
                </p>
                <p>
                  <strong>Prestodental.store</strong> website/app reserves the right, at any time, without notice and at its sole discretion, to terminate your license to use the website and to block and prevent your future access of the website.
                </p>
              </div>
            </div>

            {/* General Provisions */}
            <div id="general-terms" className="terms-section-card">
              <div className="terms-card-header">
                <div className="header-icon-box">
                  <i className="fa-solid fa-gavel" />
                </div>
                <h2>General</h2>
              </div>
              <div className="terms-card-body">
                <p>
                  You acknowledge and hereby agree to the above given ‘Terms and Conditions’ and that it constitutes the complete and exclusive agreement between us concerning your use of the <strong>Prestodental.store</strong> website/app, and supersede and govern all prior proposals, agreements, or other communications.
                </p>
                <p>
                  We reserve the right in our sole discretion, to change/alter/modify these Terms and Conditions at any time by posting the changes on the <strong>Prestodental.store</strong> website/app. Any changes are effective immediately upon posting to the Prestodental.store website/app. Your continued use of the Prestodental.store website/app thereafter constitutes your agreement to all such changed ‘Terms and Conditions’.
                </p>
                <p>
                  We may, with or without prior notice, terminate any of the rights granted by these ‘Terms and Conditions’. You shall comply immediately with any termination or other notice, including, as applicable, by ceasing all use of the Site.
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
                  <p>Have questions regarding our terms, dental orders, or delivery policies?</p>
                </div>
              </div>

              <div className="support-channel-grid">
                <a href="mailto:support@Prestodental.store" className="support-channel-box">
                  <i className="fa-solid fa-envelope" />
                  <div>
                    <span>Official Email</span>
                    <strong>support@Prestodental.store</strong>
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
