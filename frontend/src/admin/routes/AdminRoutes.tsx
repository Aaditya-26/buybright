/**
 * BuyBright Admin Centralized Routing Engine.
 * Manages administrative route navigation, code splitting, and session authentication guards.
 */

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';

// Lazy-loaded administrative modules
const AdminLogin = lazy(() => import('../pages/AdminLogin').then((m) => ({ default: m.AdminLogin })));
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard').then((m) => ({ default: m.Dashboard })));
const UserList = lazy(() => import('../pages/Users/UserList').then((m) => ({ default: m.UserList })));
const UserForm = lazy(() => import('../pages/Users/UserForm').then((m) => ({ default: m.UserForm })));
const RoleList = lazy(() => import('../pages/Roles/RoleList').then((m) => ({ default: m.RoleList })));
const RoleForm = lazy(() => import('../pages/Roles/RoleForm').then((m) => ({ default: m.RoleForm })));
const HomeBannerList = lazy(() => import('../pages/HomePage/HomeBannerList').then((m) => ({ default: m.HomeBannerList })));
const HomeBannerForm = lazy(() => import('../pages/HomePage/HomeBannerForm').then((m) => ({ default: m.HomeBannerForm })));
const HomeAdList = lazy(() => import('../pages/HomePage/HomeAdList').then((m) => ({ default: m.HomeAdList })));
const HomeAdForm = lazy(() => import('../pages/HomePage/HomeAdForm').then((m) => ({ default: m.HomeAdForm })));
const ProductList = lazy(() => import('../pages/Products/AllProducts/ProductList').then((m) => ({ default: m.ProductList })));
const ProductFormPage = lazy(() => import('../pages/Products/AllProducts/ProductFormPage').then((m) => ({ default: m.ProductFormPage })));
const ProductBannerList = lazy(() => import('../pages/Products/Banners/ProductBannerList').then((m) => ({ default: m.ProductBannerList })));
const ProductBannerForm = lazy(() => import('../pages/Products/Banners/ProductBannerForm').then((m) => ({ default: m.ProductBannerForm })));
const CategoryList = lazy(() => import('../pages/Products/Categories/CategoryList').then((m) => ({ default: m.CategoryList })));
const CategoryForm = lazy(() => import('../pages/Products/Categories/CategoryForm').then((m) => ({ default: m.CategoryForm })));
const SubCategoryList = lazy(() => import('../pages/Products/SubCategories/SubCategoryList').then((m) => ({ default: m.SubCategoryList })));
const SubCategoryForm = lazy(() => import('../pages/Products/SubCategories/SubCategoryForm').then((m) => ({ default: m.SubCategoryForm })));
const GSTList = lazy(() => import('../pages/Products/GST/GSTList').then((m) => ({ default: m.GSTList })));
const GSTForm = lazy(() => import('../pages/Products/GST/GSTForm').then((m) => ({ default: m.GSTForm })));
const HSNList = lazy(() => import('../pages/Products/HSN/HSNList').then((m) => ({ default: m.HSNList })));
const HSNForm = lazy(() => import('../pages/Products/HSN/HSNForm').then((m) => ({ default: m.HSNForm })));
const BrandList = lazy(() => import('../pages/Products/Brands/BrandList').then((m) => ({ default: m.BrandList })));
const BrandForm = lazy(() => import('../pages/Products/Brands/BrandForm').then((m) => ({ default: m.BrandForm })));
const BrandCategoryList = lazy(() => import('../pages/Products/Brands/BrandCategoryList').then((m) => ({ default: m.BrandCategoryList })));
const ProductTypeList = lazy(() => import('../pages/Products/ProductTypes/ProductTypeList').then((m) => ({ default: m.ProductTypeList })));
const NewOrdersPage = lazy(() => import('../pages/Orders/NewOrdersPage').then((m) => ({ default: m.NewOrdersPage })));
const InProcessOrdersPage = lazy(() => import('../pages/Orders/InProcessOrdersPage').then((m) => ({ default: m.InProcessOrdersPage })));
const ReadyToPickOrdersPage = lazy(() => import('../pages/Orders/ReadyToPickOrdersPage').then((m) => ({ default: m.ReadyToPickOrdersPage })));
const OutForDeliveryOrdersPage = lazy(() => import('../pages/Orders/OutForDeliveryOrdersPage').then((m) => ({ default: m.OutForDeliveryOrdersPage })));
const DeliveredOrdersPage = lazy(() => import('../pages/Orders/DeliveredOrdersPage').then((m) => ({ default: m.DeliveredOrdersPage })));
const CancelledOrdersPage = lazy(() => import('../pages/Orders/CancelledOrdersPage').then((m) => ({ default: m.CancelledOrdersPage })));
const ReturnedOrdersPage = lazy(() => import('../pages/Orders/ReturnedOrdersPage').then((m) => ({ default: m.ReturnedOrdersPage })));
const CustomerList = lazy(() => import('../pages/Customers/CustomerList').then((m) => ({ default: m.CustomerList })));
const CustomerProfilePage = lazy(() => import('../pages/Customers/CustomerProfilePage').then((m) => ({ default: m.CustomerProfilePage })));
const WalletList = lazy(() => import('../pages/Wallet/WalletList').then((m) => ({ default: m.WalletList })));
const WalletDetailsPage = lazy(() => import('../pages/Wallet/WalletDetailsPage').then((m) => ({ default: m.WalletDetailsPage })));
const Reports = lazy(() => import('../pages/Reports/ReportsOverview').then((m) => ({ default: m.ReportsOverview })));
const SalesReportPage = lazy(() => import('../pages/Reports/SalesReportPage').then((m) => ({ default: m.SalesReportPage })));
const OrdersReportPage = lazy(() => import('../pages/Reports/OrdersReportPage').then((m) => ({ default: m.OrdersReportPage })));
const ProductReportPage = lazy(() => import('../pages/Reports/ProductReportPage').then((m) => ({ default: m.ProductReportPage })));
const CategoryReportPage = lazy(() => import('../pages/Reports/CategoryReportPage').then((m) => ({ default: m.CategoryReportPage })));
const CustomerReportPage = lazy(() => import('../pages/Reports/CustomerReportPage').then((m) => ({ default: m.CustomerReportPage })));
const ReferralReportPage = lazy(() => import('../pages/Reports/ReferralReportPage').then((m) => ({ default: m.ReferralReportPage })));
const WalletReportPage = lazy(() => import('../pages/Reports/WalletReportPage').then((m) => ({ default: m.WalletReportPage })));
const CouponReportPage = lazy(() => import('../pages/Reports/CouponReportPage').then((m) => ({ default: m.CouponReportPage })));
const CartReportPage = lazy(() => import('../pages/Reports/CartReportPage').then((m) => ({ default: m.CartReportPage })));
const Settings = lazy(() => import('../pages/Settings/Settings').then((m) => ({ default: m.Settings })));
const AboutOverview = lazy(() => import('../pages/AboutPage/AboutOverview').then((m) => ({ default: m.AboutOverview })));
const AboutHeroForm = lazy(() => import('../pages/AboutPage/AboutHeroForm').then((m) => ({ default: m.AboutHeroForm })));
const AboutWhoWeAreForm = lazy(() => import('../pages/AboutPage/AboutWhoWeAreForm').then((m) => ({ default: m.AboutWhoWeAreForm })));
const AboutMissionVisionForm = lazy(() => import('../pages/AboutPage/AboutMissionVisionForm').then((m) => ({ default: m.AboutMissionVisionForm })));
const AboutJourneyForm = lazy(() => import('../pages/AboutPage/AboutJourneyForm').then((m) => ({ default: m.AboutJourneyForm })));
const AboutPillarsForm = lazy(() => import('../pages/AboutPage/AboutPillarsForm').then((m) => ({ default: m.AboutPillarsForm })));
const ContactEnquiryList = lazy(() => import('../pages/Contact/ContactEnquiryList').then((m) => ({ default: m.ContactEnquiryList })));
const ContactCustomizer = lazy(() => import('../pages/Contact/ContactCustomizer').then((m) => ({ default: m.ContactCustomizer })));
const FestivalThemeList = lazy(() => import('../pages/FestivalTheme/FestivalThemeList').then((m) => ({ default: m.FestivalThemeList })));
const FestivalThemeForm = lazy(() => import('../pages/FestivalTheme/FestivalThemeForm').then((m) => ({ default: m.FestivalThemeForm })));
const ReviewsList = lazy(() => import('../pages/Reviews/ReviewsList').then((m) => ({ default: m.ReviewsList })));
const WishlistList = lazy(() => import('../pages/Wishlist/WishlistList').then((m) => ({ default: m.WishlistList })));
const CartList = lazy(() => import('../pages/Cart/CartList').then((m) => ({ default: m.CartList })));
const FlashSaleList = lazy(() => import('../pages/FlashSales/FlashSaleList').then((m) => ({ default: m.FlashSaleList })));
const FlashSaleForm = lazy(() => import('../pages/FlashSales/FlashSaleForm').then((m) => ({ default: m.FlashSaleForm })));
const NotificationHistory = lazy(() => import('../pages/Notifications/NotificationHistory').then((m) => ({ default: m.NotificationHistory })));
const HeaderSettings = lazy(() => import('../pages/HeaderSettings/HeaderSettings').then((m) => ({ default: m.HeaderSettings })));
const FooterSettings = lazy(() => import('../pages/FooterSettings/FooterSettings').then((m) => ({ default: m.FooterSettings })));
const ReferralSettingsPage = lazy(() => import('../pages/Settings/ReferralSettingsPage').then((m) => ({ default: m.ReferralSettingsPage })));
const SendNotificationPage = lazy(() => import('../pages/Settings/SendNotificationPage').then((m) => ({ default: m.SendNotificationPage })));
const ShippingChargesPage = lazy(() => import('../pages/Settings/ShippingChargesPage').then((m) => ({ default: m.ShippingChargesPage })));
const IconLibraryPage = lazy(() => import('../pages/IconLibrary/IconLibraryPage').then((m) => ({ default: m.IconLibraryPage })));
const AdminProfilePage = lazy(() => import('../pages/Profile/AdminProfilePage').then((m) => ({ default: m.AdminProfilePage })));


// Protection guard for authenticated administrative routes
const ProtectedAdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated } = useAdminAuth();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

const AdminLoadingFallback: React.FC = () => (
  <div
    style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      color: '#64748b',
    }}
  >
    <i className="fa-solid fa-tooth fa-spin" style={{ fontSize: '2rem', color: '#0d9488' }} />
    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Loading BuyBright Console...</span>
  </div>
);

export const AdminRoutes: React.FC = () => {
  return (
    <Suspense fallback={<AdminLoadingFallback />}>
      <Routes>
        {/* Authentication Gateway */}
        <Route index element={<AdminLogin />} />
        <Route path="login" element={<AdminLogin />} />

        {/* Executive Management Modules */}
        <Route
          path="dashboard"
          element={
            <ProtectedAdminRoute>
              <Dashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="users"
          element={
            <ProtectedAdminRoute>
              <UserList />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="users/create"
          element={
            <ProtectedAdminRoute>
              <UserForm />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="users/edit/:id"
          element={
            <ProtectedAdminRoute>
              <UserForm />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="roles"
          element={
            <ProtectedAdminRoute>
              <RoleList />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="roles/create"
          element={
            <ProtectedAdminRoute>
              <RoleForm />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="roles/edit/:id"
          element={
            <ProtectedAdminRoute>
              <RoleForm />
            </ProtectedAdminRoute>
          }
        />

        {/* Home Page Management Routes */}
        <Route
          path="home/banners"
          element={
            <ProtectedAdminRoute>
              <HomeBannerList />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="home/banners/create"
          element={
            <ProtectedAdminRoute>
              <HomeBannerForm />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="home/banners/edit/:id"
          element={
            <ProtectedAdminRoute>
              <HomeBannerForm />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="home/advertisements"
          element={
            <ProtectedAdminRoute>
              <HomeAdList />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="home/advertisements/create"
          element={
            <ProtectedAdminRoute>
              <HomeAdForm />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="home/advertisements/edit/:id"
          element={
            <ProtectedAdminRoute>
              <HomeAdForm />
            </ProtectedAdminRoute>
          }
        />

        {/* About Page Module Routes */}
        <Route
          path="about"
          element={
            <ProtectedAdminRoute>
              <AboutOverview />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="about/hero"
          element={
            <ProtectedAdminRoute>
              <AboutHeroForm />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="about/who-we-are"
          element={
            <ProtectedAdminRoute>
              <AboutWhoWeAreForm />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="about/mission-vision"
          element={
            <ProtectedAdminRoute>
              <AboutMissionVisionForm />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="about/journey"
          element={
            <ProtectedAdminRoute>
              <AboutJourneyForm />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="about/pillars"
          element={
            <ProtectedAdminRoute>
              <AboutPillarsForm />
            </ProtectedAdminRoute>
          }
        />

        {/* Contact Desk Module Routes */}
        <Route
          path="contact/enquiries"
          element={
            <ProtectedAdminRoute>
              <ContactEnquiryList />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="contact/customizer"
          element={
            <ProtectedAdminRoute>
              <ContactCustomizer />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="contact/settings"
          element={
            <ProtectedAdminRoute>
              <ContactCustomizer />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="clinics"
          element={
            <ProtectedAdminRoute>
              <UserList />
            </ProtectedAdminRoute>
          }
        />
        {/* ── Product Management Module Routes ── */}
        {/* 1. All Products */}
        <Route
          path="products"
          element={
            <ProtectedAdminRoute>
              <ProductList />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="products/create"
          element={
            <ProtectedAdminRoute>
              <ProductFormPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="products/edit/:id"
          element={
            <ProtectedAdminRoute>
              <ProductFormPage />
            </ProtectedAdminRoute>
          }
        />

        {/* 2. Product Banners */}
        <Route
          path="products/banners"
          element={
            <ProtectedAdminRoute>
              <ProductBannerList />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="products/banners/create"
          element={
            <ProtectedAdminRoute>
              <ProductBannerForm />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="products/banners/edit/:id"
          element={
            <ProtectedAdminRoute>
              <ProductBannerForm />
            </ProtectedAdminRoute>
          }
        />

        {/* Product Types (Same-page Form + Listing) */}
        <Route
          path="products/types"
          element={
            <ProtectedAdminRoute>
              <ProductTypeList />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="products/product-types"
          element={<Navigate to="/admin/products/types" replace />}
        />

        {/* 3. Categories */}
        <Route
          path="products/categories"
          element={
            <ProtectedAdminRoute>
              <CategoryList />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="products/categories/create"
          element={
            <ProtectedAdminRoute>
              <CategoryForm />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="products/categories/edit/:id"
          element={
            <ProtectedAdminRoute>
              <CategoryForm />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="categories"
          element={<Navigate to="/admin/products/categories" replace />}
        />
        <Route
          path="categories/create"
          element={
            <ProtectedAdminRoute>
              <CategoryForm />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="categories/edit/:id"
          element={
            <ProtectedAdminRoute>
              <CategoryForm />
            </ProtectedAdminRoute>
          }
        />

        {/* 4. Sub-Categories */}
        <Route
          path="products/subcategories"
          element={
            <ProtectedAdminRoute>
              <SubCategoryList />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="products/subcategories/create"
          element={
            <ProtectedAdminRoute>
              <SubCategoryForm />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="products/subcategories/edit/:id"
          element={
            <ProtectedAdminRoute>
              <SubCategoryForm />
            </ProtectedAdminRoute>
          }
        />

        {/* GST Taxation Rates */}
        <Route
          path="products/gst"
          element={
            <ProtectedAdminRoute>
              <GSTList />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="products/gst/create"
          element={
            <ProtectedAdminRoute>
              <GSTForm />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="products/gst/edit/:id"
          element={
            <ProtectedAdminRoute>
              <GSTForm />
            </ProtectedAdminRoute>
          }
        />

        {/* HSN Codes */}
        <Route
          path="products/hsn"
          element={
            <ProtectedAdminRoute>
              <HSNList />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="products/hsn/create"
          element={
            <ProtectedAdminRoute>
              <HSNForm />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="products/hsn/edit/:id"
          element={
            <ProtectedAdminRoute>
              <HSNForm />
            </ProtectedAdminRoute>
          }
        />

        {/* 5. Brands & Brand Categories */}
        <Route
          path="products/brand-categories"
          element={
            <ProtectedAdminRoute>
              <BrandCategoryList />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="products/brands"
          element={
            <ProtectedAdminRoute>
              <BrandList />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="products/brands/create"
          element={
            <ProtectedAdminRoute>
              <BrandForm />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="products/brands/edit/:id"
          element={
            <ProtectedAdminRoute>
              <BrandForm />
            </ProtectedAdminRoute>
          }
        />

        {/* ── Order Fulfillment Module Routes (7 Workflow Stages) ── */}
        <Route
          path="orders"
          element={<Navigate to="/admin/orders/new" replace />}
        />
        <Route
          path="orders/new"
          element={
            <ProtectedAdminRoute>
              <NewOrdersPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="orders/placed"
          element={<Navigate to="/admin/orders/new" replace />}
        />
        <Route
          path="orders/in-process"
          element={
            <ProtectedAdminRoute>
              <InProcessOrdersPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="orders/ready-to-pick"
          element={
            <ProtectedAdminRoute>
              <ReadyToPickOrdersPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="orders/out-for-delivery"
          element={
            <ProtectedAdminRoute>
              <OutForDeliveryOrdersPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="orders/delivered"
          element={
            <ProtectedAdminRoute>
              <DeliveredOrdersPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="orders/cancelled"
          element={
            <ProtectedAdminRoute>
              <CancelledOrdersPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="orders/returned"
          element={
            <ProtectedAdminRoute>
              <ReturnedOrdersPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="customers"
          element={
            <ProtectedAdminRoute>
              <CustomerList />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="customers/:id"
          element={
            <ProtectedAdminRoute>
              <CustomerProfilePage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="customers/profile/:id"
          element={
            <ProtectedAdminRoute>
              <CustomerProfilePage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="wallet"
          element={
            <ProtectedAdminRoute>
              <WalletList />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="wallet/details/:id"
          element={
            <ProtectedAdminRoute>
              <WalletDetailsPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="reports"
          element={
            <ProtectedAdminRoute>
              <Reports />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="reports/sales"
          element={
            <ProtectedAdminRoute>
              <SalesReportPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="reports/orders"
          element={
            <ProtectedAdminRoute>
              <OrdersReportPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="reports/products"
          element={
            <ProtectedAdminRoute>
              <ProductReportPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="reports/categories"
          element={
            <ProtectedAdminRoute>
              <CategoryReportPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="reports/customers"
          element={
            <ProtectedAdminRoute>
              <CustomerReportPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="reports/referrals"
          element={
            <ProtectedAdminRoute>
              <ReferralReportPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="reports/wallet"
          element={
            <ProtectedAdminRoute>
              <WalletReportPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="reports/coupons"
          element={
            <ProtectedAdminRoute>
              <CouponReportPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="reports/carts"
          element={
            <ProtectedAdminRoute>
              <CartReportPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="reports/cart"
          element={
            <ProtectedAdminRoute>
              <CartReportPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="festival-theme"
          element={
            <ProtectedAdminRoute>
              <FestivalThemeList />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="festival-theme/create"
          element={
            <ProtectedAdminRoute>
              <FestivalThemeForm />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="festival-theme/edit/:id"
          element={
            <ProtectedAdminRoute>
              <FestivalThemeForm />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="icon-library"
          element={
            <ProtectedAdminRoute>
              <IconLibraryPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="festival-theme/icons"
          element={
            <ProtectedAdminRoute>
              <IconLibraryPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="reviews"
          element={
            <ProtectedAdminRoute>
              <ReviewsList />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="cart"
          element={
            <ProtectedAdminRoute>
              <CartList />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="wishlist"
          element={
            <ProtectedAdminRoute>
              <WishlistList />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="flash-sales"
          element={
            <ProtectedAdminRoute>
              <FlashSaleList />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="flash-sales/new"
          element={
            <ProtectedAdminRoute>
              <FlashSaleForm />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="flash-sales/edit/:id"
          element={
            <ProtectedAdminRoute>
              <FlashSaleForm />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedAdminRoute>
              <Settings />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="notifications"
          element={
            <ProtectedAdminRoute>
              <NotificationHistory />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedAdminRoute>
              <AdminProfilePage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="admin-profile"
          element={
            <ProtectedAdminRoute>
              <AdminProfilePage />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="header-settings"
          element={
            <ProtectedAdminRoute>
              <HeaderSettings />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="footer-settings"
          element={
            <ProtectedAdminRoute>
              <FooterSettings />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="settings/referral"
          element={
            <ProtectedAdminRoute>
              <ReferralSettingsPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="settings/shipping"
          element={
            <ProtectedAdminRoute>
              <ShippingChargesPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="settings/shipping-charges"
          element={
            <ProtectedAdminRoute>
              <ShippingChargesPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="settings/send-notification"
          element={
            <ProtectedAdminRoute>
              <SendNotificationPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="settings/notifications"
          element={
            <ProtectedAdminRoute>
              <SendNotificationPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="send-announcement"
          element={
            <ProtectedAdminRoute>
              <SendNotificationPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="notifications/send"
          element={
            <ProtectedAdminRoute>
              <SendNotificationPage />
            </ProtectedAdminRoute>
          }
        />

        {/* Fallback to Dashboard */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;
