import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SecurityStatus {
  passwordProtectionEnabled: boolean;
  mfaEnabled: boolean;
  sessionValid: boolean;
  lastSecurityCheck: Date | null;
}

export function useSecurityEnhancements() {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    passwordProtectionEnabled: false,
    mfaEnabled: false,
    sessionValid: false,
    lastSecurityCheck: null
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const checkSecurityStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setSecurityStatus(prev => ({
          ...prev,
          sessionValid: false,
          lastSecurityCheck: new Date()
        }));
        return;
      }

      // Check session validity using our enhanced validation
      const { data: sessionCheck } = await supabase.rpc('validate_session_security');
      
      const sessionData = sessionCheck as any;
      
      setSecurityStatus({
        passwordProtectionEnabled: false, // This needs to be enabled in Supabase settings
        mfaEnabled: user.app_metadata?.providers?.includes('phone') || false,
        sessionValid: sessionData?.valid || false,
        lastSecurityCheck: new Date()
      });

      // Log security check
      await supabase.from('security_audit_log').insert({
        action: 'SECURITY_STATUS_CHECK',
        resource_type: 'authentication',
        details: {
          timestamp: new Date().toISOString(),
          session_valid: sessionData?.valid || false,
          requires_setup: sessionData?.requires_setup || false
        }
      });

    } catch (error) {
      console.error('Security status check failed:', error);
      setSecurityStatus(prev => ({
        ...prev,
        sessionValid: false,
        lastSecurityCheck: new Date()
      }));
    } finally {
      setLoading(false);
    }
  };

  const logSecurityEvent = async (eventType: string, details: any) => {
    try {
      await supabase.from('security_audit_log').insert({
        action: eventType,
        resource_type: 'security_event',
        details: {
          ...details,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent
        }
      });
    } catch (error) {
      console.warn('Failed to log security event:', error);
    }
  };

  const enhanceSessionSecurity = async () => {
    try {
      // Refresh the session to ensure it's valid
      const { error } = await supabase.auth.refreshSession();
      
      if (error) {
        toast({
          title: "Session Error",
          description: "Please sign in again for security.",
          variant: "destructive"
        });
        await supabase.auth.signOut();
        return false;
      }

      await logSecurityEvent('SESSION_ENHANCED', {
        action: 'session_refresh'
      });

      return true;
    } catch (error) {
      console.error('Session enhancement failed:', error);
      return false;
    }
  };

  useEffect(() => {
    checkSecurityStatus();
    
    // Check security status every 10 minutes
    const interval = setInterval(checkSecurityStatus, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    securityStatus,
    loading,
    checkSecurityStatus,
    logSecurityEvent,
    enhanceSessionSecurity
  };
}