/**
 * BuyBright Admin — Orders Cancelled.
 * Route: /admin/orders/cancelled
 */

import React from 'react';
import { OrderMgmtView } from './OrderMgmtView';

export const CancelledOrdersPage: React.FC = () => {
  return (
    <OrderMgmtView
      stageTitle="Orders Cancelled"
      stageSubtitle="Cancelled procurement requests, automated inventory rollbacks, and payment refund processing"
      filterStatus="Cancelled"
      activeNavTab="cancelled"
    />
  );
};
