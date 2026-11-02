/**
 * BuyBright Centralized Application Routes with Performance-Optimized Code Splitting.
 */

import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Code-split pages on demand for optimal First Contentful Paint and minimal initial bundle size
const HomePage = lazy(() => import('../pages/HomePage').then((m) => ({ default: m.HomePage })));
const ShopPage = lazy(() => import('../pages/products/ShopPage').then((m) => ({ default: m.ShopPage })));
const ProductDetailPage = lazy(() => import('../pages/products/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })));
const BestsellersPage = lazy(() => import('../pages/products/BestsellersPage').then((m) => ({ default: m.BestsellersPage })));
const NewArrivalsPage = lazy(() => import('../pages/products/NewArrivalsPage').then((m) => ({ default: m.NewArrivalsPage })));
const BrandsPage = lazy(() => import('../pages/brands/BrandsPage').then((m) => ({ default: m.BrandsPage })));
const AboutUsPage = lazy(() => import('../pages/AboutUsPage').then((m) => ({ default: m.AboutUsPage })));
const ContactPage = lazy(() => import('../pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const PrivacyPolicyPage = lazy(() => import('../pages/support/PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicyPage })));
const TermsOfUsePage = lazy(() => import('../pages/support/TermsOfUsePage').then((m) => ({ default: m.TermsOfUsePage })));
const ShippingPolicyPage = lazy(() => import('../pages/support/ShippingPolicyPage').then((m) => ({ default: m.ShippingPolicyPage })));
const ReturnPolicyPage = lazy(() => import('../pages/support/ReturnPolicyPage').then((m) => ({ default: m.ReturnPolicyPage })));
const ComparePage = lazy(() => import('../pages/ComparePage').then((m) => ({ default: m.ComparePage })));
const UserProfilePage = lazy(() => import('../pages/UserProfilePage').then((m) => ({ default: m.UserProfilePage })));
const CartPage = lazy(() => import('../pages/checkout/CartPage').then((m) => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('../pages/checkout/CheckoutPage').then((m) => ({ default: m.CheckoutPage })));
const PaymentPage = lazy(() => import('../pages/checkout/PaymentPage').then((m) => ({ default: m.PaymentPage })));
const OrderSuccessPage = lazy(() => import('../pages/checkout/OrderSuccessPage').then((m) => ({ default: m.OrderSuccessPage })));
const TrackOrderPage = lazy(() => import('../pages/checkout/TrackOrderPage').then((m) => ({ default: m.TrackOrderPage })));
const LoginPage = lazy(() => import('../pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })));
const AdminRoutes = lazy(() => import('../admin/routes/AdminRoutes').then((m) => ({ default: m.AdminRoutes })));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

const RouteLoadingFallback: React.FC = () => (
  <div className="route-loading-container" aria-label="Loading content" role="status">
    <div className="route-spinner">
      <div className="spinner-ring" />
      <span className="spinner-label">Loading BuyBright...</span>
    </div>
  </div>
);

interface AppRoutesProps {
  searchQuery?: string;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({ searchQuery }) => {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        <Route path="/" element={<HomePage searchQuery={searchQuery} />} />
        <Route path="/shop" element={<ShopPage initialSearchQuery={searchQuery} />} />
        <Route path="/products" element={<ShopPage initialSearchQuery={searchQuery} />} />
        <Route path="/bestsellers" element={<BestsellersPage />} />
        <Route path="/best-sellers" element={<BestsellersPage />} />
        <Route path="/new-arrivals" element={<NewArrivalsPage />} />
        <Route path="/new-arrival" element={<NewArrivalsPage />} />
        <Route path="/brands" element={<BrandsPage />} />
        <Route path="/brand" element={<BrandsPage />} />
        <Route path="/shop/:id" element={<ProductDetailPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-use" element={<TermsOfUsePage />} />
        <Route path="/terms" element={<TermsOfUsePage />} />
        <Route path="/terms-and-conditions" element={<TermsOfUsePage />} />
        <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
        <Route path="/shipping" element={<ShippingPolicyPage />} />
        <Route path="/return-policy" element={<ReturnPolicyPage />} />
        <Route path="/returns" element={<ReturnPolicyPage />} />
        <Route path="/returns-refunds" element={<ReturnPolicyPage />} />
        <Route path="/refund-policy" element={<ReturnPolicyPage />} />
        <Route path="/profile" element={<UserProfilePage />} />

        {/* Dental Shopping Cart & Checkout Flow */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/checkout/payment" element={<PaymentPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/checkout/success" element={<OrderSuccessPage />} />
        <Route path="/track-order" element={<TrackOrderPage />} />
        <Route path="/track-order/:orderId" element={<TrackOrderPage />} />
        <Route path="/track" element={<TrackOrderPage />} />

        {/* Dental Authentication Suite Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Administrator Portal Routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/admin-panel/*" element={<AdminRoutes />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

