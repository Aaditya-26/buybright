/**
 * BuyBright Forgot Password & Recovery Page.
 * Implements a 4-step recovery flow with animated OTP entry, countdown timer,
 * and live password strength verification.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { SEO } from '../../components/common/SEO';

type RecoveryStep = 'request' | 'otp' | 'new_password' | 'success';

export const ForgotPasswordPage: React.FC = () => {
  const { requestPasswordReset, verifyResetOtp, resetPassword, isLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState<RecoveryStep>('request');
  const [identifier, setIdentifier] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [timerCount, setTimerCount] = useState<number>(45);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // OTP Resend Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (step === 'otp' && timerCount > 0) {
      interval = setInterval(() => {
        setTimerCount((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timerCount]);

  // Step 1: Send OTP
  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrors({ identifier: 'Please enter your registered email address or mobile number.' });
      return;
    }
    setErrors({});

    try {
      const res = await requestPasswordReset(identifier);
      if (res.success) {
        showToast(res.message || 'Verification code dispatched.', 'info', 'OTP Sent');
        setStep('otp');
        setTimerCount(45);
        setCanResend(false);
        // Focus first OTP input
        setTimeout(() => {
          otpInputsRef.current[0]?.focus();
        }, 150);
      }
    } catch {
      showToast('Unable to send recovery code. Please try again.', 'danger');
    }
  };

  // Step 2: Handle OTP input change with auto-advance
  const handleOtpChange = (index: number, val: string) => {
    const digit = val.replace(/[^0-9]/g, '').slice(-1);
    const newOtp = [...otpDigits];
    newOtp[index] = digit;
    setOtpDigits(newOtp);

    // Auto advance to next box
    if (digit && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pasted) {
      const newOtp = [...otpDigits];
      for (let i = 0; i < pasted.length; i++) {
        newOtp[i] = pasted[i];
      }
      setOtpDigits(newOtp);
      otpInputsRef.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length < 6) {
      setErrors({ otp: 'Please enter all 6 digits of your verification code.' });
      return;
    }
    setErrors({});

    try {
      const res = await verifyResetOtp(fullOtp);
      if (res.success) {
        showToast('OTP verified successfully!', 'success');
        setStep('new_password');
      } else {
        setErrors({ otp: res.message || 'Invalid OTP code.' });
        showToast(res.message || 'Invalid OTP', 'danger');
      }
    } catch {
      showToast('Verification failed. Try again.', 'danger');
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setOtpDigits(['', '', '', '', '', '']);
    setTimerCount(45);
    setCanResend(false);
    await requestPasswordReset(identifier);
    showToast(`New code sent to ${identifier}`, 'info');
    otpInputsRef.current[0]?.focus();
  };

  // Step 3: Set New Password
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!newPassword) {
      errs.newPassword = 'Please enter a new password.';
    } else if (newPassword.length < 6) {
      errs.newPassword = 'Password must be at least 6 characters.';
    }

    if (newPassword !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    try {
      const res = await resetPassword(newPassword);
      if (res.success) {
        showToast(res.message || 'Password reset successful!', 'success', 'Password Updated');
        setStep('success');
      } else {
        showToast(res.message || 'Could not reset password.', 'danger');
      }
    } catch {
      showToast('Error resetting password.', 'danger');
    }
  };

  return (
    <AuthLayout activeTab="forgot">
      <SEO
        title="Reset Account Password"
        description="Reset your BuyBright account credentials via secure OTP verification."
        canonicalUrl="https://buybright.com/forgot-password"
      />
      {/* 1. Request Code Step */}
      {step === 'request' && (
        <>
          <div className="auth-header-block">
            <span className="auth-subheading">
              <i className="fa-solid fa-key" />
              <span>Account Recovery</span>
            </span>
            <h2 className="auth-main-title">Reset Your Password</h2>
            <p className="auth-desc-text">
              Enter your clinic's registered email or 10-digit mobile number and we'll send a 6-digit one-time verification code.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleRequestSubmit} noValidate>
            <div className="auth-field-group">
              <div className="field-label-row">
                <label htmlFor="recovery-id">
                  Registered Email or Phone Number <span className="req-star">*</span>
                </label>
              </div>
              <div className="auth-input-wrapper">
                <i className="fa-regular fa-envelope input-leading-icon" />
                <input
                  id="recovery-id"
                  type="text"
                  placeholder="e.g.  sharma@clinic.com or 9876543210"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errors.identifier) setErrors({});
                  }}
                  className={errors.identifier ? 'has-error' : ''}
                  autoFocus
                />
              </div>
              {errors.identifier && (
                <span className="field-error-msg">
                  <i className="fa-solid fa-circle-exclamation" /> {errors.identifier}
                </span>
              )}
            </div>

            <button type="submit" className="btn-auth-submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <i className="fa-solid fa-circle-notch spinner-icon" />
                  <span>Sending Verification Code...</span>
                </>
              ) : (
                <>
                  <span>Send Recovery Code</span>
                  <i className="fa-solid fa-paper-plane" />
                </>
              )}
            </button>

            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <Link
                to="/login"
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#64748b',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <i className="fa-solid fa-arrow-left" style={{ fontSize: '11px' }} />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </form>
        </>
      )}

      {/* 2. OTP Verification Step */}
      {step === 'otp' && (
        <form onSubmit={handleVerifyOtp}>
          <div className="otp-verification-container">
            <div className="otp-icon-bubble">
              <i className="fa-solid fa-comment-sms" />
            </div>

            <div>
              <h2 className="auth-main-title" style={{ fontSize: '22px', marginBottom: '6px' }}>
                Enter 6-Digit Code
              </h2>
              <p className="otp-target-hint">
                We sent a one-time verification code to <strong>{identifier}</strong>.
              </p>
            </div>

            {/* 6 Digit Inputs Row */}
            <div className="otp-inputs-row">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    otpInputsRef.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={handleOtpPaste}
                  className="otp-digit-input"
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>

            {errors.otp && (
              <span className="field-error-msg">
                <i className="fa-solid fa-circle-exclamation" /> {errors.otp}
              </span>
            )}

            {/* Quick Demo OTP Auto Fill */}
            <button
              type="button"
              className="btn-demo-pill"
              style={{
                fontSize: '11px',
                padding: '4px 10px',
                background: '#f8fafc',
                border: '1px dashed #94a3b8',
                borderRadius: '6px',
                cursor: 'pointer',
                color: 'var(--color-teal-blue)',
              }}
              onClick={() => {
                setOtpDigits(['1', '2', '3', '4', '5', '6']);
                showToast('Filled demo OTP code: 123456', 'info');
              }}
            >
              <i className="fa-solid fa-wand-magic-sparkles" /> Use Demo Code (123456)
            </button>

            {/* Resend Timer */}
            <div className="otp-resend-row">
              {canResend ? (
                <span>
                  Didn't receive the code?{' '}
                  <button type="button" className="btn-resend-otp" onClick={handleResendOtp}>
                    Resend Code Now
                  </button>
                </span>
              ) : (
                <span>
                  Resend code in <strong style={{ color: 'var(--color-teal-blue)' }}>00:{timerCount < 10 ? `0${timerCount}` : timerCount}</strong>
                </span>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-auth-submit"
              disabled={isLoading || otpDigits.join('').length < 6}
              style={{ marginTop: '6px' }}
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-circle-notch spinner-icon" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <span>Verify &amp; Continue</span>
                  <i className="fa-solid fa-check" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep('request')}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              &larr; Change Email or Mobile
            </button>
          </div>
        </form>
      )}

      {/* 3. New Password Step */}
      {step === 'new_password' && (
        <>
          <div className="auth-header-block">
            <span className="auth-subheading">
              <i className="fa-solid fa-shield-halved" />
              <span>Step 3 of 3</span>
            </span>
            <h2 className="auth-main-title">Set New Password</h2>
            <p className="auth-desc-text">
              Create a new secure password for your BuyBright practitioner account.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleResetSubmit} noValidate>
            <div className="auth-field-group">
              <div className="field-label-row">
                <label htmlFor="new-pass">
                  New Password <span className="req-star">*</span>
                </label>
              </div>
              <div className="auth-input-wrapper">
                <i className="fa-solid fa-lock input-leading-icon" />
                <input
                  id="new-pass"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters with numbers & symbols"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (errors.newPassword) setErrors({ ...errors, newPassword: '' });
                  }}
                  className={errors.newPassword ? 'has-error' : ''}
                  autoFocus
                />
                <button
                  type="button"
                  className="btn-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'} />
                </button>
              </div>
              {errors.newPassword && (
                <span className="field-error-msg">
                  <i className="fa-solid fa-circle-exclamation" /> {errors.newPassword}
                </span>
              )}
            </div>

            <div className="auth-field-group">
              <div className="field-label-row">
                <label htmlFor="conf-new-pass">
                  Confirm New Password <span className="req-star">*</span>
                </label>
              </div>
              <div className="auth-input-wrapper">
                <i className="fa-solid fa-lock-open input-leading-icon" />
                <input
                  id="conf-new-pass"
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
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <span>Save New Password &amp; Login</span>
                  <i className="fa-solid fa-lock" />
                </>
              )}
            </button>
          </form>
        </>
      )}

      {/* 4. Success Step */}
      {step === 'success' && (
        <div className="auth-success-card">
          <div className="success-anim-circle">
            <i className="fa-solid fa-check" />
          </div>

          <h3>Password Updated!</h3>

          <p>
            Your account credentials have been successfully updated. You can now sign in with your new password.
          </p>

          <button
            type="button"
            className="btn-auth-submit"
            onClick={() => navigate('/login')}
            style={{ marginTop: '10px' }}
          >
            <span>Proceed to Sign In</span>
            <i className="fa-solid fa-arrow-right" />
          </button>
        </div>
      )}
    </AuthLayout>
  );
};
