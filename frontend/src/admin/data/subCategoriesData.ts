/**
 * BuyBright Sub-Categories Mock Data and LocalStorage Persistence.
 * High-precision taxonomy for dental specialties and supplies.
 */

import type { AdminSubCategory } from '../types/product';

export const initialSubCategoriesData: AdminSubCategory[] = [
  {
    id: 'subcat-1',
    name: 'Rotary NiTi Files',
    slug: 'rotary-niti-files',
    parentCategoryId: 'cat-1',
    parentCategoryName: 'Endodontics',
    shortDescription: 'Heat-activated gold & blue rotary NiTi canal shaping files.',
    description: 'Gold-treated, heat-activated rotary and reciprocating NiTi files for root canal shaping.',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=400&q=80',
    totalProducts: 24,
    icon: 'fa-solid fa-tooth',
    displayOrder: 1,
    order: 1,
    showInMenu: true,
    showInFeatured: true,
    status: 'Active',
  },
  {
    id: 'subcat-2',
    name: 'Bioceramic Sealers & Cements',
    slug: 'bioceramic-sealers',
    parentCategoryId: 'cat-1',
    parentCategoryName: 'Endodontics',
    shortDescription: 'Premixed calcium silicate bioceramic root canal sealers.',
    description: 'Premixed bioceramic root canal sealers and MTA repair cements with high biocompatibility.',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=400&q=80',
    totalProducts: 12,
    icon: 'fa-solid fa-syringe',
    displayOrder: 2,
    order: 2,
    showInMenu: true,
    showInFeatured: false,
    status: 'Active',
  },
  {
    id: 'subcat-3',
    name: 'Endo Motors & Apex Locators',
    slug: 'endo-motors-apex-locators',
    parentCategoryId: 'cat-1',
    parentCategoryName: 'Endodontics',
    shortDescription: 'Brushless cordless endo motors with integrated apex locator.',
    description: 'Cordless endodontic motors with integrated multi-frequency apex locators.',
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=400&q=80',
    totalProducts: 6,
    icon: 'fa-solid fa-microchip',
    displayOrder: 3,
    order: 3,
    showInMenu: true,
    showInFeatured: true,
    status: 'Active',
  },
  {
    id: 'subcat-4',
    name: 'Universal Light-Cured Composites',
    slug: 'universal-composites',
    parentCategoryId: 'cat-7',
    parentCategoryName: 'Materials',
    shortDescription: 'Sub-micron anterior & posterior aesthetic restorative resin.',
    description: 'Nano-hybrid anterior and posterior composite resins with exceptional chameleon aesthetics.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80',
    totalProducts: 32,
    icon: 'fa-solid fa-wand-magic-sparkles',
    displayOrder: 1,
    order: 1,
    showInMenu: true,
    showInFeatured: true,
    status: 'Active',
  },
  {
    id: 'subcat-5',
    name: 'Glass Ionomer Cements (GIC)',
    slug: 'glass-ionomer-cements',
    parentCategoryId: 'cat-7',
    parentCategoryName: 'Materials',
    shortDescription: 'Self-cured & resin-modified fluoride releasing GIC.',
    description: 'Fluoride-releasing restorative and luting glass ionomer cements for pediatric and geriatric care.',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80',
    totalProducts: 18,
    icon: 'fa-solid fa-flask-vial',
    displayOrder: 2,
    order: 2,
    showInMenu: false,
    showInFeatured: false,
    status: 'Active',
  },
  {
    id: 'subcat-6',
    name: 'Dental Handpieces & Turbines',
    slug: 'handpieces-turbines',
    parentCategoryId: 'cat-3',
    parentCategoryName: 'Equipment',
    shortDescription: 'High-torque fiber optic air turbines & contra-angles.',
    description: 'High-speed fiber-optic air turbines and low-speed contra-angle micro-motor handpieces.',
    image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=400&q=80',
    totalProducts: 15,
    icon: 'fa-solid fa-gear',
    displayOrder: 1,
    order: 1,
    showInMenu: true,
    showInFeatured: true,
    status: 'Active',
  },
  {
    id: 'subcat-7',
    name: 'LED Curing Lights & Scalers',
    slug: 'curing-lights-scalers',
    parentCategoryId: 'cat-3',
    parentCategoryName: 'Equipment',
    shortDescription: 'Broad-band 1s fast-cure LED lights and ultrasonic scalers.',
    description: 'Wide-spectrum 1-second LED light curing units and piezo ultrasonic scalers.',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80',
    totalProducts: 19,
    icon: 'fa-solid fa-lightbulb',
    displayOrder: 2,
    order: 2,
    showInMenu: true,
    showInFeatured: false,
    status: 'Active',
  },
  {
    id: 'subcat-8',
    name: 'Orthodontic Brackets & Archwires',
    slug: 'orthodontic-brackets-archwires',
    parentCategoryId: 'cat-4',
    parentCategoryName: 'Orthodontics',
    shortDescription: 'Roth & MBT metal/ceramic brackets and superelastic NiTi wires.',
    description: 'Roth/MBT 0.022 metal and sapphire ceramic brackets with super-elastic NiTi archwires.',
    image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=400&q=80',
    totalProducts: 38,
    icon: 'fa-solid fa-teeth-open',
    displayOrder: 1,
    order: 1,
    showInMenu: true,
    showInFeatured: true,
    status: 'Active',
  },
  {
    id: 'subcat-9',
    name: 'Surgical Implant Fixtures',
    slug: 'implant-fixtures',
    parentCategoryId: 'cat-5',
    parentCategoryName: 'Implants',
    shortDescription: 'SLA surface Grade IV titanium dental implants & abutments.',
    description: 'SLA surface Grade 4 titanium dental implants with internal hex and conical connections.',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=400&q=80',
    totalProducts: 22,
    icon: 'fa-solid fa-screwdriver-wrench',
    displayOrder: 1,
    order: 1,
    showInMenu: true,
    showInFeatured: true,
    status: 'Active',
  },
  {
    id: 'subcat-10',
    name: 'A-Silicone & VPS Impression Putty',
    slug: 'vps-impression-putty',
    parentCategoryId: 'cat-6',
    parentCategoryName: 'Prosthodontics',
    shortDescription: 'Vinyl polysiloxane precision putty and light body wash.',
    description: 'Hydrophilic vinyl polysiloxane soft putty and light body wash for crown and bridge impressions.',
    image: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=400&q=80',
    totalProducts: 26,
    icon: 'fa-solid fa-mortar-pestle',
    displayOrder: 1,
    order: 1,
    showInMenu: true,
    showInFeatured: true,
    status: 'Active',
  },
];

const SUBCATEGORIES_STORAGE_KEY = 'prestodental_admin_subcategories_v1';

export function getSubCategories(): AdminSubCategory[] {
  try {
    const raw = localStorage.getItem(SUBCATEGORIES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AdminSubCategory[];
      return parsed.map((item) => {
        const init = initialSubCategoriesData.find((i) => i.id === item.id);
        return {
          ...item,
          image: item.image || init?.image || '',
          shortDescription: item.shortDescription || init?.shortDescription || '',
          showInMenu: item.showInMenu ?? init?.showInMenu ?? true,
          showInFeatured: item.showInFeatured ?? init?.showInFeatured ?? false,
        };
      });
    }
  } catch {
    // fallback
  }
  return initialSubCategoriesData;
}

export function saveSubCategories(subcategories: AdminSubCategory[]): void {
  try {
    localStorage.setItem(SUBCATEGORIES_STORAGE_KEY, JSON.stringify(subcategories));
  } catch {
    // silent fail
  }
}

export function getSubCategoryById(id: string): AdminSubCategory | null {
  return getSubCategories().find((sc) => sc.id === id) ?? null;
}
