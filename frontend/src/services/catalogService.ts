/**
 * BuyBright Marketplace Catalog Service
 * Central service interface for Categories, Products, and Featured Collections.
 */

import { dentalService } from './dentalService';

export const catalogService = dentalService;
export default catalogService;
export * from './dentalService';

