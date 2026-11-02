/**
 * BuyBright Admin — Brand Categories Data & LocalStorage Persistence.
 * Categorization layer for dental and healthcare manufacturer brands.
 */

import type { AdminBrandCategory } from '../types/product';

export const initialBrandCategoriesData: AdminBrandCategory[] = [
  {
    id: 'bcat-1',
    name: 'All Brands',
    slug: 'all-brands',
    icon: 'fa-solid fa-border-all',
    description: 'Complete directory of all 17 certified national and international dental manufacturer partners.',
    displayOrder: 1,
    status: 'Active',
    totalBrands: 17,
  },
  {
    id: 'bcat-2',
    name: 'Top Brands',
    slug: 'top-brands',
    icon: 'fa-solid fa-crown',
    description: 'Leading 12 high-demand brands trusted by dental professionals and hospitals.',
    displayOrder: 2,
    status: 'Active',
    totalBrands: 12,
  },
  {
    id: 'bcat-3',
    name: 'Newly Added Brands',
    slug: 'newly-added-brands',
    icon: 'fa-solid fa-sparkles',
    description: '5 recently onboarded innovative dental product lines and supply manufacturers.',
    displayOrder: 3,
    status: 'Active',
    totalBrands: 5,
  },
  {
    id: 'bcat-4',
    name: 'Featured Brands',
    slug: 'featured-brands',
    icon: 'fa-solid fa-star',
    description: '13 spotlight partner manufacturers with premier inventory and direct warranty.',
    displayOrder: 4,
    status: 'Active',
    totalBrands: 13,
  },
  {
    id: 'bcat-5',
    name: 'Prestodental Suggests',
    slug: 'prestodental-suggests',
    icon: 'fa-solid fa-thumbs-up',
    description: '15 handpicked editor and dentist recommendations for maximum reliability.',
    displayOrder: 5,
    status: 'Active',
    totalBrands: 15,
  },
];

const BRAND_CATEGORIES_STORAGE_KEY = 'prestodental_admin_brand_categories_v2';

export function getBrandCategories(): AdminBrandCategory[] {
  try {
    const raw = localStorage.getItem(BRAND_CATEGORIES_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AdminBrandCategory[];
  } catch {
    // fallback
  }
  return initialBrandCategoriesData;
}

export function saveBrandCategories(categories: AdminBrandCategory[]): void {
  try {
    localStorage.setItem(BRAND_CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  } catch {
    // silent fail
  }
}

export function getBrandCategoryById(id: string): AdminBrandCategory | null {
  return getBrandCategories().find((c) => c.id === id) ?? null;
}
