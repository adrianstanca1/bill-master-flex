import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session, AuthError } from '@supabase/supabase-js';

// Normalizes unknown errors (including network failures) into AuthError objects
const normalizeAuthError = (err: unknown, ctx: string): AuthError => {
  let message = 'Unknown error';
  if (err instanceof Error) {
    // Surfaced when the container cannot reach the Supabase API
    message = (err as any)?.cause?.code === 'ENETUNREACH'
      ? 'Network unreachable. Please check your connection.'
      : err.message;
  } else if (typeof err === 'string') {
    message = err;
  }
  console.error(`${ctx} error:`, message);
  return { name: 'AuthError', message, status: 0 } as AuthError;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;
        setSession(session);
        setUser(session?.user ?? null);
      } catch (err) {
        if (mounted) normalizeAuthError(err, 'getSession');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (err) {
      return { error: normalizeAuthError(err, 'signIn') };
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: userData ? { data: userData } : undefined,
      });
      return { error };
    } catch (err) {
      return { error: normalizeAuthError(err, 'signUp') };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (err) {
      return { error: normalizeAuthError(err, 'signOut') };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { error };
    } catch (err) {
      return { error: normalizeAuthError(err, 'resetPassword') };
    }
  };

  const signInWithOAuth = async (provider: 'google' | 'azure' | 'github' | 'custom') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider === 'custom' ? 'google' : provider,
      });
      return { error };
    } catch (err) {
      return { error: normalizeAuthError(err, 'signInWithOAuth') };
    }
  };

  return {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    resetPassword,
    signInWithOAuth,
  };
}