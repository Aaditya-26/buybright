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

const WISHLIST_STORAGE_KEY = 'buybright_wishlist_v2';

export const DEFAULT_WISHLIST_ITEMS: Product[] = [
  {
    id: 'bb-001',
    brand: 'Sony',
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    category: 'electronics',
    price: 24990,
    old_price: 29990,
    discount: '17% Off',
    is_bestseller: true,
    rating: 4.9,
    reviews_count: 2847,
    image: '/images/brands/sony.svg',
    in_stock: true,
  },
  {
    id: 'bb-002',
    brand: 'Nike',
    name: 'Nike Air Max 270 Running Shoes',
    category: 'fashion',
    price: 7995,
    old_price: 10995,
    discount: '27% Off',
    is_bestseller: true,
    rating: 4.8,
    reviews_count: 1234,
    image: '/images/brands/nike.svg',
    in_stock: true,
  },
  {
    id: 'bb-003',
    brand: 'boAt',
    name: 'boAt Airdopes 141 TWS Earbuds with 42H Playback',
    category: 'electronics',
    price: 1299,
    old_price: 2990,
    discount: '57% Off',
    is_bestseller: false,
    rating: 4.6,
    reviews_count: 5621,
    image: '/images/brands/boat.svg',
    in_stock: true,
  },
  {
    id: 'bb-004',
    brand: "L'Oréal",
    name: "L'Oréal Paris Revitalift Serum 30ml",
    category: 'beauty',
    price: 849,
    old_price: 1200,
    discount: '29% Off',
    is_bestseller: false,
    rating: 4.7,
    reviews_count: 892,
    image: '/images/brands/loreal.svg',
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
