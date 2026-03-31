import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('smartpitch_user');
    if (stored) {
      try {
        setUserState(JSON.parse(stored));
      } catch {
        localStorage.removeItem('smartpitch_user');
      }
    }
    setIsLoading(false);
  }, []);

  const setUser = (u: User | null) => {
    setUserState(u);
    if (u) {
      localStorage.setItem('smartpitch_user', JSON.stringify(u));
    } else {
      localStorage.removeItem('smartpitch_user');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('smartpitch_negociacion');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
