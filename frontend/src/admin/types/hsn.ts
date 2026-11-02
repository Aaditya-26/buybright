/**
 * BuyBright Admin — HSN Code Types.
 * Harmonized System of Nomenclature for goods taxation and invoice reporting.
 */

export interface AdminHSNCode {
  id: string;
  hsnCode: string;          // e.g. "33074100" or "90184900"
  description: string;      // e.g. "Equipment / Incense Sticks"
  gstRateId?: string;       // id of mapped GST Rate or empty
  gstRateLabel?: string;    // cached or derived rate label (e.g. "Standard Rate – 18%")
  totalGst?: number;        // total percentage e.g. 18
  cgst?: number;            // 50% of GST e.g. 9
  sgst?: number;            // 50% of GST e.g. 9
  igst?: number;            // equal to GST % e.g. 18
  status: 'Active' | 'Inactive';
  createdAt?: string;
  updatedAt?: string;
}
