/**
 * BuyBright Festive Top Announcement Bar Component.
 * Sits at the absolute top of the public website when an active festival theme is running.
 * Features live countdown, one-click coupon copy, particle ambient canvas, and call-to-action.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFestival } from '../../context/FestivalContext';
import { useToast } from '../../context/ToastContext';
import { FestivalParticleCanvas } from './FestivalParticleCanvas';

export const FestivalTopBanner: React.FC = () => {
  const { activeFestival, isFestivalBannerDismissed, dismissFestivalBanner, setShowFestivalOfferModal } =
    useFestival();
  const { showToast } = useToast();
  const [copied, setCopied] = useState<boolean>(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!activeFestival || !activeFestival.endDate) return;

    const calculateTimeLeft = () => {
      const end = new Date(`${activeFestival.endDate}T23:59:59`).getTime();
      const now = new Date().getTime();
      const difference = end - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [activeFestival]);

  if (!activeFestival || !activeFestival.topAnnouncementBar.enabled || isFestivalBannerDismissed) {
    return null;
  }

  const handleCopyCoupon = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (activeFestival.couponCode) {
      navigator.clipboard.writeText(activeFestival.couponCode);
      setCopied(true);
      showToast(`🎉 Coupon code "${activeFestival.couponCode}" copied to clipboard!`, 'success');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div
      className="festive-top-banner-bar"
      style={{
        background: activeFestival.accentGradient || activeFestival.primaryColor,
        color: activeFestival.textColor || '#ffffff',
      }}
    >
      {/* Ambient Particle Canvas */}
      <FestivalParticleCanvas
        effectType={activeFestival.particleEffect}
        primaryColor={activeFestival.primaryColor}
        secondaryColor={activeFestival.secondaryColor}
      />

      <div className="festive-banner-inner">
        {/* Left Decorative Badge */}
        <div className="festive-left-cluster">
          <span className="festive-icon-left">{activeFestival.leftFestivalIcon || activeFestival.leftDecorativeIcon || '🪔'}</span>
          <span className="festive-badge-chip">{activeFestival.badgeText}</span>
        </div>

        {/* Center Message & Coupon */}
        <div className="festive-center-content">
          <span className="festive-message-txt">{activeFestival.topAnnouncementBar.message}</span>

          {activeFestival.couponCode && (
            <div
              className="festive-coupon-pill"
              onClick={handleCopyCoupon}
              title="Click to copy coupon code"
              role="button"
              tabIndex={0}
            >
              <span className="coupon-prefix">CODE:</span>
              <strong className="coupon-code-txt">{activeFestival.couponCode}</strong>
              <button type="button" className="btn-copy-code" aria-label="Copy Coupon">
                <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`} />
              </button>
            </div>
          )}

          {/* Countdown Clock */}
          {activeFestival.topAnnouncementBar.showCountdown && (
            <div className="festive-countdown-wrap">
              <span className="countdown-label">Ends in:</span>
              <div className="countdown-timer-box">
                <span className="time-unit">{timeLeft.days}d</span>:
                <span className="time-unit">{String(timeLeft.hours).padStart(2, '0')}h</span>:
                <span className="time-unit">{String(timeLeft.minutes).padStart(2, '0')}m</span>:
                <span className="time-unit">{String(timeLeft.seconds).padStart(2, '0')}s</span>
              </div>
            </div>
          )}
        </div>

        {/* Right CTA Button & Close */}
        <div className="festive-right-cluster">
          {activeFestival.topAnnouncementBar.buttonText && (
            <Link
              to={activeFestival.topAnnouncementBar.buttonLink || '/shop'}
              className="btn-festive-cta"
            >
              <span>{activeFestival.topAnnouncementBar.buttonText}</span>
              <i className="fa-solid fa-arrow-right" />
            </Link>
          )}

          <button
            type="button"
            className="btn-festive-info"
            onClick={() => setShowFestivalOfferModal(true)}
            title="View Festival Offer Details"
          >
            <i className="fa-solid fa-gift" />
          </button>

          <button
            type="button"
            className="btn-festive-dismiss"
            onClick={dismissFestivalBanner}
            title="Dismiss festive bar"
            aria-label="Dismiss festive announcement"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FestivalTopBanner;
