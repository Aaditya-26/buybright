/**
 * BuyBright Admin — GST Rate Form Page.
 * Dedicated create/edit form with real-time CGST, SGST, IGST auto-calculation.
 * Clean, single-column focused form without invoice simulation and zero pre-filled 0.
 * Route: /admin/products/gst/create & /admin/products/gst/edit/:id
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { getGSTRates, saveGSTRates, getGSTRateById } from '../../../data/gstData';
import type { AdminGSTRate } from '../../../types/gst';
import { useToast } from '../../../../context/ToastContext';

interface GSTFormState {
  rateLabel: string;
  totalGst: number | '';
  cgst: number | '';
  sgst: number | '';
  igst: number | '';
  description: string;
  status: 'Active' | 'Inactive';
}

export const GSTForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const { showToast } = useToast();

  const [form, setForm] = useState<GSTFormState>({
    rateLabel: '',
    totalGst: '',
    cgst: '',
    sgst: '',
    igst: '',
    description: '',
    status: 'Active',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      const existing = getGSTRateById(id);
      if (existing) {
        setForm({
          rateLabel: existing.rateLabel,
          totalGst: existing.totalGst,
          cgst: existing.cgst,
          sgst: existing.sgst,
          igst: existing.igst,
          description: existing.description || '',
          status: existing.status,
        });
      } else {
        showToast('GST Rate not found.', 'danger');
        navigate('/admin/products/gst');
      }
    }
  }, [id, isEdit, navigate, showToast]);

  // Handle Total GST change with automatic calculation of CGST, SGST, IGST
  const handleTotalGstChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;

    if (rawVal === '') {
      setForm((prev) => ({
        ...prev,
        totalGst: '',
        cgst: '',
        sgst: '',
        igst: '',
        rateLabel: !isEdit && /^GST \d+(\.\d+)?%$/i.test(prev.rateLabel) ? '' : prev.rateLabel,
      }));
      return;
    }

    const numVal = Math.max(0, Math.min(100, Number(rawVal)));
    const half = Math.round((numVal / 2) * 100) / 100;
    const equal = numVal;

    setForm((prev) => {
      const isDefaultPattern = !prev.rateLabel || /^GST \d+(\.\d+)?%$/i.test(prev.rateLabel);
      return {
        ...prev,
        totalGst: numVal,
        cgst: half,
        sgst: half,
        igst: equal,
        rateLabel: !isEdit && isDefaultPattern ? `GST ${numVal}%` : prev.rateLabel,
      };
    });

    if (errors.totalGst) setErrors((prev) => ({ ...prev, totalGst: '' }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.rateLabel.trim()) errs.rateLabel = 'Rate Label is required';
    if (form.totalGst === '' || form.totalGst < 0 || form.totalGst > 100) {
      errs.totalGst = 'Total GST percentage is required (0% to 100%)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix validation errors before saving.', 'danger');
      return;
    }

    setIsSubmitting(true);
    const existingRates = getGSTRates();

    const payload: AdminGSTRate = {
      rateLabel: form.rateLabel.trim(),
      totalGst: Number(form.totalGst) || 0,
      cgst: Number(form.cgst) || 0,
      sgst: Number(form.sgst) || 0,
      igst: Number(form.igst) || 0,
      description: form.description.trim(),
      status: form.status,
      id: isEdit && id ? id : `gst-${Date.now()}`,
      updatedAt: new Date().toISOString(),
      createdAt: isEdit ? existingRates.find((r) => r.id === id)?.createdAt : new Date().toISOString(),
    };

    if (isEdit && id) {
      const updated = existingRates.map((r) => (r.id === id ? payload : r));
      saveGSTRates(updated);
      showToast(`GST Rate "${form.rateLabel}" updated successfully!`, 'success');
    } else {
      saveGSTRates([...existingRates, payload]);
      showToast(`GST Rate "${form.rateLabel}" created successfully!`, 'success');
    }

    setIsSubmitting(false);
    navigate('/admin/products/gst');
  };

  return (
    <AdminLayout
      title={isEdit ? `Edit GST Rate: ${form.rateLabel}` : 'Add GST Rate'}
      subtitle="Configure central taxation slab with automatic 50/50 intra-state and inter-state split calculation"
    >
      {/* ── Responsive Top Bar & Breadcrumbs ── */}
      <div className="gst-top-bar">
        <div className="gst-breadcrumbs">
          <Link to="/admin/products">Products</Link>
          <span className="breadcrumb-sep">/</span>
          <Link to="/admin/products/gst">GST Rates</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{isEdit ? 'Edit' : 'Create'}</span>
        </div>
        <button
          type="button"
          className="btn-admin-outline"
          onClick={() => navigate('/admin/products/gst')}
        >
          <i className="fa-solid fa-arrow-left" /> Back to GST Rates
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-card gst-form-single-card">
          <div className="gst-card-header">
            <i className="fa-solid fa-receipt" />
            <h3>GST Rate Details</h3>
          </div>

          <div className="gst-form-stack">
            {/* Row 1: Rate Label & Total GST */}
            <div className="gst-form-row-2col">
              <div>
                <label className="gst-field-label">
                  Rate Label <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="rateLabel"
                  value={form.rateLabel}
                  onChange={handleChange}
                  placeholder="e.g. Standard Rate – 18%"
                  className="form-control"
                />
                <div className="gst-input-help">Shown in product form dropdowns</div>
                {errors.rateLabel && <span className="gst-field-error">{errors.rateLabel}</span>}
              </div>

              <div>
                <label className="gst-field-label">
                  Total GST (%) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  name="totalGst"
                  value={form.totalGst}
                  onChange={handleTotalGstChange}
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="e.g. 18"
                  className="form-control"
                />
                <div className="gst-input-help">Enter percentage (0 to 100)</div>
                {errors.totalGst && <span className="gst-field-error">{errors.totalGst}</span>}
              </div>
            </div>

            {/* Row 2: Auto-calculated Tax Component Fields (CGST, SGST, IGST) */}
            <div className="gst-form-row-3col">
              <div>
                <label className="gst-field-label">
                  CGST (%) (Auto)
                </label>
                <div className="gst-readonly-wrap">
                  <input
                    type="text"
                    value={form.cgst !== '' ? `${form.cgst}%` : ''}
                    readOnly
                    disabled
                    placeholder="Auto calculated"
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
                    value={form.sgst !== '' ? `${form.sgst}%` : ''}
                    readOnly
                    disabled
                    placeholder="Auto calculated"
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
                    value={form.igst !== '' ? `${form.igst}%` : ''}
                    readOnly
                    disabled
                    placeholder="Auto calculated"
                    className="form-control gst-readonly-input"
                  />
                  <span className="gst-pill-badge igst">Integrated</span>
                </div>
                <div className="gst-input-help">Equal to GST %</div>
              </div>
            </div>

            {/* Row 3: Description */}
            <div>
              <label className="gst-field-label">
                Description <span className="label-hint">(Optional)</span>
              </label>
              <textarea
                name="description"
                rows={3}
                value={form.description || ''}
                onChange={handleChange}
                placeholder="e.g. Standard goods — electronics, garments"
                className="form-control"
              />
            </div>

            {/* Row 4: Status */}
            <div className="gst-form-row-2col">
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
          </div>

          {/* Action Buttons */}
          <div className="gst-form-actions">
            <button
              type="button"
              className="btn-admin-outline"
              onClick={() => navigate('/admin/products/gst')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-admin-primary"
              disabled={isSubmitting}
            >
              <i className="fa-solid fa-floppy-disk" /> {isEdit ? 'Save Changes' : 'Create GST Rate'}
            </button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default GSTForm;
