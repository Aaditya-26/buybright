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
        description="Review the BuyBright Return, Cancellation, and Refund Policy covering 10-day return windows, seller verification, and 24-48h refund processing."
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
              Transparent, customer-focused guidelines for order cancellations, verified warehouse returns, and fast refund settlements.
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
                  <p>Email our customer support desk directly:</p>
                </div>
                <a href="mailto:support@buybright.com" className="btn-toc-email">
                  support@buybright.com
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
                      In order to cancel the order before the shipment of the product/products, customer has to go to <strong>‘My Orders’</strong> and cancel the order or else contact <a href="mailto:support@buybright.com">support@buybright.com</a>.
                    </p>
                  </div>

                  <div className="step-card">
                    <div className="step-badge after-badge">After Shipment</div>
                    <p>
                      In order to cancel the order after the shipment of the product/products, customer has to contact <a href="mailto:support@buybright.com">support@buybright.com</a>.
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
                      In case of returns, BuyBright arranges doorstep pick-up of the goods. If outside pickup coverage, customers can ship via tracked courier with reimbursement.
                    </span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check" />
                    <span>
                      The product must be returned in its original packaging with all manuals, accessories, and warranty cards intact.
                    </span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check" />
                    <span>
                      A part of the order can also be returned if multiple items were ordered. Each returned item must be unused and unaltered.
                    </span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check" />
                    <span>
                      In case of a return/replacement/refund, we process the refund once the products have been received and verified at our fulfillment center.
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
                      For payments done through credit/debit cards, UPI, or net banking, the refund will be credited to the original payment source within 24-48 business hours.
                    </span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check" />
                    <span>
                      For cash on delivery transactions, we will initiate a direct bank transfer (NEFT/IMPS) against the verified bank details shared by you.
                    </span>
                  </li>
                </ul>

                {/* Non-Returnable Equipment Categories */}
                <div className="non-returnable-banner">
                  <div className="banner-title">
                    <i className="fa-solid fa-triangle-exclamation" />
                    <h4>Items which cannot be returned include:</h4>
                  </div>
                  <p>
                    Customized products, personal intimate apparel, opened software packages, and heavy appliances once unboxed and installed with on-site technician demo.
                  </p>
                </div>

                {/* Products not applicable for returns */}
                <div className="non-returnable-banner products-banner">
                  <div className="banner-title">
                    <i className="fa-solid fa-ban" />
                    <h4>Personal care products not eligible for returns:</h4>
                  </div>
                  <p>
                    Opened cosmetic formulations, perfumes, oral hygiene items with broken seals, and consumable skincare products.
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
                  <h2>Items Not Applicable for Returns</h2>
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
                    <p>Returned without original packaging including price tags, labels, warranty cards, or original accessories</p>
                  </div>

                  <div className="restriction-item">
                    <div className="r-icon"><i className="fa-solid fa-barcode" /></div>
                    <p>If the device Serial Number or IMEI is missing or tampered</p>
                  </div>

                  <div className="restriction-item">
                    <div className="r-icon"><i className="fa-solid fa-file-excel" /></div>
                    <p>Physical or liquid damage not covered under manufacturer warranty</p>
                  </div>

                  <div className="restriction-item">
                    <div className="r-icon"><i className="fa-solid fa-pen-ruler" /></div>
                    <p>Product is used, altered, or software modified</p>
                  </div>

                  <div className="restriction-item time-limit-item">
                    <div className="r-icon"><i className="fa-solid fa-calendar-xmark" /></div>
                    <p>If request is initiated after <strong>10 business days</strong> of order delivery</p>
                  </div>

                  <div className="restriction-item">
                    <div className="r-icon"><i className="fa-solid fa-gift" /></div>
                    <p>Free promotional items and gift with purchase products</p>
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
                      <h3>Credit / Debit Cards, UPI &amp; Net Banking</h3>
                      <p>
                        For payments done through credit/debit cards, UPI, or net banking, the refund will be processed to the same account within <strong>24 business hours</strong> of receiving the return. It may take <strong>2-3 business days</strong> for the bank to credit your account.
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
                        For COD orders, we initiate a direct bank transfer (IMPS/NEFT) against the verified bank details provided by you within <strong>24-48 business hours</strong> of return verification.
                      </p>
                    </div>
                  </div>

                  {/* Coupon Option */}
                  <div className="refund-channel-item coupon-channel-item">
                    <div className="channel-icon-col coupon-icon">
                      <i className="fa-solid fa-ticket" />
                    </div>
                    <div className="channel-text-col">
                      <h3>BuyBright Instant Wallet / Coupon Option</h3>
                      <p>
                        We also offer an instant refund option via <strong>BuyBright store credit / discount voucher</strong> which reflects immediately in your profile for future shopping.
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
                <a href="mailto:support@buybright.com" className="support-channel-box">
                  <i className="fa-solid fa-envelope-open-text" />
                  <div>
                    <span>Designated Support Email</span>
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
