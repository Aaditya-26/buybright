/**
 * BuyBright Admin — Modern Executive KPI Stat Card Component.
 * Ultra-refined typography, harmonious spacing, clean metric hierarchy,
 * modern trend pills, and responsive layout.
 */

import React from 'react';

export interface ReportStatData {
  id?: string;
  label: string;
  value: string;
  icon: string;
  color: string;
  change?: string;
  isPositive?: boolean;
  subtext?: string;
  badge?: string;
}

interface ReportStatCardProps {
  stat: ReportStatData;
}

export const ReportStatCard: React.FC<ReportStatCardProps> = ({ stat }) => {
  const isPositive = stat.isPositive !== false;

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '14px',
        border: '1px solid #e2e8f0',
        padding: '18px 20px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 4px 10px -3px rgba(15, 23, 42, 0.03)';
        e.currentTarget.style.borderColor = `${stat.color}50`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)';
        e.currentTarget.style.borderColor = '#e2e8f0';
      }}
    >
      {/* Subtle Top Accent Line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: stat.color,
          opacity: 0.85,
        }}
      />

      {/* Header Row: Title & Modern Icon */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '12px',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '0.84rem',
              fontWeight: 600,
              color: '#475569',
              lineHeight: 1.3,
              marginBottom: stat.badge ? '4px' : '0px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={stat.label}
          >
            {stat.label}
          </div>

          {stat.badge && (
            <span
              style={{
                display: 'inline-block',
                fontSize: '0.68rem',
                fontWeight: 600,
                color: stat.color,
                background: `${stat.color}10`,
                padding: '1px 7px',
                borderRadius: '4px',
                border: `1px solid ${stat.color}25`,
                letterSpacing: '0.2px',
              }}
            >
              {stat.badge}
            </span>
          )}
        </div>

        {/* Floating Rounded Icon */}
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: `${stat.color}12`,
            color: stat.color,
            border: `1px solid ${stat.color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.05rem',
            flexShrink: 0,
            transition: 'transform 0.2s ease',
          }}
        >
          <i className={stat.icon} />
        </div>
      </div>

      {/* Middle: Prominent Value */}
      <div style={{ marginBottom: '14px' }}>
        <div
          style={{
            fontSize: '1.65rem',
            fontWeight: 700,
            color: '#0f172a',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {stat.value}
        </div>
      </div>

      {/* Footer Row: Clean Trend Indicator & Subtext */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          paddingTop: '10px',
          borderTop: '1px solid #f1f5f9',
          fontSize: '0.76rem',
          flexWrap: 'nowrap',
          overflow: 'hidden',
        }}
      >
        {stat.change && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 600,
              fontSize: '0.72rem',
              padding: '2px 6px',
              borderRadius: '5px',
              background: isPositive ? '#f0fdf4' : '#fef2f2',
              color: isPositive ? '#15803d' : '#b91c1c',
              border: `1px solid ${isPositive ? '#bbf7d0' : '#fecaca'}`,
              flexShrink: 0,
            }}
          >
            <i
              className={isPositive ? 'fa-solid fa-arrow-trend-up' : 'fa-solid fa-arrow-trend-down'}
              style={{ fontSize: '0.65rem' }}
            />
            <span>{stat.change}</span>
          </span>
        )}

        <span
          style={{
            color: '#64748b',
            fontWeight: 500,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: '0.76rem',
          }}
          title={stat.subtext}
        >
          {stat.subtext || 'Platform metric'}
        </span>
      </div>
    </div>
  );
};

export default ReportStatCard;
