/**
 * BuyBright Admin — Add / Edit Flash Sale Products.
 * Features:
 *   1. Multi-select product list (checkbox-style) — select multiple products at once
 *   2. Per-Product Flash Sale Price inputs in a table view
 *   3. Flash Sale Start & End Date/Time
 *   4. Status (Active / Inactive)
 *   5. Real-time Live Storefront Preview
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { getFlashSales, saveFlashSales, FlashSaleItem } from '../../data/flashSaleData';
import { initialProductsData } from '../../data/productsData';
import { Input, Select, Button, MultiSelectDropdown } from '../../components/Form';
import type { MultiSelectOption } from '../../components/Form';
import { useToast } from '../../../context/ToastContext';

// Available Dental Catalog Products
const DENTAL_CATALOG = [
  { productId: 'prod-2', productName: 'Superendo Gold Rotary NiTi Files (Pack of 6)', brand: 'SUPERENDO', image: '/images/cat_endodontic_1787401934680.jpg', originalPrice: 1699, categoryLink: '/shop?category=endodontics' },
  { productId: 'prod-8', productName: 'Waldent FlexiShield Dam Sheets Box of 36', brand: 'WALDENT', image: '/images/cat_consumables_1787401910059.jpg', originalPrice: 1800, categoryLink: '/shop?category=consumables' },
  { productId: 'prod-3', productName: 'Woodpecker iLed Plus 1-Sec Curing Light', brand: 'WOODPECKER', image: '/images/cat_handpieces_1787401976899.jpg', originalPrice: 12999, categoryLink: '/shop?category=equipment' },
  { productId: 'prod-1', productName: '3M Filtek Z350 XT Universal Restorative Composite', brand: '3M ESPE', image: '/images/cat_materials_1787401998270.jpg', originalPrice: 4599, categoryLink: '/shop?category=materials' },
  { productId: 'prod-9', productName: 'Dentsply AH Plus Bioceramic Root Canal Sealer Paste Syringe', brand: 'Dentsply Sirona', image: '/images/cat_endodontic_1787401934680.jpg', originalPrice: 4100, categoryLink: '/shop?category=endodontics' },
  { productId: 'se-2', productName: 'Superendo Pro-Apex 5th Gen Multi-Frequency Apex Locator', brand: 'SUPERENDO', image: '/images/cat_handpieces_1787401976899.jpg', originalPrice: 8200, categoryLink: '/shop?category=equipment' },
  { productId: 'prod-12', productName: 'Waldent German Stainless Extraction Forceps Set of 12', brand: 'WALDENT', image: '/images/cat_instruments_1787401955005.jpg', originalPrice: 5600, categoryLink: '/shop?category=instruments' },
  { productId: 'prod-20', productName: 'Medicept Extreme Lite VPS Wash 50ml', brand: 'Medicept', image: '/images/showcase_medicept.png', originalPrice: 2200, categoryLink: '/shop?category=consumables' },
];

const ALL_CATALOG_PRODUCTS = [
  ...DENTAL_CATALOG,
  ...initialProductsData
    .filter((p) => !DENTAL_CATALOG.some((d) => d.productId === p.id))
    .map((p) => ({
      productId: p.id,
      productName: p.name,
      brand: p.brand || 'BuyBright',
      image: p.image || '/images/cat_consumables_1787401910059.jpg',
      originalPrice: p.mrp || p.price || 1500,
      categoryLink: `/shop?category=${p.category ? p.category.toLowerCase() : 'all'}`,
    })),
];

export const PRICE_BOUNDS: { [key: string]: { min: number; max: number } } = {
  'under-500': { min: 0, max: 500 },
  '500-2000': { min: 500, max: 2000 },
  '2000-5000': { min: 2000, max: 5000 },
  '5000-10000': { min: 5000, max: 10000 },
  '10000-25000': { min: 10000, max: 25000 },
  'above-25000': { min: 25000, max: 1000000 },
};

export const PRICE_RANGE_OPTIONS: MultiSelectOption[] = [
  { value: 'under-500', label: 'Under ₹500', subLabel: 'Budget Deals & Daily Consumables (Up to ₹500)' },
  { value: '500-2000', label: '₹500 – ₹2,000', subLabel: 'Daily Clinic Essentials (₹500 - ₹2,000)' },
  { value: '2000-5000', label: '₹2,000 – ₹5,000', subLabel: 'Endodontics & Restoratives (₹2,000 - ₹5,000)' },
  { value: '5000-10000', label: '₹5,000 – ₹10,000', subLabel: 'Instruments & Diagnostics (₹5,000 - ₹10,000)' },
  { value: '10000-25000', label: '₹10,000 – ₹25,000', subLabel: 'Curing Lights & Clinical Units (₹10,000 - ₹25,000)' },
  { value: 'above-25000', label: 'Above ₹25,000', subLabel: 'High-Value Equipment & Autoclaves (Above ₹25,000)' },
];

export const FlashSaleForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = Boolean(id);

  // Multi-Product Selection
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [productPrices, setProductPrices] = useState<{ [productId: string]: number }>({});

  // Multi-Price Selection (Same design as Select Product)
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);

  // Flash Sale Image
  const [flashImage, setFlashImage] = useState<string>('');
  const [flashImagePreview, setFlashImagePreview] = useState<string>('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Flash Sale Banner Content Fields
  const [heading, setHeading] = useState<string>('');
  const [shortDescription, setShortDescription] = useState<string>('');
  const [buttonName, setButtonName] = useState<string>('Shop Now');

  // Flash Sale Timing & Status
  const [startDate, setStartDate] = useState<string>('2026-10-06T00:00');
  const [endDate, setEndDate] = useState<string>('2026-10-15T23:59');
  const [status, setStatus] = useState<FlashSaleItem['status']>('Active');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const statusOptions = [
    { value: 'Active', label: 'Active — Publish on Storefront Flash Deals' },
    { value: 'Inactive', label: 'Inactive' },
  ];

  // Load existing data in edit mode
  useEffect(() => {
    if (isEdit && id) {
      const all = getFlashSales();
      const existing = all.find((i) => i.id === id);
      if (existing) {
        setSelectedProductIds([existing.productId]);
        setProductPrices({ [existing.productId]: existing.flashSalePrice });
        const prod = ALL_CATALOG_PRODUCTS.find((p) => p.productId === existing.productId);
        if (prod) {
          const matched = Object.entries(PRICE_BOUNDS).find(
            ([_, bound]) => prod.originalPrice >= bound.min && prod.originalPrice <= bound.max
          );
          if (matched) {
            setSelectedPrices([matched[0]]);
          }
        }
        setStartDate(existing.startDate);
        setEndDate(existing.endDate);
        setStatus(existing.status);
        if (existing.heading) setHeading(existing.heading);
        if (existing.shortDescription) setShortDescription(existing.shortDescription);
        if (existing.buttonName) setButtonName(existing.buttonName);
        if ((existing as any).flashBannerImage) {
          setFlashImage((existing as any).flashBannerImage);
          setFlashImagePreview((existing as any).flashBannerImage);
        }
      } else {
        showToast('Flash sale item not found', 'danger');
        navigate('/admin/flash-sales');
      }
    }
  }, [id, isEdit, navigate, showToast]);

  // Native <select multiple> change handler
  const handleMultiSelectChange = (chosen: string[]) => {
    const newPrices = { ...productPrices };
    chosen.forEach((pId) => {
      if (!newPrices[pId]) {
        const prod = ALL_CATALOG_PRODUCTS.find((p) => p.productId === pId);
        newPrices[pId] = prod ? Math.round(prod.originalPrice * 0.75) : 999;
      }
    });
    // Remove prices for deselected products
    Object.keys(newPrices).forEach((pId) => {
      if (!chosen.includes(pId)) delete newPrices[pId];
    });
    setSelectedProductIds(chosen);
    setProductPrices(newPrices);
    if (errors.product) setErrors((prev) => ({ ...prev, product: '' }));

    // Sync selected price ranges based on newly chosen products
    const matchedRanges = new Set<string>();
    chosen.forEach((pId) => {
      const prod = ALL_CATALOG_PRODUCTS.find((p) => p.productId === pId);
      if (prod) {
        Object.entries(PRICE_BOUNDS).forEach(([rangeKey, bound]) => {
          if (prod.originalPrice >= bound.min && prod.originalPrice <= bound.max) {
            matchedRanges.add(rangeKey);
          }
        });
      }
    });
    if (matchedRanges.size > 0 && selectedPrices.length === 0) {
      setSelectedPrices(Array.from(matchedRanges));
    }
  };

  // Price Multi-Select Change Handler
  const handlePriceSelectChange = (chosenPrices: string[]) => {
    setSelectedPrices(chosenPrices);
    if (errors.price) setErrors((prev) => ({ ...prev, price: '' }));

    if (chosenPrices.length > 0) {
      // Auto-select all products matching the chosen price ranges
      const matchingProductIds = ALL_CATALOG_PRODUCTS.filter((p) =>
        chosenPrices.some((rangeKey) => {
          const bound = PRICE_BOUNDS[rangeKey];
          return bound && p.originalPrice >= bound.min && p.originalPrice <= bound.max;
        })
      ).map((p) => p.productId);

      const combined = Array.from(new Set([...selectedProductIds, ...matchingProductIds]));
      setSelectedProductIds(combined);

      const newPrices = { ...productPrices };
      combined.forEach((pId) => {
        if (!newPrices[pId]) {
          const prod = ALL_CATALOG_PRODUCTS.find((p) => p.productId === pId);
          newPrices[pId] = prod ? Math.round(prod.originalPrice * 0.75) : 999;
        }
      });
      setProductPrices(newPrices);
      if (errors.product) setErrors((prev) => ({ ...prev, product: '' }));
    }
  };

  // Filter products by selected price ranges if any are chosen
  const displayedProducts = useMemo(() => {
    if (selectedPrices.length === 0) return ALL_CATALOG_PRODUCTS;
    return ALL_CATALOG_PRODUCTS.filter((p) => {
      if (selectedProductIds.includes(p.productId)) return true;
      return selectedPrices.some((rangeKey) => {
        const bound = PRICE_BOUNDS[rangeKey];
        return bound && p.originalPrice >= bound.min && p.originalPrice <= bound.max;
      });
    });
  }, [selectedPrices, selectedProductIds]);

  // Price change
  const handlePriceChange = (prodId: string, value: number) => {
    setProductPrices((prev) => ({ ...prev, [prodId]: value }));
    if (errors[`price_${prodId}`]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[`price_${prodId}`];
        return copy;
      });
    }
  };

  // Flash Sale Image upload handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFlashImage(result);
      setFlashImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  // Remove image
  const handleRemoveImage = () => {
    setFlashImage('');
    setFlashImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };


  // Preview product
  const previewProduct = useMemo(() => {
    if (selectedProductIds.length === 0) return ALL_CATALOG_PRODUCTS[0];
    return ALL_CATALOG_PRODUCTS.find((p) => p.productId === selectedProductIds[0]) || ALL_CATALOG_PRODUCTS[0];
  }, [selectedProductIds]);

  const previewPrice = productPrices[previewProduct.productId] ?? Math.round(previewProduct.originalPrice * 0.75);
  const previewSavings = previewProduct.originalPrice - previewPrice;
  const previewDiscount = Math.max(0, Math.round((previewSavings / previewProduct.originalPrice) * 100));

  // Submit
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (selectedProductIds.length === 0) {
      newErrors.product = 'Please select at least one product for the flash sale';
    }

    selectedProductIds.forEach((prodId) => {
      const prod = ALL_CATALOG_PRODUCTS.find((p) => p.productId === prodId);
      const price = productPrices[prodId];
      if (!price || price <= 0) {
        newErrors[`price_${prodId}`] = 'Price must be greater than 0';
      } else if (prod && price >= prod.originalPrice) {
        newErrors[`price_${prodId}`] = `Must be less than MRP ₹${prod.originalPrice.toLocaleString('en-IN')}`;
      }
    });

    if (!startDate) newErrors.startDate = 'Start date and time is required';
    if (!endDate) newErrors.endDate = 'End date and time is required';
    else if (new Date(endDate) <= new Date(startDate)) newErrors.endDate = 'End date must be after start date';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please fix the errors in the form', 'danger');
      return;
    }

    setErrors({});
    const all = getFlashSales();
    const nowISO = new Date().toISOString().slice(0, 16);

    if (isEdit && id) {
      const prod = previewProduct;
      const flashPrice = productPrices[prod.productId] || previewPrice;
      const calcDiscount = Math.max(0, Math.round(((prod.originalPrice - flashPrice) / prod.originalPrice) * 100));
      const updatedItem: FlashSaleItem = {
        id, productId: prod.productId, productName: prod.productName, brand: prod.brand,
        image: flashImage || prod.image, originalPrice: prod.originalPrice, flashSalePrice: flashPrice,
        discountPercentage: calcDiscount, startDate, endDate, status, categoryLink: prod.categoryLink,
        heading: heading.trim(), shortDescription: shortDescription.trim(), buttonName: buttonName.trim(),
        createdAt: all.find((i) => i.id === id)?.createdAt || nowISO, updatedAt: nowISO,
      };
      saveFlashSales(all.map((i) => (i.id === id ? updatedItem : i)));
      showToast(`Flash sale for "${prod.productName}" updated!`, 'success');
    } else {
      const newItems: FlashSaleItem[] = selectedProductIds.map((prodId, idx) => {
        const prod = ALL_CATALOG_PRODUCTS.find((p) => p.productId === prodId) || ALL_CATALOG_PRODUCTS[0];
        const flashPrice = productPrices[prodId] || Math.round(prod.originalPrice * 0.75);
        const calcDiscount = Math.max(0, Math.round(((prod.originalPrice - flashPrice) / prod.originalPrice) * 100));
        return {
          id: `fs-${Date.now()}-${idx + 1}`, productId: prod.productId, productName: prod.productName,
          brand: prod.brand, image: flashImage || prod.image, originalPrice: prod.originalPrice,
          flashSalePrice: flashPrice, discountPercentage: calcDiscount, startDate, endDate,
          status, categoryLink: prod.categoryLink,
          heading: heading.trim(), shortDescription: shortDescription.trim(), buttonName: buttonName.trim(),
          createdAt: nowISO, updatedAt: nowISO,
        };
      });
      const existingFiltered = all.filter((i) => !selectedProductIds.includes(i.productId));
      saveFlashSales([...newItems, ...existingFiltered]);
      showToast(`✓ Flash sale created for ${newItems.length} product(s)!`, 'success');
    }

    navigate('/admin/flash-sales');
  };

  return (
    <AdminLayout
      title={isEdit ? `Edit Flash Sale` : 'Create Flash Sale'}
      subtitle="Select multiple products, set flash sale prices, and configure dates"
    >
      <form onSubmit={handleSave} className="admin-flash-sales-form-wrapper">
        {/* Breadcrumb + Actions Bar */}
        <div className="fs-top-bar">
          <Link to="/admin/flash-sales" className="fs-back-link">
            <i className="fa-solid fa-arrow-left" />
            Back to Flash Sales
          </Link>

          <div className="fs-action-buttons">
            <Button type="button" variant="outline" size="md" onClick={() => navigate('/admin/flash-sales')}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" icon="fa-solid fa-bolt">
              {isEdit ? 'Update Flash Sale' : `Save Flash Sale${selectedProductIds.length > 0 ? ` (${selectedProductIds.length})` : ''}`}
            </Button>
          </div>
        </div>

        {/* Main 2-column layout */}
        <div className="fs-form-layout">

          {/* LEFT COLUMN */}
          <div className="fs-main-col">

            {/* SECTION 1: Product Multi-Select + Prices */}
            <div className="fs-card">
              <div className="fs-card-header">
                <div>
                  <h3 className="fs-card-title">
                    <i className="fa-solid fa-box-open" />
                    Select Products & Set Flash Prices
                  </h3>
                  <p className="fs-card-desc">
                    Click the dropdown, search and tick products. Set flash price for each below.
                  </p>
                </div>
              </div>

              {/* Two MultiSelectDropdowns */}
              <div className="fs-selects-grid">
                <MultiSelectDropdown
                  label="Select Product(s) *"
                  placeholder="Click to select products..."
                  options={displayedProducts.map((p): MultiSelectOption => ({
                    value: p.productId,
                    label: p.productName,
                    subLabel: `${p.brand} · MRP: ₹${p.originalPrice.toLocaleString('en-IN')}`,
                  }))}
                  value={selectedProductIds}
                  onChange={handleMultiSelectChange}
                  error={errors.product}
                  listMaxHeight={300}
                />

                <MultiSelectDropdown
                  label="Select Price *"
                  placeholder="Click to select price ranges..."
                  options={PRICE_RANGE_OPTIONS}
                  value={selectedPrices}
                  onChange={handlePriceSelectChange}
                  error={errors.price}
                  listMaxHeight={300}
                />
              </div>

              {/* Per-Product Flash Sale Price Table */}
              {selectedProductIds.length > 0 && (
                <div className="fs-price-table-section">
                  <label className="fs-price-table-label">
                    <i className="fa-solid fa-tag" />
                    Set Flash Sale Price for Each Product
                  </label>

                  <div className="fs-price-table-card">
                    {/* Table header */}
                    <div className="fs-price-table-header">
                      <span>Product</span>
                      <span>Flash Sale Price (₹)</span>
                      <span></span>
                    </div>

                    {/* Table rows */}
                    {selectedProductIds.map((prodId, idx) => {
                      const prod = ALL_CATALOG_PRODUCTS.find((p) => p.productId === prodId);
                      if (!prod) return null;
                      const priceVal = productPrices[prodId] ?? Math.round(prod.originalPrice * 0.75);
                      const savings = prod.originalPrice - priceVal;
                      const discPct = Math.max(0, Math.round((savings / prod.originalPrice) * 100));
                      const priceErr = errors[`price_${prodId}`];

                      return (
                        <div
                          key={prodId}
                          className={`fs-price-table-row ${idx % 2 !== 0 ? 'is-alternate' : ''} ${priceErr ? 'has-error' : ''}`}
                        >
                          {/* Product info */}
                          <div className="fs-prod-col">
                            <img
                              src={prod.image}
                              alt={prod.productName}
                              className="fs-prod-img"
                            />
                            <div className="fs-prod-meta">
                              <div className="fs-prod-name">
                                {prod.productName}
                              </div>
                              <div className="fs-prod-sub">
                                {prod.brand} &nbsp;•&nbsp; MRP: ₹{prod.originalPrice.toLocaleString('en-IN')}
                              </div>
                            </div>
                          </div>

                          {/* Desktop contents / Mobile flex container */}
                          <div className="fs-mobile-row-bottom">
                            {/* Price input */}
                            <div className="fs-price-col">
                              <div className="fs-price-input-wrap">
                                <span className="fs-currency-sym">₹</span>
                                <input
                                  type="number"
                                  min={1}
                                  max={prod.originalPrice - 1}
                                  value={priceVal}
                                  onChange={(e) => handlePriceChange(prodId, Number(e.target.value))}
                                  className={`fs-price-input ${priceErr ? 'input-error' : ''}`}
                                />
                                {discPct > 0 && !priceErr && (
                                  <span className="fs-discount-tag">-{discPct}%</span>
                                )}
                              </div>
                              {priceErr ? (
                                <p className="fs-price-help-text text-error">{priceErr}</p>
                              ) : (
                                <p className="fs-price-help-text">Save ₹{Math.max(0, savings).toLocaleString('en-IN')}</p>
                              )}
                            </div>

                            {/* Deselect button */}
                            <div className="fs-action-col">
                              <button
                                type="button"
                                onClick={() => {
                                  const newIds = selectedProductIds.filter((p) => p !== prodId);
                                  setSelectedProductIds(newIds);
                                  const newPrices = { ...productPrices };
                                  delete newPrices[prodId];
                                  setProductPrices(newPrices);
                                }}
                                title="Remove this product"
                                className="fs-remove-btn"
                              >
                                <i className="fa-solid fa-xmark" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Flash Sale Banner Image Upload */}
              <div className="admin-form-group fs-banner-section">
                <label className="fs-banner-label">
                  <i className="fa-solid fa-image" />
                  Flash Sale Banner Image (Optional)
                </label>

                {!flashImagePreview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="fs-dropzone"
                  >
                    <i className="fa-solid fa-cloud-arrow-up fs-dropzone-icon" />
                    <p className="fs-dropzone-title">Click to upload banner image</p>
                    <p className="fs-dropzone-hint">PNG, JPG, WEBP — Recommended: 1200×400px</p>
                  </div>
                ) : (
                  <div className="fs-preview-wrap">
                    <img
                      src={flashImagePreview}
                      alt="Flash Sale Banner Preview"
                      className="fs-banner-img"
                    />
                    <div className="fs-banner-overlay-actions">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="fs-overlay-btn btn-change"
                      >
                        <i className="fa-solid fa-pen" /> Change
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="fs-overlay-btn btn-remove"
                      >
                        <i className="fa-solid fa-trash" /> Remove
                      </button>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <p className="fs-banner-info-note">
                  This banner will be displayed on the Flash Deals section on the storefront.
                </p>
              </div>
            </div>

            {/* SECTION 2: Banner Heading, Short Description & Button Name */}
            <div className="fs-card">
              <div className="fs-card-header">
                <div>
                  <h3 className="fs-card-title">
                    <i className="fa-solid fa-heading" />
                    Banner Content &amp; Details
                  </h3>
                  <p className="fs-card-desc">
                    Set the heading, short description, and button name for the flash sale banner on the storefront.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <Input
                  label="Heading"
                  placeholder="e.g. Refresh Your Space"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  helperText="Primary banner title / headline"
                />

                <Input
                  label="Button Name"
                  placeholder="e.g. Shop Operatory"
                  value={buttonName}
                  onChange={(e) => setButtonName(e.target.value)}
                  helperText="CTA button label (e.g. Shop Now)"
                />
              </div>

              <div style={{ marginTop: '2px', marginBottom: '4px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#334155',
                    marginBottom: '5px',
                  }}
                >
                  Short Description
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Modern clinical essentials for a calmer, happier operatory."
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.88rem',
                    color: '#0f172a',
                    outline: 'none',
                    boxSizing: 'border-box',
                    background: '#ffffff',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                />
                <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                  Brief subtitle text displayed under the heading
                </span>
              </div>
            </div>

            {/* SECTION 3: Dates & Status */}
            <div className="fs-card">
              <div className="fs-card-header">
                <h3 className="fs-card-title">
                  <i className="fa-solid fa-calendar-days" />
                  Sale Schedule & Status
                </h3>
              </div>
              <div className="fs-schedule-grid">
                <Input
                  label="Start Date & Time *"
                  type="datetime-local"
                  required
                  value={startDate}
                  onChange={(e) => { setStartDate(e.target.value); if (errors.startDate) setErrors((p) => ({ ...p, startDate: '' })); }}
                  error={errors.startDate}
                />
                <Input
                  label="End Date & Time *"
                  type="datetime-local"
                  required
                  value={endDate}
                  onChange={(e) => { setEndDate(e.target.value); if (errors.endDate) setErrors((p) => ({ ...p, endDate: '' })); }}
                  error={errors.endDate}
                />
              </div>
              <Select
                label="Status *"
                options={statusOptions}
                value={status}
                onChange={(e) => setStatus(e.target.value as FlashSaleItem['status'])}
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Live Preview */}
          <div className="fs-side-col">
            <div className="fs-preview-card-sticky">
              <h4 className="fs-preview-title">
                <i className="fa-solid fa-eye" />
                Live Storefront Preview
              </h4>

              {/* Storefront Product Card */}
              <div className="fs-preview-product-card">
                {previewDiscount > 0 && (
                  <span className="fs-discount-badge">
                    -{previewDiscount}% OFF
                  </span>
                )}
                <div className="fs-img-container">
                  <img src={previewProduct.image} alt={previewProduct.productName} />
                </div>
                <div className="fs-prod-details">
                  <div className="fs-preview-brand">{previewProduct.brand}</div>
                  <div className="fs-preview-name">
                    {previewProduct.productName}
                  </div>
                  <div className="fs-preview-price-row">
                    <span className="fs-price-sale">₹{previewPrice.toLocaleString('en-IN')}</span>
                    <span className="fs-price-original">₹{previewProduct.originalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  {previewDiscount > 0 && (
                    <span className="fs-preview-saving">
                      Save ₹{previewSavings.toLocaleString('en-IN')} ({previewDiscount}% off)
                    </span>
                  )}
                </div>
              </div>

              {/* Summary stats */}
              {selectedProductIds.length > 0 && (
                <div className="fs-summary-stats">
                  <div className="fs-summary-header">
                    Flash Sale Summary
                  </div>
                  <div className="fs-summary-body">
                    <div className="fs-summary-item">
                      <span className="fs-stat-label">Products Selected</span>
                      <strong className="fs-stat-value">{selectedProductIds.length}</strong>
                    </div>
                    {heading && (
                      <div className="fs-summary-item">
                        <span className="fs-stat-label">Heading</span>
                        <strong className="fs-stat-value">{heading}</strong>
                      </div>
                    )}
                    {buttonName && (
                      <div className="fs-summary-item">
                        <span className="fs-stat-label">Button Name</span>
                        <strong className="fs-stat-value">{buttonName}</strong>
                      </div>
                    )}
                    <div className="fs-summary-item">
                      <span className="fs-stat-label">Start Date</span>
                      <strong className="fs-stat-value">{startDate || '—'}</strong>
                    </div>
                    <div className="fs-summary-item">
                      <span className="fs-stat-label">End Date</span>
                      <strong className="fs-stat-value">{endDate || '—'}</strong>
                    </div>
                    <div className="fs-summary-item">
                      <span className="fs-stat-label">Status</span>
                      <span className={`fs-stat-value status-pill ${status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                        {status}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="fs-live-notice">
                <i className="fa-solid fa-circle-check" />
                Active flash sales are automatically featured in real-time on the BuyBright Homepage Flash Deals section.
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default FlashSaleForm;
