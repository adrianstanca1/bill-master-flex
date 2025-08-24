import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session, AuthError } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (err) {
      console.error('signIn error:', err);
      return { error: err as AuthError };
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
      console.error('signUp error:', err);
      return { error: err as AuthError };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (err) {
      console.error('signOut error:', err);
      return { error: err as AuthError };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { error };
    } catch (err) {
      console.error('resetPassword error:', err);
      return { error: err as AuthError };
    }
  };

  const signInWithOAuth = async (provider: 'google' | 'azure' | 'github' | 'custom') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider === 'custom' ? 'google' : provider,
      });
      return { error };
    } catch (err) {
      console.error('signInWithOAuth error:', err);
      return { error: err as AuthError };
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