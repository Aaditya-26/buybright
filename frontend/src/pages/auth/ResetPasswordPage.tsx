/**
 * BuyBright Reset Password Page.
 * Handles direct token links or standalone password update flows.
 */

import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { SEO } from '../../components/common/SEO';

export const ResetPasswordPage: React.FC = () => {
  const { resetPassword, isLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!password) {
      errs.password = 'Please enter your new password.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    try {
      const res = await resetPassword(password);
      if (res.success) {
        setIsSuccess(true);
        showToast('Password has been reset successfully!', 'success');
      } else {
        showToast(res.message || 'Error updating password', 'danger');
      }
    } catch {
      showToast('Network error updating password.', 'danger');
    }
  };

  return (
    <AuthLayout activeTab="forgot">
      <SEO
        title="Set New Password"
        description="Choose a secure new password for your BuyBrightaccount."
        canonicalUrl="https://buybright.com/reset-password"
      />
      {!isSuccess ? (
        <>
          <div className="auth-header-block">
            <span className="auth-subheading">
              <i className="fa-solid fa-lock" />
              <span>Security Credential Update</span>
            </span>
            <h2 className="auth-main-title">Set New Password</h2>
            <p className="auth-desc-text">
              {token ? 'Your secure reset link has been verified.' : 'Enter your new credentials below to restore account access.'}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleResetSubmit} noValidate>
            <div className="auth-field-group">
              <div className="field-label-row">
                <label htmlFor="reset-new-pass">
                  New Password <span className="req-star">*</span>
                </label>
              </div>
              <div className="auth-input-wrapper">
                <i className="fa-solid fa-lock input-leading-icon" />
                <input
                  id="reset-new-pass"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  className={errors.password ? 'has-error' : ''}
                  autoFocus
                />
                <button
                  type="button"
                  className="btn-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <i className={showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'} />
                </button>
              </div>
              {errors.password && (
                <span className="field-error-msg">
                  <i className="fa-solid fa-circle-exclamation" /> {errors.password}
                </span>
              )}
            </div>

            <div className="auth-field-group">
              <div className="field-label-row">
                <label htmlFor="reset-conf-pass">
                  Confirm New Password <span className="req-star">*</span>
                </label>
              </div>
              <div className="auth-input-wrapper">
                <i className="fa-solid fa-shield-halved input-leading-icon" />
                <input
                  id="reset-conf-pass"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                  }}
                  className={errors.confirmPassword ? 'has-error' : ''}
                />
              </div>
              {errors.confirmPassword && (
                <span className="field-error-msg">
                  <i className="fa-solid fa-circle-exclamation" /> {errors.confirmPassword}
                </span>
              )}
            </div>

            <button type="submit" className="btn-auth-submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <i className="fa-solid fa-circle-notch spinner-icon" />
                  <span>Saving Password...</span>
                </>
              ) : (
                <>
                  <span>Save Password &amp; Login</span>
                  <i className="fa-solid fa-arrow-right" />
                </>
              )}
            </button>
          </form>
        </>
      ) : (
        <div className="auth-success-card">
          <div className="success-anim-circle">
            <i className="fa-solid fa-check" />
          </div>
          <h3>Password Reset Complete</h3>
          <p>
            You can now log in to BuyBright using your updated password.
          </p>
          <button
            type="button"
            className="btn-auth-submit"
            onClick={() => navigate('/login')}
          >
            <span>Go to Sign In</span>
            <i className="fa-solid fa-arrow-right" />
          </button>
        </div>
      )}
    </AuthLayout>
  );
};
