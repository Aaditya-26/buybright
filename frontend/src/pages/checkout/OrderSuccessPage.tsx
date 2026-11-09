/**
 * BuyBright Order Success Confirmation Page.
 * Step 3: Celebratory Confirmation, Order ID, Invoice Download, and direct Track Order link.
 */

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { SEO } from '../../components/common/SEO';

export const OrderSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [order, setOrder] = useState<any>(null);

  const orderIdParam = searchParams.get('orderId');

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('buybright_last_order') || sessionStorage.getItem('prestodental_last_order');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed.sessionData?.formData?.doctorName &&
          (parsed.sessionData.formData.doctorName.toLowerCase().includes('dnyan') ||
            parsed.sessionData.formData.doctorName.toLowerCase().includes('potghan') ||
            parsed.sessionData.formData.doctorName.toLowerCase().includes('rajesh'))
        ) {
          parsed.sessionData.formData.doctorName = 'John Doe';
          parsed.sessionData.formData.email = 'johndoe@buybright.com';
        }
        setOrder(parsed);
      } else {
        // Mock fallback if navigated directly with query param
        setOrder({
          orderId: orderIdParam || 'BB-782910-IN',
          invoiceNo: 'INV-2026-7829',
          trackingNo: 'BLUEDART-88291029',
          courier: 'BlueDart Express',
          date: new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
          paymentMethod: 'Instant UPI (BuyBright Online Verified)',
          sessionData: {
            formData: {
              doctorName: 'John Doe',
              clinicName: 'Prime Enterprise',
              mobile: '9820123456',
              email: 'johndoe@buybright.com',
              street: 'Flat 402, Skyline Residency, Central Road',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400069',
              deliverySpeed: 'Express',
              needGstInvoice: true,
              gstin: '27AAACD9910Q1ZS',
            },
            pricing: {
              cartTotal: 12450,
              discountAmount: 1245,
              taxableAmount: 11205,
              gstAmount: 0,
              shippingCharge: 0,
              grandTotal: 11205,
            },
            items: [
              {
                product: {
                  id: 'prod-1',
                  name: 'Wireless Noise-Canceling Earbuds Pro',
                  image: '/images/cat_instruments_1787401955005.jpg',
                  price: 4500,
                },
                quantity: 2,
              },
              {
                product: {
                  id: 'prod-3',
                  name: 'Stainless Steel Ergonomic Chef Knife Set',
                  image: '/images/cat_endodontic_1787401934680.jpg',
                  price: 1725,
                },
                quantity: 2,
              },
            ],
          },
          estimatedDelivery: 'Tomorrow by 4:00 PM',
        });
      }
    } catch {
      // ignore
    }
  }, [orderIdParam]);

  const handlePrintInvoice = () => {
    showToast('Preparing Tax Invoice for download & printing...', 'info');
    window.print();
  };

  if (!order) return null;

  return (
    <div className="checkout-page-container">
      <SEO
        title="Order Confirmed &amp; Invoice Generated"
        description="Your BuyBright order is confirmed. Download tax invoice and track express cold-chain delivery status."
        canonicalUrl="https://buybright.com/order-success"
      />
      <div className="checkout-wrapper">
        {/* Step Indicator Header (All Completed) */}
        <div className="checkout-stepper-header">
          <div className="checkout-steps-bar">
            <div className="checkout-step-item completed">
              <span className="step-num">
                <i className="fa-solid fa-check" />
              </span>
              <span>Delivery &amp; Shipping</span>
            </div>
            <div className="checkout-step-divider active" />
            <div className="checkout-step-item completed">
              <span className="step-num">
                <i className="fa-solid fa-check" />
              </span>
              <span>Payment Gateway</span>
            </div>
            <div className="checkout-step-divider active" />
            <div className="checkout-step-item completed">
              <span className="step-num">
                <i className="fa-solid fa-check" />
              </span>
              <span>Order Success</span>
            </div>
          </div>
        </div>

        {/* Celebratory Hero Card */}
        <div className="order-success-hero">
          <div className="success-check-badge">
            <i className="fa-solid fa-check" />
          </div>

          <h1 className="success-title">Thank You! Your Order is Confirmed</h1>
          <p className="success-subtitle">
            We have received your payment and our central fulfillment center has initiated packaging and dispatch.
          </p>

          <div className="success-meta-chips">
            <div className="meta-chip">
              Order ID: <strong>{order.orderId}</strong>
            </div>
            <div className="meta-chip">
              Tax Invoice: <strong>{order.invoiceNo}</strong>
            </div>
            <div className="meta-chip">
              AWB Tracking: <strong>{order.trackingNo}</strong>
            </div>
            <div className="meta-chip">
              Est. Delivery: <strong>{order.estimatedDelivery}</strong>
            </div>
          </div>

          {/* Quick Action CTAs */}
          <div className="success-actions-row">
            <button
              type="button"
              className="btn-track-order-now"
              onClick={() => navigate(`/track-order?orderId=${order.orderId}`)}
            >
              <i className="fa-solid fa-satellite-dish" /> Track Live Delivery
            </button>

            <button
              type="button"
              className="btn-download-inv"
              onClick={handlePrintInvoice}
            >
              <i className="fa-solid fa-file-invoice" /> Download Tax Invoice (PDF)
            </button>

            <Link to="/shop" className="btn-continue-shop">
              <i className="fa-solid fa-bag-shopping" /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Details & Summary Breakdown */}
        <div className="checkout-grid-layout">
          <div>
            {/* Delivery Info */}
            <div className="checkout-main-card">
              <div className="checkout-card-header">
                <h2>
                  <i className="fa-solid fa-location-dot" /> Delivery &amp; Consignee Details
                </h2>
                <span className="header-badge">Express Air Dispatch</span>
              </div>

              <div className="checkout-form-grid">
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Customer / Recipient:</span>
                  <strong style={{ display: 'block', fontSize: '1rem', color: '#1e293b', marginTop: '2px' }}>
                    {order.sessionData?.formData?.doctorName}
                  </strong>
                  {order.sessionData?.formData?.clinicName && (
                    <span style={{ display: 'block', color: '#334155', fontSize: '0.88rem', marginTop: '4px' }}>
                      {order.sessionData?.formData?.clinicName}
                    </span>
                  )}
                  <span style={{ display: 'block', color: '#64748b', fontSize: '0.82rem', marginTop: '4px' }}>
                    <i className="fa-solid fa-phone" style={{ marginRight: '6px' }} />
                    +91 {order.sessionData?.formData?.mobile}
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Shipping Destination:</span>
                  <p style={{ margin: '2px 0 0', fontSize: '0.88rem', color: '#334155', lineHeight: 1.5 }}>
                    {order.sessionData?.formData?.street}, {order.sessionData?.formData?.locality ? `${order.sessionData.formData.locality}, ` : ''}{order.sessionData?.formData?.city},{' '}
                    {order.sessionData?.formData?.state} – <strong style={{ color: '#0f172a' }}>{order.sessionData?.formData?.pincode}</strong>
                  </p>
                  {order.sessionData?.formData?.tag && (
                    <span style={{ display: 'inline-block', background: '#e0f2fe', color: '#0369a1', fontSize: '0.75rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', marginTop: '6px', textTransform: 'uppercase' }}>
                      <i className="fa-solid fa-location-dot" style={{ marginRight: '4px' }} />
                      {order.sessionData?.formData?.tag}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="checkout-main-card">
              <div className="checkout-card-header">
                <h2>
                  <i className="fa-solid fa-box-open" /> Ordered Products
                </h2>
                <span className="header-badge">Quality Inspected</span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b' }}>
                      <th style={{ padding: '10px 8px' }}>Product</th>
                      <th style={{ padding: '10px 8px' }}>Qty</th>
                      <th style={{ padding: '10px 8px' }}>Price</th>
                      <th style={{ padding: '10px 8px', textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(order.sessionData?.items?.length ? order.sessionData.items : [
                      {
                        product: {
                          name: 'Marketplace Essentials Bundle',
                          price: order.sessionData?.pricing?.cartTotal || 12450,
                          image: '/images/cat_consumables_1787401910059.jpg',
                        },
                        quantity: 1,
                      }
                    ]).map((item: any, idx: number) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                        <td style={{ padding: '12px 8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={item.product?.image || '/images/cat_instruments_1787401955005.jpg'}
                            alt={item.product?.name}
                            style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                          />
                          <span style={{ fontWeight: 700, color: '#1e293b' }}>{item.product?.name}</span>
                        </td>
                        <td style={{ padding: '12px 8px', color: '#64748b' }}>{item.quantity}</td>
                        <td style={{ padding: '12px 8px', color: '#334155' }}>
                          ₹{item.product?.price?.toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                          ₹{((item.product?.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Payment & Invoice Summary */}
          <div>
            <div className="checkout-summary-card">
              <h3 className="summary-title">Payment &amp; Order Summary</h3>

              <div className="price-breakdown" style={{ borderTop: 'none', paddingTop: 0 }}>
                <div className="price-row">
                  <span>Payment Mode</span>
                  <span style={{ fontWeight: 700, color: '#1e293b' }}>{order.paymentMethod}</span>
                </div>

                <div className="price-row">
                  <span>Total MRP</span>
                  <span>₹{(order.sessionData?.pricing?.totalMrp || Math.round((order.sessionData?.pricing?.cartTotal || 0) * 1.25)).toLocaleString('en-IN')}</span>
                </div>

                <div className="price-row highlight" style={{ color: '#16a34a' }}>
                  <span>Discount on MRP</span>
                  <span>-₹{(order.sessionData?.pricing?.discountOnMrp || Math.max(0, (order.sessionData?.pricing?.totalMrp || Math.round((order.sessionData?.pricing?.cartTotal || 0) * 1.25)) - (order.sessionData?.pricing?.itemTotal || order.sessionData?.pricing?.cartTotal || 0))).toLocaleString('en-IN')}</span>
                </div>

                <div className="price-row">
                  <span>Item Total</span>
                  <span>₹{(order.sessionData?.pricing?.itemTotal || order.sessionData?.pricing?.cartTotal || 0).toLocaleString('en-IN')}</span>
                </div>

                {((order.sessionData?.pricing?.couponDiscount || order.sessionData?.pricing?.discountAmount || 0) > 0) && (
                  <div className="price-row highlight" style={{ color: '#16a34a' }}>
                    <span>Coupon Discount</span>
                    <span>-₹{(order.sessionData?.pricing?.couponDiscount || order.sessionData?.pricing?.discountAmount).toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="price-row">
                  <span>Shipping Charge</span>
                  <span>₹{(order.sessionData?.pricing?.shippingCharge ?? 149).toLocaleString('en-IN')}.00</span>
                </div>

                <div className="price-row total-row">
                  <span>Paid Total</span>
                  <span style={{ color: 'var(--color-teal-blue, #3f788c)' }}>
                    ₹{order.sessionData?.pricing?.grandTotal?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
