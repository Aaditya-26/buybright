/**
 * BuyBright Admin — Brand Categories Data & LocalStorage Persistence.
 * Categorization layer for verified marketplace manufacturer brands.
 */

import type { AdminBrandCategory } from '../types/product';

export const initialBrandCategoriesData: AdminBrandCategory[] = [
  {
    id: 'bcat-1',
    name: 'All Brands',
    slug: 'all-brands',
    icon: 'fa-solid fa-border-all',
    description: 'Complete directory of all 16 certified national and international marketplace brand partners.',
    displayOrder: 1,
    status: 'Active',
    totalBrands: 16,
  },
  {
    id: 'bcat-2',
    name: 'Top Brands',
    slug: 'top-brands',
    icon: 'fa-solid fa-crown',
    description: 'Leading 12 high-demand consumer brands trusted across India.',
    displayOrder: 2,
    status: 'Active',
    totalBrands: 12,
  },
  {
    id: 'bcat-3',
    name: 'Newly Added Brands',
    slug: 'newly-added-brands',
    icon: 'fa-solid fa-sparkles',
    description: '4 recently onboarded innovative consumer electronics, home, and fashion lines.',
    displayOrder: 3,
    status: 'Active',
    totalBrands: 4,
  },
  {
    id: 'bcat-4',
    name: 'Featured Brands',
    slug: 'featured-brands',
    icon: 'fa-solid fa-star',
    description: '12 spotlight partner manufacturers with premier inventory and official warranty.',
    displayOrder: 4,
    status: 'Active',
    totalBrands: 12,
  },
  {
    id: 'bcat-5',
    name: 'BuyBright Recommends',
    slug: 'buybright-recommends',
    icon: 'fa-solid fa-thumbs-up',
    description: '14 handpicked marketplace editor recommendations for maximum quality and customer ratings.',
    displayOrder: 5,
    status: 'Active',
    totalBrands: 14,
  },
];

const BRAND_CATEGORIES_STORAGE_KEY = 'buybright_admin_brand_categories_v3';

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
