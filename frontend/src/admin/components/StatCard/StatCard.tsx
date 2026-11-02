/**
 * StatCard Component.
 * Executive metric card with icon placed on the left side, bold numbers,
 * positive/negative percentage trends, and interactive hover animations.
 */

import React from 'react';
import type { StatItem } from '../../types/common';

interface StatCardProps {
  stat: StatItem;
}

export const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  return (
    <div className="admin-stat-card">
      {/* Icon placed on Left Side */}
      <div
        className="stat-icon-left"
        style={{
          background: `${stat.color}15`,
          color: stat.color,
          border: `1px solid ${stat.color}35`,
        }}
      >
        <i className={stat.icon} />
      </div>

      {/* Metric Information placed on Right Side */}
      <div className="stat-info-right">
        <span className="stat-label">{stat.label}</span>
        <div className="stat-value">{stat.value}</div>
      </div>
    </div>
  );
};

export default StatCard;
