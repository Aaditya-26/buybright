/**
 * BuyBright Privacy Policy Page.
 * Clean, modern, responsive layout without heavy dark banners.
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../../components/common/SEO';

interface PolicySection {
  id: string;
  number: string;
  title: string;
  icon: string;
}

const POLICY_SECTIONS: PolicySection[] = [
  { id: 'communication', number: '1', title: 'Communication', icon: 'fa-solid fa-comments' },
  { id: 'collection', number: '2', title: 'Collection of Information', icon: 'fa-solid fa-database' },
  { id: 'usage', number: '3', title: 'Use of Demographic / Profile Data', icon: 'fa-solid fa-chart-pie' },
  { id: 'sharing', number: '4', title: 'Sharing of Personal Information', icon: 'fa-solid fa-share-nodes' },
  { id: 'links', number: '5', title: 'Links to Other Sites', icon: 'fa-solid fa-arrow-up-right-from-square' },
  { id: 'security', number: '6', title: 'Security Precautions', icon: 'fa-solid fa-shield-halved' },
  { id: 'choice', number: '7', title: 'Choice / Opt-Out', icon: 'fa-solid fa-sliders' },
  { id: 'advertisements', number: '8', title: 'Advertisements', icon: 'fa-solid fa-rectangle-ad' },
  { id: 'consent', number: '9', title: 'Your Consent', icon: 'fa-solid fa-signature' },
  { id: 'questions', number: '10', title: 'Questions & Support', icon: 'fa-solid fa-circle-question' },
];

export const PrivacyPolicyPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('communication');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of POLICY_SECTIONS) {
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
    <div className="pd-privacy-policy-page">
      <SEO
        title="Privacy Policy — BuyBright"
        description="Learn how BuyBright gathers, utilizes, and safeguards your marketplace orders and personal information in accordance with highest security standards."
        canonicalUrl="/privacy-policy"
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
            <span className="current">Privacy Policy</span>
          </div>

          <div className="policy-header-main">
            <div className="policy-badge-pill">
              <i className="fa-solid fa-shield-check" />
              <span>Customer Information Privacy &amp; Secure Transactions</span>
            </div>

            <h1 className="policy-title">Privacy Policy</h1>
            <p className="policy-lead-text">
              We value your trust. That’s why we follow highest standards for secure transactions and customer information privacy. Please read the following statement to learn about our information gathering and dissemination practices.
            </p>

            <div className="policy-meta-bar">
              <div className="meta-item">
                <i className="fa-regular fa-clock" />
                <span>Effective Date: <strong>March 2026</strong></span>
              </div>
              <div className="meta-item">
                <i className="fa-solid fa-globe" />
                <span>Applicable to: <strong>buybright.com</strong></span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <section className="privacy-content-section">
        <div className="privacy-layout-container">
          {/* Left Sidebar Table of Contents */}
          <aside className="privacy-toc-sidebar">
            <div className="toc-card">
              <div className="toc-header">
                <i className="fa-solid fa-list-ul" />
                <h3>Table of Contents</h3>
              </div>
              <nav className="toc-nav">
                {POLICY_SECTIONS.map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    className={`toc-link ${activeSection === sec.id ? 'active' : ''}`}
                    onClick={() => scrollToSection(sec.id)}
                  >
                    <span className="toc-num">{sec.number}</span>
                    <span className="toc-text">{sec.title}</span>
                    <i className="fa-solid fa-chevron-right toc-arrow" />
                  </button>
                ))}
              </nav>

              <div className="toc-help-box">
                <div className="help-icon-circle">
                  <i className="fa-solid fa-headset" />
                </div>
                <div className="help-text">
                  <strong>Have Privacy Questions?</strong>
                  <p>Our Data Protection desk is here to assist our valued customers and sellers.</p>
                </div>
                <a href="mailto:support@buybright.com" className="btn-toc-help">
                  <i className="fa-solid fa-envelope" /> Contact Privacy Desk
                </a>
              </div>
            </div>
          </aside>

          {/* Right Main Policy Content */}
          <main className="privacy-main-body">
            {/* Notice Alert Box */}
            <div className="privacy-intro-box">
              <div className="intro-icon-col">
                <i className="fa-solid fa-shield-heart" />
              </div>
              <div className="intro-text-col">
                <h3>Our Commitment to Your Privacy</h3>
                <p>
                  We value your trust. That’s why we follow highest standards for secure transactions and customer information privacy. Please read the following statement to learn about our information gathering and dissemination practices.
                </p>
                <div className="intro-sub-notice">
                  <i className="fa-solid fa-circle-info" />
                  <span>
                    Our privacy policy is subject to change at any time without notice. To make sure you are aware of any changes, please review this policy periodically.
                  </span>
                </div>
              </div>
            </div>

            {/* Crucial Note Card */}
            <div className="privacy-note-card">
              <div className="note-badge">
                <i className="fa-solid fa-triangle-exclamation" />
                <span>Important Note</span>
              </div>
              <ul className="note-list">
                <li>
                  By visiting <strong>buybright.com</strong> you agree to be bound by the terms and conditions of this Privacy Policy. If you do not agree please do not use or access our Website.
                </li>
                <li>
                  By mere use of the Website, you expressly consent to our use and disclosure of your personal information in accordance with this Privacy Policy. This Privacy Policy is incorporated into and subject to the Terms of Use.
                </li>
              </ul>
            </div>

            {/* Section 1 */}
            <article id="communication" className="policy-section-card">
              <div className="section-card-header">
                <div className="section-badge">1</div>
                <div className="section-title-wrap">
                  <div className="section-icon-badge">
                    <i className="fa-solid fa-comments" />
                  </div>
                  <h2>COMMUNICATION</h2>
                </div>
              </div>
              <div className="section-card-body">
                <p>
                  When You visit BuyBright website or send emails to us, You are communicating with us electronically. We communicate with You by email, SMS, RCS, WhatsApp or by posting notices on the website.
                </p>
                <p>
                  For contractual purposes, You consent to receive communications from us electronically and You agree that all agreements, notices, disclosures and other communications that we provide to You electronically satisfy any legal requirement that those communications be in writing. This condition does not affect Your statutory rights.
                </p>
                <div className="policy-highlight-callout">
                  <i className="fa-solid fa-bell" />
                  <div>
                    <strong>Transactional &amp; Promotional Updates:</strong>
                    <p>
                      You understand that once You register as a BuyBright user on the BuyBright platform, Upon placing an order on our website, we shall be entitled to use your registered mobile number on the website to send transaction-related SMS, RCS or WhatsApp to you, irrespective of DND services being activated on your mobile. We may occasionally send promotional SMS or RCS to your registered mobile number. The customer hereby authorizes us to receive transactional SMS or RCS to his registered number, even if the number is registered for the DND “Do not Disturb” service.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* Section 2 */}
            <article id="collection" className="policy-section-card">
              <div className="section-card-header">
                <div className="section-badge">2</div>
                <div className="section-title-wrap">
                  <div className="section-icon-badge">
                    <i className="fa-solid fa-database" />
                  </div>
                  <h2> COLLECTION OF PERSONALLY IDENTIFIABLE INFORMATION AND OTHER INFORMATION</h2>
                </div>
              </div>
              <div className="section-card-body">
                <p>
                  When you use our Website, we collect and store your personal information which is provided by you from time to time. Our primary goal in doing so is to provide you a safe, efficient, smooth and customized experience. This allows us to provide services and features that most likely meet your needs, and to customize our Website to make your experience safer and easier. More importantly, while doing so we collect personal information from you that we consider necessary for achieving this purpose.
                </p>
                <p>
                  In general, you can browse the Website without telling us who you are or revealing any personal information about yourself. Once you give us your personal information, you are not anonymous to us. Where possible, we indicate which fields are required and which fields are optional. You always have the option to not provide information by choosing not to use a particular service or feature on the Website.
                </p>
                <p>
                  We may automatically track certain information about you based upon your behaviour on our Website. We use this information to do internal research on our users’ demographics, interests, and behaviour to better understand, protect and serve our users. This information is compiled and analysed on an aggregated basis. This information may include the URL that you just came from (whether this URL is on our Website or not), which URL you next go to (whether this URL is on our Website or not), your computer browser information, and your IP address.
                </p>

                <div className="policy-sub-box">
                  <div className="sub-box-title">
                    <i className="fa-solid fa-cookie-bite" />
                    <h4>Cookies and Tracking Technologies</h4>
                  </div>
                  <p>
                    We use data collection devices such as “cookies” on certain pages of the Website to help analyse our web page flow, measure promotional effectiveness, and promote trust and safety. “Cookies” are small files placed on your hard drive that assist us in providing our services. We offer certain features that are only available through the use of a “cookie”.
                  </p>
                  <p>
                    We also use cookies to allow you to enter your password less frequently during a session. Cookies can also help us provide information that is targeted to your interests. Most cookies are “session cookies,” meaning that they are automatically deleted from your hard drive at the end of a session. You are always free to decline our cookies if your browser permits, although in that case you may not be able to use certain features on the Website and you may be required to re-enter your password more frequently during a session.
                  </p>
                  <p>
                    Additionally, you may encounter “cookies” or other similar devices on certain pages of the Website that are placed by third parties. We do not control the use of cookies by third parties.
                  </p>
                </div>

                <div className="policy-data-points-grid">
                  <div className="data-point-item">
                    <div className="point-icon"><i className="fa-solid fa-cart-shopping" /></div>
                    <div>
                      <strong>Buying Behaviour:</strong>
                      <span>If you choose to buy on the Website, we collect information about your buying behaviour.</span>
                    </div>
                  </div>

                  <div className="data-point-item">
                    <div className="point-icon"><i className="fa-solid fa-credit-card" /></div>
                    <div>
                      <strong>Payment &amp; Billing Data:</strong>
                      <span>If you transact with us, we collect billing address, credit/debit card details, payment instrument data, and tracking details.</span>
                    </div>
                  </div>

                  <div className="data-point-item">
                    <div className="point-icon"><i className="fa-solid fa-message" /></div>
                    <div>
                      <strong>Messages &amp; Correspondence:</strong>
                      <span>If you post messages or leave feedback, we retain information as necessary to resolve disputes and troubleshoot problems.</span>
                    </div>
                  </div>

                  <div className="data-point-item">
                    <div className="point-icon"><i className="fa-solid fa-id-card" /></div>
                    <div>
                      <strong>Account Registration:</strong>
                      <span>We collect name, email, phone number, and credentials when you set up your free account with us.</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Section 3 */}
            <article id="usage" className="policy-section-card">
              <div className="section-card-header">
                <div className="section-badge">3</div>
                <div className="section-title-wrap">
                  <div className="section-icon-badge">
                    <i className="fa-solid fa-chart-pie" />
                  </div>
                  <h2>USE OF DEMOGRAPHIC / PROFILE DATA / YOUR INFORMATION</h2>
                </div>
              </div>
              <div className="section-card-body">
                <p>
                  We use personal information to provide the services you request. To the extent we use your personal information to market to you, we will provide you the ability to opt-out of such uses.
                </p>
                <p>
                  We use your personal information to resolve disputes; troubleshoot problems; help promote a safe service; collect money; measure consumer interest in our products and services, inform you about online and offline offers, products, services, and updates; customize your experience; detect and protect us against error, fraud and other criminal activity; enforce our terms and conditions; and as otherwise described to you at the time of collection.
                </p>
                <p>
                  In our efforts to continually improve our product and service offerings, we collect and analyse demographic and profile data about our users’ activity on our Website.
                </p>
                <p>
                  We identify and use your IP address to help diagnose problems with our server, and to administer our Website. Your IP address is also used to help identify you and to gather broad demographic information.
                </p>

                <div className="cookie-definition-card">
                  <div className="cookie-card-header">
                    <i className="fa-solid fa-cookie" />
                    <strong>Cookie Clarification:</strong>
                  </div>
                  <p>
                    A “cookie” is a small piece of information stored by a web server on a web browser so it can be later read back from that browser. Cookies are useful for enabling the browser to remember information specific to a given user. We place both permanent and temporary cookies in your computer’s hard drive. The cookies do not contain any of your personally identifiable information.
                  </p>
                </div>
              </div>
            </article>

            {/* Section 4 */}
            <article id="sharing" className="policy-section-card">
              <div className="section-card-header">
                <div className="section-badge">4</div>
                <div className="section-title-wrap">
                  <div className="section-icon-badge">
                    <i className="fa-solid fa-share-nodes" />
                  </div>
                  <h2> SHARING OF PERSONAL INFORMATION</h2>
                </div>
              </div>
              <div className="section-card-body">
                <p>
                  We may share personal information with our other corporate entities and affiliates. These entities and affiliates may market to you as a result of such sharing unless you explicitly opt-out.
                </p>
                <p>
                  We may disclose personal information to third parties. This disclosure may be required for us to provide you access to our Services, to comply with our legal obligations, to enforce our User Agreement, to facilitate our marketing and advertising activities, or to prevent, detect, mitigate, and investigate fraudulent or illegal activities related to our Services. We do not disclose your personal information to third parties for their marketing and advertising purposes without your explicit consent.
                </p>
                <p>
                  We may disclose personal information if required to do so by law or in the good faith belief that such disclosure is reasonably necessary to respond to subpoenas, court orders, or other legal process. We may disclose personal information to law enforcement offices, third party rights owners, or others in the good faith belief that such disclosure is reasonably necessary to: enforce our Terms or Privacy Policy; respond to claims that an advertisement, posting or other content violates the rights of a third party; or protect the rights, property or personal safety of our users or the general public.
                </p>
                <div className="business-transfer-box">
                  <i className="fa-solid fa-handshake" />
                  <div>
                    <strong>Corporate Transactions &amp; Restructuring:</strong>
                    <p>
                      We and our affiliates will share / sell some or all of your personal information with another business entity should we (or our assets) plan to merge with, or be acquired by that business entity, or re-organization, amalgamation, restructuring of business. Should such a transaction occur that other business entity (or the new combined entity) will be required to follow this privacy policy with respect to your personal information.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* Section 5 */}
            <article id="links" className="policy-section-card">
              <div className="section-card-header">
                <div className="section-badge">5</div>
                <div className="section-title-wrap">
                  <div className="section-icon-badge">
                    <i className="fa-solid fa-arrow-up-right-from-square" />
                  </div>
                  <h2> LINKS TO OTHER SITES</h2>
                </div>
              </div>
              <div className="section-card-body">
                <p>
                  Our Website links to other websites that may collect personally identifiable information about you. <strong>buybright.com</strong> is not responsible for the privacy practices or the content of those linked websites.
                </p>
              </div>
            </article>

            {/* Section 6 */}
            <article id="security" className="policy-section-card">
              <div className="section-card-header">
                <div className="section-badge">6</div>
                <div className="section-title-wrap">
                  <div className="section-icon-badge">
                    <i className="fa-solid fa-shield-halved" />
                  </div>
                  <h2> SECURITY PRECAUTIONS</h2>
                </div>
              </div>
              <div className="section-card-body">
                <p>
                  Our Website has stringent security measures in place to protect the loss, misuse, and alteration of the information under our control. Whenever you change or access your account information, we offer the use of a secure server.
                </p>
                <div className="security-pillars-grid">
                  <div className="sec-pillar">
                    <i className="fa-solid fa-lock" />
                    <strong>256-Bit SSL Encryption</strong>
                    <span>Bank-grade encryption protecting all payment sessions and credentials.</span>
                  </div>
                  <div className="sec-pillar">
                    <i className="fa-solid fa-server" />
                    <strong>Secure Cloud Vaults</strong>
                    <span>Adhering to strict security guidelines protecting data against unauthorized access.</span>
                  </div>
                  <div className="sec-pillar">
                    <i className="fa-solid fa-user-shield" />
                    <strong>Verified Access Control</strong>
                    <span>Strict role-based access parameters ensuring data confidentiality.</span>
                  </div>
                </div>
                <p>
                  Once your information is in our possession we adhere to strict security guidelines, protecting it against unauthorized access.
                </p>
              </div>
            </article>

            {/* Section 7 */}
            <article id="choice" className="policy-section-card">
              <div className="section-card-header">
                <div className="section-badge">7</div>
                <div className="section-title-wrap">
                  <div className="section-icon-badge">
                    <i className="fa-solid fa-sliders" />
                  </div>
                  <h2>CHOICE / OPT-OUT</h2>
                </div>
              </div>
              <div className="section-card-body">
                <p>
                  We provide all users with the opportunity to opt-out of receiving non-essential (promotional, marketing-related) communications from us on behalf of our partners, and from us in general, after setting up an account.
                </p>
                <div className="optout-card">
                  <i className="fa-solid fa-envelope-open-text" />
                  <div>
                    <strong>Unsubscribe Instructions:</strong>
                    <p>
                      If you want to remove your contact information from all buybright.com lists and newsletters, please visit the unsubscribe link provided at the bottom of our emails or contact our support team.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* Section 8 */}
            <article id="advertisements" className="policy-section-card">
              <div className="section-card-header">
                <div className="section-badge">8</div>
                <div className="section-title-wrap">
                  <div className="section-icon-badge">
                    <i className="fa-solid fa-rectangle-ad" />
                  </div>
                  <h2> ADVERTISEMENTS ON buybright.com</h2>
                </div>
              </div>
              <div className="section-card-body">
                <p>
                  We use third-party advertising companies to serve ads when you visit our Website. These companies may use information (not including your name, address, email address, or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
                </p>
              </div>
            </article>

            {/* Section 9 */}
            <article id="consent" className="policy-section-card">
              <div className="section-card-header">
                <div className="section-badge">9</div>
                <div className="section-title-wrap">
                  <div className="section-icon-badge">
                    <i className="fa-solid fa-signature" />
                  </div>
                  <h2>YOUR CONSENT</h2>
                </div>
              </div>
              <div className="section-card-body">
                <p>
                  By using the Website and/ or by providing your information, you consent to the collection and use of the information you disclose on the Website in accordance with this Privacy Policy, including but not limited to Your consent for sharing your information as per this privacy policy.
                </p>
                <div className="policy-change-box">
                  <i className="fa-solid fa-arrows-rotate" />
                  <p>
                    If we decide to change our privacy policy, we will post those changes on this page so that you are always aware of what information we collect, how we use it, and under what circumstances we disclose it.
                  </p>
                </div>
              </div>
            </article>

            {/* Section 10 */}
            <article id="questions" className="policy-section-card questions-card">
              <div className="section-card-header">
                <div className="section-badge">10</div>
                <div className="section-title-wrap">
                  <div className="section-icon-badge">
                    <i className="fa-solid fa-circle-question" />
                  </div>
                  <h2>QUESTIONS?</h2>
                </div>
              </div>
              <div className="section-card-body">
                <p>
                  Please contact us regarding any questions regarding this statement. Our dedicated compliance and customer care team is available to assist you.
                </p>

                <div className="privacy-contact-grid">
                  <a href="mailto:support@buybright.com" className="privacy-contact-item">
                    <div className="c-icon"><i className="fa-solid fa-envelope" /></div>
                    <div className="c-info">
                      <span className="c-lbl">Email Privacy Desk</span>
                      <strong className="c-val">support@buybright.com</strong>
                    </div>
                  </a>

                  <a href="tel:+918806488054" className="privacy-contact-item">
                    <div className="c-icon"><i className="fa-solid fa-phone" /></div>
                    <div className="c-info">
                      <span className="c-lbl">Helpline Number</span>
                      <strong className="c-val">+91 88064 88054</strong>
                    </div>
                  </a>

                  <a
                    href="https://wa.me/918806488054"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="privacy-contact-item whatsapp-item"
                  >
                    <div className="c-icon"><i className="fa-brands fa-whatsapp" /></div>
                    <div className="c-info">
                      <span className="c-lbl">Instant WhatsApp Support</span>
                      <strong className="c-val">+91 88064 88054</strong>
                    </div>
                  </a>
                </div>

                <div className="privacy-back-home-wrap">
                  <Link to="/" className="btn-back-home">
                    <i className="fa-solid fa-arrow-left" /> Back to Homepage
                  </Link>
                  <Link to="/contact" className="btn-contact-desk">
                    <i className="fa-solid fa-headset" /> Visit Support Center
                  </Link>
                </div>
              </div>
            </article>
          </main>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
