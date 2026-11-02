/**
 * BuyBright Admin — Orders Out for Delivery.
 * Route: /admin/orders/out-for-delivery
 */

import React from 'react';
import { OrderMgmtView } from './OrderMgmtView';

export const OutForDeliveryOrdersPage: React.FC = () => {
  return (
    <OrderMgmtView
      stageTitle="Orders Out for Delivery"
      stageSubtitle="Shipments actively in transit with partner air & ground carriers with live AWB tracking"
      filterStatus="Out for Delivery"
      activeNavTab="out-for-delivery"
    />
  );
};
