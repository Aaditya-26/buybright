/**
 * BuyBright Dedicated Shopping Cart Detail Page (/cart).
 * Features rich product items listing, live quantity adjustment, free shipping meter,
 * promotional coupon application, guaranteed delivery date promise, and direct progression to Checkout.
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { SEO } from '../../components/common/SEO';

export const CartPage: React.FC = () => {
  const { cart, cartTotal, cartCount, updateQuantity, removeFromCart, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

  // Price calculations: Total MRP, Discount on MRP, Item Total, Coupon Discount, Shipping Charge
  const totalMrp = cart.reduce((sum, item) => {
    const itemMrp =
      item.product.old_price && item.product.old_price > item.product.price
        ? item.product.old_price
        : Math.round(item.product.price * 1.25);
    return sum + itemMrp * item.quantity;
  }, 0);

  const itemTotal = cartTotal;
  const discountOnMrp = Math.max(0, totalMrp - itemTotal);
  const couponDiscount = appliedCoupon ? Math.round(itemTotal * appliedCoupon.discount) : 0;
  const shippingCharge = 149; // Express Priority: ₹149.00
  const grandTotal = Math.max(0, itemTotal - couponDiscount) + shippingCharge;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'BUYBRIGHT10') {
      setAppliedCoupon({ code, discount: 0.1 });
      showToast(`✓ Coupon "${code}" applied successfully! 10% Discount added.`, 'success');
      setCouponInput('');
    } else if (code === 'SAVEMORE20') {
      setAppliedCoupon({ code, discount: 0.2 });
      showToast('✓ Coupon "SAVEMORE20" applied! 20% Special Discount added.', 'success');
      setCouponInput('');
    } else {
      showToast('Invalid coupon code.', 'danger');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed.', 'info');
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      showToast('Your shopping cart is empty!', 'warning');
      return;
    }

    // Save initial pricing to session
    const cartSummary = {
      totalMrp,
      discountOnMrp,
      itemTotal,
      cartTotal: itemTotal,
      couponDiscount,
      discountAmount: couponDiscount,
      shippingCharge: 149,
      shippingMethodName: 'Express Priority',
      shippingMethodDesc: 'Express delivery network with next-day dispatch.',
      shippingEta: '24-48 Hours',
      grandTotal,
      appliedCoupon: appliedCoupon?.code,
      deliveryDate: '24-48 Hours (Next-Day Dispatch)',
    };
    sessionStorage.setItem('buybright_cart_summary', JSON.stringify(cartSummary));

    navigate('/checkout');
  };

  return (
    <div className="checkout-page-container">
      <SEO
        title="Shopping Cart"
        description="Review your selected products, gadgets, and essentials in your BuyBright shopping cart."
        canonicalUrl="https://buybright.com/cart"
      />
      <div className="checkout-wrapper">
        {/* Page Title & Breadcrumb */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '6px' }}>
            <Link to="/" style={{ color: 'var(--color-teal-blue, #3f788c)' }}>Home</Link> /{' '}
            <Link to="/shop" style={{ color: 'var(--color-teal-blue, #3f788c)' }}>Catalog</Link> /{' '}
            <span>Shopping Cart</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-dark-navy, #2a3537)', margin: 0 }}>
            <i className="fa-solid fa-cart-shopping text-teal" style={{ marginRight: '10px' }} />
            Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="checkout-main-card text-center" style={{ padding: '70px 20px' }}>
            <i className="fa-solid fa-cart-arrow-down" style={{ fontSize: '4rem', color: '#cbd5e1', marginBottom: '20px' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
              Your Shopping Cart is Currently Empty
            </h2>
            <p style={{ color: '#64748b', maxWidth: '480px', margin: '0 auto 28px', fontSize: '0.95rem' }}>
              Explore our wide marketplace collection of electronics, fashion, home essentials, and lifestyle products.
            </p>
            <Link to="/shop" className="btn-proceed-cta" style={{ maxWidth: '260px', margin: '0 auto' }}>
              <i className="fa-solid fa-bag-shopping" /> Explore Marketplace Catalog
            </Link>
          </div>
        ) : (
          <div className="checkout-grid-layout">
            {/* Left Column: Product Items List */}
            <div>
              {/* Express Priority Shipping Logistics Banner */}
              <div className="free-shipping-meter-card" style={{ background: '#f0fdfa', borderColor: '#ccfbf1', padding: '14px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: '#008080',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.1rem',
                        flexShrink: 0,
                      }}
                    >
                      <i className="fa-solid fa-truck-fast" />
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: '#0f766e', fontSize: '0.92rem' }}>
                        Express Priority Dispatch
                      </strong>
                      <span style={{ fontSize: '0.82rem', color: '#115e59' }}>
                        Pan-India express delivery network with next-day dispatch &bull; 24-48 Hours
                      </span>
                    </div>
                  </div>
                  <span
                    style={{
                      background: '#ccfbf1',
                      color: '#0f766e',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      padding: '4px 12px',
                      borderRadius: '20px',
                      border: '1px solid #99f6e4',
                    }}
                  >
                    ₹149.00 Fixed Logistics
                  </span>
                </div>
              </div>

              {/* Items Table Card */}
              <div className="cart-items-table-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1.5px solid #f1f5f9', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                    Selected Products
                  </h3>
                  <button
                    type="button"
                    onClick={clearCart}
                    style={{ fontSize: '0.82rem', color: '#dc2626', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <i className="fa-solid fa-trash-can" style={{ marginRight: '4px' }} /> Clear Cart
                  </button>
                </div>

                {/* Items Loop */}
                {cart.map((item) => (
                  <div key={item.product.id} className="cart-item-row-detail">
                    <img
                      src={item.product.image || '/images/cat_instruments_1787401955005.jpg'}
                      alt={item.product.name}
                    />

                    <div className="cart-item-info">
                      <span className="item-brand-pill">{item.product.brand || 'BUYBRIGHT'}</span>
                      <Link to={`/shop/${item.product.id}`} className="item-title">
                        {item.product.name}
                      </Link>
                      <span className="item-unit-price">
                        Unit Price: ₹{item.product.price.toLocaleString('en-IN')} &bull;{' '}
                        <span style={{ color: '#16a34a', fontWeight: 600 }}>In Stock (Verified Merchant)</span>
                      </span>
                    </div>

                    {/* Qty +/- */}
                    <div className="cart-item-qty-control">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        title="Decrease quantity"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        title="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Total Price for item */}
                    <div className="cart-item-total-price">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </div>

                    {/* Remove Action */}
                    <button
                      type="button"
                      className="btn-remove-cart-item"
                      onClick={() => removeFromCart(item.product.id)}
                      title="Remove from Cart"
                    >
                      <i className="fa-solid fa-trash-can" />
                    </button>
                  </div>
                ))}

                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <Link
                    to="/shop"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'var(--color-teal-blue, #3f788c)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      textDecoration: 'none',
                    }}
                  >
                    <i className="fa-solid fa-arrow-left" /> Continue Shopping
                  </Link>

                 
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Proceed to Details */}
            <div>
              <div className="checkout-summary-card">
                <h3 className="summary-title">Order Summary</h3>

                {/* Prominent Express Priority Delivery Promise */}
                <div className="delivery-promise-banner">
                  <div className="delivery-icon-box" style={{ background: '#008080', color: '#ffffff' }}>
                    <i className="fa-solid fa-truck-fast" />
                  </div>
                  <div className="delivery-text-wrap">
                    <strong>Express Priority</strong>
                    <span>Express pan-India delivery network with next-day dispatch. (24-48 Hours)</span>
                  </div>
                </div>

                {/* Coupon Code Box */}
                <form onSubmit={handleApplyCoupon} className="coupon-box">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                  />
                  <button type="submit">Apply</button>
                </form>

                {appliedCoupon && (
                  <div className="applied-coupon-pill">
                    <span>
                      <i className="fa-solid fa-tag" /> {appliedCoupon.code} Applied (10% Off)
                    </span>
                    <button type="button" onClick={handleRemoveCoupon}>
                      Remove
                    </button>
                  </div>
                )}

                {/* Price Breakdown: Total MRP, Discount on MRP, Item Total, Coupon Discount, Shipping Charge */}
                <div className="price-breakdown">
                  <div className="price-row">
                    <span>Total MRP</span>
                    <span>₹{totalMrp.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="price-row highlight" style={{ color: '#16a34a' }}>
                    <span>Discount on MRP</span>
                    <span>-₹{discountOnMrp.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="price-row">
                    <span>Item Total</span>
                    <span>₹{itemTotal.toLocaleString('en-IN')}</span>
                  </div>

                  {appliedCoupon && couponDiscount > 0 && (
                    <div className="price-row highlight" style={{ color: '#16a34a' }}>
                      <span>Coupon Discount ({appliedCoupon.code})</span>
                      <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="price-row">
                    <span>Shipping Charge</span>
                    <span>₹149.00</span>
                  </div>

                  <div className="price-row total-row">
                    <span>Total Amount</span>
                    <span style={{ color: 'var(--color-teal-blue, #3f788c)' }}>
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Proceed to Details CTA */}
                <button
                  type="button"
                  className="btn-proceed-cta"
                  onClick={handleProceedToCheckout}
                >
                  <span>Proceed to Details &amp; Address</span>
                  <i className="fa-solid fa-arrow-right" />
                </button>

                
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
