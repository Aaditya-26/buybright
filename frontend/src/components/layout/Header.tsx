/**
 * BuyBright Header & Navigation Component with Searchable Interactive Mega-Menu.
 * Implements:
 * 1. Top Announcement Bar (  Secure Payments)
 * 2. Main Header with Brand Logo, Searchable "All Categories" Mega-Menu, Search Bar, Need Help?, Account & Cart
 * 3. Sub-Navigation Menu (Home, Shop, Brands, Offers, New Arrivals, Best Sellers, Contact Us)
 * 4. Responsive Mobile Drawer Navigation
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { useAuth } from '../../context/AuthContext';
import { DeliveryLocationModal } from '../common/DeliveryLocationModal';
import { DiwaliDiyaIcon } from '../home/HeroSlider';
import { getPlatformSettings, PlatformSettings } from '../../admin/data/settingsData';

interface HeaderProps {
  onSearchSubmit?: (query: string) => void;
}

interface CategoryMegaData {
  id: string;
  name: string;
  slug: string;
  icon: string;
  itemCount: string;
  image: string;
  description: string;
  subcategories: {
    groupTitle: string;
    items: { name: string; isHot?: boolean }[];
  }[];
  featuredProduct: {
    name: string;
    price: string;
    oldPrice?: string;
    image: string;
    tag: string;
  };
}

const CATEGORIES_DATA: CategoryMegaData[] = [
  {
    id: 'electronics',
    name: 'Electronics & Gadgets',
    slug: 'electronics',
    icon: 'fa-solid fa-laptop',
    itemCount: '1,250+ Products',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=80',
    description: 'High-performance laptops, smartphones, noise-cancelling audio, smart wearables, and gaming tech.',
    subcategories: [
      {
        groupTitle: 'Computers & Mobiles',
        items: [
          { name: 'Ultra-Thin Laptops & MacBooks', isHot: true },
          { name: '5G Android & iOS Smartphones' },
          { name: 'Tablets & Graphic Pads' },
          { name: 'Mechanical Keyboards & Gaming Mice' },
        ],
      },
      {
        groupTitle: 'Audio & Smart Wearables',
        items: [
          { name: 'Active Noise Cancelling Headphones', isHot: true },
          { name: 'True Wireless Stereo Earbuds' },
          { name: 'Fitness Smartwatches & AMOLED Bands' },
          { name: 'Bluetooth Party Speakers' },
        ],
      },
    ],
    featuredProduct: {
      name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
      price: '₹26,990',
      oldPrice: '₹34,990',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      tag: 'Bestseller',
    },
  },
  {
    id: 'fashion',
    name: 'Fashion & Apparel',
    slug: 'fashion',
    icon: 'fa-solid fa-shirt',
    itemCount: '3,400+ Products',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80',
    description: 'Trending ethnic and western wear, sneakers, premium watches, sunglasses, and leather accessories.',
    subcategories: [
      {
        groupTitle: "Men's & Women's Clothing",
        items: [
          { name: 'Premium Cotton Casual Shirts', isHot: true },
          { name: 'Designer Kurtis & Ethnic Sets' },
          { name: 'Denim Jeans & Slim Trousers' },
          { name: 'Athleisure Hoodies & Sweatshirts' },
        ],
      },
      {
        groupTitle: 'Footwear & Accessories',
        items: [
          { name: 'Performance Running Sneakers', isHot: true },
          { name: 'Luxury Chronograph Watches' },
          { name: 'Polarized UV Sunglasses' },
          { name: 'Genuine Leather Wallets & Belts' },
        ],
      },
    ],
    featuredProduct: {
      name: 'Nike Air Max Men Lightweight Running Sneakers',
      price: '₹7,495',
      oldPrice: '₹9,995',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      tag: 'Trending Deal',
    },
  },
  {
    id: 'home-kitchen',
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    icon: 'fa-solid fa-kitchen-set',
    itemCount: '2,100+ Products',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
    description: 'Modern cookware, smart kitchen appliances, ergonomic home decor, organizers, and bed linen.',
    subcategories: [
      {
        groupTitle: 'Kitchen Appliances',
        items: [
          { name: 'Digital Touch Air Fryer 5.5L', isHot: true },
          { name: 'High-Torque Mixer Grinder 750W' },
          { name: 'Automatic Espresso Coffee Maker' },
          { name: 'Induction Cooktops & Non-Stick Sets' },
        ],
      },
      {
        groupTitle: 'Home Decor & Furnishing',
        items: [
          { name: 'Minimalist Ceramic Vase Collections', isHot: true },
          { name: '100% Pure Egyptian Cotton Bed Sheets' },
          { name: 'Warm LED Floor Lamps' },
          { name: 'Aroma Diffusers & Scented Candles' },
        ],
      },
    ],
    featuredProduct: {
      name: 'DeLonghi Dedica Deluxe Espresso Machine with Milk Frother',
      price: '₹18,499',
      oldPrice: '₹24,999',
      image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80',
      tag: 'Top Rated',
    },
  },
  {
    id: 'beauty',
    name: 'Beauty & Personal Care',
    slug: 'beauty',
    icon: 'fa-solid fa-wand-magic-sparkles',
    itemCount: '1,580+ Products',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80',
    description: 'Dermatologist-tested skincare serums, luxury perfumes, haircare routines, and grooming tools.',
    subcategories: [
      {
        groupTitle: 'Skincare & Haircare',
        items: [
          { name: 'Vitamin C & Hyaluronic Acid Face Serum', isHot: true },
          { name: 'Broad Spectrum SPF 50 Gel Sunscreen' },
          { name: 'Argan Oil Repair Hair Mask' },
          { name: 'Deep Cleansing Foaming Face Wash' },
        ],
      },
      {
        groupTitle: 'Fragrances & Grooming',
        items: [
          { name: 'Luxury Eau De Parfum French Fragrances', isHot: true },
          { name: 'Cordless Beard Trimmer & Grooming Kit' },
          { name: 'Sonic Facial Cleansing Brush' },
        ],
      },
    ],
    featuredProduct: {
      name: 'Forest Essentials Soundarya Radiance Facial Serum with 24K Gold',
      price: '₹4,250',
      oldPrice: '₹5,100',
      image: 'https://images.unsplash.com/photo-1608248597359-009139265f2a?w=600&auto=format&fit=crop&q=80',
      tag: 'Luxury Pick',
    },
  },
  {
    id: 'sports',
    name: 'Sports & Fitness',
    slug: 'sports',
    icon: 'fa-solid fa-dumbbell',
    itemCount: '890+ Products',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    description: 'Gym equipment, adjustable dumbells, yoga mats, cycling gear, protein shakers, and outdoor wear.',
    subcategories: [
      {
        groupTitle: 'Home Gym & Workouts',
        items: [
          { name: 'Adjustable Rubber Hex Dumbbell Set', isHot: true },
          { name: 'Extra Thick Eco Yoga Mat 8mm' },
          { name: 'Heavy Duty Pull-Up Door Bar' },
          { name: 'Resistance Exercise Bands Loop Kit' },
        ],
      },
      {
        groupTitle: 'Sports & Outdoor Activities',
        items: [
          { name: 'Pro Carbon Badminton Rackets', isHot: true },
          { name: 'Insulated Stainless Steel Gym Flask 1L' },
          { name: 'Trail Hiking Backpack 45L' },
        ],
      },
    ],
    featuredProduct: {
      name: 'Bowflex SelectTech 552 Adjustable Dumbbells Pair',
      price: '₹14,990',
      oldPrice: '₹19,990',
      image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80',
      tag: 'Best for Gym',
    },
  },
  {
    id: 'books',
    name: 'Books & Stationery',
    slug: 'books',
    icon: 'fa-solid fa-book-open',
    itemCount: '1,450+ Products',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
    description: 'International bestsellers, software development & business books, fine fountain pens, and art supplies.',
    subcategories: [
      {
        groupTitle: 'Books & Learning',
        items: [
          { name: 'Bestselling Fiction & Thriller Novels', isHot: true },
          { name: 'System Design & Computer Science Textbooks' },
          { name: 'Financial Freedom & Startup Guides' },
          { name: 'UPSC & Competitive Exam Guides' },
        ],
      },
      {
        groupTitle: 'Premium Stationery',
        items: [
          { name: 'Hardbound Dotted Bullet Journal (160 GSM)', isHot: true },
          { name: 'German Fine Nib Calligraphy Fountain Pen' },
          { name: 'Artist Quality Watercolor Paint Tube Set' },
        ],
      },
    ],
    featuredProduct: {
      name: 'Atomic Habits by James Clear (Hardcover Collector Edition)',
      price: '₹599',
      oldPrice: '₹899',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      tag: 'All-Time Bestseller',
    },
  },
];

export const Header: React.FC<HeaderProps> = ({ onSearchSubmit }) => {
  const { cartCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { compareCount } = useCompare();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [megaSearchQuery, setMegaSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState(() => {
    return localStorage.getItem('buybright_location') || localStorage.getItem('prestodental_location') || 'Select Location';
  });

  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(() => getPlatformSettings());

  useEffect(() => {
    const handleSettingsUpdate = () => {
      setPlatformSettings(getPlatformSettings());
    };
    window.addEventListener('buybright_settings_updated', handleSettingsUpdate);
    window.addEventListener('prestodental_settings_updated', handleSettingsUpdate);
    return () => {
      window.removeEventListener('buybright_settings_updated', handleSettingsUpdate);
      window.removeEventListener('prestodental_settings_updated', handleSettingsUpdate);
    };
  }, []);

  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const hamburgerBtnRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close category dropdown & mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(target)
      ) {
        setIsCategoryOpen(false);
        setMegaSearchQuery('');
      }

      if (
        isMobileMenuOpen &&
        mobileNavRef.current &&
        !mobileNavRef.current.contains(target) &&
        hamburgerBtnRef.current &&
        !hamburgerBtnRef.current.contains(target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);


  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearchSubmit) {
        onSearchSubmit(searchQuery.trim());
      }
      const prodSec = document.getElementById('products');
      if (prodSec) {
        prodSec.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleNavClick = (anchorId?: string) => {
    setIsMobileMenuOpen(false);
    setIsCategoryOpen(false);
    setMegaSearchQuery('');
    if (anchorId) {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(anchorId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.getElementById(anchorId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSelectCategory = (slug: string) => {
    setIsCategoryOpen(false);
    setIsMobileMenuOpen(false);
    setMegaSearchQuery('');
    navigate(`/shop?category=${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeCategory = CATEGORIES_DATA[activeCategoryIndex] || CATEGORIES_DATA[0];

  // Search filtering logic for mega-menu
  const searchResults = useMemo(() => {
    const q = megaSearchQuery.trim().toLowerCase();
    if (!q) return null;

    const results: {
      categoryName: string;
      categorySlug: string;
      matchedItems: { name: string; groupTitle: string }[];
    }[] = [];

    CATEGORIES_DATA.forEach((cat) => {
      const catMatches = cat.name.toLowerCase().includes(q);
      const matchedItems: { name: string; groupTitle: string }[] = [];

      cat.subcategories.forEach((sub) => {
        sub.items.forEach((item) => {
          if (item.name.toLowerCase().includes(q) || sub.groupTitle.toLowerCase().includes(q) || catMatches) {
            matchedItems.push({ name: item.name, groupTitle: sub.groupTitle });
          }
        });
      });

      if (catMatches || matchedItems.length > 0) {
        results.push({
          categoryName: cat.name,
          categorySlug: cat.slug,
          matchedItems: matchedItems.slice(0, 6),
        });
      }
    });

    return results;
  }, [megaSearchQuery]);

  return (
    <header className="pd-header-root">
      {/* 1. Top Announcement Bar with Dynamic Admin Settings */}
      {platformSettings.website.topbarEnabled && (
        <div className="pd-top-announcement-bar pd-festive-topbar">
          {/* Animated Hanging Fairy Lights */}
          <div className="lights" aria-hidden="true">
            <i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
            <i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
            <i /><i /><i /><i /><i />
          </div>

          <div className="pd-top-bar-inner">
            <div className="top-bar-left-announcements">
              {/* First Text with Icon */}
              <div className="announcement-item festive-diwali-badge">
                {platformSettings.website.firstText.toLowerCase().includes('diwali') ? (
                  <DiwaliDiyaIcon width={22} height={22} idSuffix="topbar-diya" className="topbar-diya-icon" />
                ) : (
                  <i className={platformSettings.website.firstIcon || 'fa-solid fa-fire'} style={{ marginRight: '6px' }} />
                )}
                <span className="festive-title">
                  {platformSettings.website.firstText}
                </span>
              </div>

              <span className="announcement-divider">|</span>

              {/* Second Text with Icon */}
              <div className="announcement-item d-none d-lg-inline-flex">
                <i className={platformSettings.website.secondIcon || 'fa-solid fa-shield-halved'} style={{ marginRight: '6px' }} />
                <span>{platformSettings.website.secondText}</span>
              </div>
            </div>

            {/* Right Side: Play Store & App Store Badges */}
            {platformSettings.website.showAppBadges && (
              <div className="pd-header-app-badges">
                <span className="app-badge-label">
                  <i className="fa-solid fa-mobile-screen" />
                  <span>Download App:</span>
                </span>
                <a
                  href={platformSettings.website.playStoreUrl || 'https://play.google.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="header-store-badge playstore"
                  title="Download Android App on Google Play Store"
                >
                  <i className="fa-brands fa-google-play" />
                  <span>Play Store</span>
                </a>
                <a
                  href={platformSettings.website.appStoreUrl || 'https://apple.com/app-store'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="header-store-badge appstore"
                  title="Download iOS App on Apple App Store"
                >
                  <i className="fa-brands fa-apple" />
                  <span>App Store</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Main Header */}
      <div className="pd-main-header">
        <div className="pd-main-header-container">
          {/* Official Brand Logo */}
          <Link to="/" className="pd-brand-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img
              src="/images/logo.svg"
              alt="BuyBright Logo"
              className="pd-header-brand-image"
            />
          </Link>

          {/* All Categories Interactive Searchable Mega-Menu Dropdown */}
          <div className="pd-categories-dropdown-wrapper" ref={categoryDropdownRef}>
            <button
              type="button"
              className={`btn-all-categories ${isCategoryOpen ? 'open' : ''}`}
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              aria-expanded={isCategoryOpen}
              aria-label="Toggle all categories menu"
            >
              <i className="fa-solid fa-bars" />
              <span>All Categories</span>
              <i className="fa-solid fa-chevron-down arrow-icon" />
            </button>

            {/* Modern Interactive Mega Menu with Search Filter */}
            {isCategoryOpen && (
              <div className="pd-categories-mega-menu">
                {/* Mega Menu Top Quick Search Filter Bar */}
                <div className="mega-menu-top-search-bar">
                  <div className="mega-search-input-wrap">
                    <i className="fa-solid fa-magnifying-glass search-icon" />
                    <input
                      type="text"
                      placeholder="Filter categories, products or brands..."
                      value={megaSearchQuery}
                      onChange={(e) => setMegaSearchQuery(e.target.value)}
                      autoFocus
                    />
                    {megaSearchQuery && (
                      <button
                        type="button"
                        className="btn-clear-mega-search"
                        onClick={() => setMegaSearchQuery('')}
                        aria-label="Clear search"
                      >
                        <i className="fa-solid fa-xmark" />
                      </button>
                    )}
                  </div>
                  {megaSearchQuery && (
                    <span className="search-results-count">
                      {searchResults?.reduce((acc, c) => acc + c.matchedItems.length, 0) || 0} matches found
                    </span>
                  )}
                </div>

                {/* Body: Search Results OR 3-Column Interactive Browse View */}
                {searchResults ? (
                  <div className="mega-search-results-panel">
                    {searchResults.length > 0 ? (
                      <div className="mega-results-grid">
                        {searchResults.map((catResult, rIdx) => (
                          <div key={rIdx} className="mega-result-cat-block">
                            <div className="result-cat-header">
                              <span className="result-cat-name">{catResult.categoryName}</span>
                              <button
                                type="button"
                                className="btn-result-view-all"
                                onClick={() => handleSelectCategory(catResult.categorySlug)}
                              >
                                View Category &rarr;
                              </button>
                            </div>
                            <div className="result-items-flex">
                              {catResult.matchedItems.map((mItem, mIdx) => (
                                <button
                                  key={mIdx}
                                  type="button"
                                  className="result-item-pill"
                                  onClick={() => handleSelectCategory(catResult.categorySlug)}
                                >
                                  <span className="item-name">{mItem.name}</span>
                                  <span className="item-group">{mItem.groupTitle}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mega-no-results">
                        <i className="fa-solid fa-face-meh" />
                        <p>No categories or subcategories found matching "{megaSearchQuery}"</p>
                        <button
                          type="button"
                          className="btn-reset-search"
                          onClick={() => setMegaSearchQuery('')}
                        >
                          Clear filter &amp; view all
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mega-menu-content-grid">
                    {/* Column 1: Left Categories List (Hover switches active item) */}
                    <div className="mega-menu-categories-col">
                      <div className="mega-col-header">
                        <span>Browse Specialties</span>
                      </div>
                      <div className="mega-categories-list">
                        {CATEGORIES_DATA.map((cat, idx) => (
                          <div
                            key={cat.id}
                            className={`mega-category-item ${idx === activeCategoryIndex ? 'active' : ''}`}
                            onMouseEnter={() => setActiveCategoryIndex(idx)}
                            onClick={() => handleSelectCategory(cat.slug)}
                            role="button"
                            tabIndex={0}
                          >
                            <div className="mega-cat-icon">
                              <i className={cat.icon} />
                            </div>
                            <div className="mega-cat-info">
                              <span className="mega-cat-title">{cat.name}</span>
                              <span className="mega-cat-count">{cat.itemCount}</span>
                            </div>
                            <i className="fa-solid fa-chevron-right mega-arrow" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Column 2: Center Sub-Categories & Product Names (Dynamically changes on hover) */}
                    <div className="mega-menu-products-col">
                      <div className="mega-products-header">
                        <div>
                          <h3 className="active-cat-name">{activeCategory.name}</h3>
                          <p className="active-cat-desc">{activeCategory.description}</p>
                        </div>
                        <button
                          type="button"
                          className="btn-view-full-cat"
                          onClick={() => handleSelectCategory(activeCategory.slug)}
                        >
                          <span>View All in {activeCategory.name.split(' ')[0]}</span>
                          <i className="fa-solid fa-arrow-right" />
                        </button>
                      </div>

                      <div className="mega-subcategories-grid">
                        {activeCategory.subcategories.map((group, gIdx) => (
                          <div key={gIdx} className="mega-subgroup">
                            <h4 className="subgroup-title">{group.groupTitle}</h4>
                            <ul className="subgroup-items-list">
                              {group.items.map((item, iIdx) => (
                                <li key={iIdx}>
                                  <button
                                    type="button"
                                    className="subgroup-item-btn"
                                    onClick={() => handleSelectCategory(activeCategory.slug)}
                                  >
                                    <span>{item.name}</span>
                                    {item.isHot && <span className="hot-tag">Hot</span>}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Column 3: Right Featured Highlight Showcase */}
                    <div className="mega-menu-featured-col">
                      <div className="mega-featured-card">
                        <span className="featured-pill-badge">{activeCategory.featuredProduct.tag}</span>
                        <div className="featured-img-wrap">
                          <img
                            src={activeCategory.featuredProduct.image}
                            alt={activeCategory.featuredProduct.name}
                            loading="lazy"
                          />
                        </div>
                        <div className="featured-card-body">
                          <h4 className="featured-card-title">{activeCategory.featuredProduct.name}</h4>
                          <div className="featured-card-price">
                            <span className="cur-price">{activeCategory.featuredProduct.price}</span>
                            {activeCategory.featuredProduct.oldPrice && (
                              <span className="old-price">{activeCategory.featuredProduct.oldPrice}</span>
                            )}
                          </div>
                          <button
                            type="button"
                            className="btn-featured-explore"
                            onClick={() => handleSelectCategory(activeCategory.slug)}
                          >
                            <span>Explore Product</span>
                            <i className="fa-solid fa-arrow-right" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Center Search Bar */}
          <form className="pd-search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search products, brands and deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search products"
            />
            <button type="submit" className="btn-search-submit" aria-label="Search">
              <i className="fa-solid fa-magnifying-glass" />
            </button>
          </form>

          {/* Right Actions */}
          <div className="pd-header-right-actions">
            {/* Delivery Location Selector (Desktop & Tablet) */}
            <button
              type="button"
              className="pd-action-box delivery-location-box"
              onClick={() => setIsLocationModalOpen(true)}
              title="Select Delivery Location"
              aria-label="Select Delivery Location"
            >
              <div className="action-icon-circle location-circle">
                <i className="fa-solid fa-location-dot" />
              </div>
              <div className="action-text-col">
                <span className="action-label">Deliver to</span>
                <span className="action-val location-val">
                  {deliveryLocation} <i className="fa-solid fa-angle-down" />
                </span>
              </div>
            </button>

            {/* Mobile Compact Delivery Location Pill */}
            <button
              type="button"
              className="pd-mobile-location-pill"
              onClick={() => setIsLocationModalOpen(true)}
              title={`Deliver to: ${deliveryLocation}`}
              aria-label="Select Delivery Location"
            >
              <i className="fa-solid fa-location-dot" />
              <span className="mobile-loc-text">{deliveryLocation}</span>
            </button>

            {/* Need Help Support (Desktop) */}
            <a href="tel:+918806488054" className="pd-action-box support-box" title="Call Customer Support">
              <div className="action-icon-circle">
                <i className="fa-solid fa-phone" />
              </div>
              <div className="action-text-col">
                <span className="action-label">Need Help?</span>
                <span className="action-val">+91 88064 88054</span>
              </div>
            </a>

            {/* Login / Register / Account (Desktop) */}
            {isAuthenticated && user ? (
              <Link to="/profile" className="pd-action-box account-box" title={`Signed in as ${user.name}`}>
                <div className="action-icon-circle" style={{ background: '#ecfeff', color: 'var(--color-cyan-teal)' }}>
                  <i className="fa-solid fa-user-doctor" />
                </div>
                <div className="action-text-col">
                  <span className="action-label" style={{ color: '#0d9488' }}>  Account</span>
                  <span className="action-val" style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name.replace('  ', '')} <i className="fa-solid fa-angle-down" />
                  </span>
                </div>
              </Link>
            ) : (
              <Link to="/login" className="pd-action-box account-box" title="Doctor Login / Register">
                <div className="action-icon-circle">
                  <i className="fa-solid fa-user" />
                </div>
                <div className="action-text-col">
                  <span className="action-label">Doctor Portal</span>
                  <span className="action-val">
                    Sign In <i className="fa-solid fa-angle-down" />
                  </span>
                </div>
              </Link>
            )}

            {/* Mobile Header User Profile Button (Visible on Mobile < 768px) */}
            {isAuthenticated && user ? (
              <Link
                to="/profile"
                className="pd-mobile-user-profile-btn"
                title={`Signed in as ${user.name}`}
                aria-label={`My Account - ${user.name}`}
              >
                <div className="mobile-user-icon-circle">
                  <i className="fa-solid fa-user-doctor" />
                </div>
                <div className="mobile-user-label-col">
                  <span className="mobile-user-greeting">My Account</span>
                  <span className="mobile-user-name-text">
                    {user.name.startsWith(' ') ? user.name.split(' ')[0] + ' ' + (user.name.split(' ')[1] || '') : '  ' + user.name.split(' ')[0]}
                  </span>
                </div>
              </Link>
            ) : (
              <Link
                to="/login"
                className="pd-mobile-user-profile-btn"
                title="Doctor Sign In / Register"
                aria-label="Doctor Sign In"
              >
                <div className="mobile-user-icon-circle">
                  <i className="fa-solid fa-user" />
                </div>
                <div className="mobile-user-label-col">
                  <span className="mobile-user-greeting">Welcome</span>
                  <span className="mobile-user-name-text">Sign In</span>
                </div>
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              ref={hamburgerBtnRef}
              type="button"
              className={`pd-mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {/* Dedicated Mobile Search Bar (Only visible on Mobile < 768px) */}
        <div className="pd-mobile-search-bar">
          <form className="mobile-search-form" onSubmit={handleSearchSubmit}>
            <i className="fa-solid fa-magnifying-glass search-icon" />
            <input
              type="text"
              placeholder="Search electronics, fashion, home, beauty, books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search marketplace catalog"
            />
            {searchQuery && (
              <button
                type="button"
                className="btn-clear-mobile-search"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            )}

          </form>
        </div>
      </div>

      {/* Delivery Location Selection Modal Popup */}
      <DeliveryLocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={deliveryLocation}
        onLocationSelect={(loc) => setDeliveryLocation(loc)}
      />

      {/* 3. Sub-Navigation Bar */}
      <nav className="pd-sub-navbar">
        <div className="pd-sub-navbar-container">
          <ul className="pd-nav-list">
            <li className={location.pathname === '/' ? 'active' : ''}>
              <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Home
              </Link>
            </li>
             <li className={location.pathname === '/about' || location.pathname === '/about-us' ? 'active' : ''}>
              <Link to="/about" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                About Us
              </Link>
            </li>
            <li className={location.pathname === '/shop' ? 'active' : ''}>
              <Link to="/shop" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Shop
              </Link>
            </li>
            <li className={location.pathname === '/brands' || location.pathname === '/brand' ? 'active' : ''}>
              <Link to="/brands" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Brands
              </Link>
            </li>
             
            <li className={location.pathname === '/new-arrivals' || location.pathname === '/new-arrival' ? 'active' : ''}>
              <Link to="/new-arrivals" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                New Arrivals
              </Link>
            </li>
            <li className={location.pathname === '/bestsellers' ? 'active' : ''}>
              <Link to="/bestsellers" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Best Sellers
              </Link>
            </li>
            
            <li>
              <Link to="/contact" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Contact Us
              </Link>
            </li>
          </ul>

          {/* Right-Side Quick Actions in Navbar Row (Compare, Wishlist/Like, Cart) */}
          <div className="pd-subnav-quick-actions">
            {/* Compare Pill */}
            <button
              type="button"
              className="subnav-action-pill compare-pill"
              onClick={() => navigate('/compare')}
              title={`Compare Products (${compareCount})`}
              aria-label="Compare products"
            >
              <div className="pill-icon-circle">
                <i className="fa-solid fa-code-compare" />
                {compareCount > 0 && <span className="pill-badge-num">{compareCount}</span>}
              </div>
            </button>

            {/* Wishlist Pill */}
            <button
              type="button"
              className="subnav-action-pill wishlist-pill"
              onClick={() => navigate('/profile?tab=wishlist')}
              title={`View Wishlisted Products (${wishlistCount})`}
              aria-label="Wishlist products"
            >
              <div className="pill-icon-circle">
                <i className="fa-solid fa-heart" />
                {wishlistCount > 0 && <span className="pill-badge-num">{wishlistCount}</span>}
              </div>
            </button>

            {/* Cart Pill */}
            <button
              type="button"
              className="subnav-action-pill cart-pill"
              onClick={openCart}
              title={`View Cart with ${cartCount} items`}
              aria-label="My cart"
            >
              <div className="pill-icon-circle cart-circle">
                <i className="fa-solid fa-cart-shopping" />
                <span className="pill-badge-num">{cartCount}</span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          className="pd-mobile-drawer-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 4. Responsive Mobile Drawer Menu */}
      <div
        ref={mobileNavRef}
        className={`pd-mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}
      >
        <div className="mobile-drawer-header">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="mobile-drawer-logo">
            <img
              src="/images/logo.svg"
              alt="BuyBright"
              className="pd-header-brand-image"
            />
          </Link>
          <button
            type="button"
            className="btn-close-drawer"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="mobile-drawer-body">
          {/* 1. Mobile Drawer "My Account" Profile Card */}
          {isAuthenticated && user ? (
            <div className="mobile-drawer-account-card">
              <div className="account-card-main">
                <div className="account-avatar-circle">
                  <i className="fa-solid fa-user-doctor" />
                </div>
                <div className="account-user-info">
                  <span className="account-badge">
                    <i className="fa-solid fa-circle-check" /> Verified Doctor
                  </span>
                  <h4 className="account-user-name">{user.name}</h4>
                  <span className="account-user-meta">
                    <i className="fa-regular fa-envelope" /> {user.email || user.phone}
                  </span>
                </div>
                <Link
                  to="/profile"
                  className="btn-account-arrow"
                  onClick={() => setIsMobileMenuOpen(false)}
                  title="View Full Profile"
                >
                  <i className="fa-solid fa-chevron-right" />
                </Link>
              </div>

              <div className="account-quick-pills">
                <Link
                  to="/profile?tab=overview"
                  className="account-pill-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fa-solid fa-id-badge" />
                  <span>My Profile</span>
                </Link>
                <Link
                  to="/profile?tab=orders"
                  className="account-pill-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fa-solid fa-box-open" />
                  <span>Orders</span>
                </Link>
                <Link
                  to="/profile?tab=wishlist"
                  className="account-pill-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fa-solid fa-heart" />
                  <span>Wishlist</span>
                </Link>
                <Link
                  to="/profile?tab=addresses"
                  className="account-pill-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fa-solid fa-location-dot" />
                  <span>Addresses</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="mobile-drawer-account-card guest-card">
              <div className="account-card-main">
                <div className="account-avatar-circle guest-avatar">
                  <i className="fa-solid fa-user" />
                </div>
                <div className="account-user-info">
                  <span className="account-badge guest-badge">Doctor Portal</span>
                  <h4 className="account-user-name">My Account</h4>
                  <span className="account-user-meta">Login for GST invoice &amp; tracking</span>
                </div>
              </div>
              <div className="account-guest-buttons">
                <Link
                  to="/login"
                  className="btn-drawer-guest-signin"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fa-solid fa-arrow-right-to-bracket" />
                  <span>Doctor Sign In / Register</span>
                </Link>
              </div>
            </div>
          )}

          {/* Mobile Drawer Location Bar */}
          <div
            className="mobile-drawer-location-banner"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsLocationModalOpen(true);
            }}
          >
            <div className="loc-icon-bubble">
              <i className="fa-solid fa-location-dot" />
            </div>
            <div className="loc-text-wrap">
              <span className="loc-sub">Delivering to:</span>
              <strong className="loc-main">{deliveryLocation}</strong>
            </div>
            <span className="btn-loc-change">Change</span>
          </div>

          <ul className="mobile-nav-links">
            <li className={location.pathname === '/' ? 'active' : ''}>
              <Link to="/" onClick={() => handleNavClick()}>
                <i className="fa-solid fa-house nav-li-icon" />
                <span>Home</span>
              </Link>
            </li>
            <li className={location.pathname === '/about' || location.pathname === '/about-us' ? 'active' : ''}>
              <Link to="/about" onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                <i className="fa-solid fa-circle-info nav-li-icon" />
                <span>About Us</span>
              </Link>
            </li>
            <li className={location.pathname === '/shop' ? 'active' : ''}>
              <Link to="/shop" onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                <i className="fa-solid fa-cart-shopping nav-li-icon" />
                <span>Shop</span>
              </Link>
            </li>
            <li className={location.pathname === '/brands' || location.pathname === '/brand' ? 'active' : ''}>
              <Link to="/brands" onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                <i className="fa-solid fa-certificate nav-li-icon" />
                <span>Brands</span>
              </Link>
            </li>
            <li className={location.pathname === '/new-arrivals' || location.pathname === '/new-arrival' ? 'active' : ''}>
              <Link to="/new-arrivals" onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                <i className="fa-solid fa-sparkles nav-li-icon" />
                <span>New Arrivals</span>
              </Link>
            </li>
            <li className={location.pathname === '/bestsellers' ? 'active' : ''}>
              <Link to="/bestsellers" onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                <i className="fa-solid fa-crown nav-li-icon" />
                <span>Best Sellers</span>
              </Link>
            </li>
            <li className={location.pathname === '/contact' ? 'active' : ''}>
              <Link
                to="/contact"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <i className="fa-solid fa-headset nav-li-icon" />
                <span>Contact Us</span>
              </Link>
            </li>

            {/* Interactive Expandable Category Accordion */}
            <li className="drawer-accordion-li">
              <div
                className={`drawer-accordion-header ${isMobileCategoriesOpen ? 'open' : ''}`}
                onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
              >
                <div className="accordion-label-wrap">
                  <i className="fa-solid fa-shapes nav-li-icon" />
                  <span>Shop by Category</span>
                </div>
                <i className={`fa-solid fa-chevron-down accordion-arrow ${isMobileCategoriesOpen ? 'rotated' : ''}`} />
              </div>

              {isMobileCategoriesOpen && (
                <div className="drawer-sub-categories-wrapper">
                  {CATEGORIES_DATA.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className="drawer-sub-cat-btn"
                      onClick={() => handleSelectCategory(cat.slug)}
                    >
                      <div className="sub-cat-icon-col">
                        <i className={cat.icon} />
                      </div>
                      <div className="sub-cat-info-col">
                        <span className="sub-cat-name">{cat.name}</span>
                        <span className="sub-cat-count">{cat.itemCount}</span>
                      </div>
                      <i className="fa-solid fa-angle-right sub-cat-arrow" />
                    </button>
                  ))}
                </div>
              )}
            </li>

            <li className={location.pathname === '/compare' ? 'active' : ''}>
              <Link to="/compare" onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                <i className="fa-solid fa-code-compare nav-li-icon" />
                <span>Compare Products</span>
                {compareCount > 0 && (
                  <span className="drawer-badge-count" style={{ marginLeft: 'auto', background: '#008080', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '12px' }}>
                    {compareCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>

          <div className="mobile-drawer-actions">
            {isAuthenticated && user ? (
              <>
                <Link
                  to="/profile"
                  className="btn-mobile-login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ background: 'linear-gradient(135deg, #008080, #005f60)', color: '#fff' }}
                >
                  <i className="fa-solid fa-user-doctor" />
                  <span>My Account ({user.name})</span>
                </Link>
                <button
                  type="button"
                  className="btn-mobile-logout"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                    navigate('/login');
                  }}
                >
                  <i className="fa-solid fa-arrow-right-from-bracket" />
                  <span>Logout Account</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-mobile-login" onClick={() => setIsMobileMenuOpen(false)}>
                <i className="fa-regular fa-user" />
                <span>Doctor Sign In / Register</span>
              </Link>
            )}
            <a href="tel:+918806488054" className="mobile-support-link">
              <i className="fa-solid fa-phone" />
              <span>Call Helpdesk: +91 88064 88054</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
