/**
 * BuyBright 404 Not Found Page.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/common/SEO';

export const NotFoundPage: React.FC = () => {
  return (
    <section className="section text-center" style={{ padding: '100px 20px', minHeight: '60vh' }}>
      <SEO
        title="404 — Page Not Found"
        description="The requested dental catalog page could not be found. Return to BuyBright storefront."
      />
      <h1 style={{ fontSize: '72px', fontWeight: '800', color: 'var(--color-coral-red)', fontFamily: "'Manrope', sans-serif" }}>
        404
      </h1>
      <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--color-dark-navy)', marginBottom: '16px' }}>
        Page Not Found
      </h2>
      <p style={{ color: '#64748b', maxWidth: '400px', margin: '0 auto 24px' }}>
        The page you are looking for might have been moved, renamed, or is temporarily unavailable.
      </p>
      <Link to="/" className="btn-primary-custom" style={{ display: 'inline-flex' }}>
        <span>Return to Storefront</span>
      </Link>
    </section>
  );
};
