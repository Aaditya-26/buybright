/**
 * BuyBright Floating WhatsApp Support Component.
 * Placed on the right side of the screen (vertically centered).
 * Direct link to instant product & customer support on WhatsApp.
 */

import React, { useState } from 'react';

interface FloatingWhatsAppProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  phoneNumber = '918806488054',
  defaultMessage = 'Hello BuyBright, I would like to inquire about marketplace products.',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <aside
      className="pd-floating-whatsapp-container"
      aria-label="BuyBright WhatsApp Support"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`pd-floating-whatsapp-btn ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Chat with BuyBright on WhatsApp"
        title="Chat with BuyBright Support on WhatsApp"
      >
        {/* Ambient Pulsing Halo */}
        <span className="whatsapp-pulse-ring" />

        {/* WhatsApp Icon */}
        <div className="whatsapp-icon-circle">
          <i className="fa-brands fa-whatsapp" />
        </div>

        {/* Floating Tooltip Pill */}
        <span className="whatsapp-tooltip-pill">
          <span className="online-indicator-dot" />
          <span className="tooltip-txt">Chat on WhatsApp</span>
        </span>
      </a>
    </aside>
  );
};
