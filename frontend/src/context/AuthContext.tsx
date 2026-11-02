/**
 * BuyBright Global Authentication Context.
 * Manages user session, dental practitioner profiles, login, registration, and logout.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthUser, LoginCredentials, RegisterData } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message?: string }>;
  loginAsDemo: (role?: 'dentist' | 'clinic' | 'admin') => Promise<void>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<AuthUser>) => void;
  requestPasswordReset: (identifier: string) => Promise<{ success: boolean; message?: string }>;
  verifyResetOtp: (otp: string) => Promise<{ success: boolean; message?: string }>;
  resetPassword: (newPassword: string) => Promise<{ success: boolean; message?: string }>;
}

const STORAGE_KEY = 'buybright_auth_user';

const DEMO_USERS: Record<string, AuthUser> = {
  dentist: {
    id: 'usr_doc_01',
    name: '  John Doe',
    email: ' johndoe@buybright.com',
    phone: '+91 98765 43210',
    role: 'dentist',
    clinicName: 'Apex Dental Care & Multispeciality Clini',
    dciNumber: 'MH-DCI-48291',
    gstin: '27AABCU9603R1ZM',
    city: 'Mumbai',
    state: 'Maharashtra',
    isVerified: true,
  },
  clinic: {
    id: 'usr_clinic_02',
    name: '  Ananya Iyer',
    email: 'contact@pearlsdental.in',
    phone: '+91 98200 11223',
    role: 'clinic',
    clinicName: 'Pearls Multispeciality Dental Institute',
    dciNumber: 'KA-DCI-77120',
    gstin: '29AAACP1234K1Z5',
    city: 'Bangalore',
    state: 'Karnataka',
    isVerified: true,
  },
  admin: {
    id: 'usr_admin_00',
    name: 'BuyBright Platform Admin',
    email: 'admin@.com',
    phone: '+91 88064 88054',
    role: 'admin',
    clinicName: 'BuyBright Head Office',
    city: 'Pune',
    state: 'Maharashtra',
    isVerified: true,
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed.name &&
          (parsed.name.toLowerCase().includes('dnyan') ||
            parsed.name.toLowerCase().includes('potghan') ||
            parsed.name.toLowerCase().includes('rajesh'))
        ) {
          parsed.name = '  John Doe';
          parsed.email = ' johndoe@buybright.com';
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }
        return parsed;
      }
      return DEMO_USERS.dentist;
    } catch {
      return DEMO_USERS.dentist;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 600)); // Smooth UX transition delay

    const id = credentials.identifier.trim().toLowerCase();

    // Check if matching demo doctor credentials or general valid entry
    if (id.includes('admin')) {
      const adminUser = DEMO_USERS.admin;
      setUser(adminUser);
      setIsLoading(false);
      return { success: true, message: `Welcome back, ${adminUser.name}!` };
    }

    if (id.includes('pearls') || id.includes('ananya')) {
      const clinicUser = DEMO_USERS.clinic;
      setUser(clinicUser);
      setIsLoading(false);
      return { success: true, message: `Welcome back, ${clinicUser.name}!` };
    }

    // Default dynamic user creation for any dentist signing in
    const isPhone = /^[0-9+ ]+$/.test(credentials.identifier);
    const dynamicUser: AuthUser = {
      id: `usr_${Date.now()}`,
      name: isPhone ? '  Practicing Dentist' : (credentials.identifier.split('@')[0].replace('.', ' ').replace(/^./, (c) => c.toUpperCase())),
      email: isPhone ? 'dentist@clinic.com' : credentials.identifier,
      phone: isPhone ? credentials.identifier : '+91 98765 43210',
      role: 'dentist',
      clinicName: 'Presto Partner Dental Clinic',
      dciNumber: 'DCI-REG-99120',
      city: 'Mumbai',
      state: 'Maharashtra',
      isVerified: true,
    };

    setUser(dynamicUser);
    setIsLoading(false);
    return { success: true, message: `Welcome back to BuyBright, ${dynamicUser.name}!` };
  };

  const loginAsDemo = async (role: 'dentist' | 'clinic' | 'admin' = 'dentist') => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 350));
    const demoUser = DEMO_USERS[role] || DEMO_USERS.dentist;
    setUser(demoUser);
    setIsLoading(false);
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 500));

    const newUser: AuthUser = {
      id: `usr_${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role || 'dentist',
      clinicName: data.clinicName || '',
      city: data.city || '',
      isVerified: true,
    };

    setUser(newUser);
    setIsLoading(false);
    return { success: true, message: `Account created successfully! Welcome, ${newUser.name}.` };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateProfile = (data: Partial<AuthUser>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  const requestPasswordReset = async (identifier: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 600));
    setIsLoading(false);
    return {
      success: true,
      message: `A 6-digit verification code has been dispatched to ${identifier}.`,
    };
  };

  const verifyResetOtp = async (otp: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 500));
    setIsLoading(false);
    if (otp.length === 6) {
      return { success: true, message: 'OTP verified successfully!' };
    }
    return { success: false, message: 'Invalid 6-digit OTP code. Please try again.' };
  };

  const resetPassword = async (newPassword: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 600));
    setIsLoading(false);
    if (newPassword.length >= 6) {
      return { success: true, message: 'Your password has been reset successfully. You can now login.' };
    }
    return { success: false, message: 'Password must be at least 6 characters.' };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginAsDemo,
        register,
        logout,
        updateProfile,
        requestPasswordReset,
        verifyResetOtp,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
