/**
 * BuyBright Return, Cancellation & Refund Policy Page.
 * Clean, modern layout under pages/support with no heavy dark banners.
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../../components/common/SEO';

interface NavTab {
  id: string;
  title: string;
  icon: string;
}

const POLICY_TABS: NavTab[] = [
  { id: 'cancellation-policy', title: 'Cancellation Policy', icon: 'fa-solid fa-ban' },
  { id: 'return-policy', title: 'Return / Replacement', icon: 'fa-solid fa-rotate-left' },
  { id: 'non-returnable', title: 'Non-Returnable Items', icon: 'fa-solid fa-circle-exclamation' },
  { id: 'refund-policy', title: 'Refund Methods & Timelines', icon: 'fa-solid fa-money-bill-transfer' },
  { id: 'support-contact', title: 'Contact & Support', icon: 'fa-solid fa-headset' },
];

export const ReturnPolicyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('cancellation-policy');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const tab of POLICY_TABS) {
        const el = document.getElementById(tab.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveTab(tab.id);
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
      setActiveTab(id);
    }
  };

  return (
    <div className="pd-returns-page">
      <SEO
        title="Return & Refund Policy — BuyBright"
        description="Review the BuyBright Return, Cancellation, and Refund Policy covering 10-day return windows, non-returnable equipment, and 24-48h refund processing."
        canonicalUrl="/return-policy"
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
            <span className="current">Return Policy</span>
          </div>

          <div className="policy-header-main">
            <div className="policy-badge-pill">
              <i className="fa-solid fa-rotate-left" />
              <span>Returns, Replacements, Cancellations &amp; Refunds</span>
            </div>

            <h1 className="policy-title">Return Policy</h1>
            <p className="policy-lead-text">
              Transparent, practitioner-focused guidelines for order cancellations, verified warehouse returns, and fast refund settlements.
            </p>

            <div className="policy-meta-bar">
              <div className="meta-item">
                <i className="fa-regular fa-calendar-check" />
                <span>Return Window: <strong>10 Business Days</strong></span>
              </div>
              <div className="meta-item">
                <i className="fa-solid fa-clock-rotate-left" />
                <span>Refund Processing: <strong>24–48 Business Hours</strong></span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <section className="returns-content-section">
        <div className="returns-layout-container">
          {/* Table of Contents Sidebar */}
          <aside className="returns-toc-sidebar">
            <div className="returns-toc-card">
              <div className="toc-header">
                <i className="fa-solid fa-list-ul" />
                <h3>Navigation Index</h3>
              </div>
              <nav className="toc-nav">
                {POLICY_TABS.map((tab, idx) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`toc-link ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => scrollToSection(tab.id)}
                  >
                    <span className="toc-num">{idx + 1}</span>
                    <span className="toc-text">{tab.title}</span>
                    <i className="fa-solid fa-chevron-right toc-arrow" />
                  </button>
                ))}
              </nav>

              <div className="toc-cancellation-box">
                <div className="c-icon-circle">
                  <i className="fa-solid fa-envelope" />
                </div>
                <div className="c-text">
                  <strong>Need to Cancel or Return?</strong>
                  <p>Email our designated compliance desk directly:</p>
                </div>
                <a href="mailto:responsible@Prestodental.store" className="btn-toc-email">
                  responsible@Prestodental.store
                </a>
              </div>
            </div>
          </aside>

          {/* Main Legal Policy Content */}
          <main className="returns-main-body">
            {/* 1. Cancellation Policy Card */}
            <article id="cancellation-policy" className="policy-card cancellation-card">
              <div className="card-header-bar">
                <div className="header-icon-badge cancel-icon">
                  <i className="fa-solid fa-ban" />
                </div>
                <div>
                  <h2>Cancellation Policy</h2>
                  <span className="card-sub-title">Order Cancellation Before &amp; After Shipment</span>
                </div>
              </div>

              <div className="card-body-content">
                <div className="cancellation-steps-grid">
                  <div className="step-card">
                    <div className="step-badge">Before Shipment</div>
                    <p>
                      In order to cancel the order before the shipment of the product/products, customer has to go to <strong>‘My Orders’</strong> and cancel the order or else contact <a href="mailto:responsible@Prestodental.store">responsible@Prestodental.store</a>.
                    </p>
                  </div>

                  <div className="step-card">
                    <div className="step-badge after-badge">After Shipment</div>
                    <p>
                      In order to cancel the order after the shipment of the product/products, customer has to contact <a href="mailto:responsible@Prestodental.store">responsible@Prestodental.store</a>.
                    </p>
                  </div>
                </div>

                <div className="callout-refund-timeline">
                  <i className="fa-solid fa-clock-rotate-left" />
                  <p>
                    Refund is processed within <strong>24 business hours</strong> when order stands canceled before/after shipment. We process the refund once the products have been received and verified at our warehouse.
                  </p>
                </div>
              </div>
            </article>

            {/* 2. Return/Replacement Policy Card */}
            <article id="return-policy" className="policy-card return-card">
              <div className="card-header-bar">
                <div className="header-icon-badge return-icon">
                  <i className="fa-solid fa-rotate-left" />
                </div>
                <div>
                  <h2>Return/Replacement Policy</h2>
                  <span className="card-sub-title">Guidelines for Pick-Up, Packaging &amp; Verification</span>
                </div>
              </div>

              <div className="card-body-content">
                <ul className="policy-check-list">
                  <li>
                    <i className="fa-solid fa-circle-check" />
                    <span>
                      In case of returns, Prestodental.store website/app arranges pick-up of the goods but shipping charges might be applicable. Customers have to bear the shipping charges or else can arrange the return by their own means.
                    </span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check" />
                    <span>
                      The product must be returned in its original packaging with all contents intact as shipped.
                    </span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check" />
                    <span>
                      A part of the order can also be returned if multiple items were ordered. However, all the components of the product must be intact and the product should be unused/altered.
                    </span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check" />
                    <span>
                      In case of a return/replacement/refund, we process the refund once the products have been received and verified at our warehouse.
                    </span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check" />
                    <span>
                      In case of cancellation before shipment, we process the refund within 24 business hours after receiving the cancellation request.
                    </span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check" />
                    <span>
                      In case of cancellation once the shipment has already been dispatched or if it is being returned, we process the refund once the products have been received and verified at our warehouse.
                    </span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check" />
                    <span>
                      For payments done through credit/debit cards or net banking, the refund will be processed and credited to the same account from which the payment was made within 24-48 business hours of us receiving the products back. It may take 2-3 additional business days for the amount to process and credit in your account.
                    </span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check" />
                    <span>
                      For cash on delivery transactions, we will initiate a bank transfer against the refund amount against the billing details shared by you. This process will be completed within 24-48 business hours of us receiving the products back and your bank details on email. It will take an additional 2-3 business days for the amount to process and credit in your account.
                    </span>
                  </li>
                </ul>

                {/* Non-Returnable Equipment Categories */}
                <div className="non-returnable-banner">
                  <div className="banner-title">
                    <i className="fa-solid fa-triangle-exclamation" />
                    <h4>Equipment which cannot be returned include:</h4>
                  </div>
                  <p>
                    Dental chairs, Dental compressors, UV chambers, autoclaves, X-ray units, RVG sensor machine, Model trimmers, OPG and CBCT machines, apex locators, endo motors, Ultrasonic scalers, Micromotors, Physio dispenser, Bleaching light and other light curing units, amalgamator etc.
                  </p>
                </div>

                {/* Products not applicable for returns */}
                <div className="non-returnable-banner products-banner">
                  <div className="banner-title">
                    <i className="fa-solid fa-ban" />
                    <h4>Products which are not applicable for returns include:</h4>
                  </div>
                  <p>
                    Tooth crème/mousse, MRC/orthodontic trainers, water flossers, chin caps, headgears, face masks or other myo functional appliances.
                  </p>
                </div>
              </div>
            </article>

            {/* 3. Items Not Applicable for Returns Card */}
            <article id="non-returnable" className="policy-card restrictions-card">
              <div className="card-header-bar">
                <div className="header-icon-badge restriction-icon">
                  <i className="fa-solid fa-shield-xmark" />
                </div>
                <div>
                  <h2>Items which are not applicable for returns:</h2>
                  <span className="card-sub-title">Conditions Voiding Return Eligibility</span>
                </div>
              </div>

              <div className="card-body-content">
                <div className="restrictions-grid">
                  <div className="restriction-item">
                    <div className="r-icon"><i className="fa-solid fa-heart-crack" /></div>
                    <p>Product is damaged due to misuse/overuse</p>
                  </div>

                  <div className="restriction-item">
                    <div className="r-icon"><i className="fa-solid fa-box-open" /></div>
                    <p>Returned without original packaging including, price tags, labels, original packing and/or any attachments or if original packaging is damaged</p>
                  </div>

                  <div className="restriction-item">
                    <div className="r-icon"><i className="fa-solid fa-barcode" /></div>
                    <p>If the Serial Number is tampered.</p>
                  </div>

                  <div className="restriction-item">
                    <div className="r-icon"><i className="fa-solid fa-file-excel" /></div>
                    <p>Defective products that are not covered under Company’s/Manufacturer’s warranty</p>
                  </div>

                  <div className="restriction-item">
                    <div className="r-icon"><i className="fa-solid fa-pen-ruler" /></div>
                    <p>Product is used or altered</p>
                  </div>

                  <div className="restriction-item time-limit-item">
                    <div className="r-icon"><i className="fa-solid fa-calendar-xmark" /></div>
                    <p>If request is initiated after <strong>10 business days</strong> of order delivery</p>
                  </div>

                  <div className="restriction-item">
                    <div className="r-icon"><i className="fa-solid fa-gift" /></div>
                    <p>No returns of free product/products</p>
                  </div>
                </div>
              </div>
            </article>

            {/* 4. Refund Policy Card */}
            <article id="refund-policy" className="policy-card refund-card">
              <div className="card-header-bar">
                <div className="header-icon-badge refund-icon">
                  <i className="fa-solid fa-money-bill-transfer" />
                </div>
                <div>
                  <h2>Refund Policy</h2>
                  <span className="card-sub-title">Settlement Channels &amp; Timeframes</span>
                </div>
              </div>

              <div className="card-body-content">
                <div className="refund-channels-grid">
                  {/* Cards / Net Banking */}
                  <div className="refund-channel-item">
                    <div className="channel-icon-col">
                      <i className="fa-solid fa-credit-card" />
                    </div>
                    <div className="channel-text-col">
                      <h3>Credit / Debit Cards &amp; Net Banking</h3>
                      <p>
                        For payments done through credit/debit cards or net banking, the refund will be processed to the same account from which the payment was made within <strong>24 business hours</strong> of us receiving the products back. It may take <strong>2-3 additional business days</strong> for the amount to reflect in your account.
                      </p>
                    </div>
                  </div>

                  {/* Cash on Delivery */}
                  <div className="refund-channel-item">
                    <div className="channel-icon-col cod-icon">
                      <i className="fa-solid fa-money-bill-wave" />
                    </div>
                    <div className="channel-text-col">
                      <h3>Cash on Delivery (COD) Transactions</h3>
                      <p>
                        For cash on delivery transactions, we will initiate a bank transfer against the refund amount against the billing details shared by you. This process will be completed within <strong>24-48 business hours</strong> of us receiving the products back and your bank details on email. It might take an additional <strong>2-3 business days (might take 7-10 days in some cases)</strong> for the amount to reflect in your account.
                      </p>
                    </div>
                  </div>

                  {/* Coupon Option */}
                  <div className="refund-channel-item coupon-channel-item">
                    <div className="channel-icon-col coupon-icon">
                      <i className="fa-solid fa-ticket" />
                    </div>
                    <div className="channel-text-col">
                      <h3>BuyBright Instant Coupon Option</h3>
                      <p>
                        We also offer a refund option via <strong>BuyBright coupon</strong> which will be added immediately while bank account refund might take 7-10 days. Both options are available to the buyer as per his/her suitability.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* 5. Support Desk Card */}
            <div id="support-contact" className="returns-support-card">
              <div className="support-header-row">
                <div className="support-badge-icon">
                  <i className="fa-solid fa-headset" />
                </div>
                <div>
                  <h3>Returns &amp; Cancellations Support Desk</h3>
                  <p>Need assistance with a return request, damaged shipment, or refund status?</p>
                </div>
              </div>

              <div className="support-channel-grid">
                <a href="mailto:responsible@Prestodental.store" className="support-channel-box">
                  <i className="fa-solid fa-envelope-open-text" />
                  <div>
                    <span>Designated Support Email</span>
                    <strong>responsible@Prestodental.store</strong>
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

              <div className="returns-nav-buttons">
                <Link to="/" className="btn-back-home">
                  <i className="fa-solid fa-arrow-left" /> Return to Homepage
                </Link>
                <Link to="/shipping-policy" className="btn-view-shipping">
                  <i className="fa-solid fa-truck-fast" /> View Shipping Policy
                </Link>
                <Link to="/terms-of-use" className="btn-view-terms">
                  <i className="fa-solid fa-scale-balanced" /> View Terms of Use
                </Link>
              </div>
            </div>
          </main>
        </div>
      </section>
    </div>
  );
};

export default ReturnPolicyPage;
