/**
 * BuyBright About Us & Marketplace Value Propositions Component.
 * Left Side: 3-Image Automatic Slider with Dots
 * Right Side: Marketplace Highlights & Verified Deals
 */

import React, { useState, useEffect, useRef } from 'react';
import { DiwaliDiyaIcon } from './HeroSlider';

const ABOUT_SLIDES = [
  {
    id: 0,
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=900&auto=format&fit=crop',
    title: 'Top Consumer Electronics & Tech',
  },
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=900&auto=format&fit=crop',
    title: 'Trending Fashion & Lifestyle',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=900&auto=format&fit=crop',
    title: 'Modern Home & Kitchen Essentials',
  },
];

export const AboutSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % ABOUT_SLIDES.length);
    }, 3500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const goToSlide = (index: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrentSlide(index);
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % ABOUT_SLIDES.length);
    }, 3500);
  };

  const handleScrollToProducts = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="section about-banner-section" id="about">
      <div className="about-card-container">
        <div className="about-card-inner">
          {/* Left Column: 3-Image Automatic Slider with Dots */}
          <div className="about-image-wrap">
            <div className="about-slides">
              {ABOUT_SLIDES.map((slide, idx) => (
                <div
                  key={slide.id}
                  className={`about-slide ${idx === currentSlide ? 'active' : ''}`}
                  style={{ backgroundImage: `url('${slide.image}')` }}
                  title={slide.title}
                />
              ))}
            </div>

            {/* Pagination Dots */}
            <div className="about-dots">
              {ABOUT_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`about-dot ${idx === currentSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(idx)}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Special Offer Content & Value Propositions */}
          <div className="about-content-wrap">
            <div className="about-offer-badge-row">
              <span className="about-offer-pill">
                <i className="fa-solid fa-bolt" />
                <span>EXCLUSIVE OFFERS</span>
              </span>
              <span className="about-discount-tag">UP TO 40% OFF</span>
            </div>

            <div className="section-title-festive-row">
              <span className="festive-title-diya left" aria-hidden="true">
                <DiwaliDiyaIcon width={30} height={30} idSuffix="about-title-left" />
              </span>
              <h2 className="about-heading">
                Empowering Millions of Shoppers.
                <br />
                <span className="accent-teal">India's Smart Multi-Seller Marketplace.</span>
              </h2>
              <span className="festive-title-diya right" aria-hidden="true">
                <DiwaliDiyaIcon width={30} height={30} idSuffix="about-title-right" />
              </span>
            </div>

            <p className="about-description">
              Shop authentic electronics, fashion, lifestyle, and home goods directly from verified independent sellers at unbeatable prices with 7-day easy returns.</p>

            {/* Structured Offer Highlight Cards */}
            <div className="about-offers-grid">
              {/* Offer Card 1 */}
              <div className="about-offer-card">
                <div className="offer-card-icon bulk-icon">
                  <i className="fa-solid fa-layer-group" />
                </div>
                <div className="offer-card-info">
                  <strong className="offer-card-title">Verified Seller Guarantee</strong>
                  <span className="offer-card-sub">100% authentic products with strict multi-stage quality checks</span>
                </div>
              </div>

              {/* Offer Card 2 */}
              <div className="about-offer-card">
                <div className="offer-card-icon ship-icon">
                  <i className="fa-solid fa-truck-fast" />
                </div>
                <div className="offer-card-info">
                  <strong className="offer-card-title">Pan-India Fast Express Delivery</strong>
                  <span className="offer-card-sub">Reliable delivery across 500+ cities with free shipping over ₹499</span>
                </div>
              </div>

              {/* Offer Card 3 */}
              <div className="about-offer-card">
                <div className="offer-card-icon shield-icon">
                  <i className="fa-solid fa-shield-halved" />
                </div>
                <div className="offer-card-info">
                  <strong className="offer-card-title">100% Genuine Brand Warranties</strong>
                  <span className="offer-card-sub">Official GST invoices &amp; authorized dealer backing</span>
                </div>
              </div>
            </div>

            {/* Interactive Call to Action Row */}
            <div className="about-action-row">
              <a href="#products" className="btn-about-offer-cta" onClick={handleScrollToProducts}>
                <span>ClaimOffers</span>
                <i className="fa-solid fa-arrow-right" />
              </a>


            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
