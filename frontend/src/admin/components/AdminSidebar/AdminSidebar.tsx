/**
 * AdminSidebar Component.
 * White-background navigation sidebar with active pills, collapsible state, and user profile footer.
 * Features expandable 'Manage Users' and 'Home Page' dropdown modules.
 */

import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { useToast } from '../../../context/ToastContext';
import { useFestival } from '../../../context/FestivalContext';
import { getContactEnquiries } from '../../data/contactData';
import { getOrders } from '../../data/ordersData';
import { getCustomers } from '../../data/customersData';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { logout, adminUser } = useAdminAuth();
  const { activeFestival } = useFestival();

  const isUserModuleActive =
    location.pathname.startsWith('/admin/users') || location.pathname.startsWith('/admin/roles');

  const isHomeModuleActive =
    location.pathname.startsWith('/admin/home') || location.pathname.startsWith('/admin/flash-sales');
  const isAboutModuleActive = location.pathname.startsWith('/admin/about');
  const isContactModuleActive = location.pathname.startsWith('/admin/contact');
  const isProductsModuleActive =
    location.pathname.startsWith('/admin/products') ||
    location.pathname.startsWith('/admin/categories');
  const isOrdersModuleActive = location.pathname.startsWith('/admin/orders');
  const isReportsModuleActive = location.pathname.startsWith('/admin/reports');
  const isSettingsModuleActive =
    location.pathname.startsWith('/admin/settings') ||
    location.pathname.startsWith('/admin/notifications') ||
    location.pathname.startsWith('/admin/header-settings') ||
    location.pathname.startsWith('/admin/footer-settings');

  const [usersSubmenuOpen, setUsersSubmenuOpen] = useState<boolean>(() => isUserModuleActive);
  const [homeSubmenuOpen, setHomeSubmenuOpen] = useState<boolean>(() => isHomeModuleActive);
  const [aboutSubmenuOpen, setAboutSubmenuOpen] = useState<boolean>(() => isAboutModuleActive);
  const [contactSubmenuOpen, setContactSubmenuOpen] = useState<boolean>(() => isContactModuleActive);
  const [productsSubmenuOpen, setProductsSubmenuOpen] = useState<boolean>(() => isProductsModuleActive);
  const [ordersSubmenuOpen, setOrdersSubmenuOpen] = useState<boolean>(() => isOrdersModuleActive);
  const [reportsSubmenuOpen, setReportsSubmenuOpen] = useState<boolean>(() => isReportsModuleActive);
  const [settingsSubmenuOpen, setSettingsSubmenuOpen] = useState<boolean>(() => isSettingsModuleActive);

  // Keep submenus open when navigated into corresponding subpages
  useEffect(() => {
    if (isUserModuleActive) {
      setUsersSubmenuOpen(true);
    }
  }, [isUserModuleActive]);

  useEffect(() => {
    if (isHomeModuleActive) {
      setHomeSubmenuOpen(true);
    }
  }, [isHomeModuleActive]);

  useEffect(() => {
    if (isAboutModuleActive) {
      setAboutSubmenuOpen(true);
    }
  }, [isAboutModuleActive]);

  useEffect(() => {
    if (isContactModuleActive) {
      setContactSubmenuOpen(true);
    }
  }, [isContactModuleActive]);

  useEffect(() => {
    if (isProductsModuleActive) {
      setProductsSubmenuOpen(true);
    }
  }, [isProductsModuleActive]);

  useEffect(() => {
    if (isOrdersModuleActive) {
      setOrdersSubmenuOpen(true);
    }
  }, [isOrdersModuleActive]);

  useEffect(() => {
    if (isReportsModuleActive) {
      setReportsSubmenuOpen(true);
    }
  }, [isReportsModuleActive]);

  useEffect(() => {
    if (isSettingsModuleActive) {
      setSettingsSubmenuOpen(true);
    }
  }, [isSettingsModuleActive]);

  const handleLogout = () => {
    onCloseMobile?.();
    logout();
    showToast('Signed out from Administrator Portal.', 'info');
    navigate('/admin/login');
  };

  const handleToggleUsersSubmenu = () => {
    if (collapsed && onToggleCollapse) {
      onToggleCollapse();
      setUsersSubmenuOpen(true);
    } else {
      setUsersSubmenuOpen((prev) => !prev);
    }
  };

  const handleToggleHomeSubmenu = () => {
    if (collapsed && onToggleCollapse) {
      onToggleCollapse();
      setHomeSubmenuOpen(true);
    } else {
      setHomeSubmenuOpen((prev) => !prev);
    }
  };

  const handleToggleAboutSubmenu = () => {
    if (collapsed && onToggleCollapse) {
      onToggleCollapse();
      setAboutSubmenuOpen(true);
    } else {
      setAboutSubmenuOpen((prev) => !prev);
    }
  };

  const handleToggleContactSubmenu = () => {
    if (collapsed && onToggleCollapse) {
      onToggleCollapse();
      setContactSubmenuOpen(true);
    } else {
      setContactSubmenuOpen((prev) => !prev);
    }
  };

  const handleToggleProductsSubmenu = () => {
    if (collapsed && onToggleCollapse) {
      onToggleCollapse();
      setProductsSubmenuOpen(true);
    } else {
      setProductsSubmenuOpen((prev) => !prev);
    }
  };

  const handleToggleOrdersSubmenu = () => {
    if (collapsed && onToggleCollapse) {
      onToggleCollapse();
      setOrdersSubmenuOpen(true);
    } else {
      setOrdersSubmenuOpen((prev) => !prev);
    }
  };

  const handleToggleReportsSubmenu = () => {
    if (collapsed && onToggleCollapse) {
      onToggleCollapse();
      setReportsSubmenuOpen(true);
    } else {
      setReportsSubmenuOpen((prev) => !prev);
    }
  };

  const handleToggleSettingsSubmenu = () => {
    if (collapsed && onToggleCollapse) {
      onToggleCollapse();
      setSettingsSubmenuOpen(true);
    } else {
      setSettingsSubmenuOpen((prev) => !prev);
    }
  };

  const newEnquiriesCount = getContactEnquiries().filter((e) => e.status === 'New').length;

  const orders = getOrders();
  const placedCount = orders.filter((o) => o.orderStatus === 'Placed').length;
  const inProcessCount = orders.filter((o) => o.orderStatus === 'In Process').length;
  const readyCount = orders.filter((o) => o.orderStatus === 'Ready to Pick').length;
  const outCount = orders.filter((o) => o.orderStatus === 'Out for Delivery').length;
  const deliveredCount = orders.filter((o) => o.orderStatus === 'Delivered').length;
  const cancelledCount = orders.filter((o) => o.orderStatus === 'Cancelled').length;
  const returnedCount = orders.filter((o) => o.orderStatus === 'Returned').length;
  const customersCount = getCustomers().length;

  const handleLinkClick = () => {
    onCloseMobile?.();
  };

  return (
    <aside
      className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
      aria-label="Admin Navigation Sidebar"
    >
      {/* Sidebar Header: Brand & Mobile Close Toggle */}
      <div className="sidebar-header">
        <Link to="/admin/dashboard" className="sidebar-brand" onClick={handleLinkClick}>
          <div className="brand-logo-container">
            <img
              src="/images/logo.webp"
              alt="BuyBright Official Logo"
              className="sidebar-brand-logo"
            />
          </div>
          <div className="sidebar-brand-text">
            <strong>BuyBright</strong>
            <span>Admin Portal</span>
          </div>
        </Link>

        {/* Mobile close button (shown only on mobile screens) */}
        {onCloseMobile && (
          <button
            type="button"
            className="btn-sidebar-mobile-close"
            onClick={onCloseMobile}
            aria-label="Close navigation"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <span className="nav-section-title">Main Menu</span>

        {/* Dashboard */}
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          title={collapsed ? 'Dashboard' : undefined}
          onClick={handleLinkClick}
        >
          <i className="fa-solid fa-chart-pie" />
          <span className="nav-label">Dashboard</span>
        </NavLink>

        {/* Manage Users Module (Expandable Dropdown Submenu) */}
        <div className="admin-nav-group">
          <div
            className={`admin-nav-item has-submenu ${isUserModuleActive && !usersSubmenuOpen ? 'active' : ''} ${isUserModuleActive && usersSubmenuOpen ? 'parent-active' : ''}`}
            onClick={handleToggleUsersSubmenu}
            title={collapsed ? 'Manage Users' : undefined}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToggleUsersSubmenu();
              }
            }}
          >
            <i className="fa-solid fa-users-gear" />
            <span className="nav-label">Manage Users</span>
            <i
              className={`fa-solid fa-chevron-down chevron-icon ${usersSubmenuOpen ? 'open' : ''}`}
            />
          </div>

          {/* Users Submenu Accordion Items */}
          {usersSubmenuOpen && !collapsed && (
            <div className="admin-submenu">
              <NavLink
                to="/admin/users"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-users" />
                <span>All Users</span>
              </NavLink>
              <NavLink
                to="/admin/roles"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-user-shield" />
                <span>All Roles</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Home Page Module (Expandable Dropdown Submenu) */}
        <div className="admin-nav-group">
          <div
            className={`admin-nav-item has-submenu ${isHomeModuleActive && !homeSubmenuOpen ? 'active' : ''} ${isHomeModuleActive && homeSubmenuOpen ? 'parent-active' : ''}`}
            onClick={handleToggleHomeSubmenu}
            title={collapsed ? 'Home Page' : undefined}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToggleHomeSubmenu();
              }
            }}
          >
            <i className="fa-solid fa-house-laptop" />
            <span className="nav-label">Home Page</span>
            <i
              className={`fa-solid fa-chevron-down chevron-icon ${homeSubmenuOpen ? 'open' : ''}`}
            />
          </div>

          {/* Home Submenu Accordion Items */}
          {homeSubmenuOpen && !collapsed && (
            <div className="admin-submenu">
              <NavLink
                to="/admin/home/banners"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-panorama" />
                <span>Home Banner</span>
              </NavLink>
              <NavLink
                to="/admin/home/advertisements"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-rectangle-ad" />
                <span>Home Advertisement</span>
              </NavLink>
               
            </div>
          )}
        </div>

        {/* About Page Module (Expandable Dropdown Submenu) */}
        <div className="admin-nav-group">
          <div
            className={`admin-nav-item has-submenu ${isAboutModuleActive && !aboutSubmenuOpen ? 'active' : ''} ${isAboutModuleActive && aboutSubmenuOpen ? 'parent-active' : ''}`}
            onClick={handleToggleAboutSubmenu}
            title={collapsed ? 'About Page' : undefined}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToggleAboutSubmenu();
              }
            }}
          >
            <i className="fa-solid fa-circle-info" />
            <span className="nav-label">About Page</span>
            <i
              className={`fa-solid fa-chevron-down chevron-icon ${aboutSubmenuOpen ? 'open' : ''}`}
            />
          </div>

          {/* About Submenu Accordion Items */}
          {aboutSubmenuOpen && !collapsed && (
            <div className="admin-submenu">
              <NavLink
                to="/admin/about"
                end
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-table-cells-large" />
                <span>All Sections</span>
              </NavLink>
              <NavLink
                to="/admin/about/hero"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-bullhorn" />
                <span>Hero &amp; Metrics</span>
              </NavLink>
              <NavLink
                to="/admin/about/who-we-are"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-user-doctor" />
                <span>Who We Are</span>
              </NavLink>
              <NavLink
                to="/admin/about/mission-vision"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-bullseye" />
                <span>Mission &amp; Vision</span>
              </NavLink>
              <NavLink
                to="/admin/about/journey"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-timeline" />
                <span>Our Journey</span>
              </NavLink>
              <NavLink
                to="/admin/about/pillars"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-shield-halved" />
                <span>Trust Pillars</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Contact Module (Expandable Dropdown Submenu) */}
        <div className="admin-nav-group">
          <div
            className={`admin-nav-item has-submenu ${isContactModuleActive && !contactSubmenuOpen ? 'active' : ''} ${isContactModuleActive && contactSubmenuOpen ? 'parent-active' : ''}`}
            onClick={handleToggleContactSubmenu}
            title={collapsed ? 'Contact Desk' : undefined}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToggleContactSubmenu();
              }
            }}
          >
            <i className="fa-solid fa-headset" />
            <span className="nav-label">Contact Desk</span>
            
            <i
              className={`fa-solid fa-chevron-down chevron-icon ${contactSubmenuOpen ? 'open' : ''}`}
            />
          </div>

          {/* Contact Submenu Accordion Items */}
          {contactSubmenuOpen && !collapsed && (
            <div className="admin-submenu">
              <NavLink
                to="/admin/contact/enquiries"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-inbox" />
                <span>Contact Enquiries</span>
                {newEnquiriesCount > 0 && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      backgroundColor: '#fee2e2',
                      color: '#ef4444',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: '10px',
                    }}
                  >
                    {newEnquiriesCount}
                  </span>
                )}
              </NavLink>
              <NavLink
                to="/admin/contact/customizer"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-sliders" />
                <span>Contact Customizer</span>
              </NavLink>
            </div>
          )}
        </div>

        <span className="nav-section-title"> Products   Management</span>
 

        {/* Products Module (Expandable Dropdown Submenu) */}
        <div className="admin-nav-group">
          <div
            className={`admin-nav-item has-submenu ${isProductsModuleActive && !productsSubmenuOpen ? 'active' : ''} ${isProductsModuleActive && productsSubmenuOpen ? 'parent-active' : ''}`}
            onClick={handleToggleProductsSubmenu}
            title={collapsed ? 'Product Management' : undefined}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToggleProductsSubmenu();
              }
            }}
          >
            <i className="fa-solid fa-boxes-stacked" />
            <span className="nav-label">Products</span>
            <i
              className={`fa-solid fa-chevron-down chevron-icon ${productsSubmenuOpen ? 'open' : ''}`}
            />
          </div>

          {/* Products Submenu Accordion Items */}
          {productsSubmenuOpen && !collapsed && (
            <div className="admin-submenu">
              <NavLink
                to="/admin/products/banners"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-panorama" />
                <span>Product Banners</span>
              </NavLink>
              <NavLink
                to="/admin/products/types"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-shapes" />
                <span>Product Types</span>
              </NavLink>
              <NavLink
                to="/admin/products/categories"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-layer-group" />
                <span>Categories</span>
              </NavLink>
              <NavLink
                to="/admin/products/subcategories"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-sitemap" />
                <span>Sub-Categories</span>
              </NavLink>
              <NavLink
                to="/admin/products/gst"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-receipt" />
                <span>GST Rates</span>
              </NavLink>
              <NavLink
                to="/admin/products/hsn"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-barcode" />
                <span>HSN Codes</span>
              </NavLink>
              <NavLink
                to="/admin/products/brand-categories"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-tags" />
                <span>Brand Categories</span>
              </NavLink>
              <NavLink
                to="/admin/products/brands"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-certificate" />
                <span>Brands</span>
              </NavLink>
              <NavLink
                to="/admin/products"
                end
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-teeth" />
                <span>All Products</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* cart */}
        <NavLink
          to="/admin/cart"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          title={collapsed ? 'Cart' : undefined}
          onClick={handleLinkClick}
        >
          <i className="fa-solid fa-cart-shopping" />
          <span className="nav-label">Cart</span>
        </NavLink>

        {/* Wishlist */}
        <NavLink
          to="/admin/wishlist"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          title={collapsed ? 'Wishlist' : undefined}
          onClick={handleLinkClick}
        >
          <i className="fa-solid fa-heart" style={{ color: '#ec4899' }} />
          <span className="nav-label">Wishlist</span>
          <span
            style={{
              marginLeft: 'auto',
              backgroundColor: '#fdf2f8',
              color: '#db2777',
              border: '1px solid #fbcfe8',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '1px 6px',
              borderRadius: '10px',
            }}
          >
            Saved
          </span>
        </NavLink>

        <span className="nav-section-title"> Order  Management </span>

        {/* Order Mgmt Module (Expandable Dropdown Submenu) */}
        <div className="admin-nav-group">
          <div
            className={`admin-nav-item has-submenu ${isOrdersModuleActive && !ordersSubmenuOpen ? 'active' : ''} ${isOrdersModuleActive && ordersSubmenuOpen ? 'parent-active' : ''}`}
            onClick={handleToggleOrdersSubmenu}
            title={collapsed ? 'Order' : undefined}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToggleOrdersSubmenu();
              }
            }}
          >
            <i className="fa-solid fa-boxes-packing" />
            <span className="nav-label">Order </span>
            {placedCount > 0 && (
              <span
                style={{
                  marginLeft: 'auto',
                  marginRight: '6px',
                  backgroundColor: '#0d9488',
                  color: '#ffffff',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: '10px',
                }}
              >
                {placedCount} New
              </span>
            )}
            <i
              className={`fa-solid fa-chevron-down chevron-icon ${ordersSubmenuOpen ? 'open' : ''}`}
            />
          </div>

          {/* Orders Submenu Accordion Items */}
          {ordersSubmenuOpen && !collapsed && (
            <div className="admin-submenu">
              <NavLink
                to="/admin/orders/new"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-cart-arrow-down" style={{ color: '#0284c7' }} />
                <span>New Orders Placed</span>
                {placedCount > 0 && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      backgroundColor: '#e0f2fe',
                      color: '#0369a1',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: '10px',
                    }}
                  >
                    {placedCount}
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/admin/orders/in-process"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-arrows-rotate" style={{ color: '#d97706' }} />
                <span>Orders In Process</span>
                {inProcessCount > 0 && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      backgroundColor: '#fef3c7',
                      color: '#b45309',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: '10px',
                    }}
                  >
                    {inProcessCount}
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/admin/orders/ready-to-pick"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-box-open" style={{ color: '#4f46e5' }} />
                <span>Orders Ready to Pick</span>
                {readyCount > 0 && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      backgroundColor: '#e0e7ff',
                      color: '#4338ca',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: '10px',
                    }}
                  >
                    {readyCount}
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/admin/orders/out-for-delivery"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-truck-fast" style={{ color: '#9333ea' }} />
                <span>Orders Out for Delivery</span>
                {outCount > 0 && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      backgroundColor: '#f3e8ff',
                      color: '#7e22ce',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: '10px',
                    }}
                  >
                    {outCount}
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/admin/orders/delivered"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-circle-check" style={{ color: '#16a34a' }} />
                <span>Orders Delivered</span>
                {deliveredCount > 0 && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      backgroundColor: '#dcfce7',
                      color: '#15803d',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: '10px',
                    }}
                  >
                    {deliveredCount}
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/admin/orders/cancelled"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-ban" style={{ color: '#dc2626' }} />
                <span>Orders Cancelled</span>
                {cancelledCount > 0 && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      backgroundColor: '#fee2e2',
                      color: '#b91c1c',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: '10px',
                    }}
                  >
                    {cancelledCount}
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/admin/orders/returned"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-arrow-rotate-left" style={{ color: '#ea580c' }} />
                <span>Orders Returned</span>
                {returnedCount > 0 && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      backgroundColor: '#ffedd5',
                      color: '#c2410c',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: '10px',
                    }}
                  >
                    {returnedCount}
                  </span>
                )}
              </NavLink>
            </div>
          )}
        </div>

        {/* Customers Module */}
        <NavLink
          to="/admin/customers"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          title={collapsed ? 'Customers' : undefined}
          onClick={handleLinkClick}
        >
          <i className="fa-solid fa-users-viewfinder" />
          <span className="nav-label">Customers</span>
          {customersCount > 0 && (
            <span
              style={{
                marginLeft: 'auto',
                backgroundColor: '#f0fdfa',
                color: '#0d9488',
                border: '1px solid #ccfbf1',
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: '10px',
              }}
            >
              {customersCount}
            </span>
          )}
        </NavLink>

        {/* Customer Wallet Module */}
        <NavLink
          to="/admin/wallet"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          title={collapsed ? 'Wallet' : undefined}
          onClick={handleLinkClick}
        >
          <i className="fa-solid fa-wallet" />
          <span className="nav-label">Wallet</span>
        </NavLink>

        {/* Flash Sales Promotional Module */}
        <NavLink
          to="/admin/flash-sales"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          title={collapsed ? 'Flash Sales' : undefined}
          onClick={handleLinkClick}
        >
          <i className="fa-solid fa-bolt-lightning" style={{ color: '#f59e0b' }} />
          <span className="nav-label">Flash Sales</span>
          <span
            style={{
              marginLeft: 'auto',
              backgroundColor: '#fef3c7',
              color: '#b45309',
              border: '1px solid #fde68a',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '1px 6px',
              borderRadius: '10px',
            }}
          >
            ⚡ Live
          </span>
        </NavLink>

        {/* Festival & Campaign Themes Module */}
        <NavLink
          to="/admin/festival-theme"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          title={collapsed ? 'Festival Themes' : undefined}
          onClick={handleLinkClick}
        >
          <i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#d97706' }} />
          <span className="nav-label">Festival Themes</span>
          {activeFestival && (
            <span
              style={{
                marginLeft: 'auto',
                backgroundColor: '#fef3c7',
                color: '#b45309',
                border: '1px solid #fde68a',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '1px 6px',
                borderRadius: '10px',
              }}
            >
              Active
            </span>
          )}
        </NavLink>

        {/* Icons & Festive Graphics Library Module */}
        <NavLink
          to="/admin/icon-library"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          title={collapsed ? 'Icons Library' : undefined}
          onClick={handleLinkClick}
        >
          <i className="fa-solid fa-icons" style={{ color: '#0d9488' }} />
          <span className="nav-label">Icons Library</span>
          <span
            style={{
              marginLeft: 'auto',
              backgroundColor: '#f0fdfa',
              color: '#0d9488',
              border: '1px solid #ccfbf1',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '1px 6px',
              borderRadius: '10px',
            }}
          >
            Library
          </span>
        </NavLink>

        {/* Customer Reviews & Ratings Module */}
        <NavLink
          to="/admin/reviews"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          title={collapsed ? 'Reviews & Ratings' : undefined}
          onClick={handleLinkClick}
        >
          <i className="fa-solid fa-star" style={{ color: '#f59e0b' }} />
          <span className="nav-label">Reviews &amp; Ratings</span>
          <span
            style={{
              marginLeft: 'auto',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              border: '1px solid #a7f3d0',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '1px 6px',
              borderRadius: '10px',
            }}
          >
            ★ 4.8
          </span>
        </NavLink>

        {/* Reports & Business Intelligence Expandable Module */}
        <div className="admin-nav-group">
          <div
            className={`admin-nav-item has-submenu ${isReportsModuleActive ? 'active' : ''}`}
            onClick={handleToggleReportsSubmenu}
            role="button"
            tabIndex={0}
            title={collapsed ? 'Reports & Analytics' : undefined}
          >
            <i className="fa-solid fa-chart-pie" style={{ color: '#0d9488' }} />
            <span className="nav-label">Reports &amp; Analytics</span>
            <span
              style={{
                marginLeft: 'auto',
                backgroundColor: '#f0fdfa',
                color: '#0d9488',
                border: '1px solid #ccfbf1',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '1px 6px',
                borderRadius: '10px',
                marginRight: '6px',
              }}
            >
              9 Hubs
            </span>
            <i
              className={`fa-solid fa-chevron-down submenu-arrow ${reportsSubmenuOpen ? 'rotated' : ''}`}
              aria-hidden="true"
            />
          </div>

          {reportsSubmenuOpen && !collapsed && (
            <div className="admin-submenu">
              <NavLink
                to="/admin/reports"
                end
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-gauge-high" />
                <span>Overview Hub</span>
              </NavLink>

              <NavLink
                to="/admin/reports/sales"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-chart-line" />
                <span>Sales Report</span>
              </NavLink>

              <NavLink
                to="/admin/reports/orders"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-box-open" />
                <span>Orders Report</span>
              </NavLink>

              <NavLink
                to="/admin/reports/products"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-boxes-stacked" />
                <span>Product Report</span>
              </NavLink>

              <NavLink
                to="/admin/reports/categories"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-folder-tree" />
                <span>Category Report</span>
              </NavLink>

              <NavLink
                to="/admin/reports/customers"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-users" />
                <span>Customer Report</span>
              </NavLink>

              <NavLink
                to="/admin/reports/referrals"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-user-plus" />
                <span>Referral Report</span>
              </NavLink>

              <NavLink
                to="/admin/reports/wallet"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-wallet" />
                <span>Wallet Report</span>
              </NavLink>

              <NavLink
                to="/admin/reports/coupons"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-ticket" />
                <span>Coupon Report</span>
              </NavLink>

              <NavLink
                to="/admin/reports/carts"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-cart-shopping" />
                <span>Cart Report</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Settings Module (Expandable Dropdown Submenu) */}
        <div className="admin-nav-group">
          <div
            className={`admin-nav-item has-submenu ${isSettingsModuleActive && !settingsSubmenuOpen ? 'active' : ''} ${isSettingsModuleActive && settingsSubmenuOpen ? 'parent-active' : ''}`}
            onClick={handleToggleSettingsSubmenu}
            title={collapsed ? 'Settings' : undefined}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToggleSettingsSubmenu();
              }
            }}
          >
            <i className="fa-solid fa-sliders" />
            <span className="nav-label">Settings</span>
            <i
              className={`fa-solid fa-chevron-down chevron-icon ${settingsSubmenuOpen ? 'open' : ''}`}
            />
          </div>

          {/* Settings Submenu Accordion Items */}
          {settingsSubmenuOpen && !collapsed && (
            <div className="admin-submenu">
              <NavLink
                to="/admin/settings?tab=general"
                className={() =>
                  `admin-submenu-item ${
                    location.pathname === '/admin/settings' && (location.search.includes('tab=general') || !location.search)
                      ? 'active'
                      : ''
                  }`
                }
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-sliders" />
                <span>General Settings</span>
              </NavLink>

              <NavLink
                to="/admin/settings?tab=website"
                className={() =>
                  `admin-submenu-item ${
                    location.pathname === '/admin/settings' && location.search.includes('tab=website')
                      ? 'active'
                      : ''
                  }`
                }
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-globe" />
                <span>Website Settings</span>
              </NavLink>

             

              <NavLink
                to="/admin/notifications"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-list-check" />
                <span>Notification History</span>
              </NavLink>

              

              <NavLink
                to="/admin/footer-settings"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-table-cells" />
                <span>Footer Settings</span>
              </NavLink>

              <NavLink
                to="/admin/settings/referral"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-coins" />
                <span>Referral &amp; Points</span>
              </NavLink>

              <NavLink
                to="/admin/settings/shipping"
                className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <i className="fa-solid fa-truck-ramp-box" />
                <span>Shipping Charges</span>
              </NavLink>
            </div>
          )}
        </div>
      </nav>

      {/* Sidebar Footer: Admin Profile & Logout */}
      <div className="sidebar-footer">
        <div className="user-profile-widget">
          <div className="user-avatar">
            <span>{adminUser?.avatar || 'AD'}</span>
          </div>
          <div className="user-info-text">
            <strong>{adminUser?.name || '  Admin Director'}</strong>
            <span>{adminUser?.role || 'Super Administrator'}</span>
          </div>
        </div>
        <button
          type="button"
          className="btn-logout"
          onClick={handleLogout}
          title="Sign Out of Admin"
        >
          <i className="fa-solid fa-right-from-bracket" />
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
