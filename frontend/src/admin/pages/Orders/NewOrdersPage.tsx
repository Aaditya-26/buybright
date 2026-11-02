/**
 * BuyBright Admin — New Orders Placed.
 * Route: /admin/orders/new (or /admin/orders/placed)
 */

import React from 'react';
import { OrderMgmtView } from './OrderMgmtView';

export const NewOrdersPage: React.FC = () => {
  return (
    <OrderMgmtView
      stageTitle="New Orders Placed"
      stageSubtitle="Newly submitted procurement orders requiring verification and warehouse picking allocation"
      filterStatus="Placed"
      activeNavTab="placed"
    />
  );
};
