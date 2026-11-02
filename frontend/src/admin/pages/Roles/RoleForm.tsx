/**
 * BuyBright Admin Role Form Page.
 * Dedicated standalone page for creating and editing administrative roles and permissions.
 * Structured module-by-module permissions (Users, Roles, Customers, Category, Sub-Category, Brand) with "All" toggles.
 * Responsive, clean SaaS form design with back navigation and validation.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { getRoles, saveRoles } from '../../data/usersData';
import type { RoleItem } from '../../types/user';
import { useToast } from '../../../context/ToastContext';

export interface PermissionModule {
  id: string;
  name: string;
  icon: string;
  permissions: {
    id: string;
    label: string;
  }[];
}

export const PERMISSION_MODULES: PermissionModule[] = [
  {
    id: 'users',
    name: 'Users',
    icon: 'fa-users',
    permissions: [
      { id: 'view_users', label: 'View Users' },
      { id: 'add_users', label: 'Add Users' },
      { id: 'edit_users', label: 'Edit Users' },
    ],
  },
  {
    id: 'roles',
    name: 'Roles',
    icon: 'fa-shield-halved',
    permissions: [
      { id: 'view_roles', label: 'View Roles' },
      { id: 'add_roles', label: 'Add Roles' },
      { id: 'edit_roles', label: 'Edit Roles' },
    ],
  },
  {
    id: 'customers',
    name: 'Customers',
    icon: 'fa-user-group',
    permissions: [
      { id: 'view_customers', label: 'View Customers' },
    ],
  },
  {
    id: 'category',
    name: 'Category',
    icon: 'fa-layer-group',
    permissions: [
      { id: 'view_category', label: 'View Category' },
      { id: 'add_category', label: 'Add Category' },
      { id: 'edit_category', label: 'Edit Category' },
    ],
  },
  {
    id: 'sub_category',
    name: 'Sub-Category',
    icon: 'fa-sitemap',
    permissions: [
      { id: 'view_sub_category', label: 'View Sub Category' },
      { id: 'add_sub_category', label: 'Add Sub Category' },
      { id: 'edit_sub_category', label: 'Edit Sub Category' },
    ],
  },
  {
    id: 'brand',
    name: 'Brand',
    icon: 'fa-award',
    permissions: [
      { id: 'view_brand', label: 'View Brand' },
      { id: 'add_brand', label: 'Add Brand' },
      { id: 'edit_brand', label: 'Edit Brand' },
    ],
  },
];

const ALL_AVAILABLE_PERMISSION_LABELS = PERMISSION_MODULES.flatMap((m) =>
  m.permissions.map((p) => p.label)
);

export const RoleForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { showToast } = useToast();

  const isEdit = Boolean(id);

  const [roleForm, setRoleForm] = useState({
    roleName: '',
    description: '',
    status: 'Active' as 'Active' | 'Inactive',
    permissions: [] as string[],
  });

  const [initialLoaded, setInitialLoaded] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      const allRoles = getRoles();
      const existing = allRoles.find((r) => r.id === id);
      if (existing) {
        let currentPermissions = existing.permissions || [];
        // If role had 'All Permissions' or empty, select all
        if (currentPermissions.includes('All Permissions')) {
          currentPermissions = ALL_AVAILABLE_PERMISSION_LABELS;
        }

        setRoleForm({
          roleName: existing.roleName,
          description: existing.description || '',
          status: existing.status || 'Active',
          permissions: currentPermissions,
        });
      } else {
        showToast('Role not found.', 'warning');
        navigate('/admin/roles');
      }
    } else {
      // Default initial permissions for new role
      setRoleForm((prev) => ({
        ...prev,
        permissions: ['View Users', 'View Roles', 'View Category', 'View Brand'],
      }));
    }
    setInitialLoaded(true);
  }, [id, isEdit, navigate, showToast]);

  // Toggle a single permission
  const togglePermission = (permLabel: string) => {
    setRoleForm((prev) => {
      const exists = prev.permissions.includes(permLabel);
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((p) => p !== permLabel)
          : [...prev.permissions, permLabel],
      };
    });
  };

  // Toggle "All" for a specific module
  const toggleModuleAll = (module: PermissionModule) => {
    const moduleLabels = module.permissions.map((p) => p.label);
    const isAllChecked = moduleLabels.every((l) => roleForm.permissions.includes(l));

    setRoleForm((prev) => {
      let nextPerms: string[];
      if (isAllChecked) {
        // Deselect all in this module
        nextPerms = prev.permissions.filter((p) => !moduleLabels.includes(p));
      } else {
        // Select all in this module
        const missing = moduleLabels.filter((l) => !prev.permissions.includes(l));
        nextPerms = [...prev.permissions, ...missing];
      }
      return { ...prev, permissions: nextPerms };
    });
  };

  // Global Select All
  const handleSelectAll = () => {
    setRoleForm((prev) => ({
      ...prev,
      permissions: ALL_AVAILABLE_PERMISSION_LABELS,
    }));
  };

  // Global Clear All
  const handleClearAll = () => {
    setRoleForm((prev) => ({
      ...prev,
      permissions: [],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!roleForm.roleName.trim()) {
      showToast('Role Name is required.', 'danger');
      return;
    }

    const allRoles = getRoles();

    if (isEdit && id) {
      const updated = allRoles.map((r) =>
        r.id === id
          ? {
              ...r,
              roleName: roleForm.roleName.trim(),
              description: roleForm.description.trim(),
              status: roleForm.status,
              permissions: roleForm.permissions,
            }
          : r
      );
      saveRoles(updated);
      showToast(`Role "${roleForm.roleName}" updated successfully.`, 'success');
    } else {
      const newRole: RoleItem = {
        id: `role-${Date.now()}`,
        srNo: allRoles.length + 1,
        roleName: roleForm.roleName.trim(),
        description: roleForm.description.trim(),
        status: roleForm.status,
        permissions: roleForm.permissions,
        userCount: 0,
        createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      };
      saveRoles([...allRoles, newRole]);
      showToast(`New role "${newRole.roleName}" registered successfully.`, 'success');
    }

    navigate('/admin/roles');
  };

  if (!initialLoaded) return null;

  const totalSelected = roleForm.permissions.length;

  return (
    <AdminLayout
      title={isEdit ? `Edit Role: ${roleForm.roleName || ''}` : 'Add New Role'}
      subtitle={isEdit ? 'Configure role access controls and permissions' : 'Create an administrative role for staff members'}
    >
      <div style={{ width: '100%' }}>
        {/* Back Link Bar */}
        <div style={{ marginBottom: '18px' }}>
          <Link
            to="/admin/roles"
            className="btn-admin-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
          >
            <i className="fa-solid fa-arrow-left" /> Back to Roles List
          </Link>
        </div>

        {/* Card Form */}
        <div className="admin-card" style={{ padding: '28px' }}>
          <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              <i className="fa-solid fa-shield-halved" style={{ color: '#0d9488', marginRight: '10px' }} />
              {isEdit ? 'Role Configuration' : 'New Role Details'}
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>
              Define the role title, status, and module permissions to control portal feature access.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="admin-modal-form">
            <div className="form-row-2col">
              <div className="form-field-group">
                <label htmlFor="roleFormName">
                  Role Name <span className="required-star">*</span>
                </label>
                <input
                  id="roleFormName"
                  type="text"
                  className="form-input-text"
                  placeholder="e.g. Catalog Coordinator"
                  value={roleForm.roleName}
                  onChange={(e) => setRoleForm({ ...roleForm, roleName: e.target.value })}
                  required
                />
                <span className="form-field-hint">Unique descriptive title for this role.</span>
              </div>

              <div className="form-field-group">
                <label htmlFor="roleFormStatus">Status</label>
                <select
                  id="roleFormStatus"
                  className="form-input-select"
                  value={roleForm.status}
                  onChange={(e) => setRoleForm({ ...roleForm, status: e.target.value as 'Active' | 'Inactive' })}
                >
                  <option value="Active">Active (Available for Assignment)</option>
                  <option value="Inactive">Inactive (Disabled)</option>
                </select>
                <span className="form-field-hint">Active roles can be assigned to system users.</span>
              </div>
            </div>

            <div className="form-field-group">
              <label htmlFor="roleFormDescription">Role Description</label>
              <textarea
                id="roleFormDescription"
                className="form-input-textarea"
                placeholder="Outline the responsibilities, product oversight duties, and access boundaries for this role..."
                value={roleForm.description}
                onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
              />
              <span className="form-field-hint">Brief summary of responsibilities and scope.</span>
            </div>

            {/* Permissions Section Header & Controls */}
            <div style={{ marginTop: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '12px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#0f172a' }}>
                    Permissions
                  </h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                    Configure granular privileges for Users, Roles, Customers, Category, Sub-Category, and Brand.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: totalSelected > 0 ? '#0f766e' : '#64748b',
                      background: totalSelected > 0 ? '#ccfbf1' : '#f1f5f9',
                      padding: '4px 10px',
                      borderRadius: '20px',
                    }}
                  >
                    {totalSelected} / {ALL_AVAILABLE_PERMISSION_LABELS.length} Selected
                  </span>
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="btn-admin-secondary"
                    style={{ padding: '5px 12px', fontSize: '0.78rem' }}
                  >
                    <i className="fa-solid fa-check-double" /> Select All
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="btn-admin-secondary"
                    style={{ padding: '5px 12px', fontSize: '0.78rem' }}
                  >
                    <i className="fa-solid fa-xmark" /> Clear All
                  </button>
                </div>
              </div>

              {/* Module-by-Module Cards Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
                  gap: '16px',
                }}
              >
                {PERMISSION_MODULES.map((module) => {
                  const moduleLabels = module.permissions.map((p) => p.label);
                  const isAllChecked = moduleLabels.every((l) => roleForm.permissions.includes(l));
                  const isSomeChecked =
                    !isAllChecked && moduleLabels.some((l) => roleForm.permissions.includes(l));
                  const selectedCount = moduleLabels.filter((l) =>
                    roleForm.permissions.includes(l)
                  ).length;

                  return (
                    <div
                      key={module.id}
                      style={{
                        background: '#ffffff',
                        borderRadius: '10px',
                        border: isAllChecked
                          ? '1.5px solid #0d9488'
                          : isSomeChecked
                          ? '1.5px solid #99f6e4'
                          : '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                        overflow: 'hidden',
                        transition: 'border-color 0.2s ease',
                      }}
                    >
                      {/* Module Header with Module Name + All Checkbox */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          background: isAllChecked ? '#f0fdfa' : '#f8fafc',
                          borderBottom: '1px solid #e2e8f0',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '6px',
                              background: isAllChecked ? '#0d9488' : '#e2e8f0',
                              color: isAllChecked ? '#ffffff' : '#475569',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.8rem',
                            }}
                          >
                            <i className={`fa-solid ${module.icon}`} />
                          </div>
                          <div>
                            <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                              {module.name}
                            </span>
                            <span
                              style={{
                                fontSize: '0.74rem',
                                color: '#64748b',
                                marginLeft: '6px',
                                fontWeight: 500,
                              }}
                            >
                              ({selectedCount}/{module.permissions.length})
                            </span>
                          </div>
                        </div>

                        {/* "All" Checkbox for this module */}
                        <label
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '3px 9px',
                            borderRadius: '6px',
                            background: isAllChecked ? '#0d9488' : '#ffffff',
                            color: isAllChecked ? '#ffffff' : '#334155',
                            border: isAllChecked ? '1px solid #0d9488' : '1px solid #cbd5e1',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            userSelect: 'none',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isAllChecked}
                            ref={(el) => {
                              if (el) el.indeterminate = isSomeChecked;
                            }}
                            onChange={() => toggleModuleAll(module)}
                            style={{ accentColor: '#0d9488', width: '15px', height: '15px', cursor: 'pointer' }}
                          />
                          <span>All</span>
                        </label>
                      </div>

                      {/* Module Sub-Permissions List */}
                      <div
                        style={{
                          padding: '12px 14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                        }}
                      >
                        {module.permissions.map((p) => {
                          const checked = roleForm.permissions.includes(p.label);
                          return (
                            <label
                              key={p.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                background: checked ? '#f0fdfa' : '#ffffff',
                                border: checked ? '1px solid #ccfbf1' : '1px solid #f1f5f9',
                                fontSize: '0.84rem',
                                fontWeight: checked ? 600 : 500,
                                color: checked ? '#0f766e' : '#334155',
                                cursor: 'pointer',
                                userSelect: 'none',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => togglePermission(p.label)}
                                style={{
                                  accentColor: '#0d9488',
                                  width: '16px',
                                  height: '16px',
                                  cursor: 'pointer',
                                }}
                              />
                              <span>{p.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '12px',
                marginTop: '28px',
                paddingTop: '20px',
                borderTop: '1px solid #f1f5f9',
              }}
            >
              <button
                type="button"
                className="btn-admin-secondary"
                onClick={() => navigate('/admin/roles')}
              >
                Cancel
              </button>
              <button type="submit" className="btn-admin-primary">
                <i className="fa-solid fa-check" /> {isEdit ? 'Update Role' : 'Save Role'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default RoleForm;
