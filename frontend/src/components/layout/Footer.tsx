/**
 * BuyBright Production-Ready Footer Component.
 * Pixel-perfect implementation matching the exact reference design.
 * Features:
 * - Double curved wave top transition with vibrant saffron-orange & gold ribbon strokes
 * - Detailed golden traditional corner Rangoli/Mandala art (top-left, bottom-left, bottom-right)
 * - 5 Columns with vertical divider lines:
 *   1. Brand: Official Logo + "BUYBRIGHT" + Tagline + Description + 5 Circular Social Icons with customized hover effects
 *   2. Quick Links with Orange ">" indicators (Home active in orange)
 *   3. Customer Support Pages & Policies (Track Order, Returns, Shipping, Terms, Privacy, About)
 *   4. Helpline & Registered Office with yellow outline icons (Phone with hours, Email, Pune Address) + Payment Badges
 *   5. Fulfillment & Distribution Centres (Mumbai Central Fulfillment Centre & Delhi NCR Logistics Hub)
 * - Bottom Bar: Copyright (Left) + Traditional Lotus/Diya Golden Center Divider + Legal Links (Right)
 */

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Detailed Traditional Indian Golden Mandala Line Art SVG
 */
const FooterMandalaArt: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 240 240"
    fill="none"
    className={`footer-mandala-vector ${className}`}
    aria-hidden="true"
  >
    <g stroke="#F5B942" strokeWidth="1.2" opacity="0.45">
      <circle cx="120" cy="120" r="115" strokeDasharray="4 4" />
      <circle cx="120" cy="120" r="102" />
      <circle cx="120" cy="120" r="86" strokeDasharray="3 3" />
      <circle cx="120" cy="120" r="68" />
      <circle cx="120" cy="120" r="50" strokeDasharray="2 2" />
      <circle cx="120" cy="120" r="34" />
      <circle cx="120" cy="120" r="18" />
      <circle cx="120" cy="120" r="6" fill="#F5B942" opacity="0.6" />
    </g>
    <g stroke="#F5B942" strokeWidth="1" opacity="0.4">
      {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((deg, i) => (
        <path
          key={i}
          d="M120,120 L120,12 Q136,54 120,120 Q104,54 120,12"
          transform={`rotate(${deg} 120 120)`}
          fill="none"
        />
      ))}
      {[11.25, 33.75, 56.25, 78.75, 101.25, 123.75, 146.25, 168.75, 191.25, 213.75, 236.25, 258.75, 281.25, 303.75, 326.25, 348.75].map((deg, i) => (
        <circle
          key={i}
          cx="120"
          cy="26"
          r="3"
          fill="#F5B942"
          transform={`rotate(${deg} 120 120)`}
          opacity="0.6"
        />
      ))}
    </g>
  </svg>
);

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="pd-main-footer pd-exact-dussehra-footer" id="footer">
      {/* 1. TOP CURVED TRANSITION WAVE WITH ORANGE & GOLD RIBBON */}
      <div className="footer-top-wave-wrapper" aria-hidden="true">
        <svg
          viewBox="0 0 1440 95"
          fill="none"
          preserveAspectRatio="none"
          className="footer-exact-wave-svg"
        >
          {/* Main Footer Navy-Teal Body */}
          <path
            d="M0,32 C260,82 500,8 820,38 C1100,64 1280,50 1440,28 L1440,95 L0,95 Z"
            fill="#08384d"
          />
          {/* Orange Outer Ribbon */}
          <path
            d="M0,32 C260,82 500,8 820,38 C1100,64 1280,50 1440,28"
            stroke="#F97316"
            strokeWidth="6.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Fine Gold Accent Line */}
          <path
            d="M0,38 C260,88 500,14 820,44 C1100,70 1280,56 1440,34"
            stroke="#F5B942"
            strokeWidth="2.5"
            fill="none"
          />
        </svg>
      </div>

      {/* 2. MAIN FOOTER CONTENT (5 Columns with Vertical Separator Lines) */}
      <div className="pd-footer-main">
        {/* Decorative Golden Corner Mandalas positioned inside pd-footer-main */}
        <div className="corner-mandala-decor bottom-left" aria-hidden="true">
          <FooterMandalaArt />
        </div>
        <div className="corner-mandala-decor bottom-right" aria-hidden="true">
          <FooterMandalaArt />
        </div>

        <div className="pd-footer-container">
          <div className="pd-footer-columns-row">
            {/* =========================================================
                COLUMN 1: BRAND
                ========================================================= */}
            <div className="pd-col brand-col">
              <Link to="/" className="footer-brand-header" onClick={scrollToTop}>
                {/* Official Brand Logo */}
                <img
                  src="/images/logo.webp"
                  alt="BuyBright"
                  className="footer-brand-official-logo"
                />
              </Link>

              <div className="brand-tagline">
                Smart Shopping. Brilliant Savings.
              </div>

              <p className="brand-desc">
                BuyBright is India's premier multi-seller e-commerce marketplace connecting verified sellers with millions of happy customers nationwide.
              </p>

              {/* 5 Circular Social Buttons with Custom Brand Hover Effects */}
              <div className="footer-social-row">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-circle-btn social-fb"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <i className="fa-brands fa-facebook-f" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-circle-btn social-ig"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <i className="fa-brands fa-instagram" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-circle-btn social-li"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <i className="fa-brands fa-linkedin-in" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-circle-btn social-yt"
                  aria-label="YouTube"
                  title="YouTube"
                >
                  <i className="fa-brands fa-youtube" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-circle-btn social-tw"
                  aria-label="X (Twitter)"
                  title="X"
                >
                  <i className="fa-brands fa-x-twitter" />
                </a>
              </div>
            </div>

            {/* Vertical Divider 1 */}
            <div className="col-divider" aria-hidden="true" />

            {/* =========================================================
                COLUMN 2: QUICK LINKS
                ========================================================= */}
            <div className="pd-col links-col">
              <h4 className="footer-col-title">Quick Links</h4>
              <ul className="footer-nav-list">
                <li className="active">
                  <Link to="/" onClick={scrollToTop}>
                    <span className="chevron">&rsaquo;</span>
                    <span className="link-text">Home</span>
                  </Link>
                </li>
                <li>
                  <Link to="/shop" onClick={scrollToTop}>
                    <span className="chevron">&rsaquo;</span>
                    <span className="link-text">Shop</span>
                  </Link>
                </li>
                <li>
                  <Link to="/brands" onClick={scrollToTop}>
                    <span className="chevron">&rsaquo;</span>
                    <span className="link-text">Brands</span>
                  </Link>
                </li>
                <li>
                  <Link to="/shop?offers=festive" onClick={scrollToTop}>
                    <span className="chevron">&rsaquo;</span>
                    <span className="link-text">Offers</span>
                  </Link>
                </li>
                <li>
                  <Link to="/new-arrivals" onClick={scrollToTop}>
                    <span className="chevron">&rsaquo;</span>
                    <span className="link-text">New Arrivals</span>
                  </Link>
                </li>
                <li>
                  <Link to="/bestsellers" onClick={scrollToTop}>
                    <span className="chevron">&rsaquo;</span>
                    <span className="link-text">Best Sellers</span>
                  </Link>
                </li>
                <li>
                  <Link to="/contact" onClick={scrollToTop}>
                    <span className="chevron">&rsaquo;</span>
                    <span className="link-text">Contact Us</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Vertical Divider 2 */}
            <div className="col-divider" aria-hidden="true" />

            {/* =========================================================
                COLUMN 3: SUPPORT & POLICY PAGES
                ========================================================= */}
            <div className="pd-col support-pages-col">
              <h4 className="footer-col-title">Customer Support</h4>
              <ul className="footer-nav-list">
                <li>
                  <Link to="/track-order" onClick={scrollToTop}>
                    <span className="chevron">&rsaquo;</span>
                    <span className="link-text">Track Order</span>
                  </Link>
                </li>
                <li>
                  <Link to="/return-policy" onClick={scrollToTop}>
                    <span className="chevron">&rsaquo;</span>
                    <span className="link-text">Return &amp; Refund Policy</span>
                  </Link>
                </li>
                <li>
                  <Link to="/shipping-policy" onClick={scrollToTop}>
                    <span className="chevron">&rsaquo;</span>
                    <span className="link-text">Shipping Policy</span>
                  </Link>
                </li>
                <li>
                  <Link to="/terms-of-use" onClick={scrollToTop}>
                    <span className="chevron">&rsaquo;</span>
                    <span className="link-text">Terms &amp; Conditions</span>
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" onClick={scrollToTop}>
                    <span className="chevron">&rsaquo;</span>
                    <span className="link-text">Privacy Policy</span>
                  </Link>
                </li>
                <li>
                  <Link to="/about-us" onClick={scrollToTop}>
                    <span className="chevron">&rsaquo;</span>
                    <span className="link-text">About BuyBright</span>
                  </Link>
                </li>
                <li>
                  <Link to="/contact" onClick={scrollToTop}>
                    <span className="chevron">&rsaquo;</span>
                    <span className="link-text">Help Center</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Vertical Divider 3 */}
            <div className="col-divider" aria-hidden="true" />

            {/* =========================================================
                COLUMN 4: HELPLINE & OFFICE & PAYMENTS
                ========================================================= */}
            <div className="pd-col support-col">
              <h4 className="footer-col-title">Contact &amp; Office</h4>
              <div className="support-info-list">
                {/* Phone & Working Hours */}
                <div className="support-item">
                  <div className="support-icon-wrap">
                    <i className="fa-solid fa-phone" />
                  </div>
                  <div className="support-text">
                    <a href="tel:+918806488054" className="support-main-link">
                      +91 88064 88054
                    </a>
                    <span className="support-sub-text">
                      Mon - Sat (9:00 AM - 6:00 PM)
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="support-item">
                  <div className="support-icon-wrap">
                    <i className="fa-solid fa-envelope" />
                  </div>
                  <div className="support-text">
                    <a href="mailto:support@buybright.com" className="support-main-link">
                      support@buybright.com
                    </a>
                    <span className="support-sub-text">
                      24/7 Email Support
                    </span>
                  </div>
                </div>
              </div>

              {/* Official Payment Method Badges Row */}
              <div className="payment-badges-container">
                <div className="payment-pill-badge visa" title="Visa">
                  <span className="visa-text">VISA</span>
                </div>

                <div className="payment-pill-badge mastercard" title="Mastercard">
                  <div className="mc-circles">
                    <span className="mc-red" />
                    <span className="mc-orange" />
                  </div>
                </div>

                <div className="payment-pill-badge rupay" title="RuPay">
                  <span className="rupay-brand">
                    <em>RuPay</em>
                    <span className="rupay-arrow" />
                  </span>
                </div>

                <div className="payment-pill-badge upi" title="Unified Payments Interface">
                  <span className="upi-brand">
                    UPI
                    <span className="upi-triangles">
                      <span className="upi-t1" />
                      <span className="upi-t2" />
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Vertical Divider 4 */}
            <div className="col-divider" aria-hidden="true" />

            {/* =========================================================
                COLUMN 5: FULFILLMENT & DISTRIBUTION CENTRES
                ========================================================= */}
            <div className="pd-col logistics-col">
              <h4 className="footer-col-title">Logistics &amp; Hubs</h4>

              {/* Fulfillment Centre */}
              <div className="logistics-card">
                <div className="logistics-badge">
                  <i className="fa-solid fa-boxes-packing" />
                  <span>Fulfillment Centre</span>
                </div>
                <p className="logistics-address">
                  895/G3, Mahalaxmi CHS, Temghar Pada, Kalyan Road, Bhiwandi – 421302
                </p>
              </div>

              {/* Distribution Centre */}
              <div className="logistics-card">
                <div className="logistics-badge">
                  <i className="fa-solid fa-truck-ramp-box" />
                  <span>Distribution Centre</span>
                </div>
                <p className="logistics-address">
                  6/1203, Atlanta Eden World Complex, Opp PWD Office, Bhadwad, Bhiwandi – 421302
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM FOOTER BAR WITH CENTER LOTUS/DIYA DIVIDER */}
      <div className="pd-footer-bottom-exact">
        <div className="pd-footer-container bottom-bar-inner">
          {/* Left: Copyright */}
          <div className="bottom-copyright">
            &copy; 2025 BuyBright. Designed &amp; Developed by{' '}
            <a href="https://microlan.in" target="_blank" rel="noopener noreferrer" className="copyright-dev-link">
              Microlan.in
            </a>
            . All Rights Reserved.
          </div>

          {/* Center: Indian Flag Badge */}
          <div className="bottom-center-flag-badge" aria-label="Proudly Serving Across India">
            <svg
              viewBox="0 0 30 20"
              width="22"
              height="15"
              className="india-flag-svg"
              aria-hidden="true"
            >
              <rect width="30" height="6.66" fill="#FF9933" />
              <rect y="6.66" width="30" height="6.66" fill="#FFFFFF" />
              <rect y="13.33" width="30" height="6.66" fill="#138808" />
              <circle cx="15" cy="10" r="2.2" fill="#000080" />
            </svg>
            <span className="made-in-india-text">Proudly Serving India</span>
          </div>

          {/* Right: Legal & Policy Links */}
          <div className="bottom-legal-links">
            <Link to="/privacy-policy" onClick={scrollToTop}>
              Privacy Policy
            </Link>
            <span className="divider-pipe">|</span>
            <Link to="/terms-of-use" onClick={scrollToTop}>
              Terms &amp; Conditions
            </Link>
            <span className="divider-pipe">|</span>
            <Link to="/return-policy" onClick={scrollToTop}>
              Return &amp; Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
