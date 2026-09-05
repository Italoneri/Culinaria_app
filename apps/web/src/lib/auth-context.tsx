'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { createSupabaseBrowserClient } from './supabase';

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
  deleteAccount: () => Promise<{ error: string | null }>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signUp = async (email: string, password: string) => {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    // Sem sessão de volta, o projeto exige confirmação por email antes do login
    return { error: error?.message ?? null, needsConfirmation: !error && !data.session };
  };

  const signOut = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
  };

  // O link do email cai no callback, que troca o code por sessão e só então
  // encaminha para /auth/nova-senha — updateUser exige sessão.
  const requestPasswordReset = async (email: string) => {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?redirect=/auth/nova-senha`,
    });
    return { error: error?.message ?? null };
  };

  const updatePassword = async (password: string) => {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password });
    return { error: error?.message ?? null };
  };

  /**
   * Apagar de auth.users exige privilégio que a anon key não tem, daí a RPC
   * delete_own_account, que roda SECURITY DEFINER e só alcança a própria linha.
   * O resto do dado cai pelo ON DELETE CASCADE.
   */
  const deleteAccount = async () => {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.rpc('delete_own_account');
    if (error) return { error: error.message };

    await supabase.auth.signOut();
    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        user, session, loading,
        signIn, signUp, signOut,
        requestPasswordReset, updatePassword, deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
