/**
 * BuyBright User Registration Page.
 * Clean, modern, responsive registration form with password strength validation.
 */

import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { SEO } from '../../components/common/SEO';

export const RegisterPage: React.FC = () => {
  const { register, isLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(true);
  const [whatsappUpdates, setWhatsappUpdates] = useState(true);

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Password strength calculator
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: 'None', classSuffix: '' };

    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak (Add numbers & symbols)', classSuffix: 'weak' };
      case 2:
        return { score: 2, label: 'Fair (Add uppercase letters)', classSuffix: 'fair' };
      case 3:
        return { score: 3, label: 'Good (Very secure)', classSuffix: 'good' };
      case 4:
        return { score: 4, label: 'Strong', classSuffix: 'strong' };
      default:
        return { score: 0, label: 'Too Short', classSuffix: 'weak' };
    }
  }, [password]);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!name.trim()) errs.name = 'Please enter your full name.';

    if (!email.trim()) {
      errs.email = 'Please enter your email address.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address (e.g. name@example.com).';
    }

    if (!phone.trim()) {
      errs.phone = 'Please enter your mobile number.';
    } else if (phone.replace(/[^0-9]/g, '').length < 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number.';
    }

    if (!password) {
      errs.password = 'Please enter a password.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    if (!agreeToTerms) {
      errs.terms = 'You must agree to the Terms of Service and Privacy Policy.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        role: 'dentist',
        agreeToTerms,
        whatsappUpdates,
      });

      if (res.success) {
        showToast(res.message || 'Account created successfully!', 'success', 'Welcome');
        navigate('/profile');
      } else {
        showToast(res.message || 'Registration failed. Please review details.', 'danger');
      }
    } catch {
      showToast('Connection error during registration. Please try again.', 'danger');
    }
  };

  return (
    <AuthLayout activeTab="register">
      <SEO
        title="Create Doctor Account"
        description="Register your dental practice on BuyBright to unlock wholesale prices, GST input tax credits, and express dental logistics."
        canonicalUrl="https://buybright.com/register"
      />
      {/* Top Tabs */}
      <div className="auth-nav-tabs">
        <button
          type="button"
          className="auth-tab-btn"
          onClick={() => navigate('/login')}
        >
          <i className="fa-solid fa-right-to-bracket" />
          <span>Sign In</span>
        </button>
        <button type="button" className="auth-tab-btn active">
          <i className="fa-solid fa-user-plus" />
          <span>Register</span>
        </button>
      </div>

      {/* Header Block */}
      <div className="auth-header-block">
        <span className="auth-subheading">
          <i className="fa-solid fa-user-check" />
          <span>New Account</span>
        </span>
        <h2 className="auth-main-title">Create Account</h2>
        <p className="auth-desc-text">
          Enter your personal information below to create your BuyBright account.
        </p>
      </div>

      {/* Register Form */}
      <form className="auth-form" onSubmit={handleRegisterSubmit} noValidate>
        {/* Full Name */}
        <div className="auth-field-group">
          <div className="field-label-row">
            <label htmlFor="reg-name">
              Full Name <span className="req-star">*</span>
            </label>
          </div>
          <div className="auth-input-wrapper">
            <i className="fa-regular fa-user input-leading-icon" />
            <input
              id="reg-name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              className={errors.name ? 'has-error' : ''}
              autoComplete="name"
            />
          </div>
          {errors.name && (
            <span className="field-error-msg">
              <i className="fa-solid fa-circle-exclamation" /> {errors.name}
            </span>
          )}
        </div>

        {/* Row 2: Email & Phone Number */}
        <div className="form-row-2col">
          <div className="auth-field-group">
            <div className="field-label-row">
              <label htmlFor="reg-email">
                Email Address <span className="req-star">*</span>
              </label>
            </div>
            <div className="auth-input-wrapper">
              <i className="fa-regular fa-envelope input-leading-icon" />
              <input
                id="reg-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                className={errors.email ? 'has-error' : ''}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <span className="field-error-msg">
                <i className="fa-solid fa-circle-exclamation" /> {errors.email}
              </span>
            )}
          </div>

          <div className="auth-field-group">
            <div className="field-label-row">
              <label htmlFor="reg-phone">
                Mobile Number <span className="req-star">*</span>
              </label>
            </div>
            <div className="auth-input-wrapper">
              <i className="fa-solid fa-phone input-leading-icon" />
              <input
                id="reg-phone"
                type="tel"
                placeholder="10-digit number"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors({ ...errors, phone: '' });
                }}
                className={errors.phone ? 'has-error' : ''}
                autoComplete="tel"
              />
            </div>
            {errors.phone && (
              <span className="field-error-msg">
                <i className="fa-solid fa-circle-exclamation" /> {errors.phone}
              </span>
            )}
          </div>
        </div>

        {/* Row 3: Password & Confirm Password */}
        <div className="form-row-2col">
          <div className="auth-field-group">
            <div className="field-label-row">
              <label htmlFor="reg-password">
                Password <span className="req-star">*</span>
              </label>
            </div>
            <div className="auth-input-wrapper">
              <i className="fa-solid fa-lock input-leading-icon" />
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                className={errors.password ? 'has-error' : ''}
                autoComplete="new-password"
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
              <label htmlFor="reg-confirm-password">
                Confirm Password <span className="req-star">*</span>
              </label>
            </div>
            <div className="auth-input-wrapper">
              <i className="fa-solid fa-shield-halved input-leading-icon" />
              <input
                id="reg-confirm-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                }}
                className={errors.confirmPassword ? 'has-error' : ''}
                autoComplete="new-password"
              />
            </div>
            {errors.confirmPassword && (
              <span className="field-error-msg">
                <i className="fa-solid fa-circle-exclamation" /> {errors.confirmPassword}
              </span>
            )}
          </div>
        </div>

        {/* Live Password Strength Meter */}
        {password && (
          <div className="password-strength-container">
            <div className="strength-bars-track">
              <div className={`strength-bar ${passwordStrength.score >= 1 ? `active-${passwordStrength.classSuffix}` : ''}`} />
              <div className={`strength-bar ${passwordStrength.score >= 2 ? `active-${passwordStrength.classSuffix}` : ''}`} />
              <div className={`strength-bar ${passwordStrength.score >= 3 ? `active-${passwordStrength.classSuffix}` : ''}`} />
              <div className={`strength-bar ${passwordStrength.score >= 4 ? `active-${passwordStrength.classSuffix}` : ''}`} />
            </div>
            <div className="strength-text-row">
              <span>Security Level: <strong>{passwordStrength.label}</strong></span>
              <span>{passwordStrength.score}/4 Criteria</span>
            </div>
          </div>
        )}

        {/* WhatsApp updates checkbox */}
        <div className="auth-checkbox-row">
          <input
            type="checkbox"
            id="whatsapp-updates"
            checked={whatsappUpdates}
            onChange={(e) => setWhatsappUpdates(e.target.checked)}
          />
          <label htmlFor="whatsapp-updates">
            <i className="fa-brands fa-whatsapp" style={{ color: '#25d366', marginRight: '4px' }} />
            Receive order and delivery updates on WhatsApp
          </label>
        </div>

        {/* Terms checkbox */}
        <div className="auth-checkbox-row">
          <input
            type="checkbox"
            id="agree-terms"
            checked={agreeToTerms}
            onChange={(e) => {
              setAgreeToTerms(e.target.checked);
              if (errors.terms) setErrors({ ...errors, terms: '' });
            }}
          />
          <label htmlFor="agree-terms">
            I agree to the <Link to="/about">Terms of Service</Link> and <Link to="/about">Privacy Policy</Link>.
          </label>
        </div>
        {errors.terms && (
          <span className="field-error-msg" style={{ marginTop: '-8px' }}>
            <i className="fa-solid fa-circle-exclamation" /> {errors.terms}
          </span>
        )}

        {/* Submit button */}
        <button type="submit" className="btn-auth-submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <i className="fa-solid fa-circle-notch spinner-icon" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <i className="fa-solid fa-arrow-right" />
            </>
          )}
        </button>

        {/* Switch Link */}
        <div style={{ textAlign: 'center', marginTop: '4px' }}>
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            Already have an account?
          </span>
          <Link
            to="/login"
            style={{
              fontSize: '13px',
              fontWeight: '700',
              color: 'var(--color-cyan-teal)',
              marginLeft: '6px',
            }}
          >
            Sign In Here &rarr;
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};
