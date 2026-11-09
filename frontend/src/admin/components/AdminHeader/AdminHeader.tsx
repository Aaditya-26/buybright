/**
 * AdminHeader Component.
 * Executive sticky top bar with hamburger menu toggle, global search,
 * interactive notification dropdown, and admin profile menu.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { useToast } from '../../../context/ToastContext';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onSearch?: (query: string) => void;
  searchValue?: string;
  searchPlaceholder?: string;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  icon: string;
  color: string;
  link: string;
  read: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  onSearch,
  searchValue = '',
  searchPlaceholder = 'Search orders, SKU, sellers, products...',
  onToggleSidebar,
  isSidebarCollapsed = false,
}) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { adminUser, logout } = useAdminAuth();

  // Dropdown states
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'New Marketplace Order Placed',
      message: 'John Doe placed order #BB-892144-IN (₹11,205)',
      time: '12m ago',
      icon: 'fa-solid fa-boxes-packing',
      color: '#0d9488',
      link: '/admin/orders',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Low Stock Alert',
      message: 'Wireless Noise-Canceling Earbuds Pro has only 9 units remaining',
      time: '35m ago',
      icon: 'fa-solid fa-triangle-exclamation',
      color: '#f59e0b',
      link: '/admin/products',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'Seller Verification Request',
      message: 'TechVibe Solutions submitted merchant credentials for approval',
      time: '2h ago',
      icon: 'fa-solid fa-store',
      color: '#3b82f6',
      link: '/admin/users',
      read: false,
    },
    {
      id: 'notif-4',
      title: 'Logistics Manifest Synced',
      message: 'BlueDart Express confirmed 4 shipments dispatched',
      time: '5h ago',
      icon: 'fa-solid fa-truck-fast',
      color: '#10b981',
      link: '/admin/orders',
      read: true,
    },
  ]);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Handle outside click to close dropdowns
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setIsNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.', 'info');
  };

  const handleNotificationClick = (link: string, id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setIsNotificationOpen(false);
    navigate(link);
  };

  const handleLogout = () => {
    logout();
    showToast('Signed out from Administrator Portal.', 'info');
    navigate('/admin/login');
  };

  return (
    <header className="admin-header" role="banner">
      {/* Left Section: Menu Toggle Button, Mobile Logo, & Page Heading */}
      <div className="header-left">
        {onToggleSidebar && (
          <button
            type="button"
            className="btn-header-menu"
            onClick={onToggleSidebar}
            title={isSidebarCollapsed ? 'Expand Navigation Sidebar' : 'Collapse Navigation Sidebar'}
            aria-label="Toggle navigation menu"
          >
            <i className="fa-solid fa-bars" />
          </button>
        )}

        {/* Mobile Brand Logo: Hidden on desktop, shown on mobile (<= 992px) */}
        <Link to="/admin/dashboard" className="header-mobile-brand">
          <div className="header-mobile-logo-box">
            <img
              src="/images/logo.webp"
              alt="BuyBright Logo"
              className="header-mobile-logo"
            />
          </div>
          <div className="header-mobile-brand-text">
            <strong>BuyBright</strong>
            <span>Admin</span>
          </div>
        </Link>

        <div className="page-title-box">
          <h1>{title}</h1>
          {subtitle && <span>{subtitle}</span>}
        </div>
      </div>

      {/* Right Section: Global Search, Notification Center, & Profile Dropdown */}
      <div className="header-right">
        {onSearch && (
          <div className="admin-search-bar">
            <i className="fa-solid fa-magnifying-glass" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearch(e.target.value)}
              aria-label="Global Admin Search"
            />
          </div>
        )}

        {/* 1. Notification Dropdown Trigger */}
        <div className="header-dropdown-container" ref={notificationRef}>
          <button
            type="button"
            className={`header-action-btn ${isNotificationOpen ? 'active' : ''}`}
            onClick={() => {
              setIsNotificationOpen(!isNotificationOpen);
              setIsProfileOpen(false);
            }}
            title="System Notifications"
            aria-expanded={isNotificationOpen}
          >
            <i className="fa-regular fa-bell" />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>

          {isNotificationOpen && (
            <div className="admin-dropdown-menu notification-dropdown">
              <div className="dropdown-header">
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                    Notifications
                  </h4>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {unreadCount} unread alert{unreadCount !== 1 ? 's' : ''}
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="btn-dropdown-action"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="dropdown-body notification-list">
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                    <i className="fa-solid fa-bell-slash" style={{ fontSize: '1.5rem', marginBottom: '6px', display: 'block' }} />
                    No notifications
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleNotificationClick(item.link, item.id)}
                      className={`notification-item ${!item.read ? 'unread' : ''}`}
                    >
                      <div
                        className="notif-icon-box"
                        style={{ background: `${item.color}18`, color: item.color }}
                      >
                        <i className={item.icon} />
                      </div>
                      <div className="notif-content">
                        <div className="notif-title">{item.title}</div>
                        <p className="notif-message">{item.message}</p>
                        <span className="notif-time">{item.time}</span>
                      </div>
                      {!item.read && <span className="unread-dot" />}
                    </div>
                  ))
                )}
              </div>

              <div className="dropdown-footer">
                <Link
                  to="/admin/orders"
                  onClick={() => setIsNotificationOpen(false)}
                  style={{ textDecoration: 'none', color: '#0d9488', fontSize: '0.8rem', fontWeight: 700 }}
                >
                  View All Orders &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* 2. Admin Profile Dropdown */}
        <div className="header-dropdown-container" ref={profileRef}>
          <button
            type="button"
            className={`admin-profile-btn ${isProfileOpen ? 'active' : ''}`}
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationOpen(false);
            }}
            title="Administrator Profile"
            aria-expanded={isProfileOpen}
          >
            <div className="profile-avatar">
              <span>{adminUser?.avatar || 'AD'}</span>
            </div>
            <div className="profile-details-preview">
              <span className="profile-name">{adminUser?.name || '  Admin Director'}</span>
              <span className="profile-role">{adminUser?.role || 'Super Admin'}</span>
            </div>
            <i className={`fa-solid fa-chevron-down profile-chevron ${isProfileOpen ? 'rotate' : ''}`} />
          </button>

          {isProfileOpen && (
            <div className="admin-dropdown-menu profile-dropdown">
              <div className="profile-menu-header">
                <div className="profile-avatar-large">
                  <span>{adminUser?.avatar || 'AD'}</span>
                </div>
                <div className="profile-header-info">
                  <strong>{adminUser?.name || '  Admin Director'}</strong>
                  <span className="profile-email">{adminUser?.email || 'admin@.com'}</span>
                  <span className="profile-badge-pill">{adminUser?.role || 'Super Administrator'}</span>
                </div>
              </div>

              <div className="dropdown-divider" />

              <div className="profile-menu-links">
                <Link
                  to="/admin/profile"
                  className="profile-menu-item"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <i className="fa-solid fa-user-pen" />
                  <span>Admin Profile</span>
                </Link>
                <Link
                  to="/admin/settings"
                  className="profile-menu-item"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <i className="fa-solid fa-user-gear" />
                  <span>Platform Settings</span>
                </Link>

                  

                
              </div>

              <div className="dropdown-divider" />

              <div style={{ padding: '6px' }}>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="profile-menu-item logout"
                >
                  <i className="fa-solid fa-right-from-bracket" />
                  <span>Sign Out of Admin</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
