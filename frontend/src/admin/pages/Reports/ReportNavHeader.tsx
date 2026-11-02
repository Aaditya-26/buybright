/**
 * BuyBright Admin — Report Navigation Header Component.
 * Modern pill sub-navigation bar to quickly switch between independent report pages.
 */

import React from 'react';
import { NavLink } from 'react-router-dom';

export interface ReportNavItem {
  to: string;
  label: string;
  icon: string;
  badge?: number | string;
}

export const REPORT_NAV_ITEMS: ReportNavItem[] = [
  { to: '/admin/reports', label: 'Overview Hub', icon: 'fa-solid fa-chart-pie' },
  { to: '/admin/reports/sales', label: 'Sales Report', icon: 'fa-solid fa-chart-line', badge: 8 },
  { to: '/admin/reports/orders', label: 'Orders Report', icon: 'fa-solid fa-box-open', badge: 8 },
  { to: '/admin/reports/products', label: 'Product Report', icon: 'fa-solid fa-boxes-stacked', badge: 7 },
  { to: '/admin/reports/categories', label: 'Category Report', icon: 'fa-solid fa-folder-tree', badge: 5 },
  { to: '/admin/reports/customers', label: 'Customer Report', icon: 'fa-solid fa-users', badge: 6 },
  { to: '/admin/reports/referrals', label: 'Referral Report', icon: 'fa-solid fa-user-plus', badge: 5 },
  { to: '/admin/reports/wallet', label: 'Wallet Report', icon: 'fa-solid fa-wallet', badge: 5 },
  { to: '/admin/reports/coupons', label: 'Coupon Report', icon: 'fa-solid fa-ticket', badge: 5 },
  { to: '/admin/reports/carts', label: 'Cart Report', icon: 'fa-solid fa-cart-shopping', badge: 5 },
];

export const ReportNavHeader: React.FC = () => {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '14px',
        border: '1px solid #e2e8f0',
        padding: '8px 12px',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '2px',
        }}
      >
        {REPORT_NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin/reports'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '10px',
              textDecoration: 'none',
              background: isActive ? '#0d9488' : 'transparent',
              color: isActive ? '#ffffff' : '#475569',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.83rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            })}
          >
            <i className={item.icon} style={{ fontSize: '0.86rem' }} />
            <span>{item.label}</span>
            {item.badge !== undefined && (
              <span
                style={{
                  background: 'rgba(0,0,0,0.08)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '8px',
                }}
              >
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};
