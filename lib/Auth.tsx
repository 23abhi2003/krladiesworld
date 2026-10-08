'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from './types';

export const AUTH_STORAGE_KEY = 'kr_ladies_world_auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (phoneOrUsername: string, pin: string) => boolean;
  logout: () => void;
  isOwner: boolean;
  isStaff: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => false,
  logout: () => {},
  isOwner: false,
  isStaff: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage if previously logged in (NO AUTO-LOGIN)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (phoneOrUsername: string, pin = ''): boolean => {
    const cleanIdentifier = phoneOrUsername.replace(/\s+/g, '').toLowerCase();
    const cleanPin = pin.trim();

    let authenticatedUser: User | null = null;

    // Owner Login: Phone 7661852180, PIN 1984 (or username owner, PIN 1984)
    if (
      (cleanIdentifier === '7661852180' || cleanIdentifier === 'owner') &&
      cleanPin === '1984'
    ) {
      authenticatedUser = {
        name: 'Owner (KR Ladies World)',
        role: 'owner',
        phone: '7661852180',
      };
    } else if (
      (cleanIdentifier === 'staff' || cleanIdentifier === 'counter') &&
      (cleanPin === '1234' || cleanPin === 'staff')
    ) {
      authenticatedUser = {
        name: 'Counter Staff',
        role: 'staff',
      };
    }

    if (authenticatedUser) {
      setUser(authenticatedUser);
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authenticatedUser));
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const isOwner = user?.role === 'owner';
  const isStaff = user?.role === 'staff';

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isOwner, isStaff }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
