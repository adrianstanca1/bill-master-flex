import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export function AuthCallbackHandler() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log('AuthCallbackHandler mounted, starting auth callback handling');

    const handleAuthCallback = async () => {
      try {
        // Extract authorization code and state from URL
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');

        console.log('Exchanging code for session...', { code, state });

        if (code && state) {
          const { data, error } = await supabase.auth.exchangeCodeForSession({ code, state });

          if (error) {
            console.error('Auth callback error:', error);
            toast({
              title: "Authentication Error",
              description: error.message,
              variant: "destructive"
            });
            navigate('/auth');
            return;
          }

          if (data.session) {
            console.log('Session found, user authenticated:', data.session.user?.email);
            toast({
              title: "Welcome!",
              description: "Successfully signed in."
            });

            console.log('User authenticated, redirecting to dashboard');
            navigate('/dashboard', { replace: true });
            return;
          }
        }

        console.log('No session found after code exchange, redirecting to auth');
        navigate('/auth');
      } catch (err) {
        console.error('Callback handling error:', err);
        toast({
          title: "Error",
          description: "An unexpected error occurred during authentication.",
          variant: "destructive"
        });
        navigate('/auth');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
}
