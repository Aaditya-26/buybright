/**
 * BuyBright Admin — Add / Edit Product Form (10 Clean Sections).
 * Routes: /admin/products/create  |  /admin/products/edit/:id
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { getProducts, saveProducts, getProductById, getCategories } from '../../../data/productsData';
import { getSubCategories } from '../../../data/subCategoriesData';
import { getBrands } from '../../../data/brandsData';
import { getHSNCodes } from '../../../data/hsnData';
import type { AdminProduct } from '../../../types/product';
import { useToast } from '../../../../context/ToastContext';
import '../ProductsModule.scss';

/* ── Constants ───────────────────────────────────────────────────────────── */
const PRODUCT_TYPES = ['Simple', 'Variable', 'Grouped', 'External'];

/* ── Shared style tokens ─────────────────────────────────────────────────── */
const ST = {
  label: { display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '5px' } as React.CSSProperties,
  hintLabel: { fontWeight: 400, color: '#94a3b8', fontSize: '0.76rem', marginLeft: '5px' } as React.CSSProperties,
  col: { display: 'flex', flexDirection: 'column', gap: '14px' } as React.CSSProperties,
  g2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '14px' } as React.CSSProperties,
  g3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '14px' } as React.CSSProperties,
  err: { color: '#ef4444', fontSize: '0.74rem', marginTop: '3px', display: 'block' } as React.CSSProperties,
  cardHead: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' } as React.CSSProperties,
  cardTitle: { margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' } as React.CSSProperties,
  check: { display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.83rem', fontWeight: 600, color: '#334155', cursor: 'pointer' } as React.CSSProperties,
  tealBadge: { background: '#f0fdf9', border: '1px solid #a7f3d0', borderRadius: '6px', padding: '2px 9px', fontSize: '0.72rem', fontWeight: 700, color: '#065f46' } as React.CSSProperties,
};

/* ── Spec row type ───────────────────────────────────────────────────────── */
interface SpecRow { id: string; key: string; value: string; }
interface VariantRow {
  id: string;
  packSize: string;
  value: string;
  mrp: number | '';
  price: number | '';
  stock: number | '';
  hsnCode: string;
}

/* ── Form State ──────────────────────────────────────────────────────────── */
interface PF {
  // §1 Basic Info
  name: string; slug: string; sku: string; brand: string;
  category: string; subCategory: string; productType: string;
  shortDescription: string; fullDescription: string;
  // §2 Media
  mainImage: string; galleryImages: string[]; videoUrl: string; altText: string;
  videoFileName?: string;
  // §3 Pricing & Tax (with merged inventory)
  mrp: number | ''; price: number | ''; gstRate: string; gstInclusive: boolean; hsnCode: string;
  stock: number | ''; lowStockThreshold: number | ''; stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  allowBackorder: boolean;
  minOrderQuantity: number | '';
  maxOrderQuantity: number | '';
  // §4 Variants
  enableVariants: boolean; variants: VariantRow[];
  // §5 Logistics & Product Specifications
  weightValue: number | '';
  weightUnit: string;
  lengthCm: number | '';
  widthCm: number | '';
  heightCm: number | '';
  deliveryDays: number | '';
  returnDays: number | '';
  fragrance: string;
  color: string;
  burnTime: number | '';
  manufacturerName: string;
  manufacturerAddress: string;
  manufacturerContact: string;
  // §6 Technical Specs (matching website Technicals tab)
  sterilization: string;
  storage: string;
  certification: string;
  shelfLife: string;
  origin: string;
  material: string;
  specs: SpecRow[];
  // §8 Packaging (matching website Packaging tab)
  packagingHeading: string;
  packagingDescription: string;
  packSize: string;
  packageContents: string;
  unitType: string;
  barrierProtection: string;
  barcodeHeading: string;
  barcodeDescription: string;
  lotNumber: string;
  barcodeStandard: string;
  antiCounterfeit: string;
  logisticsHeading: string;
  logisticsDescription: string;
  transitPackaging: string;
  storageTemp: string;
  disposalInstructions: string;
  // §9 Usage Guidelines (matching website Usage Guidelines tab)
  step1Title: string;
  step1: string;
  step2Title: string;
  step2: string;
  step3Title: string;
  step3: string;
  step4Title: string;
  step4: string;
  howToUse: string;
  safety: string;
  cleaning: string;
  storageInstructions: string;
  // §10 Product Overview & Applications
  clinicalPurpose: string;
  applications: string;
  benefits: string;
  contraindications: string;
  // §11 Warranty & Returns & Expiry
  warranty: string; warrantyValue: number | ''; warrantyUnit: string;
  returnEligible: boolean; replacement: string;
  expiryDate: string;
  // §12 Product Badges
  isoCompliant: boolean; isGenuine: boolean; isAuthorized: boolean;
  isBestseller: boolean; isFeatured: boolean; isNewArrival: boolean;
  // §12 Product Badges & Benefits
  customBadge1: string; customBadge2: string;
  benefit1: string; benefit2: string; benefit3: string;
  benefit1Icon: string; benefit1Name: string;
  benefit2Icon: string; benefit2Name: string;
  benefit3Icon: string; benefit3Name: string;
  packagingCards: { id: string; heading: string; description: string }[];
  // Document PDF
  pdfUrl: string;
  pdfFileName: string;
  // §13 Bright Points
  brightPoints: number | '';
  // §16 SEO
  seoTitle: string; seoDescription: string; seoKeywords: string;
  // §17 Publishing
  status: 'Active' | 'Draft' | 'Archived';
  rating: number | ''; reviews_count: number | ''; procured_count: string;
  deliveryTime: string;
}

const EMPTY: PF = {
  name: '', slug: '', sku: '', brand: '', category: '', subCategory: '',
  productType: 'Simple', shortDescription: '', fullDescription: '',
  mainImage: '', galleryImages: [], videoUrl: '', altText: '', videoFileName: '',
  mrp: '', price: '', gstRate: '12%',
  gstInclusive: true, hsnCode: '',
  stock: 100, lowStockThreshold: 5, stockStatus: 'In Stock', allowBackorder: false,
  minOrderQuantity: 1, maxOrderQuantity: 50,
  enableVariants: false, variants: [],
  weightValue: 250, weightUnit: 'grams (gm)',
  lengthCm: 10, widthCm: 20, heightCm: 20,
  deliveryDays: 3, returnDays: 7,
  material: 'chandan', fragrance: 'chandhan', color: 'brown',
  packSize: '100', burnTime: 25, origin: 'India',
  packagingHeading: 'PrimaryPackaging',
  packagingDescription: 'Original manufacturer dental packaging with tamper-evident seal and moisture barrier protection.',
  manufacturerName: 'Presto Healthcare & Manufacturing Ltd',
  manufacturerAddress: 'Plot No. 42, Phase-II MIDC Industrial Area, Pune, Maharashtra, 411019',
  manufacturerContact: 'support@presto.in',
  sterilization: 'Autoclavable at 134°C (273°F) for 18 minutes / Gamma Sterilized',
  storage: 'Store in cool dry environment (2°C - 28°C / 36°F - 82°F)',
  certification: 'CE Certified 0123, ISO 13485:2016, US FDA Registered',
  shelfLife: '36 Months from Date of Manufacture (Fresh Batch Guaranteed)',
  specs: [{ id: 's1', key: 'Sterilization Compatibility', value: 'Autoclavable at 134°C' }],
  packageContents: '1 Dental Unit + Sterile Tips + Instructions Manual',
  unitType: 'Original manufacturer packaging with tamper-evident seal',
  barrierProtection: 'Moisture-proof, light-resistant medical-grade composite barrier',
  barcodeHeading: 'Batch Traceability & Barcode',
  barcodeDescription: 'Laser-etched batch identifier with direct OEM factory traceability and GS1 barcode standards.',
  lotNumber: 'Laser-etched batch identifier with direct OEM factory traceability',
  barcodeStandard: 'GS1-128 / EAN-13 universal inventory barcoding',
  antiCounterfeit: 'BuyBright certified holographic QR verification seal',
  logisticsHeading: 'Logistics & Cold-Chain Protection',
  logisticsDescription: 'Shock-absorbent corrugated outer shipper with insulated thermal liner and strict temperature control.',
  transitPackaging: 'Shock-absorbent corrugated outer shipper with insulated thermal liner',
  storageTemp: 'Store at 2°C – 28°C away from direct operatory sunlight',
  disposalInstructions: 'Non-hazardous hospital dry recyclable cardboard container',
  step1Title: 'Isolation & Preparation',
  step1: 'Apply rubber dam isolation to maintain moisture-free operatory field. Clean and prepare cavity/canal according to standard dental protocol.',
  step2Title: 'Dispensing & Application',
  step2: 'Dispense required quantity using precision applicator tip. Avoid cross-contamination and ensure bubble-free application.',
  step3Title: 'Curing / Setting Technique',
  step3: 'For light-cure materials, expose to LED curing light (≥ 1000 mW/cm²) for 20 seconds. For auto-cure, allow 3-4 minutes set time.',
  step4Title: 'Finishing & Post-Op Check',
  step4: 'Inspect margin adaptation using HD front surface mirror. Polish using progressive diamond abrasive discs.',
  howToUse: 'Follow manufacturer IFU guidelines. Apply under isolation with proper curing protocols.',
  safety: 'Wear protective eyewear, avoid direct pulp contact. For professional dental use only.',
  cleaning: 'Wipe dispenser with hospital-grade surface disinfectant between uses.',
  storageInstructions: 'Store in cool dry environment (2°C–28°C), away from direct sunlight.',
  clinicalPurpose: '', applications: '', benefits: '', contraindications: '',
  warranty: '', warrantyValue: '', warrantyUnit: 'Years', returnEligible: true, replacement: '',
  expiryDate: '',
  isoCompliant: false, isGenuine: true, isAuthorized: true,
  isBestseller: false, isFeatured: false, isNewArrival: false,
  customBadge1: '', customBadge2: '',
  benefit1: '', benefit2: '', benefit3: '',
  benefit1Icon: 'fa-solid fa-shield-halved', benefit1Name: '',
  benefit2Icon: 'fa-solid fa-tooth', benefit2Name: '',
  benefit3Icon: 'fa-solid fa-award', benefit3Name: '',
  pdfUrl: '', pdfFileName: '',
  packagingCards: [
    { id: 'pc-1', heading: 'PrimaryPackaging', description: 'Original manufacturer packaging with tamper-evident seal and moisture barrier protection.' },
    { id: 'pc-2', heading: 'Batch Traceability & Barcode', description: 'Laser-etched batch identifier with direct OEM factory traceability and GS1 barcode standards.' },
    { id: 'pc-3', heading: 'Logistics & Cold-Chain Protection', description: 'Shock-absorbent corrugated outer shipper with insulated thermal liner and strict temperature control.' }
  ],
  brightPoints: 50,
  seoTitle: '', seoDescription: '', seoKeywords: '',
  status: 'Draft', rating: 4.8, reviews_count: 0, procured_count: '',
  deliveryTime: 'Delivered in 24-48 hrs',
};

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const uid = () => `r-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

/* ── Section Header ─────────────────────────────────────────────────────── */
const SH: React.FC<{ icon: string; num: number; title: string; sub?: string }> = ({ icon, num, title, sub }) => (
  <div style={ST.cardHead}>
    <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg,#0d9488,#0891b2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <i className={icon} style={{ color: '#fff', fontSize: '0.85rem' }} />
    </div>
    <div>
      <h3 style={ST.cardTitle}>{num}. {title}</h3>
      {sub && <p style={{ margin: 0, fontSize: '0.74rem', color: '#94a3b8' }}>{sub}</p>}
    </div>
  </div>
);

/* ════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════════════════════ */
export const ProductFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const { showToast } = useToast();
  const mainImageFileRef = useRef<HTMLInputElement>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);
  const videoFileRef = useRef<HTMLInputElement>(null);
  const pdfFileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<PF>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [galleryInput, setGalleryInput] = useState('');

  // Data
  const categories = useMemo(() => getCategories(), []);
  const subCategories = useMemo(() => getSubCategories(), []);
  const brands = useMemo(() => getBrands(), []);
  const hsnCodes = useMemo(() => getHSNCodes().filter(h => h.status === 'Active'), []);

  const filteredSubs = useMemo(
    () => subCategories.filter(sc => sc.parentCategoryName.toLowerCase() === form.category.toLowerCase()),
    [subCategories, form.category]
  );

  // Load on edit
  useEffect(() => {
    if (isEdit && id) {
      const p = getProductById(id);
      if (p) {
        const existingWarranty = (p as any).warranty || '';
        let parsedWVal: number | '' = '';
        let parsedWUnit = 'Years';
        if (existingWarranty) {
          const m = existingWarranty.match(/^(\d+)\s*(Day|Days|Month|Months|Year|Years)/i);
          if (m) {
            parsedWVal = Number(m[1]);
            const u = m[2].toLowerCase();
            if (u.includes('day')) parsedWUnit = 'Days';
            else if (u.includes('month')) parsedWUnit = 'Months';
          } else {
             const m2 = existingWarranty.match(/^(\d+)/);
             if (m2) parsedWVal = Number(m2[1]);
          }
        }

        setForm(prev => ({
          ...prev,
          name: p.name, slug: p.slug || slugify(p.name), sku: p.sku,
          brand: p.brand, category: p.category, subCategory: p.subCategory || '',
          productType: p.productType || 'Simple',
          shortDescription: p.shortDescription || '', fullDescription: p.description || '',
          mainImage: p.image, galleryImages: p.galleryImages || [], videoUrl: p.videoUrl || '',
          mrp: p.mrp || '', price: p.price,
          gstRate: p.gstRate || '12%', hsnCode: p.hsnCode || '',
          stock: p.stock ?? 100, stockStatus: p.stockStatus || 'In Stock', allowBackorder: p.allowBackorder || false,
          minOrderQuantity: (p as any).minOrderQuantity ?? prev.minOrderQuantity,
          maxOrderQuantity: (p as any).maxOrderQuantity ?? prev.maxOrderQuantity,
          isBestseller: p.is_bestseller || false, isFeatured: p.is_featured || false,
          isNewArrival: p.is_new_arrival || false, isGenuine: p.is_genuine !== false,
          isAuthorized: p.is_authorized_partner !== false,
          brightPoints: p.brightPoints || 50,
          customBadge1: (p as any).customBadge1 || (p as any).badge || prev.customBadge1,
          customBadge2: (p as any).customBadge2 || prev.customBadge2,
          benefit1: (p as any).benefit1 || prev.benefit1,
          benefit1Icon: (p as any).benefit1Icon || prev.benefit1Icon,
          benefit1Name: (p as any).benefit1Name || (p as any).benefit1 || prev.benefit1Name,
          benefit2: (p as any).benefit2 || prev.benefit2,
          benefit2Icon: (p as any).benefit2Icon || prev.benefit2Icon,
          benefit2Name: (p as any).benefit2Name || (p as any).benefit2 || prev.benefit2Name,
          benefit3: (p as any).benefit3 || prev.benefit3,
          benefit3Icon: (p as any).benefit3Icon || prev.benefit3Icon,
          benefit3Name: (p as any).benefit3Name || (p as any).benefit3 || prev.benefit3Name,
          pdfUrl: (p as any).pdfUrl || (p as any).brochureUrl || prev.pdfUrl,
          pdfFileName: (p as any).pdfFileName || prev.pdfFileName,
          packagingCards: (p as any).packagingCards || [
            { id: 'pc-1', heading: (p as any).packagingHeading || prev.packagingHeading, description: (p as any).packagingDescription || prev.packagingDescription },
            { id: 'pc-2', heading: (p as any).barcodeHeading || prev.barcodeHeading, description: (p as any).barcodeDescription || prev.barcodeDescription },
            { id: 'pc-3', heading: (p as any).logisticsHeading || prev.logisticsHeading, description: (p as any).logisticsDescription || prev.logisticsDescription }
          ],
          seoTitle: p.seoTitle || '', seoDescription: p.seoDescription || '', seoKeywords: p.seoKeywords || '',
          status: p.status,
          rating: p.rating || 4.8, reviews_count: p.reviews_count || 0,
          deliveryTime: p.deliveryTime || 'Delivered in 24-48 hrs',
          expiryDate: (p as any).expiryDate || '',
          warranty: existingWarranty || prev.warranty,
          warrantyValue: (p as any).warrantyValue ?? parsedWVal,
          warrantyUnit: (p as any).warrantyUnit || parsedWUnit,
          returnEligible: (p as any).returnEligible !== false,
          enableVariants: (p as any).enableVariants || (p.variants && p.variants.length > 0) || false,
          variants: (p.variants && p.variants.length > 0)
            ? p.variants.map((v: any, idx: number) => ({
                id: v.id || `v-${idx}`,
                packSize: v.packSize || v.variantName || v.name || 'Pack of 1',
                value: v.value || v.label || 'Standard',
                mrp: v.mrp ?? v.price ?? '',
                price: v.price ?? v.sellingPrice ?? '',
                stock: v.stock ?? 100,
                hsnCode: v.hsnCode || p.hsnCode || '',
              }))
            : [],
          // Logistics, Shipping & Dimensions
          weightValue: (p as any).weightValue ?? (p as any).weight ?? prev.weightValue,
          weightUnit: (p as any).weightUnit || prev.weightUnit,
          lengthCm: (p as any).lengthCm ?? (p as any).dimensions?.length ?? prev.lengthCm,
          widthCm: (p as any).widthCm ?? (p as any).dimensions?.width ?? prev.widthCm,
          heightCm: (p as any).heightCm ?? (p as any).dimensions?.height ?? prev.heightCm,
          deliveryDays: (p as any).deliveryDays ?? prev.deliveryDays,
          returnDays: (p as any).returnDays ?? prev.returnDays,
          fragrance: (p as any).fragrance || prev.fragrance,
          color: (p as any).color || prev.color,
          burnTime: (p as any).burnTime ?? prev.burnTime,
          manufacturerName: (p as any).manufacturerName || (p as any).manufacturer || prev.manufacturerName,
          manufacturerAddress: (p as any).manufacturerAddress || prev.manufacturerAddress,
          manufacturerContact: (p as any).manufacturerContact || prev.manufacturerContact,
          // Technicals
          sterilization: p.technicalSpecs?.sterilization || (p as any).sterilization || prev.sterilization,
          storage: p.technicalSpecs?.storage || (p as any).storage || prev.storage,
          certification: p.technicalSpecs?.certification || (p as any).certification || prev.certification,
          shelfLife: p.technicalSpecs?.shelfLife || (p as any).shelfLife || prev.shelfLife,
          origin: (p as any).origin || p.technicalSpecs?.origin || prev.origin,
          material: (p as any).material || (p as any).materialComposition || p.materialComposition || prev.material,
          specs: (p as any).specs || (p.technicalSpecsList?.map((s: any, i: number) => ({ id: `s-${i}`, key: s.specName || s.name || '', value: s.specValue || s.value || '' })) ?? prev.specs),
          // Packaging
          packagingHeading: (p as any).packagingHeading || prev.packagingHeading,
          packagingDescription: (p as any).packagingDescription || prev.packagingDescription,
          packSize: (p as any).packSize || p.packagingDetails?.dispensingFormat || (p as any).dispensingFormat || prev.packSize,
          packageContents: p.packageContents || prev.packageContents,
          unitType: p.packagingDetails?.unitType || (p as any).unitType || prev.unitType,
          barrierProtection: (p as any).barrierProtection || prev.barrierProtection,
          barcodeHeading: (p as any).barcodeHeading || prev.barcodeHeading,
          barcodeDescription: (p as any).barcodeDescription || prev.barcodeDescription,
          lotNumber: (p as any).lotNumber || p.packagingDetails?.barcodeLot || prev.lotNumber,
          barcodeStandard: (p as any).barcodeStandard || prev.barcodeStandard,
          antiCounterfeit: (p as any).antiCounterfeit || prev.antiCounterfeit,
          logisticsHeading: (p as any).logisticsHeading || prev.logisticsHeading,
          logisticsDescription: (p as any).logisticsDescription || prev.logisticsDescription,
          transitPackaging: (p as any).transitPackaging || p.packagingDetails?.transitProtection || prev.transitPackaging,
          storageTemp: (p as any).storageTemp || prev.storageTemp,
          disposalInstructions: (p as any).disposalInstructions || prev.disposalInstructions,
          // Usage Guidelines
          step1Title: (p as any).usageGuidelines?.step1Title || prev.step1Title,
          step1: (p as any).usageGuidelines?.step1 || prev.step1,
          step2Title: (p as any).usageGuidelines?.step2Title || prev.step2Title,
          step2: (p as any).usageGuidelines?.step2 || prev.step2,
          step3Title: (p as any).usageGuidelines?.step3Title || prev.step3Title,
          step3: (p as any).usageGuidelines?.step3 || prev.step3,
          step4Title: (p as any).usageGuidelines?.step4Title || prev.step4Title,
          step4: (p as any).usageGuidelines?.step4 || prev.step4,
          howToUse: (p as any).howToUse || p.usageInstructions || prev.howToUse,
          safety: (p as any).safety || p.precautions || prev.safety,
          cleaning: (p as any).cleaning || p.cleaningInstructions || prev.cleaning,
          storageInstructions: (p as any).storageInstructions || prev.storageInstructions,
          clinicalPurpose: p.clinicalPurpose || '',
          applications: p.applications || '',
          benefits: p.keyBenefits || '',
        }));
      } else {
        showToast('Product not found.', 'danger');
        navigate('/admin/products');
      }
    }
  }, [id, isEdit, navigate, showToast]);

  /* ── Derived ─────────────────────────────────────────────────────────── */
  const priceN = Number(form.price) || 0;
  const mrpN = Number(form.mrp) || 0;
  const discountAmount = mrpN > priceN && priceN > 0 ? mrpN - priceN : 0;
  const discPct = mrpN > priceN && priceN > 0 ? Math.round(((mrpN - priceN) / mrpN) * 100) : 0;

  // Automated GST & Tax calculations based on HSN & Selling Price
  const totalGstRate = Number(String(form.gstRate || '0').replace('%', '')) || 0;
  const cgstRate = totalGstRate / 2;
  const sgstRate = totalGstRate / 2;
  const igstRate = totalGstRate;

  const taxableValue = totalGstRate > 0 && priceN > 0
    ? (form.gstInclusive
        ? Math.round((priceN / (1 + totalGstRate / 100)) * 100) / 100
        : priceN)
    : priceN;

  const totalGstAmount = totalGstRate > 0 && priceN > 0
    ? (form.gstInclusive
        ? Math.round((priceN - taxableValue) * 100) / 100
        : Math.round((priceN * (totalGstRate / 100)) * 100) / 100)
    : 0;

  const cgstAmount = Math.round((totalGstAmount / 2) * 100) / 100;
  const sgstAmount = Math.round((totalGstAmount / 2) * 100) / 100;
  const igstAmount = totalGstAmount;
  const finalInvoicedPrice = form.gstInclusive ? priceN : Math.round((priceN + totalGstAmount) * 100) / 100;

  /* ── Handlers ────────────────────────────────────────────────────────── */
  const set = (field: keyof PF, val: unknown) => setForm(p => ({ ...p, [field]: val }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') set(name as keyof PF, (e.target as HTMLInputElement).checked);
    else if (type === 'number') set(name as keyof PF, value === '' ? '' : Number(value));
    else set(name as keyof PF, value);
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setForm(p => ({ ...p, name: v, slug: slugify(v), seoTitle: v ? `${v} | BuyBright` : '' }));
    if (errors.name) setErrors(p => ({ ...p, name: '' }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) { showToast('Image max 8MB allowed', 'danger'); return; }
    const r = new FileReader();
    r.onload = ev => {
      set('mainImage', ev.target?.result as string);
      showToast('Main product image loaded.', 'success');
    };
    r.readAsDataURL(file);
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach(file => {
      if (file.size > 8 * 1024 * 1024) { showToast(`File ${file.name} exceeds 8MB`, 'danger'); return; }
      const r = new FileReader();
      r.onload = ev => {
        if (ev.target?.result) {
          setForm(p => ({ ...p, galleryImages: [...p.galleryImages, ev.target!.result as string] }));
        }
      };
      r.readAsDataURL(file);
    });
    showToast('Gallery image(s) uploaded.', 'success');
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) { showToast('Video max 50MB allowed', 'danger'); return; }
    const r = new FileReader();
    r.onload = ev => {
      setForm(p => ({ ...p, videoUrl: ev.target?.result as string, videoFileName: file.name }));
      showToast(`Video "${file.name}" uploaded successfully!`, 'success');
    };
    r.readAsDataURL(file);
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) { showToast('PDF max 25MB allowed', 'danger'); return; }
    const r = new FileReader();
    r.onload = ev => {
      setForm(p => ({ ...p, pdfUrl: ev.target?.result as string, pdfFileName: file.name }));
      showToast(`PDF document "${file.name}" uploaded successfully!`, 'success');
    };
    r.readAsDataURL(file);
  };

  const addGalleryUrl = () => {
    if (galleryInput.trim()) {
      setForm(p => ({ ...p, galleryImages: [...p.galleryImages, galleryInput.trim()] }));
      setGalleryInput('');
    }
  };
  const removeGallery = (idx: number) => setForm(p => ({ ...p, galleryImages: p.galleryImages.filter((_, i) => i !== idx) }));

  // Specs
  const addSpec = () => setForm(p => ({ ...p, specs: [...p.specs, { id: uid(), key: '', value: '' }] }));
  const updateSpec = (idx: number, field: 'key' | 'value', val: string) =>
    setForm(p => { const s = [...p.specs]; s[idx] = { ...s[idx], [field]: val }; return { ...p, specs: s }; });
  const removeSpec = (idx: number) => setForm(p => ({ ...p, specs: p.specs.filter((_, i) => i !== idx) }));

  // Variants
  const addVariant = () =>
    setForm(p => ({
      ...p,
      enableVariants: true,
      variants: [
        ...p.variants,
        {
          id: uid(),
          packSize: '',
          value: '',
          mrp: p.mrp || '',
          price: p.price || '',
          stock: 100,
          hsnCode: p.hsnCode || '',
        },
      ],
    }));
  const updateVariant = (idx: number, field: keyof VariantRow, val: any) =>
    setForm(p => {
      const v = [...p.variants];
      v[idx] = { ...v[idx], [field]: val };
      return { ...p, variants: v };
    });
  const removeVariant = (idx: number) =>
    setForm(p => ({
      ...p,
      variants: p.variants.filter((_, i) => i !== idx),
    }));

  /* ── Validation ──────────────────────────────────────────────────────── */
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    if (!form.sku.trim()) e.sku = 'SKU is required';
    if (!form.price || Number(form.price) <= 0) e.price = 'Selling price is required';
    if (!form.mainImage.trim()) e.mainImage = 'Main product image is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Submit ──────────────────────────────────────────────────────────── */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) { showToast('Please fix required fields.', 'danger'); return; }
    setIsSubmitting(true);

    const payload: Partial<AdminProduct> & { id: string; [key: string]: any } = {
      id: (isEdit && id) ? id : `prod-${Date.now()}`,
      name: form.name.trim(),
      slug: form.slug || slugify(form.name),
      sku: form.sku.trim().toUpperCase(),
      brand: form.brand,
      category: form.category,
      subCategory: form.subCategory,
      productType: form.productType as AdminProduct['productType'],
      shortDescription: form.shortDescription,
      description: form.fullDescription,
      image: form.mainImage,
      galleryImages: form.galleryImages,
      videoUrl: form.videoUrl,
      pdfUrl: form.pdfUrl,
      pdfFileName: form.pdfFileName,
      mrp: Number(form.mrp) || Number(form.price),
      price: Number(form.price),
      gstRate: form.gstRate,
      hsnCode: form.hsnCode,
      stock: Number(form.stock) || 0,
      lowStockThreshold: Number(form.lowStockThreshold) || 5,
      stockStatus: form.stockStatus,
      allowBackorder: false,
      minOrderQuantity: Number(form.minOrderQuantity) || 1,
      maxOrderQuantity: form.maxOrderQuantity !== '' ? Number(form.maxOrderQuantity) : undefined,
      packagingHeading: form.packagingHeading,
      packagingDescription: form.packagingDescription,
      packagingDescriptionHtml: (form as any).packagingDescriptionHtml,
      customBadge1: form.customBadge1,
      customBadge2: form.customBadge2,
      benefit1: form.benefit1Name || form.benefit1,
      benefit1Icon: form.benefit1Icon,
      benefit1Name: form.benefit1Name,
      benefit2: form.benefit2Name || form.benefit2,
      benefit2Icon: form.benefit2Icon,
      benefit2Name: form.benefit2Name,
      benefit3: form.benefit3Name || form.benefit3,
      benefit3Icon: form.benefit3Icon,
      benefit3Name: form.benefit3Name,
      packagingCards: form.packagingCards,
      in_stock: form.stockStatus === 'In Stock',
      discount: discPct > 0 ? `-${discPct}%` : undefined,
      is_bestseller: form.isBestseller,
      is_featured: form.isFeatured,
      is_new_arrival: form.isNewArrival,
      is_genuine: form.isGenuine,
      is_authorized_partner: form.isAuthorized,
      expiryDate: form.expiryDate,
      warranty: form.warrantyValue ? `${form.warrantyValue} ${form.warrantyUnit}` : '',
      warrantyValue: form.warrantyValue,
      warrantyUnit: form.warrantyUnit,
      returnEligible: form.returnEligible,
      enableVariants: form.enableVariants,
      barcodeHeading: form.barcodeHeading,
      barcodeDescription: form.barcodeDescription,
      logisticsHeading: form.logisticsHeading,
      logisticsDescription: form.logisticsDescription,
      // Technicals (storefront Technicals tab)
      technicalSpecs: {
        sterilization: form.sterilization,
        storage: form.storage,
        certification: form.certification,
        shelfLife: form.shelfLife,
        origin: form.origin,
      },
      technicalSpecsList: form.specs.map(s => ({ id: s.id, specName: s.key, specValue: s.value, category: 'General' })) as any,
      specs: form.specs as any,
      // Packaging (storefront Packaging tab)
      packSize: form.packSize,
      packageContents: form.packageContents,
      packagingDetails: {
        dispensingFormat: form.packSize,
        unitType: form.unitType,
        barcodeLot: form.lotNumber,
        transitProtection: form.transitPackaging,
      },
      barrierProtection: form.barrierProtection as any,
      lotNumber: form.lotNumber as any,
      barcodeStandard: form.barcodeStandard as any,
      antiCounterfeit: form.antiCounterfeit as any,
      transitPackaging: form.transitPackaging as any,
      storageTemp: form.storageTemp as any,
      disposalInstructions: form.disposalInstructions as any,
      // Usage Guidelines (storefront Usage Guidelines tab)
      usageGuidelines: {
        step1Title: form.step1Title,
        step1: form.step1,
        step2Title: form.step2Title,
        step2: form.step2,
        step3Title: form.step3Title,
        step3: form.step3,
        step4Title: form.step4Title,
        step4: form.step4,
      } as any,
      howToUse: form.howToUse as any,
      usageInstructions: form.howToUse,
      usageGuidelinesHtml: (form as any).usageGuidelinesHtml,
      precautions: form.safety,
      safetyInstructions: form.safety as any,
      cleaningInstructions: form.cleaning,
      storageInstructions: form.storageInstructions,
      clinicalPurpose: form.clinicalPurpose,
      materialComposition: form.material,
      applications: form.applications,
      keyBenefits: form.benefits,
      brightPoints: Number(form.brightPoints) || 0,
      seoTitle: form.seoTitle || `${form.name} | BuyBright`,
      seoDescription: form.seoDescription,
      seoKeywords: form.seoKeywords,
      ogTitle: form.seoTitle,
      ogDescription: form.seoDescription,
      ogImage: form.mainImage,
      status: form.status as AdminProduct['status'],
      rating: Number(form.rating) || 4.8,
      reviews_count: Number(form.reviews_count) || 0,
      salesCount: 0,
      deliveryTime: form.deliveryTime,
      procured_count: form.procured_count,
      variants: form.variants,
      // Logistics, Shipping & Dimensions
      weightValue: form.weightValue,
      weightUnit: form.weightUnit,
      lengthCm: form.lengthCm,
      widthCm: form.widthCm,
      heightCm: form.heightCm,
      dimensions: {
        length: form.lengthCm,
        width: form.widthCm,
        height: form.heightCm,
        unit: 'cm',
      },
      deliveryDays: String(form.deliveryDays ?? ''),
      returnDays: form.returnDays,
      fragrance: form.fragrance,
      color: form.color,
      burnTime: form.burnTime,
      manufacturerName: form.manufacturerName,
      manufacturerAddress: form.manufacturerAddress,
      manufacturerContact: form.manufacturerContact,
      similarProducts: [], relatedProductIds: [], frequentlyBoughtTogether: [],
    };

    const existing = getProducts();
    if (isEdit && id) {
      saveProducts(existing.map(p => p.id === id ? { ...p, ...payload } : p));
      showToast(`"${form.name}" updated!`, 'success');
    } else {
      saveProducts([payload as AdminProduct, ...existing]);
      showToast(`"${form.name}" added to catalog!`, 'success');
    }
    setIsSubmitting(false);
    navigate('/admin/products');
  };

  /* ════════════════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════════════════ */
  return (
    <AdminLayout
      title={isEdit ? 'Edit Product' : 'Add New Product'}
      subtitle="Complete product form — all sections required for storefront display"
    >
      <div className="products-admin-wrapper">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <Link to="/admin/products" style={{ color: '#64748b', textDecoration: 'none' }}>Products</Link>
            <span style={{ color: '#cbd5e1' }}>/</span>
            <span style={{ color: '#0d9488', fontWeight: 600 }}>{isEdit ? 'Edit Product' : 'New Product'}</span>
          </div>
          <button type="button" className="btn-admin-outline" onClick={() => navigate('/admin/products')}>
            <i className="fa-solid fa-arrow-left" /> Back
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="product-form-layout-grid">

          {/* ══════════════ LEFT COLUMN ══════════════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* ── §1 Basic Information ── */}
            <div className="admin-card">
              <SH icon="fa-solid fa-cube" num={1} title="Basic Information" sub="Core identifiers and classification" />
              <div style={ST.col}>

                {/* Name */}
                <div>
                  <label style={ST.label}>Product Name <span style={{ color: '#ef4444' }}>*</span></label>
                  <input id="prod-name" type="text" name="name" value={form.name} onChange={handleNameChange}
                    placeholder="e.g. Woodpecker Ai-Ray Portable Dental X-Ray System"
                    className="form-control" style={{ width: '100%', borderColor: errors.name ? '#ef4444' : undefined }} />
                  {errors.name && <span style={ST.err}>{errors.name}</span>}
                </div>

                {/* Slug + SKU */}
                <div style={ST.g2}>
                  <div>
                    <label style={ST.label}>URL Slug <span style={ST.hintLabel}>(auto-generated)</span></label>
                    <input type="text" name="slug" value={form.slug} onChange={handleChange}
                      placeholder="e.g. woodpecker-ai-ray" className="form-control" style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={ST.label}>SKU <span style={{ color: '#ef4444' }}>*</span></label>
                    <input type="text" name="sku" value={form.sku} onChange={handleChange}
                      placeholder="e.g. PD-EQ-8499" className="form-control"
                      style={{ width: '100%', borderColor: errors.sku ? '#ef4444' : undefined }} />
                    {errors.sku && <span style={ST.err}>{errors.sku}</span>}
                  </div>
                </div>

                {/* Brand + Product Type */}
                <div style={ST.g2}>
                  <div>
                    <label style={ST.label}>Brand <span style={{ color: '#ef4444' }}>*</span></label>
                    <select name="brand" value={form.brand} onChange={handleChange} className="form-control" style={{ width: '100%' }}>
                      <option value="">— Select Brand —</option>
                      {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={ST.label}>Product Type</label>
                    <select
                      name="productType"
                      value={form.productType}
                      onChange={(e) => {
                        const val = e.target.value;
                        const isVar = val === 'Variable';
                        setForm(p => ({
                          ...p,
                          productType: val,
                          enableVariants: isVar ? true : p.enableVariants,
                          variants: isVar && p.variants.length === 0
                            ? [{ id: uid(), packSize: p.packSize || 'Pack of 1', value: 'Standard', mrp: p.mrp || '', price: p.price || '', stock: p.stock || 100, hsnCode: p.hsnCode || '' }]
                            : p.variants,
                        }));
                      }}
                      className="form-control"
                      style={{ width: '100%' }}
                    >
                      {PRODUCT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                {/* Category + SubCategory */}
                <div style={ST.g2}>
                  <div>
                    <label style={ST.label}>Category <span style={{ color: '#ef4444' }}>*</span></label>
                    <select name="category" value={form.category} onChange={handleChange} className="form-control" style={{ width: '100%' }}>
                      <option value="">— Select Category —</option>
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={ST.label}>Sub-Category</label>
                    <select name="subCategory" value={form.subCategory} onChange={handleChange} className="form-control" style={{ width: '100%' }}>
                      <option value="">— Select Sub-Category —</option>
                      {filteredSubs.map(sc => (
                        <option key={sc.id} value={sc.name}>
                          {sc.name}
                        </option>
                      ))}
                    </select>
                    {filteredSubs.length === 0 && form.category && (
                      <span style={{ ...ST.err, color: '#94a3b8' }}>No sub-categories for selected category</span>
                    )}
                  </div>
                </div>

                {/* Featured Product + Expiry Date */}
                <div style={ST.g2}>
                  <div>
                    <label style={ST.label}>Featured Product</label>
                    <select
                      name="isFeatured"
                      value={form.isFeatured ? 'Yes' : 'No'}
                      onChange={e => setForm(p => ({ ...p, isFeatured: e.target.value === 'Yes' }))}
                      className="form-control"
                      style={{ width: '100%' }}
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  <div>
                    <label style={ST.label}>Expiry Date <span style={ST.hintLabel}>(dd-mm-yyyy)</span></label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={form.expiryDate}
                      onChange={handleChange}
                      placeholder="dd-mm-yyyy"
                      className="form-control"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                {/* Warranty Value + Returnable */}
                <div style={ST.g3}>
                  <div>
                    <label style={ST.label}>Warranty Value</label>
                    <input
                      type="number"
                      name="warrantyValue"
                      value={form.warrantyValue}
                      onChange={handleChange}
                      placeholder="e.g. 1"
                      className="form-control"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={ST.label}>Warranty Unit</label>
                    <select
                      name="warrantyUnit"
                      value={form.warrantyUnit}
                      onChange={handleChange}
                      className="form-control"
                      style={{ width: '100%' }}
                    >
                      <option value="Days">Days</option>
                      <option value="Months">Months</option>
                      <option value="Years">Years</option>
                    </select>
                  </div>
                  <div>
                    <label style={ST.label}>Returnable & Days</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select
                        name="returnEligible"
                        value={form.returnEligible ? 'Yes' : 'No'}
                        onChange={e => setForm(p => ({ ...p, returnEligible: e.target.value === 'Yes' }))}
                        className="form-control"
                        style={{ width: '80px' }}
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      {form.returnEligible && (
                        <input
                          type="number"
                          name="returnDays"
                          value={form.returnDays}
                          onChange={handleChange}
                          placeholder="Days"
                          className="form-control"
                          style={{ width: '100%' }}
                        />
                      )}
                    </div>
                  </div>
                    <div style={{ ...ST.g2, marginTop: '12px' }}>
                    <div>
                      <label style={ST.label}>Estimated Delivery Days</label>
                      <input
                        type="number"
                        name="deliveryDays"
                        value={form.deliveryDays}
                        onChange={handleChange}
                        min="1"
                        placeholder="3"
                        className="form-control"
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div></div>
                  </div>
                </div>

                {/* Short Description */}
                <div>
                  <label style={ST.label}>Short Description <span style={ST.hintLabel}>(shown on product card)</span></label>
                  <textarea name="shortDescription" rows={2} value={form.shortDescription} onChange={handleChange}
                    placeholder="e.g. Handheld portable X-ray system for high-clarity intraoral imaging."
                    className="form-control" style={{ width: '100%', resize: 'vertical' }} />
                </div>

                {/* Full Description */}
                <div>
                  <label style={ST.label}>Full Description <span style={ST.hintLabel}>(product detail page)</span></label>
                  <textarea name="fullDescription" rows={5} value={form.fullDescription} onChange={handleChange}
                    placeholder="Enter detailed product description, manufacturing standards, practical applications and key highlights..."
                    className="form-control" style={{ width: '100%', resize: 'vertical' }} />
                </div>

                {/* Bright Points */}
                <div style={ST.g2}>
                  <div>
                    <label style={ST.label}>Bright Points <span style={ST.hintLabel}>(loyalty points awarded on purchase)</span></label>
                    <input
                      type="number"
                      name="brightPoints"
                      value={form.brightPoints}
                      onChange={handleChange}
                      min="0"
                      placeholder="e.g. 50"
                      className="form-control"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>
            </div>

           

            {/* ── Product Badge & Benefits ── */}
            <div className="admin-card">
              <SH icon="fa-solid fa-award" num={1.1} title="Product Badge & Key Benefits" sub="Highlights that show up on the storefront product card & detail page" />
              <div style={ST.col}>
                {/* Single Product Badge */}
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <label style={{ ...ST.label, color: '#0f172a', marginBottom: '6px' }}>
                    <i className="fa-solid fa-tag" style={{ color: '#0d9488', marginRight: '6px' }} />
                    Product Badge <span style={ST.hintLabel}>(Single primary storefront badge shown on product card &amp; hero)</span>
                  </label>
                  <input
                    type="text"
                    name="customBadge1"
                    value={form.customBadge1}
                    onChange={handleChange}
                    placeholder="e.g. FDA Approved, Bestseller, 20% OFF, Doctor Choice"
                    className="form-control"
                    style={{ width: '100%' }}
                  />
                </div>

                {/* 3 Key Benefits with Icon + Name */}
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <label style={{ ...ST.label, color: '#0f172a', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span><i className="fa-solid fa-circle-check" style={{ color: '#0d9488', marginRight: '6px' }} />Product Benefits (Icon + Name)</span>
                    <span style={ST.hintLabel}>3 Key selling points with visual icons</span>
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Benefit 1 */}
                    <div>
                      <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '4px', display: 'block' }}>Benefit 1</span>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#f0fdf9', border: '1.5px solid #99f6e4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <i className={form.benefit1Icon || 'fa-solid fa-check'} style={{ color: '#0d9488', fontSize: '1rem' }} />
                        </div>
                        <select
                          value={form.benefit1Icon}
                          onChange={e => setForm(p => ({ ...p, benefit1Icon: e.target.value }))}
                          className="form-control"
                          style={{ width: '170px', fontSize: '0.8rem' }}
                        >
                          <option value="fa-solid fa-shield-halved">🛡️ Shield / Safety</option>
                          <option value="fa-solid fa-tooth">🦷 Tooth / Dental</option>
                          <option value="fa-solid fa-award">🏆 Award / Quality</option>
                          <option value="fa-solid fa-check-circle">✓ Check / Genuine</option>
                          <option value="fa-solid fa-truck-fast">🚚 Fast Delivery</option>
                          <option value="fa-solid fa-microchip">🔬 Precision Tech</option>
                          <option value="fa-solid fa-gem">💎 Premium Grade</option>
                          <option value="fa-solid fa-certificate">📜 ISO Certified</option>
                          <option value="fa-solid fa-leaf">🌿 Bio-Compatible</option>
                          <option value="fa-solid fa-clock">⏱️ Long Life</option>
                        </select>
                        <input
                          type="text"
                          name="benefit1Icon"
                          value={form.benefit1Icon}
                          onChange={handleChange}
                          placeholder="Icon class"
                          className="form-control"
                          style={{ width: '150px', fontSize: '0.8rem' }}
                          title="Custom FontAwesome icon class"
                        />
                        <input
                          type="text"
                          name="benefit1Name"
                          value={form.benefit1Name}
                          onChange={e => {
                            const v = e.target.value;
                            setForm(p => ({ ...p, benefit1Name: v, benefit1: v }));
                          }}
                          placeholder="Benefit 1 Name (e.g. 100% Medical Grade & Bio-Compatible)"
                          className="form-control"
                          style={{ flex: 1, minWidth: '220px', fontSize: '0.84rem' }}
                        />
                      </div>
                    </div>

                    {/* Benefit 2 */}
                    <div>
                      <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '4px', display: 'block' }}>Benefit 2</span>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#f0fdf9', border: '1.5px solid #99f6e4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <i className={form.benefit2Icon || 'fa-solid fa-check'} style={{ color: '#0d9488', fontSize: '1rem' }} />
                        </div>
                        <select
                          value={form.benefit2Icon}
                          onChange={e => setForm(p => ({ ...p, benefit2Icon: e.target.value }))}
                          className="form-control"
                          style={{ width: '170px', fontSize: '0.8rem' }}
                        >
                          <option value="fa-solid fa-tooth">🦷 Tooth / Dental</option>
                          <option value="fa-solid fa-shield-halved">🛡️ Shield / Safety</option>
                          <option value="fa-solid fa-award">🏆 Award / Quality</option>
                          <option value="fa-solid fa-check-circle">✓ Check / Genuine</option>
                          <option value="fa-solid fa-truck-fast">🚚 Fast Delivery</option>
                          <option value="fa-solid fa-microchip">🔬 Precision Tech</option>
                          <option value="fa-solid fa-gem">💎 Premium Grade</option>
                          <option value="fa-solid fa-certificate">📜 ISO Certified</option>
                          <option value="fa-solid fa-leaf">🌿 Bio-Compatible</option>
                          <option value="fa-solid fa-clock">⏱️ Long Life</option>
                        </select>
                        <input
                          type="text"
                          name="benefit2Icon"
                          value={form.benefit2Icon}
                          onChange={handleChange}
                          placeholder="Icon class"
                          className="form-control"
                          style={{ width: '150px', fontSize: '0.8rem' }}
                          title="Custom FontAwesome icon class"
                        />
                        <input
                          type="text"
                          name="benefit2Name"
                          value={form.benefit2Name}
                          onChange={e => {
                            const v = e.target.value;
                            setForm(p => ({ ...p, benefit2Name: v, benefit2: v }));
                          }}
                          placeholder="Benefit 2 Name (e.g. Ergonomically Designed for Maximum Tactile Comfort)"
                          className="form-control"
                          style={{ flex: 1, minWidth: '220px', fontSize: '0.84rem' }}
                        />
                      </div>
                    </div>

                    {/* Benefit 3 */}
                    <div>
                      <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '4px', display: 'block' }}>Benefit 3</span>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#f0fdf9', border: '1.5px solid #99f6e4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <i className={form.benefit3Icon || 'fa-solid fa-check'} style={{ color: '#0d9488', fontSize: '1rem' }} />
                        </div>
                        <select
                          value={form.benefit3Icon}
                          onChange={e => setForm(p => ({ ...p, benefit3Icon: e.target.value }))}
                          className="form-control"
                          style={{ width: '170px', fontSize: '0.8rem' }}
                        >
                          <option value="fa-solid fa-award">🏆 Award / Quality</option>
                          <option value="fa-solid fa-shield-halved">🛡️ Shield / Safety</option>
                          <option value="fa-solid fa-tooth">🦷 Tooth / Dental</option>
                          <option value="fa-solid fa-check-circle">✓ Check / Genuine</option>
                          <option value="fa-solid fa-truck-fast">🚚 Fast Delivery</option>
                          <option value="fa-solid fa-microchip">🔬 Precision Tech</option>
                          <option value="fa-solid fa-gem">💎 Premium Grade</option>
                          <option value="fa-solid fa-certificate">📜 ISO Certified</option>
                          <option value="fa-solid fa-leaf">🌿 Bio-Compatible</option>
                          <option value="fa-solid fa-clock">⏱️ Long Life</option>
                        </select>
                        <input
                          type="text"
                          name="benefit3Icon"
                          value={form.benefit3Icon}
                          onChange={handleChange}
                          placeholder="Icon class"
                          className="form-control"
                          style={{ width: '150px', fontSize: '0.8rem' }}
                          title="Custom FontAwesome icon class"
                        />
                        <input
                          type="text"
                          name="benefit3Name"
                          value={form.benefit3Name}
                          onChange={e => {
                            const v = e.target.value;
                            setForm(p => ({ ...p, benefit3Name: v, benefit3: v }));
                          }}
                          placeholder="Benefit 3 Name (e.g. ISO 13485 & CE European Standard Certified)"
                          className="form-control"
                          style={{ flex: 1, minWidth: '220px', fontSize: '0.84rem' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── §2 Product Media & Documents ── */}
            <div className="admin-card">
              <SH icon="fa-solid fa-photo-film" num={2} title="Product Media & Documents" sub="Images, video file & URL uploads, product PDF brochure/manual, alt text" />
              <div style={ST.col}>

                {/* Main Product Image */}
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <label style={{ ...ST.label, color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span><i className="fa-solid fa-image" style={{ color: '#0d9488', marginRight: '6px' }} />Main Product Image <span style={{ color: '#ef4444' }}>*</span></span>
                    <span style={ST.hintLabel}>Recommended 600×600 px (WEBP, PNG, JPG · max 8MB)</span>
                  </label>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: form.mainImage ? '100px 1fr' : '1fr', gap: '14px', alignItems: 'start' }}>
                    {form.mainImage && (
                      <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #0d9488', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }}>
                        <img
                          src={form.mainImage}
                          alt="Main Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          onError={e => { (e.target as HTMLImageElement).src = '/images/banner.webp'; }}
                        />
                        <button
                          type="button"
                          title="Remove image"
                          onClick={() => setForm(p => ({ ...p, mainImage: '' }))}
                          style={{ position: 'absolute', top: '4px', right: '4px', width: '22px', height: '22px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    <div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="btn-admin-primary"
                          onClick={() => mainImageFileRef.current?.click()}
                          style={{ padding: '7px 14px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          <i className="fa-solid fa-cloud-arrow-up" /> Choose Image File
                        </button>
                        <input
                          ref={mainImageFileRef}
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleImageUpload}
                        />
                        <span style={{ fontSize: '0.76rem', color: '#64748b' }}>or paste an online URL below:</span>
                      </div>
                      <input
                        type="text"
                        name="mainImage"
                        value={form.mainImage}
                        onChange={handleChange}
                        placeholder="https://... or paste direct image URL"
                        className="form-control"
                        style={{ width: '100%', borderColor: errors.mainImage ? '#ef4444' : undefined }}
                      />
                      {errors.mainImage && <span style={ST.err}>{errors.mainImage}</span>}
                    </div>
                  </div>
                </div>

                {/* Gallery Images */}
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <label style={{ ...ST.label, color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span><i className="fa-solid fa-images" style={{ color: '#0d9488', marginRight: '6px' }} />Gallery Additional Images</span>
                    <span style={ST.hintLabel}>Multiple images allowed (Angles, product usage, packaging)</span>
                  </label>
                  
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn-admin-outline"
                      onClick={() => galleryFileRef.current?.click()}
                      style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <i className="fa-solid fa-upload" /> Upload Gallery Files
                    </button>
                    <input
                      ref={galleryFileRef}
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                      onChange={handleGalleryUpload}
                    />
                    <div style={{ display: 'flex', gap: '6px', flex: 1, minWidth: '240px' }}>
                      <input
                        type="text"
                        value={galleryInput}
                        onChange={e => setGalleryInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addGalleryUrl())}
                        placeholder="Paste image URL and click Add"
                        className="form-control"
                        style={{ flex: 1, fontSize: '0.82rem' }}
                      />
                      <button
                        type="button"
                        className="btn-admin-primary"
                        onClick={addGalleryUrl}
                        style={{ whiteSpace: 'nowrap', padding: '6px 14px', fontSize: '0.8rem' }}
                      >
                        + Add URL
                      </button>
                    </div>
                  </div>

                  {form.galleryImages.length > 0 ? (
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '6px' }}>
                      {form.galleryImages.map((url, idx) => (
                        <div key={idx} style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1', background: '#fff' }}>
                          <img
                            src={url}
                            alt={`Gallery ${idx + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={e => { (e.target as HTMLImageElement).src = '/images/banner.webp'; }}
                          />
                          <button
                            type="button"
                            title="Remove image"
                            onClick={() => removeGallery(idx)}
                            style={{ position: 'absolute', top: '3px', right: '3px', width: '18px', height: '18px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', fontSize: '0.65rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic' }}>
                      No gallery images uploaded yet. You can upload multiple product angles or detail views.
                    </div>
                  )}
                </div>

                {/* Product Video & Alt Text */}
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <label style={{ ...ST.label, color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span><i className="fa-solid fa-video" style={{ color: '#0d9488', marginRight: '6px' }} />Product Video (File Upload or Streaming URL)</span>
                    <span style={ST.hintLabel}>MP4, WebM up to 50MB or YouTube / Vimeo embed URL</span>
                  </label>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', alignItems: 'start' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="btn-admin-primary"
                          onClick={() => videoFileRef.current?.click()}
                          style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          <i className="fa-solid fa-file-video" /> Upload Video File
                        </button>
                        <input
                          ref={videoFileRef}
                          type="file"
                          accept="video/mp4,video/webm,video/ogg"
                          style={{ display: 'none' }}
                          onChange={handleVideoUpload}
                        />
                        {form.videoFileName && (
                          <span style={{ fontSize: '0.74rem', background: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                            <i className="fa-solid fa-check" style={{ marginRight: '4px' }} />{form.videoFileName}
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        name="videoUrl"
                        value={form.videoUrl}
                        onChange={handleChange}
                        placeholder="https://youtube.com/watch?v=... or direct MP4 URL"
                        className="form-control"
                        style={{ width: '100%', fontSize: '0.82rem' }}
                      />
                      {form.videoUrl && (
                        <button
                          type="button"
                          onClick={() => setForm(p => ({ ...p, videoUrl: '', videoFileName: '' }))}
                          style={{ marginTop: '6px', background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <i className="fa-solid fa-trash-can" /> Remove Video
                        </button>
                      )}
                    </div>

                    <div>
                      <label style={ST.label}>Image Alt Text <span style={ST.hintLabel}>(SEO &amp; Accessibility)</span></label>
                      <input
                        type="text"
                        name="altText"
                        value={form.altText}
                        onChange={handleChange}
                        placeholder="e.g. BuyBright High-Precision Intraoral Sensor"
                        className="form-control"
                        style={{ width: '100%' }}
                      />
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                        Descriptive alt tag for search engines and screen readers.
                      </span>
                    </div>
                  </div>

                  {/* Video Preview Player if available */}
                  {form.videoUrl && (
                    <div style={{ marginTop: '12px', borderTop: '1px dashed #cbd5e1', paddingTop: '10px' }}>
                      <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                        <i className="fa-solid fa-play" style={{ color: '#0d9488', marginRight: '6px' }} />Video Preview:
                      </span>
                      {form.videoUrl.startsWith('data:video') || form.videoUrl.endsWith('.mp4') || form.videoUrl.endsWith('.webm') ? (
                        <video
                          src={form.videoUrl}
                          controls
                          style={{ maxHeight: '200px', width: '100%', maxWidth: '400px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#000' }}
                        />
                      ) : (
                        <div style={{ background: '#f1f5f9', padding: '10px 14px', borderRadius: '8px', fontSize: '0.8rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <i className="fa-solid fa-link" style={{ color: '#0d9488' }} />
                          <span style={{ wordBreak: 'break-all' }}>Streaming Link: <a href={form.videoUrl} target="_blank" rel="noreferrer" style={{ color: '#0d9488', textDecoration: 'underline' }}>{form.videoUrl}</a></span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Product Specification / Brochure (PDF) */}
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <label style={{ ...ST.label, color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span><i className="fa-solid fa-file-pdf" style={{ color: '#ef4444', marginRight: '6px' }} />Product Technical Brochure / Specification Document (PDF)</span>
                    <span style={ST.hintLabel}>PDF up to 25MB or direct document URL for customer download</span>
                  </label>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="btn-admin-primary"
                        onClick={() => pdfFileRef.current?.click()}
                        style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <i className="fa-solid fa-file-arrow-up" /> Upload PDF Document
                      </button>
                      <input
                        ref={pdfFileRef}
                        type="file"
                        accept=".pdf,application/pdf"
                        style={{ display: 'none' }}
                        onChange={handlePdfUpload}
                      />
                      <span style={{ fontSize: '0.76rem', color: '#64748b' }}>or paste direct PDF link:</span>
                      <input
                        type="text"
                        name="pdfUrl"
                        value={form.pdfUrl}
                        onChange={handleChange}
                        placeholder="https://.../product-brochure.pdf"
                        className="form-control"
                        style={{ flex: 1, minWidth: '240px', fontSize: '0.82rem' }}
                      />
                    </div>

                    {/* PDF Preview Card if attached */}
                    {form.pdfUrl && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <i className="fa-solid fa-file-pdf" style={{ color: '#ef4444', fontSize: '1.2rem' }} />
                          </div>
                          <div>
                            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#991b1b' }}>
                              {form.pdfFileName || 'Product-Specification.pdf'}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#b91c1c' }}>
                              Linked for instant download on storefront SKU specification
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <a
                            href={form.pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-admin-outline"
                            style={{ padding: '4px 10px', fontSize: '0.75rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#fff' }}
                          >
                            <i className="fa-solid fa-arrow-up-right-from-square" /> Preview PDF
                          </a>
                          <button
                            type="button"
                            onClick={() => setForm(p => ({ ...p, pdfUrl: '', pdfFileName: '' }))}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.82rem', padding: '4px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            title="Remove PDF"
                          >
                            <i className="fa-solid fa-trash-can" /> Remove
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
  {/* ── §2.5 Has Variants? (Pack Sizes) ── */}
            <div className="admin-card">
              <SH icon="fa-solid fa-layer-group" num={2.5} title="Has Variants? (Pack Sizes)" sub="Enable if this product comes in multiple pack sizes or configurations" />
              <div className="product-variants-toggle-row">
                <div className="product-variants-toggle-select">
                  <label style={ST.label}>Enable Variants / Pack Sizes</label>
                  <select
                    value={form.enableVariants ? 'Yes' : 'No'}
                    onChange={(e) => {
                      const isYes = e.target.value === 'Yes';
                      setForm(p => ({
                        ...p,
                        enableVariants: isYes,
                        productType: isYes ? 'Variable' : (p.productType === 'Variable' ? 'Simple' : p.productType),
                        variants: isYes && p.variants.length === 0
                          ? [{ id: uid(), packSize: p.packSize || 'Pack of 1', value: 'Standard', mrp: p.mrp || '', price: p.price || '', stock: p.stock || 100, hsnCode: p.hsnCode || '' }]
                          : p.variants,
                      }));
                    }}
                    className="form-control"
                    style={{
                      width: '100%',
                      fontWeight: 700,
                      borderColor: form.enableVariants ? '#0d9488' : undefined,
                      background: form.enableVariants ? '#f0fdf9' : '#fff',
                      color: form.enableVariants ? '#0f766e' : '#334155',
                    }}
                  >
                    <option value="No">No — Single SKU (fixed price)</option>
                    <option value="Yes">Yes — Multiple Pack Sizes / variants</option>
                  </select>
                </div>
                <div
                  className="product-variants-toggle-note"
                  style={{
                    background: form.enableVariants ? '#f0fdf9' : '#f8fafc',
                    border: `1px solid ${form.enableVariants ? '#a7f3d0' : '#e2e8f0'}`,
                    color: form.enableVariants ? '#065f46' : '#64748b',
                  }}
                >
                  <i className={`fa-solid ${form.enableVariants ? 'fa-circle-check' : 'fa-circle-info'}`}
                    style={{ color: form.enableVariants ? '#10b981' : '#94a3b8', fontSize: '1rem' }} />
                  {form.enableVariants
                    ? 'Variants enabled — pricing per variant below. Section 3 (Pricing) is hidden.'
                    : 'Single product — fill pricing in Section 3 below.'}
                </div>
              </div>
            </div>

            {/* ── §3 Pricing, Tax & Inventory — hidden when variants enabled ── */}
            {!form.enableVariants && (
            <div className="admin-card">
              <SH icon="fa-solid fa-indian-rupee-sign" num={3} title="Pricing, Tax & Inventory" sub="MRP, selling price, real-time discount, HSN selection with auto CGST/SGST/IGST breakdown and stock controls" />
              <div style={ST.col}>

                {/* MRP & Selling Price */}
                <div style={ST.g2}>
                  <div>
                    <label style={ST.label}>MRP (₹) <span style={ST.hintLabel}>(Maximum Retail Price)</span></label>
                    <input
                      type="number"
                      name="mrp"
                      value={form.mrp}
                      onChange={handleChange}
                      min="0"
                      placeholder="e.g. 1000"
                      className="form-control"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={ST.label}>Selling Price (₹) <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      min="0"
                      placeholder="e.g. 799"
                      className="form-control"
                      style={{ width: '100%', borderColor: errors.price ? '#ef4444' : undefined }}
                    />
                    {errors.price && <span style={ST.err}>{errors.price}</span>}
                  </div>
                </div>

                {/* Auto-Calculated Real-Time Discount & Customer Savings */}
                <div style={{
                  background: discPct > 0 ? '#f0fdf4' : '#f8fafc',
                  border: `1px solid ${discPct > 0 ? '#86efac' : '#e2e8f0'}`,
                  borderRadius: '10px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: discPct > 0 ? '#dcfce7' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className={`fa-solid ${discPct > 0 ? 'fa-tags' : 'fa-calculator'}`} style={{ color: discPct > 0 ? '#16a34a' : '#64748b', fontSize: '1rem' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>
                        {discPct > 0 ? (
                          <span>
                            Auto Discount Calculated: <strong style={{ color: '#16a34a' }}>{discPct}% OFF</strong> · Customer Saves <strong style={{ color: '#16a34a' }}>₹{discountAmount.toLocaleString('en-IN')}</strong>
                          </span>
                        ) : mrpN > 0 && priceN >= mrpN ? (
                          <span style={{ color: '#64748b' }}>Selling Price is equal to or higher than MRP (0% Discount)</span>
                        ) : (
                          <span style={{ color: '#64748b' }}>Enter MRP &amp; Selling Price to auto-calculate customer discount</span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                        {priceN > 0 ? `Selling at ₹${priceN.toLocaleString('en-IN')}` : 'Price not set'} {mrpN > priceN ? `(Reduced from MRP ₹${mrpN.toLocaleString('en-IN')})` : ''}
                      </div>
                    </div>
                  </div>
                  {discPct > 0 && (
                    <span style={{ background: '#16a34a', color: '#fff', fontSize: '0.78rem', fontWeight: 800, padding: '4px 12px', borderRadius: '20px', letterSpacing: '0.3px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                      {discPct}% OFF
                    </span>
                  )}
                </div>




                {/* HSN Code Selection Dropdown */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ ...ST.label, margin: 0 }}>
                      HSN Code <span style={ST.hintLabel}>(Select from registered HSN directory)</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#0d9488', cursor: 'pointer', fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        name="gstInclusive"
                        checked={form.gstInclusive}
                        onChange={handleChange}
                        style={{ accentColor: '#0d9488' }}
                      />
                      Price is inclusive of GST
                    </label>
                  </div>
                  <select
                    name="hsnCode"
                    value={form.hsnCode}
                    onChange={(e) => {
                      const val = e.target.value;
                      const selected = hsnCodes.find(h => h.hsnCode === val);
                      setForm(p => ({
                        ...p,
                        hsnCode: val,
                        gstRate: selected ? `${selected.totalGst}%` : p.gstRate,
                      }));
                    }}
                    className="form-control"
                    style={{ width: '100%' }}
                  >
                    <option value="">— Select Registered HSN Code —</option>
                    {hsnCodes.map((h) => (
                      <option key={h.id} value={h.hsnCode}>
                        {h.hsnCode} — {h.description.slice(0, 50)}{h.description.length > 50 ? '...' : ''} ({h.totalGst}% Total GST)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Live CGST, SGST, IGST Automated Calculation Card */}
                <div style={{
                  background: form.hsnCode ? '#f0fdf9' : '#f8fafc',
                  border: `1.5px solid ${form.hsnCode ? '#99f6e4' : '#e2e8f0'}`,
                  borderRadius: '10px',
                  padding: '14px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="fa-solid fa-file-invoice-dollar" style={{ color: '#0d9488', fontSize: '1rem' }} />
                      <strong style={{ fontSize: '0.86rem', color: '#0f172a' }}>
                        Automated GST Breakdown Matrix (CGST / SGST / IGST)
                      </strong>
                    </div>
                    {form.hsnCode ? (
                      <span style={{ background: '#ccfbf1', color: '#0f766e', fontSize: '0.74rem', fontWeight: 700, padding: '3px 10px', borderRadius: '12px' }}>
                        HSN: {form.hsnCode} · Mapped {totalGstRate}% GST
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        Select HSN above to view tax breakdown
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                    {/* CGST */}
                    <div style={{ background: '#fff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>CGST (Central)</div>
                      <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                        {cgstRate}%
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#0d9488', fontWeight: 600, marginTop: '2px' }}>
                        ₹{cgstAmount.toFixed(2)}
                      </div>
                      <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>50% of total GST</span>
                    </div>

                    {/* SGST */}
                    <div style={{ background: '#fff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>SGST (State)</div>
                      <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                        {sgstRate}%
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#0d9488', fontWeight: 600, marginTop: '2px' }}>
                        ₹{sgstAmount.toFixed(2)}
                      </div>
                      <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>50% of total GST</span>
                    </div>

                    {/* IGST */}
                    <div style={{ background: '#fff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>IGST (Interstate)</div>
                      <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                        {igstRate}%
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#0d9488', fontWeight: 600, marginTop: '2px' }}>
                        ₹{igstAmount.toFixed(2)}
                      </div>
                      <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Equal to GST Rate</span>
                    </div>

                    {/* Tax Summary */}
                    <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                      <div style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 600, textTransform: 'uppercase' }}>Taxable Base Value</div>
                      <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                        ₹{taxableValue.toFixed(2)}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                        Total Tax: <strong style={{ color: '#0f172a' }}>₹{totalGstAmount.toFixed(2)}</strong>
                      </div>
                      <span style={{ fontSize: '0.65rem', color: '#64748b' }}>
                        {form.gstInclusive ? 'Included in price' : 'Added to invoice'} (Total: ₹{finalInvoicedPrice.toFixed(2)})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Merged Inventory & Stock Section */}
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', marginTop: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <i className="fa-solid fa-boxes-stacked" style={{ color: '#0d9488', fontSize: '1rem' }} />
                    <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>Inventory &amp; Order Constraints</strong>
                  </div>
                  <div style={ST.g2}>
                    <div>
                      <label style={ST.label}>Stock Quantity</label>
                      <input
                        type="number"
                        name="stock"
                        value={form.stock}
                        onChange={handleChange}
                        min="0"
                        placeholder="e.g. 100"
                        className="form-control"
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <label style={ST.label}>Low Stock Alert Threshold</label>
                      <input
                        type="number"
                        name="lowStockThreshold"
                        value={form.lowStockThreshold}
                        onChange={handleChange}
                        min="0"
                        placeholder="e.g. 5"
                        className="form-control"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                  <div style={{ ...ST.g3, marginTop: '10px' }}>
                    <div>
                      <label style={ST.label}>Stock Status</label>
                      <select name="stockStatus" value={form.stockStatus} onChange={handleChange} className="form-control" style={{ width: '100%' }}>
                        <option value="In Stock">In Stock</option>
                        <option value="Low Stock">Low Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                      </select>
                    </div>
                    <div>
                      <label style={ST.label}>Min Order Quantity <span style={ST.hintLabel}>(MOQ)</span></label>
                      <input
                        type="number"
                        name="minOrderQuantity"
                        value={form.minOrderQuantity}
                        onChange={handleChange}
                        min="1"
                        placeholder="e.g. 1"
                        className="form-control"
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <label style={ST.label}>Max Order Quantity <span style={ST.hintLabel}>(Per Order)</span></label>
                      <input
                        type="number"
                        name="maxOrderQuantity"
                        value={form.maxOrderQuantity}
                        onChange={handleChange}
                        min="1"
                        placeholder="e.g. 50"
                        className="form-control"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
            )} {/* end !form.enableVariants — Section 3 */}

            {/* ── §4 Product Variants (Pack Sizes, Values & Pricing) ── */}
            {form.enableVariants ? (
              <div className="product-variants-card">
                <div className="product-variants-header">
                  <div className="product-variants-title-wrap">
                    <div className="product-variants-icon">
                      <i className="fa-solid fa-boxes-packing" />
                    </div>
                    <div className="product-variants-text">
                      <div className="product-variants-title-row">
                        <h3 style={ST.cardTitle}>4. Product Variants (Pack Sizes, Values &amp; Pricing)</h3>
                        <span style={ST.tealBadge}>{form.variants.length} {form.variants.length === 1 ? 'Variant' : 'Variants'}</span>
                      </div>
                      <p>
                        Configure product options: Pack Size, Value, MRP, Selling Price, Stock, and HSN Code for each variant.
                      </p>
                    </div>
                  </div>
                  <div className="product-variants-actions">
                    <button
                      type="button"
                      className="btn-admin-primary"
                      onClick={addVariant}
                      style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <i className="fa-solid fa-plus" /> Add Variant
                    </button>
                    <button
                      type="button"
                      className="btn-admin-outline"
                      onClick={() => setForm(p => ({ ...p, enableVariants: false, productType: p.productType === 'Variable' ? 'Simple' : p.productType }))}
                      style={{ padding: '6px 10px', fontSize: '0.78rem', color: '#64748b' }}
                      title="Disable Variants"
                    >
                      Disable
                    </button>
                  </div>
                </div>

                <div style={ST.col}>
                  {form.variants.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '24px 16px', background: '#fff', borderRadius: '8px', border: '1.5px dashed #cbd5e1' }}>
                      <i className="fa-solid fa-box-open" style={{ fontSize: '2rem', color: '#94a3b8', marginBottom: '8px' }} />
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>No Variants Added Yet</div>
                      <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '4px 0 12px 0' }}>
                        Click the button below to add your first variant with pack size, value, pricing, stock, and HSN code.
                      </p>
                      <button
                        type="button"
                        className="btn-admin-primary"
                        onClick={addVariant}
                        style={{ padding: '7px 16px', fontSize: '0.82rem' }}
                      >
                        <i className="fa-solid fa-plus" style={{ marginRight: '6px' }} /> Add First Variant
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Desktop Table View (>= 769px) */}
                      <div className="product-variants-table-wrap">
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                          <thead>
                            <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#334155' }}>
                              <th style={{ padding: '10px 12px', width: '36px', textAlign: 'center' }}>#</th>
                              <th style={{ padding: '10px 12px', minWidth: '130px' }}>Pack Size <span style={{ color: '#ef4444' }}>*</span></th>
                              <th style={{ padding: '10px 12px', minWidth: '120px' }}>Value <span style={{ color: '#ef4444' }}>*</span></th>
                              <th style={{ padding: '10px 12px', minWidth: '110px' }}>MRP Price (₹)</th>
                              <th style={{ padding: '10px 12px', minWidth: '120px' }}>Selling Price (₹) <span style={{ color: '#ef4444' }}>*</span></th>
                              <th style={{ padding: '10px 12px', minWidth: '90px' }}>Stock</th>
                              <th style={{ padding: '10px 12px', minWidth: '180px' }}>HSN Code</th>
                              <th style={{ padding: '10px 12px', width: '50px', textAlign: 'center' }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {form.variants.map((v, idx) => {
                              const vMrp = Number(v.mrp) || 0;
                              const vPrice = Number(v.price) || 0;
                              const vDisc = vMrp > vPrice && vPrice > 0 ? Math.round(((vMrp - vPrice) / vMrp) * 100) : 0;
                              return (
                                <tr key={v.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                  <td style={{ padding: '10px 12px', textAlign: 'center', color: '#94a3b8', fontWeight: 700 }}>
                                    {idx + 1}
                                  </td>
                                  <td style={{ padding: '8px 10px' }}>
                                    <input
                                      type="text"
                                      value={v.packSize}
                                      onChange={(e) => updateVariant(idx, 'packSize', e.target.value)}
                                      placeholder="e.g. Pack of 1, 50ml, Box of 10"
                                      className="form-control"
                                      style={{ width: '100%', fontSize: '0.82rem', padding: '6px 10px' }}
                                      required
                                    />
                                  </td>
                                  <td style={{ padding: '8px 10px' }}>
                                    <input
                                      type="text"
                                      value={v.value}
                                      onChange={(e) => updateVariant(idx, 'value', e.target.value)}
                                      placeholder="e.g. 100g, 50ml, A2 Shade"
                                      className="form-control"
                                      style={{ width: '100%', fontSize: '0.82rem', padding: '6px 10px' }}
                                      required
                                    />
                                  </td>
                                  <td style={{ padding: '8px 10px' }}>
                                    <input
                                      type="number"
                                      value={v.mrp}
                                      onChange={(e) => updateVariant(idx, 'mrp', e.target.value === '' ? '' : Number(e.target.value))}
                                      min="0"
                                      placeholder="e.g. 1200"
                                      className="form-control"
                                      style={{ width: '100%', fontSize: '0.82rem', padding: '6px 10px' }}
                                    />
                                  </td>
                                  <td style={{ padding: '8px 10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <input
                                        type="number"
                                        value={v.price}
                                        onChange={(e) => updateVariant(idx, 'price', e.target.value === '' ? '' : Number(e.target.value))}
                                        min="0"
                                        placeholder="e.g. 999"
                                        className="form-control"
                                        style={{ flex: 1, fontSize: '0.82rem', padding: '6px 10px', fontWeight: 600 }}
                                        required
                                      />
                                      {vDisc > 0 && (
                                        <span style={{ fontSize: '0.68rem', fontWeight: 800, background: '#dcfce7', color: '#16a34a', padding: '2px 5px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                                          {vDisc}% OFF
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td style={{ padding: '8px 10px' }}>
                                    <input
                                      type="number"
                                      value={v.stock}
                                      onChange={(e) => updateVariant(idx, 'stock', e.target.value === '' ? '' : Number(e.target.value))}
                                      min="0"
                                      placeholder="100"
                                      className="form-control"
                                      style={{ width: '100%', fontSize: '0.82rem', padding: '6px 10px' }}
                                    />
                                  </td>
                                  <td style={{ padding: '8px 10px' }}>
                                    <select
                                      value={v.hsnCode || ''}
                                      onChange={(e) => updateVariant(idx, 'hsnCode', e.target.value)}
                                      className="form-control"
                                      style={{ width: '100%', fontSize: '0.78rem', padding: '6px 8px' }}
                                    >
                                      <option value="">— Select HSN Code —</option>
                                      {hsnCodes.map((h) => (
                                        <option key={h.id} value={h.hsnCode}>
                                          {h.hsnCode} ({h.totalGst}% GST)
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                                    <button
                                      type="button"
                                      onClick={() => removeVariant(idx)}
                                      title="Delete Variant"
                                      style={{
                                        background: '#fee2e2',
                                        border: '1px solid #fecaca',
                                        color: '#ef4444',
                                        borderRadius: '6px',
                                        width: '28px',
                                        height: '28px',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.75rem',
                                        transition: 'all 0.15s ease',
                                      }}
                                    >
                                      <i className="fa-solid fa-trash-can" />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile Responsive Cards View (<= 768px) */}
                      <div className="product-variants-mobile-list">
                        {form.variants.map((v, idx) => {
                          const vMrp = Number(v.mrp) || 0;
                          const vPrice = Number(v.price) || 0;
                          const vDisc = vMrp > vPrice && vPrice > 0 ? Math.round(((vMrp - vPrice) / vMrp) * 100) : 0;
                          return (
                            <div key={v.id || idx} className="product-variant-item-card">
                              <div className="variant-card-top">
                                <div className="variant-card-number">
                                  <span className="variant-badge-pill">#{idx + 1}</span>
                                  <span>{v.packSize || `Variant ${idx + 1}`}</span>
                                </div>
                                <div className="variant-card-header-actions">
                                  {vDisc > 0 && (
                                    <span style={{ fontSize: '0.68rem', fontWeight: 800, background: '#dcfce7', color: '#16a34a', padding: '2px 6px', borderRadius: '4px' }}>
                                      {vDisc}% OFF
                                    </span>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => removeVariant(idx)}
                                    title="Delete Variant"
                                    style={{
                                      background: '#fee2e2',
                                      border: '1px solid #fecaca',
                                      color: '#ef4444',
                                      borderRadius: '6px',
                                      width: '28px',
                                      height: '28px',
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '0.75rem',
                                    }}
                                  >
                                    <i className="fa-solid fa-trash-can" />
                                  </button>
                                </div>
                              </div>

                              <div className="variant-card-grid">
                                <div className="variant-field-group">
                                  <label>Pack Size <span className="req-star">*</span></label>
                                  <input
                                    type="text"
                                    value={v.packSize}
                                    onChange={(e) => updateVariant(idx, 'packSize', e.target.value)}
                                    placeholder="e.g. Pack of 1, 50ml"
                                    className="form-control"
                                    required
                                  />
                                </div>

                                <div className="variant-field-group">
                                  <label>Value <span className="req-star">*</span></label>
                                  <input
                                    type="text"
                                    value={v.value}
                                    onChange={(e) => updateVariant(idx, 'value', e.target.value)}
                                    placeholder="e.g. 100g, A2 Shade"
                                    className="form-control"
                                    required
                                  />
                                </div>

                                <div className="variant-field-group">
                                  <label>MRP Price (₹)</label>
                                  <input
                                    type="number"
                                    value={v.mrp}
                                    onChange={(e) => updateVariant(idx, 'mrp', e.target.value === '' ? '' : Number(e.target.value))}
                                    min="0"
                                    placeholder="e.g. 1200"
                                    className="form-control"
                                  />
                                </div>

                                <div className="variant-field-group">
                                  <label>Selling Price (₹) <span className="req-star">*</span></label>
                                  <input
                                    type="number"
                                    value={v.price}
                                    onChange={(e) => updateVariant(idx, 'price', e.target.value === '' ? '' : Number(e.target.value))}
                                    min="0"
                                    placeholder="e.g. 999"
                                    className="form-control"
                                    style={{ fontWeight: 600 }}
                                    required
                                  />
                                </div>

                                <div className="variant-field-group">
                                  <label>Stock</label>
                                  <input
                                    type="number"
                                    value={v.stock}
                                    onChange={(e) => updateVariant(idx, 'stock', e.target.value === '' ? '' : Number(e.target.value))}
                                    min="0"
                                    placeholder="100"
                                    className="form-control"
                                  />
                                </div>

                                <div className="variant-field-group">
                                  <label>HSN Code</label>
                                  <select
                                    value={v.hsnCode || ''}
                                    onChange={(e) => updateVariant(idx, 'hsnCode', e.target.value)}
                                    className="form-control"
                                    style={{ fontSize: '0.78rem' }}
                                  >
                                    <option value="">— Select HSN —</option>
                                    {hsnCodes.map((h) => (
                                      <option key={h.id} value={h.hsnCode}>
                                        {h.hsnCode} ({h.totalGst}%)
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              /* If variants are not enabled, compact card encouraging to enable if desired */
              <div className="admin-card" style={{ border: '1.5px dashed #cbd5e1', background: '#f8fafc' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className="fa-solid fa-boxes-stacked" style={{ color: '#64748b', fontSize: '0.85rem' }} />
                    </div>
                    <div>
                      <h3 style={{ ...ST.cardTitle, color: '#475569' }}>4. Product Variants (Optional)</h3>
                      <p style={{ margin: 0, fontSize: '0.74rem', color: '#94a3b8' }}>
                        Single product mode active. Does this product have multiple pack sizes, values, or shades?
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-admin-outline"
                    onClick={() => {
                      setForm(p => ({
                        ...p,
                        enableVariants: true,
                        productType: 'Variable',
                        variants: p.variants.length === 0
                          ? [{ id: uid(), packSize: p.packSize || 'Pack of 1', value: 'Standard', mrp: p.mrp || '', price: p.price || '', stock: p.stock || 100, hsnCode: p.hsnCode || '' }]
                          : p.variants,
                      }));
                    }}
                    style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px', borderColor: '#0d9488', color: '#0d9488' }}
                  >
                    <i className="fa-solid fa-plus" /> Enable Product Variants (Pack Sizes)
                  </button>
                </div>
              </div>
            )}

            {/* ── §5 Logistics & Product Specifications ── */}
            <div className="admin-card">
              <SH icon="fa-solid fa-truck-fast" num={5} title="Logistics & Product Specifications" sub="Unified area for weight, logistics metrics, and specifications." />
              <div style={ST.col}>

                {/* Sub-Card 1: Shipping & Dimensions */}
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <i className="fa-solid fa-dolly" style={{ color: '#0d9488', fontSize: '1rem' }} />
                    <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>Shipping &amp; Dimensions</strong>
                  </div>

                  <div style={ST.g2}>
                    <div>
                      <label style={ST.label}>Weight Value</label>
                      <input
                        type="number"
                        name="weightValue"
                        value={form.weightValue}
                        onChange={handleChange}
                        min="0"
                        step="any"
                        placeholder="250"
                        className="form-control"
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <label style={ST.label}>Weight Unit</label>
                      <select
                        name="weightUnit"
                        value={form.weightUnit}
                        onChange={handleChange}
                        className="form-control"
                        style={{ width: '100%' }}
                      >
                        <option value="grams (gm)">grams (gm)</option>
                        <option value="kilograms (kg)">kilograms (kg)</option>
                        <option value="milligrams (mg)">milligrams (mg)</option>
                        <option value="pounds (lb)">pounds (lb)</option>
                        <option value="ounces (oz)">ounces (oz)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ ...ST.g3, marginTop: '12px' }}>
                    <div>
                      <label style={ST.label}>Length (cm)</label>
                      <input
                        type="number"
                        name="lengthCm"
                        value={form.lengthCm}
                        onChange={handleChange}
                        min="0"
                        placeholder="10"
                        className="form-control"
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <label style={ST.label}>Width (cm)</label>
                      <input
                        type="number"
                        name="widthCm"
                        value={form.widthCm}
                        onChange={handleChange}
                        min="0"
                        placeholder="20"
                        className="form-control"
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <label style={ST.label}>Height (cm)</label>
                      <input
                        type="number"
                        name="heightCm"
                        value={form.heightCm}
                        onChange={handleChange}
                        min="0"
                        placeholder="20"
                        className="form-control"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                 
                </div>

                {/* Sub-Card 2: Manufacturer Details */}
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <i className="fa-solid fa-industry" style={{ color: '#0d9488', fontSize: '1rem' }} />
                    <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>2. Manufacturer Details</strong>
                  </div>

                  <div style={ST.g2}>
                    <div>
                      <label style={ST.label}>Manufacturer Name</label>
                      <input
                        type="text"
                        name="manufacturerName"
                        value={form.manufacturerName}
                        onChange={handleChange}
                        placeholder="e.g. Presto Healthcare &amp; Manufacturing Ltd"
                        className="form-control"
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <label style={ST.label}>Manufacturer Contact / Helpline</label>
                      <input
                        type="text"
                        name="manufacturerContact"
                        value={form.manufacturerContact}
                        onChange={handleChange}
                        placeholder="e.g. support@presto.in / +91 9876543210"
                        className="form-control"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '12px' }}>
                    <label style={ST.label}>Manufacturer Facility &amp; Registered Address</label>
                    <textarea
                      name="manufacturerAddress"
                      rows={2}
                      value={form.manufacturerAddress}
                      onChange={handleChange}
                      placeholder="e.g. Plot No. 42, Phase-II MIDC Industrial Area, Pune, Maharashtra, 411019"
                      className="form-control"
                      style={{ width: '100%', resize: 'vertical' }}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* ── §6 Technical Specifications (Technicals Tab) ── */}
            <div className="admin-card">
              <SH icon="fa-solid fa-microchip" num={6} title="Technical Specifications" sub="Directly displays in the storefront 'Technicals' tab" />
              <div style={ST.col}>

                {/* Dynamic Specifications Matrix */}
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <label style={{ ...ST.label, color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span><i className="fa-solid fa-list" style={{ color: '#0d9488', marginRight: '6px' }} />Technical Specifications (Name / Value Pairs)</span>
                    <span style={ST.hintLabel}>Add specification name and value pairs</span>
                  </label>

                  {/* Header Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 36px', gap: '8px', padding: '6px 10px', background: '#e2e8f0', borderRadius: '6px', marginBottom: '8px', fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>
                    <span>Specification Name *</span>
                    <span>Specification Value *</span>
                    <span></span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {form.specs.map((s, idx) => (
                      <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 36px', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="text"
                          value={s.key}
                          onChange={e => updateSpec(idx, 'key', e.target.value)}
                          placeholder="Specification Name (e.g. Material, Sterilization, Laser Wavelength)"
                          className="form-control"
                          style={{ fontSize: '0.82rem' }}
                        />
                        <input
                          type="text"
                          value={s.value}
                          onChange={e => updateSpec(idx, 'value', e.target.value)}
                          placeholder="Specification Value (e.g. Medical Titanium Grade 5, 134°C Autoclavable)"
                          className="form-control"
                          style={{ fontSize: '0.82rem' }}
                        />
                        <button
                          type="button"
                          onClick={() => removeSpec(idx)}
                          style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '0.9rem' }}
                          title="Remove specification"
                        >
                          <i className="fa-solid fa-trash-can" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addSpec}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: '1px dashed #0d9488', color: '#0d9488', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, width: 'fit-content', marginTop: '4px' }}
                    >
                      <i className="fa-solid fa-plus" /> Add Specification Row
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* ── §7 Packaging Specifications (Rich Text) ── */}
            <div className="admin-card">
              <SH icon="fa-solid fa-box-open" num={7} title="Packaging Specifications" sub="Rich text editor for the Packaging tab on the storefront" />
              <div style={ST.col}>
                <div>
                  <label style={ST.label}>
                    Packaging Information{' '}
                    <span style={ST.hintLabel}>(shown on product detail page Packaging tab)</span>
                  </label>
                  {/* Format Toolbar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', padding: '6px 10px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderBottom: 'none', borderRadius: '8px 8px 0 0' }}>
                    {[
                      { cmd: 'bold', icon: 'fa-solid fa-bold', title: 'Bold' },
                      { cmd: 'italic', icon: 'fa-solid fa-italic', title: 'Italic' },
                      { cmd: 'underline', icon: 'fa-solid fa-underline', title: 'Underline' },
                    ].map(({ cmd, icon, title }) => (
                      <button key={`pkg-${cmd}`} type="button" title={title}
                        onMouseDown={(e) => { e.preventDefault(); document.execCommand(cmd); }}
                        style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', width: '30px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', color: '#334155' }}>
                        <i className={icon} />
                      </button>
                    ))}
                    <div style={{ width: '1px', height: '20px', background: '#cbd5e1', margin: '0 4px' }} />
                    {[
                      { cmd: 'insertUnorderedList', icon: 'fa-solid fa-list-ul', title: 'Bullet List' },
                      { cmd: 'insertOrderedList', icon: 'fa-solid fa-list-ol', title: 'Numbered List' },
                    ].map(({ cmd, icon, title }) => (
                      <button key={`pkg-${cmd}`} type="button" title={title}
                        onMouseDown={(e) => { e.preventDefault(); document.execCommand(cmd); }}
                        style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', width: '30px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', color: '#334155' }}>
                        <i className={icon} />
                      </button>
                    ))}
                    <div style={{ width: '1px', height: '20px', background: '#cbd5e1', margin: '0 4px' }} />
                    <select title="Heading" defaultValue="" style={{ height: '28px', fontSize: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '0 6px', cursor: 'pointer', background: 'white', color: '#334155' }}
                      onChange={(e) => { if (e.target.value) { document.execCommand('formatBlock', false, e.target.value); e.target.value = ''; } }}>
                      <option value="" disabled>Heading</option>
                      <option value="h2">H2</option>
                      <option value="h3">H3</option>
                      <option value="h4">H4</option>
                      <option value="p">Paragraph</option>
                    </select>
                  </div>
                  {/* Editable Content Area */}
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    id="packaging-description-editor"
                    onInput={(e) => {
                      const html = (e.currentTarget as HTMLDivElement).innerHTML;
                      setForm(prev => ({ ...prev, packagingDescriptionHtml: html } as any));
                    }}
                    dangerouslySetInnerHTML={{ __html: (form as any).packagingDescriptionHtml || form.packagingDescription || '' }}
                    style={{ minHeight: '150px', padding: '14px', border: '1px solid #e2e8f0', borderRadius: '0 0 8px 8px', background: '#fff', fontSize: '0.9rem', lineHeight: 1.7, color: '#1e293b', outline: 'none', fontFamily: 'inherit', overflowY: 'auto' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#0d9488'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                    <i className="fa-solid fa-circle-info" style={{ marginRight: '4px' }} />
                    Supports rich text formatting. Content displays directly on the product detail page Packaging tab.
                  </span>
                </div>
              </div>
            </div>

            {/* ── §8 Usage Guidelines & Protocol (Rich Text) ── */}
            <div className="admin-card">
              <SH icon="fa-solid fa-stethoscope" num={8} title="Usage Guidelines & Protocol" sub="Rich text editor for the Usage Guidelines tab on the storefront" />
              <div style={ST.col}>
                <div>
                  <label style={ST.label}>
                    Usage Instructions{' '}
                    <span style={ST.hintLabel}>(shown on product detail page Usage Guidelines tab)</span>
                  </label>
                  {/* Format Toolbar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', padding: '6px 10px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderBottom: 'none', borderRadius: '8px 8px 0 0' }}>
                    {[
                      { cmd: 'bold', icon: 'fa-solid fa-bold', title: 'Bold' },
                      { cmd: 'italic', icon: 'fa-solid fa-italic', title: 'Italic' },
                      { cmd: 'underline', icon: 'fa-solid fa-underline', title: 'Underline' },
                    ].map(({ cmd, icon, title }) => (
                      <button key={`use-${cmd}`} type="button" title={title}
                        onMouseDown={(e) => { e.preventDefault(); document.execCommand(cmd); }}
                        style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', width: '30px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', color: '#334155' }}>
                        <i className={icon} />
                      </button>
                    ))}
                    <div style={{ width: '1px', height: '20px', background: '#cbd5e1', margin: '0 4px' }} />
                    {[
                      { cmd: 'insertUnorderedList', icon: 'fa-solid fa-list-ul', title: 'Bullet List' },
                      { cmd: 'insertOrderedList', icon: 'fa-solid fa-list-ol', title: 'Numbered List' },
                    ].map(({ cmd, icon, title }) => (
                      <button key={`use-${cmd}`} type="button" title={title}
                        onMouseDown={(e) => { e.preventDefault(); document.execCommand(cmd); }}
                        style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', width: '30px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', color: '#334155' }}>
                        <i className={icon} />
                      </button>
                    ))}
                    <div style={{ width: '1px', height: '20px', background: '#cbd5e1', margin: '0 4px' }} />
                    <select title="Heading" defaultValue="" style={{ height: '28px', fontSize: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '0 6px', cursor: 'pointer', background: 'white', color: '#334155' }}
                      onChange={(e) => { if (e.target.value) { document.execCommand('formatBlock', false, e.target.value); e.target.value = ''; } }}>
                      <option value="" disabled>Heading</option>
                      <option value="h2">H2</option>
                      <option value="h3">H3</option>
                      <option value="h4">H4</option>
                      <option value="p">Paragraph</option>
                    </select>
                  </div>
                  {/* Editable Content Area */}
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    id="usage-guidelines-editor"
                    onInput={(e) => {
                      const html = (e.currentTarget as HTMLDivElement).innerHTML;
                      setForm(prev => ({ ...prev, usageGuidelinesHtml: html } as any));
                    }}
                    dangerouslySetInnerHTML={{ __html: (form as any).usageGuidelinesHtml || form.howToUse || '' }}
                    style={{ minHeight: '150px', padding: '14px', border: '1px solid #e2e8f0', borderRadius: '0 0 8px 8px', background: '#fff', fontSize: '0.9rem', lineHeight: 1.7, color: '#1e293b', outline: 'none', fontFamily: 'inherit', overflowY: 'auto' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#0d9488'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                    <i className="fa-solid fa-circle-info" style={{ marginRight: '4px' }} />
                    Supports rich text formatting. Content displays directly on the product detail page Usage Guidelines tab.
                  </span>
                </div>
              </div>
            </div>

            {/* ── §10 SEO Settings ── */}
            <div className="admin-card">
              <SH icon="fa-solid fa-magnifying-glass-chart" num={10} title="SEO Settings" sub="Search engine metadata for this product" />
              <div style={ST.col}>
                <div>
                  <label style={ST.label}>
                    SEO Title <span style={ST.hintLabel}>({(form.seoTitle || '').length}/60 chars)</span>
                  </label>
                  <input type="text" name="seoTitle" maxLength={60} value={form.seoTitle} onChange={handleChange}
                    placeholder="e.g. Woodpecker Ai-Ray Portable X-Ray | BuyBright" className="form-control" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={ST.label}>
                    Meta Description <span style={ST.hintLabel}>({(form.seoDescription || '').length}/160 chars)</span>
                  </label>
                  <textarea name="seoDescription" rows={2} maxLength={160} value={form.seoDescription} onChange={handleChange}
                    placeholder="e.g. Buy Woodpecker Ai-Ray portable dental X-ray system online at best price. ISO certified, genuine product with warranty." className="form-control" style={{ width: '100%', resize: 'vertical' }} />
                </div>
                <div>
                  <label style={ST.label}>Keywords <span style={ST.hintLabel}>(comma separated)</span></label>
                  <input type="text" name="seoKeywords" value={form.seoKeywords} onChange={handleChange}
                    placeholder="e.g. dental x-ray, portable x-ray machine, intraoral imaging" className="form-control" style={{ width: '100%' }} />
                </div>

                {/* Live Google preview */}
                {(form.seoTitle || form.name) && (
                  <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                      <i className="fa-brands fa-google" style={{ color: '#4285f4', marginRight: '5px' }} />Google Preview
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#1a0dab', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '2px' }}>
                      {form.seoTitle || `${form.name} | BuyBright`}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#006621', marginBottom: '4px' }}>buybright.com › products › {form.slug || 'product-slug'}</div>
                    <div style={{ fontSize: '0.78rem', color: '#545454', lineHeight: 1.4 }}>
                      {form.seoDescription || form.shortDescription || 'Product meta description preview appears here...'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── §11 Publish Status & Promotional Flags ── */}
            <div className="admin-card">
              <SH icon="fa-solid fa-cloud-arrow-up" num={11} title="Publish Status & Storefront Flags" sub="Configure live storefront visibility, featured placement, and promotional badges" />
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '14px',
                  padding: '4px 0',
                }}
              >
                {/* 1. Active / Published Checkbox */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: '10px',
                    background: form.status === 'Active' ? '#f0fdf4' : '#f8fafc',
                    border: form.status === 'Active' ? '1.5px solid #86efac' : '1.5px solid #e2e8f0',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={form.status === 'Active'}
                    onChange={(e) => setForm(prev => ({ ...prev, status: e.target.checked ? 'Active' : 'Draft' }))}
                    style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: '#16a34a', cursor: 'pointer' }}
                  />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.88rem', color: form.status === 'Active' ? '#15803d' : '#0f172a' }}>
                      Active / Published
                    </strong>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block', marginTop: '2px' }}>
                      Product is live and visible to customers on the storefront
                    </span>
                  </div>
                </label>

              

                {/* 3. Bestseller Checkbox */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: '10px',
                    background: form.isBestseller ? '#fffbeb' : '#f8fafc',
                    border: form.isBestseller ? '1.5px solid #fde68a' : '1.5px solid #e2e8f0',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={form.isBestseller}
                    onChange={(e) => setForm(prev => ({ ...prev, isBestseller: e.target.checked }))}
                    style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: '#f59e0b', cursor: 'pointer' }}
                  />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.88rem', color: form.isBestseller ? '#b45309' : '#0f172a' }}>
                      Bestseller
                    </strong>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block', marginTop: '2px' }}>
                      Show prominent Bestseller badge and boost in catalog rankings
                    </span>
                  </div>
                </label>

                {/* 4. Trending / New Arrival Checkbox */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: '10px',
                    background: form.isNewArrival ? '#eef2ff' : '#f8fafc',
                    border: form.isNewArrival ? '1.5px solid #c7d2fe' : '1.5px solid #e2e8f0',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={form.isNewArrival}
                    onChange={(e) => setForm(prev => ({ ...prev, isNewArrival: e.target.checked }))}
                    style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: '#6366f1', cursor: 'pointer' }}
                  />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.88rem', color: form.isNewArrival ? '#4338ca' : '#0f172a' }}>
                      Trending / New Arrival
                    </strong>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block', marginTop: '2px' }}>
                      Highlight as latest arrival with dynamic trending badge
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* ── Action Bar ── */}
            <div className="product-form-action-bar">
              <div className="product-status-picker" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#334155', margin: 0 }}>Product Status:</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="form-control"
                  style={{ width: 'auto', minWidth: '150px', fontWeight: 600, color: form.status === 'Active' ? '#16a34a' : form.status === 'Draft' ? '#d97706' : '#64748b' }}
                >
                  <option value="Active">● Active (Live)</option>
                  <option value="Draft">● Draft (Hidden)</option>
                  <option value="Archived">● Archived</option>
                </select>
              </div>
              <div className="product-form-btn-group" style={{ display: 'flex', gap: '12px' }}>
                <button type="button" className="btn-admin-outline" onClick={() => navigate('/admin/products')}>
                  Cancel
                </button>
                <button type="submit" className="btn-admin-primary" disabled={isSubmitting} style={{ padding: '10px 28px', fontSize: '0.9rem' }}>
                  <i className="fa-solid fa-floppy-disk" />
                  {isEdit ? ' Save Changes' : ' Publish Product'}
                </button>
              </div>
            </div>
          </div>

          {/* ══════════════ RIGHT COLUMN — Live Preview ══════════════ */}
          <div className="product-form-preview-sticky" style={{ position: 'sticky', top: '80px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Product Card Preview */}
            <div className="admin-card" style={{ padding: '16px', background: '#f8fafc', border: '1.5px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <i className="fa-solid fa-eye" style={{ color: '#0d9488', marginRight: '6px' }} />
                  Live Storefront Preview
                </span>
                <span style={{ ...ST.tealBadge }}>
                  {form.status}
                </span>
              </div>

              {/* Product Card */}
              <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
                {/* Image area */}
                <div style={{ position: 'relative', height: '180px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {form.mainImage ? (
                    <img src={form.mainImage} alt={form.altText || form.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }}
                      onError={e => { (e.target as HTMLImageElement).src = '/images/banner.webp'; }} />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
                      <i className="fa-solid fa-image" style={{ fontSize: '2.5rem' }} />
                      <span style={{ fontSize: '0.75rem' }}>No image uploaded</span>
                    </div>
                  )}
                  {/* Badges */}
                  <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {discPct > 0 && <span style={{ background: '#dc2626', color: '#fff', fontSize: '0.62rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>-{discPct}%</span>}
                    {form.isBestseller && <span style={{ background: '#f59e0b', color: '#fff', fontSize: '0.6rem', fontWeight: 800, padding: '2px 5px', borderRadius: '3px' }}>Bestseller</span>}
                    {form.isNewArrival && <span style={{ background: '#6366f1', color: '#fff', fontSize: '0.6rem', fontWeight: 800, padding: '2px 5px', borderRadius: '3px' }}>New</span>}
                  </div>
                </div>

                {/* Card content */}
                <div style={{ padding: '12px' }}>
                  {form.brand && <div style={{ fontSize: '0.7rem', color: '#0d9488', fontWeight: 800, textTransform: 'uppercase', marginBottom: '3px' }}>{form.brand}</div>}
                  <div style={{ fontSize: '0.62rem', color: '#f59e0b', marginBottom: '4px' }}>
                    {'★'.repeat(Math.round(Number(form.rating) || 5))} <span style={{ color: '#64748b' }}>({form.reviews_count || 0})</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.3, marginBottom: '6px', minHeight: '34px', overflow: 'hidden' }}>
                    {form.name || <span style={{ color: '#cbd5e1' }}>Product name...</span>}
                  </div>
                  {form.shortDescription && (
                    <div style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.4, marginBottom: '8px' }}>
                      {form.shortDescription.slice(0, 70)}{form.shortDescription.length > 70 ? '…' : ''}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
                    <strong style={{ fontSize: '1rem', color: '#dc2626' }}>₹{priceN > 0 ? priceN.toLocaleString('en-IN') : '—'}</strong>
                    {mrpN > 0 && <span style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'line-through' }}>₹{mrpN.toLocaleString('en-IN')}</span>}
                  </div>
                  {Number(form.brightPoints) > 0 && (
                    <div style={{ display: 'inline-block', background: '#fef9c3', border: '1px solid #fde047', borderRadius: '4px', padding: '1px 6px', fontSize: '0.68rem', fontWeight: 700, color: '#92400e', marginBottom: '8px' }}>
                      Bright Points: {form.brightPoints}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button type="button" style={{ flex: 1, background: '#0d9488', color: '#fff', border: 'none', padding: '6px', borderRadius: '6px', fontWeight: 700, fontSize: '0.74rem', cursor: 'pointer' }}>
                      <i className="fa-solid fa-cart-shopping" style={{ marginRight: '4px' }} />Add to Cart
                    </button>
                    <button type="button" style={{ flex: 1, background: '#dc2626', color: '#fff', border: 'none', padding: '6px', borderRadius: '6px', fontWeight: 700, fontSize: '0.74rem', cursor: 'pointer' }}>
                      <i className="fa-solid fa-bolt" style={{ marginRight: '4px' }} />Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Completion tracker */}
            <div className="admin-card" style={{ padding: '14px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
                <i className="fa-solid fa-chart-simple" style={{ color: '#0d9488', marginRight: '6px' }} />
                Form Completion
              </div>
              {[
                { label: 'Basic Info', done: !!(form.name && form.sku && form.category) },
                { label: 'Media', done: !!form.mainImage },
                { label: 'Pricing', done: !!(form.price && Number(form.price) > 0) },
                { label: 'Inventory', done: form.stock !== '' },
                { label: 'SEO', done: !!(form.seoTitle && form.seoDescription) },
                { label: 'Publishing', done: form.status === 'Active' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <i className={`fa-solid ${item.done ? 'fa-circle-check' : 'fa-circle'}`}
                    style={{ color: item.done ? '#10b981' : '#cbd5e1', fontSize: '0.85rem' }} />
                  <span style={{ fontSize: '0.8rem', color: item.done ? '#065f46' : '#94a3b8', fontWeight: item.done ? 600 : 400 }}>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Quick Tips */}
            <div style={{ background: 'linear-gradient(135deg,#f0fdf9,#e0f2fe)', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '14px', fontSize: '0.76rem', color: '#065f46' }}>
              <div style={{ fontWeight: 700, marginBottom: '6px' }}>
                <i className="fa-solid fa-lightbulb" style={{ color: '#0d9488', marginRight: '6px' }} />Quick Tips
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', lineHeight: 1.8, color: '#047857' }}>
                <li>Use 600×600 px images for best display</li>
                <li>Fill SEO fields to improve search ranking</li>
                <li>Add variants for different sizes/packs</li>
                <li>Set status to <strong>Active</strong> to go live</li>
                <li>Bright Points drive repeat purchases</li>
              </ul>
            </div>
          </div>

        </div>
      </form>
    </div>
  </AdminLayout>
  );
};

export default ProductFormPage;
