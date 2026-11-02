/**
 * BuyBright Admin — Shipping Charges Data Engine & Persistence.
 * Manages tiered delivery charges based on order bill amount ranges:
 * - Bill From (₹)
 * - Bill To (₹)
 * - Shipping Charges (₹)
 */

export interface ShippingChargeRule {
  id: string;
  title: string;
  billFrom: number;
  billTo: number;
  shippingCharge: number;
  status: 'Active' | 'Inactive';
  estimatedDelivery?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'prestodental_shipping_charges';

export const defaultShippingRules: ShippingChargeRule[] = [
  {
    id: 'ship-101',
    title: 'Standard Tier 1 Delivery',
    billFrom: 0,
    billTo: 999,
    shippingCharge: 99,
    status: 'Active',
    estimatedDelivery: '2 - 3 Business Days',
    description: 'Standard courier delivery charges for orders below ₹1,000.',
    createdAt: '10 Jan 2026, 10:00 AM',
    updatedAt: '15 Feb 2026, 04:30 PM',
  },
  {
    id: 'ship-102',
    title: 'Subsidized Clinic Freight',
    billFrom: 1000,
    billTo: 2499,
    shippingCharge: 49,
    status: 'Active',
    estimatedDelivery: '2 - 3 Business Days',
    description: 'Subsidized express delivery charges for mid-volume clinic orders.',
    createdAt: '12 Jan 2026, 11:30 AM',
    updatedAt: '18 Feb 2026, 02:15 PM',
  },
  {
    id: 'ship-103',
    title: 'Nominal Logistics Slab',
    billFrom: 2500,
    billTo: 4999,
    shippingCharge: 29,
    status: 'Active',
    estimatedDelivery: '1 - 2 Business Days',
    description: 'Nominal fulfillment fee for high-volume orders up to ₹5,000.',
    createdAt: '15 Jan 2026, 09:45 AM',
    updatedAt: '20 Feb 2026, 05:20 PM',
  },
  {
    id: 'ship-104',
    title: 'Free Express Shipping (Orders ₹5k+)',
    billFrom: 5000,
    billTo: 999999,
    shippingCharge: 0,
    status: 'Active',
    estimatedDelivery: 'Priority Next-Day Dispatch',
    description: 'Free logistics & insurance coverage for all bulk clinic orders.',
    createdAt: '18 Jan 2026, 08:00 AM',
    updatedAt: '22 Feb 2026, 01:10 PM',
  },
];

/**
 * Retrieve all shipping charge rules from localStorage or default dataset.
 */
export const getShippingCharges = (): ShippingChargeRule[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultShippingRules));
      return defaultShippingRules;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading shipping charges from localStorage:', err);
    return defaultShippingRules;
  }
};

/**
 * Save all shipping rules to localStorage and dispatch custom update event.
 */
export const saveShippingChargesList = (list: ShippingChargeRule[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('prestodental_shipping_updated', { detail: list }));
  } catch (err) {
    console.error('Error persisting shipping charges to localStorage:', err);
  }
};

/**
 * Add or update an individual shipping charge rule.
 */
export const upsertShippingCharge = (
  ruleData: Omit<ShippingChargeRule, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
): ShippingChargeRule => {
  const current = getShippingCharges();
  const now = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  if (ruleData.id) {
    // Update existing rule
    const updatedList = current.map((item) => {
      if (item.id === ruleData.id) {
        return {
          ...item,
          ...ruleData,
          id: ruleData.id,
          updatedAt: now,
        } as ShippingChargeRule;
      }
      return item;
    });
    saveShippingChargesList(updatedList);
    return updatedList.find((it) => it.id === ruleData.id)!;
  }

  // Create new rule
  const newRule: ShippingChargeRule = {
    ...ruleData,
    id: `ship-${Date.now().toString().slice(-4)}`,
    createdAt: now,
    updatedAt: now,
  };
  const updatedList = [newRule, ...current];
  saveShippingChargesList(updatedList);
  return newRule;
};

/**
 * Delete a shipping rule by ID.
 */
export const deleteShippingCharge = (id: string): ShippingChargeRule[] => {
  const current = getShippingCharges();
  const filtered = current.filter((it) => it.id !== id);
  saveShippingChargesList(filtered);
  return filtered;
};

/**
 * Toggle active/inactive status of a shipping rule.
 */
export const toggleShippingChargeStatus = (id: string): ShippingChargeRule[] => {
  const current = getShippingCharges();
  const updated = current.map((it) => {
    if (it.id === id) {
      return {
        ...it,
        status: it.status === 'Active' ? ('Inactive' as const) : ('Active' as const),
        updatedAt: new Date().toLocaleString('en-IN'),
      };
    }
    return it;
  });
  saveShippingChargesList(updated);
  return updated;
};

/**
 * Reset shipping rules to system factory defaults.
 */
export const resetShippingCharges = (): ShippingChargeRule[] => {
  saveShippingChargesList(defaultShippingRules);
  return defaultShippingRules;
};

/**
 * Calculate applicable delivery charge for a given cart subtotal.
 */
export const calculateApplicableShippingCharge = (cartTotal: number): number => {
  const rules = getShippingCharges().filter((r) => r.status === 'Active');
  const matched = rules.find((r) => cartTotal >= r.billFrom && cartTotal <= r.billTo);
  if (matched) return matched.shippingCharge;
  // If cart total exceeds highest tier, default to 0 (free shipping)
  if (cartTotal >= 5000) return 0;
  return 99;
};
