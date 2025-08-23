import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface SessionSecurityManagerProps {
  maxSessionAge?: number; // in minutes
  idleTimeout?: number; // in minutes
  enableFingerprinting?: boolean;
  maxConcurrentSessions?: number;
  enableGeolocationCheck?: boolean;
}

export function SessionSecurityManager({ 
  maxSessionAge = 1440, // 24 hours
  idleTimeout = 120, // 2 hours
  enableFingerprinting = true
}: SessionSecurityManagerProps) {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Generate device fingerprint for security monitoring
  const generateFingerprint = useCallback(() => {
    if (!enableFingerprinting) return null;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);
    }
    
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvasFingerprint: canvas.toDataURL().slice(-20),
      cookiesEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack
    };
  }, [enableFingerprinting]);

  // Check session validity and age
  const validateSession = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return true; // No session to validate
      
      const sessionAge = Date.now() - new Date(session.user.created_at).getTime();
      const maxAge = maxSessionAge * 60 * 1000; // Convert to milliseconds
      
      if (sessionAge > maxAge) {
        console.warn('Session exceeded maximum age, forcing refresh');
        
        await supabase.from('security_audit_log').insert({
          action: 'SESSION_AGE_EXCEEDED',
          resource_type: 'session_security',
          details: {
            session_age_minutes: Math.floor(sessionAge / 60000),
            max_age_minutes: maxSessionAge,
            timestamp: new Date().toISOString()
          }
        });

        // Force session refresh
        const { error } = await supabase.auth.refreshSession();
        if (error) {
          console.error('Failed to refresh session:', error);
          await supabase.auth.signOut();
          navigate('/auth');
          
          toast({
            title: "Session Expired",
            description: "Your session has expired. Please log in again.",
            variant: "destructive"
          });
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Session validation failed:', error);
      return false;
    }
  }, [maxSessionAge, navigate, toast]);

  // Monitor user activity for idle timeout
  const setupIdleMonitoring = useCallback(() => {
    let idleTimer: NodeJS.Timeout;
    let lastActivity = Date.now();
    
    const resetIdleTimer = () => {
      lastActivity = Date.now();
      clearTimeout(idleTimer);
      
      idleTimer = setTimeout(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.warn('Session idle timeout reached');
          
          await supabase.from('security_audit_log').insert({
            action: 'SESSION_IDLE_TIMEOUT',
            resource_type: 'session_security',
            details: {
              idle_minutes: idleTimeout,
              last_activity: new Date(lastActivity).toISOString(),
              timestamp: new Date().toISOString()
            }
          });

          await supabase.auth.signOut();
          navigate('/auth');
          
          toast({
            title: "Session Timeout",
            description: "You've been logged out due to inactivity.",
            variant: "default"
          });
        }
      }, idleTimeout * 60 * 1000);
    };

    // Activity event listeners
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    activityEvents.forEach(event => {
      document.addEventListener(event, resetIdleTimer, { passive: true });
    });

    // Initialize timer
    resetIdleTimer();

    return () => {
      clearTimeout(idleTimer);
      activityEvents.forEach(event => {
        document.removeEventListener(event, resetIdleTimer);
      });
    };
  }, [idleTimeout, navigate, toast]);

  // Monitor for suspicious session activity
  const monitorSessionSecurity = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return;

      const currentFingerprint = generateFingerprint();
      const fingerprintKey = `fingerprint_${session.user.id}`;
      
      // Check stored fingerprint
      const { data: storedData } = await supabase
        .from('user_secure_data')
        .select('data_value')
        .eq('data_key', fingerprintKey)
        .single();

      if (storedData?.data_value) {
        const storedFingerprint = storedData.data_value as any;
        
        // Compare critical fingerprint elements
        const suspiciousChanges = [];
        
        if (currentFingerprint?.userAgent !== storedFingerprint?.userAgent) {
          suspiciousChanges.push('user_agent');
        }
        
        if (currentFingerprint?.platform !== storedFingerprint?.platform) {
          suspiciousChanges.push('platform');
        }
        
        if (currentFingerprint?.screenResolution !== storedFingerprint?.screenResolution) {
          suspiciousChanges.push('screen_resolution');
        }

        if (suspiciousChanges.length > 0) {
          console.warn('Suspicious session changes detected:', suspiciousChanges);
          
          await supabase.from('security_audit_log').insert({
            action: 'SUSPICIOUS_SESSION_CHANGES',
            resource_type: 'session_security',
            details: {
              changes: suspiciousChanges,
              current_fingerprint: currentFingerprint,
              stored_fingerprint: storedFingerprint,
              timestamp: new Date().toISOString()
            }
          });

          toast({
            title: "Security Alert",
            description: "Unusual session activity detected. Please verify your account security.",
            variant: "destructive"
          });
        }
      } else if (currentFingerprint) {
        // Store initial fingerprint
        await supabase
          .from('user_secure_data')
          .insert({
            user_id: session.user.id,
            data_key: fingerprintKey,
            data_value: currentFingerprint
          });
      }
    } catch (error) {
      console.error('Session security monitoring failed:', error);
    }
  }, [generateFingerprint, toast]);

  // Check for concurrent sessions (basic detection)
  const detectConcurrentSessions = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const sessionKey = `active_session_${session.user.id}`;
      const currentSessionId = session.access_token.slice(-20); // Use part of token as session ID
      
      const { data: activeSession } = await supabase
        .from('user_secure_data')
        .select('data_value')
        .eq('data_key', sessionKey)
        .single();

      if (activeSession?.data_value && activeSession.data_value !== currentSessionId) {
        console.warn('Concurrent session detected');
        
        await supabase.from('security_audit_log').insert({
          action: 'CONCURRENT_SESSION_DETECTED',
          resource_type: 'session_security',
          details: {
            current_session_id: currentSessionId,
            stored_session_id: activeSession.data_value,
            timestamp: new Date().toISOString()
          }
        });

        toast({
          title: "Multiple Sessions Detected",
          description: "Your account is being used in another location. For security, please change your password.",
          variant: "destructive"
        });
      } else {
        // Update current session
        await supabase
          .from('user_secure_data')
          .upsert({
            user_id: session.user.id,
            data_key: sessionKey,
            data_value: currentSessionId
          });
      }
    } catch (error) {
      console.error('Concurrent session detection failed:', error);
    }
  }, [toast]);

  useEffect(() => {
    // Set up all security monitoring
    const cleanupIdle = setupIdleMonitoring();
    
    // Initial checks
    validateSession();
    monitorSessionSecurity();
    detectConcurrentSessions();
    
    // Periodic security checks
    const securityInterval = setInterval(() => {
      validateSession();
      monitorSessionSecurity();
      detectConcurrentSessions();
    }, 5 * 60 * 1000); // Every 5 minutes
    
    return () => {
      cleanupIdle();
      clearInterval(securityInterval);
    };
  }, [validateSession, monitorSessionSecurity, detectConcurrentSessions, setupIdleMonitoring]);

  return null; // This is a utility component with no visual output
}