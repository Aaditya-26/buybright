/**
 * BuyBright Admin — Admin Profile Page.
 * Form with Name, Email, Password, and Confirmed Password fields.
 */

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { Input, Button } from '../../components/Form';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { useToast } from '../../../context/ToastContext';

export const AdminProfilePage: React.FC = () => {
  const { adminUser } = useAdminAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (adminUser) {
      setName(adminUser.name || '');
      setEmail(adminUser.email || '');
    }
  }, [adminUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (password && password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (password && password !== confirmedPassword) {
      newErrors.confirmedPassword = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const stored = localStorage.getItem('prestodental_admin_user');
      const currentUser = stored ? JSON.parse(stored) : {};
      const updatedUser = {
        ...currentUser,
        name: name.trim(),
        email: email.trim(),
      };

      localStorage.setItem('prestodental_admin_user', JSON.stringify(updatedUser));
      setPassword('');
      setConfirmedPassword('');
      showToast('Admin profile updated successfully!', 'success');
    } catch {
      showToast('Failed to update admin profile.', 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="Admin Profile"
      subtitle="Manage your administrator account credentials"
    >
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '16px 0' }}>
        <div
          className="admin-card"
          style={{
            padding: '28px',
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '22px',
              borderBottom: '1px solid #f1f5f9',
              paddingBottom: '16px',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: '#f0fdfa',
                color: '#0d9488',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
              }}
            >
              <i className="fa-solid fa-user-gear" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                Admin Profile
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                Update your name, email, and password credentials
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <Input
              label="Name *"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              placeholder="Enter admin name"
              error={errors.name}
              required
            />

            <Input
              label="Email *"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              placeholder="Enter admin email address"
              error={errors.email}
              required
            />

            <Input
              label="Password *"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              placeholder="Enter new password"
              error={errors.password}
            />

            <Input
              label="Confirmed Password *"
              type="password"
              value={confirmedPassword}
              onChange={(e) => {
                setConfirmedPassword(e.target.value);
                if (errors.confirmedPassword) setErrors({ ...errors, confirmedPassword: '' });
              }}
              placeholder="Confirm new password"
              error={errors.confirmedPassword}
            />

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                marginTop: '24px',
                paddingTop: '16px',
                borderTop: '1px solid #f1f5f9',
              }}
            >
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={isSubmitting}
                icon="fa-solid fa-floppy-disk"
              >
                Save Profile
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfilePage;
