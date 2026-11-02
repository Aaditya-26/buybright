/**
 * BuyBright Showcase Card Component.
 * Features:
 * - High-definition image banner with overlay gradient
 * - Category/Audience pill with brand icon
 * - Informative title and detailed product description
 * - Key differentiator stat chips
 * - Interactive action CTA button
 */

import React from 'react';
import type { ShowcaseItem } from '../../types';

interface ShowcaseCardProps {
  item: ShowcaseItem;
  className?: string;
}

export const ShowcaseCard: React.FC<ShowcaseCardProps> = ({ item, className = '' }) => {
  const handleCtaClick = (e: React.MouseEvent) => {
    if (item.ctaLink?.startsWith('#')) {
      e.preventDefault();
      const targetId = item.ctaLink.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className={`showcase-card ${className}`}>
      {/* Media & Overlay Layer */}
      <div className="showcase-card-media">
        <img src={item.image} alt={item.title} loading="lazy" />
        <div className="showcase-card-gradient" />

        {/* Floating Top Tag Pill */}
        <div className="showcase-tag-pill">
          {item.badgeIcon && <i className={item.badgeIcon} />}
          <span>{item.tag}</span>
        </div>
      </div>

      {/* Card Body Content */}
      <div className="showcase-content">
        <h3 className="showcase-title">{item.title}</h3>
        <p className="showcase-desc">{item.description}</p>

        {/* Highlight Stats Chips */}
        {item.stats && item.stats.length > 0 && (
          <div className="showcase-stats-row">
            {item.stats.map((st, idx) => (
              <div key={idx} className="showcase-stat-chip">
                <span className="stat-value">{st.value}</span>
                <span className="stat-label">{st.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* CTA Link Action */}
        <a
          href={item.ctaLink || '#products'}
          className="showcase-cta-btn"
          onClick={handleCtaClick}
        >
          <span>{item.ctaText || 'Learn More'}</span>
          <i className="fa-solid fa-arrow-right" />
        </a>
      </div>
    </div>
  );
};
