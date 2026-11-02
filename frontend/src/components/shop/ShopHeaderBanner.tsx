/**
 * BuyBright Shop Header Banner Component.
 * Features:
 * - Interactive breadcrumbs (Home > Dental Shop)
 * - Modern gradient header with e-commerce trust badges
 */

import React from 'react';
import { Link } from 'react-router-dom';

interface ShopHeaderBannerProps {
  totalProductsCount: number;
  badgeText?: string;
  badgeIcon?: string;
  title?: string;
  highlightText?: string;
  description?: string;
  breadcrumbLabel?: string;
  metrics?: Array<{
    icon: string;
    iconColorClass?: string;
    title: string;
    subtitle: string;
  }>;
}

export const ShopHeaderBanner: React.FC<ShopHeaderBannerProps> = ({
  totalProductsCount,
  badgeText = '100% FACTORY DIRECT • AUTHORIZED DENTAL DISTRIBUTOR',
  badgeIcon = 'fa-solid fa-shield-halved',
  title = 'Premium Dental ',
  highlightText = 'Supplies & Equipment',
  description,
  breadcrumbLabel = 'Dental Shop',
  metrics,
}) => {
  const defaultMetrics = [
    {
      icon: 'fa-solid fa-truck-fast',
      iconColorClass: 'text-teal',
      title: '24-48h Dispatch',
      subtitle: 'Pan-India Transit',
    },
    {
      icon: 'fa-solid fa-file-invoice-dollar',
      iconColorClass: 'text-coral',
      title: 'GST Invoiced',
      subtitle: 'Input Tax Credit',
    },
  ];

  const activeMetrics = metrics && metrics.length > 0 ? metrics : defaultMetrics;
  const activeDescription =
    description ||
    `Explore ${totalProductsCount}+ dentist-approved consumables, instruments, bioceramics, and digital devices with cold-chain shipping and direct brand warranties.`;

  return (
    <div className="shop-header-banner">
      <div className="shop-banner-container">
        {/* Breadcrumb Navigation */}
        <nav className="shop-breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="breadcrumb-link">
            <i className="fa-solid fa-house" />
            <span>Home</span>
          </Link>
          <i className="fa-solid fa-chevron-right breadcrumb-separator" />
          <span className="breadcrumb-current">{breadcrumbLabel}</span>
        </nav>

        {/* Main Banner Content */}
        <div className="shop-banner-main">
          <div className="shop-banner-text">
            <div className="shop-badge-pill">
              <i className={badgeIcon} />
              <span>{badgeText}</span>
            </div>
            <h1 className="shop-banner-title">
              {title}
              {highlightText && <span className="highlight-gradient">{highlightText}</span>}
            </h1>
            <p className="shop-banner-desc">{activeDescription}</p>
          </div>

          <div className="shop-banner-metrics">
            {activeMetrics.map((m, idx) => (
              <div key={idx} className="banner-metric-pill">
                <i className={`${m.icon} ${m.iconColorClass || 'text-teal'}`} />
                <div>
                  <strong>{m.title}</strong>
                  <span>{m.subtitle}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


