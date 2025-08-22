import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function SecurityMiddleware() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Enhanced session validation
    const validateSession = async () => {
      try {
        const { data: sessionValidation } = await supabase.rpc('validate_session_security');
        const validation = sessionValidation as any;
        
        if (!validation?.valid) {
          console.warn('Session validation failed:', validation?.reason);
          
          if (validation?.reason === 'Session too old, refresh required') {
            // Attempt to refresh the session
            const { error } = await supabase.auth.refreshSession();
            if (error) {
              toast({
                title: "Session Expired",
                description: "Please sign in again for security.",
                variant: "destructive",
              });
              await supabase.auth.signOut();
              navigate('/auth');
            }
          } else if (validation?.reason === 'User profile not found') {
            toast({
              title: "Profile Error",
              description: "Please contact support if this persists.",
              variant: "destructive",
            });
            await supabase.auth.signOut();
            navigate('/auth');
          }
        } else if (validation?.requires_setup) {
          // Handle users without company association - redirect to setup
          navigate('/setup');
        }
      } catch (error) {
        console.error('Session validation error:', error);
      }
    };

    // Security monitoring
    const monitorSecurityEvents = () => {
      // Monitor for suspicious browser behavior
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        const response = await originalFetch(...args);
        
        // Log potential security issues
        if (!response.ok && response.status === 401) {
          await supabase.from('security_audit_log').insert({
            action: 'UNAUTHORIZED_REQUEST',
            resource_type: 'api_request',
            details: {
              url: typeof args[0] === 'string' ? args[0] : args[0]?.toString(),
              status: response.status,
              timestamp: new Date().toISOString(),
              user_agent: navigator.userAgent,
              referrer: document.referrer || 'direct'
            }
          });
        }
        
        // Log suspicious repeated failures
        if (!response.ok && response.status >= 400) {
          const failureKey = `failures_${typeof args[0] === 'string' ? args[0] : 'unknown'}`;
          const currentFailures = parseInt(sessionStorage.getItem(failureKey) || '0');
          if (currentFailures > 5) {
            await supabase.from('security_audit_log').insert({
              action: 'REPEATED_API_FAILURES',
              resource_type: 'api_security',
              details: {
                url: typeof args[0] === 'string' ? args[0] : args[0]?.toString(),
                failure_count: currentFailures,
                timestamp: new Date().toISOString()
              }
            });
          }
          sessionStorage.setItem(failureKey, (currentFailures + 1).toString());
        }
        
        return response;
      };

      // Monitor console access (potential debugging attempts)
      const originalLog = console.log;
      console.log = (...args) => {
        // Log suspicious console usage in production
        if (process.env.NODE_ENV === 'production' && args.some(arg => 
          typeof arg === 'string' && 
          (arg.includes('token') || arg.includes('password') || arg.includes('secret'))
        )) {
          supabase.from('security_audit_log').insert({
            action: 'SUSPICIOUS_CONSOLE_ACCESS',
            resource_type: 'browser_security',
            details: {
              type: 'console_logging',
              timestamp: new Date().toISOString()
            }
          });
        }
        originalLog(...args);
      };
    };

    validateSession();
    monitorSecurityEvents();

    // Set up periodic validation
    const interval = setInterval(validateSession, 5 * 60 * 1000); // Every 5 minutes

    return () => {
      clearInterval(interval);
    };
  }, [navigate, toast]);

  return null;
}