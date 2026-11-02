/**
 * BuyBright Admin — Shipping Charges Slab Configuration Form.
 * Clean multi-row form with only Bill From, Bill To, Shipping Charges, and +/- buttons.
 */

import React, { useState, useEffect } from 'react';
import { useToast } from '../../../context/ToastContext';
import '../../../styles/admin-shipping-charges.scss';
import {
  getShippingCharges,
  saveShippingChargesList,
  defaultShippingRules,
  type ShippingChargeRule,
} from '../../data/shippingData';

export interface ShippingSlabItem {
  id: string;
  billFrom: string | number;
  billTo: string | number;
  shippingCharge: string | number;
}

export interface ShippingChargeFormProps {
  initialSlabs?: ShippingSlabItem[];
  onSaveSuccess?: () => void;
}

export const ShippingChargeForm: React.FC<ShippingChargeFormProps> = ({
  initialSlabs,
  onSaveSuccess,
}) => {
  const { showToast } = useToast();
  const [slabs, setSlabs] = useState<ShippingSlabItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize slabs from localStorage or initial props
  useEffect(() => {
    if (initialSlabs && initialSlabs.length > 0) {
      setSlabs(initialSlabs);
      return;
    }

    const existing = getShippingCharges();
    if (existing && existing.length > 0) {
      setSlabs(
        existing.map((item) => ({
          id: item.id || `slab-${Date.now()}-${Math.random()}`,
          billFrom: item.billFrom,
          billTo: item.billTo,
          shippingCharge: item.shippingCharge,
        }))
      );
    } else {
      setSlabs([
        { id: 'slab-1', billFrom: 0, billTo: 999, shippingCharge: 99 },
        { id: 'slab-2', billFrom: 1000, billTo: 2499, shippingCharge: 49 },
        { id: 'slab-3', billFrom: 2500, billTo: 4999, shippingCharge: 29 },
        { id: 'slab-4', billFrom: 5000, billTo: 999999, shippingCharge: 0 },
      ]);
    }
  }, [initialSlabs]);

  // Update a specific field in a slab row
  const handleFieldChange = (index: number, field: keyof ShippingSlabItem, value: string) => {
    setSlabs((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Add a new row directly below the clicked row
  const handleAddRow = (index: number) => {
    const currentSlab = slabs[index];
    const currentTo = Number(currentSlab?.billTo) || 0;
    const nextFrom = currentTo > 0 && currentTo < 999999 ? currentTo + 1 : 0;
    const nextTo = nextFrom > 0 ? nextFrom + 999 : 999;

    const newRow: ShippingSlabItem = {
      id: `slab-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      billFrom: nextFrom,
      billTo: nextTo,
      shippingCharge: 0,
    };

    setSlabs((prev) => {
      const updated = [...prev];
      updated.splice(index + 1, 0, newRow);
      return updated;
    });
  };

  // Remove a row
  const handleRemoveRow = (index: number) => {
    if (slabs.length <= 1) {
      showToast('At least one shipping charge slab is required.', 'warning');
      return;
    }
    setSlabs((prev) => prev.filter((_, i) => i !== index));
  };

  // Reset to system default shipping rules
  const handleResetDefaults = () => {
    setSlabs(
      defaultShippingRules.map((item) => ({
        id: item.id,
        billFrom: item.billFrom,
        billTo: item.billTo,
        shippingCharge: item.shippingCharge,
      }))
    );
    showToast('Reset to default shipping slabs.', 'info');
  };

  // Validate and Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (slabs.length === 0) {
      showToast('Please add at least one shipping slab.', 'warning');
      return;
    }

    // Validate fields
    for (let i = 0; i < slabs.length; i++) {
      const row = slabs[i];
      const from = Number(row.billFrom);
      const to = Number(row.billTo);
      const charge = Number(row.shippingCharge);

      if (row.billFrom === '' || isNaN(from) || from < 0) {
        showToast(`Row #${i + 1}: Please enter a valid Bill From amount (>= 0).`, 'danger');
        return;
      }
      if (row.billTo === '' || isNaN(to) || to <= 0) {
        showToast(`Row #${i + 1}: Please enter a valid Bill To amount (> 0).`, 'danger');
        return;
      }
      if (to <= from) {
        showToast(`Row #${i + 1}: Bill To must be strictly greater than Bill From.`, 'danger');
        return;
      }
      if (row.shippingCharge === '' || isNaN(charge) || charge < 0) {
        showToast(`Row #${i + 1}: Shipping Charge must be 0 or a positive amount.`, 'danger');
        return;
      }
    }

    setIsSaving(true);
    const now = new Date().toLocaleString('en-IN');
    const rulesToSave: ShippingChargeRule[] = slabs.map((slab, idx) => ({
      id: slab.id || `ship-${idx + 1}`,
      title: Number(slab.shippingCharge) === 0 ? 'Free Shipping' : `Tier ${idx + 1} Delivery`,
      billFrom: Number(slab.billFrom),
      billTo: Number(slab.billTo),
      shippingCharge: Number(slab.shippingCharge),
      status: 'Active',
      createdAt: now,
      updatedAt: now,
    }));

    saveShippingChargesList(rulesToSave);
    setIsSaving(false);
    showToast('Shipping charges updated successfully.', 'success');

    if (onSaveSuccess) {
      onSaveSuccess();
    }
  };

  return (
    <form className="shipping-charge-form-card" onSubmit={handleSave}>
      <div className="shipping-form-header">
        <div className="shipping-header-title">
          <i className="fa-solid fa-truck-fast text-teal mr-2" />
          <span>Shipping Charges Slabs</span>
        </div>
      </div>

      <div className="shipping-slabs-table-container">
        <table className="shipping-slabs-table">
          <thead>
            <tr>
              <th style={{ width: '70px', textAlign: 'center' }}>SR. NO.</th>
              <th>BILL FROM</th>
              <th>BILL TO</th>
              <th>SHIPPING CHARGES</th>
              <th style={{ width: '120px', textAlign: 'center' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {slabs.map((slab, index) => (
              <tr key={slab.id}>
                <td style={{ textAlign: 'center' }}>
                  <span className="slab-index-badge">#{index + 1}</span>
                </td>
                <td>
                  <div className="shipping-input-group">
                    <span className="currency-prefix">₹</span>
                    <input
                      type="number"
                      min="0"
                      className="shipping-form-input"
                      value={slab.billFrom}
                      onChange={(e) => handleFieldChange(index, 'billFrom', e.target.value)}
                      placeholder="0"
                      required
                    />
                  </div>
                </td>
                <td>
                  <div className="shipping-input-group">
                    <span className="currency-prefix">₹</span>
                    <input
                      type="number"
                      min="0"
                      className="shipping-form-input"
                      value={slab.billTo}
                      onChange={(e) => handleFieldChange(index, 'billTo', e.target.value)}
                      placeholder="999"
                      required
                    />
                  </div>
                </td>
                <td>
                  <div className="shipping-input-group">
                    <span className="currency-prefix">₹</span>
                    <input
                      type="number"
                      min="0"
                      className="shipping-form-input"
                      value={slab.shippingCharge}
                      onChange={(e) => handleFieldChange(index, 'shippingCharge', e.target.value)}
                      placeholder="0"
                      required
                    />
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <div className="slab-action-btns">
                    <button
                      type="button"
                      className="btn-slab-action btn-add"
                      onClick={() => handleAddRow(index)}
                      title="Add Slab"
                    >
                      <i className="fa-solid fa-plus" />
                    </button>
                    <button
                      type="button"
                      className="btn-slab-action btn-remove"
                      onClick={() => handleRemoveRow(index)}
                      title="Remove Slab"
                      disabled={slabs.length <= 1}
                    >
                      <i className="fa-solid fa-minus" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="shipping-form-footer">
        <button
          type="button"
          className="btn-shipping-reset"
          onClick={handleResetDefaults}
        >
          <i className="fa-solid fa-rotate-left mr-1" /> Reset Defaults
        </button>
        <button
          type="submit"
          className="btn-shipping-submit"
          disabled={isSaving}
        >
          <i className="fa-solid fa-check mr-1" />
          {isSaving ? 'Saving...' : 'Save Shipping Charges'}
        </button>
      </div>
    </form>
  );
};

export default ShippingChargeForm;
