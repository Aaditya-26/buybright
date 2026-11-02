/**
 * BuyBright Admin — Orders Ready to Pick.
 * Route: /admin/orders/ready-to-pick
 */

import React from 'react';
import { OrderMgmtView } from './OrderMgmtView';

export const ReadyToPickOrdersPage: React.FC = () => {
  return (
    <OrderMgmtView
      stageTitle="Orders Ready to Pick"
      stageSubtitle="Packed and hermetically sealed dental shipments staged for courier dispatch handover"
      filterStatus="Ready to Pick"
      activeNavTab="ready-to-pick"
    />
  );
};
