/**
 * BuyBright Admin — Product Types Data & LocalStorage Persistence.
 * Manages official product type classification with badge, name, image, and primary section heading with custom icon.
 */

export interface AdminProductTypeItem {
  id: string;
  badge?: string;
  name: string;
  slug: string;
  image: string;
  heading1Icon?: string;
  sectionHeading1?: string;
  status: 'Active' | 'Inactive';
  totalProducts?: number;
  createdAt?: string;
}

export const initialProductTypesData: AdminProductTypeItem[] = [
  {
    id: 'ptype-1',
    badge: 'Premium Standard',
    name: 'Essential Dental Consumables',
    slug: 'essential-dental-consumables',
    image: '/images/cat_composites.webp',
    heading1Icon: 'fa-solid fa-tooth',
    sectionHeading1: 'High-Purity Restorative Materials & Composites',
    status: 'Active',
    totalProducts: 42,
    createdAt: '2026-01-15',
  },
  {
    id: 'ptype-2',
    badge: 'Bestseller',
    name: 'Electronic Dental Equipment',
    slug: 'electronic-dental-equipment',
    image: '/images/cat_equipment.webp',
    heading1Icon: 'fa-solid fa-microchip',
    sectionHeading1: 'Digital Precision Imaging & Apex Diagnostics',
    status: 'Active',
    totalProducts: 28,
    createdAt: '2026-02-01',
  },
  {
    id: 'ptype-3',
    badge: 'CE Certified',
    name: 'Surgical & Implant Instruments',
    slug: 'surgical-implant-instruments',
    image: '/images/cat_surgical.webp',
    heading1Icon: 'fa-solid fa-scissors',
    sectionHeading1: 'German-Grade Medical Stainless Steel Blades',
    status: 'Active',
    totalProducts: 19,
    createdAt: '2026-02-18',
  },
  {
    id: 'ptype-4',
    badge: 'Trending',
    name: 'Endodontics & Rotary Systems',
    slug: 'endodontics-rotary-systems',
    image: '/images/cat_endodontics.webp',
    heading1Icon: 'fa-solid fa-wand-magic-sparkles',
    sectionHeading1: 'Thermally Treated Flexible NiTi Canal Rotary Files',
    status: 'Active',
    totalProducts: 35,
    createdAt: '2026-03-05',
  },
  {
    id: 'ptype-5',
    badge: 'Premium Choice',
    name: 'Orthodontics & Aesthetic Brackets',
    slug: 'orthodontics-aesthetic-brackets',
    image: '/images/cat_orthodontics.webp',
    heading1Icon: 'fa-solid fa-gem',
    sectionHeading1: 'Ultra-Clear Sapphire Ceramic Bracket Matrices',
    status: 'Active',
    totalProducts: 24,
    createdAt: '2026-03-20',
  },
];

const PRODUCT_TYPES_STORAGE_KEY = 'buybright_admin_product_types_v3';

export function getProductTypes(): AdminProductTypeItem[] {
  try {
    const raw = localStorage.getItem(PRODUCT_TYPES_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AdminProductTypeItem[];
  } catch {
    // fallback
  }
  return initialProductTypesData;
}

export function saveProductTypes(types: AdminProductTypeItem[]): void {
  try {
    localStorage.setItem(PRODUCT_TYPES_STORAGE_KEY, JSON.stringify(types));
  } catch {
    // silent fail
  }
}

export function getProductTypeById(id: string): AdminProductTypeItem | null {
  return getProductTypes().find((t) => t.id === id) ?? null;
}
