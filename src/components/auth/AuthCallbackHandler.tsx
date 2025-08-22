import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export function AuthCallbackHandler() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
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
          toast({
            title: "Welcome!",
            description: "Successfully signed in."
          });
          
          // Check if user setup is complete
          const { data: setupData } = await supabase.rpc('is_setup_complete');
          const redirectTo = setupData ? '/dashboard' : '/setup';
          
          navigate(redirectTo, { replace: true });
        } else {
          navigate('/auth');
        }
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