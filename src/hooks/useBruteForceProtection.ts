import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useBruteForceProtection() {
  const [isBlocked, setIsBlocked] = useState(false);
  const { toast } = useToast();

  const checkBruteForce = useCallback(async (userId?: string) => {
    if (!userId) return false;

    try {
      const { data, error } = await supabase.rpc('detect_brute_force_attempts', {
        check_user_id: userId
      });

      if (error) {
        console.error('Brute force check error:', error);
        return false;
      }

      if (data) {
        setIsBlocked(true);
        toast({
          title: "Account Temporarily Locked",
          description: "Too many failed attempts. Please try again in 15 minutes.",
          variant: "destructive"
        });

        // Log brute force detection
        await supabase.from('security_audit_log').insert({
          action: 'BRUTE_FORCE_DETECTED',
          resource_type: 'authentication',
          details: {
            user_id: userId,
            timestamp: new Date().toISOString(),
            lockout_duration: '15 minutes'
          }
        });

        return true;
      }

      setIsBlocked(false);
      return false;
    } catch (error) {
      console.error('Brute force protection error:', error);
      return false;
    }
  }, [toast]);

  const logFailedAttempt = useCallback(async (email: string, attemptType: 'login' | 'password_reset' = 'login') => {
    try {
      await supabase.from('security_audit_log').insert({
        action: attemptType === 'login' ? 'LOGIN_FAILED' : 'PASSWORD_RESET_FAILED',
        resource_type: 'authentication',
        details: {
          email,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          ip_info: 'client_side_logging'
        }
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }, []);

  return {
    isBlocked,
    checkBruteForce,
    logFailedAttempt
  };
}