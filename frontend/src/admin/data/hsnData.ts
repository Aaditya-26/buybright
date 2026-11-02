/**
 * BuyBright Admin — HSN Codes Mock Data & LocalStorage Store.
 * Centralized directory of Harmonized System Nomenclature codes with mapped GST rates.
 */

import type { AdminHSNCode } from '../types/hsn';
import { getGSTRates } from './gstData';

export const initialHSNCodesData: AdminHSNCode[] = [
  {
    id: 'hsn-1',
    hsnCode: '33074100',
    description: 'Equipment / Incense Sticks',
    gstRateId: 'gst-5',
    gstRateLabel: 'Concessional Rate – 5%',
    totalGst: 5,
    cgst: 2.5,
    sgst: 2.5,
    igst: 5,
    status: 'Active',
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'hsn-2',
    hsnCode: '90184900',
    description: 'Other dental instruments and appliances (burs, handpieces, elevators, forceps)',
    gstRateId: 'gst-12',
    gstRateLabel: 'Medical & Diagnostic Rate – 12%',
    totalGst: 12,
    cgst: 6,
    sgst: 6,
    igst: 12,
    status: 'Active',
    createdAt: '2026-01-12T00:00:00Z',
  },
  {
    id: 'hsn-3',
    hsnCode: '30064000',
    description: 'Dental cements and other dental fillings; bone reconstruction cements',
    gstRateId: 'gst-18',
    gstRateLabel: 'Standard Rate – 18%',
    totalGst: 18,
    cgst: 9,
    sgst: 9,
    igst: 18,
    status: 'Active',
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'hsn-4',
    hsnCode: '90212100',
    description: 'Artificial teeth manufactured from acrylic, polymers, or ceramics',
    gstRateId: 'gst-12',
    gstRateLabel: 'Medical & Diagnostic Rate – 12%',
    totalGst: 12,
    cgst: 6,
    sgst: 6,
    igst: 12,
    status: 'Active',
    createdAt: '2026-01-18T00:00:00Z',
  },
  {
    id: 'hsn-5',
    hsnCode: '34070010',
    description: 'Dental impression compounds, waxes, and elastomeric silicone pastes',
    gstRateId: 'gst-18',
    gstRateLabel: 'Standard Rate – 18%',
    totalGst: 18,
    cgst: 9,
    sgst: 9,
    igst: 18,
    status: 'Active',
    createdAt: '2026-01-20T00:00:00Z',
  },
  {
    id: 'hsn-6',
    hsnCode: '90221420',
    description: 'Dental X-ray apparatus, intra-oral sensors, and digital panoramic OPG units',
    gstRateId: 'gst-18',
    gstRateLabel: 'Standard Rate – 18%',
    totalGst: 18,
    cgst: 9,
    sgst: 9,
    igst: 18,
    status: 'Active',
    createdAt: '2026-01-22T00:00:00Z',
  },
];

const HSN_STORAGE_KEY = 'prestodental_admin_hsn_codes_v1';

export function getHSNCodes(): AdminHSNCode[] {
  try {
    const raw = localStorage.getItem(HSN_STORAGE_KEY);
    if (raw) {
      const stored = JSON.parse(raw) as AdminHSNCode[];
      // Sync up with latest GST rates if any rates were updated
      const gstRates = getGSTRates();
      return stored.map((item) => {
        if (item.gstRateId) {
          const matchedGst = gstRates.find((g) => g.id === item.gstRateId);
          if (matchedGst) {
            return {
              ...item,
              gstRateLabel: matchedGst.rateLabel,
              totalGst: matchedGst.totalGst,
              cgst: matchedGst.cgst,
              sgst: matchedGst.sgst,
              igst: matchedGst.igst,
            };
          }
        }
        return item;
      });
    }
  } catch {
    // fallback
  }
  return initialHSNCodesData;
}

export function saveHSNCodes(codes: AdminHSNCode[]): void {
  try {
    localStorage.setItem(HSN_STORAGE_KEY, JSON.stringify(codes));
  } catch {
    // silent fail
  }
}

export function getHSNCodeById(id: string): AdminHSNCode | null {
  return getHSNCodes().find((h) => h.id === id) ?? null;
}
