/**
 * BuyBright Admin — Orders In Process.
 * Route: /admin/orders/in-process
 */

import React from 'react';
import { OrderMgmtView } from './OrderMgmtView';

export const InProcessOrdersPage: React.FC = () => {
  return (
    <OrderMgmtView
      stageTitle="Orders In Process"
      stageSubtitle="Orders currently being processed, batch-inspected, and staged in central pharmacy fulfillment"
      filterStatus="In Process"
      activeNavTab="in-process"
    />
  );
};
