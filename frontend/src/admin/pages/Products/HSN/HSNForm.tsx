/**
 * BuyBright Admin — HSN Code Form Page (Create / Edit).
 * Manage 8-digit HSN code with linked GST tax slab and real-time CGST/SGST/IGST breakdown.
 * Route: /admin/products/hsn/create & /admin/products/hsn/edit/:id
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { getHSNCodes, saveHSNCodes, getHSNCodeById } from '../../../data/hsnData';
import { getGSTRates } from '../../../data/gstData';
import type { AdminHSNCode } from '../../../types/hsn';
import type { AdminGSTRate } from '../../../types/gst';
import { useToast } from '../../../../context/ToastContext';

interface HSNFormState {
  hsnCode: string;
  description: string;
  gstRateId: string;
  status: 'Active' | 'Inactive';
}

export const HSNForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const { showToast } = useToast();

  const [gstRates] = useState<AdminGSTRate[]>(() => getGSTRates());

  const [form, setForm] = useState<HSNFormState>({
    hsnCode: '',
    description: '',
    gstRateId: '',
    status: 'Active',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      const existing = getHSNCodeById(id);
      if (existing) {
        setForm({
          hsnCode: existing.hsnCode,
          description: existing.description,
          gstRateId: existing.gstRateId || '',
          status: existing.status,
        });
      } else {
        showToast('HSN Code not found.', 'danger');
        navigate('/admin/products/hsn');
      }
    }
  }, [id, isEdit, navigate, showToast]);

  const selectedGstRate = useMemo(() => {
    if (!form.gstRateId) return null;
    return gstRates.find((r) => r.id === form.gstRateId) || null;
  }, [form.gstRateId, gstRates]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.hsnCode.trim()) {
      errs.hsnCode = 'HSN Code is required';
    } else if (!/^[0-9]{2,8}$/.test(form.hsnCode.trim())) {
      errs.hsnCode = 'HSN Code must be 2 to 8 digits numeric';
    }

    if (!form.description.trim()) {
      errs.description = 'Description is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the validation errors before saving.', 'danger');
      return;
    }

    setIsSubmitting(true);
    const existingCodes = getHSNCodes();

    const payload: AdminHSNCode = {
      id: isEdit && id ? id : `hsn-${Date.now()}`,
      hsnCode: form.hsnCode.trim(),
      description: form.description.trim(),
      gstRateId: form.gstRateId || undefined,
      gstRateLabel: selectedGstRate?.rateLabel || undefined,
      totalGst: selectedGstRate?.totalGst,
      cgst: selectedGstRate?.cgst,
      sgst: selectedGstRate?.sgst,
      igst: selectedGstRate?.igst,
      status: form.status,
      updatedAt: new Date().toISOString(),
      createdAt: isEdit ? existingCodes.find((h) => h.id === id)?.createdAt : new Date().toISOString(),
    };

    if (isEdit && id) {
      const updated = existingCodes.map((h) => (h.id === id ? payload : h));
      saveHSNCodes(updated);
      showToast(`HSN Code "${form.hsnCode}" updated successfully!`, 'success');
    } else {
      saveHSNCodes([...existingCodes, payload]);
      showToast(`HSN Code "${form.hsnCode}" created successfully!`, 'success');
    }

    setIsSubmitting(false);
    navigate('/admin/products/hsn');
  };

  return (
    <AdminLayout
      title={isEdit ? `Edit HSN Code: ${form.hsnCode}` : 'Add HSN Code'}
      subtitle="Configure Harmonized System of Nomenclature code with mapped central & state GST breakdown"
    >
      {/* ── Top Bar & Breadcrumbs ── */}
      <div className="gst-top-bar">
        <div className="gst-breadcrumbs">
          <Link to="/admin/products">Products</Link>
          <span className="breadcrumb-sep">/</span>
          <Link to="/admin/products/hsn">HSN Codes</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{isEdit ? 'Edit' : 'Create'}</span>
        </div>
        <button
          type="button"
          className="btn-admin-outline"
          onClick={() => navigate('/admin/products/hsn')}
        >
          <i className="fa-solid fa-arrow-left" /> Back to HSN Codes
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-card hsn-form-card">
          <div className="gst-card-header">
            <i className="fa-solid fa-barcode" />
            <h3>HSN Code Details</h3>
          </div>

          <div className="gst-form-stack">
            {/* Row 1: HSN Code & Status */}
            <div className="gst-form-row-2col">
              <div>
                <label className="gst-field-label">
                  HSN Code <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="hsnCode"
                  value={form.hsnCode}
                  onChange={handleChange}
                  placeholder="e.g. 33074100"
                  maxLength={8}
                  className="form-control"
                />
                <div className="gst-input-help">e.g. 33074100 (4 to 8 digits)</div>
                {errors.hsnCode && <span className="gst-field-error">{errors.hsnCode}</span>}
              </div>

              <div>
                <label className="gst-field-label">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Row 2: Description */}
            <div>
              <label className="gst-field-label">
                Description <span className="required">*</span>
              </label>
              <textarea
                name="description"
                rows={3}
                value={form.description}
                onChange={handleChange}
                placeholder="e.g. Equipment / Incense Sticks"
                className="form-control"
              />
              <div className="gst-input-help">e.g. Equipment / Incense Sticks</div>
              {errors.description && <span className="gst-field-error">{errors.description}</span>}
            </div>

            {/* Row 3: Mapped GST Rate */}
            <div>
              <label className="gst-field-label">
                Mapped GST Rate
              </label>
              <select
                name="gstRateId"
                value={form.gstRateId}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">— Select GST Rate (optional) —</option>
                {gstRates.map((rate) => (
                  <option key={rate.id} value={rate.id}>
                    {rate.rateLabel} ({rate.totalGst}%)
                  </option>
                ))}
              </select>
              <div className="gst-input-help">Link this HSN code to a predefined GST tax rate slab</div>
            </div>

            {/* Row 4: CGST / SGST / IGST (Auto) Breakdown */}
            <div>
              <label className="gst-field-label">
                CGST / SGST / IGST (Auto)
              </label>

              {!selectedGstRate ? (
                <div className="hsn-no-gst-hint">
                  <i className="fa-solid fa-circle-info" />
                  <span>Select a GST Rate above to see breakdown</span>
                </div>
              ) : (
                <div className="gst-form-row-3col">
                  <div>
                    <label className="gst-field-label">
                      CGST (%) (Auto)
                    </label>
                    <div className="gst-readonly-wrap">
                      <input
                        type="text"
                        value={`${selectedGstRate.cgst}%`}
                        readOnly
                        disabled
                        className="form-control gst-readonly-input"
                      />
                      <span className="gst-pill-badge cgst">Central</span>
                    </div>
                    <div className="gst-input-help">50% of GST</div>
                  </div>

                  <div>
                    <label className="gst-field-label">
                      SGST (%) (Auto)
                    </label>
                    <div className="gst-readonly-wrap">
                      <input
                        type="text"
                        value={`${selectedGstRate.sgst}%`}
                        readOnly
                        disabled
                        className="form-control gst-readonly-input"
                      />
                      <span className="gst-pill-badge sgst">State</span>
                    </div>
                    <div className="gst-input-help">50% of GST</div>
                  </div>

                  <div>
                    <label className="gst-field-label">
                      IGST (%) (Auto)
                    </label>
                    <div className="gst-readonly-wrap">
                      <input
                        type="text"
                        value={`${selectedGstRate.igst}%`}
                        readOnly
                        disabled
                        className="form-control gst-readonly-input"
                      />
                      <span className="gst-pill-badge igst">Integrated</span>
                    </div>
                    <div className="gst-input-help">Equal to GST %</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="gst-form-actions">
            <button
              type="button"
              className="btn-admin-outline"
              onClick={() => navigate('/admin/products/hsn')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-admin-primary"
              disabled={isSubmitting}
            >
              <i className="fa-solid fa-floppy-disk" /> {isEdit ? 'Save Changes' : 'Create HSN Code'}
            </button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default HSNForm;
