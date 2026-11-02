/**
 * BuyBright Checkout & Delivery Address Page.
 * Step 1: Contact Information, SavedAddresses, Add New Address Provision,
 * Order Notes, and Order Summary with Expected Delivery Date.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { SEO } from '../../components/common/SEO';

interface SavedAddress {
  id: string;
  tag: 'Clinic / Practice' | 'Branch Hospital' | 'Home / Residence';
  doctorName: string;
  country: string;
  clinicName?: string;
  mobile: string;
  email: string;
  street: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

const COUNTRIES = [
  'India',
  'United Arab Emirates',
  'Singapore',
  'United Kingdom',
  'United States',
  'Germany',
  'Australia',
  'Canada',
  'Nepal',
  'Sri Lanka',
  'Bangladesh',
];

const INDIAN_STATES = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

export const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, cartCount } = useCart();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Pre-saved Addresses
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([
    {
      id: 'addr-1',
      tag: 'Clinic / Practice',
      doctorName: '  John Doe',
      country: 'India',
      mobile: '9820123456',
      email: ' johndoe@buybright.com',
      street: 'Shop 4 & 5, Presto Commercial Hub, Central MIDC Road',
      locality: 'Andheri East',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400069',
      isDefault: true,
    },
    {
      id: 'addr-2',
      tag: 'Branch Hospital',
      doctorName: '  John Doe',
      country: 'India',
      mobile: '9820123456',
      email: ' johndoe@buybright.com',
      street: 'Ground Floor, Medico Tower, Opposite Civil Hospital',
      locality: 'Shivaji Nagar',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411005',
    },
  ]);

  const [selectedAddressId, setSelectedAddressId] = useState<string>('addr-1');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState<boolean>(false);

  // New Address Form State
  const [newAddress, setNewAddress] = useState({
    tag: 'Clinic / Practice' as 'Clinic / Practice' | 'Branch Hospital' | 'Home / Residence',
    doctorName: '',
    country: 'India',
    mobile: '',
    email: '',
    street: '',
    locality: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    saveToProfile: true,
  });

  // Shipping Method State ('express_priority')
  const [_selectedShippingMethod, setSelectedShippingMethod] = useState<string>('express_priority');

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

  // Pincode Delivery Estimator State
  const [estimatePincode, setEstimatePincode] = useState('400069');
  const [deliveryInfo, setDeliveryInfo] = useState({
    pincode: '400069',
    etaText: '24-48 Hours (Next-Day Dispatch)',
    courierName: 'Express Priority  ',
    zone: 'Metro Express Corridor (Mumbai & Pune)',
    isExpress: true,
  });

  // Validation Errors for new address form
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const calculateDeliveryForPincode = (pin: string) => {
    const trimmed = pin.trim();
    if (!/^\d{6}$/.test(trimmed)) {
      showToast('Please enter a valid 6-digit Indian Postal PIN code', 'warning');
      return;
    }

    if (
      trimmed.startsWith('400') ||
      trimmed.startsWith('411') ||
      trimmed.startsWith('401') ||
      trimmed.startsWith('410') ||
      trimmed.startsWith('422') ||
      trimmed.startsWith('416')
    ) {
      setDeliveryInfo({
        pincode: trimmed,
        etaText: '24-48 Hours (Guaranteed Overnight Dispatch)',
        courierName: 'Express Priority  ',
        zone: 'Western Region Medical Hub (Overnight Air)',
        isExpress: true,
      });
      showToast(`✓ Express Priority Delivery available for PIN ${trimmed}! Arriving within 24-48 Hours.`, 'success');
    } else if (
      trimmed.startsWith('110') || // Delhi
      trimmed.startsWith('560') || // Bangalore
      trimmed.startsWith('600') || // Chennai
      trimmed.startsWith('700') || // Kolkata
      trimmed.startsWith('500') || // Hyderabad
      trimmed.startsWith('380')    // Ahmedabad
    ) {
      setDeliveryInfo({
        pincode: trimmed,
        etaText: '24-48 Hours (Direct  )',
        courierName: 'Express Priority  ',
        zone: 'Tier-1 Metro Air Corridor (48h Direct)',
        isExpress: true,
      });
      showToast(`✓ Priority delivery available for PIN ${trimmed}! Arriving within 24-48 Hours.`, 'success');
    } else {
      setDeliveryInfo({
        pincode: trimmed,
        etaText: '24-48 Hours (Express Dispatch)',
        courierName: 'Express Priority  ',
        zone: 'National Healthcare Distribution Network',
        isExpress: true,
      });
      showToast(`✓ Express Priority Delivery scheduled for PIN ${trimmed} (24-48 Hours).`, 'info');
    }
  };

  // Sync estimate when address selection changes
  React.useEffect(() => {
    const active = savedAddresses.find((a) => a.id === selectedAddressId);
    if (active && active.pincode) {
      setEstimatePincode(active.pincode);
      setDeliveryInfo({
        pincode: active.pincode,
        etaText: '24-48 Hours (Next-Day Dispatch)',
        courierName: 'Express Priority  ',
        zone: 'Western Region Medical Hub (Overnight Air)',
        isExpress: true,
      });
    }
  }, [selectedAddressId, savedAddresses]);

  // Fixed Express Priority Logistics: ₹149.00
  const shippingCharge = 149;

  // Price computations: Total MRP, Discount on MRP, Item Total, Coupon Discount, Shipping Charge
  const totalMrp = React.useMemo(() => {
    return cart.reduce((sum, item) => {
      const itemMrp =
        item.product.old_price && item.product.old_price > item.product.price
          ? item.product.old_price
          : Math.round(item.product.price * 1.25);
      return sum + itemMrp * item.quantity;
    }, 0);
  }, [cart]);

  const itemTotal = cartTotal;
  const discountOnMrp = Math.max(0, totalMrp - itemTotal);
  const couponDiscount = appliedCoupon ? Math.round(itemTotal * appliedCoupon.discount) : 0;
  const grandTotal = Math.max(0, itemTotal - couponDiscount) + shippingCharge;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const code = couponCode.trim().toUpperCase();
    if (code === 'DENTAL10') {
      setAppliedCoupon({ code, discount: 0.1 });
      showToast(`✓ Coupon "${code}" applied! 10% discount added.`, 'success');
      setCouponCode('');
    } else if (code === 'CLINIC20') {
      setAppliedCoupon({ code, discount: 0.2 });
      showToast('✓ Coupon "CLINIC20" applied! 20% discount added.', 'success');
      setCouponCode('');
    } else {
      showToast('Invalid or expired coupon code.', 'danger');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed.', 'info');
  };

  const validateNewAddress = () => {
    const errs: { [key: string]: string } = {};
    if (!newAddress.doctorName.trim()) errs.doctorName = 'Full Name / Attention is required';
    if (!newAddress.country.trim()) errs.country = 'Country is required';
    if (!newAddress.mobile.trim() || newAddress.mobile.length < 10) errs.mobile = 'Enter a valid 10-digit mobile number';
    if (!newAddress.street.trim()) errs.street = 'Flat/Building/Street address is required';
    if (!newAddress.city.trim()) errs.city = 'City is required';
    if (!newAddress.state.trim()) errs.state = 'State is required';
    if (!newAddress.pincode.trim() || newAddress.pincode.length < 6) errs.pincode = 'Enter a valid 6-digit PIN code';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveAndSelectNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateNewAddress()) {
      showToast('Please correct the highlighted fields.', 'danger');
      return;
    }

    const createdAddress: SavedAddress = {
      id: `addr-${Date.now()}`,
      tag: newAddress.tag,
      doctorName: newAddress.doctorName,
      country: newAddress.country || 'India',
      mobile: newAddress.mobile,
      email: newAddress.email || user?.email || 'contact@buybright.com',
      street: newAddress.street,
      locality: newAddress.locality,
      city: newAddress.city,
      state: newAddress.state,
      pincode: newAddress.pincode,
    };

    setSavedAddresses([createdAddress, ...savedAddresses]);
    setSelectedAddressId(createdAddress.id);
    setIsAddingNewAddress(false);
    showToast('✓ New delivery address added & selected!', 'success');
  };

  const handleProceedToPayment = () => {
    if (cart.length === 0) {
      showToast('Your shopping cart is empty! Add products before checkout.', 'warning');
      navigate('/shop');
      return;
    }

    let activeAddress: SavedAddress | undefined;

    if (isAddingNewAddress) {
      if (!validateNewAddress()) {
        showToast('Please complete and save the new address form or select a saved address.', 'danger');
        return;
      }
      activeAddress = {
        id: `addr-${Date.now()}`,
        tag: newAddress.tag,
        doctorName: newAddress.doctorName,
        country: newAddress.country || 'India',
        mobile: newAddress.mobile,
        email: newAddress.email || user?.email || 'doctor@buybright.com',
        street: newAddress.street,
        locality: newAddress.locality,
        city: newAddress.city,
        state: newAddress.state,
        pincode: newAddress.pincode,
      };
    } else {
      activeAddress = savedAddresses.find((a) => a.id === selectedAddressId) || savedAddresses[0];
    }

    if (!activeAddress) {
      showToast('Please select a delivery address.', 'danger');
      return;
    }

    // Store checkout state in session for Payment Page
    const checkoutSession = {
      formData: {
        doctorName: activeAddress.doctorName,
        country: activeAddress.country || 'India',
        mobile: activeAddress.mobile,
        email: activeAddress.email,
        street: activeAddress.street,
        locality: activeAddress.locality,
        city: activeAddress.city,
        state: activeAddress.state,
        pincode: activeAddress.pincode,
        tag: activeAddress.tag,
      },
      pricing: {
        totalMrp,
        discountOnMrp,
        itemTotal,
        cartTotal: itemTotal,
        couponDiscount,
        discountAmount: couponDiscount,
        shippingCharge,
        selectedShippingMethod: 'Express Priority',
        shippingMethodName: 'Express Priority',
        shippingMethodDesc: 'Priority cold-chain   corridor with next-day dispatch.',
        shippingEta: '24-48 Hours',
        grandTotal,
        appliedCoupon: appliedCoupon?.code,
      },
      items: cart,
      orderDate: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      deliveryDate: deliveryInfo.etaText,
    };

    sessionStorage.setItem('prestodental_checkout_session', JSON.stringify(checkoutSession));
    navigate('/payment');
  };

  return (
    <div className="checkout-page-container">
      <SEO
        title="Secure Checkout — Delivery Address"
        description="Secure checkout for authentic dental supplies. Enter shipping details and select express dispatch."
        canonicalUrl="https://buybright.com/checkout"
      />
      <h1 className="visually-hidden">Secure Dental Supplies Checkout &amp; Delivery</h1>
      <div className="checkout-wrapper">
        {/* Top Back Navigation Bar */}
        <div className="checkout-top-nav-bar">
          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="btn-checkout-back"
          >
            <i className="fa-solid fa-arrow-left" /> Back to Cart
          </button>

          <div className="checkout-step-indicator-text">
            Step 1 of 3: <strong>Delivery Address &amp; Contact Details</strong>
          </div>
        </div>

        {/* Step Indicator Header */}
        <div className="checkout-stepper-header">
          <div className="checkout-steps-bar">
            <div className="checkout-step-item active">
              <span className="step-num">1</span>
              <span>Contact &amp; Delivery Address</span>
            </div>
            <div className="checkout-step-divider" />
            <div className="checkout-step-item">
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

        {cart.length === 0 ? (
          <div className="checkout-main-card text-center" style={{ padding: '60px 20px' }}>
            <i className="fa-solid fa-cart-shopping" style={{ fontSize: '3.5rem', color: '#cbd5e1', marginBottom: '16px' }} />
            <h2>Your Shopping Cart is Empty</h2>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>
              Select dental consumables, instruments, or materials before checking out.
            </p>
            <Link to="/shop" className="btn-proceed-cta" style={{ maxWidth: '240px', margin: '0 auto' }}>
              <i className="fa-solid fa-bag-shopping" /> Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="checkout-grid-layout">
            {/* Left Column: Address Selection & Form */}
            <div>
              {/* Card 1: Saved Addresses Selector */}
              <div className="checkout-main-card">
                <div className="checkout-card-header">
                  <h2>
                    <i className="fa-solid fa-location-dot" /> Select Delivery Address
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddress(!isAddingNewAddress)}
                    className={`btn-add-address-toggle ${isAddingNewAddress ? 'is-canceling' : ''}`}
                  >
                    <i className={`fa-solid ${isAddingNewAddress ? 'fa-xmark' : 'fa-plus'}`} />
                    {isAddingNewAddress ? 'Cancel' : 'Add New Address'}
                  </button>
                </div>

                {/* Saved Address Cards Grid */}
                {!isAddingNewAddress && (
                  <div className="saved-addresses-list">
                    {savedAddresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <div
                          key={addr.id}
                          className={`saved-address-card ${isSelected ? 'is-selected' : ''}`}
                          onClick={() => setSelectedAddressId(addr.id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && setSelectedAddressId(addr.id)}
                        >
                          <input
                            type="radio"
                            name="selectedAddress"
                            checked={isSelected}
                            onChange={() => setSelectedAddressId(addr.id)}
                            className="address-radio"
                          />

                          <div className="address-card-body">
                            <div className="address-tags-row">
                              <span className="tag-badge">
                                {addr.tag}
                              </span>
                              {addr.isDefault && (
                                <span className="default-badge">
                                  Default
                                </span>
                              )}
                            </div>

                            <strong className="doctor-name">
                              {addr.doctorName}
                            </strong>
                            {addr.clinicName && (
                              <span className="clinic-name">
                                {addr.clinicName}
                              </span>
                            )}
                            <p className="address-text">
                              {addr.street}, {addr.locality ? `${addr.locality}, ` : ''}{addr.city}, {addr.state}, {addr.country || 'India'} – <strong>{addr.pincode}</strong>
                            </p>
                            <span className="phone-text">
                              <i className="fa-solid fa-phone text-teal" />
                              Mobile: +91 {addr.mobile}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Add New Address Form Modal/Pane */}
                {isAddingNewAddress && (
                  <form onSubmit={handleSaveAndSelectNewAddress} className="new-address-form-pane">
                    <h3 className="form-pane-title">
                      <i className="fa-solid fa-plus-circle text-teal" /> Add New Delivery Location
                    </h3>

                    {/* Address Type Tag Selector */}
                    <div className="address-tag-selector">
                      <label className="address-tag-label">
                        Address Type Tag:
                      </label>
                      <div className="address-tag-buttons">
                        {(['Clinic / Practice', 'Branch Hospital', 'Home / Residence'] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setNewAddress({ ...newAddress, tag: t })}
                            className={`address-tag-btn ${newAddress.tag === t ? 'is-active' : ''}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="checkout-form-grid">
                      <div className="checkout-form-group">
                        <label>
                          Full Name / Attention <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g.   John Doe"
                          value={newAddress.doctorName}
                          onChange={(e) => {
                            setNewAddress({ ...newAddress, doctorName: e.target.value });
                            if (errors.doctorName) setErrors({ ...errors, doctorName: '' });
                          }}
                          className={errors.doctorName ? 'has-error' : ''}
                        />
                        {errors.doctorName && <span className="contact-field-error">{errors.doctorName}</span>}
                      </div>

                      <div className="checkout-form-group">
                        <label>
                          Country / Region <span className="required">*</span>
                        </label>
                        <select
                          value={newAddress.country}
                          onChange={(e) => {
                            setNewAddress({ ...newAddress, country: e.target.value });
                            if (errors.country) setErrors({ ...errors, country: '' });
                          }}
                          className={errors.country ? 'has-error' : ''}
                        >
                          {COUNTRIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        {errors.country && <span className="contact-field-error">{errors.country}</span>}
                      </div>

                      <div className="checkout-form-group">
                        <label>
                          Contact Mobile Number (For Courier Delivery) <span className="required">*</span>
                        </label>
                        <input
                          type="tel"
                          placeholder="e.g. 9820123456"
                          value={newAddress.mobile}
                          onChange={(e) => {
                            setNewAddress({ ...newAddress, mobile: e.target.value });
                            if (errors.mobile) setErrors({ ...errors, mobile: '' });
                          }}
                          className={errors.mobile ? 'has-error' : ''}
                        />
                        {errors.mobile && <span className="contact-field-error">{errors.mobile}</span>}
                      </div>

                      <div className="checkout-form-group">
                        <label>Email Address</label>
                        <input
                          type="email"
                          placeholder="e.g. doctor@clinic.com"
                          value={newAddress.email}
                          onChange={(e) => setNewAddress({ ...newAddress, email: e.target.value })}
                        />
                      </div>

                      <div className="checkout-form-group">
                        <label>
                          State <span className="required">*</span>
                        </label>
                        <select
                          value={newAddress.state}
                          onChange={(e) => {
                            setNewAddress({ ...newAddress, state: e.target.value });
                            if (errors.state) setErrors({ ...errors, state: '' });
                          }}
                          className={errors.state ? 'has-error' : ''}
                        >
                          <option value="">Select State / UT</option>
                          {INDIAN_STATES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                        {errors.state && <span className="contact-field-error">{errors.state}</span>}
                      </div>

                      <div className="checkout-form-group">
                        <label>
                          City <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Mumbai"
                          value={newAddress.city}
                          onChange={(e) => {
                            setNewAddress({ ...newAddress, city: e.target.value });
                            if (errors.city) setErrors({ ...errors, city: '' });
                          }}
                          className={errors.city ? 'has-error' : ''}
                        />
                        {errors.city && <span className="contact-field-error">{errors.city}</span>}
                      </div>

                      <div className="checkout-form-group">
                        <label>
                          6-Digit PIN Code <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="e.g. 400069"
                          value={newAddress.pincode}
                          onChange={(e) => {
                            setNewAddress({ ...newAddress, pincode: e.target.value });
                            if (errors.pincode) setErrors({ ...errors, pincode: '' });
                          }}
                          className={errors.pincode ? 'has-error' : ''}
                        />
                        {errors.pincode && <span className="contact-field-error">{errors.pincode}</span>}
                      </div>

                      <div className="checkout-form-group">
                        <label>Locality / Landmark</label>
                        <input
                          type="text"
                          placeholder="e.g. Near Metro Station / MIDC"
                          value={newAddress.locality}
                          onChange={(e) => setNewAddress({ ...newAddress, locality: e.target.value })}
                        />
                      </div>

                      <div className="checkout-form-group form-group-full">
                        <label>
                          Flat / Room / Building / Street Address <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Suite 402, 4th Floor, Presto Commercial Hub, Central Road"
                          value={newAddress.street}
                          onChange={(e) => {
                            setNewAddress({ ...newAddress, street: e.target.value });
                            if (errors.street) setErrors({ ...errors, street: '' });
                          }}
                          className={errors.street ? 'has-error' : ''}
                        />
                        {errors.street && <span className="contact-field-error">{errors.street}</span>}
                      </div>
                    </div>

                    <div className="form-actions-row">
                      <button
                        type="submit"
                        className="btn-form-submit"
                      >
                        Save &amp; Deliver Here
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsAddingNewAddress(false)}
                        className="btn-form-cancel"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* 2. Shipping Options & Logistics Selection */}
              <div className="checkout-main-card">
                <div className="checkout-card-header">
                  <h2>
                    <i className="fa-solid fa-truck-fast" /> Shipping Options  
                  </h2>
                  <span className="header-badge" style={{ background: '#ccfbf1', color: '#0f766e', borderColor: '#99f6e4' }}>
                    <i className="fa-solid fa-snowflake" /> Cold-Chain Priority Corridor
                  </span>
                </div>

                <div className="shipping-options-section">
                  {/* Responsive Visual Selection Radio Cards */}
                  <div className="shipping-cards-grid">
                    {/* Option: Express Priority */}
                    <div
                      className="shipping-method-card is-selected"
                      onClick={() => setSelectedShippingMethod('express_priority')}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && setSelectedShippingMethod('express_priority')}
                      style={{ borderColor: '#0f766e', background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)' }}
                    >
                      <div className="card-header-row">
                        <div className="card-icon-title">
                          <div className="icon-box" style={{ background: '#ccfbf1', color: '#0f766e', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.05rem' }}>
                            <i className="fa-solid fa-truck-fast" />
                          </div>
                          <div>
                            <span className="card-name" style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Express Priority</span>
                            <span style={{ display: 'block', fontSize: '0.74rem', color: '#0f766e', fontWeight: 700 }}>Direct Flight Cargo</span>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="shippingMethodSelection"
                          checked={true}
                          readOnly
                          style={{ accentColor: '#0f766e', width: '18px', height: '18px' }}
                        />
                      </div>
                      <p className="card-description" style={{ fontSize: '0.86rem', color: '#334155', lineHeight: 1.5, margin: '8px 0' }}>
                        Priority cold-chain   corridor with next-day dispatch.
                      </p>
                      <div className="card-footer-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                        <span className="eta-badge" style={{ background: '#ccfbf1', color: '#0f766e', fontWeight: 800, fontSize: '0.82rem', padding: '4px 10px', borderRadius: '6px', border: '1px solid #99f6e4' }}>
                          <i className="fa-regular fa-clock" style={{ marginRight: '4px' }} /> 24-48 Hours
                        </span>
                        <span className="price-badge" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f766e' }}>
                          ₹149.00
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Status Banner */}
                  <div className="shipping-summary-banner" style={{ background: '#f0fdfa', borderColor: '#99f6e4' }}>
                    <div className="banner-left">
                      <i className="fa-solid fa-circle-check" style={{ color: '#0f766e' }} />
                      <div className="banner-text">
                        <span style={{ color: '#134e4a' }}>Selected Method: </span>
                        <strong style={{ color: '#0f766e' }}>
                          Express Priority (₹149.00) &bull; 24-48 Hours
                        </strong>
                      </div>
                    </div>
                    <div className="banner-right" style={{ color: '#0f766e' }}>
                      <i className="fa-solid fa-shield-halved" /> Guaranteed Medical Logistics
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Summary Column */}
            <div className="checkout-summary-card">
              <h3 className="summary-title">Order Summary ({cartCount} items)</h3>

              {/* Interactive Pincode Delivery Estimator */}
              <div className="checkout-pincode-estimator">
                <div className="estimator-header">
                  <div className="estimator-title">
                    <i className="fa-solid fa-location-dot text-teal" />
                    <span>Check Delivery for PIN</span>
                  </div>
                  <span className="badge-pincode-active">PIN: {deliveryInfo.pincode}</span>
                </div>

                <div className="estimator-input-group">
                  <input
                    type="text"
                    placeholder="Enter 6-digit PIN code"
                    maxLength={6}
                    value={estimatePincode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setEstimatePincode(val);
                      if (val.length === 6) {
                        calculateDeliveryForPincode(val);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        calculateDeliveryForPincode(estimatePincode);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => calculateDeliveryForPincode(estimatePincode)}
                  >
                    Check
                  </button>
                </div>

                {/* Dynamic Delivery ETA Result */}
                <div className="delivery-eta-result-box">
                  <div className="eta-main-row">
                    <div className="eta-icon-circle">
                      <i className="fa-solid fa-truck-fast" />
                    </div>
                    <div className="eta-details">
                      <div className="eta-highlight">
                        <span className="eta-label">Expected Delivery:</span>
                        <span className="eta-time">{deliveryInfo.etaText}</span>
                      </div>
                      <div className="eta-carrier">
                        <i className="fa-solid fa-truck-fast" /> {deliveryInfo.courierName}
                      </div>
                      <div className="eta-zone-tag">{deliveryInfo.zone}</div>
                    </div>
                  </div>
                  
                </div>
              </div>

              {/* Mini Item List */}
              <div className="summary-items-list">
                {cart.map((item) => (
                  <div key={item.product.id} className="summary-item-row">
                    <img src={item.product.image || '/images/cat_instruments_1787401955005.jpg'} alt={item.product.name} />
                    <div className="item-meta">
                      <span className="item-name" title={item.product.name}>
                        {item.product.name}
                      </span>
                      <span className="item-qty-price">
                        Qty: {item.quantity} × ₹{item.product.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="item-total">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Code Input */}
              <form onSubmit={handleApplyCoupon} className="coupon-box">
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
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

              {/* Price Breakdown */}
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
                  <span className="grand-total-amount">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Next Step CTA */}
              <button
                type="button"
                className="btn-proceed-cta"
                onClick={handleProceedToPayment}
              >
                <span>Proceed to Payment</span>
                <i className="fa-solid fa-arrow-right" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="btn-secondary-back-cart"
              >
                <i className="fa-solid fa-arrow-left" /> Return to Cart
              </button>

              
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
