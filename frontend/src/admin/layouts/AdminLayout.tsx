import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AdminSidebar } from '../components/AdminSidebar/AdminSidebar';
import { AdminHeader } from '../components/AdminHeader/AdminHeader';
import { AdminFooter } from '../components/AdminFooter/AdminFooter';
import '../styles/admin.scss';

interface AdminLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onSearch?: (query: string) => void;
  searchValue?: string;
  searchPlaceholder?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  title,
  subtitle,
  children,
  onSearch,
  searchValue,
  searchPlaceholder,
}) => {
  const location = useLocation();

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return (
        localStorage.getItem('buybright_admin_sidebar_collapsed') === 'true' ||
        localStorage.getItem('buybright_admin_sidebar_collapsed') === 'true'
      );
    } catch {
      return false;
    }
  });

  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleToggleSidebar = () => {
    if (window.innerWidth <= 992) {
      setMobileOpen((prev) => !prev);
    } else {
      setCollapsed((prev) => {
        const next = !prev;
        try {
          localStorage.setItem('buybright_admin_sidebar_collapsed', String(next));
          localStorage.setItem('buybright_admin_sidebar_collapsed', String(next));
        } catch {}
        return next;
      });
    }
  };

  const handleCloseMobile = () => {
    setMobileOpen(false);
  };

  return (
    <div className="admin-portal-wrapper">
      {/* Mobile Drawer Overlay Backdrop */}
      {mobileOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={handleCloseMobile}
          aria-label="Close navigation overlay"
        />
      )}

      {/* 1. White Sidebar Navigation */}
      <AdminSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={handleToggleSidebar}
        onCloseMobile={handleCloseMobile}
      />

      {/* 2. Main Executive Canvas */}
      <div className="admin-main-area">
        <AdminHeader
          title={title}
          subtitle={subtitle}
          onSearch={onSearch}
          searchValue={searchValue}
          searchPlaceholder={searchPlaceholder}
          onToggleSidebar={handleToggleSidebar}
          isSidebarCollapsed={collapsed}
        />

        <main className="admin-content-body">{children}</main>

        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminLayout;
