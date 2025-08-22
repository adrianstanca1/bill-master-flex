import { useState, useEffect, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  signInWithOAuth: (provider: 'google' | 'azure' | 'github') => Promise<{ error: AuthError | null }>;
}

export function useAuth(): AuthState & AuthActions {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const isAuthenticated = !!session?.user;

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Log authentication events for security monitoring
        if (session?.user && event === 'SIGNED_IN') {
          setTimeout(async () => {
            try {
              await supabase.from('security_audit_log').insert({
                action: 'SIGN_IN',
                resource_type: 'auth',
                details: { 
                  sign_in_time: new Date().toISOString(),
                  user_agent: navigator.userAgent,
                  location: window.location.pathname
                }
              });
            } catch (error) {
              console.warn('Failed to log sign in event:', error);
            }
          }, 0);
        }
      }
    );

    // THEN check for existing session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
        }
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to get session:', err);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        let message = 'An error occurred during sign in';
        
        if (error.message.includes('Invalid login credentials')) {
          message = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('Email not confirmed')) {
          message = 'Please check your email and confirm your account before signing in.';
        } else if (error.message.includes('Too many requests')) {
          message = 'Too many sign in attempts. Please wait a moment and try again.';
        }

        toast({
          title: "Sign In Error",
          description: message,
          variant: "destructive"
        });
      } else if (data.session) {
        toast({
          title: "Welcome back!",
          description: "Successfully signed in."
        });
      }

      return { error };
    } catch (err: any) {
      console.error('Sign in error:', err);
      toast({
        title: "Sign In Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      return { error: err };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const signUp = useCallback(async (email: string, password: string, userData: any = {}) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            first_name: userData.firstName || '',
            last_name: userData.lastName || '',
            ...userData
          }
        }
      });

      if (error) {
        let message = 'An error occurred during sign up';
        
        if (error.message.includes('User already registered')) {
          message = 'This email is already registered. Try signing in instead.';
        } else if (error.message.includes('Password should be at least')) {
          message = 'Password should be at least 6 characters long.';
        } else if (error.message.includes('Invalid email')) {
          message = 'Please enter a valid email address.';
        }

        toast({
          title: "Sign Up Error",
          description: message,
          variant: "destructive"
        });
      } else if (data.session) {
        toast({
          title: "Welcome!",
          description: "Account created successfully."
        });

        // Send welcome email
        setTimeout(async () => {
          try {
            await supabase.functions.invoke('welcome-email', {
              body: {
                email: email.trim(),
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                userId: data.user?.id
              }
            });
          } catch (emailError) {
            console.warn('Failed to send welcome email:', emailError);
          }
        }, 0);
      } else if (data.user && !data.session) {
        toast({
          title: "Check your email",
          description: "Please check your email to confirm your account before signing in."
        });
      }

      return { error };
    } catch (err: any) {
      console.error('Sign up error:', err);
      toast({
        title: "Sign Up Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      return { error: err };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const signOut = useCallback(async () => {
    try {
      // Log sign out event
      if (user?.id) {
        try {
          await supabase.from('security_audit_log').insert({
            action: 'SIGN_OUT',
            resource_type: 'auth',
            details: { 
              sign_out_time: new Date().toISOString(),
              user_agent: navigator.userAgent
            }
          });
        } catch (logError) {
          console.warn('Failed to log sign out event:', logError);
        }
      }

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Sign Out Error",
          description: "Failed to sign out. Please try again.",
          variant: "destructive"
        });
      }

      return { error };
    } catch (err: any) {
      console.error('Sign out error:', err);
      toast({
        title: "Sign Out Error",
        description: "An unexpected error occurred during sign out.",
        variant: "destructive"
      });
      return { error: err };
    }
  }, [user?.id, toast]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        toast({
          title: "Reset Password Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Reset Email Sent",
          description: "Please check your email for password reset instructions."
        });
      }

      return { error };
    } catch (err: any) {
      console.error('Reset password error:', err);
      toast({
        title: "Reset Password Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      return { error: err };
    }
  }, [toast]);

  const signInWithOAuth = useCallback(async (provider: 'google' | 'azure' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        toast({
          title: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Sign In Error`,
          description: error.message,
          variant: "destructive"
        });
      }

      return { error };
    } catch (err: any) {
      console.error(`${provider} OAuth error:`, err);
      toast({
        title: "OAuth Error",
        description: "An unexpected error occurred during OAuth sign in.",
        variant: "destructive"
      });
      return { error: err };
    }
  }, [toast]);

  return {
    user,
    session,
    loading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    resetPassword,
    signInWithOAuth
  };
}