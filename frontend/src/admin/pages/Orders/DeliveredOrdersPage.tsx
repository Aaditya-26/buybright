/**
 * BuyBright Admin — Orders Delivered.
 * Route: /admin/orders/delivered
 */

import React from 'react';
import { OrderMgmtView } from './OrderMgmtView';

export const DeliveredOrdersPage: React.FC = () => {
  return (
    <OrderMgmtView
      stageTitle="Orders Delivered"
      stageSubtitle="Successfully delivered customer consignments with verified recipient acknowledgements"
      filterStatus="Delivered"
      activeNavTab="delivered"
    />
  );
};
