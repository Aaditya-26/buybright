/**
 * BuyBright Ultra-Modern Dual Flash Sale Banners Component.
 * Styled after the modern dual split-banner design:
 * - Two equal-width panoramic promo banners side-by-side
 * - Card 1 (Left): Warm ivory clinic aesthetic ("Refresh Your Operatory") with Equipment CTA
 * - Card 2 (Right): Luxury soft pastel rose aesthetic ("Glow Naturally") with Restoratives CTA
 * - Real-time countdown timer pills & flash discount tags
 * - 100% responsive: 2 columns on desktop, stacks seamlessly on tablet & mobile
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getFlashSales, FlashSaleItem, INITIAL_FLASH_SALE_ITEMS } from '../../admin/data/flashSaleData';

export const FlashDealsSection: React.FC = () => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(14 * 3600 + 42 * 60 + 35);
  const [secondsRemaining2, setSecondsRemaining2] = useState<number>(26 * 3600 + 18 * 60 + 50);

  // Load flash sale schedule dates
  const [flashSales, setFlashSales] = useState<FlashSaleItem[]>(() => {
    try {
      return getFlashSales();
    } catch {
      return INITIAL_FLASH_SALE_ITEMS;
    }
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        setFlashSales(getFlashSales());
      } catch {
        // preserve current
      }
    };
    window.addEventListener('buybright_flash_sales_updated', handleUpdate);
    return () => {
      window.removeEventListener('buybright_flash_sales_updated', handleUpdate);
    };
  }, []);

  const formatScheduleDate = (dtStr?: string, defaultVal = '06 Oct 2026') => {
    if (!dtStr) return defaultVal;
    try {
      const d = new Date(dtStr);
      if (isNaN(d.getTime())) return defaultVal;
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return defaultVal;
    }
  };

  const sale1 = flashSales[0] || INITIAL_FLASH_SALE_ITEMS[0];
  const sale2 = flashSales[1] || flashSales[0] || INITIAL_FLASH_SALE_ITEMS[1];

  const startDate1 = useMemo(() => formatScheduleDate(sale1?.startDate, '06 Oct 2026'), [sale1?.startDate]);
  const endDate1 = useMemo(() => formatScheduleDate(sale1?.endDate, '15 Oct 2026'), [sale1?.endDate]);

  const startDate2 = useMemo(() => formatScheduleDate(sale2?.startDate, '06 Oct 2026'), [sale2?.startDate]);
  const endDate2 = useMemo(() => formatScheduleDate(sale2?.endDate, '15 Oct 2026'), [sale2?.endDate]);

  // Real-time ticking timers
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 24 * 3600));
      setSecondsRemaining2((prev) => (prev > 0 ? prev - 1 : 36 * 3600));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const time1 = useMemo(() => {
    const hours = Math.floor(secondsRemaining / 3600);
    const minutes = Math.floor((secondsRemaining % 3600) / 60);
    const seconds = secondsRemaining % 60;
    return {
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
    };
  }, [secondsRemaining]);

  const time2 = useMemo(() => {
    const hours = Math.floor(secondsRemaining2 / 3600);
    const minutes = Math.floor((secondsRemaining2 % 3600) / 60);
    const seconds = secondsRemaining2 % 60;
    return {
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
    };
  }, [secondsRemaining2]);

  return (
    <section className="section flash-dual-banners-section" id="flash-deals" aria-label="Flash Deals and Special Offers">
      <div className="flash-dual-banners-grid">
        {/* ── Banner 1: Left Card (Warm Ivory / Operatory Aesthetic) ── */}
        <div className="flash-banner-card card-operatory">
          <div className="banner-content">
            {/* Urgency Pill & Schedule */}
            <div className="banner-top-meta">
              <span className="banner-flash-tag">
                <i className="fa-solid fa-bolt-lightning" />
                <span>FLASH DEAL • UP TO 45% OFF</span>
              </span>
              <div className="banner-timer-chip">
                <i className="fa-regular fa-clock" />
                <span>{time1.hours}:{time1.minutes}:{time1.seconds}</span>
              </div>
              <div className="banner-date-chip">
                <i className="fa-regular fa-calendar-days" />
                <span className="date-label">Start:</span>
                <span className="date-val">{startDate1}</span>
                <span className="date-divider">•</span>
                <span className="date-label">End:</span>
                <span className="date-val">{endDate1}</span>
              </div>
            </div>

            {/* Headline */}
            <h2 className="banner-title">
              {sale1?.heading ? sale1.heading : <>Refresh<br />Your Space</>}
            </h2>

            {/* Subtitle */}
            <p className="banner-subtitle">
              {sale1?.shortDescription || 'Top consumer gadgets and smart tech at steep flash discounts.'}
            </p>

            {/* Pill CTA Button */}
            <Link to="/shop?category=electronics" className="banner-cta-btn btn-dark-forest">
              <span>{sale1?.buttonName || 'Shop Electronics'}</span>
              <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>

          {/* Right Visual Image */}
          <div className="banner-media">
            <img
              src="/images/flash_banner_operatory.jpg"
              alt="Refresh Your Operatory"
              className="banner-photo"
              loading="lazy"
            />
          </div>
        </div>

        {/* ── Banner 2: Right Card (Soft Pastel Pink / Restorative Aesthetic) ── */}
        <div className="flash-banner-card card-restorative">
          <div className="banner-content">
            {/* Urgency Pill & Schedule */}
            <div className="banner-top-meta">
              <span className="banner-flash-tag tag-pink">
                <i className="fa-solid fa-fire" />
                <span>MEGA DEALS • FLAT 60% OFF</span>
              </span>
              <div className="banner-timer-chip chip-pink">
                <i className="fa-regular fa-clock" />
                <span>{time2.hours}:{time2.minutes}:{time2.seconds}</span>
              </div>
              <div className="banner-date-chip chip-pink">
                <i className="fa-regular fa-calendar-days" />
                <span className="date-label">Start:</span>
                <span className="date-val">{startDate2}</span>
                <span className="date-divider">•</span>
                <span className="date-label">End:</span>
                <span className="date-val">{endDate2}</span>
              </div>
            </div>

            {/* Headline */}
            <h2 className="banner-title title-pink">
              {sale2?.heading ? sale2.heading : <>Glow<br />Naturally</>}
            </h2>

            {/* Subtitle */}
            <p className="banner-subtitle subtitle-pink">
              {sale2?.shortDescription || 'Trending beauty, personal care, and lifestyle essentials.'}
            </p>

            {/* Pill CTA Button */}
            <Link to="/shop?category=beauty" className="banner-cta-btn btn-deep-plum">
              <span>{sale2?.buttonName || 'Shop Beauty'}</span>
              <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>

          {/* Right Visual Image */}
          <div className="banner-media">
            <img
              src="/images/flash_banner_restorative.jpg"
              alt="Glow Naturally Restoratives"
              className="banner-photo"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlashDealsSection;
