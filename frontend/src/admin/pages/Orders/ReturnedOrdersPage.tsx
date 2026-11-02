/**
 * BuyBright Admin — Orders Returned.
 * Route: /admin/orders/returned
 */

import React from 'react';
import { OrderMgmtView } from './OrderMgmtView';

export const ReturnedOrdersPage: React.FC = () => {
  return (
    <OrderMgmtView
      stageTitle="Orders Returned"
      stageSubtitle="Return material authorizations (RMA), reverse transit logistics, and product batch replacements"
      filterStatus="Returned"
      activeNavTab="returned"
    />
  );
};
