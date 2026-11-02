/**
 * BuyBright Delivery Location Selection Modal.
 * Features:
 * - "Use my Current Location" (HTML5 Geolocation API with fallback)
 * - Pincode entry with verification and submit
 * - Popular cities quick-select pills
 * - LocalStorage persistence and accessible modal overlay
 */

import React, { useState, useEffect } from 'react';

interface DeliveryLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: string;
  onLocationSelect: (location: string) => void;
}

const POPULAR_CITIES = [
  { city: 'Mumbai', pincode: '400001' },
  { city: 'Delhi', pincode: '110001' },
  { city: 'Bengaluru', pincode: '560001' },
  { city: 'Pune', pincode: '411001' },
  { city: 'Hyderabad', pincode: '500001' },
  { city: 'Chennai', pincode: '600001' },
  { city: 'Ahmedabad', pincode: '380001' },
  { city: 'Kolkata', pincode: '700001' },
];

export const DeliveryLocationModal: React.FC<DeliveryLocationModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onLocationSelect,
}) => {
  const [pincode, setPincode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    if (!cleanPin || cleanPin.length !== 6 || !/^\d+$/.test(cleanPin)) {
      setErrorMsg('Please enter a valid 6-digit Indian pincode');
      return;
    }

    const matchedCity = POPULAR_CITIES.find((c) => c.pincode === cleanPin);
    const locString = matchedCity ? `${matchedCity.city} - ${cleanPin}` : `Pincode - ${cleanPin}`;
    
    localStorage.setItem('prestodental_pincode', cleanPin);
    localStorage.setItem('prestodental_location', locString);
    onLocationSelect(locString);
    setErrorMsg('');
    setPincode('');
    onClose();
  };

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    setErrorMsg('');

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (_position) => {
          setIsLocating(false);
          // In actual production, this can call reverse geocoding API.
          const locString = 'Current Location (Detected)';
          localStorage.setItem('prestodental_location', locString);
          onLocationSelect(locString);
          onClose();
        },
        (_error) => {
          setIsLocating(false);
          // Fallback to default major metro
          const fallback = 'Pune - 411001';
          localStorage.setItem('prestodental_location', fallback);
          onLocationSelect(fallback);
          onClose();
        },
        { timeout: 8000 }
      );
    } else {
      setIsLocating(false);
      setErrorMsg('Geolocation is not supported by your browser');
    }
  };

  const handleSelectCity = (city: string, pin: string) => {
    const locString = `${city} - ${pin}`;
    localStorage.setItem('prestodental_pincode', pin);
    localStorage.setItem('prestodental_location', locString);
    onLocationSelect(locString);
    onClose();
  };

  return (
    <div className="pd-location-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="pd-location-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="location-modal-header">
          <div className="header-title-box">
            <div className="title-pin-icon">
              <i className="fa-solid fa-location-dot" />
            </div>
            <div>
              <h3 className="location-modal-title">Select Delivery Location</h3>
              <p className="location-modal-sub">
                Current: <strong>{currentLocation || 'Select Pincode'}</strong>
              </p>
            </div>
          </div>
          <button type="button" className="btn-close-location-modal" onClick={onClose} aria-label="Close modal">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="location-modal-body">
          {/* Option 1: Use Current Location */}
          <button
            type="button"
            className="btn-use-current-location"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
          >
            <div className="radar-icon-box">
              <i className={`fa-solid ${isLocating ? 'fa-spinner fa-spin' : 'fa-location-crosshairs'}`} />
            </div>
            <div className="btn-text-col">
              <span className="btn-main-label">
                {isLocating ? 'Detecting Location...' : 'Use my Current Location'}
              </span>
              <span className="btn-sub-label">Enable your current location for better delivery estimates</span>
            </div>
          </button>

          {/* Divider */}
          <div className="location-modal-divider">
            <span>or</span>
          </div>

          {/* Option 2: Enter Pincode */}
          <form className="location-pincode-form" onSubmit={handlePincodeSubmit}>
            <label htmlFor="pincode-input" className="pincode-input-label">
              Enter Your Pincode
            </label>
            <div className="pincode-input-group">
              <div className="pin-input-icon">
                <i className="fa-solid fa-map-pin" />
              </div>
              <input
                id="pincode-input"
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit Pincode (e.g. 400001)"
                value={pincode}
                onChange={(e) => {
                  setPincode(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                autoFocus
              />
              <button type="submit" className="btn-submit-pincode">
                SUBMIT
              </button>
            </div>
            {errorMsg && <p className="pincode-error-text">{errorMsg}</p>}
          </form>

          {/* Popular Cities Quick Select */}
          <div className="popular-cities-block">
            <span className="popular-cities-label">Popular Delivery Cities:</span>
            <div className="cities-pills-row">
              {POPULAR_CITIES.map((c) => (
                <button
                  key={c.pincode}
                  type="button"
                  className="city-pill-btn"
                  onClick={() => handleSelectCity(c.city, c.pincode)}
                >
                  <i className="fa-solid fa-building" />
                  <span>{c.city}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
