/**
 * BuyBright Full-Width Panoramic Hero Slider Component.
 * Features:
 * - Diwali Festival Hero Slide with authentic animated Diwali Diyas & flickering flames at bottom-left & right
 * - Clean, elegant glassmorphic content card without heavy borders or round discount badges
 * - Dynamic background banner slides with crossfade transitions
 * - Trust feature points, primary & secondary action buttons
 * - Centered bottom slide dots pagination and responsive navigation arrows
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFestival } from '../../context/FestivalContext';

/**
 * Rich Authentic Traditional Diwali Diya Component with Glowing Flickering Flame
 */
export const DiwaliDiyaIcon: React.FC<{
  width?: number;
  height?: number;
  className?: string;
  idSuffix?: string;
}> = ({ width = 64, height = 64, className = '', idSuffix = 'main' }) => (
  <svg
    viewBox="0 0 120 120"
    width={width}
    height={height}
    fill="none"
    className={`diya-vector-svg ${className}`}
    style={{ filter: 'drop-shadow(0 6px 14px rgba(0, 0, 0, 0.22))' }}
    aria-label="Diwali Diya Lamp"
  >
    <defs>
      {/* Brass & Terracotta Gradient */}
      <linearGradient id={`diya-body-grad-${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="35%" stopColor="#D97706" />
        <stop offset="70%" stopColor="#B45309" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>

      {/* Rim Gradient */}
      <linearGradient id={`diya-rim-grad-${idSuffix}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#92400E" />
      </linearGradient>

      {/* Flame Outer Gradient */}
      <linearGradient id={`flame-outer-grad-${idSuffix}`} x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#DC2626" />
        <stop offset="30%" stopColor="#EA580C" />
        <stop offset="65%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#FEF08A" />
      </linearGradient>

      {/* Flame Inner Core Gradient */}
      <linearGradient id={`flame-inner-grad-${idSuffix}`} x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#F97316" />
        <stop offset="50%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#FFFFFF" />
      </linearGradient>

      {/* Radiant Glow Aura */}
      <radialGradient id={`flame-aura-grad-${idSuffix}`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.85" />
        <stop offset="45%" stopColor="#F59E0B" stopOpacity="0.45" />
        <stop offset="85%" stopColor="#EA580C" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Radiant Background Aura */}
    <circle cx="60" cy="42" r="32" fill={`url(#flame-aura-grad-${idSuffix})`} />

    {/* Base Stand */}
    <ellipse cx="60" cy="102" rx="26" ry="6" fill="#78350F" opacity="0.6" />
    <path d="M44 100 L50 86 L70 86 L76 100 Z" fill={`url(#diya-body-grad-${idSuffix})`} />

    {/* Main Oil Lamp Bowl */}
    <path
      d="M16 72 C16 98, 104 98, 104 72 C104 65, 92 63, 60 63 C28 63, 16 65, 16 72 Z"
      fill={`url(#diya-body-grad-${idSuffix})`}
    />

    {/* Top Rim & Inner Oil Pool */}
    <ellipse cx="60" cy="71" rx="40" ry="10" fill={`url(#diya-rim-grad-${idSuffix})`} />
    <ellipse cx="60" cy="72" rx="34" ry="7" fill="#78350F" />
    <ellipse cx="60" cy="73" rx="28" ry="4.5" fill="#451A03" />

    {/* Traditional Golden Ornaments / Carvings */}
    <circle cx="30" cy="74" r="2.2" fill="#FEF08A" />
    <circle cx="44" cy="78" r="2.2" fill="#FEF08A" />
    <circle cx="60" cy="79" r="2.4" fill="#FEF08A" />
    <circle cx="76" cy="78" r="2.2" fill="#FEF08A" />
    <circle cx="90" cy="74" r="2.2" fill="#FEF08A" />

    {/* Cotton Wick */}
    <path d="M58 72 C58 60, 60 52, 60 46" stroke="#451A03" strokeWidth="3" strokeLinecap="round" />

    {/* Dynamic Flickering Flame */}
    <g className="flame">
      {/* Outer Flame */}
      <path
        d="M60 16 C74 34, 76 52, 66 60 C60 64, 52 64, 48 58 C40 48, 48 32, 60 16 Z"
        fill={`url(#flame-outer-grad-${idSuffix})`}
      />
      {/* Inner Flame Core */}
      <path
        d="M60 26 C68 38, 70 48, 63 54 C59 58, 55 57, 53 53 C49 46, 54 36, 60 26 Z"
        fill={`url(#flame-inner-grad-${idSuffix})`}
      />
      {/* Pure White Hot Center */}
      <ellipse cx="60" cy="48" rx="3.5" ry="6" fill="#FFFFFF" opacity="0.95" />
    </g>
  </svg>
);

interface SlideData {
  id: number;
  isFestival?: boolean;
  eyebrow: string;
  titlePrefix: string;
  titleHighlight: string;
  description: string;
  badgeCount: string;
  badgeText: string;
  bgImage: string;
  offerCode?: string;
}

const SLIDES: SlideData[] = [
  {
    id: 0,
    isFestival: true,
    eyebrow: 'Diwali Dhamaka — Mega Festive Sale',
    titlePrefix: 'Smart Shopping, ',
    titleHighlight: 'Brilliant Savings.',
    description:
      'Celebrate with up to 50% off on top electronics, fashion, home essentials, and gadgets from verified marketplace sellers across India.',
    badgeCount: 'UP TO 50% OFF',
    badgeText: 'Diwali Special',
    bgImage: '/images/f1.png',
    offerCode: 'Use code BUYBRIGHT50 at checkout',
  },
  {
    id: 1,
    isFestival: false,
    eyebrow: "India's Multi-Seller Marketplace",
    titlePrefix: 'Trending Electronics & ',
    titleHighlight: 'Smart Gadgets',
    description:
      'Discover top smartphones, wireless audio, smart wearables and tech gear with manufacturer warranty and seller authenticity checks.',
    badgeCount: '500+',
    badgeText: 'Verified Sellers',
    bgImage: '/images/f2.png',
  },
  {
    id: 2,
    isFestival: false,
    eyebrow: 'Express Pan-India Logistics',
    titlePrefix: 'Fashion, Home Essentials & ',
    titleHighlight: 'Lifestyle Deals',
    description:
      '100% genuine products with fast doorstep delivery, easy 7-day returns, and transparent multi-seller pricing.',
    badgeCount: '500+',
    badgeText: 'Cities Served',
    bgImage: '/images/dashera.png',
  },
];

const SLIDE_DURATION = 6500;

export const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartXRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
    resetTimer();
  };

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      nextSlide();
    }, SLIDE_DURATION);
  }, [nextSlide]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartXRef.current - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
      resetTimer();
    }
  };

  const scrollToProducts = () => {
    const el = document.getElementById('products-set-1') || document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate('/shop');
    }
  };

  const scrollToCategories = () => {
    const el = document.getElementById('categories');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate('/shop');
    }
  };

  const { activeFestival } = useFestival();
  const showBannerDecor = activeFestival ? activeFestival.bannerOverlayEnabled : true;
  const leftDecorImg = (activeFestival && activeFestival.leftFestivalImage) ? activeFestival.leftFestivalImage : '/images/left.png';
  const rightDecorImg = (activeFestival && activeFestival.rightFestivalImage) ? activeFestival.rightFestivalImage : '/images/right.png';

  const active = SLIDES[currentSlide];

  return (
    <section
      className={`pd-panoramic-hero-section ${active.isFestival ? 'pd-festival-hero-active' : ''}`}
      id="hero"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Banner Slides with Crossfade */}
      <div className="pd-hero-background-wrapper">
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`pd-hero-bg-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.bgImage})` }}
            role="img"
            aria-label={slide.titlePrefix + slide.titleHighlight}
          />
        ))}
        {/* Soft Festive Gradient Overlay */}
        <div className="pd-hero-overlay-gradient" />
      </div>

      {/* Decorative Top-Corner Festive Hanging Decor (Responsive) */}
      {showBannerDecor && (
        <>
          <img
            src={leftDecorImg}
            alt=""
            className="pd-hero-corner-decor left-corner"
            aria-hidden="true"
            loading="eager"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/left.png';
            }}
          />
          <img
            src={rightDecorImg}
            alt=""
            className="pd-hero-corner-decor right-corner"
            aria-hidden="true"
            loading="eager"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/right.png';
            }}
          />
        </>
      )}

      {/* Hero Content Container */}
      <div className="pd-hero-container">
        <div className="pd-hero-content-card">

          {/* Eyebrow Pill with Diya Icon & Badge */}
          <div className="pd-hero-brand-pill">
            <DiwaliDiyaIcon width={20} height={20} idSuffix="eyebrow" className="pill-diya-icon" />
            <span className="pill-eyebrow-text">{active.eyebrow}</span>
            <span className="pill-divider">·</span>
            <span className="pill-stat-badge">
              <i className="fa-solid fa-sparkles" /> {active.badgeCount} {active.badgeText}
            </span>
          </div>

          {/* Headline */}
          <h1 className="pd-hero-headline">
            {active.titlePrefix}
            <span className="pd-hero-red-highlight">{active.titleHighlight}</span>
          </h1>

          {/* Subtitle Description */}
          <p className="pd-hero-description">{active.description}</p>

          {/* Trust Feature Badges */}
          <div className="pd-hero-trust-row">
            <div className="pd-trust-item">
              <div className="trust-icon-box">
                <i className="fa-solid fa-circle-check" />
              </div>
              <span>100% Original Products</span>
            </div>

            <div className="pd-trust-item">
              <div className="trust-icon-box">
                <i className="fa-solid fa-truck-fast" />
              </div>
              <span>Fast &amp; Safe Delivery</span>
            </div>

            <div className="pd-trust-item">
              <div className="trust-icon-box">
                <i className="fa-solid fa-shield-halved" />
              </div>
              <span>Secure Payments</span>
            </div>

            <div className="pd-trust-item">
              <div className="trust-icon-box">
                <i className="fa-solid fa-file-invoice" />
              </div>
              <span>100% GST Invoicing</span>
            </div>
          </div>

          {/* Action Buttons & Festive Offer Pill */}
          <div className="pd-hero-action-buttons">
            <button
              type="button"
              className="btn-hero-primary-shop"
              onClick={scrollToProducts}
              aria-label="Shop dental products now"
            >
              <span>{active.isFestival ? 'Shop the Sale' : 'Shop Now'}</span>
              <div className="btn-circle-icon">
                <i className="fa-solid fa-arrow-right" />
              </div>
            </button>

            {active.offerCode ? (
              <div className="offer-pill" title="Coupon code for Diwali">
                <i className="fa-solid fa-tag" />
                <span>{active.offerCode}</span>
              </div>
            ) : (
              <button
                type="button"
                className="btn-hero-secondary-browse"
                onClick={scrollToCategories}
                aria-label="Browse all categories"
              >
                <i className="fa-solid fa-layer-group" />
                <span>Browse Categories</span>
              </button>
            )}
          </div>

          {/* Slider Pagination Controls & Arrows - Always Visible */}
          <div className="pd-hero-pagination-row">
            <div className="pd-dots-track">
              {SLIDES.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  className={`pd-slide-dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Switch to slide ${index + 1}`}
                />
              ))}
            </div>

            <div className="pd-arrows-group">
              <button
                type="button"
                className="btn-slide-nav prev"
                onClick={prevSlide}
                aria-label="Previous Slide"
              >
                <i className="fa-solid fa-chevron-left" />
              </button>
              <button
                type="button"
                className="btn-slide-nav next"
                onClick={nextSlide}
                aria-label="Next Slide"
              >
                <i className="fa-solid fa-chevron-right" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
