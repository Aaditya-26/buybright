/**
 * BuyBright Admin User Form Page.
 * Dedicated standalone page for creating and editing system users.
 * Responsive, clean SaaS form design with back navigation and validation.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { getSystemUsers, saveSystemUsers, getRoles } from '../../data/usersData';
import type { SystemUser } from '../../types/user';
import { useToast } from '../../../context/ToastContext';

export const UserForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEdit = Boolean(id);
  const roles = getRoles();

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    contactNo: '',
    aadhaarNumber: '',
    panNumber: '',
    role: '',
    password: '',
    confirmPassword: '',
    address: '',
    status: 'Active' as 'Active' | 'Inactive' | 'Pending',
  });

  const [profileImage, setProfileImage] = useState<string>('');
  const [imageFileName, setImageFileName] = useState<string>('No file chosen');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      const allUsers = getSystemUsers();
      const existing = allUsers.find((u) => u.id === id);
      if (existing) {
        setFormData({
          userName: existing.userName || '',
          email: existing.email || '',
          contactNo: existing.contactNo || '',
          aadhaarNumber: existing.aadhaarNumber || '',
          panNumber: existing.panNumber || '',
          role: existing.role || '',
          password: existing.password || '',
          confirmPassword: existing.password || '',
          address: existing.address || '',
          status: existing.status || 'Active',
        });
        if (existing.profileImage) {
          setProfileImage(existing.profileImage);
          setImageFileName('profile-image.jpg');
        }
      } else {
        showToast('User not found.', 'warning');
        navigate('/admin/users');
      }
    }
    setInitialLoaded(true);
  }, [id, isEdit, navigate, showToast]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('Image size exceeds 2MB limit.', 'warning');
      return;
    }

    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setProfileImage('');
    setImageFileName('No file chosen');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userName.trim()) {
      showToast('Please enter user name.', 'danger');
      return;
    }

    if (!formData.email.trim()) {
      showToast('Please enter email address.', 'danger');
      return;
    }

    if (!formData.contactNo.trim()) {
      showToast('Please enter contact number.', 'danger');
      return;
    }

    if (!formData.role) {
      showToast('Please select a user role.', 'danger');
      return;
    }

    if (!isEdit && !formData.password) {
      showToast('Please enter password.', 'danger');
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      showToast('Password and Confirm Password do not match.', 'danger');
      return;
    }

    const allUsers = getSystemUsers();

    if (isEdit && id) {
      const updated = allUsers.map((u) =>
        u.id === id
          ? {
              ...u,
              userName: formData.userName.trim(),
              email: formData.email.trim(),
              contactNo: formData.contactNo.trim(),
              aadhaarNumber: formData.aadhaarNumber.trim(),
              panNumber: formData.panNumber.trim().toUpperCase(),
              role: formData.role,
              status: formData.status,
              address: formData.address.trim(),
              profileImage: profileImage || u.profileImage,
              ...(formData.password ? { password: formData.password } : {}),
            }
          : u
      );
      saveSystemUsers(updated);
      showToast(`User "${formData.userName}" updated successfully.`, 'success');
    } else {
      const initials = formData.userName
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

      const newUser: SystemUser = {
        id: `usr-sys-${Date.now()}`,
        srNo: allUsers.length + 1,
        userName: formData.userName.trim(),
        email: formData.email.trim(),
        contactNo: formData.contactNo.trim(),
        role: formData.role,
        aadhaarNumber: formData.aadhaarNumber.trim(),
        panNumber: formData.panNumber.trim().toUpperCase(),
        address: formData.address.trim(),
        profileImage: profileImage || undefined,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: formData.status,
        password: formData.password || 'User@2025Secure',
        avatar: initials || 'US',
      };
      saveSystemUsers([...allUsers, newUser]);
      showToast(`New user "${newUser.userName}" registered successfully.`, 'success');
    }

    navigate('/admin/users');
  };

  if (!initialLoaded) return null;

  return (
    <AdminLayout
      title={isEdit ? `Edit User: ${formData.userName || ''}` : 'Add New User'}
      subtitle={isEdit ? 'Update system user profile and access privileges' : 'Register a new administrative user to BuyBright'}
    >
      <div style={{ width: '100%' }}>
        {/* Back Link Bar */}
        <div style={{ marginBottom: '18px' }}>
          <Link
            to="/admin/users"
            className="btn-admin-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
          >
            <i className="fa-solid fa-arrow-left" /> Back to Users List
          </Link>
        </div>

        {/* Card Form */}
        <div className="admin-card" style={{ padding: '28px' }}>
          <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              <i className="fa-solid fa-user-pen" style={{ color: '#0d9488', marginRight: '10px' }} />
              {isEdit ? 'User Profile Information' : 'New User Details'}
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>
              Ensure correct email, contact, role and credentials for administrative verification and security.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="admin-modal-form">
            {/* Row 1: Enter User Name & Enter Email ID */}
            <div className="form-row-2col">
              <div className="form-field-group">
                <label htmlFor="userFormName">
                  Enter User Name <span className="required-star">*</span>
                </label>
                <input
                  id="userFormName"
                  type="text"
                  className="form-input-text"
                  placeholder="admin@gmail.com"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  required
                />
                <span className="form-field-hint">Full name or user name of the system user.</span>
              </div>

              <div className="form-field-group">
                <label htmlFor="userFormEmail">
                  Enter Email ID <span className="required-star">*</span>
                </label>
                <input
                  id="userFormEmail"
                  type="email"
                  className="form-input-text"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <span className="form-field-hint">Used for sign in and administrative alerts.</span>
              </div>
            </div>

            {/* Row 2: Contact Number & User Role */}
            <div className="form-row-2col">
              <div className="form-field-group">
                <label htmlFor="userFormContact">
                  Contact Number <span className="required-star">*</span>
                </label>
                <input
                  id="userFormContact"
                  type="text"
                  className="form-input-text"
                  placeholder="Contact"
                  value={formData.contactNo}
                  onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
                  required
                />
                <span className="form-field-hint">Phone number with country code.</span>
              </div>

              <div className="form-field-group">
                <label htmlFor="userFormRole">
                  User Role <span className="required-star">*</span>
                </label>
                <select
                  id="userFormRole"
                  className="form-input-select"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                >
                  <option value="">Select Role</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.roleName}>
                      {r.roleName}
                    </option>
                  ))}
                </select>
                <span className="form-field-hint">Determines access permissions and module visibility.</span>
              </div>
            </div>

            {/* Row 3: Enter Aadhaar Number & Enter PAN Number */}
            <div className="form-row-2col">
              <div className="form-field-group">
                <label htmlFor="userFormAadhaar">Enter Aadhaar Number</label>
                <input
                  id="userFormAadhaar"
                  type="text"
                  className="form-input-text"
                  placeholder="Aadhaar Number"
                  value={formData.aadhaarNumber}
                  onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })}
                  maxLength={16}
                />
                <span className="form-field-hint">12-digit Aadhaar card number for KYC.</span>
              </div>

              <div className="form-field-group">
                <label htmlFor="userFormPan">Enter PAN Number</label>
                <input
                  id="userFormPan"
                  type="text"
                  className="form-input-text"
                  placeholder="PAN Number"
                  value={formData.panNumber}
                  onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                  maxLength={10}
                />
                <span className="form-field-hint">Permanent Account Number (e.g. ABCDE1234F).</span>
              </div>
            </div>

            {/* Row 4: Enter Password & Enter Confirm Password */}
            <div className="form-row-2col">
              <div className="form-field-group">
                <label htmlFor="userFormPassword">
                  Enter Password <span className="required-star">*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="userFormPassword"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input-text"
                    placeholder="••••••"
                    style={{ paddingRight: '40px' }}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!isEdit}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      padding: '4px',
                      fontSize: '0.88rem',
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                  </button>
                </div>
                <span className="form-field-hint">
                  {isEdit ? 'Leave blank to keep existing password.' : 'Minimum 6 characters recommended.'}
                </span>
              </div>

              <div className="form-field-group">
                <label htmlFor="userFormConfirmPassword">
                  Enter Confirm Password <span className="required-star">*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="userFormConfirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="form-input-text"
                    placeholder="Confirm Password"
                    style={{ paddingRight: '40px' }}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required={!isEdit || Boolean(formData.password)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      padding: '4px',
                      fontSize: '0.88rem',
                    }}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    <i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                  </button>
                </div>
                <span className="form-field-hint">Re-enter the password to verify accuracy.</span>
              </div>
            </div>

            {/* Row 5: Profile Image & Account Status */}
            <div className="form-row-2col">
              <div className="form-field-group">
                <label htmlFor="userFormProfileImage">Profile Image</label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '6px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    background: '#ffffff',
                    minHeight: '42px',
                  }}
                >
                  <input
                    ref={fileInputRef}
                    id="userFormProfileImage"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      background: '#f8fafc',
                      color: '#334155',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <i className="fa-solid fa-cloud-arrow-up" style={{ color: '#0d9488' }} /> Choose File
                  </button>
                  <span
                    style={{
                      fontSize: '0.82rem',
                      color: imageFileName === 'No file chosen' ? '#94a3b8' : '#0f766e',
                      fontWeight: imageFileName === 'No file chosen' ? 400 : 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                    }}
                  >
                    {imageFileName}
                  </span>
                  {profileImage && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img
                        src={profileImage}
                        alt="Preview"
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '1.5px solid #0d9488',
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: '2px',
                          fontSize: '0.85rem',
                        }}
                        title="Remove image"
                      >
                        <i className="fa-solid fa-xmark" />
                      </button>
                    </div>
                  )}
                </div>
                <span className="form-field-hint">No file chosen by default. Supports JPG, PNG, WEBP (Max 2MB).</span>
              </div>

              <div className="form-field-group">
                <label htmlFor="userFormStatus">Account Status</label>
                <select
                  id="userFormStatus"
                  className="form-input-select"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' | 'Pending' })
                  }
                >
                  <option value="Active">Active (Full Access)</option>
                  <option value="Inactive">Inactive (Suspended)</option>
                  <option value="Pending">Pending Approval</option>
                </select>
                <span className="form-field-hint">Active users can sign in and perform system operations.</span>
              </div>
            </div>

            {/* Row 6: Address */}
            <div className="form-field-group">
              <label htmlFor="userFormAddress">Address</label>
              <textarea
                id="userFormAddress"
                className="form-input-textarea"
                rows={3}
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
              <span className="form-field-hint">Residential orcontact address.</span>
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
                onClick={() => navigate('/admin/users')}
              >
                Cancel
              </button>
              <button type="submit" className="btn-admin-primary">
                <i className="fa-solid fa-check" /> {isEdit ? 'Update User' : 'Save User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserForm;
