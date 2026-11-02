/**
 * BuyBright Product Variant & Tiered Bulk Pricing Slide-Over Drawer.
 * Features:
 * - Product Title & "View Details" link
 * - Tiered Discount Pricing Matrix (Buy 2+ for ₹820 each, Buy 5+ for ₹800 each)
 * - In-Stock Variants: Quantity picker + "ADD" to Cart button
 * - Out-of-Stock / Unavailable Variants: Out of Stock Badge + "Request This Product" Button exclusively
 * - Global "Request This Product" institutional inquiry CTA button in footer.
 */

import React, { useState, useEffect } from 'react';
import type { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

interface ProductVariantDrawerProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

interface VariantItem {
  id: string;
  name: string;
  price: number;
  oldPrice: number;
  discount: string;
  stock: number;
  image: string;
}

export const ProductVariantDrawer: React.FC<ProductVariantDrawerProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [isRequestSubmitted, setIsRequestSubmitted] = useState(false);
  const [requestedVariantId, setRequestedVariantId] = useState<string | null>(null);

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Generate variants matching the requested product model
  const baseName = product.name.includes('Dam')
    ? 'Waldent FlexiShield Rubber Dam Sheets'
    : product.name;
  const basePrice = product.price || 830;
  const baseOldPrice = product.old_price || Math.round(basePrice * 2.15);
  const discountPercent = '53.89% Off';
  const isProductOutOfStock = product.in_stock === false;

  const VARIANTS: VariantItem[] = [
    {
      id: `${product.id}-var-1`,
      name: `${baseName} Blue (Sanctuary) - Medium (5" x 5")`,
      price: basePrice,
      oldPrice: baseOldPrice,
      discount: discountPercent,
      stock: isProductOutOfStock ? 0 : 4,
      image: product.image || '/images/cat_materials_1787401998270.jpg',
    },
    {
      id: `${product.id}-var-2`,
      name: `${baseName} Black (Sanctuary) - Medium (6" x 6")`,
      price: basePrice,
      oldPrice: baseOldPrice,
      discount: discountPercent,
      stock: 0, // Unavailable in stock -> Shows "Request This Product"
      image: product.image || '/images/cat_materials_1787401998270.jpg',
    },
    {
      id: `${product.id}-var-3`,
      name: `${baseName} Blue (Sanctuary) - Medium (6" x 6")`,
      price: basePrice,
      oldPrice: baseOldPrice,
      discount: discountPercent,
      stock: isProductOutOfStock ? 0 : 8,
      image: product.image || '/images/cat_materials_1787401998270.jpg',
    },
    {
      id: `${product.id}-var-4`,
      name: `${baseName} Green (Sanctuary) - Heavy (6" x 6")`,
      price: basePrice,
      oldPrice: baseOldPrice,
      discount: discountPercent,
      stock: 0, // Unavailable in stock -> Shows "Request This Product"
      image: product.image || '/images/cat_materials_1787401998270.jpg',
    },
  ];

  const handleAddVariant = (variant: VariantItem) => {
    const qty = quantities[variant.id] || 1;
    const variantProduct: Product = {
      ...product,
      id: variant.id,
      name: variant.name,
      price: variant.price,
      old_price: variant.oldPrice,
      image: variant.image,
    };

    addToCart(variantProduct, qty);
    showToast(`✓ Added ${qty}x "${variant.name.slice(0, 30)}..." to Cart!`, 'success');
  };

  const updateQuantity = (variantId: string, delta: number) => {
    setQuantities((prev) => {
      const cur = prev[variantId] || 1;
      const next = Math.max(1, cur + delta);
      return { ...prev, [variantId]: next };
    });
  };

  const handleRequestVariant = (variant: VariantItem) => {
    setRequestedVariantId(variant.id);
    showToast(`✓ Inquiry submitted for "${variant.name.slice(0, 28)}..."! Our supply manager will contact you.`, 'success');
    setTimeout(() => {
      setRequestedVariantId(null);
    }, 4000);
  };

  const handleRequestProduct = () => {
    setIsRequestSubmitted(true);
    showToast('✓ Request Submitted! Oursupply desk will contact you with wholesale pricing.', 'success');
    setTimeout(() => {
      setIsRequestSubmitted(false);
    }, 4000);
  };

  return (
    <div className="pd-variant-drawer-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="pd-variant-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Mobile Drag Indicator Bar */}
        <div className="drawer-drag-handle" />

        {/* Drawer Header */}
        <div className="variant-drawer-header">
          <div className="drawer-title-col">
            <span className="drawer-brand-tag">{product.brand || 'Waldent'}</span>
            <h2 className="drawer-product-title">{product.name}</h2>
            <div className="drawer-price-head">
              <span className="current-price">₹{basePrice.toLocaleString('en-IN')}</span>
              <button
                type="button"
                className="btn-view-details-link"
                onClick={() => {
                  showToast(`Viewing complete product specifications for "${product.name.slice(0, 24)}"`, 'info');
                }}
              >
                View Details <i className="fa-solid fa-arrow-up-right-from-square" />
              </button>
            </div>
          </div>

          <button
            type="button"
            className="btn-close-variant-drawer"
            onClick={onClose}
            aria-label="Close variant drawer"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="variant-drawer-scroll-body">
          {/* Tiered Bulk Quantity Discount Box */}
          <div className="tiered-bulk-pricing-box">
            <div className="bulk-box-header">
              <i className="fa-solid fa-tags" />
              <span>Institutional Bulk Savings Matrix</span>
            </div>
            <div className="bulk-tiers-grid">
              <div className="tier-row">
                <span className="tier-condition">Buy 2 or above for ₹820 each</span>
                <span className="tier-save-badge">Save 1.20%</span>
              </div>
              <div className="tier-row">
                <span className="tier-condition">Buy 5 or above for ₹800 each</span>
                <span className="tier-save-badge highlight">Save 3.61%</span>
              </div>
            </div>
          </div>

          {/* Variants List Section */}
          <div className="drawer-variants-list">
            <h3 className="variants-section-heading">Available Sizes &amp; Specifications:</h3>

            {VARIANTS.map((v) => {
            const qty = quantities[v.id] || 1;
            const isVarRequested = requestedVariantId === v.id;
            const isAvailable = v.stock > 0;

            return (
              <div key={v.id} className={`variant-card-item ${!isAvailable ? 'is-out-of-stock' : ''}`}>
                <div className="variant-thumb-col">
                  <img src={v.image} alt={v.name} loading="lazy" />
                  {isAvailable ? (
                    v.stock <= 3 && (
                      <span className="variant-urgency-chip">Only {v.stock} Left</span>
                    )
                  ) : (
                    <span className="variant-out-of-stock-chip">Out of Stock</span>
                  )}
                </div>

                <div className="variant-details-col">
                  <div className="variant-name-row">
                    <h4 className="variant-name">{v.name}</h4>
                    {!isAvailable && (
                      <span className="variant-stock-status-pill out-of-stock">
                        <i className="fa-solid fa-circle-exclamation" /> Unavailable
                      </span>
                    )}
                  </div>

                  <div className="variant-pricing-row">
                    <span className="v-price">₹{v.price.toLocaleString('en-IN')}</span>
                    <span className="v-old-price">₹{v.oldPrice.toLocaleString('en-IN')}</span>
                    <span className="v-discount-badge">{v.discount}</span>
                  </div>

                  {/* Quantity & Actions Row */}
                  <div className="variant-action-row">
                    {isAvailable ? (
                      /* IN STOCK: Show Quantity Picker & ADD Button */
                      <>
                        <div className="qty-picker-capsule">
                          <button
                            type="button"
                            onClick={() => updateQuantity(v.id, -1)}
                            aria-label="Decrease quantity"
                          >
                            <i className="fa-solid fa-minus" />
                          </button>
                          <span className="qty-number">{qty}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(v.id, 1)}
                            aria-label="Increase quantity"
                          >
                            <i className="fa-solid fa-plus" />
                          </button>
                        </div>

                        <div className="variant-buttons-group">
                          <button
                            type="button"
                            className="btn-add-variant-item"
                            onClick={() => handleAddVariant(v)}
                            title="Add this variant to cart"
                          >
                            <i className="fa-solid fa-cart-shopping" />
                            <span>ADD</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      /* OUT OF STOCK / UNAVAILABLE: ONLY Show "Request This Product" Button */
                      <div className="variant-unavailable-action-box">
                        <button
                          type="button"
                          className={`btn-variant-request ${isVarRequested ? 'is-submitted' : ''}`}
                          onClick={() => handleRequestVariant(v)}
                          disabled={isVarRequested}
                          title="Request quotation or out-of-stock reservation"
                        >
                          <i className={`fa-solid ${isVarRequested ? 'fa-check' : 'fa-clipboard-question'}`} />
                          <span>{isVarRequested ? 'Requested' : 'Request This Product'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="variant-drawer-footer">
          <button
            type="button"
            className="btn-request-product"
            onClick={handleRequestProduct}
            disabled={isRequestSubmitted}
          >
            <i className={`fa-solid ${isRequestSubmitted ? 'fa-circle-check' : 'fa-clipboard-question'}`} />
            <span>{isRequestSubmitted ? '✓ Request Submitted' : 'Request This Product'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

