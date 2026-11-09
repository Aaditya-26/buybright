/**
 * Custom React Hook for Admin Authentication Management.
 * Manages admin session persistence, login verification, and role-based permissions.
 */

import { useState, useEffect, useCallback } from 'react';

export interface AdminUserSession {
  email: string;
  name: string;
  role: string;
  avatar: string;
  lastLogin: string;
}

const DEFAULT_ADMIN: AdminUserSession = {
  email: 'admin@.com',
  name: '  Admin Director',
  role: 'Super Administrator',
  avatar: 'AD',
  lastLogin: new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }),
};

const AUTH_STORAGE_KEY = 'buybright_admin_authenticated';
const USER_STORAGE_KEY = 'buybright_admin_user';

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [adminUser, setAdminUser] = useState<AdminUserSession | null>(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState<boolean>(false);

  // Sync state with storage
  useEffect(() => {
    try {
      const auth = localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
      setIsAuthenticated(auth);
      if (auth && !adminUser) {
        setAdminUser(DEFAULT_ADMIN);
      }
    } catch {
      setIsAuthenticated(false);
    }
  }, [adminUser]);

  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
      setLoading(true);

      // Simulate authentication API latency
      await new Promise((resolve) => setTimeout(resolve, 800));

      const validEmail = email.trim().toLowerCase();
      const validPass = password.trim();

      // Accepts standard demo credentials or matching credentials
      if (
        (validEmail === 'admin@.com' || validEmail === 'admin') &&
        (validPass === '123456' || validPass === 'presto2026')
      ) {
        const user: AdminUserSession = {
          ...DEFAULT_ADMIN,
          email: validEmail.includes('@') ? validEmail : 'admin@.com',
          lastLogin: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };

        try {
          localStorage.setItem(AUTH_STORAGE_KEY, 'true');
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        } catch {}

        setIsAuthenticated(true);
        setAdminUser(user);
        setLoading(false);
        return { success: true };
      }

      setLoading(false);
      return {
        success: false,
        message: 'Invalid administrator credentials. Please check your email and password.',
      };
    },
    []
  );

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch {}
    setIsAuthenticated(false);
    setAdminUser(null);
  }, []);

  return {
    isAuthenticated,
    adminUser,
    loading,
    login,
    logout,
  };
};
