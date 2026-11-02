/**
 * BuyBright Wishlist Context.
 * Provides global reactive wishlist state, persistent local storage,
 * toggle actions, item count for navbar badges, and toast feedback.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Product } from '../types';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlist: Product[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  clearWishlist: () => void;
}

const WISHLIST_STORAGE_KEY = 'prestodental_wishlist';

export const DEFAULT_WISHLIST_ITEMS: Product[] = [
  {
    id: 'mat-001',
    brand: 'Superendo',
    name: 'Superendo Gold Rotary NiTi Flex Files (Pack of 6)',
    category: 'endodontics',
    price: 1850,
    old_price: 2450,
    discount: '25% Off',
    is_bestseller: true,
    rating: 4.9,
    reviews_count: 84,
    image: '/images/cat_endodontic_1787401934680.jpg',
    in_stock: true,
  },
  {
    id: 'mat-002',
    brand: '3M ESPE',
    name: '3M Filtek Z350 XT Universal Restorative Composite Syringe 4g',
    category: 'materials',
    price: 2350,
    old_price: 2900,
    discount: '19% Off',
    is_bestseller: true,
    rating: 4.8,
    reviews_count: 128,
    image: '/images/cat_materials_1787401998270.jpg',
    in_stock: true,
  },
  {
    id: 'mat-004',
    brand: 'Woodpecker',
    name: 'Woodpecker DTE D600 LED Ultrasonic Scaler Handpiece Kit',
    category: 'equipment',
    price: 8900,
    old_price: 11500,
    discount: '23% Off',
    is_bestseller: false,
    rating: 4.7,
    reviews_count: 52,
    image: '/images/cat_handpieces_1787401976899.jpg',
    in_stock: true,
  },
  {
    id: 'mat-005',
    brand: 'Superendo',
    name: 'Superendo Dental Dam Rubber Clamp Starter Set (12 Pcs)',
    category: 'consumables',
    price: 1450,
    old_price: 1950,
    discount: '26% Off',
    is_bestseller: false,
    rating: 4.6,
    reviews_count: 38,
    image: '/images/cat_consumables_1787401910059.jpg',
    in_stock: true,
  },
];

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      return DEFAULT_WISHLIST_ITEMS;
    } catch {
      return DEFAULT_WISHLIST_ITEMS;
    }
  });

  const { showToast } = useToast();

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Failed to persist wishlist to localStorage', e);
    }
  }, [wishlist]);

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some((item) => String(item.id) === String(productId));
  };

  const addToWishlist = (product: Product) => {
    if (!isInWishlist(product.id)) {
      setWishlist((prev) => [product, ...prev]);
      showToast(
        `Added "${product.name.slice(0, 24)}..." to your wishlist.`,
        'success',
        'Saved to Wishlist'
      );
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => String(item.id) !== String(productId)));
    showToast('Item removed from your wishlist.', 'info');
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
    showToast('Wishlist has been cleared.', 'info');
  };

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
