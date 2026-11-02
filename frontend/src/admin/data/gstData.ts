/**
 * BuyBright Admin — GST Rates Mock Data & LocalStorage Store.
 * Centralized taxation rates for India GST compliance with auto CGST/SGST/IGST breakdown.
 */

import type { AdminGSTRate } from '../types/gst';

export const initialGSTRatesData: AdminGSTRate[] = [
  {
    id: 'gst-0',
    rateLabel: 'Nil Rated – 0%',
    totalGst: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    description: 'Essential goods, healthcare exemptions, and organicsupplies',
    status: 'Active',
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'gst-5',
    rateLabel: 'Concessional Rate – 5%',
    totalGst: 5,
    cgst: 2.5,
    sgst: 2.5,
    igst: 5,
    description: 'Select medical drugs, diagnostic formulations, and basic dental consumables',
    status: 'Active',
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'gst-12',
    rateLabel: 'Medical & Diagnostic Rate – 12%',
    totalGst: 12,
    cgst: 6,
    sgst: 6,
    igst: 12,
    description: 'Medical devices, dental handpieces, ultrasonic scalers, curing lights',
    status: 'Active',
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'gst-18',
    rateLabel: 'Standard Rate – 18%',
    totalGst: 18,
    cgst: 9,
    sgst: 9,
    igst: 18,
    description: 'Standard goods — electronics, garments, rotary NiTi files, composite restoratives',
    status: 'Active',
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'gst-28',
    rateLabel: 'Luxury & Premium Goods – 28%',
    totalGst: 28,
    cgst: 14,
    sgst: 14,
    igst: 28,
    description: 'High-end specialized CAD/CAM milling units,aesthetic lasers',
    status: 'Active',
    createdAt: '2026-01-15T00:00:00Z',
  },
];

const GST_STORAGE_KEY = 'prestodental_admin_gst_rates_v1';

export function getGSTRates(): AdminGSTRate[] {
  try {
    const raw = localStorage.getItem(GST_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AdminGSTRate[];
  } catch {
    // fallback to initial
  }
  return initialGSTRatesData;
}

export function saveGSTRates(rates: AdminGSTRate[]): void {
  try {
    localStorage.setItem(GST_STORAGE_KEY, JSON.stringify(rates));
  } catch {
    // silent fail
  }
}

export function getGSTRateById(id: string): AdminGSTRate | null {
  return getGSTRates().find((r) => r.id === id) ?? null;
}
