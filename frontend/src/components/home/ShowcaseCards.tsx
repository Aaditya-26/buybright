/**
 * BuyBright 3-Banner Asymmetric Promotional Showcase Component (Original Design).
 * Unified CSS Grid layout:
 * - Card 1 (Top-Left): Medicept Extreme Lite (₹1,761/-)
 * - Card 2 (Bottom-Left): Gufic Pure Flufic-150 (₹255/-)
 * - Card 3 (Right Spanned): 3M ESPE Express XT Light Body (₹2,943/-)
 */

import React from 'react';
import { Link } from 'react-router-dom';
import type { ShowcaseItem } from '../../types';

interface ShowcaseCardsProps {
  id?: string;
  items?: ShowcaseItem[];
  banners?: {
    image: string;
    alt: string;
    title: string;
    link?: string;
  }[];
}

export const ShowcaseCards: React.FC<ShowcaseCardsProps> = ({ id = 'showcase', items, banners }) => {
  const b1 = banners?.[0] || {
    image: items?.[0]?.image || '/images/showcase_medicept.png',
    alt: 'Medicept Extreme Lite - Because Every Restoration Begins With The Right Impression - ₹1,761/-',
    title: 'Shop Medicept Extreme Lite - ₹1,761/-',
    link: '/shop?category=materials',
  };

  const b2 = banners?.[1] || {
    image: items?.[1]?.image || '/images/showcase_flufic.png',
    alt: 'Gufic Pure Flufic-150 - Trusted Relief From Fungal Infections - ₹255/-',
    title: 'Shop Gufic Pure Flufic-150 - ₹255/-',
    link: '/shop?category=consumables',
  };

  const b3 = banners?.[2] || {
    image: items?.[2]?.image || '/images/showcase_3mespe.png',
    alt: '3M ESPE Express XT Light Body - Because Margins Leave No Room for Error - ₹2,943/-',
    title: 'Shop 3M ESPE Express XT Light Body - ₹2,943/-',
    link: '/brands/3m-espe',
  };

  return (
    <section className="section promo-showcase-section" id={id}>
      <div className="promo-showcase-container">
        {/* 1. Card 1 (Top Left) */}
        <Link
          to={b1.link || '/shop'}
          className="promo-banner-card banner-medicept"
          title={b1.title}
        >
          <img
            src={b1.image}
            alt={b1.alt}
            loading="lazy"
          />
          <div className="promo-card-hover-overlay">
            <span className="btn-hover-shop">
              <span>SHOP NOW</span>
              <i className="fa-solid fa-arrow-right" />
            </span>
          </div>
        </Link>

        {/* 2. Card 2 (Bottom Left) */}
        <Link
          to={b2.link || '/shop'}
          className="promo-banner-card banner-flufic"
          title={b2.title}
        >
          <img
            src={b2.image}
            alt={b2.alt}
            loading="lazy"
          />
          <div className="promo-card-hover-overlay">
            <span className="btn-hover-shop">
              <span>SHOP NOW</span>
              <i className="fa-solid fa-arrow-right" />
            </span>
          </div>
        </Link>

        {/* 3. Card 3 (Right Full Height Span) */}
        <Link
          to={b3.link || '/shop'}
          className="promo-banner-card banner-3mespe"
          title={b3.title}
        >
          <img
            src={b3.image}
            alt={b3.alt}
            loading="lazy"
          />
          <div className="promo-card-hover-overlay">
            <span className="btn-hover-shop">
              <span>SHOP NOW</span>
              <i className="fa-solid fa-arrow-right" />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
};
