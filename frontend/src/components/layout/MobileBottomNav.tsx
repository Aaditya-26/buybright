/**
 * BuyBright Mobile App-Style Bottom Navigation Bar.
 * Provides a native mobile application experience on mobile screens:
 * 1. Home (Quick navigation / Scroll to top)
 * 2. Categories (Browse catalog & specialties)
 * 3. Compare (Quick access to product comparisons)
 * 4. Cart (Live reactive badge count + opens CartDrawer)
 * 5. Account (Access Login / Admin Portal)
 */

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useCompare } from '../../context/CompareContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const MobileBottomNav: React.FC = () => {
  const { cartCount, openCart } = useCart();
  const { compareCount } = useCompare();
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';
  const isCompare = location.pathname === '/compare';
  const isAccount =
    location.pathname.includes('/profile') ||
    location.pathname.includes('/account') ||
    location.pathname.includes('/login') ||
    location.pathname.includes('/admin');

  const handleHomeClick = () => {
    if (isHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const handleCategoriesClick = () => {
    if (!isHome) {
      navigate('/shop');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } else {
      const catSec = document.getElementById('categories') || document.getElementById('products');
      if (catSec) {
        catSec.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/shop');
      }
    }
  };

  const handleCompareClick = () => {
    navigate('/compare');
    if (compareCount === 0) {
      showToast('Compare list is empty. Add products to compare specifications side-by-side.', 'info');
    }
  };

  const handleAccountClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="pd-mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
      <div className="bottom-nav-container">
        {/* 1. Home Item */}
        <button
          type="button"
          className={`bottom-nav-item ${isHome ? 'active' : ''}`}
          onClick={handleHomeClick}
          aria-label="Home"
        >
          <div className="nav-icon-box">
            <i className="fa-solid fa-house" />
          </div>
          <span className="nav-item-label">Home</span>
          {isHome && <span className="active-dot" />}
        </button>

        {/* 2. Categories / Shop Item */}
        <button
          type="button"
          className={`bottom-nav-item ${location.pathname === '/shop' ? 'active' : ''}`}
          onClick={handleCategoriesClick}
          aria-label="Categories"
        >
          <div className="nav-icon-box">
            <i className="fa-solid fa-shapes" />
          </div>
          <span className="nav-item-label">Categories</span>
          {location.pathname === '/shop' && <span className="active-dot" />}
        </button>

        {/* 3. Compare Item */}
        <button
          type="button"
          className={`bottom-nav-item ${isCompare ? 'active' : ''}`}
          onClick={handleCompareClick}
          aria-label={`Compare with ${compareCount} items`}
        >
          <div className="nav-icon-box compare-box">
            <i className="fa-solid fa-code-compare" />
            {compareCount > 0 && (
              <span className="bottom-cart-badge compare-badge">{compareCount > 99 ? '99+' : compareCount}</span>
            )}
          </div>
          <span className="nav-item-label">Compare</span>
          {isCompare && <span className="active-dot" />}
        </button>

        {/* 4. Cart Item (Central Action) */}
        <button
          type="button"
          className={`bottom-nav-item cart-highlight-item ${cartCount > 0 ? 'has-items' : ''}`}
          onClick={openCart}
          aria-label={`Cart with ${cartCount} items`}
        >
          <div className="nav-icon-box cart-box">
            <i className="fa-solid fa-cart-shopping" />
            {cartCount > 0 && (
              <span className="bottom-cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
            )}
          </div>
          <span className="nav-item-label">Cart</span>
        </button>

        {/* 5. Account / Profile Item */}
        <button
          type="button"
          className={`bottom-nav-item ${isAccount ? 'active' : ''}`}
          onClick={handleAccountClick}
          aria-label={isAuthenticated ? (user?.name || 'My Account') : 'Sign In'}
        >
          <div className="nav-icon-box">
            <i className={isAuthenticated ? 'fa-solid fa-user-doctor' : 'fa-solid fa-user'} />
          </div>
          <span className="nav-item-label">{isAuthenticated ? 'Account' : 'Profile'}</span>
          {isAccount && <span className="active-dot" />}
        </button>
      </div>
    </nav>
  );
};
