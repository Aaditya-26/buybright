/**
 * BuyBright Admin — Orders Gateway.
 * Redirects to New Orders Placed (/admin/orders/new).
 */

import React from 'react';
import { Navigate } from 'react-router-dom';

export const OrderList: React.FC = () => {
  return <Navigate to="/admin/orders/new" replace />;
};
