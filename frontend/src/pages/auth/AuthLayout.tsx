/**
 * BuyBright Unified AuthLayout Component.
 * Full-screen fixed dental background with elegant left-side bottom headline & paragraph,
 * and clean floating right-side form card.
 */

import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  activeTab?: 'login' | 'register' | 'forgot';
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="pd-auth-container">
      {/* Full-Screen Ambient Overlay */}
      <div className="auth-fullscreen-overlay" />

      <div className="pd-auth-page-wrapper">
        {/* LEFT SECTION: Logo at Top, Headline & Paragraph at Bottom */}
        <div className="auth-left-hero">
          {/* Top Logo Card & Verified Badge */}
          <div className="auth-hero-top">
            <Link to="/" className="auth-main-logo-card" title="Return to BuyBright Store">
              <img src="/images/logo.webp" alt="BuyBright" />
            </Link>

          </div>

          {/* Bottom Heading & Paragraph */}
          <div className="auth-hero-bottom">
            <h1 className="auth-hero-title">
              Smart Shopping, <br /> <br />
              <span className="hero-gradient-text">Brilliant Savings.</span>
            </h1>

            <p className="auth-hero-desc">
              Join millions of happy shoppers on BuyBright. Discover authentic electronics, fashion, lifestyle, and home products from verified independent marketplace sellers across India.</p>

            <div className="auth-hero-trust-row">
              <span className="trust-pill">
                <i className="fa-solid fa-circle-check" /> 100% Genuine Products
              </span>
              <span className="trust-pill">
                <i className="fa-solid fa-truck-fast" /> 24hr Fast Dispatch
              </span>
              <span className="trust-pill">
                <i className="fa-solid fa-shield-halved" /> 500+ Verified Sellers
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION: Floating Auth Form Card */}
        <div className="auth-right-form-wrapper">
          <div className="auth-floating-form-card">
            {/* Top Bar with Back Link and Logo */}
            <div className="auth-top-row">
              <Link to="/" className="auth-back-link" title="Return to BuyBright Store">
                <i className="fa-solid fa-arrow-left" />
                <span>Back to Store</span>
              </Link>

               
            </div>

            {/* Form Content Slot (Login / Register / Forgot Password) */}
            <div className="auth-content-slot">
              {children}
            </div>

            {/* Secure Trust Notice */}
            <div className="auth-footer-notice">
              
              <Link to="/contact" className="auth-help-link">
                Need Help?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


