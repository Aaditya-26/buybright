/**
 * BuyBright Festival Theme Context & State Manager.
 * Synchronizes active festival theme, live announcement bar, particle effects,
 * floating festive ribbon, and discount configuration across the entire web application.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { FestivalTheme } from '../types/festival';
import {
  getStoredFestivalThemes,
  getActiveFestivalTheme,
  setActiveFestivalTheme,
  saveOrUpdateFestivalTheme,
  deleteFestivalTheme,
  resetFestivalThemesToDefaults,
} from '../admin/data/festivalData';

interface FestivalContextType {
  festivals: FestivalTheme[];
  activeFestival: FestivalTheme | null;
  activateFestival: (id: string) => void;
  deactivateFestival: (id: string) => void;
  saveFestival: (theme: Partial<FestivalTheme>) => FestivalTheme;
  removeFestival: (id: string) => void;
  resetDefaults: () => void;
  refreshFestivals: () => void;
  isFestivalBannerDismissed: boolean;
  dismissFestivalBanner: () => void;
  showFestivalOfferModal: boolean;
  setShowFestivalOfferModal: (show: boolean) => void;
}

const FestivalContext = createContext<FestivalContextType | undefined>(undefined);

export const FestivalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [festivals, setFestivals] = useState<FestivalTheme[]>(() => getStoredFestivalThemes());
  const [activeFestival, setActiveFestival] = useState<FestivalTheme | null>(() => getActiveFestivalTheme());
  const [isFestivalBannerDismissed, setIsFestivalBannerDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('prestodental_fest_banner_dismissed') === 'true';
    } catch {
      return false;
    }
  });
  const [showFestivalOfferModal, setShowFestivalOfferModal] = useState<boolean>(false);

  const refreshFestivals = useCallback(() => {
    const all = getStoredFestivalThemes();
    setFestivals(all);
    setActiveFestival(all.find((f) => f.status === 'Active') || null);
  }, []);

  // Listen to custom storage update events across components
  useEffect(() => {
    const handleStorageUpdate = () => {
      refreshFestivals();
    };
    window.addEventListener('prestodental_festival_update', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);
    return () => {
      window.removeEventListener('prestodental_festival_update', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, [refreshFestivals]);

  const activateFestival = (id: string) => {
    const updated = setActiveFestivalTheme(id, true);
    setFestivals(updated);
    setActiveFestival(updated.find((f) => f.status === 'Active') || null);
    setIsFestivalBannerDismissed(false);
    try {
      sessionStorage.removeItem('prestodental_fest_banner_dismissed');
    } catch {}
  };

  const deactivateFestival = (id: string) => {
    const updated = setActiveFestivalTheme(id, false);
    setFestivals(updated);
    setActiveFestival(updated.find((f) => f.status === 'Active') || null);
  };

  const saveFestival = (theme: Partial<FestivalTheme>): FestivalTheme => {
    const saved = saveOrUpdateFestivalTheme(theme);
    refreshFestivals();
    return saved;
  };

  const removeFestival = (id: string) => {
    const updated = deleteFestivalTheme(id);
    setFestivals(updated);
    setActiveFestival(updated.find((f) => f.status === 'Active') || null);
  };

  const resetDefaults = () => {
    const defs = resetFestivalThemesToDefaults();
    setFestivals(defs);
    setActiveFestival(defs.find((f) => f.status === 'Active') || null);
  };

  const dismissFestivalBanner = () => {
    setIsFestivalBannerDismissed(true);
    try {
      sessionStorage.setItem('prestodental_fest_banner_dismissed', 'true');
    } catch {}
  };

  return (
    <FestivalContext.Provider
      value={{
        festivals,
        activeFestival,
        activateFestival,
        deactivateFestival,
        saveFestival,
        removeFestival,
        resetDefaults,
        refreshFestivals,
        isFestivalBannerDismissed,
        dismissFestivalBanner,
        showFestivalOfferModal,
        setShowFestivalOfferModal,
      }}
    >
      {children}
    </FestivalContext.Provider>
  );
};

export const useFestival = (): FestivalContextType => {
  const context = useContext(FestivalContext);
  if (!context) {
    throw new Error('useFestival must be used within a FestivalProvider');
  }
  return context;
};
