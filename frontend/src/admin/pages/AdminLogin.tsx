/**
 * BuyBright Admin Login Page.
 * Secure administrator authentication gateway with credentials verification, demo autofill, and state persistence.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { useToast } from '../../context/ToastContext';
import { SEO } from '../../components/common/SEO';
import '../styles/admin.scss';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { login, isAuthenticated, loading } = useAdminAuth();

  const [email, setEmail] = useState('admin@.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // If already logged in, automatically navigate to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      showToast('Please enter both administrator email and password.', 'warning');
      return;
    }

    const result = await login(email, password);

    if (result.success) {
      showToast('Authentication successful. Welcome to BuyBright Admin.', 'success');
      navigate('/admin/dashboard');
    } else {
      showToast(result.message || 'Authentication failed. Please verify credentials.', 'danger');
    }
  };

  return (
    <div className="admin-login-canvas">
      <SEO
        title="Admin Portal Login"
        description="Secure administrator access for BuyBright dental inventory, orders, and logistics management."
        canonicalUrl="https://buybright.com/admin/login"
      />

      <div className="admin-login-card">
        {/* Brand Header */}
        <div className="login-brand-header">
          <div className="login-icon-box">
             <img
              src="/images/logo.webp"
              alt="BuyBright Official Logo"
              className=" brand-logo"
            />
          </div>
          <h1>BuyBright Admin</h1>
          <p>Dental Supply &amp; Operations Management Portal</p>
        </div>

        {/* Authentication Form */}
        <form onSubmit={handleSubmit}>
          {/* Email / Username */}
          <div className="form-group">
            <label htmlFor="admin-email">Administrator Email or Username</label>
            <div className="input-wrapper">
              <i className="fa-regular fa-envelope input-icon" />
              <input
                id="admin-email"
                type="text"
                required
                autoComplete="username"
                placeholder="admin@.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="admin-password">Secure Password</label>
            <div className="input-wrapper">
              <i className="fa-solid fa-lock input-icon" />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn-toggle-pass"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
              </button>
            </div>
          </div>

          {/* Form Extra: Remember Me & Autofill helper */}
          <div className="form-extra-row">
            <label className="remember-wrap">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember session</span>
            </label>

            
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="btn-login-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-right-to-bracket" />
                <span>Sign In to Dashboard</span>
              </>
            )}
          </button>
        </form>

      

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link
            to="/"
            style={{
              fontSize: '0.82rem',
              color: '#0d9488',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <i className="fa-solid fa-arrow-left" /> Back to Live Dental Store
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
