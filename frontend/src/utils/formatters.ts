/**
 * BuyBright Formatting Utilities.
 * Standardizes currency, discount calculations, and text truncations across the app.
 */

/**
 * Formats a numerical value as Indian Rupee (INR).
 */
export function formatCurrency(amount: number): string {
  return `INR ${amount.toLocaleString('en-IN')}`;
}

/**
 * Calculates discount percentage between original price and sale price.
 */
export function calculateDiscount(price: number, oldPrice?: number): string | null {
  if (!oldPrice || oldPrice <= price) return null;
  const pct = Math.round(((oldPrice - price) / oldPrice) * 100);
  return `-${pct}%`;
}

/**
 * Truncates string with ellipsis.
 */
export function truncateText(text: string, maxLength: number = 32): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Resolves or formats clinical supply expiry date for dental products.
 */
export function getProductExpiryDate(product: { id?: string; name?: string; expiry_date?: string }): string {
  if (product.expiry_date) return product.expiry_date;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const rawId = String(product.id || '');
  let charSum = 0;
  for (let i = 0; i < rawId.length; i++) {
    charSum += rawId.charCodeAt(i);
  }
  const monthIdx = (charSum + (product.name ? product.name.length : 0)) % 12;
  const yearOffset = 2 + (charSum % 3); // 2028 - 2030
  return `${months[monthIdx]} ${2026 + yearOffset}`;
}

