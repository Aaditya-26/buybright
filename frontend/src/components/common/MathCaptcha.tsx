/**
 * BuyBright Responsive Math Captcha Component.
 * Features:
 * - Dynamic generation of simple arithmetic challenges (Addition & Subtraction)
 * - Anti-bot security validation
 * - Instant feedback and refresh capability with rotation animation
 * - WCAG accessible form field with proper labels & ARIA attributes
 * - Fully responsive design tailored to the BuyBright design system
 */

import React, { useState, useEffect, useCallback } from 'react';

export interface MathCaptchaProps {
  id?: string;
  onValidChange?: (isValid: boolean) => void;
  value?: string;
  onChange?: (val: string, isValid: boolean) => void;
  error?: string;
  className?: string;
  required?: boolean;
}

export const MathCaptcha: React.FC<MathCaptchaProps> = ({
  id = 'math-captcha',
  onValidChange,
  value: controlledValue,
  onChange,
  error,
  className = '',
  required = true,
}) => {
  const [num1, setNum1] = useState<number>(0);
  const [num2, setNum2] = useState<number>(0);
  const [operator, setOperator] = useState<'+' | '-'>('+');
  const [internalValue, setInternalValue] = useState<string>('');
  const [isRotating, setIsRotating] = useState<boolean>(false);

  const inputValue = controlledValue !== undefined ? controlledValue : internalValue;

  const generateCaptcha = useCallback(() => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 500);

    const isAddition = Math.random() > 0.35;
    if (isAddition) {
      const a = Math.floor(Math.random() * 9) + 1;
      const b = Math.floor(Math.random() * 9) + 1;
      setNum1(a);
      setNum2(b);
      setOperator('+');
    } else {
      const a = Math.floor(Math.random() * 9) + 3;
      const b = Math.floor(Math.random() * (a - 1)) + 1;
      setNum1(a);
      setNum2(b);
      setOperator('-');
    }

    if (controlledValue === undefined) {
      setInternalValue('');
    }
    if (onValidChange) onValidChange(false);
  }, [controlledValue, onValidChange]);

  useEffect(() => {
    generateCaptcha();
  }, []);

  const correctAnswer = operator === '+' ? num1 + num2 : num1 - num2;
  const isCorrect = inputValue.trim() !== '' && parseInt(inputValue.trim(), 10) === correctAnswer;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    const valid = val !== '' && parseInt(val, 10) === correctAnswer;

    if (controlledValue === undefined) {
      setInternalValue(val);
    }
    if (onChange) {
      onChange(val, valid);
    }
    if (onValidChange) {
      onValidChange(valid);
    }
  };

  return (
    <div className={`pd-math-captcha-wrapper ${className}`}>
      <div className="captcha-label-row">
        <label htmlFor={id} className="captcha-label">
          <i className="fa-solid fa-shield-halved text-teal" />
          <span>Security Verification</span>
          {required && <span className="req-star" style={{ color: '#cf4032', marginLeft: '4px' }}>*</span>}
        </label>
        <span className="captcha-hint">Solve math problem</span>
      </div>

      <div className="captcha-interactive-box">
        {/* Expression Badge */}
        <div className="captcha-expression-badge" aria-label={`Math problem: ${num1} ${operator} ${num2}`}>
          <span className="expr-num">{num1}</span>
          <span className="expr-op">{operator}</span>
          <span className="expr-num">{num2}</span>
          <span className="expr-eq">=</span>
          <span className="expr-target">?</span>
        </div>

        {/* Reload Button */}
        <button
          type="button"
          onClick={generateCaptcha}
          className={`captcha-refresh-btn ${isRotating ? 'rotating' : ''}`}
          title="Generate new security math challenge"
          aria-label="Generate new security math challenge"
        >
          <i className="fa-solid fa-arrows-rotate" />
        </button>

        {/* User Input Answer */}
        <div className={`captcha-input-container ${error ? 'has-error' : ''} ${isCorrect ? 'is-valid' : ''}`}>
          <input
            type="text"
            id={id}
            name="mathCaptchaAnswer"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={3}
            placeholder="Answer"
            value={inputValue}
            onChange={handleInputChange}
            className="captcha-input-field"
            autoComplete="off"
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
          />
          {isCorrect && (
            <span className="captcha-valid-badge" title="Verification Passed">
              <i className="fa-solid fa-circle-check" />
            </span>
          )}
        </div>
      </div>

      {error && (
        <span id={`${id}-error`} className="captcha-error-msg" role="alert">
          <i className="fa-solid fa-circle-exclamation" /> {error}
        </span>
      )}
    </div>
  );
};
