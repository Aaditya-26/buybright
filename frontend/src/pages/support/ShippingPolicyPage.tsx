/**
 * BuyBright Shipping Policy Page.
 * Official shipping policy statement.
 */

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../../components/common/SEO';

export const ShippingPolicyPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="pd-shipping-policy-page">
      <SEO
        title="Shipping Policy — BuyBright"
        description="The orders for the user are shipped through registered domestic courier companies and/or speed post only."
        canonicalUrl="/shipping-policy"
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
            <span className="current">Shipping Policy</span>
          </div>

          <div className="policy-header-main">
            <div className="policy-badge-pill">
              <i className="fa-solid fa-truck-fast" />
              <span>Fulfillment &amp; Domestic Logistics Standards</span>
            </div>

            <h1 className="policy-title">Shipping Policy</h1>
            <p className="policy-lead-text">
              Official shipping, delivery timelines, and logistics policy for BuyBright.
            </p>

            <div className="policy-meta-bar">
              <div className="meta-item">
                <i className="fa-regular fa-clock" />
                <span>Dispatch Window: <strong>Within 3 Days</strong></span>
              </div>
              <div className="meta-item">
                <i className="fa-solid fa-calendar-days" />
                <span>Transit Time: <strong>3 to 8 Days</strong></span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <section className="shipping-content-section">
        <div className="shipping-layout-container">
          <main className="shipping-main-body">
            <article className="shipping-doc-card">
              <div className="doc-card-header">
                <div className="doc-icon-badge">
                  <i className="fa-solid fa-boxes-packing" />
                </div>
                <div>
                  <h2>Shipping Policy</h2>
                  <span className="doc-sub-text">BuyBright Delivery Terms</span>
                </div>
              </div>

              <div className="doc-statement-box">
                <p className="primary-statement">
                  The orders for the user are shipped through registered domestic courier companies and/or speed post only. Orders are shipped within 3 days from the date of the order and delivery in 3 to 8 days, and/or payment or as per the delivery date agreed at the time of order confirmation and delivering of the shipment, subject to courier company / post office norms. Platform Owner shall not be liable for any delay in delivery by the courier company / postal authority. Delivery of all orders will be made to the address provided by the buyer at the time of purchase. Delivery of our services will be confirmed on your email ID as specified at the time of registration. If there are any shipping cost(s) levied by the seller or the Platform Owner (as the case be), the same is not refundable.
                </p>
              </div>
            </article>
          </main>
        </div>
      </section>
    </div>
  );
};

export default ShippingPolicyPage;
