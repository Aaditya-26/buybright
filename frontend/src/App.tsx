/**
 * BuyBright Main Application Component.
 * Sets up Global Context Providers, React Router, Global Layout, and Modular Application Routes.
 * Conditionally hides Header, Footer, and MobileBottomNav on Authentication Pages.
 */

import React, { useState } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CompareProvider } from './context/CompareContext';
import { FestivalProvider } from './context/FestivalContext';
import { ToastContainer } from './components/common/Toast';
import { ScrollToTop } from './components/common/ScrollToTop';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';
import { FestivalTopBanner } from './components/common/FestivalTopBanner';
import { FestivalFloatingRibbon } from './components/common/FestivalFloatingRibbon';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/layout/CartDrawer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { AppRoutes } from './routes/AppRoutes';

const AppContent: React.FC = () => {
  const [globalSearch, setGlobalSearch] = useState<string | undefined>(undefined);
  const location = useLocation();

  // Determine if the current route is an authentication page or admin page
  const authPaths = ['/login', '/signin', '/register', '/signup', '/forgot-password', '/reset-password'];
  const isAuthPage = authPaths.some((path) => location.pathname === path || location.pathname.startsWith(`${path}/`));
  const isAdminPage = location.pathname.startsWith('/admin');
  const hideCustomerChrome = isAuthPage || isAdminPage;

  const handleGlobalSearch = (query: string) => {
    setGlobalSearch(query);
    const prodSec = document.getElementById('products');
    if (prodSec) {
      prodSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`app-layout ${isAuthPage ? 'auth-layout-active' : ''} ${isAdminPage ? 'admin-layout-active' : ''}`}>
      {/* Global Scroll Position Manager */}
      <ScrollToTop />

      {/* Dynamic Festive Top Announcement Bar */}
      {!hideCustomerChrome && <FestivalTopBanner />}

      {/* Global Header Navigation (Hidden on Auth & Admin Pages) */}
      {!hideCustomerChrome && <Header onSearchSubmit={handleGlobalSearch} />}

      {/* Application Routed Pages */}
      <main id="main-content" className={isAuthPage ? 'auth-main-wrapper' : isAdminPage ? 'admin-main-wrapper' : ''}>
        <AppRoutes searchQuery={globalSearch} />
      </main>

      {/* Dynamic Floating Festive Ribbon / Coupon Badge */}
      {!hideCustomerChrome && <FestivalFloatingRibbon />}

      {/* Global Floating WhatsApp Support Button (Centered Right Side) */}
      {!hideCustomerChrome && <FloatingWhatsApp />}

      {/* Global Footer (Hidden on Auth & Admin Pages) */}
      {!hideCustomerChrome && <Footer />}

      {/* App-Like Mobile Bottom Navigation Bar (Hidden on Auth & Admin Pages) */}
      {!hideCustomerChrome && <MobileBottomNav />}

      {/* Global Modals & Interactive Overlays */}
      <ToastContainer />
      {!isAdminPage && <CartDrawer />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <WishlistProvider>
            <CompareProvider>
              <FestivalProvider>
                <Router>
                  <AppContent />
                </Router>
              </FestivalProvider>
            </CompareProvider>
          </WishlistProvider>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
