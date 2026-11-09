/**
 * BuyBright Flash Sale Data Layer.
 * Manages flash sale product price drops with start/end dates & times.
 */

export interface FlashSaleItem {
  id: string;
  productId: string;
  productName: string;
  brand: string;
  image: string;
  originalPrice: number;
  flashSalePrice: number;
  discountPercentage: number;
  startDate: string; // ISO datetime e.g. "2026-10-06T00:00"
  endDate: string;   // ISO datetime e.g. "2026-10-15T23:59"
  status: 'Active' | 'Inactive';
  categoryLink: string;
  heading?: string;
  shortDescription?: string;
  buttonName?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'buybright_flash_sales_items_v2';

export const INITIAL_FLASH_SALE_ITEMS: FlashSaleItem[] = [
  {
    id: 'fs-1',
    productId: 'prod-elc-1',
    productName: 'Sony WH-1000XM5 Wireless Noise-Canceling Headphones',
    brand: 'SONY',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
    originalPrice: 29990,
    flashSalePrice: 22990,
    discountPercentage: 23,
    startDate: '2026-10-06T00:00',
    endDate: '2026-11-20T23:59',
    status: 'Active',
    categoryLink: '/shop?category=electronics',
    heading: 'Upgrade Your Audio',
    shortDescription: 'Industry-leading active noise cancellation and crystal-clear audiophile sound.',
    buttonName: 'Shop Electronics',
    createdAt: '2026-10-05T14:30',
    updatedAt: '2026-10-06T10:15',
  },
  {
    id: 'fs-2',
    productId: 'prod-fas-1',
    productName: 'Nike Air Zoom Pegasus 40 Running Shoes',
    brand: 'NIKE',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
    originalPrice: 11495,
    flashSalePrice: 6999,
    discountPercentage: 39,
    startDate: '2026-10-06T00:00',
    endDate: '2026-11-20T23:59',
    status: 'Active',
    categoryLink: '/shop?category=fashion',
    heading: 'Step Into Style',
    shortDescription: 'Responsive cushioning and breathable engineered mesh for everyday performance.',
    buttonName: 'Shop Fashion',
    createdAt: '2026-10-05T14:30',
    updatedAt: '2026-10-06T10:15',
  },
  {
    id: 'fs-3',
    productId: 'prod-elc-2',
    productName: 'Apple Watch Series 9 GPS + Cellular 45mm',
    brand: 'APPLE',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=800&auto=format&fit=crop',
    originalPrice: 44900,
    flashSalePrice: 38990,
    discountPercentage: 13,
    startDate: '2026-10-06T00:00',
    endDate: '2026-11-20T23:59',
    status: 'Active',
    categoryLink: '/shop?category=electronics',
    createdAt: '2026-10-05T14:30',
    updatedAt: '2026-10-06T10:15',
  },
  {
    id: 'fs-4',
    productId: 'prod-hmk-1',
    productName: 'Instant Pot Duo 7-in-1 Multi-Use Electric Pressure Cooker',
    brand: 'INSTANT POT',
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=800&auto=format&fit=crop',
    originalPrice: 12999,
    flashSalePrice: 7999,
    discountPercentage: 38,
    startDate: '2026-10-06T00:00',
    endDate: '2026-11-20T23:59',
    status: 'Active',
    categoryLink: '/shop?category=home-kitchen',
    createdAt: '2026-10-05T14:30',
    updatedAt: '2026-10-06T10:15',
  },
];

export function getFlashSales(): FlashSaleItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('prestodental_flash_sales_items_v2');
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return INITIAL_FLASH_SALE_ITEMS;
}

export function saveFlashSales(items: FlashSaleItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('buybright_flash_sales_updated'));
    window.dispatchEvent(new Event('prestodental_flash_sales_updated'));
  } catch {
    // fallback
  }
}
