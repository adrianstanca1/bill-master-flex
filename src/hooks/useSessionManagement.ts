
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SessionConfig {
  timeoutMinutes: number;
  warningMinutes: number;
  enableWarning: boolean;
}

export function useSessionManagement(config: SessionConfig = {
  timeoutMinutes: 60,
  warningMinutes: 5,
  enableWarning: true
}) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const warningRef = useRef<NodeJS.Timeout>();
  const lastActivityRef = useRef<number>(Date.now());
  const { toast } = useToast();

  const resetTimer = () => {
    lastActivityRef.current = Date.now();
    
    // Clear existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);

    // Set warning timer
    if (config.enableWarning) {
      warningRef.current = setTimeout(() => {
        toast({
          title: "Session expiring soon",
          description: `Your session will expire in ${config.warningMinutes} minutes due to inactivity`,
          variant: "destructive",
        });
      }, (config.timeoutMinutes - config.warningMinutes) * 60 * 1000);
    }

    // Set timeout timer
    timeoutRef.current = setTimeout(async () => {
      toast({
        title: "Session expired",
        description: "You have been logged out due to inactivity",
        variant: "destructive",
      });
      
      await supabase.auth.signOut();
    }, config.timeoutMinutes * 60 * 1000);
  };

  const handleActivity = () => {
    resetTimer();
  };

  useEffect(() => {
    // Check if user is authenticated
    const { data: { session } } = supabase.auth.getSession();
    if (!session) return;

    // Set up activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Initialize timer
    resetTimer();

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
    };
  }, [config.timeoutMinutes, config.warningMinutes, config.enableWarning]);

  return {
    getLastActivity: () => lastActivityRef.current,
    resetTimer,
    getTimeUntilExpiry: () => {
      const elapsed = Date.now() - lastActivityRef.current;
      const remaining = (config.timeoutMinutes * 60 * 1000) - elapsed;
      return Math.max(0, remaining);
    }
  };
}
