/**
 * BuyBright Payment Gateway Page.
 * Methods:
 * - Online (Razorpay)
 * - Wallet + Online (Bright Points up to ₹49 + Razorpay)
 * - Wallet + Cash on Delivery (Bright Points up to ₹49 + COD)
 * - Cash on Delivery (Pay on delivery)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { SEO } from '../../components/common/SEO';

export const PaymentPage: React.FC = () => {
  const { clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Load checkout session
  const [session, setSession] = useState<any>(null);
  const [activeMethod, setActiveMethod] = useState<'online' | 'wallet_online' | 'wallet_cod' | 'cod'>('online');

  // Bright Points state
  const availableBrightPoints = 150;
  const maxRedeemablePoints = 49;
  const [brightPointsInput, setBrightPointsInput] = useState<string>('49');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('buybright_checkout_session') || sessionStorage.getItem('prestodental_checkout_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed.formData?.doctorName &&
          (parsed.formData.doctorName.toLowerCase().includes('dnyan') ||
            parsed.formData.doctorName.toLowerCase().includes('potghan') ||
            parsed.formData.doctorName.toLowerCase().includes('rajesh'))
        ) {
          parsed.formData.doctorName = 'John Doe';
          parsed.formData.email = 'johndoe@buybright.com';
        }
        // Remove PRESTO10 if stored
        if (parsed.pricing?.appliedCoupon === 'PRESTO10') {
          parsed.pricing.appliedCoupon = null;
          parsed.pricing.couponDiscount = 0;
          parsed.pricing.discountAmount = 0;
        }
        setSession(parsed);
      } else {
        // Default session fallback without PRESTO10
        setSession({
          formData: {
            doctorName: 'John Doe',
            clinicName: 'Prime Enterprise',
            mobile: '9820123456',
            email: 'johndoe@buybright.com',
            street: 'Flat 402, Skyline Residency, Central Road',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400069',
            tag: 'Home / Residence',
          },
          pricing: {
            totalMrp: 15500,
            discountOnMrp: 3050,
            itemTotal: 12450,
            cartTotal: 12450,
            couponDiscount: 0,
            discountAmount: 0,
            shippingCharge: 149,
            grandTotal: 12599,
          },
          items: [],
          orderDate: new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
          deliveryDate: '24-48 Hours (Express Priority Dispatch)',
        });
      }
    } catch {
      navigate('/checkout');
    }
  }, [navigate]);

  const handlePointsChange = (val: string) => {
    if (val === '') {
      setBrightPointsInput('');
      return;
    }
    const num = parseInt(val, 10);
    if (isNaN(num)) return;
    if (num < 0) {
      setBrightPointsInput('0');
    } else if (num > maxRedeemablePoints) {
      setBrightPointsInput(String(maxRedeemablePoints));
      showToast(`You can redeem only upto ₹${maxRedeemablePoints} from your available Bright Points.`, 'info');
    } else {
      setBrightPointsInput(String(num));
    }
  };

  // Price calculations: Total MRP, Discount on MRP, Item Total, Coupon Discount, Shipping Charge
  const itemTotal = session?.pricing?.itemTotal || session?.pricing?.cartTotal || 0;
  const totalMrp = session?.pricing?.totalMrp || Math.round(itemTotal * 1.25);
  const discountOnMrp = session?.pricing?.discountOnMrp ?? Math.max(0, totalMrp - itemTotal);
  const couponDiscount = (session?.pricing?.appliedCoupon && session?.pricing?.appliedCoupon !== 'PRESTO10')
    ? (session?.pricing?.couponDiscount || session?.pricing?.discountAmount || 0)
    : 0;
  const shippingCharge = session?.pricing?.shippingCharge ?? 149;
  const baseGrandTotal = session?.pricing?.grandTotal || (Math.max(0, itemTotal - couponDiscount) + shippingCharge);

  // Bright Points redemption (No extra fees)
  const isWalletActive = activeMethod === 'wallet_online' || activeMethod === 'wallet_cod';
  const pointsRedeemed = isWalletActive
    ? Math.min(Math.max(0, parseInt(brightPointsInput, 10) || 0), maxRedeemablePoints)
    : 0;

  // Exact Grand Total (NO COD handling fee)
  const computedGrandTotal = Math.max(0, baseGrandTotal - pointsRedeemed);

  const handleProcessPayment = () => {
    setIsProcessing(true);
    showToast(
      activeMethod === 'online' || activeMethod === 'wallet_online'
        ? 'Connecting to Razorpay Secure Gateway...'
        : 'Confirming Order on Delivery...',
      'info'
    );

    // Simulate Payment Gateway verification
    setTimeout(() => {
      setIsProcessing(false);

      const randomIdSuffix = Math.floor(100000 + Math.random() * 900000);
      const generatedOrderId = `PD-${randomIdSuffix}-IN`;
      const generatedInvoiceNo = `INV-2026-${randomIdSuffix.toString().slice(0, 4)}`;
      const generatedAwb = `BLUEDART-${Math.floor(10000000 + Math.random() * 90000000)}`;

      const completedOrder = {
        orderId: generatedOrderId,
        invoiceNo: generatedInvoiceNo,
        trackingNo: generatedAwb,
        courier: 'BlueDart Express  ',
        date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        timestamp: new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        paymentMethod:
          activeMethod === 'online'
            ? 'Online Payment (Razorpay)'
            : activeMethod === 'wallet_online'
              ? `Wallet + Online (Bright Points: ₹${pointsRedeemed}, Razorpay: ₹${computedGrandTotal})`
              : activeMethod === 'wallet_cod'
                ? `Wallet + Cash on Delivery (Bright Points: ₹${pointsRedeemed}, Cash: ₹${computedGrandTotal})`
                : 'Cash on Delivery',
        pointsUsed: pointsRedeemed,
        usedPoints: pointsRedeemed,
        sessionData: {
          ...session,
          pricing: {
            ...session?.pricing,
            grandTotal: computedGrandTotal,
          },
        },
        currentStage: 1, // 1: Order Placed
        estimatedDelivery: 'Tomorrow by 4:00 PM',
      };

      // Save order to session for success page & local history
      sessionStorage.setItem('buybright_last_order', JSON.stringify(completedOrder));

      try {
        const existingOrders = JSON.parse(localStorage.getItem('buybright_all_orders') || '[]');
        localStorage.setItem(
          'buybright_all_orders',
          JSON.stringify([completedOrder, ...existingOrders])
        );
      } catch (e) {
        console.warn('Failed to save to order history', e);
      }

      // Empty shopping cart after successful purchase
      clearCart();

      // Navigate to order success screen
      navigate(`/order-success?orderId=${generatedOrderId}`);
    }, 1800);
  };

  if (!session) return null;

  // Exact 3 elements requested: Available points, input field, and note underneath
  const renderBrightPointsBox = () => (
    <div
      className="payment-method-body"
      style={{
        background: '#f8fafc',
        padding: '16px 20px',
        borderTop: '1px solid #e2e8f0',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* 1. Available Presto Point */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.92rem',
            fontWeight: 700,
            color: '#0f766e',
          }}
        >
          <i className="fa-solid fa-gem" style={{ color: '#0d9488', fontSize: '1rem' }} />
          <span>Available Presto Point: {availableBrightPoints}</span>
        </div>

        {/* 2. Input Field */}
        <div>
          <input
            type="number"
            min="0"
            max={maxRedeemablePoints}
            placeholder="Enter Bright Points"
            value={brightPointsInput}
            onChange={(e) => handlePointsChange(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '300px',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1.5px solid #cbd5e1',
              fontSize: '0.92rem',
              fontWeight: 600,
              color: '#1e293b',
              boxSizing: 'border-box',
              outline: 'none',
              background: '#ffffff',
            }}
          />
        </div>

        {/* 3. Note Underneath */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#0f766e',
            fontSize: '0.84rem',
            fontWeight: 600,
          }}
        >
          <i className="fa-solid fa-circle-info" style={{ color: '#0d9488', flexShrink: 0 }} />
          <span>You can redeem only upto ₹49 from your available Bright Points.</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="checkout-page-container">
      <SEO
        title="Secure Payment Gateway"
        description="Choose your payment method: Online (Razorpay), Wallet + Online, Wallet + Cash on Delivery, or Cash on Delivery."
        canonicalUrl="https://buybright.com/payment"
      />
      <h1 className="visually-hidden">Secure Marketplace Payment Gateway &amp; Verification</h1>
      <div className="checkout-wrapper">
        {/* Top Back Navigation Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <button
            type="button"
            onClick={() => navigate('/checkout')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: '#ffffff',
              border: '1.5px solid #cbd5e1',
              borderRadius: '8px',
              color: '#334155',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <i className="fa-solid fa-arrow-left" /> Back to Address Details
          </button>

          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Step 2 of 3: <strong style={{ color: '#0f172a' }}>Payment Gateway &amp; Verification</strong>
          </div>
        </div>

        {/* Step Indicator Header */}
        <div className="checkout-stepper-header">
          <div className="checkout-steps-bar">
            <div className="checkout-step-item completed">
              <span className="step-num">
                <i className="fa-solid fa-check" />
              </span>
              <span>Contact &amp; Delivery Address</span>
            </div>
            <div className="checkout-step-divider active" />
            <div className="checkout-step-item active">
              <span className="step-num">2</span>
              <span>Payment Gateway</span>
            </div>
            <div className="checkout-step-divider" />
            <div className="checkout-step-item">
              <span className="step-num">3</span>
              <span>Order Success</span>
            </div>
          </div>
        </div>

        <div className="checkout-grid-layout">
          {/* Main Payment Options Left Column */}
          <div>
            <div className="checkout-main-card">
              <div className="checkout-card-header">
                <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-dark-navy, #2a3537)', margin: '0 0 4px', wordBreak: 'break-word' }}>
                    Payment Method
                  </h2>
                  <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', wordBreak: 'break-word' }}>
                    <i className="fa-solid fa-shield-halved" /> 100% Secure &amp; 256-Bit Encrypted
                  </span>
                </div>
                <span className="header-badge">
                  <i className="fa-solid fa-lock" /> 256-Bit SSL
                </span>
              </div>

              {/* Payment Methods List: 4 Exact Methods */}
              <div className="payment-methods-list" style={{ marginTop: '16px' }}>
                {/* ============================================================
                    OPTION 1: Online Payment (Only Razorpay)
                    ============================================================ */}
                <div className={`payment-method-card ${activeMethod === 'online' ? 'is-selected' : ''}`}>
                  <div
                    className={`payment-method-header ${activeMethod === 'online' ? 'is-active' : ''}`}
                    onClick={() => setActiveMethod('online')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setActiveMethod('online')}
                  >
                    <div className="payment-method-left">
                      <input
                        type="radio"
                        name="payment_method"
                        checked={activeMethod === 'online'}
                        onChange={() => setActiveMethod('online')}
                      />
                      <div className="payment-method-info">
                        <strong>Online</strong>
                        <span>UPI, Credit / Debit Card, Net Banking via Razorpay</span>
                      </div>
                    </div>
                    <span className="payment-badge">Razorpay</span>
                  </div>

                  {activeMethod === 'online' && (
                    <div
                      className="payment-method-body"
                      style={{
                        background: '#f8fafc',
                        padding: '16px 20px',
                        borderTop: '1px solid #e2e8f0',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '8px',
                            background: '#0c2340',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#3399cc',
                            fontSize: '1.1rem',
                            fontWeight: 900,
                            flexShrink: 0,
                          }}
                        >
                          <i className="fa-solid fa-bolt" />
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.95rem', color: '#1e293b', display: 'block' }}>Razorpay Secure Payment Gateway</strong>
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>UPI (GPay, PhonePe, Paytm), Cards, Net Banking &amp; Wallets</span>
                        </div>
                      </div>
                      <p style={{ margin: '8px 0 0', fontSize: '0.82rem', color: '#475569', lineHeight: 1.4 }}>
                        <i className="fa-solid fa-shield-halved" style={{ color: '#16a34a', marginRight: '6px' }} />
                        Pay securely via Razorpay. Your transaction is encrypted with bank-grade 256-bit SSL security.
                      </p>
                    </div>
                  )}
                </div>

                {/* ============================================================
                    OPTION 2: Wallet + Online
                    ============================================================ */}
                <div className={`payment-method-card ${activeMethod === 'wallet_online' ? 'is-selected' : ''}`}>
                  <div
                    className={`payment-method-header ${activeMethod === 'wallet_online' ? 'is-active' : ''}`}
                    onClick={() => setActiveMethod('wallet_online')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setActiveMethod('wallet_online')}
                  >
                    <div className="payment-method-left">
                      <input
                        type="radio"
                        name="payment_method"
                        checked={activeMethod === 'wallet_online'}
                        onChange={() => setActiveMethod('wallet_online')}
                      />
                      <div className="payment-method-info">
                        <strong>Wallet + Online</strong>
                        <span>Redeem Bright Points &amp; pay remaining amount online</span>
                      </div>
                    </div>
                    <span className="payment-badge" style={{ background: '#ccfbf1', color: '#0f766e' }}>
                      Points + Online
                    </span>
                  </div>

                  {activeMethod === 'wallet_online' && renderBrightPointsBox()}
                </div>

                {/* ============================================================
                    OPTION 3: Wallet + Cash on Delivery
                    ============================================================ */}
                <div className={`payment-method-card ${activeMethod === 'wallet_cod' ? 'is-selected' : ''}`}>
                  <div
                    className={`payment-method-header ${activeMethod === 'wallet_cod' ? 'is-active' : ''}`}
                    onClick={() => setActiveMethod('wallet_cod')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setActiveMethod('wallet_cod')}
                  >
                    <div className="payment-method-left">
                      <input
                        type="radio"
                        name="payment_method"
                        checked={activeMethod === 'wallet_cod'}
                        onChange={() => setActiveMethod('wallet_cod')}
                      />
                      <div className="payment-method-info">
                        <strong>Wallet + Cash on Delivery</strong>
                        <span>Redeem Bright Points &amp; pay remaining on delivery</span>
                      </div>
                    </div>
                    <span className="payment-badge" style={{ background: '#ccfbf1', color: '#0f766e' }}>
                      Points + COD
                    </span>
                  </div>

                  {activeMethod === 'wallet_cod' && renderBrightPointsBox()}
                </div>

                {/* ============================================================
                    OPTION 4: Cash on Delivery
                    ============================================================ */}
                <div className={`payment-method-card ${activeMethod === 'cod' ? 'is-selected' : ''}`}>
                  <div
                    className={`payment-method-header ${activeMethod === 'cod' ? 'is-active' : ''}`}
                    onClick={() => setActiveMethod('cod')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setActiveMethod('cod')}
                  >
                    <div className="payment-method-left">
                      <input
                        type="radio"
                        name="payment_method"
                        checked={activeMethod === 'cod'}
                        onChange={() => setActiveMethod('cod')}
                      />
                      <div className="payment-method-info">
                        <strong>Cash on Delivery</strong>
                        <span>Pay cash when your order arrives at your doorstep</span>
                      </div>
                    </div>
                    <span className="payment-badge" style={{ background: '#f1f5f9', color: '#475569' }}>
                      COD
                    </span>
                  </div>

                  {activeMethod === 'cod' && (
                    <div
                      className="payment-method-body"
                      style={{
                        background: '#f8fafc',
                        padding: '16px 20px',
                        borderTop: '1px solid #e2e8f0',
                      }}
                    >
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                        <i className="fa-solid fa-hand-holding-dollar" style={{ color: '#0d9488', marginRight: '6px' }} />
                        Pay in cash upon doorstep delivery of your order.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary Column */}
          <div className="checkout-summary-card">
            <h3 className="summary-title">Billing &amp; Order Summary</h3>

            {/* Guaranteed Delivery Arrival Promise */}
            
            {/* Delivering To Recap */}
            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                Delivering To:
              </span>
              <strong style={{ display: 'block', fontSize: '0.9rem', color: '#1e293b', marginTop: '2px' }}>
                {session.formData?.doctorName}
              </strong>
              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#475569', lineHeight: 1.3 }}>
                {session.formData?.street}, {session.formData?.city} – {session.formData?.pincode}
              </p>
            </div>

            <div className="price-breakdown" style={{ borderTop: 'none', paddingTop: 0 }}>
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

              {couponDiscount > 0 && session.pricing?.appliedCoupon && session.pricing.appliedCoupon !== 'PRESTO10' && (
                <div className="price-row highlight" style={{ color: '#16a34a' }}>
                  <span>Coupon Discount ({session.pricing?.appliedCoupon})</span>
                  <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="price-row">
                <span>Shipping Charge</span>
                <span>₹{shippingCharge.toLocaleString('en-IN')}.00</span>
              </div>

              {pointsRedeemed > 0 && (
                <div className="price-row highlight" style={{ color: '#16a34a' }}>
                  <span>Bright Points Redeemed</span>
                  <span>-₹{pointsRedeemed.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="price-row total-row">
                <span>Total Payable</span>
                <span style={{ color: 'var(--color-teal-blue, #3f788c)' }}>
                  ₹{computedGrandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn-proceed-cta"
              onClick={handleProcessPayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin" />
                  <span>Connecting to Gateway...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-lock" />
                  <span>
                    {activeMethod === 'online' && `Pay ₹${computedGrandTotal.toLocaleString('en-IN')} via Razorpay`}
                    {activeMethod === 'wallet_online' && `Pay ₹${computedGrandTotal.toLocaleString('en-IN')} via Razorpay`}
                    {activeMethod === 'wallet_cod' && `Confirm Order (₹${computedGrandTotal.toLocaleString('en-IN')} on Delivery)`}
                    {activeMethod === 'cod' && `Confirm Order (₹${computedGrandTotal.toLocaleString('en-IN')} on Delivery)`}
                  </span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              style={{
                width: '100%',
                marginTop: '10px',
                padding: '10px 16px',
                background: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                borderRadius: '10px',
                color: '#475569',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              <i className="fa-solid fa-arrow-left" /> Change Address / Back
            </button>

            <div className="trust-badges-bar">
              <div className="trust-mini-pill">
                <i className="fa-solid fa-shield-check text-green" /> 100% Safe Payment
              </div>
              <div className="trust-mini-pill">
                <i className="fa-solid fa-file-shield text-teal" /> Instant Tax Invoice
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
