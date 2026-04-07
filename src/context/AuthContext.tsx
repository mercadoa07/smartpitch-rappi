import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { User } from '../types';
import { upsertUser } from '../lib/queries';

interface AuthContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
  authError: string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSession = async (authUser: SupabaseUser) => {
    const email = authUser.email ?? '';
    if (!email.endsWith('@rappi.com')) {
      setAuthError('Solo se permiten correos @rappi.com');
      await supabase.auth.signOut();
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const fullName =
        authUser.user_metadata?.full_name ??
        authUser.user_metadata?.name ??
        '';
      const dbUser = await upsertUser(email, fullName);
      setUser(dbUser);
      setAuthError(null);
    } catch {
      setAuthError('Error de conexión. Intenta nuevamente.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleSession(session.user);
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session: Session | null) => {
        if (session?.user) {
          await handleSession(session.user);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('smartpitch_negociacion');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isLoading, authError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
