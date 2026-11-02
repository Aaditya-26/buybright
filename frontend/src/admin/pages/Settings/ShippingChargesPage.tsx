/**
 * BuyBright Admin — Shipping Charges Management Module.
 * Displays only the multi-row Shipping Charge form with Bill From, Bill To, Shipping Charges, and +/- buttons.
 */

import React from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { ShippingChargeForm } from './ShippingChargeForm';

export const ShippingChargesPage: React.FC = () => {
  return (
    <AdminLayout
      title="Shipping Charges"
      subtitle="Configure delivery fee slabs based on bill amount ranges."
    >
      <div className="shipping-charges-page-content">
        <ShippingChargeForm />
      </div>
    </AdminLayout>
  );
};

export default ShippingChargesPage;
