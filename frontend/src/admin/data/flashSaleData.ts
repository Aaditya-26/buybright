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

const STORAGE_KEY = 'prestodental_flash_sales_items_v2';

export const INITIAL_FLASH_SALE_ITEMS: FlashSaleItem[] = [
  {
    id: 'fs-1',
    productId: 'prod-2',
    productName: 'Superendo Gold Rotary NiTi Files (Pack of 6)',
    brand: 'SUPERENDO',
    image: '/images/cat_endodontic_1787401934680.jpg',
    originalPrice: 1699,
    flashSalePrice: 1299,
    discountPercentage: 24,
    startDate: '2026-10-06T00:00',
    endDate: '2026-10-15T23:59',
    status: 'Active',
    categoryLink: '/shop?category=endodontics',
    heading: 'Refresh Your Space',
    shortDescription: 'Modern clinical essentials for a calmer, happier operatory.',
    buttonName: 'Shop Operatory',
    createdAt: '2026-10-05T14:30',
    updatedAt: '2026-10-06T10:15',
  },
  {
    id: 'fs-2',
    productId: 'prod-8',
    productName: 'Waldent FlexiShield Dam Sheets Box of 36',
    brand: 'WALDENT',
    image: '/images/cat_consumables_1787401910059.jpg',
    originalPrice: 1800,
    flashSalePrice: 699,
    discountPercentage: 61,
    startDate: '2026-10-06T00:00',
    endDate: '2026-10-15T23:59',
    status: 'Active',
    categoryLink: '/shop?category=consumables',
    heading: 'Glow Naturally',
    shortDescription: 'Dental restoratives & care that loves every smile back.',
    buttonName: 'Shop Beauty',
    createdAt: '2026-10-05T14:30',
    updatedAt: '2026-10-06T10:15',
  },
  {
    id: 'fs-3',
    productId: 'prod-3',
    productName: 'Woodpecker iLed Plus 1-Sec Curing Light',
    brand: 'WOODPECKER',
    image: '/images/cat_handpieces_1787401976899.jpg',
    originalPrice: 12999,
    flashSalePrice: 7899,
    discountPercentage: 39,
    startDate: '2026-10-06T00:00',
    endDate: '2026-10-15T23:59',
    status: 'Active',
    categoryLink: '/shop?category=equipment',
    createdAt: '2026-10-05T14:30',
    updatedAt: '2026-10-06T10:15',
  },
  {
    id: 'fs-4',
    productId: 'prod-1',
    productName: '3M Filtek Z350 XT Universal Restorative Composite',
    brand: '3M ESPE',
    image: '/images/cat_materials_1787401998270.jpg',
    originalPrice: 4599,
    flashSalePrice: 2899,
    discountPercentage: 37,
    startDate: '2026-10-06T00:00',
    endDate: '2026-10-15T23:59',
    status: 'Active',
    categoryLink: '/shop?category=materials',
    createdAt: '2026-10-05T14:30',
    updatedAt: '2026-10-06T10:15',
  },
  {
    id: 'fs-5',
    productId: 'prod-9',
    productName: 'Dentsply AH Plus Bioceramic Root Canal Sealer Paste Syringe',
    brand: 'Dentsply Sirona',
    image: '/images/cat_endodontic_1787401934680.jpg',
    originalPrice: 4100,
    flashSalePrice: 3450,
    discountPercentage: 16,
    startDate: '2026-10-06T00:00',
    endDate: '2026-10-15T23:59',
    status: 'Inactive',
    categoryLink: '/shop?category=endodontics',
    createdAt: '2026-10-06T11:00',
    updatedAt: '2026-10-06T11:00',
  },
  {
    id: 'fs-6',
    productId: 'se-2',
    productName: 'Superendo Pro-Apex 5th Gen Multi-Frequency Apex Locator',
    brand: 'SUPERENDO',
    image: '/images/cat_handpieces_1787401976899.jpg',
    originalPrice: 8200,
    flashSalePrice: 4899,
    discountPercentage: 40,
    startDate: '2026-10-06T00:00',
    endDate: '2026-10-15T23:59',
    status: 'Inactive',
    categoryLink: '/shop?category=equipment',
    createdAt: '2026-10-06T11:00',
    updatedAt: '2026-10-06T11:00',
  },
];

/** Retrieve all flash sale items from storage or defaults */
export const getFlashSales = (): FlashSaleItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read flash sale items from storage', err);
  }
  return INITIAL_FLASH_SALE_ITEMS;
};

/** Save flash sale items to storage and trigger change event */
export const saveFlashSales = (items: FlashSaleItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('prestodental_flash_sales_updated'));
  } catch (err) {
    console.error('Failed to save flash sale items to storage', err);
  }
};

/** Retrieve currently active flash sale items for storefront */
export const getActiveFlashSales = (): FlashSaleItem[] => {
  const all = getFlashSales();
  const active = all.filter((i) => i.status === 'Active');
  return active.length > 0 ? active : all.slice(0, 4);
};
