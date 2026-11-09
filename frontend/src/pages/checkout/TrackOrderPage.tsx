/**
 * BuyBright Dedicated Order Tracking Page.
 * Visual 7-Stage Delivery Timeline:
 * ✓ Order Placed -> ✓ Payment Confirmed -> ✓ Processing -> ✓ Packed -> ● Shipped -> ○ Out for Delivery -> ○ Delivered
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SEO } from '../../components/common/SEO';

interface TrackingStage {
  id: number;
  name: string;
  desc: string;
  timestamp: string;
  location: string;
}

export const TrackOrderPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const [orderQuery, setOrderQuery] = useState(searchParams.get('orderId') || 'PD-849204-IN');
  const [activeTrackingData, setActiveTrackingData] = useState<any>(null);

  // 7 Exact Stages requested
  const stages: TrackingStage[] = [
    {
      id: 1,
      name: 'Order Placed',
      desc: 'Dental order placed through BuyBright digital procurement portal.',
      timestamp: 'Today, 10:30 AM',
      location: 'BuyBright Online Platform',
    },
    {
      id: 2,
      name: 'Payment Confirmed',
      desc: 'Instant   payment verified & GST tax invoice generated.',
      timestamp: 'Today, 10:32 AM',
      location: 'Payment Gateway Settlement Hub',
    },
    {
      id: 3,
      name: 'Processing',
      desc: 'Inventory allocation & batch sterilization check at central fulfillment center.',
      timestamp: 'Today, 11:15 AM',
      location: 'Central Fulfillment Hub, Pune',
    },
    {
      id: 4,
      name: 'Packed',
      desc: 'Cold-chain vacuum sealed & labeled with careful handling instructions.',
      timestamp: 'Today, 01:45 PM',
      location: 'Central Fulfillment Hub, Pune',
    },
    {
      id: 5,
      name: 'Shipped',
      desc: 'Dispatched via BlueDart Express  . Flight in transit to regional sorting hub.',
      timestamp: 'Today, 04:20 PM',
      location: 'Cargo Terminal 2, Mumbai Airport',
    },
    {
      id: 6,
      name: 'Out for Delivery',
      desc: 'Assigned to dedicated healthcare delivery courier for directhandover.',
      timestamp: 'Expected Tomorrow, 09:30 AM',
      location: 'Local Delivery Center, Andheri Hub',
    },
    {
      id: 7,
      name: 'Delivered',
      desc: 'Physical receipt & digital OTP signature verification atreception.',
      timestamp: 'Expected Tomorrow, 04:00 PM',
      location: 'DoctorReception Desk',
    },
  ];

  // Default active current stage is stage 5: Shipped (●)
  const [currentStageId] = useState<number>(5);

  useEffect(() => {
    // Check if session has a custom order
    try {
      const last = sessionStorage.getItem('buybright_last_order') || sessionStorage.getItem('prestodental_last_order');
      if (last) {
        const parsed = JSON.parse(last);
        if (
          parsed.sessionData?.formData?.doctorName &&
          (parsed.sessionData.formData.doctorName.toLowerCase().includes('dnyan') ||
            parsed.sessionData.formData.doctorName.toLowerCase().includes('potghan') ||
            parsed.sessionData.formData.doctorName.toLowerCase().includes('rajesh'))
        ) {
          parsed.sessionData.formData.doctorName = '  John Doe';
        }
        setActiveTrackingData(parsed);
        if (parsed.orderId) setOrderQuery(parsed.orderId);
      } else {
        setActiveTrackingData({
          orderId: orderQuery,
          courier: 'BlueDart Express  ',
          trackingNo: 'BLUEDART-84920421',
          estimatedDelivery: 'Tomorrow by 4:00 PM',
          sessionData: {
            formData: {
              doctorName: '  John Doe',
              clinicName: 'Apex Dental & Maxillofacial Clinic',
              street: 'Shop 4 & 5, Presto Commercial Hub, Central Road',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400069',
              mobile: '9820123456',
            },
            pricing: {
              grandTotal: 13222,
            },
          },
        });
      }
    } catch {
      // ignore
    }
  }, []);

  const getStepStateClass = (stepId: number) => {
    if (stepId < currentStageId) return 'completed'; // ✓
    if (stepId === currentStageId) return 'current'; // ●
    return 'pending'; // ○
  };

  const getStepIcon = (stepId: number) => {
    if (stepId < currentStageId) return <i className="fa-solid fa-check" />;
    if (stepId === currentStageId) return <i className="fa-solid fa-circle" style={{ fontSize: '0.65rem' }} />;
    return <i className="fa-regular fa-circle" style={{ fontSize: '0.65rem' }} />;
  };

  return (
    <div className="track-order-page">
      <SEO
        title="Live Order Delivery Tracking"
        description="Track your dental shipment in real-time across all 7 fulfillment stages from warehouse packaging to expressarrival."
        canonicalUrl="https://buybright.com/track-order"
      />
      <div className="track-order-container">
        {/* Page Top Navigation & Header */}
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>
              <Link to="/" style={{ color: 'var(--color-teal-blue, #3f788c)' }}>Home</Link> /{' '}
              <Link to="/profile?tab=orders" style={{ color: 'var(--color-teal-blue, #3f788c)' }}>My Orders</Link> /{' '}
              <span>Track Order</span>
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--color-dark-navy, #2a3537)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-solid fa-satellite-dish text-teal" /> Live Order Delivery Tracking
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link
              to="/profile?tab=orders"
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
                fontSize: '0.85rem',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <i className="fa-solid fa-arrow-left" /> My Orders
            </Link>
            <Link
              to="/shop"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'var(--color-teal-blue, #3f788c)',
                borderRadius: '8px',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.85rem',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <i className="fa-solid fa-bag-shopping" /> Shop Catalog
            </Link>
          </div>
        </div>

        {/* Live Details Card */}
        <div className="tracking-details-card">
          {/* Top Meta Summary */}
          <div className="tracking-top-meta">
            <div className="meta-block">
              <span>ORDER ID</span>
              <strong style={{ color: 'var(--color-teal-blue, #3f788c)' }}>{orderQuery}</strong>
            </div>
            <div className="meta-block">
              <span>COURIER PARTNER</span>
              <strong>{activeTrackingData?.courier || 'BlueDart Express Air'}</strong>
            </div>
            <div className="meta-block">
              <span>AWB TRACKING NO.</span>
              <strong style={{ fontFamily: 'monospace' }}>
                {activeTrackingData?.trackingNo || 'BLUEDART-84920421'}
              </strong>
            </div>
            <div className="meta-block">
              <span>ESTIMATED ARRIVAL</span>
              <strong style={{ color: '#16a34a' }}>
                {activeTrackingData?.estimatedDelivery || 'Tomorrow by 4:00 PM'}
              </strong>
            </div>
          </div>

          {/* 7-Stage Visual Progression Timeline */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-dark-navy, #2a3537)', marginBottom: '16px' }}>
              <i className="fa-solid fa-timeline text-teal" style={{ marginRight: '8px' }} />
              Shipment Checkpoints &amp; Delivery Progress
            </h3>

            <div className="seven-step-timeline">
              {stages.map((stage) => {
                const stateClass = getStepStateClass(stage.id);
                return (
                  <div key={stage.id} className={`timeline-step-node ${stateClass}`}>
                    <div className="node-icon-bullet">{getStepIcon(stage.id)}</div>
                    <div className="node-content">
                      <div className="node-header">
                        <strong>{stage.name}</strong>
                        <span className="node-time">{stage.timestamp}</span>
                      </div>
                      <p className="node-desc">
                        {stage.desc} &bull; <em>{stage.location}</em>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recipient &Summary */}
          <div className="order-track-meta-grid">
            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                Delivering To:
              </span>
              <strong style={{ display: 'block', fontSize: '0.95rem', color: '#1e293b', marginTop: '3px' }}>
                {activeTrackingData?.sessionData?.formData?.doctorName || '  John Doe'}
              </strong>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#475569' }}>
                {activeTrackingData?.sessionData?.formData?.clinicName || 'Apex Dental & Maxillofacial Clinic'}
              </p>
              <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                {activeTrackingData?.sessionData?.formData?.street || 'Shop 4 & 5, Presto Commercial Hub'},{' '}
                {activeTrackingData?.sessionData?.formData?.city || 'Mumbai'} –{' '}
                {activeTrackingData?.sessionData?.formData?.pincode || '400069'}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>
              <a
                href="https://wa.me/919820123456?text=Hi%20BuyBright%2C%20I%20would%20like%20live%20updates%20on%20my%20order"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: '#25D366',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  justifyContent: 'center',
                }}
              >
                <i className="fa-brands fa-whatsapp" /> WhatsApp Delivery Updates
              </a>

              <Link
                to="/shop"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  color: '#334155',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  justifyContent: 'center',
                }}
              >
                <i className="fa-solid fa-bag-shopping" /> Order More Supplies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;
