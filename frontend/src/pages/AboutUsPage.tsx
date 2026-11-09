/**
 * BuyBright Dedicated About Us Page View.
 * Clear Hierarchical Structure:
 * 1. About BuyBright (Platform & Trust Overview)
 *       ↓
 * 2. Who We Are (Founders' Story, Clinician Background & Core Identity)
 *       ↓
 * 3. Our Mission & Vision (Interactive Futuristic Glassmorphism Cards & Values)
 *       ↓
 * 4. Our Journey (Interactive Milestones & Growth Timeline)
 *       ↓
 * 5. Direct Authorized Brand Alliances & 4 Trust Pillars
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/common/SEO';
import { getAboutData } from '../admin/data/aboutData';

export const AboutUsPage: React.FC = () => {
  const [aboutData] = useState(() => getAboutData());
  const { hero, whoWeAre, missionVision, journey, pillars } = aboutData;

  // Scroll to top on page mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = "About Us | BuyBright - India's Smart Multi-Seller Marketplace";
  }, []);

  return (
    <div className="about-us-page-wrapper">
      <SEO
        title="About Us — India's Smart Multi-Seller Marketplace"
        description="Learn about BuyBright, India's premier multi-seller marketplace empowering independent merchants and modern shoppers with fast fulfillment and genuine products."
        canonicalUrl="https://buybright.com/about"
        keywords="about buybright, multi seller marketplace india, authorized distributor, ecommerce platform"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About BuyBright",
          "url": "https://buybright.com/about",
          "description":
            "BuyBright is India's leading multi-seller marketplace providing genuine products and seamless shopping experiences.",
        }}
      />

      {/* =========================================================================
          STEP 1: ABOUT BUYBRIGHT (HERO OVERVIEW & LIVE METRICS)
          ========================================================================= */}
      <section className="about-hero-section" id="about-overview">
        <div className="about-hero-container">
          <div className="about-hero-badge">
            <i className="fa-solid fa-store" />
            <span>{hero.badgeText}</span>
          </div>

          <h1 className="about-hero-title">
            {hero.highlightText && hero.title.includes(hero.highlightText) ? (
              <>
                {hero.title.split(hero.highlightText)[0]}
                <span className="highlight-gradient">{hero.highlightText}</span>
                {hero.title.split(hero.highlightText)[1]}
              </>
            ) : (
              hero.title
            )}
          </h1>

          <p className="about-hero-lead">{hero.leadText}</p>

          <div className="about-hero-actions">
            {hero.primaryBtnText && (
              <Link to={hero.primaryBtnUrl || '/shop'} className="btn-about-primary">
                <i className="fa-solid fa-store" />
                <span>{hero.primaryBtnText}</span>
              </Link>
            )}
            {hero.secondaryBtnText && (
              <a href={hero.secondaryBtnUrl || '#who-we-are'} className="btn-about-secondary">
                <i className="fa-solid fa-arrow-down" />
                <span>{hero.secondaryBtnText}</span>
              </a>
            )}
          </div>
        </div>

        {/* Floating Animated Geometric Orbs */}
        <div className="hero-floating-circle circle-1" />
        <div className="hero-floating-circle circle-2" />
      </section>

      {/* Trust Metrics Bar */}
      <section className="about-metrics-section">
        <div className="metrics-grid">
          {hero.metrics.map((metric) => (
            <div key={metric.id} className="metric-card">
              <div
                className="metric-icon-wrap"
                style={{
                  background: `${metric.accentColor || '#008080'}18`,
                  color: metric.accentColor || '#008080',
                }}
              >
                <i className={metric.icon} />
              </div>
              <div className="metric-number">{metric.number}</div>
              <div className="metric-label">{metric.label}</div>
              <p className="metric-desc">{metric.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          STEP 2: WHO WE ARE (PRACTITIONER HERITAGE & DENTAL EXPERTISE)
          ========================================================================= */}
      <section className="about-who-we-are-section" id="who-we-are">
        <div className="who-container">
          <div className="who-image-col">
            <div className="who-main-image-wrap">
              <img
                src={whoWeAre.mainImage}
                alt="BuyBright Quality Verification"
                loading="lazy"
                className="who-main-img"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=900&auto=format&fit=crop';
                }}
              />
              <div className="who-experience-badge">
                <span className="exp-num">{whoWeAre.experienceBadgeNum}</span>
                <span className="exp-text">{whoWeAre.experienceBadgeText}</span>
              </div>
            </div>

            <div className="who-secondary-image-wrap">
              <img
                src={whoWeAre.secondaryImage}
                alt="BuyBright Marketplace Products"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=900&auto=format&fit=crop';
                }}
              />
            </div>
          </div>

          <div className="who-content-col">
            <div className="section-eyebrow">{whoWeAre.eyebrow}</div>
            <h2 className="who-title">
              {whoWeAre.title.includes('Marketplace') ? (
                <>
                  {whoWeAre.title.split('Marketplace')[0]}
                  <span className="highlight">Marketplace</span>
                  {whoWeAre.title.split('Marketplace')[1]}
                </>
              ) : (
                whoWeAre.title
              )}
            </h2>

            <p className="who-paragraph">{whoWeAre.paragraph1}</p>
            <p className="who-paragraph">{whoWeAre.paragraph2}</p>

            <div className="who-highlights-grid">
              {whoWeAre.highlights.map((item) => (
                <div key={item.id} className="who-highlight-card">
                  <div className="highlight-icon">
                    <i className={item.icon} />
                  </div>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          STEP 3: OUR MISSION & VISION (INTERACTIVE ANIMATED GLASSMORPHISM CARDS)
          ========================================================================= */}
      <section className="about-mission-vision-section" id="mission-vision">
        <div className="mission-vision-container">
          <div className="section-head-centered">
            <div className="section-eyebrow">{missionVision.eyebrow}</div>
            <h2 className="section-title">{missionVision.title}</h2>
            <p className="section-sub">{missionVision.subtitle}</p>
          </div>

          <div className="mission-vision-grid">
            {/* Mission Card */}
            <div className="mv-card mission-card">
              <div className="mv-card-header">
                <div className="mv-icon-bubble mission-icon">
                  <i className="fa-solid fa-bullseye" />
                </div>
                <div className="mv-header-text">
                  <span className="mv-tag">OUR PURPOSE</span>
                  <h3 className="mv-card-title">Our Mission</h3>
                </div>
              </div>

              <p className="mv-statement">{missionVision.missionStatement}</p>

              <div className="mv-points-list">
                {missionVision.missionPoints.map((point, idx) => (
                  <div key={idx} className="mv-point-item">
                    <i className="fa-solid fa-circle-check" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vision Card */}
            <div className="mv-card vision-card">
              <div className="mv-card-header">
                <div className="mv-icon-bubble vision-icon">
                  <i className="fa-solid fa-eye" />
                </div>
                <div className="mv-header-text">
                  <span className="mv-tag">FUTURE OUTLOOK</span>
                  <h3 className="mv-card-title">Our Vision</h3>
                </div>
              </div>

              <p className="mv-statement">{missionVision.visionStatement}</p>

              <div className="mv-points-list">
                {missionVision.visionPoints.map((point, idx) => (
                  <div key={idx} className="mv-point-item">
                    <i className="fa-solid fa-circle-check" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          STEP 4: OUR JOURNEY (ANIMATED TIMELINE & MILESTONES)
          ========================================================================= */}
      <section className="about-journey-section" id="our-journey">
        <div className="journey-container">
          <div className="section-head-centered">
            <div className="section-eyebrow">{journey.eyebrow}</div>
            <h2 className="section-title">{journey.title}</h2>
            <p className="section-sub">{journey.subtitle}</p>
          </div>

          <div className="journey-timeline-grid">
            {journey.milestones.map((item, index) => (
              <div key={item.id || item.year} className={`journey-timeline-card item-${index + 1}`}>
                <div className="journey-card-top">
                  <div
                    className="journey-icon-circle"
                    style={{ background: `${item.accentColor}18`, color: item.accentColor }}
                  >
                    <i className={item.icon} />
                  </div>
                  <span className="journey-year-badge">{item.year}</span>
                </div>

                <div className="journey-card-body">
                  <span className="journey-tag" style={{ color: item.accentColor }}>
                    {item.tag}
                  </span>
                  <h3 className="journey-title">{item.title}</h3>
                  <p className="journey-description">{item.description}</p>
                </div>

                <div className="journey-card-glow" style={{ background: item.accentColor }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          STEP 5: WHY DENTISTS CHOOSE PRESTODENTAL (ADVANTAGES & PILLARS)
          ========================================================================= */}
      <section className="about-pillars-section">
        <div className="pillars-header">
          <div className="section-eyebrow">{pillars.eyebrow}</div>
          <h2 className="section-title">{pillars.title}</h2>
          <p className="section-sub">{pillars.subtitle}</p>
        </div>

        <div className="pillars-grid">
          {pillars.pillars.map((pillar) => (
            <div key={pillar.id} className="pillar-card">
              <div
                className="pillar-card-icon"
                style={{
                  background: `${pillar.themeColor || '#008080'}18`,
                  color: pillar.themeColor || '#008080',
                }}
              >
                <i className={pillar.icon} />
              </div>
              <h3 className="pillar-card-title">{pillar.title}</h3>
              <p className="pillar-card-desc">{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Storefront Action Callout Banner */}
      <section className="about-cta-banner-section">
        <div className="about-cta-container">
          <div className="about-cta-content">
            <div className="cta-icon-pill">
              <i className="fa-solid fa-sparkles" />
              <span>{pillars.ctaTag || 'EXPERIENCE THE BUYBRIGHT ADVANTAGE'}</span>
            </div>
            <h2 className="about-cta-title">{pillars.ctaTitle}</h2>
            <p className="about-cta-sub">{pillars.ctaSubtitle}</p>
            <div className="about-cta-btn-row">
              {pillars.ctaBtnText && (
                <Link to={pillars.ctaBtnUrl || '/shop'} className="btn-cta-explore">
                  <i className="fa-solid fa-cart-shopping" />
                  <span>{pillars.ctaBtnText}</span>
                </Link>
              )}
              {pillars.ctaPhone && (
                <a href={`tel:${pillars.ctaPhone.replace(/\s+/g, '')}`} className="btn-cta-call">
                  <i className="fa-solid fa-phone" />
                  <span>Call Helpdesk: {pillars.ctaPhone}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
