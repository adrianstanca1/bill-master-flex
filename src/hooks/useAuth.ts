import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session, AuthError, OAuthResponse } from '@supabase/supabase-js';

export interface AuthResult<T> {
  data: T | null;
  error: AuthError | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const ensureUserProfile = async (user: User, meta?: Record<string, any>) => {
    try {
      const { data: existing, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();
      if (error) {
        console.warn('Profile lookup failed', error);
        return;
      }
      if (!existing) {
        const metadata = { ...user.user_metadata, ...meta };
        const firstName = metadata.first_name || null;
        const lastName = metadata.last_name || null;
        const fullName =
          metadata.full_name ||
          [firstName, lastName].filter(Boolean).join(' ') ||
          null;
        const profile: Record<string, any> = {
          id: user.id,
          email: user.email,
          full_name: fullName,
        };
        if (firstName) profile.first_name = firstName;
        if (lastName) profile.last_name = lastName;
        const { error: insertError } = await supabase.from('profiles').insert(profile);
        if (insertError) {
          console.warn('Failed to create profile', insertError);
          // Retry with minimal fields in case first/last name columns don't exist
          const minimalProfile = { id: user.id, email: user.email, full_name: fullName };
          const { error: minimalError } = await supabase.from('profiles').insert(minimalProfile);
          if (minimalError) {
            console.warn('Failed to create minimal profile', minimalError);
          }
        }
      }
    } catch (err) {
      console.warn('Failed to ensure user profile', err);
    }
  };

  useEffect(() => {
    let active = true;

    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!active) return;
        if (!error) {
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            await ensureUserProfile(session.user);
          }
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!active) return;
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user && (event === 'SIGNED_IN' || event === 'SIGNED_UP')) {
          await ensureUserProfile(session.user);
        }
      }
    );

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<AuthResult<User>> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error) {
        setSession(data.session);
        setUser(data.user);
        if (data.user) {
          await ensureUserProfile(data.user);
        }
      }
      return { data: data?.user ?? null, error };
    } catch (err) {
      return { data: null, error: err as AuthError };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userData?: Record<string, any>
  ): Promise<AuthResult<User>> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          ...(userData ? { data: userData } : {})
        },
      });
      if (!error && data.session) {
        setSession(data.session);
        setUser(data.user);
        if (data.user) {
          await ensureUserProfile(data.user, userData);
        }
      }
      return { data: data?.user ?? null, error };
    } catch (err) {
      return { data: null, error: err as AuthError };
    }
  };

  const signOut = async (): Promise<AuthResult<null>> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        setSession(null);
        setUser(null);
      }
      return { data: null, error };
    } catch (err) {
      return { data: null, error: err as AuthError };
    }
  };

  const resetPassword = async (
    email: string,
    redirectTo: string = `${window.location.origin}/auth/reset-password`
  ): Promise<AuthResult<null>> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      return { data: null, error };
    } catch (err) {
      return { data: null, error: err as AuthError };
    }
  };

  const signInWithOAuth = async (
    provider: 'google' | 'github' | 'apple',
    redirectTo: string = window.location.origin
  ): Promise<AuthResult<any>> => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo },
      });
      return { data, error };
    } catch (err) {
      return { data: null, error: err as AuthError };
    }
  };

  return {
    user,
    session,
    loading,
    isAuthenticated: !!session,
    signIn,
    signUp,
    signOut,
    resetPassword,
    signInWithOAuth,
  };
}

