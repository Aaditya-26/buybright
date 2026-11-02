/**
 * AdminFooter Component.
 * Subtle clean footer for admin console showing version, system status, and copyright.
 */

import React from 'react';

export const AdminFooter: React.FC = () => {
  return (
    <footer
      style={{
        padding: '16px 28px',
        borderTop: '1px solid #e2e8f0',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        fontSize: '0.8rem',
        color: '#64748b',
      }}
    >
      <div>
        <span>&copy; {new Date().getFullYear()} BuyBright . All rights reserved.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span> Design & Developed BY</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: 600 }}>
             <a href="https://www.micrrolan.in">Microlan.in</a>
        </span>
      </div>
    </footer>
  );
};

export default AdminFooter;
