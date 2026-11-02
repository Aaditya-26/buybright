/**
 * BuyBright Interactive Cart Drawer Component.
 * Features animated slide-in, item count, quantity increment/decrement,
 * instant subtotal calculation, free shipping progress, and secure checkout CTA.
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const {
    cart,
    cartCount,
    cartTotal,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 5000;
  const progressPercent = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);

  return (
    <div className="cart-drawer-overlay" onClick={closeCart} role="dialog" aria-modal="true">
      <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div className="cart-header-title">
            <i className="fa-solid fa-cart-shopping text-teal" />
            <h3>Your Procurement Cart</h3>
            <span className="cart-items-badge">{cartCount} items</span>
          </div>
          <button
            type="button"
            className="cart-close-btn"
            onClick={closeCart}
            aria-label="Close cart"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="cart-shipping-bar">
          <div className="shipping-bar-text">
            {remainingForFreeShipping > 0 ? (
              <span>
                Add <strong>INR {remainingForFreeShipping.toLocaleString('en-IN')}</strong> more for <strong>Free Express Shipping</strong>!
              </span>
            ) : (
              <span className="text-free-ship">
                🎉 Congratulations! You have unlocked <strong>Free Express Delivery</strong>!
              </span>
            )}
          </div>
          <div className="shipping-progress-track">
            <div
              className="shipping-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Drawer Body: Items or Empty State */}
        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <div className="empty-cart-icon">
                <i className="fa-solid fa-basket-shopping" />
              </div>
              <h4>Your cart is currently empty</h4>
              <p>Explore our catalog of certified dental supplies and equipment.</p>
              <button
                type="button"
                className="btn-continue-shopping"
                onClick={() => {
                  closeCart();
                  navigate('/shop');
                }}
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="cart-item-row">
                  <div className="cart-item-img">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="cart-item-info">
                    <span className="cart-item-brand">{product.brand}</span>
                    <h4 className="cart-item-title">{product.name}</h4>
                    <div className="cart-item-pricing">
                      <span className="cart-item-unit-price">
                        INR {product.price.toLocaleString('en-IN')}
                      </span>
                      <span className="cart-item-line-total">
                        Total: INR {(product.price * quantity).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="cart-item-controls">
                      {/* Quantity Controller */}
                      <div className="cart-qty-picker">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <i className="fa-solid fa-minus" />
                        </button>
                        <span>{quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <i className="fa-solid fa-plus" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        className="cart-remove-item-btn"
                        onClick={() => removeFromCart(product.id)}
                        aria-label="Remove item"
                      >
                        <i className="fa-solid fa-trash-can" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer: Subtotal & Checkout */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-summary-line">
              <span>Subtotal ({cartCount} items)</span>
              <span className="cart-subtotal-val">
                INR {cartTotal.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="cart-summary-line tax-note">
              <span>Shipping & Logistics</span>
              <span>Calculated at next step</span>
            </div>

            <div className="cart-footer-buttons" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
              <button
                type="button"
                className="btn-checkout-primary"
                onClick={() => {
                  closeCart();
                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                  document.documentElement.scrollTop = 0;
                  document.body.scrollTop = 0;
                  navigate('/cart');
                }}
              >
                <i className="fa-solid fa-cart-shopping" />
                <span>View   Details</span>
                <i className="fa-solid fa-arrow-right" />
              </button>
              <button
                type="button"
                className="btn-clear-cart"
                onClick={clearCart}
                style={{
                  marginTop: 0,
                  padding: '10px 12px',
                  background: '#2a3537',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}

              >
                Clear Cart
              </button>


            </div>
          </div>
        )}
      </div>
    </div>
  );
};
