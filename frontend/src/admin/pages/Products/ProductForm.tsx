/**
 * BuyBright Admin — Product Form Modal.
 * Add or Edit a dental catalog SKU with full field coverage:
 *  Basic Info · Pricing & Tax · Inventory · Badges · Description
 */

import React, { useState, useEffect } from 'react';
import type { AdminProduct } from '../../types/product';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Form';
import { Select } from '../../components/Form';
import { getGSTRates } from '../../data/gstData';

/* ─────────────────── Constants ─────────────────── */
const CATEGORIES = [
  { value: 'Endodontics',    label: 'Endodontics' },
  { value: 'Orthodontics',   label: 'Orthodontics' },
  { value: 'Equipment',      label: 'Equipment' },
  { value: 'Consumables',    label: 'Consumables' },
  { value: 'Implants',       label: 'Implants' },
  { value: 'Prosthodontics', label: 'Prosthodontics' },
  { value: 'Materials',      label: 'Materials' },
  { value: 'Instruments',    label: 'Instruments' },
];

const getGstOptions = () => {
  const rates = getGSTRates();
  const active = rates.filter((r) => r.status === 'Active');
  if (active.length > 0) {
    return active.map((r) => ({ value: `${r.totalGst}%`, label: r.rateLabel }));
  }
  return [
    { value: '0%',  label: '0% — Exempt' },
    { value: '5%',  label: '5% — Essential' },
    { value: '12%', label: '12% — Standard' },
    { value: '18%', label: '18% — Higher' },
    { value: '28%', label: '28% — Luxury' },
  ];
};

const STATUS_OPTIONS = [
  { value: 'Active',   label: 'Active (Storefront Visible)' },
  { value: 'Draft',    label: 'Draft (Hidden)' },
  { value: 'Archived', label: 'Archived' },
];

/* ─────────────────── Types ─────────────────── */
interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Partial<AdminProduct>) => void;
  initialData?: AdminProduct | null;
}

type FormState = {
  name: string;
  sku: string;
  brand: string;
  category: string;
  price: string;
  mrp: string;
  stock: string;
  brightPoints: string;
  rating: string;
  reviewsCount: string;
  salesCount: string;
  size: string;
  volume_ml: string;
  deliveryTime: string;
  expiryDate: string;
  hsnCode: string;
  gstRate: string;
  image: string;
  is_bestseller: boolean;
  is_spotlight: boolean;
  status: AdminProduct['status'];
  description: string;
};

const EMPTY_FORM: FormState = {
  name: '',
  sku: '',
  brand: '',
  category: 'Endodontics',
  price: '',
  mrp: '',
  stock: '',
  brightPoints: '',
  rating: '',
  reviewsCount: '',
  salesCount: '',
  size: '',
  volume_ml: '',
  deliveryTime: 'Delivered in 24–48 hrs',
  expiryDate: '',
  hsnCode: '',
  gstRate: '12%',
  image: '',
  is_bestseller: false,
  is_spotlight: false,
  status: 'Active',
  description: '',
};

/* ─────────────────── Section Heading ─────────────────── */
const SectionHeading: React.FC<{ icon: string; title: string }> = ({ icon, title }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 0 6px',
      borderBottom: '1.5px solid #e2e8f0',
      marginBottom: '14px',
      marginTop: '6px',
    }}
  >
    <i className={icon} style={{ color: '#0d9488', fontSize: '0.88rem' }} />
    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {title}
    </span>
  </div>
);

/* ─────────────────── Checkbox Field ─────────────────── */
const CheckboxField: React.FC<{
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}> = ({ id, label, description, checked, onChange }) => (
  <label
    htmlFor={id}
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      padding: '10px 14px',
      borderRadius: '8px',
      border: `1.5px solid ${checked ? '#0d9488' : '#e2e8f0'}`,
      background: checked ? '#f0fdfa' : '#f8fafc',
      cursor: 'pointer',
      transition: 'all 0.18s',
    }}
  >
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      style={{ marginTop: '2px', accentColor: '#0d9488', width: '16px', height: '16px' }}
    />
    <div>
      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>{label}</div>
      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{description}</div>
    </div>
  </label>
);

/* ─────────────────── Component ─────────────────── */
export const ProductForm: React.FC<ProductFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  /* Sync when editing existing product */
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        sku: initialData.sku,
        brand: initialData.brand,
        category: initialData.category,
        price: String(initialData.price),
        mrp: String(initialData.mrp),
        stock: String(initialData.stock),
        brightPoints: String(initialData.brightPoints),
        rating: String(initialData.rating),
        reviewsCount: String(initialData.reviews_count ?? ''),
        salesCount: String(initialData.salesCount ?? ''),
        size: initialData.size ?? '',
        volume_ml: initialData.volume_ml ?? '',
        deliveryTime: initialData.deliveryTime ?? 'Delivered in 24–48 hrs',
        expiryDate: initialData.expiryDate ?? '',
        hsnCode: initialData.hsnCode ?? '',
        gstRate: initialData.gstRate ?? '12%',
        image: initialData.image ?? '',
        is_bestseller: initialData.is_bestseller ?? false,
        is_spotlight: initialData.is_spotlight ?? false,
        status: initialData.status,
        description: initialData.description ?? '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [initialData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.sku.trim() || !form.price) {
      alert('Please fill in required fields: Product Name, SKU, and Selling Price.');
      return;
    }

    const priceNum = Number(form.price) || 0;
    const mrpNum = Number(form.mrp) || Math.round(priceNum * 1.25);
    const stockNum = Number(form.stock) || 0;
    const pointsNum = Number(form.brightPoints) || Math.round(priceNum * 0.02);

    const payload: Partial<AdminProduct> = {
      name: form.name.trim(),
      sku: form.sku.trim().toUpperCase(),
      brand: form.brand.trim() || 'BuyBright',
      category: form.category,
      price: priceNum,
      mrp: mrpNum,
      stock: stockNum,
      stockStatus: stockNum > 10 ? 'In Stock' : stockNum > 0 ? 'Low Stock' : 'Out of Stock',
      brightPoints: pointsNum,
      rating: Number(form.rating) || 4.5,
      reviews_count: Number(form.reviewsCount) || 0,
      salesCount: Number(form.salesCount) || 0,
      size: form.size || undefined,
      volume_ml: form.volume_ml || undefined,
      deliveryTime: form.deliveryTime || 'Delivered in 24–48 hrs',
      expiryDate: form.expiryDate || undefined,
      hsnCode: form.hsnCode || undefined,
      gstRate: form.gstRate,
      image: form.image || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=200&q=80',
      is_bestseller: form.is_bestseller,
      is_spotlight: form.is_spotlight,
      status: form.status,
      description: form.description || undefined,
    };

    onSubmit(payload);
    onClose();
  };

  const grid2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' } as const;
  const grid3 = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' } as const;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Edit SKU: ${initialData.sku}` : 'Add New Dental Product'}
      maxWidth="760px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>

        {/* ── SECTION 1: Basic Information ── */}
        <SectionHeading icon="fa-solid fa-tag" title="Basic Product Information" />
        <Input
          label="Product Name *"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. ProTaper Gold Rotary Files 25mm (SX–F3 Assorted)"
          required
        />

        <div style={grid2}>
          <Input
            label="SKU Identifier *"
            name="sku"
            value={form.sku}
            onChange={handleChange}
            placeholder="e.g. PD-ENDO-08"
            required
            helperText="Will be auto-uppercased on save"
          />
          <Select
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            options={CATEGORIES}
          />
        </div>

        <div style={grid2}>
          <Input
            label="Manufacturer / Brand"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="e.g. Dentsply Sirona / 3M ESPE"
          />
          <Input
            label="Product Image URL"
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="https://... (leave blank for default)"
          />
        </div>

        <div style={grid2}>
          <Input
            label="Size / Specification"
            name="size"
            value={form.size}
            onChange={handleChange}
            placeholder="e.g. Universal, 25mm, ISO 25"
          />
          <Input
            label="Volume / Pack Size"
            name="volume_ml"
            value={form.volume_ml}
            onChange={handleChange}
            placeholder="e.g. 4g Syringe, 5 ml, Pack of 6"
          />
        </div>

        <Input
          label="Delivery Time"
          name="deliveryTime"
          value={form.deliveryTime}
          onChange={handleChange}
          placeholder="e.g. Delivered in 24–48 hrs"
        />

        {/* ── SECTION 2: Pricing & Tax ── */}
        <SectionHeading icon="fa-solid fa-indian-rupee-sign" title="Pricing & Tax Details" />
        <div style={grid3}>
          <Input
            label="Selling Price ₹ *"
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="2450"
            required
            helperText="Price shown to doctors on website"
          />
          <Input
            label="MRP / Retail Price ₹"
            type="number"
            name="mrp"
            value={form.mrp}
            onChange={handleChange}
            placeholder="3100"
            helperText="Used to show discount % on website"
          />
          <Input
            label="Presto Loyalty Points"
            type="number"
            name="brightPoints"
            value={form.brightPoints}
            onChange={handleChange}
            placeholder="45"
            helperText="Auto-calc if blank (2% of price)"
          />
        </div>

        <div style={grid3}>
          <Input
            label="HSN Code"
            name="hsnCode"
            value={form.hsnCode}
            onChange={handleChange}
            placeholder="e.g. 9021"
            helperText="GST HSN classification"
          />
          <Select
            label="GST Rate"
            name="gstRate"
            value={form.gstRate}
            onChange={handleChange}
            options={getGstOptions()}
          />
          <Input
            label="Expiry / Batch Date"
            name="expiryDate"
            value={form.expiryDate}
            onChange={handleChange}
            placeholder="e.g. 2028-12-31"
            helperText="Leave blank for non-expiry items"
          />
        </div>

        {/* ── SECTION 3: Inventory & Sales ── */}
        <SectionHeading icon="fa-solid fa-boxes-stacked" title="Inventory & Sales Data" />
        <div style={grid3}>
          <Input
            label="Stock Quantity (pcs)"
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            placeholder="50"
            helperText="Auto-sets Stock Status badge"
          />
          <Input
            label="Doctor Rating (0–5)"
            type="number"
            name="rating"
            value={form.rating}
            onChange={handleChange}
            placeholder="4.9"
            step="0.1"
            min="0"
            max="5"
          />
          <Input
            label="Total Reviews Count"
            type="number"
            name="reviewsCount"
            value={form.reviewsCount}
            onChange={handleChange}
            placeholder="342"
          />
        </div>

        <div style={grid2}>
          <Input
            label="Total Lifetime Sales"
            type="number"
            name="salesCount"
            value={form.salesCount}
            onChange={handleChange}
            placeholder="0"
            helperText="Historical units sold"
          />
          <Select
            label="Admin Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            options={STATUS_OPTIONS}
          />
        </div>

        {/* ── SECTION 4: Badges ── */}
        <SectionHeading icon="fa-solid fa-award" title="Product Badges & Visibility" />
        <div style={grid2}>
          <CheckboxField
            id="is_bestseller"
            label="🏆 Bestseller Badge"
            description="Marks product with 'Bestseller' badge on product card"
            checked={form.is_bestseller}
            onChange={(val) => setForm((prev) => ({ ...prev, is_bestseller: val }))}
          />
          <CheckboxField
            id="is_spotlight"
            label="✨ Brand Spotlight Badge"
            description="Marks product as 'Featured Spotlight' in brand sections"
            checked={form.is_spotlight}
            onChange={(val) => setForm((prev) => ({ ...prev, is_spotlight: val }))}
          />
        </div>

        {/* ── SECTION 5: Description ── */}
        <SectionHeading icon="fa-solid fa-align-left" title="Product Description" />
        <div className="admin-form-group" style={{ marginBottom: '14px' }}>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="admin-form-input"
            style={{ resize: 'vertical', width: '100%', boxSizing: 'border-box' }}
            placeholder="Product details, ISO certifications, packaging units, application notes..."
          />
        </div>

        {/* ── Footer Buttons ── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            marginTop: '8px',
            paddingTop: '14px',
            borderTop: '1px solid #e2e8f0',
          }}
        >
          <button type="button" onClick={onClose} className="btn-admin-outline">
            Cancel
          </button>
          <button type="submit" className="btn-admin-primary">
            <i className="fa-solid fa-floppy-disk" style={{ marginRight: '6px' }} />
            {initialData ? 'Save Changes' : 'Create Product SKU'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductForm;
