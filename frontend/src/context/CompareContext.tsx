/**
 * BuyBright Product Comparison Context.
 * Manages side-by-side product comparison list (up to 4 items),
 * with localStorage persistence, add/remove toggles, and modal visibility state.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '../types';
import { useToast } from './ToastContext';

interface CompareContextType {
  compareItems: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  toggleCompare: (product: Product) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
  compareCount: number;
  isCompareModalOpen: boolean;
  openCompareModal: () => void;
  closeCompareModal: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const STORAGE_KEY = 'prestodental_compare_items';
const MAX_COMPARE_ITEMS = 4;

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [compareItems, setCompareItems] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compareItems));
    } catch {
      // Ignore
    }
  }, [compareItems]);

  const isInCompare = (productId: string) => {
    return compareItems.some((item) => String(item.id) === String(productId));
  };

  const addToCompare = (product: Product) => {
    if (isInCompare(product.id)) {
      showToast(`"${product.name.slice(0, 22)}..." is already in comparison!`, 'info');
      return;
    }

    if (compareItems.length >= MAX_COMPARE_ITEMS) {
      showToast(`Comparison limit reached (Max ${MAX_COMPARE_ITEMS} items). Please remove an item first.`, 'warning');
      return;
    }

    setCompareItems((prev) => [...prev, product]);
    showToast(`✓ Added "${product.name.slice(0, 22)}..." to Comparison!`, 'success');
  };

  const removeFromCompare = (productId: string) => {
    setCompareItems((prev) => prev.filter((item) => String(item.id) !== String(productId)));
    showToast('Removed item from comparison.', 'info');
  };

  const toggleCompare = (product: Product) => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const clearCompare = () => {
    setCompareItems([]);
    showToast('Cleared all items from comparison.', 'info');
  };

  const openCompareModal = () => setIsCompareModalOpen(true);
  const closeCompareModal = () => setIsCompareModalOpen(false);

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        isInCompare,
        clearCompare,
        compareCount: compareItems.length,
        isCompareModalOpen,
        openCompareModal,
        closeCompareModal,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
