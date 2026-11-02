/**
 * BuyBright Promotional Banners Grid Component (Second Advertisement - Limit 3).
 * Features:
 * - Up to 3 responsive promotional banners with custom target links
 * - Hover "SHOP NOW" overlay with smooth elevation
 */

import React from 'react';
import { Link } from 'react-router-dom';

interface PromoBannerItem {
  image: string;
  alt: string;
  title: string;
  link?: string;
  order?: number;
}

interface PromoBannersProps {
  id?: string;
  banners?: PromoBannerItem[];
}

export const PromoBanners: React.FC<PromoBannersProps> = ({ id = 'promo-banners', banners }) => {
  const defaultBanners: PromoBannerItem[] = [
    {
      image: '/images/show.webp',
      alt: 'BuyBright Dental Equipment Showcase',
      title: 'Shop Dental Equipment & Diagnostic Tools',
      link: '/shop?category=equipment',
      order: 1,
    },
    {
      image: 'https://r2dkmedia.dentalkart.com/backend-media-uploads/HomepageImages/crown%20dt%20(1).jpg',
      alt: 'Crown & Bridge Restorative Materials',
      title: 'Shop Restorative & Crown Preparations',
      link: '/shop?category=materials',
      order: 2,
    },
    {
      image: '/images/banner1.webp',
      alt: 'Endodontic Rotary NiTi Files Assortment',
      title: 'Shop Endodontic Supplies & Gold Files',
      link: '/shop?category=endodontics',
      order: 3,
    },
  ];

  const activeBanners = (banners && banners.length > 0 ? banners : defaultBanners).slice(0, 3);

  return (
    <section className="section dual-promo-banner-section" id={id}>
      <div
        className="dual-promo-container"
        style={activeBanners.length === 3 ? { gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' } : undefined}
      >
        {activeBanners.map((b, idx) => (
          <Link
            key={idx}
            to={b.link || '/shop'}
            className="dual-promo-card"
            title={b.title}
          >
            <img
              src={b.image}
              alt={b.alt || b.title}
              loading="lazy"
            />
            <div className="dual-promo-hover-overlay">
              <span className="btn-hover-shop">
                <span>SHOP NOW</span>
                <i className="fa-solid fa-arrow-right" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

