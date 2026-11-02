/**
 * BuyBright Admin — GST Taxation Types.
 * Models GST tax rates, auto-split components (CGST, SGST, IGST), and status.
 */

export interface AdminGSTRate {
  id: string;
  rateLabel: string; // e.g. "Standard Rate – 18%"
  totalGst: number; // e.g. 18
  cgst: number; // 50% of totalGst, e.g. 9
  sgst: number; // 50% of totalGst, e.g. 9
  igst: number; // equal to totalGst, e.g. 18
  description?: string; // e.g. "Standard goods — electronics, garments"
  status: 'Active' | 'Inactive';
  createdAt?: string;
  updatedAt?: string;
}
